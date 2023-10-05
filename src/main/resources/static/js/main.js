const loginForm = document.querySelector("#login-container");
const chatContainer = document.querySelector("#chat-page-container");
const userNameForm = document.querySelector("#user-login-form");
const messageForm = document.querySelector("#message-form");
const messageInput = document.querySelector("#message");
const messageArea = document.querySelector("#messages");
const connectingMessage = document.querySelector(".loading-chat");

let stompClient;
let username = "";

const colors = [
    '#2196F3', '#32c787', '#00BCD4', '#ff5652',
    '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
];

const getAvatarColor = (messageSender) => {
    let hash = 0;
    for (let i = 0; i < messageSender.length; i++) {
        hash = 31 * hash + messageSender.charCodeAt(i);
    }
    const index = Math.abs(hash % colors.length);
    return colors[index];
}

const onMessageReceive = (payload) => {
    const message = JSON.parse(payload.body);

    const messageElement = document.createElement('li');

    if(message.type === 'JOIN') {
        messageElement.classList.add('event-message');
        message.content = message.sender + ' has joined!';
    } else if (message.type === 'LEAVE') {
        messageElement.classList.add('event-message');
        message.content = message.sender + ' has left the chat!';
    } else {
        messageElement.classList.add('chat-message');

        const avatarElement = document.createElement('i');
        const avatarText = document.createTextNode(message.sender[0]);
        avatarElement.appendChild(avatarText);
        avatarElement.style['background-color'] = getAvatarColor(message.sender);

        messageElement.appendChild(avatarElement);

        const usernameElement = document.createElement('span');
        const usernameText = document.createTextNode(`${message.sender}:`);
        usernameElement.appendChild(usernameText);
        messageElement.appendChild(usernameElement);
    }

    const textElement = document.createElement('p');
    const messageText = document.createTextNode(message.content);
    textElement.appendChild(messageText);

    messageElement.appendChild(textElement);

    messageArea.appendChild(messageElement);
    messageArea.scrollTop = messageArea.scrollHeight;
}

const onError = (error) => {
    connectingMessage.textContent = "Could not be possible to get a WebSocket connection from server. Please refresh the page";
    connectingMessage.style.color = "red";
}

const onConnect = () => {
    stompClient.subscribe("/topic/public", onMessageReceive);
    stompClient.send("/app/chat.addUser", {}, JSON.stringify({
        sender: username, type: 'JOIN'
    }));
    connectingMessage.classList.add("hidden");
}

const connect = (event) => {
    event.preventDefault();
    username = document.querySelector("#name").value.trim();
    if (username) {
        loginForm.style.display = "none";
        chatContainer.style.display = "flex";

        const socket = new SockJS("/ws");
        stompClient = Stomp.over(socket);

        stompClient.connect({}, onConnect, onError)
    }
}

const sendMessage = (event) => {
    event.preventDefault();
    const messageContent = messageInput.value.trim();
    if(messageContent && stompClient) {
        const chatMessage = {
            sender: username,
            content: messageContent,
            type: "CHAT"
        };
        stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
        messageInput.value = "";
    }
}

userNameForm.addEventListener('submit', connect, true);
messageForm.addEventListener('submit', sendMessage, true)