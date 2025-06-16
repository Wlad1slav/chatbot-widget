import ReactDOM from "react-dom/client";
import ChatbotWidget from "./widget";

export function mountChatbotWidget(
    target: string | HTMLElement,
    props: Record<string, unknown> = {}
) {
    const el =
        typeof target === "string" ? document.querySelector(target)! : target;
    ReactDOM.createRoot(el).render(<ChatbotWidget {...props} />);
}