import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import Logout from './logout';

function useAccessToken() {
  const navigate = useNavigate();
  const [cookies, setCookies] = useCookies(['accessToken', 'refreshToken']);

  const getAccessTokenAPI =  (accessToken) => {
    axios({
      url: "http://localhost:3001/accesstoken",
      method: "GET",
      withCredentials: true,
      Authorization: `Bearer ${accessToken}`
    })
    .then(res => {
      setCookies('accessToken',accessToken);
    })
    .catch(error => {
      console.log(error);
    });
  };

  const refreshTokenAPI =  (refreshToken) => { //check 해야함
    axios({
      url: "http://localhost:3001/refreshtoken",
      method: "GET",
      withCredentials: true
      
    })
    .then(res => {
      const { access_token, refresh_token } = res.data;
      console.log(res.data);
      setCookies('accessToken', access_token);
      setCookies('refreshToken', refresh_token);
      getAccessTokenAPI(access_token);
    })
    .catch(error => {
      console.log(error);
    });
  };

  useEffect(() => {
    const accessToken = cookies.accessToken;
    const refreshToken = cookies.refreshToken;
    if(!accessToken && !refreshToken){
      console.log(accessToken);
      console.log(refreshToken);
      navigate('/login');
      }
    else if (accessToken) {
      console.log("hi");
      getAccessTokenAPI(accessToken);
    }
    else if (refreshToken){
      console.log("hello");
      refreshTokenAPI(refreshToken);
    }
    else{
      alert("why?");
    }
    
  }, [cookies.accessToken, cookies.refreshToken, cookies, navigate, setCookies]);
}

export default useAccessToken;