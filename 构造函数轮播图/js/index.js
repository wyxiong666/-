//1.获取数据
var resData = null;
var xhr = new XMLHttpRequest();
xhr.open("get", 'json/banner.json', false);
xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && /^2\d{2}$/.test(xhr.status)) {
        resData = utils.toJSON(xhr.responseText)
    }
}
xhr.send(null);

//获取元素
var bannerBox = document.getElementById('bannerBox');
var bannerUl = utils.children(bannerBox, "ul")[0];
var btnTip = utils.children(bannerBox, "div")[0];
var btnLeft = utils.getByClass("btnLeft", bannerBox)[0];
var btnRight = utils.getByClass("btnRight", bannerBox)[0];
var oLis = bannerUl.getElementsByTagName("li");
var oImgs = bannerUl.getElementsByTagName("img");
var btnAs = btnTip.getElementsByTagName("a");

//2.绑定数据
var strLi = "";
var strTip = "";
for (var i = 0; i < resData.length; i++) {
    strLi += "<li>";
    strLi += "<img src ='' realImg='" + resData[i].img + "'>";
    strLi += "</li>";
    strTip += i == 0 ? "<a href='javascript:void(0)' class='bg'></a>" : "<a href='javascript:void(0)' ></a>";
}
strLi += "<li><img src ='' realImg='" + resData[0].img + "'></li>";
bannerUl.innerHTML = strLi;
bannerUl.style.width = oLis.length * oLis[0].offsetWidth + "px";
btnTip.innerHTML = strTip;

//3.延迟加载
window.setTimeout(showImg, 1000);
function showImg() {
    for (var i = 0; i < oImgs.length; i++) {
        ~(function (i) {
            var oImg = oImgs[i];
            var tempImg = new Image();
            tempImg.src = oImg.getAttribute("realImg");
            tempImg.onload = function () {
                oImg.src = this.src;
                tempImg = null;
                animate(oImg, {opacity: 1}, 1000);
            }
        })(i)
    }
}

//4.自动轮播
var step = 0, autoTimer = null;
function autoMove() {
    step++;
    if (step == oLis.length) {
        bannerUl.style.left = 0;//障眼法
        step = 1;
    }
    animate(bannerUl, {left: -step * 1000}, 1000);
    bannerTip();
}
autoTimer = window.setInterval(autoMove, 2000);

//5焦点选中效果
function bannerTip() {
    var aIndex = step == oLis.length - 1 ? 0 : step;
    for (i = 0; i < btnAs.length; i++) {
        aIndex == i ? utils.addClass(btnAs[i], "bg") : utils.removeClass(btnAs[i], "bg");
    }
}
//6.开启和停止轮播图
bannerBox.onmouseover = function(){
    clearInterval(autoTimer);
    btnLeft.style.display = btnRight.style.display ="block";
};
bannerBox.onmouseout = function(){
    autoTimer = setInterval(autoMove,2000);
    btnLeft.style.display = btnRight.style.display ="none";
};

//7.点击焦点实现banner切换效果
for(var  i = 0;i<btnAs.length;i++){
    var oA = btnAs[i];
    oA.index = i;
    oA.onclick = function(){
        step = this.index;
        animate(bannerUl,{left:-step*1000},1000);
        bannerTip();
    }
}

//8.点击左右箭头,实现左右切换
btnRight.onclick  = autoMove; //下一张
btnLeft.onclick  = function(){//上一张
    step--;
    if(step<0){
        bannerUl.style.left = -(oLis.length-1)*oLis[0].offsetWidth+"px";
        step=oLis.length-2;
    }
    animate(bannerUl,{left:-step*1000},1000);
    bannerTip();
};







