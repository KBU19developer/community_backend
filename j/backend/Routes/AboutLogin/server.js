const express = require('express');
const router = express.Router();
const Hashing = require('../../API/encryt');
const token = require('../../API/maketoken');
const DB = require('../../API/DBmanage.js');

router.post("/", (req, res) => {
    console.log(`로그인 호출`);
    console.log(req.body.id);
    const id = req.body.id;
    const pw = req.body.pw;

   console.log("로그인 요청" + id,pw);
   DB.Check('user', { user_id : id }, ['user_id', 'user_password', 'salt_key'])
   .then((rows)=> { if(rows.length == 0)
    {
        console.log('아이디 [%s], 아이디가 일치x', id)
        res.send({'f' : 'fail'});
        res.end();
    }

    else if(rows.length > 0 ){
       
        const hashpassword=Hashing.ReHash(pw, rows[0].salt_key);//쉣~~~
        // console.log("%s", hashpassword);
        if(rows[0].user_password === hashpassword)
        {
            try{
                //  access token sign({ 사용자 정보  })
                const accessToken = token.Gat(rows[0].user_id);
                const refreshToken= token.Grt(rows[0].user_id);
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
router.get('/accesstoken', token.vat ,(req, res) => {
    const userId = req.userId;
    if (userId) {
      DB.Check('user',{ user_id : userId }, ['user_id','user_password','salt_key'])                    ////////////////////////////////////////////////////
        .then((rows)=>{
          if(rows[0].user_id == userId) {
            
            res.json({message: userId});
          } else {
            res.json({message : "fail"});
          }
        })
        .catch((err)=>{
          res.json({message : "fail"});
        });
    } else {
      res.status(401).json('fail');
    }
  });
router.get('/refreshtoken',token.vrt, (req,res) =>
{
  const refreshToken = req.refreshToken;
  const accessToken = req.accessToken;
  console.log(refreshToken,accessToken);
  res.cookie('refreshToken', refreshToken, { secure: false });
  res.cookie('accessToken', accessToken, { secure: false });
  res.status(200).json({accessToken, refreshToken});
});
/* router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, './frontend/build/index.html'));
});*/
router.post('/logout', (req, res) => {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.status(200).send('Logged out');
  });

module.exports = router;