const express = require('express');
const path = require('path');
const app = express();
// const static = require('serve-static');
const port = 3001;
const Hashing = require('./API/encryt.js');
const cors= require('cors');
const cookieParser = require('cookie-parser');
const token = require('./maketoken.js');
const router =express.Router();
const sql= require('./sql.js');

  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, './frontend/build')));//static resource 사용할 폴더 지정! html, css, js 
  app.use(express.urlencoded({extended: true}))//json 파싱
  app.use(express.json())//json 파싱
//   app.use('/', static(path.join(__dirname, '')));//static resource 사용할 폴더 지정! html, css, js 
  app.use(cors());//다른 port 연결하기 위한 cors 정책 뚫기 위함 
  
app.post("/login", (req, res) => {
    console.log(`로그인 호출`);
    console.log(req.body.id);
    var id = req.body.id;
    var pw = req.body.pw;
    
   console.log("로그인 요청" + id,pw);
   sql.check(id)
   .then((rows)=> { if(rows.length == 0)
    {
        console.log('아이디 [%s], 아이디가 일치x', id)
        res.send({'f' : 'fail'});
        res.end();
        return;
    }

    else if(rows.length > 0 ){
       
        var hashpassword;
        // console.log("%s", rows[0].spw);
        // console.log("%s", rows[0].pw);
        hashpassword=Hashing.ReHash(pw, rows[0].spw);//쉣~~~
        // console.log("%s", hashpassword);
        if(rows[0].pw === hashpassword)
        {
            try{
                //  access token sign({ 사용자 정보  })
                const accessToken = token.Gat(rows[0].id);
                const refreshToken= token.Grt(rows[0].id);
                //token 전송
                res.cookie('accessToken', accessToken, {
                    secure : false
                });
                res.cookie('refreshToken', refreshToken, {
                    secure : false  
                }
                );
               
                console.log('아이디 [%s], 패스워드가 일치하는 이름 [%s] 찾음', id);
                res.status(200).json({'s':'success', accessToken ,refreshToken});
               
                }
                catch(error){
                    console.log('토큰 오류');
                    res.status(500).json({'f':'fail'});
                }
        }
        
        else {
            console.log('아이디 [%s], 패스워드가 일치x', id)
            res.send({'f' : 'fail'});
            res.end();
            return;            
    }          
    }})
    .catch((err)=> {
        res.send({'f':'fail'});
        console.log(err);
    });   
});
app.get('/accesstoken', (req, res) => {
    const userId = token.vat(req, res);
    if (userId) {
      sql.check(userId)
        .then((rows)=>{
          if(rows[0].id == userId) {
            console.log(userId);
            res.json({message: userId});
          } else {
            res.json({message : "fail"});
          }
        })
        .catch((err)=>{
          res.json({message : "fail"});
        });
    } else {
      res.status(401).redirect('/login');
    }
  });
app.get('/refreshtoken',token.vrt, (req,res) =>
{
    const accessToken =req.accessToken;
    const refreshToken = req.newRefreshToken;
    res.json({accessToken,refreshToken});
});
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, './frontend/build/index.html'));
});
app.post('/logout', (req, res) => {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.status(200).send('Logged out');
    console.log(req.cookies);
  });
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './frontend/build/index.html'));
});
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, './frontend/build/index.html'));
// });

app.listen(port, () => {
    console.log(`server is listening at localhost:${port}`);
});


