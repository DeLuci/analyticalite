import React, {useEffect, useState, useContext, useRef} from 'react';
import './index.css'
import axios from "axios";
import {TableContext} from "@/context/db.jsx";
import { useChatbotContainer } from '@/context/chatbox.jsx';

function DropdownWithButtons({}) {
    const [buttonLabel, setButtonLabel] = useState('Databases');
    const [showExtraButtons, setShowExtraButtons] = useState(false);
    const [databases, setDatabases] = useState([]);
    const [tables, setTables] = useState([]);
    const [tableButtonLabel, setTableButtonLabel] = useState('Tables');
    const { setTableResponse } = useContext(TableContext);
    const { tableResponse } = useContext(TableContext)
    let eavOffCanvas = useRef(null);
    const { toggleShrink } = useChatbotContainer();
    //let eavOffCanvasToggle = useRef(null);
    //let chatBoxContainer = useRef(null);

    useEffect(() => {
        fetchDatabases();
    }, []);

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
        } catch (error) {
            console.log(error)
        }


        try {
            const response = await axios.get("http://localhost:8000/tables")
            setTables(response.data.tables);
        } catch (error) {
            console.error("Error fetching tables:", error);
        }
        setShowExtraButtons(true);
    };

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
            console.log(response.data.message)
        } catch (error) {
            console.log("error:", error)
        }
    }

    const handleParentDynamicView = () => {
        toggleShrink();
    }

    return (
        <div className="table-selector-container" >
            <div className="dropdown">
                <button id="dropdownButton" className="btn btn-secondary dropdown-toggle table-toggle custom-toggle" type="button" data-bs-toggle="dropdown"
                        aria-expanded="false">
                    {buttonLabel}
                </button>
                <ul className="dropdown-menu custom-menu">
                    {databases.map(database => (
                        <li key={database}><a className="dropdown-item" href="#" onClick={() => handleDropdownItemClick(database)}>{database}</a></li>
                    ))}
                </ul>
            </div>
            {showExtraButtons && (
                <>
                    <div className="button-container tables">
                        <button className="btn btn-secondary dropdown-toggle table-toggle custom-toggle" type="button" data-bs-toggle="dropdown"
                                aria-expanded="false">
                            {tableButtonLabel}
                        </button>
                        <ul className="dropdown-menu custom-menu">
                            {tables.map(table => (
                                <li key={table}><a className="dropdown-item" href="#" onClick={() => handleTableDropdownItemClick(table)}>{table}</a></li>
                            ))}
                        </ul>
                    </div>
                    <div className="button-container close">
                        <button className="btn btn-secondary close-btn" onClick={handleCloseDatabase}>Close Database</button>
                    </div>
                </>
            )}
            <button type="button" className="btn" data-bs-toggle="offcanvas" data-bs-target="#eav-attr" aria-controls="eav-attr" onClick={(e) => handleParentDynamicView(e)}>
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
                    <p>Label: {tableResponse?.label}</p>
                    <p>Attribute: {tableResponse?.attribute}</p>
                </div>
            </div>
        </div>
    );
}

export default DropdownWithButtons;