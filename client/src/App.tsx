import React, { useState, useRef } from 'react';
import './App.css';

interface Message {
    name: string;
    content: string;
}

const App: React.FC = () => {
    const [name, setName] = useState('');
    const [roomId, setRoomId] = useState('');
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const ws = useRef<WebSocket | null>(null);

    const joinRoom = () => {
        ws.current = new WebSocket('ws://localhost:8080');
        ws.current.onopen = () => {
            console.log('Client. Connected to WebSocket server');
            ws.current?.send(JSON.stringify({ type: 'join', name, roomId }));
        };
        ws.current.onmessage = (event) => {
            const message: Message = JSON.parse(event.data);
            console.log('Client. message^' +message);
            setMessages((prev) => [...prev, message]);
        };

        ws.current.onclose = () => {
            console.log('Client. Disconnected from WebSocket server');
        };
    };

    const sendMessage = () => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            const message = {
                roomId,
                name,
                content: input
            };
            console.log(`Client. Sending message: ${JSON.stringify(message)}`);
            ws.current.send(JSON.stringify(message));
            setInput('');
        }
    };

    return (
        <div className="App">
            <h1>Chat Room</h1>
            {!ws.current && (
                <div>
                    <input 
                        type="text" 
                        placeholder="Name" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                    />
                    <input 
                        type="text" 
                        placeholder="Room ID" 
                        value={roomId} 
                        onChange={(e) => setRoomId(e.target.value)} 
                    />
                    <button onClick={joinRoom}>Join Room</button>
                </div>
            )}
            {ws.current && (
                <div>
                   <div className="message-container">
                      {messages.map((message, index) => (
                        <div key={index}>
                            <strong>{message.name}{message.name && ':'}</strong> {message.content}
                        </div>
                      ))}
                  </div>

                    <input 
                        type="text" 
                        value={input} 
                        onChange={(e) => setInput(e.target.value)} 
                        placeholder="Type a message" 
                    />
                    <button onClick={sendMessage}>Send</button>
                </div>
            )}
        </div>
    );
};

export default App;