import { Bot } from "lucide-react";

export default function TypingIndicator() {
    return (
        <div className="flex justify-start">
            <div className="ai-chatbot__typing rounded-2xl p-3 mr-4">
                <div className="flex items-center space-x-2">
                    <Bot className="w-4 h-4 ai-chatbot__typing-icon" />
                    <div className="flex space-x-1">
                        <div className="w-2 h-2 ai-chatbot__typing-dot rounded-full animate-bounce"></div>
                        <div
                            className="w-2 h-2 ai-chatbot__typing-dot rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                            className="w-2 h-2 ai-chatbot__typing-dot rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
