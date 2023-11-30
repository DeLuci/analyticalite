// In a new file, e.g., DatabaseUpdateContext.jsx
// eslint-disable-next-line no-unused-vars
import React, { createContext, useState, useContext } from 'react';

export const DatabaseUpdateContext = createContext();

export const useDatabaseUpdateContext = () => useContext(DatabaseUpdateContext);

// eslint-disable-next-line react/prop-types
export const DatabaseUpdateProvider = ({ children }) => {
  const [updateTrigger, setUpdateTrigger] = useState(false);

  const triggerUpdate = () => {
    setUpdateTrigger(!updateTrigger);
  }

  return (
    <DatabaseUpdateContext.Provider value={{ updateTrigger, setUpdateTrigger, triggerUpdate}}>
      {children}
    </DatabaseUpdateContext.Provider>
  );
};
