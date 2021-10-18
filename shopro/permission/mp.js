/**
 * 小程序相关权限
 * @param {String} scopeValue - 权限种类，isMessage为订阅消息设置,默认false
 *                         
 */

const TIPS_MAP = {
	'userInfo': '用户信息',
	'userLocation': '地理位置', //需要在manifest中配置permission。
	'address': '通信地址',
	'userLocationBackground': '后台定位',
	'record': '录音功能',
	'writePhotosAlbum': '保存到相册',
	'camera': '摄像头',
	'invoice': '获取发票',
	'invoiceTitle': '发票抬头',
	'werun': '微信步数',
	'message': '订阅消息'
}

export default class MpAuth {

	constructor(scopeValue) {
		this.scopeValue = scopeValue
		this.isMessage = scopeValue === 'message' ? true : false
	}

	// 检测当前请求权限是否可用。
	checkAuth() {
		const that = this;
		return new Promise((resolve, reject) => {
			uni.getSetting({
				withSubscriptions: that.isMessage, //是否获取用户订阅消息的订阅状态
				success: res => {
					if (!that.isMessage) { // 非订阅消息
						if (!res.authSetting[
								`scope.${this.scopeValue}`]) { //用户未请求过此权限，后者用户拒绝了此权限
							uni.authorize({ //如果没请求过，会弹窗询问。同意过，直接success。此前拒绝，直接fai
								scope: `scope.${this.scopeValue}`,
								success: res => { //用户同意
									console.log(
										`%c用户同意${TIPS_MAP[this.scopeValue]}权限1`,
										'color:green;background:yellow');
									resolve(1)
								},
								fail: err => { //用户拒绝
									console.log(
										`%c用户拒绝${TIPS_MAP[this.scopeValue]}权限`,
										'color:green;background:yellow');
									resolve(0)
									that.setAuth()
								}
							})
						} else { //用户同意授权此权限，直接调用接口
							console.log(`%c用户同意${TIPS_MAP[this.scopeValue]}权限2`,
								'color:green;background:yellow');
							resolve(1)
						}
					} else { //订阅消息 TODO

					}
				},
				fail: err => {
					console.log(`%cuni.getSetting失败：`, 'color:green;background:yellow');
					console.log(err);
				}
			})
		})


	}

	// 引导用户开启权限
	setAuth() {
		uni.showModal({
			title: '设置权限',
			content: `当前功能需要${TIPS_MAP[this.scopeValue]}权限，是否开启？`,
			confirmText: '立即授权',
			success: res => {
				res.confirm && uni.openSetting()
			},
			fail: err => {
				console.log(`%cuni.showModal失败：`, 'color:green;background:yellow');
			}
		})
	}

}
