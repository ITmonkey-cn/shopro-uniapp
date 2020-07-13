
import {methods} from '../helpers/config'
import {formatURLQuery} from '../helpers/util'


/**
 * @param {Object} finalRoute 格式化后的路由跳转规则
 * @param {Object} NAVTYPE 需要调用的跳转方法
 */
export const appletsUniPushTo = function(finalRoute,NAVTYPE) {
	return new Promise(resolve=>{
		const query=formatURLQuery(`?${finalRoute.uniRoute.query}`);
		const url=finalRoute.uniRoute.url;
		uni[methods[NAVTYPE]]({
			url:url+query,
			complete:()=>{
				resolve(url);
			}
		});
	})
}
