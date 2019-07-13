function renderTip(template, context) {
    var tokenReg = /(\\)?\{([^\{\}\\]+)(\\)?\}/g;
    return template.replace(tokenReg, function (word, slash1, token, slash2) {
        if (slash1 || slash2) {
            return word.replace('\\', '');
        }
        var variables = token.replace(/\s/g, '').split('.');
        var currentObject = context;
        var i, length, variable;
        for (i = 0, length = variables.length; i < length; ++i) {
            variable = variables[i];
            currentObject = currentObject[variable];
            if (currentObject === undefined || currentObject === null) return '';
        }
        return currentObject;
    });
}

String.prototype.renderTip = function (context) {
    return renderTip(this, context);
};

var re = /x/;
console.log(re);
re.toString = function() {
    showMessage('Haha, bạn đã mở giao diện điều khiển, bạn có muốn xem bí mật của tôi không？', 5000);
    return '';
};

$(document).on('copy', function (){
    showMessage('Bạn đã sao chép những gì? In lại để nhớ thêm nguồn~~', 5000);
});

function initTips(){
    $.ajax({
        cache: true,
        url: `${message_Path}message.json`,
        dataType: "json",
        success: function (result){
            $.each(result.mouseover, function (index, tips){
                $(tips.selector).mouseover(function (){
                    var text = tips.text;
                    if(Array.isArray(tips.text)) text = tips.text[Math.floor(Math.random() * tips.text.length + 1)-1];
                    text = text.renderTip({text: $(this).text()});
                    showMessage(text, 3000);
                });
            });
            $.each(result.click, function (index, tips){
                $(tips.selector).click(function (){
                    var text = tips.text;
                    if(Array.isArray(tips.text)) text = tips.text[Math.floor(Math.random() * tips.text.length + 1)-1];
                    text = text.renderTip({text: $(this).text()});
                    showMessage(text, 3000);
                });
            });
        }
    });
}
initTips();

(function (){
    var text;
    if(document.referrer !== ''){
        var referrer = document.createElement('a');
        referrer.href = document.referrer;
        text = 'Này! đây là từ<span style="color:#0099cc;">' + referrer.hostname + '</span>！';
        var domain = referrer.hostname.split('.')[1];
        if (domain == 'baidu') {
            text = 'Này! Bạn bè từ tìm kiếm của Baidu! <br> Chào mừng bạn đến thăm<span style="color:#0099cc;">「 ' + document.title.split(' - ')[0] + ' 」</span>';
        }else if (domain == 'so') {
            text = '嗨！ 来自 360搜索 的朋友！<br>欢迎访问<span style="color:#0099cc;">「 ' + document.title.split(' - ')[0] + ' 」</span>';
        }else if (domain == 'google') {
            text = 'Này! Bạn bè từ Google Tìm kiếm!<br>Chào mừng đến thăm<span style="color:#0099cc;">「 ' + document.title.split(' - ')[0] + ' 」</span>';
        }
    }else {
        if (window.location.href == `${home_Path}`) { //主页URL判断，需要斜杠结尾
            var now = (new Date()).getHours();
            if (now > 23 || now <= 5) {
                text = 'Bạn có phải là một con cú đêm? Tôi vẫn không ngủ quá muộn, đến ngày mai.？';
            } else if (now > 5 && now <= 7) {
                text = 'Chào buổi sáng Một ngày là vào buổi sáng, và một ngày tốt lành sắp bắt đầu！';
            } else if (now > 7 && now <= 11) {
                text = 'Chào buổi sáng Làm việc tốt, đừng ngồi lâu, đứng dậy và đi bộ xung quanh！';
            } else if (now > 11 && now <= 14) {
                text = 'Buổi trưa, tôi làm việc cho một buổi sáng, bây giờ là giờ ăn trưa！';
            } else if (now > 14 && now <= 17) {
                text = 'Nó rất dễ chán vào buổi chiều. Mục tiêu của môn thể thao ngày hôm nay đã hoàn thành chưa？';
            } else if (now > 17 && now <= 19) {
                text = 'Nó muộn quá! Phong cảnh hoàng hôn ngoài cửa sổ rất đẹp, đẹp nhất nhưng hoàng hôn đỏ~~';
            } else if (now > 19 && now <= 21) {
                text = 'Chào buổi tối, hôm nay bạn thế nào？';
            } else if (now > 21 && now <= 23) {
                text = 'Nó đã quá muộn, nghỉ ngơi sớm, chúc ngủ ngon~~';
            } else {
                text = 'Này ~ Hãy đến và trêu chọc tôi！';
            }
        }else {
            text = 'Chào mừng bạn đến đọc<span style="color:#0099cc;">「 ' + document.title.split(' - ')[0] + ' 」</span>';
        }
    }
    showMessage(text, 12000);
})();

window.setInterval(showHitokoto,30000);

function showHitokoto(){
    $.getJSON('https://v1.hitokoto.cn/',function(result){
        showMessage(result.hitokoto, 5000);
    });
}

function showMessage(text, timeout){
    if(Array.isArray(text)) text = text[Math.floor(Math.random() * text.length + 1)-1];
    //console.log('showMessage', text);
    $('.message').stop();
    $('.message').html(text).fadeTo(200, 1);
    if (timeout === null) timeout = 5000;
    hideMessage(timeout);
}

function hideMessage(timeout){
    $('.message').stop().css('opacity',1);
    if (timeout === null) timeout = 5000;
    $('.message').delay(timeout).fadeTo(200, 0);
}

function initLive2d (){
    $('.hide-button').fadeOut(0).on('click', () => {
        $('#landlord').css('display', 'none')
    })
    $('#landlord').hover(() => {
        $('.hide-button').fadeIn(600)
    }, () => {
        $('.hide-button').fadeOut(600)
    })
}
initLive2d ();
