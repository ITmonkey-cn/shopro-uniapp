import Vue from 'vue';
import App from './App';
// 挂载变量
import {
	API_URL,
	IMG_URL
} from './env.js';
Vue.prototype.$API_URL = API_URL;
Vue.prototype.$IMG_URL = IMG_URL;

// uni方法重写, h5的粘贴板的设置，获取。图片视频的保存
import '@/shopro/utils/sdk-h5.js'

// 引入路由
import {
	router,
	RouterMount
} from '@/shopro/router';
Vue.use(router);

// 引入全局uView
import uView from 'uview-ui';
Vue.use(uView);

// 挂载请求
import http from '@/shopro/request';
Vue.prototype.$http = http;

// 平台判断
import platform from '@/shopro/platform';
Vue.prototype.$platform = platform;

// 挂载store状态管理
import store from '@/shopro/store';
Vue.prototype.$store = store;

// 挂载工具函数
import tools from '@/shopro/utils/tools'
Vue.prototype.$tools = tools;

// mixin混入
import mixin from '@/shopro/mixins';
import mixinShare from '@/shopro/mixins/share';
Vue.mixin(mixin);
Vue.mixin(mixinShare);

App.mpType = 'app';

const app = new Vue({
	store,
	...App
});

// #ifdef H5
// 微信H5,sdk挂载
import wxsdk from '@/shopro/wechat/sdk'
Vue.prototype.$wxsdk = wxsdk;
RouterMount(app, router, '#app')
import VConsole from 'vconsole'
if (process.env.NODE_ENV === 'development') { // 调试微信jssdk
	new VConsole()
}
// #endif

// #ifndef H5
// 为了兼容小程序及app端必须这样写才有效果
app.$mount();
// #endif
