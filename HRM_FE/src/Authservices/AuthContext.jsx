import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { baseURL } from '../Config';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Check for token in localStorage
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Decode token to get user info
        const decoded = jwtDecode(token);
        
        // Check if token is expired
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          // Token expired, logout user
          handleLogout();
        } else {
          // Set user info
          setUser(decoded);
          
          // Set up auto-logout
          const timeUntilExpiry = (decoded.exp - currentTime) * 1000;
          setTimeout(() => {
            handleLogout();
          }, timeUntilExpiry);
        }
      } catch (err) {
        console.error('Invalid token', err);
        handleLogout();
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real application, this would make an API call
      const response = await axios.post(`${baseURL}/api/login`, credentials);
      
      const { authToken,refreshToken } = response.data;
      localStorage.setItem('token', authToken);
      localStorage.setItem('refreshToken',refreshToken)
      
      const decoded = jwt_decode(token);
      setUser(decoded);
      
      // Set up auto-logout (2 hours as specified)
      setTimeout(() => {
        handleLogout();
      }, 2 * 60 * 60 * 1000); // 2 hours in milliseconds
      
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login: handleLogin,
        logout: handleLogout,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;