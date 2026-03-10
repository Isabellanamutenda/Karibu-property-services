// src/components/pages/renter/ComplaintForm.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. ADD THIS IMPORT
import { lodgeComplaint } from '../../../services/ticketService'; 
import '../../../styles/RenterStyles.css'; 

function ComplaintForm() {
    const navigate = useNavigate(); // 2. INITIALIZE NAVIGATE
    const [heading, setHeading] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Plumbing'); 
    const [isLoading, setIsLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');

    const categories = ['Plumbing', 'Electrical', 'Structural', 'Cleaning', 'Other'];
    const renterId = localStorage.getItem('renterId');
    const renterHse = "A-15"; 

    const handleSubmitNew = async () => {
        if (!heading || !description) {
            alert("Please provide a heading and description.");
            return;
        }
        setIsLoading(true);
        const result = await lodgeComplaint(renterId, { heading, description, category });
        setIsLoading(false);

        if (result.success) {
            setStatusMessage(`Success! Ticket ${result.ticket_number} created.`);
            setHeading('');
            setDescription('');
        } else {
            setStatusMessage(`Error: ${result.error}`);
        }
    };

    return (
        <div className="complaint-form-container">
            {statusMessage && (
                <div className={`status-message ${statusMessage.startsWith('Error') ? 'error' : 'success'}`}>
                    {statusMessage}
                </div>
            )}
            
            <h3>Lodge a New Complaint</h3>
            <form>
                <label>House Number</label>
                <input type="text" value={renterHse} disabled className="read-only-input" /> 

                <label>Complaint Category</label>
                <select value={category} onChange={e => setCategory(e.target.value)} disabled={isLoading}>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>

                <label>Subject/Heading</label>
                <input type="text" value={heading} onChange={e => setHeading(e.target.value)} disabled={isLoading} />

                <label>Detailed Description</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} rows="4" disabled={isLoading} />

                {/* PLACE THE BUTTON AND LINK HERE */}
                <button type="button" className="submit-complaint-btn" onClick={handleSubmitNew} disabled={isLoading}>
                    SUBMIT COMPLAINT
                </button>

                <div className="follow-up-navigation">
                    <p>Already have a ticket? 
                        <span className="follow-up-link" onClick={() => navigate('/renter/follow-up')}>
                             Follow up here
                        </span>
                    </p>
                </div>
            </form>
            
            {/* THE OLD FOLLOW-UP FORM SECTION IS NOW REMOVED */}
        </div>
    );
}

export default ComplaintForm;