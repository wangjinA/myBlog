let handleBlogRouter = require("./src/router/blog");
let handleUserRouter = require("./src/router/user");
const querystring = require("querystring"); // node原生模块处理url参数

/**
 * @param {Number} day 过期天数  默认7天
 */
const getCookieExpires = (day = 7) => {
  // 设置cookie过期时间
  const d = new Date();
  d.setTime(d.getTime() + 24 * 60 * 60 * 1000 * day); // +1天
  return d.toGMTString(); // cookie规定的时间格式 "Sun, 02 Jun 2019 14:24:44 GMT"
};

// session 数据
const SESSION_DATA = {};

const getPostData = req => {
  // 处理post参数
  return new Promise((resolve, reject) => {
    if (req.method !== "POST") {
      resolve({});
      return;
    }
    if (req.headers["content-type"] !== "application/json") {
      // 如果请求头不是json数据格式 返回{}
      resolve({});
      return;
    }
    let postData = "";
    req.on("data", chunk => {
      // 接收的数据chunk是二进制 通过 toString() 转换成字符串
      postData += chunk.toString();
      console.log(postData);
    });
    req.on("end", () => {
      if (!postData) {
        resolve({});
        return;
      }
      resolve(
        JSON.parse(postData) // 最后返回post对象数据
      );
    });
  });
};
const getOtherData = req => {
  // 解析 query
  req.query = querystring.parse(req.url.split("?")[1]); // url参数

  // 获取 path
  req.path = req.url.split("?")[0]; // 路径

  // 解析 cookie
  req.cookie = {};
  const cookieStr = req.headers.cookie || "";
  cookieStr.split(";").forEach(item => {
    if (!item) {
      return;
    }
    const arr = item.split("=");
    const key = arr[0].trim();
    const value = arr[1].trim();
    req.cookie[key] = value;
  });
  console.log("req cookies = ", req.cookie);
};
const serverHandle = (req, res) => {
  res.setHeader("Content-type", "application/json");
  getOtherData(req);
  // 解析 session
  let needSetCookie = false; // 是否需要设置cookie
  let userId = req.cookie.userid;
  if (userId) {
    if (!SESSION_DATA[userId]) {
      // 有userId的时候，但在SESSION_DATA中没有数据的时候
      SESSION_DATA[userId] = {};
    }
  } else {
    // 没有userId则创建userId，并且设置cookie
    needSetCookie = true;
    userId = `${Date.now()}_${Math.random()}`;
    SESSION_DATA[userId] = {};
  }
  req.session = SESSION_DATA[userId]; // req.session 是对 SESSION_DATA[userId]的地址引用
  console.log(SESSION_DATA);
  getPostData(req).then(postData => {
    // 在拿到postData数据回调之后返还处理结果
    req.body = postData;

    let result = handleBlogRouter(req, res); // 博客路由判断，返回Promise对象
    if (result) {
      result.then(blogData => {
        if (needSetCookie) {
          // 设置 cookie
          // path设置 / 所有页面都有效 否则是当前页面有效
          // httpOnly 只允许后端修改username
          res.setHeader(
            "Set-Cookie",
            `userid=${userId};path=/; httpOnly; expires=${getCookieExpires()}`
          );
        }
        res.end(JSON.stringify(blogData));
      });
      return;
    }

    result = handleUserRouter(req, res); // 用户路由判断，返回Promise对象
    if (result) {
      result
        .then(userData => {
          console.log(needSetCookie);
          if (needSetCookie) {
            // 设置 cookie
            // path设置 / 所有页面都有效 否则是当前页面有效
            // httpOnly 只允许后端修改username
            res.setHeader(
              "Set-Cookie",
              `userid=${userId};path=/; httpOnly; expires=${getCookieExpires()}`
            );
          }
          res.end(JSON.stringify(userData));
        })
        .catch(error => {
          res.end(JSON.stringify(error));
        });
      return;
    }

    // 设置404
    res.write("404");
    res.end();
  });
};
module.exports = serverHandle;
