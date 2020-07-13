import {eventBind} from '../config/base'
import {getActiveTabPage} from '../util/util'

/**
 * 根据坐标获得点击的位置 并传入到开发者声明的回调函数中
 */
const xyTransformTo=function(type,{pageX},tabList,callBack,isHook){
	const {length}=tabList;
	const screenWidth=plus.screen.resolutionWidth;
	const single=(screenWidth/length).toFixed(4);
	const index= Math.ceil(pageX.toFixed(4)/single)-1;
	const tab=tabList[index];
	const {route}=getActiveTabPage();	//获取当前页面的路径
	if(route!=tab.pagePath){
		callBack(index,tab,()=>{
			callPageHook(type,isHook,tab);
		});
	}else{
		callBack(index,tab,()=>{})
		callPageHook(type,isHook,tab);
	}
}
/**
 * 执行页面生命钩子
 * @param {Object} type
 * @param {Object} isHook
 * @param {Object} tab
 */
const callPageHook=function(type,isHook,tab){
	if(isHook){	//如果有设置页面拦截函数 则调用
		const page=getActiveTabPage(tab.pagePath);
		if(page){
			const onTabEvent=page.$vm.$options.onTabEvent;
			onTabEvent&&onTabEvent.call(page.$vm,type,tab);
		}
	}
}
/**
 * 绑定一些指定的事件
 * @param {Object} event 事假json对象
 * @param {Object} view 当前底部的tabbar遮罩层
 */
export const initAddEvents=function(event,view,tabList,isHook){
	for(let key in event){
		const callBack=event[key];
		const type=eventBind[key];
		view.addEventListener(type,(e)=>{
			xyTransformTo(type,e,tabList,callBack,isHook);
		})
	}
}