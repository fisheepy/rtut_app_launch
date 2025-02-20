import React, { useState, useRef, useEffect } from "react";
import { chatWithAI } from "./api";

const ChatComponent = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [question, setQuestion] = useState("");
    const [messages, setMessages] = useState([]);
    const chatEndRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async () => {
        if (!question.trim()) return;

        const userMessage = { sender: "user", text: question };
        setMessages((prev) => [...prev, userMessage]);

        setQuestion("");

        try {
            const data = await chatWithAI(question);
            const botMessage = { sender: "bot", text: data.answer || data.error };
            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            const errorMessage = { sender: "bot", text: "❌ Error fetching response." };
            setMessages((prev) => [...prev, errorMessage]);
        }
    };

    return (
        <div>
            {/* Chat Toggle Button */}
            <button className="chat-toggle" onClick={() => setIsOpen(!isOpen)}>
                💬 Chat with AI
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="chat-window">
                    <div className="chat-header">
                        <span>AI Chat</span>
                        <button className="close-btn" onClick={() => setIsOpen(false)}>✖</button>
                    </div>

                    <div className="chat-body">
                        {messages.map((msg, index) => (
                            <div key={index} className={`chat-message ${msg.sender}`}>
                                {msg.text}
                            </div>
                        ))}
                        <div ref={chatEndRef}></div>
                    </div>

                    <div className="chat-footer">
                        <input
                            type="text"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder="Type a message..."
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        />
                        <button onClick={handleSend}>Send</button>
                    </div>
                </div>
            )}

            {/* Chat Window Styling */}
            <style>
                {`
                /* Chat Toggle Button */
                .chat-toggle {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    background: #007bff;
                    color: white;
                    border: none;
                    padding: 12px 16px;
                    border-radius: 50px;
                    cursor: pointer;
                    font-size: 16px;
                    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
                }

                /* Chat Window - Expands to 80% of Viewport */
                .chat-window {
                    position: fixed;
                    bottom: 10%;
                    left: 10%;
                    width: 80%;
                    height: 80%;
                    background: white;
                    border-radius: 15px;
                    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    border: 2px solid #007bff;
                }

                /* Chat Header */
                .chat-header {
                    background: #007bff;
                    color: white;
                    padding: 15px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-size: 18px;
                    font-weight: bold;
                }

                /* Close Button */
                .chat-header .close-btn {
                    background: transparent;
                    border: none;
                    color: white;
                    font-size: 22px;
                    cursor: pointer;
                }

                /* Chat Body - Conversation Area */
                .chat-body {
                    flex: 1;
                    overflow-y: auto;
                    padding: 15px;
                    display: flex;
                    flex-direction: column;
                    background: #f9f9f9;
                }

                /* Chat Messages */
                .chat-message {
                    max-width: 75%;
                    padding: 10px 15px;
                    margin-bottom: 10px;
                    border-radius: 15px;
                    word-wrap: break-word;
                    font-size: 16px;
                }

                /* User Message */
                .chat-message.user {
                    align-self: flex-end;
                    background: #007bff;
                    color: white;
                }

                /* AI Response */
                .chat-message.bot {
                    align-self: flex-start;
                    background: #e0e0e0;
                }

                /* Chat Footer - Input & Send Button */
                .chat-footer {
                    display: flex;
                    padding: 15px;
                    border-top: 1px solid #ccc;
                }

                /* Input Field */
                .chat-footer input {
                    flex: 1;
                    padding: 12px;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    font-size: 16px;
                }

                /* Send Button */
                .chat-footer button {
                    background: #007bff;
                    color: white;
                    border: none;
                    padding: 12px 15px;
                    margin-left: 10px;
                    cursor: pointer;
                    border-radius: 5px;
                    font-size: 16px;
                }
                `}
            </style>
        </div>
    );
};

export default ChatComponent;
