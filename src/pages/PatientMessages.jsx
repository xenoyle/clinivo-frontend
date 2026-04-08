import React from 'react';
import { Link } from 'react-router-dom';

export default function PatientMessages() {
  return (
    <div className="container mt-4">
      <div className="card shadow-sm mx-auto" style={{ maxWidth: '600px' }}>
        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
          <span>Chat with Dr. Clarence</span>
          <Link to="/settings" className="btn btn-sm btn-outline-light">Settings</Link>
        </div>
        <div className="card-body bg-light" style={{ height: '400px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          <div className="align-self-start bg-white p-2 rounded mb-2 shadow-sm" style={{ maxWidth: '75%' }}>
            <p className="mb-0 small text-muted">Dr. Clarence • 10:30 AM</p>
            <p className="mb-0">Hi Jim, I've reviewed your history. Everything looks secure here.</p>
          </div>
          <div className="align-self-end bg-primary text-white p-2 rounded mb-2 shadow-sm" style={{ maxWidth: '75%' }}>
            <p className="mb-0 small text-light">You • 10:32 AM</p>
            <p className="mb-0">Thanks doctor. I just wanted to make sure my info stays private.</p>
          </div>
        </div>
        <div className="card-footer bg-white">
          <div className="input-group">
            <input type="text" className="form-control" placeholder="Type a message..." />
            <button className="btn btn-primary">Send</button>
          </div>
        </div>
      </div>
      <div className="text-center mt-3">
        <Link to="/provider" className="text-muted small">Switch to Provider View (Demo Only)</Link>
      </div>
    </div>
  );
}