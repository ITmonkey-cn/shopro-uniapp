<template>
	<view class="search x-c" :style="{ 'background-color': bgcolor }" :class="{ active: bgcolor }">
		<view class="search-box x-c shopro-selector-rect" @tap="jump('/pages/goods/list', { keywords: detail.content })">
			<text class="cuIcon-search"></text>
			<text class="search-val">{{ detail.content || '暂无数据' }}</text>
		</view>
	</view>
</template>

<script>
export default {
	components: {},
	data() {
		return {};
	},
	props: {
		detail: {
			type: Object,
			default: null
		},
		bgcolor: {
			type: String,
			default: '#FFFFFF'
		}
	},
	computed: {},
	methods: {
		jump(path, params) {
			this.$Router.push({
				path: path,
				params: params
			});
		}
	}
};
</script>

<style lang="scss">
.active {
	transition: all linear 0.3s;
}
.search {
	height: 100rpx;
	width: 750rpx;
	background: #fff;
	transition: all linear 0.3s;
}

.search-box {
	height: 64rpx;
	width: 710rpx;
	background: #f5f5f5;
	border-radius: 10rpx;

	.cuIcon-search {
		font-size: 36rpx;
		margin-right: 20rpx;
	}

	.search-val {
		font-size: 30rpx;
	}
}
</style>
