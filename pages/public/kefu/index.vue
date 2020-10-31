<!-- 客服兼容 -->
<template>
	<view class="chat-template-box">
		<!-- <chat v-if="false"></chat>
		<wm-chat v-else></wm-chat> -->
	</view>
</template>

<script>
// import wmChat from './wm/wm.vue';
// import Chat from './chat/chat.vue';
import { mapMutations, mapActions, mapState, mapGetters } from 'vuex';
export default {
	components: {
		// wmChat,
		// Chat 
	},
	data() {
		return {};
	},
	computed: {
		...mapState({
			chatData: state => state.init.initData.chat,
			addonsData: state => state.init.initData.addonsData
		}),
		isShoproChat() {
			if (this.chatData && this.chatData.type === 'shopro') {
				return true;
			} else {
				if (this.addonsData && this.addonsData.includes('kefu')) {
					return true;
				}
			}

			return false;
		}
	},
	onLoad() {},
	methods: {}
};
</script>

<style lang="scss">
.chat-template-box {
	height: 100%;
	width: 100%;
}
</style>
