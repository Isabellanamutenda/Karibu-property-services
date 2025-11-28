// src/components/common/Sidebar.jsx

import React from 'react';
import PropTypes from 'prop-types';
import '../../styles/SidebarStyles.css'; // Assume a separate CSS file for styling

function Sidebar({ options, onSelect, active }) {
    
    // UI Logic: Handles a click and calls the function passed from the parent
    const handleClick = (id) => {
        onSelect(id);
    };

    return (
        <div className="sidebar">
            <h3 className="sidebar-heading">Menu</h3>
            <ul className="sidebar-nav">
                {options.map((item) => (
                    <li 
                        key={item.id} 
                        className={`nav-item ${active === item.id ? 'active' : ''}`}
                        onClick={() => handleClick(item.id)}
                    >
                        {/* Note: The icon property is a placeholder. 
                             In a real app, you'd use a library like react-icons. */}
                        <span className="nav-icon">{item.icon}</span> 
                        <span className="nav-label">{item.label}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

// Optional: Use PropTypes for type checking (good practice)
Sidebar.propTypes = {
    options: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
            icon: PropTypes.string,
        })
    ).isRequired,
    onSelect: PropTypes.func.isRequired,
    active: PropTypes.string,
};

export default Sidebar;