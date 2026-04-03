# AI Chatbot Widget

This chatbot widget was developed for [Agile Alpaca](https://agile-alpaca.com) clients who have used our AI-agent integration services in their online stores. It’s designed for commercial websites to help visitors quickly get answers to their questions and place orders.

![preview](https://github.com/user-attachments/assets/998e8caa-0bb5-430e-b906-e9a77cc928e1)

## Features
- [x] Theme customization – the theme parameter applies predefined styles that change the background, button, and message-bubble colors.
- [x] Animated popup window – the chat window is anchored to the bottom-right corner and opens/collapses with smooth animation.
- [x] Open button + message badge
- [x] External open trigger by element `id`
- [x] Welcome message
- [x] Previous dialogue restoration
- [x] Quick-reply prompts (chat prompts)
- [x] Page context (pageContext) – lets you run arbitrary scripts (e.g., auto-show the chat or display a personalized message) once a visitor has spent timer ms on a specific pathname.
- [x] Full control via context object – the execPageContext function provides external code with a complete set of setters (open, messageOptions, input, promptsOptions) plus a scrollToBottom method, simplifying integration with analytics or business logic.
- [x] Input with Shift+Enter support – pressing Enter sends a message; Shift+Enter inserts a newline.
- [x] Automatic scroll to the latest message
- [x] Responsive design
- [ ] Full-page context handling – ability to send the entire page context to the server along with the user’s message.

## Required API

`apiBaseUrl` must point to a specific public chat endpoint.

The widget uses the same URL for both read/send operations and sends requests with `withCredentials: true`.

### 1) Get dialog/session

- Method: `GET`
- Purpose: load existing dialog and create session (if cookie does not exist yet)
- Response shape:

```json
{
  "data": {
    "sessionUuid": "uuid", // not used now
    "createdAt": "ISO date",
    "messages": [
      {
        "id": 1,
        "text": "Hello",
        "type": "INPUT",
        "sentAt": "ISO date",
        "usage": 10
      }
    ]
  }
}
```

### 2) Send message

- Method: `POST`
- Body:

```json
{
  "text": "User message"
}
```

- Response shape:

```json
{
  "data": {
    "sessionUuid": "uuid", // not used now
    "input": {},
    "output": {
      "text": "Bot reply"
    }
  }
}
```

### 3) Preflight (CORS)

- Method: `OPTIONS`
- Purpose: browser preflight for cross-origin `POST` with credentials

Minimal required CORS headers in API response:
- `Access-Control-Allow-Origin: <exact widget origin>`
- `Access-Control-Allow-Credentials: true`
- `Access-Control-Allow-Methods: GET,POST,OPTIONS`
- `Access-Control-Allow-Headers: Content-Type` (or requested headers)

## Usage
```html
<head>
    <!-- ... -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/ai-chatbot-widget@latest/dist/index.css" />
</head>

<body>
    <!-- ... -->

    <button id="open-chatbot-btn">Open chat</button>
    <div id="chatbot"></div>

    <script src="https://cdn.jsdelivr.net/npm/ai-chatbot-widget@latest/dist/chatbot-widget.iife.js"></script>

    <script>
        const greeting = 'Hello! 👋 I’m the AI assistant.'
        const contactUsMessage = `To get in touch with our manager, please leave your email address 📧, WhatsApp, or phone number 📱.

We'll get back to you during our business hours 🕖 7:00 a.m. – 4:00 p.m. CST.

Thank you for reaching out! 💬`

        const chatPrompts = [
            'I want a custom sign',
            'I want to track my order',
            'What are production and delivery times?',
            'What are your shipping and refund policies?',
            'I have problem with my order'
        ]

        ChatbotWidget.mountChatbotWidget("#chatbot", {
            apiBaseUrl: 'https://api.example.com',
            greeting,
            chatPrompts,
            openTriggerId: 'open-chatbot-btn', // optional: use your own trigger element

            title: 'Bsign Assistant',
            imageUrl: 'https://cdn.shopify.com/s/files/1/0248/8198/7665/files/chatbot-logo.png?v=1750682293',
            imageWidth: '120px',

            // Modify the chat states depending on the user's URL
            pageContext: {
                '/pages/contact-us': {
                    timer: 1000,
                    exec: ({ open, messageOptions }) => { 
                        messageOptions.setMessages(prev => [
                            ...prev, 
                            {content: contactUsMessage, sender: 'bot'}
                        ])
                        open.setIsOpen(true);
                    }
                }
            },
        });
    </script>
</body>
```

### Custom open trigger

If `openTriggerId` is provided, the widget listens for clicks on that element and opens the dialog.

When this prop is used, the built-in floating open button and notification badge are not rendered.

### Themes

Avaible themes: `futuristic`, `lighty`, `boring`, `o Canada`.

The themes are stylized using tailwind, you can see them here: `/widget-vite/src/utils/styles.ts`.

There is currently no solution for creating custom themes by passing props. If needed, you can use plain CSS with the !important directive.

#### lighty

![Screenshot 2025-06-23 at 6 07 37 PM](https://github.com/user-attachments/assets/ac98f294-9e9d-4a61-961c-26c86186d431)

#### boring

![Screenshot 2025-06-23 at 6 07 46 PM](https://github.com/user-attachments/assets/8500550e-4aa3-475e-abed-a38fda720c8a)

#### futuristic

![Screenshot 2025-06-23 at 6 07 19 PM](https://github.com/user-attachments/assets/7201bac1-703a-4ee0-8aed-655f5f53901c)

#### o Canada

![Screenshot 2025-06-23 at 6 07 28 PM](https://github.com/user-attachments/assets/56aa6560-6b96-4680-b4c1-c54dfca76596)

### Widget context

One of the chatbot’s most important features is its ability to manipulate widget states based on the page context (and this functionality will only expand over time).

At the moment, you can only modify states based on the URL the user is visiting.

Example usage:
```typescript
pageContext: {
  '/pages/contact-us': {
    timer: 1000, // after how many ms executed
    exec: ({ open, messageOptions }) => {

        // Adds messages to existing
        messageOptions.setMessages(prev => [
          ...prev,
          { content: "Hello! Do you want to contact us?", sender: 'bot' }
        ]);

        // Automatically expands the widget
        open.setIsOpen(true);
    }
  }
}
```

All modifiable states are:
```typescript
{
    open: {
      isOpen: boolean, // whether the widget is open
      setIsOpen: (v: boolean) => void // open / close the widget
    },

    messageOptions: {
        // All existing messages
        messages: {
          content: string,
          sender: "user" | "bot"
        }[],

        // Function for setting messages
        setMessages: (messages: {
          content: string,
          sender: "user" | "bot"
        }[]) => void,
    },

    // Input field
    input: {
      inputValue: string,
      setInputValue: (value: string) => void,
    },

    // Tips for the user
    promptsOptions: {
      prompts: string[],
      setPrompts: (prompts: string[]) => void
    },

    // Thing that unfortunately doesn't work
    scrollToBottom: () => void
}
```
