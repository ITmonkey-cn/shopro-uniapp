/*
 * @Date: 2020-05-23 11:03:21
 * @LastEditors: 648050824@qq.com
 * @LastEditTime: 2020-06-01 16:42:08
 * 
 */

/**
 * fn:检测方法。
 * parma(value):需要检测的数据
 * parma(length):检测动态条件。
 * parma(errorMsg):检测的错误结果信息。
 */
const strategies = {
	// 不能为空
	isNoEmpty: (value, errorMsg) => {
		if (value === '') {
			return errorMsg;
		}
	},
	// 去除首尾空格，不能为空。
	isNoSpace: (value, errorMsg) => {
		if (value.trim() === '') {
			return errorMsg;
		}
	},
	// 去除首尾空格，长度
	minLength: (value, length, errorMsg) => {
		if (value.trim().length < length) {
			return errorMsg;
		}
	},
	// 最大长度
	maxLength: (value, length, errorMsg) => {
		if (value.length > length) {
			return errorMsg;
		}
	},
	// 手机号
	isMobile: (value, errorMsg) => {
		if (!/^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|17[7]|18[0|1|2|3|5|6|7|8|9])\d{8}$/.test(value)) {
			return errorMsg;
		}
	}
}

class Validator {
	constructor() {
		this.cache = []
	}
	/**
	 * fn：添加检测规则
	 * parma(value):表单项。
	 * parma(rules):规则数组。
	 */
	add(value, rules) {
		for (let i = 0, rule; rule = rules[i++];) {
			let strategyAry = rule.strategy.split(':')
			let errorMsg = rule.errorMsg
			this.cache.push(() => {
				let strategy = strategyAry.shift()
				strategyAry.unshift(value)
				strategyAry.push(errorMsg)
				return strategies[strategy](...strategyAry)
			})

		}

	}
	/**
	 * fn:按规则数组，检测数据。
	 * 
	 */
	check() {
		for (let i = 0, validatorFunc; validatorFunc = this.cache[i++];) {
			let errorMsg = validatorFunc()
			if (errorMsg) {
				console.log(errorMsg)
				return errorMsg

			}
		}
	}
}



// module.exports = Validator
export default Validator
