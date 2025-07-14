import { createContext, useContext, useEffect, useState } from "react";


// Create Context
const ChatContext = createContext();

// Provider Component
const ChatProvider = ({ children }) => {
//   const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]); // populate all of currect chat 
  const [selected, setSelected] = useState('');
  const [notification, setNotification] = useState([])
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo)
  }, []);

  return (
    <ChatContext.Provider value={{ selected, setSelected, user, setUser, chats, setChats, selectedChat, setSelectedChat , notification, setNotification}}>
      {children}
    </ChatContext.Provider>
  );
};

// Custom Hook to use ChatContext
export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
