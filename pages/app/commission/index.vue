<!-- 佣金中心 -->
<template>
	<view style="width:100%;height: 100%;">
		<view class="commission-wrap" :class="{ blur: !hasAuth }">
			<cu-custom isBack></cu-custom>
			<!-- 用户资料 -->
			<view class="user-card">
				<view class="card-top x-bc">
					<view class="x-f">
						<view class="head-img-box"><image class="head-img" :src="userInfo.avatar" mode=""></image></view>
						<view class="y-start">
							<view class="user-name">{{ userInfo.nickname }}</view>
							<view class="user-info-box x-f">
								<view class="grade-tag tag-box x-f" v-if="commissionLv">
									<image class="tag-img" :src="commissionLv.image" mode=""></image>
									<text class="tag-title">{{ commissionLv.name }}</text>
									<text class="cuIcon-right" v-if="showLv" style="color: #fff; font-size: 26rpx;"></text>
								</view>
							</view>
						</view>
					</view>
					<view class="y-start">
						<view class="y-f">
							<button class="cu-btn log-btn" @tap="jump('/pages/app/commission/commission-log')">明细</button>
							<button class="cu-btn look-btn" @tap="onEye">
								<text v-if="showMoney" class="cuIcon-attentionfill"></text>
								<text v-else class="cuIcon-attentionforbidfill"></text>
							</button>
						</view>
					</view>
				</view>
				<view class="card-bottom x-f" v-if="commissionWallet">
					<view class="flex-sub y-start">
						<view class="item-title">总收益</view>
						<view class="item-detail">{{ showMoney ? commissionWallet.total_income || '0.00' : '***' }}</view>
					</view>
					<view class="flex-sub y-start" style="align-items: center;">
						<view class="item-title">待入账佣金</view>
						<view class="item-detail">{{ showMoney ? commissionWallet.delay_money || '0.00' : '***' }}</view>
					</view>
					<view class="flex-sub y-start" style="align-items: flex-end;">
						<view class="item-title">我的消费</view>
						<view class="item-detail">{{ showMoney ? userInfo.total_consume || '0.00' : '***' }}</view>
					</view>
				</view>
			</view>

			<!-- 滚动明细 -->
			<view class="commission-log">
				<scroll-view scroll-y="true" @scrolltolower="loadMore" class="scroll-box log-scroll">
					<view class="log-item-box x-bc" v-for="item in commissionLog" :key="item.id">
						<view class="log-item-wrap">
							<view class="log-item x-f one-t">
								<view class="">
									<image
										class="log-img"
										:src="item.oper_type !== 'user' ? logMap[item.oper_type] : item.oper ? item.oper.avatar : logMap['admin']"
										mode=""
									></image>
								</view>
								<view class="log-text one-t">{{ item.remark }}</view>
							</view>
						</view>
						<text class="log-time">{{ $u.timeFrom(item.createtime) }}</text>
					</view>
					<!-- 更多 -->
					<view class="loadmore-wrap" v-if="commissionLog.length"><u-loadmore :status="loadStatus" icon-type="flower" color="#f6f6f6" /></view>
				</scroll-view>
			</view>

			<!-- 功能菜单 -->
			<view class="menu-box flex">
				<view class="menu-item y-f" v-for="(menu, index) in menuList" v-if="!menu.isAgentFrom" :key="index" @tap="jump(menu.path)">
					<image class="item-img" :src="menu.img" mode=""></image>
					<view class="item-title">{{ menu.title }}</view>
				</view>
			</view>
			<!-- 登录提示 -->
			<shopro-login-modal></shopro-login-modal>
		</view>
		<!-- 佣金中心权限验证 -->
		<view class="auth-box cu-modal" :class="{ show: !hasAuth && authNotice.title }">
			<view class="notice-box cu-dialog">
				<view class="img-wrap"><image class="notice-img" :src="authNotice.img" mode=""></image></view>
				<view class="notice-title">{{ authNotice.title }}</view>
				<view class="notice-detail">{{ authNotice.detail }}</view>
				<button class="cu-btn notice-btn" @tap="onAuthBtn(authNotice.btnPath)">{{ authNotice.btnText }}</button>
				<button class="cu-btn back-btn" @tap="onBack" v-if="!authNotice.hideBtn">返回</button>
				<button class="cu-btn back-btn" @tap="hideAuth" v-else>取消</button>
			</view>
		</view>
		<!-- 成为分销商条件 -->
		<view class="into-agent-modal cu-modal" :class="{ show: showTerm }">
			<view class="condition-box cu-dialog x-c">
				<!-- 商品 -->
				<view class="goods-condition y-c" v-if="showGoodsTerm">
					<scroll-view class="card-wrap" scroll-y="true">
						<view
							class="card-box x-f mb30"
							v-for="item in goodsTermList"
							:key="item.id"
							style="margin: 30rpx 0;"
							@tap="jump('/pages/goods/detail/index', { id: item.id })"
						>
							<view class="img-wrap"><image class="goods-img" :src="item.image" mode=""></image></view>
							<view class="detail y-bc">
								<view class="title more-t">{{ item.title }}</view>
								<view class="sub one-t">{{ item.subtitle }}</view>
							</view>
						</view>
						<view class="hack" style="height: 100rpx;"></view>
					</scroll-view>
					<view class="btn-box y-f py20">
						<button class="cu-btn buy-btn mb10" @tap="$Router.back()">知道了</button>
						<view class="tips">* 购买指定商品即可成为分销商</view>
					</view>
				</view>
				<!-- 金额人数 -->
				<view class="goods-condition y-bc" v-if="showMoneyTerm">
					<scroll-view class="card-wrap" scroll-y="true">
						<view class="card-box x-f" style="margin: 30rpx 0;" :class="{ 'filter-card': userInfo.total_consume == moneyTermNum }">
							<view class="img-wrap"><image class="goods-img" :src="$IMG_URL + '/imgs/user/commission_task_card.png'" mode=""></image></view>
							<view class="detail">
								<view class="title more-t ml10">满足以下消费金额</view>
								<view class="x-f modal-progress">
									<view class="progress-box ml20 x-f">
										<view class="cu-progress round sm">
											<view class="progress--ing" :style="[{ width: getProgress(userInfo.total_consume, moneyTermNum) }]"></view>
											<view
												class="round-wrap"
												v-if="userInfo.total_consume != moneyTermNum"
												:style="[{ left: getProgress(userInfo.total_consume, moneyTermNum) }]"
											>
												<view class="round-inner"></view>
											</view>
											<view
												class="progress-num"
												v-if="userInfo.total_consume != moneyTermNum"
												:style="[{ left: getProgress(userInfo.total_consume, moneyTermNum) }]"
											>
												{{ userInfo.total_consume }}
											</view>
										</view>
									</view>
									<view class="progress-tip" v-if="userInfo.total_consume != moneyTermNum">{{ moneyTermNum }}</view>
								</view>
							</view>
						</view>
					</scroll-view>
					<view class="btn-box y-f py20">
						<button class="cu-btn buy-btn mb10" @tap="$Router.back()">知道了</button>
						<view class="tips">* 满足指定消费金额即可成为分销商</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { mapMutations, mapActions, mapState } from 'vuex';
export default {
	components: {},
	data() {
		return {
			showMoney: true, //是否显示金额
			hasAuth: true, //是否有权限
			commissionLv: null, //分销商等级
			commissionWallet: null, //分销商钱包
			agentFrom: null, //是否显示我的资料
			showLv: true,
			commissionLog: [], //动态
			loadStatus: 'loadmore', //loadmore-加载前的状态，loading-加载中的状态，nomore-没有更多的状态
			currentPage: 1,
			lastPage: 1,
			logMap: {
				system: this.$IMG_URL + '/imgs/commission/commission_base_notice.png',
				admin: this.$IMG_URL + '/imgs/commission/commission_base_avatar.png'
			},
			showTerm: false, //条件弹窗
			showGoodsTerm: false, //商品条件
			showMoneyTerm: false, //金额条件
			goodsTermList: [],
			moneyTermNum: 0,
			authNotice: {
				//权限提示内容
				// img: this.$IMG_URL + '/imgs/commission/auth_check.png',
				// title: '正在审核中！',
				// detail: '请耐心等候',
				// btnText: '知道了'
			},
			menuList: [
				//menu
				{
					img: this.$IMG_URL + '/imgs/commission/commission_icon1.png',
					title: '我的团队',
					path: '/pages/app/commission/team'
				},
				{
					img: this.$IMG_URL + '/imgs/commission/commission_icon2.png',
					title: '佣金明细',
					path: '/pages/app/commission/commission-log'
				},
				{
					img: this.$IMG_URL + '/imgs/commission/commission_icon3.png',
					title: '分销订单',
					path: '/pages/app/commission/order'
				},
				{
					img: this.$IMG_URL + '/imgs/commission/commission_icon4.png',
					title: '推广商品',
					path: '/pages/app/commission/goods'
				},
				{
					img: this.$IMG_URL + '/imgs/commission/commission_icon5.png',
					title: '我的资料',
					path: '/pages/app/commission/apply',
					isAgentFrom: true
				},
				{
					img: this.$IMG_URL + '/imgs/commission/commission_icon6.png',
					title: '分销排行',
					path: '/pages/app/commission/rankings'
				},
				{
					img: this.$IMG_URL + '/imgs/commission/commission_icon7.png',
					title: '邀请海报',
					path: '/pages/public/poster/index?posterType=user'
				},
				{
					img: this.$IMG_URL + '/imgs/commission/commission_icon8.png',
					title: '分享记录',
					path: '/pages/app/commission/share-log'
				}
			]
		};
	},
	computed: {
		...mapState({
			userInfo: state => state.user.userInfo,
			agentInfo: state => state.user.agentInfo
		})
	},
	onShow() {
		this.init();
	},
	onHide() {
		this.commissionLog = [];
		this.currentPage = 1;
	},
	onLoad() {},
	onPullDownRefresh() {
		this.commissionLog = [];
		this.currentPage = 1;
		this.init();
	},
	methods: {
		...mapActions(['getAgent', 'getUserInfo']),
		init() {
			return Promise.all([this.getStatus(), this.getUserInfo()]).then(() => {
				uni.stopPullDownRefresh();
			});
		},
		// 跳转
		jump(path, query) {
			this.$tools.routerTo(path, query);
		},
		// 百分比
		getProgress(sales, stock) {
			let unit = '';
			if (stock + sales > 0) {
				let num = (sales / stock) * 100;
				unit = num.toFixed(2) + '%';
			} else {
				unit = '0%';
			}
			return unit;
		},

		// 是否显示金额
		onEye() {
			this.showMoney = !this.showMoney;
		},

		// 身份认证
		getStatus() {
			let that = this;
			this.getAgent().then(res => {
				uni.stopPullDownRefresh();
				if (res.code === 1) {
					that.authStatus(res.data);
					that.commissionWallet = res.data.data;
					that.commissionLv = res.data.data?.agent_level;
					that.showLv = res.data.upgrade_display;
					that.menuList.map(item => {
						if (item.title === '我的资料') {
							item.isAgentFrom = !res.data.agent_form;
						}
					});
					that.commissionWallet && that.getLog();
				}
			});
		},

		// 分销动态
		getLog() {
			let that = this;
			that.loadStatus = 'loading';
			this.$api('commission.log', {
				page: that.currentPage,
				per_page: 5
			}).then(res => {
				if (res.code === 1) {
					that.commissionLog = [...that.commissionLog, ...res.data.data];
					that.lastPage = res.data.last_page;
					if (that.currentPage < res.data.last_page) {
						that.loadStatus = 'loadmore';
					} else {
						that.loadStatus = 'nomore';
					}
				}
			});
		},

		// 加载更多
		loadMore() {
			if (this.currentPage < this.lastPage) {
				this.currentPage += 1;
				this.getLog();
			}
		},

		// 状态鉴权
		authStatus(data) {
			switch (data.status) {
				case 'forbidden':
					this.hasAuth = false;
					this.showTerm = false;
					this.authNotice = {
						img: this.$IMG_URL + '/imgs/commission/auth_stop.png',
						title: '抱歉！你的账户已被禁用',
						detail: data.msg,
						btnText: '联系客服',
						btnPath: '/pages/public/kefu/index'
					};
					break;
				case 'pending':
					this.hasAuth = false;
					this.showTerm = false;
					this.authNotice = {
						img: this.$IMG_URL + '/imgs/commission/auth_stop.png',
						title: '正在审核中！',
						detail: data.msg,
						btnText: '知道了',
						btnPath: ''
					};
					break;
				case 'needinfo':
					this.hasAuth = false;
					this.authNotice = {
						img: this.$IMG_URL + '/imgs/commission/auth_perfect.png',
						title: '待完善信息',
						detail: data.msg,
						btnText: '去完善',
						btnPath: '/pages/app/commission/apply'
					};
					break;
				case 'reject':
					this.hasAuth = false;
					this.showTerm = false;
					this.authNotice = {
						img: this.$IMG_URL + '/imgs/commission/auth_reject.png',
						title: '申请驳回',
						detail: data.msg,
						btnText: '修改资料',
						btnPath: '/pages/app/commission/apply'
					};
					break;
				case 'close':
					this.hasAuth = false;
					this.showTerm = false;
					this.authNotice = {
						img: this.$IMG_URL + '/imgs/commission/auth_close.png',
						title: '分销中心已关闭',
						detail: data.msg,
						btnText: '我知道了',
						btnPath: ''
					};
					break;
				case 'freeze':
					this.hasAuth = false;
					this.showTerm = false;
					this.authNotice = {
						img: this.$IMG_URL + '/imgs/commission/auth_freeze.png',
						title: '抱歉！你的账户已被冻结',
						detail: data.msg,
						btnText: '联系客服',
						btnPath: '/pages/public/kefu/index',
						hideBtn: true
					};
					break;
				case null:
					this.hasAuth = false;
					this.showTerm = true;
					if (data.become_agent) {
						if (data.become_agent.type === 'goods') {
							this.showGoodsTerm = true;
							this.getGoodsTermList(data.become_agent.value);
						}
						if (data.become_agent.type === 'consume') {
							this.showMoneyTerm = true;
							this.moneyTermNum = data.become_agent.value;
						}
					}
					break;
				default:
					this.hasAuth = true;
					this.showTerm = false;
			}
		},

		// 成为分销商，商品列表
		getGoodsTermList(ids) {
			let that = this;
			that.$api('goods.lists', {
				goods_ids: ids
			}).then(res => {
				if (res.code === 1) {
					that.goodsTermList = res.data.data;
				}
			});
		},

		// 权限
		onAuthBtn(path) {
			if (path) {
				this.$Router.push({
					path: path
				});
			} else {
				uni.navigateBack({
					delta: 1
				});
			}
		},
		onBack() {
			uni.navigateBack({
				delta: 1
			});
		},
		hideAuth() {
			this.hasAuth = true;
		}
	}
};
</script>

<style lang="scss">
.commission-wrap {
	background: url($IMG_URL+'/imgs/commission/commission_bg1.jpg') no-repeat;
	background-size: cover;
	height: 100%;
	width: 100%;
	background-position: center center;
	transition: all 0.3s ease-in-out 0s;
	overflow: hidden;
	/deep/ .cu-back {
		color: #fff;
		font-size: 38rpx;
	}
}
// 进度条
.progress-box {
	.progress-tip {
		font-size: 24rpx;
		font-weight: 500;
		color: #c7b2ff;
		line-height: 24rpx;
		white-space: nowrap;
	}
	.progress-num {
		font-size: 24rpx;
		position: absolute;
		color: #c7b2ff;
		bottom: -30rpx;
		white-space: nowrap;
	}
	.cu-progress {
		width: 150rpx;
		height: 10rpx;
		background: #503bae;
		overflow: visible;
		position: relative;
		.progress--ing {
			background: linear-gradient(180deg, #c6a6ff 0%, #7430ee 100%);
			border-radius: 10rpx;
		}
		.round-wrap {
			width: 30rpx;
			height: 30rpx;
			border: 2rpx solid #5c3cff;
			background: linear-gradient(0deg, #a36fff 0%, #846fff 100%);
			border-radius: 50%;
			position: absolute;
			bottom: -15rpx;
			transform: translateY(-50%);
			left: 0;
			margin-left: -15rpx;
			.round-inner {
				width: 20rpx;
				height: 20rpx;
				border: 2rpx solid #5c3cff;
				background: linear-gradient(0deg, #a36fff 0%, #846fff 100%);
				border-radius: 50%;
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
			}
		}
	}
}

// 佣金中心权限验证蒙层
.blur {
	filter: blur(20rpx);
	transition: all 0.3s ease-in-out 0s;
}

.auth-box {
	width: 100%;
	height: 100%;
	overflow: hidden;
	position: fixed;
	z-index: 99;
	background: none;
	.notice-box {
		position: fixed;
		z-index: 1111;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background-color: #fff;
		top: 50%;
		left: 50%;
		width: 612rpx;
		min-height: 658rpx;
		background: #ffffff;
		padding: 30rpx;
		border-radius: 20rpx;
		transform: translate(-50%, -50%);
		.img-wrap {
			margin-bottom: 50rpx;
			.notice-img {
				width: 180rpx;
				height: 170rpx;
			}
		}
		.notice-title {
			font-size: 35rpx;
			font-weight: bold;
			color: #46351b;
			margin-bottom: 28rpx;
		}
		.notice-detail {
			font-size: 28rpx;
			font-weight: 400;
			color: #999999;
			line-height: 36rpx;
			margin-bottom: 50rpx;
		}
		.notice-btn {
			width: 492rpx;
			height: 70rpx;
			background: linear-gradient(-90deg, #a36fff, #5336ff);
			box-shadow: 0px 7rpx 11rpx 2rpx rgba(124, 103, 214, 0.34);
			border-radius: 35rpx;
			font-size: 28rpx;
			font-weight: 500;
			color: #ffffff;
			margin-bottom: 10rpx;
		}
		.back-btn {
			width: 492rpx;
			height: 70rpx;
			font-size: 28rpx;
			font-weight: 500;
			color: #c5b8fb;
			background: none;
		}
	}
}

// 成为分销商
.into-agent-modal {
	width: 100%;
	height: 100%;
	overflow: hidden;
	position: fixed;
	z-index: 99;
	background: none;
	.condition-box {
		width: 640rpx;
		height: 786rpx;
		background: url($IMG_URL+'/imgs/commission/into_commission.png') no-repeat;
		background-size: 100% 100%;
		position: fixed;
		z-index: 1111;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
	.goods-condition {
		width: 484rpx;
		height: 580rpx;
		padding: 70rpx 0 30rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		position: relative;
		.card-wrap {
			width: 484rpx;
			height: 500rpx;
			padding: 10rpx;
			padding-bottom: 30rpx;
		}
		.modal-progress {
			.progress-tip {
				font-size: 24rpx;
				font-weight: 500;
				color: #c7b2ff;
				line-height: 30rpx;
				text-align: right;
			}
			.progress-box {
				margin-right: 10rpx;
				.cu-progress {
					width: 200rpx;
					.round-wrap {
						width: 20rpx;
						height: 20rpx;
					}
					.round-inner {
						width: 10rpx;
						height: 10rpx;
					}
				}
			}
		}
		.card-box {
			background: rgba(#c3b6ff, 0.3);
			padding: 10rpx;
			border-radius: 10rpx;
			.img-wrap {
				background: #fff;
				width: 110rpx;
				height: 110rpx;
				border-radius: 10rpx;
				margin-right: 20rpx;

				.goods-img {
					width: 110rpx;
					height: 110rpx;
					border-radius: 10rpx;
				}
			}
			.detail {
				height: 110rpx;
				width: 280rpx;
				align-items: flex-start;
				.title {
					font-size: 20rpx;
					font-weight: 500;
					color: #333333;
					line-height: 35rpx;
					text-align: left;
				}
				.sub {
					font-size: 16rpx;
					font-weight: 500;
					color: #9281e2;
					text-align: left;
					width: 280rpx;
				}
			}
		}
		.filter-card {
			filter: grayscale(100%);
			filter: gray;
		}
		.btn-box {
			background-color: #fff;
			width: 100%;
			position: absolute;
			bottom: 0;
			.buy-btn {
				width: 390rpx;
				height: 60rpx;
				background: linear-gradient(-90deg, #a36fff, #5336ff);
				box-shadow: 0px 7rpx 11rpx 2rpx rgba(124, 103, 214, 0.34);
				border-radius: 35rpx;
				font-size: 24rpx;
				font-weight: 500;
				color: #ffffff;
			}
			.tips {
				font-size: 20rpx;
				font-weight: 500;
				color: #9281e2;
			}
		}
	}
}
// 用户资料卡片
.user-card {
	width: 690rpx;
	min-height: 350rpx;
	border-radius: 14rpx;
	margin: 30rpx;
	background: url($IMG_URL+'/imgs/commission/commission_card_bg.png') no-repeat;
	background-size: 100% 100%;
	padding-top: 10rpx;
	.card-top {
		padding: 40rpx 40rpx 30rpx;
		margin-bottom: 30rpx;
		border-bottom: 1px solid rgba(#fff, 0.12);
		.user-name {
			font-size: 26rpx;
			font-weight: 500;
			color: #ffffff;
			line-height: 30rpx;
			margin-bottom: 20rpx;
		}
		.cu-btn {
			padding: 0;
			background: none;
		}
		.log-btn {
			width: 83rpx;
			height: 41rpx;
			border: 1rpx solid rgba(#ffffff, 0.33);
			border-radius: 21rpx;
			font-size: 22rpx;
			font-weight: 400;
			color: #ffffff;
		}
		.look-btn {
			color: #fff;
			font-size: 40rpx;
			.cuIcon-attentionfill,
			.cuIcon-attentionforbidfill {
				line-height: 50rpx;
				margin-top: 20rpx;
			}
			.cuIcon-attentionfill {
				line-height: 50rpx;
				margin-top: 20rpx;
			}
		}
	}
	.head-img-box {
		margin-right: 26rpx;
		width: 76rpx;
		height: 76rpx;
		border-radius: 50px;
		position: relative;
		background: #fff;
		padding: 10rpx;
		background-clip: padding-box;
		.head-img {
			width: 66rpx;
			height: 66rpx;
			border-radius: 50%;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
		}
	}
	.user-info-box {
		.tag-box {
			background: rgba(0, 0, 0, 0.2);
			border-radius: 21rpx;
			line-height: 38rpx;
			padding-right: 10rpx;

			.tag-img {
				width: 36rpx;
				height: 36rpx;
				margin-right: 6rpx;
				border-radius: 50%;
			}

			.tag-title {
				font-size: 20rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: rgba(255, 255, 255, 1);
				line-height: 20rpx;
			}
		}
	}
	.card-bottom {
		margin: 0 40rpx 40rpx;
		.item-title {
			font-size: 24rpx;
			font-family: PingFang SC;
			font-weight: 400;
			color: #ffffff;
			line-height: 30rpx;
		}
		.item-detail {
			font-size: 40rpx;
			font-family: DIN;
			font-weight: 500;
			color: #fefefe;
			line-height: 30rpx;
			margin-top: 30rpx;
		}
	}
}
// 滚动明细
.commission-log {
	min-height: 450rpx;
	padding: 0 30rpx;
	margin-top: 60rpx;
	.log-scroll {
		height: 380rpx;
		.log-item-box {
			height: 78rpx;
			.log-time {
				margin-left: 30rpx;
				font-size: 22rpx;
				font-weight: 500;
				color: #fefefe;
				text-align: right;
			}
		}
		.loadmore-wrap {
			line-height: 80rpx;
		}
		.log-item {
			height: 48rpx;
			background: rgba(#5e49c3, 0.4);
			border-radius: 24rpx;
			padding-left: 6rpx;
			padding-right: 20rpx;
			.log-img {
				width: 40rpx;
				height: 40rpx;
				border-radius: 50%;
				margin-right: 10rpx;
			}
			.log-text {
				font-size: 22rpx;
				font-weight: 500;
				color: #fefefe;
				max-width: 480rpx;
			}
		}
	}
}
// 功能菜单
.commission-bottom-bg {
	position: fixed;
	width: 100%;
	bottom: 0;
	z-index: 6;
}
.menu-box {
	flex-wrap: wrap;
	margin: 30rpx;
	position: fixed;
	width: 750rpx;
	bottom: 0;
	z-index: 10;
	.menu-item {
		width: (690rpx/4);
		margin-bottom: 50rpx;
		.item-img {
			width: 68rpx;
			height: 68rpx;
		}
		.item-title {
			font-size: 24rpx;
			font-weight: 600;
			color: #fff;
			line-height: 30rpx;
			margin-top: 16rpx;
		}
	}
}
</style>
