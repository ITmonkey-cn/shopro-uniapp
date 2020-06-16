<template>
	<view class="shopro-tabbar-wrap" v-if="isCustomTabbar">
		<view class="tabbar-box" :style="{ background: backgroundColor }">
			<view class="tabbar-item" v-for="(tab, index) in tabBarList" :key="tab.text" @tap="switchTabbar(tab, index)">
				<image class="tabbar-icon" :src="tabCurrent == index ? tab.selectedIconPath : tab.iconPath" mode="aspectFill"></image>
				<view class="tabbar-text" :style="{ color: tabCurrent == index ? selectedColor : color }">{{ tab.text }}</view>
			</view>
		</view>
	</view>
</template>

<script>
import { mapMutations, mapActions, mapState, mapGetters } from 'vuex';
export default {
		name:"shoproTabbar",
	components: {},
	data() {
		return {};
	},
	props: {},
	computed: {
		...mapState({
			isCustomTabbar: ({ tabbar }) => tabbar.isCustomTabbar,
			tabCurrent: ({ tabbar }) => tabbar.tabCurrent,
			color: ({ tabbar }) => tabbar.color,
			selectedColor: ({ tabbar }) => tabbar.selectedColor,
			backgroundColor: ({ tabbar }) => tabbar.backgroundColor,
			tagTextColor: ({ tabbar }) => tabbar.tagTextColor,
			tagBgColor: ({ tabbar }) => tabbar.tagBgColor,
			tabBarList: ({ tabbar }) => tabbar.tabBarList
		})
	},
	methods: {
		// 切换tabbar
		switchTabbar(tab, index) {
			this.$store.commit('switchTabbar', index);
			this.$tools.routerTo(tab.pagePath);
		}
	}
};
</script>

<style lang="scss">
.shopro-tabbar-wrap {
	height: 100rpx;
	position: relative;
	width: 100%;
	z-index: 6;
	.tabbar-box {
		position: fixed;
		display: flex;
		align-items: center;
		width: 100%;
		height: 100rpx;
		border-top: 1rpx solid #ccc;
		z-index: 998;
		bottom: 0;
		.tabbar-item {
			height: 100%;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			flex: 1;
			.tabbar-icon {
				width: 50rpx;
				height: 50rpx;
			}
			.tabbar-text {
				font-size: 20rpx;
				margin-top: 5rpx;
			}
		}
	}
}
</style>
