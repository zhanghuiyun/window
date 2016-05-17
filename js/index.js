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
}

Windows.prototype = {
	constructor : Windows,

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

	//初始化
	init : function(){
		//创建窗口
		this._createWindow();
	}
}

