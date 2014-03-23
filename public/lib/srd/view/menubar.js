



define( [
//	"srd/dojo_bootloader",
	"dojo/_base/declare",
	"srd/srd_rtc",
	"srd/srd_layer",
	"srd/view/layertree",
	"srd/view",
	"srd/srd_gridContainer",
	"srd/srd_view_map",
	"srd/srd_view_cfssingle",
	"srd/srd_view_admin",
	"srd/srd_view_datagrid",
	"srd/srd_view_opstrack",
	"dojo",
	"dojox/data/QueryReadStore",
//	"dojox/storage/LocalStorageProvider",
	"dijit/layout/BorderContainer",
	"dijit/layout/ContentPane",
	"dijit/Menu",
	"dijit/MenuBar",
	"dijit/MenuBarItem",
	"dijit/PopupMenuBarItem",
	"dijit/form/ComboBox",
	"dojo/domReady!"
//] , function( doc_include,  declare, srd_rtc, srd_layer, srd_view, srd_gridContainer  ) {
] , function( declare, srd_rtc, srd_layer, view_layertree, view, srd_gridContainer  ) {

	return declare( 'menubar',[view], {
		type : 'menubar',
		
		//BEGIN CONSTRUCTOR
		constructor : function( data, parent_srd_doc ) {
			console.log("srd/view/menubar constructor called!");
			this.contentPane = new dijit.layout.ContentPane({
				region: this.data.region,
 //       	    id: "menubar11",
//        	    "class": "menubar",
           		content: "<div id=divMenuBar></div>",
            	splitter: false
			 } );
			this.srd_doc.srd_container.addChild(this.contentPane);
			this.srd_displayMenuBar();
			this.srd_doc.srd_container.resize();
			
			
		},		
		//END CONSTRUCTOR
		

//BEGIN srd_displayMenuBar
				srd_displayMenuBar : function() {
					console.log("Adding Menu Bar");
//					dojo.addOnLoad(function() {
						if( this.srd_menuBar == null) {
							this.srd_menuBar = new dijit.MenuBar( { 
								splitter: false,
								'region': 'top',
								style: "margin:0px;padding:0px;"
							}, "divMenuBar" );
							//// ICON in LEFT CORNER ////
							this.srd_menuBar.addChild(new dijit.MenuBarItem( {
								label: '<img src="'+'/lib/img/SitRepIcon_Small.png" height="20" width="20">' } ) );
							//// SitRep MENU /////	
//							var srd_sitrepMenu = new dijit.Menu({});
							this.srd_menuBar.addChild(new dijit.MenuBarItem({
								label: "SitRep" 
							} ) );

							//// File Menu ////
							var srd_fileMenu = new dijit.Menu({});
							this.srd_menuBar.addChild(new dijit.PopupMenuBarItem({
								label: "File",
								popup: srd_fileMenu
							}) );

/*							srd_fileMenu.addChild(new dijit.MenuItem({
								label: "New Whiteboard Layer",
								srd: this,
								onClick: function() { srd.srd_createWhiteboard();  }
							}));
*/
							
/*
 							srd_fileMenu.addChild(new dijit.MenuItem({
								label: "Open",
								srd: this,
								onClick: function() { srd.openFile(); }
							}));
							srd_fileMenu.addChild(new dijit.MenuItem({
								label: "Save Project",
								onClick: function() { alert("Future Function - Save Project"); }
							}));
*/							
/*							this.srd_saveMenu = new dijit.Menu( );
							for( tmpId in this.srd_layerArr) {
								if(this.srd_layerArr[tmpId].options.type == "Vector" && this.srd_layerArr[tmpId].feature_update == true) {
									this.srd_saveMenu.addChild(new dijit.MenuItem( { 
										label: this.srd_layerArr[tmpId].name,
										srd: this,
										onClick: function() { srd.saveLayer(tmpId); }
									} ) );
								}
							}	
*/
/*							srd_fileMenu.addChild(new dijit.PopupMenuItem({
								label: "Save Layer",
								popup:this.srd_saveMenu
							}));
*/
							//// Edit Menu ////
							var srd_editMenu = new dijit.Menu({});
							this.srd_menuBar.addChild(new dijit.PopupMenuBarItem({
								label: "Edit",
								popup: srd_editMenu
							}) );
/*
							srd_editMenu.addChild(new dijit.MenuItem({
								label: "TEST1",
								onClick: function() { alert("Place TEST Here"); }
							}));
*/							
							//// View Menu ////
							this.srd_viewMenu = new dijit.Menu({});
							this.srd_menuBar.addChild(new dijit.PopupMenuBarItem({
								label: "View",
								popup: this.srd_viewMenu
							}) );
							var theLabel = "Selected View : ";
							if(this.selectedView) {
								theLabel = theLabel+this.selectedView.data.type+" "+this.selectedView.data.xPos+","+this.selectedView.data.yPos;
							}
							this.srd_viewMenuSelected = new dijit.MenuItem({
								label: theLabel
							});
							this.srd_viewMenu.addChild(this.srd_viewMenuSelected);
							// VIEW TYPE MENU DROP DOWN
							this.srd_viewTypeMenu = new dijit.Menu();
							for(var theType in this.viewType) {
								this.srd_viewTypeMenu.addChild( new dijit.MenuItem( {
									label: theType,
									value: theType,
									srd_doc: this,
									onClick: function() { this.srd_doc.srd_changeViewType(this.value); }
								} ) );
							}
							this.srd_viewMenu.addChild(new dijit.PopupMenuItem({
								label: "Change Type: ",
								popup:this.srd_viewTypeMenu
							}));

							// ROW SIZE MENU DROP DOWN
							this.srd_windowRowMenu = new dijit.Menu();
/*							for(var y=1;y<5;y++) {
								this.srd_windowRowMenu.addChild( new dijit.MenuItem( {
									label: y,
									value: y,
									srd_doc: this,
									onClick: function() { this.srd_doc.srd_changeViewGridDimensions('y',this.value); }
								} ) );
							}
							this.srd_viewMenu.addChild(new dijit.PopupMenuItem({
								label: "View Rows: "+this.staticVals.view_layout_y,
								popup:this.srd_windowRowMenu	
							}));

							// COLUMN SIZE MENU DROP DOWN
							this.srd_windowColMenu = new dijit.Menu();
							for(var x=1;x<5;x++) {
								this.srd_windowColMenu.addChild( new dijit.MenuItem( {
									label: x,
									value: x,
									srd_doc: this,
									onClick: function() { this.srd_doc.srd_changeViewGridDimensions('x',this.value); }
								} ) );
							}
							this.srd_viewMenu.addChild(new dijit.PopupMenuItem({
								label: "View Columns: "+this.staticVals.view_layout_x,
								popup:this.srd_windowColMenu	
							}));
*/
							// CHANGE THEME MENU DROP DOWN
							this.srd_themeMenu = new dijit.Menu();
							for(var themeId in this.srd_themeArr) {
								this.srd_themeMenu.addChild( new dijit.MenuItem( {
									label: this.srd_themeArr[themeId].name,
									value: themeId,
									srd_doc: this,
									onClick: function() { this.srd_doc.srd_changeTheme(this.value); }
								} ) );
							}

							this.srd_viewMenu.addChild(new dijit.PopupMenuItem({
								label: "Change Theme : ",
								popup:this.srd_themeMenu	
							}));
							///// END View Menu ////	

							this.srd_dataMenuFiller = new dijit.Menu();
							//// Data Menu ////
							this.srd_dataMenuPopup = new dijit.PopupMenuBarItem({
								label: "Data",
								popup: this.srd_dataMenuFiller
//								popup: this.selectedView.dataMenu
							} );
							this.srd_menuBar.addChild(this.srd_dataMenuPopup);

							/// END Data Menu
							this.srd_dataMenu = this.srd_viewMenu;	


							//// Tools Menu ////
							var srd_toolsMenu = new dijit.Menu({});
							this.srd_menuBar.addChild(new dijit.PopupMenuBarItem({
								label: "Tools",
								popup: srd_toolsMenu
							}) );
							// Toggle for Edit Toolbar
/*							srd_toolsMenu.addChild(
								new dijit.CheckedMenuItem({
									label: "Edit Toolbar",
									srd_doc: this,
									onClick: function() { this.srd_doc.srd_toggleEditPanel(this); }
								}) 
							);
							// Toggle for Location Tracking
							srd_toolsMenu.addChild(
								new dijit.CheckedMenuItem({
									label: "Display Location",
									srd_doc: this,
									onClick: function() { this.srd_doc.srd_toggleLocationTracking(this); }
								}) 
							);
*/					
							//// Window Menu ////
							this.srd_windowMenu = new dijit.Menu({});
							this.srd_menuBar.addChild(new dijit.PopupMenuBarItem({
								label: "Window",
								popup: this.srd_windowMenu
							}) );
							this.srd_doc.window_store.query().forEach( function(wlayout){
								this.srd_windowMenu.addChild( new dijit.MenuItem( {
									label: wlayout.name,
									value: wlayout.id,
									srd_doc: this.srd_doc,
									onClick: function() { this.srd_doc.setWindowLayout(this.value); }
								} ) );
								}.bind(this) 
							);
							
							// LIST EACH WINDOW LAYOUT IN THE WINDOW MENU
/*							for( tmpId in this.srd_wlayoutArr) {
								this.srd_windowMenu.addChild( new dijit.MenuItem( {
									label: this.srd_wlayoutArr[tmpId].name,
									value: tmpId,
									srd_doc: this,
									onClick: function() { this.srd_doc.srd_changeWindowLayout(this.value); }
								} ) );
							}
*/
							this.srsearch_store = new dojox.data.QueryReadStore( {
								url: "/srsearch/index"
							} );

							// LIVE SEARCH IN MENUBAR
							this.srsearch_box = new dijit.form.ComboBox( {
								id: "srsearch",
								placeHolder: "Search for something",
								store: this.srsearch_store,
								searchAttr: "addy",
								srd_doc: this,
								autoComplete: false,
				//				selectOnClick: true,
								searchDelay: 1000,
								queryExpr: "${0}",
								onChange: function() {
				//						this.value = this.displayedValue;
										console.log("Search Text Clicked:"+this.store.getValue(this.item, "lat") );
										var lat = this.store.getValue(this.item, "lat");	
										var lon = this.store.getValue(this.item, "lon");	
										if(this.srd_doc.selectedView == null) {
											this.srd_doc.selectedView = this.viewArr[0][0];
										}
										this.srd_doc.selectedView.goToPoint(lat,lon);
								}
							} );
							this.srd_menuBar.addChild(this.srsearch_box);
							this.srsearch_box.startup();
							//END SEARCH BAR
							
							//BEGIN USERNAME / Logout Options
							this.srd_userMenu = new dijit.Menu({});
							this.srd_menuBar.addChild(new dijit.PopupMenuBarItem({
								id: "srdLogout",
								label: "Log Out", //this.staticVals.user_title+" "+this.staticVals.user_lastname,
								popup: this.srd_userMenu
							}) );
							this.srd_userMenu.addChild( new dijit.MenuItem( {
								label: "Log Out: ", //+this.staticVals.user_lastname,
								srd_doc: this.srd_doc,
								onClick: function() { this.srd_doc.logout(); }
							} ) );

							//END PLACING MENU ITEMS, LETS FIRE UP THE MENUBAR!				
							this.srd_menuBar.startup();

						}

//					}.bind(this) );
//					return;
}
// END srd_displayMenuBar

} );

} );






