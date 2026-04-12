import { createRoot, type Root } from "react-dom/client";
import ChatbotWidget from "./widget";
import widgetStyles from "./widget.css?inline";

const widgetRoots = new WeakMap<HTMLElement, Root>();
const STYLE_NODE_ID = "ai-chatbot-widget-style";
const CUSTOM_STYLE_NODE_ID = "ai-chatbot-widget-custom-style";
const APP_NODE_ID = "ai-chatbot-widget-root";

export type MountChatbotWidgetOptions = {
    styles?: string | string[];
};

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

const normalizeStyles = (styles?: string | string[]): string => {
    if (!styles) return "";

    const styleList = Array.isArray(styles) ? styles : [styles];

    return styleList
        .map((item) => item.trim())
        .filter(Boolean)
        .join("\n");
}

const ensureCustomStyleNode = (shadowRoot: ShadowRoot, styles?: string | string[]): void => {
    const customStyles = normalizeStyles(styles);
    let customStyleNode = shadowRoot.getElementById(CUSTOM_STYLE_NODE_ID) as HTMLStyleElement | null;

    if (!customStyles) {
        if (customStyleNode) customStyleNode.remove();
        return;
    }

    if (!customStyleNode) {
        customStyleNode = document.createElement("style");
        customStyleNode.id = CUSTOM_STYLE_NODE_ID;
        shadowRoot.append(customStyleNode);
    }

    const defaultStyleNode = shadowRoot.getElementById(STYLE_NODE_ID);

    if (defaultStyleNode && customStyleNode.previousElementSibling !== defaultStyleNode) {
        defaultStyleNode.after(customStyleNode);
    }

    if (customStyleNode.textContent !== customStyles) {
        customStyleNode.textContent = customStyles;
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
    props: Record<string, unknown> = {},
    options: MountChatbotWidgetOptions = {}
) {
    const host = resolveHost(target);
    const shadowRoot = ensureShadowRoot(host);

    ensureStyleNode(shadowRoot);
    ensureCustomStyleNode(shadowRoot, options.styles);
    const appNode = ensureAppNode(shadowRoot);

    let root = widgetRoots.get(host);

    if (!root) {
        root = createRoot(appNode);
        widgetRoots.set(host, root);
    }

    root.render(<ChatbotWidget {...props} />);
}
