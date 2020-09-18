<template>
	<view class="page_box">
		<view class="head_box">
			<view class="goods-card" v-if="grouponDetail.id">
				<sh-activity-card
					:cardId="grouponDetail.goods_id"
					:title="grouponDetail.goods.title"
					:subtitle="grouponDetail.goods.subtitle"
					:img="grouponDetail.goods.image"
					:price="grouponDetail.goods.groupon_price || grouponDetail.goods.price"
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
				</sh-activity-card>
			</view>
		</view>
		<view class="content_box">
			<view class="y-bc group-box">
				<!-- 拼团成功 -->
				<view v-if="grouponDetail.status === 'finish' || grouponDetail.status === 'finish-fictitious'">
					<view class="tip-box x-f" v-if="grouponDetail.my">
						<text class="cuIcon-roundcheckfill"></text>
						<text>恭喜您~拼团成功！</text>
					</view>
					<view class="tip-box x-f" v-else>
						<text class="cuIcon-roundclosefill"></text>
						<text>对不起~您来晚了，该团已满</text>
					</view>
				</view>

				<!--  拼团失败-->
				<view v-if="grouponDetail.status === 'invalid'">
					<view class="tip-box x-f" v-if="grouponDetail.my">
						<text class="cuIcon-roundclosefill"></text>
						<text>对不起~拼团已过期！已全额退款</text>
					</view>
					<view class="tip-box x-f" v-else>
						<text class="cuIcon-roundclosefill"></text>
						<text>对不起~拼团已过期！您来晚了~</text>
					</view>
				</view>
				<!-- 拼团中 -->
				<view class="title-box x-f" v-if="grouponDetail.status === 'ing'">
					<view class="title-text">
						待成团，还差
						<text class="group-num">{{ grouponDetail.num - grouponDetail.current_num }}</text>
						人拼团成功
					</view>
					<view class="count-down x-f" v-if="time">
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
					<view class="img-box" v-for="(team, index) in grouponDetail.groupon_log" :key="team.id">
						<view class="tag" v-if="index == 0">团长</view>
						<image class="avatar" :class="{ leader: index == 0 }" :src="team.user_avatar" mode="aspectFill"></image>
					</view>
					<view class="img-box" v-for="base in surplusNum" :key="base"><image class="avatar" src="/static/imgs/groupon/base_groupon.png" mode="aspectFill"></image></view>
				</view>
				<view class="btn-box x-c">
					<!-- 拼团中 -->
					<view v-if="grouponDetail.status === 'ing'">
						<button class="cu-btn btn1" v-if="grouponDetail.my" @tap="onInvite">邀请好友参团</button>
						<button class="cu-btn btn1" v-else @tap="onJoin">立即参团</button>
					</view>
					<!-- 拼团成功/失败-->
					<view v-if="grouponDetail.status === 'finish' || grouponDetail.status === 'finish-fictitious' || grouponDetail.status === 'invalid'">
						<button class="cu-btn btn2" v-if="grouponDetail.my" @tap.stop="jump('/pages/order/detail', { id: grouponDetail.my.order_id })">查看订单</button>
						<button class="cu-btn btn1" v-else @tap="jump('/pages/goods/detail/index', { id: grouponDetail.goods_id })">我要开团</button>
					</view>
				</view>
			</view>
			<view v-if="activity && activity.richtext_id" class="groupon-play x-bc" @tap="jump('/pages/public/richtext', { id: activity.richtext_id })">
				<text class="title">玩法</text>
				<view class="x-f">
					<view class="description one-t">{{ activity.richtext_title || '开团/参团·邀请好友·人满发货（不满退款' }}</view>
					<text class="cuIcon-right"></text>
				</view>
			</view>
		</view>
		<view class="foot_box"></view>
		<!-- 邀请好友 -->
		<shopro-share v-model="showShare" v-if="grouponDetail.goods" :goodsInfo="grouponDetail" :posterType="'groupon'"></shopro-share>
		<!-- sku -->
		<shopro-sku
			v-model="showSku"
			v-if="grouponDetail.goods"
			:grouponId="grouponDetail.id"
			:goodsInfo="grouponDetail.goods"
			:buyType="'buy'"
			:grouponBuyType="'groupon'"
		></shopro-sku>
		<!-- 自定义底部导航 -->
		<shopro-tabbar></shopro-tabbar>
		<!-- 关注弹窗 -->
		<shopro-float-btn></shopro-float-btn>
		<!-- 连续弹窗提醒 -->
		<shopro-notice-modal></shopro-notice-modal>
		<!-- 登录提示 -->
		<shopro-login-modal></shopro-login-modal>
	</view>
</template>

<script>
import shActivityCard from '../children/sh-activity-card.vue';

import shoproSku from '@/components/shopro-sku/shopro-sku.vue';
export default {
	components: {
		shActivityCard,
		shoproSku
	},
	data() {
		return {
			time: 0,
			grouponDetail: {},
			showShare: false,
			showSku: false,
			activity: {},
			surplusNum: 0 //剩余拼团人数、
		};
	},
	computed: {},
	onLoad() {
		this.getGrouponDetail();
	},
	onPullDownRefresh() {
		this.getGrouponDetail();
	},
	methods: {
		// 路由跳转
		jump(path, parmas) {
			this.$Router.push({
				path: path,
				query: parmas
			});
		},
		// 倒计时
		countDown(t) {
			let _self = this;
			let timer = setInterval(() => {
				if (t > 0) {
					_self.time = _self.$tools.formatToHours(t);
					t--;
				} else {
					clearInterval(timer);
					_self.time = false;
				}
			}, 1000);
		},
		// 拼团详情
		getGrouponDetail() {
			let that = this;
			that.$api('goods.grouponDetail', {
				id: that.$Route.query.id
			}).then(res => {
				uni.stopPullDownRefresh();
				that.grouponDetail = res.data;
				that.activity = res.data.goods.activity;
				if (that.activity) {
					that.activity.richtext_id = parseInt(that.activity.richtext_id);
				}
				that.surplusNum = res.data.num - res.data.current_num;
				let newTime = new Date().getTime();
				let endTime = res.data.expiretime * 1000;
				let t = endTime - newTime;
				that.countDown(t / 1000);
				that.setShareInfo({
					query: {
						url: 'groupon-' + that.$Route.query.id
					},
					title: that.grouponDetail.goods.title,
					image: that.grouponDetail.goods.image
				});
			});
		},
		// 邀请
		onInvite() {
			this.showShare = true;
		},
		// 立即参团
		onJoin() {
			this.showSku = true;
		}
	}
};
</script>

<style lang="scss">
.head_box {
	background: url('http://shopro.7wpp.com/imgs/group_detail_bg.png') no-repeat;
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
	min-height: 370rpx;
	justify-content: center;
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
		flex-wrap: wrap;
		padding: 50rpx;
		.img-box {
			position: relative;
			margin-right: 34rpx;
			&:nth-child(6n) {
				margin-right: 0;
			}
			.tag {
				position: absolute;
				line-height: 36rpx;
				background: linear-gradient(132deg, rgba(243, 223, 177, 1), rgba(243, 223, 177, 1), rgba(236, 190, 96, 1));
				border-radius: 14rpx;
				padding: 0 10rpx;
				white-space: nowrap;
				font-size: 24rpx;
				color: #784f06;
				z-index: 2;
				top: -20rpx;
				left: 50%;
				transform: translateX(-50%);
			}
			.avatar {
				width: 80rpx;
				height: 80rpx;
				border-radius: 50%;
				background: #ccc;
			}
			.leader {
				border: 4rpx solid rgba(237, 195, 108, 1);
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
.groupon-play {
	height: 94rpx;
	border-top: 1rpx solid rgba(#dfdfdf, 0.5);
	padding: 0 20rpx;
	background: #fff;
	.title {
		font-size: 28rpx;
		color: #999;
	}
	.description {
		font-size: 28rpx;
		text-align: right;
	}
	.cuIcon-right {
		margin-left: 20rpx;
	}
}
</style>
