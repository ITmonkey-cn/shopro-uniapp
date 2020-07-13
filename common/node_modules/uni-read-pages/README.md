# uni-read-pages

![coverage](https://img.shields.io/badge/coverage%20-98%25-green) ![npm](https://img.shields.io/badge/npm%20-v2.6.11-blue) ![license](https://img.shields.io/badge/license-MIT-red) ![size](https://img.shields.io/badge/size-1.48%20kb-yellowgreen)

通过 [vue.config.js](https://cli.vuejs.org/zh/config/) 配合此库，可以随心所欲的读取 `pages.json` 下的所有配置

## 安装

您可以使用 `Yarn` 或 `npm` 安装该软件包（选择一个）：

##### Yarn

```sh
yarn add uni-read-pages
```
##### npm

```sh
npm install uni-read-pages
```
## 开始
配置 `vue.config.js` 通过 `webpack` 注入全局变量 [查看文档](https://www.webpackjs.com/plugins/define-plugin/)

#### 配置 `vue.config.js`
```js
//vue.config.js
const TransformPages = require('uni-read-pages')
const tfPages = new TransformPages()
module.exports = {
    configureWebpack: {
        plugins: [
            new tfPages.webpack.DefinePlugin({
                ROUTES: JSON.stringify(tfPages.routes)
            })
        ]
    }
}
```
借助`webpack.DefinePlugin` 轻松注入全局变量。`ROUTES` 及可全局使用

#### 使用
```js
// xxx.vue
<script>
export default {
    data() {
        return {
            title: 'Hello'
        }
    },
    onLoad() {
        console.log(ROUTES)
    },
}
</script>
```
## API
#### options
```js
//默认值
const CONFIG={
    cli:false,      //当前是否为脚手架初始化的项目
    includes:['path','aliasPath','name']	    //需要获取包涵的字段
}
```

#### Instance method

* **getPagesRoutes**
    * 通过读取 `pages.json` 文件 生成直接可用的routes

* **parsePages(pageCallback, subPageCallback)**
    * 单条page对象解析

* **resolvePath(dir)**
    * 解析绝对路径

#### Instance attr

* **CONFIG**
    * 当前配置项

* **webpack**
    * 当前工程下需要用到 `webpack`

* **uniPagesJSON**
    * 当前 `uni-app` 内置对象，可以通过此属性调用一些内置方法

* **routes**
    * 通过 **includes** 解析后得到的路由表 **可直接使用**

#### getter

* **pagesJson**
    * 获取所有 `pages.json` 下的内容 返回 `json`


#### uniPagesJSON method

* getMainEntry()
* getNVueMainEntry()
* parsePages (pagesJson, pageCallback, subPageCallback)
* parseEntry (pagesJson)
* getPagesJson()
* parsePagesJson (content, loader)

#### uniPagesJSON attr
* pagesJsonJsFileName //默认值 pages.js