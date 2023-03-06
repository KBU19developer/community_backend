import React from 'react';
import useAccessToken from './auth';
import Logout from './logout';
import Login from './login';
import { useNavigate } from 'react-router-dom';

function HomePage() {
    useAccessToken();
    const navigate = useNavigate();
  return (
    <div>
      <h1>Homepage</h1>
      <p>로그인이 유지되고 있습니다.</p>
      <div>
        <button type='button' onClick={() => navigate('/login')}>GoLogin</button>
      </div>
      <div>
        <button type='button' onClick={() => navigate('/logout')}>GoLogout</button>
      </div>
      
      
    </div>
  );
}

export default HomePage;