// eslint-disable-next-line no-unused-vars
import React, { useState, useContext, useEffect, useRef} from 'react';
import Chatbot from './components/chat'; // Adjust the import path as needed
import './App.css';
import DropdownWithButtons from "@/components/selector-container/index.jsx";
import {TableInfoProvider} from '@/context/db.jsx';
import {useChatbotContainer} from '@/context/chatbox.jsx';
import {useMenuContainer} from '@/context/menu.jsx';
import { useDatabaseUpdateContext } from '@/context/databaseUpdateContext.jsx';

import axios from "axios";

function App() {
  const { isShrunk } = useChatbotContainer();
  const { isMenuHidden, toggleMenu, setIsMenuHidden } = useMenuContainer();
  const menuContainer = useRef(null);
  const [newDatabaseName, setNewDatabaseName] = useState('');
  const { triggerUpdate } = useDatabaseUpdateContext();
  const createDbModal = useRef(null);
  const closeModalButton = useRef(null);
  const handleDatabaseNameChange = (e) => {
      setNewDatabaseName(e.target.value)
  }

  const handleDatabaseSubmit =  (e) => {
      submitDatabase(newDatabaseName).then(() => {
          setNewDatabaseName('')
      }).catch((error) => console.error(error));
      closeDbModal();
      e.preventDefault();
  }

  // Resize Event Listener 
  useEffect(() => {
    const handleResize = () => {
      if(window.innerWidth < 1200){
        toggleMenu(); 
      }
      else {    
        setIsMenuHidden(false);
      }
    };
    handleResize();

    // Add Event Listener
    window.addEventListener('resize', handleResize);
    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const closeDbModal = () => {
      closeModalButton.current.click();
  }

  const submitDatabase = async (databaseName) => {
      try {
          const response = await axios.post("http://localhost:8000/new", {db_name: databaseName})
          console.log(response.data.message);
          triggerUpdate();
          // alert(response.data.message);
      } catch (error) {
          console.log(error.response.data.detail ?? error);
      }
    }

  return (
    <div className="App">
      <div className="main-content">
          <div ref={menuContainer} className={isMenuHidden ? "menu-content hide-menu" : "menu-content"}>
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
       <div ref={createDbModal} className="modal fade" id="create-database" tabIndex="-1" aria-labelledby="exampleModalCenteredScrollableTitle" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalCenteredScrollableTitle">Create a Database</h1>
                <button type="button" className="btn btn-close custom-btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleDatabaseSubmit}>
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control custom-input"
                      id="floatingInput"
                      name="create_database"
                      value={newDatabaseName}
                      onChange={handleDatabaseNameChange}
                      placeholder="example_db"
                    />
                    <label htmlFor="floatingInput">Database Name</label>
                  </div>
                  <button type="submit" className="btn btn-success">Save changes</button>
                </form>
              </div>
              <div className="modal-footer">
                <button ref={closeModalButton} type="button" className="btn btn-dark" data-bs-dismiss="modal" onClick={closeDbModal}>Close</button>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}

export default App;
