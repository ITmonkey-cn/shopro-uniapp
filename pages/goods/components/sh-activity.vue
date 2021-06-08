<template>
	<view class="sh-activity-box">
		<view class="u-flex activity-box u-col-top">
			<view class="title">优惠</view>
			<view class="activity-content u-flex-1">
				<view class="tip-list u-flex u-flex-1 u-col-center" v-for="item in detail" :key="item.id" @tap="showActivity(item.type)">
					<view class="u-flex u-flex-1 u-col-center">
						<u-tag class="title-tag u-m-r-10" :text="item.title" size="mini" bg-color="#FF0000" border-color="#FF0000" color="#fff" />
						<u-tag
							v-if="index < 3"
							class="tag-box u-m-r-10"
							v-for="(tag, index) in item.tags"
							:key="index"
							:text="tag"
							size="mini"
							bg-color="#fff"
							border-color="#FF0000"
							color="#FF0000"
						/>
					</view>
					<u-icon name="arrow-right" size="28" color="#bfbfbf"></u-icon>
				</view>
			</view>
		</view>
		<!-- 活动弹窗 -->
		<u-popup v-if="showModal" v-model="showModal" @close="onClose" mode="bottom" border-radius="30" :closeable="true" close-icon-pos="top-right">
			<view class="activity-modal-box page_box">
				<view class="modal-head u-flex u-row-center u-col-center">
					<text class="head-title">{{ activityMap[activityType].title }}</text>
				</view>
				<view class="modal-content content_box">
					<view class="tip-list u-flex u-flex-1 u-col-center" @tap="toSelGoods">
						<view class="u-flex u-flex-1 modal-item u-row-between u-col-center">
							<view class="" style="white-space: nowrap">
								<u-tag
									class="title-tag u-m-r-10 u-m-b-10"
									:text="activityMap[activityType].title"
									size="mini"
									bg-color="#FF0000"
									border-color="#FF0000"
									color="#fff"
								/>
							</view>

							<view class="">
								<u-tag
									class=" u-m-r-10 u-m-b-10"
									v-for="(tag, index) in activityMap[activityType].tags"
									:key="index"
									:text="tag"
									size="mini"
									bg-color="#fff"
									border-color="#FF0000"
									color="#FF0000"
								/>
							</view>
						</view>
						<u-icon name="arrow-right" size="28" color="#bfbfbf"></u-icon>
					</view>

					<view class="all-goods-num">共有{{ activityMap[activityType].num }}件商品参加此活动</view>
				</view>
				<view class="modal-foot u-flex u-row-center u-col-center"><button class=" u-reset-button serve-btn" @tap="toSelGoods">去凑单</button></view>
			</view>
		</u-popup>
	</view>
</template>

<script>
/**
 * 参与优惠活动卡片
 * @property {Array} detail - 优惠活动详情列表
 * @property {Boolean} showModal- 显隐
 */
export default {
	components: {},
	data() {
		return {
			showModal: false,
			activityType: ''
		};
	},
	props: {
		detail: {
			type: Array,
			default: () => []
		}
	},
	created() {},
	computed: {
		activityMap() {
			let obj = {};
			this.detail.forEach(item => {
				obj[item.type] = item;
				obj[item.type].num = item.goods_ids.split(',').length;
			});
			return obj;
		}
	},
	methods: {
		// 显示
		showActivity(type) {
			this.activityType = type;
			this.showModal = true;
		},
		// 关闭
		onClose() {
			this.activityType = '';
			this.showModal = false;
		},
		// 去凑单
		toSelGoods() {
			this.$Router.push({
				path: '/pages/activity/discounts/list',
				query: this.activityMap[this.activityType]
			});
			this.activityType = '';
			this.showModal = false;
		}
	}
};
</script>

<style lang="scss">
.activity-box {
	background: #fff;
	padding: 30rpx 20rpx 0;
	margin: 10rpx 0;

	.title {
		font-size: 28rpx;
		color: #999;
		margin-right: 20rpx;
	}
	.activity-content {
		.tip-list {
			font-size: 28rpx;
			width: 100%;
			padding-bottom: 30rpx;
		}
	}
}

// 弹窗
.activity-modal-box {
	width: 750rpx;
	min-height: 700rpx;
	border-radius: 30rpx 30rpx 0 0;
	background: #fff;
	padding: 30rpx;
	.serve-btn {
		width: 690rpx;
		line-height: 80rpx;
		background: linear-gradient(90deg, rgba(240, 199, 133, 1), rgba(246, 214, 157, 1));
		border-radius: 40rpx;
		font-size: 30rpx;
		color: rgba(#fff, 0.9);
		margin-top: 40rpx;
	}

	.modal-head {
		margin-bottom: 30rpx;
		position: relative;
		.head-title {
			font-size: 32rpx;
			font-weight: bold;
		}
	}

	.modal-content {
		overflow-y: auto;
		.tip-list {
			font-size: 28rpx;
			width: 100%;
			padding: 20rpx 0;
			border-bottom: 1rpx solid #eeeeee;
		}
		.tag-box {
			border: 1rpx solid #ff0000;
			display: inline-block;
			font-size: 20rpx;
			line-height: 30rpx;
			padding: 0 10rpx;
			color: #ff0000;
			border-radius: 8rpx;
		}
		.all-goods-num {
			font-size: 28rpx;
			font-weight: 500;
			color: #333333;
			padding: 20rpx 0;
		}
	}
}
</style>
