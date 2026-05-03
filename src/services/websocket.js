import SockJS from "sockjs-client";
import Stomp from "stompjs";

// Store connections per user
if (!window.__wsConnections) {
    window.__wsConnections = {};
}

export function connectWebSocket(userId, onMessage, onRead) {
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

        // Save connection for this user
        window.__wsConnections[userId] = client;

        client.subscribe(`/topic/messages/${userId}`, (message) => {
            const msg = JSON.parse(message.body);
            console.log("WS message received for user", userId, msg);
            onMessage(msg);
        });
        client.subscribe(`/topic/read/${userId}`, (message) => {
            const conversationId = JSON.parse(message.body);
            console.log("Read receipt received:", conversationId);

            if (onRead) {
                onRead(conversationId);
            }
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
