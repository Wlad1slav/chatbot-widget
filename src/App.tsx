import ChatbotWidget, { type WidgetContext } from './widget'

function App() {

  return (
    <>
      <ChatbotWidget
        apiBaseUrl={import.meta.env.VITE_TEST_API_BASE_URL}
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
