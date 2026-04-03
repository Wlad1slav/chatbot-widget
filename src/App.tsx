import ChatbotWidget, { type WidgetContext } from './widget'

function App() {

  return (
    <>
      <div className='flex w-full justify-center'>
        <button id="open-chatbot-btn">Open chat</button>
      </div>
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
        openTriggerId='open-chatbot-btn'
        position={{
          mode: 'trigger',
          offsetX: -240,
          offsetY: 320
        }}
      />
    </>
  )
}

export default App
