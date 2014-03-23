// view.js
////////////////////////////////
// NEW BASE CLASS FOR views 
//
//
//
//
//
/////////////////////////////////

define([ 
	"dojo/_base/declare",
	"dojo/dnd/Target",
	"srd/include_view",
	"dojo/_base/lang",
	"dijit/layout/BorderContainer",
	"dijit/Menu",
	"dijit/PopupMenuItem",
	"dojox/grid/EnhancedGrid",
	"dojox/grid/enhanced/plugins/NestedSorting",
	"dojox/grid/enhanced/plugins/Pagination"
], function(declare , Target) {
		return declare( [], {
		// Pointer to parent srd_document class
		srd_doc : null,
		// type: this can be one of the following:
		// empty, map, datagrid, admin, view (more to come)
		type : 'empty',
		data : {},
		contentPane: null,
//		outsideContainer : null,
//		insideContainer : null,
		selected : null,
//		containerStyle : null,
		loaded : false,
		dataMenu : null,
//		id : null,
//		linkViewArr : null,
		//CONSTUCTOR
		constructor : function( data, parent_srd_doc) {
			console.log("srd_view constructor called!");
			this.srd_doc = parent_srd_doc;
			this.data = data;
			this.style = null;
			if( this.data != null ) {
				this.style = "";
				if(this.data.width != null) {
					this.style += "width:"+this.data.width+";";
				} else {
					this.style += "width:100%;";
				}
				if(this.data.height != null) {
					this.style += "height:"+this.data.height+";";
				} else {
					this.style += "height:100%;";
				}
			} else {
				this.style = "background-color:white;width:100%;height:100%;border:0px;margin:0px;padding:0px;";

//				this.style = "background-color:black;width:100%;height:100%;border:0px;margin:0px;padding:0px;";
			}
			
			if(this.type == 'empty' ) {
				this.contentPane = new dijit.layout.ContentPane({ } );
			}
/*			
			this.dndTarget = new Target( this.contentPane.domNode, { 
				checkAcceptance: this.dndCheckAcceptance
			} );			
			aspect.after(this.dndTarget, "onDrop", lang.hitch( this, "addLayerToView") );
*/
			
			

			
			
			
		},
		//END CONSTRUCTOR
		
		//BEGIN onLoadComplete
		onLoadComplete: function() {
			
			//ADD CONTEXT MENU
			this.contextMenu = new Menu({
//	            id: "taskMenu",
	            targetNodeIds: [ this.contentPane.domNode ],
	            selector: ".task"
	        });
			this.removeLayerMenu = new Menu({	
			});
			this.contextMenu.addChild( {
				label: "Remove Layer",
				popup: this.removeLayerMenu
			});
			this.contextMenu.startup();
			this.removeLayerMenu.startup();
			
		},
		//END onLoadComplete
		
		//BEGIN addLayerToView
		addLayerToView : function(source, dndObject) {
			var source = dndObject[0];
			var nodes = dndObject[1];
	//		var copy = dndObject[2];
			
//			console.log("addLayerToMap Called!");
//			console.dir(nodes);
//			console.log("source=");
//			console.dir(source);
/*
			for( var i=0; i < nodes.length; i++){
			//	   item = this.getItem(nodes[i].id);
				   var nodeItem = source.getItem( nodes[i].id);
//				   console.log("Iterating throught nodes. Node:"+i);
				   //console.dir(item);
				   //my_data = item.data;
				   
					console.log("nodeItem.data.item.groupId="+nodeItem.data.item.groupId);
				   if(nodeItem.data.item.id) {

				   		var theLayer = this.srd_doc.layerStore.get( nodeItem.data.item.groupId);
				   		if( typeof theLayer != "undefined" ) {
				   			theLayer.options.visibility = true;
				   			theLayer.loadData();
							console.log("addLayerToMap:"+theLayer.options.name);
							theLayer.addLayerToMap(this.map);
							if(theLayer.options.isBaseLayer) {
								this.map.setBaseLayer(theLayer.layer);
				   			}
				   			
				   		}
					}
			}
			
			//this.dndSource.query(".count", this.node)[0].innerHTML = this.getAllNodes().length;
*/
		
		},
		//END addLayerToMap
		
		
		//TO FIX
		//BEGIN dndCheckAcceptance
		dndCheckAcceptance: function( source, nodes) {
			console.log("dndCheckAcceptance Called!");
			source.forInSelectedItems( function(item){
				console.log("testing to drop item of type " + item.type[0] + " and data " + item.data );
			} );
			return true;
		},
		//END dndCheckAcceptance
		
		//BEGIN destroy
		destroy: function() {
			this.srd_doc.srd_container.removeChild(this.contentPane);
			this.contentPane.destroy();
			
		}
		// END destroy
		
	} );
	//END DECLARE
} );
//END VIEW CLASS




		