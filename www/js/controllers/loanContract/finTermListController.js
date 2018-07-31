/**
 * Created by yli18 on 2017年9月23日
 */
angular
    .module('com.amarsoft.mobile.controllers.applyLoanCc.finTermList', [])
	.controller('finTermListController',function ($scope,$detailList,$model,$db_operate,$filter) {
		$scope.$on("to-finTermList",function(e,data){
			var param = {
					pageSize : 8,
					pageNo : 1,
					groupId : "finTermList",
					className : "com.amarsoft.app.als.mobile.impl.ILoanContractImpl",
					methodName : "findFinTermList",
					flag : true
			}
			$model.init($scope);
			$scope.setDetailListParam = function(detailListParam){
				detailListParam["ObjectNo"] = data["ObjectNo"];
				detailListParam["ObjectType"] = data["ObjectType"];
				detailListParam["Status"] = data["Status"];
			}
			$detailList.load($scope,param);
			//设置模态详情页面所需参数
			$scope.setDetailModalQueryParam = function(modal,detailModalQueryParam){
				detailModalQueryParam["queryData"]["ObjectType"] = modal["scope"]["selectedDetailListItem"]["ObjectType"];
				detailModalQueryParam["queryData"]["modelNo"] = "FinRateSegmentInfo";
				detailModalQueryParam["queryData"]["SerialNo"] = modal["scope"]["selectedDetailListItem"]["SerialNo"];
				detailModalQueryParam["queryData"]["ReturnType"] = "Info";
			}
			$scope.saveModel = function(){
				var data = $scope.getModelNoReadOnlyData(true);
				$db_operate.updateRecord($scope,"0005",data);
			}
		});
	})