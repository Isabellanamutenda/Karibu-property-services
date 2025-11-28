// src/services/ticketService.js
const API_BASE_URL = "http://localhost:3000";

export const lodgeComplaint = async (renterId, complaintData) => {
    try {
        // API endpoint: POST /renters/:renterId/lodge_complaint
        const response = await fetch(`${API_BASE_URL}/renters/${renterId}/lodge_complaint`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ complaint: complaintData }), 
        });

        const data = await response.json();
        
        if (!response.ok) {
            return { success: false, error: data.error || "Complaint submission failed." };
        }

        return { 
            success: true, 
            message: data.message, 
            ticket_number: data.ticket_number 
        };
    } catch (error) {
        console.error("Complaint network error:", error);
        return { success: false, error: "Cannot connect to backend server." };
    }
};

export const submitFollowUp = async (ticketNumber, followUpData) => {
    const API_BASE_URL = "http://localhost:3000";
    try {
        // API endpoint: PATCH /tickets/:ticket_number/follow_up
        const response = await fetch(`${API_BASE_URL}/tickets/${ticketNumber}/follow_up`, {
            method: 'PATCH',
            headers: { 
                'Content-Type': 'application/json',
            },
            // CRITICAL: Wrap the data under the key expected by the controller's strong params
            body: JSON.stringify({ follow_up: followUpData }), 
        });

        const data = await response.json();
        
        if (response.status === 401) {
             // Handle unauthorized session gracefully
            window.location.href = '/renter/login';
            return { success: false, error: "Session expired." };
        }
        
        if (!response.ok) {
            return { success: false, error: data.error || "Follow-up submission failed." };
        }

        return { 
            success: true, 
            message: data.message, 
            ticket_number: data.ticket_number 
        };
    } catch (error) {
        console.error("Follow-up network error:", error);
        return { success: false, error: "Cannot connect to backend server." };
    }
};
