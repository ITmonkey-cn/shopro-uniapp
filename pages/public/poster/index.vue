<template>
	<view>
		<sh-invite-poster v-if="posterType === 'userInvite'"></sh-invite-poster>
		<sh-goods-poster v-if="posterType === 'goods'"></sh-goods-poster>
		<sh-groupon-poster v-if="posterType === 'groupon'"></sh-groupon-poster>
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
			CustomBar: this.CustomBar
		};
	},
	computed: {},
	onLoad(options) {
		console.log('poset.index',options.posterType)
		this.posterType = options.posterType;
		switch (options.posterType) {
			case 'userInvite':
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
	methods: {}
};
</script>

<style lang="scss"></style>
