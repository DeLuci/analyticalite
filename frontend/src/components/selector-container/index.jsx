import React, {useEffect, useState, useContext} from 'react';
import './index.css'
import axios from "axios";
import {TableContext} from "@/context/db.jsx";
function DropdownWithButtons({}) {
    const [buttonLabel, setButtonLabel] = useState('Databases');
    const [showExtraButtons, setShowExtraButtons] = useState(false);
    const [databases, setDatabases] = useState([]);
    const [tables, setTables] = useState([]);
    const [tableButtonLabel, setTableButtonLabel] = useState('Tables');
    const { setTableResponse } = useContext(TableContext);

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
        </div>
    );
}

export default DropdownWithButtons;