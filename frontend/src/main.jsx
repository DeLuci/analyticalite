import './initWindowGlobals.js';
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx';
import { ChatbotContainerProvider } from '@/context/chatbox.jsx';
import { MenuContainerProvider } from './context/menu.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MenuContainerProvider>
      <ChatbotContainerProvider>
        <App />
      </ChatbotContainerProvider>
    </MenuContainerProvider>
  </React.StrictMode>,
)


