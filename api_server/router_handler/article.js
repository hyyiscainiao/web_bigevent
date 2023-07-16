const { count } = require('console')
const db = require('../db/index')
const path = require('path')
exports.addArticle=(req,res)=>{
     // 手动判断是否上传了文章封面
  if (!req.file || req.file.fieldname !== 'cover_img') return res.cc('文章封面是必选参数！')
    // 导入处理路径的 path 核心模块


const articleInfo = {
  // 标题、内容、状态、所属的分类Id
  ...req.body,
  // 文章封面在服务器端的存放路径
  cover_img: path.join('/uploads', req.file.filename),
  // 文章发布时间
  pub_date: new Date(),
  // 文章作者的Id
  author_id: req.user.id,
}
const sql = `insert into ev_articles set ?`
db.query(sql, articleInfo, (err, results) => {
    // 执行 SQL 语句失败
    if (err) return res.cc(err)
  
    // 执行 SQL 语句成功，但是影响行数不等于 1
    if (results.affectedRows !== 1) return res.cc('发布文章失败！')
  
    // 发布文章成功
    res.cc('发布文章成功', 0)
  })
}
// const sql2 = 'SELECT count(*) FROM test.ev_articles where is_delete = 0;'
const sql1='select * from ev_articles a join  ev_article_cate b on a.cate_id=b.id where a.is_delete=0 order by a.id asc'
exports.getArticles=(req,res)=>{
    db.query(sql1,(err,results)=>{
        if(err) return res.cc(err)
        res.send({
          status:0,
          message:'获取文章分类列表成功！',
          data:results,
      })
    })
  
    
}