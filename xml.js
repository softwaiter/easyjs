/*
 *  Xml class
 *
 *  Required: core.js
 */
if (!ejs.xml) {
    ejs.xml = {
        encoding: function (text) {
            return text.toString().replace(/\&/gm, "&amp;").replace(/\</gm, "&lt;").replace(/\>/gm, "&gt;").replace(/\"/gm, "&quot;");
        },
        decoding: function (text) {
            return text.toString().replace(/\&quot;/gm, "\"").replace(/\&gt;/gm, ">").replace(/\&lt;/gm, "<").replace(/\&amp;/gm, "&");
        }
    };

    /* Change Inteface for Mozilla */
    if (document.implementation && document.implementation.createDocument) {
        if (document.implementation.hasFeature("XPath", "3.0")) {
            Document.prototype.selectNodes = Element.prototype.selectNodes = function (xpath) {
                var xpe = new XPathEvaluator();
                var nsResolver = xpe.createNSResolver(this.ownerDocument == null ?
                         this.documentElement : this.ownerDocument.documentElement);
                var nodes = xpe.evaluate(xpath, this, nsResolver, 0, null);
                var found = [];
                var res;
                while (res = nodes.iterateNext())
                    found.push(res);
                return found;
            };

            Document.prototype.selectSingleNode = Element.prototype.selectSingleNode = function (xpath) {
                var nodes = this.selectNodes(xpath)
                if (!nodes || nodes.length < 1) {
                    return null;
                } else {
                    return nodes[0];
                }
            };
        };

        Document.prototype.__initError__ = function () {
            this.parseError.errorCode = 0;
            this.parseError.filepos = -1;
            this.parseError.line = -1;
            this.parseError.linepos = -1;
            this.parseError.reason = null;
            this.parseError.srcText = null;
            this.parseError.url = null;
        };
        
        Document.prototype.__checkForErrors__ = function () {
            if (this.documentElement.tagName == "parsererror") {
                var reError = />([\s\S]*?)Location:([\s\S]*?)Line Number (\d+), Column (\d+):<sourcetext>([\s\S]*?)(?:\-*\^)/;
                reError.test(this.xml);
                this.parseError.errorCode = -999999;
                this.parseError.reason = RegExp.$1;
                this.parseError.url = RegExp.$2;
                this.parseError.line = parseInt(RegExp.$3);
                this.parseError.linepos = parseInt(RegExp.$4);
                this.parseError.srcText = RegExp.$5;
            }
        };
    
        // add loadXML method for Mozilla
        Document.prototype.loadXML = function (text) {
            this.__initError__();
            this.__changeReadyState__(1);

            var dp = new DOMParser();
            var xd = dp.parseFromString(text, "text/xml");

            while (this.firstChild) {
                this.removeChild(this.firstChild);
            }

            for (var i = 0; i < xd.childNodes.length; i++) {
                var node = this.importNode(xd.childNodes[i], true);
                this.appendChild(node);
            }

            this.__checkForErrors__();
            this.__changeReadyState__(4);
        };

        // add readyState attribute for Mozilla
        Document.prototype.readyState = 0;

        // add onreadystatechange event for Mozilla
        Document.prototype.onreadystatechange = null;

        Document.prototype.__changeReadyState__ = function (rs) {
            this.readyState = rs;

            if (typeof this.onreadystatechange == "function") {
                this.onreadystatechange();
            }
        };

        // add load method for Mozilla
        Document.prototype.__load__ = Document.prototype.load;

        Document.prototype.load = function (url) {
            this.__initError__();
            this.__changeReadyState__(1);
            this.__load__(url);
        };

        Document.prototype.__defineGetter__("xml", function () {
            var xs = new XMLSerializer();
            return xs.serializeToString(this, "text/xml");
        });

        // add xml attribute for Mozilla(get)
        Node.prototype.__defineGetter__("xml", function () {
            var xs = new XMLSerializer();
            return xs.serializeToString(this, "text/xml");
        });

        // add text attribute for Mozilla(get)
        Node.prototype.__defineGetter__("text", function () {
            return this.textContent;
        });

        //add text attribute for Mozilla(set)
        Node.prototype.__defineSetter__("text", function (value) {
            this.textContent = value;
        });
    };
  
    ejs.xml.document = function () {
        if (window.ActiveXObject) {
            var arrMSXML = ["MSXML2.DOMDocument.6.0", "MSXML2.DOMDocument.5.0",
    						"MSXML2.DOMDocument.4.0", "MSXML2.DOMDocument.3.0",
    						"MSXML2.DOMDocument", "Microsoft.XmlDom"];

            for (var i = 0; i < arrMSXML.length; i++) {
                try {
                    return new ActiveXObject(arrMSXML[i]);
                } catch (xmlError) {
                }
            }
        } else if (document.implementation && document.implementation.createDocument) {
            var xd = document.implementation.createDocument("", "", null);

            xd.parseError = {
                valueOf: function () { return this.errorCode },
                toString: function () { return this.errorCode.toString() }
            };

            xd.__initError__();

            xd.addEventListener("load", function () {
                this.__checkForErrors__();
                this.__changeReadyState__(4);
            }, false);

            return xd;
        } else {
            throw new Error("Your browser doesn't support an XML DOM object.");
        }    
    };
};