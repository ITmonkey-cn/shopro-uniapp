<template>
	<!-- 钱包卡片 -->
	<view class="sh-wallet-box u-flex u-m-b-10 u-p-r-20">
		<view class="u-flex wallet-left">
			<view class="wallet-item u-flex-col u-col-center" @tap="jump('/pages/user/wallet/index')">
				<text class="wallet-item__detail item-balance u-ellipsis-1">{{ userInfo.money || '0' }}</text>
				<text class="wallet-item__title">账户余额</text>
			</view>
			<view class="wallet-item u-flex-col u-col-center" @tap="jump('/pages/user/wallet/score-balance')">
				<text class="wallet-item__detail item-score u-ellipsis-1">{{ userInfo.score || '0' }}</text>
				<text class="wallet-item__title">积分</text>
			</view>
			<view class="wallet-item u-flex-col u-col-center" @tap="jump('/pages/app/coupon/list')">
				<text class="wallet-item__detail item-coupon u-ellipsis-1">{{ userOtherData.coupons_num || '0' }}</text>
				<text class="wallet-item__title">优惠券</text>
			</view>
		</view>
		<view class="wallet-item u-flex-col wallet-right u-col-center" @tap="jump('/pages/user/wallet/index')">
			<image class="cut-off--line" :src="$IMG_URL + '/imgs/user/cut_off_line.png'" mode=""></image>
			<image class="wallet-img" :src="$IMG_URL + '/imgs/user/wallet.png'" mode="aspectFill"></image>
			<text class="wallet-item__title">我的钱包</text>
		</view>
	</view>
</template>

<script>
/**
 * 钱包样式卡片
 */
import { mapMutations, mapActions, mapState, mapGetters } from 'vuex';
export default {
	components: {},
	data() {
		return {};
	},
	computed: {
		...mapGetters(['userInfo', 'userOtherData'])
	},
	methods: {
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
// 钱包卡片
.sh-wallet-box {
	background: #fff;
	height: 180rpx;
	position: relative;
	.wallet-left {
		flex: 4;
	}
	.wallet-right {
		position: relative;
		.cut-off--line {
			position: absolute;
			top: 50%;
			transform: translateY(-50%);
			right: (750rpx/5) - 15rpx;
			width: 30rpx;
			height: 136rpx;
		}
	}
	.wallet-item {
		flex: 1;
		.wallet-img {
			width: 46rpx;
			height: 46rpx;
		}
		.wallet-item__detail {
			font-size: 28rpx;
			width: 180rpx;
			text-align: center;
			font-weight: 500;
			color: rgba(168, 112, 13, 1);
		}
		.wallet-item__title {
			font-size: 26rpx;
			font-weight: 400;
			color: rgba(153, 153, 153, 1);
			margin-top: 20rpx;
		}
		.item-balance::after {
			content: '元';
			font-size: 16rpx;
			margin-left: 4rpx;
		}
		.item-score::after {
			content: '个';
			font-size: 14rpx;
			margin-left: 4rpx;
		}
		.item-coupon::after {
			content: '张';
			font-size: 16rpx;
			margin-left: 4rpx;
		}
	}
}
</style>
