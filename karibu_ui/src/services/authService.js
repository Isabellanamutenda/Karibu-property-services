// src/services/authService.js

const API_BASE_URL = "http://localhost:3000";

// --- CUSTOMER ASSISTANT FUNCTIONS ---

export const staffSignup = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/customer_assistants`, { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData), 
    });

    const text = await response.text();
    let data;
    try {
        data = JSON.parse(text);
    } catch (err) {
        console.error("Signup JSON parse error:", err, "Raw response:", text);
        return { success: false, error: "Server returned invalid response." };
    }

    if (!response.ok) {
      return { success: false, error: data.error || "Signup failed with network error." };
    }

    return { success: true, message: data.message, redirect: data.redirect };
  } catch (error) {
    console.error("Signup network error:", error);
    return { success: false, error: "Cannot connect to backend server (port 3000)." };
  }
};

export const staffLogin = async (credentials) => {
    try {
        const response = await fetch(`${API_BASE_URL}/customer_assistants/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials) 
        });

        const text = await response.text();
        let data;
        try {
            data = JSON.parse(text);
        } catch (err) {
            console.error("Login JSON parse error:", err, "Raw response:", text);
            return { success: false, error: "Server returned invalid response." };
        }
        
        if (response.ok) {
            return { 
                success: true, 
                message: data.message, 
                redirect: data.redirect, 
                staffNumber: data.staff_staff_number,
                staffName: data.staff_name,
                token: data.token 
            };
        } else {
            return { success: false, error: data.error || "Login failed." };
        }

    } catch (error) {
        console.error("Login network error:", error);
        return { success: false, error: "Login failed. Check your network connection." };
    }
};

// --- RENTER FUNCTIONS (NEW IMPLEMENTATION) ---

export const renterSignup = async (userData) => {
  try {
    // API endpoint: POST /renters
    const response = await fetch(`${API_BASE_URL}/renters`, { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData), 
    });

    const text = await response.text();
    let data;
    try {
        data = JSON.parse(text);
    } catch (err) {
        console.error("Renter Signup JSON parse error:", err, "Raw response:", text);
        return { success: false, error: "Server returned invalid response." };
    }

    if (!response.ok) {
      return { success: false, error: data.error || "Renter signup failed." };
    }

    return { success: true, message: data.message, redirect: data.redirect };
  } catch (error) {
    console.error("Renter Signup network error:", error);
    return { success: false, error: "Cannot connect to backend server." };
  }
};

export const renterLogin = async (credentials) => {
    try {
        // API endpoint: POST /renters/login
        const response = await fetch(`${API_BASE_URL}/renters/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials) 
        });

        const text = await response.text();
        let data;
        try {
            data = JSON.parse(text);
        } catch (err) {
            console.error("Renter Login JSON parse error:", err, "Raw response:", text);
            return { success: false, error: "Server returned invalid response." };
        }
        
        if (response.ok) {
            return { 
                success: true, 
                message: data.message, 
                redirect: data.redirect, 
                // Return data fields from the backend
                renter_id: data.renter_id,
                renter_name: data.renter_name,
                token: data.token 
            };
        } else {
            return { success: false, error: data.error || "Login failed." };
        }

    } catch (error) {
        console.error("Renter Login network error:", error);
        return { success: false, error: "Login failed. Check your network connection." };
    }
};
