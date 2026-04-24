import SockJS from "sockjs-client";
import Stomp from "stompjs";

// Store connections per user
if (!window.__wsConnections) {
    window.__wsConnections = {};
}

export function connectWebSocket(userId, onMessage) {
    // If this user already has a connection, skip
    if (window.__wsConnections[userId]) {
        console.log("WebSocket already connected for user:", userId);
        return;
    }

    console.log("Opening Web Socket for user:", userId);
    const socket = new SockJS("http://localhost:8080/ws");
    const client = Stomp.over(socket);

    client.connect({}, () => {
        console.log("Web Socket Opened for user:", userId);

        // Save connection for this user
        window.__wsConnections[userId] = client;

        client.subscribe(`/topic/messages/${userId}`, (message) => {
            const msg = JSON.parse(message.body);
            console.log("WS message received for user", userId, msg);
            onMessage(msg);
        });
    });
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
