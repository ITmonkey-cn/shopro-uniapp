<template>
	<view class="sh-grid-box u-m-b-10" 　v-if="list.length">
		<u-grid :col="4" :border="false">
			<u-grid-item :border="false" name="item1" v-for="(menu, index) in list" :key="index" @click="jump(menu)">
				<image class="tool-img" :src="menu.image" mode="aspectFill"></image>
				<view class="item-title">{{ menu.name }}</view>
			</u-grid-item>
		</u-grid>
	</view>
</template>

<script>
/**
 * shGrid-宫格列表
 * @property {Array} list  - 宫格列表
 */
export default {
	components: {},
	data() {
		return {};
	},
	computed: {},
	props: {
		list: {
			type: Array,
			default: () => {
				return [];
			}
		}
	},
	methods: {
		jump(data) {
			this.$tools.routerTo(data.path);
		}
	}
};
</script>

<style lang="scss">
// 宫格
.sh-grid-box {
	background: #fff;
	display: flex;
	flex-wrap: wrap;
	.tool-img {
		width: 44rpx;
		height: 44rpx;
	}
	.item-title {
		font-size: 26rpx;
		font-weight: 500;
		color: rgba(153, 153, 153, 1);
		line-height: 24rpx;
		padding-top: 30rpx;
	}
}
</style>
