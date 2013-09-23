/**
 * Contains the classes used by the Links and Nodes Widget
 */
Espace.QueryWidget = window.Espace.LinksandNodes ? window.Espace.LinksandNodes : new function(){
	/**
	 * The angular app
	 * @type {[type]}
	 */
	var myApp = angular.module("LinksandNodes", ["ngResource", "ui", "ngGrid", "ui.bootstrap"]);
												//dependency injection, other modules
	myApp.controller("LinksandNodesController", function($scope){
	
	/**
	 * Node Data - BE number
	 * @type {Array}
	 */ 
	$scope.nodes = [];
	
	$scope.graph = new LinksAndNodeGraph($scope);
	/**
	 * selected rows 
	 * @type {Array}
	 */
	$scope.selectedRows = [];
	
	/**
	 * Grid options for the output table
	 */
	$scope.gridNodes = {
			scope : $scope,
			data: "nodes",
			multiSelect : true,
			keepLastSelected : false,
			selectedItems: $scope.selectedRows,
			showSelectionCheckbox: false,
			maintainColumnRatios: true,
			enableRowSelection: true,
			afterSelectionChange: function(rowItem, event){
				//Link it to the graph
				if(rowItem.orig && rowItem.orig.selected){
					$scope.select(rowItem.entity);
				} else if(rowItem.orig) {
					$scope.deselect(rowItem.entity);
				}
			},
			plugins: [new ngGridFlexibleHeightPlugin()],
			columnDefs: [
				{field:"_id", displayName:"ID"},
				{field:"name", displayName:"Name"}	
			]
		};

		//A handy function to run $apply without getting errors
		// https://coderwall.com/p/ngisma
		$scope.safeApply = function(fn) {
		  var phase = this.$root.$$phase;
		  if(phase == '$apply' || phase == '$digest') {
		    if(fn && (typeof(fn) === 'function')) {
		      fn();
		    }
		  } else {
		    this.$apply(fn);
		  }
		};
	
	});
	
};

