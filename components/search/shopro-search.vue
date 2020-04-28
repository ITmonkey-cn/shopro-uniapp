<template>
 <view class="search-box x-c" @tap="jump('/pages/public/search')">
 	<text class="cuIcon-search"></text>
	<text class="search-val">搜索商品，共1111款好物</text>
 </view>
</template>

<script>
export default {
  components: {},
  data() {
    return {};
  },
computed: {},
methods: {
	jump(path){
		this.$Router.push({ path: path})
	}
},
 
};
</script>

<style lang="scss">
	.search-box{
		height:64rpx;
		background:#F5F5F5;
		border-radius: 32rpx;
		.cuIcon-search{
			font-size: 36rpx;
			margin-right: 20rpx;
		}
		.search-val{
			font-size: 30rpx;
			color: #999;
		}
	}
</style>
