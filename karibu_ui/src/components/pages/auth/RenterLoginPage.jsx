// src/components/pages/auth/RenterLoginPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Ensure this path correctly leads to your authService.js
import { renterLogin } from '../../../services/authService'; 
import '../../../styles/AuthStyles.css';

function RenterLoginPage() {
    const navigate = useNavigate();
    // Renters log in using their ID Number
    const [idNumber, setIdNumber] = useState(''); 
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        // UI Logic: Client-side input check
        if (!idNumber || !password) {
            alert("Please enter both ID Number and Password.");
            return;
        }

        setIsLoading(true);

        const credentials = {
            // Key must match the Rails controller's expected parameter
            renter_id_number: idNumber, 
            password: password
        };

        // Flow Logic: Delegate authentication to the service layer
        const result = await renterLogin(credentials);

        setIsLoading(false);

        if (result.success) {
            alert(result.message);

            // Flow Logic: Store session info (Crucial for Complaint Lodging API calls)
            localStorage.setItem("renterId", result.renter_id);
            localStorage.setItem("renterName", result.renter_name);

            // Redirect to the Renter Dashboard
            navigate(result.redirect || "/renter/dashboard");
        } else {
            // Flow Logic: Display error from backend
            alert(result.error || "Login failed. Check your ID Number and Password.");
        }
    };

    return (
        <div className="auth-container">
            <h2>RENTER/OWNER LOGIN</h2>
            <form>
                <label>ID/Passport Number</label>
                <input
                    type="text"
                    value={idNumber}
                    onChange={e => setIdNumber(e.target.value)}
                    disabled={isLoading}
                />

                <label>Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    disabled={isLoading}
                />

                <button type="button" onClick={handleLogin} disabled={isLoading}>
                    {isLoading ? "LOGGING IN..." : "LOGIN"}
                </button>
            </form>

            <p onClick={() => navigate('/renter/signup')}>Don’t have an account? Sign up</p>
        </div>
    );
}

export default RenterLoginPage;