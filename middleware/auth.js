const { User } = require("../models/User");

// 미들웨어에서 처리하는 곳
let auth = (req, res, next) => {
    // 인증 처리를 하는 곳
    // 1. 클라이언트 쿠키에서 토큰을 가져오는 코드
    let token = req.cookie.x_auth 

    // 2. 가져온 토큰을 복호화 한 후 유저를 찾는 코드,
    User.findByToken(token, (err, userInfo) => {
        if(err) {
            throw err;
        } else {
            return res.json({isAuth : false, error : true})
        }

        req.token = token;
        req.user = userInfo;
        next();
    })
}

module.exports = {auth};