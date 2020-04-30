// .env.js 文件
// 不同环境访问不同的路径
import store from '@/common/store/index'
const ENV_API_URL = {
	development: 'https://dev.7wpp.com/addons/shopro/', //开发环境
	production: 'https://dev.7wpp.com/addons/shopro/', //生产环境
}
const ENV_BASE_URL = {
	development: 'https://dev.7wpp.com', //开发环境
	production: 'https://dev.7wpp.com', //生产环境
}

export const BASE_URL = ENV_BASE_URL[process.env.NODE_ENV || 'development'];   //后台根域名
export const API_URL = ENV_API_URL[process.env.NODE_ENV || 'development'];	   //后台接口域名
// export const H5_URL = store.state.init.initData.info.domain;				   //前端H5域名，用于跨端分享链接、支付后跳转和APP的分享链接和商品海报二维码的链接
