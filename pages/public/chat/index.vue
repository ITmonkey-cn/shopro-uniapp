<!-- 客服兼容 -->
<template>
	<view class="chat-template-box" v-if="showChat">
		<Chat v-if="isShoproChat"></Chat>
		<Wm v-if="!isShoproChat" :options="kefuOptions"></Wm>
	</view>
</template>

<script>
import { mapMutations, mapActions, mapState, mapGetters } from 'vuex';
import Chat from './shopro/index.vue';
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
	computed: {
		...mapState({
			addons: ({ shopro }) => shopro.config?.addons, //插件配置
			chatInfo: ({ shopro }) => shopro.config?.chat //客服配置
		})
	},
	onLoad(options) {
		this.kefuOptions = options;
		//判断客服;
		if (this.chatInfo && this.chatInfo.type === 'shopro') {
			this.isShoproChat = true;
		} else {
			if (this.addons && this.addons.includes('kefu')) {
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
