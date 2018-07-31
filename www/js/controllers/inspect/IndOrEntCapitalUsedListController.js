angular
    .module('com.amarsoft.mobile.controllers.IndOrEntCapitalUsedList', [])
    .controller('IndOrEntCapitalUsedListController',function ($scope,$detailList,$model,$db_operate,$filter,$ionicLoading) {
	$scope.$on("to-IndOrEntCapitalUsedList",function(e,data){
		var param = {
				pageSize : 8,
				pageNo : 1,
				groupId : "IndOrEntCapitalUsedList",
				className : "com.amarsoft.webservice.business.InspectImpl",
				methodName : "getIndOrEntCapitalUsedList",
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
			detailModalQueryParam["queryData"]["ItemNo"] = modal["scope"]["selectedDetailListItem"]["ItemNo"];
			if("FirstCheck" == modal["scope"]["selectedDetailListItem"]["ObjectType"]){	  //如果是小企业货后审批流程
				detailModalQueryParam["queryData"]["modelNo"] = "FirstCheckApproveDetail";
				detailModalQueryParam["readonly"] = "true";
			} else {
				detailModalQueryParam["queryData"]["modelNo"] = "IndOrEntCapitalUsedDetail";
			}
			detailModalQueryParam["queryData"]["ReturnType"] = "Info";
		}
		$scope.saveModel = function(){
			//已完成的不能再次修改
			if(data["colId"] === "20"){
				$ionicLoading.show({
					title: "业务处理",
					template: "已完成首检不能修改!",
					duration: 1500
				});
	    		return;
			}
			var paramData = {};
			if(typeof($scope.detailListInfo.ItemDate) !== 'undefined'){
				if($scope.detailListInfo.ItemDate.format("yyyy/MM/dd") === "NaN/aN/aN"){
					setCheckObj($scope.listDetails["0"].groupColArray,"ItemDate","请选择日期!",true);
				}else
					setCheckObj($scope.listDetails["0"].groupColArray,"ItemDate","",false);
			}
			paramData = $scope.getModelNoReadOnlyData();
			var OperateFlag = paramData["OperateFlag"];
			paramData["SerialNo"] = $scope.selectedDetailListItem["SerialNo"];
			paramData["ItemNo"] = $scope.selectedDetailListItem["ItemNo"];
			paramData["ObjectNo"] = $scope.selectedDetailListItem["ObjectNo"];
			paramData["ObjectType"] = $scope.selectedDetailListItem["ObjectType"];
			paramData["UpdateUserID"] = AmApp.userID; 
			paramData["UpdateOrgID"] = AmApp.orgID;
			paramData["UpdateDate"] = $filter('date')(new Date(),"yyyy/MM/dd"); 
			var isSuccess = isCheckSuccess($scope.listDetails["0"].groupColArray);
			if(OperateFlag && isSuccess){
				$db_operate.updateRecord($scope,"0004",paramData,"IndOrEntCapitalUsedAOU");
				$scope.modal.remove();
			}
		}
	});
})