import api from "./axios";

// USERS
export const loginUser = async (email, password) => {
  const res = await api.get("/users");
  return res.data.find((u) => u.email === email && u.password === password);
};

export const createUser = async (userData) => {
  const res = await api.post("/users", userData);
  return res.data;
};

// CONVERSATIONS
export const createConversation = async (userIds) => {
  const res = await api.post("/conversations", userIds);
  return res.data;
};

export const getUserConversations = async (userId) => {
  const res = await api.get(`/conversations/user/${userId}`);
  return res.data;
};

export const getPatientConversation = async (patientId) => {
  const res = await api.get(`/conversations/patient/${patientId}`);
  return res.data;
};

export const getProviderConversation = async (providerId) => {
  const res = await api.get(`/conversations/provider/${providerId}`);
  return res.data;
};

// MESSAGES
export const getMessages = async (conversationId) => {
  const res = await api.get(`/messages/conversation/${conversationId}`);
  return res.data;
};

export const sendMessage = async (data) => {
  const res = await api.post("/messages", data);
  return res.data;
};
