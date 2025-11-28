// src/components/pages/dashboard/panels/RenterInfoPanel.jsx

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import '../../../../styles/DashboardStyles.css';
// Note: handleRenterUpdate comes from the parent StaffDashboard component

// --- Sub-component 1: Renders the Edit Form ---
const EditRenterForm = ({ renter, onCancel, onSave, isSaving }) => {
    
    // State to manage input fields for the currently edited renter
    const [formData, setFormData] = useState({
        Renter_Name: renter.Renter_Name || '',
        Renter_HseNumber: renter.Renter_HseNumber || '',
        Renter_Phone: renter.Renter_Phone || '',
        // 'Additional Information' maps to Renter_DateofVacating in the DB
        Renter_DateofVacating: renter.Renter_DateofVacating || '', 
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdate = () => {
        // Calls the parent handler function, triggering the PATCH API call
        // This is correct: it passes the Renter ID and the form data.
        onSave(renter.Renter_IDNumber, formData);
    };

    return (
        <div className="renter-edit-form">
            <h4 style={{ color: '#4CAF50' }}>Update Renter: {renter.Renter_Name} (ID: {renter.Renter_IDNumber})</h4>
            
            <div className="form-group">
                <label>Renter Name</label>
                <input type="text" name="Renter_Name" value={formData.Renter_Name} 
                       onChange={handleChange} placeholder="Enter full names" disabled={isSaving} />
            </div>
            
            <div className="form-group">
                <label>Hse No</label>
                <input type="text" name="Renter_HseNumber" value={formData.Renter_HseNumber} 
                       onChange={handleChange} placeholder="A-12 Block B" disabled={isSaving} />
            </div>
            
            <div className="form-group">
                <label>Phone No</label>
                <input type="text" name="Renter_Phone" value={formData.Renter_Phone} 
                       onChange={handleChange} placeholder="07XXXXXXXX" disabled={isSaving} />
            </div>
            
            <div className="form-group">
                <label>Additional Information (Date of Vacating)</label>
                <input type="date" name="Renter_DateofVacating" value={formData.Renter_DateofVacating} 
                       onChange={handleChange} disabled={isSaving} />
            </div>
            
            <button className="update-button" onClick={handleUpdate} disabled={isSaving}>
                {isSaving ? 'UPDATING...' : 'UPDATE'}
            </button>
            <button className="cancel-button" onClick={onCancel} disabled={isSaving}>
                Cancel
            </button>
        </div>
    );
};

// --- Sub-component 2: Main Panel Component ---
function RenterInfoPanel({ renterData, handleRenterUpdate }) {
    const [editingRenter, setEditingRenter] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    
    // Handler to initiate the edit state
    const handleEditClick = (renter) => {
        // Set the state to the renter's current details for the Edit Form
        setEditingRenter(renter); 
    };

    // Handler to manage the update service call and state change
    const handleSaveRenterInfo = async (id, updatedData) => {
        setIsSaving(true);
        
        // CRITICAL FIX: The StaffDashboard's handleRenterUpdate must be awaited 
        // to get the success status and close the form correctly.
        const result = await handleRenterUpdate(id, updatedData); 
        
        // StaffDashboard's handler should return a success status {success: true}
        // if the API call worked.
        if (result && result.success) {
            // Note: Since StaffDashboard refreshes data, we just close the form.
            setEditingRenter(null); 
        }
        setIsSaving(false);
    };

    // If a renter is selected for editing, render the dedicated form
    if (editingRenter) {
        return (
            <EditRenterForm 
                renter={editingRenter} 
                onCancel={() => setEditingRenter(null)} 
                onSave={handleSaveRenterInfo}
                isSaving={isSaving}
            />
        );
    }
    
    // Default view: Display the list of renters (Select Renter to Update)
    if (!renterData || renterData.length === 0) {
        return (
            <div className="renter-info-panel">
                <h3>🏠 Select Renter to Update</h3>
                <div className="empty-state-message" style={{ marginTop: '20px', color: '#bdbdbd' }}>
                    No renter records found in the database.
                </div>
            </div>
        );
    }
    
    return (
        <div className="renter-info-panel">
            <h3>🏠 Select Renter to Update</h3>
            <table className="data-table">
                <thead>
                    <tr>
                        <th>Renter Name</th>
                        <th>Hse No</th>
                        <th>Phone No</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {renterData.map((renter) => (
                        <tr key={renter.Renter_IDNumber}>
                            <td>{renter.Renter_Name}</td>
                            <td>{renter.Renter_HseNumber}</td>
                            <td>{renter.Renter_Phone}</td>
                            <td>
                                <button onClick={() => handleEditClick(renter)} className="action-button edit-button">
                                    UPDATE
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// --- Prop Types Definitions (Correct and Complete) ---

EditRenterForm.propTypes = {
    renter: PropTypes.object.isRequired,
    onCancel: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    isSaving: PropTypes.bool.isRequired,
};

RenterInfoPanel.propTypes = {
    renterData: PropTypes.array.isRequired,
    handleRenterUpdate: PropTypes.func.isRequired,
};

export default RenterInfoPanel;
