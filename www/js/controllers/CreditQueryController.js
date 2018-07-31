/**
 * added by xbwang 20180602 征信查询
 * 
 */
angular
    .module('com.amarsoft.mobile.controllers.query.CreditQueryController', [])
	.controller('CreditQueryController',function ($scope,pdfDelegate,$rootScope,$cordovaFileTransfer,$list,$detail,$model,$db_operate,$filter,$ionicModal,$ionicPopup,$http,$ionicLoading,$state,$timeout,$group) {
		$scope.param = {
			pageSize : 10,
			pageNo : 1,
			// 定义中间部分使用的 APP_List_Group 与 APP_Menu_Group 的GroupID
			groupId : "CreditQueryList",
			// PC端的RunJavaMethodSqlca方法；用来查询中间部分需要显示的数据
			className : "com.amarsoft.app.als.mobile.impl.query.QuickQueryImpl",
			methodName : "CreditQueryList",
			menuTitle : "征信查询",
			flag : true
		}
		$model.init($scope);
		$list.load($scope,$scope.param);
		$detail.load($scope);
		$scope.$on('sign-opinionRefresh', function (e, data) {
			$scope.refresh();
		});
		//切换tab页后事件
		$scope.chooseModel = function(model,param){
			if(typeof($scope.selectedListItem) === "undefined") return;
			if(model.ColName.indexOf('影像') != -1){
			  $timeout(function () {
				  $scope.dic = {};
				  $scope.dic.ObjectType = "CreditQueryApply";
				  $scope.dic.loanType = "";
				  var ColId = $scope.selectedMenuItem.ColId;
				  if(ColId == "1010" || ColId == "1030"){
					  //在“待提交”和“退回”中可以新增影像
					  $scope.dic.showFlag = "true";
				  }else{
					  $scope.dic.showFlag = "false";
				  }
				  if($scope.selectedListItem != undefined){
					  $scope.dic.ObjectNo = $scope.selectedListItem.QueryID;
					  $scope.$broadcast('to-screenage',$scope.dic);
				  }
			  }, 100);
		    }else if(model.ColId=="104030"){//查看征信报告
		    	var FilePath ="";$scope.pdfUrl="blank.pdf";
		    	pdfDelegate
	            .$getByHandle('my-pdf-container')
	            .goToPage(1);
		    	document.getElementById("pdfDelegateInput").value="1";				FilePath = $group.RunMethod("AppViewCreditReport","CreateCreditReportPdf",param.queryData.QueryID );
				if(FilePath==""){
					pdfDelegate
				    .$getByHandle('my-pdf-container')
				    .load($scope.pdfUrl);
					return;
				}
		    	document.addEventListener('deviceready', function () {
					appIonicLoading.show({template: '加载中...', duration: 20000});
					
					var urlTemp = AmApp.config.ServiceRealRootPath + "/AttachView?FullPath=" + FilePath;
					var targetPath = cordova.file.cacheDirectory +new Date().getTime() + ".pdf";
					var trustHosts = true;
					var options = {};
					$cordovaFileTransfer.download(urlTemp, targetPath, options, trustHosts)
					.then(function (result) {
						appIonicLoading.hide();
						// Success!
						$timeout(function () {
							$scope.pdfUrl = result.nativeURL;
							pdfDelegate
						    .$getByHandle('my-pdf-container')
						    .load($scope.pdfUrl);
						}, 100);
					}, function (err) {
						// Error
						appIonicLoading.show({template: '加载失败！code：' + err.code, duration: 2000});
					}, function (progress) {
						$timeout(function () {
							$scope.downloadImageProgress = (progress.loaded / progress.total) * 100;
						}, 500);
					});
				}, false);
		    }
		    else{
			    $timeout(function () {
	 				$scope.$broadcast('to-detail',param);
	 			}, 100);
		    }
		}
		//设置列表参数
		$scope.setListParam = function(data){
			// 中间部分 tab页对应的ID： $scope.selectedMenuItem["ColId"]
			if($scope.selectedMenuItem["ColId"] !== "undefined" &&
					typeof($scope.selectedMenuItem["ColId"]) !== "undefined"){
				/***
				 select COLID ,MG.* from APP_Menu_Group MG where GroupID='CreditQueryList'  and length(ColID)=4  ;
				 1010	待提交
				 1020	审批中
				 1030	退回
				 1040	批准
				 1050	否决
				 $scope.selectedMenuItem["ColId"] 的值为ColID
				 */ 
				data["PhaseType"] = $scope.selectedMenuItem["ColId"] ;	// Flow_Object.PhaseType
				data["UserID"] = AmApp.userID ; // Flow_Object.UserID
			} 
		}
		
		/**** 
		 * 设置打开右侧详情默认选择Tab页面的展示模板（DataObject_Catalog.DoNo）
		 */
		$scope.setDetailParam = function(modelInfo, detailParam) {
			/** 
			 * 第一次打开页面列表的时候，默认选择一条列表中的征信查询记录（$scope.selectedListItem），获取选择记录的以下参数：
			 * 		征信查询流水号：Query_History.QueryID;
			 *  	征信查询类型：Query_History.ReportType
			 * 
			 * 从表（select * from APP_Menu_Group MG where GroupID='CreditQueryList'）中获取详情Tab页信息（modelInfo）；
			 * 	显示模板： APP_Menu_Group.Action
			 * 
			 */
			if (typeof ($scope.selectedListItem) !== "undefined" && $scope.selectedListItem != "" ) {
				detailParam["queryData"]["QueryID"] = $scope.selectedListItem.QueryID ;
				// 根据征信查询类型：个人、企业征信不同使用的显示模板也不同
				if($scope.selectedListItem.ReportType=="ICR") {
					detailParam["queryData"]["modelNo"] = "ICRCreditQueryInfo" ;
				} else {
					detailParam["queryData"]["modelNo"] = "ECRCreditQueryInfo" ;
				}
				detailParam["queryData"]["ReturnType"] = "Info";
			}
		}
		
		// 新增 ： 右侧界面左上端新增图标触发的函数
		$scope.insertRecord = function(){
			var confirmPopup = $ionicPopup.confirm({
                title: '操作提示',
                template: '<p align="center">选择查询的征信类型？</p>',
                okText: '个人征信',
                cancelText: '企业征信'
            });
			confirmPopup.then(function (res) {
                if (res) {
                	$scope.chooseDetail({},null,true);	// 弹出模态窗口
                	//设置模态详情页面所需参数
        			$scope.setDetailModalQueryParam = function(modal,detailModalQueryParam){
        				detailModalQueryParam["queryData"]["modelNo"] = "AddICRCreditQueryInfo";
        				detailModalQueryParam["queryData"]["ReturnType"] = "Info";
        			}
        			
        			$scope.saveModel = function(){
        				var data = $scope.getModelNoReadOnlyData(true);
        				var OperateFlag = data["OperateFlag"];
        				if(!OperateFlag){
        					appIonicLoading.show({
  				    		   template: "数据录入不完整！",
  				    		   animation: 'fade-in',
  				    		   showBackdrop: true,
  				    		   duration: 2000
  				    	    });	
        					return;
        				}
        				var certTypes = $scope.detailListInfo.CertType;
    					var certIDs = $scope.detailListInfo.CertID;
    					
    					if(certTypes === "0" || certTypes === "1" || certTypes === "7"){
    						if(certIDs.length != 15 && certIDs.length != 18){
    							$ionicLoading.show({
    								title: "申请信息校验",
    								template: "身份证、户口簿长度必须是15位或者18位！",
    								duration: 1500});
    				            return;
    						}
    						if(!CheckLisince(certIDs)){
    							$ionicLoading.show({
    								title: "申请信息校验",
    								template: "身份证、户口簿输入有误，请重新输入！",
    								duration: 1500});
    				            return;
    						}
    					}
        				$scope.goDetailTopFlag = false;
        				var paramData = {};	// 用来保存页面中录入的参数名称与参数值
        				paramData["ReportType"] =  "ICR" ;
        				paramData["CustomerName"] = $scope.detailListInfo.CustomerName;
        				paramData["CertType"] = $scope.detailListInfo.CertType;
        				paramData["CertID"] = $scope.detailListInfo.CertID;
        				paramData["QueryReason"] = $scope.detailListInfo.QueryReason;
        				paramData["QueryAccessStrategy"] ="DEFAULT";
        				paramData["OperateUserID"] =  AmApp.userID;
        				paramData["OperateOrgID"] =  AmApp.orgID;
        				paramData["LoanType"] = $scope.detailListInfo.LoanType;
        				
        				runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
        						"AddCreditQuery", paramData, function (data, status) {
        					if(typeof(data)!="undefined" && data.array[0].ReturnCode=="SUCCESS") {
        						$scope.modal.hide() ;
        						$rootScope.moduleSwitch('CreditQuery',"query");
        					} else {
        						appIonicLoading.show({
     				    		   template: "新增失败！",
     				    		   animation: 'fade-in',
     				    		   showBackdrop: true,
     				    		   duration: 2000
     				    	    });	
        					}
        				});
        			}
                } else {
                	$scope.chooseDetail({},null,true);	// 弹出模态窗口
                	//设置模态详情页面所需参数
        			$scope.setDetailModalQueryParam = function(modal,detailModalQueryParam){
        				detailModalQueryParam["queryData"]["modelNo"] = "AddECRCreditQueryInfo";
        				detailModalQueryParam["queryData"]["ReturnType"] = "Info";
        			}
        			
        			$scope.saveModel = function(){
        				var data = $scope.getModelNoReadOnlyData(true);
        				var OperateFlag = data["OperateFlag"];
        				if(!OperateFlag){
        					appIonicLoading.show({
  				    		   template: "数据录入不完整！",
  				    		   animation: 'fade-in',
  				    		   showBackdrop: true,
  				    		   duration: 2000
  				    	    });	
        					return;
        				}
        				if($scope.detailListInfo.CertType === "ZZ"){
        					var flag = CheckORG($scope.detailListInfo.CertID);
        					if(!flag){
        						$ionicLoading.show({
        							title: "申请信息校验",
        							template: "组织机构代码有误!",
        							duration: 1500});
        			            return;
        					}
        				}
        				
        				if($scope.detailListInfo.CertType === "LC"){
        					var flag = CheckORG($scope.detailListInfo.CertID);
        					if(!flag){
        						$ionicLoading.show({
        							title: "申请信息校验",
        							template: "中征码有误!",
        							duration: 1500});
        			            return;
        					}
        				}
        				
        				
        				$scope.goDetailTopFlag = false;
        				var paramData = {};	// 用来保存页面中录入的参数名称与参数值
        				paramData["ReportType"] =  "ECR" ;
        				paramData["CustomerName"] = $scope.detailListInfo.CustomerName;
        				paramData["CertType"] = $scope.detailListInfo.CertType;
        				paramData["CertID"] = $scope.detailListInfo.CertID;
        				paramData["QueryReason"] = $scope.detailListInfo.QueryReason;
        				paramData["QueryAccessStrategy"] ="DEFAULT";
        				paramData["OperateUserID"] =  AmApp.userID;
        				paramData["OperateOrgID"] =  AmApp.orgID;
        				paramData["LoanType"] = $scope.detailListInfo.LoanType;
        				
        				runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
        						"AddCreditQuery", paramData, function (data, status) {
        					if(typeof(data)!="undefined" && data.array[0].ReturnCode=="SUCCESS") {
        						$scope.modal.hide() ;
        						$rootScope.moduleSwitch('CreditQuery',"query");
        					} else {
        						appIonicLoading.show({
     				    		   template: "新增失败！",
     				    		   animation: 'fade-in',
     				    		   showBackdrop: true,
     				    		   duration: 2000
     				    	    });	
        					}
        				});
        			}
                }
            }) ;
			
		}
		
		//删除 : 右侧界面左上端删除图标触发的函数
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
		            	"DeleteCreditQuery",
		            	{QueryID:$scope.selectedListItem["QueryID"]},
			            function (data, status) {
			            	if(typeof(data)!="undefined" && data.array[0].ReturnCode=="SUCCESS"){
			            		appIonicLoading.show({
					    		   template: "删除成功！",
					    		   animation: 'fade-in',
					    		   showBackdrop: true,
					    		   duration: 2000
					    	    });
			            		//刷新页面
			                    $timeout(function () {
			        	            $rootScope.moduleSwitch('CreditQuery',"query");
			                    }, 1200); 
			            	}else{
			            		appIonicLoading.show({
					    		   template: "删除失败！",
					    		   animation: 'fade-in',
					    		   showBackdrop: true,
					    		   duration: 200
					    	    });
			            	}
		            });
                } 
            });       	
		}
		
		// 保存： 征信查询详情 右侧界面下端[保存]按钮触发的函数
		$scope.saveModel = function(){ 
			var data = $scope.getModelNoReadOnlyData();
			var OperateFlag = data["OperateFlag"];
			if(!OperateFlag){
				appIonicLoading.show({
		    		   template: "数据录入不完整！",
		    		   animation: 'fade-in',
		    		   showBackdrop: true,
		    		   duration: 2000
		    	    });	
				return;
			}
			
			var paramData = {}; // 保存修改后的数据
			paramData["PrimaryKey"] = "QueryID" ;
			paramData["QueryID"] = $scope.detailInfo.QueryID ;
			paramData["CustomerName"] = $scope.detailInfo.CustomerName ;
			paramData["CertType"] = $scope.detailInfo.CertType ;
			paramData["CertID"] = $scope.detailInfo.CertID ;
			paramData["QueryReason"] = $scope.detailInfo.QueryReason;
			paramData["QueryAccessStrategy"] = $scope.detailInfo.QueryAccessStrategy;
			paramData["OperateUserID"] =  AmApp.userID ;
			paramData["OperateOrgID"] =  AmApp.orgID ;
			paramData["OperateFlag"]= true ;
			//var isSuccess = isCheckSuccess($scope.details["0"].groupColArray);
			var isSuccess = validFunction($scope.detailInfo);
			if(isSuccess){
				$db_operate.updateRecord($scope,"0014",paramData) ;
			}
		}
		
		
		//签署意见并提交 : 征信查询详情 右侧界面下端[签署意见并提交]按钮触发的函数
		$scope.signOpinion = function(){
			//校验必输项；有为空的 OperateFlag等于false
			var data = $scope.getModelNoReadOnlyData();
			var OperateFlag = data["OperateFlag"];
			if(!OperateFlag || OperateFlag === "false"){
				$ionicLoading.show({
					title: "业务处理",
					template: "请确认数据输入是否完整！",
					duration: 1500
				});
				return;
			}
			// 校验校验项是否通过，并设置提示信息
			var isSuccess = validFunction($scope.detailInfo);
			if(!isSuccess){
				$ionicLoading.show({
					title: "业务处理",
					template: "请确认数据输入是否正确！",
					duration: 1500
				});
				return;
			}
			var filterFTSerialNoParam = {  //获取合同主键的请求数据										
				ClassName : "com.amarsoft.app.als.mobile.impl.ComponentQuery",
				MethodName : "BusinessApplyGetFilterFTSerialNo",
				ObjectType : "CreditQueryApply",
				ObjectNo : $scope.selectedListItem.ObjectNo,
				UserID : AmApp.userID,
				TransactionType : "Sqlca"
			}; 
			$scope.FTSerialNo = $group.business(filterFTSerialNoParam)["FTSerialNo"];
			$scope.showModal("templates/common/commonModelView/signOpinionModal.html");
			$timeout(function(){					
				$scope.$broadcast("go-SignOpinionController",{
					SerialNo : $scope.selectedListItem["ObjectNo"],	// CreditQuery_Apply
					ObjectType : "CreditQueryApply" , // CreditQueryApply  征信查询申请
					FlowNo : $scope.selectedListItem["FlowNo"],
					PhaseNo : $scope.selectedListItem["PhaseNo"],
					PhaseName : $scope.selectedListItem["PhaseName"],
					FTSerialNo : $scope.FTSerialNo ,
					ApplyType : "CreditQueryApply" }  // CreditQueryApply 
				);
			},100);
		}
		
		//
		var validFunction = function(object){
			var certType = object.CertType;
			var certID = object.CertID;
			if(certType === "ZZ"){
				var flag = CheckORG(certID);
				if(!flag){
					setCheckObj($scope.details["0"].groupColArray,"CertID","组织机构代码有误!",true);
				}else{
					setCheckObj($scope.details["0"].groupColArray,"CertID","组织机构代码有误!",false);
				}
			}else if(certType === "0" || certType === "1" || certType === "7"){
				if(certID.length != 15 && certID.length != 18){
		            setCheckObj($scope.details["0"].groupColArray,"CertID","身份证、户口簿长度必须是15位或者18位!",true);
				}else{
					setCheckObj($scope.details["0"].groupColArray,"CertID","",false);
				}
				if(!CheckLisince(certID)){
					setCheckObj($scope.details["0"].groupColArray,"CertID","身份证号有误!",true);
				}else{
					setCheckObj($scope.details["0"].groupColArray,"CertID","",false);
				}
			}else if(certType === "LC"){
				if(!CheckLoanCardID(certID)){
					setCheckObj($scope.details["0"].groupColArray,"CertID","中征码有误!",true);
				}else{
					setCheckObj($scope.details["0"].groupColArray,"CertID","中征码有误!",false);
				}
			}else{
				setCheckObj($scope.details["0"].groupColArray,"CertID","",false);
			}
			return isCheckSuccess($scope.details["0"].groupColArray);
		}
	});
