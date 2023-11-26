// ChatbotContainerContext.js
import React, { createContext, useState, useContext } from 'react';

const ChatbotContainerContext = createContext();

export const useChatbotContainer = () => useContext(ChatbotContainerContext);

export const ChatbotContainerProvider = ({ children }) => {
    const [isShrunk, setIsShrunk] = useState(false);

    const toggleShrink = () => {
        setIsShrunk(!isShrunk);
    };

    return (
        <ChatbotContainerContext.Provider value={{ isShrunk, toggleShrink }}>
            {children}
        </ChatbotContainerContext.Provider>
    );
};
