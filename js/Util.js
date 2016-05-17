var Util = {

    event : {
        //事件绑定
        addHandler: function(element, type, handler) {
            if(element.addEventListener) {
                element.addEventListener(type,handler,false);
            } else if (element.attachEvent) {
                element.attachEvent("on"+type,handler);
            } else {
                element["on"+type] = handler;
            }
        },

        //事件解除
        removeHandler: function(element, type, handler) {
            if(element.removeEventListener) {
                element.removeEventListener(type,handler,false);
            } else if (element.detachEvent) {
                element.detachEvent("on"+type,handler);
            } else {
                element["on"+type] = null;
            }
        },

        //获取事件
        getEvent: function(event){
            return event ? event : window.event;
        },

        //获取事件目标
        getTarget:function(event){
            return event.target||event.srcElement;
        },

        //获取鼠标位置，包含滚动条件
        getPageAxis: function(event) {

            if(event.pageX || event.pageY){
                return {
                    x : event.pageX,
                    y : event.pageY
                }
            }

            var doc = document.documentElement;
            var body = document.body;

            return {
                x : event.clientX +
                    ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) -
                    ( doc && doc.clientLeft || body && body.clientLeft || 0 ),
                y : event.clientY +
                    ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) -
                    ( doc && doc.clientTop  || body && body.clientTop  || 0 )
            }
        },

        //阻止事件冒泡
        stopPropagation:function(event){
            if(event.stopPropagation){
                event.stopPropagation();
            }else{
                event.cancelBubble = true;
            }
        },

        //阻止默认事件
         preventDefault:function(event){
            if(event.preventDefault){
                event.preventDefault();
            }else{
                event.returnValue = false;
            }
        }
    },

    //扩展函数，执行深复制
    extend : function(){
        var result = {},
            temp;
        for(var i = 0, j = arguments.length; i < j;i++) {
            for(var prop in arguments[i]) {
                if(arguments[i].hasOwnProperty(prop)) {
                    temp = arguments[i][prop];
                    if(typeof temp === "object" && !temp.nodeType) {
                        result[prop] = arguments.callee(temp);
                    }else {
                        result[prop] = temp;
                    }
                }
            }
        }
        return result;
    },

    // 获取指定元素在视口坐标中的尺寸和位置
    getBoundingClientRect : function(element) {

        var result = {};
        var box = element.getBoundingClientRect();

        result.left = box.left;
        result.right = box.right;
        result.top = box.top;
        result.bottom = box.bottom;

        //ie8中兼容性处理
        result.width = box.width === undefined ? (box.right - box.left) : box.width;
        result.height = box.height === undefined ? (box.bottom - box.top) : box.height;

        return result;
    },

    //清除文本选中
    removeTextSelect : function(){
        if ("getSelection" in window) {
            window.getSelection().removeAllRanges();
        }else{
            document.selection.empty();
        }                        
    },

    //鼠标样式类
    curosrStyle : function(element,preClassName,value,status){
        if (status) {
            if (!element.className) {
                element.className = value;
            } else {
                element.className+= " " + value;
            }
        }else{
            element.className = preClassName;
        }
    }

}


