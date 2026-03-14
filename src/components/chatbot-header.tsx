import { Bot, X } from "lucide-react";
import type { Theme } from "../utils/types";
import { getStyle } from "../utils/styles";

export default function ChatbotHeader({ setIsOpen, theme, title, imageUrl, imageWidth }: {
    setIsOpen: (isOpen: boolean) => void;
    theme: Theme;
    title: string;
    imageUrl?: string;
    imageWidth?: string;
}) {
    return (
        <div className={`widget-header bg-gradient-to-r ${getStyle(theme, 'header')} p-4 flex items-center justify-between`}>
            <div className="flex items-center space-x-3">
                {/* Logo */}
                <div className={`${getStyle(theme, 'headerLogoBg')} rounded-full flex items-center justify-center`}>
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt="chatbot logo"
                            style={{
                                width: imageWidth
                            }}
                        />
                    ) : <Bot className={`w-6 h-6 ${getStyle(theme, 'headerLogoIcon')}`} />}
                </div>
                <div>
                    <h3 className="text-white font-semibold text-xl mb-0">{title}</h3>
                    <p className="text-purple-100 text-sm mb-0">Online</p>
                </div>
            </div>
            <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 rounded-full p-1 transition-colors w-auto"
            >
                <X className="w-5 h-5" />
            </button>
        </div>
    );
}