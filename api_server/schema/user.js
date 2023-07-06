const joi=require('joi')

/**
 * string() 值必须是字符串
 * alphanum() 值只能是包含 a-zA-Z0-9 的字符串
 * min(length) 最小长度
 * max(length) 最大长度
 * required() 值是必填项，不能为 undefined
 * pattern(正则表达式) 值必须符合正则表达式的规则
 */

// 用户名的验证规则
const username=joi.string().alphanum().min(1).max(10).required()
//密码的验证规则
const password=joi.string().pattern(/^[\S]{6,12}$/).required()
//id、nickname、email的验证规则
const id=joi.number().integer().min(1).required()
const nickname=joi.string().required()
const email=joi.string().email().required()
const avatar=joi.string().dataUri().required()
// 注册和登录表单的验证规则对象
exports.reg_login_schema={
    //表示需要对req.body中的数据进行验证
    body:{
        username,
        password,
    },
}

//更新用户基本信息的验证规则
exports.update_userinfo_schema={
    body:{
        id,
        nickname,
        email,
    },
}

//重置密码的验证规则
exports.update_password_schema={
    body:{
        //使用password这个规则，验证req.body.oldpwd的值
        oldPwd:password,
        //使用joi.not(joi.ref('oldPwd')).concat(password)规则，验证req.body.newPwd的值
        // joi.ref('oldPwd')表示newPwd的值与oldPwd保持一致，
        // joi.not(joi.ref('oldPwd'))表示newPwd与oldPwd不一致
        //.concat() 用于合并 joi.not(joi.ref('oldPwd')) 和 password 这两条验证规则
        newPwd:joi.not(joi.ref('oldPwd')).concat(password),
    }
}

//更换头像的验证规则
exports.update_avatar_schema={
    body:{
        avatar,
    },
}