if (!ejs.utils) {
    /**
     * @namespace
     * @description ���÷���
     * @requires core.js
     */
    ejs.utils = {
        /**
         * @static
         * @function
         * @description �жϱ����Ƿ�Ϊnull
         * @param obj Ҫ�жϵı���
         * @returns ����Ϊnull������true�����򣬷���false
         */
        isNull: function (obj) {
            return obj == null;
        },

        /*
        * �жϲ����Ƿ�Ϊ������
        */
        isDate: function (obj) {
            return this.isObject(obj) && this.isFunction(obj.getDate);
        },

        /**
         * @static
         * @function
         * @description �жϱ����Ƿ�δ����
         * @param obj Ҫ�жϵı���
         * @returns ����δ���壬����true�����򣬷���false
         */
        isUndefined: function (obj) {
            return typeof (obj) == "undefined";
        },

        /**
         * @static
         * @function
         * @description �жϱ����Ƿ�Ϊnull����δ����
         * @param obj Ҫ�жϵı���
         * @returns ����Ϊnull����δ���壬����ture�����򣬷���false
         */
        isNullOrUndefined: function (obj) {
            return this.isNull(obj) || this.isUndefined(obj);
        },

        /**
         * @static
         * @function
         * @description �жϱ����Ƿ�Ϊ�ַ�������
         * @param obj Ҫ�жϵı���
         * @returns �������ַ������ͣ�����true�����򣬷���false
         */
        isString: function (obj) {
            return typeof (obj) == "string";
        },

        /**
         * @static
         * @function
         * @description �жϱ����Ƿ�Ϊ��ֵ��
         * @param obj Ҫ�жϵı���
         * @returns ��������ֵ������true�����򣬷���false
         */
        isNumber: function (obj) {
            return typeof (obj) == "number" && isFinite(obj);
        },

        /**
         * @static
         * @function
         * @description �жϱ����Ƿ�Ϊ������
         * @param obj Ҫ�жϵı���
         * @returns ����������������true�����򣬷���false
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
         * @description �жϱ����Ƿ�Ϊһ������ֵ��ture/false
         * @param obj Ҫ�жϵı���
         * @returns ������һ������ֵ������true�����򣬷���false
         */
        isBoolean: function (obj) {
            return typeof (obj) == "boolean";
        },

        /**
         * @static
         * @function
         * @description �жϱ����Ƿ���һ������
         * @param obj Ҫ�жϵı���
         * @returns ���������һ������������ture�����򣬷���false
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
         * @description �жϱ����Ƿ���һ������
         * @param obj Ҫ�жϵı���
         * @returns ����Ϊһ�����飬����ture�����򣬷���false
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
         * @description ���������
         * @param length ָ����������ĳ���
         * @returns �������ɺõ������
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
         * @description ��ȡ��������
         * @param func ��������
         * @returns ��������
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