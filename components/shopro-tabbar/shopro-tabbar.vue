<template>
	<view class="shopro-tabbar-wrap" v-if="tabbarData.isshow">
		<view class="tabbar-box" :style="{ background: tabbarData.bgcolor || '#fff' }">
			<view class="tabbar-item" v-for="(tab, index) in tabbarData.list" :key="tab.name" @tap="switchTabbar(tab, index)">
				<image
					class="tabbar-icon"
					v-if="tabbarData.style == 1 || tabbarData.style == 2"
					:src="currentPath == tab.path ? tab.activeImage : tab.image"
					mode="aspectFill"
				></image>
				<view
					class="tabbar-text"
					v-if="tabbarData.style == 1 || tabbarData.style == 3"
					:style="{ color: currentPath == tab.path ? tabbarData.activeColor : tabbarData.color }"
				>
					{{ tab.name }}
				</view>
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
			tabbarData: state => state.init.templateData.tabbar[0].content
		}),
		// tabbarData() {
		// 	if (this.template.length) {
		// 		return this.template.tabbar[0].content;
		// 	}
		// },
		currentPath() {
			let pages = getCurrentPages();
			let currPage = null;
			if (pages.length) {
				currPage = pages[pages.length - 1].route;
			}
			return '/' + currPage;
		}
	},
	created() {},
	methods: {
		// 切换tabbar
		switchTabbar(tab, index) {
			this.$tools.routerTo(tab.path, null, true);
		}
	}
};
</script>

<style lang="scss">
.shopro-tabbar-wrap {
	height: 100rpx;
	position: relative;
	width: 100%;
	z-index: 70;
	.tabbar-box {
		position: fixed;
		display: flex;
		align-items: center;
		width: 100%;
		height: 100rpx;
		border-top: 1rpx solid #eeeeee;
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
