<template>
	<view class="page_box">
		<view class="head_box">
			<view class="goods-card">
				<shopro-activity-card
					:cardId="grouponDetail.id"
					:title="grouponDetail.goods.title"
					:subtitle="grouponDetail.goods.subtitle"
					:img="grouponDetail.goods.image"
					:price="grouponDetail.goods.price"
					:originalPrice="grouponDetail.goods.original_price"
				>
					<block slot="sell">
						<view class="x-f">
							<view class="sell-box">
								<text class="cuIcon-hotfill"></text>
								<text class="sell-num">已拼{{ grouponDetail.goods.sales }}件</text>
							</view>
							<text class="group-num">{{ grouponDetail.num }}人团</text>
						</view>
					</block>
				</shopro-activity-card>
			</view>
		</view>
		<view class="content_box">
			<view class="y-bc group-box">
				<!-- 拼团成功 -->
				<view class="tip-box x-f" v-if="grouponDetail.status === 'finish'">
					<text class="cuIcon-roundcheckfill"></text>
					<text>恭喜您拼团成功！</text>
				</view>
				<!--  拼团失败-->
				<view class="tip-box x-f" v-if="grouponDetail.status === 'invalid'">
					<text class="cuIcon-roundclosefill"></text>
					<text>拼团失败！</text>
				</view>
				<!-- 拼团中 -->
				<view class="title-box x-f" v-if="grouponDetail.status === 'ing'">
					<view class="title-text">
						待成团，还差
						<text class="group-num">{{ grouponDetail.num - grouponDetail.current_num }}</text>
						人拼团成功
					</view>
					<view class="count-down x-f">
						<text class="count-down-tip">倒计时</text>
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
					<button class="cu-btn btn1" v-if="grouponDetail.status === 'ing'" @tap="onInvite">邀请好友参团</button>
					<button class="cu-btn btn2" v-if="grouponDetail.status === 'finish'">查看订单</button>
					<button class="cu-btn btn1" v-if="grouponDetail.status === 'invalid'">我要开团</button>
				</view>
			</view>
			<view class="detail-item x-bc">
				<text class="title">拼团玩法</text>
				<view class="x-f">
					<view class="description one-t">好友参团·人满发货·不满退款</view>
					<text class="cuIcon-right"></text>
				</view>
			</view>
		</view>
		<view class="foot_box"></view>
		<!-- 邀请好友 -->
			<shopro-share v-model="showShare" :goodsInfo="grouponDetail.goods" :posterType="'groupon'"></shopro-share>
	</view>
</template>

<script>
import shoproActivityCard from '@/components/goods/shopro-activity-card.vue';
import shoproShare from '@/components/shopro-share.vue';
export default {
	components: {
		shoproActivityCard,
		shoproShare
	},
	data() {
		return {
			time: 0,
			grouponDetail: {},
			showShare:false
		};
	},
	computed: {},
	onLoad() {
		this.countDown();
		this.getGrouponDetail();
	},
	methods: {
		// 倒计时
		countDown(t) {
			let _self = this;
			let timer = setInterval(() => {
				if (t > 0) {
					_self.time = _self.$tools.formatToHours(t);
					t--;
				} else {
					clearInterval(timer);
					_self.time = '倒计时结束';
				}
			}, 1000);
		},
		// 拼团详情
		getGrouponDetail() {
			let that = this;
			that.$api('goods.grouponDetail', {
				id: that.$Route.query.grouponId
			}).then(res => {
				that.grouponDetail = res.data;
				let newTime = new Date().getTime();
				let endTime = res.data.expiretime * 1000;
				let t = endTime - newTime;
				that.countDown(t / 1000);
			});
		},
		// 邀请
		onInvite(){
			this.showShare = true;
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
		.group-num {
			font-size: 24rpx;
			font-family: PingFang SC;
			font-weight: 400;
			color: rgba(153, 153, 153, 1);
			margin-left: 30rpx;
		}
		.sell-box {
			line-height: 32rpx;
			background: rgba(255, 224, 226, 0.3);
			border-radius: 16rpx;
			padding: 0 10rpx;

			.cuIcon-hotfill {
				color: #e1212b;
				font-size: 26rpx;
				margin-right: 10rpx;
			}

			.sell-num {
				font-size: 20rpx;
				color: #f7979c;
			}
		}
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
		font-weight: bold;
		.cuIcon-roundcheckfill {
			color: #42b111;
			font-size: 34rpx;
			margin-right: 20rpx;
		}
		.cuIcon-roundclosefill {
			color: #d81e06;
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
