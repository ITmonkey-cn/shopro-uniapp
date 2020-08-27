<template>
	<view class="comment-box">
		<view class="head x-bc">
			<view class="x-f">
				<image class="avatar" :src="comment.user.avatar" mode="aspectFill"></image>
				<view class="user-name one-t">{{ comment.user.nickname }}</view>
				<view class="x-f star-box">
					<text class="cuIcon-favorfill star-active" v-for="s in comment.level" :key="s"></text>
					<text class="cuIcon-favorfill" v-for="z in 5 - comment.level" :key="z"></text>
				</view>
			</view>
			<text class="time">{{ tools.timestamp(comment.createtime) }}</text>
		</view>
		<view class="detail">{{ comment.content }}</view>
		<view class="img-box">
			<view class="mask"></view>
			<scroll-view class="nav" enable-back-to-top scroll-x scroll-with-animation :scroll-left="scrollLeft">
				<image
					v-for="(img, index) in comment.images"
					:key="index"
					@tap="imgSelect(index)"
					@tap.stop="tools.previewImage(comment.images, index)"
					class="comment-img"
					:src="img"
					mode="aspectFill"
				></image>
			</scroll-view>
		</view>
	</view>
</template>

<script>
export default {
	components: {},
	data() {
		return {
			scrollLeft: 0,
			tools: this.$tools
		};
	},
	props: {
		comment: {}
	},
	computed: {},
	methods: {
		imgSelect(current) {
			this.scrollLeft = current * 60;
		}
	}
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

		.star-box {
			.cuIcon-favorfill {
				font-size: 30rpx;
				color: #dedede;
			}

			.star-active {
				color: #ffba00;
			}
		}

		.time {
			font-size: 24rpx;
			color: #c4c4c4;
		}
	}

	.detail {
		font-size: 26rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(102, 102, 102, 1);
		line-height: 42rpx;
	}

	.img-box {
		margin-top: 30rpx;
		position: relative;

		.mask {
			background: linear-gradient(270deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0) 100%);
			width: 100rpx;
			height: 100%;
			position: absolute;
			z-index: 10;
			right: 0;
		}

		.comment-img {
			width: 166rpx;
			height: 166rpx;
			background: #ccc;
			margin-right: 19rpx;
			margin-bottom: 19rpx;
		}
	}
}
</style>
