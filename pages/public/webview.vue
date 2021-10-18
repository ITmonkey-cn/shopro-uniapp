<!-- 外链,webview -->
<template>
	<view><web-view :src="webviewPath"></web-view></view>
</template>

<script>
export default {
	data() {
		return {
			webviewPath: ''
		};
	},
	onLoad() {
		this.webviewPath = this.$Route.query.webviewPath;
	}
};
</script>

<style></style>
