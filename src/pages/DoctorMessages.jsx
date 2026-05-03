import React, { useEffect, useState, useRef } from "react";
import { connectWebSocket, sendMessageWS } from "../services/websocket";
import { getMessages, getAllUsersByRole, getPatientConversation, getDoctorConversations, createConversation } from "../api/api";
import { Link } from "react-router-dom";
import { markMessagesAsRead } from "../api/api";
import notifySound from "../assets/notify.wav";

export default function DoctorMessages() {
  const [patients, setPatients] = useState([]);
  const [conversationMap, setConversationMap] = useState({}); // Map patientId to conversationId
  const [activePatientId, setActivePatientId] = useState(null);
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

  // Load patients and conversations
  useEffect(() => {
    const loadData = async () => {
      try {
        const patientData = await getAllUsersByRole("PATIENT");
        const convData = await getDoctorConversations(currentUser.id);

        if (Array.isArray(patientData)) {
          setPatients(patientData);
          if (patientData.length > 0) {
            setActivePatientId(patientData[0].id);
          }
        } else {
          console.error("Expected array but got:", patientData);
          setPatients([]);
        }

        // Build map of patientId -> conversationId
        const map = {};
        if (Array.isArray(convData)) {
          convData.forEach(conv => {
            map[conv.patientId] = conv.id;
          });
        }
        setConversationMap(map);
      } catch (err) {
        console.error("Data fetch error:", err);
        setError("Failed to fetch data.");
      }
    };

    loadData();
  }, []);

  // Handle patient selection and conversation creation
  useEffect(() => {
    if (!activePatientId) return;

    const handlePatientClick = async () => {
      try {
        // Check if conversation exists
        if (conversationMap[activePatientId]) {
          setActiveConversationId(conversationMap[activePatientId]);
        } else {
          // Create new conversation
          const newConv = await createConversation({
            userIds: [currentUser.id, activePatientId]
          });
          setActiveConversationId(newConv.id);
          setConversationMap(prev => ({ ...prev, [activePatientId]: newConv.id }));
        }
      } catch (err) {
        console.error("Error handling patient click:", err);
        setError("Failed to create or load conversation.");
      }
    };

    handlePatientClick();
  }, [activePatientId]);

  // Load messages for selected conversation
  useEffect(() => {
    if (!activeConversationId) return;

    const loadMessages = async () => {
      try {
        const data = await getMessages(activeConversationId, currentUser.id);
        setMessages(data);
        await markMessagesAsRead(activeConversationId, currentUser.id);
        const updatedData = await getMessages(activeConversationId, currentUser.id);
        setMessages(updatedData);
      } catch (err) {
        console.error("Messages fetch error:", err);
        setError("Failed to fetch messages.");
      }
    };

    loadMessages();
  }, [activeConversationId]);

  // Connect WebSocket ONCE
  useEffect(() => {
    connectWebSocket(currentUser.id, async (msg) => {
      console.log("Doctor WS received:", msg);

      if (msg.conversationId === conversationIdRef.current) {
        setMessages((prev) => [...prev, msg]);

        await markMessagesAsRead(msg.conversationId, currentUser.id);
        // Re-fetch to get updated isRead status
        const updated = await getMessages(msg.conversationId, currentUser.id);
        setMessages(updated);
      } else {
        setUnread((prev) => ({ ...prev, [convId]: true }));

        try {
          notificationAudio.current.currentTime = 0;
          notificationAudio.current.play();
        } catch (err) {
          console.warn("Audio playback blocked:", err);
        }

        return;
      }
    },
      async (convId) => {
        if (convId === conversationIdRef.current) {
          const updated = await getMessages(convId, currentUser.id);
          setMessages(updated);
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



  const activePatient = patients.find((p) => p.id === activePatientId);

  // Filter patients by name
  const filteredPatients = patients.filter((p) => {
    const fullName = `${p.firstName} ${p.lastName}`.toLowerCase();
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
            {Array.isArray(filteredPatients) &&
              filteredPatients.map((p) => (
                <button
                  key={p.id}
                  className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center 
                    ${activePatientId === p.id ? "active" : ""}`}
                  onClick={() => {
                    setActivePatientId(p.id);
                    setUnread((prev) => ({ ...prev, [p.id]: false }));
                  }}
                >
                  <strong>
                    {p.firstName} {p.lastName}
                  </strong>

                  {unread[p.id] && (
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
              {activePatient?.firstName} {activePatient?.lastName}
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
                {m.senderId === currentUser.id && m.read && index === messages.length - 1 && (
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
