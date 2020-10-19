<!-- 分销排行 -->
<template>
	<view class="rankings-wrap">
		<!-- 标题栏 -->
		<view class="nav-box">
			<cu-custom isBack>
				<block slot="backText"><text class="head-title">分销排行</text></block>
			</cu-custom>
		</view>

		<!-- 排行榜 -->
		<view class="rankings-list-box">
			<view class="ranking-list x-bc" v-for="item in 8" :key="item">
				<view class="list-left x-f">
					<view class="tag-box x-c">{{ item }}</view>
					<image class="user-avatar" src="/static/imgs/app_icon/icon1.png" mode=""></image>
					<view class="user-info">
						<view class="name mb10">大卫</view>
						<view class="date">2020年10月13日</view>
					</view>
				</view>
				<view class="list-right y-end">
					<view class="num mb10">15679.00</view>
					<view class="des">累计收益</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	components: {},
	data() {
		return {};
	},
	computed: {},
	onLoad() {},
	methods: {}
};
</script>

<style lang="scss">
.nav-box {
	background-color: #4d3cbe;
	/deep/ .cu-back {
		color: #fff;
		font-size: 40rpx;
	}
	.head-title {
		font-size: 38rpx;
		color: #fff;
	}
}

// 排行榜列表
.rankings-list-box {
	background-color: #fff;
	border-radius: 20rpx 20rpx 0px 0px;
	width: 690rpx;
	margin: 30rpx auto;
	.ranking-list {
		height: 140rpx;
		padding: 0 30rpx;
		border-bottom: 1rpx solid #e5e5e5;
		.list-left {
			.tag-box {
				width: 50rpx;
				font-size: 36rpx;
				font-weight: 500;
				color: #beb4b3;
				margin-right: 20rpx;
			}
			.user-avatar {
				width: 66rpx;
				height: 66rpx;
				border-radius: 50%;
				margin-right: 30rpx;
			}
			.user-info {
				.name {
					font-size: 28rpx;
					font-weight: bold;
					color: #333333;
				}
				.date {
					font-size: 24rpx;
					font-weight: 400;
					color: #999999;
				}
			}
		}
		.list-right {
			.num {
				font-size: 30rpx;
				font-weight: 500;
				color: #5e4ddf;
			}
			.des {
				font-size: 24rpx;
				font-weight: 500;
				color: #a09a98;
			}
		}
	}
}
</style>
