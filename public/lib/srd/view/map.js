// srd/view/map.js
////////////////////////////////
// MAP VIEW CLASS
//
//
//
//
//
/////////////////////////////////
define( 'srd/view/map', [
	"dojo/_base/declare",
	"dojo/on",
	"dojo/_base/lang",
	"dojo/dnd/Target",
	"dojo/aspect",
	"srd/view"
], function(declare, on, lang, Target, aspect, view) {


//srd_view_map class definition using dojo.declare 
	return declare( 
	'map',
	[view],
	{
		type: 'map',
		// MAP VARIABLES 
		map : null,
		srd_layerArr : null,
		start_lat : null,
		start_lon : null,
		start_zoom : null,
		geolocateLayer : null,
		geolocateControl : null,
		geolocateFirstTime : true,	
		//CONSTUCTOR
		constructor : function( data, parent_srd_doc) {
			console.log("srd_view_map constructor called !");
			this.start_lat = this.data.start_lat;
			this.start_lon = this.data.start_lon;
			this.start_zoom = this.data.start_zoom;
//			this.map = this.srd_doc.map;
			this.srd_layerArr = this.srd_doc.srd_layerArr;
			this.contentPane = new dijit.layout.ContentPane(
				{  
					style: this.style,
					//style: "background-color:black;width:100%;height:100%;border:0px;margin:0px;padding:0px;",
					region: this.data.region
				} );
			
			this.contentPane.connect(this.contentPane,'onShow', function(data) { this.map_init(); }.bind(this)  );
			this.srd_doc.srd_container.addChild(this.contentPane);
			this.srd_doc.srd_container.resize();

			this.dndTarget = new Target( this.contentPane.domNode, { 
				checkAcceptance: this.dndCheckAcceptance
			} );			
			aspect.after(this.dndTarget, "onDrop", lang.hitch( this, "addLayerToView") );
			
			
			
		},
		//END CONSTRUCTOR
		
		//BEGIN map_init
		map_init : function() {
			console.log("###############CALLED MAP_INIT");
//			dojo.ready(function() {
			if( this.map == null) {
				console.log("CREATING MAP!!!!");
				this.mapDiv = dojo.create("div",{ id: 'srdmap', 'class':'map', style:'top:0;left:0;width:100%;height:100%;' }, this.contentPane.domNode);


				
				this.geolocateControl = new OpenLayers.Control.Geolocate( {
					bind: false,
					geolocationOptions: {
						enableHighAccuracy: false,
						maximumAge: 0,
						timeout: 7000
					}
				} );
				this.map = new OpenLayers.Map({ 
					controls: [
						new OpenLayers.Control.Navigation(),
						new OpenLayers.Control.Zoom(),
						new OpenLayers.Control.Attribution(),
						new OpenLayers.Control.KeyboardDefaults(),					
//		                new OpenLayers.Control.MousePosition(),
						this.geolocateControl
					],
					projection : new OpenLayers.Projection("EPSG:900913"),
//					displayProjection: new OpenLayers.Projection("EPSG:4326"),
//					units: "m",
					maxExtent : new OpenLayers.Bounds(-20037508.34,-20037508.34, 20037508.34, 20037508.34)
				} );
				this.map.render( this.mapDiv  ); 

				console.log("DONE CREATING MAP1!!!!");
			////////////////////////
			///// LAYER CREATION ////


/*			this.map.setOptions( 
				{ projection :  new OpenLayers.Projection("EPSG:900913") ,
					displayProjection : new OpenLayers.Projection("EPSG:4326") }
				);
*/


			// Iterate through each srd_layer and call loadData and addLayerToMap)

/*
				for(var i in this.srd_layerArr ) {
				console.log("Loading Layer:"+this.srd_layerArr[i].options.name+":::");
				this.srd_layerArr[i].loadData();
				console.log("addLayerToMap:"+this.srd_layerArr[i].options.name);
				this.srd_layerArr[i].addLayerToMap(this.map);
				console.log("Finished addLayerToMap:"+this.srd_layerArr[i].options.name);
			

				// BEGIN ADD layer to uploadMenu
			/*	this.srd_uploadMenu.addChild(new dijit.MenuItem( { 
						label: this.srd_layerArr[i].options.name,
						srd_doc: this,
						tmpId: i,
						onClick: function() { this.srd_doc.srd_layerArr[this.tmpId].uploadLayer() }
				} ) );
			*/
				// END ADD LAYER TO uploadMenu

//			}

				// IF start_base_layer is set to a valid baselayer we have, then we
				// should start with that base layer being the one shown.
			console.log("JR NEED TO FIX THIS ASAP");
			this.data.start_base_layer=1002;
//			console.dir(this);
				if(this.data.start_base_layer && this.srd_layerArr[this.data.start_base_layer]) {
					console.log("Loading Layer:"+this.srd_layerArr[this.data.start_base_layer].options.name+":::");
					this.srd_layerArr[this.data.start_base_layer].loadData();
					console.log("addLayerToMap:"+this.srd_layerArr[this.data.start_base_layer].options.name);
					this.srd_layerArr[this.data.start_base_layer].addLayerToMap(this.map);
					this.map.setBaseLayer(this.srd_layerArr[this.data.start_base_layer].layer);

				}

				
				
			var googleProjection = new OpenLayers.Projection("EPSG:900913");
			var mapProjection = new OpenLayers.Projection("EPSG:4326");
			var lonlat = new OpenLayers.LonLat(this.start_lon, this.start_lat).transform( mapProjection, googleProjection  );

			this.map.setCenter( lonlat, this.start_zoom ); 
			this.map.zoomTo( this.start_zoom ); 
	
			console.log("goToPoint Lat/Lon/Zoom :"+this.start_lat+" / "+this.start_lon+" / "+this.start_zoom);	
			this.goToPoint(this.start_lat, this.start_lon);

//			console.log("Should be displaying Map at this point!");






			// Adding the Control for the Layer select 
			this.map.addControl(new OpenLayers.Control.LayerSwitcher() );

			//BEGIN GEOLOCATION STUFF
			this.geolocateLayer = new OpenLayers.Layer.Vector('geolocateVector');
			this.map.addLayer(this.geolocateLayer);

			this.geolocateControl.events.register("locationupdated", this.geolocateControl, 
				function(e) {
					this.geolocateLayer.removeAllFeatures();
					var circle = new OpenLayers.Feature.Vector( 
						OpenLayers.Geometry.Polygon.createRegularPolygon(
							new OpenLayers.Geometry.Point(e.point.x, e.point.y),
							e.position.coords.accuracy/2,
							40,
							0
						),
						{},
						{ fillColor: '#000', fillOpacity: '0.1', strokeWidth: '0' }
					);
					console.log("Position Logged, Heading="+e.position.coords.heading);
					this.geolocateLayer.addFeatures([
						new OpenLayers.Feature.Vector(
							e.point,
							{},
							{
								graphicName: 'cross',
								strokeColor: '#00f',
								strokeWidth: 2,
								fillOpacity: 0,
								pointRadius: 10
							}
						),
						circle
					] );
					if(this.geolocateFirstTime) {
						this.map.zoomToExtent(this.geolocateLayer.getDataExtent() );
						this.pulsate(circle);
						this.geolocateFirstTime = false;
						this.bind = true;
					}			


				}.bind(this)
				// END function(e)
			);
			//END geolocateControl.events.register
			this.geolocateControl.events.register("locationfailed",this,function() {
				console.log( "Location detection failed!" );
			} );
// ATTEMPTING TO FIX MAP LOAD BUG...
//				dojo.ready(function() {
//				if(this.data.start_base_layer != null) {
//					this.map.removeLayer(this.srd_layerArr[this.data.start_base_layer].layer); 
//					this.map.addLayer(this.srd_layerArr[this.data.start_base_layer].layer); 
//						console.log("Redrawing Layer :"+this.srd_layerArr[i].options.name);
//				}
//				for(var i in this.srd_layerArr) {
//					if(this.srd_layerArr[i].options.isBaseLayer == true && this.srd_layerArr[i].options.visibility == true) {
//						this.srd_layerArr[i].layer.redraw();
//					} 
//				}
//				}.bind(this) );
				console.log("END map_init function");

				// CALL onLoad function to trigger the event.
//				this.onLoad();
//			}.bind(this) );
			}
			
		//	this.onLoadComplete();
		},
		// END map_init
		
		// BEGIN goToPoint
		goToPoint : function(lat, lon) {
			console.log ("Go To Point called: lat="+lat+", lon="+lon);
			var googleProjection = new OpenLayers.Projection("EPSG:900913");
			var mapProjection = new OpenLayers.Projection("EPSG:4326");
			var lonlat = new OpenLayers.LonLat(lon, lat).transform( mapProjection, googleProjection  );
			this.map.panTo(lonlat);
		},
		//END goToPoint
		toggleLocationTracking: function( turnOn ) {
			this.geolocateLayer.removeAllFeatures();
			this.geolocateControl.deactivate();
			if( turnOn ) {
				this.geolocateControl.watch = true;
				this.geolocateFirstTime = true;
				this.geolocateControl.activate();
			}
		},
		//END toggleLocationTrackking
		pulsate: function(feature) {
			var point = feature.geometry.getCentroid(),
					bounds= feature.geometry.getBounds(),
					radius= Math.abs( (bounds.right - bounds.left)/2),
					count = 0,
					grow  = 'up';
			
			var resize = function() {
				if(count>16) {
					clearInterval(window.resizeInterval);
				}
				var interval = radius * 0.03;
				var ratio = interval / radius;
				switch(count) {
					case 4:
					case 12:
						grow = 'down';
					break;
					case 8:
						grow = 'up';
					break;
				}
				if ( grow!== 'up') {
					ratio = - Math.abs(ratio);
				}
				feature.geometry.resize(1+ratio, point);
				this.geolocateLayer.drawFeature(feature);
				count++;
			}.bind(this);
			window.resizeInterval = window.setInterval(resize, 50, point, radius);	
		},
		//END pulsate
		//BEGIN DESTROY
		destroy : function() {
// TODO - TO FIX : CAREFUL ON DELETING MAPS or LAYERS AS it may
//   SEND DELETE TO REMOVE FEATURES FROM SERVER.
			console.log("srd_view_map destroy called!");
			if(this.map) {
				for(var i in this.srd_layerArr) {
					if(this.srd_layerArr[i].layer != null) {
						console.log("Layer :"+this.srd_layerArr[i].options.name+" exists!");
//						this.srd_layerArr[i].layer.remove();
//						this.srd_layerArr[i].map = null;
//						delete this.srd_layerArr[i].layer;
					}
				}
//				this.map.unloadDestroy();
				delete this.map;
				dojo.destroy(this.mapDiv);
			}
			return;
		},
		///END DESTORY
		
		//BEGIN addLayerToView
		addLayerToView : function(source, dndObject) {
			var source = dndObject[0];
			var nodes = dndObject[1];
	//		var copy = dndObject[2];
			
//			console.log("addLayerToMap Called!");
//			console.dir(nodes);
//			console.log("source=");
//			console.dir(source);

			for( var i=0; i < nodes.length; i++){
			//	   item = this.getItem(nodes[i].id);
				   var nodeItem = source.getItem( nodes[i].id);
//				   console.log("Iterating throught nodes. Node:"+i);
				   //console.dir(item);
				   //my_data = item.data;
//					console.log("nodeItem.data.item.groupId="+nodeItem.data.item.groupId);
				   if(nodeItem.data.item.id) {

				   		var theLayer = this.srd_doc.layerStore.get( nodeItem.data.item.groupId);
				   		if( typeof theLayer != "undefined" ) {
				   			theLayer.options.visibility = true;
				   			theLayer.loadData();
//							console.log("addLayerToMap:"+theLayer.options.name);
							theLayer.addLayerToMap(this.map);
							if(theLayer.options.isbaselayer) {
								this.map.setBaseLayer(theLayer.layer);
				   			}
				   			
				   		}
					}
			}
			
			//this.dndSource.query(".count", this.node)[0].innerHTML = this.getAllNodes().length;

		
		},
		//END addLayerToView
		
	
		
		
		
		
	} );
});



