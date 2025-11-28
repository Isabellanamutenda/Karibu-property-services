// src/components/pages/StaffLoginPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// The import for the service function is required for flow logic
import { staffLogin } from '../../../services/authService'; 
import '../../../styles/AuthStyles.css';

function StaffLoginPage() {
 const navigate = useNavigate();
 const [staffNo, setStaffNo] = useState('');
 const [password, setPassword] = useState('');
   const [isLoading, setIsLoading] = useState(false); // Flow logic

 const handleLogin = async () => {
   // Client-side quick check logic
   if (!staffNo || !password) {
     alert("Please enter both Staff Number and Password.");
     return;
   }

   setIsLoading(true);

   const credentials = {
        staff_number: staffNo, 
        password: password
    };

    // Flow logic: Call the service layer
    const result = await staffLogin(credentials);

    setIsLoading(false);

   if (result.success) {
     alert(result.message);

     // Flow logic: Store session info and navigate
     localStorage.setItem("staffNumber", result.staffNumber);
     if (result.staffName) localStorage.setItem("staffName", result.staffName);
     if (result.token) localStorage.setItem("authToken", result.token); 

     navigate(result.redirect || "/staff/dashboard");
   } else {
     // Flow logic: Display server error
     alert(result.error || "Login failed. Please try again.");
   }
 };

 return (
   <div className="auth-container">
     <h2>STAFF LOGIN</h2>
     <form>
       <label>Staff Number</label>
       <input
         type="text"
         value={staffNo}
         onChange={e => setStaffNo(e.target.value)}
       />

       <label>Password</label>
       <input
         type="password"
         value={password}
         onChange={e => setPassword(e.target.value)}
       />

       <button type="button" onClick={handleLogin} disabled={isLoading}>
            {isLoading ? "LOGGING IN..." : "LOGIN"}
        </button>
     </form>

     <p onClick={() => navigate('/staff/signup')}>Don’t have an account? Sign up</p>
   </div>
 );
}

export default StaffLoginPage;
