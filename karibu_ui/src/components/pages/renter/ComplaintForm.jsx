// src/components/pages/renter/ComplaintForm.jsx

import React, { useState } from 'react';
import { lodgeComplaint } from '../../../services/ticketService'; 
import '../../../styles/RenterStyles.css'; 

function ComplaintForm() {
    const [heading, setHeading] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Plumbing'); 
    const [isLoading, setIsLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');
    
    // State for Follow-up Section
    const [followupTicket, setFollowupTicket] = useState('');
    const [followupDescription, setFollowupDescription] = useState('');


    const categories = ['Plumbing', 'Electrical', 'Structural', 'Cleaning', 'Other'];
    
    const renterId = localStorage.getItem('renterId');
    const renterHse = "A-15"; // Placeholder for Renter's House Number

    const handleSubmitNew = async () => {
        if (!heading || !description) {
            alert("Please provide a heading and description for your complaint.");
            return;
        }

        setIsLoading(true);
        setStatusMessage('');

        const complaintData = {
            heading: heading,
            description: description,
            category: category,
        };

        const result = await lodgeComplaint(renterId, complaintData);

        setIsLoading(false);

        if (result.success) {
            setStatusMessage(`Issue submitted successfully! Ticket ${result.ticket_number} created.`);
            setHeading('');
            setDescription('');
        } else {
            setStatusMessage(`Error: ${result.error}`);
        }
    };
    
    const handleSubmitFollowUp = () => {
        // UI Flow Logic: Handle follow-up submission (This will require a new API endpoint)
        if (!followupTicket || !followupDescription) {
            alert("Please enter the Ticket ID and a description for your follow-up.");
            return;
        }
        
        setStatusMessage(`Follow-up submitted for Ticket ${followupTicket}. Backend integration needed.`);
        setFollowupTicket('');
        setFollowupDescription('');
    };


    return (
        <div className="complaint-form-container">
            {statusMessage && (
                <div className={`status-message ${statusMessage.startsWith('Error') ? 'error' : 'success'}`}>
                    {statusMessage}
                </div>
            )}
            
            {/* 1. LODGE A NEW COMPLAINT SECTION */}
            <h3>Lodge a New Complaint</h3>
            <form>
                {/* Matches Wireframe Input Style */}
                <label>House Number</label>
                <input type="text" value={renterHse} disabled className="read-only-input" placeholder="Enter house number" /> 

                <label>Complaint Category</label>
                <select value={category} onChange={e => setCategory(e.target.value)} disabled={isLoading}>
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>

                <label>Subject/Heading</label>
                <input
                    type="text"
                    value={heading}
                    onChange={e => setHeading(e.target.value)}
                    placeholder="e.g., Leaking pipe in the bathroom"
                    disabled={isLoading}
                />

                <label>Detailed Description</label>
                <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    rows="4"
                    placeholder="Please describe the issue, location, and severity."
                    disabled={isLoading}
                />

                {/* DATE FIELD REMOVED: System handles date creation on the backend */}
                
                <button type="button" onClick={handleSubmitNew} disabled={isLoading}>
                    SUBMIT COMPLAINT
                </button>
            </form>
            
            <hr style={{ margin: '30px 0' }} />

            {/* 2. FOLLOW-UP COMPLAINT SECTION */}
            <h3>Follow-up complaint</h3>
            <form>
                 <label>Ticket ID</label>
                 <input
                    type="text"
                    value={followupTicket}
                    onChange={e => setFollowupTicket(e.target.value)}
                    placeholder="Enter existing ticket ID"
                    disabled={isLoading}
                />

                <label>Description (Add additional Information)</label>
                <textarea
                    value={followupDescription}
                    onChange={e => setFollowupDescription(e.target.value)}
                    rows="3"
                    placeholder="Add specific details or urgency update."
                    disabled={isLoading}
                />
                
                <button type="button" onClick={handleSubmitFollowUp} disabled={isLoading}>
                    SUBMIT FOLLOW-UP
                </button>
            </form>
        </div>
    );
}

export default ComplaintForm;