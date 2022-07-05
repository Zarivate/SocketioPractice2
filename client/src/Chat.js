// This file is where we're going to be sending and receiving messages from Socket.IO
// It's why we have to import our socket variable from the App.js file via props
import React from "react";

function Chat(socket, username, room) {
  return (
    <div>
      <div className="chat-header">
        <p>Live Chat</p>
      </div>
      <div className="chat-body"></div>
      <div className="chat-footer">
        <input type="text" placeholder="Howdy..." />
        <button>&#9658;</button>
      </div>
    </div>
  );
}

export default Chat;
