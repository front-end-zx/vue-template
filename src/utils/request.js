import axios from 'axios';
import router from '../router/index';

const config = {
    timeout: 60 * 1000, // 60s后超时
    withCredentials: true , // 是否携带凭证
    baseURL: process.env.BASE_API
}

const request = axios.create(config);

/**
 * 跳转至登陆页面
 */
function toLogin(){
    sessionStorage.clear();
    location.reload();
    router.push({
        path: '/login'
    })
}

/**
 * 请求失败后的统一处理
 * @param { Number } status 
 */
function errorHandle(status, other){
    switch (status){
        // 未登录状态，清除数据，跳转至登录页
        case 401:
            toLogin();
            break;
        // token 过期
        case 403:
            console.log("登录过期");
            toLogin();
            break;
        case 404:
            console.log("请求的资源不存在");
            break;
        case 500:
            console.log("服务器请求错误");
            break;
        default:
            console.log(status, other);
            break;
    }
}

// 请求拦截器
request.interceptors.request.use(
    config => {
        // 登录判断是否有 token, token 是否过期
        const token = sessionStorage.getItem(process.env.TOKEN_NAME);
        if(token){
            config.headers.Authorization = `bearer ${token}`
        }
        return config;
    },
    error => Promise.reject(error)
);

// 响应拦截器
request.interceptors.response.use(
    // 请求成功
    response => {
        return response.status == 200 ? Promise.resolve(response) : Promise.reject(response)
    },
    error => {
        const { response } = error;
        if(response){
            // 请求已发出，但不在 2xx 的范围
            errorHandle(response.status, response.data.message);
            return Promise.reject(response)
        }else{
            return Promise.reject(error)
        }
    }
);

export default request;
