"use client";
import { useEffect, useState, useRef } from "react";
import { socket } from "@/socket";

const Chat = () => {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [clientId, setClientId] = useState("");
  const [joinedRoom, setJoinedRoom] = useState(false); // Estado para controlar si se ha unido a una sala
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
      socket.on("client_id", (id) => {
        setClientId(id);
      });
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  useEffect(() => {
    socket.on("chat_message", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    socket.on("message", (msg) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: "system", message: msg },
      ]);
    });

    return () => {
      socket.off("chat_message");
      socket.off("message");
    };
  }, []);

  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (room) {
      socket.emit("join_room", room);
      setJoinedRoom(true); // Marcar como unido a la sala
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: "system", message: `You have joined the room: ${room}` },
      ]);
    }
  };

  const handleLeaveRoom = (e) => {
    e.preventDefault();
    if (room) {
      socket.emit("leave_room", room);
      setJoinedRoom(false); // Marcar como no unido a ninguna sala
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: "system", message: `You have left the room: ${room}` },
      ]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue && room) {
      socket.emit("chat_message", { room, message: inputValue });
      setInputValue("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-800 shadow-lg rounded-lg p-6">
        <div className="mb-4 text-white">
          <p className="text-xl font-bold">
            Status: {isConnected ? "Connected" : "Disconnected"}
          </p>
          <p>Client ID: {clientId}</p>
        </div>

        <form onSubmit={handleJoinRoom} className="mb-4">
          <div className="flex space-x-2">
            <input
              className="flex-grow p-2 border rounded text-black"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              placeholder="Room name"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white p-2 rounded"
            >
              Join Room
            </button>
          </div>
        </form>

        <form onSubmit={handleLeaveRoom} className="mb-4">
          <button
            type="submit"
            className="bg-red-600 text-white p-2 w-full rounded"
            disabled={!joinedRoom} // Deshabilitar si no se ha unido a ninguna sala
          >
            Leave Room
          </button>
        </form>

        <ul className="mb-4 max-h-64 overflow-y-auto bg-gray-700 p-4 rounded shadow-inner">
          {messages.map((msg, index) => (
            <li
              key={index}
              className={`p-2 my-2 rounded ${
                msg.id === "system"
                  ? "bg-yellow-600 text-white"
                  : msg.id === clientId
                  ? "bg-green-600 text-white"
                  : "bg-gray-600 text-white"
              }`}
            >
              {msg.id !== "system" && (
                <strong>{msg.id === clientId ? "You" : msg.id}: </strong>
              )}
              {msg.message}
            </li>
          ))}
          <div ref={messagesEndRef} />
        </ul>

        <form onSubmit={handleSubmit}>
          <div className="flex space-x-2">
            <input
              className="flex-grow p-2 border rounded text-black"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message"
            />
            <button
              type="submit"
              className="bg-green-600 text-white p-2 rounded"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chat;
