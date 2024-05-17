import React from "react";
import s from "./Message.module.css";

function Message({ isOwn, username, messageText }) {
  return (
    <div className={`${s.message} ${isOwn && s.own}`}>
      <div className={s.avatarBox}>
        <div className={s.avatar} />
      </div>
      <div className={s.detailsBox}>
        <span className={s.username}>{username}</span>
        <div className={s.messageText}>{messageText}</div>
      </div>
    </div>
  );
}

export default Message;
