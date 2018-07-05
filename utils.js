if (!ejs.utils) {
    /**
     * @namespace
     * @description 常用方法
     * @requires core.js
     */
    ejs.utils = {
        /**
         * @static
         * @function
         * @description 判断变量是否为null
         * @param obj 要判断的变量
         * @returns 变量为null，返回true；否则，返回false
         */
        isNull: function (obj) {
            return obj == null;
        },

        /**
         * @static
         * @function
         * @description 判断参数是否为日期型
         * @param obj 要判断的变量
         * @returns 变量为日期类型，返回true；否则，返回false
         */
        isDate: function (obj) {
            return this.isObject(obj) && this.isFunction(obj.getDate);
        },

        /**
         * @static
         * @function
         * @description 判断变量是否未定义
         * @param obj 要判断的变量
         * @returns 变量未定义，返回true；否则，返回false
         */
        isUndefined: function (obj) {
            return typeof (obj) == "undefined";
        },

        /**
         * @static
         * @function
         * @description 判断变量是否为null或者未定义
         * @param obj 要判断的变量
         * @returns 变量为null或者未定义，返回ture；否则，返回false
         */
        isNullOrUndefined: function (obj) {
            return this.isNull(obj) || this.isUndefined(obj);
        },

        /**
         * @static
         * @function
         * @description 判断变量是否为字符串类型
         * @param obj 要判断的变量
         * @returns 变量是字符串类型，返回true；否则，返回false
         */
        isString: function (obj) {
            return typeof (obj) == "string";
        },

        /**
         * @static
         * @function
         * @description 判断变量是否为数值型
         * @param obj 要判断的变量
         * @returns 变量是数值，返回true；否则，返回false
         */
        isNumber: function (obj) {
            return typeof (obj) == "number" && isFinite(obj);
        },

        /**
         * @static
         * @function
         * @description 判断变量是否为整数型
         * @param obj 要判断的变量
         * @returns 变量是整数，返回true；否则，返回false
         */
        isInt: function (obj) {
            if (this.isNumber(obj)) {
                return !/\./.test(obj.toString());
            }
            return false;
        },

        /**
         * @static
         * @function
         * @description 判断变量是否为一个布尔值，ture/false
         * @param obj 要判断的变量
         * @returns 变量是一个布尔值，返回true；否则，返回false
         */
        isBoolean: function (obj) {
            return typeof (obj) == "boolean";
        },

        /**
         * @static
         * @function
         * @description 判断变量是否是一个函数
         * @param obj 要判断的变量
         * @returns 如果变量是一个函数，返回ture；否则，返回false
         */
        isFunction: function (obj) {
            return (typeof (obj) == "function") || ejs.string.startsWith(ejs.string.trim("" + obj), "function", true);
        },

        isObject: function (obj) {
            return (obj && (typeof (obj) == "object" || typeof (obj) == "function")) || false;
        },

        /**
         * @static
         * @function
         * @description 判断变量是否是一个数组
         * @param obj 要判断的变量
         * @returns 变量为一个数组，返回ture；否则，返回false
         */
        isArray: function (obj) {
            if (obj) {
                return this.isNumber(obj.length) && this.isFunction(obj.splice);
            }
            return false;
        },

        /**
         * @static
         * @function
         * @description 生成随机数
         * @param length 指定生成随机的长度
         * @returns 返回生成好的随机数
         */
        makeRandom: function (length) {
            var r = Math.random();
            var s = r.toString();
            length = ejs.utils.isNumber(length) ? length : 12;
            if (s.length > length + 2) {
                return s.substring(2, length + 2);
            }
            return s.substring(2);
        },

        toHex: function (value, length) {
            var strValue = window.Number(value).toString(16);
            if (strValue.length < length) {
                strValue = window.Array(length + 1 - strValue.length).join('0') + strValue;
            }
            return strValue;
        },

        /**
         * @static
         * @function
         * @description 获取函数名称
         * @param func 函数对象
         * @returns 函数名称
         */
        getFuncName: function (func) {
            var funcBody = func.toString();
            var re = /^function\s*(\w*)\s*\([^\)]*\).*/;
            if (funcBody.match(re)) {
                var funcName = RegExp.$1;
                return (funcName || "").replace(/(^\s+)|(\s+$)/g, "");
            }
            return null;
        }

    };
}