// ChatbotContainerContext.js
import React, { createContext, useState, useContext } from 'react';

const MenuContainerContext = createContext();

export const useMenuContainer = () => useContext(MenuContainerContext);

export const MenuContainerProvider = ({ children }) => {
    const [isMenuHidden, setIsMenuHidden] = useState(false);

    const toggleMenu = () => {
        setIsMenuHidden(!isMenuHidden);
    };

    return (
        <MenuContainerContext.Provider value={{ isMenuHidden, toggleMenu, setIsMenuHidden}}>
            {children}
        </MenuContainerContext.Provider>
    );
};
