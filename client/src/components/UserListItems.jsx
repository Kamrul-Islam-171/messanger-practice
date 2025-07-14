import React from 'react';

const UserListItems = ({user, handleFunction}) => {
     
    
  
    return (
        <div onClick={handleFunction} className=' bg-gray-200 p-2 cursor-pointer hover:bg-indigo-400 hover:text-white mt-1 text-xl'>
            {user.name} 
        </div>
    );
};

export default UserListItems;