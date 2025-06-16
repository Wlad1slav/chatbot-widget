import { Bot, User } from "lucide-react";
import type { Message, Theme } from "../utils/types";
import { getStyle } from "../utils/styles";

export default function ChatbotMessage({ message, index, theme }: { message: Message, index: number, theme: Theme }) {
    return (
        <div
            key={message.id}
            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
            style={{ animationDelay: `${index * 0.1}s` }}
        >
            <div
                className={`
                  max-w-[80%] rounded-2xl p-3 shadow-lg
                  ${message.sender === "user"
                        ? `${getStyle(theme, 'messageUser')} ml-4`
                        : `${getStyle(theme, 'messageBot')} mr-4`
                    }
                `}
            >
                <div className="flex items-start space-x-2">
                    {message.sender === "bot" && <Bot className="w-4 h-4 mt-0.5 text-pink-200 flex-shrink-0" />}
                    {message.sender === "user" && <User className="w-4 h-4 mt-0.5 text-pink-200 flex-shrink-0" />}
                    <p className="text-sm leading-relaxed">{message.content}</p>
                </div>
            </div>
        </div>
    );
}