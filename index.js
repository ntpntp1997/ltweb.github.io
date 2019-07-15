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
      url: 'https://ntpntp1997.github.io/ltweb.github.io/plugins/kanbanniang/assert/tips.json',
      dataType: 'json',
      success: function(result) {
        $.each(result.mouseover, function(index, tips) {
          $(document).on('mouseover', tips.selector, function() {
            soloKanbanniang.showMessage(
                tips.text.toString().replace('{text}', $.trim($(this).text()).substr(0, 42)), 3000);
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
                tips.text.toString().replace('{year}', now.getFullYear()), 6000, true);
          }
        });
      }
    });
  },
  _initMenu: function() {
    $('#soloKanbanniangHome').click(function() {
      window.location = 'https://ntpntp1997.github.io/ltweb.github.io';
    });

    $('#soloKanbanniangRSS').click(function() {
      window.location = Label.servePath + '/rss.xml';
    });

    $('#soloKanbanniangGithub').click(function() {
      window.location = 'https://ntpntp1997.github.io';
    });

    $('#soloKanbanniangChat').click(function() {
      soloKanbanniang.showChat();
    });

    $('#soloKanbanniangChange').click(function() {
      loadlive2d('soloKanbanniang', Label.servePath +
          'plugins/kanbanniang/assets/model?t=' + (new Date()).getTime(),
          soloKanbanniang.showMessage('Quần áo mới của tôi nhìn tốt.', 3000, true));
    });

    $('#soloKanbanniangClose').click(function() {
      soloKanbanniang.showMessage('Có thể bạn có một cuộc họp với những người quan trọng một ngày.', 1300, true);
      sessionStorage.setItem('soloKanbanniang', 'close');
      window.setTimeout(function() {
        $('.solo-kanbanniang').hide();
      }, 1300);
    });

    $('#soloKanbanniangPhoto').click(function() {
      soloKanbanniang.showMessage('Nó rất dễ thương phải không?', 5000, true);
      window.Live2D.captureName = 'solo.png';
      window.Live2D.captureFrame = true;
    });
  },
  _initFirstMsg: function() {
    var text;
    var referrer = document.createElement('a');
    if (document.referrer !== '') {
      referrer.href = document.referrer;
    }

    if (referrer.href !== '' && referrer.hostname !==
        'https://ntpntp1997.github.io/ltweb.github.io/'.split('//')[1].split(':')[0]) {
      var referrer = document.createElement('a');
      referrer.href = document.referrer;
      text = 'Hello! người bạn đến từ <span style="color:#4285f4;">' + referrer.hostname +
          '</span>';
      var domain = referrer.hostname.split('.')[1];
      if (domain == 'baidu') {
        text = 'Hello! Người bạn tìm được tôi tìm kiếm của Baidu <br>Bạn đang tìm kiếm gì <span style="color:#4285f4;">' +
            referrer.search.split('&wd=')[1].split('&')[0] + '</span>';
      } else if (domain == 'so') {
        text = 'Hello! Bạn bè từ 360 tìm kiếm - bạn đang tìm kiếm tôi ở <span style="color:#4285f4;">' +
            referrer.search.split('&q=')[1].split('&')[0] + '</span>？';
      } else if (domain == 'google') {
        text = 'Hello! Bạn bè từ Google Tìm kiếm <br> Chào mừng bạn đến đọc <span style="color:#4285f4;">『' +
            document.title.split(' - ')[0] + '』</span>';
      }
    } else {
      var now = (new Date()).getHours();
      if (now > 23 || now <= 5) {
        text = 'Bạn có phải là một con cú đêm? Tôi vẫn không ngủ quá muộn, đến ngày mai.';
      } else if (now > 5 && now <= 7) {
        text = 'Chào buổi sáng Một ngày là vào buổi sáng, và một ngày tốt lành sắp bắt đầu.';
      } else if (now > 7 && now <= 11) {
        text = 'Chào buổi sáng Làm việc tốt, đừng ngồi lâu, đi bộ và di chuyển xung quanh!';
      } else if (now > 11 && now <= 14) {
        text = 'Buổi trưa, tôi làm việc cho một buổi sáng, bây giờ là giờ ăn trưa!';
      } else if (now > 14 && now <= 17) {
        text = 'Nó rất dễ chán vào buổi chiều. Mục tiêu của môn thể thao ngày hôm nay đã hoàn thành chưa?';
      } else if (now > 17 && now <= 19) {
        text = 'Muộn quá rồi! Phong cảnh hoàng hôn ngoài cửa sổ rất đẹp, nhưng đẹp nhất là hoàng hôn đỏ ~';
      } else if (now > 19 && now <= 21) {
        text = 'Chào buổi tối, hôm nay bạn thế nào?';
      } else if (now > 21 && now <= 23) {
        text = 'Nó đã quá muộn, nghỉ ngơi sớm, chúc ngủ ngon ~';
      } else {
        text = 'Này ~ Hãy đến và trêu chọc tôi!';
      }
    }
    soloKanbanniang.showMessage(text, 6000);
  },
  init: function() {
    this._initTips();
    this._initMenu();
    this._initFirstMsg();
    this._initMove();
    window.setInterval(soloKanbanniang.showChat, 30000);

    $(document).on('copy', function() {
      soloKanbanniang.showMessage('Những gì bạn đã sao chép? In lại để nhớ để thêm nguồn.', 5000, true);
    });
  },
  showChat: function () {
    $.getJSON(
        'https://api.imjad.cn/hitokoto/?cat=&charset=utf-8&length=55&encode=json',
        function(result) {
          soloKanbanniang.showMessage(result.hitokoto, 5000);
        });
  }
};

if (navigator.userAgent.indexOf('MSIE') === -1 && $(window).width() > 720) {
    $(document).ready(function () {
        if (sessionStorage.getItem('soloKanbanniang') === 'close') {
            $('.solo-kanbanniang').remove();
            return;
        }

        $.ajax({
            url: 'https://cdn.jsdelivr.net/npm/kanbanniang@0.1.6/live2d.js',
            dataType: "script",
            cache: true,
            success: function () {
                soloKanbanniang.init();

                loadlive2d('soloKanbanniang',
                    'plugins/kanbanniang/assert/model/ShizukuTalk/shizuku-pajama/');
            }
        });
    });
} else {
    $(document).ready(function () {
        $('.solo-kanbanniang').remove()
    })
}