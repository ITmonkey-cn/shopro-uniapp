import {initAddEvents} from './addEvent'

/**
 * 通过配置信息创建指定tabbar层
 */
const createdTab = function({
	id,
	style,
	beforeMount,
	mounted,
	event,
	registerPageHook
}={},tabList) {
	const tabbarView = new plus.nativeObj.View(id,style);
	const isHold= beforeMount(tabbarView,tabList);
	if(!isHold){
		initAddEvents(event,tabbarView,tabList,registerPageHook);
		mounted(tabbarView,tabList);
		tabbarView.show();
		return tabbarView;
	}
}
/**
 * 初始化入口
 * @param {*} config 
 * @param {*} tabList 
 */
export const init = function(config,tabList) {
	return createdTab(config,tabList);
}
