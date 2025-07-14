import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import { useState } from "react";
import NotificationsIcon from '@mui/icons-material/Notifications';
import { ChatState } from "../Context/ChatProvider";
import  axios  from 'axios';
import Loading from "./Loading";
import ChatSearch from "./ChatSearch";
const SideDeawer = () => {
  const [open, setOpen] = useState(false);

  const {user, chats, setChats, setSelectedChat} = ChatState();

  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  // console.log(user.token)
  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };
  const handleSearch = async() => {
    // console.log(search);
    if(!search) {
      return alert("Please enter a name")
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization : `${user.token}`
        }
      }
      const result = await axios.get(`http://localhost:5000/api/user?search=${search}`, config);
      setSearchResult(result.data);
      // console.log(result.data);
      setLoading(false);
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  const DrawerList = (
    <Box sx={{ width: 350 }} role="presentation" 
    // onClick={toggleDrawer(false)}
    >
      <List className="flex items-center">
        <input value={search} onChange={(e) => setSearch(e.target.value)} type="text" className="m-2 px-5 py-2 border-1 border-blue-300 outline-0" />
        <Button onClick={handleSearch} variant="contained" size="large">Go</Button>
      </List>
      <Divider />
      <List>
        {
          loading ? <Loading></Loading> : <ChatSearch setOpen={setOpen} users = {searchResult}></ChatSearch>
        }
      </List>
    </Box>
  );

  return (
    <div className="p-4 flex justify-between">
      <div>
        <Button
          onClick={toggleDrawer(true)}
          color="primary"
          variant="contained"
        >
          Search Users
        </Button>
        <Drawer open={open} onClose={toggleDrawer(false)}>
          {DrawerList}
        </Drawer>
      </div>
      <div>
        <NotificationsIcon></NotificationsIcon>
      </div>
    </div>
  );
};

export default SideDeawer;
