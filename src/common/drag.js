import $ from 'jquery'
//ajax
import Axios from 'axios'

//图片的拖拽
function Drag () {
  // 可拖拽的DOM
  this.eleDrags = $('.signImg')
  // 存放拖拽元素的DOM
  this.eleDustbin = $('.swiper-slide-active')
  // 当前正在拖拽的元素
  this.eleDrag = {
    html: '',
    width: 0,
    height: 0
  }
  // 鼠标相对于当前拖拽元素的坐标
  this.currentDragPos = {
    x: 0,
    y: 0
  }
}
Drag.prototype = {
  constructor: Drag,
  reset: function () {
    this.eleDustbin = $('.swiper-slide-active')
  },
  init: function () {
    $.event.props.push('dataTransfer')
    this.eleDustbin = $('.swiper-slide-active')
    this.DOMEvent()
  },
  DOMEvent: function () {
  	//解决拖拽产生多个签章的问题
  	$(document).off()
    var self = this
    $(document).on('selectstart', self.eleDrags, function () {
      return false
    })
    //拖拽开始
    $(document).on('dragstart', self.eleDrags, function (ev) {
      ev.dataTransfer.effectAllowed = 'move'
      ev.dataTransfer.setData('text', ev.target)
      ev.dataTransfer.setDragImage(ev.target, ev.offsetX, ev.offsetY)
      self.eleDrag = {
        html: ev.target.outerHTML,
        width: $(ev.target).width(),
        height: $(ev.target).height()
      }
//    console.log(self.eleDrag)
      self.currentDragPos = {
        x: ev.offsetX,
        y: ev.offsetY
      }
    })
    //拖拽结束
    $(document).on('dragover', self.eleDrags, function (ev) {
      ev.preventDefault()
      return true
    })
    //到达目标元素上同时鼠标放开
    $(document).on('drop', self.eleDustbin, function (ev) {
      self.reset()
      // 鼠标相对于存放区域的坐标
      var dustbinOffset = {
        x: ev.pageX - $(self.eleDustbin).offset().left,
        y: ev.pageY - $(self.eleDustbin).offset().top
      }
      // 拖拽元素的最终坐标: 鼠标相对于存放区域的坐标-拖拽元素时相对于元素的坐标
      var DOMPosition = {
        x: dustbinOffset.x - self.currentDragPos.x,
        y: dustbinOffset.y - self.currentDragPos.y
      }
      //复制图片
      var resultDOM = '<div class="cloneSignImg"><i></i>' + self.eleDrag.html + '</div>'
      //设置图片放置位置
      var DOM = $(resultDOM).css({
        left: DOMPosition.x,
        top: DOMPosition.y
      }).attr('data-posx', DOMPosition.x).attr('data-posy', DOMPosition.y)
      // 判断是否越界
      if (DOMPosition.x < 0 ||
        dustbinOffset.x + self.eleDrag.width - self.currentDragPos.x > $(self.eleDustbin).width() ||
        DOMPosition.y < 0 ||
        dustbinOffset.y + self.eleDrag.height - self.currentDragPos.y > $(self.eleDustbin).height()) {
        alert('签章所盖区域超出合同范围!')
        DOM.remove()
      } else {
//    	console.log(DOM)
        $(self.eleDustbin).append(DOM)
      }
    })
    //禁止图片在目标元素上拖动
    $(self.eleDustbin).on('selectstart', function () {
      return false
    })
    //禁止图片在目标元素上拖动
    $(self.eleDustbin).on('dragstart', function () {
      return false
    })
    //点击将图片从合同上删除
	  $(document).on('click', '.cloneSignImg i', function () {
	    $(this).parent().remove()
	  })
  }
}

export default Drag
