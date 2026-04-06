import React from 'react';

export default function Login() {
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-4 card p-4 shadow-sm">
          <h2 className="text-center mb-4">Clinivo Login</h2>
          <form>
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
              <a href="/reset-password" class="text-decoration-none small">Forgot Password?</a>
            </div>
          </form>
          <hr />
          <p className="text-center">Don't have an account?</p>
          <button className="btn btn-outline-secondary w-100">Create Account</button>
        </div>
      </div>
    </div>
  );
}