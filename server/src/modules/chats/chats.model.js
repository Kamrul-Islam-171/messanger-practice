
import mongoose from 'mongoose';
const { Schema } = mongoose;
// chatName
// isGroupChat
// users
// latestMessage
// groupAdmin

const chatSchema = new Schema({
    chatName : {
        type: String,
        trim:true
    },
    isGroupChat : {
        type: Boolean, 
        default: false
    },
    users: [
        {
            type : Schema.Types.ObjectId,
            ref:"User",
        }
    ],
    latestMessages : {
        type: Schema.Types.ObjectId,
        ref: "Message"
    },
    groupAdmin: {
        type : Schema.Types.ObjectId,
        ref: "User"
    }
}, {
    timestamps: true
})

export const Chat = mongoose.model("Chat", chatSchema);