import Vue from "vue";
import App from "./App";
import {
	router,
	RouterMount
} from "@/shopro/router";
import store from "@/shopro/store";
import uView from "uview-ui";
import shopro from "@/shopro";


async function bootstrap() {
	App.mpType = "app";
	//引入路由
	Vue.use(router);
	// 引入全局uView
	Vue.use(uView);
	// 加载shopro
	Vue.use(shopro);

	const app = new Vue({
		store,
		...App
	});
	// #ifdef H5
	RouterMount(app, router, "#app");
	// #endif
	// #ifndef H5
	app.$mount();
	// #endif
}

bootstrap();
