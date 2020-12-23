/**
 *app权限检测
 */
// #ifdef APP-VUE
import permision from "@/common/permission.js"
// #endif
export default class AppCheckPermission {
	constructor(type) {
		this.typeMap = [{
				[Symbol('des')]: '相册读写权限',
				'iosPermission': 'album',
				'androidPermission': ['android.permission.READ_EXTERNAL_STORAGE', 'android.permission.WRITE_EXTERNAL_STORAGE'],
				'tipText': '需要相册读写权限'

			},
			{
				[Symbol('des')]: '摄像头权限',
				'iosPermission': 'camera',
				'androidPermission': ['android.permission.CAMERA'],
				'tipText': '需要摄像头权限'

			},
			{
				[Symbol('des')]: '定位权限',
				'iosPermission': 'location',
				'androidPermission': ['android.permission.ACCESS_FINE_LOCATION'],
				'tipText': '需要定位权限'

			},
			{
				[Symbol('des')]: '通讯录权限',
				'iosPermission': 'contact',
				'androidPermission': ['android.permission.READ_CONTACTS', 'android.permission.WRITE_CONTACTS'],
				'tipText': '需要通讯录权限'

			},
			{
				[Symbol('des')]: '麦克风权限',
				'iosPermission': 'record',
				'androidPermission': ['android.permission.RECORD_AUDIO'],
				'tipText': '需要麦克风权限'

			},
			{
				[Symbol('des')]: '日历权限',
				'iosPermission': 'calendar',
				'androidPermission': ['android.permission.READ_CALENDAR', 'android.permission.WRITE_CALENDAR'],
				'tipText': '需要日历权限'

			}
		];
		this.funcMap = new Map()
		this.type = type
		this.init()
	}

	// 初始化
	init() {
		this.typeMap.forEach(item => {
			this.funcMap.set(item.iosPermission, this.checkFunc(item))
		})
		this.funcMap.get(this.type)
	}

	async checkFunc(arg) {
		const {
			iosPermission,
			androidPermission,
			tipText
		} = arg;
		// #ifdef APP-VUE
		let status = permision.isIOS ? await permision.requestIOS(iosPermission) : await permision.requestAndroid(
			androidPermission);
		if (status !== 1) {
			uni.showModal({
				content: tipText,
				confirmText: '设置',
				success: function(res) {
					if (res.confirm) {
						permision.gotoAppSetting();
					}
				}
			});
			return false
		} else {
			return true
		}
		// #endif
		// #ifndef APP-VUE
		return true
		// #endif
	}
}
