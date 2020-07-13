// #ifdef H5
import {
	DOM
} from '../component/h5-dom.js';

import {init} from '../vueRouter/init.js'
// #endif

import {warn} from '../helpers/warn.js'

class Patch {
	constructor(H5) {
		this.H5 = H5;
		this.isLoading = true;
		this.loadingCount = 0; //在APP.vue中进行跳转时，DOMContentLoaded过慢。使用索引来判断
	}
	on(fun, args, callback) {
		if (this.H5) {
			return this[fun](args);
		}
		callback && callback();
	}
	/**
	 * 把vueRouter的生命周期代理过来
	 * @param {Object} Router
	 * @param {Object} vueRouter
	 * @param {VueComponent} vueVim
	 */
	registerHook(Router, vueRouter,vueVim) {
		init(Router,vueRouter,vueVim);
	}
	/**
	 * H5 专属 history.back API
	 * @param {Number} backLayer	需要返回的层级必须是正整数
	 * 2020年1月14日14:39:38  修复 https://github.com/SilurianYang/uni-simple-router/issues/73
	 */
	historyBack({backLayer,delta={from: 'navigateBack'}}={}) {
		const pages=getCurrentPages();
		const page=pages[pages.length-1]
		const onBackPress=page.$options.onBackPress;
		if(onBackPress!=null&&onBackPress.constructor===Array){
			const callFun=onBackPress[onBackPress.length-1];
			const isNext=callFun.call(page,delta);
			if(isNext){
				return true;
			}
		}
		history.go(-backLayer)
	}
	/**
	 * 把加载动画添加到dom下面,为什么一定要先添加，后移除。保证动画的连续性
	 */
	appendHTML({
		style,
		html,
		script
	}) {
		window.addEventListener('DOMContentLoaded', () => {
			const body = document.querySelector('body');
			body.appendChild(style);
			body.appendChild(html);
			body.appendChild(script);
			this.toogle('startLodding', true);
		})
	}
	/**
	 * 页面是否加载完毕触发对应事件
	 */
	toogle(toogle, DOMContentLoaded = false) {
		if (DOMContentLoaded && this.loadingCount !== 0) {
			this.loadingCount++;
			return false;
		}
		try {
			this.loadingCount++;
			if (this.isLoading) {
				window[toogle]();
			}
		} catch (error) {
				warn(`你使用了 addRoutes API 提现进行了生命周期 并触发了startLodding`)
		}
	}
	async setLoadingStatus({
		loading,
		replaceStyle,
		resetStyle
	}) {
		this.isLoading = loading;
		if (loading) {		//确认需要加载样式 开始插入节点
			const userStyle=resetStyle();
			for(let key in userStyle){
				let html =userStyle[key];
				if(key==='style'&&!replaceStyle){	//开发者设置为追加style
					html=DOM[key].innerHTML+html;
				}
				DOM[key].innerHTML=html;
			}
			this.appendHTML(DOM);
		}
	}

}
export default Patch;
