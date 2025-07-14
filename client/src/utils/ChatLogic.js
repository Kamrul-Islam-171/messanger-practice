
export const isSameSender = (messages, currentMessage, currentIndex, userId) => {

    // console.log(currentMessage)

    return (
        currentIndex < messages.length - 1 && // i < n 
        (
            messages[currentIndex + 1]?.sender?._id !== currentMessage.sender?._id // if the next msg not equl to current sender
            || 
            messages[currentIndex + 1]?.sender?._id === undefined // next message undifined ki na
        ) && 
        messages[currentIndex]?.sender?._id !== userId // means from the other user
    )
}

export const isLastMessage = (messages, i, userId) => {
    return (
        i < messages.length - 1 && // i < n
        messages[messages.length - 1]?.sender?._id !== userId &&  // next msg tao ki same user pathaiche ki na
        messages[messages.length - 1]?.sender?._id // msg exists

    )
}