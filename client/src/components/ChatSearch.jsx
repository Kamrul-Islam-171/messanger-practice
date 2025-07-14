import Button from '@mui/material/Button';
import React from 'react';
import { ChatState } from '../Context/ChatProvider';
import axios from 'axios';

const ChatSearch = ({users, setOpen}) => {
    // console.log("usrs = ",users)

    const {user, chats, selected, setSelected, setChats, setSelectedChat} = ChatState();
    // console.log(selected)
    const accessChat = async(userId) => {
        try {
            
            const config = {
                headers: {
                    "Content-type":"application/json",
                    Authorization:`${user?.token}`
                }
            }

            const result = await axios.post(`http://localhost:5000/api/chat`, {userId}, config);
            // console.log(result.data)
            if(!chats.find(c => c._id === result.data._id)) {
                setChats([result.data, ...chats])
                // new chat k just append korbo
            }
            setSelectedChat(result?.data);
            setOpen(false)
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div className='p-5 space-y-5'>
            {
                users?.map((user) => <Button onClick={() => {accessChat(user._id)
                    
                }} className=' w-full flex gap-2 items-center' key={user._id}>

                    <img className='w-[40px] h-[40px]' src={user.picture} alt="" />
                    <p className='bg-gray-100 py-3 px-4 w-full'>{user?.name}</p>
                </Button>)
            }
        </div>
    );
};

export default ChatSearch;