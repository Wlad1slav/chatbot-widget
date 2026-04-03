import { Bot, X } from "lucide-react";

export default function ChatbotHeader({ setIsOpen, title, imageUrl, imageWidth }: {
    setIsOpen: (isOpen: boolean) => void;
    title: string;
    imageUrl?: string;
    imageWidth?: string;
}) {
    return (
        <div className="widget-header p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
                {/* Logo */}
                <div className="widget-header__logo rounded-full flex items-center justify-center">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt="chatbot logo"
                            style={{
                                width: imageWidth
                            }}
                        />
                    ) : <Bot className="w-6 h-6 widget-header__logo-icon" />}
                </div>
                <div>
                    <h3 className="widget-header__title font-semibold text-xl mb-0">{title}</h3>
                    <p className="widget-header__status text-sm mb-0">Online</p>
                </div>
            </div>
            <button
                onClick={() => setIsOpen(false)}
                className="widget-header__close rounded-full p-1 transition-colors"
            >
                <X className="w-5 h-5" />
            </button>
        </div>
    );
}
