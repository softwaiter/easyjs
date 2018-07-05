if (!ejs.string) {
    /**
    * @namespace
    * @description 字符串方法
    * @requires core.js, utils.js
    */
    ejs.string = {
        /**
         * @static
         * @function
         * @description 判断字符串是否为空
         * @param text 将被判断的字符串
         * @returns 字符串为空或null，返回true；否则，返回false
         */
        isNullOrEmpty: function (text) {
            if (ejs.utils.isNull(text)) {
                return true;
            } else if (ejs.utils.isString(text)) {
                return this.trim(text) == "";
            }
            return false;
        },

        /**
         * @static
         * @function
         * @description 计算指定字符串的长度
         * @param text 将被计算长度的字符串
         * @returns 返回字符串的长度数值
         */
        length: function (text) {
            if (ejs.utils.isNullOrUndefined(text)) {
                return NaN;
            }
            if (ejs.utils.isString(text)) {
                return text.length;
            } else {
                return text.toString().length;
            }
        },

        /**
         * @static
         * @function
         * @description 连接多个字符串；参数为任意个数的字符串
         * @returns 返回连接好的新字符串
         */
        concat: function () {
            var result = [];
            if (arguments.length > 0) {
                for (var i = 0; i < arguments.length; i++) {
                    result.push(arguments[i]);
                }
            }
            return result.join("");
        },

        /**
         * @static
         * @function
         * @description 格式化字符串，将后续参数按序号填入指定位置
         * @param text 要格式化的字符串
         * @param 第2～N个参数 将被填入的1个或多个字符串
         * @returns 返回格式化成功的新字符串
         */
        format: function (text) {
            if (ejs.utils.isString(text)) {
                var args = arguments;
                return text.replace(/\{(\d+)\}/g,
                    function (m, i) {
                        return args[i + 1];
                    });
            }
            return null;
        },

        /**
         * @static
         * @function
         * @description 判断字符串是否符合指定正则表达式
         * @param text 字符串内容
         * @param regex 正则表达式内容
         * @param 正则表达式参数；g-全文查找，i-忽略大小写，m-多行查找
         * @returns 返回判断结果，成功返回true；否则，返回false
         */
        isMatch: function (text, regex, options) {
            if (ejs.utils.isString(text) && ejs.utils.isString(regex)) {
                var re = new RegExp(regex, options);
                return re.test(text);
            }
            return false;
        },

        /**
         * @static
         * @function
         * @description 判断字符串是否以指定前缀开始
         * @param text 字符串内容
         * @param startText 前缀内容
         * @param ignoreCase 是否忽略大小写，true/false；默认false
         * @returns 如果text是以startText开始，返回true；否则，返回false
         */
        startsWith: function (text, startText, ignoreCase) {
            if (ejs.utils.isString(text) && ejs.utils.isString(startText)) {
                if (text.length >= startText.length) {
                    var ic = false;
                    if (ejs.utils.isBoolean(ignoreCase)) {
                        ic = ignoreCase;
                    } else if (ejs.utils.isString(ignoreCase)) {
                        ic = this.toBoolean(ignoreCase);
                    }

                    var subText = text.substring(0, startText.length);
                    if (ic) {
                        return subText.toUpperCase() == startText.toUpperCase();
                    } else {
                        return subText == startText;
                    }
                }
            }

            return false;
        },

        /**
         * @static
         * @function
         * @description 判断字符串是否以指定后缀结束
         * @param text 字符串内容
         * @param endText 后缀内容
         * @param ignoreCase 是否忽略大小写，true/false；默认false
         * @returns 如果text是以startText结束，返回true；否则，返回false
         */
        endsWith: function (text, endText, ignoreCase) {
            if (ejs.utils.isString(text) && ejs.utils.isString(endText)) {
                var ic = false;
                if (ejs.utils.isBoolean(ignoreCase)) {
                    ic = ignoreCase;
                } else if (ejs.utils.isString(ignoreCase)) {
                    ic = this.toBoolean(ignoreCase);
                }

                var subText = text.substring(text.length - endText.length);
                if (ic) {
                    return subText.toUpperCase() == endText.toUpperCase();
                } else {
                    return subText == endText;
                }
            }

            return false;
        },

        /**
         * @static
         * @function
         * @description 判断字符串中是否包含指定子字符串
         * @param text 字符串内容
         * @param subText 子字符串内容
         * @param ignoreCase 是否忽略大小写，true/false；默认false
         * @returns 返回判断结果，如果text字符串中包含subText字符串，返回true；否则，返回false
         */
        contains: function (text, subText, ignoreCase) {
            if (ejs.utils.isString(text) && ejs.utils.isString(subText)) {
                var ic = false;
                if (ejs.utils.isBoolean(ignoreCase)) {
                    ic = ignoreCase;
                } else if (ejs.utils.isString(ignoreCase)) {
                    ic = this.toBoolean(ignoreCase);
                }

                /*
                * TODO 应该不用转换，参数自动带的
                */

                subText = subText.replace("?", "\\?");
                subText = subText.replace("*", "\\*");
                subText = subText.replace("+", "\\+");
                subText = subText.replace(".", "\\.");
                subText = subText.replace("(", "\\(");
                subText = subText.replace(")", "\\)");
                subText = subText.replace("[", "\\[");
                subText = subText.replace("]", "\\]");
                subText = subText.replace("{", "\\{");
                subText = subText.replace("}", "\\}");

                subText = subText.replace("^", "\\^");
                subText = subText.replace("$", "\\$");
                subText = subText.replace("|", "\\|");

                var option = "g";
                if (ic) {
                    option = "gi";
                }
                var re = new RegExp(subText, option);
                return re.test(text);
            }

            return false;
        },

        /**
         * @static
         * @function
         * @description 判断两个字符串内容是否一致
         * @param text1 字符串1
         * @param text2 字符串2
         * @param ignoreCase 是否忽略大小写，true/false；默认false
         * @returns 返回判断结果，两个字符串完全相同，返回true；否则，返回false
         */
        equals: function (text1, text2, ignoreCase) {
            if (ejs.utils.isNull(text1)) {
                text1 = "";
            }
            text1 = text1.toString();
            if (ejs.utils.isNull(text2)) {
                text2 = "";
            }
            text2 = text2.toString();
            if (text1.length == text2.length) {
                var ic = false;
                if (ejs.utils.isBoolean(ignoreCase)) {
                    ic = ignoreCase;
                } else if (ejs.utils.isString(ignoreCase)) {
                    ic = this.toBoolean(ignoreCase);
                }

                if (ic) {
                    return text1.toUpperCase() == text2.toUpperCase();
                } else {
                    return text1 == text2;
                }
            }
            return false;
        },

        /**
         * @static
         * @function
         * @description 移除字符串左侧空白字符并返回
         * @param text 字符串内容
         * @returns 返回去除最左侧空格后的新字符串
         */
        leftTrim: function (text) {
            return (text || "").replace(/^\s+/g, "");
        },

        /**
         * @static
         * @function
         * @description 移除字符串右侧空白字符并返回
         * @param text 字符串内容
         * @returns 返回去除最右侧空格后的新字符串
         */
        rightTrim: function (text) {
            return (text || "").replace(/\s+$/g, "");
        },

        /**
         * @static
         * @function
         * @description 移除字符串两侧的空白字符并返回
         * @param text 字符串内容
         * @returns 返回去除两侧空格后的新字符串
         */
        trim: function (text) {
            return (text || "").replace(/(^\s+)|(\s+$)/g, "");
        },

        /**
         * @static
         * @function
         * @description 将字符串转换为布尔类型并返回
         * @param text 字符串内容
         * @returns 返回转换后的布尔值
         */
        toBoolean: function (text) {
            if (ejs.utils.isString(text)) {
                return (text.toUpperCase() == "TRUE") || (!isNaN(parseInt(text)) && (parseInt(text) != 0));
            } else if (ejs.utils.isNumber(text)) {
                return text != 0;
            } else if (ejs.utils.isBoolean(text)) {
                return text;
            }
            return false;
        },

        /**
         * @static
         * @function
         * @description 将字符串转换为整型并返回
         * @param text 字符串内容
         * @param radix 指定转换的基数（2-36），默认为10
         * @returns 返回转换后的整数值
         */
        toInt: function (text, radix) {
            var realTetx = text || "";
            return isNaN(parseInt(radix)) ? parseInt(text) : parseInt(text, radix);
        },

        /**
         * @static
         * @function
         * @description 将字符串转换为浮点型并返回
         * @param text 字符串内容
         * @returns 返回转换后的浮点数
         */
        toFloat: function (text) {
            var realText = text || "";
            return parseFloat(realText);
        },

        /**
         * @static
         * @function
         * @description 将字符串转换为日期并返回
         * @param text 字符串内容
         * @returns 返回转换后的日期时间值
         */
        toDateTime: function (text) {
            var value = text;
            if (ejs.utils.isString(value)) {
                value = value.replace("-", "/");
            }
            var dateValue = Date.parse(value);
            return new Date(dateValue);
        }
    };

    /*
     * StringBuilder Class
     */
    ejs.string.StringBuilder = function () {
        this._items_ = new Array();
    };

    ejs.string.StringBuilder.prototype.append = function (str) {
        this._items_.push(str);
    };

    ejs.string.StringBuilder.prototype.insert = function (str, index) {
        this._items_.splice(index, 0, str);
    };

    ejs.string.StringBuilder.prototype.remove = function (start, count) {
        if (typeof count === "undefined") {
            return this._items_.splice(start, 1);
        } else {
            return this._items_.splice(start, count);
        }
    };

    ejs.string.StringBuilder.prototype.length = function () {
        return this._items_.join("").length;
    };

    ejs.string.StringBuilder.prototype.indexOf = function (str) {
        return this._items_.join("").indexOf(str);
    };

    ejs.string.StringBuilder.prototype.lastIndexOf = function (str) {
        return this._items_.join("").lastIndexOf(str);
    };

    ejs.string.StringBuilder.prototype.substring = function (start, count) {
        if (typeof count === "undefined") {
            return this._items_.join("").substr(start);
        } else {
            return this._items_.join("").substr(start, count);
        }
    };

    ejs.string.StringBuilder.prototype.search = function (regExp) {
        return this._items_.join("").search(rgExp);
    };

    ejs.string.StringBuilder.prototype.replace = function (regExp, replaceText) {
        var sb = new ejs.string.StringBuilder();
        sb._items_.push(this._items_.join("").replace(rgExp, replaceText));
        return sb;
    };

    ejs.string.StringBuilder.prototype.toString = function () {
        return this._items_.join("");
    };
}