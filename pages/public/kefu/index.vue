<template>
	<view class="main">
		<navigator url="/pages/kefu/kefu?token=b3cc58e6-b433-48a3-8dc9-8a28e4036b62">打开客服会话窗口</navigator>
		<!-- 可选参数，用户的 `token` 和 固定客服ID `fixed_csr` -->
		<!-- 不传递 `token` 则自动建立游客身份 -->
		<!-- 后台转移过客服代表的客户，不支持指定 `fixed_csr`-->
		<!-- 本客服系统客户端，依赖FastAdmin插件：`workerman在线客服系统`无法单独使用，插件介绍/官网地址：https://www.fastadmin.net/store/kefu.html -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style>
.main{
	height: 50vh;
	display: flex;
	justify-content: center;
	align-items: center;
}
.main navigator{
	border: 1px solid #F2F2F2;
	padding: 20rpx;
	border-radius: 12rpx;
}
</style>
