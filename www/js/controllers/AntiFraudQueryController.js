/**
 * Created by yyma on 2018年1月3日
 */
angular
    .module('com.amarsoft.mobile.controllers.query.AntiFraudQuery', [])
	.controller('AntiFraudQueryController',function ($scope,$rootScope,$list,$detail,$model,$db_operate,$filter,$ionicModal,$timeout,$group,$ionicLoading,$ionicPopup,$http,$state,$detailList) {
		$scope.param = {
			pageSize : 12,
			pageNo : 1,
			groupId : "AntiFraudQueryListController",
			className : "com.amarsoft.app.als.mobile.impl.query.QuickQueryImpl",
			methodName : "AntiFraudQueryList",
			menuTitle : "反欺诈查询",
			flag : true
		}
		$model.init($scope);
		$list.load($scope,$scope.param);
		$detail.load($scope);
		//设置列表参数
		$scope.setListParam = function(data){
			if($scope.selectedMenuItem["ColId"] !== "undefined" &&
					typeof($scope.selectedMenuItem["ColId"]) !== "undefined"){
				data["Status"] = $scope.selectedMenuItem["ColId"];
				if($scope.selectedMenuItem["ColId"]==="10"){ //新增查询
					data["ReturnValue"]="";
				}else if($scope.selectedMenuItem["ColId"]==="20"){ //成功查询
					data["ReturnValue"]="0000";
				}else{//失败查询
					data["ReturnValue"]="999999";
				}
				data["UserID"] = AmApp.userID; 
			} 
		}
		//设置详情页面参数
		$scope.setDetailParam = function(modelInfo,detailParam){
			var selectedListItem = $scope.getSelectedListItem();
			if(typeof(selectedListItem) != "undefined" && selectedListItem!="" ){
				detailParam["queryData"]["SerialNo"] = selectedListItem.SerialNo;
				if(typeof(modelInfo["Action"]) === "undefined" ||
						 modelInfo["Action"] === "" ||modelInfo["Action"] === null){
					 detailParam["url"] = "AntiFraudQueryInfo";
				}else{
					 detailParam["url"] = modelInfo["Action"];
				}	
			    	   
	    	    detailParam["queryData"]["ReturnType"] = "Info";
	    	    detailParam["queryData"]["modelNo"] = modelInfo["Action"];

			}
			/*
    	   if(typeof(selectedListItem) != "undefined" && selectedListItem!="" ){
        	   detailParam["queryData"]["SerialNo"] = selectedListItem.SerialNo;  
    	   }*/
		}
		
		//点击新增按钮，跳出新增模态框
		$scope.insertRecord = function(){
			$scope.saveModelFlag ="insert";
			$scope.chooseDetail({},null,true);
			//设置业务关联流水号
			$scope.setSerialNo = function(serialNo){
				$scope.detailListInfo["SerialNo"] = serialNo;
			}
			//设置模态详情页面所需参数
			$scope.setDetailModalQueryParam = function(modal,detailModalQueryParam){
				detailModalQueryParam["queryData"]["modelNo"] = "AntiFraudQueryInfoInsert";
				detailModalQueryParam["queryData"]["ReturnType"] = "Info";
			}

			//执行新增操作（成功后，页面刷新；新增数据会展示在list页面顶端）
			$scope.toListDetailAfter = function(){      //身份证
				$scope.getSerialNo("AntiFraud_Query","SerialNo");
				$scope.detailListInfo.BussKind = "4";
			}
			//新增与保存
			$scope.saveModel = function(){
				$scope.goDetailTopFlag = false;
				var paramData = {};
				paramData = $scope.getModelNoReadOnlyData(true);
				var OperateFlag = paramData["OperateFlag"];
				if(paramData["TranType"] == "03" ||paramData["TranType"] == "08" || paramData["TranType"] == "09"){
					if(!IdentityCodeValid(paramData["AcctNo"])){
						$ionicLoading.show({
							title: "身份证校验",
							template: "身份证号有误，请核对！",
							duration: 1500
						});
						return;
					}
				}
				paramData["SerialNo"] = $scope.detailListInfo.SerialNo;
				paramData["InputUserID"]= AmApp.userID;
				paramData["InputOrgID"]=AmApp.orgID;
				paramData["ReturnCode"]="";
				paramData["OccurDate"]=$filter('date')(new Date(),"yyyy/MM/dd");
				paramData["UpdateDate"]=$filter('date')(new Date(),"yyyy/MM/dd");
				paramData["InputDate"]=$filter('date')(new Date(),"yyyy/MM/dd");
				if(OperateFlag){
					$db_operate.insertRecord($scope,"0013",paramData);
					$scope.modal.remove();
				}
				
			}
		}
		
		$scope.deleteRecord = function(){
	    	if($scope.selectedListItem == undefined){
	    		//没有数据的时候
	    		return false;
	    	}
	    	var sSerialNo = $scope.selectedListItem["SerialNo"];
			if (typeof(sSerialNo)=="undefined" || sSerialNo.length==0)
			{
				$ionicLoading.show({
					title: "业务处理",
					template: "请选择一条记录！",
					duration: 1500
				});
			}
			else
			{	
				var confirmPopup = $ionicPopup.confirm({
	                title: '操作提示',
	                template: '您确定要删除该记录吗？',
	                okText: '确定',
	                cancelText: '取消'
	            });
	        	confirmPopup.then(function (res) {
	                if (res) {
	                	//接收服务端返回的用户详情数据
			            runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
			            	"OperateContract", {
				            	SerialNo : sSerialNo,
				        		Type : "deleteAntifraudQuery"
				        	}, function (data, status) {
			            	if(data["Flag"] === "Success"){
			            		appIonicLoading.show({
					    		   template: "删除成功！",
					    		   animation: 'fade-in',
					    		   showBackdrop: true,
					    		   duration: 2000
					    	    });
			            		//刷新页面
			                    $timeout(function () {
			        	            $rootScope.moduleSwitch('AntiFraudQuery',"query");
			                    }, 1200); 
			            	}else{
			            		appIonicLoading.show({
					    		   template: "删除失败！",
					    		   animation: 'fade-in',
					    		   showBackdrop: true,
					    		   duration: 2000
					    	    });
			            	}
			            });
	                }
	            });
			}
	    }
		//保存数据
		$scope.saveData = function(){
			$scope.goDetailTopFlag = true;
    		//$scope.$broadcast("queryData1",$scope.detailInfo);
			var paramData = $scope.getModelNoReadOnlyData();
			paramData["InputOrgID"]=AmApp.orgID;
			paramData["ReturnCode"]=$scope.detailInfo.ReturnCode;
			paramData["OccurDate"]=$filter('date')(new Date(),"yyyy/MM/dd");
			paramData["UpdateDate"]=$filter('date')(new Date(),"yyyy/MM/dd");
			paramData["InputDate"]=$filter('date')(new Date(),"yyyy/MM/dd");
			paramData["OccurDate"]=$scope.detailInfo.OccurDate;
			paramData["ReturnMsg"]=$scope.detailInfo.ReturnMsg;
			paramData["RiskLevelSummary"]=$scope.detailInfo.RiskLevelSummary;
			paramData["RespCardIssueOrg"]=$scope.detailInfo.RespCardIssueOrg;
			paramData["PhotoPath"]=$scope.detailInfo.PhotoPath;	
			paramData["TranType"]=$scope.detailInfo.TranType;
			paramData["AcctNo"]=$scope.detailInfo.AcctNo;
			paramData["BussKind"]=$scope.detailInfo.BussKind;
			$db_operate.updateRecord($scope,"0013",paramData);
		}
		
		//先保存后执行
		$scope.submit = function(){
			var paramData = $scope.getModelNoReadOnlyData();
			OperateFlag = paramData["OperateFlag"];
			if(!OperateFlag || OperateFlag === "false"){
				appIonicLoading.show({
		    		   template: "数据录入不完整！",
		    		   animation: 'fade-in',
		    		   showBackdrop: true,
		    		   duration: 2000
		    	    });
				return;
			}
			$scope.$broadcast("queryData1",$scope.detailInfo);
		}
	   //去外围系统查询数据	
		$scope.$on("queryData1",function(e, data){
			$scope.detailInfo.SerialNo=$scope.selectedListItem["SerialNo"];
			 
			var transParams = "I00001,1,"+$scope.detailInfo.SerialNo+","+AmApp.orgID+",END"; 
			var returnValue=$group.RunMethod("PublicMethod", "RealTimeInterface", transParams);
			//var returnValue="9999@";
			if(!(typeof(returnValue) == "undefined" || returnValue == "" || returnValue.length == 0)){
					
					var aReturn = returnValue.split("@") ;
					var ReturnCode = aReturn[0];
					if(typeof(ReturnCode)!="undefined" && ReturnCode.length!=0){
						$scope.detailInfo.ReturnCode=ReturnCode;
						if(aReturn[0] == "0000"){
							appIonicLoading.show({
					    		   template: "〖电信反欺诈查询〗成功!",
					    		   animation: 'fade-in',
					    		   showBackdrop: true,
					    		   duration: 1000
					    	    });
							$scope.createInfo1.OccurDate=aReturn[1];
							$scope.createInfo1.ReturnMsg=aReturn[3];
							$scope.createInfo1.RiskLevelSummary=aReturn[4];
							$scope.createInfo1.RespCardIssueOrg=aReturn[5];
							$scope.createInfo1.PhotoPath=aReturn[6];							
						}else{
							appIonicLoading.show({
					    		   template: "〖电信反欺诈查询〗失败!",
					    		   animation: 'fade-in',
					    		   showBackdrop: true,
					    		   duration: 1000
					    	    });
							//$scope.createInfo1.OccurDate=aReturn[1];
						}
					}else{
						$scope.detailInfo.ReturnCode=ReturnCode;
					}
					$timeout(function () {
						$scope.refresh();
                    }, 2000); 
					
			}			
		
		});
		
		$scope.chooseModel = function(model,param){
			if(typeof($scope.selectedListItem) === "undefined") return;
			var selectedListItem = $scope.getSelectedListItem();
			
			if(model["Action"] === "AppAntiFraudDetailInfo"){
				param["SerialNo"] = selectedListItem["SerialNo"];
				$scope.ngController = "AutifraudQueryListController";
				 $timeout(function () {
					 $scope.$broadcast('to-AutifraudQueryList',param);
				   }, 100);
				
			}else{
				$timeout(function () {
	 				$scope.$broadcast('to-detail',param);
	 			}, 100);
			}
		}
	});



