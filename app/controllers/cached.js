var args = arguments[0] || {};

if(OS_IOS)
	Alloy.Globals.nav = $.nav;
	
if(OS_ANDROID){
	exports.reloadActionBar = function(){
	    if (Alloy.Globals.actionBar) {
			Alloy.Globals.activity.onCreateOptionsMenu = function(e) {
	            var item, menu;
	            menu = e.menu;
	            menu.clear();
	           
	        };
	        Alloy.Globals.activity.invalidateOptionsMenu();
	    }
	};
	exports.reloadActionBar();
}
Alloy.Globals.win = $.win;
function toggle(e) {
    Alloy.Globals.Drawer.toggleLeftWindow();
}

require('To.ImageCache').config({
    debug: true, //default "false"
    expireTime: 259200, // time in seconds, default 43200 = 12 hours
    //folder: 'ImgCache', // folder to store the cache in, default "ToCache"
    remoteBackup: false // iOS Only do you want the images to be backed up to iCloud?
});


function resizeCacheKeepAspectRatio(url, maxWidth){
    Ti.API.info("Loaded preview, resizing...");
    
    //remove me
    return [url, 100, 100];
    
    
    var blob = require('To.ImageCache').remoteImage(url);
    Ti.API.info(JSON.stringify(blob));
    Ti.API.info(blob.width);
    var ratioX = maxWidth / blob.width;
    var ratioY = maxWidth / blob.height; //maxWidth for my needs
    var ratio = Math.min(ratioX, ratioY);

    var w = Math.round(blob.width * ratio);
    var h = Math.round(blob.height * ratio);

    Ti.API.info("w:"+ w + ", h:"+h);
    return [require('ti.imagefactory').imageAsResized(blob, {width: w, height: h, quality: 1}), w, h];
}

var pic = resizeCacheKeepAspectRatio("https://ralphseastresgallery.files.wordpress.com/2014/05/random1.jpg", 150);
$.img1.width = pic[1];
$.img1.height = pic[2];
$.img1.image = pic[0];


pic = resizeCacheKeepAspectRatio("http://cdn.sheknows.com/articles/2013/06/25-random-cat-behaviors-finally-explained-01.jpg", 150);
$.img2.width = pic[1];
$.img2.height = pic[2];
$.img2.image = pic[0];

pic = resizeCacheKeepAspectRatio("http://images2.fanpop.com/image/photos/11300000/The-cat-invasion-will-start-tomorrow-if-it-ever-comes-random-11353395-344-292.jpg", 150);
$.img3.width = pic[1];
$.img3.height = pic[2];
$.img3.image = pic[0];