import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import "./Chatbot.css";

export default function Chatbot({ onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const socketRef = useRef(null);
  const chatboxRef = useRef(null);

  useEffect(() => {
    const socket = io("https://mybackend-uk1u.onrender.com/chatbot");
    socketRef.current = socket;

    let currentBotMessage = "";

    socket.on("botStart", () => {
      currentBotMessage = "";
      setIsStreaming(true);
      setMessages((prev) => [...prev, { sender: "bot", message: "" }]);
    });

    socket.on("botStream", (token) => {
      currentBotMessage += token;
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          sender: "bot",
          message: currentBotMessage,
        };
        return updated;
      });
    });

    socket.on("botEnd", () => {
      currentBotMessage = "";
      setIsStreaming(false);
    });

    return () => {
      socket.off("botStart");
      socket.off("botStream");
      socket.off("botEnd");
      socket.disconnect();
    };
  }, []);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    if (chatboxRef.current) {
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim() || isStreaming) return;

    setMessages((prev) => [...prev, { sender: "user", message: input }]);
    socketRef.current.emit("userMessage", input);
    setInput("");
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <span>💬 Chat Assistant</span>
        <button onClick={onClose} aria-label="Close Chatbot">
          &times;
        </button>
      </div>
      <div className="chatbox" ref={chatboxRef}>
        {messages.length === 0 && (
          <div className="chatbot-welcome">
            <p>👋 Hi! How can I help you today?</p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`msg ${m.sender}`}>
            {m.message}
          </div>
        ))}
      </div>

      <div className="inputBox">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
          disabled={isStreaming}
        />
        <button onClick={sendMessage} disabled={isStreaming}>
          {isStreaming ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}
