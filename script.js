var container = $('.container');
var damper = $('.damper');
var speed = 20;
var globalID;
var mouseX = 50,
  mouseY = 50;
var xp = 50,
  yp = 50;
var limit = 40;

container.mouseenter(function(e) {
  moveIt();
});

// Set up mouseX and mouseY to be center of element
damper.mousemove(function(e) {
  mouseX = 100 * (e.pageX - damper.offset().left) / damper.width();
  mouseY = 100 * (e.pageY - damper.offset().top) / damper.height();
});

container.mouseleave(function() {
  cancelAnimationFrame(globalID);
});

function moveIt() {
  xp += (mouseX - xp) / speed;
  yp += (mouseY - yp) / speed;
  //$('.pyramid-axis').css({"top": (100 - yp) + "%","left": (100 - xp) + "%",});
  $('.pyramid-gyro').css({
    "perspective-origin": (100 - xp) + "% " + (60 - yp) * 2.4 + "%"
  });
  $('.pyramid-axis').css({
    "marginLeft": (50 - xp) + "px",
    "marginTop": (50 - yp) + "px"
  });
  container.css("perspective-origin", (100 - xp) + "% " + (100 - yp) + "%");

  globalID = requestAnimationFrame(moveIt);
};
$('.content').hover(function(){
}, function(){
});
$(function() {
  $('a[href*=#]:not([href=#])').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('.content').animate({
          scrollTop: target.offset().top
        }, 600);
        return false;
      }
    }
  });
  $('nav li.home').click(function(){
    $('.pyramid-gyro, .shadow').delay(600).fadeIn();
  });
  $('nav li:not(.home)').click(function(){
    $('.pyramid-gyro, .shadow').fadeOut();
  });
  $('nav li').click(function(){
    $('article.active').fadeOut();
    var thisClass = $(this).attr('class');
    $('article#'+thisClass).addClass('active').delay(600).fadeIn();
  });
});