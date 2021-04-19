<<<<<<< HEAD
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
		this.webviewPath = decodeURIComponent(this.$Route.query.webviewPath);
	}
};
</script>

<style></style>
=======
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
		this.webviewPath = decodeURIComponent(this.$Route.query.webviewPath);
	}
};
</script>

<style></style>
>>>>>>> 249bc3588ce88ed9a3079aee7eeff9b82ac50fe7
