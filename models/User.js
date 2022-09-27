const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const saltRounds = 10; // salt 를 이용해서 비밀번호를 암호화 해야 함 -> salt 를 만들 때 10자리를 만들어서 암호화 한다.

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

userSchema.pre('save', function(next){
    var user = this; // user 가 위의 객체들을 가리킨다.

    // 모델안의 필드 중 password 가 변화 될 때만 아래 코드가 실행된다.
    if(user.isModified('password')){
        // 비밀번호를 암호화 시킨다.
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if(err) {
                return next(err);
            } else {
                // myPlaintextPassword : 암호화 된 비밀번호가 아니라 postman 에 내가 직접 입력한 비밀번호
                // const user = new User(req.body) 형식으로 req.body 를 모델에 넣었기 때문에  userSchema 의 password 를 가져오면 된다.
                bcrypt.hash(user.password, salt, function(err, hash) {
                    // Store hash in your password DB.
                    // hash : 암호화 된 비밀번호
                    if(err) {
                        return next(err);
                    } else {
                        user.password = hash
                        next() // 완성
                    }
                });
            } 
        });
    } else {
        next();
    }    
})

userSchema.methods.comparePassword = function(plainPassword, cd){
    // planPassword : 1234 등, 데이터베이스에 있는 암호화 된 비밀번호 "$2b$10$rwffndFzLFvUpxh6P1ql7u4bWg/4OXbdJwKYFUBSZe4sJeoIgXC5C"
    // 1234 도 암호화화해서 디비와 같은지 확인(오른쪽 문자)
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if(err){
            return cd(err);
        } else {
            return cd(null, isMatch); // 에러는 없고, 비밀번호는 같다 
        }
    })
}

userSchema.methods.getToken = function(cb){
    // jsonwebtoken 을 이용해서 토큰 생성
    let user = this;
    
    let token = jwt.sign(user._id.toHexString(), 'secretToken')
    user.token = token
    user.save(function(err, user){
        if(err){
            return cb(err);
        } else {
            cb(null, user) // 에러는 없고 유저정보 전달 -> index.js
        }
    })
}

const User = mongoose.model('User', userSchema)

module.exports = {User}