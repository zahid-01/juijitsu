import {io} from 'socket.io-client';
import { BASE_URI } from './Config/url';
export let socket;

export const socketConnect = (token = null) => {
    const socketUrl = `${BASE_URI}/?token=${token}`
    console.log(token);
    console.log(socketUrl)
    try {
        socket = io(socketUrl, {
            transports: ['websocket'], // Force WebSocket transport
            autoConnect: false, // Don't connect automatically
        });

        socket.connect();

        socket.on("connect", () => {
            console.log("Socket connected:", socket.connected);
        });

        socket.on("connect_error", (error) => {
            console.error("Connection error:", error);
        });

        socket.on("disconnect", (reason) => {
            console.log("Socket disconnected:", reason);
        });

    } catch (e) {
        console.log(e);
    }
}