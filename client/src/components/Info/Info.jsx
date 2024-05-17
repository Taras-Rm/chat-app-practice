import React from "react";
import s from "./Info.module.css";

function Info({ infoText }) {
  return <div className={s.info}>{infoText}</div>;
}

export default Info;
