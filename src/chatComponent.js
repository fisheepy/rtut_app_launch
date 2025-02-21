import React, { useState, useRef, useEffect } from "react";
import { chatWithAI } from "./api";

const ChatComponent = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [question, setQuestion] = useState("");
    const [messages, setMessages] = useState([]);
    const chatEndRef = useRef(null);

    // Chat button position state (default bottom-right)
    const [position, setPosition] = useState({ x: window.innerWidth - 100, y: window.innerHeight - 100 });
    const buttonRef = useRef(null);
    const isDragging = useRef(false);

    useEffect(() => {
        setMessages(prev => Array.isArray(prev) ? prev : []);
    }, []);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        // Ensure button stays within bounds when resizing window
        const handleResize = () => {
            setPosition(prev => ({
                x: Math.min(prev.x, window.innerWidth - 100),
                y: Math.min(prev.y, window.innerHeight - 100),
            }));
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleSend = async () => {
        if (!question.trim()) return;

        const userMessage = { sender: "user", text: question };
        setMessages((prev) => [...prev, userMessage]);

        setQuestion("");
        setMessages((prev) => [...prev, { sender: "bot", text: "⏳ Waking up AI..." }]);

        let attempts = 0;
        let success = false;
        let responseData;

        while (attempts < 5 && !success) {
            try {
                if (attempts === 0) await fetch(`${process.env.FAISS_SERVER_URL}/status`);

                responseData = await chatWithAI(question);

                if (responseData.answer) {
                    success = true;
                    setMessages((prev) => [...prev, { sender: "bot", text: responseData.answer }]);
                } else {
                    throw new Error("No valid response");
                }
            } catch (error) {
                console.warn(`Attempt ${attempts + 1} failed:`, error.message);
                if (attempts < 4) {
                    setMessages((prev) => [...prev, { sender: "bot", text: `⏳ AI is waking up... Retrying (${attempts + 1}/3)` }]);
                    await new Promise((resolve) => setTimeout(resolve, 5000));
                }
            }
            attempts++;
        }

        if (!success) {
            setMessages((prev) => [...prev, { sender: "bot", text: "❌ AI is unreachable. Please try again later." }]);
        }
    };

    // Drag Handling Functions (Supports Both Mouse & Touch)
    const handleDragStart = (event) => {
        isDragging.current = true;

        const startX = (event.touches ? event.touches[0].clientX : event.clientX) - position.x;
        const startY = (event.touches ? event.touches[0].clientY : event.clientY) - position.y;

        const handleMove = (moveEvent) => {
            if (!isDragging.current) return;

            const clientX = moveEvent.touches ? moveEvent.touches[0].clientX : moveEvent.clientX;
            const clientY = moveEvent.touches ? moveEvent.touches[0].clientY : moveEvent.clientY;

            setPosition({
                x: Math.max(0, Math.min(clientX - startX, window.innerWidth - 50)),
                y: Math.max(0, Math.min(clientY - startY, window.innerHeight - 50)),
            });
        };

        const handleEnd = () => {
            isDragging.current = false;
            window.removeEventListener("mousemove", handleMove);
            window.removeEventListener("mouseup", handleEnd);
            window.removeEventListener("touchmove", handleMove);
            window.removeEventListener("touchend", handleEnd);
        };

        window.addEventListener("mousemove", handleMove);
        window.addEventListener("mouseup", handleEnd);
        window.addEventListener("touchmove", handleMove);
        window.addEventListener("touchend", handleEnd);
    };

    return (
        <div>
            {/* ✅ Draggable Chat Toggle Button (Now Works on iOS & Web) */}
            <button
                ref={buttonRef}
                className="chat-toggle"
                onClick={() => setIsOpen(!isOpen)}
                onMouseDown={handleDragStart}
                onTouchStart={handleDragStart}
                style={{ top: `${position.y}px`, left: `${position.x}px` }}
            >
                💬 Chat
            </button>

            {/* ✅ Chat Window */}
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

            {/* ✅ Styling to Keep Button Moveable & Window UI */}
            <style>
                {`
                /* ✅ Chat Toggle Button (Draggable) */
                .chat-toggle {
                    position: fixed;
                    width: 50px;
                    height: 50px;
                    background:rgb(83, 20, 98);
                    color: #f9f1db;
                    border: none;
                    border-radius: 50%;
                    cursor: grab;
                    font-size: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 2px 2px 10pxrgb(77, 144, 125);
                    z-index: 9999;
                    transition: transform 0.1s ease-in-out;
                }

                /* ✅ While Dragging */
                .chat-toggle:active {
                    cursor: grabbing;
                    transform: scale(1.1);
                }

                /* ✅ Chat Window */
                .chat-window {
                    position: fixed;
                    bottom: 5%;
                    left: 5%;
                    width: 90%;
                    height: 90%;
                    background: white;
                    border-radius: 15px;
                    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    border: 2px solidrgb(77, 144, 125);
                    z-index: 9998;
                }

                /* ✅ Chat Header */
                .chat-header {
                    background:rgb(77, 144, 125);
                    color: white;
                    padding: 15px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-size: 18px;
                    font-weight: bold;
                }

                /* ✅ Close Button */
                .chat-header .close-btn {
                    background: transparent;
                    border: none;
                    color: white;
                    font-size: 22px;
                    cursor: pointer;
                }

                /* ✅ Chat Body */
                .chat-body {
                    flex: 1;
                    overflow-y: auto;
                    padding: 15px;
                    display: flex;
                    flex-direction: column;
                    background: #f9f9f9;
                }

                /* ✅ Chat Messages */
                .chat-message {
                    max-width: 75%;
                    padding: 10px 15px;
                    margin-bottom: 10px;
                    border-radius: 15px;
                    word-wrap: break-word;
                    font-size: 16px;
                }

                /* ✅ User Message */
                .chat-message.user {
                    align-self: flex-end;
                    background:rgb(77, 144, 125);
                    color: white;
                }

                /* ✅ AI Response */
                .chat-message.bot {
                    align-self: flex-start;
                    background: #e0e0e0;
                }

                /* ✅ Chat Footer */
                .chat-footer {
                    display: flex;
                    padding: 15px;
                    border-top: 1px solid #ccc;
                }

                /* ✅ Input Field */
                .chat-footer input {
                    flex: 1;
                    padding: 12px;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    font-size: 12px;
                }

                /* ✅ Send Button */
                .chat-footer button {
                    background:rgb(77, 144, 125);
                    color: white;
                    border: none;
                    padding: 12px 15px;
                    margin-left: 10px;
                    margin-right: 5px;
                    cursor: pointer;
                    border-radius: 15px;
                    font-size: 12px;
                }
                `}
            </style>
        </div>
    );
};

export default ChatComponent;
