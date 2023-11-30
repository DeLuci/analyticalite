// ChatbotContainerContext.js
// eslint-disable-next-line no-unused-vars
import React, { createContext, useState, useContext } from 'react';

const ChatbotContainerContext = createContext();

export const useChatbotContainer = () => useContext(ChatbotContainerContext);

// eslint-disable-next-line react/prop-types
export const ChatbotContainerProvider = ({ children }) => {
    const [isShrunk, setIsShrunk] = useState(false);
    const [updateTableList, setTableToggle] = useState(false);
    const toggleShrink = () => {
        setIsShrunk(!isShrunk);
    };

    const toggleTableList = () => {
        setTableToggle(!updateTableList);
    }

    return (
        <ChatbotContainerContext.Provider value={{ isShrunk, toggleShrink, updateTableList, toggleTableList}}>
            {children}
        </ChatbotContainerContext.Provider>
    );
};
