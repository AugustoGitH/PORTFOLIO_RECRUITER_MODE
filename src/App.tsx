"use client"

import { PopoverProvider } from "./components/general/Popover/providers/popover"
import { INTLProvider } from "./providers/intl"
import { Main } from "./screens/Main"
import { RecruiterModeProvider } from "./providers/recruiterMode"

// This is the temporary client boundary for the existing interactive SPA.
// Individual sections can move below server-rendered boundaries once their
// translated content no longer depends on the browser-only provider.
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
