/**
 * Validate v1.0.0 通用验证
 */
import test from '@/uview-ui/libs/function/test.js'
export default {

	// 手机号
	mobile: [{
			required: true,
			message: '请输入手机号',
			trigger: ['change', 'blur']
		},
		{
			validator: (rule, value, callback) => {
				return test.mobile(value);
			},
			message: '手机号码格式不正确',
			trigger: ['change', 'blur']
		}
	],
	// 账户
	account: [{
		required: true,
		min: 5,
		message: '请输入账号',
		trigger: ['change', 'blur']
	}],

	// 短信验证码
	code: [{
		required: true,
		min: 4,
		message: '请输入验证码',
		trigger: ['change', 'blur']
	}],

	// 密码
	password: [{
			required: true,
			message: '请输入密码',
			trigger: ['change', 'blur']
		},
		{
			pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]+\S{5,12}$/,
			message: '需同时含有字母和数字，长度在6-12之间',
			trigger: ['change', 'blur']
		}
	],

	// 真实姓名
	realName: [{
			required: true,
			message: '请输入持卡人姓名',
			trigger: ['change', 'blur']
		},
		{
			validator: (rule, value, callback) => {
				return test.chinese(value);
			},
			message: '请输入汉字',
			trigger: ['change', 'blur']
		}
	],

	// 开户行
	bankName: [{
			required: true,
			message: '请输入开户行',
			trigger: ['change', 'blur']
		},
		{
			validator: (rule, value, callback) => {
				return test.chinese(value);
			},
			message: '请输入汉字',
			trigger: ['change', 'blur']
		}
	],

	// 银行卡号
	bankCode: [{
			required: true,
			message: '请输入银行卡号',
			trigger: ['change', 'blur']
		},
		{
			validator: (rule, value, callback) => {
				return test.number(value);
			},
			message: '请输入正确账号',
			trigger: ['change', 'blur']
		}
	],

	// 支付宝账号
	alipayAccount: [{
			required: true,
			message: '请输入支付账号',
			trigger: ['change', 'blur']
		},
		{
			validator: (rule, value, callback) => {
				let isRange = test.rangeLength(value, [6, 30]);
				let isAsterisk = test.contains(value, '*');
				
				return isRange && !isAsterisk;
			},
			message: '请输入正确账号',
			trigger: ['change', 'blur']
		}
	],
}
