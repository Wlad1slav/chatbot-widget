import { Send } from "lucide-react";
import { getStyle } from "../utils/styles";
import type { Theme } from "../utils/types";

export default function ChatbotInput({inputValue, setInputValue, handleSendMessage, handleKeyPress, theme}: {
    inputValue: string;
    setInputValue: (value: string) => void;
    handleSendMessage: () => void;
    handleKeyPress: (e: React.KeyboardEvent) => void;
    theme: Theme;
}) {
    return (
        <div className={`px-4 pt-2 ${getStyle(theme, 'inputContainer')} chatbot-input`}>
            <div className="flex space-x-2">
                <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className={`flex-1 ${getStyle(theme, 'input')} rounded-xl px-4 py-2  transition-all`}
                />
                <button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim()}
                    className="w-auto"
                // className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-slate-600 disabled:to-slate-600 text-white rounded-xl px-4 py-2 transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
                >
                    <Send className={`w-4 h-4 ${getStyle(theme, 'sendButton')} cursor-pointer`} />
                </button>
            </div>
        </div>
    )
}