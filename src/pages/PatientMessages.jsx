import React, { useEffect, useState, useRef } from "react";
import { connectWebSocket, sendMessageWS } from "../services/websocket";
import { getMessages, getPatientConversation, markMessagesAsRead } from "../api/api";
import { Link } from "react-router-dom";

export default function PatientMessages() {
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const [inputText, setInputText] = useState("");
  const [error, setError] = useState(null);

  const chatRef = useRef(null);
  const conversationIdRef = useRef(null);

  const currentUser = JSON.parse(localStorage.getItem("user"));

  // Keep ref updated
  useEffect(() => {
    conversationIdRef.current = conversationId;
  }, [conversationId]);

  // Load conversation
  useEffect(() => {
    if (!currentUser || !currentUser.id) {
      console.log("No user — skipping patient conversation load");
      return;
    }

    const loadConversation = async () => {
      try {
        const data = await getPatientConversation(currentUser.id);
        if (data && data.id) setConversationId(data.id);
      } catch (err) {
        console.error("Conversation fetch error:", err);
        setError("Failed to fetch conversation.");
      }
    };

    loadConversation();
  }, [currentUser?.id]);

  // Load messages
  useEffect(() => {
    if (!currentUser || !currentUser.id) return;
    if (!conversationId) return;

    const loadMessages = async () => {
      try {
        const data = await getMessages(conversationId, currentUser.id);
        setMessages(data);

        await markMessagesAsRead(conversationId, currentUser.id);
        const updated = await getMessages(conversationId, currentUser.id);
        setMessages(updated);
      } catch (err) {
        console.error("Messages fetch error:", err);
        setError("Failed to fetch messages.");
      }
    };

    loadMessages();
  }, [conversationId, currentUser?.id]);

  // WebSocket connection
  useEffect(() => {
    if (!currentUser || !currentUser.id) {
      console.log("No user — skipping WebSocket connection (patient)");
      return;
    }

    connectWebSocket(
      currentUser.id,
      async (msg) => {
        if (msg.conversationId === conversationIdRef.current) {
          setMessages((prev) => [...prev, msg]);

          await markMessagesAsRead(msg.conversationId, currentUser.id);
          const updated = await getMessages(msg.conversationId, currentUser.id);
          setMessages(updated);
        }
      },
      async (convId) => {
        if (convId === conversationIdRef.current) {
          const updated = await getMessages(convId, currentUser.id);
          setMessages(updated);
        }
      }
    );
  }, [currentUser?.id]);

  // Auto-scroll
  useEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    if (!conversationId || !currentUser || !currentUser.id) return;

    sendMessageWS(conversationId, currentUser.id, inputText);
    setInputText("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  if (!currentUser) {
    return (
      <div className="container mt-3">
        <div className="alert alert-warning">Please log in to view messages.</div>
      </div>
    );
  }

  return (
    <div className="container mt-3 mb-5">
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card shadow-sm mx-auto w-100" style={{ maxWidth: "600px" }}>
        <div className="card-header bg-primary text-white">
          Chat with Your Doctor
        </div>

        <div
          ref={chatRef}
          className="card-body bg-light"
          style={{
            height: "60vh",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {messages.map((m, index) => (
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

              {m.senderId === currentUser.id &&
                m.read &&
                index === messages.length - 1 && (
                  <small className="text-light d-block mt-1">Seen</small>
                )}
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
              onKeyDown={handleKeyPress}
            />
            <button className="btn btn-primary" onClick={handleSend}>
              Send
            </button>
          </div>
        </div>
      </div>

      <div className="text-center mt-3">
        <Link to="/doctor-messages" className="text-muted small">
          Switch to Doctor View (Demo Only)
        </Link>
      </div>
    </div>
  );
}
