/**
 *  Shopro全局配置文件
 */

// 测试： https://fastadmin.test.7wpp.com
//演示：  https://demo.shopro.top
export const BASE_URL = 'https://demo.shopro.top' //后台根域名
export const API_URL = `${BASE_URL}/addons/shopro/` //后台接口域名
export const IMG_URL = 'http://file.shopro.top' //全局网络图片地址变量，css背景图片地址变量在uni.scss
export const MAP_KEY = '265849207ce2d4833f4a9ac5839753dc'; //高德地图开发者Web服务key,逆坐标解析
export const HAS_LIVE = false //后台是否开通直播权限,根据情况在manifest.json中，开启注释相应组件的引入。
