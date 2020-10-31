import {
	BASE_URL
} from '@/env.js'
const expression = [{
		'title': '[zy]',
		'src': '/emoji/1.png'
	}, {
		'title': '[zm]',
		'src': '/emoji/2.png'
	}, {
		'title': '[jy]',
		'src': '/emoji/3.png'
	},
	{
		'title': '[jyb]',
		'src': '/emoji/4.png'
	}, {
		'title': '[bx]',
		'src': '/emoji/5.png'
	}, {
		'title': '[kzn]',
		'src': '/emoji/6.png'
	},
	{
		'title': '[gg]',
		'src': '/emoji/7.png'
	}, {
		'title': '[ll]',
		'src': '/emoji/8.png'
	}, {
		'title': '[jyll]',
		'src': '/emoji/9.png'
	},
	{
		'title': '[o]',
		'src': '/emoji/10.png'
	}, {
		'title': '[yz]',
		'src': '/emoji/11.png'
	}, {
		'title': '[wx]',
		'src': '/emoji/12.png'
	},
	{
		'title': '[zyb]',
		'src': '/emoji/13.png'
	}, {
		'title': '[tp]',
		'src': '/emoji/14.png'
	}, {
		'title': '[wxb]',
		'src': '/emoji/15.png'
	},
	{
		'title': '[zyc]',
		'src': '/emoji/16.png'
	}, {
		'title': '[llb]',
		'src': '/emoji/17.png'
	}, {
		'title': '[xm]',
		'src': '/emoji/18.png'
	},
	{
		'title': '[qz]',
		'src': '/emoji/19.png'
	}, {
		'title': '[zmb]',
		'src': '/emoji/20.png'
	}, {
		'title': '[kx]',
		'src': '/emoji/21.png'
	},
	{
		'title': '[mm]',
		'src': '/emoji/22.png'
	}, {
		'title': '[bz]',
		'src': '/emoji/23.png'
	}, {
		'title': '[bkx]',
		'src': '/emoji/24.png'
	},
	{
		'title': '[mg]',
		'src': '/emoji/25.png'
	}, {
		'title': '[pz]',
		'src': '/emoji/26.png'
	}, {
		'title': '[pzb]',
		'src': '/emoji/27.png'
	},
	{
		'title': '[wxc]',
		'src': '/emoji/28.png'
	}, {
		'title': '[jyc]',
		'src': '/emoji/29.png'
	}, {
		'title': '[jyd]',
		'src': '/emoji/30.png'
	},
	{
		'title': '[dm]',
		'src': '/emoji/31.png'
	}, {
		'title': '[tpb]',
		'src': '/emoji/32.png'
	}, {
		'title': '[tpc]',
		'src': '/emoji/33.png'
	},
	{
		'title': '[tpd]',
		'src': '/emoji/34.png'
	}, {
		'title': '[ly]',
		'src': '/emoji/35.png'
	}, {
		'title': '[zyd]',
		'src': '/emoji/36.png'
	},
];

let service = BASE_URL.split('://');
export default {
	baseURL: service[1], // dev.7wpp.com 启动workerman服务的域名，无需填写协议和端口
	https_switch: true, // 是否启用https协议(默认关，正式版必开，且需要参考文档创建wss服务)
	expression
}
