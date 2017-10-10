var utils = (function () {
    /**
     * 类数组转换成数组
     * @param likeAry
     */
    function listToArray(likeAry) {
        var ary = [];
        try {
            ary = [].slice.call(likeAry, 0);
        } catch (e) {
            for (var i = 0; i < likeAry.length; i++) {
                ary[ary.length] = likeAry[i];
            }
        }
        return ary;
    }

    /**
     * 将JSON格式的字符串转换成JSON格式的对象
     * @param str JSON格式的字符串
     */
    function toJSON(str) {
        return "JSON" in window ? JSON.parse(str) : eval("(" + str + ")")
    }

    /**
     * 获取某个元素到body的上偏移和左偏移
     * @param ele 当前的元素
     */
    function offset(ele) {
        var l = ele.offsetLeft;//偏移的距离:ele的外边框到参照物的内边框
        var t = ele.offsetTop;
        var p = ele.offsetParent;
        while (p != document.body && p) {//若ele.offsetParent是body则退出while ,或者ele就是body也得退出while
            if (!/MSIE 8\.0/.test(navigator.userAgent)) {
                //不是ie8得把参照物的边框累加起来
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
     * 获取任意css样式
     * @param ele 当前元素
     * @param attr css属性
     */
    function getCss(ele,attr){
        var res = null;
        if(typeof getComputedStyle =="function"){
            res = window.getComputedStyle(ele,null)[attr];
        }else{
            //opacity:0.5;
            //filter:alpha(opacity = 50);
            if(attr =="opacity"){
                res = ele.currentStyle.filter;//"alpha(opacity = 50)"
                var reg = /^alpha\(opacity\s*=\s*(\d+(?:\.\d+)?)\)$/;
                //reg.exec(res)[1] RegExp.$1
                res = reg.test(res)?RegExp.$1/100:1;
            }else{
                res = ele.currentStyle[attr];
            }
        }
        //1.对单位的处理
        //若获取值是->左边是数值,右边是单位,则把单位去掉并转化成数类型
        var reg = /^[+-]?(?:\d+(?:\.\d+)?)(?:px|rem|pt|em)?$/i;
        return reg.test(res)?parseFloat(res):res;
    }

    /**
     *
     * @param ele 当前元素
     * @param attr css属性
     * @param value css属性值
     */
    function setCss(ele,attr,value){
        //1.对浮动处理
        if(attr =="float"){
            ele.style.cssFloat = value;
            ele.style.styleFloat = value;
            return;
        }

        //2,对透明度处理
        if(attr =="opacity"){
            ele.style.opacity = value;
            ele.style.filter = "alpha(opacity ="+value*100+")";
            return;
        }

        //3.设置单位-对没有设置单位的添加单位

        var reg = /^(width|height|((margin|padding)?(right|bottom|top|left)?))$/i;
        if(reg.test(attr)){
            if(!isNaN(value)){
                value +="px";
            }
        }

        ele.style[attr] = value;
    }

    /**
     * 批量设置css样式
     * @param ele 当前元素
     * @param opt 对象类型 -每一项是css属性和css属性值
     */
    function setGroup(ele,opt){
        //先检测opt的数据类型
        if(Object.prototype.toString.call(opt)!="[object Object]") return;
        for(var attr in opt){
            setCss(ele,attr,opt[attr]);
        }
    }

    /**
     *通过参数确定是调用哪个方法(getCss,setCss,setGroup)
     */
    //function css(){
    //    var arg = arguments;
    //    var argTwo = arg[1];
    //    if(typeof argTwo =="string"){
    //        var argThree = arg[2];
    //        if(typeof argThree =="undefined"){
    //           return getCss(arg[0],argTwo);
    //        }else{
    //            setCss(arg[0],argTwo,argThree);
    //        }
    //    }
    //    if(typeof argTwo =="object"){
    //        setGroup(arg[0],argTwo);
    //    }
    //}
    function css(){
        var arg = arguments,
            fn = getCss;
        if(arg.length==3) fn = setCss;
        if(arg.length==2&&typeof  arg[1]=="object") fn = setGroup;
        return fn.apply(null,arg);
    }



    /**
     * 获取client系列,offset系列,scroll系列的值
     * 当前这个元素是文档(body)某个属性值->document.documentElement[xxx]||document.body[xxx];
     * @param attr 属性名,例如:clientHeight,scrollHeight
     * @param value 属性值->scrollLeft和scrollTop  11个属性是可读的 ,这两个还可写
     */
    function win(attr,value){
        if(typeof value =="undefined"){
            return document.documentElement[attr]||document.body[attr];
        }else{
            document.documentElement[attr]  = value;
            document.body[attr] = value;
        }
    }

    /**
     * 获取某个区间(n-m)之间的随机数
     * @param n
     * @param m
     */
    function rnd(n,m){
        //1.对传进来的参数做处理,参数得是数值
        n = Number(n);
        m = Number(m);
        if(isNaN(n)||isNaN(m)){
            return Math.random();
        }
        //2.若n>m,则让他两交换位置
        if(n>m){
            //var temp = n;
            //n = m;
            //m = temp;
            n = n+m;
            m = n - m;
            n = n - m;
        }
        return Math.round(Math.random()*(m-n)+n);
    }

    /**
     * 通过类名查找元素
     * @param strClass 一个或多个类名
     * @param context 上下文 范围(可选) 默认是document
     */

    function getByClass(strClass,context){
        context = context||document;
        if(document.getElementsByClassName){
            return listToArray(context.getElementsByClassName(strClass));
        }
        var eles = context.getElementsByTagName("*");
        var aryClass = strClass.replace(/(^ +)|( +$)/g,"").split(/ +/g);
        for(var i = 0;i<aryClass.length;i++){
            var curClass  = aryClass[i];
            var reg = new RegExp("(^| +)"+curClass+"( +|$)");
            var ary = [];
            for(var k = 0;k<eles.length;k++){
                var ele = eles[k];
                if(reg.test(ele.className)){
                    ary.push(ele);
                }
            }
            eles = ary;//下次总是在上次查找到的元素中继续查找,所以每次查找完的结果得保存下来
        }
        return eles;

    }

    /**
     *
     * @param ele 当前元素
     * @param strClass  单个类名
     * @return true|false
     */
    function hasClass(ele,strClass){
        var reg = new RegExp("(^| +)"+strClass+"( +|$)");
        return reg.test(ele.className)
    }

    /**
     * 添加类名
     * @param ele  当前的元素
     * @param strClass 一个类名或多个类名
     */
    function addClass(ele,strClass){
        var aryClass =  strClass.replace(/(^\s+|\s+$)/g,"").split(/\s+/g);
        for(var i = 0;i<aryClass.length;i++){
            var curClass =aryClass[i];
            if(!hasClass(ele,curClass)){//若没有这个类名,才添加
                ele.className += " "+curClass;
            }
        }
    }

    /**
     * 删除类名
     * @param ele  当前元素
     * @param strClass 一个类名或多个类名
     */
    function removeClass(ele,strClass){
        //拆分strClass,把每个类名拿到
        var aryClass = strClass.replace(/^ +| +$/g,"").split(/ +/g);
        for(var i = 0;i<aryClass.length;i++){
            var curClass =aryClass[i];//每个类名
            //判断是否有这个类名,若有这个类名,则把这个类名删了
            var reg = new RegExp("(^| +)"+curClass+"( +|$)","g");
            if(hasClass(ele,curClass)){
                ele.className = ele.className.replace(reg," ");
            }
        }

    }

    /**
     * 获取到指定标记名的元素
     * @param context 上下文
     * @param tagName 标记名 (字符串)
     */
    function getChildren(context,tagName){
        var eles = context.getElementsByTagName("*");
        var ary = [];
        if(typeof tagName =="string"){
            for(var i = 0;i<eles.length;i++){
                var ele = eles[i];
                if(ele.nodeName.toLowerCase() == tagName.toLowerCase()){
                    ary.push(ele);
                }
            }
        }else{
            for(var i = 0;i<eles.length;i++){
                ary.push(eles[i])
            }
        }
        return ary;
    }

    return {
        listToArray: listToArray,
        toJSON: toJSON,
        offset:offset,
        getCss:getCss,
        win:win,
        rnd:rnd,
        getByClass:getByClass,
        hasClass:hasClass,
        addClass:addClass,
        removeClass:removeClass,
        getChildren:getChildren,
        setCss:setCss,
        setGroup:setGroup,
        css:css
    }

})();
