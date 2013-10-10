var gremlin = require('gremlin'),
	T = gremlin.Tokens,
	Direction = gremlin.Direction,
	Type = gremlin.ClassTypes;

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
    alpha_report_object._titan_id = v.id;
    console.log(v.id);
    
    graphDB.commitSync();
    return v;
};

var addAssertionToTitan = function(ar, assertion_object){
	//assuming entity1 relationship and entity2 all exist...
	var v1 = graphDB.addVertexSync(null);									//assuming entity1 only holds a string atm
	v1.setPropertySync('name', assertion_object.entity1);					//would be nice for it to be an object so I can add a titan id

	graphDB.addEdgeSync(null, v1, ar, 'metadata of');
	
	var v2 = graphDB.addVertexSync(null);
	v2.setPropertySync('name', assertion_object.entity2);
	graphDB.addEdgeSync(null, v2, ar, 'metadata of');
	
	graphDB.addEdgeSync(null, v1, v2, assertion_object.relationship);
    graphDB.commitSync();
    
    return [v1, v2];
}

gremlin.SetGraph(graphDB);
gremlin.V('name', 'alpha report').consoleOut();


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
addAssertionToTitan(meta, pretendAssertion);

graphDB.shutdownSync();
