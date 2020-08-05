<template>
	<view class="category-box">
		<!-- 三级导航 -->
		<sh-three-grades v-if="false"></sh-three-grades>
		<!--二级导航 -->
		<sh-two-grades v-else></sh-two-grades>
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
import shTwoGrades from './components/category/sh-two-grades.vue';
import shThreeGrades from './components/category/sh-three-grades.vue';
export default {
	components: {
		shTwoGrades,
		shThreeGrades
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
