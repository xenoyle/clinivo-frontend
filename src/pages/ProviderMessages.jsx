import React, { useEffect, useState, useRef } from "react";
import { connectWebSocket, sendMessageWS } from "../services/websocket";

export default function ProviderMessages() {
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");

  const chatRef = useRef(null);

  const currentUser = JSON.parse(localStorage.getItem("user"));

  // Load doctor's conversations
  useEffect(() => {
    fetch(`http://localhost:8080/api/conversations/doctor/${currentUser.id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Provider conversations:", data);

        if (Array.isArray(data)) {
          setConversations(data);

          if (data.length > 0) {
            setActiveConversationId(data[0].id);
          }
        } else {
          console.error("Expected array but got:", data);
          setConversations([]);
        }
      })
      .catch((err) => console.error("Conversation fetch error:", err));
  }, []);

  // Load messages for selected conversation
  useEffect(() => {
    if (!activeConversationId) return;

    console.log("Active conversation ID:", activeConversationId);

    fetch(`http://localhost:8080/api/messages/conversation/${activeConversationId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Loaded messages:", data);
        setMessages(data);
      })
      .catch((err) => console.error("Message fetch error:", err));
  }, [activeConversationId]);

  // Connect WebSocket ONCE
  useEffect(() => {
    connectWebSocket(currentUser.id, (msg) => {
      console.log("Doctor WS received:", msg);

      if (msg.conversationId === activeConversationId) {
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

    console.log("Doctor sending to conversation:", activeConversationId);

    sendMessageWS(activeConversationId, currentUser.id, inputText);
    setInputText("");
  };

  return (
    <div className="container-fluid mt-3">
      <div className="row" style={{ height: "80vh" }}>

        {/* Patient Sidebar */}
        <div className="col-md-3 border-end d-flex flex-column">
          <div className="p-2">
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Search patients..."
            />
          </div>

          <div className="list-group list-group-flush overflow-auto">
            {Array.isArray(conversations) &&
              conversations.map((c) => (
                <button
                  key={c.id}
                  className={`list-group-item list-group-item-action ${activeConversationId === c.id ? "active" : ""
                    }`}
                  onClick={() => setActiveConversationId(c.id)}
                >
                  <strong>Patient Conversation #{c.id}</strong>
                </button>
              ))}
          </div>
        </div>

        {/* Chatbox Area */}
        <div className="col-md-9 d-flex flex-column">
          <div className="p-3 border-bottom bg-white">
            <h5 className="mb-0">Conversation #{activeConversationId}</h5>
          </div>

          <div
            ref={chatRef}
            className="flex-grow-1 bg-light p-3 overflow-auto"
            style={{ display: "flex", flexDirection: "column" }}
          >
            {messages.map((m) => (
              <div
                key={m.id}
                className={
                  m.senderId === currentUser.id
                    ? "align-self-end bg-dark text-white p-2 rounded mb-2"
                    : "align-self-start bg-white border p-2 rounded mb-2"
                }
                style={{ maxWidth: "60%" }}
              >
                <p className="mb-0">{m.content}</p>
              </div>
            ))}
          </div>

          <div className="p-3 border-top bg-white">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Type a message..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              <button className="btn btn-dark" onClick={handleSend}>
                Send Message
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
