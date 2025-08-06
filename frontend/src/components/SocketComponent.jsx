import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

// Use useRef to avoid multiple connections
const socketRef = io("http://localhost:4000");

export default function SocketComponent() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  useEffect(() => {
    socketRef.on("receive_message", (data) => {
      console.log("Message received from server:", data);
      setChat((prevChat) => [...prevChat, data]);
    });

    return () => {
      socketRef.off("receive_message");
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    socketRef.emit("send_message", {
      text: message,
      sender: socketRef.id || "anonymous",
    });
    setMessage("");
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Socket.IO Chat</h1>
      <div
        style={{
          border: "1px solid #ccc",
          padding: "1rem",
          height: "300px",
          overflowY: "auto",
          marginBottom: "1rem",
        }}
      >
        {chat.map((msg, index) => (
          <p key={index}>
            <strong>{msg.sender}:</strong> {msg.text}
          </p>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          placeholder="Type message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ padding: "0.5rem", width: "80%" }}
        />
        <button type="submit" style={{ padding: "0.5rem 1rem" }}>
          Send
        </button>
      </form>
    </div>
  );
}
