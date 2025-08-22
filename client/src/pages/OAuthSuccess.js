import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function OAuthSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('token', token);
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  }, [location, navigate]);

  return <p>Logging you in...</p>;
}

export default OAuthSuccess;

