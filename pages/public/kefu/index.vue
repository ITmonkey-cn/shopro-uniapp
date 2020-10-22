<template>
	<view class="chat-wrap">
		<cu-custom bgColor="bg-gradual-purple" :isBack="true"><block slot="backText">客服人员为您服务</block></cu-custom>
		<scroll-view scroll-y="true" :scroll-with-animation="true" :enable-back-to-top="true" :show-scrollbar="false">
			<view class="cu-chat">
				<!-- 自己 -->
				<view class="cu-item self">
					<view class="main">
						<view class="content bg-gradual-purple shadow"><text>喵喵喵！喵喵喵！喵喵喵！喵喵！喵喵！！喵！喵喵喵！</text></view>
					</view>
					<view class="cu-avatar round" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big107000.jpg);"></view>
				</view>
				<!-- 自己-订单-->
				<view class="cu-item self">
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
				<view class="cu-item self">
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
				<view class="cu-item">
					<view class="cu-avatar round" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big143004.jpg);"></view>
					<view class="main">
						<view class="content shadow"><text>喵喵喵！喵喵喵！</text></view>
					</view>
				</view>
			</view>
		</scroll-view>
		<!-- 底部功能栏，输入栏 -->
		<view class="cu-bar foot input y-f" :style="[{ bottom: InputBottom + 'px' }]">
			<!-- 输入栏 -->
			<view class="cu-bar flex-sub" style="width: 100%;">
				<view class="input-wrap x-f">
					<input v-model="msgText" :adjust-position="false" :focus="false" maxlength="300" cursor-spacing="10" @focus="InputFocus" @blur="InputBlur" />
					<view class="action"><text class="cuIcon-emoji text-grey"></text></view>
				</view>
				<button v-if="isFocus" class="cu-btn send-btn shadow" @tap="onSend">发送</button>
				<button v-else class="cu-btn more-btn" @tap="onTools">
					<view class="action" style="margin-right: 0;" :class="'tools-active'"><text class="cuIcon-roundaddfill text-grey"></text></view>
				</button>
			</view>
			<!-- 工具栏 -->
			<view class="tools-box x-f" style="width: 100%;">
				<view class="tools-item flex-sub" v-for="item in toolsList" :key="item.id">
					<image class="item-img" :src="item.image" mode=""></image>
					<text class="item-title">{{ item.title }}</text>
				</view>
			</view>
		</view>
		<!-- 遮罩 -->
		<view class="cu-modal show" style="z-index: 1000;"></view>
	</view>
</template>

<script>
let wsInitData = {
	//初始化数据
	url: 'ws://112.126.102.191:1818/',
	connection_id: 0,
	session_id: 'asdf123456',
	token: '87c0e696-e70a-484c-b53f-8f7ae044b5ce',
	identify: 'user',
	isSocketOpen: false
};
export default {
	data() {
		return {
			InputBottom: 0,
			msgText: '',
			isFocus: false,
			toolsList: [
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
			]
		};
	},
	onLoad() {
		// this.init()
	},
	methods: {
		// 获取焦点
		InputFocus(e) {
			this.isFocus = true;
			this.InputBottom = e.detail.height;
		},
		// 失去焦点
		InputBlur(e) {
			this.isFocus = false;
			this.InputBottom = 0;
		},

		// 点击工具栏
		onTools() {},

		// 发送消息
		onSend() {
			console.log(this.msgText);
			this.sendWsMsg(this.msgText);
		},

		// 初始化
		async init() {
			await this.connectWs();
			await this.openWs();
			await this.errWs();
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
		async sendWsMsg(msg) {
			if (wsInitData.isSocketOpen) {
				let [error, res] = await uni.sendSocketMessage({
					data: msg
				});
				console.log('senderror', error);
				console.log('sendres', res);
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
		}
	}
}
// 工具栏
.tools-box {
	background-color: #fff;
	height: 310rpx;
	border-top: 1rpx solid #f6f6f6;
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
</style>
