# easyjs
轻量级Javascript工具库<br/><br/><br/>

## core.js
---
入口文件，定义ejs对象和基础方法<br/><br/><br/>

### 方法：<br/><br/>

*使用原型（prototype）方式实现Javascript类之间的继承关系，使用此方式会在创建新的实例时继续保持继承来的属性和方法。*<br/>
*@param subClass 子类*<br/>
*@param superClass 父类*<br/>
**ejs.inherit(subClass, superClass)**<br/><br/><br/>

*对指定对象实例进行属性和方法的扩展，通常作用于对象实例，不会在创建新实例时保持扩展的内容。*<br/>
*@param target 将被扩展的对象实例*<br/>
*@param overrided 是否覆盖已有的属性或方法，true/false*<br/>
*@param 第3～N个参数 扩展属性和方法的来源对象，可以1个或多个*<br/>
**ejs.extend(target, overried)**<br/><br/><br/>

*扩展setTimeout能力，可以动态指定func执行时的this指针*<br/>
*@param func 将被执行的函数*<br/>
*@param delay 延迟执行的时间*<br/>
*@param 第3个参数 func函数执行时的this指针*<br/>
*@param 第4～N个参数 func函数执行时参数*<br/>
**window.setTimeout(func, delay)**<br/><br/><br/>

## utils.js
---
公共方法类<br/>
**required:** core.js<br/><br/><br/><br/>

### 方法：<br/><br/>

*判断变量是否为null*<br/>
*@param obj 要判断的变量*<br/>
*@returns 变量为null，返回true；否则，返回false*<br/>
**ejs.utils.isNull(obj)**<br/><br/><br/>

*判断参数是否为日期型*<br/>
*@param obj 要判断的变量*<br/>
*@returns 变量为日期类型，返回true；否则，返回false*<br/>
**ejs.utils.isDate(obj)**<br/><br/><br/>

*判断变量是否未定义*<br/>
*@param obj 要判断的变量*<br/>
*@returns 变量未定义，返回true；否则，返回false*<br/>
**ejs.utils.isUndefined(obj)**<br/><br/><br/>

*判断变量是否为null或者未定义*<br/>
*@param obj 要判断的变量*<br/>
*@returns 变量为null或者未定义，返回ture；否则，返回false*<br/>
**ejs.utils.isNullOrUndefined(obj)**<br/><br/><br/>

*判断变量是否为字符串类型*<br/>
*@param obj 要判断的变量*<br/>
*@returns 变量是字符串类型，返回true；否则，返回false*<br/>
**ejs.utils.isString(obj)**<br/><br/><br/>

*判断变量是否为数值型*<br/>
*@param obj 要判断的变量*<br/>
*@returns 变量是数值，返回true；否则，返回false*<br/>
**ejs.utils.isNumber(obj)**<br/><br/><br/>


*判断变量是否为一个布尔值，ture/false*<br/>
*@param obj 要判断的变量*<br/>
*@returns 变量是一个布尔值，返回true；否则，返回false*<br/>
**ejs.utils.isBoolean(obj)**<br/>

*判断变量是否是一个函数*<br/>
*@param obj 要判断的变量*<br/>
*@returns 如果变量是一个函数，返回ture；否则，返回false*<br/>
**ejs.utils.isFunction(obj)**<br/><br/><br/>

*判断变量是否是一个数组*<br/>
*@param obj 要判断的变量*<br/>
*@returns 变量为一个数组，返回ture；否则，返回false*<br/>
**ejs.utils.isArray(obj)**<br/><br/><br/>

*生成随机数*<br/>
*@param length 指定生成随机的长度*<br/>
*@returns 返回生成好的随机数*<br/>
**ejs.utils.makeRandom(length)**<br/><br/><br/>

*将数字转换成指定长度的16进制字符串，长度不够，前面补0*<br/>
*@param value 要转换的数值*<br/>
*@param length 转换后的长度*<br/>
*@returns 转换好的字符串*<br/>
**ejs.utils.toHex(value, length)**<br/><br/><br/>

*获取函数名称*<br/>
*@param func 函数对象*<br/>
*@returns 函数名称*<br/>
**ejs.utils.getFuncName(func)**<br/><br/><br/>

## browser.js
---
浏览器相关方法类<br/>
**required:** core.js<br/><br/><br/><br/>

### 方法：<br/><br/>

*判断当前运行容器是否为IE浏览器*<br/>
*@returns 是IE浏览器，返回true；否则，返回false*<br/>
**ejs.browser.isIE()**<br/><br/><br/>

*判断当前运行容器是否为Firefox浏览器*<br/>
*@returns 是IE浏览器，返回true；否则，返回false*<br/>
**ejs.browser.isFF()**<br/><br/><br/>

*判断当前运行容器是否为Chrome浏览器*<br/>
*@returns 是IE浏览器，返回true；否则，返回false*<br/>
**ejs.browser.isChrome()**<br/><br/><br/>

*获取当前IE浏览器版本*<br/>
*@returns IE浏览器版本，如果不是IE浏览器，返回0*<br/>
**ejs.browser.getIEVer()**<br/><br/><br/>

*获取当前根地址*<br/>
*@returns 根地址*<br/>
**ejs.browser.getBaseURL()**<br/><br/><br/>

*获取指定名字的query参数*<br/>
*@param name 参数名字*<br/>
*@returns 参数值*<br/>
**ejs.browser.getQueryString(name)**<br/><br/><br/>

*将绝对地址转换为相对地址*<br/>
*@param url 绝对地址*<br/>
*@returns 转换后的相对地址*<br/>
**ejs.browser.convertToRelativeUrl(url)**<br/><br/><br/>

*将相对地址转换成绝对地址*<br/>
*@param url 相对地址*<br/>
*@param addSession 是否附加session信息*<br/>
*@returns 转换完成的绝对地址*<br/>
**ejs.browser.resolveUrl(url, addSession)**<br/><br/><br/>

*跳转到指定的页面地址*<br/>
*@param url 相对地址*<br/>
*@param addBaseUrl 是否补齐根地址*<br/>
*@param addSession 是否附加session信息*<br/>
**ejs.browser.redirect(url, addBaseUrl, addSession)**<br/><br/><br/>

## xml.js
---
xml文件相关方法类<br/>
**required:** core.js<br/><br/><br/><br/>

### 方法：<br/><br/>

**ejs.xml.encoding(text)**<br/><br/><br/>

**ejs.xml.encoding(text)**<br/><br/><br/>

## string.js
---
字符串相关方法类<br/>
**required:** core.js, utils.js<br/><br/><br/><br/>

### 方法：<br/><br/>

## date.js
---
日期相关方法类<br/>
**required:** core.js<br/><br/><br/><br/>

### 方法：<br/><br/>

## encrypt.js
---
加密相关方法类<br/>
**required:** core.js<br/><br/><br/><br/>

### 方法：<br/><br/>

## element.js
---
节点操作相关方法类<br/>
**required:** core.js<br/><br/><br/><br/>

### 方法：<br/><br/>

## array.js
---
数组相关方法类<br/>
**required:** core.js, utils.js<br/><br/><br/><br/>

### 方法：<br/><br/>

## request.js
---
ajax请求相关方法类<br/>
**required:** core.js, browser.js, string.js<br/><br/><br/><br/>

### 方法：<br/><br/>

## event.js
---
事件相关方法类<br/>
**required:** core.js, browser.js, utils.js, element.js<br/><br/><br/><br/>

### 方法：<br/><br/>
