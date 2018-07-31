/*滑屏事件类 2017年10月22日  yli18*/
(function($){
	$.fn.slideable = function(options){
		var self = this;
		self.options = options;
		self.left = 0;
		self.down = 0;
		self.pressed = false;
		self.bindobj = options.bindobj || self;
		self.bindobj.bind("mousedown",function(event){onmousedown(self,event);})
		self.bindobj.bind("mousemove",function(event){onmousemove(self,event);})
		self.bindobj.bind("mouseup",function(event){onmouseup(self,event);})
		self.bindobj[0].addEventListener('touchstart',function(event){onmousedown(self,{screenX:event.changTouches[0].pageX});})
		self.bindobj[0].addEventListener('touchmove',function(event){onmousemove(self,{screenX:event.changTouches[0].pageX});})
		self.bindobj[0].addEventListener('touchend',function(event){onmouseup(self,{screenX:event.changTouches[0].pageX});})
		return this;
	}
	function onmousedown(self,event){
		self.down = event.screenX;
		self.options.onmousedown && self.options.onmousedown(self);
		self.left = self.options.getLeft && self.options.getLeft(self) || 0;
		self.pressed = true;
	}
	function onmousemove(self,event){
		self.pressed && self.options.setLeft && self.options.setLeft(self,self.left + event.screenX - self.down);
	}
	function onmouseup(self,event){
		self.pressed = false;
		self.left += event.screenX - self.down;
		self.options.onslide  && self.options.onslide(self,self.left);
	}
	//背景功能
	$.fixedBackground = function(z_index,b_show){
		var bk = $('#fixed-background-'+z_index+'');
		if(!b_show) return bk && bk.remove();
		if(!(bk && bk.length > 0)){
			bk = $('<div id="fixed-background-'+z_index+'" style="position:fixed;z-index:'+z_index+';left:0;top:0;right:0;bottom:0;background-color:rgba(0,0,0,0)">');
			$("body").append(bk);
		}
		return bk;
	}
})(jQuery);