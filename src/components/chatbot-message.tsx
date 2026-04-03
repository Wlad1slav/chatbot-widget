import { Bot, User } from "lucide-react";
import type { Message } from "../utils/types";
import { useMemo } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";

export default function ChatbotMessage({ message, index, margin=true }: { message: Message, index: number, margin?: boolean }) {

    const html = useMemo(() => {
        const rawHtml = marked.parse(message.content.replaceAll("```", ""), {
            gfm: true,
            breaks: true
        });

        // marked may return a Promise in async mode; render safe empty content in that edge case.
        if (typeof rawHtml !== "string") {
            return "";
        }

        return DOMPurify.sanitize(rawHtml, {
            USE_PROFILES: { html: true }
        });
    }, [message.content]);

    return (
        <div
            className={`flex max-w-[400px] ${message.sender === "user" ? "justify-end ai-chatbot__user-message" : "justify-start ai-chatbot__bot-message"}`}
            style={{ animationDelay: `${index * 0.1}s` }}
        >
            <div
                className={`
                  ai-chatbot__bubble rounded-2xl p-3 shadow-lg
                  ${message.sender === "user"
                        ? `ai-chatbot__bubble--user ${margin ? 'ml-4' : ''} max-w-[80%]`
                        : `ai-chatbot__bubble--bot ${margin ? 'mr-4' : ''} max-w-[100%]`
                    }
                `}
            >
                <div className="flex items-start space-x-2">
                    {message.sender === "bot" && <Bot className="w-4 h-4 mt-0.5 ai-chatbot__icon--bot flex-shrink-0" />}
                    {message.sender === "user" && <User className="w-4 h-4 mt-0.5 ai-chatbot__icon--user flex-shrink-0" />}
                    <div className="text-sm leading-relaxed ai-chatbot__message-body" dangerouslySetInnerHTML={{ __html: html }} />
                </div>
            </div>
        </div>
    );
}
