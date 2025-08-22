import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';

function Login({setUser}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
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
    try {
      const res = await api.post('/auth/login', { username, password });
      localStorage.setItem('token', res.data.token);
      setUser({ token: res.data.token });
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      if (msg === "User not found") {
      // redirect to register
      navigate("/register", { state: { username } });
      } else {
        setError(msg);
      }
    }
  };

  
return (
  <div className="auth-page">
  <h2 className="authorizing">Login</h2>
  <form onSubmit={handleSubmit}>
    <input
      placeholder="Username"
      value={username}
      onChange={e => setUsername(e.target.value)}
      required
    />
    <input
      placeholder="Password"
      type="password"
      value={password}
      onChange={e => setPassword(e.target.value)}
      required
    />
    <button type="submit">Login</button>
  </form>
  <p style={{fontSize : '30px'}}>Or</p>
  <a href={`${process.env.REACT_APP_SERVER_URL}/auth/google`}>
    <button className="google-btn">Login with Google</button>
  </a>
  {error && <p style={{ color: 'red' }}>{error}</p>}
</div>
);

}


export default Login;
