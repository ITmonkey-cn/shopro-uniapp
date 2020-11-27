<!-- 提现 -->
<template>
	<view class="draw-money-wrap">
		<view class="head-box">
			<cu-custom isBack>
				<block slot="backText"><text class="head-title">提现</text></block>
			</cu-custom>
			<!-- 可提现 -->
			<view class="wallet-num-box x-bc">
				<view class="">
					<view class="num-title">可提现金额（元）</view>
					<view class="wallet-num">81999.00</view>
				</view>
				<button class="cu-btn log-btn" @tap="$Router.push({path:'/pages/app/commission/wallet-log'})">提现记录</button>
			</view>
		</view>
		<!-- 提现输入卡片-->
		<view class="draw-card">
			<view class="card-title">提现金额</view>
			<view class="input-box x-f">
				<text calss="unit">￥</text>
				<input class="flex-sub" type="number" v-model="money" />
			</view>
			<view class="bank-box x-bc">
				<view class="name">提现至</view>
				<view class="bank-list">
					<text>建设银行</text>
					<text class="cuIcon-right"></text>
				</view>
			</view>
			<button class="cu-btn save-btn">确认提现</button>
		</view>
		<!-- 提现说明 -->
		<view class="draw-notice">
			<view class="title">提现说明</view>
			<view class="draw-list" v-for="(item, index) in noticeList" :key="index">{{ item }}</view>
		</view>
	</view>
</template>

<script>
export default {
	components: {},
	data() {
		return {
			money: '', //提现金额
			noticeList: [
				'1.单日提现上限为5000元',
				'2.操作提现暂不收手续费（以后根据政策调整',
				'3.提现将会通过微信的[服务通知]进行通知，打款到微信零 钱，或者银行卡请注意查收 ',
				'4.如有疑问请在“我的”页面联系客服'
			]
		};
	},
	computed: {},
	onLoad() {},
	methods: {}
};
</script>

<style lang="scss">
.head-box {
	background: url($IMG_URL+'/imgs/commission/draw_bg.png') no-repeat;
	background-size: 100% auto;
	height: 388rpx;
	/deep/ .cu-back {
		color: #fff;
		font-size: 40rpx;
	}
	.head-title {
		font-size: 38rpx;
		color: #fff;
	}
	// 可提现
	.wallet-num-box {
		padding: 40rpx 40rpx 80rpx;
		.num-title {
			font-size: 26rpx;
			font-weight: 500;
			color: #ffffff;
			margin-bottom: 20rpx;
		}
		.wallet-num {
			font-size: 60rpx;
			font-weight: 500;
			color: #ffffff;
		}
		.log-btn {
			width: 170rpx;
			height: 60rpx;
			background: rgba(255, 255, 255, 0.1);
			border: 1rpx solid #eeeeee;
			border-radius: 30rpx;
			padding: 0;
			font-size: 26rpx;
			font-weight: 500;
			color: #ffffff;
		}
	}
}
// 提现输入卡片
.draw-card {
	background-color: #fff;
	border-radius: 20rpx;
	width: 690rpx;
	min-height: 530rpx;
	margin: -70rpx auto 0;
	padding: 30rpx;
	.card-title {
		font-size: 30rpx;
		font-weight: 500;
		color: #333333;
		margin-bottom: 30rpx;
	}
	.input-box {
		width: 624rpx;
		border-bottom: 1rpx solid #eee;
		height: 100rpx;
		margin-bottom: 40rpx;
		.unit {
			font-size: 48rpx;
			color: #333;
		}
	}
	.bank-box {
		margin-bottom: 80rpx;
		.name {
			font-size: 28rpx;
			font-weight: 500;
			color: #333333;
		}
		.bank-list {
			font-size: 28rpx;
			color: #333333;
		}
	}
	.save-btn {
		width: 616rpx;
		height: 86rpx;
		background: linear-gradient(-90deg, #a36fff, #5336ff);
		box-shadow: 0px 7rpx 11rpx 2rpx rgba(124, 103, 214, 0.34);
		border-radius: 43rpx;
		font-size: 30rpx;
		font-weight: 500;
		color: #ffffff;
	}
}
// 提现说明
.draw-notice {
	width: 684rpx;
	height: 327rpx;
	background: #ffffff;
	border-radius: 20rpx;
	padding: 30rpx 35rpx;
	margin: 20rpx auto;
	.title {
		font-size: 30rpx;
		font-weight: 500;
		color: #333333;
		margin-bottom: 30rpx;
	}
	.draw-list {
		font-size: 24rpx;
		font-weight: 400;
		color: #999999;
		margin-bottom: 10rpx;
	}
}
</style>
