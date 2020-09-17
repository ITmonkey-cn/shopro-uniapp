<template>
	<view class="uni-numbox x-f">
		<view @tap.stop="_calcValue('minus')" class="uni-numbox__minus">
			<button class=" cu-btn uni-numbox--text" :class="{ 'uni-numbox--disabled': inputValue <= min || disabled }"><text class=" iconfont icon-reduce-fill"></text></button>
		</view>
		<input :disabled="true" @blur="_onBlur" class="uni-numbox__value" type="number" v-model="inputValue" />
		<view @tap.stop="_calcValue('plus')" class="uni-numbox__plus">
			<button class=" cu-btn uni-numbox--text" :class="{ 'uni-numbox--disabled': inputValue >= max || disabled }"><text class="iconfont icon-add-fill"></text></button>
		</view>
	</view>
</template>
<script>
export default {
	name: 'UniNumberBox',
	props: {
		value: {
			type: Number,
			default: 1
		},
		min: {
			type: Number,
			default: 1
		},
		max: {
			type: Number,
			default: 9999
		},
		step: {
			type: Number,
			default: 1
		},
		disabled: {
			type: Boolean,
			default: false
		},
		currentSkuPrice: {
			type: Object,
			default: () => {
				return {};
			}
		},
		goodsInfo: {
			type: Object,
			default: () => {
				return {};
			}
		}
	},
	computed: {},
	data() {
		return {
			inputValue: 0
		};
	},
	watch: {
		value(val) {
			this.inputValue = +val;
		},
		inputValue(newVal, oldVal) {
			if (+newVal !== +oldVal) {
				this.$emit('change', newVal);
			}
		},
		currentSkuPrice(val) {
			let that = this;
			if (JSON.stringify(val) !== '{}') {
				if (that.inputValue >= val.stock) {
					that.inputValue = val.stock;
				}
			}
		}
	},
	created() {
		this.inputValue = +this.value;
	},
	methods: {
		_calcValue(type) {
			let that = this;
			if (this.disabled) {
				return;
			}
			const scale = this._getDecimalScale();
			let value = this.inputValue * scale;
			let step = this.step * scale;
			if (type === 'minus') {
				value -= step;
				if (value <= this.min) {
					return;
				}
				if (value > this.max) {
					value = this.max;
				}
			} else if (type === 'plus') {
				if (JSON.stringify(that.currentSkuPrice) !== '{}') {
					if (value >= that.currentSkuPrice.stock) {
						that.$tools.toast('库存不足');
						return;
					}
				}

				if (that.goodsInfo.activity_type === 'seckill' || that.goodsInfo.activity_type === 'groupon') {
					let rules = that.goodsInfo.activity.rules;
					if (rules.limit_buy != 0 && value >= rules.limit_buy) {
						that.$tools.toast('本次活动最多购买' + rules.limit_buy + '件');
						return;
					}
				}
				value += step;
				if (value > this.max) {
					return;
				}
				if (value < this.min) {
					value = this.min;
				}
			}

			this.inputValue = String(value / scale);
			
		},
		_getDecimalScale() {
			let scale = 1;
			// 浮点型
			if (~~this.step !== this.step) {
				scale = Math.pow(10, (this.step + '').split('.')[1].length);
			}
			return scale;
		},
		_onBlur(event) {
			let value = event.detail.value;
			if (!value) {
				// this.inputValue = 1;
				return;
			}
			value = +value;
			if (value > this.max) {
				value = this.max;
			} else if (value < this.min) {
				value = this.min;
			}
			this.inputValue = value;
		}
	}
};
</script>
<style lang="scss" scoped>
$box-height: 35px;
/* #ifdef APP-NVUE */
$box-line-height: 35px;
/* #endif */
$box-line-height: 26px;
$box-width: 35px;
.iconfont {
	font-size: 50rpx;
}
.uni-numbox {
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	flex-direction: row;
	height: $box-height;
	line-height: $box-height;
	.cu-btn {
		background: none;
		padding: 0;
	}
}

.uni-numbox__value {
	background-color: none;
	width: 40px;
	height: $box-height;
	text-align: center;
	font-size: 28rpx;
}

.uni-numbox__minus {
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	flex-direction: row;
	align-items: center;
	justify-content: center;
	.icon-reduce-fill {
		color: #e7e7e7;
	}
}

.uni-numbox__plus {
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	flex-direction: row;
	align-items: center;
	justify-content: center;
	.icon-add-fill {
		color: #e9b564;
	}
}

.uni-numbox--text {
	font-size: 32rpx;
	line-height: 40rpx;
	color: #fff;
}

.uni-numbox--disabled {
	color: #fff;
}
</style>
