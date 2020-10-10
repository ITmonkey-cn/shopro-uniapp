<template>
	<view class="shopro-tabbar-wrap" v-if="tabbarList && tabbarList.length && showTabbar">
		<view class="tabbar-box" :style="{ background: tabbarData.bgcolor || '#fff' }">
			<view class="tabbar-item" v-for="(tab, index) in tabbarList" :key="tab.name" @tap="switchTabbar(tab, index)">
				<view class="img-box">
					<image
						class="tabbar-icon"
						v-if="tabbarData.style == 1 || tabbarData.style == 2"
						:src="currentPath == tab.path ? tab.activeImage : tab.image"
						mode="aspectFill"
					></image>
					<!-- 购物车角标 -->
					<view v-if="tab.path == '/pages/index/cart' && cartNum" class="cu-tag badge">{{ cartNum }}</view>
				</view>

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
	props: {
		queryObj: {}
	},
	computed: {
		...mapState({
			templateData: state => state.init.templateData.tabbar,
			cartNum: state => state.cart.cartNum
		}),
		tabbarData() {
			if (this.templateData) {
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
			let query = this.queryObj ? this.queryObj : {};
			let currPage = null;
			if (pages.length) {
				currPage = pages[pages.length - 1].route;
			}
			if (Object.keys(query).length) {
				let params = '';
				for (let key in query) {
					params += '?' + key + '=' + query[key] + '&';
				}
				params = params.substring(0, params.length - 1);
				return '/' + currPage + params;
			}
			return '/' + currPage;
		},
		showTabbar() {
			if (this.tabbarData && this.tabbarData.list) {
				let arr = [];
				let path = '';
				arr.push('/pages/index/index');
				for (let item of this.tabbarData.list) {
					arr.push(item.path);
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
		}
	}
};
</script>

<style lang="scss">
.shopro-tabbar-wrap {
	height: calc(100rpx + env(safe-area-inset-bottom) / 2);
	padding-bottom: calc(env(safe-area-inset-bottom) / 2);
	position: relative;
	width: 100%;
	z-index: 70;

	.tabbar-box {
		position: fixed;
		display: flex;
		align-items: center;
		width: 100%;
		height: calc(100rpx + env(safe-area-inset-bottom) / 2);
		border-top: 1rpx solid #eeeeee;
		background-color: #fff;
		z-index: 998;
		bottom: 0;
		padding-bottom: calc(env(safe-area-inset-bottom) / 2);

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
			}
		}
	}
}
</style>
