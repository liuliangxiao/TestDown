angular
    .module('com.amarsoft.mobile.controllers.SmeOrEntCapitalUsedList', [])
    .controller('SmeOrEntCapitalUsedListController',function ($scope,$detailList,$model,$db_operate,$filter) {
	$scope.$on("to-SmeOrEntCapitalUsedList",function(e,data){
		var param = {
				pageSize : 8,
				pageNo : 1,
				groupId : "SmeOrEntCapitalUsedList",
				className : "com.amarsoft.webservice.business.InspectImpl",
				methodName : "getSmeOrEntCapitalUsedList",
				flag : true,
				Transaction:"null"
		}
		$model.init($scope);
		$scope.setDetailListParam = function(detailListParam){
			detailListParam["SerialNo"] = data["SerialNo"];
			detailListParam["ObjectNo"] = data["ObjectNo"];
			detailListParam["ObjectType"] = data["ObjectType"];
		}
		$detailList.load($scope,param);
		//设置模态详情页面所需参数
		$scope.setDetailModalQueryParam = function(modal,detailModalQueryParam){
			detailModalQueryParam["queryData"]["SerialNo"] =  modal["scope"]["selectedDetailListItem"]["SerialNo"];
			detailModalQueryParam["queryData"]["ObjectNo"] = modal["scope"]["selectedDetailListItem"]["ObjectNo"];
			detailModalQueryParam["queryData"]["ObjectType"] = modal["scope"]["selectedDetailListItem"]["ObjectType"];
			detailModalQueryParam["queryData"]["ItemNo"] = modal["scope"]["selectedDetailListItem"]["ItemNo"];
			detailModalQueryParam["queryData"]["modelNo"] = "SmeOrEntCapitalUsedDetail";
			detailModalQueryParam["queryData"]["ReturnType"] = "Info";
		}
		$scope.saveModel = function(){
			var paramData = {};
			paramData = $scope.getModelNoReadOnlyData();
			var OperateFlag = paramData["OperateFlag"];
			if(data["colId"] === "20"){
				$ionicLoading.show({
					title: "业务处理",
					template: "已完成首检不能修改!",
					duration: 1500
				});
	    		return;
			}
			if(typeof($scope.detailListInfo.ItemDate) === 'undefined'
				|| $scope.detailListInfo.ItemDate.format("yyyy/MM/dd") === "NaN/aN/aN"){
				setCheckObj($scope.listDetails["0"].groupColArray,"ItemDate","请选择日期!",true);
			}else
				setCheckObj($scope.listDetails["0"].groupColArray,"ItemDate","",false);
			
			paramData["SerialNo"] = $scope.selectedDetailListItem["SerialNo"];
			paramData["ItemNo"] = $scope.selectedDetailListItem["ItemNo"];
			paramData["ObjectNo"] = $scope.selectedDetailListItem["ObjectNo"];
			paramData["ObjectType"] = $scope.selectedDetailListItem["ObjectType"];
			paramData["ItemType"] = "02"; 
			paramData["UpdateUserID"] = AmApp.userID; 
			paramData["UpdateOrgID"] = AmApp.orgID;
			paramData["UpdateDate"] = $filter('date')(new Date(),"yyyy/MM/dd"); 
			var isSuccess = isCheckSuccess($scope.listDetails["0"].groupColArray);
			if(OperateFlag && isSuccess){
				$db_operate.updateRecord($scope,"0011",paramData,"IndOrEntCapitalUsedAOU");
				$scope.modal.remove();
			}
			/*$db_operate.updateRecord($scope,"0011",paramData,"IndOrEntCapitalUsedAOU");*/
		}
	});
})