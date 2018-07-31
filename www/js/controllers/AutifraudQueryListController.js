angular
    .module('com.amarsoft.mobile.controllers.AutifraudQueryList', [])
    .controller('AutifraudQueryListController',function ($scope,$detailList,$model,$db_operate,$filter) {
    	$scope.$on("to-AutifraudQueryList",function(e,data){
			var param = {
					pageSize : 8,
					pageNo : 1,
					groupId : "AntiFraudQueryDetailList",
					className : "com.amarsoft.webservice.business.InspectImpl",
					methodName : "getAntiFraudQueryList",
					flag : true
			}
			$model.init($scope);
			$scope.setDetailListParam = function(detailListParam){
				detailListParam["SerialNo"] = data["SerialNo"];
			}
			 $scope.chooseDetail = function(item,index,flag){
				//alert("想干哈");
			}
			$detailList.load($scope,param);
		});
    })