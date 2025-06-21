import { getStyle } from "../utils/styles";
import type { Theme } from "../utils/types";

export default function ChatbotPrompt({prompt, handleSendMessage, theme}: {prompt: string, handleSendMessage: (input?: string) => void, theme: Theme}) {
    const handleClick = () => {
        handleSendMessage(prompt);
    }
    return (
        <div onClick={handleClick} className={`${getStyle(theme, 'prompt')} ai-chatbot-prompt text-sm rounded-full transition hover:scale-98 cursor-pointer px-4 py-2`}>
            {prompt}
        </div>
    );
}