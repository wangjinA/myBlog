const { login } = require('../controller/user')
const {SuccessModel, ErrorModel} = require('../model/resModel')

const handleUserRouter = (req, res) => {
    const method = req.method

    // 登陆
    if (method === 'POST' && req.path === '/api/user/login') {
        const { username, password } = req.body
        // const { username, password } = req.query
        const result = login(username, password)
        return result.then(data => {
            if(data.username){
                req.session.username = data.username
                return new SuccessModel('登陆成功')
            }
            return new ErrorModel('登陆失败')
        })
    }

    // if (method === 'GET' && req.path === '/api/user/login-test') {
    //     if (req.session.username){
    //         return Promise.resolve(new SuccessModel({
    //             session: req.session
    //         }))
    //     }
    //     return Promise.resolve(new ErrorModel('尚未登陆'))
    // }
}

module.exports = handleUserRouter