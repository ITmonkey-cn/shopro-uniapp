<template>
	<view class="page_box">
		<view class="head_box">
			<view class="goods-card">
				<shopro-activity-card>
					<block slot="tipTag">
						<view class="tip">
							<text class="cuIcon-hotfill"></text>
							<text class="tip-text">已拼589件</text>
						</view>
					</block>
					<block slot="goodsBottom">
						<view class="price-box">
							<text class="price">￥299</text>
							<text class="original-price">￥499</text>
						</view>
					</block>
				</shopro-activity-card>
			</view>
		</view>
		<view class="content_box">
			<view class="y-bc group-box">
				<view class="tip-box x-f" v-if="false">
					<text class="cuIcon-roundcheckfill"></text>
					<text>恭喜您拼购成功！已有1人跟团购买</text>
				</view>
				<view class="title-box x-f">
					<view class="title-text">
						待成团，还差
						<text class="group-num">1</text>
						人拼团成功
					</view>
					<view class="count-down x-f">
						<text class="count-down-tip">还剩</text>
						<view class="time-box x-f">
							<view class="count-text">{{ time.h || '00' }}</view>
							:
							<view class="count-text">{{ time.m || '00' }}</view>
							:
							<view class="count-text">{{ time.s || '00' }}</view>
						</view>
					</view>
				</view>
				<view class="group-people x-f">
					<view class="img-box">
						<view class="tag">团长</view>
						<image class="avatar" src="/static/imgs/base_avatar.png" mode=""></image>
					</view>
				</view>
				<view class="btn-box x-c">
					<button class="cu-btn btn1">邀请好友参团</button>
					<button class="cu-btn btn2" v-if="false">查看订单</button>
				</view>
			</view>
			<view class="detail-item x-bc" @tap="$Router.push('/pages/user/group/rules')">
				<text class="title">拼团玩法</text>
				<view class="x-f">
					<view class="description one-t">好友参团·人满发货·不满退款</view>
					<text class="cuIcon-right"></text>
				</view>
			</view>
		</view>
		<view class="foot_box"></view>
	</view>
</template>

<script>
import shoproActivityCard from '@/components/goods/shopro-activity-card.vue';
export default {
	components: {
		shoproActivityCard
	},
	data() {
		return {
			time: 0,
			routerTo: this.$Router
		};
	},
	computed: {},
	onLoad() {
		this.countDown();
	},
	methods: {
		countDown() {
			let _self = this;
			// let t = this.activityData.endtime * 1000 - new Date().getTime();
			let t = 10000;
			let timer = setInterval(() => {
				if (t > 0) {
					_self.time = _self.$tools.format(t);
					t--;
				} else {
					clearInterval(timer);
					_self.time = '倒计时结束';
				}
			}, 1000);
		}
	}
};
</script>

<style lang="scss">
.head_box {
	background: url('~@/static/imgs/group/group_detail_bg.png') no-repeat;
	background-size: 100% 316rpx;
	padding: 60rpx 20rpx 20rpx;
	.goods-card {
		background-color: #fff;
		border-radius: 20rpx;
		/deep/.activity-goods-box {
			border-bottom: none;
			background: none;
			.goods-right {
				width: 460rpx;
				.title {
					width: 460rpx;
				}
				.tip {
					width: 460rpx;
				}
			}
		}
	}
}
.group-box {
	background: #fff;
	padding: 40rpx 0;
	height: 370rpx;
	.tip-box {
		font-size: 28rpx;

		.cuIcon-roundcheckfill {
			color: #ecbe60;
			font-size: 34rpx;
			margin-right: 20rpx;
		}
	}
	.title-box {
		font-size: 26rpx;
		font-weight: bold;
		color: #333;
		.group-num {
			color: #f8002c;
		}
		.count-down-tip {
			font-size: 24rpx;
			padding-left: 10rpx;
		}
		.time-box {
			font-size: 18rpx;
			.count-text {
				display: inline-block;
				background-color: #383a46;
				color: #fff;
				font-size: 18rpx;
				border-radius: 2rpx;
				padding: 0 5rpx;
				height: 28rpx;
				text-align: center;
				line-height: 28rpx;
				margin: 0 6rpx;
			}
		}
	}

	.group-people {
		.img-box {
			position: relative;
			margin-right: 20rpx;
			.tag {
				position: absolute;
				line-height: 36rpx;
				background: linear-gradient(132deg, rgba(243, 223, 177, 1), rgba(243, 223, 177, 1), rgba(236, 190, 96, 1));
				border-radius: 18rpx;
				padding: 0 10rpx;
				white-space: nowrap;
				font-size: 24rpx;
				color: #784f06;
				z-index: 2;
				top: -10rpx;
			}
			.avatar {
				width: 80rpx;
				height: 80rpx;
				border-radius: 50%;
				background: #ccc;
			}
		}
	}
	.btn-box {
		width: 750rpx;
		.btn1 {
			width: 690rpx;
			height: 70rpx;
			background: linear-gradient(90deg, rgba(254, 131, 42, 1), rgba(255, 102, 0, 1));
			box-shadow: 0px 7rpx 6rpx 0px rgba(255, 104, 4, 0.22);
			border-radius: 35rpx;
			font-size: 28rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: rgba(255, 255, 255, 1);
		}
		.btn2 {
			width: 690rpx;
			height: 70rpx;
			border: 1rpx solid rgba(223, 223, 223, 1);
			border-radius: 35rpx;
			font-size: 28rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: rgba(153, 153, 153, 1);
		}
	}
}
.detail-item {
	height: 94rpx;
	border-top: 1rpx solid rgba(#dfdfdf, 0.5);
	padding: 0 20rpx;
	background: #fff;
	.title {
		font-size: 28rpx;
	}
	.description {
		width: 450rpx;
		color: #999;
		font-size: 28rpx;
		text-align: right;
	}
	.cuIcon-right {
		margin-left: 20rpx;
	}
}
</style>
