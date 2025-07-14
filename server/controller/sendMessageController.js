import { Chat } from "../src/modules/chats/chats.model.js";
import { Message } from "./../src/modules/chats/messageModel.js";

const sendMessage = async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data Pased into request");
    return res.status(400);
  }
  const newMessage = {
    sender: req.user.id,
    content,
    chat: chatId,
  };

  try {
    let message = await Message.create(newMessage);

    message = await Message.findById(message._id).populate([
      {
        path: "sender",
        select: "name picture",
      },
      {
        path: "chat",
        populate: {
          path: "users",
          select: "name picture email",
        },
      },
    ]);

    //akhon chat er latest message e ei ta update korte hobe
    await Chat.findOneAndUpdate(
      { _id: chatId },
      {
        latestMessages: message,
      }
    );
    res.json({
      message
    });
  } catch (error) {
    res.status(404);
    throw new Error(error.message);
  }
};

const allMessages = async(req, res) => {
    try {
    const messages = await Message.find({chat:req.params.chatId}).populate("sender", "name email picture").populate("chat");
    res.status(200).send({
      data : messages
    });
    // res.send({message:"hello"})
  } catch (error) {
    res.status(404);
    throw new Error(error.message);
  }
}

export const sendMessageController = {
  sendMessage,
  allMessages
};
