import React, { useState,useContext,useEffect } from 'react';
import { Link ,useNavigate } from 'react-router-dom';
import './Login.css';
import '../../color.css';
import { Eye, EyeOff } from "lucide-react";
import LoginImage from '../../assets/Analytical-Dashboard.png';
import AuthContext from '../../Authservices/AuthContext';

const Login = () => {
  
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const { login, error, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const validateForm = () => {
    let errors = {};
    
    // Email validation
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
  
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const success = await login(formData);
      if (success) {
        navigate('/');
      }
    }
  };

  return (
    <div className="full-container">
    <div className="login-container">
      <div className="logo">🟪 LOGO</div>

      <div className="login-box">
        {/* Left Section */}
        <div className="login-left">
          <img src={LoginImage} alt="Dashboard" className="dashboard-image" />
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

        {/* Right Section */}
        <div className="login-right">
          <h2>Welcome Back</h2>
          <form>
            <div className="input-group">
              <label>Email Address*</label>
              <input type="email" placeholder="Email Address"
              name='email'
              onChange={handleChange}
              required />
            </div>

            <div className="input-group">
              <label>Password*</label>
              <div className="password-input">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  name='password'
                  onChange={handleChange}
                  required
                />
                <span
                  className="eye-icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <Eye /> : <EyeOff />}
                </span>
              </div>
            </div>

            <div className="forgot-password">
              <Link to="/forgot-password">Forgot Password?</Link>
            </div>

            <button type="submit" className="login-btn"onClick={handleSubmit}>Login</button>

            <p className="signup-link">
              Don't have an account? <Link to="/signup">Sign Up</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Login;
