// cluster.js
////////////////////////////
// Javascript class cluster: custom format class extending OpenLayers.format.
//
//
//
//
//////////////////////////////

define([
	"dojo/_base/declare"
], function(declare ) {

	return declare( [OpenLayers.Strategy.Cluster],

//		OpenLayers.Class(OpenLayers.Format, {
	{



//BEGIN SRCLUSTER 
//srcluster : OpenLayers.Class(OpenLayers.Strategy.Cluster, {
	countOnAttribute: null,
	addToCluster: function(cluster, feature) {
        cluster.cluster.push(feature);
        if(this.countOnAttribute != null) {
        	var keys = this.countOnAttribute.split('.');
			var clusterAtt = cluster.attributes;
			var featureAtt = feature.attributes;
			while (keys.length > 0) {
				var key = keys.shift();
				if (typeof featureAtt[key] !== 'undefined' ) {
					if(keys.length > 0) {
						featureAtt = featureAtt[key];
						clusterAtt = clusterAtt[key];
					} else { 
						clusterAtt[key] += parseFloat( featureAtt[key]) ;
					}
				} else {
					break;
				}
			}
        }
        cluster.attributes.count += 1;
    },
    createCluster: function(feature) {
        var center = feature.geometry.getBounds().getCenterLonLat();

        var clusterAtt = { count:1 };
        var clusterAttributes = clusterAtt;
        if(this.countOnAttribute != null) {
        	var keys = this.countOnAttribute.split('.');
			var featureAtt = feature.attributes;
			while (keys.length > 0) {
				var key = keys.shift();
//				console.log("KEY==="+key);
				if (typeof featureAtt[key] !== 'undefined') {
					featureAtt = featureAtt[key];
					if(typeof featureAtt == "object") {
						clusterAtt[key] = {};
					} else {
						clusterAtt[key] = parseFloat( featureAtt );
					}
					clusterAtt = clusterAtt[key];
				} else {
					break;
				}
			}
        }  
        var cluster = new OpenLayers.Feature.Vector(
            new OpenLayers.Geometry.Point(center.lon, center.lat),
            clusterAttributes
        );
        cluster.cluster = [feature];
        return cluster;
    }

} );

} );
	