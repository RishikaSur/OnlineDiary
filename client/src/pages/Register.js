import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import api from '../services/api';

function Register({ setUser }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [userExists, setUserExists] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.username) {
      setUsername(location.state.username);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setUserExists(false);

    try {
      await api.post('/auth/register', { username, password });

      // Auto-login after successful registration
      const res = await api.post('/auth/login', { username, password });
      localStorage.setItem('token', res.data.token);
      setUser({ token: res.data.token });
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed";
      if (msg === "User already exists") {
        setUserExists(true);
      } else {
        setError(msg);
      }
    }
  };

  return (
    <div className="auth-page">
      <h2 className="authorizing">Register</h2>
      
      {!userExists ? (
        <>
          <form onSubmit={handleSubmit}>
            <input
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Register</button>
          </form>
          <p style={{ fontSize: '30px' }}>Or</p>
          <a href={`${process.env.REACT_APP_SERVER_URL}/auth/google`}>
            <button className="google-btn">Register with Google</button>
          </a>
        </>
      ) : (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <p style={{ color: 'red', fontSize: '20px' }}>
            Username already exists.
          </p>
          <p style={{ fontSize: '18px' }}>
            Already registered? <Link to="/login">Go to Login</Link>
          </p>
          <p style={{ fontSize: '18px' }}>
            New user? Please Create an Account using a Different Username.
          </p>
          <button
            onClick={() => {
              setUserExists(false);
              setUsername('');
              setPassword('');
            }}
            style={{ marginTop: '10px' }}
          >
            Try Again
          </button>
        </div>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default Register;
