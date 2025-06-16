export type Message = {
    id: string
    content: string
    sender: "user" | "bot"
    timestamp: Date
};

export type Theme = 'boring' | 'futuristic';