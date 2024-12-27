import { ref } from 'vue';
import { Identity } from '../core/types';

interface ChatEvent {
    type: string;
    data: any;
}

export function useChat() {
    const isConnected = ref(false);
    const messages = ref<any[]>([]);
    const wsRef = ref<WebSocket | null>(null);

    function connect() {
        if (wsRef.value) {
            return;
        }
        const token = (JSON.parse(localStorage.getItem('id') ?? '{}') as Identity).token
        const url = `${import.meta.env.VITE_API_WS_URL}/chat?token=${token}`;
        const ws = new WebSocket(url);
        wsRef.value = ws;

        ws.onopen = () => {
            isConnected.value = true;
            //console.log("Chat conectado");

            // Al abrir, pedimos el historial:
            send({ type: "GET_HISTORY", data: {} });
        };

        ws.onmessage = (evt) => {
            try {
                const event: ChatEvent = JSON.parse(evt.data);
                handleEvent(event);
            } catch (e) {
                console.error("Error parseando evento WS:", e);
            }
        };

        ws.onerror = (err) => {
            console.error("WebSocket error:", err);
        };

        ws.onclose = () => {
            console.log("WS cerrado");
            isConnected.value = false;
            wsRef.value = null;
        };
    }

    function handleEvent(event: ChatEvent) {
        const { type, data } = event;
        switch (type) {
            case "HISTORY":
                // data es un array con todos los mensajes (broadcast + DM del user)
                messages.value = data;
                break;

            case "CHAT_MESSAGE":
            case "DM":
                // Nuevo mensaje público o directo
                messages.value.push(data);
                break;

            // Notificaciones de usuarios que entran o salen
            case "USER_JOINED":
                //console.log(`Usuario ${data.userId} ha ingresado`);
                break;
            case "USER_LEFT":
                //console.log(`Usuario ${data.userId} salió`);
                break;

            default:
            //console.log("Evento no reconocido:", type, data);
        }
    }

    /** 
     * Helper para enviar cualquier evento 
     */
    function send(payload: ChatEvent) {
        if (!wsRef.value || wsRef.value.readyState !== WebSocket.OPEN) {
            //console.warn("WS no abierto, no se puede enviar:", payload);
            return;
        }
        wsRef.value.send(JSON.stringify(payload));
    }

    /**
     * Envía un mensaje público (CHAT_MESSAGE)
     */
    function sendMessage(content: string) {
        send({ type: "CHAT_MESSAGE", data: { content } });
    }

    /**
     * Envía mensaje directo (DM)
     */
    function sendDM(recipient: string, content: string) {
        send({ type: "DM", data: { recipient, content } });
    }

    return {
        isConnected,
        messages,
        connect,
        sendMessage,
        sendDM,
    };
}
