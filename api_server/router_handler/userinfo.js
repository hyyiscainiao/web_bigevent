//获取数据库
const db=require('../db/index')
const bcrypt=require('bcryptjs')
//定义sql语句
const sql='select id,username,nickname,email,user_pic from ev_users where id=?'

//获取用户信息
exports.getUserInfo=(req,res)=>{
    //注意：req对象上的user属性，是token解析成功，express-jwt中间件帮我们挂载上去的
    db.query(sql,req.user.id,(err,results)=>{
        if(err) return res.cc(err)
        //执行SQL语句成功，但是查询到的数据条数不等于1
        if(results.length!==1) return res.cc('获取用户信息失败！')
        //将用户信息响应到客户端
        res.send({
            status:0,
            message:'获取用户信息基本成功！',
            data:results[0],
        })
    })
}

const sqlStr='update ev_users set ? where id=?'
//更新用户信息
exports.updateUserInfo=(req,res)=>{
    db.query(sqlStr,[req.body,req.body.id],(err,results)=>{
        if(err) return res.cc(err)
        if(results.affectedRows !== 1) return res.cc("修改用户信息失败")
        return res.cc('修改用户信息基本成功！',0)
    })
}

const sql1='select * from ev_users where id=?'
//重置密码
exports.updatePassword=(req,res)=>{
    db.query(sql1,req.user.id,(err,results)=>{
        if(err) return res.cc(err)
        if(results.length!==1) return res.cc('用户不存在！')
        //判断提交的旧密码是否正确
        const compareResult=bcrypt.compareSync(req.body.oldPwd,results[0].password)
        if(!compareResult) return res.cc('原密码错误')
        
        //更新密码的sql语句
        const sql2='update ev_users set password=? where id=?'
        const newPwd = bcrypt.hashSync(req.body.newPwd, 10)

        db.query(sql2,[newPwd,req.user.id],(err,results)=>{
            if (err) return res.cc(err)

            // SQL 语句执行成功，但是影响行数不等于 1
            if (results.affectedRows !== 1) return res.cc('更新密码失败！')

            // 更新密码成功
            res.cc('更新密码成功！', 0)
        })
    })
    
}

//更新头像
const sql3='update ev_users set user_pic=? where id=?'
exports.updateAvatar=(req,res)=>{
    db.query(sql3,[req.body.avatar,req.user.id],(err,results)=>{
        if(err) return res.cc(err)
        if(results.affectedRows!==1) return res.cc('更新用户头像失败！')
        return res.cc('更新头像成功',0)
    })
}

