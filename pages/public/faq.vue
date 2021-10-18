<!-- 常见问题 -->
<template>
	<view class="faq-box u-p-30">
		<u-collapse event-type="close" :arrow="true" :accordion="true" arrowColor="#333" :headStyle="headStyle" :itemStyle="itemStyle">
			<u-collapse-item :title="index + 1 + '、' + item.title" v-for="(item, index) in faqList" :key="index">{{ item.content }}</u-collapse-item>
		</u-collapse>

		<!-- 更多 -->
		<u-loadmore v-if="faqList.length" height="80rpx" :status="loadStatus" icon-type="flower" color="#ccc" />
	</view>
</template>

<script>
export default {
	components: {},
	data() {
		return {
			headStyle: {
				color: '#a8700d'
			},
			itemStyle: {
				borderBottom: '1rpx solid #eee',
				padding: '20rpx 0'
			},
			faqList: [],
			loadStatus: 'loadmore', //loadmore-加载前的状态，loading-加载中的状态，nomore-没有更多的状态
			currentPage: 1,
			lastPage: 1
		};
	},
	computed: {},
	onLoad() {
		this.getFaqList();
		// 触底监听
		uni.$on('uOnReachBottom', () => {
			if (this.currentPage < this.lastPage) {
				this.currentPage += 1;
				this.getFaqList();
			}
		});
	},
	methods: {
		// 常见问题列表、
		getFaqList() {
			let that = this;
			that.loadStatus = 'loading';
			that.$http('other.faqList', {
				page: that.currentPage
			}).then(res => {
				if (res.code === 1) {
					that.faqList = [...that.faqList, ...res.data.data];
					that.lastPage = res.data.last_page;
					that.loadStatus = that.currentPage < res.data.last_page ? 'loadmore' : 'nomore';
				}
			});
		}
	}
};
</script>

<style lang="scss">
	.faq-box{
		background-color: #fff;
	}
</style>
