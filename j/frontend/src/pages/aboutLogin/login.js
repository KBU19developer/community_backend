import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {useCookies } from 'react-cookie';
import axios from 'axios';

function Login()
{
    const [id, setInputId]= useState('');
    const [pw, setInputPw]=useState('');
    
    const[cookies ,setCookie]= useCookies(['accessToken','refreshToken']);
    const navigate = useNavigate();


    const handleInputId = (e) => {
        setInputId(e.target.value)
    }
    const handleInputPw = (e) => {
        setInputPw(e.target.value)
    }
 
	
    const onClickLogin = async (e) => {
        const postInfo = { id, pw };
        try {
          const response = await axios.post('http://localhost:3001/login', postInfo);
          const data = response.data;
          if (data.s === 'success') {
            const access_token = data.accessToken;
            const refresh_token = data.refreshToken;
        
            
            setCookie('accessToken', access_token,{
                secure : false,
                httpOnly: true,
            });
            setCookie('refreshToken', refresh_token,{
                secure : false,
                httpOnly: true,
            });
            alert("Success");
            navigate('/');
          } else {
            alert("Try Again");
          }
        } catch (error) {
          console.log(error);
          alert("로그인 중 오류가 발생했습니다.");
        }
      };
   

    
    return (
        <div>
            <h2>Login</h2>
            <div>
                <label htmlFor='id'>ID : </label>
                <input type='text' name='id' value={id} onChange={handleInputId} />
            </div>
            <div>
                <label htmlFor='pw'>PW : </label>
                <input type='password' name='pw' value={pw} onChange={handleInputPw} />
            </div>
            <div>
                <button type='button' onClick={onClickLogin}>Login</button>
            </div>
            <br />
            <Link to="/Account">You don't have Account? Click here!</Link>
        </div>
    )
    

}

export default Login;