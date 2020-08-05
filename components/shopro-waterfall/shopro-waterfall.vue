<template>
	<view class="shopro-waterfall">
		<view id="shopro-left-cloumn" class="u-cloumn"><slot name="left" :leftList="leftList"></slot></view>
		<view id="shopro-right-cloumn" class="u-cloumn"><slot name="right" :rightList="rightList"></slot></view>
	</view>
</template>

<script>
// 用法  <shopro-waterfall :listData="listData">
// <template v-slot:left="{ leftList }"></template>
// <template v-slot:right="{ rightList }"></template>
// </shopro-waterfall>
export default {
	name: 'shopro-waterfall',
	data() {
		return {
			leftList: [],
			rightList: [],
			tempList: [],
			children: []
		};
	},

	props: {
		listData: {
			// 瀑布流数据
			type: Array,
			default: () => []
		},
		addTime: {
			type: [Number, String],
			default: 200
		}
	},
	computed: {
		copyFlowList() {
			return this.cloneData(this.listData);
		}
	},
	watch: {
		copyFlowList(nVal, oVal) {
			// 取差值，即这一次数组变化新增的部分
			let startIndex = Array.isArray(oVal) && oVal.length > 0 ? oVal.length : 0;
			this.tempList = this.cloneData(nVal.slice(startIndex));
			this.splitData();
		}
	},
	mounted() {
		this.tempList = this.cloneData(this.copyFlowList);
		this.splitData();
	},
	methods: {
		async splitData() {
			if (!this.tempList.length) return;
			let leftRect = await this.$getRect('#shopro-left-cloumn');
			let rightRect = await this.$getRect('#shopro-right-cloumn');
			let item = this.tempList[0];
			if (!item) return;
			if (leftRect.height < rightRect.height) {
				this.leftList.push(item);
			} else if (leftRect.height > rightRect.height) {
				this.rightList.push(item);
			} else {
				if (this.leftList.length <= this.rightList.length) {
					this.leftList.push(item);
				} else {
					this.rightList.push(item);
				}
			}
			// 移除临时列表的第一项
			this.tempList.splice(0, 1);
			// 如果临时数组还有数据，继续循环
			if (this.tempList.length) {
				setTimeout(() => {
					this.splitData();
				}, this.addTime);
			}
		},
		// 复制而不是引用对象和数组
		cloneData(data) {
			return JSON.parse(JSON.stringify(data));
		}
	}
};
</script>

<style lang="scss"></style>
