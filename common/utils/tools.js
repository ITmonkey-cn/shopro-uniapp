import {
	API_URL
} from '@/env'
import router from '@/common/router'
export default {
	/**
	 * 跳转再封装，不支持复杂传参。
	 */
	routerTo(path, params = {}, isLogin) {
		let objParams = params;
		// 是否跳转外部链接
		if (~path.indexOf('http')) {
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
		// 判断是否有参数
		if (path.indexOf('?') !== -1) {
			let index = path.lastIndexOf('?');
			let query = path.substring(index + 1, path.length);
			let arr = query.split('&')
			path = path.slice(0, index);
			arr.forEach(item => {
				let mArr = []
				let obj = {}
				mArr = item.split('=');
				obj[mArr[0]] = mArr[1];
				objParams = {
					...objParams,
					...obj
				}

			})
		}
		// 判断是否是tabbar
		if (isLogin) {
			router.replaceAll({
				path: path,
				query: objParams
			})
		} else {
			router.push({
				path: path,
				query: objParams
			})
		}
	},
	/**
	 * fn：检测图片协议，主要用于检测海报图片协议。
	 * param(imgPath): 图片地址。
	 */

	checkImgHttp(imgPath) {
		let newPath = '';
		let pathArr = imgPath.split('://');
		// #ifdef H5
		let ishttps = 'https:' == window.location.protocol ? true : false;
		ishttps ? (pathArr[0] = 'https') : (pathArr[0] = 'http');
		// #endif
		// #ifdef MP-WEIXIN
		pathArr[0] = 'https'
		// #endif
		newPath = pathArr.join('://');
		return newPath;
	},
	// 打电话
	callPhone(phoneNumber = '') {
		let num = phoneNumber.toString()
		uni.makePhoneCall({
			phoneNumber: num,
			fail(err) {
				console.log('makePhoneCall出错', err)
			},
		});
	},
	// 图片处理-选择图片
	chooseImage(count = 1) {
		return new Promise((resolve, reject) => {
			uni.chooseImage({
				count: count, //默认9
				sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				sourceType: ['album'], //从相册选择
				success: res => {
					resolve(res.tempFilePaths);
				}
			});
		}).catch(e => {
			reject(e)
		})
	},
	// 图片处理-上传图片
	uploadImage(api, url) {
		let config_url = API_URL;
		uni.showLoading({
			title: '上传中'
		});
		return new Promise((resolve, reject) => {
			uni.uploadFile({
				url: config_url + api,
				filePath: url,
				name: 'file',
				success: res => {
					res = JSON.parse(res.data);
					if (res.code === 1) {
						uni.hideLoading()
						uni.showToast({
							title: '上传成功',
							icon: 'none'
						});
						resolve(res.data)
					} else {
						uni.hideLoading()
						uni.showModal({
							title: '上传失败',
							content: res.msg
						});
					}
				}
			});
		}).catch(e => {
			reject(e)
		})
	},
	// 图片处理-预览图片
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
	// 图片处理-获取图片信息
	getImageInfo(src = '') {
		return new Promise((resolve, reject) => {
			uni.getImageInfo({
				src: src,
				success: (image) => {
					resolve(image)
				},
				fail(err) {
					console.log('getImageInfo出错', src, err)
				},
			})
		}).catch(e => {
			reject(e)
		})

	},
	/**
	 * 格式化时间
	 */
	//时间格式化 天时分秒
	format(t) {
		let format = {
			d: '00',
			h: '00',
			m: '00',
			s: '00',
		}
		if (t > 0) {
			let d = Math.floor(t / 86400)
			let h = Math.floor((t / 3600) % 24)
			let m = Math.floor((t / 60) % 60)
			let s = Math.floor(t % 60)
			format.d = d < 10 ? '0' + d : d
			format.h = h < 10 ? '0' + h : h
			format.m = m < 10 ? '0' + m : m
			format.s = s < 10 ? '0' + s : s
		}
		return format
	},
	//时间格式化(格式化最大为小时)
	formatToHours(t) {
		let format = {
			d: '00',
			h: '00',
			m: '00',
			s: '00',
		}
		if (t > 0) {
			let h = Math.floor(t / 3600)
			let m = Math.floor((t / 60) % 60)
			let s = Math.floor(t % 60)

			format.h = h < 10 ? '0' + h : h
			format.m = m < 10 ? '0' + m : m
			format.s = s < 10 ? '0' + s : s
		}
		return format
	},
	// 年月日
	timestamp(timestamp) {
		let date = new Date(timestamp * 1000); //根据时间戳生成的时间对象
		let y = date.getFullYear();
		let m = date.getMonth() + 1;
		let d = date.getDate();

		m = m < 10 ? '0' + m : m;
		d = d < 10 ? '0' + d : d

		let dateText = y + "-" + m + "-" + d
		return dateText
	},
	// 年月日，时分秒
	// "YYYY-mm-dd HH:MM"
	dateFormat(fmt, date) {
		let ret;
		const opt = {
			"Y+": date.getFullYear().toString(), // 年
			"m+": (date.getMonth() + 1).toString(), // 月
			"d+": date.getDate().toString(), // 日
			"H+": date.getHours().toString(), // 时
			"M+": date.getMinutes().toString(), // 分
			"S+": date.getSeconds().toString() // 秒
			// 有其他格式化字符需求可以继续添加，必须转化成字符串
		};
		for (let k in opt) {
			ret = new RegExp("(" + k + ")").exec(fmt);
			if (ret) {
				fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
			};
		};
		return fmt;
	},
	/**
	 *  @fn  时间间隔格式化
	 *  @param {*} startTime 开始时间的时间戳
	 *  @param {*} endTime 结束时间的时间戳
	 *  @return {string} str 返回时间字符串
	 */
	getTimeInterval(startTime, endTime) {
		let runTime = parseInt((endTime - startTime) / 1000);
		let year = Math.floor(runTime / 86400 / 365);
		runTime = runTime % (86400 * 365);
		let month = Math.floor(runTime / 86400 / 30);
		runTime = runTime % (86400 * 30);
		let day = Math.floor(runTime / 86400);
		runTime = runTime % 86400;
		let hour = Math.floor(runTime / 3600);
		runTime = runTime % 3600;
		let minute = Math.floor(runTime / 60);
		runTime = runTime % 60;
		let second = runTime;
		let str = '';
		if (year > 0) {
			str = year + '年';
		}
		if (year <= 0 && month > 0) {
			str = month + '月';
		}
		if (year <= 0 && month <= 0 && day > 0) {
			str = day + '天';
		}
		if (year <= 0 && month <= 0 && day <= 0 && hour > 0) {
			str = hour + '小时';
		}
		if (year <= 0 && month <= 0 && day <= 0 && hour <= 0 && minute > 0) {
			str = minute + '分钟';
		}
		if (year <= 0 && month <= 0 && day <= 0 && hour <= 0 && minute <= 0 && second > 0) {
			str += second + '秒';
		}
		str += '前';
		return str;
	},


	/**提示框
	 *title(标题)
	 *icon(图标):  success，loading，none
	 *duration(延时): 0为不关闭, 毫秒数
	 *options(其它参数)
	 */
	toast(title, icon = 'none', options) {
		wx.showToast({
			title: title || '',
			icon: icon,
			duration: (options && options.duration) || 1500,
			image: (options && options.image) || '',
			mask: (options && options.mask) || true,
		});
	}

}
