<template>
	<view class="select-coupon-wrap ">
		<view class="coupon-item u-flex u-row-between">
			<view class="item-title">优惠券</view>
			<view class="u-flex" @tap="showModal = true">
				<text class="price" v-if="couponList.length">{{ title }}</text>
				<text class="sel-coupon" v-else>暂无优惠券</text>
				<text class="u-iconfont uicon-arrow-right" style="color: #bfbfbf"></text>
			</view>
		</view>

		<u-popup v-model="showModal" mode="bottom" :closeable="true" close-icon-pos="top-right" border-radius="30">
			<view class="modal-box page_box">
				<view class="modal-head u-flex u-row-center u-col-center"><text class="head-title">选择优惠券</text></view>
				<view class="modal-content content_box u-flex-col u-p-20">
					<u-radio-group v-model="radio" @change="radioGroupChange" width="100%" activeColor="#e9b564">
						<view class="radio-item">
							<u-radio :name="0"><text class="coupon-title u-p-l-10">不使用优惠券</text></u-radio>
						</view>
						<view class="radio-item" v-for="(radio, index) in couponList" :key="radio.user_coupons_id">
							<u-radio :name="index + 1">
								<text class="coupon-title u-p-l-10">{{ radio.name }}:{{ `满${radio.enough}减${radio.amount}` }}</text>
							</u-radio>
						</view>
					</u-radio-group>
				</view>
				<button class="u-reset-button serve-btn" @tap="showModal = false">确定</button>
			</view>
		</u-popup>
	</view>
</template>

<script>
/**
 * 选择优惠券模态框
 * @property {Object} couponList - 可用优惠券列表数据
 *
 */
export default {
	components: {},
	data() {
		return {
			showModal: false,
			radio: 0,
			title: '选择优惠券'
		};
	},
	props: {
		couponList: {
			type: Array,
			default: () => []
		}
	},
	computed: {},
	methods: {
		radioGroupChange(index) {
			this.title = index > 0 ? '-￥' + this.couponList[index - 1].amount : '选择优惠券';
			this.$emit('change', index - 1);
		}
	}
};
</script>

<style lang="scss" scoped>
// 优惠券项
.coupon-item {
	border-top: 1rpx solid rgba(#dfdfdf, 0.5);
	height: 100rpx;
	background: #fff;
	padding: 0 25rpx;
	.item-title {
		font-size: 28rpx;
		margin-right: 20rpx;
	}
	.price {
		font-size: 26rpx;
		color: #ff0000;
		margin-right: 20rpx;
	}
	.sel-coupon {
		font-size: 26rpx;
		color: #c4c4c4;
		margin-right: 20rpx;
	}
}

// 模态框
.modal-box {
	width: 750rpx;
	height: 700rpx;
	background: #fff;
	padding: 30rpx;

	// 按钮
	.serve-btn {
		width: 690rpx;
		line-height: 80rpx;
		background: linear-gradient(90deg, rgba(240, 199, 133, 1), rgba(246, 214, 157, 1));
		border-radius: 40rpx;
		color: rgba(#fff, 0.9);
		margin-top: 40rpx;
	}
	.radio-item {
		width: 690rpx;
		margin-bottom: 20rpx;
	}
	// 标题
	.modal-head {
		margin-bottom: 30rpx;
		.head-title {
			font-size: 32rpx;
			font-weight: bold;
		}
	}
}
</style>
