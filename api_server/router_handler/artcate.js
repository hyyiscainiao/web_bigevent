const db=require('../db/index')

const sql1='select * from ev_article_cate where is_delete=0 order by id asc'
exports.getArticleCates=(req,res)=>{
    db.query(sql1,(err,results)=>{
        if(err) return res.cc(err)
        res.send({
            status:0,
            message:'获取文章分类列表成功！',
            data:results,
        })
    })
}

const sql2='select * from ev_article_cate where name=? or alias=?'
exports.addArticleCates=(req,res)=>{
    db.query(sql2,[req.body.name,req.body.alias],(err,results)=>{
        if(err) return res.cc(err)
        //判断分类名称和分类别名是否被占用
        if(results.length===2) return res.cc('分类名称与别名被占用，请更换后重试')
        //分别判断分类名称和分类别名是否被占用
        if(results.length===1&&results[0].name===req.body.name) return res.cc('分类名称被占用，请更换后重试')
        if(results.length===1&&results[0].alias===req.body.alias) return res.cc('分类别名被占用，请更换后重试')
        const sql3='insert into ev_article_cate set?'
        db.query(sql3,req.body,(err,results)=>{
            if(err) return res.cc(err)
            if(results.affectedRows!==1) return res.cc('新增文章分类失败')
            res.cc('新增文章分类成功',0)
        })
    })
}

const sql3='update ev_article_cate set is_delete=1 where id=?'
exports.deleteCateById=(req,res)=>{
    db.query(sql3,req.params.id,(err,results)=>{
        if(err) return res.cc(err)
        if(results.affectedRows!==1) return res.cc('删除文章分类失败！')
        res.cc('删除文章分类成功！',0)
    })
    // res.send('ok')
}
const sql4='select * from ev_article_cate where id=?'
exports.getArticleById=(req,res)=>{
    db.query(sql4, req.params.id, (err, results) =>{
        if(err) return res.cc(err)
        if(results.length!==1) return res.cc('获取文章分类数据失败！')
        res.send({
            status: 0,
            message: '获取文章分类数据成功！',
            data: results[0],
          })
    })
}

const sql = `select * from ev_article_cate where id<>? and (name=? or alias=?)`
exports.updateCateById = (req, res) => {
    db.query(sql, [req.body.Id, req.body.name, req.body.alias], (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err)
      
        // 判断 分类名称 和 分类别名 是否被占用
        if (results.length === 2) return res.cc('分类名称与别名被占用，请更换后重试！')
        if (results.length === 1 && results[0].name === req.body.name) return res.cc('分类名称被占用，请更换后重试！')
        if (results.length === 1 && results[0].alias === req.body.alias) return res.cc('分类别名被占用，请更换后重试！')
      
        // TODO：更新文章分类
        const sql = `update ev_article_cate set ? where Id=?`
        db.query(sql, [req.body, req.body.Id], (err, results) => {
            // 执行 SQL 语句失败
            if (err) return res.cc(err)
          
            // SQL 语句执行成功，但是影响行数不等于 1
            if (results.affectedRows !== 1) return res.cc('更新文章分类失败！')
          
            // 更新文章分类成功
            res.cc('更新文章分类成功！', 0)
          })
      })
  }