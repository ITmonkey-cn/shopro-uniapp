<template>
	<view></view>
</template>
<script>
import store from '@/shopro/store';
import { mapMutations, mapActions, mapState } from 'vuex';
export default {
	data() {
		return {};
	},
	async onLoad(options) {
		// #ifdef H5
		// 检测H5登录回调
		if (options?.token) {
			let that = this;
			uni.showLoading({
				title: '登录中...'
			});

			await that.getUserInfo(options.token);
			let lastPage = uni.getStorageSync('lastPage');
			if (lastPage) {
				uni.removeStorageSync('lastPage');
				window.location = lastPage;
			} else {
				uni.switchTab({
					url: '/'
				});
			}
		}
		// #endif
	},
	methods: {
		...mapActions(['getUserInfo'])
	}
};
</script>

<style></style>
