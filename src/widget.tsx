import type React from "react"

import { useMemo, useState, useRef, useEffect, useCallback } from "react"

import "./widget.css"
import ChatbotHeader from "./components/chatbot-header"
import type { Message, ThemeInput, ThemeTokens } from "./utils/types"
import ChatbotMessage from "./components/chatbot-message"
import TypingIndicator from "./components/typing-indicator"
import { resolveThemeTokens, toThemeCssVariables } from "./utils/styles"
import NotificationBadge from "./components/notification-badge"
import ChatbotInput from "./components/chatbot-input"
import ChatbotOpenButton from "./components/chatbot-open-btn"
import { sleep } from "./utils/helpers"
import ChatbotPrompt from "./components/chatbot-prompt"
import { getDialog, sendMessageToBot, type PublicChatApiMessage } from "./utils/api"
import { useFbIosWebviewClass } from "./hooks/useFbIosWebviewClass"

export type WidgetContext = {
  open: {
    isOpen: boolean,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  },
  messageOptions: {
    messages: Message[],
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  },
  input: {
    inputValue: string,
    setInputValue: React.Dispatch<React.SetStateAction<string>>,
  },
  promptsOptions: {
    prompts: string[],
    setPrompts: React.Dispatch<React.SetStateAction<string[]>>
  },
  scrollToBottom: () => void
};

export type WidgetPositionPreset =
  | "bottom-right"
  | "bottom-left"
  | "top-right"
  | "top-left"
  | "bottom-center"
  | "top-center"
  | "center-right"
  | "center-left"
  | "center";

export type WidgetPositionMode = "preset" | "coordinates" | "trigger";

export type WidgetPosition = {
  mode?: WidgetPositionMode;
  preset?: WidgetPositionPreset;
  x?: number | string;
  y?: number | string;
  gap?: number;
  offsetX?: number;
  offsetY?: number;
};

export type MessageInputPosition = "bottom" | "top";

export type ChatbotWidgetProps = {
  theme?: ThemeInput,
  themeTokens?: Partial<ThemeTokens>,
  notificationBadge?: boolean,
  openTriggerId?: string,
  position?: WidgetPosition,
  messageInputPosition?: MessageInputPosition;

  // Function to execute depending on the page the user is on
  // Context contains all methods for working with the widget context
  pageContext?: Record<string, {
    exec: (context: WidgetContext) => void;
    timer: number; // How long the user needs to be on the page to call the function (ms)
  }>;

  chatPrompts?: string[];
  apiBaseUrl: string;
  greeting?: string;
  greetingOutside?: boolean;

  title?: string;
  imageUrl?: string;
  imageWidth?: string;
}

const PRESET_LAYOUTS: Record<WidgetPositionPreset, {
  containerClassName: string;
  windowClassName: string;
  windowOriginClassName: string;
}> = {
  "bottom-right": {
    containerClassName: "bottom-1 right-1 md:bottom-6 md:right-6",
    windowClassName: "bottom-15 sm:bottom-16 right-0",
    windowOriginClassName: "origin-bottom-right"
  },
  "bottom-left": {
    containerClassName: "bottom-1 left-1 md:bottom-6 md:left-6",
    windowClassName: "bottom-15 sm:bottom-16 left-0",
    windowOriginClassName: "origin-bottom-left"
  },
  "top-right": {
    containerClassName: "top-1 right-1 md:top-6 md:right-6",
    windowClassName: "top-15 sm:top-16 right-0",
    windowOriginClassName: "origin-top-right"
  },
  "top-left": {
    containerClassName: "top-1 left-1 md:top-6 md:left-6",
    windowClassName: "top-15 sm:top-16 left-0",
    windowOriginClassName: "origin-top-left"
  },
  "bottom-center": {
    containerClassName: "bottom-1 left-1/2 -translate-x-1/2 md:bottom-6",
    windowClassName: "bottom-15 sm:bottom-16 left-1/2 -translate-x-1/2",
    windowOriginClassName: "origin-bottom"
  },
  "top-center": {
    containerClassName: "top-1 left-1/2 -translate-x-1/2 md:top-6",
    windowClassName: "top-15 sm:top-16 left-1/2 -translate-x-1/2",
    windowOriginClassName: "origin-top"
  },
  "center-right": {
    containerClassName: "top-1/2 right-1 -translate-y-1/2 md:right-6",
    windowClassName: "top-1/2 right-15 sm:right-16 -translate-y-1/2",
    windowOriginClassName: "origin-right"
  },
  "center-left": {
    containerClassName: "top-1/2 left-1 -translate-y-1/2 md:left-6",
    windowClassName: "top-1/2 left-15 sm:left-16 -translate-y-1/2",
    windowOriginClassName: "origin-left"
  },
  "center": {
    containerClassName: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
    windowClassName: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
    windowOriginClassName: "origin-center"
  }
};

const DEFAULT_POSITION_PRESET: WidgetPositionPreset = "bottom-right";

const mapApiMessage = (message: PublicChatApiMessage): Message => ({
  content: message.text,
  sender: message.type === "INPUT" ? "user" : "bot"
});

const toCssLength = (value: number | string | undefined): string | undefined => {
  if (typeof value === "number") return `${value}px`;
  if (typeof value === "string") return value;
  return undefined;
};

const isWidgetPositionPreset = (value: unknown): value is WidgetPositionPreset => {
  return typeof value === "string" && value in PRESET_LAYOUTS;
};

export default function ChatbotWidget({
  theme = 'boring',
  themeTokens,
  notificationBadge = true,
  openTriggerId,
  position,
  messageInputPosition = "bottom",
  greeting,
  pageContext,
  chatPrompts = [],
  apiBaseUrl,
  title = 'AI Assistant',
  imageUrl,
  imageWidth,
  greetingOutside = false
}: ChatbotWidgetProps) {
  const greetingMsg = useMemo<Message[]>(
    () => (greeting ? [{ content: greeting, sender: 'bot' }] : []),
    [greeting]
  );

  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>(greeting ? greetingMsg : [])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [showPrompts, setShowPrompts] = useState(true)
  const [isDialogLoaded, setIsDialogLoaded] = useState(false)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const [prompts, setPrompts] = useState<string[]>(chatPrompts)
  const [displayNotify, setDisplayNotify] = useState(notificationBadge)
  const normalizedOpenTriggerId = openTriggerId?.trim()
  const shouldRenderDefaultOpenButton = !normalizedOpenTriggerId
  const [triggerWindowInlineStyle, setTriggerWindowInlineStyle] = useState<React.CSSProperties>()

  const requestedPositionMode: WidgetPositionMode = position?.mode ?? "preset"
  const hasCoordinates = position?.x !== undefined && position?.y !== undefined
  const canUseTriggerMode = requestedPositionMode === "trigger" && Boolean(normalizedOpenTriggerId)
  const effectivePositionMode: WidgetPositionMode = canUseTriggerMode
    ? "trigger"
    : requestedPositionMode === "coordinates" && hasCoordinates
      ? "coordinates"
      : "preset"

  const resolvedPreset: WidgetPositionPreset = isWidgetPositionPreset(position?.preset)
    ? position.preset
    : DEFAULT_POSITION_PRESET

  const presetLayout = PRESET_LAYOUTS[resolvedPreset]
  const resolvedTheme = useMemo(
    () => resolveThemeTokens(theme, themeTokens),
    [theme, themeTokens]
  );
  const themeCssVariables = useMemo(
    () => toThemeCssVariables(resolvedTheme),
    [resolvedTheme]
  );

  const updateTriggerWindowPosition = useCallback((explicitTriggerElement?: HTMLElement | null) => {
    if (effectivePositionMode !== "trigger") return;

    const triggerElement = explicitTriggerElement ?? (
      normalizedOpenTriggerId ? document.getElementById(normalizedOpenTriggerId) : null
    );
    if (!triggerElement) return;

    const rect = triggerElement.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const sidePadding = 12;
    const gap = position?.gap ?? 12;
    const offsetX = position?.offsetX ?? 0;
    const offsetY = position?.offsetY ?? 0;

    const windowWidth = Math.min(384, viewportWidth - sidePadding * 2);
    const windowHeight = Math.min(
      Math.round(viewportHeight * 0.65),
      viewportHeight - sidePadding * 2
    );

    const canFitRight = rect.right + gap + windowWidth + sidePadding <= viewportWidth;

    let left = canFitRight
      ? rect.right + gap + offsetX
      : rect.left - windowWidth - gap + offsetX;

    left = Math.min(
      Math.max(sidePadding, left),
      viewportWidth - windowWidth - sidePadding
    );

    let top = rect.top + (rect.height / 2) - (windowHeight / 2) + offsetY;

    top = Math.min(
      Math.max(sidePadding, top),
      viewportHeight - windowHeight - sidePadding
    );

    setTriggerWindowInlineStyle({
      left: `${left}px`,
      top: `${top}px`,
      width: `${windowWidth}px`,
      bottom: "auto"
    });
  }, [
    effectivePositionMode,
    normalizedOpenTriggerId,
    position?.gap,
    position?.offsetX,
    position?.offsetY
  ]);

  // If this is a shitty Facebook browser, 
  // class fb-ios-webview set for the widget
  useFbIosWebviewClass();

  useEffect(() => {
    if (requestedPositionMode === "trigger" && !normalizedOpenTriggerId) {
      console.warn(`[ChatbotWidget] "position.mode=trigger" requires "openTriggerId". Falling back to preset mode.`);
    }

    if (requestedPositionMode === "coordinates" && !hasCoordinates) {
      console.warn(`[ChatbotWidget] "position.mode=coordinates" requires both "x" and "y". Falling back to preset mode.`);
    }
  }, [hasCoordinates, normalizedOpenTriggerId, requestedPositionMode]);

  useEffect(() => {
    if (!normalizedOpenTriggerId) return;

    const handleTriggerClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const triggerElement = document.getElementById(normalizedOpenTriggerId);
      if (!triggerElement) return;

      if (triggerElement === target || triggerElement.contains(target)) {
        if (effectivePositionMode === "trigger") {
          updateTriggerWindowPosition(triggerElement);
        }
        setIsOpen(true);
      }
    };

    document.addEventListener("click", handleTriggerClick);
    return () => {
      document.removeEventListener("click", handleTriggerClick);
    };
  }, [effectivePositionMode, normalizedOpenTriggerId, updateTriggerWindowPosition]);

  useEffect(() => {
    if (effectivePositionMode !== "trigger" || !isOpen) return;

    const handleViewportChange = () => {
      updateTriggerWindowPosition();
    };

    handleViewportChange();
    window.addEventListener("resize", handleViewportChange);
    window.addEventListener("scroll", handleViewportChange, true);

    return () => {
      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener("scroll", handleViewportChange, true);
    };
  }, [effectivePositionMode, isOpen, updateTriggerWindowPosition]);

  const scrollToBottom = useCallback(() => {
    const messagesContainer = messagesContainerRef.current;
    if (!messagesContainer) return;

    messagesContainer.scrollTo({
      top: messagesContainer.scrollHeight,
      behavior: "smooth"
    });
  }, []);

  const scrollToLatestMessage = useCallback(() => {
    const messagesContainer = messagesContainerRef.current;
    if (!messagesContainer) return;

    if (messageInputPosition === "top") {
      messagesContainer.scrollTo({
        top: 0,
        behavior: "smooth"
      });
      return;
    }

    messagesContainer.scrollTo({
      top: messagesContainer.scrollHeight,
      behavior: "smooth"
    });
  }, [messageInputPosition]);

  // trigger for new messages
  useEffect(() => {
    const countUserMessages = messages.filter(message => message.sender === 'user');

    if (countUserMessages.length > 0) setShowPrompts(false);
    else setShowPrompts(true);

    scrollToLatestMessage()
  }, [messages, scrollToLatestMessage])

  useEffect(() => {
    setMessages(greeting ? [{ content: greeting, sender: 'bot' }] : []);
    setIsDialogLoaded(false);
  }, [apiBaseUrl, greeting]);

  // get last dialog
  useEffect(() => {
    if (isOpen && !isDialogLoaded) {
      getDialog({ apiBaseUrl })
        .then(dialog => {
          const history = dialog.map(mapApiMessage);
          setMessages([...greetingMsg, ...history]);
          setIsDialogLoaded(true);
        })
        .catch(error => {
          console.error("Failed to load chat history", error);
        });
    }
  }, [apiBaseUrl, greetingMsg, isDialogLoaded, isOpen]);

  // exec additional actions with the context
  useEffect(() => {
    const currentPath = window.location.pathname;

    if (pageContext) {
      for (const [path, { exec, timer }] of Object.entries(pageContext)) {
        if (path === currentPath) {
          execPageContext(timer, exec);
          break;
        }
      }
    }
    // pageContext should trigger only when mapping changes, not on each state update.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageContext]);

  useEffect(() => {
    if (isOpen && displayNotify) {
      setDisplayNotify(false)
    }
  }, [displayNotify, isOpen])

  const execPageContext = async (timer: number, exec: (context: WidgetContext) => void) => {
    await sleep(timer);
    exec({
      open: { isOpen, setIsOpen },
      messageOptions: { messages, setMessages },
      input: { inputValue, setInputValue },
      promptsOptions: { prompts, setPrompts },
      scrollToBottom
    });
  }

  const handleSendMessage = async (customeInput?: string) => {
    // if (input) setInputValue(input)
    const input = customeInput ? customeInput : inputValue.trim();
    if (!input) return

    // add user message
    const newMessage: Message = {
      content: input,
      sender: "user",
    }
    setMessages((prev) => [...prev, newMessage])

    setInputValue("")
    setIsTyping(true)

    try {
      const answer = await sendMessageToBot(input, { apiBaseUrl })

      const botResponse: Message = {
        content: answer,
        sender: "bot",
      }
      setMessages((prev) => [...prev, botResponse])
    } catch {
      const errorMessage: Message = {
        content:
          "Unfortunately, an error occurred while processing your request.",
        sender: "bot",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }

  }

  const handleKeyPress = async (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      await handleSendMessage()
    }
  }

  const widgetContainerClassName = effectivePositionMode === "coordinates"
    ? "fixed z-50 ai-chatbot ai-chatbot-root"
    : `fixed z-50 ai-chatbot ai-chatbot-root ${presetLayout.containerClassName}`

  const widgetContainerInlineStyle: React.CSSProperties = {
    ...(effectivePositionMode === "coordinates"
      ? {
        left: toCssLength(position?.x),
        top: toCssLength(position?.y)
      }
      : {}),
    ...themeCssVariables
  };

  const chatWindowClassName = `
    ${effectivePositionMode === "trigger" ? "fixed" : `absolute ${presetLayout.windowClassName} ${presetLayout.windowOriginClassName}`}
    w-86 sm:w-96 h-[65vh] 
    transform transition-all duration-300 ease-in-out
    ai-chatbot-window
    ${isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0 pointer-events-none"}
  `

  const chatWindowInlineStyle: React.CSSProperties | undefined = effectivePositionMode === "trigger"
    ? triggerWindowInlineStyle ?? { right: "16px", bottom: "80px", top: "auto" }
    : undefined

  const orderedMessages = messageInputPosition === "top"
    ? messages.map((message, index) => ({ message, index })).reverse()
    : messages.map((message, index) => ({ message, index }));

  const header = (
    <ChatbotHeader setIsOpen={setIsOpen} title={title} imageUrl={imageUrl} imageWidth={imageWidth} />
  );

  const input = (
    <ChatbotInput handleKeyPress={handleKeyPress} inputValue={inputValue} setInputValue={setInputValue} handleSendMessage={() => handleSendMessage()} />
  );

  return (
    <div className={widgetContainerClassName} style={widgetContainerInlineStyle}>
      {/* Chat Window */}
      <div
        className={chatWindowClassName}
        style={chatWindowInlineStyle}
      >
        <div
          className={`ai-chatbot-window-surface rounded-4xl shadow-2xl backdrop-blur-xl h-full flex flex-col overflow-hidden ${messageInputPosition === "top" ? "ai-chatbot-window-surface--input-top" : ""}`}
        >
          {messageInputPosition === "top" ? input : header}

          {/* Messages */}
          <div
            ref={messagesContainerRef}
            className="ai-chatbot__messages flex-1 flex flex-col h-full justify-between overflow-y-auto p-2 lg:p-4 space-y-2 lg:space-y-4"
          >
            <div className="space-y-4 ">
              {isTyping && messageInputPosition === "top" && (
                <TypingIndicator />
              )}

              {orderedMessages.map(({ message, index }, orderIndex) => (
                <ChatbotMessage key={`${message.sender}-${index}`} message={message} index={orderIndex} />
              ))}

              {/* Typing Indicator */}
              {isTyping && messageInputPosition === "bottom" && (
                <TypingIndicator />
              )}

            </div>
            {/* Prompts, suggestions */}
            {showPrompts && <div className="flex gap-2 flex-wrap">
              {prompts.map(prompt => (
                <ChatbotPrompt key={prompt} prompt={prompt} handleSendMessage={handleSendMessage} />
              ))}
            </div>}
          </div>

          {messageInputPosition === "top" ? header : input}
        </div>
      </div>

      {(greetingOutside && greeting && !isOpen && displayNotify) && (
        <div className="pb-2">
          <ChatbotMessage message={{
            content: greeting,
            sender: 'bot'
          }} index={0} margin={false} />
        </div>
      )}

      {/* Chat Button */}
      {shouldRenderDefaultOpenButton && (
        <ChatbotOpenButton isOpen={isOpen} setIsOpen={setIsOpen} />
      )}

      {(shouldRenderDefaultOpenButton && !isOpen && displayNotify && !greetingOutside) && (<NotificationBadge />)}
    </div>
  )
}
