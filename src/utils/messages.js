const generateMessages = (username,text) =>{
    return {
        user:username,
        text:text,
        createdAt: new Date().getTime()
    }
};

const generateWelcomeMessage = (text) =>{
    return {
        text:text,
        createdAt: new Date().getTime()
    }
}

module.exports = {generateMessages,generateWelcomeMessage};
