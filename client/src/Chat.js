// This file is where we're going to be sending and receiving messages from Socket.IO
// It's why we have to import our socket variable from the App.js file via props
import React, { useEffect, useState } from "react";
// Library used to have messages scroll as they come in to the chat box
import ScrollToBottom from "react-scroll-to-bottom";

// Props are utilized to pass down user information that will be utilized by the backend
function Chat({ socket, username, room }) {
  // This is to help keep track of whatever it is the user typed in
  const [currentMessage, setCurrentMessage] = useState("");

  const [messageList, setMessageList] = useState([]);

  // Function that's called everytime someone sends a message/presses the chat button
  // Is async because we wanna wait for it to update our array. It should be done before we do anything within this method
  const sendMessage = async () => {
    if (currentMessage !== "") {
      // The object that holds information like time of message, who wrote the message, room ID, etc that will be sent to the socket server to be displayed alongside message
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      // Where we emit our socket message to the server
      await socket.emit("send_message", messageData);
      // When we send a message, we wanna add that message as part of the message list/array
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  // This useEffect is called whenever a change in the socket server is detected
  useEffect(() => {
    // The callback function here decides what we wanna do when we receive the message
    socket.on("receive_message", (data) => {
      // The previous message "list" is grabbed and is spread out via the spread operator with the newest message being added to it
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Live Chat</p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {/* For every message in our messageList array, we return an h1 of it */}
          {messageList.map((messageContent) => {
            return (
              // If the person that sent a message is the same as the author of the message, then we give it the id of "you"
              // else it has an id of "other", this is used in the CSS to alter the side the message appears on alongside the color of the message bubble
              <div
                className="message"
                id={username === messageContent.author ? "you" : "other"}
              >
                <div>
                  <div className="message-content">
                    <p>{messageContent.message}</p>
                  </div>
                  <div className="message-meta">
                    <p id="time">{messageContent.time}</p>
                    <p id="author">{messageContent.author}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          // We have this here so we can access the message later on and set it blank again after each sent message
          value={currentMessage}
          placeholder="Howdy..."
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          // This makes it possible to have a user send a message by pressing "enter" as well as pressing the message button
          onKeyPress={(event) => {
            // If the key pressed is "Enter", then we call the sendMessage function
            event.key === "Enter" && sendMessage();
          }}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
}

export default Chat;
