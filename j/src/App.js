import { Route, Routes,Navigate} from 'react-router-dom';
import { useCookies } from 'react-cookie';
import HomePage from './home';
import Login from './login';
import useAccessToken from './auth';
import Logout from './logout';

function App() {
  

  return (
    <div>
      <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/logout" element= {<Logout />} />
        <Route path="/" element= {<HomePage />} />
        {/* <Route path="/accesstoken" element={<Auth />}/> */}
        {/* <Route path="*" element={<Login />} /> */}
       
      
      </Routes>
    
    
    </div>
  );
}

export default App;
