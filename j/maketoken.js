
const jwt = require('jsonwebtoken');

 // Access Token 발행 함수
function generateAccessToken(userId) {
    const accessToken = jwt.sign({ Id: userId }, 'accesstoken', { expiresIn: '5m' });
    return accessToken;
  }
  
  // Refresh Token 발행 함수
  function generateRefreshToken(userId) {
    const refreshToken = jwt.sign({ Id: userId }, 'refreshtoken',{
        expiresIn : '24h'
    });
    return refreshToken;
  }
  //Access Token 디코딩해서 판별하는 함수
  function verifyAccessToken(req, res) {
    
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      return res.status(401).redirect('/login');//post 방식으로 받았기 때문에 redirect로 처리
    }
  
    const userId =jwt.verify(accessToken, 'accesstoken', (err, decoded) => {
      if (err) {
        return res.status(403).redirect('/login');
      }
      return decoded.Id;
    })
    
    return userId;
  }
  //Refresh Token 디코딩 해서 판별하는 함수
  function verifyRefreshToken(req, res, next) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh Token not found' });
    }
  
    jwt.verify(refreshToken, 'refreshtoken', (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Refresh Token is not valid' });
      }
  
      const userId = decoded.Id;
      const accessToken = jwt.sign({ Id: userId }, 'accesstoken', { expiresIn: '5m' });
      const newRefreshToken = jwt.sign({ Id: userId }, 'refreshtoken', { expiresIn: '24h' });
  
      res.cookie('refreshToken', newRefreshToken, { secure: false ,httpOnly: true });
      res.cookie('accessToken', accessToken, { secure: false ,httpOnly: true });
      req.userId = userId;
      req.accessToken = accessToken;
      req.newRefreshToken = newRefreshToken;
      next();
    });
  }
  
  
  
  
  module.exports= {Gat:generateAccessToken, Grt: generateRefreshToken, vat:verifyAccessToken, vrt:verifyRefreshToken };
