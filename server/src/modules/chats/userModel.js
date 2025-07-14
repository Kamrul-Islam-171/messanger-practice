import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required:true
    },
    email: {
      type: String,
      required:true,
      unique:true
    },
    password: {
     type: String,
      required:true
    },
    picture: {
      type: String,
      required:true,
      default: "https://res.cloudinary.com/dtp5fwvg9/image/upload/v1745511831/fwmucci9gsvqpnh8mhya.avif"
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", userSchema);
