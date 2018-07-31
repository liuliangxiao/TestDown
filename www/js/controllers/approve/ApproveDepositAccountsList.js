/**
 * Created by yli18 on 2017年9月23日
 */
angular
    .module('com.amarsoft.mobile.controllers.approve.DepositAccountsList', [])
	.controller('ApproveDepositAccountsList',function ($scope,$detailList,$model,$db_operate,$filter) {
		$scope.$on("to-ApproveDepositAccountsList",function(e,data){
			var param = {
					pageSize : 8,
					pageNo : 1,
					groupId : "TransactionApprove1",
					className : "com.amarsoft.app.als.mobile.impl.apply.BusinessApplyImpl",
					methodName : "DepositAccountsList",
					flag : true
			}
			$model.init($scope);
			$scope.setDetailListParam = function(detailListParam){
				detailListParam["ObjectNo"] = data["ObjectNo"];
				detailListParam["ObjectType"] = data["ObjectType"];
				detailListParam["modelNo"]=data["modelNo"];
				detailListParam["CustomerID"]=data["CustomerID"]
				detailListParam["Status"] = data["Status"];
			}
			$detailList.load($scope,param);
			//设置模态详情页面所需参数
			$scope.setDetailModalQueryParam = function(modal,detailModalQueryParam){
				detailModalQueryParam["queryData"]["SerialNo"]=$scope.selectedDetailListItem.SerialNo;
				detailModalQueryParam["queryData"]["modelNo"] = "DepositAccountsInfo";
				detailModalQueryParam["queryData"]["ReturnType"] = "Info";
			}
			/*$scope.saveModel = function(){
				var data = $scope.getModelNoReadOnlyData(true);
				$db_operate.updateRecord($scope,"0005",data["data"]);
			}*/
		});
	})