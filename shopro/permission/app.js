/**
 * 本模块封装了Android、iOS的应用权限判断、打开应用权限设置界面、以及位置系统服务是否开启
 * @description 安卓相关权限，需要先在manifest.json中勾选
 * @param {String} scopeValue - 权限种类
 * 
 */

// 只写了当前项目用到的权限，其他用到的自己加下
const PERMISSION_MAP = {
	'userLocation': {
		tip: '地理位置',
		androidPermissionID: ['android.permission.ACCESS_FINE_LOCATION'],

	},
	'writePhotosAlbum': {
		tip: '保存到相册',
		androidPermissionID: ['android.permission.WRITE_EXTERNAL_STORAGE'],

	},
	'camera': {
		tip: '摄像头',
		androidPermissionID: ['android.permission.CAMERA'],

	}

}


// 判断平台
let isIos = (plus.os.name == "iOS")

export default class AppAuth {
	constructor(scopeValue) {
		this.scopeValue = scopeValue
	}

	//权限检测
	async checkAuth() {
		const that = this
		let result = false
		switch (this.scopeValue) {
			case 'userLocation': //定位权限
				result = isIos ? that.iosLocationAuth : await that.androidAuth()
				break;
			case 'writePhotosAlbum': //相册权限
				result = isIos ? that.iosPhotoAuth : await that.androidAuth()
				break;
			case 'camera': //摄像头权限
				result = isIos ? that.iosCameraAuth : await that.androidAuth()
				break;
			default:
				result = false
				break;
		}
		return Promise.resolve(result)
	}

	// Android权限查询
	androidAuth() {
		const that = this;
		let permissionID = PERMISSION_MAP[this.scopeValue].androidPermissionID;
		return new Promise((resolve, reject) => {
			plus.android.requestPermissions(
				[...permissionID], // 理论上支持多个权限同时查询，但实际上本函数封装只处理了一个权限的情况。有需要的可自行扩展封装
				function(resultObj) {
					let result = 0;
					for (var i = 0; i < resultObj.granted.length; i++) {
						var grantedPermission = resultObj.granted[i];
						console.log('已获取的权限：' + grantedPermission);
						result = 1
					}
					for (var i = 0; i < resultObj.deniedPresent.length; i++) {
						var deniedPresentPermission = resultObj.deniedPresent[i];
						console.log('拒绝本次申请的权限：' + deniedPresentPermission);
						result = 0
					}
					for (var i = 0; i < resultObj.deniedAlways.length; i++) {
						var deniedAlwaysPermission = resultObj.deniedAlways[i];
						console.log('永久拒绝申请的权限：' + deniedAlwaysPermission);
						result = -1
					}
					resolve(result);
					// 若所需权限被拒绝,则打开APP设置界面,可以在APP设置界面打开相应权限
					if (result !== 1) {
						that.gotoAppSetting()
					}
				},
				function(error) {
					console.log('申请权限错误：' + error.code + " = " + error.message);
					resolve({
						code: error.code,
						message: error.message
					});
				}
			);
		});
	}

	// 跳转到**应用**的权限页面
	gotoAppSetting() {
		uni.showModal({
			title: '设置权限',
			content: `当前功能需要${PERMISSION_MAP[this.scopeValue].tip}权限，是否去设置？`,
			confirmText: '设置',
			success: res => {
				if (res.confirm) {
					if (isIos) {
						let UIApplication = plus.ios.import("UIApplication");
						let application2 = UIApplication.sharedApplication();
						let NSURL2 = plus.ios.import("NSURL");
						let setting2 = NSURL2.URLWithString("app-settings:");
						application2.openURL(setting2);
						plus.ios.deleteObject(setting2);
						plus.ios.deleteObject(NSURL2);
						plus.ios.deleteObject(application2);
					} else {
						let Intent = plus.android.importClass("android.content.Intent");
						let Settings = plus.android.importClass("android.provider.Settings");
						let Uri = plus.android.importClass("android.net.Uri");
						let mainActivity = plus.android.runtimeMainActivity();
						let intent = new Intent();
						intent.setAction(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
						let uri = Uri.fromParts("package", mainActivity.getPackageName(), null);
						intent.setData(uri);
						mainActivity.startActivity(intent);
					}
				}
			},
			fail: err => {
				console.log(`%cuni.showModal失败：`, 'color:green;background:yellow');
			}
		})
	}



	// 定位是否开启
	iosLocationAuth() {
		let result = 0;
		let cllocationManger = plus.ios.import("CLLocationManager");
		let enable = cllocationManger.locationServicesEnabled();
		let status = cllocationManger.authorizationStatus();
		if (!enable) {
			result = 2;
		} else if (status === 0) {
			result = null;
		} else if (status === 3 || status === 4) {
			result = 1;
		} else {
			result = 0;
		}
		plus.ios.deleteObject(cllocationManger);
		return result;
	}

	// 判断推送权限是否开启
	iosPushAuth() {
		let result = false;
		let UIApplication = plus.ios.import("UIApplication");
		let app = UIApplication.sharedApplication();
		let enabledTypes = 0;
		if (app.currentUserNotificationSettings) {
			let settings = app.currentUserNotificationSettings();
			enabledTypes = settings.plusGetAttribute("types");
			console.log("enabledTypes1:" + enabledTypes);
			if (enabledTypes == 0) {
				console.log("推送权限没有开启");
			} else {
				result = true;
				console.log("已经开启推送功能!")
			}
			plus.ios.deleteObject(settings);
		} else {
			enabledTypes = app.enabledRemoteNotificationTypes();
			if (enabledTypes == 0) {
				console.log("推送权限没有开启!");
			} else {
				result = true;
				console.log("已经开启推送功能!")
			}
			console.log("enabledTypes2:" + enabledTypes);
		}
		plus.ios.deleteObject(app);
		plus.ios.deleteObject(UIApplication);
		return result;
	}



	// 判断麦克风权限是否开启
	iosRecordAuth() {
		let result = false;
		let avaudiosession = plus.ios.import("AVAudioSession");
		let avaudio = avaudiosession.sharedInstance();
		let permissionStatus = avaudio.recordPermission();
		console.log("permissionStatus:" + permissionStatus);
		if (permissionStatus == 1684369017 || permissionStatus == 1970168948) {
			console.log("麦克风权限没有开启");
		} else {
			result = true;
			console.log("麦克风权限已经开启");
		}
		plus.ios.deleteObject(avaudiosession);
		return result;
	}

	// 判断相机权限是否开启
	iosCameraAuth() {
		let result = false;
		let AVCaptureDevice = plus.ios.import("AVCaptureDevice");
		let authStatus = AVCaptureDevice.authorizationStatusForMediaType('vide');
		console.log("authStatus:" + authStatus);
		if (authStatus == 3) {
			result = true;
			console.log("相机权限已经开启");
		} else {
			console.log("相机权限没有开启");
		}
		plus.ios.deleteObject(AVCaptureDevice);
		return result;
	}

	// 判断相册权限是否开启
	iosPhotoAuth() {
		let result = false;
		let PHPhotoLibrary = plus.ios.import("PHPhotoLibrary");
		let authStatus = PHPhotoLibrary.authorizationStatus();
		console.log("authStatus:" + authStatus);
		if (authStatus == 3) {
			result = true;
			console.log("相册权限已经开启");
		} else {
			console.log("相册权限没有开启");
		}
		plus.ios.deleteObject(PHPhotoLibrary);
		return result;
	}

	// 判断通讯录权限是否开启
	iosContactAuth() {
		let result = false;
		let CNContactStore = plus.ios.import("CNContactStore");
		let cnAuthStatus = CNContactStore.authorizationStatusForEntityType(0);
		if (cnAuthStatus == 3) {
			result = true;
			console.log("通讯录权限已经开启");
		} else {
			console.log("通讯录权限没有开启");
		}
		plus.ios.deleteObject(CNContactStore);
		return result;
	}

	// 判断日历权限是否开启
	iosCalendarAuth() {
		let result = false;
		let EKEventStore = plus.ios.import("EKEventStore");
		let ekAuthStatus = EKEventStore.authorizationStatusForEntityType(0);
		if (ekAuthStatus == 3) {
			result = true;
			console.log("日历权限已经开启");
		} else {
			console.log("日历权限没有开启");
		}
		plus.ios.deleteObject(EKEventStore);
		return result;
	}

	// 判断备忘录权限是否开启
	iosMemoAuth() {
		let result = false;
		let EKEventStore = plus.ios.import("EKEventStore");
		let ekAuthStatus = EKEventStore.authorizationStatusForEntityType(1);
		if (ekAuthStatus == 3) {
			result = true;
			console.log("备忘录权限已经开启");
		} else {
			console.log("备忘录权限没有开启");
		}
		plus.ios.deleteObject(EKEventStore);
		return result;
	}

}
