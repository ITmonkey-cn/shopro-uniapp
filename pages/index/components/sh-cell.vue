<template>
	<view class="sh-user-menu-box u-m-b-10">
		<u-cell-group class="menu-list-box">
			<u-cell-item
				class="menu-item u-flex u-row-between"
				v-for="(item, index) in list"
				:key="index"
				@tap="jump(item)"
				:icon="item.image"
				:title="item.name"
				:titleStyle="{ color: '#999999', fontSize: '26rpx' }"
				:icon-style="{ width: '36rpx', height: '36rpx' }"
			></u-cell-item>
		</u-cell-group>
	</view>
</template>

<script>
/**
 *shCell-功能列表
 * @property {Array} list - 列表信息
 */
export default {
	components: {},
	data() {
		return {};
	},
	props: {
		list: {
			type: Array,
			default: () => {
				return [];
			}
		}
	},
	computed: {},
	methods: {
		jump(data) {
			this.$tools.routerTo(data.path);
		}
	}
};
</script>

<style lang="scss" scoped></style>
