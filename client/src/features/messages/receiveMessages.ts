import { store } from "../../app/store";
import { addMessage } from "./messagesSlice";


export function subscribeToMessages(url: string) {
    console.log(`Attempting to connect to ${url}`);
    const ws = new WebSocket(url);
    ws.onopen = function() {
        console.log('Websocket Connected');
    };

    ws.onmessage = function(ev) {
        store.dispatch(addMessage(JSON.parse(ev.data)));
    };

    ws.onerror = function(err) {
        console.log('Could not connect', err);
    }
}