import React, { useEffect, useRef, useState } from "react";
import s from "./Chat.module.css";
import Message from "../Message/Message";
import { io } from "socket.io-client";
import Info from "../Info/Info";

const socket = io("ws://localhost:3001", { autoConnect: false });

function Chat() {
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState([]);
  const [connectedUsers, setConnectedUsers] = useState([]);

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
        { ...message, isOwn: socket.id === message.userId, type: "message" },
      ]);
    };

    const onConnectedUsers = (usersIds) => {
      setConnectedUsers(usersIds);
    };

    const onUserConnected = (userId) => {
      setConnectedUsers((prevUsers) => [...prevUsers, userId]);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: `user ${userId} connected`, type: "info" },
      ]);
    };

    const onUserDisconnected = (userId) => {
      setConnectedUsers((prevUsers) => prevUsers.filter((id) => id !== userId));
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: `user ${userId} disconnected`, type: "info" },
      ]);
    };

    const onConnectionError = (error) => {
      console.log("Connection error: ", error.message);
    };

    // listeners
    socket.on("message", (message) => {
      onMessage(message);
    });

    socket.on("connectedUsers", (usersIds) => {
      onConnectedUsers(usersIds);
    });

    socket.on("userConnected", (userId) => {
      onUserConnected(userId);
    });

    socket.on("userDisconnected", (userId) => {
      onUserDisconnected(userId);
    });

    socket.on("connect_error", (error) => {
      onConnectionError(error);
    });

    return () => {
      socket.off("message", onMessage);
      socket.off("connectedUsers", onConnectedUsers);
      socket.off("userConnected", onUserConnected);
      socket.off("userDisconnected", onUserDisconnected);
      socket.off("connect_error", onConnectionError);
    };
  }, []);

  const onSendMessage = () => {
    if (!messageText) {
      return;
    }
    socket.emit("sendMessage", messageText);
    setMessageText("");
  };

  const messagesBoxRef = useRef();

  useEffect(() => {
    // scroll to the bottom
    if (messagesBoxRef.current) {
      messagesBoxRef.current.scrollTop = messagesBoxRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className={s.chat}>
      <div className={s.top}>
        <div
          className={s.onlineUsers}
        >{`${connectedUsers.length} users online`}</div>
        <div className={s.onlineUsersList}>
          {connectedUsers.map((conUser) => (
            <span style={{ marginRight: 10 }} key={conUser}>
              {conUser}
            </span>
          ))}
        </div>
      </div>
      <div className={s.messages} ref={messagesBoxRef}>
        {messages.map((message) => {
          if (message.type === "info") {
            return (
              <Info
                key={`${message.text}${message.userId}`}
                infoText={message.text}
              />
            );
          }
          return (
            <Message
              isOwn={message.isOwn}
              messageText={message.text}
              username={message.userId}
              key={`${message.text}${message.userId}`}
            />
          );
        })}
      </div>
      <div className={s.bottom}>
        <input
          className={s.messageInput}
          placeholder="Type a message..."
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
        />
        <button
          className={s.sendButton}
          onClick={onSendMessage}
          disabled={!messageText}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;
