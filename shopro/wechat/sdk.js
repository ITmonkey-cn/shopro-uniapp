var jweixin = require('jweixin-module');
import http from '@/shopro/request/index';
import $platform from '@/shopro/platform';
export default {
	//判断是否在微信中
	isWechat() {
		var ua = window.navigator.userAgent.toLowerCase();
		if (ua.match(/micromessenger/i) == 'micromessenger') {
			return true;
		} else {
			return false;
		}
	},

	// 鉴权页面
	initJssdk(callback) {
		http('common.wxJssdk', {
			uri: encodeURIComponent($platform.entry())
		}).then(res => {
			jweixin.config({
				debug: res.data.debug,
				appId: res.data.appId,
				timestamp: res.data.timestamp,
				nonceStr: res.data.nonceStr,
				signature: res.data.signature,
				jsApiList: res.data.jsApiList,
				openTagList: res.data.openTagList
			});
			if (callback) {
				callback(res.data);
			}
		})
	},

	//在需要定位页面调用
	getLocation(callback) {
		this.isWechat() && this.initJssdk(function(res) {
			jweixin.ready(function() {
				jweixin.getLocation({
					type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
					success: function(res) {
						callback(res)
					},
					fail: function(res) {
						console.log(`%c微信H5sdk,getLocation失败：`,
							'color:green;background:yellow');
					},
				});
			});
		});
	},

	//获取微信收货地址
	openAddress(callback) {
		this.isWechat() && this.initJssdk(function(res) {
			jweixin.ready(function() {
				jweixin.openAddress({
					success: function(res) {
						callback(res)
					},
					fail: function(err) {
						console.log(`%c微信H5sdk,openAddress失败：`,
							'color:green;background:yellow');
					},
					complete: function(msg) {
					}
				});
			});
		});
	},

	// 微信扫码
	scanQRCode(callback) {
		this.isWechat() && this.initJssdk(function(res) {
			jweixin.ready(function() {
				jweixin.scanQRCode({
					needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
					scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
					success: function(res) {
						callback(res)
					},
					fail: function(res) {
						console.log(`%c微信H5sdk,scanQRCode失败：`,
							'color:green;background:yellow');
					},
				});
			});
		});
	},

	// 微信分享
	share(data, callback) {
		this.isWechat() && this.initJssdk(function(res) {
			jweixin.ready(function() {
				var shareData = {
					title: data.title,
					desc: data.desc,
					link: data.path,
					imgUrl: data.image,
					success: function(res) {
						callback(res)
						// 分享后的一些操作,比如分享统计等等
					},
					cancel: function(res) {}
				};

				jweixin.updateAppMessageShareData(shareData); //新版接口
				//分享到朋友圈接口
				jweixin.updateTimelineShareData(shareData);


			});
		});

	},


	// 打开坐标位置
	openLocation(data, callback) { //打开位置
		this.isWechat() && this.initJssdk(function(res) {
			jweixin.ready(function() {
				jweixin.openLocation({ //根据传入的坐标打开地图
					latitude: data.latitude,
					longitude: data.longitude
				});
			});
		});
	},
	// 选择图片
	chooseImage(callback) { //选择图片
		this.isWechat() && this.initJssdk(function(res) {
			jweixin.ready(function() {
				jweixin.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					sourceType: ['album'],
					success: function(rs) {
						callback(rs)
					}
				})
			});
		});
	},

	//微信支付
	wxpay(data, callback) {
		let that = this;
		this.isWechat() && this.initJssdk(function(res) {
			jweixin.ready(function() {
				jweixin.chooseWXPay({
					timestamp: data
						.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
					nonceStr: data.nonceStr, // 支付签名随机串，不长于 32 位
					package: data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
					signType: data.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
					paySign: data.paySign, // 支付签名
					success: function(res) {
						callback(res)
					},
					fail: function(res) {
						console.log(`%c微信H5sdk,chooseWXPay失败：`,
							'color:green;background:yellow');
						callback(res)
					},
					cancel: function(res) {

					},
				});
			});
		});
	}
}
