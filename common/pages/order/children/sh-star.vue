<template>
	<view class="sunui-stars x-f">
		<view class="sunui-m x-f">
			<view class="sunui-stars-items x-f" v-for="(item, index) in maxStar" :key="index" @tap="changeStar" :data-value="index">
				<text class="cuIcon-favorfill" :class="[curStarNum > index ? 'icon-star-hover' : 'icon-star-nhover']"></text>
			</view>
		</view>
	</view>
</template>
<script>
export default {
	props: {
		maxStar: {
			type: Number,
			default: 5
		},
		defaultStar: {
			type: Number,
			default: 1
		},
		disabledStar: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			curStarNum: 0
		};
	},
	created() {
		this.curStarNum = this.defaultStar;
	},
	methods: {
		changeStar(e) {
			if (this.disabledStar) {
				return;
			}
			this.curStarNum = Number(e.currentTarget.dataset.value) + 1;
			this.$emit('changeStar', {
				curStar: this.curStarNum
			});
		}
	}
};
</script>
<style>
/* star图标前颜色 */
.icon-star-nhover {
	color: #dedede;
}

/* star图标后颜色 */
.icon-star-hover {
	color: #ffba00;
}

.cuIcon-favorfill {
	font-size: 36rpx;
	margin-left: 20rpx;
}
</style>
