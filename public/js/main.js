// calling message input
const chatform = document.getElementById('chat-form');
const chatMessgage = document.querySelector('.chat-messages');
const roomname = document.getElementById('room-name');
const userlist = document.getElementById('users');



// get username from url through query string library
const{username,room} = Qs.parse(location.search,{
    ignoreQueryPrefix:true
});


// calling sockect
const socket = io();

// join in chat room
socket.emit('joinroom',{username,room});

// get room and users
socket.on('roomusers',({room,users})=>{
    outputroomame(room);
    outputusers(users);
});


// calling  message from server
socket.on('message', message => {console.log(message);
    outputMessage(message);

    // scroll down when message sent
    chatMessgage.scrollTop=chatMessgage.scrollHeight;

});

// on sending message
chatform.addEventListener('submit',e => {
    e.preventDefault();
    // geting msg from input on type
    const msg = e.target.elements.msg.value;
    
    // sending message to server
    socket.emit('chatmessage',msg)

    // clear input after one messages sent
    e.target.elements.msg.value='';
    e.target.elements.msg.focus();

});

// message to dom
function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message')
    div.innerHTML=`<p class="meta">${message.username}<span>${message.time}</span></p><p class="text"> ${message.text}</p>`;
    document.querySelector('.chat-messages').appendChild(div)
}

// room name to dom
function outputroomame(room){
    roomname.innerText=room;
}

// user to dom
function outputusers(users){
   userlist.innerHTML=`${users.map(user=>`<li>${user.username}</li>` ).join('')}` ;
}