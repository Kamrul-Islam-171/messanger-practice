import { generateToken } from "../config/generateToken.js";
import { User } from "./../src/modules/chats/userModel.js";

const register = async (req, res) => {
  const { name, email, password, pic } = req.body;
  // console.log("reg data = ", req.body)
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please Enter all info");
  }

  const userExist = await User.findOne({ email });
  if (userExist) {
    res.status(400);
    throw new Error("user already exists");
  }

  const user = await User.create(req.body);
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Failed to create");
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  // console.log(req.body)

  const user = await User.findOne({ email });

  if (user && user.password === password) {
    res.json({
      success: "login success",
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Failed to login");
  }
};

const searchUser = async (req, res) => {
  const query = req.query;
//   console.log("user = ", req.user.id)
  const users = await User.find({
    $or: [
      { name: { $regex: query.search, $options: "i" } },
      { email: { $regex: query.search, $options: "i" } },
    ],
  }).find({ _id: { $ne: req.user.id } });

//    logged in user bad e bake matching user gula dibe
  //find({ _id: { $ne: req.user._id } })

  res.send(users)
};

export const userController = {
  login,
  register,
  searchUser,
};
