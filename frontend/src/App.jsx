import React, { useState, useContext } from 'react';
import Chatbot from './components/chat'; // Adjust the import path as needed
import './App.css';
import DropdownWithButtons from "@/components/selector-container/index.jsx";
import {TableInfoProvider} from '@/context/db.jsx';
import {useChatbotContainer} from '@/context/chatbox.jsx';

function App() {
  const [databaseName, setDatabaseName] = useState('');
  const { isShrunk } = useChatbotContainer();

  return (
    <div className="App">
      <div className="main-content">
          <div className="menu-content">
              <div className="app-header">
                  <button type="button" className="btn custom-btn-primary" data-bs-toggle="modal" data-bs-target="#create-database">
                    <span className="custon-btn-container mb-0 mx-2">
                      <span className="logo-container me-3">
                        <i className="bi bi-tropical-storm logo"></i>
                      </span>
                      <span className="button-txt">
                        AnalyticaLite+
                      </span>
                    </span>
                    <i className="bi bi-pencil-square mx-3"></i>  
                  </button>
              </div>
              <div className="app-toolbox">
                  <button type="button" className="btn custom-btn-primary" data-bs-toggle="modal" data-bs-target="#explore">
                    <span className="custon-btn-container mb-0 mx-2">
                      <span className="me-3">
                        <i className="bi bi-columns-gap"></i>
                      </span>
                      <span>
                        Explore
                      </span>
                    </span>
                  </button>
                  <button type="button" className="btn custom-btn-primary" data-bs-toggle="modal" data-bs-target="#faq">
                    <span className="custon-btn-container mb-0 mx-2">
                      <span className="me-3">
                        <i className="bi bi-collection"></i>
                      </span>
                      <span>
                        FAQ
                      </span>
                    </span>
                  </button>
                  <button type="button" className="btn custom-btn-primary" data-bs-toggle="modal" data-bs-target="#github">
                    <span className="custon-btn-container mb-0 mx-2">
                      <span className="me-3">
                        <i className="bi bi-code"></i>
                      </span>
                      <span>
                        Github
                      </span>
                    </span>
                  </button>
              </div>
              <div className="chatbox-history-container">
              </div>
          </div>
          <TableInfoProvider>
                <div className={isShrunk ? "chatbot-container shrink" : "chatbot-container"}>
                    <DropdownWithButtons />
                    <Chatbot />
                </div>
          </TableInfoProvider>
      </div>
      <div className="modal fade" id="create-database" tabIndex="-1" aria-labelledby="exampleModalCenteredScrollableTitle" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalCenteredScrollableTitle">Create a Database</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="form-floating mb-3">
                                    <input type="email" className="form-control" id="floatingInput" name="create_database" value={databaseName} onChange={(e) => setFileName(e.target.value)} placeholder="example_db" />
                                    <label htmlFor="floatingInput">Database Name</label>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-dark" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-success">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
    </div>
  );
}

export default App;
