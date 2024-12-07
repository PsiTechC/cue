import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const ForAdmin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/admin/users`, {
          headers: {
            Authorization: localStorage.getItem('token')
          }
        });
        setUsers(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch users');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <div>
          <h2 className="text-2xl font-semibold mb-4">User List</h2>
          <ul className="text-left">
            {users.map((user) => (
              <li key={user._id} className="mb-2 p-2 border-b border-gray-200">
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>ID:</strong> {user._id}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ForAdmin;
