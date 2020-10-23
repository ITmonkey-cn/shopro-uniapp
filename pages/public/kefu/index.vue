<!-- 客服 -->
<template>
	<view class="chat-wrap">
		<cu-custom bgColor="bg-gradual-purple" :isBack="true"><block slot="backText">客服人员为您服务</block></cu-custom>
		<u-notice-bar :autoplay="true" close-icon @close="closeNotice" :show="showNotice" type="warning" :list="noticeList" :volumeIcon="true" :isCircular="true"></u-notice-bar>
		<scroll-view class="scroll-box chat-wrap" scroll-y="true" :scroll-with-animation="true" :enable-back-to-top="true" :show-scrollbar="false">
			<view class="cu-chat">
				<block v-for="(chat, index) in chatList" :key="index">
					<!-- 自己  -->
					<view class="cu-item" :class="{ self: chat.identify === 'user' }" v-if="chat.message.message_type === 'text'">
						<view class="main">
							<view class="content bg-gradual-purple shadow"><u-parse :html="chat.message.message"></u-parse></view>
						</view>
						<view class="cu-avatar round" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big107000.jpg);"></view>
					</view>
					<!-- 自己-订单-->
					<view class="cu-item" :class="{ self: chat.identify === 'user' }" v-if="chat.message.message_type === 'order'">
						<view class="main">
							<view class="content shadow">
								<view class="order-chat">
									<view class="order-code mb20">订单编号：25689456336</view>
									<view class="goods-card x-f">
										<view class="img-wrap"><image class="goods-img" src="/static/imgs/app_icon/icon1.png" mode=""></image></view>
										<view class="y-bc card-right">
											<view class="goods-title more-t">Stradivarius 秋冬新款女士短款机车风夹克外套2019潮08820199004</view>

											<view class="x-bc price-box">
												<view class="goods-price">339.90</view>
												<text class="goods-state">待发货</text>
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
						<view class="cu-avatar round" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big107000.jpg);"></view>
					</view>
					<!-- 自己-商品 -->
					<view class="cu-item" :class="{ self: chat.identify === 'user' }" v-if="chat.message.message_type === 'goods'">
						<view class="main">
							<view class="content shadow">
								<view class="goods-card x-f">
									<view class="img-wrap"><image class="goods-img" src="/static/imgs/app_icon/icon1.png" mode=""></image></view>
									<view class="y-bc card-right">
										<view class="goods-title more-t">Stradivarius 秋冬新款女士短款机车风夹克外套2019潮08820199004</view>
										<view class="x-bc price-box">
											<view class="goods-price">339.90</view>
											<text></text>
										</view>
									</view>
								</view>
							</view>
						</view>
						<view class="cu-avatar round" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big107000.jpg);"></view>
					</view>

					<!-- 时间 -->
					<view class="cu-info">11:59</view>
					<!-- 客服 -->
					<view class="cu-item" :class="{ self: chat.identify === 'customer_service' }" v-if="chat.identify === 'customer_service'">
						<view class="cu-avatar round" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big143004.jpg);"></view>
						<view class="main">
							<view class="content shadow"><text>喵喵喵！喵喵喵！</text></view>
						</view>
					</view>
				</block>
			</view>
		</scroll-view>
		<!-- 底部功能栏，输入栏 -->
		<view class="cu-bar foot input y-f" :style="[{ bottom: InputBottom + 'px' }]">
			<!-- 输入栏 -->
			<view class="cu-bar flex-sub" style="width: 100%;">
				<view class="input-wrap x-f">
					<input v-model="msgText" :adjust-position="false" :focus="false" maxlength="300" cursor-spacing="10" @focus="InputFocus" @blur="InputBlur" @input="onInput" />
					<view class="action"><text class="cuIcon-emoji text-grey"></text></view>
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
					:action="`${this.$API_URL}/index/upload`"
					maxCount="9"
					:customBtn="true"
					class="flex-sub tools-item"
				>
					<view class="tools-item flex-sub" slot="addBtn">
						<image class="item-img" src="/static/imgs/chat/imgs_icon.png" mode=""></image>
						<text class="item-title">图片</text>
					</view>
				</u-upload>

				<view class="tools-item flex-sub" @tap="onToolItem('goods')">
					<image class="item-img" src="/static/imgs/chat/goods_icon.png" mode=""></image>
					<text class="item-title">商品</text>
				</view>
				<view class="tools-item flex-sub" @tap="onToolItem('order')">
					<image class="item-img" src="/static/imgs/chat/order_icon.png" mode=""></image>
					<text class="item-title">订单</text>
				</view>
			</view>
		</view>

		<!-- 商品/订单 -->
		<view class="cu-bar log-box foot input y-f" v-if="showLogBox" :style="[{ bottom: InputBottom + 'px' }]">
			<view class="log-head x-bc">
				<view class="title-box">{{ logTitle }}</view>
				<button class="cu-btn close-btn" @tap="closeToolsItem"><text class="cuIcon-roundclosefill"></text></button>
			</view>
			<view class="log-content">
				<view class="log-item" v-for="item in 6" :key="item">
					<view class="code-box x-bc">
						<view class="code-text">订单编号：25689456336</view>
						<view class="date-text">10-19 10:55</view>
					</view>
					<view class="x-f log-card">
						<view class="img-wrap"><image class="goods-img" src="/static/imgs/app_icon/icon1.png" mode=""></image></view>
						<view class="y-bc card-right">
							<view class="goods-title more-t">Stradivarius 秋冬新款女士短款机车风夹克外套2019潮08820199004</view>
							<view class="num-box">数量：2</view>
							<view class="x-bc price-box">
								<view class="goods-price">339.90</view>
								<text class="goods-state">待发货</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 遮罩 -->
		<view class="cu-modal" @tap="onMask" :class="{ show: showTools }" style="z-index: 1000;"></view>
	</view>
</template>

<script>
let wsInitData = {
	//初始化数据
	url: 'ws://112.126.102.191:1818/',
	connection_id: 0,
	session_id: '',
	token: '87c0e696-e70a-484c-b53f-8f7ae044b5ce',
	identify: 'user',
	isSocketOpen: false
};
export default {
	data() {
		return {
			initMsg: {
				identify: 'user', // 用户发送的为 user; 客服发送的为 customer_service
				type: '', //message:用户消息类型; message_list:请求消息列表
				message: {
					// 发送的消息   type 为 message 的时候必填
					message_type: 'text', // 消息类型 text image 等
					message: '' // 消息内容 文本，或者图片地址，或者商品 json 对象
				},
				data: {
					// 额外参数，分页页码，分页条数等
					page: 1, //默认
					per_page: 10, //分页条数
					last_id: 0 //第一页第一条的Id
				}
			},
			chatList: [
				// {
				// identify: 'user', // 用户发送的为 user; 客服发送的为 customer_service
				// type: '', //message:用户消息类型; message_list:请求消息列表
				// message: {
				// 	// 发送的消息   type 为 message 的时候必填
				// 	message_type: 'text', // 消息类型 text image 等
				// 	message: '' // 消息内容 文本，或者图片地址，或者商品 json 对象
				// }
				// }
			],
			InputBottom: 0,
			msgText: '',
			isFocus: false, //获取焦点
			showNotice: true, //滚动提示
			showTools: false, //工具栏显示
			showLogBox: false, //商品记录栏
			logTitle: '',
			toolsList: [
				//工具栏列表
				{
					id: 'imgs',
					image: '/static/imgs/chat/imgs_icon.png',
					title: '图片'
				},
				{
					id: 'goods',
					image: '/static/imgs/chat/goods_icon.png',
					title: '商品'
				},
				{
					id: 'order',
					image: '/static/imgs/chat/order_icon.png',
					title: '订单'
				},
				{
					id: 'file',
					image: '/static/imgs/chat/file_icon.png',
					title: '文件'
				}
			],
			noticeList: ['欢迎光临linda小店，为庆祝新店开业', '欢迎光临linda小店，为庆祝新店开业', '欢迎光临linda小店，为庆祝新店开业']
		};
	},
	onLoad() {
		this.init();
	},
	methods: {
		// 获取焦点
		InputFocus(e) {
			this.InputBottom = e.detail.height;
		},
		// 失去焦点
		InputBlur(e) {
			this.InputBottom = 0;
		},
		// 输入
		onInput() {
			this.msgText ? (this.isFocus = true) : (this.isFocus = false);
		},
		// 点击工具栏开关
		onTools() {
			this.showTools = !this.showTools;
		},
		// 工具栏功能项
		onToolItem(id) {
			let map = new Map();
			map.set('order', () => {
				this.logTitle = '我的订单';
				this.showLogBox = true;
			});
			map.set('goods', () => {
				this.logTitle = '我的浏览';
				this.showLogBox = true;
			});
			map.set('imgs', this.chooseImg);

			map.get(id)();
		},
		// 关闭工具栏项
		closeToolsItem() {
			this.showLogBox = false;
		},

		// 发送图片
		uploadSuccess(e) {
			console.log('图片上传成功', e);
		},

		// 点击遮罩
		onMask() {
			this.showTools = false;
			this.showLogBox = false;
		},

		//关闭滚动提示
		closeNotice() {
			this.showNotice = false;
		},

		// 发送消息
		async onSend() {
			let res = await this.sendWsMsg();
			console.log(res);
		},

		// 初始化
		async init() {
			await this.connectWs();
			await this.openWs();
			await this.errWs();
			await this.onWsMsg();
		},

		// 创建ws
		async connectWs() {
			let [error, res] = await uni.connectSocket({ url: `${wsInitData.url}?identify=${wsInitData.identify}&token=${wsInitData.token}&session_id=${wsInitData.session_id}` });
		},

		//连接ws
		openWs() {
			let that = this;
			uni.onSocketOpen(function(res) {
				wsInitData.isSocketOpen = true;
				console.log(res);
				console.log('连接接成功！');
			});
		},

		//连接错误
		errWs() {
			uni.onSocketError(err => {
				console.log('连接错误', err);
			});
		},

		// 发送消息
		async sendWsMsg() {
			let msg = {
				identify: 'user', // 用户发送的为 user; 客服发送的为 customer_service
				type: 'message', //message:用户消息类型; message_list:请求消息列表
				message: {
					// 发送的消息   type 为 message 的时候必填
					message_type: 'text', // 消息类型 text image 等
					message: this.msgText // 消息内容 文本，或者图片地址，或者商品 json 对象
				},
				data: {
					// 额外参数，分页页码，分页条数等
					page: 1, //默认
					per_page: 10, //分页条数
					last_id: 0 //第一页第一条的Id
				}
			};
			let strMsg = JSON.stringify(msg);
			if (wsInitData.isSocketOpen) {
				let [error, res] = await uni.sendSocketMessage({
					data: strMsg
				});
				if (res.errMsg === 'sendSocketMessage:ok') {
					this.chatList.push(msg);
				}
				return Promise.resolve(res);
			}
		},

		// 监听消息
		onWsMsg() {
			uni.onSocketMessage(res => {
				console.log('收到服务器内容：' + res.data);
			});
		},

		// 关闭连接
		closeWs() {
			wsInitData.isSocketOpen && uni.closeSocket();
		},

		// 监听关闭
		onCloseWs() {
			uni.onSocketClose(res => {
				wsInitData.isSocketOpen = false;
				console.log('WebSocket 已关闭！');
			});
		}
	}
};
</script>

<style lang="scss">
// 重置样式
.chat-wrap {
	padding-bottom: 100rpx;
	height: 100%;
	overflow-y: hidden;
	.cu-chat {
		.cu-info {
			border-radius: 26rpx;
			background: rgba(#000, 0.1);
			padding: 6rpx 20rpx;
		}
		.main {
			margin: 0 20rpx;
			max-width: calc(100% - 100px);
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
			font-size: 26rpx;
			font-weight: 500;
			color: #333333;
			line-height: 32rpx;
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
		font-weight: 400;
		color: #999999;
		border-bottom: 1rpx solid rgba(#dfdfdf, 0.5);
		padding: 0 18rpx 10rpx;
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
		overflow-y: auto;
		.log-item {
			width: 690rpx;
			background-color: #fff;
			margin: 20rpx;
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
</style>
