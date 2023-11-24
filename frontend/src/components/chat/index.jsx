import React, { useState, useContext } from 'react';
import './index.css';
import axios from 'axios'
import {TableContext} from "@/context/db.jsx";
const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [file, setFile] = useState(null);
    const [databaseInfo, setDatabaseInfo] = useState({})
    const {tableResponse} = useContext(TableContext)
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

    const uploadFile = async (e) => {
        console.log("here")
        e.preventDefault()
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file)

        try {
            const response = await axios.post('http://localhost:8000/load', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(response)
            setMessages(msgs => [...msgs, {text: "File uploaded successfully", sender: "bot"}]);
        } catch (error) {
            console.error('Error uploading file:', error);
        }

        setFile(null);
    }
    const sendMessage = (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        console.log("passes here")
        setMessages([...messages, { text: input, sender: 'user' }]);
        setInput('');

        setTimeout(() => {
            setMessages(msgs => [...msgs, { text: "This is a response from the bot!", sender: 'bot' }]);
        }, 1000);
    };

    return (
        <div className="chat-box">
            <div className="chat-window">
                <div className="chat-top">
                    <p>Label: {tableResponse?.label}</p>
                    <p>Attribute: {tableResponse?.attribute}</p>
                </div>
                <div className="chat-bottom">
                    {messages.map((message, index) => (
                    <div key={index} className={`chat-message ${message.sender}-message`}>
                        <p>{message.text}</p>
                    </div>
                ))}
                </div>
            </div>
            <form onSubmit={sendMessage}>
                <div className="custom-upload-container">
                    <label htmlFor="file-upload" className="custom-file-upload">
                        <i className="bi bi-file-arrow-up"></i>
                    </label>
                    <input id="file-upload" type="file" onChange={handleFileChange}/>
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
    );
};

export default Chatbot;
