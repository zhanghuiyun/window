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
    this.preLeft = 0;
    this.preTop = 0;
    this.init(param);
}
//window窗口原型对象
Window.prototype = {     
    createWindow : function(){         //创建窗口
        this.windowWrapper = document.getElementById('windowMaxMove');  //获取窗口移动范围

        this.windowObj = document.createElement('div'); //创建窗口
        this.windowObj.className = 'window';

        this.windowHeader = document.createElement('div');   //创建窗口头部
        this.windowHeader.className = 'windowHeader';
        this.title = document.createElement('span');
        this.title.className = 'title';
        this.textNode = document.createTextNode("WINDOW");
        this.title.appendChild(this.textNode);
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

        this.countWindowSize();   //计算窗口
        this.countContentSize();  //计算窗口内容部分宽高

        this.hasUp = true;        //是否折叠
        this.hasExtend = true;    //是否伸展
    },
    countWindowSize : function(){      //窗口计算
        //窗口头部
        this.headerHeight = parseInt(document.defaultView.getComputedStyle(this.windowHeader,null).height);     //计算窗口padding
        this.headerHeight = (isNaN(this.headerHeight)) ?  0 : this.headerHeight; 
        this.headerWidth = parseInt(document.defaultView.getComputedStyle(this.windowHeader,null).width);     //计算窗口padding
        this.headerWidth = (isNaN(this.headerWidth)) ?  0 : this.headerWidth; 

        //窗口padding
        this._paddingNew = parseInt(document.defaultView.getComputedStyle(this.windowObj,null).padding);     //计算窗口padding
        this._paddingNew = (isNaN(this._paddingNew)) ?  10 : this._paddingNew;                               //padding有无处理
        
        //窗口border
        this.windowBorder = parseInt(document.defaultView.getComputedStyle(this.windowObj,null).border);
        this.windowBorder = (isNaN(this.windowBorder)) ?  0 : this.windowBorder;    //border有无处理
        
        //获取窗体最小高度以及宽度
        this.windowObjMinWidth = parseInt(document.defaultView.getComputedStyle(this.windowObj,null).minWidth);     //计算窗口最小宽度,扣除padding
        this.windowObjMinWidth = (isNaN(this.windowObjMinWidth)) ?  200 : this.windowObjMinWidth;                   //最小宽度有无处理
        this.windowObjMinHeight = parseInt(document.defaultView.getComputedStyle(this.windowObj,null).minHeight);   //计算窗口最小高度,扣除padding
        this.windowObjMinHeight = (isNaN(this.windowObjMinHeight)) ?  30 : this.windowObjMinHeight;                 //最小高度有无处理

        //窗口大小
        this.windowObjWidth = parseInt(document.defaultView.getComputedStyle(this.windowObj,null).width);    //计算窗口宽度,扣除padding
        this.windowObjHeight = parseInt(document.defaultView.getComputedStyle(this.windowObj,null).height);  //计算窗口高度,扣除padding
        
        //窗口包裹div大小
        this.windowWrapperWidth = parseInt(document.defaultView.getComputedStyle(this.windowWrapper,null).width);    //计算窗口包裹div宽度,扣除padding
        this.windowWrapperHeight = parseInt(document.defaultView.getComputedStyle(this.windowWrapper,null).height);  //计算窗口包裹div高度,扣除padding
    },
    countContentSize : function(){     //窗口内容区域计算 
        this.contentBorder = parseInt(document.defaultView.getComputedStyle(this.windowContentWrapper,null).border);
        this.contentBorder = (isNaN(this.contentBorder)) ?  0 : this.contentBorder;    //border有无处理
        this.windowContentWrapper.style.height = this.windowObjHeight - this.headerHeight - this.contentBorder*2  +'px';  //内容宽高计算    
    },
    windowPrePosition : function(){   //记录窗口上一次的左右距离
        this.preLeft = parseInt(document.defaultView.getComputedStyle(this.windowObj,null).left);   
        this.preLeft = (isNaN(this.preLeft)) ?  0 : this.preLeft;

        this.preTop = parseInt(document.defaultView.getComputedStyle(this.windowObj,null).top); 
        this.preTop = (isNaN(this.preTop)) ?  0 : this.preTop;
    },
    mouseStyle : function(event){     //鼠标样式
        event = EventUtil.getEvent(event);
        var target = event.target;

        //获取鼠标位置
        var mouseX = event.clientX;  
        var mouseY = event.clientY;

        //窗体移动div位置
        var windowWrapPositionX = this.windowWrapper.offsetLeft;  
        var windowWrapPositionY = this.windowWrapper.offsetTop;

        //窗体位置
        var  windowPositionX = this.windowObj.offsetLeft;  
        var  windowPositionY = this.windowObj.offsetTop;

        //窗体内容部分宽高
        var contentWidth = parseInt(document.defaultView.getComputedStyle(this.windowContentWrapper,null).width);
        var contentHeight = parseInt(document.defaultView.getComputedStyle(this.windowContentWrapper,null).height);

        //拖动时鼠标样式
        if(target == this.windowHeader || target == this.title){    
            if (target !== this.up && target !== this.extend && target !== this.close){   
                this.windowWrapper.style.cursor = "move";
            }
        }else if (target == this.up || target == this.extend || target == this.close) {
            this.windowWrapper.style.cursor = "pointer";
        }else{
            this.windowWrapper.style.cursor = "default";
        }

        //缩放时鼠标样式
        if(mouseX >= (windowPositionX + windowWrapPositionX) && mouseX <= (windowPositionX + windowWrapPositionX + this._paddingNew)){
            this.windowWrapper.style.cursor = "w-resize";
        }else if(mouseX >= (windowPositionX + windowWrapPositionX + contentWidth + this._paddingNew + this.contentBorder*2 + this.windowBorder*2) && mouseX <= (windowPositionX + windowWrapPositionX + contentWidth + this._paddingNew*2 + this.contentBorder*2 + this.windowBorder*2)){
            this.windowWrapper.style.cursor = "e-resize";
        }else if(mouseY >= (windowPositionY + windowWrapPositionY) && mouseY <= (windowPositionY + windowWrapPositionY + this._paddingNew)){
            this.windowWrapper.style.cursor = "n-resize";
        }else if (mouseY >= (windowPositionY + windowWrapPositionY + this._paddingNew + this.headerHeight + contentHeight + this.contentBorder*2 + this.windowBorder*2) && mouseY <= (windowPositionY + windowWrapPositionY + this._paddingNew*2 + this.headerHeight + contentHeight + this.contentBorder*2 + this.windowBorder*2)){
            this.windowWrapper.style.cursor = "s-resize";
        }else{}    
    },
    windowMove : function(event){     //窗口移动
        event = EventUtil.getEvent(event);

        //鼠标位置
        this.mouseMoveX = event.clientX;   
        this.mouseMoveY = event.clientY;

        //新位置
        this.WindowNewPositionX = (this.mouseMoveX - this.mouseDownX) +  this.preLeft;   
        this.WindowNewPositionY = (this.mouseMoveY - this.mouseDownY) + this.preTop;

        //边界判断
        this.WindowNewPositionX = (this.WindowNewPositionX <= this.originalWindowLeft) ? 0 : this.WindowNewPositionX;   
        this.WindowNewPositionX = (this.WindowNewPositionX >= this.windowWrapper.clientWidth - this.windowObj.clientWidth) ?  this.windowWrapper.clientWidth - this.windowObj.clientWidth : this.WindowNewPositionX;
        this.WindowNewPositionY = (this.WindowNewPositionY <= this.originalWindowTop) ? 0 : this.WindowNewPositionY;
        this.WindowNewPositionY = (this.WindowNewPositionY >= this.windowWrapper.clientHeight - this.windowObj.clientHeight) ? this.windowWrapper.clientHeight - this.windowObj.clientHeight : this.WindowNewPositionY;

        //移动至新位置
        this.newPosition(this.WindowNewPositionX,this.WindowNewPositionY);     
    },
    newPosition : function(WindowNewPositionX,WindowNewPositionY){    //窗口新位置
        this.windowObj.style.left = WindowNewPositionX + "px";  
        this.windowObj.style.top = WindowNewPositionY + "px";
    },
    windowUp : function(minHeight){    //窗口上下收缩伸展
        if (this.hasUp == true){                 //未折叠状态
            this.windowObj.style.height = minHeight + "px";
            this.windowContentWrapper.style.display = "none";
            this.hasUp = false;
        }else{                                   //已折叠状态
            this.windowObj.style.height = this.windowObjHeight + "px";
            this.windowContentWrapper.style.display = "block";
            this.hasUp = true;

            var top = this.windowObj.style.top;  //折叠缩小后在边界展开情况处理
            if (top == ((this.windowWrapperHeight - this.headerHeight - (this._paddingNew)*2) + "px" )) {
                this.windowObj.style.top = (this.windowWrapperHeight - this.windowObj.clientHeight) + "px";
            };
        }
    },
    windowExtend : function(maxWidth,maxHeight){     //窗口最大化
        if(this.hasExtend == true){
            this.windowObjPreWidth = this.windowObjWidth;   //记录伸缩之前的窗口大小
            this.windowObjPreHeight = this.windowObjHeight;

            this.windowPrePosition();                       //记录窗口上一次的左右距离

            this.windowObj.style.height = maxHeight - (this._paddingNew*2) - this.windowBorder*2 + "px";  //设置窗口新宽高
            this.windowObj.style.width = maxWidth - (this._paddingNew*2) - this.windowBorder*2 + "px";

            this.countWindowSize();                    //重新计算window
            this.countContentSize();                   //设置窗口内容部分

            this.hasUp = true;                         //默认展开显示
            this.windowContentWrapper.style.display = "block";  

            this.windowObj.style.top = 0;              //从最左侧开始
            this.windowObj.style.left = 0;
            this.hasExtend = false;     
        }else{
            this.hasUp = true;                         //默认展开显示
            this.windowContentWrapper.style.display = "block";  

            this.windowObj.style.height = this.windowObjPreHeight + "px";  //窗体放大之前的宽高
            this.windowObj.style.width = this.windowObjPreWidth + "px";

            this.windowObj.style.top = this.preTop + "px";     //缩小在伸展之前的位置上
            this.windowObj.style.left = this.preLeft + "px";

            this.hasExtend = true;
            this.countWindowSize();                     //重新计算window
            this.countContentSize();                    //设置窗口内容部分
        }
    },
    windowSize : function(width,height){
        this.windowObj.style.width = width + "px";
        this.windowObj.style.height = height + "px";

        this.countWindowSize();
        this.countContentSize();
    },
    init : function(param){              //初始化
        var _self = this;

        this.positionX = param.positionX;    
        this.positionY = param.positionY;
        this.sizeX = param.sizeX;
        this.sizeY = param.sizeY;
        this.herderText = param.herderText;
        this.positionBtn = param.positionBtn;
        this.sizeBtn = param.sizeBtn;
        this.headerBtn = param.headerBtn;

        this.createWindow();    //创建窗口

        _self.originalWindowLeft = _self.windowObj.offsetLeft;  //元素相对于父元素的位置
        _self.originalWindowTop = _self.windowObj.offsetTop;  

        //窗口移动
        var windowMove = function() {           
            _self.windowMove();
        }

        //鼠标样式  
        var mouseStyle = function() {       
            _self.mouseStyle();
        }

        //窗口拖动以及缩放
        EventUtil.addHandler(this.windowObj,"mousedown",function(event){
            event = EventUtil.getEvent(event);
            var target = event.target;
            _self.mouseDownX = event.clientX;  //鼠标按下位置
            _self.mouseDownY = event.clientY;

            if(target === _self.windowHeader || target === _self.title){    
                if (target !== _self.up && target !== _self.extend && target !== _self.close){   
                
                    _self.windowPrePosition();   //计算窗口位置

                    if (target === _self.title) {
                        event.preventDefault();
                    };

                    EventUtil.addHandler(document,"mousemove",windowMove);  //窗口拖动事件

                }
            }
        });   

        //窗口拖动事件绑定解除
        EventUtil.addHandler(document,"mouseup",function(event) {          
            EventUtil.removeHandler(document,"mousemove",windowMove);
        });

        //鼠标设置样式事件
        EventUtil.addHandler(document,"mouseover",mouseStyle);   

        //操作按钮事件
        EventUtil.addHandler(this.ul,"click",function(event){
            var target = event.target;
            if (target == _self.up) {                 //收缩

                var minHeight = _self.headerHeight;
                _self.windowUp(minHeight);            

            }else if (target == _self.extend) {       //最大化
                
                var maxHeight = _self.windowWrapperHeight;    //放大后的宽高
                var maxWidth = _self.windowWrapperWidth;
                _self.windowExtend(maxWidth,maxHeight); 

            }else if(target == _self.close){          //关闭

                _self.windowWrapper.removeChild(_self.windowObj);

            }else{} 
        });

        //窗口宽高修改事件
        EventUtil.addHandler(this.sizeBtn,"click",function(event){
            var width = parseInt(_self.sizeX.value);   
            var height = parseInt(_self.sizeY.value); 
            _self.windowSize(width,height);
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
