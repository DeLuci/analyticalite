import React from 'react';
import Chatbot from './components/chat'; // Adjust the import path as needed
import './App.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import DropdownWithButtons from "@/components/selector-container/index.jsx";
import {TableInfoProvider} from '@/context/db.jsx';

function App() {
  return (
    <div className="App">
      <div className="main-content">
          <div className="menu-content">
              <div className="App-header">
                  <h1>Analyticalite</h1>
              </div>
              <div className="chatbox-history-container">
              </div>
          </div>
          <TableInfoProvider>
              <div className="chatbot-container">
                  <DropdownWithButtons />
                  <Chatbot />
              </div>
          </TableInfoProvider>
      </div>
    </div>
  );
}

export default App;
