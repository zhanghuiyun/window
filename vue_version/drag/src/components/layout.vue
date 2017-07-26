<template>
	<div id="windowInfo" ref="windowInfo">
	    <!-- S 窗口 -->
	    <div id="windowMaxMove" ref="windowMaxMove">
	        <div class="windowWrapper" ref="window" v-if="isShow" :style="{ width: windowSize.width + 'px', height: windowSize.height + 'px' ,left : windowPosition.left + 'px',top : windowPosition.top + 'px'}">  
	            <div class="window-container">
	                <div ref="windowHeader" class="window-header">
	                    <span class="title">{{ title }}</span>
	                    <ul>
	                        <li ref="collapse" class="collapse" :class="{ togglgCollapse : !isCollapse }" @click.stop.prevent="collapse"></li>
	                        <li ref="maximize" class="maximize" :class="{ togglgMaximize : isMaximize }" @click.stop.prevent="maximize($event)"></li>
	                        <li ref="close" class="close" @click.stop.prevent="close"></li>
	                    </ul>
	                </div>
	                <div class="window-content" v-show="isCollapse">
	                    {{ content }}
	                </div>
	            </div>
	        </div>
	    </div>
		
	</div>
</template>

<script>

    import Utils from '../util/util.js'

    export default {
        data () {
            return {
              	isShow : true,			//窗口是否显示
              	isCollapse : true,      //折叠时候
              	isMaximize : false,     //是否已经最大化
              	isMove : false,         //是否拖动
              	title : "窗口", 			//窗口的标题
              	content : "内容",  	  	//窗口内容
              	windowSize : {          //窗口大小
              		width : 200,            
              		height : 200,			
              	},
              	windowPosition : {      //窗口位置
              		left : 20,              
              		top : 20,	            
              	},
              	preData : {             //记录窗口放大之前的大小以及位置
              		preWidth : 0,
              		preHeight : 0,
              		preTop : 0,
              		preLeft : 0
              	},
              	mouseDownPosition : {   //鼠标按下位置
              		x : 0,
              		y : 0
              	}  
            }
        },
        mounted (){
			// 窗口的移动范围
        	let parents = this.$refs.windowMaxMove

        	this.parentsSize = {
        		width : parents.clientWidth,
        		height : parents.clientHeight
        	}

        	// 鼠标按钮的时候
        	this.moveOperate()
        },
        methods : {

        	// 拖动
        	moveOperate (){

        		// 鼠标按钮的时候
	        	$(document).on('mousedown',(event) => {

	        		// 窗口最大的时候阻止移动
					if (this.isMaximize) {return;}

					let target = Utils.event.getTarget(event),   //时间的目标
	        			_preData = this.preData,                 //操作之前的位置
	        			collapse = this.$refs.collapse,          //折叠DOM
	        			maximize = this.$refs.maximize,			 //最大化DOM
	        			close = this.$refs.close,                //关闭DOM
	        			windowHeader = this.$refs.windowHeader   //头部header

	        		if (target === windowHeader) {
	        			//拖动范围设置
						if (target !== collapse && target !== maximize && target !== close ) {
							
							// 记录按下的时候，当前的位置以及大小
							_preData.preWidth= this.windowSize.width,
							_preData.preHeight = this.windowSize.height,
							_preData.preTop = this.windowPosition.top,
							_preData.preLeft = this.windowPosition.left

							// 鼠标按下的位置
							this.mouseDownPosition = Utils.event.getPageAxis(event)

							// 设置可以拖动
							this.isMove = true
						}
	        		}else{
	        			this.isMove = false
	        		}
	        	})

	        	// 鼠标拖动的时候
	        	$(document).on('mousemove',(event) => {

	        		// 判断鼠标move的时候，窗口是否需要进行拖动
	        		if (this.isMove){
	        			// 鼠标的位置
        				let mouseMovePosition = Utils.event.getPageAxis(event)

        				//鼠标移动偏移量
						let offsetX = mouseMovePosition.x - this.mouseDownPosition.x,
						    offsetY = mouseMovePosition.y - this.mouseDownPosition.y

						//窗口left ，top
						let _left = offsetX + this.preData.preLeft,
							_top = offsetY + this.preData.preTop

						//窗口在左边界的判断
						_left = (_left < 0) ? 0 : _left;   
						//窗口右边界判断
						_top = (_top < 0) ? 0 : _top;
						//窗口右边界判断
						_left = (_left > this.parentsSize.width - this.preData.preWidth) ? this.parentsSize.width - this.preData.preWidth : _left;
						//窗口下边界判断
						_top = (_top > this.parentsSize.height - this.preData.preHeight) ? this.parentsSize.height - this.preData.preHeight : _top;

						this.setWindowPosition(_top,_left)
	        		}
	        	})	

	        	//鼠标松开的时候
        		$(document).on('mouseup',(event) => {
        			// 设置不能拖动
    				this.isMove = false
        		})
        	},

        	// 拖拽放大缩小
        	

        	// 关闭窗口
        	close (){
        		this.isShow = false
        	},

        	// 向上折叠
        	collapse (){
        		// 折叠样式变化，向上或向下鼠标的变化
        		this.isCollapse = !this.isCollapse
        	},

        	// 放大
        	maximize (event){

        		// 放大缩小样式切换
        		this.isMaximize = !this.isMaximize

				// 放大操作还是缩小操作
				if (this.isMaximize) {

					// 放大还原之前的窗口大小
					// 放大还原之前的窗口位置
					let _preData = this.preData
						_preData.preWidth= this.windowSize.width,
						_preData.preHeight = this.windowSize.height,
						_preData.preTop = this.windowPosition.top,
						_preData.preLeft = this.windowPosition.left

					// 重置窗口大小以及位置
					this.setWindowSize(this.parentsSize.width,this.parentsSize.height)
					this.setWindowPosition(0,0)
				}else{

					// 重置窗口大小以及位置
					this.setWindowSize(this.preData.preWidth,this.preData.preHeight)
					this.setWindowPosition(this.preData.preTop,this.preData.preLeft)
				}
        	},

        	// 设置窗口大小
        	setWindowSize (width,height){
        		this.windowSize.width = width
        		this.windowSize.height = height
        	},

        	// 相对于移动范围，窗口的位置
        	setWindowPosition (top,left){
        		this.windowPosition.top = top
        		this.windowPosition.left = left
        	}

        },
        computed : {

        }
    }

</script>


<style scoped>
	/*窗口信息*/
	#windowDetail {
	  	width: 1000px;
	  	margin: 0 auto;
	}
	#windowDetail li {
	  	list-style-type: none;
	  	margin-top: 10px;
	}
	#windowDetail label {
	  	display: inline-block;
	  	width: 200px;
	  	font-weight: bold;
	}
	#windowDetail input {
	  	display: inline-block;
	  	width: 30px;
	  	border: 1px solid #ccc;
	}
	#windowDetail .btn {
	  	display: inline-block;
	  	width: 150px;
	  	border-radius: 3px;
	  	background-color: #929bd2;
	  	height: 30px;
	  	font-weight: bold;
	}
	/*窗口*/
	#windowMaxMove {
	  	width: 1000px;
	  	height: 450px;
	  	border: 1px solid #ccc;
	  	margin: 0 auto;
	  	position: relative;
	  	box-sizing: border-box;
	}
	.windowWrapper {
	  	width: 300px;
	  	height: 200px;
	  	/*border: 1px solid #ccc;*/
	  	border-radius: 5px;
	  	position: absolute;
	  	box-sizing: border-box;
	  	left: 100px;
	  	top: 100px;
	}
	.window-container {
	  	width: 100%;
	  	height: 100%;
	  	position: relative;
	}
	/*窗口头部*/
	.window-header {
	  	width: 100%;
	  	height: 40px;
	  	background-color: #7070DA;
	  	padding: 0 10px;
	  	box-sizing: border-box;
	  	position: absolute;
	  	z-index: 10;
	  	cursor: move;
	}
	.cursor {
	  	cursor: default;
	}
	.title {
	  	height: 40px;
	  	display: inline-block;
	  	float: left;
	  	font-weight: bold;
	  	line-height: 40px;
	}
	.window-header ul {
	  	width: 90px;
	  	height: 40px;
	  	display: inline-block;
	  	float: right;
	  	margin: 0 0 0;
	  	padding-left: 0;
	}
	.window-header ul li {
	  	list-style-type: none;
	  	width: 30px;
	  	height: 26px;
	  	display: inline-block;
	  	float: left;
	  	margin-top: 7px;
	}
	/*窗口头部*/
	.maximize {
	  	width: 30px;
	  	height: 26px;
	  	cursor: pointer;
	  	background: url(../assets/2.png) center center no-repeat;
	}
	.maximize:hover {
	  	background-color: rgba(255, 255, 255, 0.5);
	}
	.close {
	  	width: 30px;
	  	height: 26px;
	  	cursor: pointer;
	  	background: url(../assets/1.png) center center no-repeat;
	}
	.close:hover {
	  	background-color: rgba(255, 255, 255, 0.5);
	}
	.collapse {
	  	width: 30px;
	  	height: 26px;
	  	cursor: pointer;
	  	background: url(../assets/3.png) center center no-repeat;
	}
	.collapse:hover {
	  	background-color: rgba(255, 255, 255, 0.5);
	}
	/*窗口头部操作样式切换*/
	.togglgCollapse {
	  	width: 30px;
	  	height: 26px;
	  	cursor: pointer;
	  	background: url(../assets/4.png) center center no-repeat;
	}
	.togglgCollapse:hover {
	  	background-color: rgba(255, 255, 255, 0.5);
	}
	.togglgMaximize {
	  	width: 30px;
	  	height: 26px;
	  	cursor: pointer;
	  	background: url(../assets/5.png) center center no-repeat;
	}
	.togglgMaximize:hover {
	  	background-color: rgba(255, 255, 255, 0.5);
	}
	/*窗口内容部分*/
	.window-content {
	  	width: 100%;
	  	height: 100%;
	  	position: absolute;
	  	background-color: #EAEAF1;
	  	box-sizing: border-box;
	  	padding: 40px 10px 0 10px;
	  	z-index: 5;
	}
	/*窗口页脚*/
	.window-footer {
	  	position: absolute;
	  	width: 100%;
	  	height: 40px;
	  	background-color: #7070DA;
	  	padding: 0 10px;
	  	box-sizing: border-box;
	  	z-index: 10;
	  	bottom: 0;
	}

</style>
