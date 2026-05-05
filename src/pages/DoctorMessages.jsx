import React, { useEffect, useState, useRef } from "react";
import { connectWebSocket, sendMessageWS } from "../services/websocket";
import {
  getMessages,
  getAllPatients,
  getDoctorConversations,
  createConversation,
  markMessagesAsRead
} from "../api/api";
import { Link } from "react-router-dom";
import notifySound from "../assets/notify.wav";

export default function DoctorMessages() {
  const [patients, setPatients] = useState([]);
  const [conversationMap, setConversationMap] = useState({});
  const [activePatientId, setActivePatientId] = useState(null);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [unread, setUnread] = useState({}); // keyed by conversationId

  const notificationAudio = useRef(new Audio(notifySound));
  const chatRef = useRef(null);
  const conversationIdRef = useRef(null);

  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    conversationIdRef.current = activeConversationId;
  }, [activeConversationId]);

  // Load patients + conversations
  useEffect(() => {
    const loadData = async () => {
      try {
        const patientData = await getAllPatients();
        const convData = await getDoctorConversations(currentUser.id);

        setPatients(Array.isArray(patientData) ? patientData : []);

        if (patientData.length > 0) {
          setActivePatientId(patientData[0].id);
        }

        const map = {};
        const unreadMap = {};

        if (Array.isArray(convData)) {
          convData.forEach((conv) => {
            map[conv.patientId] = conv.id;

            // backend unread flag
            if (conv.hasUnread) {
              unreadMap[conv.id] = true;
            }
          });
        }

        setConversationMap(map);
        setUnread(unreadMap);

      } catch (err) {
        console.error("Data fetch error:", err);
        setError("Failed to fetch data.");
      }
    };

    loadData();
  }, []);

  // Handle patient selection
  useEffect(() => {
    if (!activePatientId) return;

    const handlePatientClick = async () => {
      try {
        if (conversationMap[activePatientId]) {
          const convId = conversationMap[activePatientId];
          setActiveConversationId(convId);

          // clear unread for this conversation
          setUnread((prev) => ({
            ...prev,
            [convId]: false
          }));

        } else {
          // Create new conversation
          const newConv = await createConversation(currentUser.id, activePatientId);

          setActiveConversationId(newConv.id);
          setConversationMap((prev) => ({
            ...prev,
            [activePatientId]: newConv.id,
          }));

          // new conversation = no unread
          setUnread((prev) => ({
            ...prev,
            [newConv.id]: false
          }));
        }
      } catch (err) {
        console.error("Error handling patient click:", err);
        setError("Failed to create or load conversation.");
      }
    };

    handlePatientClick();
  }, [activePatientId]);

  // Load messages
  useEffect(() => {
    if (!activeConversationId) return;

    const loadMessages = async () => {
      try {
        const data = await getMessages(activeConversationId, currentUser.id);
        setMessages(data);

        // mark as read server-side
        await markMessagesAsRead(activeConversationId, currentUser.id);

        // refresh messages after marking read
        const updated = await getMessages(activeConversationId, currentUser.id);
        setMessages(updated);

        // clear unread badge
        setUnread((prev) => ({
          ...prev,
          [activeConversationId]: false
        }));

      } catch (err) {
        console.error("Messages fetch error:", err);
        setError("Failed to fetch messages.");
      }
    };

    loadMessages();
  }, [activeConversationId]);

  // WebSocket
  useEffect(() => {
    connectWebSocket(
      currentUser.id,

      // incoming message
      async (msg) => {
        if (msg.conversationId === conversationIdRef.current) {
          // message belongs to open conversation
          setMessages((prev) => [...prev, msg]);

          await markMessagesAsRead(msg.conversationId, currentUser.id);
          const updated = await getMessages(msg.conversationId, currentUser.id);
          setMessages(updated);

          // ensure unread cleared
          setUnread((prev) => ({
            ...prev,
            [msg.conversationId]: false
          }));

        } else {
          // message belongs to another conversation
          setUnread((prev) => ({
            ...prev,
            [msg.conversationId]: true
          }));

          try {
            notificationAudio.current.currentTime = 0;
            notificationAudio.current.play();
          } catch { }
        }
      },

      // conversation updated
      async (convId) => {
        if (convId === conversationIdRef.current) {
          const updated = await getMessages(convId, currentUser.id);
          setMessages(updated);
        }
      }
    );
  }, []);

  // Auto-scroll
  useEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    sendMessageWS(activeConversationId, currentUser.id, inputText);
    setInputText("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  const activePatient = patients.find((p) => p.id === activePatientId);

  const filteredPatients = patients.filter((p) => {
    const fullName = `${p.firstName} ${p.lastName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="container-fluid mt-3">

      <div className="row" style={{ height: "80vh" }}>

        {/* Patient Sidebar */}
        <div className="col-12 col-md-3 border-end d-flex flex-column mb-3 mb-md-0">
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
            {filteredPatients.map((p) => {
              const convId = conversationMap[p.id];
              const hasUnread = unread[convId];

              return (
                <button
                  key={p.id}
                  className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center 
                    ${activePatientId === p.id ? "active" : ""}`}
                  onClick={() => {
                    setActivePatientId(p.id);

                    if (convId) {
                      setUnread((prev) => ({
                        ...prev,
                        [convId]: false
                      }));
                    }
                  }}
                >
                  <strong>{p.firstName} {p.lastName}</strong>

                  {hasUnread && (
                    <span className="badge bg-danger rounded-pill">New</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Chat Area */}
        <div className="col-12 col-md-9 d-flex flex-column">
          <div className="p-3 border-bottom bg-white">
            <h5 className="mb-0">
              {activePatient?.firstName} {activePatient?.lastName}
            </h5>
          </div>

          <div
            ref={chatRef}
            className="card-body bg-light"
            style={{
              height: "60vh",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              padding: "1rem"   // ⭐ FIX: matches patient view spacing
            }}
          >
            {messages.map((m, index) => (
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

                {m.senderId === currentUser.id &&
                  m.read &&
                  index === messages.length - 1 && (
                    <small className="text-light d-block mt-1">Seen</small>
                  )}
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
                onKeyDown={handleKeyPress}
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
