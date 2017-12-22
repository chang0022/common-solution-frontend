# API结构规范
必须是一个JSON Array，Array of API-Object

可以考虑兼容 swagger.io
## API-Object
结构上来说是一个JSON Object
### group
可选的分组情况，应该是一个String
### tag
可选的标签组，String or Array of String
### weight
### path
路径，必选项目；String or Array of String
支持正则
也支持 named URI parameter 比如 /goods/:goodId
### method
String or Array of String
可选，默认GET
必须大写
### uriParameter formParameter jsonParameter
可选项的参数 Parameter-Object or Array of Parameter-Object
### exceptedContentType
只支持支持请求体的方法，比如PUT POST等
可选项，String or Array of String
表示约束请求体的内容类型，不符合将给400
### description
可选描述,String
### since
可选何时开始支持，可以是版本号 tag 或者其他人类可读的版本标记
### result
可选的响应结果
Result-Object or Array of Result-Object
## Parameter-Object
结构上来说是一个JSON Object
其他约束性规则参考 http://json-schema.org/latest/json-schema-validation.html#rfc.section.6.1.1
不符合约束将给予400
### name
必选 String
### description
可选描述 String
## Result-Object
一个JSON Object
### condition
可选项的条件，但所有的结果中只能有一个无条件的结果
它应该是一个Script-Object(Boolean)
### description
可选的描述
### cookie
可选的cookie设置信息
该结果将响应Set-Cookie头
Cookie-Object or Array of Cookie-Object
### header
可选的头设置信息
该结果将增设相关头
Header-Object or Array of Header-Object
### redirectTarget
可选的跳转目标（即响应302）
String or Script-Object(String)
### contentSchema
可选的响应内容的schema
参考标准 http://json-schema.org
模拟网站 http://json-schema-faker.js.org/

跟标准唯一的出入是本规范额外支持以一个携带 __script 字段的JSON Object进行再次渲染。

比如:
`{"type":"number","minimum":{"__script":"1+100"}}`
将被渲染成
`{"type":"number","minimum":101}}`

### contentType
可选的响应类型；通常只有在 contentSchema 存在时才有效
### status
可选的响应状态码
### statusText
可选的跟随状态码一同响应的内容
## Script-Object
可执行的代码，并且可以返回期望的类型
### script
脚本字符串 所有参数直接可用，同时支持Express的Request(__request)和Response(__response)
### description
可选的描述
## Cookie-Object
### name
String or Script-Object(String)
### value
String or Script-Object(String)
最终得值为null则执行删除cookie
## Header-Object
### name
String or Script-Object(String)
### value
String or Script-Object(String)