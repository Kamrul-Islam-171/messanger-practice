import { useState } from "react";
import { ChatState } from "../Context/ChatProvider.jsx";
import ChatBox from "./ChatBox.jsx";
import MyChats from "./MyChats.jsx";
import SideDeawer from "./SideDeawer.jsx";

const Chat = () => {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false)
  // console.log(user)

  return (
    <div>
      <div>{user && <SideDeawer></SideDeawer>}</div>
      <div className="flex gap-10">
        <div>{user && <MyChats fetchAgain={fetchAgain} ></MyChats>}</div>
        {/* <div>{user && <SideDeawer></SideDeawer>}</div> */}
        <div className="flex-1">
          {
            user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}></ChatBox>
          }
        </div>
      </div>
    </div>
  );
};

export default Chat;
