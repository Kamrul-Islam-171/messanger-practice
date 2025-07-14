import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import CloseIcon from "@mui/icons-material/Close";
import Input from "@mui/material/Input";
import axios from "axios";
import UserListItems from "./UserListItems";

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
const AddGroupModal = () => {
  const [open, setOpen] = useState(false);

  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const { selectedChat, setSelectedChat, user } = ChatState();

  const handleOpen = () => setOpen(true);
  const hendleSelectedUserDelete = (user) => {
    console.log("i am = ", user);
    //   setSelectedChat(selectedChat.users.filter(item => item._id !== user._id))
    console.log(selectedChat.users.filter((item) => item._id !== user._id));
  };

  // console.log(selectedChat)

  const handleClose = () => setOpen(false);

  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id) {
      return alert("only admin can remove");
    }
    try {
      setLoading(true);
      console.log(user.token);

      const config = {
        headers: {
          Authorization: `${user.token}`,
        },
        data: {
          userId: user1._id,
          chatId: selectedChat._id,
        },
      };
      console.log(config);
      const result = await axios.delete(
        "http://localhost:5000/api/chat/removeFromGroup",

        config
      );
      console.log("res = ", result.data);
      setSelectedChat(result.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  const handleLeaveGroup = async (user1) => {
    try {
      setLoading(true);
      // console.log(user.token);

      const config = {
        headers: {
          Authorization: `${user.token}`,
        },
        data: {
          userId: user1._id,
          chatId: selectedChat._id,
        },
      };
      // console.log(config);
      await axios.delete(
        "http://localhost:5000/api/chat/removeFromGroup",

        config
      );
      // console.log("res = ", result.data);
      setSelectedChat(); // leave nile chat theke data o remove korte hobe. karon se r oi chat dekhbe na
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGroupName = async (e) => {
    e.preventDefault();
    if (!groupChatName) {
      return alert("Plsase fill all the fields");
    }
    try {
      const config = {
        headers: {
          Authorization: `${user.token}`,
        },
      };
      const res = await axios.patch(
        "http://localhost:5000/api/chat/rename",
        { chatName: groupChatName, chatId: selectedChat._id },
        config
      );
      console.log(res.data);
      // setChats([res?.data, ...chats])
      // handleClose();
      setSelectedChat(res.data); // update the chat
      alert("group name updated");
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddGroup = async (user1) => {
    console.log(user1._id);
    // console.log("admin = ", user._id);
    // console.log("req = ", selectedChat?.groupAdmin._id);
    if (selectedChat?.users.find((u) => u._id === user1._id)) {
      return alert("already a member");
    }

    if (selectedChat?.groupAdmin._id !== user._id) {
      return alert("You are not admin!");
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `${user.token}`,
        },
      };
      const result = await axios.patch(
        `http://localhost:5000/api/chat/addToGroup`,
        { userId: user1._id, chatId: selectedChat._id },
        config
      );
      // console.log("res = ",result.data);
      setSelectedChat(result.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

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
      console.log(result.data);
      setSearchResult(result.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <Button variant="contained" onClick={handleOpen}>
        Group Setting
      </Button>
      <Modal
        open={open}
        // onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h3" component="h2">
            {selectedChat.chatName}
          </Typography>

          <div className="flex gap-2">
            {selectedChat.users?.map((user) => (
              <div className="p-1 bg-purple-500 text-white" key={user._id}>
                {user.name}
                <CloseIcon
                  className="ml-2 cursor-pointer"
                  onClick={() => handleRemove(user)}
                ></CloseIcon>
              </div>
            ))}
          </div>
          <div>
            <form onSubmit={handleGroupName} className="flex gap-3 my-3">
              <Input
                onChange={(e) => setGroupChatName(e.target.value)}
                value={groupChatName}
                placeholder="rename group"
                className="w-full"
              ></Input>
              <Button type="submit" variant="contained">
                Update
              </Button>
            </form>
          </div>
          <div className="my-4">
            <form onSubmit={handleGroupName} className="flex gap-3 my-3">
              <Input
                onChange={(e) => handleSearch(e.target.value)}
                placeholder=" add member"
                className="w-full"
              ></Input>
            </form>
          </div>
          <div>
            {loading ? (
              <p className="text-xl text-pink-600">Loading...</p>
            ) : (
              <div className="transition-all duration-300">
                {searchResult?.slice(0.4).map((item) => (
                  <UserListItems
                    key={item._id}
                    user={item}
                    handleFunction={() => handleAddGroup(item)}
                  ></UserListItems>
                ))}
              </div>
            )}
          </div>
          <Button
            className="w-full"
            onClick={() => handleLeaveGroup(user)}
            variant="contained"
            color="secondary"
          >
            Leave Group
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default AddGroupModal;
