// src/components/pages/auth/RenterSignupPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { renterSignup } from '../../../services/authService'; 
import '../../../styles/AuthStyles.css';

function RenterSignupPage() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState(''); // New field
    const [hseNumber, setHseNumber] = useState('');
    const [idNumber, setIdNumber] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSignup = async () => {
        // Simple client-side check (Flow Logic)
        if (!name || !idNumber || !email || !hseNumber || !phone || !password || password !== confirmPassword) {
            alert("Please fill all fields and ensure passwords match.");
            return;
        }

        setIsLoading(true);

        const dataToSend = {
            name: name, // Frontend friendly keys
            email: email,
            house_number: hseNumber,
            id_number: idNumber,
            phone: phone,
            password: password,
            password_confirmation: confirmPassword
        };
        
        // Delegate to service layer (Flow Logic)
        const result = await renterSignup(dataToSend);

        setIsLoading(false);

        if (result.success) {
            alert(result.message);
            navigate(result.redirect || "/renter/login");
        } else {
            alert(result.error || "Renter signup failed.");
        }
    };

    return (
        <div className="auth-container">
            <h2>RENTER/OWNER SIGNUP</h2>
            <form>
                <label>Full Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} />
                
                <label>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} />

                <label>House/Unit Number</label>
                <input type="text" value={hseNumber} onChange={e => setHseNumber(e.target.value)} />
                
                <label>ID/Passport Number</label>
                <input type="text" value={idNumber} onChange={e => setIdNumber(e.target.value)} />
                
                <label>Phone Number</label>
                <input type="text" value={phone} onChange={e => setPhone(e.target.value)} />

                <label>Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} />

                <label>Confirm Password</label>
                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />

                <button type="button" onClick={handleSignup} disabled={isLoading}>
                    {isLoading ? "Signing Up..." : "SIGN UP"}
                </button>
            </form>

            <p onClick={() => navigate('/renter/login')}>Already have an account? Log in</p>
        </div>
    );
}

export default RenterSignupPage;
