import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Alert from './Alert'; // Import the Alert component

const Account = () => {
  const [email, setEmail] = useState('');  // To store the email
  const [error, setError] = useState('');  // To store the error
  const [isForgotPassword, setIsForgotPassword] = useState(false);  // Track if "Forgot Password" is clicked
  const [otp, setOtp] = useState(''); // OTP for password reset
  const [newPassword, setNewPassword] = useState(''); // New password for password reset
  const [resetError, setResetError] = useState(''); // Error for reset password process
  const [alertMessage, setAlertMessage] = useState(''); // To display alert messages
  const [alertType, setAlertType] = useState(''); // To track alert type
  const [alertVisible, setAlertVisible] = useState(false); // For alert visibility

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  // Fetch email on component load
  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const token = localStorage.getItem('token'); // Ensure token is correctly fetched
        const response = await axios.get(`${API_BASE_URL}/api/auth/user-email`, {
          headers: {
            Authorization: `${token}`, // Send token as Bearer token
          },
        });
        setEmail(response.data.email); // Set email state
      } catch (err) {
        console.error('Error fetching email:', err);
        setError('Failed to fetch email.');
      }
    };

    fetchEmail();
  }, []);

  // Handle Forgot Password: Open the modal and send OTP in background
  const handleForgotPassword = async () => {
    setIsForgotPassword(true); // Open the modal immediately

    try {
      await axios.post(`${API_BASE_URL}/api/auth/forgot-password`, { email });
      setAlertMessage('OTP sent to your email.');
      setAlertType('success');
      setAlertVisible(true);
    } catch (error) {
      setAlertMessage('Error sending OTP. Please try again.');
      setAlertType('error');
      setAlertVisible(true);
    }
  };

  // Handle Reset Password: Verify OTP and submit new password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/reset-password`, { email, otp, newPassword });
      if (response.data.success) {
        setAlertMessage('Password changed successfully! You can now log in with your new password.');
        setAlertType('success');
        setAlertVisible(true);
        setIsForgotPassword(false); // Close modal after successful reset
      } else {
        setResetError('Failed to reset password. Try again.');
      }
    } catch (error) {
      setResetError('Error resetting password. Please try again.');
    }
  };

  return (
    <div className='text-white'>
      <div className="p-5 flex justify-between items-center border-b border-[#2E2E2E] bg-[#1E1E1E]">
        <h2 className="text-xl font-normal text-center flex-grow ml-30">Account</h2>
      </div>
      {!isForgotPassword ? (
        <div className='font-thin pt-4 pl-5'>
          <h2 className='text-xl font-normal mb-1'>Hi there, </h2>
          <p>{error ? error : email}</p>
          {/* Forgot Password Button */}
          <button
            onClick={handleForgotPassword}  // Modal opens immediately
            className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Change Password
          </button>
        </div>
      ) : (
        // Modal for OTP and new password
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className='text-xl font-normal mb-4 text-black'>Reset Your Password</h2>
            <form onSubmit={handleResetPassword}>
              <div>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-3 border text-black border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition mb-4"
                  required
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Enter New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 border text-black border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition mb-4"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700"
              >
                Reset Password
              </button>
              {resetError && <p className="text-red-500 mt-4">{resetError}</p>}
            </form>
          </div>
        </div>
      )}

      {/* Alert Component */}
      <Alert message={alertMessage} type={alertType} visible={alertVisible} setVisible={setAlertVisible} />
    </div>
  );
};

export default Account;
