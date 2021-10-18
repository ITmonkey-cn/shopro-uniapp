<template>
	<view class="group-people">
		<block v-if="grouponTeamList.length">
			<view class="into-title u-flex u-row-between">
				<text>已有{{ grouponData.sales }}人参与活动</text>
				<view class="u-iconfont uicon-arrow-right" style="color: #bfbfbf;font-size: 28rpx;" @tap="onMoreGrouponTeam"></view>
			</view>
			<view class="into-item u-flex u-row-between" v-for="(g, index) in grouponTeamList" :key="g.id" v-if="index < 2">
				<view class="u-flex">
					<image class="into-img" :src="g.leader.user_avatar" mode="aspectFill"></image>
					<text class="into-name">{{ g.leader.user_nickname }}</text>
				</view>
				<view class="u-flex">
					<view class="">
						<view class="num">
							还差
							<text class="num-color">{{ g.num - g.current_num }}人</text>
							成团
						</view>
						<view class="time" v-if="g.expiretime && g.time">剩余时间{{ g.time.h }}:{{ g.time.m }}:{{ g.time.s }}</view>
					</view>
					<button class="u-reset-button  join-btn" @tap="jump('/pages/activity/groupon/detail', { id: g.id })">去参团</button>
				</view>
			</view>
		</block>
		<!-- 弹窗 -->
		<u-popup v-model="showModal" mode="bottom" :closeable="true" close-icon-pos="top-right">
			<view class="modal-box page_box">
				<view class="modal-head u-flex u-row-center">
					<text class="head-title">正在拼团</text>
				</view>
				<view class="modal-content content_box y-f">
					<view class="into-item u-flex u-row-between" v-for="g in grouponTeamList" :key="g.id">
						<view class="u-flex">
							<image class="into-img" :src="g.leader.user_avatar" mode="aspectFill"></image>
							<text class="into-name">{{ g.leader.user_nickname }}</text>
						</view>
						<view class="u-flex">
							<view class="y-end">
								<view class="num">
									还差
									<text class="num-color">{{ g.num - g.current_num }}人</text>
									成团
								</view>
								<view class="time" v-if="g.expiretime && g.time">剩余时间{{ g.time.h }}:{{ g.time.m }}:{{ g.time.s }}</view>
							</view>
							<button class="u-reset-button join-btn" @tap="joinTeam('/pages/activity/groupon/detail', { id: g.id })">去参团</button>
						</view>
					</view>
				</view>
				<view class="modal-foot u-flex u-row-center u-col-center">仅显示10个正在拼团的人</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
/**
 * 商品已拼团卡片
 * @property {Object} grouponData - 商品已拼团信息
 */
let timer;
export default {
	components: {},
	data() {
		return {
			grouponTeamList: [], //原数组
			showModal: false
		};
	},
	props: {
		grouponData: {}
	},
	computed: {},
	beforeDestroy() {
		clearInterval(timer);
		timer=null
	},
	created() {
		this.getGrouponItem();
		let that = this;

		timer = setInterval(() => {
			that.grouponTeamList.forEach((item, index) => {
				let nowTime = new Date().getTime();
				let endTime = item.expiretime * 1000;
				let t = (endTime - nowTime) / 1000;
				let time = that.$tools.format(t);
				that.$set(that.grouponTeamList[index], 'time', time);
			});
		}, 1000);
	},
	methods: {
		hideModal() {
			this.showModal = false;
		},
		jump(path, parmas) {
			this.$Router.push({
				path: path,
				query: parmas
			});
		},
		joinTeam(path, parmas) {
			this.showModal = false;
			this.$Router.push({
				path: path,
				query: parmas
			});
		},
		onMoreGrouponTeam() {
			this.showModal = true;
		},
		// 拼购人
		getGrouponItem() {
			let that = this;
			that.$http('goods.grouponItem', {
				goods_id: that.grouponData.id,
				activity_id: that.grouponData.activity.id
			}).then(res => {
				if (res.code === 1) {
					that.grouponTeamList = res.data;
				}
			});
		}
	}
};
</script>

<style lang="scss">
// 弹窗
.modal-box {
	width: 750rpx;
	height: 800rpx;
	border-radius: 30rpx 30rpx 0 0;
	background: #fff;

	.modal-head {
		height: 92rpx;
		border-bottom: 1px solid rgba(223, 223, 223, 0.5);
		padding: 0 30rpx;
		.head-title {
			font-size: 32rpx;
			font-weight: bold;
		}
	}

	.modal-content {
		padding: 0 30rpx;
	}
	.modal-foot {
		font-size: 24rpx;
		
		font-weight: 500;
		color: rgba(153, 153, 153, 1);
		height: 80rpx;
		border-top: 1px solid rgba(223, 223, 223, 0.5);
	}
}
// 拼团人数
.group-people {
	background-color: #fff;
	padding: 0 20rpx;
	margin-top: 10rpx;

	.into-title {
		height: 80rpx;
		font-size: 26rpx;
		font-weight: bold;
	}
}
.into-item {
	height: 120rpx;
	width: 100%;
	border-bottom: 1rpx solid #eee;

	.into-img {
		width: 60rpx;
		height: 60rpx;
		border-radius: 50%;
		margin-right: 23rpx;
		background-color: #ccc;
	}

	.into-name {
		font-size: 28rpx;
		
		font-weight: 500;
		color: rgba(102, 102, 102, 1);
	}

	.num {
		font-size: 26rpx;
		color: #666;

		.num-color {
			font-size: 24rpx;
			color: #a8700d;
		}
	}

	.time {
		font-size: 22rpx;
		margin-top: 10rpx;
		color: #999;
	}
	.join-btn {
		width: 140rpx;
		line-height: 60rpx;
		background: linear-gradient(90deg, rgba(254, 131, 42, 1), rgba(255, 102, 0, 1));
		box-shadow: 0px 7rpx 6rpx 0px rgba(255, 104, 4, 0.22);
		border-radius: 30rpx;
		padding: 0;
		font-size: 26rpx;
		
		font-weight: 500;
		color: rgba(255, 255, 255, 1);
		margin-left: 40rpx;
	}
}
</style>
