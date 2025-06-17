import type React from "react"

import { useState, useRef, useEffect } from "react"

import "./widget.css"
import ChatbotHeader from "./components/chatbot-header"
import type { Message, Theme } from "./utils/types"
import ChatbotMessage from "./components/chatbot-message"
import TypingIndicator from "./components/typing-indicator"
import { placeholderMessages } from "./utils/placeholders"
import { getStyle } from "./utils/styles"
import NotificationBadge from "./components/notification-badge"
import ChatbotInput from "./components/chatbot-input"
import ChatbotOpenButton from "./components/chatbot-open-btn"
import { sleep } from "./utils/helpers"
import ChatbotPrompt from "./components/chatbot-prompt"

export type WidgetContext = {
  open: {
    isOpen: boolean,
    setIsOpen: (v: boolean) => void
  },
  messageOptions: {
    messages: Message[],
    setMessages: (messages: Message[]) => void,
  },
  input: {
    inputValue: string,
    setInputValue: (value: string) => void,
  },
  promptsOptions: {
    prompts: string[],
    setPrompts: (prompts: string[]) => void
  }
};

export default function ChatbotWidget({ theme = 'boring', placeholder = false, notificationBadge = true, pageContext, chatPrompts = [] }: {
  theme?: Theme,
  placeholder?: boolean,
  notificationBadge?: boolean,

  // Function to execute depending on the page the user is on
  // Context contains all methods for working with the widget context
  pageContext?: Record<string, {
    exec: (context: WidgetContext) => void;
    timer: number; // How long the user needs to be on the page to call the function (ms)
  }>;

  chatPrompts?: string[];
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>(placeholder ? placeholderMessages : [])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [showPrompts, setShowPrompts] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [prompts, setPrompts] = useState<string[]>(chatPrompts)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    const countUserMessages = messages.filter(message => message.sender === 'user');

    if (countUserMessages.length > 0) setShowPrompts(false);
    else setShowPrompts(true);

    scrollToBottom()
  }, [messages])

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
  }, [pageContext]);

  const execPageContext = async (timer: number, exec: (context: WidgetContext) => void) => {
    await sleep(timer);
    exec({
      open: { isOpen, setIsOpen },
      messageOptions: { messages, setMessages },
      input: { inputValue, setInputValue },
      promptsOptions: {prompts, setPrompts}
    });
  }

  const handleSendMessage = (customeInput?: string) => {
    // if (input) setInputValue(input)
    const input = customeInput ? customeInput : inputValue.trim();
    if (!input) return

    const newMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, newMessage])
    setInputValue("")
    setIsTyping(true)

    const botResponse: Message = {
      id: (Date.now() + 1).toString(),
      content:
        "Thanks for your message! This is a demo response. In a real implementation, this would connect to an AI service.",
      sender: "bot",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, botResponse])
    setIsTyping(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      <div
        className={`
        absolute bottom-16 right-0 w-96 h-[700px] 
        transform transition-all duration-300 ease-in-out origin-bottom-right
        ${isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0 pointer-events-none"}
      `}
      >
        <div className={`${getStyle(theme, 'mainBackground')} rounded-4xl shadow-2xl backdrop-blur-xl h-full flex flex-col overflow-hidden`}>
          {/* Header */}
          <ChatbotHeader setIsOpen={setIsOpen} theme={theme} />

          {/* Messages */}
          <div className="flex-1 flex flex-col h-full justify-between overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-purple-500/50 scrollbar-track-transparent">
            <div className="space-y-4 ">
              {messages.map((message, index) => (
                <ChatbotMessage key={message.id} message={message} index={index} theme={theme} />
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
          <ChatbotInput handleKeyPress={handleKeyPress} inputValue={inputValue} setInputValue={setInputValue} handleSendMessage={handleSendMessage} theme={theme} />
        </div>
      </div>

      {/* Chat Button */}
      <ChatbotOpenButton isOpen={isOpen} setIsOpen={setIsOpen} />

      {(!isOpen && notificationBadge) && (<NotificationBadge />)}
    </div>
  )
}
