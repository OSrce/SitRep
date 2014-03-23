// srd/view/grid.js
////////////////////////////////
// grid VIEW CLASS
//
//
//
//
//
/////////////////////////////////
define( 'srd/view/grid', [
	"dojo/_base/declare",
	"dojo/on",
	"dojo/_base/lang",
	"dojo/dnd/Target",
	"dojo/aspect",
	"dgrid/OnDemandGrid",
	"dgrid/extensions/ColumnResizer",
	"dojo/store/Memory",
	"srd/view"
], function(declare, on, lang, Target, aspect, OnDemandGrid, ColumnResizer, Memory, view) {


//srd_view_map class definition using dojo.declare 
	return declare( 
	'grid',
	[view],
	{
		type: 'grid',
		// grid VARIABLES 
		grid: null,

		//CONSTUCTOR
		constructor : function( data, parent_srd_doc) {
			console.log("srd/view/grid constructor called !");
			this.start_lat = this.data.start_lat;
			
			this.contentPane = new dijit.layout.ContentPane(
					{  
						style: this.style,
						class: "grid",
		           		content: "<div style=height:100%; id=divGrid></div>",
						region: this.data.region
					} );				
				this.srd_doc.srd_container.addChild(this.contentPane);
				this.srd_doc.srd_container.resize();

/*				
				var columns = [
				   { label: "TheId", field: "id" },
				   { label: "Group Id", field: "groupId" },
			       { label: "Type", field:"data", formatter:function(data){ return data.cfs_type;}   }
			    ];

				this.store = new Memory();
				this.grid = new OnDemandGrid( { store: this.store, columns: columns} , "divGrid");
*/
				
				this.dndTarget = new Target( this.contentPane.domNode, { 
					checkAcceptance: this.dndCheckAcceptance
				} );			
				aspect.after(this.dndTarget, "onDrop", lang.hitch( this, "addLayerToView") );
			
		},
		// END CONSTRUCTOR
	
	//BEGIN addLayerToView
	addLayerToView : function(source, dndObject) {
		var source = dndObject[0];
		var nodes = dndObject[1];
//		var copy = dndObject[2];
		
//		console.log("addLayerToMap Called!");
//		console.dir(nodes);
//		console.log("source=");
//		console.dir(source);

		for( var i=0; i < nodes.length; i++){
		//	   item = this.getItem(nodes[i].id);
			   var nodeItem = source.getItem( nodes[i].id);
//			   console.log("Iterating throught nodes. Node:"+i);
			   //console.dir(item);
			   //my_data = item.data;
//				console.log("nodeItem.data.item.groupId="+nodeItem.data.item.groupId);
			   if(nodeItem.data.item.id) {

			   		var theLayer = this.srd_doc.layerStore.get( nodeItem.data.item.groupId);
			   		if( typeof theLayer != "undefined" ) {
			   		//	theLayer.options.visibility = true;
			   		//	theLayer.loadData();
//						console.log("addLayerToMap:"+theLayer.options.name);
					//	theLayer.addLayerToMap(this.map);
					//	if(theLayer.options.isBaseLayer) {
					//		this.map.setBaseLayer(theLayer.layer);
			   		//	}
			   			if(theLayer.options.lformat != "SRJSON") {
			   				console.log("Error: Trying to load non SRJSON layer into Grid. NO GOOD!");
			   				return;
			   			} else {
			   				console.log("Adding Layer Store to dgrid:");
			   				// IF GRID ALREADY EXISTS, DELETE IT BEFORE WE ADD NEW ONE.
			   				if(this.grid != null) {
			   					
			   					
			   				}
			   				this.layer = theLayer;
//			   				this.grid.set("store", theLayer.store, theLayer.options.urlparams);
			   				this.store = theLayer.store;
//			   				this.grid = new OnDemandGrid( { store: this.store, query: theLayer.options.urlparams, columns: this.getColumns() } , "divGrid");
			   				this.grid = new (declare([OnDemandGrid, ColumnResizer]))({ store: this.store, query: {}, columns: this.getColumns() } , "divGrid");
			   				on(this.grid,"dgrid-sort", function(grid, pT, s ) {
			   					console.log("dgrid-sort Called: parentType:"+pT+" sort:"+s);
			   			//		console.dir(parentType);
			   			//		console.dir(sort);
			   				} );
			   				this.layer.startRealtimeService();
			   			}
			   			
			   			
			   		}
				}
		}
		
		//this.dndSource.query(".count", this.node)[0].innerHTML = this.getAllNodes().length;

	
	},
	//END addLayerToView
	
	//BEGIN getColumns
	getColumns : function() {
		if(this.layer.options.columndef != null  ) {
//			console.log("Column Def =");
//			console.dir(this.layer.options.columndef);
			var theColumns = []
			for (var key in this.layer.options.columndef ) {
				var theLabel = key;
				if(this.layer.options.columnlabel != null && this.layer.options.columnlabel[key] != null) {
					theLabel = this.layer.options.columnlabel[key];
				}
				theColumns.push( { label: theLabel, field: key, columnFormatter: this.columnFormatter, get: function(item) { return this.columnFormatter(item, this.field); }   });
//				theColumns.push( { label: theLabel, field: key  });
			} 
			return theColumns;
		}
		
		
		return [
				   { label: "TheId", field: "id" },
				   { label: "Group Id", field: "groupId" },
			       { label: "Type", field:"data", formatter:function(data){ return data.cfs_type;}   }
			    ];
		
	},
	//END getColumns
	
	
	//BEGIN columFormatter
	columnFormatter: function(data, columnstr) {
//		console.log("columnFormatter Called! key="+columnstr);
//		console.dir(data);
		
		var keys = columnstr.split('.');
		var result = data;
		while (keys.length > 0) {
			var key = keys.shift();
			if (typeof result[key] !== 'undefined') {
				result = result[key];
			} else {
				return "";
			}
		}
		return result;
	}
	//END columnFormatter
	
	
	
	} );
	//END declare
} );
//END grid CLASS
			
			
			