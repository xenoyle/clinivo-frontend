import React, { useEffect, useState, useRef } from "react";
import { connectWebSocket, sendMessageWS } from "../services/websocket";

export default function PatientMessages() {
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const [inputText, setInputText] = useState("");

  const chatRef = useRef(null);
  const conversationIdRef = useRef(null); // ⭐ NEW

  const currentUser = JSON.parse(localStorage.getItem("user"));

  if (!currentUser) {
    return <div>Please log in.</div>;
  }

  // Keep ref updated
  useEffect(() => {
    conversationIdRef.current = conversationId;
  }, [conversationId]);

  // Load patient's conversation
  useEffect(() => {
    const endpoint = `http://localhost:8080/api/conversations/patient/${currentUser.id}`;

    fetch(endpoint)
      .then((res) => res.json())
      .then((data) => {
        console.log("Patient conversations:", data);
        if (data && data.id) {
          setConversationId(data.id);
        }
      })
      .catch((err) => console.error("Conversation fetch error:", err));
  }, []);

  // Load messages when conversationId is ready
  useEffect(() => {
    if (!conversationId) return;

    console.log("Active conversation ID:", conversationId);

    fetch(`http://localhost:8080/api/messages/conversation/${conversationId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Loaded messages:", data);
        setMessages(data);
      })
      .catch((err) => console.error("Message fetch error:", err));
  }, [conversationId]);

  // Connect WebSocket ONCE
  useEffect(() => {
    connectWebSocket(currentUser.id, (msg) => {
      console.log("Patient WS received:", msg);

      if (msg.conversationId === conversationIdRef.current) {
        setMessages((prev) => [...prev, msg]);
      }
    });
  }, []); // IMPORTANT

  // Auto-scroll
  useEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    console.log("Patient sending to conversation:", conversationId);

    sendMessageWS(conversationId, currentUser.id, inputText);
    setInputText("");
  };

  return (
    <div className="container mt-4">
      <div className="card shadow-sm mx-auto" style={{ maxWidth: "600px" }}>
        <div className="card-header bg-primary text-white">
          Chat with Your Doctor
        </div>

        <div
          ref={chatRef}
          className="card-body bg-light"
          style={{
            height: "400px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {messages.map((m) => (
            <div
              key={m.id}
              className={
                m.senderId === currentUser.id
                  ? "align-self-end bg-primary text-white p-2 rounded mb-2 shadow-sm"
                  : "align-self-start bg-white p-2 rounded mb-2 shadow-sm"
              }
              style={{ maxWidth: "75%" }}
            >
              <p className="mb-0">{m.content}</p>
            </div>
          ))}
        </div>

        <div className="card-footer bg-white">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Type a message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button className="btn btn-primary" onClick={handleSend}>
              Send
            </button>
          </div>
        </div>
      </div>
      <div className="text-center mt-3">
        <Link to="/provider" className="text-muted small">Switch to Provider View (Demo Only)</Link>
      </div>
    </div>
  );
}
