import {proxyLaunchHook,callwaitHooks} from './hooks'

/**
 * 触发还原 app.vue下的生命钩子
 * @param {Object} Router 	当前Router对象
 * 
 * this 为当前 page 对象
 */
export const callAppvueHooks=async function(Router){
	await callwaitHooks();
}
/**
 * 开始初始化app端路由配置
 * 
 * @param {Object} Router 	当前Router对象
 * 
 * this 为当前 page 对象
 */
export const appletsInit=function(Router){
	proxyLaunchHook.call(this)
}