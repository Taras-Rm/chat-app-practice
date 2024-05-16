import { useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("ws://localhost:3001", { autoConnect: false });

function App() {
  useEffect(() => {
    socket.connect();
  }, []);
  return <div>App</div>;
}

export default App;
