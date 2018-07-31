/**
 * Created by yli18 on 2017年9月23日
 */
angular
    .module('com.amarsoft.mobile.controllers.applyLoanCc.paymentBillList', [])
	.controller('paymentBillListController',function ($scope,$detailList,$model,$db_operate,$filter) {
		$scope.$on("to-paymentBillList",function(e,data){
			$scope.param = {
					pageSize : 8,
					pageNo : 1,
					groupId : "paymentBillList",
					className : "com.amarsoft.app.als.mobile.impl.ILoanContractImpl",
					methodName : "findPaymentBillList",
					flag : true
			}
			$model.init($scope);
			$scope.setDetailListParam = function(detailListParam){
				detailListParam["BPObjectNo"] = data["BPObjectNo"];
			}
			$detailList.load($scope,$scope.param);
			//设置模态详情页面所需参数
			$scope.setDetailModalQueryParam = function(modal,detailModalQueryParam){
				detailModalQueryParam["queryData"]["ObjectType"] = modal["scope"]["selectedDetailListItem"]["ObjectType"];
				detailModalQueryParam["queryData"]["modelNo"] = "PutOutInfo";
				detailModalQueryParam["queryData"]["SerialNo"] = modal["scope"]["selectedDetailListItem"]["SerialNo"];
				detailModalQueryParam["queryData"]["ReturnType"] = "Info";
			}
			$scope.saveModel = function(){
				var data = $scope.getModelNoReadOnlyData(true);
				data["PayeeName"] = $scope.detailListInfo["PayeeName"];
				$db_operate.updateRecord($scope,"0007",data);
			}
		});
	})