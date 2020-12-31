/**
 * shopro
 * 聊天配置,socket服务相关,心跳检测和重连
 */

/**
 * socket
 * @param  {Object} config  - 初始化配置对象
 * @param {Number} wait = [10000]  - 心跳频率
 */

import {
	BASE_URL
} from '@/env.js'

const service = BASE_URL.split('://')[1];

export default class Socket {
	constructor(initData, callback) {
		let {
			ping,
			is_ssl,
			gateway_port
		} = initData;
		this.config = {
			url: `${is_ssl?'wss':'ws'}://${service}:${gateway_port}/`,
			session_id: uni.getStorageSync('chatSessionId'),
			token: uni.getStorageSync('token'),
			identify: 'user'
		};
		this.callback = callback; //onmsg回调
		this.timeoutObj = null; //心跳检测定时器对象
		this.lockReconnect = false; //检测次数锁
		this.isClose = false; //链接断开
		this.timer = null; // 检测定时器
		this.limit = 0; //检测次数，默认最大12
		this.timout = ping;
		uni.setStorageSync('isSocketOpen', false)
		this.init()
	}

	// 初始化
	async init() {
		await this.connect();
	}

	// 连接
	async connect() {
		if (!uni.getStorageSync('isSocketOpen')) {
			let [error, res] = await uni.connectSocket({
				url: `${this.config.url}?identify=${this.config.identify}&token=${this.config.token}&session_id=${this.config.session_id}`
			});
			if (res.errMsg === 'connectSocket:ok') {
				this.initEventHandle();
			}
		}
	}

	// 发送消息
	async send(msg = "") {
		if (uni.getStorageSync('isSocketOpen')) {
			let [error, res] = await uni.sendSocketMessage({
				data: msg
			});
			return Promise.resolve(res);
		}
	}

	// 监听消息
	onMsg() {
		uni.onSocketMessage(res => {
			// console.log('收到服务器内容', res.data);
			if (res.code === 1 && res.type === 'init') {
				this.config.session_id = res.data.session_id;
			}
			this.callback(res)
		});
	}

	// 关闭连接
	close() {
		uni.closeSocket();
		uni.removeStorage({
			key: 'isSocketOpen',
			success: (res) => {
				console.log('移除isSocketOpensuccess');
			}
		});
		clearTimeout(this.timer);
		clearTimeout(this.timeoutObj);
	}

	//心跳检测
	start() {
		clearTimeout(this.timeoutObj);
		this.timeoutObj = setTimeout(() => {
			let obj = {
				type: 'ping'
			};
			let objStr = JSON.stringify(obj)
			uni.sendSocketMessage({
				data: objStr,
			});
			this.start()
		}, this.timout)
	}

	// 监听事件集
	initEventHandle() {
		// 监听打开
		uni.onSocketOpen(res => {
			uni.setStorageSync('isSocketOpen', true)
			console.log('连接接成功！');
			this.lockReconnect = true;
			this.isClose = false;
			this.start()
		});

		// 监听消息
		this.onMsg()

		// 监听错误
		uni.onSocketError(err => {
			console.log('连接错误', err);
			uni.closeSocket();
		});

		// 监听关闭
		uni.onSocketClose(res => {
			console.log('关闭链接');
			this.isClose = true;
			if (uni.getStorageSync('isSocketOpen')) {
				this.lockReconnect = false
				this.reconnect()
			}


		});
	}

	// 重连
	reconnect() {
		if (this.lockReconnect) return;
		clearTimeout(this.timer)
		if (this.limit < 12) {
			this.timer = setTimeout(() => {
				console.log('重连中', this.limit);
				this.init();
				this.reconnect()
			}, 5000);
			this.limit += 1
		}
	}


}
