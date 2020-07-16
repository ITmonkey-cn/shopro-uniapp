<template>
	<view class="shopro-tabbar-wrap" v-if="showTabbar">
		<view class="tabbar-box" :style="{ background: tabbarData.bgcolor || '#fff' }">
			<view class="tabbar-item" v-for="(tab, index) in tabbarList" :key="tab.name" @tap="switchTabbar(tab, index)">
				<view class="img-box">
					<image
						class="tabbar-icon"
						v-if="tabbarData.style == 1 || tabbarData.style == 2"
						:src="currentPath == getPath(tab.path) ? tab.activeImage : tab.image"
						mode="aspectFill"
					></image>
					<!-- 购物车角标 -->
					<view v-if="getPath(tab.path) == '/pages/index/cart' && cartNum" class="cu-tag badge">{{ cartNum }}</view>
				</view>

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
		return {};
	},
	props: {},
	computed: {
		...mapState({
			templateData: state => state.init.templateData.tabbar,
			cartNum: state => state.cart.cartNum
		}),
		tabbarData() {
			if (this.templateData.length) {
				return this.templateData[0].content;
			}
		},
		tabbarList() {
			if (this.tabbarData) {
				return this.tabbarData.list;
			}
		},
		currentPath() {
			let pages = getCurrentPages();
			let currPage = null;
			if (pages.length) {
				currPage = pages[pages.length - 1].route;
			}
			return '/' + currPage;
		},
		showTabbar() {
			if (this?.tabbarData?.list) {
				let arr = [];
				let path = '';
				arr.push('/pages/index/index')
				for (let item of this.tabbarData.list) {
					path = this.getPath(item.path);
					arr.push(path);
				}
				return arr.includes(this.currentPath);
			}
		}
	},
	created() {},
	methods: {
		// 切换tabbar
		switchTabbar(tab, index) {
			this.$tools.routerTo(tab.path, {}, true);
		},
		getPath(path) {
			if (path.indexOf('?') !== -1) {
				let index = path.lastIndexOf('?');
				path = path.slice(0, index);
			}
			// this.showTabbar = arr[0].page.includes(this.currentPath);
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
			.img-box {
				position: relative;
				.cu-tag {
					right: -12px;
				}
			}

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
