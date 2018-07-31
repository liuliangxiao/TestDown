/**
 * Created by yyma on 2018年1月8日   个人征信查询
 */
angular
    .module('com.amarsoft.mobile.controllers.query.SMECheckRecordQuery', [])
	.controller('SMECheckRecordQueryController',function ($scope,$rootScope,$list,$detail,$model,$db_operate,$filter,$ionicModal,$ionicPopup,$http,$ionicLoading,$state,$timeout) {
		$scope.param = {
			pageSize : 12,
			pageNo : 1,
			groupId : "CheckRecordQueryControllerList",
			className : "com.amarsoft.app.als.mobile.impl.query.QuickQueryImpl",
			methodName : "CheckRecordQueryList",
			menuTitle : "企业信用报告查询",
			flag : true
		}
		$model.init($scope);
		$list.load($scope,$scope.param);
		$detail.load($scope);
		//设置列表参数
		$scope.setListParam = function(data){
			if($scope.selectedMenuItem["ColId"] !== "undefined" &&
					typeof($scope.selectedMenuItem["ColId"]) !== "undefined"){
				if($scope.selectedMenuItem["ColId"]==="1010"){ //单笔查询新增
					data["approvePhase"] = "1010"; 
				}else if($scope.selectedMenuItem["ColId"]==="1020"){ //单笔查询审批中
					data["approvePhase"] = "1020"; 
				}else if($scope.selectedMenuItem["ColId"]==="1040"){//单笔查询审批通过
					data["approvePhase"] ="1040"; 
				}else{//单笔查询否决				
					data["approvePhase"] ="1050"; 
				}
				data["UserID"] = AmApp.userID; 
				data["ReportType"] = "ECR";
			} 
		}
		//设置详情页面参数
		$scope.setDetailParam = function(modelInfo,detailParam){
			var selectedListItem = $scope.getSelectedListItem();
    	   if(typeof($scope.selectedListItem) !== "undefined"){
    		   if(typeof(modelInfo["Action"]) === "undefined" ||
				   modelInfo["Action"] === "" ||
				   modelInfo["Action"] === null){
    			   detailParam["url"] = "ReportQueryInfo";
			   }else{
				   detailParam["url"] = modelInfo["Action"];
			   }	 
    	   }
    	   detailParam["queryData"]["ReturnType"] = "Info";
    	   if(typeof(selectedListItem) != "undefined" && selectedListItem!="" ){
        	   detailParam["queryData"]["QueryID"] = selectedListItem.QueryID;  
    	   }
		}
		
		//切换tab页后事件
		$scope.chooseModel = function(model,data){
			if(model.ColName == '影像编辑'){
				$timeout(function () {
					$scope.dic = {};
					$scope.dic.ObjectType = "CreditQueryApply";
					$scope.dic.loanType = "";
					if($scope.selectedListItem != undefined){
						$scope.dic.ObjectNo = $scope.selectedListItem.QueryID;
						$scope.$broadcast('to-screenage',$scope.dic);
					}
				}, 100);
			}else{
				$timeout(function () {
	 				$scope.$broadcast('to-detail',data);
	 			}, 100);
			}
		}
		
		//点击新增按钮，跳出新增模态框
		$scope.insertRecord = function(){
			$scope.saveModelFlag ="insert";
			$scope.chooseDetail({},null,true);
			//设置业务关联流水号
			$scope.setSerialNo = function(serialNo){
				$scope.detailListInfo["QueryID"] = serialNo;
			}
			//设置模态详情页面所需参数
			$scope.setDetailModalQueryParam = function(modal,detailModalQueryParam){
				detailModalQueryParam["queryData"]["modelNo"] = "SMESingleQueryInfo";
				detailModalQueryParam["queryData"]["ReturnType"] = "Info";
			}

			$scope.toListDetailAfter = function(){
				$scope.getSerialNo("Query_History","QueryID");
			}
			//新增与保存
			$scope.saveModel = function(){
				$scope.goDetailTopFlag = false;
				if($scope.saveModelFlag == "insert"){
					var paramData = {};
					paramData = $scope.getModelNoReadOnlyData(true);
					paramData["PrimaryKey"] = "QueryID";
					//获取list页面顶端的新增数据的主键
					paramData["QueryID"] = $scope.detailListInfo.QueryID;
					if(typeof($scope.detailListInfo.CustomerName)==="undefined" || $scope.detailListInfo.CustomerName===""){
						paramData["OperateFlag"]=false;
					}
					if(typeof($scope.detailListInfo.CertID)==="undefined" || $scope.detailListInfo.CertID===""){
						paramData["OperateFlag"]=false;
					}
					if(typeof($scope.detailListInfo.QueryReason)==="undefined" || $scope.detailListInfo.QueryReason===""){
						paramData["OperateFlag"]=false;
					}
					paramData["CustomerName"] = $scope.detailListInfo.CustomerName;
					paramData["CertID"] = $scope.detailListInfo.CertID;
					;
					if(!CheckLoanCardID($scope.detailListInfo.CertID))
					{
						$ionicLoading.show({
							title: "贷款卡编号校验",
							template: "贷款卡编号有误，请重新输入贷款卡号！",
							duration: 2000
						});
						return false;
					}
					paramData["QueryReason"] = $scope.detailListInfo.QueryReason;
					paramData["QueryType"] ="SINGLE";
					paramData["QuerySource"] ="CMS";
					paramData["QueryStrategy"] ="SYNC";
					paramData["QueryMode"] ="Online";
					paramData["QueryAccessStrategy"] ="DEFAULT";
					paramData["CertType"] ="LC";
					paramData["OperateUserID"] =  AmApp.userID;
					paramData["OperateOrgID"] =  AmApp.orgID;
					paramData["ApprovePhase"]="1010";
					paramData["ReportType"]="ECR";
					paramData["QueryTime"] = $filter('date')(new Date(),"yyyy/MM/dd hh:mm:ss"); 
					
					if(!paramData["OperateFlag"]){//数据不完整，则后续点击插入按钮，为插入功能
						$scope.saveModelFlag = "insert";
					}else{//数据完整，后续点击保存按钮，为修改功能
						$scope.saveModelFlag = "update";
					}
					//执行新增操作（成功后，页面刷新；新增数据会展示在list页面顶端）
					$db_operate.insertRecord($scope,"0014",paramData);
					
				}else if($scope.saveModelFlag == "update"){
					var paramData = {};
					paramData = $scope.getModelNoReadOnlyData(true);
					paramData["PrimaryKey"] = "QueryID";
					//获取list页面顶端的新增数据的主键
					paramData["QueryID"] = $scope.selectedListItem["QueryID"];
					if(typeof($scope.detailListInfo.CustomerName)==="undefined" || $scope.detailListInfo.CustomerName===""){
						paramData["OperateFlag"]=false;
					}
					if(typeof($scope.detailListInfo.CertID)==="undefined" || $scope.detailListInfo.CertID===""){
						paramData["OperateFlag"]=false;
					}
					if(typeof($scope.detailListInfo.QueryReason)==="undefined" || $scope.detailListInfo.QueryReason===""){
						paramData["OperateFlag"]=false;
					}
					paramData["CustomerName"] = $scope.detailListInfo.CustomerName;
					paramData["CertID"] = $scope.detailListInfo.CertID;
					if(!CheckLoanCardID($scope.detailListInfo.CertID))
					{
						$ionicLoading.show({
							title: "贷款卡编号校验",
							template: "贷款卡编号有误，请重新输入贷款卡号！",
							duration: 2000
						});
						return false;
					}
					paramData["QueryReason"] = $scope.detailListInfo.QueryReason;
					//执行更新操作
					$db_operate.updateRecord($scope,"0014",paramData);
				}
			}
		}
		//提交
		$scope.submitOpinion = function(){ 
			$scope.goDetailTopFlag = false;
			var data = $scope.getModelNoReadOnlyData();
			data["approvePhase"]="1020";
			data["PrimaryKey"] = "QueryID";
			data["QueryID"]=$scope.selectedListItem["QueryID"];

			$db_operate.updateRecord($scope,"0014",data);			
		}
		
		//删除
		$scope.deleteRecord = function(){ 
			var confirmPopup = $ionicPopup.confirm({
                title: '操作提示',
                template: '<p align="center">确定删除该信息吗？</p>',
                okText: '确定',
                cancelText: '取消'
            });
        	confirmPopup.then(function (res) {
                if (res) {
                	//接收服务端返回的用户详情数据
		            runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
		            	"OperateContract", {
		            	SerialNo : $scope.selectedListItem["QueryID"],
		            	type:"DeleteCheckRecord"
			        	}, function (data, status) {
		            	if(data["Flag"] === "Success"){
		            		appIonicLoading.show({
				    		   template: "删除成功！",
				    		   animation: 'fade-in',
				    		   showBackdrop: true,
				    		   duration: 2000
				    	    });			           
		            	}else{
		            		appIonicLoading.show({
				    		   template: "删除失败！"+data["Msg"],
				    		   animation: 'fade-in',
				    		   showBackdrop: true,
				    		   duration: 200
				    	    });
		            	}
		            });
		          //刷新页面
                    $timeout(function () {
        	            $rootScope.moduleSwitch('SMECheckRecord',"query");
                    }, 1200); 	
                }
            });
		}
		
	});
