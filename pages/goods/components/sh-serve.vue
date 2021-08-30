<template>
	<view class="sh-server-box">
		<view class="u-flex u-row-between serve-box" @tap="showModal = true">
			<view class="u-flex">
				<text class="title">服务</text>
				<view class="tip u-flex">
					<view class="tip-list u-flex" v-for="(serve, index) in serveList" :key="serve.title">
						<view class="u-flex" v-if="index < 3">
							<image class="tip-img" :src="serve.image" mode=""></image>
							<text>{{ serve.name }}</text>
						</view>
					</view>
				</view>
			</view>
			<view class="u-iconfont uicon-arrow-right" style="color: #bfbfbf;font-size: 28rpx;"></view>
		</view>
		<u-popup v-model="showModal" mode="bottom" :closeable="true" close-icon-pos="top-right">
			<view class=" server-modal">
				<view class="server-modal-box page_box">
					<view class="modal-head u-flex u-row-center u-col-center"><text class="head-title">服务保障</text></view>
					<view class="modal-content content_box">
						<view class="serve-list" v-for="serve in serveList" :key="serve.title">
							<view class="title-box u-flex">
								<image class="title-tag" :src="serve.image" mode=""></image>
								<text class="serve-title">{{ serve.name }}</text>
							</view>
							<view class="serve-detail">{{ serve.description }}</view>
						</view>
					</view>
					<view class="modal-foot u-flex u-row-center u-col-center"><button class=" u-reset-button serve-btn" @tap="showModal = false">确定</button></view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
/**
 * 商品服务卡片
 * @property {Array} serveList - 商品服务列表
 * @property {Boolean} showModal- 显隐
 */
export default {
	components: {},
	data() {
		return {
			showModal: false
		};
	},
	props: {
		serveList: {
			type: Array,
			default: () => []
		}
	},
	computed: {},
	methods: {}
};
</script>

<style lang="scss">
.serve-box {
	line-height: 82rpx;
	background: #fff;
	padding: 0 20rpx;
	margin: 10rpx 0;

	.title {
		font-size: 28rpx;
		color: #999;
		margin-right: 20rpx;
	}

	.tip {
		.tip-list {
			font-size: 28rpx;
			margin-right: 20rpx;

			.tip-img {
				width: 30rpx;
				height: 30rpx;
				margin-right: 10rpx;
			}
		}
	}
}

.server-modal-box {
	width: 750rpx;
	height: 100%;
	border-radius: 30rpx 30rpx 0 0;
	background: #fff;
	padding: 30rpx;
	.serve-btn {
		width: 690rpx;
		line-height: 80rpx;
		background: linear-gradient(90deg, rgba(240, 199, 133, 1), rgba(246, 214, 157, 1));
		border-radius: 40rpx;
		font-size: 30rpx;
		color: rgba(#fff, 0.9);
		margin-top: 40rpx;
	}

	.modal-head {
		margin-bottom: 30rpx;
		position: relative;
		.head-title {
			font-size: 32rpx;
			font-weight: bold;
		}
	}

	.modal-content {
		overflow-y: auto;
		.serve-list {
			padding-bottom: 40rpx;

			.title-tag {
				width: 38rpx;
				height: 38rpx;
				margin-right: 20rpx;
			}

			.serve-title {
				font-size: 28rpx;
				font-weight: bold;
			}

			.serve-detail {
				text-align: left;
				font-size: 26rpx;
				color: #999;
				line-height: 42rpx;
				padding-left: 58rpx;
				margin-top: 20rpx;
			}
		}
	}
}
</style>
