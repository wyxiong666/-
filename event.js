function processThis(fn,ele){
    return function(e){
       fn.call(ele,e);
    }
}
function on(ele,type,fn){
    if(ele.addEventListener){
        ele.addEventListener(type,fn,false);
    }else{
        if(!ele["myBind"+type]){
            ele["myBind"+type]=[];
            ele.attachEvent("on"+type,function(){
                var e = window.event;
                run.call(ele,e);
            });
        }
        var a = ele["myBind"+type];
        for(var i = 0;i< a.length;i++){
            if(a[i]==fn){
                return;
            }
        }
        a.push(fn);
    }
}
function run(e){
    e.target = e.srcElement;
    e.pageX = (document.documentElement.scrollLeft||document.body.scrollLeft)+ e.clientX;
    e.pageY = (document.documentElement.scrollTop||document.body.scrollTop)+ e.clientY;
    e.preventDefault = function(){
        e.returnValue = false;
    }
    e.stopPropagation = function(){
        e.cancelBubble = true;
    }

    var type = e.type;
    var a = this["myBind"+type];
    if(a){
        for(var i = 0;i< a.length;i++){
            if(typeof a[i]=="function"){
                a[i].call(this,e);
            }else{
                a.splice(i,1);
                i--;
            }

        }
    }
}
function off(ele,type,fn){
    if(ele.removeEventListener){
        ele.removeEventListener(type,fn,false);
    }else{
       var a = ele["myBind"+type];
        if(a){
            for(var i = 0;i< a.length;i++){
                if(a[i]==fn){
                    a[i] = null;
                }
            }
        }
    }
}

function selfOn(ele,type,fn){//订阅过程
    if(!ele[type]){
        ele[type] = [];
    }
    var a = ele[type];
    for(var i = 0;i< a.length;i++){
        if(a[i]==fn){
            return;
        }
    }
    a.push(fn);
}
function fire(type,e){//发布过程 type事件标识
    var a = this[type];
    if(a){
        for(var i = 0;i< a.length;i++){
            if(typeof a[i]=="function"){
                a[i].call(this,e);
            }
        }
    }

}

function selfOff(ele,type,fn){//取消订阅的过程
    var a = ele[type];
    if(a){
        for(var i = 0;i< a.length;i++){
            if(a[i]==fn){
                a[i]= null;
            }
        }
    }
}