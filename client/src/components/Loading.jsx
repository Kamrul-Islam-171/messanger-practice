import React from 'react';
import {PuffLoader } from 'react-spinners'
const Loading = () => {
    return (
        <div className='flex justify-center items-center h-screen'>
            <PuffLoader  color="skyblue" />
        </div>
    );
};

export default Loading;