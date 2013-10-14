/**
	This will run only if the titan server is already running.
	Comparisons would have to go onto mongo.
*/

var request = require('request');
var titanAddress = 'http://localhost:8182/graphs/graph';
var mongoAddress = 'http://localhost:8081/';

var buildNode = function(cObj){
	var query = titanAddress + '/vertices?';

	var keys = Object.keys(cObj);
	keys.forEach(function(key, i){
		if (key === '_id'){
			query += 'mongo_ar_id=' + cObj[key];
		} else {
			query += key + '=' + cObj[key];
		}
		
		query += '&';
	});
	return query;
};

var buildEdge = function(lObj){
	var outV = lObj.source;
	var inV = lObj.target;
	var query = titanAddress + '/edges?_outV=' + outV + '&_inV=' + inV + '&';
	var keys = Object.keys(lObj);
	keys.forEach(function(key, i){
		query += key + '=' + lObj[key] + '&';
	});
	return query;
};

var attachToMeta = function(meta, obj){
	request.post(buildNode(obj), function(error, response, body){
		obj._titan_id = JSON.parse(body).results._id;
		request({
			uri: buildEdge({
				source: obj._titan_id,
				target: meta._titan_id,
				_label: 'metadata of' 
			}),
			method: 'POST'
		}, function(error, response, body){
			console.log(JSON.parse(body).results);
		});
	});
};

var pretendAR = {
	name: "alpha report",
	raw_data_id: "2",
	source_name: "Email",
	source_id: "6",
	message_date: "2013-10-10-T19:26:27.000Z",
	message_body: "Today is Monday and the sun finally came out! So very exciting.",
	utc_offset: -18000,
	time_zone: "Central Time (US & Canada)",
	lang: "en",
	radius: 0,
	reporter_id: "5",
	_id: "123abc",
	__v: 0,
	updatedDate: "2013-10-10-T19:27:07.805Z",
	createdDate: "2013-10-10-T19:27:07.805Z"
};

var entity1 = {
	name: 'Sun',
	type: 'entity1'
};

var entity2 = {
	name: 'out',
	type: 'entity2'
};

var relationship = {
	_label: 'came'
};

request.post(buildNode(pretendAR), function(error, response, body){
	pretendAR._titan_id = JSON.parse(body).results._id;
	console.log(pretendAR);

	attachToMeta(pretendAR, entity1);
	attachToMeta(pretendAR, entity2);

	setTimeout(function(){
		relationship.source = entity1._titan_id;
		relationship.target = entity2._titan_id;
		request.post(buildEdge(relationship), function(error, response, body){
			console.log(JSON.parse(body).results);
		});
	}, 3000);
});