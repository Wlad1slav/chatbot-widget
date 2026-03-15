import ReactDOM from "react-dom/client";
import ChatbotWidget, { type ChatbotWidgetProps } from "./widget";

export function mountChatbotWidget(
    target: string | HTMLElement,
    props: ChatbotWidgetProps
) {
    const el =
        typeof target === "string" ? document.querySelector(target)! : target;

    ReactDOM.createRoot(el).render(<ChatbotWidget {...props} />);
}
