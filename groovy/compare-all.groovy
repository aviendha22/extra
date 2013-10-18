try {
	a1
} catch (MissingPropertyExceptionmpe){
	println "Please provide a directory for the database"
	System.exit(0);
}

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

def compareTeToAr(ars, tes, count, graph){
	for (int i = 0 ; i < ars.size(); i++){
		for (int j = 0; j < tes.size(); j++){
			count++;
			if ( ars[i].comparedTo == null ){
				println "never been compared";
				def score = getScore(ars[i], tes[j], graph);
				ars[i].comparedTo = [[item_id: tes[j].id, score: score]];

				if ( tes[j].comparedTo == null ){
					tes[j].comparedTo = [[item_id: ars[i].id, score: score]];
				} else {
					def comparedToJ = tes[j].comparedTo;
					comparedToJ.push([item_id: ars[i].id, score: score]);
					tes[j].comparedTo = comparedToJ;
				}
			} else {
				println "compared before";
				def comparedTo = ars[i].comparedTo;
				
				//check to see if this target event has been compared to this alpha report
				def found = [ item_id: -1, score: -1 ];
				
				for (int k = 0; k < comparedTo.size(); k++){
					if (comparedTo[k].item_id == tes[j].id){
						found.score = comparedTo[k].score;
						found.item_id = comparedTo[k].item_id;
						break;
					}
				}
				
				if (found.item_id == -1){
					//this target event has not been compared to this alpha report
					def score = getScore(ars[i], tes[j], graph);
					comparedTo.push([item_id: tes[j].id, score: score]);
					ars[i].comparedTo = comparedTo;

					if (tes[j].comparedTo == null){
						tes[j].comparedTo = [[item_id: ars[i].id, score: score]];
					} else {
						def comparedToJ = tes[j].comparedTo;
						comparedToJ.push([item_id: ars[i].id, score: score]);
						tes[j].comparedTo = comparedToJ;
					}
				} else {
					//this target event has been compared to this alpha report
					println "Target Event "+tes[j].id+ " matches Alpha Report " +ars[i].id+ " with a score of "+found.score;
				}
			}
		}
	graph.commit();
	println count;
	}
}

def compareArToAr(ars, count, graph){
	for (int i = 0 ; i < ars.size(); i++){
		for (int j = 0; j < ars.size(); j++){
			if (i != j ){
				count++;
				if ( ars[i].comparedTo == null ){
					//println "never been compared";
					def score = getScore(ars[i], ars[j], graph);
					ars[i].comparedTo = [[item_id: ars[j].id, score: score]];
				} else {
					//println "compared before " + i + " " + j;
					def comparedToI = ars[i].comparedTo;
					
					//check to see if this target event has been compared to this alpha report
					def found = [ item_id: -1, score: -1 ];
					
					for (int k = 0; k < comparedToI.size(); k++){
						if (comparedToI[k].item_id == ars[j].id){
							found.score = comparedToI[k].score;
							found.item_id = comparedToI[k].item_id;
							break;
						}
					}
				
					if (found.item_id == -1){
						//alpha report j has not been compared to alpha report i
						def score = getScore(ars[i], ars[j], graph);
						comparedToI.push([item_id: ars[j].id, score: score]);
						ars[i].comparedTo = comparedToI;
					} else {
						//this target event has been compared to this alpha report
						if (found.score > 4){
							println "Alpha Report " +ars[i].id+ " matches Alpha Report " +ars[j].id+ " with a score of " + found.score;
						}
					}
				}
			}
		}
		graph.commit();
		println count;
	}
}

TitanGraph graph = TitanFactory.open(a1);

def alpha_reports = graph.V.has('name', 'alpha report');
def target_events = graph.V.has('name', 'target event');

def ars = alpha_reports.toList();
def tes = target_events.toList();

def count = 0;
println ars.size();
println tes.size();
compareTeToAr(ars, tes, count, graph);
compareArToAr(ars, count, graph);
