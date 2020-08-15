var jweixin = require('jweixin-module');
import api from '@/common/request/index'
import tools from '@/common/utils/tools.js'
export default {
	//判断是否在微信中
	isWechat: function() {
		var ua = window.navigator.userAgent.toLowerCase();
		if (ua.match(/micromessenger/i) == 'micromessenger') {
			return true;
		} else {
			return false;
		}
	},
	initJssdk: function(callback) {

		var uri = encodeURIComponent(window.location.href); //获取当前url然后传递给后台获取授权和签名信息
		api('wechat.jssdk', {
			uri: uri
		}).then(res => {
			jweixin.config({
				debug: res.data.debug,
				appId: res.data.appId,
				timestamp: res.data.timestamp,
				nonceStr: res.data.nonceStr,
				signature: res.data.signature,
				jsApiList: res.data.jsApiList
			});
			if (callback) {
				callback(res.data);
			}
		})
	},
	//在需要定位页面调用
	getlocation: function(callback) {
		if (!this.isWechat()) {
			return;
		}
		this.initJssdk(function(res) {
			jweixin.ready(function() {
				jweixin.getLocation({
					type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
					success: function(res) {

						callback(res)
					},
					fail: function(res) {},
				});
			});
		});
	},
	//获取微信收货地址
	openAddress: function(callback) {
		if (!this.isWechat()) {
			return;
		}
		this.initJssdk(function(res) {
			jweixin.ready(function() {
				jweixin.openAddress({
					success: function(res) {

						callback(res)
					},
					fail: function(res) {},
				});
			});
		});
	},
	// 微信扫码
	scanQRCode: function(callback) {
		if (!this.isWechat()) {
			return;
		}
		this.initJssdk(function(res) {
			jweixin.ready(function() {
				jweixin.scanQRCode({
					needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
					scanType: ["qrCode","barCode"],// 可以指定扫二维码还是一维码，默认二者都有
					success: function(res) {
						callback(res)
					},
					fail: function(res) {},
				});
			});
		});
	},
	// 微信分享
	share: function(data, callback) {
		if (!this.isWechat()) {
			return;
		}
		this.initJssdk(function(res) {
			jweixin.ready(function() {
				var shareData = {
					title: data.title,
					desc: data.desc,
					link: data.path,
					imgUrl: data.imageUrl,
					success: function(res) {
						callback(res)
						// 分享后的一些操作,比如分享统计等等
					},
					cancel: function(res) {}
				};
				jweixin.onMenuShareAppMessage(shareData);
				//分享到朋友圈接口
				jweixin.onMenuShareTimeline(shareData);


			});
		});

	},
	// 微信定位
	openLocation: function(data, callback) { //打开位置
		if (!this.isWechat()) {
			return;
		}
		this.initJssdk(function(res) {
			jweixin.ready(function() {
				jweixin.openLocation({ //根据传入的坐标打开地图
					latitude: data.latitude,
					longitude: data.longitude
				});
			});
		});
	},
	// 选择图片
	chooseImage: function(callback) { //选择图片
		if (!this.isWechat()) {
			return;
		}
		this.initJssdk(function(res) {
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
	wxpay: function(data, callback) {
		let that = this;
		if (!this.isWechat()) {
			return;
		}
		this.initJssdk(function(res) {
			jweixin.ready(function() {
				jweixin.chooseWXPay({
					timestamp: data.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
					nonceStr: data.nonceStr, // 支付签名随机串，不长于 32 位
					package: data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
					signType: data.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
					paySign: data.paySign, // 支付签名
					success: function(res) {
						callback(res)
					},
					fail: function(res) {
						callback(res)
					},
					cancel: function(res) {
						that.tools.toast('取消支付')

					},
				});
			});
		});
	}
}
