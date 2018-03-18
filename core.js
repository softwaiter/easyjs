if (!ejs) {
    /**
     * @namespace
     * @version 1.0.0
     * @description EasyJs库基本类
     */
    var ejs = {
        version: '1.0.0',
        build: '20100614',

        /**
        * @static
        * @function
        * @description 使用原型（prototype）方式实现Javascript类之间的继承关系，使用此方式会在创建新的实例时继续保持继承来的属性和方法。
        * @param subClass 子类
        * @param superClass 父类
        */
        inherit: function (subClass, superClass) {
            var scp = superClass.prototype;
            scp.constructor = superClass;
            superClass.call(scp);

            for (var p in scp) {
                if (typeof (subClass[p]) == "function" || typeof (subClass[p]) == "undefined") {
                    subClass.prototype[p] = scp[p];
                }
            }

            delete scp;
            scp = null;
        },

        /**
        * @static
        * @function
        * @description 对指定对象实例进行属性和方法的扩展，通常作用于对象实例，不会在创建新实例时保持扩展的内容。
        * @param target 将被扩展的对象实例
        * @param overrided 是否覆盖已有的属性或方法，true/false
        * @param 第3～N个参数 扩展属性和方法的来源对象，可以1个或多个
        */
        extend: function (target, overried) {
            if (typeof (overried) != "boolean") {
                overried = true;
            }

            var len = arguments.length;
            for (var i = 2; i < len; i++) {
                var src = arguments[i];
                if (src != null) {
                    for (var p in src) {
                        var prop = src[p];
                        if (prop == target) {
                            continue;
                        }
                        if (overried || typeof (target[p]) == "undefined") {
                            target[p] = prop;
                        }
                    }
                }
            }
        }
    };

	/**
	* @static
	* @function
	* @description 扩展setTimeout能力，可以动态指定func执行时的this指针
	* @param func 将被执行的函数
	* @param delay 延迟执行的时间
	* @param 第3个参数 func函数执行时的this指针
	* @param 第4～N个参数 func函数执行时参数
	*/
    var setTimeout2 = window.setTimeout;
    window.setTimeout = function (func, delay) {
        if (typeof (func) == "function") {
            var args = [];
            for (var i = 3; i < arguments.length; i++) {
                args[i - 3] = arguments[i];
            }
            var thisObj = null;
            if (arguments.length >= 3) {
                thisObj = arguments[2];
            }
            var f = (function () {
                try {
                    func.apply(thisObj, args)
                }
                catch (err) {
                    ;
                }
            });
            return setTimeout2(f, delay);
        }
        return setTimeout2(func, delay);
    };
}
