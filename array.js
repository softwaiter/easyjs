if (!ejs.array) {
    /**
     * @namespace
     * @description 数组相关方法
     * @requires core.js, utils.js
     */
    ejs.array = {
        /**
         * @static
         * @function
         * @description 判断数组中是否包含指定项
         * @param array 数组对象
         * @param item 数组项
         * @returns 如果数组中存在指定数组项，返回true；否则，返回false
         */
        contains: function (array, item) {
            if (ejs.utils.isArray(array)) {
                for (var i = 0; i < array.length; i++) {
                    if (array[i] === item) {
                        return true;
                    }
                }
            }
            return false;
        },

        /**
         * @static
         * @function
         * @description 向数组中添加指定项
         * @param array 数组对象
         * @param 第2～N个参数 要添加的新数组项
         */
        append: function (array) {
            if (ejs.utils.isArray(array)) {
                var args = [];
                for (var i = 1; i < arguments.length; i++) {
                    args[i - 1] = arguments[i];
                }
                array.push.apply(array, args);
            }
        },

        /**
         * @static
         * @function
         * @description 向数组指定位置前插入指定项
         * @param array 数组对象
         * @param index 插入位置
         * @param 第3~N个参数 要插入的数组项
         */
        insert: function (array, index) {
            if (ejs.utils.isArray(array) && ejs.utils.isNumber(index)) {
                var args = [];
                args[0] = index;
                args[1] = 0;
                for (var i = 2; i < arguments.length; i++) {
                    args[i] = arguments[i];
                }
                array.splice.apply(array, args);
            }
        },

        /**
         * @static
         * @function
         * @description 删除指定位置处指定个数的数组项
         * @param array 数组对象
         * @param index 要删除的数组项起始索引
         * @param count 要删除的数组项个数，默认为1个
         */
        remove: function (array, index, count) {
            if (ejs.utils.isArray(array) && ejs.utils.isNumber(index)) {
                if (index >= 0 && index < array.length) {
                    count = ejs.utils.isNumber(count) ? count : 1;
                    array.splice(index, count);
                }
            }
        },

        /**
         * @static
         * @function
         * @description 删除数组中的指定项
         * @param array 数组对象
         * @param item 要删除的数组项
         */
        removeItem: function (array, item) {
            if (ejs.utils.isArray(array)) {
                var index = -1;
                for (var i = 0; i < array.length; i++) {
                    if (array[i] === item) {
                        index = i;
                        break;
                    }
                }
                array.splice(index, 1);
            }
        },

        /**
         * @static
         * @function
         * @description 清空数组
         * @param array 数组对象
         */
        clear: function (array) {
            if (ejs.utils.isArray(array)) {
                array.length = 0;
            }
        }
    };
}