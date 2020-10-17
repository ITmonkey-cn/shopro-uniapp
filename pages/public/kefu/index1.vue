<!-- FastAdmin在线客服插件不是开源产品，所有文字、图片、样式、风格等版权归在线客服作者所有，如有复制、仿冒、抄袭、盗用，FastAdmin和在线客服作者将追究法律责任 -->
<template>
	<view>
		<view class="kefu_container">
			<view v-if="errorTips" class="error_tips">{{ errorTips }}</view>
			<view v-if="config.announcement && errorTips == ''" class="notice x-start">
				<text>{{ config.announcement }}</text>
				<text @tap="close_notice" class="close_notice cuIcon-roundclose y-end"></text>
			</view>

			<!--留言板 -->
			<view v-if="showLeaveMessage" class="leave_message">
				<form>
					<view class="form-group">
						<label for="c-name" class="control-label">
							<view class="label-title">姓名</view>
							<input
								type="text"
								@input="leave_message"
								name="name"
								v-model="leaveMessage.name"
								class="form-control"
								id="c-name"
								placeholder-style="color:#B1B3C7"
								placeholder="请输入您的姓名"
							/>
						</label>
					</view>
					<view class="form-group">
						<label for="c-contact" class="control-label"><view class="label-title">联系方式</view></label>
						<input
							type="text"
							@input="leave_message"
							name="contact"
							v-model="leaveMessage.contact"
							class="form-control"
							id="c-contact"
							placeholder-style="color:#B1B3C7"
							placeholder="请输入手机/QQ/微信号"
						/>
					</view>
					<view class="form-group">
						<label for="c-message" class="control-label"><view class="label-title">留言内容</view></label>
						<textarea
							rows="5"
							@input="leave_message"
							name="message"
							v-model="leaveMessage.message"
							class="form-control"
							id="c-message"
							style="height: 240rpx;"
							placeholder-style="color:#B1B3C7"
							placeholder="遇到的问题、所需服务、产品等，我们将尽快与您取得联系"
						></textarea>
					</view>
					<button @tap="post_leave_message" type="button" class="leave_success cu-btn">确认留言</button>
				</form>
			</view>
			<!-- 留言板end -->

			<!-- 主界面  -->
			<!-- #ifdef H5 -->
			<view class="content_wrapper" v-if="!showLeaveMessage" :style="{ height: 'calc(100vh - var(--window-top) - ' + writeBottom + 'px)' }">
				<!-- #endif -->
				<!-- #ifndef H5 -->
				<view class="content_wrapper" v-if="!showLeaveMessage" :style="{ height: 'calc(100vh - ' + writeBottom + 'px)' }">
					<!-- #endif -->
					<view :style="{ height: 'calc(100% - ' + wrapperHeight + 'px)' }" class="chat_wrapper">
						<!-- 遮罩 -->
						<view class="mask" @tap="hideMask" v-if="showTool || selectModel"></view>
						<scroll-view
							@scrolltoupper="wrapper_scrolltoupper"
							@tap="tap_scroll_view"
							:scroll-y="true"
							:scroll-with-animation="true"
							:scroll-into-view="scrollIntoFooter"
						>
							<block v-for="(item, index) in messageList" :key="index">
								<view class="status">
									<text>{{ item.datetime }}</text>
								</view>
								<block v-for="message in item.data" :key="message.id">
									<view v-if="message.message_type == 3" class="status">
										<text>{{ message.message }}</text>
									</view>
									<view class="message-item x-f" :class="message.sender == 'me' ? 'message__right' : 'message__left'">
										<view class="head-img"><image class="head-img" v-if="message.sender == 'you'" src="/static/imgs/kefu/sys_head.png" mode=""></image></view>
										<view v-if="message.message_type != 3" class="bubble" :class="message.sender == 'me' ? 'me' : 'you'">
											<!-- 除了商品/订单卡片和图片，其他的都使用富文本 -->
											<uni-parser
												@imgtap="message_img_preview"
												:tag-style="{ img: 'width:50rpx;height:50rpx;' }"
												v-if="message.message_type == 0"
												:html="message.message"
											></uni-parser>

											<uni-parser
												v-if="message.message_type == 2"
												:html="'<a target=_blank href=' + message.message + '>' + message.message + '</a>'"
											></uni-parser>

											<image @tap="preview_img(message.message)" v-if="message.message_type == 1" :src="message.message" mode="widthFix"></image>

											<view @tap="goDetail(message.message)" v-if="message.message_type == 4 || message.message_type == 5" class="project_item" style="margin: 0;">
												<image :src="message.message.logo"></image>
												<view class="project_item_body y-bc">
													<view>
														<view class="project_item_title more-t">{{ message.message.subject }}</view>
														<view v-if="message.message.note" style="width: 280rpx;margin-right: -20rpx;" class="project_item_note one-t">{{message.message.note}}</view>
													</view>
													<view class="project_item_price">
														<text class="price" v-if="message.message.price">￥{{ message.message.price }}</text>
													<!-- 	<text class="unit" v-if="message.message.number">x{{message.message.number}}</text> -->
													</view>
												</view>
											</view>
										</view>
										<view class="head-img"><image class="head-img" v-if="message.sender == 'me'" :src="userInfo.avatar" mode=""></image></view>
									</view>
								</block>
							</block>

							<view id="wrapper_footer"></view>
						</scroll-view>
					</view>

					<!-- 消息输入 -->
					<view class="write" :style="{ bottom: writeBottom + 'px' }">
							<label class="widget_textarea" v-if="!selectModel">
								<textarea
									:adjust-position="false"
									:show-confirm-bar="false"
									:fixed="true"
									:focus="kefuMessageFocus"
									:auto-height="true"
									maxlength="-1"
									@blur="kefu_message_blur"
									@input="textarea_input"
									:cursor-spacing="14"
									@focus="textarea_focus"
									placeholder="请输入你要咨询的问题"
									placeholder-style="color:#999"
									v-model="kefuMessage"
									class="kefu_message"
								></textarea>
							</label>
						
						<view class="write_right" :style="{ flex: showSendButton ? 3 : 2 }">
							<text
								v-if="config.toolbar && config.toolbar.expression"
								:style="{ background: 'url(' + config.toolbar.expression.icon_image + ') no-repeat', 'background-size': '100% 100%' }"
								class="toolbar_icon smiley"
								@tap="show_tool('smiley')"
							></text>
							<button class="send_btn" @tap="send_message(kefuMessage, 0)" hover-class="send_btn_hover" v-if="showSendButton">发送</button>
							<text
								class="toolbar_icon attach"
								:style="{ background: 'url(' + attachBackground + ') no-repeat', 'background-size': '100% 100%' }"
								@tap="show_tool('more')"
								v-if="!showSendButton && attachBackground"
							></text>
						</view>
					</view>
					<view v-if="showTool" class="footer_div">
						<!-- 表情 -->
						<block v-if="showTool == 'smiley'" v-for="(item, index) in expressionData" :key="index">
							<image :src="item.src" @tap="select_expression(item.title)"></image>
						</block>
						<!-- 表情end -->
						<!-- 更多 -->
						<view v-if="showTool == 'more'" class="toolbar">
							<view @tap="show_select_model('order')" v-if="config.toolbar && config.toolbar.order" class="toolbar_item">
								<image class="tool-img" src="/static/imgs/kefu/kefu_order.png"></image>
								<view>{{ config.toolbar.order.title }}</view>
							</view>
							<view @tap="show_select_model('goods')" v-if="config.toolbar && config.toolbar.goods" class="toolbar_item">
								<image class="tool-img" src="/static/imgs/kefu/kefu_goods.png"></image>
								<view>{{ config.toolbar.goods.title }}</view>
							</view>
							<view @tap="upload_file" v-if="config.toolbar && config.toolbar.file" class="toolbar_item">
								<image class="tool-img" src="/static/imgs/kefu/kefu_file.png"></image>
								<view>{{ config.toolbar.file.title }}</view>
							</view>
						</view>
						<!-- 更多end -->
					</view>
				</view>

				<!-- 订单和商品选择 -->
				<view v-if="selectModel" class="select_model">
					<view class="x-bc select_model--head">
						<view class="select-title-box y-f">
							<view class="title-text">
								{{selectModelType[selectModel]}}
							</view>
							<text class="title-line"></text>
						</view>
						<view @tap="show_select_model(false)" class="close_select"><text class="cuIcon-roundclose"></text></view>
				</view>

				<view class="project_list">
					<radio-group style="width: 100%;" v-if="selectModelData.length > 0" @change="select_done">
						<label v-for="(item, index) in selectModelData" :key="index" class="project_item">
							<image :src="item.logo"></image>
							<view class="project_item_body y-bc">
								<view>
									<view class="project_item_title more-t">{{ item.subject }}</view>
									<view v-if="item.note" style="width: 470rpx;" class="project_item_note one-t">{{ item.note }}</view>
								</view>
								<view class="project_item_price">
									<text class="price" v-if="item.price">{{ item.price }}</text>
								<!-- 	<text class="unit" v-if="item.number">x{{ item.number }}</text> -->
								</view>
							</view>
							<radio style="opacity: 0;width: 0;height: 0;" :value="index.toString()" :checked="false" hide ></radio>
						</label>
					</radio-group>
					<view class="select_model_no_data" v-if="selectModelData.length <= 0"><text>没有更多记录了...</text></view>
				</view>
			</view>
			
		</view>
	</view>
</template>

<script>
import Config from './config.js'; // 本地配置数据
var token = uni.getStorageSync('token'); // 用户身份标识
var fixedCsr = ''; // 指定客服
var innerAudioContext = null;
import { mapMutations, mapActions, mapState } from 'vuex';
export default {
	components: {},
	data() {
		return {
			leaveMessage: {
				name: '',
				contact: '',
				message: ''
			},
			attachBackground: '',
			showSendButton: false,
			showTool: false,
			showLeaveMessage: false,
			expressionData: [],
			scrollIntoFooter: '',
			config: [],
			tokenList: [],
			kefuMessage: '',
			wrapperHeight: 46,
			ws: {
				SocketTask: null,
				Timer: null, // 计时器
				ErrorMsg: [], // 发送失败的消息
				MaxRetryCount: 3, // 最大重连次数
				CurrentRetryCount: 0,
				socketOpen: false,
				pageHideCloseWs: true,
				unloadCloseWs: false // ws关闭状态码兼容性不好，手动标记页面卸载关闭ws链接
			},
			csr: '', // 当前用户的客服代表ID
			sessionId: 0, // 会话ID
			sessionUser: '', // 带身份标识的用户ID
			kefuMessageFocus: false,
			messageList: [],
			chatRecordPage: 1,
			errorTips: '链接中...',
			selectModel: false,
			selectModelType:{
				goods:'发送商品',
				order:'发送订单'
			},
			selectModelData: [],
			writeBottom: 0
		};
	},
	computed: {
		...mapState({
			userInfo: state => state.user.userInfo
		})
	},
	onLoad(opt) {
		fixedCsr = opt.fixed_csr ? opt.fixed_csr : fixedCsr;

		// 微信小程序端onshow时再链接，并在onhide时关闭链接
		// #ifndef MP-WEIXIN
		this.load();
		// #endif
	},
	onShow() {
		if (!this.ws.pageHideCloseWs) {
			this.ws.pageHideCloseWs = true;
		}
		// #ifdef MP-WEIXIN
		this.load();
		// #endif
	},
	onHide() {
		// #ifdef MP-WEIXIN
		if (this.ws.SocketTask && this.ws.socketOpen && this.ws.pageHideCloseWs) {
			console.log('微信小程序页面hide主动关闭链接');
			uni.closeSocket();
		}
		// #endif
	},
	onUnload() {
		if (this.ws.SocketTask && this.ws.socketOpen) {
			console.log('页面卸载主动关闭链接');
			this.ws.unloadCloseWs = true;
			uni.closeSocket();
		}
	},
	methods: {
		// 路由跳转
		jump(path, parmas) {
			this.$Router.push({
				path: path,
				query: parmas
			});
		},
		// 跳转详情
		goDetail(msg){
			msg.number ? this.jump('/pages/order/detail', { id:msg.id })  :this.jump('/pages/goods/detail/index', { id:msg.id })
		},
		// 关闭遮罩
		hideMask(){
			if(this.showTool){this.showTool = false}
			if(this.selectModel){this.selectModel = false}
				this.writeBottom = 0;
			},
		load: function() {
			var that = this;
			var kefu_tourists_token = '';

			// 初始化请求
			try {
				var kefu_tourists_token = uni.getStorageSync('kefu_tourists_token');
				if (!kefu_tourists_token) {
					kefu_tourists_token = '';
				}
			} catch (e) {
				console.error(e);
			}
			uni.request({
				url: that.build_url('initialize'),
				data: {
					token: uni.getStorageSync('token'),
					kefu_tourists_token: kefu_tourists_token,
					fixed_csr: fixedCsr
				},
				success: res => {
					if (res.data.code == 1) {
						// 保存游客token
						if (res.data.data.token_list.kefu_tourists_token) {
							try {
								uni.setStorageSync('kefu_tourists_token', res.data.data.token_list.kefu_tourists_token);
							} catch (e) {
								console.error(e);
							}
						}

						// 来信提示音初始化
						innerAudioContext = uni.createInnerAudioContext();
						innerAudioContext.src = that.build_url('message_prompt');

						// 公告
						var kefu_notice = '';
						try {
							kefu_notice = uni.getStorageSync('kefu_notice');
						} catch (e) {
							console.log(e);
						}
						if (kefu_notice == res.data.data.config.announcement) {
							res.data.data.config.announcement = '';
						}

						// 配置
						that.config = res.data.data.config;
						that.tokenList = res.data.data.token_list;

						// 新消息提示
						if (res.data.data.new_msg) {
							that.new_message_prompt();
						}

						// 初始化表情
						var protocol = Config.https_switch ? 'https://' : 'http://';
						var expression = {};
						for (let i in Config.expression) {
							expression[i] = {
								src: protocol + Config.baseURL + '/assets/addons/kefu/img' + Config.expression[i].src,
								title: Config.expression[i].title
							};
						}
						that.expressionData = expression;

						// 杂项资源
						that.attachBackground = that.build_url('res', '/img/more.png');

						// 链接ws
						that.connect_socket();
					} else {
						uni.showModal({
							content: res.data.msg,
							showCancel: false,
							success: res => {
								if (res.confirm) {
									uni.navigateBack({
										delta: 1
									});
								}
							}
						});
					}
				},
				fail: res => {
					uni.showModal({
						title: '温馨提示',
						content: '在线客服初始化失败,请重试~',
						showCancel: false
					});
					that.errorTips = '初始化失败';
				}
			});
		},
		switch_show_tool: function(value) {
			if (!value) {
				this.showTool = false;
				this.writeBottom = 0;
			} else {
				this.showTool = value;
				this.writeBottom = 170;
				this.scroll_into_footer(200);
			}
		},
		close_notice: function() {
			uni.setStorageSync('kefu_notice', this.config.announcement);
			this.config.announcement = '';
		},
		select_done: function(e) {
			let index = e.detail.value;
			var message = '';
			for (let i in this.selectModelData[index]) {
				message += i + '=' + this.selectModelData[index][i] + '#';
			}
			this.send_message(message, this.selectModel == 'goods' ? 4 : 5);
			this.selectModel = false;
			this.switch_show_tool(false);
		},
		show_select_model: function(name) {
			this.selectModel = name;
			if (!name) {
				return;
			}

			uni.showLoading({
				title: '请稍后...'
			});

			var data_api_url = this.config.toolbar[name].data_api;
			var reg = new RegExp('(^https?:\/\/)', 'i');
			if (data_api_url.search(reg) === -1) {
				data_api_url = (Config.https_switch ? 'https://' : 'http://') + Config.baseURL + data_api_url;
			}

			this.selectModelData = [];

			uni.request({
				url: data_api_url,
				data: {
					token: uni.getStorageSync('token')
				},
				success: res => {
					if (res.data.code == 1) {
						console.log(res.data.data);
						this.selectModelData = res.data.data.data;
					} else {
						uni.showModal({
							title: '温馨提示',
							content: res.data.msg,
							showCancel: false
						});
					}
				},
				fail: res => {
					uni.showModal({
						title: '温馨提示',
						content: '网络请求失败，请重试！',
						showCancel: false
					});
				},
				complete: res => {
					uni.hideLoading();
				}
			});
		},
		parseUrl: function(data) {
			var reg = new RegExp('(https?:\/\/)([0-9a-z.]+)([\?0-9a-z&=]+)?(#[0-9-a-z]+)?', 'g');
			return data.replace(reg, '<a target="_blank" title="$&" class="link" href="$&">$&</a>');
		},
		message_img_preview: function(e) {
			this.ws.pageHideCloseWs = false; // 页面hide不关闭链接
		},
		preview_img: function(src) {
			this.ws.pageHideCloseWs = false; // 页面hide不关闭链接
			uni.previewImage({
				current: src,
				urls: [src]
			});
		},
		upload_file: function() {
			var that = this;
			that.ws.pageHideCloseWs = false; // 页面hide不关闭链接
			uni.chooseImage({
				success: res => {
					const tempFilePaths = res.tempFilePaths;

					uni.showLoading({
						title: '正在上传...'
					});

					const uploadTask = uni.uploadFile({
						url: that.build_url('upload'),
						// #ifdef APP-PLUS || H5
						file: res.tempFiles[0],
						// #endif
						filePath: tempFilePaths[0],
						name: 'file',
						formData: {
							token: uni.getStorageSync('token')
						},
						success: res => {
							uni.hideLoading();
							that.ws.pageHideCloseWs = true;
							res = JSON.parse(res.data);
							if (res.code == 1) {
								that.send_message(res.data.url, 1);
								that.switch_show_tool(false);
								that.kefuMessageFocus = true;
							} else {
								uni.showModal({
									title: '温馨提示',
									content: res.msg,
									showCancel: false
								});
							}
						},
						complete: res => {
							uni.hideLoading();
						}
					});

					// #ifndef APP-PLUS
					uploadTask.onProgressUpdate(res => {
						uni.showLoading({
							title: res.progress + '%'
						});
					});
					// #endif
				}
			});
		},
		connect_socket: function() {
			var that = this;

			if (this.ws.SocketTask && this.ws.socketOpen) {
				console.log('无需链接');
				return;
			}

			// 开始链接
			that.ws.SocketTask = uni.connectSocket({
				url: this.build_url('ws'),
				header: {
					'content-type': 'application/json'
				},
				complete: res => {}
			});

			// 链接打开
			uni.onSocketOpen(function(res) {
				console.log('链接已打开');
				that.ws.socketOpen = true;
				that.ws.CurrentRetryCount = 0;
				// 重新发送所有出错的消息
				for (let i in that.ws.ErrorMsg) {
					that.ws_send(that.ws.ErrorMsg[i]);
				}
				that.ws.ErrorMsg = [];
				that.errorTips = '';

				if (that.ws.Timer != null) {
					clearInterval(that.ws.Timer);
				}

				that.ws.Timer = setInterval(that.ws_send, 28000); //定时发送心跳
			});

			// 收到消息
			uni.onSocketMessage(function(res) {
				let msg = JSON.parse(res.data);
				that.domsg(msg);
			});

			// 出错
			uni.onSocketError(function(res) {
				that.ws.socketOpen = false;
				that.errorTips = 'WebSocket 发生错误!';
				console.log('链接出错', res);
			});

			// 链接关闭
			uni.onSocketClose(function(res) {
				// 工具上是1000，真机上测试是10000
				console.log('链接已关闭', res);
				that.ws.socketOpen = false;
				if (res.code == 1000 || res.code == 10000 || that.ws.unloadCloseWs) {
					return;
				}
				if (that.ws.Timer != null) {
					clearInterval(that.ws.Timer);
				}

				that.ws.socketOpen = false;
				if (that.errorTips.indexOf('重连') === -1) {
					that.errorTips = '网络链接已断开!';
				}
				if (that.ws.MaxRetryCount) {
					that.ws.Timer = setInterval(that.retry_websocket, 3000); //每3秒重新连接一次
				}
			});
		},
		// 重连ws
		retry_websocket: function() {
			var that = this;
			if (that.ws.CurrentRetryCount < that.ws.MaxRetryCount) {
				that.ws.CurrentRetryCount++;
				that.connect_socket();
				that.errorTips = '重连WebSocket第' + that.ws.CurrentRetryCount + '次';
			} else {
				if (that.ws.Timer != null) {
					clearInterval(that.ws.Timer);
				}

				that.errorTips = '每隔10秒将再次尝试重连 WebSocket';
				that.ws.Timer = setInterval(that.connect_socket, 10000); //每10秒重新连接一次
			}
		},
		// 发送ws消息
		ws_send: function(message) {
			var that = this;
			if (!message) {
				message = {
					c: 'Message',
					a: 'ping'
				};
			}

			if (that.ws.SocketTask && that.ws.socketOpen) {
				uni.sendSocketMessage({
					data: JSON.stringify(message)
				});
			} else {
				console.log('消息发送出错', message, that.ws.SocketTask, that.ws.socketOpen);
				that.ws.ErrorMsg.push(message);
			}
		},
		send_message: function(message, message_type) {
			var that = this;
			if (message == '') {
				uni.showToast({
					title: '请输入消息内容',
					icon: 'none'
				});
				return;
			}
			// 检查 websocket 是否连接
			if (!that.ws.SocketTask || !that.ws.socketOpen) {
				uni.showToast({
					title: '网络链接异常，请稍后重试~',
					icon: 'none'
				});
				return;
			}

			if (!that.sessionId) {
				uni.showToast({
					title: '请选择一个会话~',
					icon: 'none'
				});
				return;
			}

			if (message_type == 0) {
				// 处理链接
				message = that.parseUrl(message);

				// 处理表情
				var reg = /\[(.+?)\]/g; // [] 中括号
				var reg_match = message.match(reg);

				if (reg_match) {
					for (let i in reg_match) {
						var emoji_item = that.find_emoji(reg_match[i]);
						message = message.replace(emoji_item.title, that.build_chat_img(emoji_item.src, '', 'emoji'));
					}
				}
			}

			var load_message = {
				c: 'Message',
				a: 'sendMessage',
				data: {
					message: message,
					message_type: message_type,
					session_id: that.sessionId,
					modulename: 'index'
				}
			};

			that.ws_send(load_message);

			let message_data = that.messageList[that.messageList.length - 1].data;
			let message_id = message_data[message_data.length - 1].id + 1;

			var data = {
				id: message_id,
				sender: 'me',
				message: message,
				message_type: message_type
			};

			var messageListIndex = that.messageList.length - 1;
			if (that.messageList[messageListIndex] && that.messageList[messageListIndex].datetime == '刚刚') {
				that.messageList[messageListIndex].data = that.messageList[messageListIndex].data.concat(that.format_message([data]));
			} else {
				that.messageList = that.messageList.concat({
					datetime: '刚刚',
					data: that.format_message([data])
				});
			}

			that.kefuMessage = '';
			that.kefu_message_change();
			that.scroll_into_footer(300);
			that.wrapperHeight = 46;
		},
		find_emoji: function(emoji_title) {
			for (let i in this.expressionData) {
				if (this.expressionData[i].title == emoji_title) {
					return this.expressionData[i];
				}
			}

			return false;
		},
		build_chat_img: function(filename, facename, class_name = 'emoji') {
			var protocol = Config.https_switch ? 'https://' : 'http://';
			if (class_name == 'emoji') {
				return '<img class="emoji" src="' + filename + '" />';
			} else {
				return '<img class="' + class_name + '" src="' + filename + '" />';
			}
		},
		// 记录用户填写的留言数据，方便后续清空输入等处理
		leave_message: function(e) {
			if (e.currentTarget.id == 'c-name') {
				this.leaveMessage.name = e.detail.value;
			} else if (e.currentTarget.id == 'c-contact') {
				this.leaveMessage.contact = e.detail.value;
			} else if (e.currentTarget.id == 'c-message') {
				this.leaveMessage.message = e.detail.value;
			}
		},
		post_leave_message: function() {
			if (!this.leaveMessage.contact) {
				uni.showToast({
					title: '联系方式不能为空哦~',
					icon: 'none'
				});
				return false;
			}

			var leave_message = {
				c: 'Message',
				a: 'leaveMessage',
				data: this.leaveMessage
			};
			this.ws_send(leave_message);
		},
		domsg: function(msg) {
			var that = this;
			if (msg.msgtype == 'initialize') {
				if (msg.data.new_msg) {
					that.new_message_prompt();
				}

				// 分配/获取客服->获取聊天记录
				var user_initialize = {
					c: 'Message',
					a: 'userInitialize',
					data: {
						fixed_csr: that.fixedCsr
					}
				};
				that.ws_send(user_initialize);
			} else if (msg.msgtype == 'user_initialize') {
				// 用户客服分配结束
				if (msg.code == 1) {
					if (msg.data.session.user_tourists) {
						that.send_message = function() {
							uni.showToast({
								title: '为保护您的隐私请,请登录后发送消息~',
								icon: 'none'
							});
						};
					}

					that.csr = msg.data.session.csr;
					that.sessionId = msg.data.session.id;
					that.showLeaveMessage = false;
					uni.setNavigationBarTitle({
						title: '客服 ' + msg.data.session.nickname + ' 为您服务'
					});
				} else if (msg.code == 302) {
					if (!that.csr) {
						// 打开留言板
						that.csr = 'none';
						that.showLeaveMessage = true;
						uni.setNavigationBarTitle({
							title: '当前无客服在线哦~'
						});
					} else {
						uni.showToast({
							title: '当前客服暂时离开,您可以直接发送离线消息~',
							icon: 'none'
						});
					}
				}
			} else if (msg.msgtype == 'show_msg') {
				uni.showToast({
					title: msg.msg,
					icon: 'none'
				});
			} else if (msg.msgtype == 'leave_message') {
				uni.showToast({
					title: msg.msg,
					icon: 'none'
				});
				this.leaveMessage = {
					name: '',
					contact: '',
					message: ''
				};
			} else if (msg.msgtype == 'clear') {
				if (msg.msg) {
					uni.showToast({
						title: msg.msg,
						icon: 'none'
					});
				}

				var clear = {
					c: 'Message',
					a: 'clear'
				};
				that.ws_send(clear);

				that.retry_webSocket = function() {
					clearInterval(that.ws.Timer);
				};
			} else if (msg.msgtype == 'offline') {
				if (msg.user_id == that.csr) {
					this.errorTips = '客服离线~';
				}
			} else if (msg.msgtype == 'online') {
				// 来自 admin 的用户上线
				if (msg.modulename == 'admin') {
					if (msg.user_id == that.csr) {
						this.errorTips = '';
					} else if (that.csr == 'none') {
						// 重新为用户分配客服代表
						var user_initialize = {
							c: 'Message',
							a: 'userInitialize'
						};
						that.ws_send(user_initialize);
					}
				}
			} else if (msg.msgtype == 'csr_change_status') {
				if (that.csr == msg.data.csr) {
					if (msg.data.csr_status != 3) {
						that.errorTips = '客服' + that.get_csr_status(msg.data.csr_status) + '~';
					} else {
						that.errorTips = '';
					}
				}
			} else if (msg.msgtype == 'transfer_done') {
				that.csr = msg.data.csr;
				uni.setNavigationBarTitle({
					title: '客服 ' + msg.data.nickname + ' 为您服务'
				});
			} else if (msg.msgtype == 'new_message') {
				that.new_message_prompt();

				if (msg.data.session_id == that.sessionId) {
					var messageListIndex = that.messageList.length - 1;
					if (that.messageList[messageListIndex].datetime == '刚刚') {
						that.messageList[messageListIndex].data = that.messageList[messageListIndex].data.concat(that.format_message([msg.data]));
					} else {
						that.messageList = that.messageList.concat({
							datetime: '刚刚',
							data: that.format_message([msg.data])
						});
					}

					var load_message = {
						c: 'Message',
						a: 'readMessage',
						data: {
							record_id: msg.data.record_id
						}
					};

					that.ws_send(load_message);

					that.scroll_into_footer(800);
				}
			} else if (msg.msgtype == 'chat_record') {
				// 下一页
				that.chatRecordPage = msg.data.next_page;
				for (let i in msg.data.chat_record) {
					msg.data.chat_record[i].data = that.format_message(msg.data.chat_record[i].data);
				}
				if (msg.data.page == 1) {
					that.messageList = msg.data.chat_record;
					// 滑动到最后一条消息
					that.scroll_into_footer(800);
				} else {
					for (let i = msg.data.chat_record.length - 1; i >= 0; i--) {
						msg.data.chat_record[i].data.reverse();
						that.messageList.unshift(msg.data.chat_record[i]);
					}
				}
			}
		},
		get_csr_status: function(status) {
			switch (parseInt(status)) {
				case 0:
					status = '离线';
					break;
				case 1:
					status = '繁忙';
					break;
				case 2:
					status = '离开';
					break;
				case 3:
					status = '在线';
					break;
				case 99:
					status = '断链';
					break;

				default:
					status = '未知';
					break;
			}

			return status;
		},
		build_url: function(type = 'ws', res_path) {
			var that = this;
			var protocol = Config.https_switch ? 'https://' : 'http://';
			switch (type) {
				//websocket聊天
				case 'ws':
					let tokenStr = '&token=' + (that.tokenList.kefu_token ? that.tokenList.kefu_token : '');
					let kefu_user = '&kefu_tourists_token=' + (that.tokenList.kefu_tourists_token ? that.tokenList.kefu_tourists_token : '');
					protocol = parseInt(that.config.wss_switch) == 1 ? 'wss://' : 'ws://';

					return (protocol + Config.baseURL + ':' + that.config.websocket_port + '/?modulename=index' + tokenStr + kefu_user).replace(/\|/g, '~');
					break;
				//初始化
				case 'initialize':
					return protocol + Config.baseURL + '/addons/kefu/index/initialize?modulename=index';
					break;
				//上传图片
				case 'upload':
					return protocol + Config.baseURL + '/addons/kefu/index/upload?modulename=index';
					break;
				//发送消息
				case 'message_prompt':
					if (that.config.__CDN__) {
						return that.config.__CDN__ + '/assets/addons/kefu/audio/message_prompt.wav';
					}
					return protocol + Config.baseURL + '/assets/addons/kefu/audio/message_prompt.wav';
					break;
				case 'res':
					if (that.config.__CDN__) {
						return that.config.__CDN__ + '/assets/addons/kefu' + res_path;
					}
					return protocol + Config.baseURL + '/assets/addons/kefu' + res_path;
					break;
			}
		},
		new_message_prompt: function() {
			if (innerAudioContext) {
				innerAudioContext.play();
				setTimeout(function() {
					innerAudioContext.stop();
				}, 1000);
			} else {
				console.error('来信提示音播放失败！');
			}
		},
		scroll_into_footer: function(timeout = 0) {
			var that = this;
			setTimeout(function() {
				that.scrollIntoFooter = 'wrapper_footer';
			}, timeout);
			that.scrollIntoFooter = '';
		},
		wrapper_scrolltoupper: function() {
			if (!this.sessionId || this.chatRecordPage == 'done') {
				return;
			}

			// 加载历史聊天记录
			var load_message = {
				c: 'Message',
				a: 'chatRecord',
				data: {
					session_id: this.sessionId,
					page: this.chatRecordPage
				}
			};

			this.ws_send(load_message);
		},
		tap_scroll_view: function() {
			this.switch_show_tool(false);
		},
		show_tool: function(name = 'smiley') {
			if (this.showTool == name) {
				this.switch_show_tool(false);
			} else {
				this.switch_show_tool(name);
			}

			if (this.showTool) {
				this.scroll_into_footer();
			}
		},
		// 输入框聚焦
		textarea_focus: function(e) {
			var that = this;
			this.showTool = false;
			console.log('获取焦点',e)
			that.writeBottom = e.detail.height ? e.detail.height : 0;
		},
		// 输入框输入
		textarea_input: function(e) {
			this.kefuMessage = e.detail.value;
			this.kefu_message_change();
		},
		// 显示/隐藏发送按钮-调整消息记录框高度
		kefu_message_change: function() {
			this.showSendButton = this.kefuMessage == '' ? false : true;
			let write = uni.createSelectorQuery().select('.write');
			write
				.fields(
					{
						size: true
					},
					data => {
						if (data.height != this.wrapperHeight) {
							this.wrapperHeight = data.height;
						}
					}
				)
				.exec();
		},
		// 消息框焦点
		kefu_message_blur: function() {
			this.kefuMessageFocus = false;
			if (!this.showTool) {
				this.writeBottom = 0;
			}
		},
		select_expression: function(title) {
			this.kefuMessage = this.kefuMessage + title;
			this.kefu_message_change();
		},
		format_message: function(message) {
			for (let i in message) {
				if (message[i].message_type == 4 || message[i].message_type == 5) {
					var message_arr = message[i].message.split('#');
					var message_obj = {};

					for (let y in message_arr) {
						let message_temp = message_arr[y].split('=');
						if (typeof message_temp[1] != 'undefined') {
							message_obj[message_temp[0]] = message_temp[1];
						}
					}
					message[i].message = message_obj;
				}
			}
			return message;
		}
	}
};
</script>

<style lang="scss">
* {
	padding: 0;
	margin: 0;
}

page {
	overflow: hidden;
}

.kefu_container {
	height: calc(100vh - var(--window-top));
	overflow: hidden;
	background-color: #f8fbfb;
}

.error_tips {
	position: fixed;
	top: var(--window-top);
	width: 100%;
	height: 80rpx;
	font-size: 30rpx;
	line-height: 80rpx;
	background: rgba(231, 76, 60, 0.7);
	z-index: 999;
	color: #ffffff;
	text-align: center;
}

.notice {
	position: fixed;
	top: var(--window-top);
	width: 100%;
	font-size: 26rpx;
	font-weight: 400;
	color: rgba(204, 149, 59, 1);
	line-height: 40rpx;
	padding: 16rpx;
	box-sizing: border-box;
	background: rgba(252, 248, 227, 0.7);
	color: #c09853;
	z-index: 999;
}

.close_notice {
	width: 100rpx;
	font-size: 40rpx;
}

// 选择商品
.mask{
	position: fixed;
	width: 100%;
	height: 100%;
	background:rgba(#000,0.3);
	z-index: 11;
}
.select_model {
	background-color: #f2f2f2;
	position: fixed;
	bottom: 0rpx;
	z-index: 998;
	width: 100%;
	border-top-left-radius: 20rpx;
	border-top-right-radius: 20rpx;
	.select_model--head{
		background-color: #fff;
		height:82rpx;
		padding:0 26rpx;
		border-radius: 20rpx 20rpx 0 0;
		.select-title-box{
			line-height: 82rpx;
			.title-text{
				font-size:30rpx;
				font-family:PingFang SC;
				font-weight:500;
				color:rgba(51,51,51,1);
				line-height: 76rpx;
			}
			.title-line{
				width:120rpx;
				height:6rpx;
				background:rgba(230,184,115,1);
			}
		}
		
		
	}
}

.close_select {
	font-size: 40rpx;
	padding: 20rpx 0;
	color: #E0E0E0;
}

.project_list {
	flex: 1;
	overflow-x: hidden;
	height: 440rpx;
	padding: 20rpx 0;
}

.project_item {
	background-color: #ffffff;
	display: flex;
	align-items: center;
	padding: 16rpx 8rpx 16rpx 16rpx;
	margin:10rpx 20rpx;
	border-radius: 20rpx;
}

.project_item:last-child {
	margin-bottom: 0;
}

.project_item image {
	width: 160rpx;
	height: 160rpx;
	min-width: 160rpx;
}

.project_item_body {
	height: 170rpx;
	width: 100%;
	margin: 0 16rpx;
	align-items: flex-start;
}

.project_item_title {
	font-size: 26rpx;
	line-height: 32rpx;
	color: #333333;
}

.project_item_note {
	font-size: 26rpx;
	color: #999999;
	line-height: 32rpx;
	margin-top: 6rpx;
	// width: 250rpx;
}
.project_item_price {
	.price {
		color: #E1212B;
		font-size: 28rpx;
		&::before{
			content:'￥';
			font-size:20rpx
		}
	}
	.unit{
		color: #999999;
		font-size: 22rpx;
		margin-left: 20rpx;
	}
}

// .project_item_price text:last-child {
// 	margin-left: 16rpx;
// 	color: #999999;
// 	font-size: 26rpx;
// }

// .project_item_price text:first-child {
// 	margin-left: -6rpx;
// 	font-size: 34rpx;
// 	color: rgba(231, 76, 60, 1);
// }

.select_model_no_data {
	font-size: 30rpx;
	height: 100%;
	background: #ffffff;
	color: #999999;
	display: flex;
	align-items: center;
	justify-content: center;
}

.content_wrapper {
}

.chat_wrapper {
	background-color: #f8fbfb;
	width: 100%;
	box-sizing: border-box;
	color: #181818;
}

.chat_wrapper scroll-view {
	height: 100%;
}

.chat_wrapper .status {
	// position: relative;
	// float: right;
	width: 100%;
	margin: 20rpx;
	text-align: center;
	height: 60rpx;
	line-height: 60rpx;
}

.chat_wrapper .status text {
	font-size: 24rpx;
	// display: inline-block;
	background: #ccc;
	color: #fff;
	border-radius: 17rpx;
	padding: 6rpx 20rpx;
	line-height: 24rpx;
}

// 消息列表
.message-item {
	align-items: flex-start;
	margin: 20rpx;
	.head-img {
		width: 70rpx;
		height: 70rpx;
		border-radius: 50%;
	}
}
.message__left {
	justify-content: flex-start;
}
.message__right {
	justify-content: flex-end;
}
.chat_wrapper .bubble {
	font-size: 26rpx;
	position: relative;
	display: inline-block;
	// clear: both;
	margin-bottom: 16rpx;
	padding: 20rpx;
	// vertical-align: top;
	border-radius: 10rpx;
	// width: 260px;
}

.chat_wrapper .bubble.me {
	// float: right;
	margin-right: 28rpx;
	// margin-left: 20rpx;
	color: #fff;
	background-color: #e6b873;
	word-wrap: break-word;
	word-break: break-all;
}

.chat_wrapper .bubble.you {
	// float: left;
	// margin-right: 20rpx;
	margin-left: 28rpx;
	color: #181818;
	background-color: #fff;
	word-wrap: break-word;
	word-break: break-all;
}

.chat_wrapper .bubble:before {
	position: absolute;
	top: 38rpx;
	display: block;
	width: 16rpx;
	height: 12rpx;
	content: '\00a0';
	-webkit-transform: rotate(29deg) skew(-35deg);
	transform: rotate(29deg) skew(-35deg);
}

.chat_wrapper .bubble.you:before {
	left: -6rpx;
	background-color: #fff;
}

.chat_wrapper .bubble.me:before {
	right: -6rpx;
	background-color: #e6b873;
}

.chat_wrapper .bubble image {
	max-height: 400rpx !important;
	width: 200rpx;
	vertical-align: bottom;
}

.chat_wrapper .bubble .emoji {
	display: inline-block;
	width: 120rpx;
	min-height: 50rpx;
}

// 消息输入
.content_wrapper .write {
	box-sizing: border-box;
	background-color: #f2f2f2;
	box-shadow: 0 -2rpx 0 #e5e5e5;
	width: 100%;
	padding: 20rpx;
	display: flex;
	align-items: center;
	position: fixed;
	bottom: 0rpx;
	z-index: 22;
}

#wrapper_footer {
	display: block;
	clear: both;
}

.write_right {
	flex: 2;
	display: flex;
	align-items: center;
	justify-content: center;
}

.widget_textarea {
	flex: 7;
	background-color: #ffffff;
	border-radius: 20rpx;
// overflow-y: auto;
	display: flex;
	justify-content: center;
	align-items: center;
	// max-height: 200rpx;
	padding: 20rpx;
}

.content_wrapper .toolbar_icon {
	display: inline-block;
	cursor: pointer;
	vertical-align: middle;
	width: 56rpx;
	height: 56rpx;
	content: '';
	margin-left: 16rpx;
}

.kefu_message {
	width: 100%;
	outline: none;
	border: none;
	resize: none;
	
	-webkit-user-select: text !important;
	-moz-user-select: text !important;
	-ms-user-select: text !important;
	user-select: text !important;
	line-height: 36rpx;
	font-size: 28rpx;
	color: #333;
}

.kefu_message::-webkit-scrollbar {
	width: 4rpx;
}

.kefu_message::-webkit-scrollbar-track {
	background-color: #fff;
	-webkit-border-radius: 2em;
	-moz-border-radius: 2em;
	border-radius: 2em;
}

.kefu_message::-webkit-scrollbar-thumb {
	background-color: #e6e6e6;
	-webkit-border-radius: 2em;
	-moz-border-radius: 2em;
	border-radius: 2em;
}

.footer_div {
	position: fixed;
	bottom: 0rpx;
	z-index: 22;
	background-color: #fff;
	box-shadow: 0 8rpx 10rpx rgba(0, 0, 0, 0.1);
	width: 100%;
	animation: show_footer_div 0.1s;
	animation-fill-mode: forwards;
	padding-top: 12rpx;
	box-sizing: border-box;
	height: 170px;
	overflow-y: auto;
	overflow-x: hidden;
}

@keyframes show_footer_div {
	from {
		height: 0;
	}

	to {
		height: 170px;
	}
}

.footer_div image {
	height: 51rpx;
	width: 51rpx;
	padding: 12rpx;
}

.send_btn {
	margin-left: 28rpx;
	background: #00b0ff;
	color: #fff;
	border-color: #00b0ff;
	outline: none;
	padding: 10rpx 20rpx;
	font-size: 24rpx;
	line-height: 1.5;
	border-radius: 6rpx;
}

.send_btn::after {
	border: none;
}

.send_btn_hover {
	background-color: #19baff;
}

.toolbar {
	display: flex;
	flex-wrap: wrap;
}

.toolbar_item {
	margin-top: 20rpx;
	width: 25%;
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: center;
	.tool-img {
		width: 100rpx;
		height: 100rpx;
	}
}

.toolbar_item view {
	display: block;
	width: 100%;
	font-size: 26rpx;
	line-height: 34rpx;
	text-align: center;
	color: #333;
}

// 留言板
.leave_message {
	padding: 0 20rpx 50rpx;
	background-color: #fff;
	border-top: 1rpx solid rgba(#dfdfdf, 0.5);
	position: relative;
	.form-group {
		.label-title {
			font-size: 28rpx;
			font-family: PingFang SC;
			font-weight: bold;
			color: rgba(51, 51, 51, 1);
			line-height: 100rpx;
		}
		.form-control {
			width: 710rpx;
			height: 84rpx;
			background: rgba(249, 250, 251, 1);
			border-radius: 20rpx;
			padding: 12rpx 24rpx;
			color: #555;
			font-size: 26rpx;
		}
	}
}

.leave_success {
	position: absolute;
	width: 600rpx;
	height: 74rpx;
	background: linear-gradient(90deg, rgba(233, 180, 97, 1), rgba(238, 204, 137, 1));
	border-radius: 37rpx;
	font-size: 28rpx;
	font-family: PingFang SC;
	font-weight: 400;
	color: rgba(255, 255, 255, 1);
	left: 50%;
	transform: translateX(-50%);
	bottom: -300rpx;
}
</style>
