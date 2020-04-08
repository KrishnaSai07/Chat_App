const generateMessages = (username,text) =>{
    return {
        user:username,
        text:text,
        createdAt: new Date().getTime()
    }
};
// this is beig used to make a time stamp to new message entered
const generateWelcomeMessage = (text) =>{
    return {
        text:text,
        createdAt: new Date().getTime() 
    }
}

module.exports = {generateMessages,generateWelcomeMessage};
