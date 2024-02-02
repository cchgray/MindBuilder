import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../actions/api-config';

const AboutPage = () => {
  const { userId } = useParams(); // Get the userId from the URL
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Fetch user data based on the userId from the URL
    const fetchUserData = async () => {
      try {
        const response = await api.get(
          `/accounts/user-about/${userId}/`, {
            headers: {
                'Authorization': `JWT ${localStorage.getItem('access')}`,
            },
        }
        );
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  return (
    
    <div className="container mt-4">
    <h2>About Page</h2>
    {userData ? (
        <div>
            <h3>User Information</h3>
            <ul className="list-group">
                <li className="list-group-item">ID: {userData.id}</li>
                <li className="list-group-item">Name: {userData.first_name} {userData.last_name}</li>
                <li className="list-group-item">Role: {userData.role}</li>
                <li className="list-group-item">About: {userData.about}</li>
                <li className="list-group-item">Email: {userData.email}</li>
                {/* Add more user details as needed */}
            </ul>
        </div>
    ) : (
        <p>Loading user data...</p>
    )}
</div>
  );
};

export default AboutPage;
