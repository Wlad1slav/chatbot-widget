import type { Theme } from "./types";

type Style = Record<Theme, Record<string, string>>;

const themeStyles: Style = {
  futuristic: {
    mainBackground: 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900',
    header: 'from-purple-600 to-blue-600',
    headerLogoBg: 'bg-purple-500',
    headerLogoIcon: 'text-white',
    messageBot: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
    messageUser: 'bg-transparent backdrop-blur-3xl text-white',
    input: 'bg-slate-800/50 border-purple-500/30 text-white placeholder-slate-400 focus:ring-purple-500 focus:border-transparent',
    sendButton: 'text-white',
    prompt: 'bg-black/50 backdrop-blur-3xl text-white'
  },
  boring: {
    mainBackground: 'bg-white',
    header: 'bg-black/90',
    headerLogoIcon: 'text-white',
    messageBot: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
    messageUser: 'bg-black/80 text-white',
    input: 'border-purple-500/30 placeholder-slate-400 focus:ring-purple-500 focus:border-transparent',
    sendButton: 'text-purple-500',
    prompt: 'bg-gradient-to-br from-black/80 to-black/90 text-white'
  }
}

export const getStyle = (theme: Theme, key: string) => {
    return themeStyles[theme][key] ?? '';
}