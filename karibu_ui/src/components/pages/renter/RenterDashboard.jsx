// src/components/pages/renter/RenterDashboard.jsx

import React, { useState, useEffect } from 'react';
import RenterLayout from '../../../components/common/RenterLayout'; 
import ComplaintForm from './ComplaintForm';
import QueueStatusPanel from './QueueStatusPanel';
import FollowUpForm from './FollowUpForm';
import '../../../styles/RenterStyles.css'; 
// Assuming fetchRenterStatus service function is available

function RenterDashboard() {
    const [renterInfo, setRenterInfo] = useState(null);
    const [statusData, setStatusData] = useState(null); // Data fetched from Renter Queue Status API
    const [currentView, setCurrentView] = useState('status'); 
    const [activeTicketNumber, setActiveTicketNumber] = useState(null); 

    // Flow Logic: Load Renter info and fetch status on mount
    useEffect(() => {
        const name = localStorage.getItem('renterName');
        const id = localStorage.getItem('renterId');
        
        if (name && id) {
            setRenterInfo({ name, id });
            // TODO: Fetch initial queue status here to populate statusData
        }
    }, []);

    // --- FLOW LOGIC HANDLERS ---
    const startFollowUp = (ticketNumber) => {
        // Switches view to the dedicated follow-up form
        setActiveTicketNumber(ticketNumber);
        setCurrentView('follow_up');
    };
    
    // Function to render the active content panel
    const renderContent = () => {
        switch (currentView) {
            case 'new_complaint':
                return <ComplaintForm onCancel={() => setCurrentView('status')} />;
            case 'follow_up':
                // Renders the dedicated follow-up form
                return <FollowUpForm ticketId={activeTicketNumber} onCancel={() => setCurrentView('status')} />;
            case 'status':
            default:
                // Default view: Shows main buttons and status panel
                return (
                    <>
                        <button onClick={() => setCurrentView('new_complaint')} className="action-button primary-button">
                            + Lodge New Complaint
                        </button>
                        <hr />
                        <h3>Active Complaint Status</h3>
                        {/* QueueStatusPanel provides the Follow Up button */}
                        <QueueStatusPanel 
                            statusData={statusData} 
                            onFollowUp={startFollowUp} 
                        /> 
                    </>
                );
        }
    };

    if (!renterInfo) return <div>Loading Renter Dashboard...</div>;

    return (
        <RenterLayout renter={renterInfo}>
             <div className="renter-dashboard-content-wrapper">
                
                {/* GREETING INTEGRATED INTO MAIN CONTENT AREA (as requested) */}
                <h2 className="main-greeting">
                    <span className="greeting-hand">👋</span> Welcome, {renterInfo.name}! 
                </h2>
                
                {renderContent()}
            </div>
        </RenterLayout>
    );
}

export default RenterDashboard;
