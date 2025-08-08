import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

// Use useRef to avoid multiple connections
const socket = io.connect("http://localhost:4000");

export default function SocketComponent() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]); // Array to store chat messages
  const [userId, setUserId] = useState(12);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    const myMessage = {
      text: message,
      sender: socket.id || "Me",
    };
    socket.emit("send_message", myMessage);
    setMessages((prev) => [...prev, myMessage]); // Add your own message to the list
    setMessage("");
  };

  useEffect(() => {
    socket.on("received_message", (data) => {
      setMessages((prev) => [...prev, data]); // Push new message to array
    });

    // Optional: clean up listener on unmount
    socket.emit("join_room", userId);
    return () => {
      socket.off("received_message");
    };
  }, [userId]);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Socket.IO Chat</h1>

      <div
        style={{
          marginBottom: "1rem",
          border: "1px solid #ccc",
          padding: "1rem",
          minHeight: "100px",
        }}
      >
        {messages.map((msg, idx) => (
          <div key={idx}>
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
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
