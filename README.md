
# 使用
> 使用前请先安装[NodeJs](https://nodejs.org/zh-cn/)(推荐使用8.x版本)，国内用户推荐使用[淘宝NPM镜像源](http://npm.taobao.org/)。

- 安装依赖
```shell
npm install
```
- 运行
```shell
npm run dev
```
- 打包
```shell
npm run build
```

# 配置修改
- 请求地址

    将`config/index.js`中`baseUrl`属性中的`dev(开发时)`以及`pro(上线时)`改成自己的baseUrl即可。
- 端口修改

    更改根目录下的`package.json`文件中的`scripts.dev`的`--port`的值为你所需要的端口即可，例如使用2000端口即为：`"dev": "vue-cli-service serve --open --port=2000"`

