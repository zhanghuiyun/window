<template>
    <div class="typeahead">
        <div class="typeahead-header">
            <input type="text" v-model="searchVal" @input="filterList(searchVal)" ref="input" :placeholder="placeholder" @keydown.down.prevent="selectChildWidthArrowDown" @keydown.up.prevent="selectChildWidthArrowUp" @keydown.enter="selectChildWidthEnter" @blur="ifNotFoundClear" @keydown.esc="ifNotFoundClear" autocomplete="off">
        </div>

        <transition name="el-fade-in-linear" mode="out-in">
            <div class="typeahead-content" v-if="searchVal && searchVal.length">
                <transition-group tag="ul" name="el-fade-in-linear" v-show="searchList && searchList.length > 0  && isExpand ">
                    <li v-for="(item,index) in searchList" :key="index" :class="item.active ? 'active':''" @click="selectChild(index)" @mouseover="setActiveClass(index)" @mouseout="setActiveClass(index)">
                        <a href="javascript:;">
                            {{item.text}}
                        </a>
                    </li>
                </transition-group>
                <p class="noFound" v-if="searchList && searchList.length === 0">未能查询到,请重新输入!</p>
            </div>
        </transition>
    </div>
</template>

<script>
    export default {
        name: 'typeahead',
        data: function() {
            return {
                searchVal: '', // 搜索关键字
                resultVal: '', // 保存搜索到的值
                searchList: [], //保存过滤的结果集
                currentIndex: -1, // 当前默认选中的index,
                isExpand: false,
                testData: [{
                        text: 'wofsdf',
                        value: 0
                    },
                    {
                        text: '我是技术渣1',
                        value: '1'
                    },
                    {
                        text: '我是技术渣2',
                        value: '2'
                    },
                    {
                        text: '我是天坑',
                        value: '2'
                    },
                    {
                        text: '我是天坑,分身乏术',
                        value: '3'
                    },
                    {
                        text: '我是天坑2,分身乏术',
                        value: '3'
                    },
                    {
                        text: '我是天坑3,分身乏术',
                        value: '3'
                    }
                ]
            }
        },
        computed: {
            typeaheadData() {
                return this.data ? this.data : this.testData; // 若是有传递props的data则用传递的,否则用测试data
            }
        },
        props: ['data', 'placeholder'],
        methods: {
            filterList(searchVal) { // 过滤数组
                this.searchList = []; // 清空列表
                let tempArr = []; // 一个临时数组
                this.typeaheadData && this.typeaheadData.forEach(item => {
                    item.text.indexOf(searchVal) !== -1 ? tempArr.push(item) : '';
                });
                this.searchList = tempArr; // 为什么要一个临时数组,不然每次push都会触发视图更新..数据量一大....
                this.resetDefaultList();
                this.isExpand = true;
            },
            resetDefaultList() {
                this.searchList.forEach(item => {
                    this.$set(item, 'active', false);
                })
            },
            ifNotFoundClear() { // 若是结果集长度为0就证明没有找到...赋值为空
                if (this.searchList.length === 0) {
                    this.searchVal = '';
                    this.isExpand = false;
                    this.resetDefaultList();
                }

            },
            selectChild(index) {
                // 鼠标点击选择子项
                this.searchList.forEach((item, innerIndex) => {
                    if (index === innerIndex || item.active) {
                        this.searchVal = item.text;
                        this.resultVal = item.value;
                        this.isExpand = false;
                    }
                    this.$set(item, 'active', false);
                })
                this.$emit('selectValue', { text: this.searchVal, value: this.resultVal });
            },
            selectChildWidthArrowDown() {
                // 判断index选中子项
                if (this.currentIndex < this.searchList.length - 1) {
                    this.currentIndex++;
                    this.searchList.forEach((item, index) => {
                        this.currentIndex === index ? this.$set(item, 'active', true) : this.$set(item, 'active', false);
                    })
                }
            },
            selectChildWidthArrowUp() {
                // 判断index选中子项
                if (this.currentIndex > 0) {
                    this.currentIndex--;
                    this.searchList.forEach((item, index) => {
                        this.currentIndex === index ? this.$set(item, 'active', true) : this.$set(item, 'active', false);
                    })
                }
            },
            selectChildWidthEnter() {
                // 若是搜索的内容完全匹配到项内的内容,则默认选中
                this.searchList.forEach(item => {
                    if (this.searchVal === item.text || item.active === true) {
                        this.searchVal = item.text;
                        this.resultVal = item.value;
                        this.isExpand = false;

                    }
                })
                // 若是结果集只有一个,则默认选中
                if (this.searchList.length === 1) {
                    this.searchVal = this.searchList[0].text;
                    this.resultVal = this.searchList[0].value;
                    this.isExpand = false;
                }
                this.$emit('selectValue', { text: this.searchVal, value: this.resultVal })
            },
            setActiveClass(index) {
                this.searchList.forEach((item, innerIndex) => {
                    if (index === innerIndex) {
                        this.$set(item, 'active', true);
                        this.currentIndex = index; // 这句话是用来修正index,,就是键盘上下键的索引,不然会跳位
                    } else {
                        this.$set(item, 'active', false)
                    }
                })
            }
        }
    }
</script>

<style scoped>
    .el-fade-in-linear-enter-active,
    .el-fade-in-linear-leave-active,
    .fade-in-linear-enter-active,
    .fade-in-linear-leave-active {
        transition: opacity .2s linear;
    }

    .el-fade-in-enter,
    .el-fade-in-leave-active,
    .el-fade-in-linear-enter,
    .el-fade-in-linear-leave,
    .el-fade-in-linear-leave-active,
    .fade-in-linear-enter,
    .fade-in-linear-leave,
    .fade-in-linear-leave-active {
        opacity: 0;
    }

    .typeahead {
        position: relative;
        background-color: #fff;
        a {
            color: #333;
            text-decoration: none;
            padding: 5px;
        }
        ul {
            list-style: none;
            padding-left: 0;
            margin: 0;
            overflow: visible;
            li {
                cursor: pointer;
                display: block;
                width: 100%;
                padding: 5px;
                &.active {
                    background-color: #20a0ff;
                    a {
                        color: #fff;
                    }
                }
            }
        }
        input {
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            background-color: #fff;
            background-image: none;
            border-radius: 4px;
            border: 1px solid #bfcbd9;
            box-sizing: border-box;
            color: #1f2d3d;
            font-size: inherit;
            height: 36px;
            line-height: 1;
            outline: 0;
            padding: 3px 10px;
            transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
            width: 100%;
            display: inline-block;
        }
        .typeahead-header,
        .typeahead-content {
            width: 100%;
        }
        .typeahead-content {
            position: absolute;
        }

        .noFound {
            text-align: center;
        }
    }
</style>