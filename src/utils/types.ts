export type Message = {
    content: string
    sender: "user" | "bot"
};

export type Theme = 'boring' | 'futuristic' | 'lighty' | 'o Canada';

export type ThemeTokens = {
    fontFamily: string;
    surfaceBackground: string;
    surfaceTextColor: string;
    surfaceShadow: string;
    surfaceShadowTop: string;
    headerBackground: string;
    headerTitleColor: string;
    headerSubtitleColor: string;
    headerLogoBackground: string;
    headerLogoColor: string;
    closeButtonColor: string;
    closeButtonHoverBackground: string;
    botMessageBackground: string;
    botMessageTextColor: string;
    botMessageIconColor: string;
    userMessageBackground: string;
    userMessageTextColor: string;
    userMessageIconColor: string;
    inputContainerBorderColor: string;
    inputBackground: string;
    inputBorderColor: string;
    inputTextColor: string;
    inputPlaceholderColor: string;
    sendButtonColor: string;
    promptBackground: string;
    promptTextColor: string;
    openButtonBackground: string;
    openButtonColor: string;
    openButtonShadow: string;
    badgeBackground: string;
    badgeTextColor: string;
    typingBackground: string;
    typingIconColor: string;
    typingDotColor: string;
    scrollbarThumbColor: string;
};

export type ThemeConfig = {
    preset?: Theme;
    tokens?: Partial<ThemeTokens>;
};

export type ThemeInput = Theme | ThemeConfig;
