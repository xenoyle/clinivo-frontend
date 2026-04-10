import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUser } from "../api/api";

export default function Register() {
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await createUser({
        firstName: firstname,
        lastName: lastname,
        email: email,
        phoneNumber: phone,
        password: password,
        role: role.toUpperCase(), // API expects uppercase role
      });
      navigate("/login");
    } catch (err) {
      console.error("Registration error:", err);
      setError("Failed to register. Please try again.");
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
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your first name"
                  required
                  value={firstname}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="col-md-6 mb-3 text-start">
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your last name"
                  required
                  value={lastname}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3 text-start">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="col-md-6 mb-3 text-start">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter your password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3 text-start">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  className="form-control"
                  placeholder="Enter your phone number"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="col-md-6 mb-3 text-start">
                <label className="form-label">Role</label>
                <select
                  className="form-select"
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="">Select a role...</option>
                  <option value="patient">Patient</option>
                  <option value="doctor">Healthcare Provider</option>
                </select>
              </div>
            </div>
            <button type="submit" className="btn btn-primary w-100 mb-2">
              Register
            </button>
            {error && <div className="alert alert-danger mt-2">{error}</div>}
          </form>
          <hr />
          <p className="text-center">Already have an account?</p>
          <button
            onClick={() => navigate("/login")}
            className="btn btn-outline-secondary w-100"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
