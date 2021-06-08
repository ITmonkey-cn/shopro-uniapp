<!-- 设置 -->
<template>
	<view class="set-wrap">
		<!-- logo -->
		<view class="logo-box u-flex-col u-row-center u-col-center" v-if="shop.name">
			<image class="logo-img" :src="shop.logo" mode="aspectFit"></image>
			<view class="app-name u-m-t-50">{{ shop.name }}</view>
		</view>

		<!-- cell -->
		<view class="set-box">
			<u-cell-group class="menu-list-box">
				<u-cell-item class="menu-item" title="占用缓存" :titleStyle="{ color: '#333' }" :value="storageSize" :value-style="{ color: '#999' }"></u-cell-item>
				<u-cell-item class="menu-item" title="当前版本" :titleStyle="{ color: '#333' }" :value="shop.version" :value-style="{ color: '#999' }"></u-cell-item>
				<u-cell-item class="menu-item" title="意见反馈" :titleStyle="{ color: '#333', fontSize: '28rpx' }" @tap="$Router.push('/pages/public/feedback')"></u-cell-item>
				<u-cell-item
					class="menu-item"
					title="关于我们"
					:titleStyle="{ color: '#333', fontSize: '28rpx' }"
					@tap="$Router.push(`/pages/public/richtext?id=${shop.about_us}`)"
				></u-cell-item>
				<u-cell-item
					class="menu-item"
					title="隐私协议"
					:titleStyle="{ color: '#333', fontSize: '28rpx' }"
					@tap="$Router.push(`/pages/public/richtext?id=${shop.privacy_protocol}`)"
				></u-cell-item>
			</u-cell-group>
		</view>

		<!-- copyright -->
		<view class="copyright-box u-flex-col u-row-center u-col-center u-p-t-80 u-p-b-50" v-if="shop.copyright">
			<view class="copyright-text">{{ shop.copyright[0] }}</view>
			<view class="copyright-text">{{ shop.copyright[1] }}</view>
		</view>
		<!-- 登录提示 -->
		<shopro-auth-modal></shopro-auth-modal>
	</view>
</template>

<script>
import { mapState, mapActions } from 'vuex';
export default {
	components: {},
	data() {
		return {
			storageSize: uni.getStorageInfoSync().currentSize + 'Kb'
		};
	},
	computed: {
		...mapState({
			shop: ({ shopro }) => shopro.config.shop //初始化数据
		})
	},

	methods: {}
};
</script>

<style lang="scss">
.set-box {
	background-color: #fff;
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
