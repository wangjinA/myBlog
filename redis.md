栈（Stack）：存储基本数据类型变量。数字布尔...
堆（heap）：存储引用数据类型。对象，函数...

从session到redis
    1.session的问题
        ·目前session是直接js变量，放在nodejs进程内存中
        ·进程内存有限，访问量过大，内存暴增怎么办？
        ·正式线上运行是多进程，进程之间内存无法共享。（负载均衡，系统会分配到空闲进程，进程之间内存无法共享，所以无法获取上次session数据，需要用redis做中间存储）
    
    2.解决方案redis
        ·webServer最常用的缓存数据库，数据存储在内存中
        ·相比于mysql，访问速度快
        ·成本更高，可存储的数据量更小（内存的硬伤）
        ·webServer(nodejs)、mysql、reids都是单独的服务，相互引用关系
        
    3.session适合redis的原因
        ·session访问频繁，对性能要求极高
        ·session可不考虑断电丢失数据的问题（大不了重新登陆）
        ·session数据量访问不会太大（相对于mysql中存储的数据）
        
    4.网站数据不适合redis的原因
        ·操作频率不是太高（相比于session操作）
        ·断电不能丢失，必须保留
        ·数据量太大，内存成本太高