// 백엔드 서버 시작점

const express = require('express') // express 모듈을 가져온다.
const app = express() 
const port = 3000 

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://choihyunho:gusgh0816@boilerplate.feh9f3z.mongodb.net/?retryWrites=true&w=majority',{
    useNewUrlParser : true, useUnifiedTopology : true
}).then(()=> console.log('MongoDB Connected...')).catch(err => console.log('error'))


app.get('/', (req, res) => res.send('Hello World!')) // 루트 디렉토리에 hello world! 출력

app.listen(port, () => console.log(`Example app listening on port ${port}!`)) // 위의 포트(5000) 에서 실행
