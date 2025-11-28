// src/components/common/Header.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

function Header({ staff }) {
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false); // Controls the profile dropdown

    const handleLogout = () => {
        // Clear CA authentication data
        localStorage.removeItem('staffNumber');
        localStorage.removeItem('staffName');
        // Redirect to Staff Login
        navigate('/staff/login');
    };
    
    const toggleMenu = () => {
        setShowMenu(prev => !prev);
    };

    return (
        <header className="dashboard-header">
            
            {/* 1. BRANDING (Left side) */}
            <div className="logo">
                KARIBU SYSTEM
                <span style={{ fontSize: '0.8em', marginLeft: '10px', color: '#4CAF50' }}>STAFF PORTAL</span>
            </div>
            
            {/* 2. PROFILE ICON (Top Right Corner) */}
            {staff && (
                <div className="profile-menu-container-right">
                    <div className="profile-icon" onClick={toggleMenu} role="button" aria-expanded={showMenu}>
                        👤 
                    </div>

                    {showMenu && (
                        <div className="dropdown-menu-right">
                            <div className="menu-item disabled">
                                Logged in as: <strong>{staff.name}</strong>
                            </div>
                            <div className="menu-item" onClick={() => alert('Profile update coming soon!')}>
                                Update Profile
                            </div>
                            <div className="menu-item logout" onClick={handleLogout}>
                                Log Out
                            </div>
                        </div>
                    )}
                </div>
            )}
            
        </header>
    );
}

Header.propTypes = {
    staff: PropTypes.shape({
        name: PropTypes.string,
        staffNumber: PropTypes.string, // Assuming staffNumber is stored
    }),
};

export default Header;