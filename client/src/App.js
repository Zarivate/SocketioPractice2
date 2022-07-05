import "./App.css";
import { useState } from "react";
import io from "socket.io-client";
import Chat from "./Chat";

// The link here is to the url of where we're running the socketio server
const socket = io.connect("http://localhost:3001");

function App() {
  // The state will be a string
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");

  // Will be used to establish a connection between a user that has just logged in and the socketio room they want to enter
  const joinRoom = () => {
    if (username !== "" && room !== "") {
      // The "room" here is the "data" that is passed to our index.js file in the "join_room" socket event
      socket.emit("join_room", room);
    }
  };

  return (
    <div className="App">
      <h3>Join a Chat</h3>
      <input
        type="text"
        placeholder="Quandale..."
        onChange={(event) => {
          setUsername(event.target.value);
        }}
      />
      <input
        type="text"
        placeholder="RoomID..."
        onChange={(event) => {
          setRoom(event.target.value);
        }}
      />
      <button onClick={joinRoom}>Join Room</button>

      <Chat socket={socket} username={username} room={room} />
    </div>
  );
}

export default App;
