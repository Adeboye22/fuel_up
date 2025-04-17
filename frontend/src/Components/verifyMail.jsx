import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ProtectedRoute({children}) {
  const [ isLoading, setIsLoading ] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');

        if(!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('/api/auth/verify', {
          headers:{
            Authorization:`Bearer ${token}`,
          },
        });

        if (response.data.success) {
          //user is authenticated
        } else {
          //Token is invalid, log the user out 
          localStorage.removeItem('token');
          navigate('/login');
        }
      } catch (err) {
        console.err('Authentication error', err);
        localStorage.removeItem('token');
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };
  })
  return (
    <div></div>
  )
}

export default ProtectedRoute;