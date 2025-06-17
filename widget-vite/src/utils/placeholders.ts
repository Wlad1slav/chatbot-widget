import type { Message } from "./types"

export const placeholderMessages: Message[] = [
    {
        id: "1",
        content: "Hello! I'm your AI assistant. How can I help you today?",
        sender: "bot",
        timestamp: new Date(Date.now() - 300000),
    },
    {
        id: "2",
        content: "Hi there! Can you tell me about your capabilities?",
        sender: "user",
        timestamp: new Date(Date.now() - 240000),
    },
    {
        id: "3",
        content:
            "I can help you with various tasks including answering questions, [providing information](/test), assisting with problem-solving, and much more. What would you like to explore?",
        sender: "bot",
        timestamp: new Date(Date.now() - 180000),
    },
]