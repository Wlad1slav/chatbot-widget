export default function ChatbotPrompt({prompt, handleSendMessage}: {prompt: string, handleSendMessage: (input?: string) => void}) {
    const handleClick = () => {
        handleSendMessage(prompt);
    }
    return (
        <div onClick={handleClick} className="ai-chatbot-prompt text-sm rounded-full transition hover:scale-98 cursor-pointer px-4 py-2">
            {prompt}
        </div>
    );
}
