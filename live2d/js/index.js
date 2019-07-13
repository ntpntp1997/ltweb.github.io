var live2d = {
  clearTime: '',
  showMessage: function(text, timeout) {
    if (sessionStorage.getItem('live2d') === 'close') {
      return;
    }
    if (Array.isArray(text)) {
      text = text[Math.floor(Math.random() * text.length + 1) - 1];
    }
    $('.solo-kanbanniang__tip').html(text).fadeTo(200, 1);
    clearTimeout(this.clearTime);
    this.clearTime = setTimeout(function() {
      $('.solo-kanbanniang__tip').fadeTo(200, 0);
    }, timeout);
  },
  _initMove: function () {
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
  },
  _initTips: function() {
    $.ajax({
      cache: true,
      url: 'https://cdn.jsdelivr.net/npm/kanbanniang/tips.json',
      dataType: 'json',
      success: function(result) {
        $.each(result.mouseover, function(index, tips) {
          $(document).on('mouseover', tips.selector, function() {
            live2d.showMessage(
                tips.text.replace('{text}', $.trim($(this).text()).substr(0, 42)), 3000);
          });
        });
        $.each(result.click, function(index, tips) {
          $(document).on('click', tips.selector, function() {
            var text = tips.text[Math.floor(Math.random() * tips.text.length +
                1) - 1];
            live2d.showMessage(text, 3000, true);
          });
        });
        $.each(result.seasons, function(index, tips) {
          var now = new Date();
          var after = tips.date.split('-')[0];
          var before = tips.date.split('-')[1] || after;

          if ((after.split('/')[0] <= now.getMonth() + 1 &&
              now.getMonth() + 1 <= before.split('/')[0]) &&
              (after.split('/')[1] <= now.getDate() &&
                  now.getDate() <= before.split('/')[1])) {
            live2d.showMessage(
                tips.text.replace('{year}', now.getFullYear()), 6000, true);
          }
        });
      }
    });
  },
  _initMenu: function() {
    $('#live2dHome').click(function() {
      window.location = Label.servePath;
    });

    $('#live2dRSS').click(function() {
      window.location = Label.servePath + '/rss.xml';
    });

    $('#live2dGithub').click(function() {
      window.location = 'https://github.com/b3log/solo';
    });

    $('#live2dChat').click(function() {
      live2d.showChat();
    });

    $('#live2dChange').click(function() {
      loadlive2d('live2d', Label.servePath +
          'live2d/model?t=' + (new Date()).getTime(),
          live2d.showMessage('我的新衣服好看嘛', 3000, true));
    });

    $('#live2dClose').click(function() {
      live2d.showMessage('愿你有一天能与重要的人重逢', 1300, true);
      sessionStorage.setItem('live2d', 'close');
      window.setTimeout(function() {
        $('.solo-kanbanniang').hide();
      }, 1300);
    });

    $('#live2dPhoto').click(function() {
      live2d.showMessage('照好了嘛，是不是很可爱呢？', 5000, true);
      window.Live2D.captureName = 'solo.png';
      window.Live2D.captureFrame = true;
    });
  }
};
