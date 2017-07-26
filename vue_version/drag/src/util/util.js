var utils = {

    event : {

        //获取鼠标位置，包含滚动条件
    	getPageAxis (event){
    		if(event.pageX || event.pageY){
                return {
                    x : event.pageX,
                    y : event.pageY
                }
            }

            let doc = document.documentElement;
            let body = document.body;

            return {
                x : event.clientX +
                    ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) -
                    ( doc && doc.clientLeft || body && body.clientLeft || 0 ),
                y : event.clientY +
                    ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) -
                    ( doc && doc.clientTop  || body && body.clientTop  || 0 )
            }
    	},

        //获取事件目标
        getTarget:function(event){
            return event.target||event.srcElement;
        }
    }
}

export default utils