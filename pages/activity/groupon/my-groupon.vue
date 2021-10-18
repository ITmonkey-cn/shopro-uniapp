<!-- 我的拼团 -->
<template>
	<view class="page_box">
		<!-- tab -->
		<view class="head_box">
			<view class="order-nav u-flex">
				<view class="nav-item u-flex-col u-flex-1 u-row-center u-col-center" v-for="nav in groupState" :key="nav.id" @tap="onNav(nav.id)">
					<view class="item-title">{{ nav.title }}</view>
					<text class="nav-line" :class="{ 'line-active': stateId === nav.id }"></text>
				</view>
			</view>
		</view>

		<view class="content_box">
			<scroll-view scroll-y="true" enable-back-to-top @scrolltolower="loadMore" refresher-background="#f5f5f5" class="scroll-box">
				<block v-for="groupon in myGrouponList" :key="groupon.id">
					<view class="group-card">
						<image v-if="stateId !== 'ing'" class="group-state" :src="grouponStatus[groupon.groupon.status]" mode=""></image>
						<view class="goods-content">
							<shopro-mini-card
								:title="groupon.goods.title"
								:image="groupon.goods.image"
								:subtitle="groupon.goods.subtitle"
								:price="groupon.goods.price"
								:originPrice="groupon.goods.original_price"
								@click="jump('/pages/goods/detail', { id: groupon.goods.id })"
							>
								<template #describe>
									<view class="u-flex u-m-b-20">
										<view class="sell-box">
											<text class="iconfont  icon-fire"></text>
											<text class="sell-num">已拼{{ groupon.goods.sales }}件</text>
										</view>
										<text class="group-num">{{ groupon.groupon.num || 0 }}人团</text>
									</view>
								</template>
							</shopro-mini-card>
						</view>
						<view class="btn-box u-flex">
							<button class="u-reset-button invite-btn" @tap="jump('/pages/activity/groupon/detail', { id: groupon.groupon_id })">拼团详情</button>
						</view>
					</view>
				</block>

				<!-- 空白页 -->
				<shopro-empty
					v-if="isEmpty"
					:image="$IMG_URL + '/imgs/empty/empty_groupon.png'"
					tipText="暂无拼团商品，更多拼团好货等着你噢~"
					btnText="去首页逛逛"
					@click="$Router.pushTab('/pages/index/index')"
				></shopro-empty>

				<!-- 加载更多 -->
				<u-loadmore v-if="myGrouponList.length" height="80rpx" :status="loadStatus" icon-type="flower" color="#ccc" />
			</scroll-view>
		</view>
	</view>
</template>

<script>
export default {
	components: {},
	data() {
		return {
			isEmpty: false,
			loadStatus: 'loadmore', //loadmore:加载前的状态，loading:加载中的状态，nomore-没有更多的状态
			lastPage: 1,
			currentPage: 1,
			stateId: 'all',
			grouponStatus: {
				finish: this.$IMG_URL + '/imgs/group/group_state_succeed.png',
				'finish-fictitious': this.$IMG_URL + '/imgs/group/group_state_succeed.png',
				invalid: this.$IMG_URL + '/imgs/group/group_state_failed.png'
			},
			myGrouponList: [], //我的拼团列表。
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
	onPullDownRefresh() {
		this.lastPage = 1;
		this.currentPage = 1;
		this.myGrouponList = [];
		this.getMyGroupon();
	},
	methods: {
		onNav(id) {
			if (this.stateId !== id) {
				this.stateId = id;
				this.myGrouponList = [];
				this.currentPage = 1;
				this.getMyGroupon();
			}
		},

		jump(path, parmas) {
			this.$Router.push({
				path: path,
				query: parmas
			});
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
			that.loadStatus = 'loading';
			that.$http(
				'goods.myGroupon',
				{
					type: that.stateId,
					page: that.currentPage
				},
				'加载中'
			).then(res => {
				uni.stopPullDownRefresh();
				if (res.code === 1) {
					that.myGrouponList = [...that.myGrouponList, ...res.data.data];
					that.isEmpty = !that.myGrouponList.length;
					that.lastPage = res.data.last_page;
					that.loadStatus = that.currentPage < res.data.last_page ? 'loadmore' : 'nomore';
				}
			});
		}
	}
};
</script>

<style lang="scss">
// tab
.order-nav {
	background: #fff;
	height: 80rpx;

	.nav-item {
		flex: 1;

		.item-title {
			font-size: 30rpx;

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
		z-index: 2;
		top: -20rpx;
		right: -20rpx;
		width: 126rpx;
		height: 126rpx;
	}

	.goods-content {
		padding: 20rpx;
		position: relative;
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

			.icon-fire {
				color: #e1212b;
				font-size: 26rpx;
				margin-right: 10rpx;
			}

			.sell-num {
				font-size: 20rpx;
				color: #f7979c;
			}
		}
	}

	.btn-box {
		height: 95rpx;
		border-top: 1px solid rgba(223, 223, 223, 0.5);
		justify-content: flex-end;
		.invite-btn {
			width: 210rpx;
			line-height: 65rpx;
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
