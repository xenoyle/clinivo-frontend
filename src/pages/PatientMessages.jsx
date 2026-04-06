import React from 'react';

export default function PatientMessages() {
  return (
    <div className="container mt-4">
      <div className="card shadow-sm mx-auto" style={{ maxWidth: '600px' }}>
        <div className="card-header bg-primary text-white d-flex justify-content-between">
          <span>Chat with Dr. Clarence</span>
        </div>
        
        {/* Chat Thread */}
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

        {/* Input Area */}
        <div className="card-footer bg-white">
          <div className="input-group">
            <input type="text" className="form-control" placeholder="Type a message..." />
            <button className="btn btn-primary">Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}