angular
    .module('com.amarsoft.mobile.controllers.smeFirstInspect.list', ['ui.grid','ui.grid.selection','ui.grid.edit','ui.grid.pagination','ui.grid.resizeColumns','ui.grid.autoResize'])
	.controller('smeFirstInspectListController',function ($scope,$rootScope,$list,$detail,$model,$filter,$db_operate,$group,
			$http,$ionicScrollDelegate,$ionicLoading, $ionicPopup, $state,$ionicModal,$cordovaFileTransfer,$timeout,$sce,i18nService) {
		var param = {
			pageSize : 8,
			pageNo : 1,
			groupId : "SmeFirstInspectList",
			className : "com.amarsoft.webservice.business.InspectImpl",
			methodName : "getSmeFirstInspectList",
			menuTitle : "小企业首检",
			flag : true,
			Transaction:"null"
		}
		$model.init($scope);
		$list.load($scope,param);
		$detail.load($scope);
		//切换tab页后事件
		$scope.chooseModel = function(model,param){
			if ($scope.listSearchFlag) {
				$scope.listSearchFlag = false;
			}
			var selectedListItem = $scope.getSelectedListItem();
			if(typeof(selectedListItem) === "undefined") {
				//当没有数据时，仍然发一次交易，用以清空上一个数据的值
				$scope.$broadcast('to-SmeOrEntCapitalUsedList',param);
				return;
			};
			if(param["url"] === "SmeOrEntCapitalUsedList"){
			   param["SerialNo"] = selectedListItem["SerialNo"];
			   param["ObjectNo"] = selectedListItem["ObjectNo"];
			   param["ObjectType"] = model["ObjectType"];
			   param["colId"] = $scope.selectedMenuItem.ColId;
 			   $scope.ngController = "SmeOrEntCapitalUsedListController";
 			   $timeout(function () {
					$scope.$broadcast('to-SmeOrEntCapitalUsedList',param);
			   }, 100);
	 		}else if(param["url"] === "SmeCheckedALS"){
	 			//国际化；
		        i18nService.setCurrentLang("zh-cn");
		        $scope.grid_smeLoanUsage = {
		            data: [],
		            columnDefs: [{ 
		            	 field: "Index",
		            	 displayName : "序号",
		            	 width:"10%"
		             },
		             { 
		            	 field: "ItemDate",
		            	 displayName : "日期"
		             },
		             { 
		            	 field: "ItemSum",
		            	 displayName : "使用金额"
		             },
		             { 
		            	 field: "BankName",
		            	 displayName : "转入银行"
		    		 },
		    		 { 
		            	 field: "Bankcardno",
		            	 displayName : "转入账号"
		    		 },
		    		 { 
		            	 field: "ItemName",
		            	 displayName : "转入单位"
		    		 },
		    		 { 
		            	 field: "ItemDescribe",
		            	 displayName : "交易内容"
		    		 },
		    		 { 
		            	 field: "Relevancy",
		            	 displayName : "是否关联"
		    		 },
		    		 { 
		            	 field: "Often",
		            	 displayName : "是否为长期(往来客户)"
		    		 }],
		            enableSorting: true, //是否排序
		            useExternalSorting: false, //是否使用自定义排序规则
		            enableGridMenu: true, //是否显示grid 菜单
		            showGridFooter: false, //是否显示grid footer
		            enableHorizontalScrollbar :  1, //grid水平滚动条是否显示, 0-不显示  1-显示
		            enableVerticalScrollbar : 1 //grid垂直滚动条是否显示, 0-不显示  1-显示
		        };
	 			var queryParam = {
					ObjectNo : selectedListItem["SerialNo"],
					AcctLoanNo : selectedListItem["ObjectNo"],
					BCSerialNo : selectedListItem["BCSerialNo"],
					ClassName : "com.amarsoft.webservice.business.InspectImpl",
					MethodName : "getSmeCheckedALS",
					Transaction:"Sqlca"
				};
				var result = $group.business(queryParam);
				viewHtmlService($scope,angular.fromJson(result),$cordovaFileTransfer,$timeout,$sce);
	 		}else if(param["url"] === "IndACCTLoan"){
	 			$scope.setTempletParam = function(data){
	 				data["ObjectNo"] = $scope.selectedListItem["BCSerialNo"];
	 				data["ObjectType"] = "BusinessContract";
	 			}
	 			$timeout(function () {
	 				$scope.$broadcast('to-detail',param);
	 			}, 100);
	 		}
			$timeout(function () {
				$scope.dic = {};
				$scope.dic.ObjectType = "PostLoanFirstApply";
				$scope.dic.loanType = "";
				if($scope.selectedListItem != undefined){
					$scope.dic.ObjectNo = $scope.selectedListItem.SerialNo;
					$scope.$broadcast('to-screenage',$scope.dic);
				}
			}, 100);
		}
		$scope.setDetailParam = function(modelInfo,detailParam){
		   var selectedListItem = $scope.getSelectedListItem();
		   if(selectedListItem !== "undefined" && typeof(selectedListItem) !== "undefined" && selectedListItem !== "" && selectedListItem !== null){
			   if(modelInfo.Action === "" || modelInfo.Action === null){
				   detailParam["url"] = "SelectObjectInfo";
			   }else{
				   detailParam["url"] = modelInfo.Action;
			   }
			   if(modelInfo.Action === "IndACCTLoan"){
				   detailParam["queryData"]["SerialNo"] = selectedListItem["ObjectNo"];//2017040500000010
				   detailParam["queryData"]["ObjectNo"] = selectedListItem["ObjectNo"];
				   detailParam["queryData"]["ObjectType"] = selectedListItem["ObjectType"];
			   }
			   detailParam["queryData"]["ReturnType"] = "Info";
		   }
	    }
	    //新增按钮
	    $scope.insertRecord = function(){
	    	var selectedListItem = $scope.getSelectedListItem();
	    	if(selectedListItem === "undefined" || typeof(selectedListItem) === "undefined" ||
	    			selectedListItem === "" || selectedListItem === null){
	    		$ionicLoading.show({
					title: "业务处理",
					template: "请先增加一笔首检任务!",
					duration: 1500
				});
	    		return;
	    	}
	    	$scope.saveModelFlag = "insert";
			if($scope.selectedDetailMenuItem.ColId === "1010"){
				$scope.chooseDetail({},null,true);
				//设置业务关联流水号
				$scope.setSerialNo = function(serialNo){
					$scope.detailInfo["ItemNo"] = serialNo;
				}
				//设置模态详情页面所需参数
				$scope.setDetailModalQueryParam = function(modal,detailModalQueryParam){
					detailModalQueryParam["queryData"]["SerialNo"] =  modal["scope"]["selectedDetailListItem"]["SerialNo"];
					detailModalQueryParam["queryData"]["ItemNo"] = modal["scope"]["selectedDetailListItem"]["ItemNo"];
					detailModalQueryParam["queryData"]["modelNo"] = "SmeOrEntCapitalUsedDetail";
					detailModalQueryParam["queryData"]["ReturnType"] = "Info";
				}
				$scope.toListDetailAfter = function(){
					$scope.getSerialNo("POSTLOAN_CHECK_DETAIL");
					$scope.detailInfo["InputUserID"] = AmApp.userID;
					$scope.detailInfo["InputOrgID"] = AmApp.orgID;
					$scope.detailInfo["InputUserName"] = AmApp.userName;
					$scope.detailInfo["InputOrgName"] = AmApp.orgName;
					$scope.detailInfo["InputDate"] = $filter('date')(new Date(),"yyyy/MM/dd"); 
					//$scope.detailInfo["UpdateDate"] = $filter('date')(new Date(),"yyyy/MM/dd"); 
				}
				$scope.saveModel = function(){
					var paramData = {};
					paramData = $scope.getModelNoReadOnlyData();
					if(typeof($scope.detailListInfo.ItemDate) !== 'undefined'){
						if($scope.detailListInfo.ItemDate.format("yyyy/MM/dd") === "NaN/aN/aN"){
							setCheckObj($scope.listDetails["0"].groupColArray,"ItemDate","请选择日期!",true);
						}else
							setCheckObj($scope.listDetails["0"].groupColArray,"ItemDate","",false);
					}else{
						setCheckObj($scope.listDetails["0"].groupColArray,"ItemDate","",false);
					}
					var OperateFlag = paramData["OperateFlag"];
					paramData["SerialNo"] = $scope.selectedListItem["SerialNo"];
					paramData["ItemType"] = "02";
					paramData["ObjectNo"] = $scope.selectedListItem["SerialNo"];
					paramData["ObjectType"] = "FirstCheck";
					paramData["InputUserID"] = AmApp.userID; 
					paramData["InputOrgID"] = AmApp.orgID;
					paramData["InputDate"] = $filter('date')(new Date(),"yyyy/MM/dd"); 
					var isSuccess = isCheckSuccess($scope.listDetails["0"].groupColArray);
					if(OperateFlag && isSuccess){
						$db_operate.insertRecord($scope,"0011",paramData,"IndOrEntCapitalUsedAOU");
						$scope.modal.remove();
					}
					/*$db_operate.insertRecord($scope,"0011",paramData,"IndOrEntCapitalUsedAOU");
					$scope.modal.remove();*/
				}
			}
		}
	    $scope.deleteRecord = function(){
	    	if($scope.selectedDetailListItem == undefined){
	    		//没有数据的时候
	    		return false;
	    	}
	    	var sItemNo = $scope.selectedDetailListItem["ItemNo"];
	    	var sSerialNo = $scope.selectedDetailListItem["SerialNo"];
	    	var sObjectNo = $scope.selectedDetailListItem["ObjectNo"];
	    	var sObjectType = $scope.selectedDetailListItem["ObjectType"];
			if (typeof(sItemNo)=="undefined" || sItemNo.length==0)
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
				        		ObjectNo : sObjectNo,
				        		ObjectType : sObjectType,
				        		NewValue : sItemNo,
				        		Type : "deleteSmeOrEntCapitalUsedDetail"
				        	}, function (data, status) {
			            	if(data["Flag"] === "Success"){
			            		appIonicLoading.show({
					    		   template: "删除成功！",
					    		   animation: 'fade-in',
					    		   showBackdrop: true,
					    		   duration: 2000
					    	    });
			            		$timeout(function() {
				            		$scope.changeModel($scope.selectedDetailMenuItem, $scope.tabIndex);
								}, 1000);
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
	    
	    var InspectIndFirstchooseCustomer = function(uiGridParam){
    		uiGridParam["SelName"] = "SelectCheckContract";
    		uiGridParam["SelFieldId"] = "BdSerialNo,SerialNo,BusinessTypeName,CustomerID,CustomerName,BusinessSum,Balance,CustType";
    		uiGridParam["SelFieldName"] = "借据编号,合同编号,业务品种,客户编号,客户姓名,合同金额（元）,合同余额（元）,客户类型";
    		uiGridParam["ParamId"] = "OperateUserID";
    		uiGridParam["ParamValue"] = AmApp.userID;
    		$scope.doClickSure = function(){
    			$scope.UIGridSelectedRow.ObjectNo = $scope.UIGridSelectedRow.BdSerialNo;
    			$rootScope.gotoCheckSelect({
    				selName:"SelectCheckContract",InspectType:"010010"},$scope.UIGridSelectedRow);
    			$scope.refreshFlag = true;//避免重复刷新
    			$scope.$watch('InspectRefreshFlag',function(newValue,oleValue){
					if(newValue && $scope.refreshFlag ){
						$scope.refreshFlag = false;
						 $rootScope.selectCatalogModalStyle = $rootScope.selectCatalogModalStyleTemp;
						$scope.refresh();
					}
				});
	        }
		}
	    
	    
	  //新增按钮-（发起贷后检查）--小企业首检
	    $scope.insertNewMain = function(item){
	    	$rootScope.selectCatalogModalStyleTemp =   $rootScope.selectCatalogModalStyle;
	    	 $rootScope.selectCatalogModalStyle =  $rootScope.bigModalStyle;
	    	 $timeout(function() {
	    		 $scope.doClick(InspectIndFirstchooseCustomer);
				}, 200);
	    	
//	    	 $ionicModal.fromTemplateUrl("templates/approve/common/selectDubillList.html", {
//	                scope: $scope,
//	                backdropClickToClose: false
//	            }).then(function (modal) {
//         		$scope.modal = modal;
//         		$scope.modal.show();
//         		$timeout(function(){					
//					$scope.$broadcast("go-indFirstInspectSelectListController",{
//						Item:item,selName:"SelectCheckContract",InspectType:"010010"});
//				},100)
//         	}) 
		}
	    
	    
	    //删除按钮-（删除一条贷后检查记录）--小企业首检
	    $scope.deleteInspectRecordMain = function(item){
	    	var selectedListItem = $scope.getSelectedListItem();
	    	if(selectedListItem == undefined){
	    		//没有数据的时候
	    		return false;
	    	}
	    	var confirmPopup = $ionicPopup.confirm({
                title: '操作提示',
                template: '您确定要删除该记录吗？',
                okText: '确定',
                cancelText: '取消'
            });
	    	
	    	confirmPopup.then(function (res) {
                if (res) {

        			runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
        	                "SelectObjectList", {
        				 SerialNo:selectedListItem.SerialNo,
        				 ClassName:"com.amarsoft.webservice.business.InspectImpl",
        				 MethodName:"deleteSmeirstInspect",
        				 ObjectType : "PostLoanCheckApply",
        				 Transaction:"Sqlca"
        	            }, function (data, status) {
        	            	if(data.Result=='N'){
        	            		appIonicLoading.show({
        				    		   template: "删除失败！",
        				    		   animation: 'fade-in',
        				    		   showBackdrop: true,
        				    		   duration: 2000
        				    	    });
        	            	}else{
        	            		var result = data["array"][0];
        	                  	 if(result[0].Value=="SUCCESS"){
        	                  		 appIonicLoading.show({
        	       			    		   template: "删除成功！",
        	       			    		   animation: 'fade-in',
        	       			    		   showBackdrop: true,
        	       			    		   duration: 2000
        	       			    	    });
        	                  		$timeout(function() {
        	                  			$scope.refresh();
    								}, 1000);
        	                  	 }else if(result[0].Value=="N"){
        	                  		appIonicLoading.show({
     	       			    		   template: "删除失败！",
     	       			    		   animation: 'fade-in',
     	       			    		   showBackdrop: true,
     	       			    		   duration: 2000
     	       			    	    });
        	                  	 }
        	            	}
        	            });
                	
                }
            });
		}
	  //提交
        $scope.OpinionNo="";
    	//签署意见并提交
		$scope.Confirm = function(){
			$scope.SerialNoFilter="";//从选中的列表中获取所需的主键
			$scope.FTSerialNoFilter="";//从选中的列表中获取所需的主键

			//**********过滤SerialNO*****start****
			$scope.filterSerialNoParam={};
			var filterSerialNoParam = {  //获取合同主键的请求数据
				ClassName : "com.amarsoft.app.als.mobile.impl.ComponentQuery",
				MethodName : "getFilterSerialNo",
				TransactionType : "null"
			};  
							
			//**********过滤SerialNO******* end**
			
			//**********过滤FTSerialNO******* start**
			$scope.filterFTSerialNoParam={};
			var filterFTSerialNoParam = {  //获取合同主键的请求数据										
				ClassName : "com.amarsoft.app.als.mobile.impl.ComponentQuery",
				MethodName : "SmeInspectGetFilterFTSerialNo",
				TransactionType : "Sqlca"
			}; 
			//**********过滤FTSerialNO******* end**
			//遍历$scope.selectedListItem，进行参数传入filterSerialNoParam对象和filterFTSerialNoParam对象
			for(var i=0;i<$scope.selectedListItem.length;i++){			
				filterSerialNoParam[$scope.selectedListItem[i]["KeyId"]]=$scope.selectedListItem[i]["Value"];
				filterFTSerialNoParam[$scope.selectedListItem[i]["KeyId"]]=$scope.selectedListItem[i]["Value"];
			}		
			for(var i in $scope.selectedListItem){
				filterFTSerialNoParam[i]=$scope.selectedListItem[i];
			}
			//执行查询，并返回所需参数
			$scope.SerialNoFilter = $group.business(filterSerialNoParam)["SerialNo"];
//			$scope.FTSerialNoFilter = $group.business(filterFTSerialNoParam)["FTSerialNo"];
			var Values =  $group.business(filterFTSerialNoParam);
			
			$scope.FTSerialNoFilter = Values["FTSerialNo"];
			if($scope.ApproveType == "ApproveCreditApply"){		//特殊业务签批
				$scope.showModal("templates/common/commonModelView/signOpinionModal1.html");
				$timeout(function(){					
					$scope.$broadcast("go-SignOpinionController",{
						$scope:$scope,
						SerialNo:$scope.SerialNoFilter,
						ObjectType:$filter("filter")($scope.selectedListItem,"ObjectType","KeyId")[0].Value,
						FlowNo:$filter("filter")($scope.selectedListItem,"FlowNo","KeyId")[0].Value,
						PhaseNo:$filter("filter")($scope.selectedListItem,"PhaseNo","KeyId")[0].Value,
						PhaseName:$filter("filter")($scope.selectedListItem,"PhaseName","KeyId")[0].Value,
						OccurType:$filter("filter")($scope.selectedListItem,"OccurType","KeyId")[0].Value,
						ObjectNo:$filter("filter")($scope.selectedListItem,"ObjectNo","KeyId")[0].Value,
						FTSerialNo:$scope.FTSerialNoFilter,
						ApplyType:$scope.ApproveType});
				},100)
			} else {	//一般业务签批
				$scope.showModal("templates/common/commonModelView/signOpinionModal.html");
				$timeout(function(){					
					$scope.$broadcast("go-SignOpinionController",{
						$scope:$scope,
						SerialNo:$scope.SerialNoFilter,
						ObjectType:$scope.selectedListItem.ObjectType,
						FlowNo:Values["FlowNo"],
						PhaseNo:Values["PhaseNo"],
						FTSerialNo:$scope.FTSerialNoFilter,
						PhaseName:Values["PhaseName"],
						ApplyType:Values["ApplyType"]});
				},100)
				//生成主键FLOW_OPINION表的主键opinionNO，在签署意见时，保存到数据记录中		    			
		    	$scope.getSerialNo("FLOW_OPINION","OpinionNo");			           
		        //获取修改数据
				 $scope.setSerialNo = function(serialNo){
		            	$scope.OpinionNo = serialNo;
				}
			}
			 
		}
})


