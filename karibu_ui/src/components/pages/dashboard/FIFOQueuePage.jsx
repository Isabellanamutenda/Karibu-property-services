// src/components/pages/dashboard/FIFOQueuePage.jsx

import React, { useState, useEffect } from 'react';
// Correct paths for services and styles:
import { fetchFIFOQueue, removeTicket } from '../../../services/dashboardService'; 
import '../../../styles/DashboardStyles.css'; 


// --- Sub-component: Ticket Details Modal UI ---
const TicketDetailsModal = ({ ticket, onClose }) => {
    // Note: The ticket object contains description, category, and hse_number from the backend API.
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h3 style={{ color: '#90ee90' }}>Ticket Details</h3>
                <p><strong>Ticket Number:</strong> {ticket.ticket_number}</p>
                <p><strong>Status:</strong> {ticket.status}</p>
                <p><strong>Category:</strong> {ticket.category}</p>
                <p><strong>House Number:</strong> {ticket.hse_number}</p>
                <p><strong>Date Complained:</strong> {ticket.created_at}</p>
                <hr style={{ borderColor: '#444' }} />
                <p><strong>Description:</strong> <em>{ticket.description}</em></p>
                
                <button onClick={onClose} className="modal-close-button">Close</button>
            </div>
        </div>
    );
};


function FIFOQueuePage() {
    // --- State Management ---
    const [selectedTicket, setSelectedTicket] = useState(null); // Tracks ticket for modal
    const [search, setSearch] = useState('');
    const [tickets, setTickets] = useState([]); // Live data from backend
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- UI Flow Logic ---
    const openModal = (ticket) => {
        setSelectedTicket(ticket);
    };

    const closeModal = () => {
        setSelectedTicket(null);
    };

    // Handler for ticket removal (reusing logic from CA Dashboard)
    const handleTicketRemove = async (ticketId) => {
        const confirmRemove = window.confirm(`Are you sure you want to close Ticket ID ${ticketId}? This action is final.`);
        if (!confirmRemove) return;

        const result = await removeTicket(ticketId);
        if (result.success) {
            alert(result.message);
            loadFIFOQueue(search); // Refresh list immediately
        } else {
            alert(result.error || "Failed to remove ticket.");
        }
    };
    
    // --- Data Fetching Logic (Backend Interaction) ---
    const loadFIFOQueue = async (searchTerm = '') => {
        setIsLoading(true);
        setError(null);
        
        // Call the service layer, passing the search term for backend processing
        const result = await fetchFIFOQueue(searchTerm); 

        if (result.success) {
            setTickets(result.tickets);
        } else {
            setError(result.error);
            setTickets([]);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        // Debounce search input and trigger loadTickets
        const delaySearch = setTimeout(() => {
            loadFIFOQueue(search);
        }, 300);

        return () => clearTimeout(delaySearch);
    }, [search]); // Refetch data whenever the search term changes

    // UI Logic: Client-side filtering for quick search (optional, based on API capability)
    // NOTE: For final submission, filter logic should be mainly on the backend, 
    // but this ensures search works if the API doesn't filter.
    const filtered = tickets.filter(t =>
        t.ticket_number.toLowerCase().includes(search.toLowerCase()) ||
        t.renter_name.toLowerCase().includes(search.toLowerCase()) ||
        t.hse_number.toLowerCase().includes(search.toLowerCase())
    );


    // --- UI Rendering ---
    if (isLoading) return <div className="panel-content loading">Loading FIFO Queue...</div>;
    if (error) return <div className="panel-content error">Error loading queue: {error}</div>;

    return (
        <div className="ticket-queue-page">
            <h2>Tickets in Queue (FIFO)</h2>

            <input
                type="text"
                placeholder="Search by Ticket ID or Renter Name"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input-dark"
            />

            <table className="data-table">
                <thead>
                    <tr>
                        <th>Queue No</th>
                        <th>Ticket ID</th>
                        <th>Date Complained</th>
                        <th>Renter Name</th>
                        <th>House No</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filtered.map((ticket, index) => (
                        <tr key={ticket.ticket_id}>
                            <td>{index + 1}</td> 
                            <td>
                                {/* CRITICAL: Make the Ticket ID clickable */}
                                <span className="clickable-id" onClick={() => openModal(ticket)}>
                                    <u>{ticket.ticket_number}</u> 
                                </span>
                            </td>
                            <td>{ticket.created_at.split(' ')[0]}</td> 
                            <td>{ticket.renter_name}</td>
                            <td>{ticket.hse_number}</td>
                            <td>{ticket.status}</td>
                            <td>
                                <button 
                                    className="action-button close-button"
                                    onClick={() => handleTicketRemove(ticket.ticket_id)}
                                >
                                    Close
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* RENDER MODAL */}
            {selectedTicket && (
                <TicketDetailsModal 
                    ticket={selectedTicket} 
                    onClose={closeModal} 
                />
            )}
        </div>
    );
}

export default FIFOQueuePage;