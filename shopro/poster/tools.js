export default {
	async checkImgHttp(imgPath, type) {
		let res = await this.getImageInfo_PromiseFc(imgPath)
		let newPath = '';
		if (!res) {
			uni.hideLoading()
			switch (type) {
				case 'avatar':
					console.log('%cerr:海报头像图片错误: ' + imgPath, 'color:green;background:yellow');
					break;
				case 'bgImage':
					console.log('%cerr:海报背景图片错误: ' + imgPath, 'color:green;background:yellow');
					break;
				case 'wxCode':
					console.log('%cerr:海报微信二维码图片错误: ' + imgPath, 'color:green;background:yellow');
					break;
				case 'goodsImage':
					console.log('%cerr:海报商品图片错误: ' + imgPath, 'color:green;background:yellow');
					break;
				default:
					break;
			}
		} else {
			let pathArr = imgPath.split('://');
			// #ifdef H5
			let ishttps = 'https:' == window.location.protocol ? true : false;
			ishttps ? (pathArr[0] = 'https') : (pathArr[0] = 'http');
			// #endif
			// #ifdef MP-WEIXIN
			pathArr[0] = 'https'
			// #endif
			newPath = pathArr.join('://');
		}

		return newPath;
	},
	// 检测图片是否可用
	getImageInfo_PromiseFc(imgPath) {
		return new Promise((rs, rj) => {
			imgPath = this.checkMPUrl(imgPath);
			uni.getImageInfo({
				src: imgPath,
				success: res => {
					rs(1);
				},
				fail: err => {
					console.log(err)
					rs(0);
				}
			})
		});
	},
	// 微信头像
	checkMPUrl(url) {
		// #ifdef MP
		if (
			url.substring(0, 4) === 'http' &&
			url.substring(0, 5) !== 'https' &&
			url.substring(0, 12) !== 'http://store' &&
			url.substring(0, 10) !== 'http://tmp' &&
			url.substring(0, 10) !== 'http://usr'
		) {
			url = 'https' + url.substring(4, url.length);
		}
		// #endif
		return url;
	},




	/**
	 * 相对比例
	 * @param {Object} bgObj -  背景图片数据对象
	 * @param {Number} num -  需要计算的绘制模块数值
	 */
	getScale(bgObj, num = 0) {
		return Number(bgObj.width * (num / bgObj.width).toFixed(2))
	},



	/**
	 * 绘制序列
	 * @param {Object} bgObj -  背景图片数据对象
	 * @param {Array} drawArr -  绘制元素数组对象
	 */
	initDrawArray(bgObj, drawArr) {
		const that = this;
		let arr = []
		drawArr.forEach(item => {
			switch (item.type) {
				case 'text':
					arr.push({
						type: 'text',
						text: item.text, //文本
						size: that.getScale(bgObj, item.size) || 50, //大小
						color: item.color || 'black', //颜色
						alpha: item.alpha || 1, //透明度
						textAlign: item.textAlign || 'left', //文字x对齐方式: 'left'、'middle'、'right'
						textBaseline: item.textBaseline ||
							'middle', //文字y对齐方式: 'top'、'bottom'、'middle'、'normal'
						dx: that.getScale(bgObj, item.dx) || 0, //文字x轴位置
						dy: that.getScale(bgObj, item.dy + item.size) || 0, //文字y轴位置
						[item.lineFeed ? 'lineFeed' : '']: { //设置换行
							maxWidth: item.lineFeed?.maxWidth && that.getScale(bgObj, item.lineFeed
									.maxWidth) || bgObj
								.width, //最大宽度
							lineHeight: item.lineFeed?.lineHeight && that.getScale(bgObj, item
								.lineFeed.lineHeight) || 50, //行高
							lineNum: item.lineFeed?.lineNum || -1, // 最多行数，小于0为无限
							dx: item.lineFeed?.dx || -1, //非第一行文字位置，小于0为默认位置
						},
						infoCallBack: (textLength) => { //回调函数，返回文本信息
							if (item.isBgCenter) {
								return {
									dx: (bgObj.width - textLength) / 2,
								}
							}
							return {}
						},
						[item.lineThrough ? 'lineThrough' : '']: { // 设置删除线，默认为字体样式
							width: item.lineThrough?.width || item.size / 10,
							style: item.lineThrough?.style || item.color,
							alpha: item.lineThrough?.alpha || 1,
							cap: item.lineThrough?.cap || 'butt',
						},
						fontStyle: item.fontStyle || 'normal', // 设置字体，跟随系统默认
						fontVariant: item.fontVariant || 'normal',
						fontWeight: item.fontWeight || 'normal',
						fontFamily: item.fontFamily || 'sans-serif',
					})
					break;
				case 'qrcode':
					arr.push({
						type: 'qrcode',
						text: String(item.text || '') || '', // 生成内容
						size: Number(that.getScale(bgObj, item.size) || 0) || 200, // 二维码大小
						background: String(item.background || '') || '#ffffff', // 背景色
						foreground: String(item.foreground || '') || '#000000', // 前景色
						correctLevel: Number(item.correctLevel || 0) || 3, // 容错级别
						image: String(item.image || '') || '', // 二维码图标
						imageSize: Number(that.getScale(bgObj, item.imageSize) || 0) || 40, // 二维码图标大小
						dx: item.isBgCenter ? (bgObj.width - item.size) / 2 : Number(that.getScale(
							bgObj, item.dx) || 0) || 0,
						dy: Number(that.getScale(bgObj, item.dy) || 0) || 0, // y轴距离

					})
					break;
				case 'image':
					arr.push({
						type: 'image',
						url: this.checkImgHttp(item.url, item.name), // 网络图片路径
						dWidth: Number(that.getScale(bgObj, item.dWidth) || 0) || 100, //绘制图像的宽度，允许缩放
						dHeight: Number(that.getScale(bgObj, item.dHeight) || 0) || 100, //绘制图像的高度，允许缩放
						sWidth: Number(that.getScale(bgObj, item.sWidth) || 0) || 100, //绘制图像的宽度，允许缩放
						sHeight: Number(that.getScale(bgObj, item.sHeight) || 0) || 100, //绘制图像的高度，允许缩放
						dx: Number(that.getScale(bgObj, item.dx) || 0) || 0, // x轴距离
						dy: Number(that.getScale(bgObj, item.dy) || 0) || 0, // y轴距离
						sx: Number(that.getScale(bgObj, item.sx) || 0) || 0,
						sy: Number(that.getScale(bgObj, item.sy) || 0) || 0,
						[item.circleSet ? 'circleSet' : '']: { //圆形设置
							r: Number(item.circleSet?.r && that.getScale(bgObj, item.circleSet
								.r) || 0),
							x: Number(item.circleSet?.x && that.getScale(bgObj, item.circleSet
								.x) || 0),
							y: Number(item.circleSet?.y && that.getScale(bgObj, item.circleSet
								.y) || 0),
						},
						[item.roundRectSet ? 'roundRectSet' : '']: { //圆角设置
							r: Number(item.roundRectSet?.r && that.getScale(bgObj, item
								.roundRectSet.r) || 0),
						},
						infoCallBack: (imgInfo) => { //回调函数，返回图片信息
							if (item.isBgCenter) {
								return {
									dx: (bgObj.width - item.dWidth) / 2,
								}
							}
						},
					})
					break;
				default:
					_app.log('暂无次类型');
					break;
			}
		})
		return arr
	}



}
