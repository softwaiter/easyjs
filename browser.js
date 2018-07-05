/*
 *	Browser Class
 */
if (!ejs.browser) {
    ejs.browser = {
        _isIE: null,
        isIE: function () {
            if (this._isIE == null) {
                var ua = navigator.userAgent.toLowerCase();
                this._isIE = ua.indexOf("compatible") > -1 &&
				    ua.indexOf("msie") > -1 &&
                    !(ua.indexOf("opera") > -1);

                if (!this._isIE) {
                    this._isIE = ua.indexOf('trident') > -1 && 
                        ua.indexOf("rv:11.0") > -1;
                    if (!this._isIE) {
                        this._isIE = ua.indexOf("edge") > -1;
                    }
                }
            }
            return this._isIE;
        },

        _isFF: null,
        isFF: function () {
            if (this._isFF == null) {
                var ua = navigator.userAgent.toLowerCase();
                this._isFF = !(ua.indexOf("khtml") > -1 ||
				    ua.indexOf("konqueror") > -1 ||
				    ua.indexOf("applewebkit") > -1) &&
				    (ua.indexOf("gecko") > -1);
            }
            return this._isFF;
        },

        _isChrome: null,
        isChrome: function () {
            if (this._isChrome == null) {
                var ua = navigator.userAgent.toLowerCase();
                this._isChrome = ua.indexOf("chrome") > -1;
            }
            return this._isChrome;
        },

        getIEVer: function () {
            if (navigator.appName == "Microsoft Internet Explorer") {
                if (navigator.appVersion.match(/MSIE 9.0/i) == 'MSIE 10.0') {
                    return 10;
                } else if (navigator.appVersion.match(/MSIE 9.0/i) == 'MSIE 9.0') {
                    return 9;
                } else if (navigator.appVersion.match(/MSIE 8.0/i) == 'MSIE 8.0') {
                    return 8;
                } else if (navigator.appVersion.match(/MSIE 7.0/i) == 'MSIE 7.0') {
                    return 7;
                } else if (navigator.appVersion.match(/MSIE 6.0/i) == 'MSIE 6.0') {
                    return 6;
                } else {
                    var ua = navigator.userAgent.toLowerCase();
                    if (ua.indexOf('trident') > -1 && ua.indexOf("rv:11.0") > -1) {
                        return 11;
                    } else if (ua.indexOf("edge") > -1) {
                        return "edge";
                    }
                }
            }
            return 0;
        },

        _baseUrl: null,
        getBaseURL: function () {
            if (this._baseUrl == null) {
                var pathName = window.location.pathname.substring(1);
                var webName = pathName == '' ? '' : pathName.substring(0, pathName.indexOf('/'));
                this._baseUrl = window.location.protocol + '//' + window.location.host + '/' + webName;
            }
            return this._baseUrl;
        },

        getQueryString: function (name) {
            var result = window.location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
            if (result == null || result.length < 1) {
                return "";
            }
            return result[1];
        },

        _redirectCounter: 0,
        _redirect: function (url) {
            if (ejs.browser._redirectCounter == 5) {
                window.location = url;
            } else {
                ejs.browser._redirectCounter++;
                setTimeout(ejs.browser._redirect, 100, this, url);
            }
        },

        convertToRelativeUrl: function (url) {
            if (!ejs.string.isNullOrEmpty(url)) {
                if (ejs.string.startsWith(url, "http://") ||
                ejs.string.startsWith(url, "https://")) {
                    var baseUrl = this.getBaseURL();
                    var relativeUrl = url.toLowerCase().replace(baseUrl.toLowerCase(), "");
                    if (ejs.string.startsWith(relativeUrl, "/")) {
                        relativeUrl = relativeUrl.substring(1);
                    }
                    return relativeUrl;
                } else {
                    return url;
                }
            }
            return "";
        },

        resolveUrl: function (url, addSession) {
            if (!ejs.string.startsWith(url, "http://") &&
                !ejs.string.startsWith(url, "https://")) {
                if (ejs.string.startsWith(url, "/")) {
                    url = this.getBaseURL() + url;
                } else {
                    url = this.getBaseURL() + "/" + url;
                }
            }
            if (ejs.utils.isNullOrUndefined(addSession)) {
                addSession = true;
            }
            if (addSession) {
                var session = this.getQueryString("session");
                if (!ejs.string.isNullOrEmpty(session)) {
                    if (ejs.string.contains(url, "?")) {
                        url += ("&session=" + session);
                    } else {
                        url += ("?session=" + session);
                    }
                }
            }
            return url;
        },

        redirect: function (url, addBaseUrl, addSession) {
            var abu = true;
            if (!ejs.utils.isNullOrUndefined(addBaseUrl)) {
                abu = addBaseUrl;
            }

            if (abu) {
                if (ejs.string.startsWith(url, "/")) {
                    if (ejs.string.endsWith(this.getBaseURL(), "/")) {
                        url = this.getBaseURL() + url.substring(1);
                    } else {
                        url = this.getBaseURL() + url;
                    }
                } else {
                    if (ejs.string.endsWith(this.getBaseURL(), "/")) {
                        url = this.getBaseURL() + url;
                    } else {
                        url = this.getBaseURL() + "/" + url;
                    }
                }
            }

            var ass = true;
            if (!ejs.utils.isNullOrUndefined(addSession)) {
                ass = addSession;
            }
            if (ass) {
                var session = this.getQueryString("session");
                if (!ejs.string.isNullOrEmpty(session)) {
                    if (ejs.string.contains(url, "?")) {
                        url += ("&session=" + session);
                    } else {
                        url += ("?session=" + session);
                    }
                }
            }

            ejs.browser._redirectCounter = 0;
            setTimeout(ejs.browser._redirect, 100, this, url);
        },

        getRequest: function () {
            if (window.XMLHttpRequest) {
                return new window.XMLHttpRequest;
            } else {
                var arrObjects = ["MSXML2.XMLHTTP.5.0", "MSXML2.XMLHTTP.4.0",
								  "MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP",
								  "Microsoft.XMLHTTP"];
                for (var i = 0; i < arrObjects.length; i++) {
                    try {
                        var oRequest = new ActiveXObject(arrObjects[i]);
                        return oRequest;
                    } catch (err) {
                    }
                }
            }
        },

        fetchDocument: function (sUri, async) {
            var xhr = this.getRequest();

            if (async) {
                xhr.open("GET", sUri, async);
            } else {
                xhr.open("GET", sUri, false);
            }

            if (isFF()) {
                xhr.overrideMimeType("text/xml");
            }

            xhr.send(null);

            return xhr;
        },

        resolveUri: function (refUri, baseUri) {
            function __getUriFrame__(sUri) {
                var arrMatchs = sUri.match(/^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\\?([^#]*))?(#(.*))?/),
					arrResult = {};

                arrResult._scheme = arrMatchs[2];
                arrResult._authority = arrMatchs[4];
                arrResult._path = arrMatchs[5];
                arrResult._query = arrMatchs[7];
                arrResult._fragment = arrMatchs[9];

                return arrResult;
            };

            if (refUri === '' || refUri.charAt(0) === '#') {
                return baseUri;
            }

            var refUriFrame = __getUriFrame__(refUri);

            if (refUriFrame._scheme) {
                return refUri;
            }

            var baseUriFrame = __getUriFrame__(baseUri);
            refUriFrame._scheme = baseUriFrame._scheme;

            if (!refUriFrame._authority) {
                refUriFrame._authority = baseUriFrame._authority;

                if (refUriFrame._path.charAt(0) != '/') {
                    var arrRefUriSegments = refUriFrame._path.split('/'),
						arrBaseUriSegments = baseUriFrame._path.split('/');

                    arrBaseUriSegments.pop();

                    var nBaseUriStart = arrBaseUriSegments[0] === '' ? 1 : 0;

                    for (var i = 0, l = arrRefUriSegments.length; i < l; i++) {
                        if (arrRefUriSegments[i] === "..") {
                            if (arrBaseUriSegments.length > nBaseUriStart) {
                                arrBaseUriSegments.pop();
                            } else {
                                arrBaseUriSegments.push(arrRefUriSegments[i]);
                                nBaseUriStart++;
                            }
                        } else if (arrRefUriSegments[i] != '.') {
                            arrBaseUriSegments.push(arrRefUriSegments[i]);
                        }
                    }

                    if (arrRefUriSegments[--i] === ".." || arrRefUriSegments[i] === '.') {
                        arrBaseUriSegments.push('');
                    }

                    refUriFrame._path = arrBaseUriSegments.join('/');
                }
            }

            var arrResult = [];
            if (refUriFrame._scheme) {
                arrResult.push(refUriFrame._scheme + ':');
            }
            if (refUriFrame._authority) {
                arrResult.push('/' + '/' + refUriFrame._authority);
            }
            if (refUriFrame._path) {
                arrResult.push(refUriFrame._path);
            }
            if (refUriFrame._query) {
                arrResult.push('?' + refUriFrame._query);
            }
            if (refUriFrame._fragment) {
                arrResult.push('#' + refUriFrame._fragment);
            }

            return arrResult.join('');
        }
    };
}
