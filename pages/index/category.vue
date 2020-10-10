<template>
	<view class="category-box">
		<!-- 三级分类 -->
		<sh-three-catgory :categoryId="categoryId" v-if="categoryType === 4"></sh-three-catgory>
		<!-- 二级分类 -->
		<sh-two-catgory :categoryId="categoryId" v-if="categoryType === 3"></sh-two-catgory>
		<!-- 一级分类-->
		<sh-one-catgory :categoryId="categoryId" v-if="categoryType === 2"></sh-one-catgory>
		<!--直接购买，点餐 -->
		<sh-takeout-catgory :categoryId="categoryId" v-if="categoryType === 1"></sh-takeout-catgory>
		<!-- 自定义底部导航 -->
		<shopro-tabbar v-if="queryObj.id" :queryObj="queryObj"></shopro-tabbar>
		<!-- 关注弹窗 -->
		<shopro-float-btn></shopro-float-btn>
		<!-- 连续弹窗提醒 -->
		<shopro-notice-modal></shopro-notice-modal>
		<!-- 登录提示 -->
		<shopro-login-modal></shopro-login-modal>
	</view>
</template>

<script>
import shTakeoutCatgory from './components/category/sh-takeout-catgory.vue';
import shThreeCatgory from './components/category/sh-three-catgory.vue';
import shTwoCatgory from './components/category/sh-two-catgory.vue';
import shOneCatgory from './components/category/sh-one-catgory.vue';
export default {
	components: {
		shTakeoutCatgory,
		shThreeCatgory,
		shTwoCatgory,
		shOneCatgory
	},
	data() {
		return {
			categoryType: 0, //1:快速购买,2:一级分类，3:二级分类，4:三级分类
			categoryId: 0 ,//分类Id
			queryObj:{}
		};
	},
	computed: {},
	onLoad(options) {
		this.queryObj = options;
		this.getCategory();
		this.categoryId = Number(this.$Route.query.id);
	},
	methods: {
		/**
		 * 获取分类数据
		 *  type4:三级分类， type3:二级分类 ,type2:一级分类,type1:快速购买
		 */
		getCategory() {
			this.$api('category', {
				id: this.$Route.query.id
			}).then(res => {
				if (res.code === 1) {
					this.categoryType = parseInt(res.data.type);
					uni.setNavigationBarTitle({
						title: res.data.name
					});
				}
			});
		}
	}
};
</script>

<style lang="scss">
.category-box {
	height: 100%;
	flex: 1;
	overflow: hidden;
}
</style>
