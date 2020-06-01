import Vue from 'vue'
import App from './App'
import store from '@/common/store'
import cuCustom from '@/static/colorui/components/cu-custom.vue'
import router from '@/common/router'
import tools from '@/common/utils/tools'
import '@/common/utils/sdk/sdk-h5.js'
import {
	API_URL
} from './env.js'


import shoproLoginModal from '@/components/modal/shopro-login-modal.vue';
import shoproLoad from '@/components/shopro-load/shopro-load.vue';
import shoproShare from '@/common/mixins/shopro-share'
import shoproEmpty from '@/components/shopro-empty/shopro-empty.vue';

Vue.mixin(shoproShare);
import {
	RouterMount
} from 'uni-simple-router'
import api from '@/common/request/index'

Vue.prototype.$store = store;
Vue.prototype.$api = api;
Vue.prototype.$tools = tools;
Vue.prototype.$API_URL = API_URL;

Vue.component('cu-custom', cuCustom);
Vue.component('shoproLoad', shoproLoad)
Vue.component('shoproLoginModal', shoproLoginModal)
Vue.component('shoproEmpty', shoproEmpty)
Vue.config.productionTip = false;
App.mpType = 'app';
const app = new Vue({
	store,
	...App
});


// #ifdef H5
import wxsdk from '@/common/wechat/sdk'

Vue.prototype.$wxsdk = wxsdk;
RouterMount(app, '#app');
// #endif

// #ifndef H5
app.$mount();
// #endif
