import React, { useEffect, useState } from "react";

const GetSender = ({ loggedUser, users }) => {
    // one one chat er oppor person ta k ber korbo
  const [sender, setSender] = useState("");
  useEffect(() => {
    // console.log("user",users)
    users?.forEach((user) => {
      if (user?._id != loggedUser?._id && user) {
        setSender(user);
      }
    });
  }, []);
  // console.log("suender = ",sender)
  return <div className="">{sender.name}</div>;
};

export default GetSender;
