// 백엔드 서버 시작점

const express = require('express') // express 모듈을 가져온다.
const app = express() 
const port = 3000 
const bodyParser = require('body-parser')

const config = require('./config/key')

// application/x-www-form-urlencoded 와 같은 형식의 데이터를 분석 할 수 있게 해준다.
app.use(bodyParser.urlencoded({extended : true}));

// application/json 형식의 데이터를 분석하여 가져온다.
app.use(bodyParser.json());


const mongoose = require('mongoose')
mongoose.connect(config.mongoURI ,{
    useNewUrlParser : true, useUnifiedTopology : true
}).then(()=> console.log('MongoDB Connected...')).catch(err => console.log('error'))

const { User } = require('./models/User');


app.get('/', (req, res) => res.send('Hello World! 123')) // 루트 디렉토리에 hello world! 출력

// 회원가입을 위한 route
app.post('/register', (req, res) => {
    // 회원 가입 할 때 필요한 정보들을 client 에서 가져오면
    // 그것들을 데이터베이스에 넣어준다. -> User.js 모델을 가져온다.

    const user = new User(req.body) // json 형식으로 정보가 들어온다.

    // MongoDB 메서드 -> 정보들이 user 모델에 저장이 된다.
    user.save((err, userInfo)=>{
        if(err){
            return res.json({success : false, err})
        } else {
            return res.status(200).json({success : true})
        }
    }) 
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`)) // 위의 포트(5000) 에서 실행
