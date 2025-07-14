import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import { isLastMessage, isSameSender } from "../utils/ChatLogic";
import { ChatState } from "../Context/ChatProvider";
import Tooltip from "@mui/material/Tooltip";
import Avatar from "@mui/material/Avatar";

// npm react scrollable feed
const ScrolableChat = ({ messages }) => {
  const { user } = ChatState();
//   console.log(messages)
  
  return (
    <ScrollableFeed className="">
       
      {messages &&
        messages?.map((m, i) => 
          <div key={i} className={ `flex gap-3 ${m.sender?._id == user?._id ? ' justify-end' : ''}`}>
           {/* <div key={m._id} className={ `space-y-5  ${m.sender?._id == user._id ? ' ml-0' : 'ml-64'}`}> */}
           
          
            {(isSameSender(messages, m, i, user?._id) ||
              isLastMessage(messages, i, user?._id)) && (
              <Tooltip title={m.sender?.name}>
                <Avatar alt={m.sender?.name} src={m.sender?.picture} />
              </Tooltip>
            )}
            <span className={` mt-2 py-2 px-5  ${m.sender?._id == user?._id ? 'bg-red-500  ' : 'bg-green-500'} text-white `}>{
                m.content}
            </span>
          </div>
        )}
    </ScrollableFeed>
  );
};

export default ScrolableChat;
