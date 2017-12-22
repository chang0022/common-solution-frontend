# api-mocker
API模拟器
扩展了swagger2.0标准 https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md，附加了可控的结果。

这个工件提供了浏览器兼容的功能，主要提供一些基础API

## local-api-mocker 
提供本地运行支持
## webpack-api-mocker
webpack一键支持

## 标准变动
### https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#infoObject
增加了
### id
api标准id
### branch
当前工作分支
### https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#schemaObject
增加了可跟$ref关联内容合并的对象 通常最终会包含__script对象
就是json-schema标准的任意数据都可以扩展出一个script对象
###  https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#response-object
增加了
#### condition
Script-Object(Boolean)
使用这个响应的条件
#### cookies 
参考 Headers https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#headersObject  相关标准
### Script Object
可执行的代码，并且可以返回期望的类型
#### script
脚本字符串 所有参数直接可用，同时支持Express的Request(__request)和Response(__response)
#### description
可选的描述



