import { createRoot, type Root } from "react-dom/client";
import ChatbotWidget from "./widget";
import widgetStyles from "./widget.css?inline";

const widgetRoots = new WeakMap<HTMLElement, Root>();
const STYLE_NODE_ID = "ai-chatbot-widget-style";
const APP_NODE_ID = "ai-chatbot-widget-root";

const resolveHost = (target: string | HTMLElement): HTMLElement => {
    if (typeof target === "string") {
        const el = document.querySelector(target);

        if (!(el instanceof HTMLElement)) {
            throw new Error(`Chatbot widget target was not found for selector: ${target}`);
        }

        return el;
    }

    if (!(target instanceof HTMLElement)) {
        throw new Error("Chatbot widget target must be an HTMLElement.");
    }

    return target;
}

const ensureShadowRoot = (host: HTMLElement): ShadowRoot => {
    return host.shadowRoot ?? host.attachShadow({ mode: "open" });
}

const ensureStyleNode = (shadowRoot: ShadowRoot): void => {
    let styleNode = shadowRoot.getElementById(STYLE_NODE_ID) as HTMLStyleElement | null;

    if (!styleNode) {
        styleNode = document.createElement("style");
        styleNode.id = STYLE_NODE_ID;
        shadowRoot.append(styleNode);
    }

    if (styleNode.textContent !== widgetStyles) {
        styleNode.textContent = widgetStyles;
    }
}

const ensureAppNode = (shadowRoot: ShadowRoot): HTMLDivElement => {
    let appNode = shadowRoot.getElementById(APP_NODE_ID) as HTMLDivElement | null;

    if (!appNode) {
        appNode = document.createElement("div");
        appNode.id = APP_NODE_ID;
        shadowRoot.append(appNode);
    }

    return appNode;
}

export function mountChatbotWidget(
    target: string | HTMLElement,
    props: Record<string, unknown> = {}
) {
    const host = resolveHost(target);
    const shadowRoot = ensureShadowRoot(host);

    ensureStyleNode(shadowRoot);
    const appNode = ensureAppNode(shadowRoot);

    let root = widgetRoots.get(host);

    if (!root) {
        root = createRoot(appNode);
        widgetRoots.set(host, root);
    }

    root.render(<ChatbotWidget {...props} />);
}
