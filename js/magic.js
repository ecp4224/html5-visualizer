var radius = 300;
var bars = [];
var frequencyData;
var analyser;
var start = 0;
var intensity = 0.5;

// Converts from degrees to radians.
Math.radians = function(degrees) {
  return degrees * Math.PI / 180;
};
 
// Converts from radians to degrees.
Math.degrees = function(radians) {
  return radians * 180 / Math.PI;
};

window.onload = function() {
  if (typeof AudioContext === "undefined") {
    $('h1').text(":(");
    $('p').text("This browser is not supported...");
    $('#author').hide();
    return;
  }
  var ctx = new AudioContext();
  var audio = document.getElementById('music');
  audio.crossOrigin = "anonymous";
  var audioSrc = ctx.createMediaElementSource(audio);
  analyser = ctx.createAnalyser();
  
  audioSrc.connect(analyser);
  analyser.connect(ctx.destination);
  
  frequencyData = new Uint8Array(analyser.frequencyBinCount);
  
  intensity = 360 / (analyser.frequencyBinCount / 2);
  
  gameWidth = $(window).width();
  gameHeight = $(window).height();
  
  showName();
  createBars();
  audio.play();
  
  renderFrame();
  showAuthor();
};

function createBars() {
    var centerX = Math.floor(window.innerWidth/4);
    var centerY = Math.floor(window.innerHeight/4);
    radius = window.innerWidth / 8;
    
    for (var i = 0; i < 360 / intensity; i++) {
        var e = $("<div class='bar no-interact'></div>");
        
        var degree = (i * intensity) - 90;
        var rad = Math.radians(i * intensity);
        
        var x = (centerX + radius * Math.cos(rad));
        var y = (centerY + radius * Math.sin(rad));
        
        e.css({top: y, left: x, position: 'absolute'});
        e.css({'transform': 'rotate(' + degree + 'deg)', '-webkit-transform': 'rotate(' + degree + 'deg)'});
        
        e.appendTo('.bars');
        
        bars.push(e);
    }
}

function renderFrame() {
    analyser.getByteFrequencyData(frequencyData);
    
    var centerX = Math.floor(window.innerWidth/4);
    var centerY = Math.floor(window.innerHeight/4);
    
    radius = window.innerWidth / 8;
    
    for (var i = start; i < (360 / intensity) + start; i++) {
        var value = frequencyData[i];
        var bar = bars[i - start];
        
        var rad = Math.radians((i - start) * intensity);
        
        var x = (centerX + radius * Math.cos(rad));
        var y = (centerY + radius * Math.sin(rad));
        
        bar.css({'height': value, 'top': y, 'left': x});
    }
    
    updateTime();
    
    requestAnimationFrame(renderFrame);
}

function updateTime() {
    var time = $('#time');
    
    var now = new Date();
    
    var hours = now.getHours();
    if (hours < 10) {
        hours = '0' + hours;
    }
    
    var minutes = now.getMinutes();
    if (minutes < 10) {
        minutes = '0' + minutes;
    }
    
    time.text(hours + ':' + minutes);
}

function showAuthor() {
  var tooltip = new HTML5TooltipUIComponent;
  var target = document.getElementById("author");
  
  tooltip.set({
    color: "bamboo",
    contentText: "Mix by Nujabes and fellows",
    stickTo: "right",
    target: target
  });
  
  tooltip.mount();
  tooltip.show();
  
  target.addEventListener('mouseenter',function(){
    tooltip.show();
  });

  target.addEventListener('mouseleave',function(){
    tooltip.hide();
  });
  
  setTimeout(function() {
    tooltip.hide();
    showGithub();
  }, 4500);
}

function showGithub() {
  var tooltip = new HTML5TooltipUIComponent;
  var target = document.getElementById("github");
  
  tooltip.set({
    color: "bamboo",
    contentText: "Check out my other projects",
    stickTo: "left",
    target: target
  });
  
  tooltip.mount();
  tooltip.show();
  
  target.addEventListener('mouseenter',function(){
    tooltip.show();
  });

  target.addEventListener('mouseleave',function(){
    tooltip.hide();
  });
  
  setTimeout(function() {
    tooltip.hide();
    hideName();
    bindHover();
  }, 4500);
}

function bindHover() {
  $('.bars').on('mouseenter', function() {
    showName();
  });
  
  $('.bars').on('mouseleave', function() {
    hideName();
  });
}

function hideName() {
  var name = $('#name');
  var time = $('#time');
  name.addClass('down');
  time.addClass('center');
  name.removeClass('center');
  time.removeClass('up');
}

function showName() {
  var time = $('#time');
  var name = $('#name');
  name.removeClass('up'); //Just in case?
  time.addClass('up');
  name.addClass('center');
  time.removeClass('center');
  name.removeClass('down');
}