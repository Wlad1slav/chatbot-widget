import type React from "react"

import { useState, useRef, useEffect } from "react"
import { MessageCircle, X, Send } from "lucide-react"

import "./widget.css"
import ChatbotHeader from "./components/chatbot-header"
import type { Message, Theme } from "./utils/types"
import ChatbotMessage from "./components/chatbot-message"
import TypingIndicator from "./components/typing-indicator"
import { placeholderMessages } from "./utils/placeholders"
import { getStyle } from "./utils/styles"
import NotificationBadge from "./components/notification-badge"

export default function ChatbotWidget({ theme = 'boring', placeholder = false, notificationBadge = true }: {
  theme?: Theme,
  placeholder?: boolean,
  notificationBadge?: boolean,
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>(placeholder ? placeholderMessages : [])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, newMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "Thanks for your message! This is a demo response. In a real implementation, this would connect to an AI service.",
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botResponse])
      setIsTyping(false)
    }, 1500)
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
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-purple-500/50 scrollbar-track-transparent">
            {messages.map((message, index) => (
              <ChatbotMessage key={message.id} message={message} index={index} theme={theme} />
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <TypingIndicator />
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <ChatbotInput handleKeyPress={handleKeyPress} inputValue={inputValue} setInputValue={setInputValue} handleSendMessage={handleSendMessage} theme={theme} />
        </div>
      </div>

      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-14 h-14 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700
          rounded-full shadow-2xl flex items-center justify-center text-white
          transition-all duration-300 transform hover:scale-110 active:scale-95
          ${isOpen ? "rotate-180" : "rotate-0"}
        `}
        style={{
          boxShadow: "0 0 30px rgba(147, 51, 234, 0.5)",
        }}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {(!isOpen && notificationBadge)&& ( <NotificationBadge /> )}
    </div>
  )
}
