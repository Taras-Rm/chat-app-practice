import { useEffect } from "react";
import { io } from "socket.io-client";
import Chat from "./components/Chat";
import s from "./App.module.css";

const socket = io("ws://localhost:3001", { autoConnect: false });

function App() {
  useEffect(() => {
    socket.connect();
  }, []);

  return (
    <div className={s.app}>
      <Chat />
    </div>
  );
}

export default App;
