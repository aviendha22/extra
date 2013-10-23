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

var indexOfObj1 = function(array, obj, attributes){
	for (var i = 0; i < array.length; i++){
		if (obj[attributes[0]].toLowerCase() === array[i][attributes[0]].toLowerCase() &&
				obj[attributes[1]].toLowerCase() === array[i][attributes[1]].toLowerCase() ){
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
		var data = JSON.parse(body).docs;
		console.log(data.length);
		for (var i = 0; i < data.length; i++){
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
	

			var ind1 = indexOfObj1(vertices, entity1, ['name', 'mongo_ar_id']);
			var en1 = indexOfObj(vertices, entity1.name, 'name');
			var ea1 = indexOfObj(vertices, entity1.mongo_ar_id, 'mongo_ar_id');
			
			var ind2 = indexOfObj1(vertices, entity2, ['name', 'mongo_ar_id']);
			var en2 = indexOfObj(vertices, entity2.name, 'name');
			var ea2 = indexOfObj(vertices, entity2.mongo_ar_id, 'mongo_ar_id')
			
			if (ind1 === -1){
				entity1.count = e_count++;
				vertices[entity1.count] = entity1;
			} else {
				entity1.count = vertices[ind1].count;
				if (vertices[ind1].type === 'entity2'){
					vertices[ind1].type = 'both';
					vertices[ind1].color = bothColor;
				}
			}

			if (ind2 === -1){
				entity2.count = e_count++;
				vertices[entity2.count] = entity2;
			} else {
				entity2.count = vertices[ind2].count;
				if (vertices[ind2].type === 'entity1'){
					vertices[ind2].type = 'both';
					vertices[ind2].color = bothColor;
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

	console.log(metadata.length);
	console.log(vertices.length);
	console.log(edges.length);	
	fs.writeFile('./json/assertions1.json', JSON.stringify(json), function(err){
		if(err){
			console.log(err);
		} else {
			console.log('The file was saved!');
		}
	});
});
