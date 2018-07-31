/**
 * Created by yli18 on 2017年9月23日
 */
angular
    .module('com.amarsoft.mobile.controllers.applyLoanCc.receiverBillList', [])
	.controller('receiverBillListController',function ($scope,$detailList,$model,$db_operate,$filter) {
		$scope.$on("to-receiverBillList",function(e,data){
			var param = {
					pageSize : 8,
					pageNo : 1,
					groupId : "receiverBillList",
					className : "com.amarsoft.app.als.mobile.impl.ILoanContractImpl",
					methodName : "findReceiverBillList",
					flag : true
			}
			$model.init($scope);
			$scope.setDetailListParam = function(detailListParam){
				detailListParam["ObjectNo"] = data["ObjectNo"];
			}
			$detailList.load($scope,param);
			//设置模态详情页面所需参数
			$scope.setDetailModalQueryParam = function(modal,detailModalQueryParam){
				detailModalQueryParam["queryData"]["SerialNo"] = modal["scope"]["selectedDetailListItem"]["SerialNo"];
				detailModalQueryParam["queryData"]["modelNo"] = "ReceiverBillInfo";
				detailModalQueryParam["queryData"]["ReturnType"] = "Info";
			}
			$scope.saveModel = function(){
				var paramData = $scope.getModelNoReadOnlyData(true);
				$db_operate.updateRecord($scope,"0006",paramData);
			}
		});
	})