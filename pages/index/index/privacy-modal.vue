<template>
	<u-popup v-model="showModal" @close="close" :border-radius="20" mode="center" length="auto" :closeable="false">
		<view class="service-contract-wrap u-flex-col u-row-center u-col-center">
			<image class="service-head-img" :src="$IMG_URL + '/imgs/modal/servece_head.png'" mode="widthFix"></image>
			<view class="service-title">用户隐私协议概况</view>
			<view class="service-content ">
				感谢您使用{{ initShop.name }}，我们非常重视您的个人信息和隐私保护，在您使用服务前，请仔细阅读
				<text style="color: #EAB866;" @tap="jump('/pages/public/richtext', { id: initShop.privacy_protocol })">《{{ initShop.name }}隐私协议》</text>
				，我们将会严格按照经您同意的各项条款使用您的个人信息，以便为您提供更好的服务。
			</view>
			<view class="service-tip ">如您同意此条款，请点击“同意”并开始使用我们的产品和服务，我们将尽全力保护您的个人信息安全。</view>
			<view class="btn-box u-flex u-row-center u-col-center"><button class="u-reset-button agree-btn" @tap="close">知道了</button></view>
		</view>
	</u-popup>
</template>

<script>
import { mapMutations, mapActions, mapState,mapGetters } from 'vuex';
export default {
	components: {},
	data() {
		return {};
	},
	props: {
		value: {}
	},
	computed: {
		...mapGetters(['initShop']),
		showModal: {
			get() {
				return this.value;
			},
			set(val) {
				this.$emit('input', val);
			}
		}
	},
	methods: {
		close() {
			this.showModal = false;
			// #ifdef APP-VUE
			plus.runtime.agreePrivacy();
			// #endif
		},
        jump(path, parmas) {
			this.$Router.push({
				path: path,
				query: parmas
			});
		},
	}
};
</script>

<style lang="scss">
.service-contract-wrap {
	background-color: #fff;
	position: relative;
	left: 50%;
	transform: translateX(-50%);
	min-height: 850rpx;
	border-radius: 20rpx;
	width: 610rpx;
	.service-head-img {
		width: 610rpx;
	}

	.service-title {
		font-size: 35rpx;

		font-weight: bold;
		color: rgba(255, 255, 255, 1);
		line-height: 42rpx;
		background: linear-gradient(180deg, rgba(62, 48, 25, 1) 0%, rgba(109, 80, 40, 1) 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		margin-bottom: 30rpx;
	}
	.service-content {
		text-align: left;
		font-size: 26rpx;

		font-weight: 500;
		color: rgba(102, 102, 102, 1);
		line-height: 50rpx;
		padding: 0 40rpx;
	}
	.service-tip {
		text-align: left;
		font-size: 26rpx;

		font-weight: 500;
		color: rgba(154, 154, 154, 1);
		line-height: 50rpx;
		padding: 0 40rpx;
	}
	.btn-box {
		padding: 40rpx;
		.cancel-btn {
			width: 248rpx;
			height: 70rpx;
			border: 1rpx solid rgba(234, 182, 99, 1);
			border-radius: 35rpx;
			font-size: 28rpx;

			font-weight: 500;
			color: rgba(234, 182, 99, 1);
			background-color: #fff;
		}
		.agree-btn {
			width: 300rpx;
			line-height: 70rpx;
			background: linear-gradient(90deg, rgba(233, 181, 97, 1), rgba(238, 204, 138, 1));
			border-radius: 35rpx;
			font-size: 28rpx;

			font-weight: 500;
			color: rgba(255, 255, 255, 1);
		}
	}
}
</style>
