import { Bot, X } from "lucide-react";
import type { Theme } from "../utils/types";
import { getStyle } from "../utils/styles";

export default function ChatbotHeader({ setIsOpen, theme }: { setIsOpen: (isOpen: boolean) => void , theme: Theme}) {
    return (
        <div className={`bg-gradient-to-r ${getStyle(theme, 'header')} p-4 flex items-center justify-between`}>
            <div className="flex items-center space-x-3">
                {/* Logo */}
                <div className={`w-10 h-10 ${getStyle(theme, 'headerLogoBg')} rounded-full flex items-center justify-center`}>
                    <Bot className={`w-6 h-6 ${getStyle(theme, 'headerLogoIcon')}`} />
                </div>
                <div>
                    <h3 className="text-white font-semibold">AI Assistant</h3>
                    <p className="text-purple-100 text-sm">Online</p>
                </div>
            </div>
            <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
            >
                <X className="w-5 h-5" />
            </button>
        </div>
    );
}