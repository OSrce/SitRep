// srd/data.js
////////////////////////////////
// srd data class
//
//
//
//
//
/////////////////////////////////
define([
	"dojo/_base/declare",
	'dojo/store/Observable',
	'dojox/timing',
	"dojo/store/JsonRest",
	"dojo/store/Cache",
	"dojo/data/ObjectStore"
],
function (declare, Observable) {

	var Data = declare("data", [], {

		store : null,
		url: null,
		liveMonitor: false,
		query: null,
		
		// BEGIN CONSTRUCTOR
		constructor : function(theUrl) {
			this.url = theUrl;
			
			this.store = new dojo.store.Cache(
				dojo.store.JsonRest( {
					idProperty: "id",
					target: this.url
				} ),
				dojo.store.Memory()
			);
			

		},
		// END CONSTRUCTOR 
		
		getStore : function() {
			return store;
		}
		
		
		

		
	});
	//END declare() of data Object.

	return Data;	
});
// END define ()
