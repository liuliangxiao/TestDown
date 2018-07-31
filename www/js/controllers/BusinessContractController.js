/**
 * Created by yli18 on 2017年9月23日
 */
angular
    .module('com.amarsoft.mobile.controllers.query.BusinessContract', [])
	.controller('BusinessContractController',function ($scope,$timeout,$list,$detail,$model,$contract) {
		//初始化参数
		var param = {
			pageSize : 10,
			pageNo : 1,
			groupId : "ContractMainListController",
			className : "com.amarsoft.app.als.mobile.impl.query.QuickQueryImpl",
			methodName : "findContractList",
			menuTitle : "授信台帐",
			flag : true
		}
		$model.init($scope);
		$list.load($scope,param);
		$detail.load($scope);
		$contract.init($scope);
		//设置列表查询模版参数
		$scope.setListParam = function(data){
			if($scope.selectedMenuItem["ColId"] !== "undefined" &&
					typeof($scope.selectedMenuItem["ColId"]) !== "undefined"){
				if($scope.selectedMenuItem["ColId"]==="010"){ //表内未终结业务
					data["ContractType"] = "010010"; 
				}else if($scope.selectedMenuItem["ColId"]==="020"){//表外未终结业务
					data["ContractType"] = "010020"; 
				}else if($scope.selectedMenuItem["ColId"]==="030"){//表内已终结业务
					data["ContractType"] = "020010"; 
				}else if($scope.selectedMenuItem["ColId"]==="040"){//表外已终结业务				
					data["ContractType"] = "020020"; 
				}else if($scope.selectedMenuItem["ColId"]==="050"){//表内保全未终结业务
					data["ContractType"] = "030010010"; 
				}else if($scope.selectedMenuItem["ColId"]==="060"){//表外保全未终结业务
					data["ContractType"] = "030010020"; 
				}else if($scope.selectedMenuItem["ColId"]==="070"){//表内保全已终结业务
					data["ContractType"] = "030020010"; 
				}else if($scope.selectedMenuItem["ColId"]==="080"){//表外保全已终结业务
					data["ContractType"] = "030020020"; 
				}
				data["UserID"] = AmApp.userID; 
				data["OrgID"]=AmApp.orgID;

			} 
		}
		//设置详情模版查询参数
		$scope.setDetailParam = function(modelInfo,detailParam){
			var selectedListItem = $scope.getSelectedListItem();
			if(typeof(selectedListItem) !== "undefined"){
    		   if(typeof(modelInfo["Action"]) === "undefined" || modelInfo["Action"] === "" || modelInfo["Action"] === null){
    			   detailParam["url"] = "SelectObjectInfo";
			   }else{
				   detailParam["url"] = modelInfo["Action"];
			   }	 		  
	 			   if(typeof(modelInfo["ObjectType"]) !== "undefined" && modelInfo["ObjectType"] !== "" && modelInfo["ObjectType"] !== null){
	 				   detailParam["queryData"]["ObjectType"]  = modelInfo["ObjectType"];
	 			   }else{
	 				   detailParam["queryData"]["ObjectType"] = selectedListItem["ObjectType"];                
	 			   }
	 			   if($scope.selectedDetailMenuItem.ColId === "01010" || $scope.selectedDetailMenuItem.ColId === "02010" 
	 				    || $scope.selectedDetailMenuItem.ColId === "03010" || $scope.selectedDetailMenuItem.ColId === "04010" 
				   		|| $scope.selectedDetailMenuItem.ColId === "05010" || $scope.selectedDetailMenuItem.ColId === "06010" || $scope.selectedDetailMenuItem.ColId === "07010" 
	 					|| $scope.selectedDetailMenuItem.ColId === "08010"){
	 				   detailParam["queryData"]["SerialNo"] = selectedListItem["SerialNo"];
	 				   //修改“授信台帐”页面组件传递的参数，以供显示组件信息
	 				   $scope.setTempletParam = function(templetParam){ 
						   templetParam["ObjectNo"] = detailParam["queryData"]["SerialNo"];
						   templetParam["ObjectType"] = detailParam["queryData"]["ObjectType"];
	 			   	   };
	 			   }else{
	 				   detailParam["queryData"]["SerialNo"] = selectedListItem["ObjectNo"];
	 			   }
	 			   detailParam["queryData"]["ObjectNo"] = selectedListItem["ObjectNo"];
	 			   detailParam["queryData"]["BusinessType"] = selectedListItem["BusinessType"];
	 			   detailParam["queryData"]["readonly"] = "true";
    	   }
    	   detailParam["queryData"]["ReturnType"] = "Info";
		}
		//切换tab页后事件
		$scope.chooseModel = function(model,data){
			data.queryData["readonly"] = "true";
			if(model["Action"] === "SelectGuarantyList"){
				var modelQueryData = {};
				modelQueryData.SerialNo = $scope.selectedListItem.SerialNo;
				modelQueryData.ObjectType = model.ObjectType;
				modelQueryData.readonly=data.queryData["readonly"];
				$timeout(function() {
					$scope.$broadcast('to_guarantyListData',modelQueryData);
				}, 100);
			}else if(model["Action"]==="SelectAfterLoanList"){
				var queryData={};
				queryData.ObjectType="AfterLoan";
				queryData.ObjectNo=$scope.selectedListItem.SerialNo;
				$timeout(function() {
				$scope.$broadcast('to_BusinessDuebillListData',queryData);
				}, 100);
			}else if(model["Action"]==="SelectAcctLoanList"){
				var queryData={};
				queryData.ObjectType="jbo.app.ACCT_LOAN";
				queryData.ObjectNo=$scope.selectedListItem.SerialNo;
				$timeout(function(){
					$scope.$broadcast('to_AcctLoanListData',queryData)
				});
		   }else{
				$scope.$broadcast('to-detail',data);
			}
		}
	});
