import { useEffect, useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import axios from "axios";
import GetSender from "./../utils/getSender";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Input from "@mui/material/Input";
import UserListItems from "./UserListItems";
import Loading from "./Loading";
import CloseIcon from '@mui/icons-material/Close';
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const MyChats = ({fetchAgain}) => {
  const [loggedUser, setLoggedUser] = useState();
  const { user, chats, setChats, setSelectedChat, selected, setSelected, notification } =
    ChatState();

  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          // "Content-type":"application/json",
          Authorization: `${user?.token}`,
        },
      };

      const result = await axios.get(`http://localhost:5000/api/chat`, config);
      // console.log("hello =", result.data);
      // setSelected(result?.data[0]._id);
      setChats(result?.data);
    } catch (error) {
      console.log(error);
    }
  };

  // chat state e append korbo jokhon group crate korbo
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!groupChatName || !selectedUsers) {
        return alert("Plsase fill all the fields")
    }
    try {
        const config = {
        headers: {
          Authorization: `${user.token}`,
        },

      };
      const res = await axios.post('http://localhost:5000/api/chat/group', {groupName: groupChatName, users: JSON.stringify(selectedUsers.map(u => u._id))}, config);
      // console.log(res.data)
      setChats([res?.data, ...chats])
      handleClose();
      alert("group is crated")

    } catch (error) {
        console.log(error)
    }
  };

  // selected uses e add korar jonno
  const handleGroup = (user) => {
    // console.log(user)
    if(selectedUsers.includes(user)) {
        return alert("already added")
    }
    setSelectedUsers([...selectedUsers, user]);
  };

  const hendleSelectedUserDelete = (user) => {
    // console.log(user)
    setSelectedUsers(selectedUsers.filter(item => item._id !== user._id))
  }

  const handleSearch = async (value) => {
    if (!value) {
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `${user.token}`,
        },
      };
      const result = await axios.get(
        `http://localhost:5000/api/user?search=${value}`,
        config
      );
      // console.log(result.data);
      setSearchResult(result.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  //  console.log("id = ", selectedUsers)
  return (
    <div>
      <div className=" m-5">
        <Button variant="contained">{
          notification.length > 0? "1" : '0'
          }</Button>
        <Button
          className=""
          variant="contained"
          color="secondary"
          onClick={handleOpen}
        >
          Create Group
        </Button>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <Input
                onChange={(e) => setGroupChatName(e.target.value)}
                className="w-full"
                required
                placeholder="Enter group name"
              ></Input>
              <Input
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full"
                placeholder="Add member"
              ></Input>

              <div>
                {/* selected uses */}
                <div className="flex gap-4">
                    {
                    selectedUsers?.map(user => <div className="p-1 bg-purple-500 text-white" key={user._id}>
                        {user.name}
                        <CloseIcon className="ml-2 cursor-pointer" onClick={() => hendleSelectedUserDelete(user)}></CloseIcon>
                    </div>)
                }
                </div>
                {/* render searched users */}
                {loading ? (
                  <p className="text-xl text-pink-600">Loading...</p>
                ) : (
                  <div className="transition-all duration-300">
                    {searchResult?.slice(0.4).map((item) => (
                      <UserListItems
                        key={item._id}
                        user={item}
                        handleFunction={() => handleGroup(item)}
                      ></UserListItems>
                    ))}
                  </div>
                )}
              </div>
              <Button type="submit" variant="contained" className="w-full">
                Create Group
              </Button>
            </form>
          </Box>
        </Modal>
      </div>
      <div>
        {chats && (
          <div className=" p-5 space-y-5">
            {chats?.map((item) => (
              <div
                onClick={() => {setSelected(item._id)
                  setSelectedChat(item)
                }}
                className={`p-4 cursor-pointer  ${
                  selected === item._id
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
                key={item._id}
              >
                {/* <p>{item.users[1].name}</p> */}
                {!item.isGroupChat ? (
                  <div>
                    {/* // group chat na */}
                    <GetSender
                      loggedUser={loggedUser}
                      users={item.users}
                    ></GetSender>
                  </div>
                ) : (
                  <div>
                    <p>{item.chatName}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyChats;
