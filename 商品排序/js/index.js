//->1.获取数据
var resData = null;//用来保存json格式对象
//1.创建ajax对象
var xhr = new XMLHttpRequest();
//2.打开一个链接地址
xhr.open("get", "json/product.json", false);
//3.监听请求的数据
xhr.onreadystatechange = function () {
    //1.请求状态码(xhr.readyState)  网络状态码(xhr.status)
    if (xhr.readyState == 4 && /^2\d{2}$/.test(xhr.status)) {
        resData = utils.toJson(xhr.responseText)
    }
};

//4.发送请求
xhr.send(null);


//->2.绑定数据
var oUl = document.getElementById("list");
var str = "";
for (var i = 0; i < resData.length; i++) {

    str += "<li data-time='" + resData[i].time + "'  data-price='" + resData[i].price + "' data-hot='" + resData[i].hot + "' >";
    str += "<img src='" + resData[i].img + "'/>";
    str += "<span>" + resData[i].title + "</span>";
    str += "<span>" + resData[i].time + "</span>";
    str += "<span>" + resData[i].hot + "</span>";
    str += "<span>￥" + resData[i].price + "</span>";
    str += "</li>";
}
oUl.innerHTML = str;

//假设没点击a标签之前,添加个自定义属性flag,默认flag = -1; flag -1 降序   1 升序

//->3.绑定点击事件
var menu = document.getElementById("menu");
var linkA = menu.getElementsByTagName("a");//集合
for (var i = 0; i < linkA.length; i++) {
    linkA[i].index = i;
    linkA[i].flag = -1;//没点之前是降序
    linkA[i].onclick = function () {
        //除了当前点击的元素,再次点击时会按相反方向排列,其他的的再点击时都从升序排列,也就是其他A标签里的flag属性值改成-1;
        for (var j = 0; j < linkA.length; j++) {
            linkA[j] != this ? linkA[j].flag = -1 : null;
        }
        this.flag = this.flag * -1;//->this.flag*=-1
        //listSort(this.index,this.flag);this表示当前点击的元素
        listSort.call(this);
    }
}

//->商品排序
var oLis = oUl.getElementsByTagName("li");
var ary = utils.listToArray(oLis);
function listSort() {
    var that = this;
    var dataAry = ["data-time", "data-price", "data-hot"];
    ary.sort(function (cur, next) {
        cur = cur.getAttribute(dataAry[that.index]);//this表示window
        next = next.getAttribute(dataAry[that.index]);
        cur = cur.replace(/-/g, "");
        next = next.replace(/-/g, "");
        return (cur - next) * that.flag;
    });
    var frg = document.createDocumentFragment();
    for (var i = 0; i < ary.length; i++) {
        frg.appendChild(ary[i]);
    }
    oUl.appendChild(frg);
}

