// protocol.js
////////////////////////////
// Javascript class protocol: custom protocol class extending OpenLayers.format.
//
//
//
//
//////////////////////////////

define([
	"dojo/_base/declare",
	"dojo/_base/lang"
], function(declare, lang ) {

	return declare( [OpenLayers.Protocol],

//		OpenLayers.Class(OpenLayers.Format, {
	{

		constructor: function(theObject) {
			this.srdl = theObject.srdl;
			
		},
//srjsonProtocol : OpenLayers.Class(OpenLayers.Protocol, {
		read : function(options) {
			this.retObject = {
					code : OpenLayers.Protocol.Response.SUCCESS,
					requestType: "read",
					last: true,
					features: []
			};
			console.log("srjsonProtocol CALLED ==== read called");

			dojo.when(this.srdl.store.query(  this.srdl.options.urlparams  ), lang.hitch( this, this.handleResponse ) );
			
			return this.retObject;
			
		},

		//BEGIN handleResponse
		handleResponse : function(theFeatArr) {
			var theFormat = this.format;
//			console.log("handleResponse WithinClass Called!");
//			this.retObject.code 
			
//			options.callback.call(options.scope, resp);
			if(this.srdl.layer != null) {
				console.log("addFeatures Called!");
				this.srdl.layer.destroyFeatures();
				this.srdl.layer.addFeatures( theFormat.read(theFeatArr) ); 
			}

			
		}
		//END handleResponse
				
		
	}
);
} );
	
	
	