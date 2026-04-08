import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
  
    navigate('/patient-messages'); 
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8 card p-4 shadow-sm">
          <h2 className="text-center mb-4">Clinivo Register</h2>
          <form onSubmit={handleLogin}>
            <div className="row">
                <div className="col-md-6 mb-3 text-start">
                <label className="form-label">First Name</label>
                <input type="text" className="form-control" placeholder="Enter your first name" required />
                </div>
                <div className="col-md-6 mb-3 text-start">
                <label className="form-label">Last Name</label>
                <input type="text" className="form-control" placeholder="Enter your last name" required />
                </div>
            </div>
            <div className="row">
                <div className="col-md-6 mb-3 text-start">
                <label className="form-label">Email Address</label>
                <input type="email" className="form-control" placeholder="Enter your email" required />
                </div>
                <div className="col-md-6 mb-3 text-start">
                <label className="form-label">Password</label>
                <input type="password" className="form-control" placeholder="Enter your password" required />
                </div>
            </div>
            <div className="row">
                <div className="col-md-6 mb-3 text-start">
                <label className="form-label">Phone Number</label>
                <input type="tel" className="form-control" placeholder="Enter your phone number" required />
                </div>
                
                {/* Figure out how to make a role selection dropdown */}
                {/* <div className="col-md-6 mb-3 text-start">
                <label className="form-label">Role</label>
                <input type="range" className="form-control" placeholder="Enter your password" required />
                </div> */}
                
            </div>
            <button type="submit" className="btn btn-primary w-100 mb-2">Register</button>
          </form>
          <hr />
          <p className="text-center">Already have an account?</p>
          <button onClick={() => navigate('/login')} className="btn btn-outline-secondary w-100">Login</button>
        </div>
      </div>
    </div>
  );
}