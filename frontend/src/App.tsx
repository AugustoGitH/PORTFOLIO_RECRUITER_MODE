import { PopoverProvider } from "./components/general/Popover/providers/popover"
import { INTLProvider } from "./providers/intl"
import { Main } from "./pages/Main"
import { RecruiterModeProvider } from "./providers/recruiterMode"

function App() {

  return (
    <INTLProvider>
      <PopoverProvider>
        <RecruiterModeProvider>
          <Main />
        </RecruiterModeProvider>
      </PopoverProvider>
    </INTLProvider>
  )
}

export default App
