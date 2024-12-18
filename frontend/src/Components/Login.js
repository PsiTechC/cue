import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import loginBg from '../Assets/login-bg.jpg'; 
import Alert from './Alert'; 

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false); 
  const [otp, setOtp] = useState(''); 
  const [newPassword, setNewPassword] = useState(''); 
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');
  const [alertVisible, setAlertVisible] = useState(false); 
  const navigate = useNavigate();


  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, { email, password } , { withCredentials: true });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token); 
        localStorage.setItem('isAdmin', JSON.stringify(response.data.isAdmin));
        setAlertMessage('Login successful!');
        setAlertType('success');
        setAlertVisible(true);
        
        setTimeout(() => {
          setAlertVisible(false);
          // navigate('/dashboard'); 
          navigate(response.data.isAdmin ? '/admin' : '/dashboard');
        }, 4000);
      } else {
        setAlertMessage('Login failed');
        setAlertType('error');
        setAlertVisible(true);
        setTimeout(() => setAlertVisible(false), 5000);
      }
    } catch (error) {
      setAlertMessage('Error logging in. Please try again.');
      setAlertType('warning');
      setAlertVisible(true);
      setTimeout(() => setAlertVisible(false), 5000);
    }
  };


  const handleForgotPassword = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/forgot-password`, { email });
      setIsForgotPassword(true); 
      setAlertMessage('OTP sent to your email.');
      setAlertType('success');
      setAlertVisible(true);
      setTimeout(() => setAlertVisible(false), 5000);
    } catch (error) {
      setAlertMessage('Error sending OTP. Please enter correct email and try again.');
      setAlertType('warning');
      setAlertVisible(true);
      setTimeout(() => setAlertVisible(false), 5000);
    }
  };


  const handleResetPassword = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/reset-password`, { email, otp, newPassword });

      if (response.data.success) {
        setAlertMessage('Password reset successfully!');
        setAlertType('success');
        setAlertVisible(true);
        
        setTimeout(() => {
          setAlertVisible(false);
          setIsForgotPassword(false); 
          navigate('/login'); 
        }, 5000);
      } else {
        setAlertMessage('Failed to reset password. Please try again.');
        setAlertType('error');
        setAlertVisible(true);
        setTimeout(() => setAlertVisible(false), 5000);
      }
    } catch (error) {
      setAlertMessage('Error resetting password. Please enter correct email and try again.');
      setAlertType('warning');
      setAlertVisible(true);
      setTimeout(() => setAlertVisible(false), 5000);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col md:flex-row items-center justify-between"
      style={{
        backgroundImage: `url(${loginBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-gray-900/60 to-black/70 z-0"></div>

      <div className="flex flex-col justify-center items-center w-full md:w-1/2 text-white p-6 md:pl-20 pb-10 z-10 text-center md:text-left">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Empower Your Journey</h1>
        <p className="text-lg md:text-xl font-light text-center">
          Enter your credentials to access your projects, tasks, and all the tools you need to succeed. Let’s get back to work and keep your projects running smoothly!
        </p>
      </div>

      <div className="flex w-full md:w-1/2 h-full justify-center items-center p-6 z-10">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full" style={{ height: 'auto', fontFamily: 'Helvetica Neue, Arial, sans-serif' }}>
          {!isForgotPassword ? (
            <>
              <h1 className="text-3xl md:text-4xl font-light mb-4 text-center md:text-left">Welcome back</h1>
              <h1 className="text-3xl md:text-4xl font-normal mb-12 text-center md:text-left">Log In to your account</h1>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    required
                  />
                </div>
                <div>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    required
                  />
                </div>
                <p className="text-right text-sm">
                  <Link
                    to="#"
                    className="text-blue-600 hover:underline"
                    onClick={(e) => {
                      e.preventDefault();
                      handleForgotPassword(); 
                    }}
                  >
                    Forgot Password?
                  </Link>
                </p>
                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-400 transition"
                >
                  Log In
                </button>
                <p className="text-center mb-6 text-lg">
                  Don't have an account?{' '}
                  <Link to="/signup" className="text-blue-600 hover:underline">
                    Sign Up
                  </Link>
                </p>
              </form>
            </>
          ) : (
            <>
              <h1 className="text-3xl md:text-4xl font-normal mb-12 text-center md:text-left">Reset your password</h1>
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    required
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Enter the OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    required
                  />
                </div>
                <div>
                  <input
                    type="password"
                    placeholder="Enter your new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-400 transition"
                >
                  Reset Password
                </button>
              </form>
            </>
          )}
        </div>
      </div>
      <Alert message={alertMessage} type={alertType} visible={alertVisible} setVisible={setAlertVisible} />
    </div>
  );
};

export default Login;


