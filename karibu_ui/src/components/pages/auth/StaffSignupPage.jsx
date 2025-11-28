// src/pages/auth/StaffSignupPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Ensure your authService is updated to use the correct API endpoint
import { staffSignup } from '../../../services/authService'; 
import '../../../styles/AuthStyles.css'; 
// Goes from 'auth' -> 'pages' -> 'components' -> 'src' (Then finds styles)

function StaffSignupPage() {
  const navigate = useNavigate();
  const [staffNo, setStaffNo] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // State for confirmation

  const handleSignup = async () => {
    // 1. Define the data payload using the state variables
    const dataToSend = {
      staff_number: staffNo,
      name: name,
      email: email,
      password: password,
      password_confirmation: confirmPassword // Use Rails convention for confirmation
    };
    
    // 2. Call the service function with the payload
    const result = await staffSignup(dataToSend);

    if (result.success) {
      alert(result.message);
      navigate(result.redirect || "/staff/login");
    } else {
      // Display the specific error message returned by Rails validation
      alert(result.error || "Signup failed."); 
    }
  };

  return (
    <div className="auth-container">
      <h2>STAFF SIGNUP</h2>
      <form>
        <label>Full Name</label>
        <input type="text" value={name} onChange={e => setName(e.target.value)} />

        <label>Staff Number</label>
        <input type="text" value={staffNo} onChange={e => setStaffNo(e.target.value)} />

        <label>Email</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} />

        <label>Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />

        <label>Confirm Password</label>
        <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />

        <button type="button" onClick={handleSignup}>SIGN UP</button>
      </form>

      <p onClick={() => navigate('/login')}>Already have an account? Log in</p>
    </div>
  );
}

export default StaffSignupPage;