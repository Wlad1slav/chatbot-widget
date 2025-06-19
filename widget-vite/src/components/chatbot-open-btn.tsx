import { MessageCircle, X } from "lucide-react";
import type { Theme } from "../utils/types";
import { getStyle } from "../utils/styles";

export default function ChatbotOpenButton({setIsOpen, isOpen, theme}: {
    setIsOpen: (value: boolean) => void;
    isOpen: boolean;
    theme: Theme;
}) {
    return (
        <div
            onClick={() => setIsOpen(!isOpen)}
            className={`chatbot-open-btn
          w-14 h-14 ${getStyle(theme, 'openButton')}
          rounded-full shadow-2xl items-center justify-center text-white
          transition-all duration-300 transform active:scale-9 cursor-pointer backdrop-blur-xl
          ${isOpen ? "rotate-180" : "rotate-0"}
        `}
            style={{
                boxShadow: getStyle(theme, 'openButtonShadow'),
            }}
        >
            {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        </div>
    )
}