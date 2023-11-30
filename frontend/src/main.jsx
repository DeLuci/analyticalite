import './initWindowGlobals.js';
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx';
import { ChatbotContainerProvider } from '@/context/chatbox.jsx';
import { MenuContainerProvider } from './context/menu.jsx';
import { DatabaseUpdateProvider } from '@/context/databaseUpdateContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <DatabaseUpdateProvider>
          <MenuContainerProvider>
              <ChatbotContainerProvider>
                  <App/>
              </ChatbotContainerProvider>
          </MenuContainerProvider>
      </DatabaseUpdateProvider>
  </React.StrictMode>,
)


