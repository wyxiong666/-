var utils = function () {
    /**
     * 把JSON格式的字符串转换成JSON格式的对象
     * @param str
     * @returns {Object}
     */
    function toJSON(str) {
        return "JSON" in window ? JSON.parse(str) : eval("(" + str + ")");
    }

    /**
     * 类数组转换为数组
     * @param arg
     * @returns {Array}
     */
    function listToArray(arg) {
        var ary = [];
        try {
            ary = [].slice.call(arg)
        } catch (e) {
            for (var i = 0; i < arg.length; i++) {
                ary[i] = arg[i];
            }
        }
        return ary;
    }

    /**
     * 距body左边和上边的距离
     * @param ele
     * @returns {{l: (Number|number), t: (number|Number)}}
     */
    function offset(ele) {
        var l = ele.offsetLeft;
        var t = ele.offsetTop;
        var p = ele.offsetParent;
        while (p != document.body && p) {  //1、p不能是body 2、ele不能是body
            if (navigator.userAgent.indexOf("MSIE 8.0") == -1) {
                l += p.clientLeft;
                t += p.clientTop;
            }
            l += p.offsetLeft;
            t += p.offsetTop;
            p = p.offsetParent;
        }
        return {
            l: l,
            t: t
        }
    }

    /**
     * 获得对象的属性值
     * @param ele
     * @param attr
     * @returns {Number}
     */
    function getCss(ele, attr) {
        var res = null;
        if ("getComputedStyle" in window) {
            res = window.getComputedStyle(ele, null)[attr];
        } else {
            if (attr == "opacity") {
                res = ele.currentStyle.filter;
                var reg1 = /^alpha\(opacity\s*=\s*(\d+(?:\.\d+)?)\)$/;
                res = reg1.test(res) ? RegExp.$1 / 100 : 1;
            } else {
                res = ele.currentStyle[attr];
            }
        }
        var reg2 = /^[+-]?((?:\d|[1-9]\d+)(?:\.\d+)?)(?:px|pt|rem|em)?$/i;
        return reg2.test(res) ? parseFloat(res) : res;
    }

    /**
     *获取页面13个属性的方法
     * @param attr  13个属性
     * @param value  设置scrollLeft和scrollTop值
     * @returns {*}
     */
    function win(attr, value) {
        if (typeof value == "undefined") {
            //第二个参数没传就获取下值
            return document.documentElement[attr] || document.body[attr];
        } else {
            document.documentElement[attr] = value;
            document.body[attr] = value;
        }
    }

    /**
     * 获取某个区间（n-m）之间的随机数
     * @param n 整数
     * @param m 整数
     */
    function rnd(n, m) {
        n = Number(n);
        m = Number(m);
        if (isNaN(n) || isNaN(m)) {
            return Math.random();
        }
        if (n > m) {
            n = n + m;
            m = n - m;
            n = n - m;
        }
        return Math.round(Math.random() * (m - n) + n)
    }

    /**
     * 找到含有某类名的元素
     * @param strClass 类名
     * @param context 范围
     * @return {*}
     */
    function getByClass(strClass, context) {
        context = context || document;
        if (document.getElementsByClassName) {
            return listToArray(context.getElementsByClassName(strClass));
        }
        var aryClass = strClass.replace(/(^ +)|( +$)/g, "").split(/ +/g);
        var eles = context.getElementsByTagName("*");
        for (var i = 0; i < aryClass.length; i++) {
            var curClass = aryClass[i];
            var reg = new RegExp("(^| +)" + curClass + "( +|$)");
            var ary = [];
            for (var j = 0; j < eles.length; j++) {
                reg.test(eles[j].className) ? ary.push(eles[j]) : null;
            }
            eles = ary;
        }
        return eles;
    }

    /**
     * 验证是否含有此类名
     * @param ele 当前元素
     * @param strClass 单个类名
     * @return true|false
     */
    function hasClass(ele, strClass) {
        var reg = new RegExp("(^| +)" + strClass + "( +|$)");
        return reg.test(ele.className)
    }

    /**
     * 添加类名
     * @param ele 当前元素
     * @param strClass 一个类名或者多个类名
     */
    function addClass(ele, strClass) {
        var aryClass = strClass.replace(/(^ +)|( +$)/g, "").split(/ +/g);
        for (var i = 0; i < aryClass.length; i++) {
            var curClass = aryClass[i];
            if (!hasClass(ele, curClass)) {
                ele.className += " " + curClass;
            }
        }
    }

    /**
     * 删除类名
     * @param ele 当前元素
     * @param strClass 一个或多个类名
     */
    function removeClass(ele, strClass) {
        var aryClass = strClass.replace(/(^ +)|( +$)/g, "").split(/ +/g);
        for (var i = 0; i < aryClass.length; i++) {
            var curClass = aryClass[i];
            var reg = new RegExp("(^| +)" + curClass + "( +|$)", "g");
            if (hasClass(ele, curClass)) {
                ele.className = ele.className.replace(reg, " ");//replace不改变原字符串，所以接收返回值
            }
        }
    }

    /**
     * 获取范围下指定标记名的子元素
     * @param context 上下文
     * @param tagName 标记名，必须是字符串类型
     * @return ary 查找到的内容放入数组中返回
     */
    function children(context,tagName){
        var ary = [];
        //1.先获取所有的子节点
        var eles = context.childNodes;
        for(var i = 0;i<eles.length;i++){
            var ele = eles[i];
            //2.判断子节点是否是元素节点
            if(ele.nodeType==1){
                //3.判断tagName是否正确
                if(typeof tagName =="string"){
                    //4.把相同标记名的元素放入数组中
                    if(ele.nodeName.toLowerCase()==tagName.toLowerCase()){
                        ary.push(ele);
                    }
                }else{
                    //第二个参数错误则把所有的子元素放入数组中
                    ary.push(ele);
                }
            }
        }
        return ary;
    }
    /**
     * 设置CSS样式
     * @param ele 当前元素
     * @param attr css属性
     * @param value css属性值
     */
    function setCss(ele, attr, value) {
        if (attr == "float") {
            ele.style.cssFloat = value;
            ele.style.styleFloat = value;
            return;
        }
        if (attr == "opacity") {
            ele.style.opacity = value;
            ele.style.filter = "alpha(opacity = " + value * 100 + ")";
            return;
        }
        var reg = /^(width|height|((margin|padding)?(right|left|top|bottom)?))$/i;
        if (reg.test(attr)) {
            if (!isNaN(value)) {   //居然要考虑有效数
                value = value + "px";
            }
        }
        ele.style[attr] = value;
    }

    /**
     * 批量设置css样式
     * @param ele 当前元素
     * @param option 对象-css属性和css属性值
     */
    function setGroup(ele, option) {
        if (Object.prototype.toString.call(option) != "[object Object]") return;
        //居然考虑传进来的不是对象
        for (var attr in option) {
            setCss(ele, attr, option[attr]);
        }
    }

    /**
     * 通过参数确定调用哪个方法(getCss,setCss,setGroup)
     */
    function css() {
        var arg = arguments,
            fn = getCss;
        if (arguments.length == 3) {
            fn = setCss;
        }
        if (arguments.length == 2 && typeof arg[1] == "object") {
            fn = setGroup;
        }
        return fn.apply(null, arg);
    }
    function prevAll(ele){
        var pre = ele.previousSibling;
        var ary = [];
        while(pre){
            if(pre.nodeType==1){
                ary.push(pre);
            }
            pre = pre.previousSibling;
        }
        return ary;
    }
    function nextAll(ele){
        var next = ele.nextSibling;
        var ary = [];
        while(next){
            if(next.nodeType==1){
                ary.push(next);
            }
            next = next.nextSibling;
        }
        return ary;
    }
    function siblings(ele){
        return prevAll(ele).concat(nextAll(ele));
    }
    return {
        toJSON: toJSON,
        listToArray: listToArray,
        offset: offset,
        getCss: getCss,
        win: win,
        rnd: rnd,
        getByClass: getByClass,
        hasClass: hasClass,
        addClass: addClass,
        removeClass: removeClass,
        children: children,
        setCss: setCss,
        setGroup: setGroup,
        css: css,
        prevAll:prevAll,
        nextAll:nextAll,
        siblings:siblings
    }
}();
