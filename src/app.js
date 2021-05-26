import './assets/styles/main.scss';

export default function () {
    this.FesApp.set('FesName', '$i18n.title');


    // 设置退出逻辑
    this.on('fes_logout', () => {
        this.FesApp.setRole('unLogin');
        this.FesStorage.set('userLogin', false);
        this.FesFesx.clear();
    });

    // 设置logo点击事件
    this.on('fes_logo_click', () => {
        window.Toast('你点击了LOGO');
    });

    // 设置路由钩子
    this.FesApp.setBeforeRouter((from, to, next) => {
        next();
    });

    // this.FesApp.setAfterRouter((route) => {
    //     console.log(`您浏览到了${route.path}`);
    // });

    // 设置当前角色
    if (!this.FesStorage.get('userLogin') === true) {
        this.setRole('unLogin');
    }

    // 设置AJAX配置
    this.FesApi.option({
    });

    this.FesApi.setError({
        // 身份验证失败时。重新登录
        401: function(response){
            this.FesApp.setRole('unLogin');
            this.FesStorage.set('userLogin', false);
            this.FesFesx.clear();
        },
    })

    // 设置响应结构
    this.FesApi.setResponse({
        successCode: '0',
        codePath: 'code',
        messagePath: 'msg',
        resultPath: 'result'
    });

    // 设置请求拦截器
    // 自动添加token
    const that = this
    const ReqEject = this.FesApi.setReqInterceptor(function (config) {
        // 判断是否有token
        if (that.FesFesx.get('token')) {
            config.headers.Authorization = that.FesFesx.get('token')
        }
        return config
   })

   // 响应拦截器.刷新token
   const ResEject = this.FesApi.setResInterceptor((response) => {
       if(response.headers.hasOwnProperty('authorization')) {
           console.log("refresh token")
        this.FesFesx.set('token', response.headers.authorization)
       }
       return response
    }, (error) => {
       switch(error.response.status){
           // 对得到的状态码的处理，具体的设置视自己的情况而定
           case 401:
               console.log('401 身份认证失败')
               this.FesApp.setRole('unLogin');
               this.FesStorage.set('userLogin', false);
               this.FesFesx.clear();
               break
           default:
               console.log('其他错误')
               break
       }
    })



}
