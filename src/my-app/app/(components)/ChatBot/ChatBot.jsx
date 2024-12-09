"use client";
import React, { useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import axios from "axios";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const toggleChatbot = () => setIsOpen(!isOpen);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${"http://34.121.32.167:3003/api/v1/prediction/12f53927-a4cc-465d-b02c-d111788315b5"}`,
        {
          question: input,
        }
      );
      setMessages((prev) => [...prev, { sender: "bot", text: response.data.text }]);
    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Sorry, I couldn't process your request." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
<>
  <button
    onClick={toggleChatbot}
    className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
  >
    <MessageCircle className="w-6 h-6" />
  </button>

  {isOpen && (
    <div
      className="fixed bottom-16 right-4 bg-white w-72 h-[24rem] rounded-lg shadow-lg flex flex-col z-50 overflow-hidden sm:w-80 sm:h-[28rem] md:w-96 md:h-[32rem]"
    >
      <div className="bg-blue-600 text-white p-3 flex justify-between items-center">
        <h3 className="text-lg font-semibold">ChatBot</h3>
        <button
          onClick={toggleChatbot}
          className="text-white hover:bg-blue-700 rounded-full p-1 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 p-3 overflow-y-auto space-y-3">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`p-2 rounded-lg max-w-[80%] ${
                message.sender === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-gray-800 p-2 rounded-lg">
              Thinking...
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSendMessage} className="p-3 bg-gray-100">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            disabled={isLoading}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  )}
</>


  );
};

export default ChatBot;
