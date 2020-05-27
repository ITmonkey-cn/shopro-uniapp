<template>
	<view class="page_box">
		<view class="head_box">
			<view class="order-nav x-f">
				<view class="nav-item y-f" v-for="nav in groupState" :key="nav.id" @tap="onNav(nav.id)">
					<view class="item-title">{{ nav.title }}</view>
					<text class="nav-line" :class="{ 'line-active': stateId === nav.id }"></text>
				</view>
			</view>
		</view>
		<view class="content_box">
			<scroll-view scroll-y="true" @scrolltolower="loadMore" class="scroll-box">
				<block v-for="groupon in myGrouponList" :key="groupon.id">
					<view class="group-card">
						<image class="group-state" :src="grouponStatus ? '/static/imgs/group_state_succeed.png' : '/static/imgs/group_state_failed.png'" mode=""></image>
						<view class="goods-content">
							<shopro-activity-card
								:cardId="groupon.goods.id"
								:title="groupon.goods.title"
								:subtitle="groupon.goods.subtitle"
								:img="groupon.goods.image"
								:price="groupon.goods.price"
								:originalPrice="groupon.goods.original_price"
							>
								<block slot="sell">
									<view class="x-f">
										<view class="sell-box">
											<text class="cuIcon-hotfill"></text>
											<text class="sell-num">已拼{{ groupon.goods.sales }}件</text>
										</view>
										<text class="group-num">{{ groupon.groupon.num }}人团</text>
									</view>
								</block>
							</shopro-activity-card>
						</view>
						<view class="btn-box x-f">
							<button class="cu-btn btn" v-if="stateId === 'finish'">申请退款</button>
							<button class="cu-btn btn" @tap="jump('/pages/activity/groupon/detail', { grouponId: groupon.id })">拼团详情</button>
							<button class="cu-btn invite-btn" v-if="stateId === 'ing'" @tap="onInvite(groupon.goods)">邀请好友</button>
						</view>
					</view>
				</block>
				<!-- 加载更多 -->
				<view v-if="myGrouponList.length" class="cu-load text-gray" :class="loadStatus"></view>
				<!-- loading -->
				<shoproLoad v-model="isLoading"></shoproLoad>
			</scroll-view>
		</view>
		<view class="foot_box"></view>
		<!-- 分享 -->
		<shopro-share v-model="showShare" :goodsInfo="shareGoodsInfo" :posterType="'groupon'"></shopro-share>
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
			isLoading: false,
			loadStatus: '', //loading,over
			lastPage: 0,
			currentPage: 1,
			showShare: false,
			stateId: 'all',
			grouponStatus: false,
			myGrouponList: [], //我的拼团列表。
			shareGoodsInfo: {}, //分享海报信息。
			groupState: [
				{
					id: 'all', //0
					title: '全部'
				},
				{
					id: 'ing', //1
					title: '进行中'
				},
				{
					id: 'finish', //2
					title: '成功'
				},
				{
					id: 'invalid', //3
					title: '失败'
				}
			]
		};
	},
	computed: {},
	onLoad() {
		this.getMyGroupon();
	},
	methods: {
		onNav(id) {
			this.stateId = id;
			this.myGrouponList = [];
			this.getMyGroupon();
		},
		jump(path, parmas) {
			this.$Router.push({
				path: path,
				query: parmas
			});
		},
		onInvite(data) {
			this.shareGoodsInfo = data;
			this.showShare = true;
		},
		// 加载更多
		loadMore() {
			if (this.currentPage < this.lastPage) {
				this.currentPage += 1;
				this.getMyGroupon();
			}
		},
		// 我的拼团
		getMyGroupon() {
			let that = this;
			that.isLoading = true;
			that.loadStatus = 'loading';
			that.$api('goods.myGroupon', {
				type: that.stateId
			}).then(res => {
				if (res.code === 1) {
					that.isLoading = false;
					that.myGrouponList = [...that.myGrouponList, ...res.data.data];
					that.lastPage = res.data.last_page;
					if (that.currentPage < res.data.last_page) {
						that.loadStatus = '';
					} else {
						that.loadStatus = 'over';
					}
				}
			});
		}
	}
};
</script>

<style lang="scss">
.order-nav {
	background: #fff;
	height: 80rpx;

	.nav-item {
		flex: 1;

		.item-title {
			font-size: 30rpx;
			font-family: PingFang SC;
			font-weight: 400;
			color: rgba(51, 51, 51, 1);
			line-height: 76rpx;
		}

		.nav-line {
			width: 120rpx;
			height: 4rpx;
			background: #fff;
		}

		.line-active {
			background: rgba(230, 184, 115, 1);
		}
	}
}

// 拼团卡片
.group-card {
	background: #fff;
	margin-top: 20rpx;
	position: relative;
	overflow: hidden;
	.group-state {
		position: absolute;
		top: -20rpx;
		right: -20rpx;
		width: 126rpx;
		height: 126rpx;
	}

	.goods-content {
		padding: 0 20rpx;
		position: relative;
		z-index: 3;
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

		.price-box {
			.price {
				font-size: 28rpx;
				color: #e1212b;
				margin-right: 15rpx;
			}

			.original-price {
				font-size: 24rpx;
				color: #999;
				text-decoration: line-through;
			}
		}
	}

	.btn-box {
		height: 95rpx;
		border-top: 1px solid rgba(223, 223, 223, 0.5);
		justify-content: flex-end;

		.btn {
			width: 210rpx;
			height: 65rpx;
			border: 1rpx solid rgba(223, 223, 223, 1);
			border-radius: 33rpx;
			font-size: 26rpx;
			color: #999;
			padding: 0;
			margin-right: 20rpx;
			background: #fff;
		}

		.invite-btn {
			width: 210rpx;
			height: 65rpx;
			border: 1rpx solid #a8700d;
			border-radius: 33rpx;
			font-size: 26rpx;
			color: #a8700d;
			padding: 0;
			margin-right: 20rpx;
			background: #fff;
		}
	}
}
</style>
