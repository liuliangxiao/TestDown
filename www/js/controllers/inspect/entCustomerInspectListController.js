angular
    .module('com.amarsoft.mobile.controllers.entCustomerInspect.list', [])
	.controller('entCustomerInspectListController',function ($scope,$list,$rootScope,$cordovaFileTransfer,$timeout,$sce,$ionicModal,$detail,$model,$group,
			$http,$ionicScrollDelegate,$ionicLoading, $ionicPopup, $state) {
		var param = {
			pageSize : 8,
			pageNo : 1,
			groupId : "IndCustomerInspectList",
			className : "com.amarsoft.webservice.business.InspectImpl",
			methodName : "getEntCustomerInspectList",
			menuTitle : "公司定检",
			flag : true,
			Transaction:"null"
		}
		$model.init($scope);
		$list.load($scope,param);
		$detail.load($scope);
		//切换tab页后事件
		$scope.chooseModel = function(model,param){
			var selectedListItem = $scope.getSelectedListItem();
			if(typeof(selectedListItem) === "undefined") return;
			if(param["url"] === "IndCustomerInspReport"){
	 			var queryParam = {
					ObjectNo : selectedListItem["ObjectNo"],
					ObjectType : selectedListItem["ObjectType"],
					SerialNo : selectedListItem["SerialNo"],
					ClassName : "com.amarsoft.webservice.business.InspectImpl",
					MethodName : "getInspReport",
   				 	Transaction:"Sqlca"
				};
				var result = $group.business(queryParam);
				viewHtmlService($scope,angular.fromJson(result),$cordovaFileTransfer,$timeout,$sce);
	 		}else{
			   $scope.$broadcast('to-detail',param);
	 		}
			$timeout(function () {
				$scope.dic = {};
				$scope.dic.ObjectType = "InspectCustomer";
				$scope.dic.loanType = "";
				if(model.ColId == "2020"){
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
	    	   if(typeof($scope.selectedListItem) !== "undefined"){
	    		   if(typeof(modelInfo["Action"]) === "undefined" ||
						   modelInfo["Action"] === "" ||
						   modelInfo["Action"] === null){
	    			   detailParam["url"] = "SelectObjectInfo";
				   }else{
					   detailParam["url"] = modelInfo["Action"];
				   }
		 		   if(detailParam["url"] === "SelectCustomerInfo"){
		 			  detailParam["queryData"]["CustomerID"] = $scope.selectedListItem["CustomerId"];
		 		   }else if(modelInfo.Action === "IndCustomerInspReport"){
		 			  detailParam["queryData"]["SerialNo"] = $scope.selectedListItem.SerialNo;
		 			  detailParam["queryData"]["ObjectNo"] = $scope.selectedListItem.ObjectNo;
		 			  detailParam["queryData"]["ObjectType"] = $scope.selectedListItem.ObjectType;
		    	   }
	    	   }
	    	   detailParam["queryData"]["ReturnType"] = "Info";
		}
		var InspectEntCuschooseCustomer = function(uiGridParam){
    		uiGridParam["SelName"] = "SelectInspectCustomer";
    		uiGridParam["SelFieldId"] = "CustomerID,CustomerName,CertID,CertTypeName";
    		uiGridParam["SelFieldName"] = "客户编号,客户名称,证件编号,证件类型";
    		uiGridParam["ParamId"] = "UserID";
    		uiGridParam["ParamValue"] = AmApp.userID;
    		$scope.doClickSure = function(){
    			$scope.UIGridSelectedRow.ObjectNo = $scope.UIGridSelectedRow.CustomerID;
    			$rootScope.gotoCheckSelect({
    				selName:"SelectInspectCustomer",InspectType:"020010"},$scope.UIGridSelectedRow);
    			
    			$scope.$watch('InspectRefreshFlag',function(newValue,oleValue){
					if(newValue){
						$scope.refresh();
					}
				});
	        }
		}
		//新增按钮-（发起贷后检查）--公司定检
	    $scope.insertNewMain = function(item){
	    	
	    	$scope.doClick(InspectEntCuschooseCustomer);
	    	
	    	
//	    	$ionicModal.fromTemplateUrl("templates/approve/common/selectDubillList.html", {
//	    		scope: $scope,
//	    		backdropClickToClose: false
//	    	}).then(function (modal) {
//	    		$scope.modal = modal;
//	    		$scope.modal.show();
//	    		$timeout(function(){					
//	    			$scope.$broadcast("go-indFirstInspectSelectListController",{
//	    				Item:item,selName:"SelectInspectCustomer",InspectType:"020010"});
//	    		},100)
//	    	}) 
	    }
	    
	    //删除按钮-（删除一条贷后检查记录）--公司定检
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
                	queryParam = {
                            ClassName: "com.amarsoft.app.als.mobile.common.RunMethodUtil",
                            MethodName: "RunJavaMethodSqlca",
                            sClassName: "com.amarsoft.app.apply.creditquery.CreditQueryApplyCheck",
                            sMethodName: "afterLoanSubmitCheckWarn",
                            args: "RelativeObjectType=InspectInfo,RelativeObjectNo=" + sSerialNo
                        };
                    var returnValue = $group.business(queryParam);
                	var confirmPopup = $ionicPopup.confirm({
                        title: '操作提示',
                        template:  returnValue["ReturnValue"].split("@")[0],
                        okText: '确定',
                        cancelText: '取消'
                    });
                	confirmPopup.then(function (res) {
                        if (res) {
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
            });
		}
	});
