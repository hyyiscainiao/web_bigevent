// 导入数据库操作模块
const db=require('../db/index')
// 导入bcryptjs这个包
const bcryptjs=require('bcryptjs')
//导入jsonwebtoken字符串的包
const jwt=require('jsonwebtoken')
//导入配置文件
const config=require('../cofig')

exports.regUser=(req,res)=>{
    // 获取客户端提交到服务端的用户信息
    const userinfo=req.body
    
    // 判断数据是否合法
    // if(!userinfo.username||!userinfo.password){
    //     // return res.send({status:1,message:'用户名或密码不能为空'})
    //     return res.cc('用户名或密码不能为空')
    // }

    const sqlStr='select * from ev_users where username=?'
    db.query(sqlStr,userinfo.username,(err,result)=>{
        // 执行 SQL 语句失败
        if (err) {
            // return res.send({ status: 1, message: err.message })
            return res.cc(err)
        }
        // 用户名被占用
        if (result.length > 0) {
            // return res.send({ status: 1, message: '用户名被占用，请更换其他用户名！' })
            return res.cc('用户名被占用，请更换其他用户名！')
        }
        // console.log(userinfo)
        // 对用户密码进行bcryptjs加密，返回值是加密之后的密码字符串
        userinfo.password=bcryptjs.hashSync(userinfo.password,10)
        // console.log(userinfo)
        // res.send('reguser OK')
        // 定义插入新用户的sql语句
        const sql='insert into ev_users set ?'
        db.query(sql,{username:userinfo.username,password:userinfo.password},(err,results)=>{
            // 执行SQL语句失败
            if(err) 
            // return res.send({status:1,message:err.message})
            return res.cc(err)
            // SQL语句执行成功，但影响函数不为1
            if(results.affectedRows !== 1){
                // return res.send({status:1,message:'注册用户失败，请稍后再试！'})
                return res.cc('注册用户失败，请稍后再试！')
            }
            // 注册成功
            // res.send({status:0,message:'注册成功！'})
            res.cc('注册成功！',0)
        })
    })
   
}

exports.login=(req,res)=>{
    // 接受表单数据
    const userinfo=req.body
    // 定义sql语句
    const sql='select * from ev_users where username=?'
    // 查询用户数据
    db.query(sql,userinfo.username,(err,results)=>{
        if(err) return res.cc(err)
        if(results.length!==1) return res.cc('登录失败!')
        //拿着用户输入的密码,和数据库中存储的密码进行对比
        const compareResult=bcryptjs.compareSync(userinfo.password,results[0].password)
        //如果对比的结果等于false,则证明用户输入的密码错误
        if(!compareResult) return res.cc('登录失败!')
        //登陆成功,生成token字符串
        //通过ES6高级语法,快速剔除密码和头像的值,剔除完毕之后,user只保留了
        const user={...results[0],password:' ',user_pic:' '}
        
        //生成Token字符串
        const tokenStr=jwt.sign(user,config.jwtSecretKey,{
            expiresIn:config.expiresIn,//token有效期为10h
        })
        res.send({
            status:0,
            message:'登陆成功',
            // 为了方便客户端使用TOLKEN，在服务器端直接拼接上Bearer的前缀
            token:'Bearer '+tokenStr,
        })
    })
    
}