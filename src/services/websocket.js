import SockJS from "sockjs-client";
import { over } from "stompjs";

let stompClient = null;

export const connectWebSocket = (userId, onMessageReceived) => {
    if (stompClient) {
        console.log("WebSocket already connected");
        return;
    }

    console.log("Opening Web Socket...");

    const socket = new SockJS("http://localhost:8080/ws");
    stompClient = over(socket);

    stompClient.connect({}, () => {
        console.log("WebSocket connected");
        console.log("Subscribed to:", `/topic/messages/${userId}`);

        stompClient.subscribe(`/topic/messages/${userId}`, (message) => {
            const msg = JSON.parse(message.body);
            onMessageReceived(msg);
        });
    });
};

export const sendMessageWS = (conversationId, senderId, content) => {
    if (!stompClient) {
        console.error("WebSocket not connected");
        return;
    }

    stompClient.send(
        "/app/sendMessage",
        {},
        JSON.stringify({ conversationId, senderId, content })
    );
};
