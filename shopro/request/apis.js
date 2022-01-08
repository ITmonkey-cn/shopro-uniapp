/**
 * 接口列表文件
 */
export default {

	/** 公共 ↓ **/
	common: {
		init: {
			url: "index/init",
			auth: false,
			method: "GET",
			// desc: '初始化数据',end
		},
		chat: {
			url: "chat.index/init",
			auth: false,
			method: "GET",
			// desc: '初始化聊天配置',
		},
		upload: {
			url: "index/upload",
			auth: true,
			method: "POST",
			// desc: '上传图片',
		},
		template: {
			url: "index/template",
			auth: false,
			method: "GET",
			// desc: '模板信息',end
		},
		custom: {
			url: "index/custom",
			auth: false,
			method: "GET",
			// desc: '自定义模板页面',
		},
		live: {
			url: "live",
			auth: false,
			method: "GET",
			// desc: '直播列表',
		},
		wxJssdk: {
			url: "wechat/jssdk",
			auth: false,
			method: "POST",
			// desc: '微信Jssdk',
		},
		syncPages: {
			url: "index/asyncPages",
			auth: false,
			method: "POST",
			// desc: '路由表 DEV开发模式下有效',end
		},
		debug: {
			url: "index/debugLog",
			auth: false,
			method: "POST",
			// desc: '上传DEBUG信息',
		},
		richText: {
			url: "index/richtext",
			auth: false,
			method: "GET",
			// desc: '富文本数据',
		},
		shareAdd: {
			url: "share/add",
			auth: false,
			method: "POST",
			// desc: '添加分享记录',
		},
		smsSend: {
			url: "sms/send",
			auth: false,
			method: "POST",
			// desc: '发送短信',
		},
	},

	/** 分类 ↓ **/
	category: {
		info: {
			url: "category/detail",
			auth: false,
			method: "GET",
			// desc: '分类类别',
		},
		detail: {
			url: "category",
			auth: false,
			method: "GET",
			// desc: '分类详情',
		},
		list: {
			url: "category/list",
			auth: false,
			method: "GET",
			// desc: '首页分类商品列表',
		}
	},


	/** 门店 ↓ **/
	store: {
		list: {
			url: "store/index",
			auth: true,
			method: "GET",
			// desc: '商户列表，不需要storeId',
		},
		info: {
			url: "store.store/index",
			auth: true,
			method: "GET",
			// desc: '商户信息',
		},
		order: {
			url: "store.order/index",
			auth: true,
			method: "GET",
			// desc: '商户订单',
		},
		orderDetail: {
			url: "store.order/detail",
			auth: true,
			method: "GET",
			// desc: '订单详情',
		},
		orderSend: {
			url: "store.order/send",
			auth: true,
			method: "POST",
			// desc: '订单发货',
		},
		orderConfirm: {
			url: "store.order/confirm",
			auth: true,
			method: "POST",
			// desc: '核销订单',
		},
		apply: {
			url: "store.apply/apply",
			auth: true,
			method: "POST",
			// desc: '申请门店',
		},
		shopInfo: {
			url: "store.apply/info",
			auth: true,
			method: "POST",
			// desc: '门店信息',
		}
	},

	/** 商品 ↓ **/
	goods: {
		lists: {
			url: "goods/lists",
			auth: false,
			method: "GET",
			// desc: '商品列表',
		},
		seckillList: {
			url: "goods/seckillList",
			auth: false,
			method: "GET",
			// desc: '秒杀列表',
		},
		activity: {
			url: "goods/activity",
			auth: false,
			method: "GET",
			// desc: '活动商品',
		},
		myGroupon: {
			url: "activity_groupon/myGroupon",
			auth: true,
			method: "GET",
			// desc: '我的拼团',
		},
		grouponDetail: {
			url: "activity_groupon/detail",
			auth: false,
			method: "GET",
			// desc: '拼团详情',
		},
		grouponItem: {
			url: "activity_groupon/index",
			auth: false,
			method: "GET",
			// desc: '拼购列表',
		},
		grouponList: {
			url: "goods/grouponList",
			auth: false,
			method: "GET",
			// desc: '拼团商品列表',
		},
		detail: {
			url: "goods/detail",
			auth: false,
			method: "GET",
			// desc: '商品详情',
		},
		favorite: {
			url: "goods/favorite",
			auth: true,
			method: "POST",
			// desc: '商品收藏',
		},

		storeAddress: {
			url: "goods/store",
			auth: true,
			method: "GET",
			// desc: '商品支持的自提点',
		},
		scoreList: {
			url: "score_goods_sku_price/index",
			auth: false,
			method: "GET",
			// desc: '积分商品列表',
		},
		scoreDetail: {
			url: "score_goods_sku_price/detail",
			auth: false,
			method: "GET",
			// desc: '积分详情',
		},
		commentList: {
			url: "goods_comment/index",
			auth: false,
			method: "GET",
			// desc: '商品评论列表',
		},
		commentType: {
			url: "goods_comment/type",
			auth: false,
			method: "GET",
			// desc: '商品评论分类',
		},
	},

	/** 用户 ↓ **/
	user: {

		accountLogin: {
			url: "user/accountLogin",
			auth: false,
			method: "POST",
			// desc: '账号密码登录',
		},

		smsLogin: {
			url: "user/smsLogin",
			auth: false,
			method: "POST",
			// desc: '短信登录',
		},

		register: {
			url: "user/register",
			auth: false,
			method: "POST",
			// desc: '注册',
		},

		forgotPwd: {
			url: "user/forgotPwd",
			auth: false,
			method: "POST",
			// desc: '重置密码',
		},

		bindMobile: {
			url: "user/bindMobile",
			auth: true,
			method: "POST",
			// desc: '修改手机号',
		},

		changePwd: {
			url: "user/changePwd",
			auth: true,
			method: "POST",
			// desc: '修改密码',
		},

		info: {
			url: "user",
			auth: true,
			method: "GET",
			// desc: '用户信息',end
		},

		profile: {
			url: "user/profile",
			auth: true,
			method: "POST",
			// desc: '修改用户信息',end
		},
		logout: {
			url: "user/logout",
			auth: true,
			method: "POST",
			// desc: '退出登录',end
		},

		getWxMiniProgramSessionKey: {
			url: "user/getWxMiniProgramSessionKey",
			auth: false,
			method: "POST",
			// desc: '获取用户session_key',
		},

		wxMiniProgramOauth: {
			url: "user/wxMiniProgramOauth",
			auth: false,
			method: "POST",
			// desc: '微信小程序登录',
		},

		wxOpenPlatformOauth: {
			url: "user/wxOpenPlatformOauth",
			auth: false,
			method: "POST",
			// desc: '微信APP登录',
		},

		thirdOauthInfo: {
			url: "user/thirdOauthInfo",
			auth: true,
			method: "GET",
			// desc: '第三方绑定信息',
		},
		unbindThirdOauth: {
			url: "user/unbindThirdOauth",
			auth: true,
			method: "POST",
			// desc: '解绑信息',
		},

		signList: {
			url: "user_sign/index",
			auth: true,
			method: "GET",
			// desc: '签到记录',
		},
		sign: {
			url: "user_sign/sign",
			auth: true,
			method: "POST",
			// desc: '签到',
		},
		messageIds: {
			url: "notification/template",
			auth: false,
			method: "GET",
			// desc: '订阅消息模板ids',
		},
		favoriteList: {
			url: "goods/favoriteList",
			auth: true,
			method: "GET",
			// desc: '商品收藏列表',
		},
		viewList: {
			url: "goods/viewList",
			auth: true,
			method: "GET",
			// desc: '足迹列表',end
		},
		viewDelete: {
			url: "goods/viewDelete",
			auth: true,
			method: "POST",
			// desc: '删除足迹',end
		},
		userData: {
			url: "user/userData",
			auth: true,
			method: "GET",
			// desc: '用户其他信息',
		},
		appleIdOauth: {
			url: "user/appleIdOauth",
			auth: false,
			method: "POST",
			// desc: 'appleId授权',
		}
	},

	/** 位置 ↓ **/
	address: {
		area: {
			url: "address/area",
			auth: false,
			method: "GET",
			// desc: '省市区',
		},
		list: {
			url: "address",
			auth: true,
			method: "GET",
			// desc: '地址列表',
		},
		edit: {
			url: "address/edit",
			auth: true,
			method: "POST",
			// desc: '修改地址',
		},
		defaults: {
			url: "address/defaults",
			auth: true,
			method: "GET",
			// desc: '默认地址',
		},
		info: {
			url: "address/info",
			auth: true,
			method: "GET",
			// desc: '地址详情',
		},
		del: {
			url: "address/del",
			auth: true,
			method: "POST",
			// desc: '删除',
		},
	},

	/** 常见问题 ↓ **/
	other: {
		faqList: {
			url: "faq",
			auth: false,
			method: "GET",
			// desc: '常见问题列表',
		},
		feedbackType: {
			url: "feedback/type",
			auth: true,
			method: "GET",
			// desc: '意见反馈类型',
		},
		feedbackAdd: {
			url: "feedback/add",
			auth: true,
			method: "POST",
			// desc: '提交意见',
		},
		commentAdd: {
			url: "comment/submit",
			auth: true,
			method: "POST",
			// desc: '提交评论',
		},
		commentList: {
			url: "comment/list",
			auth: true,
			method: "GET",
			// desc: '评论列表',
		}
	},

	/** 购物车 ↓ **/
	cart: {
		index: {
			url: "cart",
			auth: true,
			method: "POST",
			// desc: '购物车商品列表',
		},
		add: {
			url: "cart/add",
			auth: true,
			method: "POST",
			// desc: '添加购物车',
		},

		edit: {
			url: "cart/edit",
			auth: true,
			method: "POST",
			// desc: '编辑购物车',
		},
	},

	/** 订单 ↓ **/
	order: {
		index: {
			url: "order/index",
			auth: true,
			method: "GET",
			// desc: '订单列表',
		},
		pre: {
			url: "order/pre",
			auth: true,
			method: "POST",
			// desc: '预备提交订单',
		},
		createOrder: {
			url: "order/createOrder",
			auth: true,
			method: "POST",
			// desc: '提交订单',
		},
		detail: {
			url: "order/detail",
			auth: true,
			method: "GET",
			// desc: '订单详情',
		},
		itemDetail: {
			url: "order/itemDetail",
			auth: true,
			method: "GET",
			// desc: '订单商品详情',
		},
		confirm: {
			url: "order/confirm",
			auth: true,
			method: "POST",
			// desc: '确认收货',
		},
		cancel: {
			url: "order/cancel",
			auth: true,
			method: "POST",
			// desc: '取消订单',
		},
		comment: {
			url: "order/comment",
			auth: true,
			method: "POST",
			// desc: '评价商品',
		},
		coupons: {
			url: "order/coupons",
			auth: true,
			method: "POST",
			// desc: '商品可用优惠券',
		},
		aftersale: {
			url: "order_aftersale/aftersale",
			auth: true,
			method: "POST",
			// desc: '申请售后',
		},
		aftersaleList: {
			url: "order_aftersale/index",
			auth: true,
			method: "GET",
			// desc: '售后列表',
		},
		aftersaleDetail: {
			url: "order_aftersale/detail",
			auth: true,
			method: "GET",
			// desc: '售后列表详情',
		},
		deleteOrder: {
			url: "order/delete",
			auth: true,
			method: "POST",
			// desc: '删除订单',
		},
		deleteAftersaleOrder: {
			url: "order_aftersale/delete",
			auth: true,
			method: "POST",
			// desc: '删除售后订单',
		},
		cancelAftersaleOrder: {
			url: "order_aftersale/cancel",
			auth: true,
			method: "POST",
			// desc: '取消售后订单',
		},
		expressList: {
			url: "order_express/index",
			auth: true,
			method: "GET",
			// desc: '包裹列表',
		},
		expressDetail: {
			url: "order_express/detail",
			auth: true,
			method: "GET",
			// desc: '包裹详情',
		},
		itemDetail: {
			url: "order/itemDetail",
			auth: true,
			method: "GET",
			// desc: '订单商品详情',
		}
	},

	/** 支付金钱 ↓ **/
	money: {
		prepay: {
			url: "pay/prepay",
			auth: true,
			method: "POST",
			// desc: '发起支付',
		},
		walletApply: {
			url: "user_wallet_apply/apply",
			auth: true,
			method: "POST",
			// desc: '申请提现',end
		},
		walletRule: {
			url: "user_wallet_apply/rule",
			auth: true,
			method: "GET",
			// desc: '提现规则',end
		},
		walletLog: {
			url: "user_wallet_log",
			auth: true,
			method: "GET",
			// desc: '钱包,积分明细',end
		},
		bankInfo: {
			url: "user_bank/info",
			auth: true,
			method: "GET",
			// desc: '银行卡信息',end
		},
		bankEdit: {
			url: "user_bank/edit",
			auth: true,
			method: "POST",
			// desc: '编辑银行卡信息',end
		},
		withdrawLog: {
			url: "user_wallet_apply/index",
			auth: true,
			method: "GET",
			// desc: '提现记录',end
		},
		recharge: {
			url: "trade_order/recharge",
			auth: true,
			method: "POST",
			// desc: '充值'
		},
		rechargeLog: {
			url: "trade_order/index", 
			auth: true,
			method: "GET",
			// desc: '充值记录'
		},
		rechargeDetail: {
			url: "trade_order/detail",
			auth: true,
			method: "GET",
			// desc: '充值订单详情'
		}
	},

	/** 优惠券 ↓ **/
	coupons: {
		list: {
			url: "coupons",
			auth: false,
			method: "GET",
			// desc: '个人中心优惠券列表',
		},
		templateList: {
			url: "coupons/lists",
			auth: false,
			method: "GET",
			// desc: '首页优惠券',
		},
		get: {
			url: "coupons/get",
			auth: true,
			method: "GET",
			// desc: '领取',
		},
		detail: {
			url: "coupons/detail",
			auth: true,
			method: "GET",
			// desc: '购物券详情',
		},
		goods: {
			url: "coupons/goods",
			auth: false,
			method: "GET",
			// desc: '适用商品',
		}
	},

	/** 分销 ↓ **/
	commission: {
		auth: {
			url: "commission.agent/info",
			auth: true,
			method: "GET",
			// desc: '分销身份鉴权',
		},
		log: {
			url: "commission.log/index",
			auth: true,
			method: "GET",
			// desc: '分销动态',
		},
		goods: {
			url: "commission.goods/index",
			auth: true,
			method: "GET",
			// desc: '分销商品',
		},
		ranking: {
			url: "commission.agent/ranking",
			auth: true,
			method: "GET",
			// desc: '分销商排行榜',
		},
		form: {
			url: "commission.agent/agentForm",
			auth: true,
			method: "GET",
			// desc: '申请成为分销商表单',
		},
		apply: {
			url: "commission.agent/applyForm",
			auth: true,
			method: "POST",
			// desc: '申请成为分销商',
		},
		team: {
			url: "commission.agent/team",
			auth: true,
			method: "GET",
			// desc: '我的团队',
		},
		share: {
			url: "share/index",
			auth: true,
			method: "GET",
			// desc: '分享记录',
		},
		orderLog: {
			url: "commission.order/index",
			auth: true,
			method: "GET",
			// desc: '分销订单',
		},
		rewardLog: {
			url: "commission.reward/index",
			auth: true,
			method: "GET",
			// desc: '佣金记录',
		},
		lv: {
			url: "commission.agent/level",
			auth: true,
			method: "GET",
			// desc: '佣金记录',
		}
	}


};
