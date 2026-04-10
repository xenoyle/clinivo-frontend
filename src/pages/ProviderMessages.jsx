import React, { useEffect, useState, useRef } from "react";
import { connectWebSocket, sendMessageWS } from "../services/websocket";

export default function ProviderMessages() {
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");

  const chatRef = useRef(null);
  const conversationIdRef = useRef(null);

  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    conversationIdRef.current = activeConversationId;
  }, [activeConversationId]);

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

    fetch(
      `http://localhost:8080/api/messages/conversation/${activeConversationId}`,
    )
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

      if (msg.conversationId === conversationIdRef.current) {
        setMessages((prev) => [...prev, msg]);
      }
    });
  }, []);

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

  const activeConversation = conversations.find(
    (c) => c.id === activeConversationId,
  );

  return (
    <div className="container-fluid mt-3">
      <div className="row" style={{ height: "80vh" }}>
        {/* Patient Sidebar */}
        <div className="col-md-3 border-end d-flex flex-column">
          <div className="p-2 d-flex justify-content-between align-items-center">
            <h6 className="mb-0">Patients</h6>
            <Link to="/settings" className="btn btn-sm btn-outline-secondary">
              ⚙️
            </Link>
          </div>
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
                  className={`list-group-item list-group-item-action ${
                    activeConversationId === c.id ? "active" : ""
                  }`}
                  onClick={() => setActiveConversationId(c.id)}
                >
                  <strong>
                    {c.patient?.firstName} {c.patient?.lastName}
                  </strong>
                </button>
              ))}
          </div>
        </div>
        <div className="col-md-9 d-flex flex-column">
          <div className="p-3 border-bottom bg-white">
            <h5 className="mb-0">
              {activeConversation?.patient?.firstName}{" "}
              {activeConversation?.patient?.lastName}
            </h5>
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
