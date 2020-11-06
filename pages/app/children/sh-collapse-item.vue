<template>
	<view class="sh-collapse-box">
		<view class="collapse-head x-bc">
			<view class="x-f">
				<image class="head-img" :src="avatar" mode=""></image>
				<view class="head-info">
					<view class="name-box x-f">
						<view class="name-text">{{name}}</view>
						<view class="grade-tag tag-box x-f">
							<image class="tag-img" :src="level.image" mode=""></image>
							<text class="tag-title">{{level.name}}</text>
						</view>
					</view>
					<view class="head-time">{{$u.timeFormat(dateTime, 'yyyy年mm月dd日') }}</view>
				</view>
			</view>
			<button class="cu-btn arrow-btn" :class="{ 'arrow-active': isUnfold }" @tap="onArrow"><text class="cuIcon-unfold"></text></button>
		</view>
		<slot v-if="isUnfold" name="collapse-children"></slot>
	</view>
</template>

<script>
/**
 * 用户列表项
 * @property {String} avatar  - 头像
 * @property {String} name  - 昵称
 * @property {String} level  - 等级
 * @property {String | Date} dateTime - 日期
 */
export default {
	name: 'sh-collapse-item',
	components: {},
	data() {
		return {
			isUnfold: false
		};
	},
	props: {
		avatar: {
			type: String,
			default: ''
		},
		name: {
			type: String,
			default: ''
		},
		level: {
			type: Object,
			default: {}
		},
		dateTime: {
			type: Number,
			default: 0
		}
	},
	computed: {},
	methods: {
		onArrow() {
			this.isUnfold = !this.isUnfold;
		}
	}
};
</script>

<style lang="scss">
.sh-collapse-box {
	background-color: #fff;
	.collapse-head {
		padding: 0rpx 28rpx;
		height: 132rpx;
		border-bottom: 1rpx solid #eee;
		.head-img {
			width: 66rpx;
			height: 66rpx;
			border-radius: 50%;
			margin-right: 45rpx;
		}
		.arrow-btn {
			background: none;
			padding: 0;
			color: #c4c4c4;
			transition: all linear 0.3s;
		}
		.arrow-active {
			transform: rotate(180deg);
			transform-origin: center center;
			transition: all linear 0.3s;
		}
		.head-info {
			.head-time {
				font-size: 24rpx;
				font-weight: 400;
				color: #999999;
			}
			.name-box {
				margin-bottom: 12rpx;
				.name-text {
					font-size: 26rpx;
					font-weight: 500;
					color: #111111;
				}
				.tag-box {
					background: rgba(0, 0, 0, 0.2);
					border-radius: 21rpx;
					line-height: 30rpx;
					padding-right: 10rpx;
					margin-left: 10rpx;

					.tag-img {
						width: 34rpx;
						height: 34rpx;
						margin-right: 6rpx;
						border-radius: 50%;
					}

					.tag-title {
						font-size: 18rpx;
						font-family: PingFang SC;
						font-weight: 500;
						color: rgba(255, 255, 255, 1);
						line-height: 20rpx;
					}
				}
			}
		}
	}
}
</style>
