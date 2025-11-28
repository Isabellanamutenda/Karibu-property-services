// src/services/dashboardService.js
const API_BASE_URL = "http://localhost:3000";

// Fetches all data required for the CA dashboard in one go
export const fetchDashboardData = async () => {
    try {
        // Fetch all three datasets concurrently for speed
        const [rentersRes, ticketsRes, reportRes] = await Promise.all([
            fetch(`${API_BASE_URL}/renters`),
            fetch(`${API_BASE_URL}/tickets`),
            fetch(`${API_BASE_URL}/tickets/report`),
        ]);

        if (!rentersRes.ok || !ticketsRes.ok || !reportRes.ok) {
            // Check for specific error status (e.g., 401 Unauthorized)
            return { success: false, error: "Failed to fetch one or more dashboard data streams." };
        }

        const renters = await rentersRes.json();
        const tickets = await ticketsRes.json();
        const report = await reportRes.json();

        return {
            success: true,
            renters: renters,
            tickets: tickets,
            report: report
        };

    } catch (error) {
        console.error("Network error fetching dashboard data:", error);
        return { success: false, error: "Cannot connect to the backend server." };
    }
};

export const removeTicket = async (ticketId) => {
    const API_BASE_URL = "http://localhost:3000";
    try {
        // API endpoint: PATCH /tickets/:id/remove
        const response = await fetch(`${API_BASE_URL}/tickets/${ticketId}/remove`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        const data = await response.json();

        if (!response.ok) {
            return { success: false, error: data.error || "Failed to remove ticket." };
        }
        return { success: true, message: data.message };

    } catch (error) {
        console.error("Remove ticket network error:", error);
        return { success: false, error: "Cannot connect to backend server." };
    }
};

export const updateRenterInfo = async (renterId, updatedData) => {
    const API_BASE_URL = "http://localhost:3000";
    try {
        // API endpoint: PATCH /renters/:id
        const response = await fetch(`${API_BASE_URL}/renters/${renterId}`, {
            method: 'PATCH',
            headers: { 
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData), 
        });

        const data = await response.json();
        
        if (!response.ok) {
            return { success: false, error: data.error || "Failed to update renter." };
        }

        return { 
            success: true, 
            message: data.message || "Renter details updated.",
            renter: data.renter
        };
    } catch (error) {
        console.error("Update renter network error:", error);
        return { success: false, error: "Cannot connect to backend server." };
    }
};

export const fetchAllTickets = async (searchTerm = '') => {
    const API_BASE_URL = "http://localhost:3000";
    try {
        // Send search term as a query parameter (e.g., ?search=plumbing)
        const url = `${API_BASE_URL}/tickets/all?search=${encodeURIComponent(searchTerm)}`;
        
        const response = await fetch(url);
        // ... include 401 checks here if this endpoint is protected ...
        
        const data = await response.json();

        if (!response.ok) {
            return { success: false, error: data.error || "Failed to fetch tickets." };
        }
        
        // Assuming the backend returns an array of tickets under 'tickets' key
        return { success: true, tickets: data.tickets || [] };

    } catch (error) {
        console.error("Fetch all tickets network error:", error);
        return { success: false, error: "Cannot connect to backend server." };
    }
};

// Calls the GET /tickets endpoint which is already configured for FIFO/Open tickets
export const fetchFIFOQueue = async (searchTerm = '') => {
    const API_BASE_URL = "http://localhost:3000";
    try {
        // Send search term as a query parameter (optional, for future refinement)
        const url = `${API_BASE_URL}/tickets?search=${encodeURIComponent(searchTerm)}`;
        
        const response = await fetch(url);

        // Check for 401 Authorization failure (Crucial!)
        if (response.status === 401) {
            localStorage.clear();
            window.location.href = '/staff/login'; 
            return { success: false, error: "Session expired." };
        }
        
        const data = await response.json();

        if (!response.ok) {
            return { success: false, error: data.error || "Failed to fetch queue." };
        }
        
        return { success: true, tickets: data || [] }; // Backend returns array of tickets

    } catch (error) {
        console.error("Fetch FIFO queue network error:", error);
        return { success: false, error: "Cannot connect to backend server." };
    }
};