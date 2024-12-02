const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('Server. New client connected');

    ws.on('message', (message) => {
        const parsedMessage = JSON.parse(message);
        if (parsedMessage.type === 'join') {
            // Сохраняем данные пользователя при подключении
            ws.name = parsedMessage.name;
            ws.roomId = parsedMessage.roomId;
            console.log(`Server. Client joined room: ${ws.roomId} with name: ${ws.name}`);
            wss.clients.forEach((client) => {
           
            let content = `User "${ws.name}" joined room`;
                if (client.readyState === WebSocket.OPEN && client.roomId === ws.roomId) {
                    client.send(JSON.stringify({content }));
                }
            });
        } else {
            console.log(`Server. Received message: ${message}`);
            const { roomId, name, content } = parsedMessage;

            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN && client.roomId === roomId) {
                    client.send(JSON.stringify({ name, content }));
                }
            });
        }
    });

    ws.on('close', () => {
        console.log('Server. Client disconnected');
    });
});

server.listen(8080, () => {
    console.log('Server. Server started on port 8080');
});
