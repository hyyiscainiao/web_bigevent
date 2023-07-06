//注意每次调用$.get()或$.post()或$.ajax()的时候
// 会优先调用ajaxPrefilter这个函数
// 在这个函数中，可以拿到我们给ajax提供的配置对象
$.ajaxPrefilter(function(options){
    
    options.url='http://127.0.0.1:3007'+options.url
    // console.log(options.url)

    if(options.url.indexOf('/my/')!==-1){
        options.headers={
            Authorization:localStorage.getItem('token')||''
        }
    }
    // 不论成功与否,都会调用complete函数
    options.complete=function(res){
        // 在complete回调函数中，可以使用res.responseJSON拿到服务器响应回来的数据
        if(res.responseJSON.status===1&res.responseJSON.message==='身份认证失败！'){
            localStorage.removeItem('token')
            location.href='login.html'
        }
    }
})