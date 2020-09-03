<template>
	<view class="category-box">
		<!-- 三级分类 -->
		<sh-three-catgory v-if="false"></sh-three-catgory>
		<!-- 二级分类 -->
		<sh-two-catgory v-if="true"></sh-two-catgory>
		<!-- 一级分类-->
		<sh-one-catgory v-if="false"></sh-one-catgory>
		<!--直接购买，点餐 -->
		<sh-takeout-catgory v-if="false"></sh-takeout-catgory>
		<!-- 自定义底部导航 -->
		<shopro-tabbar></shopro-tabbar>
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
		return {};
	},
	computed: {},
	onLoad() {},
	methods: {}
};
</script>

<style lang="scss">
.category-box {
	height: 100%;
	flex: 1;
	overflow: hidden;
}
</style>
