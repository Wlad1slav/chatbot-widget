import type React from "react"

import { useMemo, useState, useRef, useEffect } from "react"

import "./widget.css"
import ChatbotHeader from "./components/chatbot-header"
import type { Message, Theme } from "./utils/types"
import ChatbotMessage from "./components/chatbot-message"
import TypingIndicator from "./components/typing-indicator"
import { getStyle } from "./utils/styles"
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

export type ChatbotWidgetProps = {
  theme?: Theme,
  notificationBadge?: boolean,

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

const mapApiMessage = (message: PublicChatApiMessage): Message => ({
  content: message.text,
  sender: message.type === "INPUT" ? "user" : "bot"
});

export default function ChatbotWidget({
  theme = 'boring',
  notificationBadge = true,
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
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [prompts, setPrompts] = useState<string[]>(chatPrompts)
  const [displayNotify, setDisplayNotify] = useState(notificationBadge)

  // If this is a shitty Facebook browser, 
  // class fb-ios-webview set for the widget
  useFbIosWebviewClass();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // trigger for new messages
  useEffect(() => {
    const countUserMessages = messages.filter(message => message.sender === 'user');

    if (countUserMessages.length > 0) setShowPrompts(false);
    else setShowPrompts(true);

    scrollToBottom()
  }, [messages])

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

  return (
    <div className="fixed bottom-1 right-1 md:bottom-6 md:right-6 z-50 ai-chatbot ">
      {/* Chat Window */}
      <div
        className={`
        absolute bottom-15 sm:bottom-16 right-0 w-86 sm:w-96 h-[65vh] 
        transform transition-all duration-300 ease-in-out origin-bottom-right
        ai-chatbot-window
        ${isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0 pointer-events-none"}
      `}
      >
        <div className={`${getStyle(theme, 'mainBackground')} rounded-4xl shadow-2xl backdrop-blur-xl h-full flex flex-col overflow-hidden`}>
          {/* Header */}
          <ChatbotHeader setIsOpen={setIsOpen} theme={theme} title={title} imageUrl={imageUrl} imageWidth={imageWidth} />

          {/* Messages */}
          <div className="flex-1 flex flex-col h-full justify-between overflow-y-auto p-2 lg:p-4 space-y-2 lg:space-y-4 scrollbar-thin scrollbar-thumb-purple-500/50 scrollbar-track-transparent">
            <div className="space-y-4 ">
              {messages.map((message, index) => (
                <ChatbotMessage key={`${message.sender}-${index}`} message={message} index={index} theme={theme} />
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <TypingIndicator />
              )}
              <div ref={messagesEndRef} />

            </div>
            {/* Prompts, suggestions */}
            {showPrompts && <div className="flex gap-2 flex-wrap">
              {prompts.map(prompt => (
                <ChatbotPrompt key={prompt} prompt={prompt} handleSendMessage={handleSendMessage} theme={theme} />
              ))}
            </div>}
          </div>

          {/* Input */}
          <ChatbotInput handleKeyPress={handleKeyPress} inputValue={inputValue} setInputValue={setInputValue} handleSendMessage={() => handleSendMessage()} theme={theme} />
        </div>
      </div>

      {(greetingOutside && greeting && !isOpen && displayNotify) && (
        <div className="pb-2">
          <ChatbotMessage message={{
            content: greeting,
            sender: 'bot'
          }} index={0} theme={theme} margin={false} />
        </div>
      )}

      {/* Chat Button */}
      <ChatbotOpenButton isOpen={isOpen} setIsOpen={setIsOpen} theme={theme} />

      {(!isOpen && displayNotify && !greetingOutside) && (<NotificationBadge theme={theme} />)}
    </div>
  )
}
