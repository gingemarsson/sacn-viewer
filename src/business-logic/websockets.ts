import { WebSocketServer, WebSocket } from 'ws';

export const configureWebsockets = () => {
    const wss = new WebSocketServer({ port: 8081 });

    wss.on('connection', (ws) => {
        ws.on('error', console.error);
    });

    return {
        broadcast: (data: any, isBinary: boolean) =>
            wss.clients.forEach(function each(client) {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(data, { binary: isBinary });
                }
            }),
        closeAll: () => wss.clients.forEach((x) => x.close()),
    };
};
