import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AnimatedBackground from './component/AnimatedBackground.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
       {/* Background animation behind everything */}
    <AnimatedBackground/>

    <App />
        
  </StrictMode>,
)
