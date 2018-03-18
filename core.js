if (!ejs) {
    /**
     * @namespace
     * @version 1.0.0
     * @description EasyJs�������
     */
    var ejs = {
        version: '1.0.0',
        build: '20100614',

        /**
        * @static
        * @function
        * @description ʹ��ԭ�ͣ�prototype����ʽʵ��Javascript��֮��ļ̳й�ϵ��ʹ�ô˷�ʽ���ڴ����µ�ʵ��ʱ�������ּ̳��������Ժͷ�����
        * @param subClass ����
        * @param superClass ����
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
        * @description ��ָ������ʵ���������Ժͷ�������չ��ͨ�������ڶ���ʵ���������ڴ�����ʵ��ʱ������չ�����ݡ�
        * @param target ������չ�Ķ���ʵ��
        * @param overrided �Ƿ񸲸����е����Ի򷽷���true/false
        * @param ��3��N������ ��չ���Ժͷ�������Դ���󣬿���1������
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
	* @description ��չsetTimeout���������Զ�ָ̬��funcִ��ʱ��thisָ��
	* @param func ����ִ�еĺ���
	* @param delay �ӳ�ִ�е�ʱ��
	* @param ��3������ func����ִ��ʱ��thisָ��
	* @param ��4��N������ func����ִ��ʱ����
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
