import { Send } from "lucide-react";

export default function ChatbotInput({inputValue, setInputValue, handleSendMessage, handleKeyPress}: {
    inputValue: string;
    setInputValue: (value: string) => void;
    handleSendMessage: () => void;
    handleKeyPress: (e: React.KeyboardEvent) => void;
}) {
    return (
        <div className="px-4 pt-2 chatbot-input">
            <div className="flex space-x-2">
                <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="chatbot-input__field flex-1 rounded-xl px-4 py-2 transition-all"
                />
                <button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim()}
                    className="chatbot-input__send w-auto"
                >
                    <Send className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}
