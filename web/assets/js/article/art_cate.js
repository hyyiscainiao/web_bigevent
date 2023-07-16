$(function () {
    var layer = layui.layer
    var form = layui.form
    initArtCateList()

    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                var htmlStr = template('tpl-table', res)
                // console.log(res)
                $('tbody').html(htmlStr)
            }
        })
    }
    var indexAdd = null
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '400px'],
            title: '添加文章类别'
            , content: $('#dialog-add').html()
        });
    })
    //通过代理的形式，为form-add表单绑定submit事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("新增分类失败！")
                }
                initArtCateList()
                layer.msg('新增分类成功！')
            }
        })
    })

    var indexEdit = null
    $('tbody').on('click', '#btn_edit', function (res) {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '400px'],
            title: '修改文章类别',
            content: $('#dialog-edit').html()
        })

        var id = $(this).attr('data-id')
        $.ajax({
            method: "GET",
            url: '/my/article/cates/' + id,
            success: function (res) {
                // console.log(res.data)
                form.val('form-edit', res.data)
            }
        })



    })
    //提交事务
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res, err) {
                if (res.status !== 0) {
                    // console.log(err.message)
                    return layer.msg('更新分类数据失败')
                }
                layer.msg('更新分类数据成功！')
                layer.close(indexEdit)
                initArtCateList()
            }
        })
    })

    $('tbody').on('click', '#btn_delete', function () {
        var id = $(this).attr('data-id')
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        console.log(res)
                        return layer.msg('删除分类失败')
                    }
                    layer.msg('删除分类成功！')
                    layer.close(index)
                    initArtCateList()
                }
            })
        })
    })
})