"use client";

import { useEffect, useState } from "react";
import { socket } from "@/socket";

const Chat = () => {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");
  const [clientId, setClientId] = useState(""); // Estado para almacenar el socket.id

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  useEffect(() => {
    socket.on("client_id", (id) => {
      setClientId(id);
    });
    socket.on("chat message", (data) => {
      // Agregamos el mensaje al estado de mensajes
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: data.id, message: data.message },
      ]);
      window.scrollTo(0, document.body.scrollHeight);
    });

    return () => {
      socket.off("chat message");
    };
  }, [socket]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue) {
      socket.emit("chat message", inputValue);
      setInputValue("");
    }
  };

  return (
    <div>
      <p>Status: {isConnected ? "connected" : "disconnected"}</p>
      <p>Transport: {transport}</p>

      <ul id="messages">
        {messages.map((msg, index) => (
          <li key={index}>
            {msg.id === clientId ? "Me: " : `${msg.id}: `}
            {msg.message}
          </li>
        ))}
      </ul>
      <form id="form" onSubmit={handleSubmit}>
        <input
          className="text-black"
          id="input"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chat;
