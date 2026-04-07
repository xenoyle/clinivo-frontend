const API_BASE = "http://localhost:8080/api";

// USERS
export async function loginUser(email, password) {
  const response = await fetch(`${API_BASE}/users`);
  const users = await response.json();

  // TEMP login logic (replace with real auth later)
  return users.find(
    (u) => u.email === email && u.password === password
  );
}

// CONVERSATIONS
export async function createConversation(userIds) {
  const res = await fetch(`${API_BASE}/conversations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userIds),
  });

  return res.json();
}

export async function getUserConversations(userId) {
  const res = await fetch(`${API_BASE}/conversations/user/${userId}`);
  return res.json();
}

// MESSAGES
export async function getMessages(conversationId) {
  const res = await fetch(
    `${API_BASE}/messages/conversation/${conversationId}`
  );
  return res.json();
}

export async function sendMessage(data) {
  const res = await fetch(`${API_BASE}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return res.json();
}