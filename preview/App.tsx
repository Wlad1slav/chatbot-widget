import ChatbotWidget, { type WidgetContext } from './widget'

function App() {
  return (
    <>
      <ChatbotWidget
        chatbotUrl={import.meta.env.VITE_TEST_API}
        dialogeBaseUrl={import.meta.env.VITE_TEST_API_DIALOGE}
        theme='boring'
        pageContext={{
          '/': {
            timer: 0,
            exec: ({ open }: WidgetContext) => { open.setIsOpen(true) }
          }
        }}
        chatPrompts={['Hello', 'About us', 'Help me']}
      />
    </>
  )
}

export default App
