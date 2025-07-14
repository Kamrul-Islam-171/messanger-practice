import { Chat } from "../src/modules/chats/chats.model.js";
import { User } from "../src/modules/chats/userModel.js";

const accessChat = async (req, res) => {
  const { userId } = req.body; // j user k message ta pathabo. this is for one on one chat

  if (!userId) {
    console.log("user id is reqired!");
    res.status(400).send({
      message: "User id is required",
    });
  }

  // logged in user and jar sathe kotha bolbo take khuje ber korbo
  let isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user.id } } }, // logged in user
      { users: { $elemMatch: { $eq: userId } } },
    ], // both logged in user and jake send korbo se array te ache ki na
  })
    .populate("users", "-password")
    .populate("latestMessages");

  isChat = await User.populate(isChat, {
    path: "latestMessages.sender",
    select: "name picture email",
  });

  if (isChat.length > 0) {
    // console.log(isChat)
    res.send(isChat[0]);
  } else {
    const chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user.id, userId],
    };
    try {
      const createChat = await Chat.create(chatData);
      const fullChat = await Chat.findOne({ _id: createChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).send(fullChat);
    } catch (error) {
      console.log(error);
      res.status(400).send({
        message: "Try again",
      });
    }
  }
};

const fetchChats = async (req, res) => {
  try {
    // console.log(req.user.id)
    // kon kon chat gula te log in user ache oi gula find korbo
    let ressult = await Chat.find({
      users: { $elemMatch: { $eq: req.user.id } },
    })
      .populate("users", "-password")
      .populate("latestMessages")
      .populate("groupAdmin", "-password")
      .sort({ updatedAt: -1 });

    // Populate the sender details inside latestMessages
    ressult = await User.populate(ressult, {
      path: "latestMessages.sender",
      select: "name picture email",
    });

    //  we can do nested populate like this
    //     let result = await Chat.find({
    //   users: { $elemMatch: { $eq: req.user.id } },
    // })
    //   .populate("users", "-password")
    //   .populate("groupAdmin", "-password")
    //   .populate({
    //     path: "latestMessages",
    //     populate: {
    //       path: "sender",
    //       select: "name picture email",
    //     },
    //   })
    //   .sort({ updatedAt: -1 });

    res.send(ressult);
  } catch (error) {
    res.send({
      message: "No Data",
    });
    console.log(error);
  }
};

const createGroupChat = async (req, res) => {
  // req.body te multiple user id nibo + group name nibo
  const { users, groupName } = req.body;
  if (!users || !groupName) {
    res.status(400).send({
      message: "Please full all the fields",
    });
  }

  const parseUsers = JSON.parse(users); // front end theke array pathabo. sei ta json e convert korbo backend e
  if (users.length < 2) {
    res.status(400).send({
      message: "More than 2 user is needed",
    });
  }
  parseUsers.push(req.user.id); // logged in user o thakbe

  try {
    const groupChat = await Chat.create({
      chatName: groupName,
      users: parseUsers,
      isGroupChat: true,
      groupAdmin: req.user.id,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    res.status(200).send({
      message: "group chat is created",
      data: fullGroupChat,
    });
  } catch (error) {
    console.log(error);
  }
};

const renameGroupChat = async (req, res) => {
  const { chatId, chatName } = req.body;
  // console.log(req.body)
  const updatedChat = await Chat.findOneAndUpdate(
    { _id: chatId },
    { chatName },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(404).send({ message: "chat not found" });
  }

  res.status(200).send(updatedChat);
};

const addToGroup = async (req, res) => {
  // jake new add korbo group e
  const { chatId, userId } = req.body;

  const addtogroup = await Chat.findOneAndUpdate(
    { _id: chatId },
    { $push: { users: userId } }, //$push to add into array
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!addtogroup) {
    res.status(404).send({ message: "chat not found" });
  }

  res.status(200).send(addtogroup);
};

const removeFromGroup = async (req, res) => {
  // jake remove korbo group theke
  const { chatId, userId } = req.body;

  const addtogroup = await Chat.findOneAndUpdate(
    { _id: chatId },
    { $pull: { users: userId } }, // $pull for remove from array
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!addtogroup) {
    res.status(404).send({ message: "chat not found" });
  }

  res.status(200).send(addtogroup);
};


export const chatController = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroupChat,
  addToGroup,
  removeFromGroup
};
