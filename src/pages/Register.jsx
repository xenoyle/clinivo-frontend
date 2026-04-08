import { React, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
        userRole: ''
    });

    const handleRegister = (e) => {
        e.preventDefault();

        if (!userRole) {
            alert("Please select a role before registering.");
            return;
        } else if (userRole === "patient") {
            navigate('/patient-messages');
        } else if (userRole === "provider") {
            navigate('/provider-messages');
        } else {
            alert("Unexpected error, please report to support.");
        }

    };


    return (
        <div className="container mt-4">
            <div className="row justify-content-center">
                <div className="col-md-8 card p-4 shadow-sm">
                    <h2 className="text-center mb-4">Clinivo Register</h2>
                    <form onSubmit={handleRegister}>
                        <div className="row">
                            <div className="col-md-6 mb-3 text-start">
                                <label className="form-label">First Name</label>
                                <input type="text" 
                                       className="form-control" 
                                       placeholder="Enter your first name" 
                                       required 
                                       value={formData.firstName}
                                       onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                />
                            </div>
                            <div className="col-md-6 mb-3 text-start">
                                <label className="form-label">Last Name</label>
                                <input type="text" 
                                       className="form-control" 
                                       placeholder="Enter your last name" 
                                       required 
                                       value={formData.lastName}
                                       onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6 mb-3 text-start">
                                <label className="form-label">Email Address</label>
                                <input type="email" 
                                       className="form-control" 
                                       placeholder="Enter your email" 
                                       required 
                                       value={formData.email}
                                       onChange={(e) => setFormData({...formData, email: e.target.value})}
                                />
                            </div>
                            <div className="col-md-6 mb-3 text-start">
                                <label className="form-label">Password</label>
                                <input type="password" 
                                       className="form-control" 
                                       placeholder="Enter your password" 
                                       required 
                                       value={formData.password}
                                       onChange={(e) => setFormData({...formData, password: e.target.value})}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6 mb-3 text-start">
                                <label className="form-label">Phone Number</label>
                                <input type="tel" 
                                       className="form-control" 
                                       placeholder="Enter your phone number" 
                                       required 
                                       value={formData.phone}
                                       onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                />
                            </div>

                            <div className="col-md-6 mb-3 text-start">
                                <label className="form-label">Role</label>
                                <select className="form-select" value={formData.userRole} onChange={(e) => setFormData({...formData, userRole: e.target.value})} required>
                                    <option value="">Select a role...</option>
                                    <option value="patient">Patient</option>
                                    <option value="provider">Healthcare Provider</option>
                                </select>
                            </div>

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