const redis = require('redis')
const { REDIS_CONF } = require('../conf/db')

// 创建客户端
const redisClient = redis.createClient(REDIS_CONF.port, REDIS_CONF.host)
redisClient.on('error', err => {
    console.error(err)
})

function set (key, val) {
    if (typeof val === 'object') {
        val = JSON.stringify(val)
    }
    redisClient.set(key, value)
}

function get (key) {
    return new Promise((resolve, reject) => {
        redisClient.get(key, (err, val) => {
            if(err){
                reject(err)
                return
            }
            if (val == null) {
                resolve(null)
                return
            }
            
            try {
                resolve(JSON.parse(val)) // 转换为对象
            } catch (ex) { // 失败则原路返回
                resolve(val)
            }

            // 退出
            // redisClient.quit()
        })
    })
}

module.exports = {
    set,
    get,
}