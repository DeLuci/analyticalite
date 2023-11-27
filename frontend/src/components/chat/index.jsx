import React, { useState, useContext } from 'react';
import './index.css';
import axios from 'axios'
import { TableContext } from "@/context/db.jsx";

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('');

    // Not used yet.
    const [databaseInfo, setDatabaseInfo] = useState({})
    const { tableResponse } = useContext(TableContext)

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const filetype = selectedFile.type
            const validTypes = ['text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
            if (validTypes.includes(filetype)) {
                setFile(selectedFile)
            } else {
                alert('Please upload a CSV or XLSX file.')
                e.target.value = '';
            }
        }

    };

    const modalAlert = () => {
        let myModal = new bootstrap.Modal(document.getElementById('add-filename'), {
            keyboard: false
        });
        myModal.show();
    };

    const validateFileName = async () => {
        if(fileName)
            await uploadFile();
    }

    const printFormData = (formData) => {
       // Get the values of the FormData object
       formData.forEach((value, key) => {
            console.log(`${key}: ${value}`);
        });
    }

    const uploadFile = async () => {
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file)
        formData.append('fileName', fileName);

        try {
            const response = await axios.post('http://localhost:8000/load', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(response)
            setMessages(msgs => [...msgs, { text: "File uploaded successfully", sender: "bot" }]);
        } catch (error) {
            console.error('Error uploading file:', error);
        }

        setFile(null);
    }

    const submitForm = async (e) => {
        e.preventDefault();
        if(file){
            modalAlert();
            await validateFileName();
        }
        sendMessage();
    };

    const sendMessage = () => {
        if (!input.trim()) return;
        console.log("passes here")
        setMessages([...messages, { text: input, sender: 'user' }]);
        setInput('');

        setTimeout(() => {
            setMessages(msgs => [...msgs, { text: "This is a response from the bot!", sender: 'bot' }]);
        }, 1000);
    };

    return (
        <>
            <div className="chat-box container">
                <div className="chat-window">
                    <div className="chat-top">
                        <div className={messages.length ? "chat-init hide-slide" : "chat-init"}>
                            <div className="custon-btn-container mb-0 mx-2">
                                <div className="logo-container mb-4">
                                    <i className="bi bi-tropical-storm logo"></i>
                                </div>
                                <div className="chat-init-title">How can I help you today?</div>
                            </div>
                        </div>
                        <div className="chat-message-box-container">
                            {messages.map((message, index) => (
                                <div key={index} className={`chat-message ${message.sender}-message`}>
                                    <div className="chat-user-box">
                                        <span>{message.sender === "user" ? "U" : "A"}</span>
                                    </div>
                                    <div className="chat-message-box">
                                        <p className="chat-user-title">{message.sender === "user" ? "You" : "AnalyticaLite+"}</p>
                                        <p>{message.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <form onSubmit={(e) => submitForm(e)}>
                    <div className="custom-upload-container">
                        <label htmlFor="file-upload" className="custom-file-upload">
                            <i className="bi bi-paperclip"></i>
                        </label>
                        <input id="file-upload" type="file" onChange={handleFileChange} />
                    </div>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="chat-input"
                    />
                    <button type="submit" className="send-button"><i className="bi bi-send"></i></button>
                </form>
            </div>
            <div className="modal fade" id="add-filename" tabIndex="-1" aria-labelledby="exampleModalCenteredScrollableTitle" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalCenteredScrollableTitle">Uploaded Filename</h1>
                            <button type="button" className="btn btn-close custom-btn-close" data-bs-dismiss="modal" aria-label="Close">
                              <i className="bi bi-x-lg"></i>
                            </button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="form-floating mb-3">
                                    <input type="text" className="form-control custom-input" id="floatingInput" name="add_filename" value={fileName} onChange={(e) => setFileName(e.target.value)} placeholder="example_db" />
                                    <label htmlFor="floatingInput">Filename</label>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-dark" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-success" onClick={() => validateFileName()}>Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Chatbot;
