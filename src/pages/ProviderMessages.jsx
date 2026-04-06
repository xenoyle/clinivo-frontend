import React from 'react';

export default function ProviderMessages() {
  return (
    <div className="container-fluid mt-3">
      <div className="row" style={{ height: '80vh' }}>
        {/* Patient Sidebar */}
        <div className="col-md-3 border-end d-flex flex-column">
          <div className="p-2">
            <input type="text" className="form-control mb-2" placeholder="Search patients..." />
          </div>
          <div className="list-group list-group-flush overflow-auto">
            <button className="list-group-item list-group-item-action active">
              <div className="d-flex justify-content-between">
                <strong>Jim Bob</strong>
                <span className="badge bg-danger rounded-pill">1</span>
              </div>
            </button>
            <button className="list-group-item list-group-item-action">Alice Smith</button>
            <button className="list-group-item list-group-item-action text-muted">Pending: Bob Ross</button>
          </div>
        </div>

        {/* Chatbox Area */}
        <div className="col-md-9 d-flex flex-column">
          <div className="p-3 border-bottom bg-white">
            <h5 className="mb-0">Jim Bob</h5>
            <small className="text-success">Verified Patient</small>
          </div>

          <div className="flex-grow-1 bg-light p-3 overflow-auto" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="align-self-start bg-primary text-white p-2 rounded mb-2" style={{ maxWidth: '60%' }}>
              <p className="mb-0">Jim, did you receive the notification for your next appointment?</p>
            </div>
            <div className="align-self-end bg-white border p-2 rounded mb-2" style={{ maxWidth: '60%' }}>
              <p className="mb-0">Yes, I got the alert on my phone. Thanks!</p>
            </div>
          </div>

          <div className="p-3 border-top bg-white">
            <div className="input-group">
              <input type="text" className="form-control" placeholder="Type instructions or reply..." />
              <button className="btn btn-dark">Send Message</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}