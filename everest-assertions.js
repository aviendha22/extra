var request = require('request');
var fs = require('fs');
var vertices = [];
var edges = [];
var metadata = [];

var v_count = 0;
var e_count = 0;
var m_count = 0;

var entity1Color = '#333399';
var entity2Color = '#339966';

var indexOfObj = function(array, value, attribute){
	for (var i = 0; i < array.length; i++){
		if (value.toLowerCase() === array[i][attribute].toLowerCase()){
			return i;
		}
	}
	
	return -1;
};

//var limit = parseInt(process.argv[2], 10);
request('http://everest-build:8081/assertion/', function(error, response, body){
	if (error){
		console.log(error);
	} else {
		var data = JSON.parse(body);
		data.forEach(function(assertion){
			var m = {
				mongo_ar_id: assertion.alpha_report_id,
				mongo_rep_id: assertion.reporter_id,
				createdDate: assertion.createdDate,
				updatedDate: assertion.updatedDate,
				type: 'metadata',
				name: 'alpha report',
				count: m_count
			};
			
			var mInd = indexOfObj(metadata, m.mongo_ar_id, 'mongo_ar_id');
			if (mInd === -1){
				metadata.push(m);
				m_count++;
			} else {
				m.count = metadata[mInd].count;
			}
			
			var entity1 = {
				mongo_ar_id: assertion.alpha_report_id,
				mongo_assert_id: assertion._id,
				name: assertion.entity1,
				type: 'entity1',
				color: entity1Color,
				mCount: m.count,
				count: e_count++
			};
			
			var entity2 = {
				mongo_ar_id: assertion.alpha_report_id,
				mongo_assert_id: assertion._id,
				name: assertion.entity2,
				type: 'entity2',
				color: entity2Color,
				mCount: m.count,
				count: e_count++
			};
			
			var relationship = {
				mongo_ar_id: assertion.alpha_report_id,
				mondo_assert_id: assertion._id,
				_label: assertion.relationship,
				source: entity1.count,
				target: entity2.count
			};
			 
			vertices[entity1.count] = entity1;
			vertices[entity2.count] = entity2;
			edges.push(relationship);
		});
	}
	var json;
	if (limit === undefined){
		json = {
			metadata : metadata,
			vertices : vertices,
			edges	 : edges
		};
	} else {
		json = {
			metadata : metadata.slice(0,limit),
			vertices : vertices.slice(0,2*limit),
			edges	 : edges.slice(0,limit)
		};
	}
	
	fs.writeFile('./json/assertions.json', JSON.stringify(json), function(err){
		if(err){
			console.log(err);
		} else {
			console.log('The file was saved!');
		}
	});
});