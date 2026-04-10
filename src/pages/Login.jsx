import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const data = await loginUser({ email: email, password: password });
      if (!data) {
        setError("Invalid email or password.");
        return;
      }
      localStorage.setItem("user", JSON.stringify(data));
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid email or password.");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    if (user.role === "patient") {
      navigate("/patient-messages");
    } else if (user.role === "provider") {
      navigate("/provider-messages");
    } else {
      setError("Unknown user role.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-4 card p-4 shadow-sm">
          <h2 className="text-center mb-4">Clinivo Login</h2>
          <form onSubmit={handleLogin}>
            <div className="mb-3 text-start">
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
            <div className="mb-3 text-start">
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
            <button type="submit" className="btn btn-primary w-100 mb-2">
              Login
            </button>
            <div className="text-center">
              <a href="#" className="text-decoration-none small">
                Forgot Password?
              </a>
            </div>
            {error && <div className="alert alert-danger mt-2">{error}</div>}
          </form>
          <hr />
          <p className="text-center">Don't have an account?</p>
          <button
            onClick={() => navigate("/register")}
            className="btn btn-outline-secondary w-100"
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
}
