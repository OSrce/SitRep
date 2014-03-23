// format.js
////////////////////////////
// Javascript class format: custom format class extending OpenLayers.format.
//
//
//
//
//////////////////////////////

define([
	"dojo/_base/declare"
], function(declare ) {

	return declare( [OpenLayers.Format],

//		OpenLayers.Class(OpenLayers.Format, {
	{		
			read: function(obj) {
			    	console.log("srjsonFormat.read Called");
//			    	console.dir(obj);
/*
			        if(obj.stat === 'fail') {
			            throw new Error(
			                ['SRJSON failure response (',
			                 obj.code,
			                 '): ',
			                 obj.message].join(''));
			        }
*/
//			        if(!obj || !obj.photos || !OpenLayers.Util.isArray(obj.photos.photo)) {
			        if(!OpenLayers.Util.isArray(obj) ) { 
			        	throw new Error(
			                'Unexpected SRJSON response');
			        }
			        var format = new OpenLayers.Format.WKT( {
						externalProjection : new OpenLayers.Projection("EPSG:4326"),
						internalProjection : new OpenLayers.Projection("EPSG:900913")
					} );
			        
			        var feature, features = [];
			        var theFeat;
			        for(var i=0,l=obj.length; i<l; i++) {
			            theFeat = obj[i];
			            
						if(theFeat['class'] == 'com.osrce.sitrep.domain.EntityStatus') {
							if(theFeat.hasLocation == true ) {
								feature = format.read( theFeat.location.geometry );
//					            var geometry = new OpenLayers.Geometry.fromWKT(theFeat.location.geometry);			            								
								//var attributes = {};
								
								feature.attributes.data = theFeat.data;
								feature.attributes.entity = theFeat.entity.data;
								feature.attributes.name = theFeat.entity.name;
//								feature = new OpenLayers.Feature.Vector(geometry, attributes );
								feature.db_id = theFeat.entity.id;
								feature.fid = theFeat.id;
								//TESTING CODE - TO REMOVE.
								if(theFeat.data.heading != null ) {
									feature.attributes.data.heading = parseFloat(theFeat.data.heading);
								}

							}
						} else if(theFeat['class'] == 'com.osrce.sitrep.domain.Event') {
							if(theFeat.hasLocation == true) {
								feature = format.read( theFeat.location.geometry );

//								var geometry = new OpenLayers.Geometry.fromWKT(theFeat.location.geometry);			            								
//								var attributes = {};
								feature.attributes.data = theFeat.data;
//								feature = new OpenLayers.Feature.Vector(geometry, attributes );
								feature.db_id = theFeat.id;
								feature.fid = theFeat.id;

							}
//						} else if(this.options.url == '/srmaps') {
						} else {
							if(theFeat.geometry) {
								feature = format.read( theFeat.geometry );
//								var geometry = new OpenLayers.Geometry.fromWKT(theFeat.geometry);			            								
//								var attributes = {};
								feature.attributes.data = theFeat.data;
//								feature = new OpenLayers.Feature.Vector(geometry, attributes );
								feature.db_id = theFeat.id;
								feature.fid = theFeat.id;

							}
						}
						if(feature) {
							features.push(feature);
						}
					}
			        return features;
			    }
		}// )
		//END SR_FORMAT
		
		
	 );
} );
		
		