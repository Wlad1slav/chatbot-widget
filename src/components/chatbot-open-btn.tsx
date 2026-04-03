import { MessageCircle, X } from "lucide-react";

export default function ChatbotOpenButton({ setIsOpen, isOpen }: {
    setIsOpen: (value: boolean) => void;
    isOpen: boolean;
}) {
    return (
        <>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`chatbot-open-btn
                    w-14 h-14
                    rounded-full shadow-2xl items-center justify-center
                    transition-all duration-300 transform active:scale-9 cursor-pointer backdrop-blur-xl
                    ${isOpen ? "rotate-180" : "rotate-0"}
                `}
            >
                {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
            </div>
        </>
    )
}
