const { exec } = require('../db/mysql')

// 获取博客列表
const getBlogList = (author, keyword) => {
    let sql = `select * from blogs where 1=1 `
    if (author) {
        sql += `and author = '${author}' `
    }
    if (keyword) {
        sql += `and title like '%${keyword}%' `
    }
    sql += `order by createtime desc;`
    return exec(sql)
}

// 获取博客详情
const getBlogDetail = (id) => {
    let sql = `select * from blogs where id=${id}`
    return exec(sql).then(rows=>{
        return rows[0]  // 返回对象，因为查询结果是数组形式
    })
}

// 新建博客
const newBlog = (blogData => {
    // blogData 是一个博客对象，包含 title content author
    console.log(blogData)
    const title = blogData.title
    const content = blogData.content
    const author = blogData.author
    const createtime = Date.now()

    // 注意加引号
    const sql = `
        insert into blogs (title, content, author, createtime) 
        values ('${title}', '${content}', '${author}', ${createtime})
    `
    // 返回新建博客的id
    return exec(sql).then(newData=>{
        return {
            id: newData.insertId
        }
    })
})

// 更新博客
const updateBlog = (blogData => {
    // blogData 是一个博客对象，包含 title content author
    const title = blogData.title
    const content = blogData.content
    const id = blogData.id

    // 注意加引号
    const sql = `
        update blogs 
        set
            title = '${title}',
            content = '${content}'
        where
            id = ${id}
    `
    // 根据影响的行数返回boolean
    return exec(sql).then(updateData=>{
        if(updateData.affectedRows > 0){
            return true
        }else {
            return false
        }
    })
})

// 删除博客
const delBlog = (blogData => {
    const id = blogData.id
    const author = blogData.author

    // 注意加引号
    const sql = `
        delete from blogs
        where
            id = ${id}
        and
            author = '${author}'
    `
    // 根据影响的行数返回boolean
    return exec(sql).then(updateData=>{
        if(updateData.affectedRows > 0){
            return true
        }else {
            return false
        }
    })
})
module.exports = {
    getBlogList,
    getBlogDetail,
    newBlog,
    updateBlog,
    delBlog,
}