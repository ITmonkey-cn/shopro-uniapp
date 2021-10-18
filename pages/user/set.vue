<!-- 设置 -->
<template>
	<view class="set-wrap">
		<!-- logo -->
		<view class="logo-box u-flex-col u-row-center u-col-center" v-if="initShop.name">
			<image class="logo-img" :src="initShop.logo" mode="aspectFit"></image>
			<view class="app-name u-m-t-50">{{ initShop.name }}</view>
		</view>

		<!-- cell -->
		<view class="set-box">
			<view class="cell-item u-flex u-col-center u-row-between u-p-x-30 u-p-y-20">
				<view class="cell-title">占用缓存</view>
				<view class="cell-right u-flex u-col-center">
					<view class="cell-content">{{ storageSize }}</view>
					<text class="u-iconfont uicon-arrow-right u-m-l-10" style="color: #999"></text>
				</view>
			</view>
			<view class="cell-item u-flex u-col-center u-row-between u-p-x-30 u-p-y-20">
				<view class="cell-title">当前版本</view>
				<view class="cell-right u-flex u-col-center">
					<view class="cell-content">{{ initShop.version }}</view>
					<text class="u-iconfont uicon-arrow-right u-m-l-10" style="color: #999"></text>
				</view>
			</view>
			<view class="cell-item u-flex u-col-center u-row-between u-p-x-30 u-p-y-20" @tap="$Router.push('/pages/public/feedback')">
				<view class="cell-title">意见反馈</view>
				<view class="cell-right u-flex u-col-center"><text class="u-iconfont uicon-arrow-right u-m-l-10" style="color: #999"></text></view>
			</view>
			<view class="cell-item u-flex u-col-center u-row-between u-p-x-30 u-p-y-20" @tap="$Router.push(`/pages/public/richtext?id=${initShop.about_us}`)">
				<view class="cell-title">关于我们</view>
				<view class="cell-right u-flex u-col-center"><text class="u-iconfont uicon-arrow-right u-m-l-10" style="color: #999"></text></view>
			</view>
			<view class="cell-item u-flex u-col-center u-row-between u-p-x-30 u-p-y-20" @tap="$Router.push(`/pages/public/richtext?id=${initShop.privacy_protocol}`)">
				<view class="cell-title">隐私协议</view>
				<view class="cell-right u-flex u-col-center"><text class="u-iconfont uicon-arrow-right u-m-l-10" style="color: #999"></text></view>
			</view>
		</view>

		<!-- copyright -->
		<view class="copyright-box u-flex-col u-row-center u-col-center u-p-t-80 u-p-b-50" v-if="initShop.copyright">
			<view class="copyright-text">{{ initShop.copyright[0] }}</view>
			<view class="copyright-text">{{ initShop.copyright[1] }}</view>
		</view>
		<!-- 登录提示 -->
		<shopro-auth-modal></shopro-auth-modal>
	</view>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
export default {
	components: {},
	data() {
		return {
			storageSize: uni.getStorageInfoSync().currentSize + 'Kb'
		};
	},
	computed: {
		...mapGetters(['initShop'])
	},

	methods: {}
};
</script>

<style lang="scss">
.set-box {
	background-color: #fff;
	.cell-item {
		border-bottom: 1px solid #f5f5f5;
		.cell-title {
			font-size: 28rpx;
			color: #333;
		}
		.cell-content {
			color: #999;
		}
	}
}
.logo-box {
	padding: 110rpx 0;
	.app-name {
		font-size: 36rpx;
		font-weight: 600;
		color: #333333;
	}
}
.copyright-box {
	.copyright-text {
		font-size: 22rpx;
		font-weight: 500;
		color: #c4c4c4;
	}
}
</style>
