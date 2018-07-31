angular
    .module('com.amarsoft.mobile.controllers.entFirstInspect.list', [])
	.controller('entFirstInspectListController',function ($scope,$list,$detail,$model,$rootScope,$group,$filter,$db_operate,
			$http,$ionicScrollDelegate,$ionicLoading, $ionicPopup, $state,$ionicModal,$cordovaFileTransfer,$timeout,$sce,i18nService) {
		var param = {
			pageSize : 8,
			pageNo : 1,
			groupId : "EntFirstInspectList",
			className : "com.amarsoft.webservice.business.InspectImpl",
			methodName : "getEntFirstInspectList",
			menuTitle : "公司首检",
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
			if(typeof(selectedListItem) === "undefined"){
				//当没有数据时，仍然发一次交易，用以清空上一个数据的值
				$scope.$broadcast('to-IndOrEntCapitalUsedList',param);
				return;
			}
			if(param["url"] === "IndOrEntCapitalUsedList"){
			   param["SerialNo"] = selectedListItem["SerialNo"];
			   param["ObjectNo"] = selectedListItem["ObjectNo"];
			   param["ObjectType"] = selectedListItem["ObjectType"];
			   param["colId"] = $scope.selectedMenuItem.ColId;
 			   $scope.ngController = "IndOrEntCapitalUsedListController";
 			   $timeout(function () {
					$scope.$broadcast('to-IndOrEntCapitalUsedList',param);
			   }, 100);
	 		}else if(param["url"] === "EntCheckedALS"){
	 			//国际化；
		        i18nService.setCurrentLang("zh-cn");
		        $scope.grid_entLoanUsage = {
		            data: [],
		            columnDefs: [{ 
		            	 field: "Index",
		            	 displayName : "序号",
		            	 width:"10%"
		             },
		             { 
		            	 field: "ItemName",
		            	 displayName : "对方用户名"
		             },
		             { 
		            	 field: "Sum",
		            	 displayName : "金额(万元)"
		             },
		             { 
		            	 field: "Date",
		            	 displayName : "日期"
		    		 },
		    		 { 
		            	 field: "Describe",
		            	 displayName : "资金用途"
		    		 }],
		            enableSorting: true, //是否排序
		            useExternalSorting: false, //是否使用自定义排序规则
		            enableGridMenu: true, //是否显示grid 菜单
		            showGridFooter: false, //是否显示grid footer
		            enableHorizontalScrollbar :  1, //grid水平滚动条是否显示, 0-不显示  1-显示
		            enableVerticalScrollbar : 1 //grid垂直滚动条是否显示, 0-不显示  1-显示
		        };
	 			var queryParam = {
					ObjectNo : selectedListItem["ObjectNo"],
					ObjectType : selectedListItem["ObjectType"],
					SerialNo : selectedListItem["SerialNo"],
					ClassName : "com.amarsoft.webservice.business.InspectImpl",
					MethodName : "getEntCheckedALS",
					Transaction:"Sqlca"
				};
				var result = $group.business(queryParam);
				viewHtmlService($scope,angular.fromJson(result),$cordovaFileTransfer,$timeout,$sce);
	 		}else{
	 			$scope.setTempletParam = function(data){
	 				data["ObjectType"] = "BusinessContract";
	 				data["ObjectNo"] = $scope.selectedListItem["BCSerialNo"];
	 			}
	 			$timeout(function () {
	 				$scope.$broadcast('to-detail',param);
	 			}, 100);
	 		}
			$timeout(function () {
				$scope.dic = {};
				$scope.dic.ObjectType = "InspectContract";
				$scope.dic.loanType = "01";
				if(model.ColId == "2030"){
					//已完成时，影像只能是查看
					$scope.dic.showFlag = "false";
				}
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
					detailModalQueryParam["queryData"]["modelNo"] = "IndOrEntCapitalUsedDetail";
					detailModalQueryParam["queryData"]["ReturnType"] = "Info";
				}
				$scope.toListDetailAfter = function(){
					$scope.getSerialNo("INSPECT_DETAIL");
					$scope.detailInfo["InputUserID"] = AmApp.userID;
					$scope.detailInfo["InputOrgID"] = AmApp.orgID;
					$scope.detailInfo["InputDate"] = $filter('date')(new Date(),"yyyy/MM/dd"); 
					$scope.detailInfo["UpdateDate"] = $filter('date')(new Date(),"yyyy/MM/dd"); 
				}
				$scope.saveModel = function(){
						var paramData = {};
						paramData = $scope.getModelNoReadOnlyData(true);
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
						paramData["ObjectNo"] = $scope.selectedListItem["ObjectNo"];
						paramData["ObjectType"] = $scope.selectedListItem["ObjectType"];
						paramData["InputUserID"] = AmApp.userID; 
						paramData["InputOrgID"] = AmApp.orgID;
						paramData["InputDate"] = $filter('date')(new Date(),"yyyy/MM/dd"); 
						var isSuccess = isCheckSuccess($scope.listDetails["0"].groupColArray);
						if(OperateFlag && isSuccess){
							$db_operate.insertRecord($scope,"0004",paramData,"IndOrEntCapitalUsedAOU");
							$scope.modal.remove();
						}
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
				        		Type : "deleteIndOrEntCapitalUsedDetail"
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
					    		   template: "删除失败！"+data["Msg"],
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
	    
	    var InspectEntFirstchooseCustomer = function(uiGridParam){
    		uiGridParam["SelName"] = "SelectInspectContract";
    		uiGridParam["SelFieldId"] = "BdSerialNo,SerialNo,BusinessTypeName,CustomerID,CustomerName,BusinessSum,Balance";
    		uiGridParam["SelFieldName"] = "借据编号,合同编号,业务品种,客户编号,客户姓名,合同金额（元）,合同余额（元）";
    		uiGridParam["ParamId"] = "OperateUserID";
    		uiGridParam["ParamValue"] = AmApp.userID;
    		$scope.doClickSure = function(){
    			$scope.UIGridSelectedRow.ObjectNo = $scope.UIGridSelectedRow.BdSerialNo;
    			$rootScope.gotoCheckSelect({
    				selName:"SelectInspectContract",InspectType:"010010"},$scope.UIGridSelectedRow);
    			
    			$scope.$watch('InspectRefreshFlag',function(newValue,oleValue){
					if(newValue){
						 $rootScope.selectCatalogModalStyle = $rootScope.selectCatalogModalStyleTemp;
						$scope.refresh();
					}
				});
	        }
		}
	    
	  //新增按钮-（发起贷后检查）--公司首检
	    $scope.insertNewMain = function(item){
	    	$rootScope.selectCatalogModalStyleTemp =   $rootScope.selectCatalogModalStyle;
	    	 $rootScope.selectCatalogModalStyle =  $rootScope.bigModalStyle;
	    	 $timeout(function() {
	    		 $scope.doClick(InspectEntFirstchooseCustomer);
				}, 200);
//	    	$ionicModal.fromTemplateUrl("templates/approve/common/selectDubillList.html", {
//	    		scope: $scope,
//	    		backdropClickToClose: false
//	    	}).then(function (modal) {
//	    		$scope.modal = modal;
//	    		$scope.modal.show();
//	    		$timeout(function(){					
//	    			$scope.$broadcast("go-indFirstInspectSelectListController",{
//	    				Item:item,selName:"SelectInspectContract",InspectType:"010010"});
//	    		},100)
//	    	}) 
	    }
	    
	  //删除按钮-（删除一条贷后检查记录）--公司首检
	    $scope.deleteInspectRecordMain = function(item){
	    	var selectedListItem = $scope.getSelectedListItem();
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
        				 MethodName:"deleteIndFirstInspect"
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
        	                  	 }
        	            	}
        	            });
                	
                }
            });
		}
	    
	  //完成按钮
	    $scope.contractRegistration = function (){
	    	var selectedListItem = $scope.getSelectedListItem();
	    	var confirmPopup = $ionicPopup.confirm({
                title: '操作提示',
                template: '您确定要完成该报告么？',
                okText: '确定',
                cancelText: '取消'
            });
	    	
	    	confirmPopup.then(function (res) {
                if (res) {
                	var sSerialNo = selectedListItem["SerialNo"];
            		var sObjectNo = selectedListItem["ObjectNo"];
            		var sObjectType=selectedListItem["ObjectType"];
        			runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
        	                "SelectObjectList", {
        				SerialNo:sSerialNo,
        				ObjectNo:sObjectNo,
        				ObjectType:sObjectType,
        				 ClassName:"com.amarsoft.webservice.business.InspectImpl",
        				 MethodName:"finishEntFirstInspect"
        	            }, function (data, status) {
        	            	if(data.Result=='N'){
        	            		appIonicLoading.show({
        				    		   template: "操作失败！",
        				    		   animation: 'fade-in',
        				    		   showBackdrop: true,
        				    		   duration: 2000
        				    	    });
        	            	}else{
        	            		var result = data["array"][0];
        	            		var resultValue = result[0].Value;
        	            		if(resultValue=="Inspectunfinish"){
        	            			appIonicLoading.show({
     	       			    		   template: "该贷后检查报告无法完成，请先完成风险分类！",
     	       			    		   animation: 'fade-in',
     	       			    		   showBackdrop: true,
     	       			    		   duration: 2000
     	       			    	    });
        	            		}else if(resultValue=="Purposeunfinish"){
        	            			appIonicLoading.show({
      	       			    		   template: "该贷款用途报告无法完成，请先输入用款纪录！",
      	       			    		   animation: 'fade-in',
      	       			    		   showBackdrop: true,
      	       			    		   duration: 2000
      	       			    	    });
        	            		}else if(resultValue=="finished"){
        	            			appIonicLoading.show({
        	            				template: "操作成功！",
        	            				animation: 'fade-in',
        	            				showBackdrop: true,
        	            				duration: 2000
        	            			});
        	            			$timeout(function() {
        	            				$scope.refresh();
        	            			}, 1000);
        	            		}else if(resultValue!=""){
        	            			appIonicLoading.show({
        	            				template: resultValue,
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
})
