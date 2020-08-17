<template>
	<view class="page_box store-list-wrap">
		<view class="head_box"></view>
		<view class="content_box">
			<label class="radio">
				<view class="store-item x-bc">
					<view class="item-left">
						<text class="store-title">龙宇国际店</text>
						<text class="store-content">郑东新区运动场东路龙宇国际A座</text>
					</view>

					<radio :checked="true" :class="{'checked':true}"></radio>
					<text></text>
				</view>
			</label>
		</view>
		<view class="foot_box"></view>
	</view>
</template>

<script>
export default {
	components: {},
	data() {
		return {};
	},
	computed: {},
	onLoad() {},
	methods: {}
};
</script>

<style lang="scss"></style>
