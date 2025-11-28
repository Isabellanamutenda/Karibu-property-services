// src/components/common/RenterLayout.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

function RenterLayout({ renter, children }) {
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false); // Controls the profile dropdown

    const handleLogout = () => {
        // Flow Logic: Clear local storage and redirect
        localStorage.clear(); 
        navigate('/renter/login');
    };
    
    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

    return (
        <div className="renter-layout">
            <header className="renter-header">
                {/* 1. BRANDING (Left side) */}
                <div className="renter-branding">
                    <h1>Karibu System - Renter Portal</h1>
                </div>
                
                {/* 2. PROFILE ICON (Top Right Corner) */}
                {renter && (
                    <div className="profile-menu-container-right">
                        <div className="profile-icon" onClick={toggleMenu} role="button" aria-expanded={showMenu}>
                            👤 
                        </div>

                        {showMenu && (
                            <div className="dropdown-menu-right">
                                <div className="menu-item disabled">
                                    Logged in as: <strong>{renter.name}</strong>
                                </div>
                                <div className="menu-item" onClick={() => alert('Profile view coming soon!')}>
                                    View Profile
                                </div>
                                <div className="menu-item logout" onClick={handleLogout}>
                                    Log Out
                                </div>
                            </div>
                        )}
                    </div>
                )}
                
            </header>

            <main className="renter-main-content">
                {children}
            </main>

            <footer className="renter-footer">
                <p>&copy; {new Date().getFullYear()} Karibu System. Follow-up is our priority.</p>
            </footer>
        </div>
    );
}

RenterLayout.propTypes = {
    renter: PropTypes.shape({
        name: PropTypes.string,
        id: PropTypes.string,
    }),
    children: PropTypes.node.isRequired,
};

export default RenterLayout;