// src/components/FollowUpPage.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchRenterTickets } from '../../../services/ticketService';
import '../../../styles/RenterStyles.css';

const FollowUpPage = () => {
    const [tickets, setTickets] = useState([]);
    const [followupTicket, setFollowupTicket] = useState('');
    const [followupDescription, setFollowupDescription] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    
    const navigate = useNavigate();
    const renterId = localStorage.getItem('renterId');

    useEffect(() => {
        if (renterId) {
            fetchRenterTickets(renterId).then(data => setTickets(data));
        }
    }, [renterId]);

    const handleSelectTicket = (ticketId) => {
        setFollowupTicket(ticketId);
        // Scroll smoothly to the form
        document.getElementById('followup-form').scrollIntoView({ behavior: 'smooth' });
    };

    const handleSubmitFollowUp = () => {
        if (!followupTicket || !followupDescription) {
            alert("Please select a Ticket ID and provide details.");
            return;
        }
        // This is where your backend integration for follow-ups goes
        setStatusMessage(`Follow-up submitted for Ticket ${followupTicket}!`);
        setFollowupDescription('');
        setFollowupTicket('');
    };

    return (
        <div className="renter-layout">
            <div className="renter-dashboard-content-wrapper">
                
                {/* Header with Navigation */}
                <div className="renter-header" style={{marginBottom: '20px', background: 'transparent', boxShadow: 'none', padding: '0'}}>
                    <h2 className="main-greeting" style={{margin: 0}}>Your Ticket History</h2>
                    <button className="action-button primary-button" onClick={() => navigate('/renter-dashboard')}>
                        ← Back to Dashboard
                    </button>
                </div>

                {/* 1. HISTORY TABLE */}
                <div className="ticket-table-wrapper">
                    <table className="ticket-table">
                        <thead>
                            <tr>
                                <th>Ticket ID</th>
                                <th>Category</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tickets.length > 0 ? (
                                tickets.map(t => (
                                    <tr key={t.id}>
                                        <td>{t.ticket_id}</td>
                                        <td>{t.category}</td>
                                        <td className={`status-${t.status.toLowerCase()}`}>{t.status}</td>
                                        <td>{new Date(t.created_at).toLocaleDateString()}</td>
                                        <td>
                                            <button 
                                                className="follow-up-link" 
                                                onClick={() => handleSelectTicket(t.ticket_id)}
                                                style={{fontSize: '0.8em', border: 'none', background: 'transparent'}}
                                            >
                                                Select for Follow-up
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="5" style={{textAlign: 'center', padding: '20px'}}>No records found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* 2. FOLLOW-UP FORM SECTION */}
                <div id="followup-form" className="complaint-form-container" style={{marginTop: '40px', borderTop: '4px solid #4CAF50'}}>
                    <h3 style={{color: '#4CAF50'}}>Follow-up Complaint</h3>
                    
                    {statusMessage && <div className="status-message success">{statusMessage}</div>}

                    <form>
                        <label>Ticket ID</label>
                        <input
                            type="text"
                            value={followupTicket}
                            onChange={e => setFollowupTicket(e.target.value)}
                            placeholder="Select from table or enter ID"
                        />

                        <label>Description (Add additional Information)</label>
                        <textarea
                            value={followupDescription}
                            onChange={e => setFollowupDescription(e.target.value)}
                            rows="3"
                            placeholder="Add specific details or urgency update."
                        />
                        
                        <button type="button" onClick={handleSubmitFollowUp} className="submit-complaint-btn">
                            SUBMIT FOLLOW-UP
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default FollowUpPage;
