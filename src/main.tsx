import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'

// NOTE: no <StrictMode> on purpose — its double-mounting breaks Sandpack's bundler clients
// (tests never start). See SPEC.md "Phase 0 findings".
createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
)
