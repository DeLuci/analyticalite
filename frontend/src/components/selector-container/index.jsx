import React, { useState } from 'react';
import './index.css'
function DropdownWithButtons() {
    const [buttonLabel, setButtonLabel] = useState('Databases');
    const [showExtraButtons, setShowExtraButtons] = useState(false);

    const handleDropdownItemClick = (newLabel) => {
        setButtonLabel(newLabel);
        setShowExtraButtons(true);
    };

    const handleCloseDatabase = () => {
        setButtonLabel('Databases');
        setShowExtraButtons(false);
    }

    return (
        <div className="table-selector-container" >
            <div className="dropdown">
                <button id="dropdownButton" className="btn btn-secondary dropdown-toggle table-toggle custom-toggle" type="button" data-bs-toggle="dropdown"
                        aria-expanded="false">
                    {buttonLabel}
                </button>
                <ul className="dropdown-menu custom-menu">
                    <li><a className="dropdown-item" href="#" onClick={() => handleDropdownItemClick('Degrees')}>Degrees</a></li>
                    {/* Add other dropdown items here */}
                </ul>
            </div>
            {showExtraButtons && (
                <>
                    <div className="button-container tables">
                        <button className="btn btn-secondary dropdown-toggle table-toggle custom-toggle gap-1">Tables</button>
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