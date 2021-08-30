<template>
	<view class="cu-modal bottom-modal" :class="{ show: showAuth }" @tap="closeAuthModal" style="z-index: 10080;">
		<view class="login-wrap cu-dialog form-wrap  safe-area-inset-bottom" @tap.stop style="border-radius: 20rpx 20rpx 0 0;">
			<!-- 1.账号密码登录 -->
			<view v-if="authType === 'accountLogin'">
				<!-- 标题 -->
				<view class="head-box u-m-b-60 u-flex-col ">
					<view class="u-flex u-m-b-20">
						<view class="head-title u-m-r-40 head-title-animation">账号登录</view>
						<view class="head-title-active head-title-line" @tap="showAuthModal('smsLogin')">短信登录</view>
					</view>
					<view class="head-subtitle">如果未设置过密码，请点击忘记密码</view>
				</view>
				<view class="form-item  u-border-bottom ">
					<view class="item-content u-flex u-col-center">
						<view class="item-title">账号</view>
						<u-input
							class="u-m-r-10 u-flex-1"
							placeholder="请输入账号"
							@blur="checkValue($event, 'account')"
							@input="checkValue($event, 'account')"
							:placeholderStyle="placeholderStyle"
							v-model="form['accountLogin'].data.account"
							type="text"
						></u-input>
						<button class="u-reset-button forgot-btn" @tap="showAuthModal('forgotPwd')">忘记密码</button>
					</view>
					<view class="message-error">{{ form['accountLogin'].error.account || '' }}</view>
				</view>
				<view class="form-item u-border-bottom">
					<view class="item-content u-flex u-col-center">
						<view class="item-title">密码</view>
						<u-input
							class="u-m-r-10 u-flex-1"
							placeholder="请输入密码"
							:placeholderStyle="placeholderStyle"
							v-model="form['accountLogin'].data.password"
							type="password"
							@blur="checkValue($event, 'password')"
							@input="checkValue($event, 'password')"
						></u-input>
						<button class="u-reset-button login-btn-start" @tap="accountLoginSubmit">登录</button>
					</view>
					<view class="message-error">{{ form['accountLogin'].error.password || '' }}</view>
				</view>
				<button class="u-reset-button type-btn" @tap="showAuthModal('register')">立即注册</button>
			</view>

			<!-- 2.短信登录 -->
			<view v-if="authType === 'smsLogin'">
				<view class="head-box u-m-b-60">
					<view class="u-flex u-m-b-20">
						<view class="head-title-active u-m-r-40" @tap="showAuthModal('accountLogin')">账号登录</view>
						<view class="head-title head-title-line head-title-animation">短信登录</view>
					</view>
					<view class="head-subtitle">未注册手机号请先点击下方立即注册</view>
				</view>
				<view class="form-item u-border-bottom">
					<view class="item-content u-flex u-col-center">
						<view class="item-title">手机号</view>
						<u-input
							class="u-m-r-10 u-flex-1"
							placeholder="请输入手机号"
							@blur="checkValue($event, 'mobile')"
							@input="mobileInput($event, 'mobile')"
							:placeholderStyle="placeholderStyle"
							v-model="form['smsLogin'].data.mobile"
							type="number"
						></u-input>
						<button
							class="u-reset-button code-btn code-btn-start"
							:disabled="!form['smsLogin'].data.isMobileEnd"
							:class="{ 'code-btn-end': form['smsLogin'].data.isMobileEnd }"
							@tap="getSmsCode('mobilelogin')"
						>
							{{ codeText }}
						</button>
					</view>
					<view class="message-error">{{ form['smsLogin'].error.mobile || '' }}</view>
				</view>
				<view class="form-item u-border-bottom">
					<view class="item-content u-flex u-col-center">
						<view class="item-title">验证码</view>
						<u-input
							class="u-m-r-10 u-flex-1"
							@blur="checkValue($event, 'code')"
							@input="checkValue($event, 'code')"
							placeholder="请输入验证码"
							:placeholderStyle="placeholderStyle"
							v-model="form['smsLogin'].data.code"
							type="number"
						></u-input>
						<button class="u-reset-button login-btn-start" @tap="smsLoginSubmit">登录</button>
					</view>
					<view class="message-error">{{ form['smsLogin'].error.code || '' }}</view>
				</view>
				<button class="u-reset-button type-btn" @tap="showAuthModal('register')">立即注册</button>
			</view>

			<!-- 3.注册 -->
			<view v-if="authType === 'register'">
				<view class="head-box u-m-b-60">
					<view class="head-title u-m-b-20">注册</view>
					<view class="head-subtitle">请使用本人手机号完成注册</view>
				</view>
				<view class="form-item u-border-bottom">
					<view class="item-content u-flex u-col-center">
						<view class="item-title">手机号</view>
						<u-input
							class="u-m-r-10 u-flex-1"
							placeholder="请输入手机号"
							@blur="checkValue($event, 'mobile')"
							@input="mobileInput($event, 'mobile')"
							:placeholderStyle="placeholderStyle"
							v-model="form['register'].data.mobile"
							type="number"
						></u-input>
						<button
							class="u-reset-button code-btn code-btn-start"
							:disabled="!form['register'].data.isMobileEnd"
							:class="{ 'code-btn-end': form['register'].data.isMobileEnd }"
							@tap="getSmsCode('register')"
						>
							{{ codeText }}
						</button>
					</view>
					<view class="message-error">{{ form['register'].error.mobile || '' }}</view>
				</view>
				<view class="form-item u-border-bottom">
					<view class="item-content u-flex u-col-center">
						<view class="item-title">密码</view>
						<u-input
							class="u-m-r-10 u-flex-1"
							@blur="checkValue($event, 'password')"
							@input="checkValue($event, 'password')"
							placeholder="请输入密码"
							:placeholderStyle="placeholderStyle"
							v-model="form['register'].data.password"
							type="password"
						></u-input>
					</view>
					<view class="message-error">{{ form['register'].error.password || '' }}</view>
				</view>
				<view class="form-item u-border-bottom">
					<view class="item-content u-flex u-col-center">
						<view class="item-title">验证码</view>
						<u-input
							class="u-m-r-10 u-flex-1"
							@blur="checkValue($event, 'code')"
							@input="checkValue($event, 'code')"
							placeholder="请输入验证码"
							:placeholderStyle="placeholderStyle"
							v-model="form['register'].data.code"
							type="number"
						></u-input>
						<button class="u-reset-button login-btn-start" @tap="registerSubmit">注册</button>
					</view>
					<view class="message-error">{{ form['register'].error.code || '' }}</view>
				</view>
				<button v-if="!isLogin" class="u-reset-button type-btn" @tap="showAuthModal('accountLogin')">返回登录</button>
			</view>

			<!-- 4.忘记密码 -->
			<view v-if="authType === 'forgotPwd'">
				<view class="head-box u-m-b-60">
					<view class="head-title u-m-b-20">忘记密码</view>
					<view class="head-subtitle">为了您的账号安全，修改密码前请先进行安全验证</view>
				</view>
				<view class="form-item u-border-bottom">
					<view class="item-content u-flex u-col-center">
						<view class="item-title">手机号</view>
						<u-input
							class="u-m-r-10 u-flex-1"
							@blur="checkValue($event, 'mobile')"
							@input="mobileInput($event, 'mobile')"
							:placeholderStyle="placeholderStyle"
							v-model="form['forgotPwd'].data.mobile"
							type="number"
						></u-input>
						<button
							class="u-reset-button code-btn code-btn-start"
							:disabled="!form['forgotPwd'].data.isMobileEnd"
							:class="{ 'code-btn-end': form['forgotPwd'].data.isMobileEnd }"
							slot="right"
							@tap="getSmsCode('resetpwd')"
						>
							{{ codeText }}
						</button>
					</view>
					<view class="message-error">{{ form['forgotPwd'].error.mobile || '' }}</view>
				</view>

				<view class="form-item u-border-bottom">
					<view class="item-content u-flex u-col-center">
						<view class="item-title">验证码</view>
						<u-input
							class="u-m-r-10 u-flex-1"
							@blur="checkValue($event, 'code')"
							@input="checkValue($event, 'code')"
							placeholder="请输入验证码"
							:placeholderStyle="placeholderStyle"
							v-model="form['forgotPwd'].data.code"
							type="number"
						></u-input>
					</view>
					<view class="message-error">{{ form['forgotPwd'].error.code || '' }}</view>
				</view>

				<view class="form-item u-border-bottom">
					<view class="item-content u-flex u-col-center">
						<view class="item-title">密码</view>
						<u-input
							class="u-m-r-10 u-flex-1"
							@blur="checkValue($event, 'password')"
							@input="checkValue($event, 'password')"
							placeholder="请输入密码"
							:placeholderStyle="placeholderStyle"
							v-model="form['forgotPwd'].data.password"
							type="password"
						></u-input>
						<button class="u-reset-button login-btn-start" @tap="forgotPwdSubmit">确认</button>
					</view>
					<view class="message-error">{{ form['forgotPwd'].error.password || '' }}</view>
				</view>
				<button v-if="!isLogin" class="u-reset-button type-btn" @tap="showAuthModal('accountLogin')">返回登录</button>
			</view>

			<!-- 5.绑定手机号 -->
			<view v-if="authType === 'bindMobile'">
				<view class="head-box u-m-b-60">
					<view class="head-title u-m-b-20">绑定手机号</view>
					<view class="head-subtitle">为了您的账号安全，请绑定手机号</view>
				</view>
				<view class="form-item u-border-bottom">
					<view class="item-content u-flex u-col-center">
						<view class="item-title">手机号</view>
						<u-input
							class="u-m-r-10 u-flex-1"
							@blur="checkValue($event, 'mobile')"
							@input="mobileInput($event, 'mobile')"
							placeholder="请输入手机号"
							:placeholderStyle="placeholderStyle"
							v-model="form['bindMobile'].data.mobile"
							type="number"
						></u-input>
						<button
							class="u-reset-button code-btn code-btn-start"
							:disabled="!form['bindMobile'].data.isMobileEnd"
							:class="{ 'code-btn-end': form['bindMobile'].data.isMobileEnd }"
							slot="right"
							@tap="getSmsCode('changemobile')"
						>
							{{ codeText }}
						</button>
					</view>
					<view class="message-error">{{ form['bindMobile'].error.mobile || '' }}</view>
				</view>
				<view class="form-item u-border-bottom">
					<view class="item-content u-flex u-col-center">
						<view class="item-title">验证码</view>
						<u-input
							class="u-m-r-10 u-flex-1"
							@blur="checkValue($event, 'code')"
							@input="checkValue($event, 'code')"
							placeholder="请输入验证码"
							:placeholderStyle="placeholderStyle"
							v-model="form['bindMobile'].data.code"
							type="number"
						></u-input>
						<button class="u-reset-button login-btn-start" @tap="bindMobileSubmit">立即绑定</button>
					</view>
					<view class="message-error">{{ form['bindMobile'].error.code || '' }}</view>
				</view>
			</view>

			<!-- 6.修改密码 -->
			<view v-if="authType === 'changePwd'">
				<view class="head-box u-m-b-60">
					<view class="head-title u-m-b-20">修改密码</view>
					<view class="head-subtitle"></view>
				</view>
				<view class="form-item u-border-bottom">
					<view class="item-content u-flex u-col-center">
						<view class="item-title">旧密码</view>
						<u-input
							class="u-m-r-10 u-flex-1"
							@blur="checkValue($event, 'oldPassword')"
							@input="checkValue($event, 'oldPassword')"
							placeholder="请输入旧密码"
							:placeholderStyle="placeholderStyle"
							v-model="form['changePwd'].data.oldPassword"
							type="password"
						></u-input>
					</view>
					<view class="message-error">{{ form['changePwd'].error.oldPassword || '' }}</view>
				</view>
				<view class="form-item u-border-bottom">
					<view class="item-content u-flex u-col-center">
						<view class="item-title">新密码</view>
						<u-input
							class="u-m-r-10 u-flex-1"
							@blur="checkValue($event, 'newPassword')"
							@input="checkValue($event, 'newPassword')"
							placeholder="请输入新密码"
							:placeholderStyle="placeholderStyle"
							v-model="form['changePwd'].data.newPassword"
							type="password"
						></u-input>
					</view>
					<view class="message-error">{{ form['changePwd'].error.newPassword || '' }}</view>
				</view>
				<view class="form-item u-border-bottom">
					<view class="item-content u-flex u-col-center">
						<view class="item-title">确认密码</view>
						<u-input
							class="u-m-r-10 u-flex-1"
							@blur="checkValue($event, 'reNewPassword')"
							@input="checkValue($event, 'reNewPassword')"
							placeholder="再次输入新密码"
							:placeholderStyle="placeholderStyle"
							v-model="form['changePwd'].data.reNewPassword"
							type="password"
						></u-input>
					</view>
					<view class="message-error">{{ form['changePwd'].error.reNewPassword || '' }}</view>
				</view>
				<view class="editPwd-btn-box u-m-t-80">
					<button class="u-reset-button save-btn" @tap="changePwdSubmit">保存</button>
					<button class="u-reset-button forgot-btn" @tap="showAuthModal('forgotPwd')">忘记密码</button>
				</view>
			</view>

			<!-- 第三方登录 -->
			<view v-if="authType === 'accountLogin' || authType === 'smsLogin'" class="auto-login-box u-flex u-row-center u-col-center">
				<!-- 微信 -->
				<image
					v-if="['App', 'wxOfficialAccount', 'wxMiniProgram'].includes(platform)"
					class="auto-login-img"
					@tap="thirdLogin('wechat')"
					:src="$IMG_URL + '/imgs/auto_login_wx.png'"
					mode=""
				></image>
				<!-- 支付宝 -->
				<!-- <image
					v-if="['App', 'alipayMiniProgram', 'H5'].includes(platform)"
					class="auto-login-img"
					@tap="thirdLogin('alipay')"
					:src="$IMG_URL + '/imgs/auto_login_ali.png'"
					mode=""
				></image> -->
				<!-- 苹果 -->
				<!-- #ifdef APP-PLUS -->
				<image v-if="device === 'ios'" class="auto-login-img" @tap="thirdLogin('apple')" :src="$IMG_URL + '/imgs/auto_login_iphone.png'" mode=""></image>
				<!-- #endif -->
			</view>

			<!-- 协议 -->
			<view v-if="['accountLogin', 'smsLogin', 'register'].includes(authType)" class="agreement-box u-flex u-row-center">
				<u-checkbox v-model="protocol" shape="circle" active-color="#E9B461">
					<view class="agreement-text tcp-text u-flex u-col-center">
						我已阅读并遵守
						<view class="tcp-text u-flex u-col-center">
							<view @tap.stop="$Router.push({ path: '/pages/public/richtext', query: { id: initStore.shop.user_protocol || 0 } })">《用户协议》</view>
							与
							<view @tap.stop="$Router.push({ path: '/pages/public/richtext', query: { id: initStore.shop.privacy_protocol || 0 } })">《隐私协议》</view>
						</view>
					</view>
				</u-checkbox>
			</view>
		</view>
	</view>
</template>

<script>
/**
 * 登录提示页
 */
import FormValidate from '@/shopro/validate/form';
import schema from '@/uview-ui/libs/util/async-validator';
import wechat from '@/shopro/wechat/wechat';
import { mapMutations, mapActions, mapState, mapGetters } from 'vuex';
// #ifdef APP-PLUS
import apple from '@/shopro/apple';
// #endif
export default {
	name: 'shoproAuthModal',
	data() {
		return {
			platform: this.$platform.get(),
			device: this.$platform.device(),
			form: {
				// 1.账号密码登录
				accountLogin: {
					data: {
						account: '', // 账号
						password: '' // 密码
					},
					rules: {
						account: FormValidate.account,
						password: FormValidate.password
					},
					error: {
						account: '',
						password: ''
					}
				},

				// 2.短信登录
				smsLogin: {
					data: {
						mobile: '', // 手机号
						code: '', // 验证码
						isMobileEnd: false // 手机号输入完毕
					},
					rules: {
						code: FormValidate.code,
						mobile: FormValidate.mobile
					},
					error: {
						mobile: '', // 手机号
						code: '' // 验证码
					}
				},
				// 3.注册
				register: {
					data: {
						mobile: '', // 手机号
						code: '', // 验证码
						password: '', // 密码
						isMobileEnd: false // 手机号输入完毕
					},
					rules: {
						code: FormValidate.code,
						mobile: FormValidate.mobile,
						password: FormValidate.password
					},
					error: {
						mobile: '', // 手机号
						code: '', // 验证码
						password: '' // 密码
					}
				},

				// 4.忘记密码
				forgotPwd: {
					data: {
						mobile: '', //手机号
						code: '', //验证码
						password: '', //密码
						isMobileEnd: false // 手机号输入完毕
					},
					rules: {
						mobile: FormValidate.mobile,
						code: FormValidate.code,
						password: FormValidate.password
					},
					error: {
						mobile: '', //手机号
						code: '', //验证码
						password: '' //密码
					}
				},
				// 5.绑定手机号
				bindMobile: {
					data: {
						mobile: '', //手机号
						code: '', //验证码
						isMobileEnd: false // 手机号输入完毕
					},
					rules: {
						code: FormValidate.code,
						mobile: FormValidate.mobile
					},
					error: {
						mobile: '', //手机号
						code: '' //验证码
					}
				},
				// 6.修改密码
				changePwd: {
					data: {
						oldPassword: '', //旧密码
						newPassword: '', //新密码
						reNewPassword: '' //确认密码
					},
					rules: {
						oldPassword: FormValidate.password,
						newPassword: FormValidate.password,
						reNewPassword: [
							{
								required: true,
								message: '请重新输入密码',
								trigger: ['change', 'blur']
							},
							{
								validator: (rule, value, callback) => {
									return value === this.form.changePwd.data.newPassword;
								},
								message: '两次输入的密码不一致',
								trigger: ['change', 'blur']
							}
						]
					},
					error: {
						oldPassword: '', //旧密码
						newPassword: '', //新密码
						reNewPassword: '' //确认密码
					}
				}
			},
			codeText: '获取验证码',
			disabledCode: false,
			protocol: false, //是否同意隐私协议
			placeholderStyle: 'font-size: 30rpx; font-weight: 500;color:#C2C7CF;'
		};
	},

	computed: {
		...mapGetters(['initStore', 'isLogin','authType']),
		showAuth: {
			get() {
				return !!this.authType;
			},
			set(value) {
				value ? uni.hideTabBar() : uni.showTabBar();
			}
		}
	},
	mounted() {},
	methods: {
		...mapActions(['getUserInfo', 'showAuthModal']),

		// 检测
		checkValue(e, key) {
			this.validation(key);
		},

		// 校验数据
		validation(key, callback = () => {}) {
			let that = this;
			//拿到需要校验的数据
			let fieldValue = this.form[this.authType].data[key];
			//拿到需要检验的规则
			let rules = this.form[this.authType].rules[key];
			// 判空
			if (!rules || rules.length === 0) {
				return callback('');
			}
			// 设置当前的装填，标识为校验中
			let validateState = 'validating';
			// 调用async-validator的方法
			let validator = new schema({
				[key]: rules
			});
			// 校验
			validator.validate(
				{
					[key]: fieldValue
				},
				{
					firstFields: true
				},
				(errors, fields) => {
					// 记录状态和报错信息
					validateState = !errors ? 'success' : 'error';
					let validateMessage = errors ? errors[0].message : '';
					that.form[that.authType].error[key] = validateMessage;
					callback(validateMessage);
				}
			);
		},

		// 校验全部数据
		validateAll(callback) {
			let that = this;
			return new Promise(resolve => {
				// 对当前所有表单检验
				let valid = true; // 默认通过
				let count = 0; // 用于标记是否检查完毕
				let errorArr = []; // 存放错误信息
				let curFormData = that.form[that.authType].data;
				Object.keys(curFormData).map(field => {
					that.validation(field, error => {
						// 如果回调有error
						if (error) {
							valid = false;
							errorArr.push(error);
						}
						if (++count === Object.keys(curFormData).length) {
							resolve(valid);
							if (errorArr.length) {
								this.$u.toast(errorArr[0]);
							}
							if (typeof callback == 'function') callback(valid);
						}
					});
				});
			});
		},

		// 手机号是否输入完毕
		mobileInput(e, key) {
			this.form[this.authType].data.isMobileEnd = this.$u.test.mobile(this.form[this.authType].data.mobile);
			this.validation(key);
		},

		closeAuthModal() {
			this.$store.dispatch('showAuthModal', '');
		},

		// 获取短信验证码
		getSmsCode(type) {
			const that = this;
			if (that.form[this.authType].data.isMobileEnd && !that.disabledCode) {
				that.$http(
					'common.smsSend',
					{
						mobile: that.form[this.authType].data.mobile,
						event: type
					},
					'获取验证码中...'
				).then(res => {
					if (res.code === 1) {
						that.codeChange();
						that.$u.toast('验证码已发送，请注意查收短信');
					} else {
						that.$u.toast(res.msg);
					}
				});
			} else {
				that.$u.toast('请稍后再试');
			}
		},

		// 倒计时
		codeChange() {
			if (this.disabledCode) return;
			this.disabledCode = true;
			let n = 10;
			this.codeText = n + 's';
			const run = setInterval(() => {
				n -= 1;
				if (n < 0) {
					clearInterval(run);
				}
				this.codeText = n + 's';
				if (this.codeText < 0 + 's') {
					this.disabledCode = false;
					this.codeText = '重新获取';
				}
			}, 1000);
		},

		// 规则校验
		validateSubmit() {
			if (['accountLogin', 'smsLogin', 'register'].includes(this.authType) && !this.protocol) {
				this.$u.toast('请同意用户协议');
				return false;
			}
			return this.validateAll();
		},

		// 第三方登录
		async thirdLogin(provider) {
			if (!this.protocol) {
				this.$u.toast('请同意用户协议');
				return false;
			}
			const that = this;
			let token = '';
			switch (provider) {
				case 'wechat':
					token = await wechat.login();
					break;
				case 'alipay':
					break;
				case 'apple':
					token = await apple.appleIdOauth();
					break;
				default:
					break;
			}
			if (token) {
				that.closeAuthModal();
				that.getUserInfo(token);
			}
		},

		// 1.账号登录
		async accountLoginSubmit() {
			let that = this;
			(await that.validateSubmit()) &&
				that
					.$http(
						'user.accountLogin',
						{
							account: that.form['accountLogin'].data.account,
							password: that.form['accountLogin'].data.password
						},
						'登录中...'
					)
					.then(res => {
						if (res.code === 1) {
							that.closeAuthModal();
							that.getUserInfo(res.data.token);
							that.$u.toast(res.msg);
						}
					});
		},

		// 2.短信登录
		async smsLoginSubmit() {
			let that = this;
			(await that.validateSubmit()) &&
				that
					.$http(
						'user.smsLogin',
						{
							mobile: that.form['smsLogin'].data.mobile,
							code: that.form['smsLogin'].data.code
						},
						'登录中...'
					)
					.then(res => {
						if (res.code === 1) {
							that.closeAuthModal();
							that.getUserInfo(res.data.token);
							that.$u.toast(res.msg);
						}
					});
		},

		// 3.注册
		async registerSubmit() {
			let that = this;
			(await that.validateSubmit()) &&
				that
					.$http(
						'user.register',
						{
							mobile: that.form['register'].data.mobile,
							code: that.form['register'].data.code,
							password: that.form['register'].data.password
						},
						'注册中...'
					)
					.then(res => {
						if (res.code === 1) {
							that.$u.toast(res.msg);
							that.closeAuthModal();
							that.getUserInfo(res.data.token);
						}
					});
		},

		// 4.忘记密码
		async forgotPwdSubmit() {
			let that = this;
			(await that.validateSubmit()) &&
				that
					.$http(
						'user.forgotPwd',
						{
							mobile: that.form['forgotPwd'].data.mobile,
							code: that.form['forgotPwd'].data.code,
							password: that.form['forgotPwd'].data.password
						},
						'修改中...'
					)
					.then(res => {
						if (res.code === 1) {
							that.$u.toast(res.msg);
							if (that.isLogin) {
								that.closeAuthModal();
							} else {
								that.showAuthModal('accountLogin');
							}
						}
					});
		},

		// 5.绑定手机
		async bindMobileSubmit() {
			let that = this;
			(await that.validateSubmit()) &&
				that
					.$http(
						'user.bindMobile',
						{
							mobile: that.form['bindMobile'].data.mobile,
							code: that.form['bindMobile'].data.code,
							password: that.form['bindMobile'].data.password
						},
						'绑定中...'
					)
					.then(res => {
						if (res.code === 1) {
							that.$u.toast(res.msg);
							that.closeAuthModal();
							that.getUserInfo();
						}
					});
		},

		// 6.修改密码
		async changePwdSubmit() {
			let that = this;
			(await that.validateSubmit()) &&
				that
					.$http(
						'user.changePwd',
						{
							oldpassword: that.form['changePwd'].data.oldPassword,
							newpassword: that.form['changePwd'].data.newPassword
						},
						'修改中...'
					)
					.then(res => {
						if (res.code === 1) {
							that.closeAuthModal();
							that.$u.toast(res.msg);
							that.getUserInfo(res.data.userinfo.token);
						}
					});
		}
	}
};
</script>

<style lang="scss" scoped>
@keyframes title-animation {
	0% {
		font-size: 32rpx;
	}

	100% {
		font-size: 36rpx;
	}
}

.form-wrap {
	.form-item {
		display: flex;
		flex-direction: column;
		font-size: 28rpx;
		padding: 20rpx 0;
		color: $u-main-color;
		box-sizing: border-box;
		line-height: $u-form-item-height;
		width: 100%;
		.item-title {
			width: 140rpx;
			font-size: 30rpx;
			color: #333;
			font-weight: 600;
			text-align: left;
		}
		.message-error {
			text-align: left;
			font-size: 24rpx;
			line-height: 24rpx;
			color: $u-type-error;
			margin-top: 12rpx;
			margin-left: 120rpx;
		}
	}
}

.login-wrap {
	padding: 50rpx 34rpx;
	min-height: 700rpx;
	background-color: #fff;

	.head-box {
		.head-title {
			min-width: 160rpx;
			font-size: 36rpx;
			font-weight: bold;
			color: #333333;
			line-height: 36rpx;
		}
		.head-title-active {
			width: 160rpx;
			font-size: 32rpx;
			font-weight: 600;
			color: #999;
			line-height: 36rpx;
		}
		.head-title-animation {
			animation-name: title-animation;
			animation-duration: 0.1s;
			animation-timing-function: ease-out;
			animation-fill-mode: forwards;
		}
		.head-title-line {
			position: relative;
			&::before {
				content: '';
				width: 1rpx;
				height: 34rpx;
				background-color: #e4e7ed;
				position: absolute;
				left: -30rpx;
				top: 50%;
				transform: translateY(-50%);
			}
		}

		.head-subtitle {
			font-size: 26rpx;
			font-weight: 400;
			color: #c2c7cf;
			text-align: left;
			display: flex;
		}
	}
	.code-btn[disabled] {
		background-color: #fff;
	}

	.code-btn-start {
		width: 160rpx;
		line-height: 56rpx;
		border: 1rpx solid #e9b766;
		border-radius: 28rpx;
		font-size: 26rpx;
		font-weight: 400;
		color: #e9b766;
		opacity: 0.5;
	}

	.forgot-btn {
		width: 160rpx;
		line-height: 56rpx;
		font-size: 30rpx;
		font-weight: 500;
		color: #999;
	}

	.code-btn-end {
		opacity: 1 !important;
	}

	.login-btn-start {
		width: 158rpx;
		line-height: 56rpx;
		background: linear-gradient(90deg, #e9b461, #eecc89);
		border-radius: 28rpx;
		font-size: 26rpx;
		font-weight: 500;
		color: #ffffff;
	}

	.type-btn {
		padding: 20rpx;
		margin: 40rpx auto;
		width: 200rpx;
		font-size: 30rpx;
		font-weight: 500;
		color: #999999;
	}

	.auto-login-box {
		width: 100%;

		.auto-login-img {
			width: 68rpx;
			height: 68rpx;
			border-radius: 50%;
			margin: 0 30rpx;
		}
	}

	.agreement-box {
		margin: 80rpx auto 0;
		.protocol-check {
			transform: scale(0.7);
		}
		.agreement-text {
			font-size: 26rpx;
			font-weight: 500;
			color: #999999;

			.tcp-text {
				color: #e9b562;
			}
		}
	}
}

// 修改密码
.editPwd-btn-box {
	.save-btn {
		width: 690rpx;
		line-height: 70rpx;
		background: linear-gradient(90deg, #e9b461, #eecc89);
		border-radius: 35rpx;
		font-size: 28rpx;
		font-weight: 500;
		color: #ffffff;
	}
	.forgot-btn {
		width: 690rpx;
		line-height: 70rpx;
		font-size: 28rpx;
		font-weight: 500;
		color: #999999;
	}
}
</style>
