import groovy.json.JsonSlurper
String fileContents = new File('./assertions.json').text

def assertions = new JsonSlurper().parseText(fileContents);
def metadata = assertions.get('metadata');
def vertices = assertions.get('vertices');
def edges = assertions.get('edges');

TitanGraph graph = TitanFactory.open('./assertions');

for (int i = 0; i < metadata.size(); i++){
    Vertex v = graph.addVertex(null);
    def keys = metadata[i].keySet();
    keys.each{
        v.setProperty(it, metadata[i].get(it));
    }
    metadata[i]._titan_id = v.id;
    println v.id;
}

for (int i = 0; i < vertices.size(); i++){
    Vertex v = graph.addVertex(null);
    def keys = vertices[i].keySet();
    keys.each{
        v.setProperty(it, vertices[i].get(it));
    }
    vertices[i]._titan_id = v.id;
    
    for (int j = 0; j < metadata.size(); j++){
        if (vertices[i].get('mongo_ar_id') == metadata[j].get('mongo_ar_id')){
           graph.v(v.id).addEdge('metadata of', graph.v(metadata[j]._titan_id));
           vertices[i].meta_titan_id = metadata[j]._titan_id;
        }
    }
}

for (int i = 0; i < edges.size(); i++){
    def keys = edges[i].keySet();
    edges[i].source = vertices[edges[i].source]._titan_id;
    edges[i].target = vertices[edges[i].target]._titan_id;
    graph.v(edges[i].get('source')).addEdge(edges[i].get('_label'), graph.v(edges[i].get('target')));
}

graph.commit();
