import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const loginData = {
      username: username,
      password: password,
    };

    try {
      const response = await axios.post(
        "https://csice-attendance.saranmani.tech/api/v1/admin/auth/login",
        loginData,
        { withCredentials: true }
      );

      console.log("API Response:", response.data);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("admin", JSON.stringify(response.data.data.admin));
      alert("Login Successful!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      alert(error.response?.data?.message || "Error logging in. Please check your network and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="login-form">
          <h1 className="funky-font">Welcome Back!</h1>
          <p className="login-tagline">Sign in to continue to your dashboard</p>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            <button type="submit" className="login-button" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>

      <div className="login-right">
        <img src="/login.jpg" alt="Login Illustration" />
      </div>
    </div>
  );
};

export default Login;
