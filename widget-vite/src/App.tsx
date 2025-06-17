import ChatbotWidget, { type WidgetContext } from './widget'

function App() {

  return (
    <>
      <ChatbotWidget
        placeholder
        theme='boring'
        pageContext={{
          '/': {
            timer: 0,
            exec: ({open}: WidgetContext) => {open.setIsOpen(true)}
          }
        }}
      />
    </>
  )
}

export default App
