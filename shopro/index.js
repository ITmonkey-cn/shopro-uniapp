// 挂载变量
import {
	API_URL,
	IMG_URL
} from '../env.js';
import store from '@/shopro/store';
import http from '@/shopro/request';
import platform from '@/shopro/platform';
import tools from '@/shopro/utils/tools'
// mixin混入
import mixin from '@/shopro/mixins';
// #ifdef H5
// uni方法重写, h5的粘贴板的设置，获取。图片视频的保存
import wxsdk from '@/shopro/wechat/sdk'
import VConsole from 'vconsole'
import '@/shopro/utils/sdk-h5.js'
// #endif

import wechat from '@/shopro/wechat/wechat';

const install = Vue => {
	Vue.prototype.$API_URL = API_URL;
	Vue.prototype.$IMG_URL = IMG_URL;
	// 挂载请求
	Vue.prototype.$http = http;
	// 平台判断
	Vue.prototype.$platform = platform;
	// 挂载工具函数
	Vue.prototype.$tools = tools;
	Vue.mixin(mixin);

	// #ifdef H5
	// 微信H5,sdk挂载
	Vue.prototype.$wxsdk = wxsdk;
	//  调试微信jssdk
	process.env.NODE_ENV === 'development' && new VConsole()
	// #endif
}

export async function init(options) {
	// #ifdef H5
	platform.entry();
	// #endif
	// #ifdef MP-WEIXIN
	// 检测小程序更新(如果从朋友圈场景进入则无此API)
	options.scene !== 1154 && wechat.checkMiniProgramUpdate();
	// #endif
	await store.dispatch("appInit", options); // 加载商城基本信息
	await store.dispatch("getTemplate", options); // 加载模板数据
	// #ifdef MP-WEIXIN
	await store.dispatch('getMessageIds'); //获取模板消息
	// #endif
	process.env.NODE_ENV === 'development' && store.dispatch("syncPages");
}

export default {
	install
}
