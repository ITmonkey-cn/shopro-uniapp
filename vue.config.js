const TransformPages = require('uni-read-pages')
const tfPages = new TransformPages({
	includes: ['path', 'aliasPath', 'name', 'meta', 'title'] //需要获取包涵的字段
})
module.exports = {
	configureWebpack: {
		plugins: [
			new tfPages.webpack.DefinePlugin({
				ROUTES: JSON.stringify(tfPages.routes)
			})
		]
	},
	css: {
		sourceMap: true,
		loaderOptions: {
			sass: {
				prependData: `@import "~@/static/style/variable.scss";` //scss需要加分号
			}
		}
	},

	// chainWebpack: (config) => {
	// 	// 发行或运行时启用了压缩时会生效,在package.json中配置压缩
	// 	config.optimization.minimizer('terser').tap((args) => {
	// 		const compress = args[0].terserOptions.compress
	// 		// 非 App 平台移除 console 代码(包含所有 console 方法，如 log,debug,info...)
	// 		compress.drop_console = true
	// 		compress.pure_funcs = [
	// 			'__f__', // App 平台 vue 移除日志代码
	// 			// 'console.debug' // 可移除指定的 console 方法
	// 		]
	// 		return args
	// 	})
	// }
}
