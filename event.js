/*
 *	Events Class
 *
 *	Required: core.js, browser.js, utils.js, element.js
 */
if (!ejs.event) {
    ejs.event = {
        _UNIQUEID: "_unique_id_",

        _ELEMENT: 0,
        _TYPE: 1,
        _FUNC: 2,
        _OBJ: 3,
        _OVERRIDE: 4,
        _USERDEFINED: 5,

        _HANDLER_PREFIX: "handler_",

        listeners: [],
        customListeners: [],
        unloadListeners: [],
        lastError: null,
        loadCompleted: false,

        _setUniqueId: function (element, id) {
            element = ejs.element.getElement(element);
            if (element) {
                if (element.setAttribute) {
                    element.setAttribute(ejs.event._UNIQUEID, id);
                } else {
                    element[ejs.event._UNIQUEID] = id;
                }
            }
        },

        _getUniqueId: function (element) {
            element = ejs.element.getElement(element);
            if (element) {
                if (element.getAttribute) {
                    return element.getAttribute(ejs.event._UNIQUEID);
                } else {
                    return element[ejs.event._UNIQUEID];
                }
            }
            return null;
        },

        _removeUniqueId: function (element) {
            element = ejs.element.getElement(element);
            if (element) {
                if (element.removeAttribute) {
                    element.removeAttribute(ejs.event._UNIQUEID);
                } else {
                    delete element[ejs.event._UNIQUEID];
                }
                var childCount = ejs.element.getChildCount(element);
                for (var i = 0; i < childCount; i++) {
                    var childEl = ejs.element.getChild(element, i);
                    var xblBinding = childEl.getAttribute("xbl-binding");
                    if (ejs.utils.isNullOrUndefined(xblBinding)) {
                        this._removeUniqueId(childEl);
                    }
                }
            }
        },

        _isCustomEvent: function (element, type) {
            if (ejs.utils.isString(element)) {
                element = ejs.element.getElement(element);
            }

            if (!element) {
                return false;
            }

            if (!ejs.utils.isString(type)) {
                return false;
            }

            var uniqueId = this._getUniqueId(element);
            if (typeof (uniqueId) != "undefined") {
                if (typeof (this.customListeners[uniqueId]) != "undefined") {
                    if (typeof (this.customListeners[uniqueId][ejs.event._HANDLER_PREFIX + type]) != "undefined") {
                        return true;
                    }
                }
            }

            return false;
        },

        _addListener: function (element, type, func, capture) {
            if (element.attachEvent) {
                element.attachEvent("on" + type, func);
            } else if (element.addEventListener) {
                if (ejs.string.equals("mouseenter", type, true)) {
                    type = "mouseover";
                } else if (ejs.string.equals("mouseleave", type, true)) {
                    type = "mouseout";
                }
                if (ejs.string.equals("mousewheel", type, true)) {
                    if (ejs.browser.isFF()) {
                        type = "DOMMouseScroll";
                    }
                }
                element.addEventListener(type, func, (capture));
            }
        },

        _removeListener: function (element, type, func, capture) {
            if (element.detachEvent) {
                element.detachEvent("on" + type, func);
            } else if (element.removeEventListener) {
                if (ejs.string.equals("mouseenter", type, true)) {
                    type = "mouseover";
                } else if (ejs.string.equals("mouseleave", type, true)) {
                    type = "mouseout";
                }
                if (ejs.string.equals("mousewheel", type, true)) {
                    if (ejs.browser.isFF()) {
                        type = "DOMMouseScroll";
                    }
                }
                element.removeEventListener(type, func, (capture));
            }
        },

        _execListeners: function (event, type) {
            var uid = ejs.event._getUniqueId(this);
            var listenerEl = ejs.event.listeners[uid];
            if (listenerEl) {
                var currListener = listenerEl[ejs.event._HANDLER_PREFIX + type];
                if (currListener) {
                    if (currListener.$length && currListener.$length > 0) {
                        for (var i = 0; i < currListener.$length; i++) {
                            var lsn = currListener[ejs.event._HANDLER_PREFIX + i];
                            if (lsn) {
                                var scope = lsn[ejs.event._ELEMENT];
                                if (lsn[ejs.event._OVERRIDE]) {
                                    if (lsn[ejs.event._OVERRIDE] == true) {
                                        scope = lsn[ejs.event._OBJ];
                                    } else {
                                        scope = lsn[ejs.event._OVERRIDE];
                                    }
                                }
                                lsn[ejs.event._FUNC].call(scope, ejs.event.getEvent(event, lsn[ejs.event._ELEMENT]), lsn[ejs.event._OBJ]);
                            }

                            if (event.cancelBubble) {
                                return;
                            }
                        }
                    }
                }
            }
        },

        _getListenerByFunc: function (currListener, func) {
            if (currListener.$length && currListener.$length > 0) {
                for (var i = 0; i < currListener.$length; i++) {
                    var listener = currListener[ejs.event._HANDLER_PREFIX + i];
                    if (listener) {
                        var listenerFunc = listener[ejs.event._FUNC];
                        if (listenerFunc == func) {
                            return ejs.event._HANDLER_PREFIX + i;
                        }
                    }
                }
            }
            return null;
        },

        _clearElementListenersByType: function (element, type, recursion) {
            if (!this._isCustomEvent(element, type)) {
                var uid = this._getUniqueId(element);
                var listenerEl = ejs.event.listeners[uid];
                if (listenerEl) {
                    var currListener = listenerEl[ejs.event._HANDLER_PREFIX + type];
                    if (currListener) {
                        if (currListener.$length && currListener.$length > 0) {
                            for (var i = 0; i < currListener.$length; i++) {
                                var subHandler = currListener[ejs.event._HANDLER_PREFIX + i];
                                if (subHandler) {
                                    delete subHandler[ejs.event._ELEMENT];
                                    delete subHandler[ejs.event._TYPE];
                                    delete subHandler[ejs.event._FUNC];
                                    delete currListener[ejs.event._HANDLER_PREFIX + i];
                                    subHandler = null;
                                }
                            }
                        }

                        try {
                            ejs.event._removeListener(currListener.$element, currListener.$type, currListener, false);
                        } catch (err) {
                            this.lastError = err;
                            return false;
                        }

                        //remove current listener
                        delete currListener.$element;
                        delete currListener.$type;
                        delete currListener.$length;
                        delete listenerEl[ejs.event._HANDLER_PREFIX + type];

                        currListener = null;
                    }
                }
            } else {
                var uid = this._getUniqueId(element);
                var customListenerEl = this.customListeners[uid];
                if (customListenerEl) {
                    var customListener = customListenerEl[ejs.event._HANDLER_PREFIX + type];
                    if (customListener) {
                        var handlers = customListener.handlers;
                        ejs.array.clear(handlers);

                        delete customListener.handlers;
                        handlers = null;

                        delete customListenerEl[ejs.event._HANDLER_PREFIX + type];
                        customListener = null;
                    }
                }
            }

            if (recursion && element && element.childNodes) {
                for (var i = 0; i < element.childNodes.length; i++) {
                    this._clearElementListenersByType(element.childNodes[i], type, recursion);
                }
            }
        },

        getElementEvents: function (element, onlyUserdefined) {
            onlyUserdefined = ejs.string.toBoolean(onlyUserdefined);

            var result = [];
            var uid = this._getUniqueId(element);
            if (typeof (uid) != "undefined") {
                var listenerEl = ejs.event.listeners[uid];
                for (var eventType in listenerEl) {
                    var listener = listenerEl[eventType];
                    if (listener) {
                        if (listener.$length && listener.$length > 0) {
                            for (var i = 0; i < listener.$length; i++) {
                                var subHandler = listener[ejs.event._HANDLER_PREFIX + i];
                                var eType = subHandler[ejs.event._TYPE];
                                var func = subHandler[ejs.event._FUNC];
                                var thisObj = subHandler[ejs.event._OBJ];
                                var override = subHandler[ejs.event._OVERRIDE];
                                if (onlyUserdefined) {
                                    if (subHandler[ejs.event._USERDEFINED]) {
                                        result.push({
                                            "type": eType,
                                            "func": func,
                                            "thisObj": thisObj,
                                            "override": override
                                        });
                                    }
                                } else {
                                    result.push({
                                        "type": eType,
                                        "func": func,
                                        "thisObj": thisObj,
                                        "override": override
                                    });
                                }
                            }
                        }
                    }
                }

                if (this.customListeners[uid] != null) {
                    var customListener = this.customListeners[uid][ejs.event._HANDLER_PREFIX + type];
                    if (customListener != null) {
                        if (customListener.handlers != null &&
                                customListener.handlers.length > 0) {
                            for (var i = 0; i < customListener.handlers.length; i++) {
                                var eType = customListener.handlers[i][ejs.event._TYPE];
                                var func = customListener.handlers[i][ejs.event._FUNC];
                                var thisObj = customListener.handlers[i][ejs.event._OBJ];
                                var override = customListener.handlers[i][ejs.event._OVERRIDE];
                                if (onlyUserdefined) {
                                    if (customListener.handlers[i][ejs.event._USERDEFINED]) {
                                        result.push({
                                            "type": eType,
                                            "func": func,
                                            "thisObj": thisObj,
                                            "override": override
                                        });
                                    }
                                } else {
                                    result.push({
                                        "type": eType,
                                        "func": func,
                                        "thisObj": thisObj,
                                        "override": override
                                    });
                                }
                            }
                        }
                    }
                }
            }
            return result;
        },

        getElementEventsByType: function (element, type) {
            var result = [];
            var uid = this._getUniqueId(element);
            if (typeof (uid) != "undefined") {
                if (!this._isCustomEvent(element, type)) {	//w3c event
                    var listenerEl = ejs.event.listeners[uid];
                    if (listenerEl) {
                        var currListener = listenerEl[ejs.event._HANDLER_PREFIX + type];
                        if (currListener) {
                            if (currListener.$length && currListener.$length > 0) {
                                for (var i = 0; i < currListener.$length; i++) {
                                    var subHandler = currListener[ejs.event._HANDLER_PREFIX + i];
                                    var eType = subHandler[ejs.event._TYPE];
                                    var func = subHandler[ejs.event._FUNC];
                                    var thisObj = subHandler[ejs.event._OBJ];
                                    var override = subHandler[ejs.event._OVERRIDE];
                                    result.push({
                                        "type": eType,
                                        "func": func,
                                        "thisObj": thisObj,
                                        "override": override
                                    });
                                }
                            }
                        }
                    }
                } else {  //custom event
                    if (this.customListeners[uid] != null) {
                        var customListener = this.customListeners[uid][ejs.event._HANDLER_PREFIX + type];
                        if (customListener != null) {
                            if (customListener.handlers != null &&
                                customListener.handlers.length > 0) {
                                for (var i = 0; i < customListener.handlers.length; i++) {
                                    var eType = customListener.handlers[i][ejs.event._TYPE];
                                    var func = customListener.handlers[i][ejs.event._FUNC];
                                    var thisObj = customListener.handlers[i][ejs.event._OBJ];
                                    var override = customListener.handlers[i][ejs.event._OVERRIDE];
                                    result.push({
                                        "type": eType,
                                        "func": func,
                                        "thisObj": thisObj,
                                        "override": override
                                    });
                                }
                            }
                        }
                    }
                }
            }
            return result;
        },

        clearElementListeners: function (element, recursion) {
            var uid = this._getUniqueId(element);
            if (typeof (uid) != "undefined") {
                //w3c
                var listenerEl = ejs.event.listeners[uid];
                if (listenerEl) {
                    for (var eventType in listenerEl) {
                        var currListener = listenerEl[eventType];
                        if (currListener) {
                            if (currListener.$length) {
                                for (var i = 0; i < currListener.$length; i++) {
                                    var subHandler = currListener[ejs.event._HANDLER_PREFIX + i];
                                    if (subHandler && ejs.utils.isArray(subHandler)) {
                                        delete subHandler[ejs.event._ELEMENT];
                                        delete subHandler[ejs.event._TYPE];
                                        delete subHandler[ejs.event._FUNC];
                                        delete currListener[ejs.event._HANDLER_PREFIX + i];
                                    }
                                    subHandler = null;
                                }

                                try {
                                    ejs.event._removeListener(currListener.$element, currListener.$type, currListener, false);
                                } catch (err) {
                                    this.lastError = err;
                                    return false;
                                }

                                //remove current listener
                                delete currListener.$element;
                                delete currListener.$type;
                                delete currListener.$length;
                                delete listenerEl[eventType];

                                currListener = null;
                            }
                        }
                    }

                    delete ejs.event.listeners[uid];
                    listenerEl = null;
                }

                //custom event
                var customListener = ejs.event.customListeners[uid];
                if (customListener) {
                    for (var eventType in customListener) {
                        var typeListener = customListener[eventType];
                        if (typeListener) {
                            var handlers = typeListener.handlers;
                            if (typeof (handlers) != "undefined") {
                                ejs.array.clear(handlers);
                                handlers = null;
                                delete typeListener.handlers;
                            }
                            typeListener = null;
                            delete customListener[eventType];
                        }
                    }
                    customListener = null;
                    delete ejs.event.customListeners[uid];
                }
            }

            if (recursion) {
                for (var i = 0, l = ejs.element.getChildCount(element); i < l; i++) {
                    var childEl = ejs.element.getChild(element, i);
                    this.clearElementListeners(childEl, true);
                }
            }
        },

        _domReadyIE: function (event) {
            if (document.readyState == "interactive" ||
				document.readyState == "complete") {
                ejs.event._domReady(event);
            }
        },

        _domReady: function (event) {
            var targetEl = ejs.event.getTargetElement(event);
            var doc = ejs.element.getDoc(targetEl);
            if (!doc._domReady) {
                doc._domReady = true;

                var _domReadyListeners = doc.defaultView.frameElement == null ?
                    doc._domReadys : doc.defaultView.frameElement._domReadys;
                if (ejs.utils.isArray(_domReadyListeners)) {
                    for (var i = 0; i < _domReadyListeners.length; i++) {
                        var listener = _domReadyListeners[i];
                        if (listener) {
                            var scope = doc;
                            if (listener[ejs.event._OVERRIDE]) {
                                if (listener[ejs.event._OVERRIDE] == true) {
                                    scope = listener[ejs.event._OBJ];
                                } else {
                                    scope = listener[ejs.event._OVERRIDE];
                                }
                            }
                            listener[ejs.event._FUNC].call(scope, ejs.event.getEvent(event, listener[ejs.event._ELEMENT]), listener[ejs.event._OBJ]);

                            delete listener[ejs.event._FUNC];
                            scope = null;
                            listener = null;
                        }
                    }
                    ejs.array.clear(_domReadyListeners);
                }

                if (ejs.browser.isIE()) {
                    ejs.event._removeListener(doc, "readystatechange", ejs.event._domReadyIE);
                } else if (ejs.browser.isFF()) {
                    ejs.event._removeListener(doc, "DOMContentLoaded", ejs.event._domReady);
                }
            }
        },

        _load: function (event) {
            if (!ejs.event.loadCompleted) {
                ejs.event.loadCompleted = true;
            }
        },

        _execCustomEvent: function (event) {
            if (!ejs.utils.isNullOrUndefined(event)) {
                if (ejs.utils.isBoolean(event.isCustomEvent) && event.isCustomEvent) {
                    event.result = event.func.call(event.thisObj, event);
                }
            }
        },

        _unload: function (event) {
            ejs.event._removeListener(window, "unload", ejs.event._unload);
            ejs.event.removeListener(document, "errorupdate", ejs.event._execCustomEvent);

            for (var i = 0; i < ejs.event.unloadListeners.length; i++) {
                var listener = ejs.event.unloadListeners[i];
                if (listener) {
                    var scope = window;
                    if (listener[ejs.event._OVERRIDE]) {
                        if (listener[ejs.event._OVERRIDE] == true) {
                            scope = listener[ejs.event._OBJ];
                        } else {
                            scope = listener[ejs.event._OVERRIDE];
                        }
                    }
                    listener[ejs.event._FUNC].call(scope, ejs.event.getEvent(event, listener[ejs.event._ELEMENT]), listener[ejs.event._OBJ]);

                    delete ejs.event.unloadListeners[i][ejs.event._FUNC];
                    ejs.event.unloadListeners[i] = null;

                    scope = null;
                    listener = null;
                }
            }
            ejs.event.unloadListeners = null;

            //w3c event
            for (var eleUniqueId in ejs.event.listeners) {
                var listenerEl = ejs.event.listeners[eleUniqueId];
                if (listenerEl) {
                    for (var eventType in listenerEl) {
                        var currListener = listenerEl[eventType];
                        if (currListener) {
                            if (currListener.$length && currListener.$length > 0) {
                                for (var i = 0; i < currListener.$length; i++) {
                                    var subHandler = currListener[ejs.event._HANDLER_PREFIX + i];
                                    if (subHandler && ejs.utils.isArray(subHandler)) {
                                        delete subHandler[ejs.event._ELEMENT];
                                        delete subHandler[ejs.event._TYPE];
                                        delete subHandler[ejs.event._FUNC];
                                        delete currListener[ejs.event._HANDLER_PREFIX + i];
                                    }
                                    subHandler = null;
                                }

                                try {
                                    ejs.event._removeListener(currListener.$element, currListener.$type, currListener, false);
                                } catch (err) {
                                    this.lastError = err;
                                    return false;
                                }

                                //remove current listener
                                delete currListener.$element;
                                delete currListener.$type;
                                delete currListener.$length;
                                delete listenerEl[eventType];

                                currListener = null;
                            }
                        }
                    }

                    delete ejs.event.listeners[eleUniqueId];
                    listenerEl = null;
                }
            }
            ejs.event.listeners = null;

            //custom event
            for (var eleUniqueId in ejs.event.customListeners) {
                var listenerEl = ejs.event.customListeners[eleUniqueId];
                if (listenerEl) {
                    for (var eventType in listenerEl) {
                        var currListener = listenerEl[eventType];
                        if (currListener) {
                            var handlers = currListener.handlers;
                            if (typeof (handlers) != "undefined" && ejs.utils.isArray(handlers)) {
                                ejs.array.clear(handlers);
                                handlers = null;
                                delete currListener.handlers;
                            }
                            currListener = null;
                            delete listenerEl[eventType];
                        }
                    }
                    listenerEl = null;
                    delete ejs.event.customListeners[eleUniqueId];
                }
            }
            ejs.event.customListeners = null;

            ejs.utils = null;
            ejs.element = null;
            ejs.event = null;
            ejs = null;
        },

        getEvent: function (event, boundElement) {
            event = event || window.event;

            if (!event) {
                var c = this.getEvent.caller;
                while (c) {
                    event = c.arguments[0];
                    if (event && Event == event.constructor) {
                        break;
                    }
                    c = c.caller;
                }
            }

            return event;
        },

        registerCustomEvent: function (element, type) {
            if (ejs.utils.isString(element)) {
                element = ejs.element.getElement(element);
            }

            if (!element) {
                return false;
            }

            if (!ejs.utils.isString(type)) {
                return false;
            }

            var uniqueId = this._getUniqueId(element);
            if (ejs.utils.isNullOrUndefined(uniqueId)) {
                uniqueId = "uniqueId" + ejs.utils.makeRandom(9);
                /*
                element.$uniqueId = uniqueId;
                */

                this._setUniqueId(element, uniqueId);
            }

            if (typeof (this.customListeners[uniqueId]) == "undefined") {
                this.customListeners[uniqueId] = {};
            }

            if (typeof (this.customListeners[uniqueId][ejs.event._HANDLER_PREFIX + type]) == "undefined") {
                this.customListeners[uniqueId][ejs.event._HANDLER_PREFIX + type] = {};
            }
        },

        dispatchEvent: function (element, type, params) {
            var result = true;
            if (ejs.utils.isString(element)) {
                element = ejs.element.getElement(element);
            }

            if (!element) {
                return false;
            }

            if (!ejs.utils.isString(type)) {
                return false;
            }

            var ancestors = [];
            for (var a = element; a != null; a = ejs.element.getParent(a)) {
                ancestors.push(a);
            }

            for (var i = 0; i < ancestors.length; i++) {
                var a = ancestors[i];
                var uniqueId = this._getUniqueId(a);
                if (typeof (uniqueId) != "undefined") {
                    if (typeof (this.customListeners[uniqueId]) != "undefined") {
                        if (typeof (this.customListeners[uniqueId][ejs.event._HANDLER_PREFIX + type]) != "undefined") {
                            if (typeof (this.customListeners[uniqueId][ejs.event._HANDLER_PREFIX + type].handlers) != "undefined") {
                                var handlers = this.customListeners[uniqueId][ejs.event._HANDLER_PREFIX + type].handlers;
                                var event = null;
                                if (document.createEventObject) {
                                    event = document.createEventObject();
                                } else if (document.createEvent) {
                                    event = document.createEvent("HTMLEvents");
                                }
                                event.params = params || null;
                                if (event != null) {
                                    var canceled = false;
                                    event.isCustomEvent = true;
                                    event.eventElement = a;
                                    for (var j = handlers.length - 1; j >= 0; j--) {
                                        var handler = handlers[j];
                                        event.func = handler[ejs.event._FUNC];
                                        var scope = a;
                                        if (handler[ejs.event._OVERRIDE]) {
                                            if (handler[ejs.event._OVERRIDE] == true) {
                                                scope = handler[ejs.event._OBJ];
                                            } else {
                                                scope = handler[ejs.event._OVERRIDE];
                                            }
                                        }
                                        event.thisObj = scope;
                                        if (document.createEventObject) {
                                            document.fireEvent("onerrorupdate", event);
                                        } else if (document.createEvent) {
                                            event.initEvent("errorupdate", false, false);
                                            document.dispatchEvent(event);
                                        }
                                        canceled = canceled || event.cancelBubble;
                                    }
                                    result = event.result;
                                    if (canceled) {
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return result;
        },

        addListener: function (element, type, func, thisObj, override, userdefined) {
            if (!func || !func.call) {
                return false;
            }

            if (ejs.utils.isString(element)) {
                element = ejs.element.getElement(element);
            }

            if (!element) {
                return false;
            }

            if ("DOMReady" === type && thisObj != this) {
                var doc = ejs.element.getDoc(element);
                if (!doc._domReady) {
                    var _domReadyListeners = doc.defaultView.frameElement == null ?
                        doc._domReadys : doc.defaultView.frameElement._domReadys;
                    if (typeof (_domReadyListeners) == "undefined") {
                        if (doc.defaultView.frameElement == null) {
                            _domReadyListeners = doc._domReadys = [];
                        } else {
                            _domReadyListeners = doc.defaultView.frameElement._domReadys = [];
                        }
                    }
                    _domReadyListeners[_domReadyListeners.length] = [element, type, func, thisObj, override];
                }

                return true;
            }

            if ("unload" === type && thisObj != this) {
                ejs.event.unloadListeners[ejs.event.unloadListeners.length] = [element, type, func, thisObj, override];
                return true;
            }

            userdefined = ejs.string.toBoolean(userdefined);

            var uniqueId = this._getUniqueId(element);
            if (ejs.utils.isNullOrUndefined(uniqueId)) {
                uniqueId = "uniqueId" + ejs.utils.makeRandom(9);
                /*
                element.$uniqueId = uniqueId;
                */
                this._setUniqueId(element, uniqueId);
            }

            if (!this._isCustomEvent(element, type)) {  //w3c event
                var listenerEl = ejs.event.listeners[uniqueId];
                if (typeof (listenerEl) == "undefined") {
                    listenerEl = [];
                    ejs.event.listeners[uniqueId] = listenerEl;
                }

                var currListener = listenerEl[ejs.event._HANDLER_PREFIX + type];
                if (typeof (currListener) == "undefined") {
                    currListener = function (event) {
                        event = event || window.event;
                        ejs.event._execListeners.call(element, event, type);
                    }

                    currListener.$element = element;
                    currListener.$type = type;
                    currListener.$length = 0;
                    listenerEl[ejs.event._HANDLER_PREFIX + type] = currListener;

                    try {
                        this._addListener(element, type, currListener, false);
                    } catch (err) {
                        this.lastError = err;
                        return false;
                    }
                }
                if (currListener) {
                    currListener[ejs.event._HANDLER_PREFIX + currListener.$length] = [element, type, func, thisObj, override, userdefined];
                    currListener.$length++;
                }
            } else {
                if (typeof (uniqueId) != "undefined") {
                    if (typeof (this.customListeners[uniqueId]) != "undefined") {
                        if (typeof (this.customListeners[uniqueId][ejs.event._HANDLER_PREFIX + type]) != "undefined") {
                            if (typeof (this.customListeners[uniqueId][ejs.event._HANDLER_PREFIX + type].handlers) == "undefined") {
                                this.customListeners[uniqueId][ejs.event._HANDLER_PREFIX + type].handlers = [];
                            }
                            this.customListeners[uniqueId][ejs.event._HANDLER_PREFIX + type].handlers.push([element, type, func, thisObj, override, userdefined]);
                        }
                    }
                }
            }

            return true;
        },

        removeListener: function (element, type, func) {
            if (ejs.utils.isString(element)) {
                element = ejs.element.getElement(element);
            }

            if (!element) {
                return false;
            }

            if ("DOMReady" == type) {
                var doc = ejs.element.getDoc(element);
                var _domReadyListeners = doc.defaultView.frameElement == null ?
                        doc._domReadys : doc.defaultView.frameElement._domReadys;
                for (var i = 0; i < _domReadyListeners.length; i++) {
                    var listener = _domReadyListeners[i];
                    if (listener && listener.element && listener.type && listener.func) {
                        delete _domReadyListeners[i][ejs.event._FUNC];
                        _domReadyListeners[i] = null;
                        if (ejs.utils.isUndefined(arguments[3])) {
                            ejs.array.remove(_domReadyListeners, i);
                        }

                        return true;
                    }
                }
                return false;
            }

            if ("unload" == type) {
                for (var i = 0; i < ejs.event.unloadListeners.length; i++) {
                    var listener = ejs.event.unloadListeners[i];
                    if (listener && listener.element && listener.type && listener.func) {
                        delete ejs.event.unloadListeners[i][ejs.event._FUNC];
                        ejs.event.unloadListeners[i] = null;
                        if (ejs.utils.isUndefined(arguments[3])) {
                            ejs.array.remove(ejs.event.unloadListeners, i);
                        }

                        return true;
                    }
                }
                return false;
            }

            if (!func || !func.call) {
                ejs.event._clearElementListenersByType(element, type, false);
                return true;
            }

            var uid = arguments[3];
            if (ejs.utils.isNullOrUndefined(uid)) {
                uid = this._getUniqueId(element);
            }

            if (!this._isCustomEvent(element, type)) {
                var listenerEl = ejs.event.listeners[uid];
                if (!listenerEl) {
                    return false;
                }

                var currListener = listenerEl[ejs.event._HANDLER_PREFIX + type];
                if (currListener) {
                    var removedId = ejs.event._getListenerByFunc(currListener, func);
                    if (removedId) {
                        delete currListener[removedId][this._ELEMENT];
                        delete currListener[removedId][this._TYPE];
                        delete currListener[removedId][this._FUNC];
                        delete currListener[removedId];
                        currListener.$length--;
                    }

                    if (currListener.$length == 0) {
                        try {
                            this._removeListener(currListener.$element, currListener.$type, currListener, false);
                        } catch (err) {
                            this.lastError = err;
                            return false;
                        }

                        //remove current listener
                        delete currListener.$element;
                        delete currListener.$type;
                        delete currListener.$length;
                        delete listenerEl[type];
                        delete ejs.event.listeners[uid];
                    }
                }
            } else {
                var listenerEl = this.customListeners[uid];
                if (!listenerEl) {
                    return false;
                }
                var currListener = listenerEl[ejs.event._HANDLER_PREFIX + type];
                if (currListener) {
                    var handlers = currListener.handlers;
                    for (var i = 0; i < handlers.length; i++) {
                        var found = false;
                        if (handlers[i][ejs.event._FUNC] == func) {
                            ejs.array.remove(handlers, i);
                            found = true;
                        }
                        if (handlers.length == 0) {
                            delete currListener.handlers;
                            delete listenerEl[ejs.event._HANDLER_PREFIX + type];
                        }
                        if (found) {
                            break;
                        }
                    }
                }
            }

            return true;
        },

        stopPropagation: function (event) {
            if (event.stopPropagation) {
                event.stopPropagation();
            }
            event.cancelBubble = true;
        },

        preventDefault: function (event) {
            if (event.preventDefault) {
                event.preventDefault();
            } else {
                event.returnValue = false;
            }
        },

        stopEvent: function (event) {
            this.stopPropagation(event);
            this.preventDefault(event);
        },

        getTargetElement: function (event) {
            if (!ejs.utils.isBoolean(event.isCustomEvent)) {
                return event.srcElement ? event.srcElement : event.target;
            } else if (event.isCustomEvent) {
                return event.eventElement;
            }
        },

        getFromElement: function (event) {
            return event.fromElement || event.relatedTarget;
        },

        getToElement: function (event) {
            return event.toElement || event.relatedTarget;
        }
    };

	//Register some events(DOMReady, load, unload)
	function registerDomReadyEvent() {
		if (ejs.browser.isIE()) {
			ejs.event._addListener(document, "readystatechange", ejs.event._domReadyIE);
		} else if (ejs.browser.isFF()) {
			ejs.event._addListener(document, "DOMContentLoaded", ejs.event._domReady);
        } else {
            if (document.readyState == "loaded" || document.readyState == "interactive" || document.readyState == "complete") {
                var event = null;
                if (document.createEventObject) {
                    event = document.createEventObject();
                } else if (document.createEvent) {
                    event = document.createEvent("HTMLEvents");
                }
                if (event != null) {
                    event.eventElement = document;
                }
		        ejs.event._domReady(event);
		    } else {
		        window.setTimeout(arguments.callee, 20);
		    }
		}

		ejs.event._addListener(window, "load", ejs.event._load);
		ejs.event._addListener(document, "errorupdate", ejs.event._execCustomEvent);
		ejs.event._addListener(window, "unload", ejs.event._unload);
	};
	registerDomReadyEvent();

}