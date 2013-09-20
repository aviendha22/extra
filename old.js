				/*//grab the column we want to sort by
				var col = me.getSortedColumn();
				var colText = me.headers[col.id];
				
				console.log(colText);
				var a = item[colText] > me.temp_datas[0][colText];
				var b = item[colText] < me.temp_datas[me.temp_datas.length - 1][colText];
				
				var c = item[colText] < me.temp_datas[0][colText];
				var d = item[colText] > me.temp_datas[me.temp_datas.length - 1][colText];
				
				//var betweenUp = a && b;
				//var betweenDown = c && d;
				
				if (col.class === "up" && a){
					console.log("INSERTING UP");
					//this table is full, we'll need to pop off last and insert new
					if (b){
						me.temp_datas.pop();
						me.temp_datas.sort( function(a, b) { return a[colText] > b[colText] ? 1 : -1 } );
						this.renderSentence(item, me.temp_datas.indexOf(item));
						me.count++;
					} else if (me.temp_datas.length < me.max_rows) {
						//the table isn't full, just add to end
						this.renderSentence(item, false);
						me.count++;
					} else {
						//the item belongs on a further page, do nothing
					}
					
					me.temp_datas.push(item);
					
				} else if (col.class === "down" && c) {
					console.log("INSERTING DOWN");
					
					//this table is full, we'll need to pop off last and insert new
					if (d){
						me.temp_datas.pop();
						me.temp_datas.sort( function(a, b) { return a[colText] < b[colText] ? 1 : -1 } );
						this.renderSentence(item, me.temp_datas.indexOf(item));
						me.count++;
					} else if (me.temp_datas.length < me.max_rows) {
						//the table isn't full, just add to beginning
						this.renderSentence(item, 0);
						me.count++;
					}
					me.temp_datas.push(item);					
				}
				*/
				
				
				//item should be inserted somewhere in or after current table view
				/*if (index > me.page * me.max_rows){
					//item belongs in this table view, but table is full
					if (index < temp){
						me.count++;
						me.temp_datas.push(item);
						
						this.renderSentence(item, false);
						
						//hi-light the row as it is added, with a fade out
						var rows = d3.select('.data_table_data').selectAll('tr');
						var lastRow = rows[0][rows[0].length - 1];
						d3.select(lastRow).style("color", "red")
							.transition()
							.duration(10000)
							.style("color", "black");
					}
				}*/
						
				//render data only between beginning of page and end of page, of length me.max_rows
				/*if ( me.count < temp ) {
					me.count++;
					me.temp_datas.push(item);
					
					this.renderSentence(item, false);
					
					//hi-light the row as it is added, with a fade out
					var rows = d3.select('.data_table_data').selectAll('tr');
					var lastRow = rows[0][rows[0].length - 1];
					d3.select(lastRow).style("color", "red")
						.transition()
						.duration(10000)
						.style("color", "black");
				}*/
				


function resizeLine(){
	var rect = d3.select(this);
	var group = this.parentNode;
	var line = d3.select(group).select('line');
	var circle = d3.select(group).select('circle');
	//var ind = rect.attr('class')[1];

	rect.attr('x', function() { return d3.event.dx + parseInt(rect.attr('x')) })
		.attr('y', function() { return d3.event.dy + parseInt(rect.attr('y')) });
	
	line.attr('x'+ind, function() { return d3.event.dx + parseInt(line.attr('x'+ind)) })
		.attr('y'+ind, function() { return d3.event.dy + parseInt(line.attr('y'+ind)) });
	
		
};

function createEndpoint(g, item, ind){
	var point = g.append('rect')
		.attr('class', 'p' + ind)
		.attr('x', item.attr('x'+ind) - 5)
		.attr('y', item.attr('y'+ind) - 5)
		.attr('width', 10)
		.attr('height', 10)
		.on('mouseover', function(){
			d3.select(this).style('opacity', 1);
		})
		.on('mouseout', function(){
			d3.select(this).style('opacity', 0);
		})
		.call(d3.behavior.drag().on('drag', resizeLine));		
};
				
function moveRect(parent){
	d3.select(parent).selectAll('rect')
		.each(function(d,i){
			var point = d3.select(this);
			
			point.attr('x', function() { return d3.event.dx + parseInt(point.attr('x')) })
				 .attr('y', function() { return d3.event.dy + parseInt(point.attr('y')) });
		});
}

		
	path = svg.append('line')
		.attr('class', 'relation')
		.attr('x1', toolC.x - 30)
		.attr('y1', toolC.y + 75)
		.attr('x2', toolC.x + 30)
		.attr('y2', toolC.y + 75);
		
	path.on('click', function(){
		var group = d3.select('.canvas svg')
			.append('g')
				.attr('d', 'default relationship');
				
		var p = group.append('line')
			.attr('class', 'line')
			.attr('x1', canvasC.x - 30 + dy)
			.attr('y1', canvasC.y - 30 + dy)
			.attr('x2', canvasC.x + 30 + dy)
			.attr('y2', canvasC.y + 30 + dy)
			.call(d3.behavior.drag().on('drag', function(){
				moveLine(this.parentNode);
			}));	
							
		createEndpoint(group, p, 1);	
		createEndpoint(group, p, 2);
	
		dy += 2;
				
	});
	
/**from alphaToAssert.js*/
	
function stripParens(str){
	var a = str.indexOf("(");
	var b = str.lastIndexOf(")");
	if (a >= 0 && b >= 0)
		return str.substring(a + 1, b);
	else
		return str;
		
	//return str.substring(1, str.length - 1);
}


	
	//from rawfeed
	/*for (var i = 0; i < data.length; i++){
		var tweet = JSON.parse(data[i].text);
		var message = tweet.text;
		messages.push(message);
	}*/
	
	
/** examples to send through dev http*/
alpha_report
{
	"source_name":"Twitter", 
	"source_id":"5", 
	"message_body":"A rare black squirrel has become a regular visitor to a suburban garden. And he ate bunnies."
}
{
"id":"51f196f88a77c2864600000b"
}

{
	"source_name":"Twitter", 
	"source_id":"5", 
	"message_body":"Africa is a continent and they have lots of countries.",
	"reporter_id":"51f196cf8a77c2864600000a"
}
{
"id":"51f197988a77c2864600000d"
}

reporter

{
	"name":"Ashley",
	"source_name":"Twitter"
}

{
"id":"51f196cf8a77c2864600000a"
}


assertion
{
"alpha_report_id":"51f193db8a77c28646000009",
"reporter_id":"51f196cf8a77c2864600000a",
"entity1":"Francisco",
"relationship":"is",
"entity2":"excited"
}

{
"id":"51f197268a77c2864600000c"
}

{ 
	"alpha_report_id": "51f18f098a77c28646000001",
    "reporter_id": "51f196cf8a77c2864600000a",
    "entity1": "squirrel",
    "relationship": "become",
    "entity2": "visitor" 
}
{ alpha_report_id: '51f193db8a77c28646000009',
    reporter_id: undefined,
    entity1: 'Francisco',
    relationship: 'is',
    entity2: 'excited' }
    
    
TripletExtraction main

	public static void main(String[] args) {
		ExtractionService extractor = new ExtractionService();
		ArrayList<Tree> trees = extractor.parser.parse("I seriously go stay at the beach for a week every summer since third grade.");
		
		System.out.println(trees);
		
		for (int i = 0; i < trees.size(); i++){
			Tree root = trees.get(i);
			int numKids = root.lastChild().numChildren();
			root.lastChild().removeChild(numKids - 1);
			Tree output = extractor.extractTriplet(root);
			System.out.println(root);
			if(output == null)
				System.err.println("ERROR: Could not find triplet");
			else
				output.printLocalTree();
		}
	}
	
	
Old NLPParser.js code

var messages = [], assertions = [];
var count = 0, overall = 0;
var $ = require('jquery');
function getMessages(data){
	var messages = []
	for (var i = 0; i < data.length; i++){
		if (data[i].message_body){ messages.push(data[i]); }
	}
	console.log(messages);
	return messages;
}

$.getJSON(url + 'alpha_report/?callback=?', function(data){

	messages = getMessages(data);
	
	//send each message body through NLP to extract a TRIPLET
	for (i = 0; i < messages.length; i++){
		var tree = parser.parseSync(messages[i].message_body);
		for ( var j = 0; j < tree.sizeSync(); j++){
			overall++;
			var output = getTriplet(tree.getSync(j));
			
			//create assertion object with data extracted from NLP
			if (output){
				var assert = {
					alpha_report_id : messages[i]._id,
					reporter_id : messages[i].reporter_id,
					entity1 : output.getEntity1StringSync(),
					relationship: output.getRelationStringSync(),
					entity2: output.getEntity2StringSync()
				};
				assertions.push( assert );
				count++;
				console.log("HI");
				assertion_service.saveAssertion(assert, function(err, newAssertion){
					console.log("ERR");
					if (!err){
						console.log("Here is the new assertion");
						console.log(newAssertion);
					} else {
						console.log("There was an error saving the parsed Assertion object");
					}
				
				});
				console.log("YA");
			} else {}
		}
	}
	//console.log(assertions);				
	//console.log("Displaying " + count + " matches out of " + overall + " possible assertions");
});
/*var logger = null;

this.load = function(app, io, gcm, log) {
	logger = log;
	app = app;
	
	app.get('/nlp-parser/start', function(req, res){
		if(logger.DO_LOG){
			logger.info('Request for nlp parser start');
		}
		
		me.parse(req.query, res);
	});
	
	app.get('/nlp-parser/stop', function(req, res){
		if(logger.DO_LOG){
			logger.info('Request for nlp parser stop');
		}
		
		me.stopParse(req.query, res);
	});
};

me.parse = function(query, res){
	
};*/


/*this.parseAndSave({
	"source_name":"Twitter",
	"source_id":"1",
	"message_body":"A rare black squirrel has become a regular visitor to a suburban garden",
	"_id":"51f18f098a77c28646000001",
	"__v":0,
	"updatedDate":"2013-07-25T20:48:09.388Z",
	"createdDate":"2013-07-25T20:48:09.388Z"
});*/

var obj = {
	"alpha_report_id":"51f286c9054604e60a000001",
	"entity1":"Francisco",
	"relationship":"is",
	"entity2":"excited"
};

assertion_service.saveAssertion(obj, function(err, newAssertion){
	if (!err){
		console.log("Callback version " +newAssertion);
	} else {
		console.log("There was an error saving the parsed Assertion object.");
	}
});

draw.js
		//grab the line that is a sibling or child to current circle
		/*var line = d3.select(that.parentNode).select('.relation');
		d3.select(that.parentNode).selectAll('.triangle').remove();
		
		if (!line[0][0]){
			return;
		}
		var x, y;
		if (line.attr('x1') === cx && line.attr('y1') === cy){
			x = 'x1';
			y = 'y1';
		} else {
			x = 'x2';
			y = 'y2';
		}
	
		line.attr(x, function() { 
			var newC = dx + parseInt(line.attr(x)); 
			return me.computeCoord(newC, 'x');
		})
		.attr(y, function() { 
			var newC = dy + parseInt(line.attr(y)); 
			return me.computeCoord(newC, 'y');
		});
		
		var p1 = { 
			x:parseInt(line.attr('x1'),10),
			y:parseInt(line.attr('y1'),10)
		};
		
		var p2 = {
			x:parseInt(line.attr('x2'),10),
			y:parseInt(line.attr('y2'),10)
		};
		
		me.createArrow(line, that);*/
		
	/**
		called when a new line is created in the following functions
		me.dragGroup, me.nodeclick, me.doubleClickNode
		@param - line: the line that we want to add the arrow to
				 that: the item to append the arrows to
		@return - none
		@functionality - calculate the locations of the points that
				  will be used for the arrows that indicate direction
				  between entity 1 and entity 2
		@internal functions - none
	*/
	me.createArrow = function(line){
		var p1 = {
			x: parseInt(line.attr('x1'),10),
			y: parseInt(line.attr('y1'),10)
		};
		
		var p2 = {
			x: parseInt(line.attr('x2'),10),
			y: parseInt(line.attr('y2'),10)
		};
		
		var midlineX = (p2.x + p1.x) / 2;
		var midlineY = (p2.y + p1.y) / 2;
		var magline = Math.sqrt((p2.y - p1.y) * (p2.y - p1.y) + (p2.x - p1.x) * (p2.x - p1.x));
		var alpha = Math.atan((p2.y - p1.y) / (p2.x - p1.x)) - 0.523598;
		var beta = Math.atan((p2.y - p1.y) / (p2.x - p1.x)) + 0.523598;

		var dx1 = me.arrowlength * Math.cos(alpha);
		var dy1 = me.arrowlength * Math.sin(alpha);
		
		var dx2 = me.arrowlength * Math.cos(beta);
		var dy2 = me.arrowlength * Math.sin(beta);
		
		var Dx1, Dy1, Dx2, Dy2;
		
		//(+, +) case, accounting for inverted y-axis
		if ((p2.x > p1.x) && (p2.y < p1.y)){
			Dx1 = -dx1;
			Dy1 = -dy1;
			Dx2 = -dx2;
			Dy2 = -dy2;
		//(-, -) case, accounting for inverted y-axis
		} else if((p2.x < p1.x) && (p2.y > p1.y)){
			Dx1 = dx1;
			Dy1 = dy1;
			Dx2 = dx2;
			Dy2 = dy2;
		//either (+, -) or (-, +)
		} else {
			Dx1 = p2.x > p1.x ? -dx1 : dx1;
			Dy1 = p2.y > p1.y ? -dy1 : dy1;
			
			Dx2 = p2.x > p1.x ? -dx2 : dx2;
			Dy2 = p2.y > p1.y ? -dy2 : dy2;
		}
		
		d3.select(line[0][0].parentNode).append('line')
			.attr('class', 'triangle')
			.attr('x1', midlineX)
			.attr('y1', midlineY)
			.attr('x2', midlineX + Dx1)
			.attr('y2', midlineY + Dy1);
			
		d3.select(line[0][0].parentNode).append('line')
			.attr('class', 'triangle')
			.attr('x1', midlineX)
			.attr('y1', midlineY)
			.attr('x2', midlineX + Dx2)
			.attr('y2', midlineY + Dy2);
	};
					/*group.append('circle')
					.attr('d', $('.ent2').val())
					.attr('class', me.circleCount)
					.attr('cx', function(){ return me.computeCoord(p2.x, 'x'); })
					.attr('cy', function(){ return me.computeCoord(p2.y, 'y'); })
					.attr('r', me.radius)
					.style('fill', color(cGroup))
					.call(d3.behavior.drag().on('drag', me.move))
					.on('dblclick', me.doubleClickNode)
					.on('mouseover', me.mouseover)
					.on('mouseout', me.mouseout)
					.on('click', me.nodeclick);*/

								/*var request = new XMLHttpRequest();
			var url = 'http://localhost:8081/target_assertion/';
			
			request.open('POST', url, true);
			request.onreadystatechange = function() {
				if (request.readyState === 4){
					console.log('It worked');
				}
			};
			request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			request.send(escape(JSON.stringify(postData)));
			
			$.ajax({
				type:'POST',
				beforeSend: function(request){
					request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
					request.setRequestHeader('Access-Control-Allow-Origin: *');
				},
				url: url,
				data: 'json=' + escape(JSON.stringify(postData)),
				processData: false
			
			});
				
			//var url = 'http://localhost:8081/target_assertion/?callback=localJsonpCallback&' +JSON.stringify(postData);
			
			$.ajax({
				url: url,
				type: 'POST',
				data: escape(JSON.stringify(postData)),
				dataType: 'jsonp',
				jsonpCallback: 'localJsonpCallback',
				jsonp: false,
				success:localJsonpCallback,
				crossDomain:true
			});	*/
			
			/*function localJsonpCallback(json){
				if(!json.Error){
					console.log('yay');
				} else {
					console.log(json.Message);
				}
			}*/
			
			
				/*$.ajax({
					type:'POST',
					beforeSend: function(request){
						request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
						request.setRequestHeader('Access-Control-Allow-Origin: *');
					},
					url: url,
					data: 'json=' + escape(JSON.stringify(postData)),
					processData: false
				});*/
				
draw.js
jquery drag plugin version
$('.canvas').drag('start', function (ev, dd ){
	if (me.mode === 'select_hold'){
		d3.select('.canvas svg').append('rect')
			.attr('class', 'selection')
			.style('opacity', 0.25);
	}
})
.drag(function(ev, dd){			
	if (me.mode === 'select_hold'){
		d3.select('.selection').attr('width', Math.abs( ev.pageX - dd.startX ))
			.attr('height', Math.abs( ev.pageY - dd.startY ))
			.attr('x', Math.min( ev.pageX - 169, dd.startX - 169))
			.attr('y', Math.min( ev.pageY - 9, dd.startY - 9));
			
		d3.selectAll('.canvas circle').each(function(){
			var c = d3.select(this);
			var rect = d3.select('.selection');
			var right = parseInt(rect.attr('x'),10) + parseInt(rect.attr('width'),10);
			var bottom = parseInt(rect.attr('y'),10) + parseInt(rect.attr('height'),10);
			if (c.attr('cx') < right & c.attr('cx') > parseInt(rect.attr('x'))){
				if (c.attr('cy') < bottom & c.attr('cy') > parseInt(rect.attr('y'))){
					c.style('fill', 'red');
				} else {
					var i = me.indexOf(c, me.circles);
					c.style('fill', color(me.circles[i].group));
				}
			} else {
				var i = me.indexOf(c, me.circles);
				c.style('fill', color(me.circles[i].group));
			}
		});
	}
})
.drag('end', function(ev, dd){
	if (me.mode === 'select_hold'){
		$('.selection').remove();
	}
});

on delete_hold selection
else if (me.mode === 'delete_hold'){
	var nodesToRemove = [];
	var linksToRemove = [];
	d3.selectAll('.canvas circle').each(function(){
		var c = d3.select(this);
		if(c.style('fill') === '#ff0000'){
			nodesToRemove.push(c[0][0]);
		}
	});
	
	d3.selectAll('.canvas line').each(function(){
		var l = d3.select(this);
		if (l.style('stroke') === '#ff0000'){
			linksToRemove.push(l[0][0]);
		}
	});
	
	for (var i = 0; i < nodesToRemove.length; i++){
		me.deleteNode(nodesToRemove[i]);
	}
	
	for (i = 0; i < linksToRemove.length; i++){
		me.deleteLink(linksToRemove[i]);
	}
}

me.move
if(me.mode === 'mover_hold'){
	var circles = [];
	var lines = [];
	
	var group = me.indexOf(d3.select(this), me.circles);
	var x = me.extractCircles(me.circles[group].group);
	
	for (var i = 0; i < x.length; i++){
		circles.push(me.circles[x[i]].html);
	}
	
	var y = me.extractLines(x);
	for (i = 0; i < y.length; i++){
		lines.push(me.lines[y[i]].html);
		d3.select(me.lines[y[i]].html.parentNode)
			.select('path').remove();
	}
	me.moveCircles(d3.selectAll(circles));
	me.moveLines(d3.selectAll(lines));
	for (var i = 0; i < circles.length; i++){
		me.dragGroup(circles[i]);	
	}
	
} 
	

/**
	called from the me.move function
	@param - parent: the parent element to the item we want to move
	@return - none
	@functionality - grabs each line in the group and translates each
			  of the endpoints, moving each line but staying within the
			  bounds of the canvas
	@internal functions - me.computeCoord
						  me.createArrow
*/
me.moveLines = function(lines){
	lines.each(function(){
		var line = d3.select(this);
		
		line.attr('x1', function() { 
			var newC = d3.event.dx + parseInt(line.attr('x1')); 
			return me.computeCoord(newC, 'x');
		}).attr('y1', function() { 
			var newC = d3.event.dy + parseInt(line.attr('y1')); 
			return me.computeCoord(newC, 'y'); 
		}).attr('x2', function() { 
			var newC = d3.event.dx + parseInt(line.attr('x2')); 
			return me.computeCoord(newC, 'x');
		}).attr('y2', function() { 
			var newC = d3.event.dy + parseInt(line.attr('y2')); 
			return me.computeCoord(newC, 'y'); 
		});
		
		var path = me.createArrow(line);
	});
};

	
/**
	called from the me.move function
	@param - parent: the parent element to the item we want to move
	@return - none
	@functionality - grabs each circle in the group and translates it,
			  moving each circle but staying within the bounds of the
			  canvas
	@internal functions - me.computeCoord
*/
me.moveCircles = function(circles){

	circles.each(function(){
		var circle = d3.select(this);
		
		circle.attr('cx', function() { 
			var newC = d3.event.dx + parseInt(circle.attr('cx'));
			return me.computeCoord(newC, 'x');
		}).attr('cy', function() { 
			var newC =  d3.event.dy + parseInt(circle.attr('cy'));
			return me.computeCoord(newC, 'y'); 
		});
		
		var c = me.circles[me.indexOf(circle, me.circles)];
			c.x = circle.attr('cx');
			c.y = circle.attr('cy');
		});
};

	
me.getCircleByClass = function(clazz){
	d3.selectAll('.canvas circle').each(function(){
		if (d3.select(this).attr('class') === clazz){
			return this;
		}
	});
};

	
/**
	@param 			array: array created from extractCircles
						   a set of circles all with the same group
	@return			an array of indicies pointing back to lines in
					me.lines that are connected to the circles specified
					by param array
	@functionality	goes through each of the circles specified by array
					and checks all the lines to see if the source or target
					of that line matches the circle's class
					add line index if it hasn't already been added
					to the return array
*/
me.extractLines = function(array){
	var lines = [];
	//for each circle in the array
	for (var i = 0; i < array.length; i++){
		var c = me.circles[array[i]].class;
		//add a line if it is attached to the circle
		for (var j = 0; j < me.lines.length; j++){
			var l = me.lines[j];
			if (c.html === l.source || c.html === l.target){
				if(lines.indexOf(j) === -1){
					lines.push(j);
				}
			}
		}
	}
	return lines;
};
//from me.move
/*var y = me.extractLines(x);
for (i = 0; i < y.length; i++){
	d3.select(me.lines[y[i]].html.parentNode)
		.select('path').remove();
}*/

functions that went into toolbar-component.js

/**
	called in createToolbar when a new toolbar element is added 
	@param - svg: the container to add the new element to
			 class_name: a string that gives a short description of
			 	  the new toolbar item, which becomes the group's class
	@return - a group containing a rectangle to show mode selection
	@functionality - adds a space for a new toolbar item, providing
			  an on click event callback
	@internal functions - me.toggleSelction
*/
me.createSelection = function(svg, class_name){
	me.num_tools++;
	
	//add a new space for the new tool, with an onclick event
	var selection = svg.append('g')
		.attr('class', class_name)
		.on('click', me.toggleSelection);
	
	//add the background svg element to show tool usage
	selection.append('rect')
		.attr('class', 'unselect')
		.attr('x', me.toolC.x - me.radius - 3)
		.attr('y', me.num_tools * shift - me.radius - 3)
		.attr('width', 2*(me.radius + 3) )
		.attr('height', 2*(me.radius + 3) );
		
	return selection;
};

/**
	the on click callback used when creating a new selection
	@functionality - either changes the current tool in use or
		toggles the tool usage indicator off.	
		intermediate stored variables are reset.
		if the label selection is toggled, calls me.addAllLabels
	@internal functions - me.addAllLabels
*/
me.toggleSelection = function(){
	var item = d3.select(this);
	me.lastNodeClicked = null;
	
	//if the item being toggled is already off, turn it on
	if(item.select('rect').classed('unselect')){
		d3.selectAll('rect').classed('select', false);
		d3.selectAll('rect').classed('unselect', true);
		item.select('rect').classed('unselect', false)
			.classed('select', true);
		
		me.mode = item.attr('class');
		
	//if the item being toggled is currently on, just turn it off
	} else {
		item.select('rect').classed('select', false)
			.classed('unselect', true);
			
		//clear mode and remove any labels
		me.mode = '';
		d3.selectAll('.canvas text').remove();
	}	
	
	if (me.mode === 'label_hold'){
		me.addAllLabels();
	}
	if (me.mode !== 'select_hold'){
		me.resetColors();
	}
};



/**
	called from javascript section in index.html
	@functionality - grabs the .toolbar div and adds an svg element to it 
	which will be where any toolbar items are held. currently there are 
	five functioning tools: label, node, rel, mover and delete.
	@internal functions - me.createSelection
*/
me.createToolbar = function(){
	var toolBar = d3.select('.toolbar');
	var svg = toolBar.append('svg')
		.attr('width', me.toolW)
		.attr('height', me.toolH);
	
	var label_hold = me.createSelection(svg, 'label_hold');
	label_hold.append('text')
		.attr('x', me.toolC.x)
		.attr('y', me.num_tools * shift)
		.attr('text-anchor', 'middle')
		.attr('dy', '0.35em')
		.text('abc');
	
	var node_hold = me.createSelection(svg, 'node_hold');
	node_hold.append('circle')
		.attr('class', 'entity')
		.attr('cx', me.toolC.x)
		.attr('cy', me.num_tools * shift)
		.attr('r', me.radius);
	
	var rel_hold = me.createSelection(svg, 'rel_hold');
	rel_hold.append('line')
		.attr('class', 'relationship')
		.attr('x1', me.toolC.x - me.radius)
		.attr('y1', me.num_tools * shift - me.radius)
		.attr('x2', me.toolC.x + me.radius)
		.attr('y2', me.num_tools * shift + me.radius)
		.attr('marker-mid', 'url(#Triangle)');
	
	rel_hold.append('path')
		.attr('class', 'relationship')
		.attr('marker-mid', 'url(#Triangle)')
		.attr('d', function(){
			return 'M'+ (me.toolC.x - me.radius)+' ' + (me.num_tools * shift - me.radius) +
				  ' L'+ me.toolC.x + ' ' + (me.num_tools * shift) +
				  ' L'+ (me.toolC.x + me.radius)+' ' + (me.num_tools * shift + me.radius);
		});
	
	var mover_hold = me.createSelection(svg, 'mover_hold');	
	mover_hold.append('line')
		.attr('x1', me.toolC.x)
		.attr('y1', me.num_tools * shift - me.radius)
		.attr('x2', me.toolC.x)
		.attr('y2', me.num_tools * shift + me.radius);
	
	mover_hold.append('line')
		.attr('x1', me.toolC.x - me.radius)
		.attr('y1', me.num_tools * shift)
		.attr('x2', me.toolC.x + me.radius)
		.attr('y2', me.num_tools * shift);	
		
	var undo_hold = me.createSelection(svg, 'undo_hold');
	undo_hold.append('text')
		.attr('x', me.toolC.x)
		.attr('y', me.num_tools * shift)
		.attr('text-anchor', 'middle')
		.attr('dy', '0.35em')
		.attr('font-size', 12)
		.text('undo');
	
	var delete_hold = me.createSelection(svg, 'delete_hold');
	delete_hold.append('circle')
		.attr('cx', me.toolC.x)
		.attr('cy', me.num_tools * shift)
		.attr('r', me.radius)
		.style('stroke', selectColor);
	
	delete_hold.append('line')
		.attr('x1', me.toolC.x - me.radius)
		.attr('y1', me.num_tools * shift)
		.attr('x2', me.toolC.x + me.radius)
		.attr('y2', me.num_tools * shift)
		.style('stroke', selectColor);
		
	var select_hold = me.createSelection(svg, 'select_hold');
	select_hold.select('rect').style('stroke', 'black');
		
	//add reset and submit buttons at the bottom of the toolbar	
	var div = d3.select('body').append('div');
	div.append('button').text('Reset')
		.on('click', function(){
			d3.select('.node-link-container').remove();
			d3.select('.canvas svg').append('g')
				.attr('class', 'node-link-container');
			
			me.circles = [];
			me.lines = [];
		});
	
	div.append('button').text('Submit')
		.on('click', me.saveTargetAssertions);
};

from me.dragGroup
					
		
//if entity1 was grabbed, p1 from line matches grabbed circle		
if (line.attr('x1') === cx && line.attr('y1') === cy){
	x = 'x1';
	y = 'y1';
//if entity2 was grabbed, p2 from line matches grabbed circle
} else if ( line.attr('x2') === cx && line.attr('y2') === cy){
	x = 'x2';
	y = 'y2';
//if entity has no relationship attached to it
} else {
	x = null, y = null;
}

toolbar.js createToolbar
/*node_hold.append('circle')
	.attr('class', 'entity')
	.attr('cx', me.center.x)
	.attr('cy', me.num_tools * me.shift)
	.attr('r', me.radius);*/


/*rel_hold.append('line')
	.attr('class', 'relationship')
	.attr('x1', me.center.x - me.radius)
	.attr('y1', me.num_tools * me.shift - me.radius)
	.attr('x2', me.center.x + me.radius)
	.attr('y2', me.num_tools * me.shift + me.radius)
	.attr('marker-mid', 'url(#Triangle)');

rel_hold.append('path')
	.attr('class', 'relationship')
	.attr('marker-mid', 'url(#Triangle)')
	.attr('d', function(){
		return 'M'+ (me.center.x - me.radius)+' ' + (me.num_tools * me.shift - me.radius) +
			  ' L'+ me.center.x + ' ' + (me.num_tools * me.shift) +
			  ' L'+ (me.center.x + me.radius)+' ' + (me.num_tools * me.shift + me.radius);
	});*/

/*mover_hold.append('line')
	.attr('x1', me.center.x)
	.attr('y1', me.num_tools * me.shift - me.radius)
	.attr('x2', me.center.x)
	.attr('y2', me.num_tools * me.shift + me.radius);

mover_hold.append('line')
	.attr('x1', me.center.x - me.radius)
	.attr('y1', me.num_tools * me.shift)
	.attr('x2', me.center.x + me.radius)
	.attr('y2', me.num_tools * me.shift);	*/

/*delete_hold.append('circle')
	.attr('cx', me.center.x)
	.attr('cy', me.num_tools * me.shift)
	.attr('r', me.radius)
	.style('stroke', selectColor);

delete_hold.append('line')
	.attr('x1', me.center.x - me.radius)
	.attr('y1', me.num_tools * me.shift)
	.attr('x2', me.center.x + me.radius)
	.attr('y2', me.num_tools * me.shift)
	.style('stroke', selectColor);*/
	
//select_hold.select('rect').style('stroke', 'black');

toolbar buttons
//add reset, submit and undo buttons at the bottom of the toolbar	
var div = d3.select('body').append('div');
//div.append('button').text('Reset')
//div.append('button').text('Submit')
//div.append('button').text('Undo')
//	.on('click', me.undo);
	
//div.append('button').text('Delete')	
//div.append('button').text('Text')
//	.on('click', me.toggleLabels); 

confirm report example assertions
net.draw({}, { entity1: "A", relationship: "E", entity2: "B" });
net.draw({}, { entity1: "b", relationship: "e", entity2: "c" });
net.draw({}, { entity1: "b", relationship: "e", entity2: "f" });
net.draw({}, { entity1: "B", relationship: "E", entity2: "C" });


draw.js combined into me.deleteItem
me.deleteNode = function(t){
	var index = me.circles.indexOfObj(d3.select(t).attr('class'),
		'class');
	var group = me.circles[index].group;
	d3.selectAll('.canvas line').each(function(){
		var line_index = me.lines.indexOfObj(d3.select(this).attr('class'),
				'class');
		var l = me.lines[line_index];
		
		if (l.source === me.circles[index].html || 
				l.target === me.circles[index].html){
			me.lines.splice(line_index,1);
			d3.select(this.parentNode).remove();
		}
	});
	
	me.circles.splice(index, 1);
	d3.select(t).remove();

	var cIndicies = me.extractCircles(group);
	me.separateGroups(cIndicies);
	
	d3.selectAll('.canvas line').each(function(){
		var line_index = me.lines.indexOfObj(d3.select(this).attr('class'),
				'class');
		var l = me.lines[line_index];
		
		var cSvg1 = d3.select(l.source);
		var cSvg2 = d3.select(l.target);
		
		var cObj1 = me.circles[me.circles.indexOfObj(cSvg1.attr('class'),
				'class')];
		var cObj2 = me.circles[me.circles.indexOfObj(cSvg2.attr('class'),
				'class')];
		
		me.alterNodeColor('entity1', cObj1);
		cSvg1.style('fill', cObj1.color);
		
		me.alterNodeColor('entity2', cObj2);
		cSvg2.style('fill', cObj2.color);
	});
};

me.deleteLink = function(t){
	var group;
	var index = me.lines.indexOfObj(d3.select(t).attr('class'),
				'class');
	var cHtml = me.lines[index].source;
	for (var i = 0; i < me.circles.length; i++){
		if (me.circles[i].html === cHtml){
			group = me.circles[i].group;
		}
	}
	
	me.lines.splice(index,1);
	d3.select(t.parentNode).remove();
	
	var cIndicies = me.extractCircles(group);
	me.separateGroups(cIndicies);
	
	d3.selectAll('.canvas line').each(function(){
		var line_index = me.lines.indexOfObj(d3.select(this).attr('class'),
				'class');
		var lObj = me.lines[line_index];
		
		var cSvg1 = d3.select(lObj.source);
		var cSvg2 = d3.select(lObj.target);
		
		var cObj1 = me.circles[me.circles.indexOfObj(cSvg1.attr('class'),
				'class')];
		var cObj2 = me.circles[me.circles.indexOfObj(cSvg2.attr('class'),
				'class')];
		
		me.alterNodeColor('entity1', cObj1);
		cSvg1.style('fill', cObj1.color);
		
		me.alterNodeColor('entity2', cObj2);
		cSvg2.style('fill', cObj2.color);
	});
};

problematic drag function tests
//these are all used as callback in draw.js... (with this keyword)
describe('the movement functions', function(){
	it('the move function in mover_hold mode', function(){
		test_draw.tool_mode.setMode('mover_hold');
		
		spyOn(test_draw.circles, 'indexOfObj').andCallThrough();
		spyOn(test_draw, 'extractCircles').andCallThrough();
		spyOn(test_draw, 'dragGroup').andCallThrough();
		
		
	});
	
	it('the move function in select_hold mode', function(){
		test_draw.tool_mode.setMode('select_hold');
		
		spyOn(test_draw.circles, 'indexOfObj').andCallThrough();
		spyOn(test_draw, 'extractCircles').andCallThrough();
		spyOn(test_draw, 'dragGroup').andCallThrough();
	});
	
	it('the dragGroup function', function(){
	
	});
	
	it('the dragstart function', function(){
	
	});
	
	it('the drag function', function(){
	
	});
	
	it('the dragend function', function(){
		spyOn(d3, 'select').andCallThrough();
		test_draw.tool_mode.setMode('');
		d3.select('.csvg').call(test_draw.dragend);
		expect(d3.select).not.toHaveBeenCalledWith('.selection');
		
		test_draw.tool_mode.setMode('select_hold');
		d3.select('.csvg').call(test_draw.dragend);
		expect(d3.select).toHaveBeenCalled();
	});
});	

confirmer.js

$.getJSON(url + 'target_event/?callback=?', function(events){
	if (events[0] !== undefined){
		me.target_events = events;
		for ( var i = 0; i < events.length; i++ ) {
			d3.select('.patterns')
				.append('option')
				.text(events[i]._id);
		}
		me.curr_te_id = events[0]._id;
		me.getTargetAssertions(events[0]._id);
	}
});

$.getJSON(url + 'target_assertion/?callback=?', function(asserts){
	for ( var i = 0; i < asserts.length; i++ ) {
		var a = asserts[i];
		if ( event.assertions.indexOf(a._id.toString()) !== -1 ) {
			me.target_assertions.push(a);
			
			maxX = Math.max(maxX, a.entity1[0].x);
			maxY = Math.max(maxY, a.entity1[0].y);
			
			if (a.entity2[0] !== undefined){
				maxX = Math.max(maxX, a.entity2[0].x);
				maxY = Math.max(maxY, a.entity2[0].y);
			}
		}
	}
	me.displayTargetEventInfo(event);
		me.te_view.draw(me.target_assertions, maxX, maxY);
});

$.getJSON(url +'assertion/?callback=?', function(asserts){
	me.assertions = asserts;
	var assertions = [];
	me.curr_assert_ids = [];
	for (var i = 0; i < asserts.length; i++){
		if (asserts[i].alpha_report_id === ar_id){
			assertions.push(asserts[i]);
			me.curr_assert_ids.push(asserts[i]._id);
		}
	}
	
	me.svg_asserts.remove();
	me.svg_asserts = d3.select('.asserts')
		.append('svg')
		.attr('width', me.width)
		.attr('height', me.height);
	
	me.svg_asserts.append('g')
		.attr('class', 'node-link-container');
			
	if (assertions.length !== 0){
		var net = new network(me.svg_asserts, assertions, false);
		net.draw();
	} 
});