/*
 *	Element Class
 *	
 *	Required: core.js
 */
if (!ejs.element) {
    if (ejs.browser.isFF()) {
		HTMLElement.prototype.__defineGetter__("children", function () { 
     		var returnValue = new Object(); 
     		var number = 0; 
     		for (var i=0; i<this.childNodes.length; i++) { 
         		if (this.childNodes[i].nodeType == 1) { 
             		returnValue[number] = this.childNodes[i]; 
             		number++; 
         		} 
     		} 
     		returnValue.length = number; 
     		return returnValue; 
 		});
    }

    ejs.element = {
        /*
        * 根据id值获得对应元素
        * id: 元素或元素id
        */
        getElement: function (id) {
            return (typeof (id) === "string") ? document.getElementById(id) : id;
        },

        hide: function (element) {
            var element = this.getElement(element);
            if (element) {
                var oldDisplay = this.getCssValue(element, "display");
                if (oldDisplay != "none") {
                    element.prevDisplay = oldDisplay;
                    element.style.display = "none";
                }
            }
        },

        show: function (element) {
            var element = this.getElement(element);
            if (element) {
                var oldDisplay = this.getCssValue(element, "display");
                if (oldDisplay == "none") {
                    var prevDisplay = element.prevDisplay;
                    if (ejs.utils.isNullOrUndefined(prevDisplay)) {
                        /*
                        TODO 此处到底是用inline 还是inline-block，操，不解，shit，还是先用block吧，没有宽度就100%，有就按宽度
                        */
                        prevDisplay = "block";
                    }
                    element.style.display = prevDisplay;
                }
            }
        },

        /*
        * 判断元素是否为页面根元素
        * element: 要判断的元素或元素id
        */
        isBody: function (element) {
            element = this.getElement(element);
            if (element) {
                return (element.tagName == "BODY" || element.tagName == "HTML");
            }
            return false;
        },

        /*
        * 删除指定元素
        * element: 要删除的元素或元素id
        * really: 是否彻底删除元素，默认不是
        */
        remove: function (element, really) {
            var element = this.getElement(element);
            if (element) {
                ejs.event.clearElementListeners(element, true);
                if (really) {
                    if (!window.elementRecycler) {
                        var recycleEl = document.createElement("DIV");
                        recycleEl.id = "$element-recycler$";
                        window.elementRecycler = recycleEl;
                    }
                    window.elementRecycler.appendChild(element);
                    window.elementRecycler.innerHTML = "";
                    element = null;
                    delete element;
                } else {
                    this.getParent(element).removeChild(element);
                }
            }
        },

        /*
        * 获得元素的的指定css属性值
        * element: 元素或元素id
        * property: css属性名
        */
        getCssValue: function (element, property) {
            element = this.getElement(element);
            if (element) {
                if (element.currentStyle) {
                    var props = property.split("-");
                    var realPropName = props[0];
                    if (props.length > 1) {
                        for (var i = 1; i < props.length; i++) {
                            realPropName += (props[i].substring(0, 1).toUpperCase() + props[i].substring(1));
                        }
                    }
                    return element.currentStyle[realPropName];
                } else {
                    if (property == "margin-right" && ejs.browser.isChrome()) {
                        var oldDisplay = window.getComputedStyle(element, null).getPropertyValue("display");
                        element.style.display = "inline-block";
                        var result = window.getComputedStyle(element, null).getPropertyValue(property);
                        element.style.display = oldDisplay;
                        return result;
                    } else {
                        return window.getComputedStyle(element, null).getPropertyValue(property);
                    }
                }
            }
        },

        /*
        * 获得指定元素的父元素
        * element: 元素或元素id
        */
        getParent: function (element) {
            element = this.getElement(element);
            if (element) {
                return element.parentNode;
            }
        },

        /*
        * 判断浏览器是否支持插入空节点
        */
        supportsContainsTextNode: function () {
            var result = false;
            var node = document.createElement("DIV");
            var textNode = node.appendChild(document.createTextNode(''));
            try {
                result = node.contains(textNode);
            } catch (e) {
            }
            return result;
        },

        /*
        * 判断元素2是否元素1的子元素
        * element1: 元素1或元素1id
        * element2: 元素2或元素2id
        */
        contains: function (element, child) {
            var result = false;
            element = this.getElement(element);
            child = this.getElement(child);
            if (element && child) {
                if (element.contains && child.nodeType == 1 || this.supportsContainsTextNode()) {
                    result = element.contains(child);
                } else if (element.compareDocumentPosition) {
                    if (!!(element.compareDocumentPosition(child) & 16)) {
                        result = true;
                    }
                } else {
                    var p = child.parentNode;
                    while (p != null) {
                        if (p == element) {
                            result = true;
                            break;
                        }
                        p = p.parentNode;
                    }
                }
            }
            return result;
        },

        /*
        * 返回指定元素的子元素个数
        * element: 元素或元素id
        */
        getChildCount: function (element) {
            element = this.getElement(element);
            if (element) {
                if (element.children && element.children.length) {
                    return element.children.length;
                }
            }
            return 0;
        },

        /*
        * 返回元素的指定子元素
        * element: 元素或元素id
        * index: 子元素索引值
        */
        getChild: function (element, index) {
            element = this.getElement(element);
            if (element) {
                if (element.children && element.children.length) {
                    if (index >= 0 && index < element.children.length) {
                        return element.children[index];
                    }
                }
            }
            return null;
        },

        /*
        * 返回指定元素的第1个子元素
        * element: 元素或元素id
        */
        getFirstChild: function (element) {
            return this.getChild(element, 0);
        },

        /*
        * 返回指定元素的最后一个子元素
        * element: 元素或元素id
        */
        getLastChild: function (element) {
            var count = this.getChildCount(element);
            this.getChild(element, count - 1);
        },

        /*
        * 得到指定节点的下一个兄弟节点
        * element: 元素或元素id
        */
        getNextSibling: function (element) {
            element = this.getElement(element);
            var nextEl = element.nextSibling;
            while (nextEl != null && nextEl.nodeType != 1) {
                nextEl = nextEl.nextSibling;
            }
            return nextEl;
        },

        /*
        * 得到指定节点的上一个兄弟节点
        * element: 元素或元素id
        */
        getPrevSibling: function (element) {
            element = this.getElement(element);
            var prevEl = element.previousSibling;
            while (prevEl != null && prevEl.nodeType != 1) {
                prevEl = prevEl.previousSibling;
            }
            return prevEl;
        },

        /*
        * 返回指定元素的文本内容
        * element: 元素或元素id
        */
        getText: function (element) {
            element = this.getElement(element);
            if (element) {
                if (!ejs.utils.isUndefined(element.value) && !ejs.string.isNullOrEmpty(element.value)) {
                    return element.value;
                } else if (!ejs.utils.isUndefined(element.innerText)) {
                    return element.innerText;
                } else if (!ejs.utils.isUndefined(element.textContent)) {
                    return element.textContent;
                }
            }
            return null;
        },

        /*
        * 设置元素的文本内容
        * element: 元素或元素id
        * value: 待设置文本内容
        */
        setText: function (element, value) {
            element = this.getElement(element);
            if (element) {
                if (!ejs.utils.isUndefined(element.value)) {
                    element.value = value;
                }
                if (ejs.browser.isIE()) {
                    element.innerText = value;
                } else if (!ejs.utils.isUndefined(element.textContent)) {
                    element.textContent = value;
                }
            }
        },

        /*
        * 判断元素是否拥有指定css类
        * element: 元素或元素id
        * className: css类名称
        */
        hasClass: function (element, className) {
            element = this.getElement(element);
            if (element && element.className) {
                var re = new RegExp("\\b" + className + "\\b");
                return element.className.match(re) != null;
            } else {
                return false;
            }
        },

        /*
        * 为元素增加指定css类
        * element: 元素或元素id
        * className: css类名称
        */
        addClass: function (element, className) {
            element = this.getElement(element);
            if (element && className) {
                this.removeClass(element, className);
                element.className = element.className ? (element.className + " " + className) : className;
            }
        },

        /*
        * 移除元素中的指定css类
        * element: 元素或元素id
        * className: css类名称
        */
        removeClass: function (element, className) {
            element = this.getElement(element);
            if (element && element.className && className) {
                var re = new RegExp("\\b" + className.split(" ").join("|") + "\\b", "g");
                var oldClasses = element.className;
                var newClasses = oldClasses.replace(re, "");
                if (newClasses != oldClasses) {
                    element.className = newClasses;
                }
            }
        },

        /*
        * 为元素批量增加css类（规则是将现有css类增加指定后缀复制一份）
        * element: 元素或元素id
        * suffix: 指定后缀
        */
        cloneClassWithSuffix: function (element, suffix) {
            element = this.getElement(element);
            if (element) {
                var clsName = element.className;
                if (!ejs.utils.isNullOrUndefined(clsName)) {
                    clsName = ejs.string.trim(clsName);
                    var newClsName = clsName + " " + clsName.replace(/(\b[^'"\s]+\b)+/gi, "$1" + suffix);
                    element.className = ejs.string.trim(newClsName);
                }
            }
        },

        /*
        * 批量移除元素的指定css类（规则是移除指定后缀的css类）
        * element: 元素或元素id
        * suffix: 指定后缀
        */
        removeClassWithSuffix: function (element, suffix) {
            element = this.getElement(element);
            if (element) {
                var clsName = element.className;
                if (!ejs.utils.isNullOrUndefined(clsName)) {
                    clsName = ejs.string.trim(clsName) + " ";
                    var re = new RegExp("([^'\"\\s]+" + suffix + "\\s)", "gi");
                    var newClsName = clsName.replace(re, "");
                    element.className = ejs.string.trim(newClsName);
                }
            }
        },

        /*
        * 判断元素是否有指定属性
        * element: 元素或元素id
        * attrName: 属性名称
        */
        hasAttribute: function (element, attrName) {
            element = this.getElement(element);
            if (element && element.getAttribute(attrName) != null) {
                return true;
            }
            return false;
        },

        /*
        * 将未决元素按指定模式应用到指定元素上
        * element: 指定元素或元素id
        * pendingElement: 未决元素或元素id
        * mode: 应用模式（inside: 作为指定元素的子元素, outside: 作为指定元素的父元素）
        */
        applyElement: function (element, pendingElement, mode) {
            element = this.getElement(element);
            pendingElement = this.getElement(pendingElement);
            if (element && pendingElement) {
                if (ejs.string.equals("inside", mode)) {
                    if (this.getChildCount(element) > 0) {
                        element.insertBefore(pendingElement, this.getFirstChild(element));
                        while (this.getChildCount(element) > 1) {
                            pendingElement.appendChid(this.getChild(element, 1));
                        }
                    } else {
                        element.appendChild(pendingElement);
                    }
                } else if (ejs.string.equals("outside", mode)) {
                    if (!this.contains(element, pendingElement)) {
                        element.parentNode.insertBefore(pendingElement, element);
                    }
                    pendingElement.appendChild(element);
                }
            }
        },

        /*
        * 获得元素的顶部边距值
        * element: 元素或元素id
        */
        getMarginTop: function (element) {
            var strValue = this.getCssValue(element, "margin-top");
            var intValue = ejs.string.toInt(strValue);
            return isNaN(intValue) ? 0 : intValue;
        },

        /*
        * 获得元素的右侧边距值
        * element: 元素或元素id
        */
        getMarginRight: function (element) {
            var strValue = this.getCssValue(element, "margin-right");
            var intValue = ejs.string.toInt(strValue);
            return isNaN(intValue) ? 0 : intValue;
        },

        /*
        * 获得元素的底部边距值
        * element: 元素或元素id
        */
        getMarginBottom: function (element) {
            var strValue = this.getCssValue(element, "margin-bottom");
            var intValue = ejs.string.toInt(strValue);
            return isNaN(intValue) ? 0 : intValue;
        },

        /*
        * 获得元素的左侧边距值
        * element: 元素或元素id
        */
        getMarginLeft: function (element) {
            var strValue = this.getCssValue(element, "margin-left");
            var intValue = ejs.string.toInt(strValue);
            return isNaN(intValue) ? 0 : intValue;
        },

        /*
        * 获得元素的顶部填充值
        * element: 元素或元素id
        */
        getPaddingTop: function (element) {
            var strValue = this.getCssValue(element, "padding-top");
            var intValue = ejs.string.toInt(strValue);
            return isNaN(intValue) ? 0 : intValue;
        },

        /*
        * 获得元素的右侧填充值
        * element: 元素或元素id
        */
        getPaddingRight: function (element) {
            var strValue = this.getCssValue(element, "padding-right");
            var intValue = ejs.string.toInt(strValue);
            return isNaN(intValue) ? 0 : intValue;
        },

        /*
        * 获得元素的底部填充值
        * element: 元素或元素id
        */
        getPaddingBottom: function (element) {
            var strValue = this.getCssValue(element, "padding-bottom");
            var intValue = ejs.string.toInt(strValue);
            return isNaN(intValue) ? 0 : intValue;
        },

        /*
        * 获得元素的左侧填充值
        * element: 元素或元素id
        */
        getPaddingLeft: function (element) {
            var strValue = this.getCssValue(element, "padding-left");
            var intValue = ejs.string.toInt(strValue);
            return isNaN(intValue) ? 0 : intValue;
        },

        /*
        * 获得元素的顶部边框宽度
        * element: 元素或元素id
        */
        getBorderTopWidth: function (element) {
            var strValue = this.getCssValue(element, "border-top-width");
            var intValue = ejs.string.toInt(strValue);
            return isNaN(intValue) ? 0 : intValue;
        },

        /*
        * 获得元素的右侧边框宽度
        * element: 元素或元素id
        */
        getBorderRightWidth: function (element) {
            var strValue = this.getCssValue(element, "border-right-width");
            var intValue = ejs.string.toInt(strValue);
            return isNaN(intValue) ? 0 : intValue;
        },

        /*
        * 获得元素的底部边框宽度
        * element: 元素或元素id
        */
        getBorderBottomWidth: function (element) {
            var strValue = this.getCssValue(element, "border-bottom-width");
            var intValue = ejs.string.toInt(strValue);
            return isNaN(intValue) ? 0 : intValue;
        },

        /*
        * 获得元素左侧边框宽度
        * element: 元素或元素id
        */
        getBorderLeftWidth: function (element) {
            var strValue = this.getCssValue(element, "border-left-width");
            var intValue = ejs.string.toInt(strValue);
            return isNaN(intValue) ? 0 : intValue;
        },

        /*
        * 获得元素的整体宽度，包括边框宽度等
        * element: 元素或元素id
        */
        getOuterWidth: function (element) {
            element = this.getElement(element);
            if (element) {
                //TODO return element.offsetWidth + this.getMarginLeft(element) + this.getMarginRight(element);
                return element.offsetWidth;
            }
            return NaN;
        },

        /*
        * 设置元素整体宽度，边框宽度等包含在内
        * element: 元素或元素id
        */
        setOuterWidth: function (element, value) {
            element = this.getElement(element);
            if (element) {
                var outerW = ejs.string.toInt(value);
                if (!isNaN(outerW)) {
                    element.style.width = outerW + "px";
                }
            }
        },

        /*
        * 获得元素的整体高度，包括边框高度等
        * element: 元素或元素id
        */
        getOuterHeight: function (element) {
            element = this.getElement(element);
            if (element) {
                return element.offsetHeight;
            }
            return NaN;
        },

        /*
        * 设置元素整体高度，边框高度等包含在内
        * element: 元素或元素id
        */
        setOuterHeight: function (element, value) {
            element = this.getElement(element);
            if (element) {
                var outerH = ejs.string.toInt(value);
                if (!isNaN(outerH)) {
                    element.style.height = outerH + "px";
                }
            }
        },

        getInnerWidth: function (element) {
            element = this.getElement(element);
            if (element) {
                var offsetW = element.offsetWidth;
                var innerW = offsetW - this.getBorderLeftWidth(element) -
		            this.getBorderRightWidth(element) - this.getPaddingLeft(element) -
                    this.getPaddingRight(element);
                var overflowY = this.getCssValue(element, "overflow-y");
                if (ejs.string.equals(overflowY, "auto", true)) {
                    if (element.scrollHeight > element.offsetHeight) {
                        innerW -= 16;
                    }
                } else if (ejs.string.equals(overflowY, "scroll", true)) {
                    innerW -= 16;
                }
                return innerW;
            }
            return NaN;
        },

        setInnerWidth: function (element, value) {
            element = this.getElement(element);
            if (element) {
                if (!ejs.utils.isNumber(value)) {
                    value = ejs.string.toInt(value);
                }
                if (!isNaN(value)) {
                    var borderLeft = ejs.element.getBorderLeftWidth(element);
                    var borderRight = ejs.element.getBorderRightWidth(element);
                    var paddingLeft = ejs.element.getPaddingLeft(element);
                    var paddingRight = ejs.element.getPaddingRight(element);
                    element.style.width = (value - borderLeft -
                        borderRight - paddingLeft - paddingRight) + "px";
                }
            }
        },

        getInnerHeight: function (element) {
            element = this.getElement(element);
            if (element) {
                var innerH = element.offsetHeight - this.getBorderTopWidth(element) -
		            this.getBorderBottomWidth(element) - this.getPaddingTop(element) -
                    this.getPaddingBottom(element);
                var overflowX = this.getCssValue(element, "overflow-x");
                if (ejs.string.equals(overflowX, "auto", true)) {
                    if (element.scrollWidth > element.offsetWidth) {
                        innerH -= 16;
                    }
                } else if (ejs.string.equals(overflowX, "scroll", true)) {
                    innerH -= 16;
                }
                return innerH;
            }
            return NaN;
        },

        setInnerHeight: function (element, value) {
            element = this.getElement(element);
            if (element) {
                if (!ejs.utils.isNumber(value)) {
                    value = ejs.string.toInt(value);
                }
                if (!isNaN(value)) {
                    var borderTop = ejs.element.getBorderTopWidth(element);
                    var borderBottom = ejs.element.getBorderBottomWidth(element);
                    var paddingTop = ejs.element.getPaddingTop(element);
                    var paddingBottom = ejs.element.getPaddingBottom(element);
                    element.style.height = (value - borderTop -
                        borderBottom - paddingTop - paddingBottom) + "px";
                }
            }
        },

        getDoc: function (element) {
            var doc = document;
            var element = this.getElement(element);
            if (element) {
                doc = (element.nodeType == 9) ? element :
                    element.ownerDocument || element.document || document;
            }
            return doc;
        },

        getDocScrollLeft: function (element, doc) {
            element = this.getElement(element);
            doc = doc || (element) ? this.getDoc(doc) : document;
            var dv = doc.defaultView;
            var pageOffset = (dv) ? dv.pageXOffset : 0;
            return Math.max(doc.documentElement.scrollLeft, doc.body.scrollLeft, pageOffset);
        },

        getDocScrollTop: function (element, doc) {
            element = this.getElement(element);
            doc = doc || (element) ? this.getDoc(doc) : document;
            var dv = doc.defaultView;
            var pageOffset = (dv) ? dv.pageYOffset : 0;
            return Math.max(doc.documentElement.scrollTop, doc.body.scrollTop, pageOffset);
        },

        getOffset: function (element) {
            var result = { left: 0, top: 0 };
            element = this.getElement(element);
            if (element) {
                var el = element;
                var scrolls = this.getScroll(el);
                if (el.getBoundingClientRect) {
                    var box = el.getBoundingClientRect();
                    var doc = el.ownerDocument;
                    var rootNode = doc.documentElement;
                    if (ejs.browser.isChrome()) {
                        rootNode = doc.body;
                    }
                    var isFixed = this.getCssValue(el, "position") == "fixed";
                    result.left = box.left + scrolls.left + ((isFixed) ? 0 : rootNode.scrollLeft) - rootNode.clientLeft;
                    result.top = box.top + scrolls.top + ((isFixed) ? 0 : rootNode.scrollTop) - rootNode.clientTop;
                } else {
                    if (!this.isBody(el)) {
                        while (el && !this.isBody(el)) {
                            result.left += el.offsetLeft;
                            result.top += el.offsetTop;
                            if (ejs.browser.isFF()) {
                                var borderMode = this.getCssValue(el, "-moz-box-sizing");
                                if (borderMode != "border-box") {
                                    result.left += this.getBorderLeftWidth(el);
                                    result.top += this.getBorderTopWidth(el);
                                }
                                var parent = el.parentNode;
                                if (parent) {
                                    var overflow = this.getCssValue(parent, "overflow");
                                    if (overflow != "visible") {
                                        result.left += this.getBorderLeftWidth(parent);
                                        result.top += this.getBorderTopWidth(parent);
                                    }
                                }
                            } else if (el != element) {
                                result.left += this.getBorderLeftWidth(el);
                                result.top += this.getBorderTopWidth(el);
                            }
                            el = el.offsetParent;
                        }
                        if (ejs.browser.isFF() && this.getCssValue(element, "-moz-box-sizing") != "border-box") {
                            result.left -= this.getBorderLeftWidth(element);
                            result.top -= this.getBorderTopWidth(element);
                        }
                    }
                }

                result.left -= scrolls.left;
                result.top -= scrolls.top;
            }
            return result;
        },

        getScroll: function (element) {
            var result = { left: 0, top: 0 };
            element = this.getElement(element);
            if (element) {
                var parent = element.parentNode;
                while (parent && this.isBody(parent)) {
                    result.left += parent.scrollLeft;
                    result.top += parent.scrollTop;
                    parent = parent.parentNode;
                }
            }
            return result;
        },


        /*
        * 获得元素相对窗口的绝对坐标
        * element: 元素或元素id
        */
        getAbsolutePos: function (element, parent) {
            var offsets = this.getOffset(element);
            var scrolls = this.getScroll(element);
            var result = { left: offsets.left - scrolls.left, top: offsets.top - scrolls.top };
            var parent = this.getElement(parent);
            if (parent) {
                var parentPos = this.getAbsolutePos(parent);
                result.left = result.left - parentPos.left - this.getBorderLeftWidth(parent);
                result.top = result.top - parentPos.top - this.getBorderTopWidth(parent);
            }
            return result;
        },

        /*
        * 获得元素相对窗口的绝对水平坐标
        * element: 元素或元素id
        */
        getAbsoluteLeft: function (element, parent) {
            var pos = this.getAbsolutePos(element, parent);
            return pos.left;
        },

        /*
        * 获得元素相对窗口的绝对垂直坐标
        * element: 元素或元素id
        */
        getAbsoluteTop: function (element, parent) {
            var pos = this.getAbsolutePos(element, parent);
            return pos.top;
        },

        getOffsetX: function (event) {
            if (!ejs.utils.isUndefined(event.offsetX)) {
                return event.offsetX;
            } else {
                var target = event.target;
                if (ejs.utils.isUndefined(target.offsetLeft)) {
                    target = target.parentNode;
                }
                return window.pageXOffset + event.clientX - this.getAbsoluteLeft(target);
            }
        },

        getOffsetY: function (event) {
            if (!ejs.utils.isUndefined(event.offsetY)) {
                return event.offsetY;
            } else {
                var target = event.target;
                if (ejs.utils.isUndefined(target.offsetTop)) {
                    target = target.parentNode;
                }
                return window.pageYOffset + event.clientY - this.getAbsoluteTop(target);
            }
        },

        getTextHeight: function (element, text) {
            var el = this.getElement(element);
            if (el) {
                if (!window.elementText) {
                    var labelEl = document.createElement("LABEL");
                    labelEl.id = "$element-text$";
                    labelEl.style.display = "none";
                    document.body.appendChild(labelEl);
                    window.elementText = labelEl;
                }
                if (window.elementText) {
                    var fontFamily = this.getCssValue(element, "font-family");
                    var fontSize = this.getCssValue(element, "font-size");
                    var fontWeight = this.getCssValue(element, "font-weight");
                    window.elementText.style.fontFamily = fontFamily;
                    window.elementText.style.fontSize = fontSize;
                    window.elementText.style.fontWeight = fontWeight;
                    this.setText(window.elementText, text);
                    if (ejs.browser.isIE()) {
                        window.elementText.style.display = "inline";
                    } else {
                        window.elementText.style.display = "inline-block";
                    }
                    var result = window.elementText.offsetHeight;
                    window.elementText.style.display = "none";
                    return result;
                }
            }
            return 0;
        },

        getTextWidth: function (element, text) {
            var el = this.getElement(element);
            if (el) {
                if (!window.elementText) {
                    var labelEl = document.createElement("LABEL");
                    labelEl.id = "$element-text$";
                    labelEl.style.display = "none";
                    document.body.appendChild(labelEl);
                    window.elementText = labelEl;
                }
                if (window.elementText) {
                    var fontFamily = this.getCssValue(element, "font-family");
                    var fontSize = this.getCssValue(element, "font-size");
                    var fontWeight = this.getCssValue(element, "font-weight");
                    window.elementText.style.fontFamily = 0; // fontFamily;
                    window.elementText.style.fontSize = fontSize;
                    window.elementText.style.fontWeight = fontWeight;
                    this.setText(window.elementText, text);
                    if (ejs.browser.isIE()) {
                        window.elementText.style.display = "inline";
                    } else {
                        window.elementText.style.display = "inline-block";
                    }
                    var result = window.elementText.offsetWidth;
                    window.elementText.style.display = "none";
                    return result;
                }
            }
            return 0;
        }
    };
}