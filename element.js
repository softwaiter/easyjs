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
        * ����idֵ��ö�ӦԪ��
        * id: Ԫ�ػ�Ԫ��id
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
                        TODO �˴���������inline ����inline-block���٣����⣬shit����������block�ɣ�û�п�Ⱦ�100%���оͰ����
                        */
                        prevDisplay = "block";
                    }
                    element.style.display = prevDisplay;
                }
            }
        },

        /*
        * �ж�Ԫ���Ƿ�Ϊҳ���Ԫ��
        * element: Ҫ�жϵ�Ԫ�ػ�Ԫ��id
        */
        isBody: function (element) {
            element = this.getElement(element);
            if (element) {
                return (element.tagName == "BODY" || element.tagName == "HTML");
            }
            return false;
        },

        /*
        * ɾ��ָ��Ԫ��
        * element: Ҫɾ����Ԫ�ػ�Ԫ��id
        * really: �Ƿ񳹵�ɾ��Ԫ�أ�Ĭ�ϲ���
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
        * ���Ԫ�صĵ�ָ��css����ֵ
        * element: Ԫ�ػ�Ԫ��id
        * property: css������
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
        * ���ָ��Ԫ�صĸ�Ԫ��
        * element: Ԫ�ػ�Ԫ��id
        */
        getParent: function (element) {
            element = this.getElement(element);
            if (element) {
                return element.parentNode;
            }
        },

        /*
        * �ж�������Ƿ�֧�ֲ���սڵ�
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
        * �ж�Ԫ��2�Ƿ�Ԫ��1����Ԫ��
        * element1: Ԫ��1��Ԫ��1id
        * element2: Ԫ��2��Ԫ��2id
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
        * ����ָ��Ԫ�ص���Ԫ�ظ���
        * element: Ԫ�ػ�Ԫ��id
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
        * ����Ԫ�ص�ָ����Ԫ��
        * element: Ԫ�ػ�Ԫ��id
        * index: ��Ԫ������ֵ
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
        * ����ָ��Ԫ�صĵ�1����Ԫ��
        * element: Ԫ�ػ�Ԫ��id
        */
        getFirstChild: function (element) {
            return this.getChild(element, 0);
        },

        /*
        * ����ָ��Ԫ�ص����һ����Ԫ��
        * element: Ԫ�ػ�Ԫ��id
        */
        getLastChild: function (element) {
            var count = this.getChildCount(element);
            this.getChild(element, count - 1);
        },

        /*
        * �õ�ָ���ڵ����һ���ֵܽڵ�
        * element: Ԫ�ػ�Ԫ��id
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
        * �õ�ָ���ڵ����һ���ֵܽڵ�
        * element: Ԫ�ػ�Ԫ��id
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
        * ����ָ��Ԫ�ص��ı�����
        * element: Ԫ�ػ�Ԫ��id
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
        * ����Ԫ�ص��ı�����
        * element: Ԫ�ػ�Ԫ��id
        * value: �������ı�����
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
        * �ж�Ԫ���Ƿ�ӵ��ָ��css��
        * element: Ԫ�ػ�Ԫ��id
        * className: css������
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
        * ΪԪ������ָ��css��
        * element: Ԫ�ػ�Ԫ��id
        * className: css������
        */
        addClass: function (element, className) {
            element = this.getElement(element);
            if (element && className) {
                this.removeClass(element, className);
                element.className = element.className ? (element.className + " " + className) : className;
            }
        },

        /*
        * �Ƴ�Ԫ���е�ָ��css��
        * element: Ԫ�ػ�Ԫ��id
        * className: css������
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
        * ΪԪ����������css�ࣨ�����ǽ�����css������ָ����׺����һ�ݣ�
        * element: Ԫ�ػ�Ԫ��id
        * suffix: ָ����׺
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
        * �����Ƴ�Ԫ�ص�ָ��css�ࣨ�������Ƴ�ָ����׺��css�ࣩ
        * element: Ԫ�ػ�Ԫ��id
        * suffix: ָ����׺
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
        * �ж�Ԫ���Ƿ���ָ������
        * element: Ԫ�ػ�Ԫ��id
        * attrName: ��������
        */
        hasAttribute: function (element, attrName) {
            element = this.getElement(element);
            if (element && element.getAttribute(attrName) != null) {
                return true;
            }
            return false;
        },

        /*
        * ��δ��Ԫ�ذ�ָ��ģʽӦ�õ�ָ��Ԫ����
        * element: ָ��Ԫ�ػ�Ԫ��id
        * pendingElement: δ��Ԫ�ػ�Ԫ��id
        * mode: Ӧ��ģʽ��inside: ��Ϊָ��Ԫ�ص���Ԫ��, outside: ��Ϊָ��Ԫ�صĸ�Ԫ�أ�
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
        * ���Ԫ�صĶ����߾�ֵ
        * element: Ԫ�ػ�Ԫ��id
        */
        getMarginTop: function (element) {
            var strValue = this.getCssValue(element, "margin-top");
            var intValue = ejs.string.toInt(strValue);
            return isNaN(intValue) ? 0 : intValue;
        },

        /*
        * ���Ԫ�ص��Ҳ�߾�ֵ
        * element: Ԫ�ػ�Ԫ��id
        */
        getMarginRight: function (element) {
            var strValue = this.getCssValue(element, "margin-right");
            var intValue = ejs.string.toInt(strValue);
            return isNaN(intValue) ? 0 : intValue;
        },

        /*
        * ���Ԫ�صĵײ��߾�ֵ
        * element: Ԫ�ػ�Ԫ��id
        */
        getMarginBottom: function (element) {
            var strValue = this.getCssValue(element, "margin-bottom");
            var intValue = ejs.string.toInt(strValue);
            return isNaN(intValue) ? 0 : intValue;
        },

        /*
        * ���Ԫ�ص����߾�ֵ
        * element: Ԫ�ػ�Ԫ��id
        */
        getMarginLeft: function (element) {
            var strValue = this.getCssValue(element, "margin-left");
            var intValue = ejs.string.toInt(strValue);
            return isNaN(intValue) ? 0 : intValue;
        },

        /*
        * ���Ԫ�صĶ������ֵ
        * element: Ԫ�ػ�Ԫ��id
        */
        getPaddingTop: function (element) {
            var strValue = this.getCssValue(element, "padding-top");
            var intValue = ejs.string.toInt(strValue);
            return isNaN(intValue) ? 0 : intValue;
        },

        /*
        * ���Ԫ�ص��Ҳ����ֵ
        * element: Ԫ�ػ�Ԫ��id
        */
        getPaddingRight: function (element) {
            var strValue = this.getCssValue(element, "padding-right");
            var intValue = ejs.string.toInt(strValue);
            return isNaN(intValue) ? 0 : intValue;
        },

        /*
        * ���Ԫ�صĵײ����ֵ
        * element: Ԫ�ػ�Ԫ��id
        */
        getPaddingBottom: function (element) {
            var strValue = this.getCssValue(element, "padding-bottom");
            var intValue = ejs.string.toInt(strValue);
            return isNaN(intValue) ? 0 : intValue;
        },

        /*
        * ���Ԫ�ص�������ֵ
        * element: Ԫ�ػ�Ԫ��id
        */
        getPaddingLeft: function (element) {
            var strValue = this.getCssValue(element, "padding-left");
            var intValue = ejs.string.toInt(strValue);
            return isNaN(intValue) ? 0 : intValue;
        },

        /*
        * ���Ԫ�صĶ����߿���
        * element: Ԫ�ػ�Ԫ��id
        */
        getBorderTopWidth: function (element) {
            var strValue = this.getCssValue(element, "border-top-width");
            var intValue = ejs.string.toInt(strValue);
            return isNaN(intValue) ? 0 : intValue;
        },

        /*
        * ���Ԫ�ص��Ҳ�߿���
        * element: Ԫ�ػ�Ԫ��id
        */
        getBorderRightWidth: function (element) {
            var strValue = this.getCssValue(element, "border-right-width");
            var intValue = ejs.string.toInt(strValue);
            return isNaN(intValue) ? 0 : intValue;
        },

        /*
        * ���Ԫ�صĵײ��߿���
        * element: Ԫ�ػ�Ԫ��id
        */
        getBorderBottomWidth: function (element) {
            var strValue = this.getCssValue(element, "border-bottom-width");
            var intValue = ejs.string.toInt(strValue);
            return isNaN(intValue) ? 0 : intValue;
        },

        /*
        * ���Ԫ�����߿���
        * element: Ԫ�ػ�Ԫ��id
        */
        getBorderLeftWidth: function (element) {
            var strValue = this.getCssValue(element, "border-left-width");
            var intValue = ejs.string.toInt(strValue);
            return isNaN(intValue) ? 0 : intValue;
        },

        /*
        * ���Ԫ�ص������ȣ������߿��ȵ�
        * element: Ԫ�ػ�Ԫ��id
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
        * ����Ԫ�������ȣ��߿��ȵȰ�������
        * element: Ԫ�ػ�Ԫ��id
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
        * ���Ԫ�ص�����߶ȣ������߿�߶ȵ�
        * element: Ԫ�ػ�Ԫ��id
        */
        getOuterHeight: function (element) {
            element = this.getElement(element);
            if (element) {
                return element.offsetHeight;
            }
            return NaN;
        },

        /*
        * ����Ԫ������߶ȣ��߿�߶ȵȰ�������
        * element: Ԫ�ػ�Ԫ��id
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
        * ���Ԫ����Դ��ڵľ�������
        * element: Ԫ�ػ�Ԫ��id
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
        * ���Ԫ����Դ��ڵľ���ˮƽ����
        * element: Ԫ�ػ�Ԫ��id
        */
        getAbsoluteLeft: function (element, parent) {
            var pos = this.getAbsolutePos(element, parent);
            return pos.left;
        },

        /*
        * ���Ԫ����Դ��ڵľ��Դ�ֱ����
        * element: Ԫ�ػ�Ԫ��id
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