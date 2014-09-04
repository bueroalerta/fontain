

var accTitlebarHeight = 24;
var of = 1;
var margintop = 15;


var fontSizeSlider;
var fontSizeSlider_CSS;
var fontSizeSlider_classToChange  = 'input.fontdemo';
var flowtextFontSizeSlider;
var flowtextFontSizeSlider_CSS;
var flowtextFontSizeSlider_classToChange  = 'div.flowtext';

var demoTextUnchanged = true;
var orgDemoText;

// ==============================================================================
$(document).ready(function() {
  
  $( "#sortable" ).sortable( {axis: "y", cursorAt: { top: 12 },  tolerance: "intersect", forcePlaceholderSize: true, distance: 5, zIndex: 9999, placeholder: "sortable-placeholder", cursor: "move"} );
  checkURL();
  bindLinks();

  initFontSizeSliders();
  initFlowVariants();
   

  
  
  $('#resetDemoText').click(function(e) {
    if(!demoTextUnchanged) {
      resetDemoText();
    }
  });

  
  $('.accordion-section-title').click(function(e) {
    var target;
    if($(e.target).hasClass("divlink")) {
      target = $(e.target).parent()[0];
    } else {
      target = e.target;
    }
    
    if($(target).is('.active')) {
      close_accordion_section(target);  
    }
    else {
      open_accordion_section(target);  
    }
    e.preventDefault();
  });
  
  
  
  //expand first fontdemo
  $('.accordion-section-title:first').trigger("click");
  
  
  
  $('input.fontdemo').on("input" , function(e) {
    if(demoTextUnchanged) {
      $('#resetDemoText').show();
      demoTextUnchanged = false;
    }
    $('input.fontdemo').not(this).val( $(this).val() );
    var url = substringPreDelimiter(document.URL, "#");
    window.history.pushState("string", "Title", url +"#" +removeChars($('input.fontdemo:first').val(), "#%"));
  });
});








// INIT ==============================================================================

function initFontSizeSliders() {

  fontSizeSlider = $('input.fontsize').get(0);
  fontSizeSlider_CSS = document.head.appendChild(document.createElement('style'));
  updateFontSize($('input.fontsize').attr("value"), true);
  $('input[type="range"]#fontsizeSlider').rangeslider(
    {
      polyfill: false,
      rangeClass: 'rangeslider',
      fillClass: 'rangeslider__fill',
      handleClass: 'rangeslider__handle',
      onSlide: function(position, value) {updateFontSize(value);}
  });  

  flowtextFontSizeSlider = $('input.flowtext-fontsize').get(0);
  flowtextFontSizeSlider_CSS = document.head.appendChild(document.createElement('style'));
  updateFlowtextFontSize($('input.flowtext-fontsize').attr("value"), true);  
  $('input[type="range"]#flowtextFontsizeSlider').rangeslider(
    {
      polyfill: false,
      rangeClass: 'rangeslider',
      fillClass: 'rangeslider__fill',
      handleClass: 'rangeslider__handle',
      onSlide: function(position, value) {updateFlowtextFontSize(value);}
  });  
}

function   initFlowVariants() {
  var tmp;
  $('.flowfontvariant').on("click", function(e) {
    
    if($(e.target).parent().attr('id') === 'flowFontSelectL') {
      if(e.target.id === 'next') {
	flowFontSelectL += 1;
      } else if(e.target.id === 'prev') {
	flowFontSelectL -= 1;
      } else {
	  return;
      }
      if(flowFontSelectL >= fontstyles.length) flowFontSelectL = 0;
      if(flowFontSelectL < 0) flowFontSelectL = fontstyles.length-1;
			   
      tmp = flowFontSelectL;
      
    } else if($(e.target).parent().attr('id') === 'flowFontSelectR') {
      if(e.target.id === 'next') {
	flowFontSelectR += 1;
      } else if(e.target.id === 'prev') {
	flowFontSelectR -= 1;
      } else {
	  return;
      }
      if(flowFontSelectR >= fontstyles.length) flowFontSelectR = 0;
      if(flowFontSelectR < 0) flowFontSelectR = fontstyles.length-1;
			   
      tmp = flowFontSelectR;
      
    } else {
	return;
    }
			   
    $(e.target).parent().css({
	"font-family": fontstyles[tmp][0],
	"font-style": fontstyles[tmp][1]
    });
    $(e.target).parent().children('#label').html(fontstyles[tmp][0] +" " +fontstyles[tmp][1]);
  });  
}


function checkURL() {
  orgDemoText = $('input.fontdemo:first').val();
  var url = substringPostDelimiter(document.URL, "#");
  if(url != null) {
    $('input.fontdemo').val( removeChars(urldecode(url), "#%") );
    $('#resetDemoText').show();
    demoTextUnchanged = false;
  }  
}


function bindLinks() {
  $('a.intern').on( "click", function(e) {
    if(!demoTextUnchanged) {
      var url = substringPreDelimiter($(this).attr('href'), "#");
      $(this).attr('href',  url.concat("#" +removeChars($('input.fontdemo:first').val(), "#%")) );  
    }
  });
}





// HANDLER ==============================================================================


function updateFontSize(size, force) {
  fontSizeSlider_CSS.innerHTML = fontSizeSlider_classToChange + '{font-size:' + size + 'px}';
  if (force) fontSizeSlider.value = size;
  sizeToHeight = +size +(size/6) + 24;
  $('.accordion-section-content.open').css("height", "" +sizeToHeight +"px");
  $('.accordion-section-content:not(.open) input.fontdemo').css("margin-top", "" +-(size/2) +"px"); 
  $('.accordion-section-content.open input.fontdemo').css("margin-top", "" +((15)) +"px"); 
  $('.sliderLabel#fontsizeSlider').html(size +" px");
}

function updateFlowtextFontSize(size, force) {
  flowtextFontSizeSlider_CSS.innerHTML = flowtextFontSizeSlider_classToChange + '{font-size:' + size + 'px}';
  if (force) flowtextFontSizeSlider.value = size;
  $('.sliderLabel#flowtextFontsizeSlider').html(size +" px");
}

function close_accordion_section(elem) {
  var currentAttrValue = $(elem).attr('href');
  hh = $('input.fontsize').val();
  t = (hh/6) + hh;

  $(elem).removeClass('active');
  $('.accordion '+ currentAttrValue).removeClass('open');
  $('.accordion '+ currentAttrValue)
    .animate({ "height": accTitlebarHeight +"px" }, "fast" );
  $('.accordion '+ currentAttrValue +' input')
    .animate({ "margin-top":  +-(hh/2)+"px" }, "fast" );
}


function open_accordion_section(elem) {    
  var currentAttrValue = $(elem).attr('href');
  hh = parseInt($('input.fontsize').val());
  t = (hh/6) + hh;
  
  $(elem).addClass('active');
  $('.accordion '+ currentAttrValue)
    .addClass('open')
    .animate({ "height": "+=" +t +"px" }, "fast" );
  $('.accordion '+ currentAttrValue +' input')
    .animate({ "margin-top":  +margintop+"px" }, "fast" );
}

function resetDemoText() {
  $('input.fontdemo').val(orgDemoText);
  demoTextUnchanged = true;
  var url = substringPreDelimiter(document.URL, "#");
  window.history.pushState("string", "Title", url);
  $('#resetDemoText').hide();
  
}




// UTIL ==============================================================================


function substringPreDelimiter(str, del) {
   var j = str.indexOf(del);
    if(j != -1) {
      str = str.substring(0, j);
    } 
    return str;
}

function substringPostDelimiter(str, del) {
    var i = str.indexOf(del);
    if(i != -1) {
      if(str.length > (i+1)) {
        str = str.substring(i+1, str.length);
      }
      return str; 
    }
    return null;
}

function removeChars(str, chars) {
  chars = chars.replace(/[\[\](){}?*+\^$\\.|\-]/g, "\\$&");
  return str.replace( new RegExp( "[" + chars + "]", "g"), '' ); 
}

function urldecode(str) {
    return decodeURIComponent((str+'').replace(/\+/g, '%20'));
}