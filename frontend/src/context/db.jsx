import React, {createContext, useState} from "react";

export const TableContext = createContext()

export const TableInfoProvider = ({children}) => {
    const [tableInfo, setTableInfo] = useState({label: {}, attribute: {}})

    return (
        <TableContext.Provider value={{tableInfo, setTableInfo}}>
            {children}
        </TableContext.Provider>
    );
}