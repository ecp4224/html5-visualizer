var radius = 300;
var bars = [];
var frequencyData;
var analyser;
var start = 0;
var songs = [0, 144, 250, 345, 444, 511, 603, 671, 808, 977];
var audio;

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
  audio = document.getElementById('music');
  audio.crossOrigin = "anonymous";
  var audioSrc = ctx.createMediaElementSource(audio);
  analyser = ctx.createAnalyser();
  
  audioSrc.connect(analyser);
  analyser.connect(ctx.destination);
  
  frequencyData = new Uint8Array(analyser.frequencyBinCount);
  
  gameWidth = $(window).width();
  gameHeight = $(window).height();
  
  createBars();
  
  var position = songs[Math.floor(Math.random() * songs.length)];
  audio.currentTime = position;
  audio.play();
  
  renderFrame();
  showAuthor();
};

function createBars() {
    var centerX = Math.floor(window.innerWidth/4);
    var centerY = Math.floor(window.innerHeight/4);
    radius = window.innerWidth / 8;
    
    for (var i = 0; i < 360 / 1.5; i++) {
        var e = $("<div class='bar no-interact'></div>");
        
        var degree = (i * 1.5) - 90;
        var rad = Math.radians(i * 1.5);
        
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
    
    for (var i = start; i < (360 / 1.5) + start; i++) {
        var value = frequencyData[i];
        var bar = bars[i - start];
        
        var rad = Math.radians((i - start) * 1.5);
        
        var x = (centerX + radius * Math.cos(rad));
        var y = (centerY + radius * Math.sin(rad));
        
        bar.css({'height': value, 'top': y, 'left': x});
    }
    
    $('#author').attr('href', 'https://www.youtube.com/watch?v=sJISyGCHq-8&t=' + (audio.currentTime | 0));
    
    requestAnimationFrame(renderFrame);
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
  }, 4500);
}