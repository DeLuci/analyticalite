import './initWindowGlobals.js';
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx';
import { ChatbotContainerProvider } from '@/context/chatbox.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChatbotContainerProvider>
      <App />
    </ChatbotContainerProvider>
  </React.StrictMode>,
)


