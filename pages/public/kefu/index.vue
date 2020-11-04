<!-- 客服兼容 -->
<template>
	<view class="chat-template-box" v-if="showChat">
		<Chat v-if="isShoproChat"></Chat>
		<Wm v-if="!isShoproChat" :options="kefuOptions"></Wm>
		<!-- 登录提示 -->
		<shopro-login-modal></shopro-login-modal>
	</view>
</template>

<script>
import { mapMutations, mapActions, mapState, mapGetters } from 'vuex';
import Chat from './chat/index.vue';
import Wm from './wm/index.vue';
export default {
	components: {
		Chat,
		Wm
	},
	data() {
		return {
			isShoproChat: false,
			kefuOptions: null,
			showChat: false
		};
	},
	computed: {},
	onLoad(options) {
		this.kefuOptions = options;
		//判断客服;
		let addonsData = uni.getStorageSync('addons');
		let chatData = uni.getStorageSync('chat');
		if (chatData && chatData.type === 'shopro') {
			this.isShoproChat = true;
		} else {
			if (addonsData && addonsData.includes('kefu')) {
				this.isShoproChat = false;
			}
		}
		this.showChat = true;
	},
	methods: {}
};
</script>

<style lang="scss">
.chat-template-box {
	height: 100%;
	width: 100%;
	overflow: hidden;
}
</style>
