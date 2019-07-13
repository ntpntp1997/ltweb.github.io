var soloKanbanniang = {
  clearTime: '',
  showMessage: function(text, timeout) {
    if (sessionStorage.getItem('soloKanbanniang') === 'close') {
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
    if (sessionStorage.soloKanbanniangX) {
      $('.solo-kanbanniang').css('left', sessionStorage.soloKanbanniangX + 'px')
    }
    if (sessionStorage.soloKanbanniangY) {
      $('.solo-kanbanniang').css('top', sessionStorage.soloKanbanniangY + 'px')
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
        sessionStorage.setItem('soloKanbanniangX', positionX);
        sessionStorage.setItem('soloKanbanniangY', positionY);
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
            soloKanbanniang.showMessage(
                tips.text.replace('{text}', $.trim($(this).text()).substr(0, 42)), 3000);
          });
        });
        $.each(result.click, function(index, tips) {
          $(document).on('click', tips.selector, function() {
            var text = tips.text[Math.floor(Math.random() * tips.text.length +
                1) - 1];
            soloKanbanniang.showMessage(text, 3000, true);
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
            soloKanbanniang.showMessage(
                tips.text.replace('{year}', now.getFullYear()), 6000, true);
          }
        });
      }
    });
  },
  _initMenu: function() {
    $('#soloKanbanniangHome').click(function() {
      window.location = Label.servePath;
    });

    $('#soloKanbanniangRSS').click(function() {
      window.location = Label.servePath + '/rss.xml';
    });

    $('#soloKanbanniangGithub').click(function() {
      window.location = 'https://github.com/b3log/solo';
    });

    $('#soloKanbanniangChat').click(function() {
      soloKanbanniang.showChat();
    });

    $('#soloKanbanniangChange').click(function() {
      loadlive2d('soloKanbanniang', Label.servePath +
          'live2d/model?t=' + (new Date()).getTime(),
          soloKanbanniang.showMessage('我的新衣服好看嘛', 3000, true));
    });

    $('#soloKanbanniangClose').click(function() {
      soloKanbanniang.showMessage('愿你有一天能与重要的人重逢', 1300, true);
      sessionStorage.setItem('soloKanbanniang', 'close');
      window.setTimeout(function() {
        $('.solo-kanbanniang').hide();
      }, 1300);
    });

    $('#soloKanbanniangPhoto').click(function() {
      soloKanbanniang.showMessage('照好了嘛，是不是很可爱呢？', 5000, true);
      window.Live2D.captureName = 'solo.png';
      window.Live2D.captureFrame = true;
    });
  }
};
