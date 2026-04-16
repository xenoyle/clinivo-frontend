import SockJS from "sockjs-client";
import Stomp from "stompjs";

let stompClient = null;
let isConnected = false;

export function connectWebSocket(userId, onMessage, onRead) {
    if (isConnected) {
        console.log("WebSocket already connected — skipping");
        return;
    }

    console.log("Opening Web Socket...");
    const socket = new SockJS("http://localhost:8080/ws");
    stompClient = Stomp.over(socket);

    stompClient.connect({}, () => {
        console.log("Web Socket Opened...");
        isConnected = true;

        stompClient.subscribe(`/topic/messages/${userId}`, (message) => {
            const msg = JSON.parse(message.body);
            console.log("WS message received:", msg);
            onMessage(msg);
        });
        stompClient.subscribe(`/topic/read/${userId}`, (message) => {
            const conversationId = JSON.parse(message.body);
            console.log("Read receipt received:", conversationId);

            if (onRead) {
                onRead(conversationId);
            }
        });
    });

}

export function sendMessageWS(conversationId, senderId, content) {
    if (!stompClient || !stompClient.connected) {
        console.error("WebSocket not connected, cannot send");
        return;
    }

    stompClient.send(
        "/app/sendMessage",
        {},
        JSON.stringify({ conversationId, senderId, content })
    );
}
