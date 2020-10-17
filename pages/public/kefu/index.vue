<template>
	<view>
		<cu-custom bgColor="bg-gradual-pink" :isBack="true"><block slot="backText">返回</block><block slot="content">聊天</block></cu-custom>
		<view class="cu-chat">
			<view class="cu-item self">
				<view class="main">
					<view class="content bg-green shadow">
						<text>喵喵喵！喵喵喵！喵喵喵！喵喵！喵喵！！喵！喵喵喵！</text>
					</view>
				</view>
				<view class="cu-avatar radius" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big107000.jpg);"></view>
				<view class="date">2018年3月23日 13:23</view>
			</view>
			<view class="cu-info round">对方撤回一条消息!</view>
			<view class="cu-item">
				<view class="cu-avatar radius" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big143004.jpg);"></view>
				<view class="main">
					<view class="content shadow">
						<text>喵喵喵！喵喵喵！</text>
					</view>
				</view>
				<view class="date "> 13:23</view>
			</view>
			<view class="cu-info">
				<text class="cuIcon-roundclosefill text-red "></text> 对方拒绝了你的消息
			</view>
			<view class="cu-info">
				对方开启了好友验证，你还不是他(她)的好友。请先发送好友验证请求，对方验证通过后，才能聊天。
				<text class="text-blue">发送好友验证</text>
			</view>
			<view class="cu-item self">
				<view class="main">
					<image src="https://ossweb-img.qq.com/images/lol/web201310/skin/big10006.jpg" class="radius" mode="widthFix"></image>
				</view>
				<view class="cu-avatar radius" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big107000.jpg);"></view>
				<view class="date"> 13:23</view>
			</view>
			<view class="cu-item self">
				<view class="main">
					<view class="action text-bold text-grey">
						3"
					</view>
					<view class="content shadow">
						<text class="cuIcon-sound text-xxl padding-right-xl"> </text>
					</view>
				</view>
				<view class="cu-avatar radius" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big107000.jpg);"></view>
				<view class="date">13:23</view>
			</view>
			<view class="cu-item self">
				<view class="main">
					<view class="action">
						<text class="cuIcon-locationfill text-orange text-xxl"></text>
					</view>
					<view class="content shadow">
						喵星球，喵喵市
					</view>
				</view>
				<view class="cu-avatar radius" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big107000.jpg);"></view>
				<view class="date">13:23</view>
			</view>
			<view class="cu-item">
				<view class="cu-avatar radius" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big143004.jpg);"></view>
				<view class="main">
					<view class="content shadow">
						@#$^&**
					</view>
					<view class="action text-grey">
						<text class="cuIcon-warnfill text-red text-xxl"></text> <text class="text-sm margin-left-sm">翻译错误</text>
					</view>
				</view>
				<view class="date">13:23</view>
			</view>
		</view>

		<view class="cu-bar foot input" :style="[{bottom:InputBottom+'px'}]">
			<view class="action">
				<text class="cuIcon-sound text-grey"></text>
			</view>
			<input class="solid-bottom" v-model="msgText" :adjust-position="false" :focus="false" maxlength="300" cursor-spacing="10"
			 @focus="InputFocus" @blur="InputBlur"></input>
			<view class="action">
				<text class="cuIcon-emojifill text-grey"></text>
			</view>
			<button class="cu-btn bg-green shadow" @tap="onSend">发送</button>
		</view>

	</view>
</template>

<script>
	let wsInitData={ //初始化数据
		url:'ws://112.126.102.191:1818/',
		connection_id:0,
		session_id:'asdf123456',
		token:'87c0e696-e70a-484c-b53f-8f7ae044b5ce',
		identify:'user',
		isSocketOpen:false
	}
	export default {
		data() {
			return {
				InputBottom: 0,
				msgText:''
			};
		},
		 onLoad() {
			this.init()
		},
		methods: {
			// 获取焦点
			InputFocus(e) {
				this.InputBottom = e.detail.height
			},
			// 失去焦点
			InputBlur(e) {
				this.InputBottom = 0
			},
			
			// 发送消息
			onSend(){
				console.log(this.msgText);
				this.sendWsMsg(this.msgText)
			},
			
			// 初始化
			async init(){
			await this.connectWs()
			await this.openWs()
			await this.errWs()
			},
			
			// 创建ws
			async connectWs(){
				let [error,res] = await uni.connectSocket({url:`${wsInitData.url}?identify=${wsInitData.identify}&token=${wsInitData.token}&session_id=${wsInitData.session_id}`})
				
			},
			
			//连接ws
			openWs(){
				let that = this;
				uni.onSocketOpen( function(res){
					wsInitData.isSocketOpen = true;
					console.log('连接接成功！');
				})
			},
			
			//连接错误
			errWs(){
				uni.onSocketError(err=>{
					console.log('连接错误',err);
				})
			},
			
			// 发送消息
			async sendWsMsg(msg){
				if(wsInitData.isSocketOpen){
					let [error,res] = await uni.sendSocketMessage({
						      data: msg
						    });
					console.log('senderror',error);
					console.log('sendres',res);
					return Promise.resolve(res)
				}
				
			},
			
			// 监听消息
			onWsMsg(){
				uni.onSocketMessage( res => {
				  console.log('收到服务器内容：' + res.data);
				});
			},
			
			// 关闭连接
			closeWs(){ 
				wsInitData.isSocketOpen &&  uni.closeSocket();
			  },
			  
			 // 监听关闭
			 onCloseWs(){
				 uni.onSocketClose(res => {
					wsInitData.isSocketOpen = false
				   console.log('WebSocket 已关闭！');
				 });
			 }
			
		
		}
	}
</script>

<style>
page{
  padding-bottom: 100upx;
}
</style>
