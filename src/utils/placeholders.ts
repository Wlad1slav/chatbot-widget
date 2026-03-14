import type { Message } from "./types"

export const placeholderMessages: Message[] = [
    {
        content: "Hello! I'm your AI assistant. How can I help you today?",
        sender: "bot",
    },
    {
        content: "Hi there! Can you tell me about your capabilities?",
        sender: "user",
    },
    {
        content:
            "I can help you with various tasks including answering questions, [providing information](/test), assisting with problem-solving, and much more. What would you like to explore?",
        sender: "bot",
    },
]