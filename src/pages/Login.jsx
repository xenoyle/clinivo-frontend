import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
  
    navigate('/patient-messages'); 
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-4 card p-4 shadow-sm">
          <h2 className="text-center mb-4">Clinivo Login</h2>
          <form onSubmit={handleLogin}>
            <div className="mb-3 text-start">
              <label className="form-label">Email Address</label>
              <input type="email" className="form-control" placeholder="Enter your email" required />
            </div>
            <div className="mb-3 text-start">
              <label className="form-label">Password</label>
              <input type="password" className="form-control" placeholder="Enter your password" required />
            </div>
            <button type="submit" className="btn btn-primary w-100 mb-2">Login</button>
            <div className="text-center">
              <a href="#" className="text-decoration-none small">Forgot Password?</a>
            </div>
          </form>
          <hr />
          <p className="text-center">Don't have an account?</p>
          <button onClick={() => navigate('/settings')} className="btn btn-outline-secondary w-100">Create Account</button>
        </div>
      </div>
    </div>
  );
}