const Repo = require("./repo.service");

class ChatService {
    constructor() {
        this.messagesDb = new Repo("messages");
        this.clients = new Map();
    }

    async handleConnection(ws, req) {
        const userId = req.userId;
        if (!userId) {
            console.error("ChatService: userId no definido en la conexión WS");
            ws.close(4001, "No userId found in request");
            return;
        }

        // Registra el WS en la lista de clientes
        this.clients.set(userId, ws);

        // 1) Enviamos historial de mensajes
        const lastMessages = await this.messagesDb.fetch();
        ws.send(
            JSON.stringify({
                type: "HISTORY",
                data: lastMessages,
            })
        );

        // 2) Notificamos a todos (broadcast) que un nuevo usuario ingresó
        this.broadcastEvent({
            type: "USER_JOINED",
            data: {
                userId,
                joinedAt: Date.now(),
            },
        });

        // 3) Suscribimos los eventos onMessage / onClose de este WS
        ws.on("message", (messageData) => this._onMessage(ws, userId, messageData));
        ws.on("close", () => this._onClose(userId));
        ws.on("error", (err) => {
            console.error("WS Error para user:", userId, err);
        });
    }

    /**
     * _onMessage: Se llama cada vez que un usuario WS envía un mensaje.
     * Se parsea, se discriminan tipos de mensajes y se actúa en consecuencia.
     */
    async _onMessage(ws, userId, messageData) {
        let parsedData = null;
        try {
            parsedData = JSON.parse(messageData);
        } catch (err) {
            console.error("ChatService: Error al parsear mensaje:", err);
            return;
        }

        /**
         * Estructura recomendada del payload:
         * {
         *   type: "CHAT_MESSAGE" | "TYPING_START" | "TYPING_STOP" | "DM" | ...
         *   data: { ... } 
         * }
         */
        const { type, data } = parsedData;

        if (!type || !data) {
            console.error("ChatService: Mensaje inválido, falta 'type' o 'data'");
            return;
        }

        switch (type) {
            /**
             * CHAT_MESSAGE: un mensaje “público” al chat global
             */
            case "CHAT_MESSAGE": {
                const { content } = data;
                if (!content) {
                    return;
                }

                // Guarda el mensaje en BD
                const newMsg = {
                    sender: userId,
                    recipient: null, // null indica mensaje público
                    content,
                    timestamp: Date.now(),
                };
                await this.messagesDb.insert(newMsg);

                // Enviamos a todos
                this.broadcastEvent({
                    type: "CHAT_MESSAGE",
                    data: newMsg,
                });
                break;
            }

            /**
             * DM (Direct Message): un mensaje solo para un destinatario concreto
             */
            case "DM": {
                const { recipient, content } = data;
                if (!recipient || !content) {
                    return;
                }

                // Guardar en BD
                const newMsg = {
                    sender: userId,
                    recipient,
                    content,
                    timestamp: Date.now(),
                };
                await this.messagesDb.insert(newMsg);

                // Enviar solo a "recipient" y al "sender"
                this.sendToUser(recipient, {
                    type: "DM",
                    data: newMsg,
                });
                this.sendToUser(userId, {
                    type: "DM",
                    data: newMsg,
                });
                break;
            }

            /**
             * TYPING_START / TYPING_STOP
             * Notifica que un usuario está o dejó de teclear
             */
            case "TYPING_START":
            case "TYPING_STOP": {
                // No guardamos esto en BD, solo es un evento efímero
                this.broadcastEvent({
                    type,
                    data: {
                        userId,
                        timestamp: Date.now(),
                    },
                });
                break;
            }

            /**
             * GET_HISTORY: peticiones del cliente de obtener N últimos mensajes
             */
            case "GET_HISTORY": {
                const lastMessages = await this.messagesDb.fetch();
                this.sendToUser(userId, {
                    type: "HISTORY",
                    data: lastMessages,
                });
                break;
            }

            /**
             * Si hay algún otro type, lo ignoramos o logueamos
             */
            default:
                console.log("ChatService: type no reconocido:", type);
                break;
        }
    }

    /**
     * _onClose: Se llama cuando un usuario cierra la conexión WS 
     * o se desconecta abruptamente.
     * Eliminamos el ws de clients y avisamos a todos que se fue.
     */
    _onClose(userId) {
        this.clients.delete(userId);
        console.log(`ChatService: [${userId}] desconectado`);
        this.broadcastEvent({
            type: "USER_LEFT",
            data: {
                userId,
                leftAt: Date.now(),
            },
        });
    }

    /**
     * broadcastEvent(data)
     * Envía un objeto JSON a todos los usuarios conectados.
     */
    broadcastEvent(event) {
        for (const [_, ws] of this.clients) {
            if (ws && ws.readyState === 1) {
                ws.send(JSON.stringify(event));
            }
        }
    }

    /**
     * sendToUser(userId, event)
     * Envía un objeto JSON a un usuario específico si está conectado.
     */
    sendToUser(userId, event) {
        const ws = this.clients.get(userId);
        if (ws && ws.readyState === 1) {
            ws.send(JSON.stringify(event));
        }
    }

    /**
     * (Opcional) getUserMessages
     * Recupera mensajes de la BD donde el usuario sea remitente o destinatario
     */
    async getUserMessages(userId) {
        const messages = await this.messagesDb.fetch([
            { sender: userId },
            { recipient: userId },
        ]);
        return messages || [];
    }
}

module.exports = new ChatService();
