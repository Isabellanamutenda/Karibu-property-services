// src/components/pages/renter/QueueStatusPanel.jsx

import React from 'react';
import PropTypes from 'prop-types';
import '../../../styles/RenterStyles.css'; 

function QueueStatusPanel({ statusData, onFollowUp }) {
    
    // UI Logic: Handle loading state
    if (!statusData) {
        return (
            <div className="queue-status-panel">
                <p>Loading your current status...</p>
            </div>
        );
    }

    // UI Logic: Handle no-ticket state
    if (!statusData.is_active) {
        return (
            <div className="queue-status-panel inactive">
                <h3>Current Status: Cleared</h3>
                <p>{statusData.status_message || "You have no active complaints in the queue."}</p>
                <p>Feel free to lodge a new complaint if needed.</p>
            </div>
        );
    }

    // UI Logic: Display active ticket details and queue position
    return (
        <div className="queue-status-panel active">
            <h3>Active Ticket: {statusData.ticket_number}</h3>
            <p><strong>Category:</strong> {statusData.category}</p>
            <p><strong>Date Lodged:</strong> {statusData.lodged_date}</p>
            
            <hr />

            <h4>Your Position in Queue (FIFO)</h4>
            <div className="queue-rank-display">
                <p>You are number <span className="queue-rank">{statusData.queue_rank}</span></p>
                <p>Total open tickets ahead: {statusData.queue_rank - 1}</p>
                <p>Total active tickets: {statusData.total_in_queue}</p>
            </div>

            <hr />

            {/* NEW: Follow Up Button/Link */}
            <button 
                // When clicked, calls the parent handler, passing the ticket number
                onClick={() => onFollowUp(statusData.ticket_number)} 
                className="follow-up-link"
            >
                Add Follow-up Information
            </button>
        </div>
    );
}

QueueStatusPanel.propTypes = {
    // Data expected from the backend RentersController#status API
    statusData: PropTypes.shape({
        is_active: PropTypes.bool,
        ticket_number: PropTypes.string,
        category: PropTypes.string,
        lodged_date: PropTypes.string,
        queue_rank: PropTypes.number,
        total_in_queue: PropTypes.number,
        status_message: PropTypes.string,
    }),
    // Function passed from RenterDashboard to change the current view
    onFollowUp: PropTypes.func.isRequired, 
};

export default QueueStatusPanel;