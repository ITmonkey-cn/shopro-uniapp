<template>
	<view class="shopro-tabbar-wrap" v-if="tabbarData.isshow">
		<view class="tabbar-box" :style="{ background: tabbarData.bgcolor }">
			<view class="tabbar-item" v-for="(tab, index) in tabbarData.list" :key="tab.name" @tap="switchTabbar(tab, index)">
				<image class="tabbar-icon" :src="tabCurrent == index ? tab.activeImage : tab.image" mode="aspectFill"></image>
				<view class="tabbar-text" :style="{ color: tabCurrent == index ? tabbarData.activeColor : tabbarData.color }">{{ tab.name }}</view>
			</view>
		</view>
	</view>
</template>

<script>
import { mapMutations, mapActions, mapState, mapGetters } from 'vuex';
export default {
	name: 'shoproTabbar',
	components: {},
	data() {
		return {};
	},
	props: {},
	computed: {
		...mapState({
			tabbarData: state => state.init.templateData.tabbar[0].content,
			tabCurrent: ({ tabbar }) => tabbar.tabCurrent
		})
	},
	created() {
		uni.hideTabBar();
	},
	methods: {
		// 切换tabbar
		switchTabbar(tab, index) {
			this.$store.commit('switchTabbar', index);
			console.log(tab.path,1111111111)
			this.$tools.routerTo(tab.path);
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
