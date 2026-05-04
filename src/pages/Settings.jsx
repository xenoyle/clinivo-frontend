import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const navigate = useNavigate();

  return (
    <div className="container d-flex justify-content-center mt-4 mb-5">
      <div className="row w-100 justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">

          <div className="d-flex justify-content-between align-items-center">
            <h3>Account Settings</h3>
            <button
              onClick={() => navigate(-1)}
              className="btn btn-sm btn-secondary"
            >
              Go Back
            </button>
          </div>

          <div className="card mt-3 p-4 shadow-sm">

            <h5>Security & Privacy</h5>
            <hr />

            {/* Change Password */}
            <div className="mb-4">
              <h6>Change Password</h6>
              <button className="btn btn-outline-primary btn-sm">
                Update Password
              </button>
            </div>

            {/* 2FA */}
            <div className="mb-4">
              <h6>Two-Factor Authentication (2FA)</h6>
              <p className="text-muted small">
                Add an extra layer of security to your account.
              </p>

              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="2faSwitch"
                />
                <label className="form-check-label" htmlFor="2faSwitch">
                  Enable 2FA
                </label>
              </div>
            </div>

            {/* Session Settings */}
            <div className="mb-2">
              <h6>Session Settings</h6>
              <p className="text-muted small">
                Automatically log out after 15 minutes of inactivity.
              </p>

              <button
                onClick={() => navigate('/login')}
                className="btn btn-outline-danger btn-sm"
              >
                Log Out of All Devices
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
