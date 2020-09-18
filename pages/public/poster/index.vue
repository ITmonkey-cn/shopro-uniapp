<template>
	<view>
		<sh-invite-poster v-if="posterType === 'user'" :goodsId="goodsId" @getShareInfo="getShareInfo"></sh-invite-poster>
		<sh-goods-poster v-if="posterType === 'goods'" :goodsId="goodsId" @getShareInfo="getShareInfo"></sh-goods-poster>
		<sh-groupon-poster v-if="posterType === 'groupon'" :goodsId="goodsId" @getShareInfo="getShareInfo"></sh-groupon-poster>
		<!-- 登录提示 -->
		<shopro-login-modal></shopro-login-modal>
	</view>
</template>

<script>
import shInvitePoster from './children/sh-invite-poster.vue';
import shGoodsPoster from './children/sh-goods-poster.vue';
import shGrouponPoster from './children/sh-groupon-poster.vue';
export default {
	components: {
		shInvitePoster,
		shGoodsPoster,
		shGrouponPoster
	},
	data() {
		return {
			posterType: '',
			CustomBar: this.CustomBar,
			goodsId: 0
		};
	},
	computed: {},
	onLoad(options) {
		this.posterType = options.posterType;
		this.goodsId = options.id;
		switch (options.posterType) {
			case 'user':
				uni.setNavigationBarTitle({
					title: '邀请好友'
				});
				break;
			case 'goods':
				uni.setNavigationBarTitle({
					title: '商品海报'
				});
				break;
			case 'groupon':
				uni.setNavigationBarTitle({
					title: '拼团海报'
				});
				break;
			default:
				uni.setNavigationBarTitle({
					title: '海报'
				});
		}
	},
	methods: {
		getShareInfo(e) {
			this.shareInfo = e;
		}
	}
};
</script>

<style lang="scss"></style>
