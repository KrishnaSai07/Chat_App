const socket = io();


//elements
const $formElement = document.querySelector('#message_form');
const $inputElement = document.querySelector('input');
const $buttonElement = document.querySelector('#send-message');
const $sendLocationElement = document.querySelector('#send-location');


const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationTemplate = document.querySelector('#location-template').innerHTML;
const sidebarUsers = document.querySelector('#sidebar-users').innerHTML;

const $message = document.querySelector('#messages');
const $userList = document.querySelector('#userList');



const {username,room} = Qs.parse(location.search,{ignoreQueryPrefix: true});


// document.querySelector('#increment').addEventListener('click',()=>{
//     socket.emit('increment');
// })

// socket.on('countUpdated',(count)=>{
//     console.log('The count is updated',count);
// })

$formElement.addEventListener('submit',(e)=>{
    e.preventDefault();
const message = e.target.elements.message.value;
$buttonElement.setAttribute('disabled','disabled');
socket.emit('sendMessage',message,(error)=>{
    if(!error)
    {
    $inputElement.value = '';
    $buttonElement.removeAttribute('disabled','disabled');
    $inputElement.focus();
    }
    else
    {
        alert(error);
    }
});
});

$sendLocationElement.addEventListener('click',()=>{
    if(!navigator.geolocation)
    {
        return alert('Error:');
    }
    else{
        navigator.geolocation.getCurrentPosition((position)=>{
            const location={};
            location.longitude = position.coords.longitude;
            location.latitude = position.coords.latitude;
            $sendLocationElement.setAttribute('disabled','disabled');

            socket.emit('sendLocation',location,()=>{
                    $sendLocationElement.removeAttribute('disabled');
            });
        })
    }
})

socket.on('message',(data)=>{
    // console.log(message);
    const html = Mustache.render(messageTemplate,
        {
            user: data.user,
            message:data.text,
            createdAt: moment(data.createdAt).format('h:mma')
        });
        $message.insertAdjacentHTML('beforeend',html);

})


socket.on('locationMessage',(data)=>{
    // console.log(message);
    const html = Mustache.render(locationTemplate,{
        user: data.user,
        url:data.text,
        createdAt: moment(data.createdAt).format('h:mma')
    });
    $message.insertAdjacentHTML('beforeend',html);
})

socket.on('showUsers',(data) => {
    console.log("Data",data);
    const html = Mustache.render(sidebarUsers,{
        room: data.room,
        users:data.usersAll
    });
    $userList.insertAdjacentHTML('beforeend',html);

});

socket.emit('join',{username,room},(error) =>{
   if(error)
   {
       alert(error);
   }
//    socket.emit('joinedUsers',room);
});
