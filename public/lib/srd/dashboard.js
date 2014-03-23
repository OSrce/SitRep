



define( [
//	"srd/dojo_bootloader",
	"dojo/_base/declare",
//	"srd/srd_rtc",
	"srd/srd_layer",
	"srd/view/layertree",
	"srd/srd_view",
	"srd/srd_gridContainer",
	"dojo/store/Memory",
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
//] , function( declare, srd_rtc, srd_layer, view_layertree, srd_view, srd_gridContainer, Memory  ) {
] , function( declare, srd_layer, view_layertree, srd_view, srd_gridContainer, Memory  ) {

/*dojo.provide("ComboBoxReadStore");
dojo.declare(
	"ComboBoxReadStore",
	dojox.data.QueryReadStore,
	{
		fetch:function(request) {
			request.serverQuery = {q:request.query.name};
			return this.inherited("fetch", arguments);
		}
	}
);
*/


//srd_document CLASS 
return declare( null, {

	constructor : function( loadsrd ) {
		console.log( "dashboard BASE CLASS Constructor Called!");	

	//THE UI VARS
	this.srd_container = null;
	this.srd_menuBar = null;
	this.srd_saveMenu = null;

//	this.srd_mapContent = null;
//	this.srd_adminContent = null;
//	this.srd_dataContent = null;

	this.srd_layerEditMenu = null;
	this.srd_layerEditMenuDropDown = null;
	
	this.fileSelDialog = null; 
	this.srd_uploader = null;
	this.oFSubmit = null;
	this.srd_fileList = null;
	this.openFileForm = null;

	//THE OpenLayers VARS
//	this.map = null;
	this.editTools = null;
	this.selectControl = null;
	this.drawControls = null;
	this.srd_panel = null;
	this.theSelectedControl = null;

	this.srd_toolbar = null;
	
	this.selected_wlayout= null;
	this.srd_wlayoutArr = [];
	this.srd_styleArr = [];
	this.srd_layerArr = [];
	this.srd_presetArr = [];
	this.srd_queryArr = [];

	this.srd_selLayer = null;
	this.srd_selControl = null;

	// LAYER EDIT CONTROLS
	this.srd_drawControls = {
		point: null,
		line: null,
		polygon: null,
		remove: null,
		select: null
	};


// SETTINGS WE SHOULD GET FROM localStore or srd_settings.xml
	this.srd_localStore = null;
	this.srd_xmlStore = null;
		
	this.srd_doc_id = null;
	this.staticVals = { 
			docCount: null,
			single_user: null,
			runFromServer: null,
//			default_projection: null,
//			start_lat: null,
//			start_lon: null,
//			start_zoom: null,

			view_layout_x: null,
			view_layout_y: null,
			view_data: null,
			
			default_wlayout:null,
			// autoRefresh -> should the whole system poll for changes to the tables?
			// right now only used for existing dynamic data (srjson) layers.
			autoRefresh : null,

			layerCount: null
	};
	// srd_themeArr == Array of objects about available css themes.

	this.srd_themeArr = [
		{ 'name': 'Dark on Light Theme', 'classType':'tundra' },
		{ 'name': 'Light on Dark Theme', 'classType':'SitRep_Dark' }
	];

	// srd_document should have a list of sub-objects - srd_view
	// maps, datagrids (spreadsheets), admin, empty, video, etc all should be 
	// sub-classes of srd_view. srd_view's described in staticVals.view_data.
	this.viewContainer = null; 
	this.viewArr = null; 
	this.selectedView = null; 

	/*
	this.viewType =  {
		empty 		: 'srd_view',
		map 			: 'srd_view_map',
		datagrid 	: 'srd_view_datagrid',
		admin			:	'srd_view_admin',
		opstrack	:	'srd_view_opstrack',
		cfssingle	:	'srd_view_cfssingle',
		video			:	'srd_view_video'
	};

	this.viewDefaults = {
		empty : {
			type : 'empty'
		},
		map 	: {
			type : 'map',
			start_lat : 40.713,
			start_lon : -73.996,
			start_zoom : 12
		}
	};
*/	
	
	//REAL TIME CODE RELATED :
	this.status = 'OFFLINE';

// BEGIN ASSOCIATE DATA FROM SERVER
	this.staticVals = loadsrd.staticVals;
	this.srd_queryArr = loadsrd.srd_queryArr;
	this.srd_wlayoutArr = loadsrd.srd_wlayoutArr;
	this.srd_presetArr = loadsrd.srd_presetArr;
	this.siteLeftImage= loadsrd.siteLeftImage;
	this.siteRightImage= loadsrd.siteRightImage;
	this.siteTitle = loadsrd.title;

	this.loadsrd = loadsrd;
	this.serverBaseUrl = "";
	if( loadsrd.serverBaseUrl) {
		this.serverBaseUrl = loadsrd.serverBaseUrl;
	}
// END ASSOCIATE DATA FROM SERVER


	console.log("Called srd_init! (from dashboard.js)");
	if(this.staticVals.runFromServer == null ) {
		console.log ("WTF remove this!");
		// LOCAL STORAGE LOADING
		// LOAD THE VALUES AND CHECK TO SEE THAT WE HAVE EVERYTHING
		// WE NEED.  OTHERWISE, LOAD DEFAULTS FROM XML FILE.
/*		this.srd_localStore = new dojox.storage.LocalStorageProvider({});
		if( this.srd_localStore.isAvailable() ) {
			this.srd_localStore.initialize();
			if(this.srd_localStore.initialized == false ) {
				console.log("Store is not initialed yet");
				dojo.event.connect(dojox.storage.manager,
	                    "loaded", this.srd_localStore,
	                    this.storeIsInitialized);
			} else {
				console.log("Store Is Inited");
				this.loadFromLocalStore();
			}

		}
*/
	} else if(this.staticVals.runFromServer == true) {
//		console.log("this.staticVals.start_lat == "+this.staticVals.start_lat); 
		this.staticVals.docCount = 1;
		console.log ("WTF remove this - part2!");
	}

	/// TESTING UGLY JUST TO MAKE SURE selLayer isn't NULL.	
	for(var key in this.srd_layerArr) {
		this.srd_selLayer = this.srd_layerArr[key];
	}

	// TESTING - TODO: CLEAN UP - STYLES AND LAYERS (Settings) SHOULD be stores!
/*
	var tmpStore = new dojo.store.Memory({data: theLayers, idProperty: "id"}); 
	tmpStore.query().forEach(function(layerOptions) {
		this.srd_layerArr[layerOptions.id] = new srd_layer();
		this.srd_layerArr[layerOptions.id].options = layerOptions;
		this.srd_layerArr[layerOptions.id].srd_styleArr = this.srd_styleArr;
	}.bind(this) );

	this.srd_layerStore = new dojo.store.Cache(
		dojo.store.JsonRest({
			target: "/srdata/layers/"
		} ),
		tmpStore
	);
*/

	var theLayers = this.loadsrd.theLayers;
	var theStyles = this.loadsrd.theStyles;
//	var theStyleSymbolizers = this.loadsrd.theStyleSymbolizers;
	var theStyleSymbolizers = {};
	for (theId in this.loadsrd.theStyleSymbolizers) {
		console.log("theId:"+theId+"  ID:"+this.loadsrd.theStyleSymbolizers[theId]["id"] );
		theStyleSymbolizers[this.loadsrd.theStyleSymbolizers[theId]["id"] ] = this.loadsrd.theStyleSymbolizers[theId];
	}
	
	var theStyleRules = this.loadsrd.theStyleRules;


	var theStyleMaps = {};
	for( var theId in theStyles) {
		var theStyle = theStyles[theId];
		if(theStyleMaps[theStyle.stylemapId] == null ) {
				theStyleMaps[theStyle.stylemapId] = {};
		}
		var theOptions = {};
		if(theStyle.renderType == 'default') {
			theOptions['isDefault'] = true;
		}
		for(var theRId in theStyleRules) {
//			console.log("Iterating through Rules, Iter:"+theRId+" theId="+theId);
			var tmpRule = theStyleRules[theRId];
			if( tmpRule["styleId"] == theStyles[theId]['stylemapId'] ) {
				var filterData = dojo.fromJson( tmpRule["filterData"] );
				var theFilter = null;
				if(filterData == null) {
					filterData = {};
				}
				switch(String(filterData.type)) {
					case "==" :						
						theFilter = new OpenLayers.Filter.Function( {
							property: filterData.property,
							value: filterData.value,
							evaluate: function(attributes) {								
							    var keys = this.property.split('.');
								var result = attributes;
								while (keys.length > 0) {
									var key = keys.shift();
									if (typeof result[key] !== 'undefined') {
										result = result[key];
									} else {
										return false;
									}
								}		
								return (result == this.value);
							}
						});
/*						theFilter = new OpenLayers.Filter.Comparison({
							type: OpenLayers.Filter.Comparison.EQUAL_TO,
							property: filterData.property,
							value: filterData.value
						} );
*/
					break;
					case "<" :
						// SHOULD USE OpenLayers.String.format??? HERE!?
//					    var keys = filterData.property.split('.');
						theFilter = new OpenLayers.Filter.Function( {
							property: filterData.property,
							value: filterData.value,
							evaluate: function(attributes) {
//								console.log("Performing Comparison <");
//								console.dir(attributes);
//								console.log("property==="+this.property);
							    var keys = this.property.split('.');
//								console.dir(keys);
								var result = attributes;
								while (keys.length > 0) {
									var key = keys.shift();
									if (typeof result[key] !== 'undefined') {
										result = result[key];
									} else {
										return false;
//										result = 'undefined';
//										break;
									}
								}		
//								console.log("RESULT ==== "+result+" ==="+this.value);
								return (result < this.value);
							}
						});						
/*						
						theFilter = new OpenLayers.Filter.Comparison({
							type: OpenLayers.Filter.Comparison.LESS_THAN,
							property: filterData.property,
							value: filterData.value
						} );
*/
					break;
					case ">" :
						theFilter = new OpenLayers.Filter.Function( {
							property: filterData.property,
							value: filterData.value,
							evaluate: function(attributes) {
							    var keys = this.property.split('.');
								var result = attributes;
								while (keys.length > 0) {
									var key = keys.shift();
									if (typeof result[key] !== 'undefined') {
										result = result[key];
									} else {
										return false;
//										result = 'undefined';
//										break;
									}
								}								
								return (result > this.value);
							}
						});

						/*
						theFilter = new OpenLayers.Filter.Comparison({
							type: OpenLayers.Filter.Comparison.GREATER_THAN,
							property: filterData.property,
							value: filterData.value
						} );
						*/
					break;
					case "><" :
						theFilter = new OpenLayers.Filter.Function( {
							property: filterData.property,
							lowerBoundary: filterData.lowerBoundary,
							upperBoundary: filterData.upperBoundary,
							evaluate: function(attributes) {
							    var keys = this.property.split('.');
								var result = attributes;
								while (keys.length > 0) {
									var key = keys.shift();
									if (typeof result[key] !== 'undefined') {
										result = result[key];
									} else {
										return false;
										//result = 'undefined';
//										break;
									}
								}								
								return (this.lowerBoundary < result && result < this.upperBoundary);
							}
						});
/*						
						theFilter = new OpenLayers.Filter.Comparison({
							type: OpenLayers.Filter.Comparison.BETWEEN,
							lowerBoundary: filterData.lowerBoundary,
							upperBoundary: filterData.upperBoundary,
							value: filterData.value
						} );
*/						
					break;
					default :
/*						theFilter = new OpenLayers.Filter.Comparison({
							type: OpenLayers.Filter.Comparison.EQUAL_TO,
							property: "srstyle",
							value: tmpRule["symbolizer_id"]
						} );
*/
					break;	
				}

				if( theOptions['rules'] == null) {
					theOptions['rules'] = [];
					theOptions['rules'].push(new OpenLayers.Rule({ elseFilter: true }) );
				}
				if( theFilter != null && theStyleSymbolizers[tmpRule["symbolizerId"]] != null ) {
					theOptions['rules'].push(new OpenLayers.Rule({ filter: theFilter, symbolizer: theStyleSymbolizers[tmpRule["symbolizerId"]], elseFilter: tmpRule["elseFilter"] }) );
				} else if( theFilter != null) {
					theOptions['rules'].push(new OpenLayers.Rule({ symbolizer: theStyleSymbolizers[tmpRule["symbolizerId"]], elseFilter: tmpRule["elseFilter"] }) );
				}	
			}
		}
		if(theStyle.stylemapId == 2013) {
			console.log("jonTest3 === theOptions***************");
			jonTest3 = theOptions;
		}
		
		theOptions.defaultsPerSymbolizer = false;	

		theStyleMaps[theStyle.stylemapId][theStyle.renderType] = new OpenLayers.Style( theStyleSymbolizers[theStyle.defaultsymbolizerId] , theOptions);

	}	
	for ( var theId in theStyleMaps) {
		this.srd_styleArr[theId] = new OpenLayers.StyleMap( theStyleMaps[theId] );
	}
	
	this.layerStore = new Memory({
	  });
	
	// POPULATING THE srd_layerArr from the data that came over the server
	for( var theId in theLayers) {
		var layerOptions = theLayers[theId];
		layerOptions.srd_doc = this;
		this.srd_layerArr[layerOptions.id] = new srd_layer(layerOptions);
		
//		this.srd_layerArr[layerOptions.id].options = layerOptions;
//		this.srd_layerArr[layerOptions.id].id = layerOptions.id;
		
		//		this.srd_layerArr[layerOptions.id].srd_styleArr = this.srd_styleArr;
		this.srd_layerArr[layerOptions.id].srd_styleMap = this.srd_styleArr[layerOptions.defaultstyle];
		this.layerStore.put(this.srd_layerArr[layerOptions.id] );
	}	


	
	
	
	
//	this.srd_container.startup();

// BELOW SHOULD NOT BE HARDCODED!!!!!	
this.wlayout1 = { id:1, name: "Map Only",
data: [ 
	{ id:1, type:'menubar', data:{ region: "top" } },
	{ id:2, type: 'layertree', data:{ theGroups: loadsrd.theGroups, region: "left", width:"30%" }   },
	// LA:
	//	{ id:3, type: 'map', data: {start_lat : 34.04753, start_lon : -118.3653, start_zoom : 12, start_base_layer: 1008, region: "center" }  }
	// NY
//	{ id:3, type: 'map', data: {start_lat : 40.706, start_lon : -73.899, start_zoom : 12, start_base_layer: 1008, region: "center" }  }
	// Seatle (SES Demo
//	{ id:3, type: 'map', data: {start_lat : 47.544, start_lon : -122.340, start_zoom : 12, start_base_layer: 16, region: "center" }  }
	// AEI Demo
	{ id:3, type: 'map', data: {start_lat : 37.9, start_lon : -122.06, start_zoom : 12, start_base_layer: 16, region: "center" }  }
]
};
this.wlayout2 = { id:2, name: "Grid Only", data: [ 
	{ id:1, type:'menubar', data:{ region: "top" } },
	{ id:2, type: 'layertree', data:{ theGroups: loadsrd.theGroups, region: "left", width:"30%" }   },
   	{ id:3, type: 'grid', data: {region: "center" }  }
  ]
};
this.wlayout3 = { id:3, name: "Map and Grid", data: [ 
	{ id:1, type:'menubar', data:{ region: "top" } },
	{ id:2, type: 'layertree', data:{ theGroups: loadsrd.theGroups, region: "left", width:"30%" }   },
//	{ id:3, type: 'map', data: {start_lat : 34.04753, start_lon : -118.3653, start_zoom : 12, start_base_layer: 12, region: "center" }  },
//	{ id:3, type: 'map', data: {start_lat : 47.544, start_lon :  -122.340, start_zoom : 12, start_base_layer: 12, region: "center" }  },
	{ id:3, type: 'map', data: {start_lat : 37.9, start_lon :  -122.06, start_zoom : 12, start_base_layer: 16, region: "center" }  },
	{ id:4, type: 'grid', data: {region: "right", width:"35%" }  }
]
};
this.wlayoutArr = [ this.wlayout1, this.wlayout2, this.wlayout3 ];
//CREATE STORE FROM wlayout data.
this.window_store = new Memory( { data: this.wlayoutArr } );
this.current_view_store = new Memory();
this.current_wlayout = null;

	

},
//END constructor

//BEGIN FUNCTION logout
//FUNCTION TO DO ANY CLEAN UP NEEDED 
//THEN REDIRECT TO /login/logout
logout : function() {	
					console.log("Logging Out User : "+this.staticVals.user_lastname);
					window.location.href = "/resources/j_spring_security_logout";	

}

} );

} );
	







