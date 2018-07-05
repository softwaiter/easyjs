/*
 * Request Class
 *
 * Required: core.js, browser.js, string.js
*/
if (!ejs.request) {
    ejs.request = {
        _defaultOptions: {
            method: "POST",
            contentType: "application/x-www-form-urlencoded",
            url: location.href,
            async: true,
            callback: null
        },

        sendRequest: function (options) {
            options = options || {};
            ejs.extend(options, false, this._defaultOptions);

            var method = options.method.toUpperCase();
            if (method == "POST") {
                if (!ejs.string.isNullOrEmpty(options.url)) {
                    if (!ejs.string.contains(options.url, "?")) {
                        options.url += "?tt=" + new Date().getTime();
                    } else {
                        options.url += "&tt=" + new Date().getTime();
                    }
                }
            }

            var dataType = "";
            var params = "";
            if (ejs.utils.isString(options.data)) {
                params = options.data;
            } else if (ejs.utils.isObject(options.data) ||
                ejs.utils.isArray(options.data)) {
                var inputData = {};
                if (options.dataType == "xml") {
                    inputData.dataType = "xml";
                    dataType = "xml";
                } else {
                    inputData.dataType = "json";
                    inputData.data = options.data;
                    params = inputData.toJSONString();
                    dataType = "json";
                }
            } else {
                throw new Error("不支持的参数格式。");
            }

            //ajax提交，如果session过期，会重新生成，并redirect，此时要定义是POST还是GET；并且如果是客户端，就应该返回特定的代码

            var xhr = ejs.browser.getRequest();
            xhr.open(method, options.url, options.async);
            xhr.setRequestHeader("Data-Type", dataType);
            if (method == "POST") {
                xhr.setRequestHeader("Content-Type", options.contentType);
            }
            if (options.action) {
                xhr.setRequestHeader("Request-Method", options.action);
            }

            var sessionId = ejs.browser.getQueryString("session");
            xhr.setRequestHeader("Session", sessionId);

            if (options.callback != null) {
                var requestReplyFunc = function () {
                    options.callback.call(xhr);
                };
                xhr.onreadystatechange = requestReplyFunc;
            }

            var data = (method == "GET" ? null : params);
            xhr.send(data);

            return xhr;
        },

        isSuccess: function (result) {
            return (result && (result.status >= 200) && (result.status < 300));
        }
    };
}