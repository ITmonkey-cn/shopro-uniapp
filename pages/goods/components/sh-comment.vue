<template>
	<view class="comment-box">
		<view class="head u-flex u-row-between">
			<view class="u-flex">
				<image class="avatar" :src="comment.user ? comment.user.avatar : $IMG_URL + '/imgs/base_avatar.png'" mode="aspectFill"></image>
				<view class="user-name u-ellipsis-1">{{ comment.user ? comment.user.nickname : '***' }}</view>
				<u-rate :value="comment.level" disabled></u-rate>
			</view>
			<text class="time">{{ $u.timeFormat(comment.createtime, 'yyyy-mm-dd hh:MM') }}</text>
		</view>
		<view class="detail">{{ comment.content }}</view>
		<view class="img-box u-flex u-row-center u-col-center">
			<view class="nav u-flex u-flex-wrap">
				<image
					v-for="(img, index) in comment.images"
					:key="index"
					@tap="imgSelect(index)"
					@tap.stop="tools.previewImage(comment.images, index)"
					class="comment-img"
					:src="img"
					mode="aspectFill"
				></image>
			</view>
		</view>
	</view>
</template>

<script>
/**
 * 评论信息卡片
 * @property {Object} comment  - 评论信息
 */
export default {
	components: {},
	data() {
		return {};
	},
	props: {
		comment: {}
	},
	computed: {},
	methods: {}
};
</script>

<style lang="scss">
.comment-box {
	padding: 30rpx 20rpx;
	border-bottom: 1rpx solid #eee;
	background: #fff;

	.head {
		margin-bottom: 20rpx;

		.avatar {
			width: 52rpx;
			height: 52rpx;
			border-radius: 50%;
			background: #ccc;
		}

		.user-name {
			font-size: 26rpx;
			color: #999;
			width: 140rpx;
			margin: 0 20rpx;
		}

		.time {
			font-size: 24rpx;
			color: #c4c4c4;
		}
	}

	.detail {
		font-size: 26rpx;
		font-weight: 500;
		color: rgba(102, 102, 102, 1);
		line-height: 42rpx;
	}

	.img-box {
		margin-top: 30rpx;
		position: relative;
		.nav {
			width: 670rpx;
		}
		.comment-img {
			width: 160rpx;
			height: 160rpx;
			background: #ccc;
			margin-right: 10rpx;
			margin-bottom: 10rpx;
			border-radius: 6rpx;
			&:nth-child(4n) {
				margin-right: 0;
			}
		}
	}
}
</style>
