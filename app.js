const express = require('express');
const bodyParser = require('body-parser');


var app = express();
//使用body-parser中间件
app.use(bodyParser.urlencoded({extended:false}));

//加载处理跨域模块
// const cors=require("cors");
//允许哪个地址跨域访问
// app.use(cors({
//     origin:["http://manager-dev.fintech-sx.com"],
//     credentials:true
// }));

app.listen(3000);

//托管静态资源到public目录下
app.use(express.static('dist'));

