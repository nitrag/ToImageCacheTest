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