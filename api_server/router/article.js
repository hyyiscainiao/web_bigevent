const express=require('express')
const router=express.Router()
// 导入解析 formdata 格式表单数据的包
const multer=require('multer')
// 导入处理路径的核心模块
const path=require('path')

// 创建 multer 的实例对象，通过 dest 属性指定文件的存放路径
const upload = multer({ dest: path.join(__dirname, '../uploads') })
const expressJoi = require('@escook/express-joi')


// 导入文章的验证模块
const { add_article_schema } = require('../schema/article')
const article_handler=require('../router_handler/article')
router.post('/add', upload.single('cover_img'), expressJoi(add_article_schema), article_handler.addArticle)

//获取文章列表
// const { get_artice_schema } = require('../schema/article')
router.get('/list', upload.single('cover_img'), article_handler.getArticles)
module.exports=router