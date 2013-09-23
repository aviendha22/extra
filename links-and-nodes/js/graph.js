//Wrap all of this in a function to get easy access to the chart on the right panel
function LinksAndNodeGraph($scope){

//This controls the labels checkbox
$scope.labels = true;

/*
 * For keeping track of the graph data, and which graphs have been drawn already.
 */
var queryData = {links: [], nodes: [], force: false, circle: false};

//Object to hold all of the force atlas specific options
var forceGraphOptions = {};

//Objects to contain the graph specific data
var forceGraphData = {};
var circleGraphData = {};

//Object to hold the circle graph options
var circleGraphOptions = {};

//Options for the circle graph
circleGraphOptions.diameter = 700;
circleGraphOptions.radius = circleGraphOptions.diameter / 2;
circleGraphOptions.innerRadius = circleGraphOptions.radius - 120;
circleGraphOptions.padding = 50;
circleGraphOptions.tension = 0.85;

var shiftKey, g, zoom;

//Graph algorithm variables
forceGraphOptions.friction = 0.9;
forceGraphOptions.gravity = 0.1;
forceGraphOptions.linkStrength = 1;
forceGraphOptions.charge = -360;
//The default length of the links
forceGraphOptions.linkDistance = 150;
//The radius of the circles drawn for each node
forceGraphOptions.r = 10;
//How curvy the links are. The smaller the number, the more curvy
forceGraphOptions.radiusFactor = 1;
//The time until the force atlas simulation stops moving in milis
forceGraphOptions.timeout = 5000;
//Only draw the map once
var mapDrawn = false;

//The base address of the TitanDB server
var titanAddress = 'http://everest-build:8182';

var height = 800;

//The current tab
var tab = 'Directed';

///////////////////////////////////
// Map Stuff!!!
//d3.select(window).on("resize", throttle);

$scope.$watch("currentTab.value", function(val){
    tab = val;
    if(val === "Map" && !mapDrawn){
        mapDrawn = true;
        $scope.showMap();
    }
    if(val === "Circle"){
        //Check if we need to draw the circle graph
        if(!queryData.circle && queryData.nodes.length > 0){
            queryData.circle = true;
            $scope.showCircleGraph(queryData.nodes, queryData.links);
        } else if(queryData.nodes.length == 0){
            //Empty the circle graph
            $("#circle").empty();
        } else {
            $scope.updateSelections();
        }
    }
    if(val === "Directed"){
        //Check if we need to draw the directed graph
        if(!queryData.force && queryData.nodes.length > 0){
            queryData.force = true;
            $scope.showForceAtlas(queryData.nodes, queryData.links);
        } else if(queryData.nodes.length == 0) {
            //Clear the graph
            $("#graph").empty();
        } else {
            $scope.updateSelections();
        }
    }
}, false);
	
$scope.showMap = function() {
    // The area is 65% of the window width
    var width = $(window).width() * 0.65;

    var projection = d3.geo.equirectangular()
        .center([-74, 41])
        .scale(2500)
        .rotate([0,0]);

    zoom = d3.behavior.zoom()
        .scaleExtent([1, 8])
        .on("zoom", move);
        
    var path = d3.geo.path()
        .projection(projection);

    var point = $('#circleLat').val()+','+$('#circleLon').val();
    var radius = $('#circleRadius').val();
    
    var vertOnly = $("#vert").is(':checked');

    $.getJSON($scope.buildQuery(point, radius, vertOnly), function(data){
        if(!data || !data.success){
            alert('Query was not successful');
            return;
        }
        
        /*
         * In this case, the results array is an array or arrays of node, link, node objects.
         * There will be repeated vertices! maybe edges!
         */
        var nodesById = [];
        var nodes = [];
        var edges = [];
        var edgesById = {};
        
        data.results.forEach(function(first){
            $scope.buildLinksNodes(first, nodes, edges, nodesById, edgesById);
        });
		
		// different svg
		$("#map").empty();
		var svg = d3.select("#map").style("background-color", "black");
		g = svg.append("g")
			.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
			.call(zoom);   
			
		// load and display the World
		d3.json("json/world-50m.json", function(error, topology) {
            if(error){
                return;
            }

			g.selectAll("path")
			  .data(topojson.feature(topology, topology.objects.countries)
				  .features)
			.enter()
			  .append("path")
			  .attr("d", path).style("fill", "#073e05").style("stroke", "Lime");

			//point test
			//var data = [{lat : 45.0, lon : -75.0}];
			
			g.selectAll("circle")
				.data(nodes)
				.enter()
				.append("circle")
				.attr("cx",function(d) {
					return projection([d.Lon,d.Lat])[0];
				})
				.attr("cy",function(d) {
					return projection([d.Lon,d.Lat])[1];
				})
				.attr("r",1)
				.style("fill","red")
				.style('opacity', .15)
				.style('stroke-width',0);
				//.style("background",null);
		});
		
        //Try and clean up some
        nodesById = null;
        edgesById = null;
    });
}

function redraw() {
	//width = document.getElementById('svg2').offsetWidth-60;
	//height = width / 2;
	//d3.select('svg2').remove();
	//setup(width,height);
	//draw(topo);
	$scope.showMap();
}

function move() {
	var t = d3.event.translate;
	var s = d3.event.scale;  
	var h = height / 3;
	
	t[0] = Math.min(height / 2 * (s - 1), Math.max(height * (1 - s), t[0]));
	t[1] = Math.min(height / 2 * (s - 1) + h * s, Math.max(height * (1 - s) - h * s, t[1]));
	
	zoom.translate(t);
	g.style("stroke-width", 1 / s).attr("transform", "translate(" + t + ")scale(" + s + ")");
}

var throttleTimer;
function throttle() {
	window.clearTimeout(throttleTimer);
	throttleTimer = window.setTimeout(function() {
		redraw();
	}, 200);
}

////////////////////////////////////////////

//$(document).ready(function(){
//	//Load the map
//});

//Gets all the vertices and edges within a circular AOI
$scope.buildQuery = function(start, end, name, vertOnly){
	var query;
	if (name === 'alpha report'){
		query = titanAddress+'/graphs/graph/tp/gremlin?script=g.V.has("name","' + name + '")[' + start + '..' + end + '].inE.outV.outE.inV.path';
	} else {
		query = titanAddress+'/graphs/graph/tp/gremlin?script=g.V.has("name","' + name + '")[' + start + '..' + end + '].out.in.outE.inV.path';
	}

    console.log(query);
    return query;
}

$scope.buildKeyValueQuery = function(key, value){
	return titanAddress+'/graphs/graph/tp/gremlin?script=g.V.has("' + key + '","' + value + '")[0..10]';
};
/*
Bounding box query (For later)
g.query().has("Geo_Loc",com.thinkaurelius.titan.core.attribute.Geo.WITHIN,com.thinkaurelius.titan.core.attribute.Geoshape.box(40.75,-73.99,40.77,-73.98)).vertices().collect{[it.id,it.Code,it.name]}
box constructor is (southWestLat, southWestLon, northEastLat, northEastLon)
*/

//Querys for N hops from a specific vertex
$scope.buildVertexQuery = function(id, dir, hops){
	//var a = titanAddress+"/graphs/graph/vertices/"+id+"/tp/gremlin?script=v.as('x').inE.outV.loop('x'){it.loops<="+hops+"}.path";
	var a = titanAddress+"/graphs/graph/vertices/"+id+"/tp/gremlin?script=v.";
	a = dir === 'in' ? a + 'inE.outV.path' : a + 'outE.inV.path';
	console.log(a);
    return a;
}

//A vertex titan sample - IE, links and nodes based on 1 node
$scope.showVertexQuery = function(){
    var id = $('#vertexId').val();
    var hops = $('#hops').val();
    
    if(isNaN(id) || isNaN(hops)){
        return;
    }

    //In this case, the results array is an array of node, link, node objects.
    //There will be repeated vertices!
    var nodesById = [];
    var nodes = [];
    var edgesById = [];
    var edges = [];
    $.getJSON($scope.buildVertexQuery(id, 'in', 1), function(data){
        if(!data || !data.success){
            alert('Query was not successful');
            return;
        }

        data.results.forEach(function(d){
            $scope.buildLinksNodes(d, nodes, edges, nodesById, edgesById);
        });
        
		$.getJSON($scope.buildVertexQuery(id, 'out', 2), function(data){
	        if(!data || !data.success){
	            alert('Query was not successful');
	            return;
	        }
	
	        data.results.forEach(function(d){
	            $scope.buildLinksNodes(d, nodes, edges, nodesById, edgesById);
	        });
	        
	        //Try and clean up some
	        nodesById = null;
	        edgesById = null;
	        
	        queryData.links = edges;
	        queryData.nodes = nodes;
	
	        //Determine which graph to load
	        if(tab == 'Directed'){
	            $scope.showForceAtlas(nodes, edges);
	            queryData.force = true;
	            queryData.circle = false;
	        } else if(tab == 'Circle') {
	            $scope.showCircleGraph(nodes, edges);
	            queryData.force = false;
	            queryData.circle = true;
	        }
	   	 });
    });
    
     
}

//A full titan query - gets all links+nodes within a circular AOI
$scope.showQuery = function(){
	var name = $('#nameSearch').val();
    var start = $('#nodeStart').val();
    var end = $('#nodeEnd').val();
    if(isNaN(start) || isNaN(end) || name === undefined){
        return;
    }

    var vertOnly = $("#vert").is(':checked');
	
	// In this case, the results array is an array or arrays of node, link, node objects.
 	// There will be repeated vertices! maybe edges!
    var nodesById = [];
    var nodes = [];
    var edges = [];
    var edgesById = {};
	
	$.ajax({
		type: 'GET',
		url: $scope.buildQuery(start, end, name, vertOnly),
		dataType: 'application/json',
		success: function(r){ console.log(r); },
		error: function(e){
			var data = JSON.parse(e.responseText);
			if (data.message !== undefined){
			    alert('Query was not successful');
	            return;
	        }
	        
	        data.results.forEach(function(first){
	            $scope.buildLinksNodes(first, nodes, edges, nodesById, edgesById);
	        });
	
	        //Try and clean up some
	        nodesById = null;
	        edgesById = null;
	        
	        queryData.links = edges;
	        queryData.nodes = nodes;
	        queryData.force = true;
	        queryData.circle = false;
	
	        //Figure out which graph to load
	        if(tab == 'Directed'){
	            $scope.showForceAtlas(nodes, edges);
	            queryData.force = true;
	            queryData.circle = false;
	        } else if(tab == 'Circle') {
	            $scope.showCircleGraph(nodes, edges);
	            queryData.force = false;
	            queryData.circle = true;
	        }
		}
	});

}

/**
 * This function builds the links and nodes arrays from a Titan query
 * 
 */
$scope.buildLinksNodes = function(input, nodes, edges, nodesById, edgesById){
    if($.isArray(input)){
        /*
         * We need to loop twice. The first time is to make sure we know all of the nodes,
         * the 2nd time is to check for all of the vertices.
         * If all of the elements are arrays, the 2nd loop just wastes cycles.
         */
        input.forEach(function(d){
            //Nested arrays, do this again
            if($.isArray(d)){
                d.forEach(function(e){
                    $scope.buildLinksNodes(e, nodes, edges, nodesById, edgesById);
                });
            } else {
                //Check if its a known vertex or not
                if(d._type == 'vertex' && !nodesById[d._id]){
                    nodesById[d._id] = d;
                    nodes.push(d);
                }
            }
        });
        //Loop to check for vertices
        input.forEach(function(d){
            //Skip this loop for arrays
            if(!$.isArray(d)){
                if(d._type == 'edge' && !edgesById[d._id]){
                    edgesById[d._id] = true;
                    //TODO: This is specific to our sample data
                    d.Type = d.Route;
                    //The source and target elements need to be
                    // references to the full vertices
                    d.source = nodesById[d._outV];
                    d.target = nodesById[d._inV];
                    edges.push(d);
                }
            }
        });
    } else {
        //A single element
        //Check if its a new link or node
        if(input._type == 'vertex' && !nodesById[input._id]){
            nodesById[input._id] = input;
            nodes.push(input);
        } else if(input._type == 'edge' && !edgesById[input._id]){
            edgesById[input._id] = true;
            //TODO: This is specific to our sample data
            input.Type = input.Route;
            //The source and target elements need to be
            // references to the full vertices
            input.source = nodesById[input._outV];
            input.target = nodesById[input._inV];
            edges.push(input);
        }
    }
}    

//Generic graph of the gods graph
$scope.loadGods = function(){
    $.getJSON('json/gods.json', function(data){
        var nodes = [];
        var edges = [];
        //Prepare the nodes
        var len = data.vertices.length;
        for(var i =0; i < len; i++){
            var cur = data.vertices[i];
            cur.selected = false;
            cur.color = data.colors[cur.Type];
            nodes[cur._id] = cur;
        }
        //Prepare the edges
        len = data.edges.length;
        for(var i=0; i < len; i++){
            var cur = data.edges[i];
            var edge = {};
            edge.Type = cur.label;
            edge.source = nodes[cur.out];
            edge.target = nodes[cur.input];
            edge.color = data.colors[cur.label];
            edges[i] = edge;
        }
        
        queryData.links = edges;
        queryData.nodes = nodes;

        //Figure out which graph to load
        if(tab == 'Directed'){
            $scope.showForceAtlas(nodes, edges);
            queryData.force = true;
            queryData.circle = false;
        } else if(tab == 'Circle') {
            $scope.showCircleGraph(nodes, edges);
            queryData.force = false;
            queryData.circle = true;
        }
    });
}

/**
 * Displays a force atlas graph with the provided nodes and edges.
 * Required information:
 * Node objects:
 *      name - the name to be shown
 *      color - the color to fill the circle (Hex)
 *      x - RESERVED
 *      y - RESERVED
 *
 * Edge/Link objects:
 *      Type - the label when you mouse over
 *      source - A reference to the full source node
 *      target - A reference to the full target node
 *      color - the color to draw the link
 */
$scope.showForceAtlas = function(nodes, edges){

    //Set the key events on the body
    d3.select('body')
        .on("keydown.brush", $scope.keydown)
        .on("keyup.brush", $scope.keyup);

    //Clear the SVG
    $scope.clearGraph(true);
    //Show the counts
    $scope.showCounts(nodes.length, edges.length);
    var date = new Date();
    forceGraphData.date = date;

    var svg = d3.select("#graph");
    
    // The area is 65% of the window width
    var width = $(window).width() * 0.65;

    forceGraphData.force = d3.layout.force()
        .linkStrength(forceGraphOptions.linkStrength)
        .friction(forceGraphOptions.friction)
        .gravity(forceGraphOptions.gravity)
        .charge(forceGraphOptions.charge)
        .linkDistance(forceGraphOptions.linkDistance)
        .size([width,height]);

    forceGraphData.force.nodes(nodes);
    forceGraphData.nodes = forceGraphData.force.nodes();
    forceGraphData.force.links(edges);
    
    //Display everything
    svg.append("svg:defs").selectAll("marker")
        .data(['node'])
      .enter().append("svg:marker")
        .attr("id", String)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 2* forceGraphOptions.r) //2* the size of the circle, so its easily visible
        .attr("refY", -1.5)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
      .append("svg:path")
        .attr("d", "M0,-5L10,0L0,5");

    var brush = svg.append("g")
        .datum(function() { return {selected: false, previouslySelected: false}; })
        .attr("class", "brush");

    //The links
    forceGraphData.links = svg.append("svg:g").selectAll("path")
        .data(forceGraphData.force.links())
      .enter().append("svg:path")
        .attr("class", "link node")
        .attr("marker-end", "url(#node)")
        .attr("stroke", function(d){
            if(d.color){
                return d.color;
            } else {
                return '#666'
            }
        });
    
    //Attach a title thats visible when you hover
    forceGraphData.links.append('svg:title')
        .text(function(d){ return d.Type;});

    forceGraphData.circle = svg.append("svg:g").selectAll("circle")
        .data(forceGraphData.force.nodes())
        .enter().append("svg:circle")
        .attr("r", forceGraphOptions.r)
        .attr("fill", function(d){
        	console.log(d); 
            if(d.color){
                return d.color;
            } else {
                return '#555555';
            }})
        .attr("stroke", function(d){ 
            if(d.color){
                return d.color;
            } else {
                return '#555555';
            }})
        .on("mousedown", function(d) {
            if (!d.selected) { // Don't deselect on shift-drag.
                if (!shiftKey) forceGraphData.circle.classed("selected", function(p) { 
                        p.selected = d === p;
                        $scope.gridNodes.selectItem($scope.nodes.indexOf(p), p.selected);
                        return p.selected; });
                    else {
                        d3.select(this).classed("selected", d.selected = true);
                        $scope.gridNodes.selectItem($scope.nodes.indexOf(d), true);
                    }
                    $scope.safeApply();
                }
            })
        .on("mouseup", function(d) {
            if (d.selected && shiftKey) d3.select(this).classed("selected", d.selected = false);
            $scope.gridNodes.selectItem($scope.nodes.indexOf(d), true);
            $scope.safeApply();
        })
        .call(d3.behavior.drag()
        .on("drag", function(d) { $scope.nudge(d3.event.dx, d3.event.dy); }));

    //Give the nodes some hover over text
    forceGraphData.circle.append('svg:title')
        .text(function(d){ return d.name; });

    forceGraphData.text = svg.append("svg:g").selectAll("g")
        .data(forceGraphData.force.nodes())
        .enter().append("svg:g");

    // A copy of the text with a thick white stroke for legibility.
    forceGraphData.text.append("svg:text")
        .attr("x", 10)
        .attr("y", ".31em")
        .attr("class", "force-shadow")
        .text(function(d) { return d.name; });

    //The actual text
    forceGraphData.text.append("svg:text")
        .attr("x",10)
        .attr("y", ".31em")
        .attr('class','force-text')
        .text(function(d) { return d.name; });
    
    //The "brush"- aka when you click and drag
    brush.call(d3.svg.brush()
        .x(d3.scale.identity().domain([0, width]))
        .y(d3.scale.identity().domain([0, height]))
        .on("brushstart", function(d) {
          forceGraphData.circle.each(function(d) { d.previouslySelected = shiftKey && d.selected; });
        })
        .on("brush", function() {
          var extent = d3.event.target.extent();
          forceGraphData.circle.classed("selected", function(d) {
            d.selected = d.previouslySelected ^
                (extent[0][0] <= d.x && d.x < extent[1][0]
                && extent[0][1] <= d.y && d.y < extent[1][1]);
            $scope.gridNodes.selectItem($scope.nodes.indexOf(d), d.selected);
            return d.selected;
          });
          $scope.safeApply();
        })
        .on("brushend", function() {
          d3.event.target.clear();
          d3.select(this).call(d3.event.target);
        }));
    
    //Hide the labels during the animation
    forceGraphData.text.attr('visibility', 'hidden');
    
    //Start it
    forceGraphData.force.start();
    
    forceGraphData.force.on("tick", function() {
        // Use elliptical arc path segments to doubly-encode directionality.
        forceGraphData.links.attr("d", function(d) {
        var dx = d.target.x - d.source.x,
            dy = d.target.y - d.source.y,
            dr = $scope.radius(dx, dy);
        return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
        });

        forceGraphData.circle.attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";
        });

        forceGraphData.text.attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";
        });
    });
    
    //Stop the movement in timeout sec
    setTimeout(function(){
        $scope.stopMovement(date);
    }, forceGraphOptions.timeout);

    $scope.nodes = nodes;
    $scope.safeApply();
    $scope.updateSelections();
}

/*
 * Shows a circle graph.
 * The input format is the same as the showForceAtlas function
 */
$scope.showCircleGraph = function(origNodes, origEdges){
    //Set the diameter to the min of width or height - 200
    // The area is 65% of the window width
    var width = $(window).width() * 0.65;

    var radius = Math.min(width, height) - 200;

    //Clear the old graph
    $scope.clearGraph(true);

    //Set the key events on the body
    d3.select('body')
        .on("keydown.brush", $scope.keydown)
        .on("keyup.brush", $scope.keyup);

    var parent = {};
    parent.name = "";
    parent.children = [];

    //Show the counts
    $scope.showCounts(origNodes.length, origEdges.length);

    //We need a copy, or else the graphs will conflict
    var map = [];
    var nodes = [];
    var edges = [];

    origNodes.forEach(function(d){
        var tmp = {};
        tmp.name = d.name;
        tmp._id = d._id;
        tmp.color = d.color;
        tmp.parent = parent;
        tmp.full = d;
        map[d._id] = tmp;
        nodes.push(tmp);
    });

    origEdges.forEach(function(d){
        var tmp = {};
        tmp.source = map[d.source._id];
        tmp.target = map[d.target._id];
        tmp.color = d.color;
        tmp.full = d;
        edges.push(tmp);
    });

    //Cleanup
    map = null;
    parent.children = nodes;

    var cluster = d3.layout.cluster()
        .size([360, circleGraphOptions.innerRadius])
        .sort(null)
        .value(function(d) { return d.size; });

    var nodes = cluster.nodes(parent);

    var svg = d3.select("#circle")
        .append("g")
        .attr("transform", "translate(" +
            (width / 2) + "," +
            (400) + ")");

    var bundle = d3.layout.bundle();
    var links = bundle(edges);

    var line = d3.svg.line.radial()
        .interpolate("bundle")
        .tension(circleGraphOptions.tension)
        .radius(function(d) { return d.y; })
        .angle(function(d) { return d.x / 180 * Math.PI; });

    circleGraphData.links = svg.selectAll(".link")
        .data(links)
        .enter().append("path")
        .attr('class', 'circle-link')
        .attr("d", line);

    circleGraphData.labels = svg.selectAll(".node")
        .data(nodes)
        .enter().append("g")
        .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })
        .append("text")
        .attr("dx", function(d) { return d.x < 180 ? 8 : -8; })
        .attr("dy", ".31em")
        .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
        .attr("transform", function(d) { return d.x < 180 ? null : "rotate(180)"; })
        .text(function(d) { return d.name; })
        .on("click", function(d){
            if(shiftKey){
                circleGraphData.labels.classed("circle-selected", function(p) {
                    if(p.selected){
                        p.selected = p !== d;
                    } else {
                        p.selected = p === d;
                    }
                    //Set the grid
                    $scope.gridNodes.selectItem($scope.nodes.indexOf(p.full), p.selected);
                    return p.selected;
                });
            } else {
                circleGraphData.labels.classed("circle-selected", function(p){
                    p.selected = p == d;
                    $scope.gridNodes.selectItem($scope.nodes.indexOf(p.full), p.selected);
                    return p.selected;
                })
            }
            //Color the links
            circleGraphData.links.classed("selected", function(p){
                return p[0].selected || p[2].selected;
            });
            $scope.safeApply();
        });

    circleGraphData.labels.append("svg:title")
        .text(function(d){ return d.name; });

    $scope.nodes = origNodes;
    $scope.safeApply();
    $scope.updateSelections();
}

//Captures the shift and arrow keys
$scope.keydown = function() {
    if (!d3.event.metaKey) switch (d3.event.keyCode) {
        case 38: $scope.nudge( 0, -1); break; // UP
        case 40: $scope.nudge( 0, +1); break; // DOWN
        case 37: $scope.nudge(-1,  0); break; // LEFT
        case 39: $scope.nudge(+1,  0); break; // RIGHT
    }
    shiftKey = d3.event.shiftKey || d3.event.metaKey;
}

$scope.keyup = function() {
    shiftKey = shiftKey && !(d3.event.shiftKey || d3.event.metaKey);
}

$scope.nudge = function(dx, dy) {
  //Check that the data exists
  if(!forceGraphData.circle){
    return;
  }
  forceGraphData.circle.filter(function(d) { return d.selected; })
      .attr("transform", function(d) {
            d.x = d.x + dx/2;
            d.y = d.y + dy/2;
            return "translate(" + d.x + "," + d.y+ ")";
            });

  forceGraphData.text.filter(function(d){ return d.selected; })
    .attr("transform", function(d){
        d.x = d.x + dx/2;
        d.y = d.y + dy/2;
        return "translate("+ d.x +","+d.y+")";
        });

  forceGraphData.links.filter(function(d) { return d.source.selected; })
    .attr("d", function(d) {
        var dx = d.target.x - d.source.x,
            dy = d.target.y - d.source.y,
            dr = $scope.radius(dx, dy);
        return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
        });

  forceGraphData.links.filter(function(d) { return d.target.selected; })
    .attr("d", function(d) {
        var dx = d.target.x - d.source.x,
            dy = d.target.y - d.source.y,
            dr = $scope.radius(dx, dy);
        return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
        });
}

//Stops/starts the movement
//There are some odd issues with restarting it - but its never called now anyway
$scope.stopMovement = function(date){
    if(forceGraphData.force && forceGraphData.date === date){
        forceGraphData.force.linkStrength(0);
        forceGraphData.force.friction(0);
        forceGraphData.force.gravity(0);
        forceGraphData.force.stop();
        //Turn labels on if they are enabled
        $scope.toggleLabels();
    }
}

//Fills the count divs with the counts
$scope.showCounts = function(nodeCount, linkCount){
    $("#nodeCount").text(nodeCount+" total nodes");
    $("#linkCount").text(linkCount+" total links");
}

// Currently this only puts a list of the selected nodes in the right pane
/*
$scope.showSelected = function(){
    if(tab == 'Directed' && forceGraphData.circle){
        forceGraphData.circle.filter(function(d) {return d.selected;})
        .call(function(d){
            /*
             * In this function, d is an array of an array of the circle nodes.
             * Once you get to a circle node, the data it was created from can be accessed
             * via the __data__ element
             * /
            $scope.nodes = [];
            var array = d[0];
            var tmp = null;
            for(var i =0; i < array.length; i++){
                var data = array[i].__data__;
                tmp = {};
                tmp.id = data._id;
                tmp.name = data.name;
                $scope.nodes.push(tmp);
            }
        });
    } else if(tab == 'Circle' && labels){
        circleGraphData.labels.filter(function(d){ return d.selected;})
        .call(function(d){
            //See comment from block above
            $scope.nodes = [];
            var array = d[0];
            var tmp = null;
            for(var i =0; i < array.length; i++){
                var data = array[i].__data__;
                tmp = {};
                tmp.id = data._id;
                tmp.name = data.name;
                $scope.nodes.push(tmp);
            }
        });
    }
}
*/

//Function to calculate the radius used for drawing the curved links
$scope.radius = function(dx, dy){
    return forceGraphOptions.radiusFactor * Math.sqrt(dx * dx + dy* dy);
}

$scope.clearGraph = function(saveData){
    if(tab == 'Directed'){
        $("#graph").empty();
        if(forceGraphData.force){
            forceGraphData.force.stop();
        }
    }
    if(tab == 'Circle'){
        $("#circle").empty();
    }
    if(!saveData){
        //Clear the queried data
        queryData.nodes = [];
        queryData.links = [];
        queryData.force = false;
        queryData.circle = false;
        //Clear all graph-specific data
        forceGraphData = {};
        circleGraphData = {};

        //Clear the counts
        $("#nodeCount").empty();
        $("#linkCount").empty();
        //Clear the chart on the right
        $scope.nodes = [];
        $scope.safeApply();
    }
}

//Gets the value of the curve factor, and applies it to all the curves
$scope.redrawLinks = function(){
    var val = $("#factor").val();
    if(isNaN(val)){
        return;
    }
    forceGraphOptions.radiusFactor = val;
    if(forceGraphData.links){
        forceGraphData.links.attr("d", function(d) {
            var dx = d.target.x - d.source.x,
                dy = d.target.y - d.source.y,
                dr = $scope.radius(dx, dy);
            return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
            });
    }
}

//hides or shows the vertex labels
$scope.toggleLabels = function(){
    //Dont try anything if there is no graph yet
    if(!forceGraphData.text){
        return;
    }

    if($("#labels").is(':checked')){
        forceGraphData.text.attr('visibility','visible');
    } else {
        forceGraphData.text.attr('visibility','hidden');
    }
}

//This will set the currently selected ID to the vertex ID box, and run the vertex query
$scope.queryLinks = function(){
    if(tab == 'Directed' && forceGraphData.circle){
        forceGraphData.circle.filter(function(d){ return d.selected; })
            .call(function(d){
                var array = d[0];
                if(array.length != 1){
                    alert('Can only query links from one node');
                    return;
                }
                var data = array[0].__data__;
                
                $("#vertexId").val(data._id);
                $scope.showVertexQuery();
            });
    } else if(tab == 'Circle' && circleGraphData.labels){
        circleGraphData.labels.filter(function(d){ return d.selected; })
            .call(function(d){
                var array = d[0];
                if(array.length != 1){
                    alert('Can only query links from one node');
                    return;
                }
                var data = array[0].__data__;
                
                $("#vertexId").val(data._id);
                $scope.showVertexQuery();
            });
    }
}

//Called when an item in the grid is selected
$scope.select = function(item){
    if(tab === 'Directed'){
        forceGraphData.circle.classed("selected", function(d){
            return d.selected = d.selected || d._id == item._id;
        });
    } else if(tab === 'Circle'){
        circleGraphData.labels.classed("circle-selected", function(p) { return p.selected = p.selected || item._id === p._id; });
        //Update the links
        circleGraphData.links.classed("selected", function(p){
            return p[0].selected || p[2].selected;
        });
    }
}

//Called when an item in the grid is deselected
$scope.deselect = function(item){
    if(tab === 'Directed'){
        forceGraphData.circle.classed("selected", function(d){
            return d.selected = d.selected && d._id != item._id;
        });
    } else if(tab === 'Circle'){
        circleGraphData.labels.classed("circle-selected", function(p) { return p.selected = p.selected && (item._id != p._id); });
        //Update the links
        circleGraphData.links.classed("selected", function(p){
            return p[0].selected || p[2].selected;
        });
    }
}

//Used to make the selections in the graph match the selections in the grid
$scope.updateSelections = function(){
    if(tab === 'Directed' && forceGraphData.circle){
        forceGraphData.circle.classed("selected", function(d){
            d.selected = $scope.gridNodes.selectedItems.indexOf(d) >= 0;
            return d.selected;
        });
        forceGraphData.force.tick();
    } else if(tab === 'Circle' && circleGraphData.labels){
        circleGraphData.labels.classed("circle-selected", function(d) {
            d.selected = $scope.gridNodes.selectedItems.indexOf(d.full) >= 0
            return d.selected;
        });
        //Update the links
        circleGraphData.links.classed("selected", function(p){
            return p[0].selected || p[2].selected;
        });
    }
}

$scope.setAll = function(value){
    if(tab == 'Directed' && forceGraphData.circle){
        forceGraphData.circle.classed("selected", function(d){
            $scope.gridNodes.selectItem($scope.nodes.indexOf(d), value);
            return d.selected = value;
        });
    } else if(tab == 'Circle' && circleGraphData.labels){
        circleGraphData.labels.classed("circle-selected", function(d){
            $scope.gridNodes.selectItem($scope.nodes.indexOf(d.full), value);
            return d.selected = value;
        });
        //Update the links
        circleGraphData.links.classed("selected", value);
    }
}

}
