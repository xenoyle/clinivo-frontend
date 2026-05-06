import SockJS from "sockjs-client";
import Stomp from "stompjs";

// Store connections per user
if (!window.__wsConnections) {
    window.__wsConnections = {};
}

export function connectWebSocket(userId, onMessage, onRead) {
    // 🚫 Prevent connecting when logged out
    if (!userId) {
        console.log("No userId — skipping WebSocket connection");
        return;
    }

    // Prevent duplicate connections
    if (window.__wsConnections[userId]) {
        if (window.__wsConnections[userId].connected) {
            console.log("WebSocket already connected — skipping");
            return;
        }
    }

    console.log("Opening Web Socket for user:", userId);

    const wsUrl = import.meta.env.VITE_WS_URL || "http://localhost:8080/ws";
    const socket = new SockJS(wsUrl);
    const client = Stomp.over(socket);

    client.connect({}, () => {
        console.log("Web Socket Opened for user:", userId);

        // Save connection
        window.__wsConnections[userId] = client;

        // Message subscription
        client.subscribe(`/topic/messages/${userId}`, (message) => {
            const msg = JSON.parse(message.body);
            console.log("WS message received for user", userId, msg);
            onMessage(msg);
        });

        // Read receipt subscription
        client.subscribe(`/topic/read/${userId}`, (message) => {
            const conversationId = JSON.parse(message.body);
            console.log("Read receipt received:", conversationId);

            if (onRead) onRead(conversationId);
        });
    });

    // Optional: cleanup on socket close
    socket.onclose = () => {
        console.log("WebSocket closed for user:", userId);
        delete window.__wsConnections[userId];
    };
}

export function sendMessageWS(conversationId, senderId, content) {
    const client = window.__wsConnections[senderId];

    if (!client || !client.connected) {
        console.error("WebSocket not connected for user", senderId);
        return;
    }

    client.send(
        "/app/sendMessage",
        {},
        JSON.stringify({ conversationId, senderId, content })
    );
}
