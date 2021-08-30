import {
	API_URL
} from '@/env'
import {
	router
} from '@/shopro/router'
export default {

	/**
	 * 跳转再封装,主要是为了兼容外链。
	 * @param {String} path - 跳转路径
	 * @param {isTabbar} isTabbar - 是否是底部导航
	 */
	routerTo(path, isTabbar) {
		if (path) {
			// 是否跳转外部链接
			if (~path.indexOf('http') || ~path.indexOf('www')) {
				// #ifdef H5
				window.location = path;
				// #endif
				// #ifndef  H5
				router.push({
					path: '/pages/public/webview',
					query: {
						'webviewPath': path
					}
				})
				// #endif
				return false
			}
			if (isTabbar) {
				router.replaceAll(path)
			} else {
				path.includes('/pages/index') && !path.includes('/pages/index/view') ? router.replaceAll(path) : router
					.push(path)
			}

		} else {
			console.log(`%cerr:没有填写跳转路径`, 'color:green;background:yellow');
		}
	},
	/**
	 * 图片处理-预览图片
	 * @param {Array} urls - 图片列表
	 * @param {Number} current - 首个预览下标
	 */
	previewImage(urls = [], current = 0) {
		uni.previewImage({
			urls: urls,
			current: current,
			indicator: 'default',
			loop: true,
			fail(err) {
				console.log('previewImage出错', urls, err)
			},
		})
	},

	/**
	 * 数据分组
	 * @param {Array} oArr - 原数组列表
	 * @param {Number} length - 单个数组长度
	 * @return {Array}  arr - 分组后的新数组
	 */
	splitData(oArr = [], length = 1) {
		let arr = [];
		let minArr = [];
		oArr.forEach(c => {
			if (minArr.length === length) {
				minArr = [];
			}
			if (minArr.length === 0) {
				arr.push(minArr);
			}
			minArr.push(c);
		});

		return arr;
	},

	/**
	 * 剩余时间格式化
	 * @param {Number} t - 剩余多少秒
	 * @return {Object}  format - 格式后的天时分秒对象
	 */
	format(t) {
		let format = {
			d: '00',
			h: '00',
			m: '00',
			s: '00'
		};
		if (t > 0) {
			let d = Math.floor(t / 86400);
			let h = Math.floor((t / 3600) % 24);
			let m = Math.floor((t / 60) % 60);
			let s = Math.floor(t % 60);
			format.d = d < 10 ? '0' + d : d;
			format.h = h < 10 ? '0' + h : h;
			format.m = m < 10 ? '0' + m : m;
			format.s = s < 10 ? '0' + s : s;
		}
		return format;
	},

	/**
	 * 打电话
	 * @param {String<Number>} phoneNumber - 数字字符串
	 */
	callPhone(phoneNumber = '') {
		let num = phoneNumber.toString()
		uni.makePhoneCall({
			phoneNumber: num,
			fail(err) {
				console.log('makePhoneCall出错', err)
			},
		});
	},


}
