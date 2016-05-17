//默认参数
Windows.defaultOptions = {

	isShow : true,			   //窗口是否显示
	isCollapse : true,         //是否折叠
	isMaximize : true,         //是否放大
	isDragable : true,         // 是否可拖拽
    isMoveable : true,         // 是否可缩放

    hasFooter  : false,        //是否有页脚

	parent : document.body,    //窗口的父节点
	zIndex : 1000,			   //窗口zIndex
	dragRange : 5,             //拖拽范围

	width : 300,	           //默认宽度
	height : 200,              //默认高度
	left : 100,		     	   //默认左边距
	top : 100,		           //默认上边距

	minHeight : 150,           //最小高度
	minWidth : 200,            //最小宽度
	maxHeight : 300,           //最大高度
	maxWidth : 500,            //最大宽度

	title : "WINDOW",          //窗口头标题
	bodyContent : "content",   //窗口内容
	footer : "footer"          //窗口页脚
}

function Windows(param){

	//获取默认参数
	var options = this.constructor.defaultOptions;

    //扩展默认参数
	this.options = Util.extend(options,param);

	//初始化
	this.init();

	this.isCollapse = false;
	this.isMaximize = false;
}

Windows.prototype = {
	constructor : Windows,

	//窗口实例存储
    _getInstances : function() {

        if(!this.constructor.allInatances) { 
            this.constructor.allInatances = [];  //若原型中不存在allInatances，将其设置为空数组
        }
        this.constructor.allInatances.push(this);   //将window对象放到allInatances中

        //设置窗口Index
		this._setIndex();
    },

    // 点击窗口修改层级
    _setIndex : function() {
        var _self = this;

        var allInatances = this.constructor.allInatances;          

        Util.event.addHandler(this.windowObj, "mousedown", indexValue);  //窗口点击事件绑定

        //设置zIndex值
        function indexValue(){    
        	for(var i = 0, j = allInatances.length; i < j; i++) {

                if(allInatances[i] === _self) {
                    allInatances.splice(i,1);
                    allInatances.push(_self);
                }
                allInatances[i].windowObj.style.zIndex = _self.options.zIndex + i * 5;

            }
        }
    },

    // 将新创建的窗口放置在最前面
    _windowToFront : function() {
        var allInatances = this.constructor.allInatances;
        var windowNum = allInatances ? allInatances.length : 0;
        this.windowObj.style.zIndex = this.options.zIndex + windowNum * 5;
    },

	//创建窗口
	_createWindow : function(){ 
		var _options = this.options;
		//窗口实例  
		this.windowObj = document.createElement('div');
		this.windowObj.className = 'windowWrapper';

		//窗口内容包裹
		this.windowContainer = document.createElement('div');
		this.windowContainer.className = 'window-container';

		//头部
		this.windowHeader = document.createElement('div');
		this.windowHeader.className = 'window-header';
		this.windowContainer.appendChild(this.windowHeader);

		//标题
		var title = document.createElement('span');
		title.className = 'title';
		var textNode = document.createTextNode(_options.title);
        title.appendChild(textNode);
		this.windowHeader.appendChild(title);

		//操作按钮组
		this.ul = document.createElement('ul');
		this.windowHeader.appendChild(this.ul);

		//折叠按钮
		this.collapse = document.createElement('li');
		this.collapse.className = 'collapse';
		this.ul.appendChild(this.collapse);

		//最大化按钮
		this.maximize = document.createElement('li');
		this.maximize.className = 'maximize';
		this.ul.appendChild(this.maximize);

		//关闭按钮
		this.close = document.createElement('li');
		this.close.className = 'close';
		this.ul.appendChild(this.close);

		//窗口内容
		this.windowContent = document.createElement('div');
		this.windowContent.className = 'window-content';
		var contentTextNode = document.createTextNode(_options.bodyContent);
		this.windowContent.appendChild(contentTextNode);
		this.windowContainer.appendChild(this.windowContent);

		//窗口页脚部分
		this.footer = document.createElement('div');
		this.footer.className = 'window-footer';
		var footerTextNode = document.createTextNode(_options.footer);
		this.footer.appendChild(footerTextNode);
		this.windowContainer.appendChild(this.footer);

		//在页面创建窗口实例
		this.windowObj.appendChild(this.windowContainer);
		this.options.parent.appendChild(this.windowObj);

		//将新创建的窗口放置到最前面
		this._windowToFront();  

		//窗口初始化状态
		this._windowStatus();  
	},

	//窗口状态
	_windowStatus : function (){
		var _options = this.options;

		this.moveTo(_options.left, _options.top);

		this.resizeTo(_options.width, _options.height);

		//是否可以折叠
		if (!_options.isCollapse) {
			this.collapse.style.cursor = "not-allowed";
		};

		//是否可以放大
		if (!_options.isMaximize) {
			this.maximize.style.cursor = "not-allowed";
		};

		//头部鼠标样式设置
		this.windowHeader.style.cursor = !_options.isMoveable ? 
												  (!_options.isMaximize ? "default" : "pointer") : "move";
	},

	//窗口位置
	moveTo : function(left,top){
		var _options = this.options;
		var style = this.windowObj.style;

		//left
		style.left = left + "px";    
		_options.left = left;

		//top
		style.top = top + "px";
		_options.top = top;
	},

	//窗口大小
	resizeTo : function(width,height){
		var _options = this.options;
		var style = this.windowObj.style;

		//width
		style.width = width + "px";    
		_options.width = width;

		//height
		style.height = height + "px";
		_options.height = height;
	},

	//窗口操作
	_windowOperate : function(){
		var _self = this,
			_options = this.options;

		//事件代理，最大化，折叠，关闭
		Util.event.addHandler(this.ul,'click',operate); 

		//双击放大事件绑定
		Util.event.addHandler(this.windowHeader,'dblclick',dblclick);  

		//双击放大
		function dblclick(e){ 
			e = Util.event.getEvent(event);
			Util.removeTextSelect();
			var target = Util.event.getTarget(e);
			if (target !== _self.collapse && target !== _self.maximize && target !== _self.close){
				//清除文本选中
				Util.removeTextSelect();
				//最大化以及还原  
				_self.beMaximize();        
			}
		}

		//窗口操作
		function operate(e){
			//获取事件
			e = Util.event.getEvent(event); 
			//获取事件目标
			var target = Util.event.getTarget(e);   

			switch(target){
				case  _self.collapse :
					_self.beCollapse();   //折叠
					break;
				case  _self.maximize :
					_self.beMaximize();   //最大化
					break;
				case  _self.close :
					_self.closeWindow();  //关闭
					break;
			}
		}
	},

	//窗口折叠
	beCollapse : function(){
		var _options = this.options,
		    _self = this,
		    height = Util.getBoundingClientRect(_self.windowHeader).height; //设置放大后宽高

		//判断是否可以进行折叠
		if (_options.isCollapse === false) {
			return;
		};

		//根据_self.isCollapse的值判断执行折叠或者返回折叠之前的状态
		_self.isCollapse === false ? collapse() : collapseBack();
		
		//折叠
		function collapse(){ 
			//保存宽高  
			_self.preHeight = _options.height;   
			_self.resizeTo(_options.width,height);
			//内容部分隐藏   
			_self.windowContent.style.display = "none";   
			_self.isCollapse = true; 

			_self.collapse.className = "togglg-collapse";
		}

		//折叠返回
		function collapseBack(){
			//折叠状态边界判断
			var top = parseInt(_self.windowObj.style.top); 
			var parentHeight = _options.parent.clientHeight;
			if (top === parentHeight - height) {
				top = parentHeight - _self.preHeight;
				_self.moveTo(_options.left,top);
			}

			//折叠与最大化切换处理
			_self.isMaximize === false ? _self.resizeTo(_options.width,_self.preHeight)
			 							  : _self.resizeTo(_options.width,_options.parent.clientHeight);
			
			_self.windowContent.style.display = "block";
			_self.isCollapse = false;
			_self.collapse.className = "collapse";
		}
	},

	//窗口最大化
	beMaximize : function(){
		var _options = this.options,
		    _self = this;

		//窗口不能最大化
		if (!_options.isMaximize){return;}

		//根据_self.isMaximize值判断执行最大化还是还原    
		!_self.isMaximize ? maximize() : maximizeBack();

		//放大
		function maximize(){   
			//放大之前的窗口数据
			_self.preOptions ={  
				height : _options.height,
				width : _options.width,
				left : _options.left,
				top : _options.top
			} 

			//折叠状态下放大数据保存
			if (_self.isCollapse === true) {
				_self.preOptions.height = _self.preHeight;
			};

			//父元素大小
			var parentSize = {
				height : _options.parent.clientHeight,
				width : _options.parent.clientWidth
			}	

			//设置放大后的鼠标样式
			this.preClassName = _self.windowHeader.className; 
			_self.windowHeader.style.cursor = "pointer";
			_self.resizeTo(parentSize.width,parentSize.height);
			_self.moveTo(0,0);

			//设置操作图标样式
			_self.collapse.className = "collapse";
			_self.maximize.className = "togglg-maximize";

			_self.isMaximize = true;
			_self.windowContent.style.display = "block";
			_self.isCollapse = false;
		}

		//返回放大之前的状态
		function maximizeBack(){   
			//放大折叠之间宽高处理
			_self.preHeight =  _self.preOptions.height;
			_self.resizeTo(_self.preOptions.width,_self.preOptions.height);
			_self.moveTo(_self.preOptions.left,_self.preOptions.top);

			_self.isMaximize = false;
			_self.windowContent.style.display = "block";
			_self.isCollapse = false;

			//设置操作图标样式
			_self.maximize.className = "maximize";
			_self.collapse.className = "collapse";
		}
	},

	//窗口关闭
	closeWindow : function(){
		//将窗口从实例库中移除
		var allInatances = this.constructor.allInatances;
        allInatances.pop();
		this.options.parent.removeChild(this.windowObj);
	},

	//窗口是否显示
	show : function(){
		//窗口显示掩藏
		this.windowObj.style.display = this.options.isShow ? "block" : "none";
	},

	//是否含有页脚
	footerExit : function(){
		if(!this.options.hasFooter){
			this.windowContainer.removeChild(this.footer);
		}
	},

	//窗口拖动
	windowMove : function(){
		var _options = this.options,
		    _self = this,
		    mouseDownPosition,  //鼠标按下位置
		    windowPosition,  //窗口位置
		    windowSize,      //窗口大小
		    parentSize;		 //窗口父节点大小

		//窗口是否可以移动
		if (!_options.isMoveable) {return;}

		//鼠标按下
		Util.event.addHandler(this.windowHeader,'mousedown',draggable);

		//鼠标按下事件
		function draggable(e){
			//拖动与拖拽冲突解决
			if (_self.direction !== "default") {return;}

			e = Util.event.getEvent(event);
			var target = Util.event.getTarget(e);

			//阻止文本选中事件
			Util.removeTextSelect();

			//最大时阻止窗口移动
			if (_self.isMaximize) {return;} 

			//窗口按下位置
			windowPosition = {      
				left : _options.left,
				top : _options.top
			}

			//窗口按下时的大小
			windowSize = {          
				width : _options.width,
				height : _options.height
			}

			//窗口父元素大小
			parentSize = {         
				width : _options.parent.clientWidth,
				height : _options.parent.clientHeight
			}

			//鼠标按下位置
			mouseDownPosition = Util.event.getPageAxis(e);

			//拖动范围设置
			if (target !== _self.collapse && target !== _self.maximize && target !== _self.close ) {
				Util.event.addHandler(document,'mousemove',draggableBegin);
				Util.event.addHandler(document,'mouseup',draggableStop);
			}
		}

		//窗口拖动事件
		function draggableBegin(e){
			//大小拖拽状态下禁止
			if (_self.isDrag) {return;} 

			_self.isMove = true;

			e = Util.event.getEvent(event);

			//文本选中触发的事件
			Util.removeTextSelect();   

			//鼠标移动位置
			var mouseMovePosition = Util.event.getPageAxis(e);

			//鼠标移动偏移量
			var offsetX = mouseMovePosition.x - mouseDownPosition.x;
			var offsetY = mouseMovePosition.y - mouseDownPosition.y;

			//窗口left ，top
			var left = offsetX + windowPosition.left;
			var top = offsetY + windowPosition.top;

			//窗口在左边界的判断
			left = (left < 0) ? 0 : left;   
			//窗口右边界判断
			top = (top < 0) ? 0 : top;
			//窗口右边界判断
			left = (left > parentSize.width - windowSize.width) ? parentSize.width - windowSize.width : left;
			//窗口下边界判断
			top = (top > parentSize.height - windowSize.height) ? parentSize.height - windowSize.height : top;

			//移动窗口
			_self.moveTo(left,top);
		}

		//拖动事件解绑
		function draggableStop(){
			_self.isMove = false;
			Util.event.removeHandler(document,'mousemove',draggableBegin);
			Util.event.removeHandler(document,'mouseup',draggableStop);
		}
	},

	//设置拖拽时鼠标样式
	_setDragCursor : function(){ 
		var _self = this,
		    _options = this.options;

		//设置拖拽状态下时间绑定
		Util.event.addHandler(this.windowObj,'mousemove',dragCursor); 

		function dragCursor(event){
			//拖拽下禁止
			if(_self.isDrag) {return ;}

			//移动下禁止  
			if(_self.isMove) {return ;} 

			//最大时阻止窗口移动 
			if (_self.isMaximize) {return;}   

			e = Util.event.getEvent(event);

			//鼠标位置
			var mouseMovePosition ={
				x : e.clientX,
				y : e.clientY
			} 

			//窗口相对于视口的大小位置
			var windowObjOptions = Util.getBoundingClientRect(_self.windowObj);

			_self.windowHeader.style.cursor = "";
			
			//鼠标样式判断
			if (mouseMovePosition.x < windowObjOptions.left + _options.dragRange) {    
				_self.direction = "w-resize";            				                 	//W
				if (mouseMovePosition.y < windowObjOptions.top + _options.dragRange) {
					_self.direction = "nw-resize";      			 	 				 	//NW
				}
				if (mouseMovePosition.y > windowObjOptions.bottom - _options.dragRange) {   
					_self.direction = "sw-resize";		  									//SW
				}
			}else if(mouseMovePosition.x > windowObjOptions.right - _options.dragRange){
				_self.direction = "e-resize";            									//E
				if (mouseMovePosition.y < windowObjOptions.top + _options.dragRange) {
					_self.direction = "ne-resize";       									//NE
				}
				if (mouseMovePosition.y > windowObjOptions.bottom - _options.dragRange) {
					_self.direction = "se-resize";       									//SE
				}
			}else if(mouseMovePosition.y < windowObjOptions.top + _options.dragRange){
				_self.direction = "n-resize";           	 								//N
			}else if(mouseMovePosition.y > windowObjOptions.bottom - _options.dragRange){
				_self.direction = "s-resize";            									//S
			}else{
				_self.direction = "default";
				_self.windowHeader.style.cursor = !_options.isMoveable ? 
												  (!_options.isMaximize ? "default" : "pointer") : "move";
			}

			_self.windowObj.style.cursor = _self.direction;
		}
	},

	//窗口拖拽放大缩小
	windowDrag : function(event){
		var _self = this,
			_options = this.options,
			mouseDownPosition,  //鼠标按下位置
			windowPosition,     //窗口位置
		    windowSize,         //窗口大小
		    parentSize,		    //窗口父节点大小
		    windowMaxSize,      //最大窗口
		    windowMinSize;      //最小窗口

		var width,              //窗口width
			height,			    //窗口height		
			top,				//窗口top
			left;				//窗口left

		//窗口是否可拖拽
		if(!_options.isDragable){return}

		//设置拖拽时鼠标样式
		this._setDragCursor();

		//鼠标按下时事件绑定
		Util.event.addHandler(this.windowObj,'mousedown',dragWindow);    

		function dragWindow(event){
			e = Util.event.getEvent(event);

			//如果不是在拖动范围内阻止拖动
			if(_self.direction === "default"){return;}	

			//窗口最大时阻止窗口拖动   
			if (_self.isMaximize) {return;}              

			//清除文本选中
			Util.removeTextSelect();   

			//鼠标位置
			mouseDownPosition ={   
				x : e.clientX,
				y : e.clientY
			} 

			//鼠标按下窗口位置
			windowPosition = {      
				left : _options.left,
				top : _options.top
			}

			//鼠标按下窗口大小
			windowSize = {          
				width : _options.width,
				height : _options.height
			}

			//窗口父元素大小
			parentSize = {         
				width : _options.parent.clientWidth,
				height : _options.parent.clientHeight
			}

			//窗口最大宽高
			windowMaxSize = {     
				maxWidth : _options.maxWidth,
				maxHeight : _options.maxHeight
			}

			//窗口最小宽高
			windowMinSize = {    
				minWidth : _options.minWidth,
				minHeight : _options.minHeight
			}

			//放大缩小事件绑定
			Util.event.addHandler(document,'mousemove',dragBegin); 

			//事件绑定解除
			Util.event.addHandler(document,'mouseup',dragStop);   
		}

		function dragBegin(event){
			//移动状态下禁止拖拽
			if (_self.isMove) {return;}  

			_self.isDrag = true;

			e = Util.event.getEvent(event);

			//清空文本选中
			Util.removeTextSelect();  

			//鼠标位置
			var mouseMovePosition ={   
				x : e.clientX,
				y : e.clientY
			} 

			//窗口在拖拽时默认值
			width = windowSize.width,      
			height = windowSize.height,
			top = windowPosition.top,
			left = windowPosition.left;

			//鼠标位置变化量
			var offsetX = mouseMovePosition.x - mouseDownPosition.x ;
			var offsetY = mouseMovePosition.y - mouseDownPosition.y ;

			//拖拽时大小位置变化
			switch(_self.direction){
				case "e-resize" : 
					width = offsetX + windowSize.width;
					break;
				case "w-resize" : 
					width = windowSize.width - offsetX;  
					left = windowPosition.left + offsetX;
					break;
				case "s-resize" : 
					height = offsetY + windowSize.height;
					break;
				case "n-resize" : 
					height = windowSize.height - offsetY;
					top = windowPosition.top + offsetY;
					break;
				case "nw-resize" : 
					height = windowSize.height - offsetY;
					top = windowPosition.top + offsetY;
					width = windowSize.width - offsetX;  
					left = windowPosition.left + offsetX;
					break;
				case "ne-resize" :
					height = windowSize.height - offsetY;
					top = windowPosition.top + offsetY;
					width = offsetX + windowSize.width;
					break;
				case "se-resize" : 
					height = offsetY + windowSize.height;
					width = offsetX + windowSize.width;
					break;
				case "sw-resize" : 
					height = offsetY + windowSize.height;
					width = windowSize.width - offsetX;  
					left = windowPosition.left + offsetX;
					break;
				default :
					return false;
			}

			//拖拽时边界值判断
			var positionLimit = {
				//top边缘判断
				top : function (){   
					if (top <= 0){
						top = 0;
						height = windowSize.height + windowPosition.top;
					}
				},

				//left边缘判断
				left : function(){  
					if (left <= 0) {
						left = 0;
						width = windowSize.width + windowPosition.left;
					}
				},

				//左边界判断
				right : function(){
					if (windowPosition.left + windowSize.width + offsetX >= parentSize.width) {
						width = parentSize.width - windowPosition.left;
						left = windowPosition.left; 
					}
				},

				//下边界判断
				bottom : function(){
					if (windowPosition.top + windowSize.height + offsetY >= parentSize.height) {
						height = parentSize.height - windowPosition.top;
						top = windowPosition.top; 
					}
				},

				//宽度最大最小时判断
				widthLimit : function(){   
					if (width <= windowMinSize.minWidth) {
						left = windowSize.width - windowMinSize.minWidth + windowPosition.left ; 
					}else if(width >= windowMaxSize.maxWidth){
						left = windowPosition.left - (windowMaxSize.maxWidth - windowSize.width);
					}
				},

				//高度最大最小时判断
				heightLimit : function(){       
					if (height <= windowMinSize.minHeight) {
						top = windowSize.height - windowMinSize.minHeight + windowPosition.top ; 
					}else if (height >= windowMaxSize.maxHeight) {
						top = windowPosition.top - (windowMaxSize.maxHeight - windowSize.height);
					}
				}
			}

			//边界值判断
			switch(_self.direction){
				case "e-resize" : 
					positionLimit.right();
					break;
				case "w-resize": 
					positionLimit.left();
					positionLimit.widthLimit();
					break;
				case "s-resize": 
					positionLimit.bottom();
					break;
				case "n-resize": 
					positionLimit.top();
					positionLimit.heightLimit();
					break;
				case "nw-resize" : 
					positionLimit.top();
					positionLimit.left();
					positionLimit.heightLimit();
					positionLimit.widthLimit();
					break;
				case "ne-resize" :
					positionLimit.top();
					positionLimit.heightLimit();
					positionLimit.right();
					break;
				case "se-resize" : 
					positionLimit.bottom();
					positionLimit.right();
					break;
				case "sw-resize" : 
					positionLimit.bottom();
					positionLimit.left();
					positionLimit.widthLimit();
					break;
				default :
					return false;
			}

			//窗体宽度最大最小限制
			if (width <= windowMinSize.minWidth) {
				width = windowMinSize.minWidth;
			}else if(width >= windowMaxSize.maxWidth){
				width = windowMaxSize.maxWidth;
			}

			//窗体高度最大最小限制
			if (height <= windowMinSize.minHeight) {
				height = windowMinSize.minHeight;
			}else if (height >= windowMaxSize.maxHeight) {
				height = windowMaxSize.maxHeight;
			}

			_self.resizeTo(width,height);
			_self.moveTo(left,top);
		}

		function dragStop(){
			_self.isDrag = false;
			Util.event.removeHandler(document,'mousemove',dragBegin);
			Util.event.removeHandler(document,'mouseup',dragStop);
		}
	},

	//初始化
	init : function(){
		//创建窗口
		this._createWindow();

		//窗口操作
		this._windowOperate();

		//窗口拖拽
		this.windowDrag();

		//窗口拖动
	    this.windowMove();

		//窗口实例存储
		this._getInstances();

		//窗口显示掩藏
		this.show();

		//窗口是否含有页脚
		this.footerExit();
	}
}

