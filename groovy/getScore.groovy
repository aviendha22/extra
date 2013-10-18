try {
    a1
} catch (MissingPropertyExceptionmpe){
    println "Please provide a directory for the database"
    System.exit(0);
}

TitanGraph graph = TitanFactory.open(a1);

def alpha_reports = graph.V.has('name', 'alpha report').toList();

for ( int i = 0; i < alpha_reports.size(); i++){
	if (alpha_reports[i].comparedTo != null){
		def comparedTo = alpha_reports[i].comparedTo;

		for ( int j = 0; j < comparedTo.size(); j++){
		
			if ( comparedTo[j].score > 4 ){
				println "Alpha Report " +alpha_reports[i].id+" matches Alpha Report "+comparedTo[j].alpha_report_id+" with a score of " + comparedTo[j].score;
			}

		}
	}
}

