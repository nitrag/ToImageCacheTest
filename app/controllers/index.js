var firstView;
function showNav(){
	if(OS_IOS){
		//Ti.UI.iPhone.appBadge = 1;
		//Ti.UI.iPhone.appBadge = 0;
	}
	
	var first = "cached";
	firstView = Alloy.createController(first);
	Alloy.Globals.isOpen = first;
	$.drawer.setCenterWindow(firstView.getView());
	$.drawer.open();		
	Alloy.Globals.Drawer = $.drawer;
	Alloy.Globals.lifecycleContainer = $.drawer.instance;
	Alloy.Globals.viewStack = [];
	Alloy.Globals.viewStack.push(firstView);
		 		
}

function toggle(e) {
    Alloy.Globals.Drawer.toggleLeftWindow();
}

var AndroidOpened = 0; 
function openView(e){
	Ti.API.info("menu item clicked...");
	var page = e.source.id;
	if(Alloy.Globals.isOpen != page){
		//lets open new view
		Ti.API.info("PAGE: " + page);
		Alloy.Globals.offlineView = null; //clear
		Alloy.Globals.isOpen = page; //set old
		var newPage = Alloy.createController(page);
		if(OS_ANDROID){
			AndroidOpened = 0; //reset count how many times drawer is toggled
			Alloy.Globals.viewStack = [];
			Alloy.Globals.viewStack.push(newPage);
		}
		var current = $.drawer.getCenterWindow();
		if(current.hasClose)
			current.close();
		$.drawer.setCenterWindow(newPage.getView());
		$.drawer.closeLeftWindow();
		
	}else{
		$.drawer.closeLeftWindow();
	}		
}

if(OS_ANDROID){
	$.drawer.addEventListener('open', onNavDrawerWinOpen);
	function androidBack(){
		if(!Alloy.Globals.Drawer.isLeftWindowOpen() && AndroidOpened == 0 && Alloy.Globals.viewStack.length < 2){
			AndroidOpened = 1;
			Ti.API.debug("Okay, let's just open the drawer");
			$.drawer.toggleLeftWindow();
		}else if(Alloy.Globals.Drawer.isLeftWindowOpen() && AndroidOpened == 1){
			Ti.API.info("Alrighty, time to close this guy");

			var activity = Titanium.Android.currentActivity;
			activity.finish();
			return;			
		}else{
			closeLastView();
		}
	}
	function closeLastView(){	
		Ti.API.info("Back button hit, Closing last view");
		
        //experimental null
        var currentWin = Alloy.Globals.viewStack[Alloy.Globals.viewStack.length - 1];
        if(currentWin && currentWin.hasClose){
            currentWin.close();
            currentWin = null;
        }	
		Alloy.Globals.viewStack.pop();		
		var last = Alloy.Globals.viewStack[Alloy.Globals.viewStack.length - 1];
		if(last){			
			AndroidOpened = 0;
			last.reloadActionBar();
			last.refresh();
			Alloy.Globals.Drawer.setCenterWindow(last.getView());
			Ti.API.debug("remaining stack length: "+ Alloy.Globals.viewStack.length);			
		}else{
			Ti.API.debug("Can't go back, let's just toggle");
			$.drawer.toggleLeftWindow();
		}
	}
	Alloy.Globals.androidClose = closeLastView;
	function onNavDrawerWinOpen(evt) {
	    this.removeEventListener('open', onNavDrawerWinOpen);
	
	    if(this.getActivity()) {
	        // need to explicitly use getXYZ methods
	        var activity = this.getActivity();
	        var actionBar = activity.getActionBar();
	        Alloy.Globals.activity = activity;
	        Alloy.Globals.menu = this.menu;
			Alloy.Globals.actionBar = actionBar;
	        if (actionBar) {
	            actionBar.setDisplayHomeAsUp(true);
				
	            // toggle the left window when the home icon is selected
	            actionBar.setOnHomeIconItemSelected(function() {
	            	Ti.API.info("isLeftOpen: " + $.drawer.isLeftWindowOpen());
	            	Ti.API.debug("ViewStack Count: " + Alloy.Globals.viewStack.length);
	            	//ViewStack should always be 1 or greater (1=main navigation)
	            
	            	if(Alloy.Globals.viewStack.length == 1){
	            		//always toggle drawer when viewstack == 1
	            		Ti.API.info('toggle drawer window');
	               		$.drawer.toggleLeftWindow();
	               		AndroidOpened = 0;
	               	}else if(Alloy.Globals.viewStack.length > 1 && $.drawer.isLeftWindowOpen()){
	            		//drawer is open, let's definitely close it first
	            		Ti.API.info('Close drawer window');
	               		$.drawer.closeLeftWindow();
	               		AndroidOpened = 0;
	            	}else if(Alloy.Globals.viewStack.length > 1 && !$.drawer.isLeftWindowOpen()){
	            		//drawer isn't open, so let's "Go Back" in views
	            		Ti.API.info('reopening last view');
	               		closeLastView();
	               		
	               	}else{
	               		Ti.API.debug('umm, what do we do?');
	               		Ti.API.info('Close drawer window');
	               		$.drawer.toggleLeftWindow();
	               		AndroidOpened = 0;
	               	}	               		
				});
				if(firstView)
					firstView.reloadActionBar();
	        }
	    }    
	}	
	$.drawer.addEventListener('androidback', androidBack);
	$.drawer.addEventListener('open', onNavDrawerWinOpen);
}

showNav();

var closeDrawer = function() {
	$.drawer.instance.close();
	$.drawer.instance = null;
	$.drawer = null;
	$.destroy();
};