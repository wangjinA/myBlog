const {SuccessModel, ErrorModel} = require('../model/resModel')
const { getBlogList, getBlogDetail ,newBlog, updateBlog, delBlog } = require('../controller/blog')

// 统一的登陆验证函数
const loginCheck = function (req) {
    if (!req.session.username){
        return Promise.resolve(new ErrorModel('尚未登陆'))
    }
    
}

const handleBlogRouter = (req, res) => {
    const method = req.method // GET POST

    // 获取博客列表
    if (method === 'GET' && req.path === '/api/blog/list') {
        let author = req.query.author || ''
        const keyword = req.query.keyword || ''
        if (req.query.isAdmin) {
            const loginCheckResult = loginCheck(req)
            if (loginCheckResult) {
                // 未登录
                return loginCheckResult
            }
            author = req.session.username
        }
        // 传入作者和title
        return getBlogList(author,keyword).then(listData=>{
            return new SuccessModel(listData)
        })
    }

    // 获取博客详情
    if (method === 'GET' && req.path === '/api/blog/detail') {
        console.log(req.query.id)
        if (!req.query.id)
            return new Promise((resolve)=>resolve(new ErrorModel('请传入博客ID')))
        else
            return getBlogDetail(req.query.id).then(res=>{
                if (res)
                    return new SuccessModel(res)
                else
                    return new ErrorModel('未找到该ID对应的博客')
            })
    }
    // 新建博客
    if (method === 'POST' && req.path === '/api/blog/newBlog') {
        const loginCheckResult = loginCheck(req)
        if (loginCheckResult) {
            // 未登录
            return loginCheckResult
        }
        req.body.author = req.session.username
        return newBlog(req.body).then(newData=>{
            return new SuccessModel(newData)
        })
    }
    // 更新博客
    if (method === 'POST' && req.path === '/api/blog/updateBlog') {
        const loginCheckResult = loginCheck(req)
        if (loginCheckResult) {
            // 未登录
            return loginCheckResult
        }
        return updateBlog(req.body).then(boo=>{
             if(boo){
                 return new SuccessModel('更新博客成功')
             }else {
                return new ErrorModel('更新博客失败')
             }
        })
    }
    // 删除博客
    if (method === 'POST' && req.path === '/api/blog/delBlog') {
        const loginCheckResult = loginCheck(req)
        if (loginCheckResult) {
            // 未登录
            return loginCheck
        }
        req.body.author = req.session.username
        return delBlog(req.body).then(boo=>{
             if(boo){
                 return new SuccessModel('删除博客成功')
             }else {
                return new ErrorModel('删除博客失败')
             }
        })
    }
}
module.exports = handleBlogRouter