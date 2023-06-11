const mysql=require('mysql')

// 创建数据库对象
const db=mysql.createPool({
    host:'127.0.0.1',
    user:'root',
    password:'admin123',
    database:'test'
})

// 向外共享db数据库连接对象
module.exports=db