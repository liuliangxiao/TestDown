/**
 * Created by yyma on 2018年1月8日   个人征信查询
 */
angular
    .module('com.amarsoft.mobile.controllers.query.INDCheckRecordQuery', [])
	.controller('INDCheckRecordQueryController',function ($scope,$rootScope,$list,$detail,$model,$db_operate,$filter,$ionicModal,$ionicPopup,$http,$ionicLoading,$state,$timeout) {
		$scope.param = {
			pageSize : 12,
			pageNo : 1,
			// 定义中间部分使用的 APP_List_Group 与 APP_Menu_Group 的GroupID
			groupId : "CheckRecordQueryControllerList",
			// PC端的RunJavaMethodSqlca方法；用来查询中间部分需要显示的数据
			className : "com.amarsoft.app.als.mobile.impl.query.QuickQueryImpl",
			methodName : "CheckRecordQueryList",
			menuTitle : "征信查询",
			flag : true
		}
		$model.init($scope);
		$list.load($scope,$scope.param);
		$detail.load($scope);
		//设置列表参数
		$scope.setListParam = function(data){
			// 中间部分 tab页对应的ID： $scope.selectedMenuItem["ColId"]
			if($scope.selectedMenuItem["ColId"] !== "undefined" &&
					typeof($scope.selectedMenuItem["ColId"]) !== "undefined"){
				/*** xbwang 20180525
				 select COLID ,MG.* from APP_Menu_Group MG where GroupID='CheckRecordQueryControllerList'  and length(ColID)=4  ;
				 1010	待提交
				 1020	审批中
				 1030	退回
				 1040	批准
				 1050	否决
				 $scope.selectedMenuItem["ColId"] 的值为ColID
				 */ 
				data["approvePhase"] = $scope.selectedMenuItem["ColId"] ;
				data["UserID"] = AmApp.userID ; 
				data["ReportType"] = "ICR" ;
			} 
		}
		/**** xbwang 添加备注
		 * 设置打开右侧Tab页面的模板 select * from DataObject_Library where DoNo='ReportQueryInfo' ;
		 */
		$scope.setDetailParam = function(modelInfo,detailParam) {
			var selectedListItem = $scope.getSelectedListItem();
    	   if(typeof($scope.selectedListItem) !== "undefined") {
    		   if(typeof(modelInfo["Action"]) === "undefined" ||  modelInfo["Action"] === "" || modelInfo["Action"] === null){
    			   detailParam["url"] = "ReportQueryInfo"; // 默认打开 DoNo ： ReportQueryInfo 征信查询详情模板
			   }else{
				   detailParam["url"] = modelInfo["Action"];
			   }	 
    	   }
    	   detailParam["queryData"]["ReturnType"] = "Info";
    	   if(typeof(selectedListItem) != "undefined" && selectedListItem!="" ){
        	   detailParam["queryData"]["QueryID"] = selectedListItem.QueryID;  
    	   }
		}
		//点击新增按钮，跳出新增模态框
		$scope.insertRecord = function(){
			var confirmPopup = $ionicPopup.confirm({
                title: '操作提示',
                template: '<p align="center">选择查询的征信类型？</p>',
                okText: '个人征信',
                cancelText: '企业征信'
            });
			confirmPopup.then(function (res) {
                if (res) {
                	alert("ICR") ;
                } else {
                	alert("ECR") ;
                }
            }) ;
			
			$scope.saveModelFlag ="insert";
			$scope.chooseDetail({},null,true);
			//设置业务关联流水号
			$scope.setSerialNo = function(serialNo){
				$scope.detailInfo["QueryID"] = serialNo;
			}
			//设置模态详情页面所需参数
			$scope.setDetailModalQueryParam = function(modal,detailModalQueryParam){
				detailModalQueryParam["queryData"]["modelNo"] = "INDSingleQueryInfo";
				detailModalQueryParam["queryData"]["ReturnType"] = "Info";
			}

			$scope.toListDetailAfter = function(){
				$scope.getSerialNo("Query_History","QueryID");
			}
			
			$scope.saveModel = function(){
				$scope.goDetailTopFlag = false;
				var paramData = {};	// 用来保存页面中录入的参数名称与参数值
				paramData = $scope.getModelNoReadOnlyData(true);
				paramData["CustomerName"] = $scope.detailListInfo.CustomerName;
				paramData["CertType"] = $scope.detailListInfo.CertType;
				paramData["CertID"] = $scope.detailListInfo.CertID;
				paramData["QueryReason"] = $scope.detailListInfo.QueryReason;
				paramData["OperateUserID"] =  AmApp.userID;
				paramData["QueryType"] ="SINGLE";
				paramData["QuerySource"] ="CMS";
				paramData["QueryStrategy"] ="SYNC";
				paramData["QueryMode"] ="Online";
				paramData["QueryAccessStrategy"] ="DEFAULT";
				paramData["OperateOrgID"] =  AmApp.orgID;
				
				runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
						"AddCreditQuery", paramData, function (data, status) {
					alert(data) ;
				});
				
				
			}
			
			//新增与保存
			$scope.saveModel1 = function(){
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
					if(typeof($scope.detailListInfo.CertType)==="undefined" || $scope.detailListInfo.CertType===""){
						paramData["OperateFlag"]=false;
					}
					if(typeof($scope.detailListInfo.CertID)==="undefined" || $scope.detailListInfo.CertID===""){
						paramData["OperateFlag"]=false;
					}
					if(typeof($scope.detailListInfo.QueryReason)==="undefined" || $scope.detailListInfo.QueryReason===""){
						paramData["OperateFlag"]=false;
					}
					paramData["CustomerName"] = $scope.detailListInfo.CustomerName;
					paramData["CertType"] = $scope.detailListInfo.CertType;
					paramData["CertID"] = $scope.detailListInfo.CertID;
					//判断身份证合法性,个人身份证号码应该是15或18位！
					if ($scope.detailListInfo.CertType == '0' ) {
						if ($scope.detailListInfo.CertID.length == 15 || $scope.detailListInfo.CertID.length == 18) {
							if (!CheckLisince($scope.detailListInfo.CertID)) {
								//alert(getBusinessMessage('156'));//身份证号码有误！
								$ionicLoading.show({
									title: "身份证号校验",
									template: "身份证号有误，请重新输入身份证号！",
									duration: 2000
								});
								return false;
							}
						} else {
							$ionicLoading.show({
								title: "身份证号校验",
								template: "身份证号有误，请重新输入身份证号！",
								duration: 2000
							});
							return false;
						}
					}
					paramData["QueryReason"] = $scope.detailListInfo.QueryReason;

					paramData["OperateUserID"] =  AmApp.userID;
					paramData["QueryType"] ="SINGLE";
					paramData["QuerySource"] ="CMS";
					paramData["QueryStrategy"] ="SYNC";
					paramData["QueryMode"] ="Online";
					paramData["QueryAccessStrategy"] ="DEFAULT";
					paramData["OperateOrgID"] =  AmApp.orgID;
					paramData["ApprovePhase"]="1010";
					paramData["ReportType"]="ICR";
					paramData["QueryTime"] = $filter('date')(new Date(),"yyyy/MM/dd hh:mm:ss"); 
					//执行新增操作（成功后，页面刷新；新增数据会展示在list页面顶端）
					if(!paramData["OperateFlag"]){//数据不完整，则后续点击插入按钮，为插入功能
						$scope.saveModelFlag = "insert";
					}else{//数据完整，后续点击保存按钮，为修改功能
						$scope.saveModelFlag = "update";
					}
					alert(paramData) ;
					
				//	$db_operate.insertRecord($scope,"0014",paramData);

				}else if($scope.saveModelFlag == "update"){
					var paramData = {};
					paramData = $scope.getModelNoReadOnlyData(true);
					paramData["PrimaryKey"] = "QueryID";
					//获取list页面顶端的新增数据的主键
					paramData["QueryID"] = $scope.selectedListItem["QueryID"];
					if(typeof($scope.detailListInfo.CustomerName)==="undefined" || $scope.detailListInfo.CustomerName===""){
						paramData["OperateFlag"]=false;
					}
					if(typeof($scope.detailListInfo.CertType)==="undefined" || $scope.detailListInfo.CertType===""){
						paramData["OperateFlag"]=false;
					}
					if(typeof($scope.detailListInfo.CertID)==="undefined" || $scope.detailListInfo.CertID===""){
						paramData["OperateFlag"]=false;
					}
					if(typeof($scope.detailListInfo.QueryReason)==="undefined" || $scope.detailListInfo.QueryReason===""){
						paramData["OperateFlag"]=false;
					}
					paramData["CustomerName"] = $scope.detailListInfo.CustomerName;
					paramData["CertType"] = $scope.detailListInfo.CertType;
					paramData["CertID"] = $scope.detailListInfo.CertID;
					//判断身份证合法性,个人身份证号码应该是15或18位！
					if ($scope.detailListInfo.CertType == '0' ) {
						if ($scope.detailListInfo.CertID.length == 15 || $scope.detailListInfo.CertID.length == 18) {
							if (!CheckLisince($scope.detailListInfo.CertID)) {
								//alert(getBusinessMessage('156'));//身份证号码有误！
								$ionicLoading.show({
									title: "身份证号校验",
									template: "身份证号有误，请重新输入身份证号！",
									duration: 2000
								});
								return false;
							}
						} else {
							$ionicLoading.show({
								title: "身份证号校验",
								template: "身份证号有误，请重新输入身份证号！",
								duration: 2000
							});
							return false;
						}
					}
					paramData["QueryReason"] = $scope.detailListInfo.QueryReason;

					paramData["OperateUserID"] =  AmApp.userID;
					paramData["OperateOrgID"] =  AmApp.orgID;
					alert(paramData) ;
					//执行更新操作
//					$db_operate.updateRecord($scope,"0014",paramData);
				}
			}
		}
		
		
		//提交
		$scope.submitOpinion = function(){ 
			$scope.goDetailTopFlag = false;
			var data = $scope.getModelNoReadOnlyData();		
			data["PrimaryKey"] = "QueryID"; 
			data["QueryID"] = $scope.selectedListItem["QueryID"]; 
			data["approvePhase"]="1020";

			$db_operate.updateRecord($scope,"0014",data);			
		}
		
		
		//删除
		$scope.deleteRecord = function(){
			var confirmPopup = $ionicPopup.confirm({
                title: '操作提示',
                template: '<p align="center">确定删除该信息吗？</p>',
                okText: '企业征信',
                cancelText: '个人征信'
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
        	            $rootScope.moduleSwitch('INDCheckRecord',"query");
                    }, 1200); 
                } 
            });       	
		}
		
		
	});
