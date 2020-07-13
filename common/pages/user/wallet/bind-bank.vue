<template>
	<view class="bank-wrap">
		<view class="form-box">
			<label>
				<view class="form-item flex align-center justify-between">
					<view class="item-title">持卡人:</view>
					<input class="item-input flex-sub" type="text" v-model="bankInfo.real_name" placeholder="请输入持卡人姓名" placeholder-class="pl-input" />
				</view>
			</label>
			<label>
				<view class="form-item flex align-center justify-between">
					<view class="item-title">银行卡号:</view>
					<input class="item-input flex-sub" type="number" v-model="bankInfo.card_no" placeholder="请输入银行卡号" placeholder-class="pl-input" />
				</view>
			</label>
			<label>
				<view class="form-item flex align-center justify-between">
					<view class="item-title">开户行:</view>
					<input class="item-input flex-sub" type="text" v-model="bankInfo.bank_name" placeholder="请输入开户行" placeholder-class="pl-input" />
				</view>
			</label>
		</view>

		<view class="notice flex align-center">请填写持卡人本人的银行卡信息</view>
		<view class="btn-box flex align-center justify-center"><button class="cu-btn confirem-btn" @tap="editBankInfo">确定</button></view>
	</view>
</template>

<script>
export default {
	components: {},
	data() {
		return {
			bankInfo: {
				real_name: '',
				card_no: '',
				bank_name: ''
			}
		};
	},
	computed: {},
	onLoad() {
		this.getBankInfo();
	},
	methods: {
		//获取银行卡信息
		getBankInfo() {
			let that = this;
			that.$api('user_bank.info').then(res => {
				if (res.code === 1) {
					if (res.data) {
						that.bankInfo = res.data;
					}
				}
			});
		},
		//修改银行卡信息
		editBankInfo() {
			let that = this;
			that.$api('user_bank.edit', {
				real_name: that.bankInfo.real_name,
				bank_name: that.bankInfo.bank_name,
				card_no: that.bankInfo.card_no
			}).then(res => {
				if (res.code === 1) {
					that.$tools.toast('保存成功');
					setTimeout(() => {
						that.$Router.back();
						// #ifdef H5
						window.history.back(-1);
						// #endif
					}, 1000);
				}
			});
		}
	}
};
</script>

<style lang="scss">
.form-box {
	background: #fff;
	.form-item {
		height: 96rpx;
		border-bottom: 1rpx solid rgba(#dfdfdf, 0.9);
		padding: 0 25rpx;
		.item-title {
			color: #333;
			font-size: 28rpx;
			font-weight: 600;
		}
		.item-input {
			font-size: 28rpx;
			color: #333;
			padding-left: 20rpx;
		}
		.pl-input {
			color: #999;
		}
	}
}
.notice {
	color: #999;
	font-size: 24rpx;
	padding: 0 25rpx;
	height: 90rpx;
}
.btn-box {
	.confirem-btn {
		width: 710rpx;
		height: 80rpx;
		background: linear-gradient(90deg, rgba(233, 180, 97, 1), rgba(238, 204, 137, 1));
		border: 1rpx solid rgba(238, 238, 238, 1);
		border-radius: 40rpx;
		font-size: 30rpx;
		color: rgba(#fff, 0.9);
	}
}
</style>
