// 백엔드 서버 시작점

const express = require('express'); // express 모듈을 가져온다.
const app = express();
const port = 3000 
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const config = require('./config/key');

// application/x-www-form-urlencoded 와 같은 형식의 데이터를 분석 할 수 있게 해준다.
app.use(bodyParser.urlencoded({extended : true}));

// application/json 형식의 데이터를 분석하여 가져온다.
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require('mongoose');
mongoose.connect(config.mongoURI ,{
    useNewUrlParser : true, useUnifiedTopology : true
}).then(()=> console.log('MongoDB Connected...')).catch(err => console.log('error'));

const { User } = require('./models/User');
const { auth } = require('./middleware/auth');


app.get('/', (req, res) => res.send('Hello World! 123')); // 루트 디렉토리에 hello world! 출력

// 회원가입을 위한 route
app.post('/api/user/register', (req, res) => {
    // 회원 가입 할 때 필요한 정보들을 client 에서 가져오면
    // 그것들을 데이터베이스에 넣어준다. -> User.js 모델을 가져온다.

    const user = new User(req.body) // json 형식으로 정보가 들어온다.

    // MongoDB 메서드 -> 정보들이 user 모델에 저장이 된다.
    user.save((err, userInfo)=>{
        if(err){
            return res.json({success : false, err});
        } else {
            return res.status(200).json({success : true});
        }
    }) 
})

app.post('/api/user/login', (req, res) => {
    // 1. 요청된 이메일을 데이터베이스에서 있는지 찾는다.
    User.findOne({email : req.body.email}, (err, userInfo) => {
        if(!userInfo){
            return res.json({
                loginSuccess : false,
                message : '제공된 이메일에 해당하는 유저가 없습니다.'
            })
        }
        // 2. 요청한 이메일이 데이터베이스에 있다면, 비밀번호가 같은지 확인
        userInfo.comparePassword(req.body.password, (err, isMatch) => {
            if(!isMatch){
                // 비밀번호가 같지 않다.
                return res.json({loginSuccess : false, message : '비밀번호가 틀렸습니다.'});
            } else {
                // 3. 비밀번호 까지 같다면 유저를 위한 token 생성
                userInfo.getToken((err, user) => {
                    if(err){
                        return res.status(400).send(err);
                    } else {
                        // 토큰을 저장한다. 쿠키 ( 다른 방법도 있다. )
                        // 쿠키 저장하려면 라이브러리 다운 - express 에서 제공하는 ( npm install cookie-parser --save)
                        res.cookie("x_auth", user.token)
                            .status(200) // 성공
                            .json({loginSuccess : true, userId : user._id});
                    }
                })
            }
        })
    })
})


// auth 기능
// 가운데 auth 는 미들웨어 : 중간에서 처리
app.get('/api/user/auth', auth ,(req, res) => {
    // 여기까지 미들웨어를 통과해 왔다는 뜻 -> 인증이 성공적으로 진행 됬다는 뜻.
    res.status(200).json({
        // 제공할 정보 - User.js
        // 가능한 이유는 auth.js 에서 req.user = userInfo; 정보를 가져왔기 때문에
        _id : req.user._id, 
        isAdmin : req.user.role === 0 ? false : true,
        isAuth : true,
        email : req.user.email,
        name : req.user.name,
        lastname : req.user.lastname,
        role : req.user.role,
        image : req.user.image
    })
})


// 로그아웃 기능
// auth 를 사용하는 이유는 로그아웃 이라는 건 로그인 된 상태이기 때문에
app.get('/api/user/logout', auth, (req, res)=>{
    // 유저를 찾아서 업데이트 시켜주는 역할
    User.findOneAndUpdate({_id : req.user._id}, {token : ""}, (err, user)=>{
        if(err) return res.json({success : false, err});  
        return res.status(200).send({
                success : true
            })
        })
    })



app.listen(port, () => console.log(`Example app listening on port ${port}!`)) // 위의 포트(5000) 에서 실행
