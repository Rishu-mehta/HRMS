import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Signup.css';
import '../../color.css';
import { Eye, EyeOff } from "lucide-react";
import Signupiamge from '../../assets/Analytical-Dashboard.png';
import axios from 'axios';
import { baseURL } from '../../Config';

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { fullName, email, password, confirmPassword } = formData;

    // Frontend validation
    if (!fullName || !email || !password || !confirmPassword) {
      setError('All fields are required.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      // Replace with your actual API endpoint
      const response = await axios.post(`${baseURL}/api/signup`,
         {
          headers: {
            'Content-Type': 'application/json'
          },
        fullName,
        email,
        password
      });

      setSuccess('Signup successful! Redirecting to login...');
      setFormData({ fullName: '', email: '', password: '', confirmPassword: '' });

      // Optional: Redirect after success
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    }
  };

  return (
    <div className='full-container'>
      <div className="register-container">
        <div className="logo">🟪 LOGO</div>

        <div className="register-box">
          <div className="register-left">
            <img src={Signupiamge} alt="Dashboard" className="dashboard-image" />
            <h2>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod</h2>
            <p>
              Tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
              quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <div className="dots">
              <span className="dot active"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </div>

          <div className="register-right">
            <h2>Welcome to Dashboard</h2>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label>Full Name*</label>
                <input type="text" placeholder="Full name" name="fullName" value={formData.fullName} onChange={handleChange} required />
              </div>

              <div className="input-group">
                <label>Email Address*</label>
                <input type="email" placeholder="Email Address" name="email" value={formData.email} onChange={handleChange} required />
              </div>

              <div className="input-group">
                <label>Password*</label>
                <div className="password-input">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <Eye /> : <EyeOff />}
                  </span>
                </div>
              </div>

              <div className="input-group">
                <label>Confirm Password*</label>
                <div className="password-input">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm Password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  <span className="eye-icon" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <Eye /> : <EyeOff />}
                  </span>
                </div>
              </div>

              {error && <p className="error-message">{error}</p>}
              {success && <p className="success-message">{success}</p>}

              <button type="submit" className="register-btn">Register</button>

              <p className="login-link">
                Already have an account? <Link to="/login">Login</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
