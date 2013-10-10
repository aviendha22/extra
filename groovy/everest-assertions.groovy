import groovy.json.JsonSlurper;

try {
	a1
} catch (MissingPropertyExceptionmpe){
	println "Please provide a json file for the database"
	System.exit(0);
}

try {
	a2
} catch (MissingPropertyExceptionmpe){
	println "Please provide a directory for the database"
	System.exit(0);
}

String fileContents = new File(a1).text;

def assertions = new JsonSlurper().parseText(fileContents);
def metadata = assertions.get('metadata');
def vertices = assertions.get('vertices');
def edges = assertions.get('edges');

TitanGraph graph = TitanFactory.open(a2);

for (int i = 0; i < metadata.size(); i++){
	Vertex v = graph.addVertex(null);
	def keys = metadata[i].keySet();
	keys.each{
		v.setProperty(it, metadata[i].get(it));
	}
	println v.id;
	metadata[i]._titan_id = v.id;
}
println 'finished with metadata'

for (int i = 0; i < vertices.size(); i++){
	Vertex v = graph.addVertex(null);
	def keys = vertices[i].keySet();
	keys.each{
		v.setProperty(it, vertices[i].get(it));
	}
	vertices[i]._titan_id = v.id;
	println v.id;	
	for (int j = 0; j < metadata.size(); j++){
		if (vertices[i].get('mongo_ar_id') == metadata[j].get('mongo_ar_id')){
			graph.v(v.id).addEdge('metadata of', graph.v(metadata[j]._titan_id));
		}
	}
}
println 'finished with vertices'

for (int i = 0; i < edges.size(); i++){
	def keys = edges[i].keySet();
	edges[i].source = vertices[edges[i].source]._titan_id;
	edges[i].target = vertices[edges[i].target]._titan_id;
	graph.v(edges[i].source).addEdge(edges[i]._label, graph.v(edges[i].target));
}
println 'finished with edges'
graph.commit();
