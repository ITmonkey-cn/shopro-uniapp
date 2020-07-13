import {
	route,
	baseConfig,
	Global
} from "./config.js";
import {
	builtIn
} from "../vueRouter/base.js";
import {
	err,
	log
} from "./warn.js";

/**
 * 当前是不是H5运行环境
 */
export const isH5 = function () {
	return typeof window !== "undefined" && typeof document !== "undefined";
};
/** 
 * 判断当前变量是否为Object
 * @param {Object} strObj
 */
export const isObject=function(strObj){
	return strObj.toString()==='[object Object]'&&strObj.constructor===Object;
}
/**
 * 获取当前运行平台
 * @param {Boolean} applets 默认false  true时所有小程序平台统一返回 APPLETS
 */
export const appPlatform = function (applets = false) {
	let platform = ''

	// #ifdef APP-PLUS-NVUE
	platform = 'APPNVUE'
	// #endif

	// #ifdef APP-PLUS
	platform = 'APP';
	// #endif

	// #ifdef H5
	platform = 'H5'
	// #endif

	// #ifdef MP-ALIPAY
	platform = 'ALIPAY'
	// #endif

	// #ifdef MP-BAIDU
	platform = 'BAIDU'
	// #endif

	// #ifdef MP-QQ
	platform = 'QQ'
	// #endif

	// #ifdef MP-WEIXIN
	platform = 'WEIXIN'
	// #endif

	// #ifdef MP-TOUTIAO
	platform = 'TOUTIAO'
	// #endif

	if (applets) {
		// #ifdef MP
		platform = 'APPLETS'
		// #endif
	}

	return platform;
}
/**
 * 定义一个空方法 如果最后一个参数为true则打印所有参数
 * @param  {...any} args 
 */
export const noop = function (...args) {
	if (args[args.length - 1] === true) {
		log(args);
	}
}
/**
 * 格式化基础配置信息 通过new Router传递过来的参数
 */
export const formatConfig = function (userConfig) {
	if (!userConfig.routes || userConfig.routes.constructor !== Array) {
		return err(`路由参数 'routes' 必须传递 \r\n\r\n${JSON.stringify(userConfig)}`);
	}
	if (userConfig.h5 != null && userConfig.h5.constructor !== Object) {
		return err(`h5参数传递错误，应该是一个 'Object' 类型 示例：\r\n\r\n${JSON.stringify(baseConfig.h5)}`);
	}
	const config = Object.create(null);
	for (let key in baseConfig) {
		if (userConfig[key] != null) {
			if (userConfig[key].constructor === Object) {
				config[key] = {
					...baseConfig[key],
					...userConfig[key]
				}
			} else if (key == 'routes') { //需要加入已知的白名单
				config[key] = [...baseConfig[key], ...userConfig[key], ...builtIn]
			} else {
				config[key] = userConfig[key];
			}
		} else {
			config[key] = baseConfig[key]
		}
	}
	return config;
}
/**递归查找当前page路径对应的vue组件
 * @param {Object} Vim
 */
export const queryMp = function (Vim) {
	if (Vim.constructor.name == 'Vue') {
		Vim.$options.page = '';
		Vim.$options.ONLAUNCH = true;
		return Vim.$options
	} else {
		if (Object.keys(Vim).length < 6) {
			return Vim;
		}
		if (Vim.$mp && Vim.$mp.page) {
			return Vim.$mp;
		}
		return queryMp(Vim.$parent);
	}
}
export const filter = function (str) {
	str += "";
	str = str.replace(/%/g, "%25");
	str = str.replace(/\+/g, "%2B");
	str = str.replace(/ /g, "%20");
	str = str.replace(/\//g, "%2F");
	str = str.replace(/\?/g, "%3F");
	str = str.replace(/&/g, "%26");
	str = str.replace(/\=/g, "%3D");
	str = str.replace(/#/g, "%23");
	return str;
};
/**
 * @param {String} routerName //路径名称
 * @param {JSON} query 	//需要格式化参数
 * @param {Boolean} Encode 	//是获取还是编码后传递
 */
export const parseQuery = function (routerName, query, Encode = false) {
	if (Global.Router.CONFIG.encodeURI) {
		return parseQueryN(routerName, query, Encode);
	}
	return parseQueryD(routerName, query, Encode);
};
/**
 * 使用encodeURI:true的情况	需要进行编码后再传递，解码等等 可以传递深度对象并会在路径后面加入一个query=
 * 
 * @param {String} routerName //路径名称
 * @param {JSON} query 	//需要格式化参数
 * @param {Boolean} Encode 	//是获取还是编码后传递
 */
export const parseQueryN = function (routerName, query, Encode) {
	if (Encode) {
		return {
			url: routerName,
			query: JSON.parse(decodeURIComponent(query.replace(/^query=/, '')))
		};
	} else {
		return {
			url: routerName,
			query: `query=${encodeURIComponent(JSON.stringify(query))}`
		};
	}
};
/**
 * 使用encodeURI:false的情况 直接格式化为普通的queryURl参数形式传递即可 扁平深度对象
 * 
 * @param {String} routerName //路径名称
 * @param {JSON} query 	//需要格式化参数
 * @param {Boolean} Encode 	//是获取还是编码后传递
 */
export const parseQueryD = function (routerName, query, Encode) {
	if (Encode) {
		let obj = {};
		let reg = /([^=&\s]+)[=\s]*([^&\s]*)/g;
		while (reg.exec(query)) {
			obj[RegExp.$1] = RegExp.$2;
		}
		return {
			url: routerName,
			query: obj
		};
	} else {
		const encodeArr = [];
		for (let attr in query) {
			let encodeStr = '';
			if (query[attr].constructor == Object) {
				encodeStr = parseQueryD(routerName, query[attr], Encode).query;
				encodeArr.push(encodeStr);
			} else {
				encodeStr = filter(query[attr]);
				encodeArr.push(`${attr}=${ encodeStr }`);
			}
		}
		return {
			url: routerName,
			query: encodeArr.join("&")
		};
	}
};

export const exactRule = function (cloneRule, routes, ruleKey, getRule = false) {
	const params = {};
	let i = 0;
	while (true) {
		const item = routes[i];
		if (item == null) {
			if (!getRule) {
				err(`路由表中未查找到 '${ruleKey}' 为 '${cloneRule[ruleKey]}'`)
			}
			return {
				path: '',
				name: ''
			}
		}
		if (item[ruleKey] != null && item[ruleKey] === cloneRule[ruleKey]) {
			if (!getRule) {
				params.url = item['path'];
				params.rule = item;
				if (isH5()) { //如果是h5 则使用优先使用自定义路径名称
					params.url = item['aliasPath'] || item['path'];
				}
				return params;
			}
			return item;
		}
		i++;
	}
};

export const normalizeParams = function (cloneRule, routes) {
	let params = {};
	if (cloneRule.constructor === String) {
		let rule = {};
		rule.path = cloneRule;
		rule.query = {};
		cloneRule = rule;
	}
	params =
		(cloneRule["path"] && parseQuery("path", cloneRule["query"] || {})) ||
		(cloneRule["name"] && parseQuery("name", cloneRule["params"] || {}));
	params = {
		...exactRule(cloneRule, routes, params.url),
		query: params.query
	};
	return params;
};

export const encodeURI = function (rule) {
	return encodeURIComponent(rule);
};

export const resolveRule = function (router, rule, query = {}, ruleKey = 'path') {
	let ruleInfo = route(
		exactRule({
				...rule
			},
			router.CONFIG.routes,
			ruleKey,
			router
		)
	);
	return {
		...ruleInfo,
		query
	};
};
/**
 * 把一些不必要的参数进行格式化掉，完成url的美观
 * @param {String} URLQuery URL中传递的参数
 */
export const formatURLQuery = function (URLQuery) {
	switch (URLQuery.trim()) {
		case `query=%7B%7D`:
		case `%7B%7D`:
		case `?query=%7B%7D`:
		case `?`:
		case `?[object Object]`:
		case `?query={}`:
			URLQuery = '';
			break;
	}
	return URLQuery;
}
/**
 * 拷贝对象
 * @param {Object} object 
 */
export const copyObject = function (object) {
	return JSON.parse(JSON.stringify(object))
}
/**
 * 把一个字符串对象转json再转字符串
 * @param {Object} strObj 字符串对象
 */
export const strObjToJsonToStr=function(strObj){
	return JSON.stringify(JSON.parse(strObj))
}
/**
 * 延迟函数 返回一个promise来进行延迟
 * @param {Number} time 需要延迟的时间戳
 */
export const timeout = function (time = 0) {
	return new Promise(resolve => {
		setTimeout(() => {
			resolve();
		}, time);
	})
}