import {
	appPlatform
} from '../helpers/util.js'

import {
	Global
} from "../helpers/config.js";


export const queryInfo = function (Vim) {
	let query = {};
	Vim.query = Vim.query || {}; //计算属性中query会丢失 https://github.com/SilurianYang/uni-simple-router/issues/26
	if(Global.Router.CONFIG.encodeURI){
		if (Vim.ONLAUNCH == null) {
			try {
				query = JSON.parse(decodeURIComponent(Vim.query.query || encodeURIComponent('{}')))
			} catch (e) {
				query = JSON.parse(Vim.query.query)
			}
		}
	}else{
		query=Vim.query;
	}
	let path = '';
	let ruleKey='path';
	switch (appPlatform()) {
		case 'H5':
			path = Vim.page &&( ruleKey='aliasPath',Vim.page.$page.path || '/' + Vim.page.route);
			break;
		case 'BAIDU':
			path = '/' + Vim.page.pageinstance.route || '';
			break
		default:
			path = '/' + Vim.page.route || '';
			break;
	}
	const route={}
	route[ruleKey]=path;
	return {
		route,
		ruleKey,
		query
	}
}

/**
 * 截止 1.3.5 版本 不做任何操作
 * @param {element} el dom节点 
 */
export const appletsMount=function(Vim,el){
	Vim.$mount();
}