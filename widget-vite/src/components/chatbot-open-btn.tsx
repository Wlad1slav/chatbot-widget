import { MessageCircle, X } from "lucide-react";

export default function ChatbotOpenButton({setIsOpen, isOpen}: {
    setIsOpen: (value: boolean) => void;
    isOpen: boolean;
}) {
    return (
        <button
            onClick={() => setIsOpen(!isOpen)}
            className={`chatbot-open-btn
          w-14 h-14
          rounded-full shadow-2xl items-center justify-center text-white
          transition-all duration-300 transform active:scale-90 cursor-pointer
          ${isOpen ? "rotate-180" : "rotate-0"}
        `}
            style={{
                boxShadow: "0 0 30px rgba(147, 51, 234, 0.5)",
            }}
        >
            {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        </button>
    )
}