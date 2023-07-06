// 导入express
const express=require('express')

// 创建服务器的实例对象
const app=express()
const joi=require('joi')



// 导入并配置cors中间件
const cors=require('cors')
app.use(cors())

//配置解析表单数据的中间件,注意：这个中间件，只能解析application/x-www-form-urlencoded格式的表单数据
app.use(express.urlencoded({ extended: false }));
// 托管静态资源文件
app.use('/uploads', express.static('./uploads'))
//响应数据的中间件
app.use((req,res,next)=>{
    // status=0为成功,stutus=1为失败，默认将status的值设置为1，方便处理失败的情况
    res.cc=(err,status=1)=>{
        res.send({
            // 状态
            status,
            // 状态描述,判断err是错误对象还是字符串
            message:err instanceof Error?err.message:err,
        })
    }
    next()
})

//导入配置文件
const config=require('./cofig')

//解析token的中间件
const expressJWT=require('express-jwt')

//使用.unless({path:[/^\/api\//]})指定哪些接口不需要中间件
app.use(expressJWT({secret:config.jwtSecretKey}).unless({path:[/^\/api\//]}))

// 导入并使用注册用户模块路由
const userRouter=require('./router/user')
app.use('/api',userRouter)

//导入并使用个人中心模块路由
const userinfoRouter=require('./router/userinfo')
app.use('/my',userinfoRouter)

//导入并使用文章分享路由模块
const artCateRouter=require('./router/artcate')
//为文章分类的路由挂载统一的访问前缀/my/article
app.use('/my/article',artCateRouter)
//导入文章路由模块
const articleRouter = require('./router/article')

//为文章的路由挂载统一的访问前缀/my/article
app.use('/my/article',articleRouter)

//错误中间件
app.use((err,req,res,next)=>{
    //数据验证失败
    if(err instanceof joi.ValidationError) return res.cc(err)
    //捕捉身份认证失败的错误
    if(err.name==='UnauthorizedError') return res.cc('身份认证失败！')
    //未知错误
    res.cc(err)
})

// 启动服务器
app.listen(3007,()=>{
    console.log('api server running at http://127.0.0.1:3007')
})




