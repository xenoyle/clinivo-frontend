import React, { useEffect, useState, useRef } from "react";
import { connectWebSocket, sendMessageWS } from "../services/websocket";
import { getMessages, getDoctorConversations } from "../api/api";
import { Link } from "react-router-dom";
import notifySound from "../assets/notify.wav";

export default function DoctorMessages() {
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [error, setError] = useState(null);

  // Search state
  const [searchTerm, setSearchTerm] = useState("");

  // Sound notification
  const notificationAudio = useRef(new Audio(notifySound));

  // Unread state
  const [unread, setUnread] = useState({});

  const chatRef = useRef(null);
  const conversationIdRef = useRef(null);

  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    conversationIdRef.current = activeConversationId;
  }, [activeConversationId]);

  // Load doctor's conversations
  useEffect(() => {
    const loadConversations = async () => {
      try {
        const data = await getDoctorConversations(currentUser.id);

        if (Array.isArray(data)) {
          setConversations(data);

          if (data.length > 0) {
            setActiveConversationId(data[0].id);
          }
        } else {
          console.error("Expected array but got:", data);
          setConversations([]);
        }
      } catch (err) {
        console.error("Conversation fetch error:", err);
        setError("Failed to fetch conversations.");
      }
    };

    loadConversations();
  }, []);

  // Load messages for selected conversation
  useEffect(() => {
    if (!activeConversationId) return;

    const loadMessages = async () => {
      try {
        const data = await getMessages(activeConversationId);
        setMessages(data);

        // Clear unread when opening the conversation
        setUnread((prev) => ({ ...prev, [activeConversationId]: false }));
      } catch (err) {
        console.error("Messages fetch error:", err);
        setError("Failed to fetch messages.");
      }
    };

    loadMessages();
  }, [activeConversationId]);

  // Connect WebSocket ONCE
  useEffect(() => {
    connectWebSocket(currentUser.id, (msg) => {
      console.log("Doctor WS received:", msg);

      const convId = msg.conversationId;

      // If message is for a different conversation → mark unread + play sound
      if (convId !== conversationIdRef.current) {
        setUnread((prev) => ({ ...prev, [convId]: true }));

        try {
          notificationAudio.current.currentTime = 0;
          notificationAudio.current.play();
        } catch (err) {
          console.warn("Audio playback blocked:", err);
        }

        return;
      }

      // If it's for the active conversation → append normally
      setMessages((prev) => [...prev, msg]);
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
    (c) => c.id === activeConversationId
  );

  // Filter conversations by patient name
  const filteredConversations = conversations.filter((c) => {
    const fullName = `${c.patient?.firstName} ${c.patient?.lastName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="list-group list-group-flush overflow-auto">
            {Array.isArray(filteredConversations) &&
              filteredConversations.map((c) => (
                <button
                  key={c.id}
                  className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center
                    ${activeConversationId === c.id ? "active" : ""}
                    ${unread[c.id] ? "list-group-item-warning" : ""}
                  `}
                  onClick={() => {
                    setActiveConversationId(c.id);
                    setUnread((prev) => ({ ...prev, [c.id]: false }));
                  }}
                >
                  <strong>
                    {c.patient?.firstName} {c.patient?.lastName}
                  </strong>

                  {unread[c.id] && (
                    <span className="badge bg-danger rounded-pill">New</span>
                  )}
                </button>
              ))}
          </div>
        </div>

        {/* Chat Area */}
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
            {error && <div className="alert alert-danger mt-2">{error}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
