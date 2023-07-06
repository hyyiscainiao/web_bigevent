$(function(){
    //调用gtUserInfo获取用户基本信息
    getUserInfo()
    var layer=layui.layer

    // 点击按钮，实现退出
    $('#btn_out').on('click',function(){
        // 提示用户是否确认退出
        layer.confirm('是否确认退出?', {icon: 3, title:'提示'}, function(index){
            // 1、清空本地存储
            localStorage.removeItem('token')
            // 2、跳转页面
            location.href = 'login.html'
            
            layer.close(index);
          });
    })
})

// 获取用户的基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        success: function (res) {

            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！')
            }
            // 调用 renderAvatar 渲染用户的头像
            renderAvatar(res.data)
        },
        
        
    })
}

// 渲染用户头像
function renderAvatar(user){
    // 1、获取用户名
    var name=user.nickname||user.username
    // 2、设置欢迎的文本
    $('#welcome').html('欢迎&nbsp;&nbsp;'+name)
    // 3、按需渲染用户的头像
    if(user.user_pic!==null){
        // 渲染图片头像
        
        
        $('.layui-nav-img').attr('src',user.user_pic).show()
        $('.text-avatar').hide()
    }
    else{
        // 渲染文本头像
        
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
        $('.layui-nav-img').hide()
        
    }
}