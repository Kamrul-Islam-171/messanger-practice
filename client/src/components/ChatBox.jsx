import React, { useEffect, useState } from "react";
import { ChatState } from "./../Context/ChatProvider";
import "./styles.css";
import GetSender from "../utils/getSender";
import AddGroupModal from "./AddGroupModal";
import Loading from "./Loading";
import Button from "@mui/material/Button";
import axios from "axios";
import ScrolableChat from "./ScrolableChat";
import io from 'socket.io-client'

const ENDPOINT="http://localhost:5000";
let socket, selectedChatCompare;

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat, user, setSelectedChat, notification, setNotification } = ChatState();

  //for single chat
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();

  const [socketConnected, setSocketConnected] = useState(false);

  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

    console.log("notification = ",notification)

  const fetchAllMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `${user.token}`,
        },
      };
      const res = await axios.get(
        `http://localhost:5000/api/message/${selectedChat._id}`,
        config
      );
      //   console.log(res.data.data);
      setMessages(res?.data?.data);
      socket.emit('join-room', selectedChat._id); // chat id dia room e  join korabo
    } catch (error) {
      console.log(error);
    }
  };

  const handleSendMessage = async (e) => {
    if (e.key == "Enter" && newMessage) {
      try {
        setLoading(true);
        socket.emit("stop-typing", selectedChat?._id)
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${user?.token}`,
          },
        };

        setNewMessage(""); // age ei ta empty hobe . but post hocche asyn so affect porbe na

        const res = await axios.post(
          "http://localhost:5000/api/message",
          {
            content: newMessage,
            chatId: selectedChat?._id,
          },
          config
        );
        // console.log("new ms = ", res.data);
        // now append the new message with previous message
        setMessages([...messages, res?.data]);

        socket.emit('new-message', res?.data);
        

        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }
  };
  const typingHandler = async (e) => {
    setNewMessage(e.target.value);


    //typing indicator logic

    //first check if the socket is connected or not
    if(!socketConnected) return

    if(!typing) {
      // ami key pres kortechi but state ta false. 
      setTyping(true);
      socket.emit("typing", selectedChat._id); // kon chat e dekhabo tar jonno
    }

    //user 3 sec dhore kono type ta korle typing stop korbo
    let lastTypingTime = new Date().getTime();
    setTimeout(() => {
      let timeNow = new Date().getTime();
      let dif = timeNow - lastTypingTime;
      if(dif >= 3000 && typing) {
        //stop typing animation
        socket.emit("stop-typing", selectedChat._id);
        setTyping(false);
      }
    }, 3000);
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit('setup', user);
    socket.on("connected", () => setSocketConnected(true))

    socket.on("typing", () => setIsTyping(true))
    socket.on("stop-typing", () => setIsTyping(false))
  }, [])

  useEffect(() => {
    fetchAllMessages();
    selectedChatCompare = selectedChat // for notification
  }, [loading, selectedChat]);

  useEffect(() => {

    socket.on('message-recieved', (newMessageReciedved) => {
      // selected chat r compare chat same na hoile notification dekhabo
      // console.log(newMessageReciedved.message)
      if(!selectedChatCompare || selectedChatCompare?._id !== newMessageReciedved?.message.chat?._id) {
        // give notification
        // server theke j chat id asbe. oi ta
        // jodi selected chat er same na hoy
        if(!notification.includes(newMessageReciedved?.message)) {
          setNotification([newMessageReciedved?.message, ...notification]);
        }
      }
      else {
        // selected chat er sathe add korbo
        setMessages([...messages, newMessageReciedved?.message])
      }
    })
  }, [])

  console.log(messages)
  return (
    <div className="w-full">
      {!selectedChat ? (
        <div className=" bg-purple flex items-center justify-center text-2xl text-white">
          <p className="rounded-xl">Click on a user to start chatting</p>
        </div>
      ) : (
        <div className="bg-purple">
          {selectedChat.isGroupChat ? (
            <div>
              <p className="text-3xl text-white">
                {selectedChat.chatName.toUpperCase()}
              </p>
              <AddGroupModal></AddGroupModal>
            </div>
          ) : (
            <div>
              <div className="text-3xl font-bold uppercase text-white text-center">
                <GetSender
                  users={selectedChat.users}
                  loggedUser={user}
                ></GetSender>
                {loading ? <Loading></Loading> : <div></div>}
              </div>
            </div>
          )}
          <div className="flex flex-col justify-between h-[85vh]">
            <div className=" m-5">
                {/* messages */}
              <ScrolableChat messages={messages}></ScrolableChat>
            </div>
            {/* onkeydown = enter press korle send hobe */}
            <div className="m-5">
              {isTyping && <div className="bg-orange-500 p-4">Loading..</div>}
              <input
                onKeyDown={handleSendMessage}
                value={newMessage}
                onChange={typingHandler}
                className="w-full border-2 p-4 mb-5"
                type="text"
                placeholder="type your message..."
              />
              {/* <Button type="submit" variant="contained">
                send
              </Button> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBox;
