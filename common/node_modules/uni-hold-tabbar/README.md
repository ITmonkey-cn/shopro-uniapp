
# uni-hold-tabbar

![coverage](https://img.shields.io/badge/coverage%20-95%25-green)   ![npm](https://img.shields.io/badge/npm%20-v2.6.11-blue) ![build](https://img.shields.io/badge/build-passing-brightgreen) ![license](https://img.shields.io/badge/license-MIT-red)

## 写在前面

插件市场有很多的 `tabbar` 相关组件。不管是原生还是普通组件可以说是 `应有尽有`。但是，大家有没有想过一个问题！官方有提供原生的tabbar菜单为何我还要去插件市场引入其他tabbar菜单呢？ 无非就差个拦截，我搞个拦截不就对了。而我为什么要写一个这样的小插件呢？其实它是 [uni-simple-router](https://github.com/SilurianYang/uni-simple-router) 在app端拦截底部菜单的 **垫脚片**。一开始只是单纯的想集成在 `路由` 插件中，想了想单独提取出来更为妥当！**原因：** 1. 结构分离、管理方便。2.适用于任何人、给予别人可二次开发及使用。 3.新插件形式发布，任何地方集成。


### 安装

您可以使用 `Yarn` 或 `npm` 安装该软件包（选择一个）：

##### Yarn

```sh
yarn add uni-hold-tabbar
```
##### npm

```sh
npm install uni-hold-tabbar
```

### 导入

##### 包管理
````js
import HoldTabbar  from 'uni-hold-tabbar'

const holdTab=new HoldTabbar({options}); //可以开始放肆的使用
````

##### 插件市场
```js
//换成自己的路径 后面是当前最新的版本号
import HoldTabbar  from '@/common/uni-hold-tabbar@1.0.0.js' 

const holdTab=new HoldTabbar({options}); //可以开始放肆的使用
```
### 入门
一旦你把 `uni-hold-tabbar` 安装成功后，就可以开始创建相关原生tabbar的拦截配置。对于本指南，完美的示例能带你了解它的所有功能。

##### 全局生命周期
```js
import HoldTabbar  from 'uni-hold-tabbar'

//示例化开始使用 
const holdTab=new HoldTabbar({
    beforeMount:(tabbarView,tabList)=>{
        console.log('挂载之前')
    },
    mounted:(tabbarView,tabList)=>{
        console.log('挂载完成')
    }
})
```
不管是那个生命周期，插件都会传递一个原生 `view` 对象和当前tabList过来。你可以在对应的生命钩子中做一些想完成的事情。**在 `beforeMount` 中，你可以返回 true 来终止挂载。** [查阅可用API](http://www.html5plus.org/doc/zh_cn/nativeobj.html#plus.nativeObj.View)

##### 手指事件
```js
import HoldTabbar  from 'uni-hold-tabbar'

//示例化开始使用 拦截tabbar点击事件
const holdTab=new HoldTabbar({
    event:{
        click:(index,{pagePath},next)=>{    //点击事件
            uni.switchTab({
                url:`/${pagePath}`,
                complete:()=>{
                    next();
                }
            })
        },
        dbClick:(index,currentTab,next)=>{},  //双击事件
        touchstart:(index,currentTab,next)=>{}, //触摸开始
        touchmove:(index,currentTab,next)=>{},  //移动
        touchend:(index,currentTab,next)=>{}    //触摸结束
    }
});
```
很简单的一个例子，`event` 选项中我们传递了5个事件。插件会根据你所传递的可用事件而进行绑定。插件拦截后会根据手指点击tabbar位置自动触发相应的回调。再次不会自动跳转，需要开发者自行跳转。每个事件中都会传入3个参数。
* index {Number} 当前tabbar索引
* currentTab    {Object}    当前tab的所有信息
* next  {Function}  确保组件页面中的 `onTabEvent` 生命周期能按顺序执行的管道函数


##### 为组件注册生命周期
```js
//main.js
import HoldTabbar  from 'uni-hold-tabbar'

const holdTab=new HoldTabbar({
    registerPageHook:true,
    click:(index,{pagePath},next)=>{    //点击事件
        uni.switchTab({
            url:`/${pagePath}`,
            complete:()=>{
                next();
            }
        })
    },
})

//xxx.vue
<template>
    <view>
        页面 - 1
    </view>
</template>

export default {
    data(){
        return {}
    },
    onTabEvent(type,currentTab){
        console.log(type)
    }
}
```
简单的实例化后，会为每个tabbar页面注册 一个名为 `onTabEvent` 的生命钩子。需要注意的是：**如果页面不在当前显示状态下不会触发此生命钩子，不管是任何已经注册的事件都会触发此钩子，并会依次传入 type、currentTab 及为当前：事件类型、当前tab对象**。在注册 `registerPageHook:true` 时，跳页面的时候一定要记住 **next()**，否则可能会出现页面生命钩子不触发或者顺序出乱的问题。 



### <div id="API">API</div>

##### options

```js
//默认值
const BaseConfig={
	registerPageHook:false,     //是否注册页面 onTabEvent 生命钩子
	id:'HoldTabbar',    //当前拦截id 可以通过5+Api 获取到
	style:{     //当前拦截tabbar的样式 不建议去修改
		width: '100%',
		height: '50px',
		opacity: 0,
		bottom: '0'
	},
	event:{},   //event事件对象
	beforeMount:()=>{}, //挂载前生命周期
	mounted:()=>{}  //挂载成功生命周期
}
//可绑定的事件
const event={   
	dbClick:'doubleclick',
	click:'click',
	touchstart:'touchstart',
	touchmove:'touchmove',
	touchend:'touchend'
}
```

##### Instance method

* **getTabbarView**
    * 获取当前的底部拦截 tabbar 原生对象，你可以使用他操作些什么  [查阅可用API](http://www.html5plus.org/doc/zh_cn/nativeobj.html#plus.nativeObj.View)

* **isVisible**
    * 获取当前拦截状态是否显示，即是否在可生效情况下

* **hideHoldTab()**
    * 隐藏底部拦截层，这个对切换到其他非tabbar页面很有帮助

* **showHoldTab()**
    * 显示底部拦截层。

### 注意事项
###### 1. 能直接使用此插件拦截底部tabbar吗？
* 答：那是必须可以！简单的声明及注册事件即可完成拦截。不过需要注意的是，如果没有合理的管理好页面跳转，拦截器会出现在不该出现的地方。所以说如果单独使用则需要自行判断。如在离开tabbar时手动隐藏拦截器。进入tabbar是显示拦截器。如果是这样闲麻烦，请移步到路由拦截插件 [uni-simple-router](https://github.com/SilurianYang/uni-simple-router) **强烈建议使用路由插件**

###### 2.为什么我切换到其他页面，底部有块不能点击，或者是跳到其他tab页面？
* 答：没有正确的隐藏和显示底部拦截器。你需要在合适的时候显示和隐藏底部拦截器。 可以查看 `examples` 中的代码

###### 3.我能不能集成此插件到我的插件中？
* 答：那是必须可以！强烈建议此插件被二次封装。因为是垫片所以很多优秀的功能不会提供，只是简单的完成了最基本的功能。