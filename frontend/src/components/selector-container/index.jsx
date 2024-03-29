// eslint-disable-next-line no-unused-vars
import React, {useEffect, useState, useContext, useRef} from 'react';
import './index.css'
import axios from "axios";
// import {TableContext} from "@/context/db.jsx";
import { useChatbotContainer } from '@/context/chatbox.jsx';
import {useMenuContainer} from '@/context/menu.jsx';
import { DatabaseUpdateContext } from '@/context/databaseUpdateContext.jsx';


// eslint-disable-next-line no-empty-pattern
function DropdownWithButtons({}) {
    const [buttonLabel, setButtonLabel] = useState('Databases');
    const [showExtraButtons, setShowExtraButtons] = useState(false);
    const [databases, setDatabases] = useState([]);
    const [tables, setTables] = useState([]);
    const [tableButtonLabel, setTableButtonLabel] = useState('Tables');
    const [ tableResponse, setTableResponse ] = useState({})
    const { toggleShrink, updateTableList } = useChatbotContainer();
    const { toggleMenu } = useMenuContainer();
    const { updateTrigger } = useContext(DatabaseUpdateContext);
    const eavOffCanvas = useRef(null);
    const databaseMenu = useRef(null);
    const tableMenu = useRef(null);

    useEffect(() => {
        fetchDatabases()
    }, [updateTrigger]);

    useEffect(() => {
        getTables()
    }, [updateTableList]);

    const fetchDatabases = async () => {
        try {
            const response = await axios('http://localhost:8000/databases')
            setDatabases(response.data.databases);
        } catch (error) {
            console.error("Error fetching database:", error);
        }
    }

    const handleDropdownItemClick = async (databaseName) => {
        try {
            const response = await axios.post("http://localhost:8000/connect", {db_name: databaseName})
            console.log(response.data.message)
            setButtonLabel(databaseName);
            getTables()
        } catch (error) {
            console.log(error)
        }
        setShowExtraButtons(true);
    };

    const getTables = async () => {
        try {
            const response = await axios.get("http://localhost:8000/tables")
            setTables(response.data.tables);
        } catch (error) {
            console.error("Error fetching tables:", error);
        }
    }

    const handleTableDropdownItemClick = async (tableName) => {
        try {
            const response = await axios.post("http://localhost:8000/table", {table_name: tableName})
            setTableButtonLabel(tableName)
            setTableResponse({label: response.data.label, attribute: response.data.attribute})
        } catch (error) {
            console.log(error)
        }
    }

    const handleCloseDatabase = async () => {
        try {
            const response = await axios.post("http://localhost:8000/close")
            setButtonLabel('Databases');
            setTableButtonLabel('Tables');
            setShowExtraButtons(false);
            setTableResponse({})
            console.log(response.data.message)
        } catch (error) {
            console.log("error:", error)
        }
    }

    const handleParentDynamicView = () => {
        toggleShrink();
    }

    const handleMenuView = () => {
        toggleMenu();
    }

    const deleteDatabase = async (e) => {
        const dbKey = e.target.getAttribute('data-db-key');
        try {
            const response = await axios.post("http://localhost:8000/drop-db", { db_name: dbKey });
            if (response.status === 200) {
                // Remove the deleted database from the state
                const updatedDatabases = databases.filter(database => database !== dbKey);
                setDatabases(updatedDatabases);
                setButtonLabel('Databases');
            }
        } catch (error) {
            console.error("Error deleting database:", error);
        }
    };

    const deleteTable = async (e) => {
        const tableKey = e.target.getAttribute('data-table-key');
        try {
            const response = await axios.post("http://localhost:8000/drop-table", { table_name: tableKey });
            if (response.status === 200) {
                // Remove the deleted database from the state
                const updateTables = tables.filter(table => table !== tableKey);
                setTables(updateTables);
                setTableButtonLabel('Tables');
            }
        } catch (error) {
            console.error("Error deleting table:", error);
        }
    };

    return (
        <div className="table-selector-container" >
            <div className="">
                <button type="button" className="btn custom-btn-primary default" onClick={handleMenuView}>
                    <span className="custon-btn-container mb-0 mx-2">
                        <i className="bi bi-app-indicator"></i>
                    </span>
                </button>
            </div>
            {!showExtraButtons && (
            <div className="dropdown">
                    <button id="dropdownButton" className="btn btn-secondary dropdown-toggle table-toggle custom-toggle custom-dropdown" type="button" data-bs-toggle="dropdown"
                            aria-expanded="false">
                        {buttonLabel}
                        <i className="bi bi-chevron-down"></i>
                    </button>

                    <ul ref={databaseMenu} className="dropdown-menu custom-menu">
                        {databases.map(database => (
                            <li key={database} className='dropdown-item d-flex justify-content-between'>
                                <a className="" href="#" onClick={() => handleDropdownItemClick(database)}>
                                    {database}
                                </a>
                                <i className="bi bi-trash3 cursor-pointer" data-db-key={database} onClick={(e) => deleteDatabase(e)}></i>
                            </li>
                        ))}
                    </ul>
            </div>
            )}
            {showExtraButtons && (
                <>
                    <div className="button-container tables">
                        <button className="btn btn-secondary dropdown-toggle table-toggle custom-toggle custom-dropdown" type="button" data-bs-toggle="dropdown"
                                aria-expanded="false">
                            {tableButtonLabel}
                            <i className="bi bi-chevron-down"></i>
                        </button>
                        <ul ref={tableMenu} className="dropdown-menu custom-menu">
                            {tables.map(table => (
                                <li key={table} className='dropdown-item d-flex justify-content-between'>
                                    <a href="#" onClick={() => handleTableDropdownItemClick(table)}>
                                        {table}
                                    </a>
                                    <i className="bi bi-trash3 cursor-pointer" data-table-key={table} onClick={(e) => deleteTable(e)}></i>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="button-container close">
                        <button className="btn btn-secondary close-btn" onClick={handleCloseDatabase}>Close Database</button>
                    </div>
                </>
            )}
            <button type="button" className="btn custom-btn-primary default" data-bs-toggle="offcanvas" data-bs-target="#eav-attr" aria-controls="eav-attr" onClick={(e) => handleParentDynamicView(e)}>
                <span className="custon-btn-container mb-0 mx-2">
                    <span className="me-3">
                        <i className="bi bi-database-gear"></i>
                    </span>
                    <span>
                        EAV
                    </span>
                </span>
            </button>
            <div className="offcanvas offcanvas-end eav-custom" ref={eavOffCanvas} data-bs-scroll="true" data-bs-backdrop="false" tabIndex="-1" id="eav-attr" aria-labelledby="eav-attr">
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="offcanvasWithBothOptionsLabel">EAV</h5>
                    <button type="button" className="btn btn-close custom-btn-close" data-bs-dismiss="offcanvas" aria-label="Close" onClick={(e) => handleParentDynamicView(e)}>
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>
                <div className="offcanvas-body">
                    <div className="eav-item label">
                        <h4>Label:</h4>
                    </div>
                    {tableResponse?.label && (
                        tableResponse.label.map(label => (
                            <p className="eav-value" key={label}>{label}</p>
                        ))
                    )}
                    <div className="eav-item label">
                        <h4>Attribute:</h4>
                    </div>
                    {tableResponse?.attribute && (
                        tableResponse.attribute.map(attribute => (
                            <p className="eav-value" key={attribute}>{attribute}</p>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default DropdownWithButtons;