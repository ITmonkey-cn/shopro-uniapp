<!-- 拼团详情 -->
<template>
	<view class="page_box">
		<!-- 商品卡片 -->
		<view class="head_box">
			<view class="goods-card u-p-x-20 u-p-y-40" v-if="grouponDetail.id">
				<shopro-mini-card
					:title="grouponDetail.goods.title"
					:image="grouponDetail.goods.image"
					:subtitle="grouponDetail.goods.subtitle"
					:price="grouponDetail.goods.groupon_price"
					:originPrice="grouponDetail.goods.original_price"
				>
					<template #describe>
						<view class="u-flex u-m-b-20">
							<view class="sell-box">
								<text class=" hot-icon iconfont icon-icon-test"></text>
								<text class="sell-num">已拼{{ grouponDetail.goods.sales }}件</text>
							</view>
							<text class="group-num">{{ grouponDetail.num || 0 }}人团</text>
						</view>
					</template>
				</shopro-mini-card>
			</view>
		</view>

		<view class="content_box">
			<view class="u-flex-col u-row-between group-box">
				<!-- 拼团成功 -->
				<view class="u-flex u-row-center u-col-center" v-if="grouponDetail.status === 'finish' || grouponDetail.status === 'finish-fictitious'">
					<view class="tip-box u-flex" v-if="grouponDetail.my">
						<view class="u-iconfont uicon-checkmark-circle-fill u-m-r-10" style="color:#42B111;font-size:34rpx ;"></view>
						<text>恭喜您~拼团成功！</text>
					</view>
					<view class="tip-box u-flex" v-else>
						<view class="u-iconfont uicon-close-circle-fill u-m-r-10" style="color:#E1212B;font-size:34rpx ;"></view>
						<text>对不起~您来晚了，该团已满</text>
					</view>
				</view>

				<!--  拼团失败-->
				<view class="u-flex u-row-center u-col-center" v-if="grouponDetail.status === 'invalid'">
					<view class="tip-box u-flex">
						<view class="u-iconfont uicon-close-circle-fill u-m-r-10" style="color:#E1212B;font-size:34rpx ;"></view>
						<text>{{ grouponDetail.my ? '对不起~拼团已过期！已全额退款' : '对不起~拼团已过期！您来晚了~' }}</text>
					</view>
				</view>

				<!-- 拼团中 -->
				<view class="title-box u-flex u-row-center u-col-center" v-if="grouponDetail.status === 'ing'">
					<!-- 活动结束 -->
					<view class="" v-if="grouponDetail.activity_status === 'ended'">
						<view class="tip-box u-flex u-col-center">
							<view class="u-iconfont uicon-close-circle-fill u-m-r-10" style="color:#E1212B;font-size:34rpx ;"></view>
							<text>对不起~拼团活动已结束！您来晚了~</text>
						</view>
					</view>
					<view v-else class="u-flex u-col-center">
						<view class="title-text">
							待成团，还差
							<text class="group-num">{{ grouponDetail.num - grouponDetail.current_num }}</text>
							人拼团成功
						</view>
						<view class="count-down u-flex" v-if="time">
							<text class="count-down-tip">倒计时</text>
							<view class="time-box u-flex">
								<view class="count-text">{{ time.h || '00' }}</view>
								:
								<view class="count-text">{{ time.m || '00' }}</view>
								:
								<view class="count-text">{{ time.s || '00' }}</view>
							</view>
						</view>
					</view>
				</view>

				<!-- 拼团人 -->
				<view class="group-people u-flex u-row-center">
					<view class="img-box" v-for="(team, index) in grouponDetail.groupon_log" :key="team.user_avatar">
						<view class="tag" v-if="index == 0">团长</view>
						<image class="avatar" :class="{ leader: index == 0 }" :src="team.user_avatar" mode="aspectFill"></image>
					</view>
					<view class="img-box" v-for="(base, index) in surplusNum" :key="base" v-if="index < 100">
						<image class="avatar" :src="$IMG_URL + '/imgs/group/base_group_avatar.png'" mode="aspectFill"></image>
					</view>
				</view>

				<!-- 底部按钮 -->
				<view class="btn-box u-flex u-row-center u-col-center">
					<!-- 拼团中 -->
					<view v-if="grouponDetail.status === 'ing'">
						<block v-if="grouponDetail.activity_status === 'ended'">
							<button class="u-reset-button btn2" v-if="grouponDetail.my" @tap.stop="jump('/pages/order/detail', { id: grouponDetail.my.order_id })">查看订单</button>
						</block>
						<block v-else>
							<button class="u-reset-button btn1" v-if="grouponDetail.my" @tap="showShare = true">邀请好友参团</button>
							<button class="u-reset-button btn1" v-else @tap="showSku = true">立即参团</button>
						</block>
					</view>
					<!-- 拼团成功/失败-->
					<view v-if="grouponDetail.status === 'finish' || grouponDetail.status === 'finish-fictitious' || grouponDetail.status === 'invalid'">
						<button class="u-reset-button btn2" v-if="grouponDetail.my" @tap.stop="jump('/pages/order/detail', { id: grouponDetail.my.order_id })">查看订单</button>
						<button class="u-reset-button btn1" v-else @tap="jump('/pages/goods/detail', { id: grouponDetail.goods_id })">我要开团</button>
					</view>
				</view>
			</view>

			<!-- 玩法 -->
			<view v-if="activity && activity.id" class="groupon-play u-flex u-row-between u-col-center" @tap="jump('/pages/public/richtext', { id: activity.richtext_id })">
				<text class="title">玩法</text>
				<view class="u-flex u-col-center">
					<view class="description u-ellipsis-1">{{ activity.richtext_title || '开团/参团·邀请好友·人满发货（不满退款' }}</view>
					<view class="u-iconfont uicon-arrow-right u-m-r-10" style="color:#999;font-size:28rpx ;"></view>
				</view>
			</view>
		</view>

		<!-- 邀请好友 -->
		<shopro-share v-model="showShare" :posterInfo="grouponDetail" :posterType="'groupon'"></shopro-share>
		<!-- 规格弹窗 -->

		<shopro-sku
			v-if="grouponDetail.goods"
			v-model="showSku"
			:activityRules="{ status: grouponDetail.status }"
			:goodsInfo="grouponDetail.goods"
			:grouponId="grouponDetail.id"
			buyType="buy"
			grouponBuyType="groupon"
		></shopro-sku>

		<!-- 登录提示 -->
		<shopro-auth-modal></shopro-auth-modal>
	</view>
</template>

<script>
let timer = null;
import share from '@/shopro/share';
export default {
	components: {},
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
	onHide() {
		clearInterval(timer);
		timer = null;
	},
	onUnload() {
		share.setShareInfo();
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
			const that = this;
			timer = setInterval(() => {
				if (t > 0) {
					that.time = that.$tools.format(t);
					t--;
				} else {
					clearInterval(timer);
					that.time = false;
				}
			}, 1000);
		},

		// 拼团详情
		getGrouponDetail() {
			let that = this;
			that.$http('goods.grouponDetail', {
				id: that.$Route.query.id
			}).then(res => {
				uni.stopPullDownRefresh();
				that.grouponDetail = res.data;
				that.activity = res.data.activity;
				if (that.activity) {
					that.activity.richtext_id = parseInt(that.activity.richtext_id);
				}
				that.surplusNum = res.data.num - res.data.current_num;

				let newTime = new Date().getTime();
				let endTime = res.data.expiretime * 1000;
				let t = endTime - newTime;
				that.countDown(t / 1000);

				// 设置分享信息
				share.setShareInfo({
					title: that.grouponDetail.goods.title,
					desc: that.grouponDetail.goods.subtitle,
					image: that.grouponDetail.goods.image,
					params: {
						page: 3,
						pageId: that.$Route.query.id
					}
				});
			});
		}
	}
};
</script>

<style lang="scss">
// 商品卡片
.head_box {
	background: url($IMG_URL+'/imgs/group/group_detail_bg.png') no-repeat;
	background-size: 100% 316rpx;
	padding: 60rpx 20rpx 20rpx;
	.goods-card {
		background-color: #fff;
		border-radius: 20rpx;
		.group-num {
			font-size: 24rpx;

			font-weight: 400;
			color: rgba(153, 153, 153, 1);
			margin-left: 30rpx;
		}
		.sell-box {
			line-height: 32rpx;
			background: rgba(255, 224, 226, 0.3);
			border-radius: 16rpx;
			padding: 0 10rpx;

			.hot-icon {
				font-size: 26rpx;
				color: #e1212b;
				margin-right: 8rpx;
			}

			.sell-num {
				font-size: 20rpx;
				color: #f7979c;
			}
		}
	}
}

// 拼团人
.group-box {
	background: #fff;
	padding: 40rpx 0;
	min-height: 370rpx;
	justify-content: center;
	.tip-box {
		font-size: 28rpx;
		font-weight: bold;
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
			margin-right: 30rpx;
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
			line-height: 70rpx;
			background: linear-gradient(90deg, rgba(254, 131, 42, 1), rgba(255, 102, 0, 1));
			box-shadow: 0px 7rpx 6rpx 0px rgba(255, 104, 4, 0.22);
			border-radius: 35rpx;
			font-size: 28rpx;

			font-weight: 500;
			color: rgba(255, 255, 255, 1);
		}
		.btn2 {
			width: 690rpx;
			line-height: 70rpx;
			border: 1rpx solid rgba(223, 223, 223, 1);
			border-radius: 35rpx;
			font-size: 28rpx;

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
}
</style>
