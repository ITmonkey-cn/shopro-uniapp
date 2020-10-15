<!-- 佣金中心 -->
<template>
	<view class="commission-wrap">
		<cu-custom isBack></cu-custom>
		<!-- 用户资料 -->
		<view class="user-card">
			<view class="card-top x-f">
				<view class="head-img-box"><image class="head-img" src="/static/imgs/app_icon/icon.png" mode="widthFix"></image></view>
				<view class="y-start">
					<view class="user-info-box x-f">
						<view class="user-name">会员昵称</view>
						<view class="grade-tag tag-box x-f">
							<image class="tag-img" src="/static/imgs/app_icon/icon.png" mode=""></image>
							<text class="tag-title">铜牌逍客</text>
						</view>
					</view>
					<view class="progress-box">
						<view class="cu-progress round sm"><view class="progress--color" :style="[{ width: '20%' }]"></view></view>
						<view class="progress-tip">距离下次升级还差100财富值</view>
					</view>
				</view>
			</view>
			<view class="card-bottom x-f">
				<view class="flex-sub y-start">
					<view class="item-title">总收益</view>
					<view class="item-detail">2999999.99</view>
				</view>
				<view class="flex-sub  y-start">
					<view class="item-title">待入账佣金</view>
					<view class="item-detail">2999999.99</view>
				</view>
				<view class="y-f">
					<button class="cu-btn log-btn">明细</button>
					<button class="cu-btn look-btn"><text class="cuIcon-attentionfill"></text></button>
				</view>
			</view>
		</view>
		<!-- 滚动明细 -->
		<view class="commission-log"></view>
		<!-- 功能菜单 -->
		<view class="menu-box flex">
			<view class="menu-item y-f" v-for="(menu, index) in menuList" :key="index" @tap="jump(menu.path)">
				<image class="item-img" :src="menu.img" mode=""></image>
				<view class="item-title">{{ menu.title }}</view>
			</view>
		</view>
		<!-- 登录提示 -->
		<shopro-login-modal></shopro-login-modal>
	</view>
</template>

<script>
export default {
	components: {},
	data() {
		return {
			menuList: [
				{
					img: '/static/imgs/commission/commission_icon1.png',
					title: '我的团队',
					path: '/pages/app/commission/team'
				},
				{
					img: '/static/imgs/commission/commission_icon2.png',
					title: '佣金明细',
					path: ''
				},
				{
					img: '/static/imgs/commission/commission_icon3.png',
					title: '分销订单',
					path: ''
				},
				{
					img: '/static/imgs/commission/commission_icon4.png',
					title: '推广商品',
					path: ''
				},
				{
					img: '/static/imgs/commission/commission_icon5.png',
					title: '申请分销商',
					path: ''
				},
				{
					img: '/static/imgs/commission/commission_icon6.png',
					title: '分销排行',
					path: ''
				},
				{
					img: '/static/imgs/commission/commission_icon7.png',
					title: '邀请海报',
					path: ''
				},
				{
					img: '/static/imgs/commission/commission_icon8.png',
					title: '分享记录',
					path: ''
				}
			]
		};
	},
	computed: {},
	onLoad() {},
	methods: {
		// 跳转
		jump(path, query) {
			this.$Router.push({
				path: path,
				query: query
			});
		}
	}
};
</script>

<style lang="scss">
.commission-wrap {
	background: url('~@/static/imgs/commission/commission_bg.jpg') no-repeat;
	background-size: 100% 100%;
	height: 100%;
	/deep/ .cu-back {
		color: #fff;
		font-size: 38rpx;
	}
}
// 用户资料卡片
.user-card {
	width: 690rpx;
	min-height: 332rpx;
	background: rgba(94, 74, 195, 0.4);
	border: 1rpx solid #865ac2;
	border-radius: 14rpx;
	margin: 30rpx;
	.card-top {
		margin: 40rpx;
	}
	.head-img-box {
		margin-right: 26rpx;
		width: 76rpx;
		height: 76rpx;
		border-radius: 50px;
		position: relative;
		background: linear-gradient(0deg, #a470ff, #5436ff);
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
		.user-name {
			font-size: 26rpx;
			font-weight: 500;
			color: #ffffff;
			line-height: 30rpx;
		}
		.tag-box {
			background: rgba(0, 0, 0, 0.2);
			border-radius: 21rpx;
			line-height: 38rpx;
			padding-right: 10rpx;
			margin-left: 10rpx;

			.tag-img {
				width: 40rpx;
				height: 40rpx;
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
	.progress-box {
		.progress-tip {
			font-size: 16rpx;
			font-weight: 500;
			color: #8779cb;
			line-height: 30rpx;
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
		.cu-btn {
			padding: 0;
			background: none;
		}
		.log-btn {
			width: 83rpx;
			height: 41rpx;
			border: 1rpx solid #ffffff;
			border-radius: 21rpx;
			font-size: 22rpx;
			font-weight: 400;
			color: #ffffff;
		}
		.look-btn {
			color: #fff;
			font-size: 50rpx;
			.cuIcon-attentionfill {
				line-height: 50rpx;
				margin-top: 20rpx;
			}
		}
	}
}
// 滚动明细
.commission-log {
	min-height: 450rpx;
}
// 功能菜单
.menu-box {
	flex-wrap: wrap;
	margin: 30rpx;
	.menu-item {
		width: (690rpx/4);
		margin-bottom: 50rpx;
		.item-img {
			width: 68rpx;
			height: 68rpx;
		}
		.item-title {
			font-size: 24rpx;
			font-weight: 500;
			color: #4e7fa0;
			line-height: 30rpx;
			margin-top: 16rpx;
			text-shadow: 0 0 10rpx #fff, 0 0 10rpx #fff, 0 0 10rpx #fff, 0 0 10rpx #fff;
		}
	}
}
</style>
