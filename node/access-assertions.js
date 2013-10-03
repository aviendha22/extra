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
var bothColor = '#ff99ff';

var indexOfObj = function(array, value, attribute){
	for (var i = 0; i < array.length; i++){
		if (value.toLowerCase() === array[i][attribute].toLowerCase()){
			return i;
		}
	}
	
	return -1;
};

var limit = parseInt(process.argv[2], 10);
request('http://everest-build:8081/assertion/', function(error, response, body){
	if (error){
		console.log(error);
	} else {
		var data = JSON.parse(body);
		console.log(data.length);
		for (var i = 0; i < limit; i++){
		var assertion = data[i];
			
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
				mCount: m.count
			};
			
			var entity2 = {
				mongo_ar_id: assertion.alpha_report_id,
				mongo_assert_id: assertion._id,
				name: assertion.entity2,
				type: 'entity2',
				color: entity2Color,
				mCount: m.count
			};
			
			var en1 = indexOfObj(vertices, entity1.name, 'name');
			var ea1 = indexOfObj(vertices, entity1.mongo_ar_id, 'mongo_ar_id');
			
			var en2 = indexOfObj(vertices, entity2.name, 'name');
			var ea2 = indexOfObj(vertices, entity2.mongo_ar_id, 'mongo_ar_id')
			
			if (en1 === -1 || ea1 === -1){
				entity1.count = e_count++;
				vertices[entity1.count] = entity1;
			} else {
				entity1.count = vertices[en1].count;
				
				if ( vertices[en1].type === 'entity1' ){
					vertices[en1].type = 'both';
					vertices[en1].color = bothColor;
				}
			}
			
			if ( en2 === -1 || ea2 === -1){
				entity2.count = e_count++;
				vertices[entity2.count] = entity2;
			} else {
				entity2.count = vertices[en2].count;

				if ( vertices[en2].type === 'entity1' ){
					vertices[en2].type = 'both';
					vertices[en2].color = bothColor;
				}
			}
				
			var relationship = {
				mongo_ar_id: assertion.alpha_report_id,
				mondo_assert_id: assertion._id,
				_label: assertion.relationship,
				source: entity1.count,
				target: entity2.count
			};
			
			edges.push(relationship);
		};
	}
	var json = {
		metadata : metadata,
		vertices : vertices,
		edges	 : edges
	};

	
	fs.writeFile('./json/assertions-' + limit +'.json', JSON.stringify(json), function(err){
		if(err){
			console.log(err);
		} else {
			console.log('The file was saved!');
		}
	});
});
