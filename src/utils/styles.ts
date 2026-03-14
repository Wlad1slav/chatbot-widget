import type { Theme } from "./types";

type Style = Record<Theme, Record<string, string>>;

const themeStyles: Style = {
  futuristic: {
    mainBackground: 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900',
    header: 'from-purple-600 to-blue-600',
    headerLogoBg: 'bg-purple-500',
    headerLogoIcon: 'text-white',
    messageBot: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
    messageBotIcon: 'text-pink-200',
    messageUser: 'bg-transparent backdrop-blur-3xl text-white',
    messageUserIcon: 'text-pink-200',
    input: 'bg-slate-800/50 border-purple-500/30 text-white placeholder-slate-400 border border-purple-200',
    inputContainer: 'border-t border-purple-500/20',
    sendButton: 'text-white',
    prompt: 'bg-black/50 backdrop-blur-3xl text-white',
    openButton: 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white',
    openButtonShadow: "0 0 30px rgba(147, 51, 234, 0.5)",
    notifyBadge: "bg-gradient-to-r from-pink-500 to-red-500 text-white"
  },
  lighty: {
    mainBackground: 'bg-white',
    header: 'bg-black/90',
    headerLogoIcon: 'text-white',
    messageBot: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
    messageBotIcon: 'text-pink-200',
    messageUser: 'bg-black/80 text-white',
    messageUserIcon: 'text-pink-200',
    input: 'placeholder-slate-400 border border-purple-200',
    inputContainer: 'border-t border-purple-500/20',
    sendButton: 'text-purple-500',
    prompt: 'bg-gradient-to-br from-black/80 to-black/90 text-white',
    openButton: 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white',
    openButtonShadow: "0 0 30px rgba(147, 51, 234, 0.5)",
    notifyBadge: "bg-gradient-to-r from-pink-500 to-red-500 text-white"
  },
  boring: {
    mainBackground: 'bg-white',
    header: 'bg-black/90',
    headerLogoIcon: 'text-white',
    messageBotIcon: 'text-white',
    messageBot: 'bg-black/80 text-white backdrop-blur-xl',
    messageUserIcon: 'text-black',
    messageUser: 'text-black',
    input: 'placeholder-slate-400 border border-black/20',
    inputContainer: 'border-t border-black/20',
    sendButton: 'text-black/80',
    prompt: 'bg-gradient-to-br from-black/80 to-black/90 text-white',
    openButton: 'bg-gradient-to-r from-black/80 to-black/90 text-white',
    openButtonShadow: "0 0 30px rgba(0, 0, 0, 0.5)",
    notifyBadge: "bg-red-500 text-white"
  },
  'o Canada': {
    mainBackground: 'bg-white',
    header: 'bg-[#016553]',
    headerLogoIcon: 'text-white',
    messageBotIcon: 'text-white',
    messageBot: 'bg-[#016553]/80 text-white',
    messageUserIcon: 'text-black',
    messageUser: 'text-black',
    input: 'placeholder-slate-400 border border-black/20',
    inputContainer: 'border-t border-black/20',
    sendButton: 'text-black/80',
    prompt: 'bg-gradient-to-br from-black/80 to-black/90 text-white',
    openButton: 'bg-gradient-to-r from-[#016553]/80 to-[#016553]/90 text-white',
    openButtonShadow: "0 0 30px rgba(0, 0, 0, 0.5)",
    notifyBadge: "bg-[#D1A205] text-[#1A1A1A]"
  }
}

export const getStyle = (theme: Theme, key: string) => {
    return themeStyles[theme][key] ?? '';
}