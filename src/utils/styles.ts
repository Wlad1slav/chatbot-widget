import type React from "react";
import type { Theme, ThemeConfig, ThemeInput, ThemeTokens } from "./types";

const DEFAULT_THEME: Theme = "boring";

const BASE_THEME_TOKENS: ThemeTokens = {
  fontFamily: '"Inter", "Segoe UI", Tahoma, sans-serif',
  surfaceBackground: "#ffffff",
  surfaceTextColor: "#111111",
  surfaceShadow: "0 25px 50px -12px rgb(0 0 0 / 0.25)",
  surfaceShadowTop: "0 -25px 50px -12px rgb(0 0 0 / 0.25)",
  headerBackground: "linear-gradient(90deg, rgba(24, 24, 27, 0.95), rgba(9, 9, 11, 0.95))",
  headerTitleColor: "#ffffff",
  headerSubtitleColor: "#d4d4d8",
  headerLogoBackground: "transparent",
  headerLogoColor: "#ffffff",
  closeButtonColor: "#ffffff",
  closeButtonHoverBackground: "rgba(255, 255, 255, 0.18)",
  botMessageBackground: "rgba(24, 24, 27, 0.9)",
  botMessageTextColor: "#ffffff",
  botMessageIconColor: "#ffffff",
  userMessageBackground: "rgba(255, 255, 255, 0.8)",
  userMessageTextColor: "#111111",
  userMessageIconColor: "#111111",
  inputContainerBorderColor: "rgba(0, 0, 0, 0.12)",
  inputBackground: "#ffffff",
  inputBorderColor: "rgba(0, 0, 0, 0.2)",
  inputTextColor: "#111111",
  inputPlaceholderColor: "#64748b",
  sendButtonColor: "#111111",
  promptBackground: "linear-gradient(135deg, rgba(24, 24, 27, 0.85), rgba(9, 9, 11, 0.92))",
  promptTextColor: "#ffffff",
  openButtonBackground: "linear-gradient(90deg, rgba(24, 24, 27, 0.95), rgba(9, 9, 11, 0.95))",
  openButtonColor: "#ffffff",
  openButtonShadow: "0 0 30px rgba(0, 0, 0, 0.45)",
  badgeBackground: "#ef4444",
  badgeTextColor: "#ffffff",
  typingBackground: "linear-gradient(90deg, #334155, #475569)",
  typingIconColor: "#22d3ee",
  typingDotColor: "#a855f7",
  scrollbarThumbColor: "rgba(71, 85, 105, 0.4)"
};

const THEME_PRESETS: Record<Theme, Partial<ThemeTokens>> = {
  futuristic: {
    surfaceBackground: "linear-gradient(135deg, #0f172a, #4c1d95, #0f172a)",
    surfaceTextColor: "#f8fafc",
    headerBackground: "linear-gradient(90deg, #9333ea, #2563eb)",
    headerSubtitleColor: "#ddd6fe",
    headerLogoBackground: "rgba(168, 85, 247, 0.65)",
    headerLogoColor: "#ffffff",
    botMessageBackground: "linear-gradient(90deg, #a855f7, #ec4899)",
    botMessageTextColor: "#ffffff",
    botMessageIconColor: "#fbcfe8",
    userMessageBackground: "rgba(15, 23, 42, 0.58)",
    userMessageTextColor: "#ffffff",
    userMessageIconColor: "#fbcfe8",
    inputContainerBorderColor: "rgba(168, 85, 247, 0.3)",
    inputBackground: "rgba(15, 23, 42, 0.5)",
    inputBorderColor: "rgba(196, 181, 253, 0.45)",
    inputTextColor: "#ffffff",
    inputPlaceholderColor: "#94a3b8",
    sendButtonColor: "#ffffff",
    promptBackground: "rgba(2, 6, 23, 0.58)",
    promptTextColor: "#ffffff",
    openButtonBackground: "linear-gradient(90deg, #9333ea, #2563eb)",
    openButtonColor: "#ffffff",
    openButtonShadow: "0 0 30px rgba(147, 51, 234, 0.5)",
    badgeBackground: "linear-gradient(90deg, #ec4899, #ef4444)",
    badgeTextColor: "#ffffff",
    typingBackground: "linear-gradient(90deg, rgba(15, 23, 42, 0.95), rgba(51, 65, 85, 0.95))",
    typingIconColor: "#fbcfe8",
    typingDotColor: "#a78bfa",
    scrollbarThumbColor: "rgba(168, 85, 247, 0.5)"
  },
  lighty: {
    headerBackground: "rgba(0, 0, 0, 0.9)",
    headerSubtitleColor: "#ddd6fe",
    botMessageBackground: "linear-gradient(90deg, #a855f7, #ec4899)",
    botMessageTextColor: "#ffffff",
    botMessageIconColor: "#fbcfe8",
    userMessageBackground: "rgba(0, 0, 0, 0.82)",
    userMessageTextColor: "#ffffff",
    userMessageIconColor: "#fbcfe8",
    inputContainerBorderColor: "rgba(168, 85, 247, 0.2)",
    inputBorderColor: "rgba(196, 181, 253, 0.6)",
    sendButtonColor: "#a855f7",
    promptBackground: "linear-gradient(135deg, rgba(0, 0, 0, 0.82), rgba(0, 0, 0, 0.92))",
    promptTextColor: "#ffffff",
    openButtonBackground: "linear-gradient(90deg, #9333ea, #2563eb)",
    openButtonColor: "#ffffff",
    openButtonShadow: "0 0 30px rgba(147, 51, 234, 0.5)",
    badgeBackground: "linear-gradient(90deg, #ec4899, #ef4444)",
    badgeTextColor: "#ffffff",
    typingDotColor: "#a855f7",
    scrollbarThumbColor: "rgba(168, 85, 247, 0.45)"
  },
  boring: {
    headerBackground: "rgba(0, 0, 0, 0.9)",
    headerLogoColor: "#ffffff",
    botMessageBackground: "rgba(0, 0, 0, 0.82)",
    botMessageTextColor: "#ffffff",
    botMessageIconColor: "#ffffff",
    userMessageBackground: "rgba(255, 255, 255, 0.8)",
    userMessageTextColor: "#111111",
    userMessageIconColor: "#111111",
    inputContainerBorderColor: "rgba(0, 0, 0, 0.16)",
    inputBorderColor: "rgba(0, 0, 0, 0.2)",
    sendButtonColor: "rgba(0, 0, 0, 0.8)",
    promptBackground: "linear-gradient(135deg, rgba(0, 0, 0, 0.82), rgba(0, 0, 0, 0.92))",
    promptTextColor: "#ffffff",
    openButtonBackground: "linear-gradient(90deg, rgba(0, 0, 0, 0.82), rgba(0, 0, 0, 0.92))",
    openButtonColor: "#ffffff",
    openButtonShadow: "0 0 30px rgba(0, 0, 0, 0.5)",
    badgeBackground: "#ef4444",
    badgeTextColor: "#ffffff"
  },
  "o Canada": {
    headerBackground: "#016553",
    headerLogoColor: "#ffffff",
    botMessageBackground: "rgba(1, 101, 83, 0.84)",
    botMessageTextColor: "#ffffff",
    botMessageIconColor: "#ffffff",
    userMessageBackground: "rgba(255, 255, 255, 0.8)",
    userMessageTextColor: "#111111",
    userMessageIconColor: "#111111",
    inputContainerBorderColor: "rgba(0, 0, 0, 0.16)",
    inputBorderColor: "rgba(0, 0, 0, 0.2)",
    sendButtonColor: "rgba(0, 0, 0, 0.8)",
    promptBackground: "linear-gradient(135deg, rgba(0, 0, 0, 0.82), rgba(0, 0, 0, 0.92))",
    promptTextColor: "#ffffff",
    openButtonBackground: "linear-gradient(90deg, rgba(1, 101, 83, 0.8), rgba(1, 101, 83, 0.92))",
    openButtonColor: "#ffffff",
    openButtonShadow: "0 0 30px rgba(0, 0, 0, 0.5)",
    badgeBackground: "#D1A205",
    badgeTextColor: "#1A1A1A",
    scrollbarThumbColor: "rgba(1, 101, 83, 0.45)"
  }
};

const THEME_TOKEN_TO_CSS_VARIABLE: Record<keyof ThemeTokens, string> = {
  fontFamily: "--ai-chatbot-font-family",
  surfaceBackground: "--ai-chatbot-surface-background",
  surfaceTextColor: "--ai-chatbot-surface-text-color",
  surfaceShadow: "--ai-chatbot-surface-shadow",
  surfaceShadowTop: "--ai-chatbot-surface-shadow-top",
  headerBackground: "--ai-chatbot-header-background",
  headerTitleColor: "--ai-chatbot-header-title-color",
  headerSubtitleColor: "--ai-chatbot-header-subtitle-color",
  headerLogoBackground: "--ai-chatbot-header-logo-background",
  headerLogoColor: "--ai-chatbot-header-logo-color",
  closeButtonColor: "--ai-chatbot-close-button-color",
  closeButtonHoverBackground: "--ai-chatbot-close-button-hover-bg",
  botMessageBackground: "--ai-chatbot-bot-message-bg",
  botMessageTextColor: "--ai-chatbot-bot-message-color",
  botMessageIconColor: "--ai-chatbot-bot-message-icon-color",
  userMessageBackground: "--ai-chatbot-user-message-bg",
  userMessageTextColor: "--ai-chatbot-user-message-color",
  userMessageIconColor: "--ai-chatbot-user-message-icon-color",
  inputContainerBorderColor: "--ai-chatbot-input-container-border",
  inputBackground: "--ai-chatbot-input-bg",
  inputBorderColor: "--ai-chatbot-input-border",
  inputTextColor: "--ai-chatbot-input-color",
  inputPlaceholderColor: "--ai-chatbot-input-placeholder-color",
  sendButtonColor: "--ai-chatbot-send-button-color",
  promptBackground: "--ai-chatbot-prompt-bg",
  promptTextColor: "--ai-chatbot-prompt-color",
  openButtonBackground: "--ai-chatbot-open-button-bg",
  openButtonColor: "--ai-chatbot-open-button-color",
  openButtonShadow: "--ai-chatbot-open-button-shadow",
  badgeBackground: "--ai-chatbot-badge-bg",
  badgeTextColor: "--ai-chatbot-badge-color",
  typingBackground: "--ai-chatbot-typing-bg",
  typingIconColor: "--ai-chatbot-typing-icon-color",
  typingDotColor: "--ai-chatbot-typing-dot-color",
  scrollbarThumbColor: "--ai-chatbot-scrollbar-thumb"
};

const isThemeConfig = (theme: ThemeInput | undefined): theme is ThemeConfig => {
  if (!theme || typeof theme !== "object") return false;
  return "preset" in theme || "tokens" in theme;
};

export const resolveThemeTokens = (
  theme: ThemeInput | undefined,
  explicitOverrides?: Partial<ThemeTokens>
): ThemeTokens => {
  const themeConfig = isThemeConfig(theme)
    ? theme
    : { preset: theme ?? DEFAULT_THEME };

  const preset = themeConfig.preset ?? DEFAULT_THEME;

  return {
    ...BASE_THEME_TOKENS,
    ...THEME_PRESETS[preset],
    ...themeConfig.tokens,
    ...explicitOverrides
  };
};

export const toThemeCssVariables = (tokens: ThemeTokens): React.CSSProperties => {
  const cssVariables: React.CSSProperties = {};
  const mutableCssVariables = cssVariables as Record<string, string>;

  for (const [tokenName, cssVariableName] of Object.entries(THEME_TOKEN_TO_CSS_VARIABLE) as Array<[keyof ThemeTokens, string]>) {
    mutableCssVariables[cssVariableName] = tokens[tokenName];
  }

  return cssVariables;
};
