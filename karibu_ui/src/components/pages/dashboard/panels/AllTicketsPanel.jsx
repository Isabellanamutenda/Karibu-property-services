// src/components/pages/dashboard/panels/AllTicketsPanel.jsx

import React, { useState, useEffect } from 'react';
// Correct path based on shared structure:
import { fetchAllTickets, removeTicket } from '../../../../services/dashboardService'; 
import '../../../../styles/DashboardStyles.css';

function AllTicketsPanel() {
    const [search, setSearch] = useState('');
    const [tickets, setTickets] = useState([]); 
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // 1. Logic: Fetch data from the backend API
    // Use an internal state variable to track if data needs a full reload
    const loadTickets = async (searchTerm = '') => {
        setIsLoading(true);
        setError(null);
        
        // Pass the search term for backend processing
        const result = await fetchAllTickets(searchTerm); 

        if (result.success) {
            setTickets(result.tickets);
        } else {
            setError(result.error);
            setTickets([]);
        }
        setIsLoading(false);
    };

    // Handler for removing/closing a ticket (needs to be defined here or passed down)
    const handleTicketRemove = async (ticketId) => {
        const confirmRemove = window.confirm(`Are you sure you want to close Ticket ID ${ticketId}? This action is final.`);
        if (!confirmRemove) return;

        // Call the service layer to update status
        const result = await removeTicket(ticketId);
        if (result.success) {
            alert(result.message);
            loadTickets(search); // Refresh the list after closure
        } else {
            alert(result.error || "Failed to remove ticket.");
        }
    };


    useEffect(() => {
        // Debounce search input and trigger loadTickets
        const delaySearch = setTimeout(() => {
            loadTickets(search);
        }, 300);

        return () => clearTimeout(delaySearch);
    }, [search]); // Refetch data whenever the search term changes


    // UI Logic: Display loading or error messages
    if (isLoading) return <div className="panel-content loading">Loading all tickets...</div>;
    if (error) return <div className="panel-content error">Error loading tickets: {error}</div>;

    // UI Logic: Component Rendering
    return (
        <div className="ticket-list-panel">
            <h3>All Tickets (Served, In Progress, Open)</h3>

            <input
                type="text"
                placeholder="Search by Ticket ID, Hse Number, or Category"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input-dark" 
            />

            <table className="data-table">
                <thead>
                    <tr>
                        {/* FINAL COLUMNS REQUIRED FOR FULL VIEW */}
                        <th>Hse Number</th>
                        <th>Ticket ID</th>
                        <th>Renter Name</th> 
                        <th>Status</th>
                        <th>Date Created</th>
                        <th>Category</th>
                        <th>Action</th> {/* Action button column */}
                    </tr>
                </thead>
                <tbody>
                    {tickets.length === 0 ? (
                        <tr><td colSpan="7" style={{textAlign: 'center'}}>No tickets found matching your search criteria.</td></tr>
                    ) : (
                        tickets.map(ticket => (
                            <tr key={ticket.id}>
                                <td>{ticket.property}</td> {/* This holds Hse Number */}
                                <td>{ticket.ticket_id}</td>
                                <td>{ticket.renter_name}</td>
                                <td>
                                    <span className={`status-badge status-${ticket.status.toLowerCase().replace(' ', '-')}`}>
                                        {ticket.status}
                                    </span>
                                </td>
                                <td>{ticket.date}</td>
                                <td>{ticket.category}</td>
                                <td>
                                    {/* Action button: Remove/Close */}
                                    {ticket.status.toLowerCase() !== 'closed' && (
                                        <button 
                                            className="action-button close-button"
                                            onClick={() => handleTicketRemove(ticket.id)} // Use unique DB ID for removal
                                        >
                                            Remove/Close
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default AllTicketsPanel;
