/**
 * Share v1.0.0
 * @Class Share
 * @description shopro-share 1.0.0 分享方法
 * @Author lidongtony
 * @Date 2021-04-19
 * @Email lidongtony@qq.com
 */

import store from "@/shopro/store";
import $platform from "@/shopro/platform";
// #ifdef H5
import wxsdk from "@/shopro/wechat/sdk";
// #endif
export default {

	// 设置分享信息
	setShareInfo(scene = {
		title: '', // 自定义分享标题
		desc: '',  // 自定义描述
		image: '', // 自定义分享图片
		params: {} // 自定义分享参数
	}) {
		let that = this;
		let shareInfo = {
			title: '', 		// 分享标题
			desc: '', 		// 描述
			image: '', 		// 分享图片
			path: '', 		// 分享路径
			copyLink: '', 	// 复制链接
			query: ''		// 分享参数
		}
		let shareConfig = store.state.shopro.config.share;
		let shopConfig = store.state.shopro.config.shop;
		if (shopConfig?.domain === '' || shareConfig.title === '' || shareConfig.image === '') {
			throw '请在商城配置中设置商城域名和分享信息'
		}

		// 设置自定义分享信息
		shareInfo.title = scene.title !== '' ? scene.title : shareConfig.title;
		shareInfo.image = scene.image !== '' ? scene.image : shareConfig.image;
		shareInfo.desc = scene.desc !== '' ? scene.desc : '';
		
		// 自动拼接分享用户参数
		let query = that.setShareQuery(scene.params);
		// #ifdef MP
		shareInfo.path = `/pages/index/index?${query}`;
		// #endif
		// #ifndef MP
		shareInfo.path = `${store.state.shopro.config.shop?.domain}?${query}`;
		// #endif
		shareInfo.copyLink = `${store.state.shopro.config.shop?.domain}?${query}`;
		shareInfo.query = query;
		// #ifdef H5
		if($platform.get() === 'wxOfficialAccount') {
			wxsdk.share(shareInfo);
		}
		// #endif

		return shareInfo;
	},

	// 自定义分享参数拼接: 由于小程序码长度限制(B码最大32位长度),为了确保分享参数最大可扩展性，使用spm方法拼接 shareUserId.page.pageId.platform.from ----例 spm=88888888.3.1666666.3.2 即为ID为88888888用户通过微信网页平台生成了拼团ID为1666666的拼团分享海报
	setShareQuery(params) {
		let shareUserId = '0'; // 设置分享者用户ID
		if (params.shareId === undefined) {
			if (store.state.user.isLogin) {
				shareUserId = store.state.user.userInfo.id;
			}
		}
		let page = '1'; // 页面类型: 1=首页(默认),2=商品,3=拼团...按需扩展
		if (params.page !== undefined) {
			page = params.page;
		}
		let pageId = '0'; // 设置页面ID: 如商品ID、拼团ID等
		if (params.pageId !== undefined) {
			pageId = params.pageId;
		}
		let platform = ['H5', 'wxOfficialAccount', 'wxMiniProgram', 'App'].indexOf($platform.get()) +
		1; // 设置分享的平台渠道: 1=H5,2=微信公众号网页,3=微信小程序,4=App,...按需扩展
		let from = '1'; // 设置分享方式: 1=直接转发,2=海报,3=链接,...按需扩展
		if (params.from !== undefined) {
			from = params.from;
		}
		//spmParam = ...  可按需扩展
		return `spm=${shareUserId}.${page}.${pageId}.${platform}.${from}`;
	},
	getShareQuery(spm) {
		let shareParams = {};
		let shareParamsArray = spm.split('.');
		if(shareParamsArray[0] != '0') {
			shareParams.shareUserId = shareParamsArray[0];
		}
		switch(shareParamsArray[1]) {
			case '1':
			// 默认首页不跳转
			break;
			case '2':
			shareParams.page = '/pages/goods/detail';
			break;
			case '3':
			shareParams.page = '/pages/activity/groupon/detail';
			break;
		}
		if(shareParamsArray[2] !== '0') {
			shareParams.pageId = shareParamsArray[2];
		}
		shareParams.platform = shareParamsArray[3];
		shareParams.from = shareParamsArray[4];
		return shareParams;
	}
}
