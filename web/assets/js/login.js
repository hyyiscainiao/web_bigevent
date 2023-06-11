$(function(){
    // 点击去注册的链接
    $('#link_reg').on('click',function(){
        $('.login_box').hide();
        $('.reg_box').show();
    })
    // 点击去登录的链接
    $('#link_login').on('click',function(){
        $('.reg_box').hide();
        $('.login_box').show();
    })

    // 从layui中获取form 对象
    var form =layui.form
    var layer=layui.layer

    form.verify({
        // 自定义了pwd校验规则
    pass: [
        /^[\S]{6,12}$/
        ,'密码必须6到12位，且不能出现空格'
      ],
    //   校验两次验证码是否一致
    repass:function(value){
        // 通过形参获取第二次密码的值
        // 再获取第一次密码的值
        //val() 方法返回或设置被选元素的值
        var pwd=$('.reg_box [name=password]').val()
        // 判断两次密码是否一致 错误则返回return
        if(pwd !==value){
            return '两次密码不一致！'
        }  
    }
    })
    var data={username:$('#form-reg [name=username]').val(),
                password:$('#form-reg [name=password]').val()}
    // 监听注册表单的事件
    $('#form-reg').on('submit',function(e){
        //1、阻止默认的提交行为
        e.preventDefault()
        //2、发起的ajax请求
        $.post('/api/reguser' ,data ,function(res){
            if(res.status!==0){
                // return console.log(res.message)
               return layer.msg(res.message)
            }
            // console.log('注册成功！')
            layer.msg('注册成功，请登录！')
            $('#link_login').click()

        })
    })


    //监听登录表单的事件 
    $('#form_login').on('submit',function(e){
        e.preventDefault()
        $.post('/api/login',$(this).serialize(),function(res){
            if(res.status!==0){return layer.msg('登录失败')}
            layer.msg("登录成功！")
            //将登录成功得到的token字符串，保存到localStorage
            // localStorage.setItem('token',res.token)
            localStorage.setItem('token', res.token)
            // console.log(res.token)
            //跳转到后台主页
            location.href='/web/index.html'
        })
    })
})
