/**
 *  Shopro全局配置文件
 *  @version 1.1.2
 */

// 不同环境访问不同的路径
import store from '@/common/store/index'
// #ifdef H5
let protocol = window.location.protocol;
// #endif

const ENV_BASE_URL = {
	development: 'https://api.7wpp.com', //开发环境
	production: 'https://api.7wpp.com', //生产环境
}
const ENV_API_URL = {
	development: `${ENV_BASE_URL.development}/addons/shopro/`, //开发环境
	production: `${ENV_BASE_URL.production}/addons/shopro/`, //生产环境
}

export const BASE_URL = ENV_BASE_URL[process.env.NODE_ENV || 'development']; //后台根域名
export const API_URL = ENV_API_URL[process.env.NODE_ENV || 'development']; //后台接口域名
export const HAS_LIVE = false; //后台是否开通直播权限,根据情况在manifest.json中，开启注释相应组件的引入。
