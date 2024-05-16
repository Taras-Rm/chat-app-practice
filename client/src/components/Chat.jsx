import React from "react";
import s from "./Chat.module.css";
import Message from "./Message";

function Chat() {
  return (
    <div className={s.chat}>
      <div className={s.top}>
        <div className={s.onlineUsers}>2 users online</div>
        <div>tom bob ricky</div>
      </div>
      <div className={s.messages}>
        <Message
          isOwn={false}
          messageText={"Some message"}
          username={"super"}
        />
        <Message
          isOwn={true}
          messageText={
            "Some message long Some message long Some message long Some message long Some message long Some message long Some message long"
          }
          username={"puper"}
        />
      </div>
      <div className={s.bottom}>
        <input className={s.messageInput} placeholder="Type a message..." />
        <button className={s.sendButton}>Send</button>
      </div>
    </div>
  );
}

export default Chat;
