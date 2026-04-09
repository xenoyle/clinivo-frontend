import SockJS from "sockjs-client";
import Stomp from "stompjs";

let stompClient = null;

export function connectWebSocket(userId, onMessage) {
    if (stompClient && stompClient.connected) {
        console.log("WebSocket already connected");
        return;
    }

    console.log("Opening Web Socket...");
    const socket = new SockJS("http://localhost:8080/ws");
    stompClient = Stomp.over(socket);

    stompClient.connect({}, () => {
        console.log("Web Socket Opened...");

        // Listen for messages for this user
        stompClient.subscribe(`/topic/messages/${userId}`, (message) => {
            const msg = JSON.parse(message.body);
            console.log("WS message received:", msg);
            onMessage(msg);
        });
    });
}

export function sendMessageWS(conversationId, senderId, content) {
    if (!stompClient || !stompClient.connected) {
        console.error("WebSocket not connected, cannot send");
        return;
    }

    console.log("WS sending:", { conversationId, senderId, content });

    stompClient.send(
        "/app/sendMessage",          // 🔥 match @MessageMapping("/sendMessage")
        {},
        JSON.stringify({ conversationId, senderId, content })
    );
}
