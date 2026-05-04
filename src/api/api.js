import api from "./axios";

// USERS
export const loginUser = async (email, password) => {
  const res = await api.post("/users/login", { email, password });
  return res.data;
};

export const createUser = async (userData) => {
  const res = await api.post("/users", userData);
  return res.data;
};

export const getAllUsers = async () => {
  const res = await api.get("/users");
  return res.data;
}

export const getAllPatients = async () => {
  const res = await api.get("/users/patients");
  return res.data;
}

// CONVERSATIONS
export const createConversation = async (userIds) => {
  const res = await api.post("/conversations", userIds);
  return res.data;
};

export const getPatientConversation = async (patientId) => {
  const res = await api.get(`/conversations/patient/${patientId}`);
  return res.data;
};

export const getDoctorConversations = async (doctorId) => {
  const res = await api.get(`/conversations/doctor/${doctorId}`);
  return res.data;
};

// MESSAGES
export const getMessages = async (conversationId, userId) => {
  const res = await api.get(`/messages/conversation/${conversationId}`, {
    params: { userId },
  });
  return res.data;
};

export const sendMessage = async (data) => {
  const res = await api.post("/messages", data);
  return res.data;
};

export const markMessagesAsRead = async (conversationId, userId) => {
  await api.post("/messages/read", null, {
    params: { conversationId, userId },
  });
};
