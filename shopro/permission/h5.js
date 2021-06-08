/**
 * H5相关权限
 * @description 相关权限校验，调用在wechat/sdk.js
 * @param {String} scopeValue - 权限种类
 *                      
 */

const TIPS_MAP = {
	'userInfo': '用户信息',
	'userLocation': '地理位置',
	'address': '通信地址',
	'record': '录音功能',
	'writePhotosAlbum': '保存到相册',
	'message': '订阅消息'
}
export default class H5Auth {

	constructor(scopeValue) {
		this.scopeValue = scopeValue
	}

	// 检测当前请求权限是否可用。
	checkAuth() {
		const that = this;
		return new Promise((resolve, reject) => {
			switch (that.scopeValue) {
				case 'writePhotosAlbum' || 'camera':
					resolve(1)
					break;
				default:
					resolve(1)
					break;
			}
		})
	}

}
