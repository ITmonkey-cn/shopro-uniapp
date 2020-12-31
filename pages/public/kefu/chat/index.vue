<!-- 客服 -->
<template>
	<view class="chat-wrap">
		<cu-custom bgColor="bg-gradual-purple" :isBack="true">
			<block slot="backText">
				<view class="x-f head-box x-f">
					<view class="head-title mr20">{{ navTitle.split(',')[0] }}</view>
					<view v-if="navTitle.split(',')[1] === '在线'" class="x-f">
						<view class="cuIcon-title text-green head-icon"></view>
						<view class="head-state">在线</view>
					</view>
					<view v-if="navTitle.split(',')[1] === '离线'" class="x-f">
						<view class="cuIcon-title text-gray head-icon"></view>
						<view class="head-state">离线</view>
					</view>
				</view>
			</block>
		</cu-custom>
		<u-notice-bar
			:autoplay="true"
			close-icon
			@close="closeNotice"
			:show="showNotice"
			:type="noticeType"
			:list="noticeList"
			:volumeIcon="true"
			:isCircular="true"
		></u-notice-bar>
		<scroll-view class="scroll-box" scroll-y="true" :scroll-with-animation="false" :enable-back-to-top="true" :show-scrollbar="false" :scroll-into-view="scrollInto">
			<u-loadmore v-if="logmsgList.length" :status="logStatus" :loadText="loadText" icon-type="circle" @loadmore="logLoadmore" />

			<view class="cu-chat">
				<block v-for="(chat, index) in chatList" :key="index">
					<!-- 系统消息-->
					<view class="cu-info" v-if="chat.type === 'system'">{{ chat.msg }}</view>
					<view class="cu-info" v-if="showTime(chat.date, index) && chat.type !== 'system' && chat.type !== 'template'">{{ $u.timeFrom(chat.date) }}</view>

					<view class="" v-if="chat.type !== 'system' && chat.type !== 'template'">
						<!-- 自己  -->
						<view class="cu-item" :class="{ self: chat.identify === 'user' }">
							<view v-if="chat.identify !== 'user'" class="cu-avatar round" :style="'background-image:url(' + chat.server_avatar + ')'"></view>
							<view class="main">
								<!-- 消息 -->
								<view class="content " style="max-width: 480rpx;" :class="chat.identify !== 'user' ? 'bg-white' : ' bg-gradual-purple'" v-if="chat.type === 'text'">
									<u-parse :html="chat.msg"></u-parse>
								</view>
								<!-- 订单 -->
								<view class="content " v-if="chat.type === 'order'" @tap="jump('/pages/order/detail', { id: chat.msg.id })">
									<view class="order-chat">
										<view class="order-code mb20">订单号：{{ chat.msg.order_sn }}</view>
										<view class="goods-card x-f">
											<view class="img-wrap"><image class="goods-img" :src="chat.msg.image" mode=""></image></view>
											<view class="y-bc card-right">
												<view class="goods-title more-t">{{ chat.msg.title }}</view>

												<view class="x-bc price-box">
													<view class="goods-price">{{ chat.msg.price }}</view>
													<text class="goods-state">{{ chat.msg.status_name }}</text>
												</view>
											</view>
										</view>
									</view>
								</view>
								<!-- 商品 -->
								<view class="content " v-if="chat.type === 'goods'" @tap="jump('/pages/goods/detail/index', { id: chat.msg.id })">
									<view class="goods-card x-f">
										<view class="img-wrap"><image class="goods-img" :src="chat.msg.image" mode=""></image></view>
										<view class="y-bc card-right">
											<view class="goods-title more-t">{{ chat.msg.title }}</view>
											<view class="x-bc price-box">
												<view class="goods-price">{{ chat.msg.price }}</view>
												<text></text>
											</view>
										</view>
									</view>
								</view>
							</view>
							<view v-if="chat.identify === 'user'" class="cu-avatar round" :style="'background-image:url(' + userInfo.avatar + ')'"></view>
						</view>
					</view>
					<!-- 模板消息 -->
					<view class="template-box" v-if="chat.type === 'template'">
						<view class="template-title">猜你想问</view>
						<view class="template-item" v-for="item in templateList" :key="item.id" @tap="onQuestion(item)">* {{ item.title }}</view>
					</view>
				</block>
			</view>
			<view class="scroll-bottom" style="height: 330rpx;" id="scrollBottom"></view>
		</scroll-view>
		<!-- 底部功能栏，输入栏 -->
		<view class="cu-bar foot input y-f">
			<!-- 输入栏 -->
			<view class="cu-bar flex-sub" style="width: 100%;">
				<view class="input-wrap x-f">
					<input
						v-model="msgText"
						placeholder-style="font-size:26rpx;color:#999"
						placeholder="请输入您想咨询的问题~"
						type="text"
						confirm-type="发送"
						:focus="false"
						maxlength="300"
						cursor-spacing="10"
						@focus="InputFocus"
						@blur="InputBlur"
						@input="onInput"
						@confirm="onSend"
					/>
					<view class="action" @tap="selEmoji"><text class="cuIcon-emoji text-grey"></text></view>
				</view>
				<button v-if="isFocus" class="cu-btn send-btn shadow" @tap.stop="onSend">发送</button>
				<button v-else class="cu-btn more-btn" @tap.stop="onTools">
					<view class="action" style="margin-right: 0;"><text class="cuIcon-roundaddfill text-grey" :class="{ 'tools-active': showTools }"></text></view>
				</button>
			</view>
			<!-- 工具栏 -->
			<view class="tools-box x-f" style="width: 100%;" v-if="showTools">
				<u-upload
					:showProgress="false"
					:showUploadList="false"
					@on-uploaded="uploadSuccess"
					@on-change="uploadChange"
					:action="`${HTTP_API_URL}/index/upload`"
					maxCount="9"
					:customBtn="true"
					:show-tips="false"
					class="flex-sub tools-item"
				>
					<view class="tools-item flex-sub" slot="addBtn">
						<image class="item-img" :src="$IMG_URL + '/imgs/chat/imgs_icon.png'" mode=""></image>
						<text class="item-title">图片</text>
					</view>
				</u-upload>

				<view class="tools-item flex-sub" @tap="onToolItem('goods')">
					<image class="item-img" :src="$IMG_URL + '/imgs/chat/goods_icon.png'" mode=""></image>
					<text class="item-title">商品</text>
				</view>
				<view class="tools-item flex-sub" @tap="onToolItem('order')">
					<image class="item-img" :src="$IMG_URL + '/imgs/chat/order_icon.png'" mode=""></image>
					<text class="item-title">订单</text>
				</view>
			</view>
			<!-- 表情栏 -->
			<view class="emoji-box" v-if="showEmoji">
				<swiper
					class="emoji-swiper"
					:indicator-dots="true"
					circular
					indicator-active-color="#7063D2"
					indicator-color="rgba(235, 231, 255, 1)"
					:autoplay="false"
					:interval="3000"
					:duration="1000"
				>
					<swiper-item v-for="(memoji, index) in newEmojiList">
						<view class="swiper-item x-f">
							<view class="emoji-img" v-for="(memo, mindex) in memoji" @tap="onEmoji(memo)">
								<image class="emoji-img" :src="`${EMOJI_BASE_URL}/assets/addons/shopro/img/emoji/${memo.file}`" mode=""></image>
							</view>
						</view>
					</swiper-item>
				</swiper>
			</view>
		</view>

		<!-- 商品/订单 -->
		<view class="cu-bar log-box foot input y-f" v-if="showLogBox">
			<view class="log-head x-bc">
				<view class="title-box">{{ logTitle }}</view>
				<button class="cu-btn close-btn" @tap="closeToolsItem"><text class="cuIcon-roundclosefill"></text></button>
			</view>
			<view class="log-content">
				<scroll-view class="card-scroll-box" scroll-y="true" :scroll-with-animation="true" :show-scrollbar="false" @scrolltolower="loadMore">
					<!-- 订单 -->
					<view class="log-item" v-for="(item, index) in orderList" :key="index" @tap="onOrderCard(item)" v-if="cardType === 'order'">
						<view class="code-box x-bc">
							<view class="code-text">订单号：{{ item.order_sn }}</view>
							<view class="date-text">{{ $u.timeFormat(item.createtime, 'mm-dd hh:MM') }}</view>
						</view>
						<view class="x-f log-card">
							<view class="img-wrap"><image class="goods-img" :src="item.item[0].goods_image" mode=""></image></view>
							<view class="y-bc card-right">
								<view class="goods-title more-t">{{ item.item[0].goods_title }}</view>
								<view class="num-box">数量：{{ item.item[0].goods_num }}</view>
								<view class="x-bc price-box">
									<view class="goods-price">{{ item.item[0].goods_price }}</view>
									<text class="goods-state">{{ item.status_name }}</text>
								</view>
							</view>
						</view>
					</view>
					<!-- 商品 -->
					<view class="log-item" v-for="(item, index) in viewList" :key="index" @tap="onViewCard(item)" v-if="cardType === 'goods'">
						<view class="x-f log-card">
							<view class="img-wrap"><image class="goods-img" :src="item.goods.image" mode=""></image></view>
							<view class="y-bc card-right">
								<view class="goods-title more-t">{{ item.goods.title }}</view>
								<view class="num-box">{{ item.goods.subtitle }}</view>
								<view class="x-bc price-box">
									<view class="goods-price">{{ item.goods.price }}</view>
									<text class="goods-state"></text>
								</view>
							</view>
						</view>
					</view>
					<u-loadmore height="80rpx" :status="loadStatus" icon-type="flower" color="#ccc" />
				</scroll-view>
			</view>
		</view>
		<!-- 遮罩 -->
		<view class="cu-modal" @tap="onMask" :class="{ show: showTools || showEmoji }" style="z-index: 1000;"></view>
	</view>
</template>

<script>
import Socket from './chat.js';
import { BASE_URL, API_URL } from '@/env.js';
import { mapMutations, mapActions, mapState } from 'vuex';
export default {
	data() {
		return {
			socket: null, //socket服务
			InputBottom: 0,
			isPageHide: false,
			HTTP_API_URL: API_URL,
			EMOJI_BASE_URL: BASE_URL,
			navTitle: '连接中...', //标题栏
			scrollInto: '', //scrollBottom
			lastId: '', //加载历史聊天记录用
			logmsgList: [], //历史消息
			templateList: [], //模板问题。
			emojiList: [], //表情包
			newEmojiList: [], //分层后的表情数据
			loadText: {
				loadmore: '点击加载更多',
				loading: '正在加载，请喝杯茶...',
				nomore: '我也是有底线的'
			},
			logStatus: 'loadmore',
			cardType: '', //卡片分类
			currentPage: 1,
			lastPage: 1,
			chatList: [
				// identify: 'customer_service', // 用户发送的为 user; 客服发送的为 customer_service
				// type: 'text', //message:用户消息类型; message_list:请求消息列表
				// msg: message.message,
				// date: this.$u.date(message.createtime, 'yyyy年mm月dd日 hh时MM分')
			],
			msgText: '', //输入框内容
			showNotice: true, //滚动提示
			noticeType: 'warning',
			showTools: false, //工具栏显示
			showLogBox: false, //商品订单栏
			showEmoji: false, //表情显示
			logTitle: '', //；栏目标题
			toolsList: [
				//工具栏列表
				{
					id: 'imgs',
					image: this.$IMG_URL + '/imgs/chat/imgs_icon.png',
					title: '图片'
				},
				{
					id: 'goods',
					image: this.$IMG_URL + '/imgs/chat/goods_icon.png',
					title: '商品'
				},
				{
					id: 'order',
					image: this.$IMG_URL + '/imgs/chat/order_icon.png',
					title: '订单'
				},
				{
					id: 'file',
					image: this.$IMG_URL + '/imgs/chat/file_icon.png',
					title: '文件'
				}
			],
			noticeList: [], //跑马灯提示。
			// 订单商品,分页。
			loadStatus: 'loadmore', //loadmore-加载前的状态，loading-加载中的状态，nomore-没有更多的状态
			orderList: [],
			viewList: [],
			orderCurrentPage: 1,
			viewCurrentPage: 1,
			orderTotalPage: 1,
			viewTotalPage: 1
		};
	},
	computed: {
		isFocus() {
			//检测输入框是否有信息
			let isMsg = false;
			this.msgText ? (isMsg = true) : (isMsg = false);
			return isMsg;
		},
		isClose() {
			if (this.socket) {
				return this.socket.isClose;
			}
		},
		...mapState({
			userInfo: state => state.user.userInfo //用户数据
		})
	},
	created() {
		this.init();
	},
	onShow() {
		// #ifdef MP-WEIXIN
		this.init();
		this.isPageHide = true;
		// #endif
	},
	onHide() {
		// #ifdef MP-WEIXIN
		if (this.isPageHide) {
			this.socket.close();
		}
		// #endif
		uni.hideKeyboard();
	},
	beforeDestroy() {
		this.socket.close();
	},
	methods: {
		init() {
			let that = this;
			that.$api('chat.init').then(res => {
				if (res.code == 1) {
					that.noticeList.push(res.data.config.basic.notice);
					that.templateList = res.data.question;
					that.emojiList = res.data.emoji;
					that.newEmojiList = this.sortData(res.data.emoji, 30);
					that.socket = new Socket(
						{
							ping: 20000,
							is_ssl: res.data.config.system.is_ssl,
							gateway_port: res.data.config.system.gateway_port
						},
						msg => {
							that.parseMsgStatus(msg.data); //监听消息
						}
					);
				}
			});
		},

		// 数据分层
		sortData(oArr, length) {
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

		// 时间显示
		showTime(timestamp, index) {
			timestamp = parseInt(timestamp);
			// 判断用户输入的时间戳是秒还是毫秒,一般前端js获取的时间戳是毫秒(13位),后端传过来的为秒(10位)
			if (timestamp.toString().length == 10) timestamp *= 1000;
			let timer = new Date().getTime() - timestamp;
			timer = parseInt(timer / 1000);

			if (index % 6 == 0 && timer >= 300) {
				return true;
			}
		},

		jump(path, parmas) {
			this.$Router.push({
				path: path,
				query: parmas
			});
		},

		// 解析链接状态
		parseMsgStatus(msgStr) {
			let obj = JSON.parse(msgStr);
			if (obj.code === 1) {
				switch (obj.type) {
					case 'init':
						this.navTitle = '连接成功...';
						uni.setStorageSync('chatSessionId', obj.data.session_id);
						this.chatLog().then(this.pushChat('', 'template'));
						this.goBottom();
						break;
					case 'waiting':
						this.navTitle = '等待客服接入...';
						this.pushChat(obj.data.message.message, 'system');
						break;
					case 'access':
						this.navTitle = `客服-${obj.data.customer_service.name},在线`;
						this.pushChat(obj.data.message.message, 'system');
						break;
					case 'customer_service_online':
						this.navTitle = `客服-${obj.data.customer_service.name},在线`;
						break;
					case 'customer_service_offline':
						this.navTitle = `客服-${obj.data.customer_service.name},离线`;
						break;
					case 'message':
						this.navTitle = `客服-${obj.data.customer_service.name},在线`;
						this.chatList.push(this.parseMsg(obj.data.message, obj.data.message.identify));
						this.goBottom();
						break;
					case 'message_list':
						let msgList = obj.data.message_list.data;
						this.logmsgList = obj.data.message_list.data;
						this.lastId = msgList[0]?.id;
						this.lastPage = obj.data.message_list.last_page;
						msgList.forEach(item => {
							this.chatList.unshift(this.parseMsg(item, item.identify));
						});

						break;
					default:
				}
			} else {
				this.$tools.toast('连接错误，正在重试~');
			}
		},

		// 解析消息类型,接受数据时才用，发送数据时不用。
		parseMsg(message, identify) {
			let obj = null;
			switch (message.message_type) {
				case 'system':
					obj = {
						identify: 'customer_service', // 用户发送的为 user; 客服发送的为 customer_service
						type: 'system', //message:用户消息类型; message_list:请求消息列表
						msg: message.message
					};
					break;
				case 'image':
					obj = {
						identify: message.sender_identify, // 用户发送的为 user; 客服发送的为 customer_service
						type: 'text', //message:用户消息类型; message_list:请求消息列表
						msg: `<img class="chat-img" src="${message.message}"/>`,
						server_avatar: identify?.avatar,
						date: message.createtime
					};
					break;
				case 'goods':
					obj = {
						identify: message.sender_identify, // 用户发送的为 user; 客服发送的为 customer_service
						type: message.message_type, //message:用户消息类型; message_list:请求消息列表
						msg: JSON.parse(message.message),
						server_avatar: identify?.avatar,
						date: message.createtime
					};
					break;
				case 'order':
					obj = {
						identify: message.sender_identify, // 用户发送的为 user; 客服发送的为 customer_service
						type: message.message_type, //message:用户消息类型; message_list:请求消息列表
						msg: JSON.parse(message.message),
						server_avatar: identify?.avatar,
						date: message.createtime
					};
					break;
				case 'text':
					obj = {
						identify: message.sender_identify, // 用户发送的为 user; 客服发送的为 customer_service
						type: message.message_type, //message:用户消息类型; message_list:请求消息列表
						msg: this.replaceEmoji(message.message),
						server_avatar: identify?.avatar,
						date: message.createtime
					};
					break;
				default:
					break;
			}
			return obj;
		},

		// 获取历史聊天记录
		async chatLog() {
			let msg = {
				identify: 'user', // 用户发送的为 user; 客服发送的为 customer_service
				type: 'message_list', //message:用户消息类型; message_list:请求消息列表
				data: {
					// 额外参数，分页页码，分页条数等
					page: this.currentPage, //默认
					last_id: this.lastId //第一页第一条的Id
				}
			};
			this.logStatus = 'loading';
			let strMsg = JSON.stringify(msg);
			let res = await this.socket.send(strMsg);
			if (res && res.errMsg === 'sendSocketMessage:ok') {
				setTimeout(() => {
					this.logStatus = 'loadmore';
				}, 300);
			}
		},

		// 获取焦点
		InputFocus(e) {
			this.onMask();
		},
		// 失去焦点
		InputBlur(e) {
			this.InputBottom = 0;
		},
		// 输入
		onInput(e) {},

		// 滚动到顶部
		logLoadmore() {
			if (this.currentPage < this.lastPage) {
				this.currentPage += 1;
				this.chatLog();
			} else {
				this.logStatus = 'nomore';
			}
		},

		// 点击工具栏开关
		onTools() {
			if (this.isClose) {
				this.$tools.toast('您已掉线！请返回重试');
				this.noticeType = 'error';
				this.noticeList = ['您已掉线！请返回重试'];
				return;
			}
			this.showEmoji = false;
			this.showTools = !this.showTools;
		},
		// 工具栏功能项
		onToolItem(type) {
			this.cardType = type;
			let map = new Map();
			map.set('order', () => {
				this.logTitle = '我的订单';
				this.showLogBox = true;
				this.getOrderList();
			});
			map.set('goods', () => {
				this.logTitle = '我的浏览';
				this.showLogBox = true;
				this.getbrowseList();
			});
			map.set('imgs', this.chooseImg);

			map.get(type)();
		},
		// 点击商品卡片
		onViewCard(goods) {
			let goodsData = {
				id: goods.goods.id,
				title: goods.goods.title,
				price: goods.goods.price,
				image: goods.goods.image
			};
			let goodsStr = JSON.stringify(goodsData);
			this.sendWs(goodsStr, 'goods');
			this.pushChat(goodsData, 'goods');
			this.onMask();
		},
		onOrderCard(order) {
			let orderData = {
				id: order.id,
				title: order.item[0].goods_title,
				price: order.item[0].goods_price,
				num: order.item[0].goods_num,
				order_sn: order.order_sn,
				image: order.item[0].goods_image,
				status_name: order.status_name
			};
			let orderStr = JSON.stringify(orderData);
			this.sendWs(orderStr, 'order');
			this.pushChat(orderData, 'order');
			this.onMask();
		},
		// 关闭工具栏项
		closeToolsItem() {
			this.showLogBox = false;
		},

		// 选择表情
		selEmoji() {
			this.showTools = false;
			this.showLogBox = false;
			this.showEmoji = !this.showEmoji;
		},
		// 点击表情
		onEmoji(item) {
			this.msgText += item.name;
		},

		// 点击遮罩
		onMask() {
			this.showTools = false;
			this.showLogBox = false;
			this.showEmoji = false;
		},

		//关闭滚动提示
		closeNotice() {
			this.showNotice = false;
		},

		// 滚动底部
		goBottom() {
			let timeout = null;
			this.scrollInto = '';
			clearTimeout(timeout);
			timeout = setTimeout(() => {
				this.scrollInto = 'scrollBottom';
			}, 300);
		},

		// 发送图片
		uploadSuccess(list) {
			list.forEach(item => {
				this.sendWs(item.response.data.url, 'image');
				console.log(item);
				this.pushChat(`<img class="chat-img" src="${item.response.data.full_url}"/>`);
				this.onMask();
			});
		},
		uploadChange(e) {
			// console.log('上传回调', e);
		},

		// 发送问题
		async onQuestion(question) {
			this.pushChat(question.title);
			let msg = {
				identify: 'user', // 用户发送的为 user; 客服发送的为 customer_service
				type: 'message', //message:用户消息类型; message_list:请求消息列表
				message: {
					// 发送的消息   type 为 message 的时候必填
					message_type: 'text', // 消息类型 text image 等
					message: question.title // 消息内容 文本，或者图片地址，或者商品 json 对象
				},
				data: {
					question_id: question.id
				}
			};
			let strMsg = JSON.stringify(msg);
			let res = await this.socket.send(strMsg);
		},

		// 发送消息
		onSend() {
			if (!this.msgText) {
				this.sendWs(this.msgText);
				this.pushChat(this.msgText);
				this.msgText = '';
			}
			this.showEmoji && this.onMask();
		},

		// 发送服务数据
		async sendWs(data, type = 'text') {
			let msg = {
				identify: 'user', // 用户发送的为 user; 客服发送的为 customer_service
				type: 'message', //message:用户消息类型; message_list:请求消息列表
				message: {
					// 发送的消息   type 为 message 的时候必填
					message_type: type, // 消息类型 text image 等
					message: data // 消息内容 文本，或者图片地址，或者商品 json 对象
				}
			};
			let strMsg = JSON.stringify(msg);
			let res = await this.socket.send(strMsg);
		},

		// 发送本地数据。
		pushChat(data, type = 'text') {
			if (this.isClose) {
				this.$tools.toast('您已掉线！请返回重试');
				this.noticeType = 'error';
				this.noticeList = ['您已掉线！请返回重试'];
				return;
			}
			this.chatList.push({
				identify: 'user',
				type: type,
				msg: this.replaceEmoji(data),
				date: new Date().getTime()
			});
			this.goBottom();
		},

		// 表情地址
		selEmojiFile(name) {
			for (let index in this.emojiList) {
				if (this.emojiList[index].name === name) {
					return this.emojiList[index].file;
				}
			}
			return false;
		},
		// 替换表情
		replaceEmoji(data) {
			let newData = data;
			if (typeof newData !== 'object') {
				let reg = /\[(.+?)\]/g; // [] 中括号
				let zhEmojiName = newData.match(reg);
				if (zhEmojiName) {
					zhEmojiName.forEach(item => {
						let emojiFile = this.selEmojiFile(item);
						newData = newData.replace(
							item,
							`<img class="chat-img" style="width:50rpx;height:50rpx;margin:0 6rpx" src="${this.EMOJI_BASE_URL}/assets/addons/shopro/img/emoji/${emojiFile}"/>`
						);
					});
				}
			}
			return newData;
		},

		// 加载更多
		loadMore() {
			if (this.cardType === 'goods') {
				if (this.viewCurrentPage < this.viewTotalPage) {
					this.viewCurrentPage += 1;
					this.getbrowseList();
				}
			}
			if (this.cardType === 'order') {
				if (this.orderCurrentPage < this.orderTotalPage) {
					this.orderCurrentPage += 1;
					this.getOrderList();
				}
			}
		},

		// 订单列表
		getOrderList() {
			let that = this;
			that.isLoading = true;
			that.loadStatus = 'loading';
			that.$api('order.index', {
				type: 'all',
				page: that.orderCurrentPage
			}).then(res => {
				if (res.code === 1) {
					that.isLoading = false;
					that.orderList = [...that.orderList, ...res.data.data];
					that.orderTotalPage = res.data.last_page;
					if (that.orderCurrentPage < res.data.last_page) {
						that.loadStatus = 'loadmore';
					} else {
						that.loadStatus = 'nomore';
					}
				}
			});
		},

		// 历史记录
		getbrowseList() {
			let that = this;
			that.loadStatus = 'loading';
			that.$api('goods.viewList', {
				page: that.viewCurrentPage
			}).then(res => {
				if (res.code === 1) {
					that.viewList = [...that.viewList, ...res.data.data];
					that.viewTotalPage = res.data.last_page;
					if (that.viewCurrentPage < res.data.last_page) {
						that.loadStatus = 'loadmore';
					} else {
						that.loadStatus = 'nomore';
					}
				}
			});
		}
	}
};
</script>

<style lang="scss">
// 重置样式
page {
	overflow: hidden;
}
.cu-avatar {
	border: 1rpx solid #eeeeee;
}

// 标题栏
.head-box {
	.head-title {
		font-size: 38rpx;
		line-height: 38rpx;
	}
	.head-icon {
		font-size: 34rpx;
		line-height: 38rpx;
	}
	.head-state {
		font-size: 28rpx;
		line-height: 38rpx;
	}
}
// 模板消息
.template-box {
	width: 690rpx;
	background: #ffffff;
	border-radius: 10rpx;
	margin: 0 auto;
	padding: 20rpx 24rpx;
	.template-title {
		font-size: 26rpx;
		font-weight: bold;
		color: #333333;
		line-height: 36rpx;
		margin-bottom: 20rpx;
	}
	.template-item {
		font-size: 24rpx;
		font-weight: 500;
		color: #603fff;
		line-height: 46rpx;
	}
}
// 聊天框
.chat-wrap {
	height: 100%;
	overflow: hidden;
	.scroll-box {
		height: 100%;
	}
	.cu-chat {
		.cu-info {
			border-radius: 26rpx;
			background: rgba(#000, 0.1);
			padding: 6rpx 20rpx;
		}
		.main {
			margin: 0 20rpx;
			max-width: calc(100% - 80px);
		}
		.cu-item > .main .content {
			&::after {
				width: 0;
				height: 0;
			}
			&::before {
				width: 0;
				height: 0;
			}
		}
	}
}
// 底部
.foot {
	padding: 0 20rpx;
	.input-wrap {
		background: #f2f2f2;
		border-radius: 32rpx;
		flex: 1;
		margin-right: 20rpx;
	}
	.send-btn {
		padding: 0;
		width: 110rpx;
		height: 63rpx;
		background: linear-gradient(90deg, #a36fff, #5336ff);
		border-radius: 32rpx;
		color: #fff;
	}
	.more-btn {
		padding: 0;
		background: none;
		.cuIcon-roundaddfill {
			background: linear-gradient(90deg, #a36fff, #5336ff);
			-webkit-background-clip: text;
			color: transparent;
			transition: all linear 0.2s;
		}
		.tools-active {
			transform: rotate(45deg);
			transition: all linear 0.2s;
		}
	}
}
// 工具栏
.tools-box {
	background-color: #fff;
	height: 310rpx;
	border-top: 1rpx solid #f6f6f6;
	transition: all 0.3s ease-in-out 0s;
	.tools-item {
		align-items: center;
		justify-content: center;
		display: flex;
		flex-direction: column;
		.item-img {
			width: 70rpx;
			height: 70rpx;
			margin-bottom: 30rpx;
		}
		.item-tile {
			font-size: 24rpx;
			font-weight: 500;
			color: #333333;
		}
	}
}
// 商品卡片
.goods-card {
	width: 100%;
	.goods-img {
		width: 116rpx;
		height: 116rpx;
		margin-right: 20rpx;
	}
	.card-right {
		width: 330rpx;
		height: 116rpx;
		.goods-title {
			width: 330rpx;
			font-size: 26rpx;
			font-weight: 500;
			color: #333333;
			line-height: 32rpx;
			text-align: left;
		}

		.price-box {
			width: 100%;
			.goods-price {
				font-size: 26rpx;
				font-weight: 500;
				color: #333333;
				&::before {
					content: '￥';
					font-size: 20rpx;
				}
			}
			.goods-state {
				font-size: 24rpx;
				font-weight: 500;
				color: #603fff;
			}
		}
	}
}
// 订单卡片样式
.order-chat {
	width: 100%;
	.order-code {
		font-size: 24rpx;
		width: 100%;
		font-weight: 400;
		color: #999999;
		border-bottom: 1rpx solid rgba(#dfdfdf, 0.5);
		padding: 0 0rpx 10rpx;
	}
}

// 订单商品记录
.log-box {
	width: 750rpx;
	height: 600rpx;
	background: #f2f2f2;
	border-radius: 20rpx 20rpx 0px 0px;
	display: flex;
	flex-direction: column;
	.log-head {
		box-sizing: border-box;
		width: 750rpx;
		height: 94rpx;
		background: #ffffff;
		border-radius: 20rpx 20rpx 0px 0px;
		padding: 0 26rpx;
		.title-box {
			font-size: 30rpx;
			font-weight: 500;
			color: #333333;
			line-height: 90rpx;
			border-bottom: 4rpx solid #7063d2;
		}
		.close-btn {
			padding: 0;
			background: none;
			.cuIcon-roundclosefill {
				font-size: 40rpx;
				color: #e0e0e0;
			}
		}
	}
	.log-content {
		flex: 1;
		height: 100%;
		width: 100%;
		overflow: hidden;
		background: #f2f2f2;
		.card-scroll-box {
			height: 100%;
			width: 100%;
			background: #f2f2f2;
		}
		.log-item {
			width: 690rpx;
			margin: 20rpx;
			background-color: #fff;
			border-radius: 20rpx;
			.code-box {
				border-bottom: 1rpx solid rgba(#dfdfdf, 0.5);
				height: 76rpx;
				padding: 0 20rpx;
				.code-text,
				.date-text {
					font-size: 24rpx;
					font-weight: 400;
					color: #999999;
				}
			}
			.log-card {
				padding: 30rpx 20rpx;
			}
			.goods-img {
				width: 140rpx;
				height: 140rpx;
				margin-right: 20rpx;
			}
			.card-right {
				width: 500rpx;
				height: 140rpx;

				.goods-title {
					font-size: 26rpx;
					font-weight: 500;
					color: #333333;
					line-height: 32rpx;
					text-align: left;
					width: 500rpx;
				}
				.num-box {
					font-size: 24rpx;
					font-weight: 400;
					color: #999999;
					text-align: left;
					width: 100%;
				}
				.price-box {
					width: 100%;
					.goods-price {
						font-size: 26rpx;
						font-weight: 500;
						color: #333333;
						&::before {
							content: '￥';
							font-size: 20rpx;
						}
					}
					.goods-state {
						font-size: 24rpx;
						font-weight: 500;
						color: #603fff;
					}
				}
			}
		}
	}
}
// 表情栏
.emoji-box {
	width: 100%;
	background-color: #fff;
	height: 310rpx;
	border-top: 1rpx solid #f6f6f6;
	transition: all 0.3s ease-in-out 0s;
	padding: 20rpx 0;
	.emoji-swiper {
		height: 280rpx;
		.swiper-item {
			flex-wrap: wrap;
		}
	}
	.emoji-img {
		width: 50rpx;
		height: 50rpx;
		display: inline-block;
		margin: 10rpx;
	}
}
</style>
