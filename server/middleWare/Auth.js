import jwt from "jsonwebtoken";
import { User } from "../src/modules/chats/userModel.js";

export const Auth = async (req, res, next) => {
  const token = req.headers.authorization;
  if(!token) {
     return res.status(401).send({
        message:"UnAuthorized!"
    })
  }

  // console.log("i am backend token = ", token)
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({_id:decoded.id});
    req.user = decoded;
    next();
    // console.log(user);
  } catch (error) {
    res.status(401).send({
        message:"UnAuthorized!"
    })
    console.log("my err = ",error);
  }
};
