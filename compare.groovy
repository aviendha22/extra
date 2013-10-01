println "start";
//change database to command line arg
TitanGraph graph = TitanFactory.open('./databases/assertions-200b/');

println "after load";
def alpha_reports = graph.V.has('name', 'alpha report');
def target_events = graph.V.has('name', 'target event');

def ars = alpha_reports.toList();
def tes = target_events.toList();

def count = 0;

def getVertexCountById(id){
    return graph.v(id).inE.outV.count();
};


def getMatchingVertices(id, array, graph){
    def verts = [];
    for (int i = 0; i < array.size(); i++){
        def match = graph.v(id).inE.outV.has("name", array[i].name);
        
        if ( match.toList().size() != 0 ){
            verts.push(match.toList());
        }
    }
    return verts;
};

def getMatchingEdges(id, array, graph){
    def edges = [];
    for (int i = 0; i < array.size(); i++){
        def match = graph.v(id).inE.outV.inE.has("label", array[i].label);
        if ( match.toList().size() != 0 ){
            edges.push(match.toList());
        }
    }
    return edges;
};

def getMatchingOrientation(id, array, graph){
    def assertions = [];
    for (int i = 0; i < array.size(); i++){
        def match = graph.v(id).inE.outV.has("name", array[i][2].name).inE.has("label", array[i][3].label).outV.has("name", array[i][4].name);
        //println match;
        if ( match.toList().size() != 0 ){
            assertions.push(match.toList());
        }
    }
    return assertions;
};

def getScore(ar_id, te_id, graph){
    def score = 0;
    
    def ar_verts = graph.v(ar_id).inE.outV.toList();
    def te_verts = graph.v(te_id).inE.outV.toList();

    def ar_edges = graph.v(ar_id).inE.outV.inE.toList();
    def te_edges = graph.v(te_id).inE.outV.inE.toList();
    
    def ar_asserts = graph.v(ar_id).inE.outV.inE.outV.path.toList();
    def te_asserts = graph.v(te_id).inE.outV.inE.outV.path.toList();
        
    if ( ar_verts.size() == te_verts.size() ){
        score++;
        //println ars[i].id + " has the same number of vertices as " + tes[j].id;
    }
    
    if ( ar_edges.size() == te_edges.size() ){
        score++;
        //println ars[i].id + " has the same number of vertices as " + tes[j].id;
    }
    
    def ar_v_matches = getMatchingVertices(ar_id, te_verts, graph);
    if (ar_v_matches.size() == te_verts.size()){
        score++;
        //println "Target Event "+tes[j].id+" vertices are a subset of Alpha Report "+ars[i].id;
    }
    
    def te_v_matches = getMatchingVertices(te_id, ar_verts, graph);
    if (te_v_matches.size() == ar_verts.size()){
        score++;
        //println "Alpha Report "+ars[i].id+" vertices are a subset of Target Event "+tes[j].id;
    }
    
    def ar_e_matches = getMatchingEdges(ar_id, te_edges, graph);
    if (ar_e_matches.size() == te_edges.size()){
        score++;
        //println "Target Event "+tes[j].id+" edges are a subset of Alpha Report "+ars[i].id;
    }
    
    def te_e_matches = getMatchingEdges(te_id, ar_edges, graph);
    if (te_e_matches.size() == ar_edges.size()){
        score++;
        //println "Alpha Report "+ars[i].id+" edges are a subset of Target Event "+tes[j].id;
    }
    
    def ar_o_matches = getMatchingOrientation(ar_id, te_asserts, graph);
    if (ar_o_matches.size() == te_asserts.size()){
        score++;
        //println "Target Event "+tes[j].id+" is a subset of Alpha Report "+ars[i].id;
    }
    
    def te_o_matches = getMatchingOrientation(te_id, ar_asserts, graph);
    if (te_o_matches.size() == ar_asserts.size()){
        score++;
        //println "Alpha Report "+ars[i].id+" is a subset of Target Event "+tes[j].id;
    }
    
    return score;
};

for (int i = 0 ; i < ars.size(); i++){
    for (int j = 0; j < tes.size(); j++){ 
        count++;    
        if ( ars[i].comparedTo == null ){
            //println "never been compared";
            def score = getScore(ars[i], tes[j], graph);
            ars[i].comparedTo = [[target_event_id: tes[j].id, score: score]];
        } else {
            //println "compared before";
            def comparedTo = ars[i].comparedTo;
            
            //check to see if this target event has been compared to this alpha report
            def found = [ target_event_id: -1, score: -1 ];
            
            for (int k = 0; k < comparedTo.size(); k++){
                if (comparedTo[k].target_event_id == tes[j].id){
                    println "found";
                    found.score = comparedTo[k].score;
                    found.target_event_id = comparedTo[k].target_event_id;
                    break;
                }
            }
            
            if (found.target_event_id == -1){
                //this target event has not been compared to this alpha report
                def score = getScore(ars[i], tes[j], graph);                
                comparedTo.push([target_event_id: tes[j].id, score: score]);
                ars[i].comparedTo = comparedTo;
            } else {
                //this target event has been compared to this alpha report
                println "Score already exists: "+found.score;
            }
        }
    }
}

println count;
graph.commit();

println "end";
println "dont forget to graph.commit";
