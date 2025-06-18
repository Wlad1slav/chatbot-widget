import { MessageCircle, X } from "lucide-react";

export default function ChatbotOpenButton({setIsOpen, isOpen}: {
    setIsOpen: (value: boolean) => void;
    isOpen: boolean;
}) {
    return (
        <button
            onClick={() => setIsOpen(!isOpen)}
            className={`
          w-14 h-14 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700
          rounded-full shadow-2xl flex items-center justify-center text-white
          transition-all duration-300 transform hover:scale-110 active:scale-95 cursor-pointer
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