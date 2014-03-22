// srd_view_map.js
////////////////////////////////
// MAP VIEW CLASS
//
//
//
//
//
/////////////////////////////////

define( 'srd/view/layertree', [
	"dojo/_base/declare",
	"dojo/on",
	"dojo/_base/lang",
	"dojo/aspect",
	"dojo/store/Memory",
	"dojo/store/Observable",
	"dijit/tree/ObjectStoreModel",
	"dijit/Tree",
	"dijit/tree/dndSource",
	"srd/view",
	"dojo/domReady!"
], function(declare, on, lang, aspect, Memory, Observable, ObjectStoreModel, Tree, dndSource, view) {
	return declare( 
	'layertree',
	[view],
	{
		type: 'layertree',

		//CONSTUCTOR
		constructor : function( data, parent_srd_doc) {
			console.log("view_layertree constructor called !");  
 			this.contentPane = new dijit.layout.ContentPane({
				region: this.data.region,
        	    id: "layertree1",
        	    "class": "layertree",
        	    style: this.style,
           		content: "SitRep Data : <div id=divLayerTree></div>",
            	splitter: true
			 } );
			  
			 this.srd_doc.srd_container.addChild(this.contentPane);

/*			this.container = new dijit.layout.BorderContainer( {
				region: "left",
        	    "class": "layertree",
            	splitter: true

			});
			this.srd_doc.srd_container.addChild(this.container);
*/			
			
  			  // set up the store to get the tree data
  			  this.groupStore = new Memory({
		        data: this.data.theGroups,
 		        getChildren: function(object){
         		   return this.query({parent: object.id});
     		    }
			  });
 
		      // set up the model, assigning governmentStore, and assigning method to identify leaf nodes of tree
 		   this.treeModel = new ObjectStoreModel({
    	    store: this.groupStore,
   		     query: {id: 0},
   		     srd_doc: this.srd_doc,
   		     mayHaveChildren: function(object){
            // Normally the object would have some attribute (like a type) that would tell us if
            // it might have children.   But since our data is local we'll just check if there
            // actually are children or not.
            //	return this.store.getChildren(object).length > 0;
 //  		    	 console.log("mayHaveChildren: object.groupId="+object.groupId+"===");
   		    	 if( typeof ( this.srd_doc.layerStore.get(object.groupId) ) == 'undefined'   ) {
   		    		 return true;
   		    	 } else {
   		    		 return false;
   		    	 }
       		 }
    	   });
 
 			// To support dynamic data changes, including DnD,
    // the store must support put(child, {parent: parent}).
    // But dojo/store/Memory doesn't, so we have to implement it.
    // Since our store is relational, that just amounts to setting child.parent
    // to the parent's id.
   	 aspect.around(this.groupStore, "put", function(originalPut){
        return function(obj, options){
            if(options && options.parent){
                obj.parent = options.parent.id;
            }
            return originalPut.call(this.groupStore, obj, options);
        };
    });
 
    // give store Observable interface so Tree can track updates
    this.groupStore = new Observable(this.groupStore);
 
 
    
    
		    // set up the tree, assigning governmentModel;
		    // note that all widget creation should be inside a dojo/ready().
//    this.layerTree = new Tree({ model: this.layerModel, dndController: dndSource }, "divLayerTree");
    this.layerTree = new Tree({ 
    	model: this.treeModel,
    	showRoot: false
//    	dndController: dndSource 
    }, "divLayerTree"
    );
    this.layerTree.startup();
    this.dndSource = new dndSource (this.layerTree, {copyOnly: true} );
	    

   	    this.srd_doc.srd_container.resize();


			
		}
	} );
} );






