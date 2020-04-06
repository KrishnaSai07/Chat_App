const users =[];

const addUsers = (user) =>{

    username = user.username.trim().toLowerCase();
    room = user.room.trim().toLowerCase();

    if(!username || !room)
    {
        return {
            error:'Username and Room required'
        }
    }

    const validateUser = users.find((user) =>{
        return user.username === username && user.room === room
    });
    console.log(validateUser);

    if(!validateUser)
    {
        console.log('Hits');
        let newUser = {
            id:user.id,
            username:username,
            room:room
        }
        console.log(newUser);
        users.push(newUser);
        return {user:newUser};
    }
    else
    {
        return {
            error: 'This username in use already'
        }
    }



}

const removeUser = (id) =>{
     const index = users.findIndex((user)=>{
         return user.id === id
     })
     if(index != -1)
     {
         return users.splice(index,1)[0]
     }

}

const getUser = (id) =>{
    const foundUser = users.find((user) =>{
        return user.id === id
    });
    if(!foundUser)
    {
        return {
            error:'User not found'
        }
    }
    else
    {
        return {
            user:foundUser};
    }
}

const getAllUser = (room) =>{
    return users.filter((user)=> user.room === room
    );
}

module.exports = {
    addUsers,removeUser,getUser,getAllUser
}