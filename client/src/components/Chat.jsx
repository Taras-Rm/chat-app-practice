import React, { useEffect, useState } from "react";
import s from "./Chat.module.css";
import Message from "./Message";
import { io } from "socket.io-client";

const socket = io("ws://localhost:3001", { autoConnect: false });

function Chat() {
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const onMessage = (message) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { ...message, isOwn: socket.id === message.userId },
      ]);
    };

    socket.on("message", (message) => {
      onMessage(message);
    });

    return () => {
      socket.off("message", onMessage);
    };
  }, []);

  const onSendMessage = () => {
    socket.emit("sendMessage", messageText);
    setMessageText("");
  };

  return (
    <div className={s.chat}>
      <div className={s.top}>
        <div className={s.onlineUsers}>2 users online</div>
        <div>tom bob ricky</div>
      </div>
      <div className={s.messages}>
        {messages.map((message) => (
          <Message
            isOwn={message.isOwn}
            messageText={message.text}
            username={message.userId}
            key={`${message.text}${message.userId}`}
          />
        ))}
      </div>
      <div className={s.bottom}>
        <input
          className={s.messageInput}
          placeholder="Type a message..."
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
        />
        <button className={s.sendButton} onClick={onSendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;
