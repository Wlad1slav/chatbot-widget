import { createRoot, type Root } from "react-dom/client";
import ChatbotWidget, { type ChatbotWidgetProps } from "./widget";
import widgetCssText from "./widget.css?inline";

export type MountChatbotWidgetOptions = {
    isolateStyles?: boolean;
};

type WidgetMountHost = HTMLElement & {
    __aiChatbotRoot?: Root;
    __aiChatbotMountNode?: HTMLElement;
};

const STYLE_NODE_SELECTOR = "style[data-ai-chatbot-widget-style]";
const MOUNT_NODE_SELECTOR = "[data-ai-chatbot-widget-mount]";

const ensureShadowMountNode = (target: HTMLElement): HTMLElement => {
    const shadowRoot = target.shadowRoot ?? target.attachShadow({ mode: "open" });

    let styleNode = shadowRoot.querySelector<HTMLStyleElement>(STYLE_NODE_SELECTOR);
    if (!styleNode) {
        styleNode = document.createElement("style");
        styleNode.setAttribute("data-ai-chatbot-widget-style", "true");
        styleNode.textContent = widgetCssText;
        shadowRoot.appendChild(styleNode);
    }

    let mountNode = shadowRoot.querySelector<HTMLElement>(MOUNT_NODE_SELECTOR);
    if (!mountNode) {
        mountNode = document.createElement("div");
        mountNode.setAttribute("data-ai-chatbot-widget-mount", "true");
        shadowRoot.appendChild(mountNode);
    }

    return mountNode;
};

export function mountChatbotWidget(
    target: string | HTMLElement,
    props: ChatbotWidgetProps,
    options: MountChatbotWidgetOptions = {}
) {
    const targetElement =
        typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;

    if (!targetElement) {
        throw new Error(`[ChatbotWidget] Target element "${target}" was not found.`);
    }

    const isolateStyles = options.isolateStyles ?? true;
    const mountNode = isolateStyles ? ensureShadowMountNode(targetElement) : targetElement;
    const mountHost = targetElement as WidgetMountHost;

    if (mountHost.__aiChatbotRoot && mountHost.__aiChatbotMountNode !== mountNode) {
        mountHost.__aiChatbotRoot.unmount();
        mountHost.__aiChatbotRoot = undefined;
    }

    if (!mountHost.__aiChatbotRoot || mountHost.__aiChatbotMountNode !== mountNode) {
        mountHost.__aiChatbotRoot = createRoot(mountNode);
        mountHost.__aiChatbotMountNode = mountNode;
    }

    mountHost.__aiChatbotRoot.render(<ChatbotWidget {...props} />);
}
