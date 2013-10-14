/**
	Will only work if titan server is not running.
*/

var gremlin = require('gremlin');

var TitanFactory = gremlin.java.import('com.thinkaurelius.titan.core.TitanFactory');
var graphDB = TitanFactory.openSync('../../../titan/databases/examples');

//supposing I'm getting data from the parsers...
var addAlphaReportToTitan = function(alpha_report_object){
 	var v = graphDB.addVertexSync(null);
 	v.setPropertySync('name', 'alpha report');
 	v.setPropertySync('comparedTo', []);
 	
    var keys = Object.keys(alpha_report_object);
    keys.forEach(function(k){
    	if (k === '_id'){
    		v.setPropertySync('mongo_ar_id', alpha_report_object[k]);
    	} else {
	        v.setPropertySync(k, alpha_report_object[k]);
		}
    });
    alpha_report_object._titan_id = gremlin.v(v).toJSON()[0]._id; 
    graphDB.commitSync();
    return v;
};

var addAssertionToTitan = function(ar, assertion_object){
	//assuming entity1 relationship and entity2 all exist...
	var v1 = graphDB.addVertexSync(null);									//assuming entity1 only holds a string atm
	v1.setPropertySync('name', assertion_object.entity1);					//would be nice for it to be an object so I can add a titan id
	v1.setPropertySync('type', 'entity1');
	graphDB.addEdgeSync(null, v1, ar, 'metadata of');
	
	var v2 = graphDB.addVertexSync(null);
	v2.setPropertySync('name', assertion_object.entity2);
	v2.setPropertySync('type', 'entity2');
	graphDB.addEdgeSync(null, v2, ar, 'metadata of');
	
	graphDB.addEdgeSync(null, v1, v2, assertion_object.relationship);
    graphDB.commitSync();
    
    return [v1, v2];
};

var getMatchingVertices = function(id, array){
	var verts = [];
	for (var i = 0; i < array.length; i++){
		var match = gremlin.v(id).inE().outV().has("name", array[i].name);
		
		if ( match.toJSON().length != 0 ){
			verts.push(match.toJSON());
		}
	}
	return verts;
};

var getMatchingEdges = function(id, array){
	var edges = [];
	for (var i = 0; i < array.length; i++){
		var match = gremlin.v(id).inE().outV().inE().has("label", array[i]._label);
		if ( match.toJSON().length != 0 ){
			edges.push(match.toJSON());
		}
	}
	return edges;
};

var getMatchingOrientation = function(id, array){
	var assertions = [];
	for (var i = 0; i < array.length; i++){
		var match = gremlin.v(id).inE().outV().has("name", array[i][2].name).inE().has("label", array[i][3]._label).outV().has("name", array[i][4].name);
		//println match;
		if ( match.toJSON().length != 0 ){
			assertions.push(match.toJSON());
		}
	}
	return assertions;
};

var compareToAlphaReports = function(ar){
	var alphas = gremlin.V().has('name', 'alpha report').toJSON();
	var ar_id = gremlin.v(ar).toJSON()[0]._id;
	alphas.forEach(function(d){
		
		if ( d._id !== ar_id ){
			var score = 0;		
			var comparedTo = d.comparedTo ? d.comparedTo : [];
			
			var ar_nodes = gremlin.v(ar).inE().outV().toJSON();
			var d_nodes = gremlin.v(d._id).inE().outV().toJSON();
			
			var ar_edges = gremlin.v(ar).inE().outV().inE().toJSON();
			var d_edges = gremlin.v(d._id).inE().outV().inE().toJSON();
			
			var ar_asserts = gremlin.v(ar).inE().outV().inE().outV().path().toJSON();
			var d_asserts = gremlin.v(d._id).inE().outV().inE().outV().path().toJSON();
			
			if (ar_nodes.length === d_nodes.length){
				score++;
			}
			
			if (ar_edges.length === d_edges.length){
				score++;
			}
			
			var ar_v_matches = getMatchingVertices(ar_id, d_nodes);
			if (ar_v_matches.length === d_nodes.length){
				score++;
			}
			
			var d_v_matches = getMatchingVertices(d._id, ar_nodes);
			if (d_v_matches.length === ar_nodes.length){
				score++;
			}
			
			var ar_e_matches = getMatchingEdges(ar_id, d_edges);
			if (ar_e_matches.length === d_edges.length){
				score++;
			}
			
			var d_e_matches = getMatchingEdges(d._id, ar_edges);
			if (d_e_matches.length === ar_edges.length){
				score++;
			}
			
			var ar_matches = getMatchingOrientation(ar_id, d_asserts);
			if (ar_matches.length === d_asserts.length){
				score++;
			}
			
			var d_matches = getMatchingOrientation(d._id, ar_asserts);
			if (d_matches.length === ar_asserts.length){
				score++;
			}
			
			ar.setPropertySync('comparedTo', [JSON.stringify({
				item_id: d._id,
				score: score
			})]);
			
			comparedTo.push(JSON.stringify({
				item_id: gremlin.v(ar).toJSON()[0]._id,
				score: score
			}));
			console.log(comparedTo.toString(), "item pushed");
			console.log(comparedTo.toString().split(), 'item ruined');
			
			var newD = gremlin.v(d._id).iterator().nextSync();
			newD.setPropertySync('comparedTo', comparedTo);
			
			console.log(newD.getPropertySync('comparedTo'), 'item saveddd');
			
			console.log("The score is " + score + " for alpha report " + gremlin.v(ar).toJSON()[0]._id + ' wrt ' + d._id);
			
	  	  	graphDB.commitSync();
  	  	}
	});
};

gremlin.SetGraph(graphDB);

var pretendAR = {
	raw_data_id: "1",
	source_name: "Twitter",
	source_id: "2",
	message_date: "2013-10-03-T19:26:27.000Z",
	message_body: "Today is Thursday, and I'm not working tomorrow!",
	utc_offset: -18000,
	time_zone: "Central Time (US & Canada)",
	lang: "en",
	radius: 0,
	reporter_id: "5",
	_id: "abcd3",
	__v: 0,
	updatedDate: "2013-10-03-T19:27:07.805Z",
	createdDate: "2013-10-03-T19:27:07.805Z"
};

var pretendAssertion = {
	entity1: 'squirrel',
	relationship: 'become',
	entity2: 'visitor'
};

var meta = addAlphaReportToTitan(pretendAR);
console.log('stupid thing');
addAssertionToTitan(meta, pretendAssertion);
compareToAlphaReports(meta);
graphDB.shutdownSync();