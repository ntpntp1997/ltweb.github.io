var live2d = {
initMove: function () {
    if (sessionStorage.live2dX) {
      $('.solo-kanbanniang').css('left', sessionStorage.live2dX + 'px')
    }
    if (sessionStorage.live2dY) {
      $('.solo-kanbanniang').css('top', sessionStorage.live2dY + 'px')
    }
    $('.solo-kanbanniang').mousedown(function(event) {
      var _document = document;
      if (!event) {
        event = window.event;
      }
      var dialog = this;
      var x = event.clientX - parseInt(dialog.style.left || 0),
        y = event.clientY - parseInt(dialog.style.top ||  $(window).height() - $(dialog).height());
      _document.ondragstart = "return false;";
      _document.onselectstart = "return false;";
      _document.onselect = "document.selection.empty();";

      if (this.setCapture) {
        this.setCapture();
      } else if (window.captureEvents) {
        window.captureEvents(Event.MOUSEMOVE|Event.MOUSEUP);
      }

      _document.onmousemove = function(event) {
        if (!event) {
          event = window.event;
        }
        var positionX = event.clientX - x,
          positionY = event.clientY - y;
        if (positionX < 0) {
          positionX = 0;
        }
        if (positionX > $(window).width() - $(dialog).width()) {
          positionX = $(window).width() - $(dialog).width();
        }
        if (positionY < 0) {
          positionY = 0;
        }
        if (positionY > $(window).height() - $(dialog).height()) {
          positionY = $(window).height() - $(dialog).height();
        }
        dialog.style.left = positionX + "px";
        dialog.style.top = positionY + "px";
        sessionStorage.setItem('live2dX', positionX);
        sessionStorage.setItem('live2dY', positionY);
      };

      _document.onmouseup = function() {
        if (this.releaseCapture) {
          this.releaseCapture();
        } else if(window.captureEvents) {
          window.captureEvents(Event.MOUSEMOVE|Event.MOUSEUP);
        }
        _document.onmousemove = null;
        _document.onmouseup = null;
        _document.ondragstart = null;
        _document.onselectstart = null;
        _document.onselect = null;
      }
    });
  }
};
