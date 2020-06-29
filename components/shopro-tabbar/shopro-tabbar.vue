<template>
	<view class="shopro-tabbar-wrap" v-if="tabbarData.isshow">
		<view class="tabbar-box" :style="{ background: tabbarData.bgcolor || '#fff' }">
			<view class="tabbar-item" v-for="(tab, index) in tabbarData.list" :key="tab.name" @tap="switchTabbar(tab, index)">
				<image
					class="tabbar-icon"
					v-if="tabbarData.style == 1 || tabbarData.style == 2"
					:src="currentPath == getPath(tab.path) ? tab.activeImage : tab.image"
					mode="aspectFill"
				></image>
				<view
					class="tabbar-text"
					v-if="tabbarData.style == 1 || tabbarData.style == 3"
					:style="{ color: currentPath == getPath(tab.path) ? tabbarData.activeColor : tabbarData.color }"
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
		return {
			tabbarData: {}
		};
	},
	props: {},
	computed: {
		// ...mapState({
		// 	tabbarData: state => state.init.templateData.tabbar[0].content
		// }),
		currentPath() {
			let pages = getCurrentPages();
			let currPage = null;
			if (pages.length) {
				currPage = pages[pages.length - 1].route;
			}
			return '/' + currPage;
		}
	},
	async created() {
		let that = this;
		let templateData = await this.getTemplate();
			console.log(123123,templateData)
				// console.log('tab', that.$store.state.init.templateData.tabbar[0].content);
				// console.log(that.tabbarData,1)
				// that.tabbarData = that.$store.state.init.templateData.tabbar[0].content;
				// console.log(that.tabbarData,2)
	
			
	
		
	},
	methods: {
				...mapActions(['getTemplate']),
		// 切换tabbar
		switchTabbar(tab, index) {
			this.$tools.routerTo(tab.path, null, true);
		},
		getPath(path) {
			if (path.indexOf('?') !== -1) {
				let index = path.lastIndexOf('?');
				path = path.slice(0, index);
			}
			return path;
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
