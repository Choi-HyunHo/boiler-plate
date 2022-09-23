const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name : {
        type : String,
        maxlenght : 50
    },
    email : {
        type : String,
        trim : true, // hyun ho@naver.com 이라고 하면, 이름 중간에 공백이 있는데 이것을 없애주는 역할을 한다.
        unique : 1,  // 같은 이메일은 사용 할 수 없게 
    },
    password : {
        type : String,
        minlenght : 5
    },
    lastname : {
        type : String,
        maxlenght : 50
    },
    role : {
        // 어떤 유저가 관리자가 될 수도, 일반 유저가 될 수도 해당 등급에 대한 조건
        type : Number,
        default : 0
    },
    image: String,
    token : {
        // 유효성 
        type : String
    },
    tokenExp : {
        // 토큰의 유효기간
        type : Number
    }
})

const User = mongoose.model('User', userSchema)

module.exports = {User}