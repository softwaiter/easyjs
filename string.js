if (!ejs.string) {
    /**
    * @namespace
    * @description �ַ�������
    * @requires core.js, utils.js
    */
    ejs.string = {
        /**
         * @static
         * @function
         * @description �ж��ַ����Ƿ�Ϊ��
         * @param text �����жϵ��ַ���
         * @returns �ַ���Ϊ�ջ�null������true�����򣬷���false
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
         * @description ����ָ���ַ����ĳ���
         * @param text �������㳤�ȵ��ַ���
         * @returns �����ַ����ĳ�����ֵ
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
         * @description ���Ӷ���ַ���������Ϊ����������ַ���
         * @returns �������Ӻõ����ַ���
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
         * @description ��ʽ���ַ������������������������ָ��λ��
         * @param text Ҫ��ʽ�����ַ���
         * @param ��2��N������ ���������1�������ַ���
         * @returns ���ظ�ʽ���ɹ������ַ���
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
         * @description �ж��ַ����Ƿ����ָ��������ʽ
         * @param text �ַ�������
         * @param regex ������ʽ����
         * @param ������ʽ������g-ȫ�Ĳ��ң�i-���Դ�Сд��m-���в���
         * @returns �����жϽ�����ɹ�����true�����򣬷���false
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
         * @description �ж��ַ����Ƿ���ָ��ǰ׺��ʼ
         * @param text �ַ�������
         * @param startText ǰ׺����
         * @param ignoreCase �Ƿ���Դ�Сд��true/false��Ĭ��false
         * @returns ���text����startText��ʼ������true�����򣬷���false
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
         * @description �ж��ַ����Ƿ���ָ����׺����
         * @param text �ַ�������
         * @param endText ��׺����
         * @param ignoreCase �Ƿ���Դ�Сд��true/false��Ĭ��false
         * @returns ���text����startText����������true�����򣬷���false
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
         * @description �ж��ַ������Ƿ����ָ�����ַ���
         * @param text �ַ�������
         * @param subText ���ַ�������
         * @param ignoreCase �Ƿ���Դ�Сд��true/false��Ĭ��false
         * @returns �����жϽ�������text�ַ����а���subText�ַ���������true�����򣬷���false
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
                * TODO Ӧ�ò���ת���������Զ�����
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
         * @description �ж������ַ��������Ƿ�һ��
         * @param text1 �ַ���1
         * @param text2 �ַ���2
         * @param ignoreCase �Ƿ���Դ�Сд��true/false��Ĭ��false
         * @returns �����жϽ���������ַ�����ȫ��ͬ������true�����򣬷���false
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
         * @description �Ƴ��ַ������հ��ַ�������
         * @param text �ַ�������
         * @returns ����ȥ�������ո������ַ���
         */
        leftTrim: function (text) {
            return (text || "").replace(/^\s+/g, "");
        },

        /**
         * @static
         * @function
         * @description �Ƴ��ַ����Ҳ�հ��ַ�������
         * @param text �ַ�������
         * @returns ����ȥ�����Ҳ�ո������ַ���
         */
        rightTrim: function (text) {
            return (text || "").replace(/\s+$/g, "");
        },

        /**
         * @static
         * @function
         * @description �Ƴ��ַ�������Ŀհ��ַ�������
         * @param text �ַ�������
         * @returns ����ȥ������ո������ַ���
         */
        trim: function (text) {
            return (text || "").replace(/(^\s+)|(\s+$)/g, "");
        },

        /**
         * @static
         * @function
         * @description ���ַ���ת��Ϊ�������Ͳ�����
         * @param text �ַ�������
         * @returns ����ת����Ĳ���ֵ
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
         * @description ���ַ���ת��Ϊ���Ͳ�����
         * @param text �ַ�������
         * @param radix ָ��ת���Ļ�����2-36����Ĭ��Ϊ10
         * @returns ����ת���������ֵ
         */
        toInt: function (text, radix) {
            var realTetx = text || "";
            return isNaN(parseInt(radix)) ? parseInt(text) : parseInt(text, radix);
        },

        /**
         * @static
         * @function
         * @description ���ַ���ת��Ϊ�����Ͳ�����
         * @param text �ַ�������
         * @returns ����ת����ĸ�����
         */
        toFloat: function (text) {
            var realText = text || "";
            return parseFloat(realText);
        },

        /**
         * @static
         * @function
         * @description ���ַ���ת��Ϊ���ڲ�����
         * @param text �ַ�������
         * @returns ����ת���������ʱ��ֵ
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