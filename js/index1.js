// 事件绑定
var EventUtil = {
    addHandler: function(element, type, handler) {
        if(element.addEventListener) {
            element.addEventListener(type,handler,false);
        } else if (element.attachEvent) {
            element.attachEvent("on"+type,handler);
        } else {
            element["on"+type] = handler;
        }
    },

    getEvent: function(event){
        return event ? event : window.event;
    },

    removeHandler: function(element, type, handler) {
        if(element.removeEventListener) {
            element.removeEventListener(type,handler,false);
        } else if (element.detachEvent) {
            element.detachEvent("on"+type,handler);
        } else {
            element["on"+type] = null;
        }
    }
}
//window窗口
function Window(param){
    this.maxX = 0;                                 //鼠标移动范围的水平坐标
    this.moveX = 0;                                //鼠标移动的水平坐标
    this.downX = 0;                                //鼠标按下的时候的水平坐标
    this.maxY = 0;                                 //鼠标移动范围的垂直坐标
    this.moveY = 0;                                //鼠标移动的垂直坐标
    this.downY = 0;                                //鼠标按下的时候的垂直坐标

    this.originalX = 0;                            //鼠标移动前的水平坐标
    this.originalY = 0;                            //鼠标移动前的垂直坐标
    this.newX = 0;                                 //鼠标移动后的水平坐标
    this.newY = 0;                                 //鼠标移动后的垂直坐标

    this.preLeft = 0;
    this.preTop = 0;

    this.init(param);
}
//window窗口原型对象
Window.prototype = {
    createWindow : function(){   //创建窗口
        this.windowWrapper = document.getElementById('windowMaxMove'); //获取窗口移动范围

        this.windowObj = document.createElement('div'); //创建窗口
        this.windowObj.className = 'window';

        this.windowHeader = document.createElement('div');   //创建窗口头部
        this.windowHeader.className = 'windowHeader';
        this.title = document.createElement('span');
        this.title.className = 'title';
        var textNode = document.createTextNode("WINDOW");
        this.title.appendChild(textNode);
        this.windowHeader.appendChild(this.title);
        this.ul = document.createElement('ul');
        this.up = document.createElement('li');
        this.up.className = 'up';
        this.up.setAttribute("id","up");
        this.ul.appendChild(this.up);
        this.extend = document.createElement('li');
        this.extend.className = 'extend';
        this.extend.setAttribute("id","extend");
        this.ul.appendChild(this.extend);
        this.close = document.createElement('li');
        this.close.className = 'close';
        this.close.setAttribute("id","close");
        this.ul.appendChild(this.close);
        this.windowHeader.appendChild(this.ul);
        this.windowObj.appendChild(this.windowHeader);

        this.windowContentWrapper = document.createElement('div'); //创建窗口内容部分
        this.windowContentWrapper.className = 'windowContentWrapper';
        this.windowObj.appendChild(this.windowContentWrapper);
        this.windowWrapper.appendChild(this.windowObj);
    
        this.calculate(); //设置窗口内容区域大小

        this.hasUp = true;   //是否折叠
        this.hasExtend = true;   //是否伸展
    },
    calculate : function(){  //设置窗口内容区域大小

        var _windowObjWidth = document.defaultView.getComputedStyle(this.windowObj,null).width;   //计算窗口大小,扣除padding
        this.windowObjWidth = Number(_windowObjWidth.substring(0,(_windowObjWidth.length)-2));
        var _windowObjHeight = document.defaultView.getComputedStyle(this.windowObj,null).height; 
        this.windowObjHeight = Number(_windowObjHeight.substring(0,(_windowObjHeight.length)-2));

        this.titleHeight = this.windowHeader.clientHeight;   //窗口头部高度
        this.windowContentWrapper.style.height = this.windowObjHeight - this.titleHeight +'px'; 
    },
    windowMove : function(event){   //鼠标移动
        this.windowWrapper.style.cursor = "move";  //设置移动时的鼠标样式

        event = EventUtil.getEvent(event);

        this.moveX = event.clientX;   //移动的距离
        this.moveY = event.clientY;

        this.newX = (this.moveX - this.downX) +  this.preLeft;   //新位置
        this.newY = (this.moveY - this.downY) + this.preTop;

        this.newX <= this.maxX ? this.newX = 0 : this.newX;   //边界判断
        this.newX >= this.windowWrapper.clientWidth - this.windowObj.clientWidth ? this.newX = this.windowWrapper.clientWidth - this.windowObj.clientWidth : this.newX;
        
        this.newY <= this.maxY ? this.newY = 0 : this.newY;
        this.newY >= this.windowWrapper.clientHeight - this.windowObj.clientHeight ? this.newY = this.windowWrapper.clientHeight - this.windowObj.clientHeight : this.newY;
        
        this.newPosition(this.newX,this.newY);
    }, 
    windowChange : function(event){
        event = EventUtil.getEvent(event);

        //鼠标的位置
        this.mouseX = event.clientX;   
        this.mouseY = event.clientY;

        //包裹窗体div位置
        var windowWrapPositionX = this.windowWrapper.offsetLeft;  
        var windowWrapPositionY = this.windowWrapper.offsetTop;

        //外容器大小
        var windowWrapX = this.windowWrapper.clientWidth;   
        var windowWrapY = this.windowWrapper.clientHeight;

        //窗体位置
        var  windowPositionX = this.windowObj.offsetLeft;  
        var  windowPositionY = this.windowObj.offsetTop;

        //窗体内容位置
        var contentWidth = this.windowContentWrapper.clientWidth;
        var contentHeight = this.windowContentWrapper.clientHeight;

        //鼠标移动距离
        var mouseMoveX = (this.mouseX - this.downX);   
        var mouseMoveY = this.mouseY - this.downY;

        if (this.mouseX >= (windowPositionX + windowWrapPositionX) && this.mouseX <= (windowPositionX + windowWrapPositionX + this._paddingNew)) {
            //设置窗体位置
            var preleft = this.windowObj.style.left;
            var leftInt = parseInt(this.windowObj.style.left);
            this.windowObj.style.left = (leftInt <= 0) ?  0 + "px" : (this.preLeft + mouseMoveX) + "px";
            //设置窗体大小
            var preWindowObjX = this.windowObj.style.width;
            this.windowObj.style.width = (leftInt <= 0) ? preWindowObjX : this.originalWindowObjX - mouseMoveX + "px";
            if (parseInt(this.windowObj.style.width) <= this.windowObjMinWidth) {
                this.windowObj.style.left = preleft;
            };    //左缩放
        }else if (this.mouseX >= (windowPositionX + windowWrapPositionX + contentWidth + this._paddingNew) && this.mouseX <= (windowPositionX + windowWrapPositionX + contentWidth + this._paddingNew*2)){   //右缩放
            //设置窗体大小
            var preWindowObjX = this.windowObj.style.width;
            this.windowObj.style.width = this.originalWindowObjX + mouseMoveX + "px";
            if (parseInt(this.windowObj.style.width) >= (windowWrapX - this.preLeft - this._paddingNew*2)) {
                this.windowObj.style.width = preWindowObjX;
            }
        }else if(this.mouseY <= (windowPositionY + windowWrapPositionY) && this.mouseY <= (windowPositionY + windowWrapPositionY + this._paddingNew)){   //上缩放
            //设置窗体位置
            var pretop = this.windowObj.style.top;
            var toptInt = parseInt(this.windowObj.style.top);
            this.windowObj.style.top = (toptInt <= 0) ?  0 + "px" : (this.preTop + mouseMoveY) + "px";
            //设置窗体大小
            var preWindowObjY = this.windowObj.style.height;
            this.windowObj.style.height = (toptInt <= 0) ? preWindowObjY : this.originalWindowObjY - mouseMoveY + "px";
            if (parseInt(this.windowObj.style.height) <= this.windowObjMinHeight + 50) {
                this.windowObj.style.height = preWindowObjY;
                this.windowObj.style.top = pretop;
            };
        }else if(this.mouseY >= (windowPositionY + windowWrapPositionY + this._paddingNew + this.titleHeight + contentHeight - 5) && this.mouseY <= (windowPositionY + windowWrapPositionY + this._paddingNew*2 + this.titleHeight + contentHeight)){   //下缩放
            //设置窗体大小
            var pretop = this.windowObj.style.top;
            var preWindowObjY = this.windowObj.style.height;
            this.windowObj.style.height = this.originalWindowObjY + mouseMoveY + "px";
            if (parseInt(this.windowObj.style.height) >= (windowWrapY - this.preTop - this._paddingNew*2)) {
                this.windowObj.style.height = preWindowObjY;
            }
            if (parseInt(this.windowObj.style.height) <= this.windowObjMinHeight + 50) {
                this.windowObj.style.height = preWindowObjY;
                this.windowObj.style.top = pretop;
            };
        }else{}
        this.calculate();  //重新计算窗体
    },
    windowSize : function(){  //修改窗口宽高
        var width = this.sizeX.value;
        var height = this.sizeY.value;
        this.windowObj.style.width = width + "px";
        this.windowObj.style.height = height + "px";
        this.calculate();
    },
    windowPosition : function(){  //修改窗口所在位置
        var X = this.positionX.value;
        var Y = this.positionY.value;
        this.windowObj.style.left = X + "px";
        this.windowObj.style.top = Y + "px";
    },
    windowSizeChange : function(){   //记录窗口上一次的左右距离
        var lengthLeft = document.defaultView.getComputedStyle(this.windowObj,null).left;   //窗口left
        this.preLeft = Number(lengthLeft.substring(0,(lengthLeft.length)-2));
        (isNaN(this.preLeft)) ?  this.preLeft = 0 : this.preLeft;

        var lengthTop = document.defaultView.getComputedStyle(this.windowObj,null).top;   //窗口top
        this.preTop = Number(lengthTop.substring(0,(lengthTop.length)-2));
        (isNaN(this.preTop)) ?  this.preTop = 0 : this.preTop;
    },
    newPosition : function(positionX,positionY){  //窗口移动至新位置
        this.windowObj.style.left = positionX + "px";  
        this.windowObj.style.top = positionY + "px";
    },
    windowUp : function(){   //窗口折叠
        if (this.hasUp == true) {   //未折叠状态
            this.windowObj.style.height = this.titleHeight + "px";
            this.windowContentWrapper.style.display = "none";
            this.hasUp = false;
        }else{  //折叠状态
            this.windowObj.style.height = this.windowObjHeight + "px";
            this.windowContentWrapper.style.display = "block";
            this.hasUp = true;

            var top = this.windowObj.style.top;  //折叠缩小后在边界展开情况处理
            if (top == ((this.windowWrapper.clientHeight - this.titleHeight - (this._paddingNew)*2) + "px" )) {
                this.windowObj.style.top = (this.windowWrapper.clientHeight - this.windowObj.clientHeight) + "px";
            };
        }
    },
    windowExtend : function(){   //窗口伸缩
        if(this.hasExtend == true){
            this.windowObjPreWidth = this.windowObjWidth;   //记录伸缩之前的窗口大小
            this.windowObjPreHeight = this.windowObjHeight;

            this.windowSizeChange(); //获取窗口之前的位置

            this.preLeft1 = this.preLeft;  //记录放大缩小之前的左右距离
            this.preTop1 = this.preTop;

            this.windowObj.style.height = this.windowWrapper.clientHeight - (this._paddingNew*2) + "px";  //设置窗口新宽高
            this.windowObj.style.width = this.windowWrapper.clientWidth - (this._paddingNew*2) + "px";

            this.hasUp = true;
            this.windowContentWrapper.style.display = "block";  //默认展开显示

            this.windowObj.style.top = 0;  //从最左侧开始
            this.windowObj.style.left = 0;
            this.hasExtend = false;

            this.calculate();
        }else{
            this.hasUp = true;
            this.windowContentWrapper.style.display = "block";  //默认展开显示

            this.windowObj.style.height = this.windowObjPreHeight + "px";  //窗体宽高
            this.windowObj.style.width = this.windowObjPreWidth + "px";

            this.windowObj.style.top = this.preTop1 + "px";     //缩小是在伸展之前的位置上
            this.windowObj.style.left = this.preLeft1 + "px";
            this.hasExtend = true;

            this.calculate();  //计算窗口
        }
    },
    init : function(param){   //初始化
        var _self = this;

        this.positionX = param.positionX;
        this.positionY = param.positionY;
        this.sizeX = param.sizeX;
        this.sizeY = param.sizeY;
        this.herderText = param.herderText;
        this.positionBtn = param.positionBtn;
        this.sizeBtn = param.sizeBtn;
        this.headerBtn = param.headerBtn;

        this.createWindow();  //创建窗口

        this.maxX = this.windowObj.offsetLeft;  //获取可移动的基准坐标
        this.maxY = this.windowObj.offsetTop;

        var _padding = document.defaultView.getComputedStyle(this.windowObj,null).padding;  //得到窗口padding
        this._paddingNew = Number(_padding.substring(0,(_padding.length)-2));

        var windowMove = function() {   //窗口移动        
            _self.windowMove();
        }
        var windowChange = function(){
            _self.windowChange();
        }

        EventUtil.addHandler(this.sizeBtn,"click",function(event){  //窗口宽高修改
            _self.windowSize();
        });

        EventUtil.addHandler(this.headerBtn,"click",function(event){  //窗口title修改
            var title_header =  _self.herderText.value;
            _self.title.innerHTML = title_header;
        });

        EventUtil.addHandler(this.positionBtn,"click",function(event){  //窗口位置修改
            _self.windowPosition();
        });

        EventUtil.addHandler(this.windowObj,"mousedown",function(event){   
            event = EventUtil.getEvent(event);
            var target = event.target;
            _self.originalX = _self.windowObj.offsetLeft;  //元素相对于父元素的top
            _self.originalY = _self.windowObj.offsetTop; 

            _self.downX = event.clientX;  //获取鼠标位置
            _self.downY = event.clientY;

            //获取窗体最小高度以及宽度
            var _windowObjMinWidth = document.defaultView.getComputedStyle(_self.windowObj,null).minWidth;   //计算窗口大小,扣除padding
            _self.windowObjMinWidth = Number(_windowObjMinWidth.substring(0,(_windowObjMinWidth.length)-2));
            var _windowObjMinHeight = document.defaultView.getComputedStyle(_self.windowObj,null).minHeight;   //计算窗口大小,扣除padding
            _self.windowObjMinHeight = Number(_windowObjMinHeight.substring(0,(_windowObjMinHeight.length)-2));

            //拖动
            if(target == _self.windowHeader || target == _self.windowContentWrapper || target == _self.title){
                if (target !== _self.up && target !== _self.extend && target !== _self.close) {
                    _self.windowSizeChange();  //记录窗口位置

                    EventUtil.addHandler(_self.windowWrapper,"mousemove",windowMove);  //鼠标移动事件

                    EventUtil.addHandler(document,"mouseup",function(event) {   //用户释放鼠标时触发的事件
                        _self.windowWrapper.style.cursor = "default";
                        EventUtil.removeHandler(_self.windowWrapper,"mousemove",windowMove);
                    });
                }
            }else{   //缩放
                if (target !== _self.up && target !== _self.extend && target !== _self.close){
                    _self.windowSizeChange();  //记录窗口位置

                    _self.originalWindowObjX = _self.windowObjWidth;  //元素相对于父元素的top
                    _self.originalWindowObjY = _self.windowObjHeight;

                    EventUtil.addHandler(document,"mousemove",windowChange);  //鼠标移动事件
                    
                    EventUtil.addHandler(document,"mouseup",function(event) {   //用户释放鼠标时触发的事件
                        _self.windowWrapper.style.cursor = "default";
                        EventUtil.removeHandler(document,"mousemove",windowChange);
                    });
                }
            }
        });

        EventUtil.addHandler(this.ul,"click",function(event){
            var target = event.target;
            if (target == _self.up) {  //收起
                _self.windowUp();
            }else if (target == _self.extend) {  //放大

                _self.windowExtend();
            }else if(target == _self.close){  //关闭
                _self.windowWrapper.removeChild(_self.windowObj);
            }else{}
        });
    }
}
new Window({
    positionX : document.getElementById("positionX"),
    positionY : document.getElementById("positionY"),
    sizeX : document.getElementById("sizeX"),
    sizeY : document.getElementById("sizeY"),
    herderText : document.getElementById("herderText"),
    positionBtn: document.getElementById("positionBtn"),
    sizeBtn: document.getElementById("sizeBtn"),
    headerBtn: document.getElementById("headerBtn")
});