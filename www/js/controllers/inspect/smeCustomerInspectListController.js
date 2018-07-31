angular
    .module('com.amarsoft.mobile.controllers.smeCustomerInspect.list', [])
	.controller('smeCustomerInspectListController',function ($scope,$list,$detail,$model,$filter,$db_operate,$group,
			$http,$ionicScrollDelegate,$ionicLoading, $ionicPopup, $state,$ionicModal,$cordovaFileTransfer,$timeout,$sce,i18nService) {
		var param = {
			pageSize : 8,
			pageNo : 1,
			groupId : "SmeCustomerInspectList",
			className : "com.amarsoft.webservice.business.InspectImpl",
			methodName : "getSmeCustomerInspectList",
			menuTitle : "小企业定检",
			flag : true,
			Transaction:"null"
		}
		$model.init($scope);
		$list.load($scope,param);
		$detail.load($scope);
		//切换tab页后事件
		$scope.chooseModel = function(model,param){
			$scope.ReportData = {};
			$scope.BCReportData = {};
			var selectedListItem = $scope.getSelectedListItem();
			if(typeof(selectedListItem) === "undefined") return;
			if(param["url"] === "SmeCustomerInspReport"){
				var TemplateNo = selectedListItem["TemplateNo"];
				if(TemplateNo === "Person"){
					$scope.includeContent = "templates/inspect/PersonTemplate.html";
				}else if(TemplateNo === "Batch"){
					$scope.includeContent = "templates/inspect/BatchTemplate.html";
				}else if(TemplateNo === "LowRisk"){
					$scope.includeContent = "templates/inspect/LowRiskTemplate.html";
				}
	 			var queryParam = {
	 				CustomerID : selectedListItem["ObjectNo"],
					ObjectType : selectedListItem["ObjectType"],
					SerialNo : selectedListItem["SerialNo"],
					CustType : selectedListItem["CustType"],
					TemplateNo : TemplateNo,
					ClassName : "com.amarsoft.webservice.business.InspectImpl",
					MethodName : "getSmeReport",
					Transaction:"Sqlca"
				};
				var result = $group.business(queryParam);
				viewHtmlService($scope,angular.fromJson(result),$cordovaFileTransfer,$timeout,$sce);
	 		}else{
			   $scope.$broadcast('to-detail',param);
	 		}
			$timeout(function () {
				$scope.dic = {};
				$scope.dic.ObjectType = "PostLoanCheckApply";
				$scope.dic.loanType = "";
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
		 			  detailParam["queryData"]["CustomerID"] = $scope.selectedListItem["ObjectNo"];
		 		   }else if(modelInfo.Action === "SmeCustomerInspReport"){
		 			  detailParam["queryData"]["SerialNo"] = $scope.selectedListItem.SerialNo;
		 			  detailParam["queryData"]["ObjectNo"] = $scope.selectedListItem.ObjectNo;
		 			  detailParam["queryData"]["ObjectType"] = $scope.selectedListItem.ObjectType;
		    	   }
	    	   }
	    	   detailParam["queryData"]["ReturnType"] = "Info";
		}
		
		
		//新增按钮-（发起贷后检查）--个人首检
	    $scope.insertNewMain = function(item){
	    	 $ionicModal.fromTemplateUrl("templates/approve/common/SmeNewRecord.html", {
	                scope: $scope,
	                backdropClickToClose: false
	            }).then(function (modal) {
         		$scope.modal1 = modal;
         		$scope.modal1.show();
         		$timeout(function(){					
					$scope.$broadcast("go-SmeNewRecordController",{
						Scope:$scope
					});
				},100)
         	}) 
		}
	    
	  //删除按钮-（删除一条贷后检查记录）--小企业定检
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
				TransactionType: "Sqlca"
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
//新增列表父控制器
.controller('SmeNewRecordController',function ($scope,$rootScope,$list,$detail,$model,$filter,$db_operate,$group,
			$http,$ionicScrollDelegate,$ionicLoading, $ionicPopup, $state,$ionicModal,$timeout,i18nService) {
	$scope.$on('go-SmeNewRecordController',function(e,data){
		$scope = data.Scope;
		$scope.CheckMode = "opt";
		$scope.CheckTemplatePerson = "0";
		$scope.SmeSelectedCustomerName = "点击选择";
	});
	
	$rootScope.CustomerNo = "";
	$rootScope.CustomerName = "";
	$rootScope.CustType = "";
	
	var InspectSmeCuschooseCustomer = function(uiGridParam){
		uiGridParam["SelName"] = "SelectXQYCheckApplyCustomer";
		uiGridParam["SelFieldId"] = "CustomerID,CustomerName,CertID,CertTypeName,CustType";
		uiGridParam["SelFieldName"] = "客户编号,客户名称,证件编号,证件类型,客户类型";
		uiGridParam["ParamId"] = "UserID";
		uiGridParam["ParamValue"] = AmApp.userID;
		$scope.doClickSure = function(){
			$rootScope.CustomerNo = $scope.UIGridSelectedRow.CustomerID;
			$rootScope.CustomerName =$scope.UIGridSelectedRow.CustomerName;
			$rootScope.CustType = $scope.UIGridSelectedRow.CustType;
			$scope.SmeSelectedCustomerName =$rootScope.CustomerName;
//			$scope.UIGridSelectedRow.ObjectNo = $scope.UIGridSelectedRow.CustomerID;
//			$rootScope.gotoCheckSelect({
//				selName:"SelectXQYCheckApplyCustomer",InspectType:"020010"},$scope.UIGridSelectedRow);
			
//			$scope.$watch('InspectRefreshFlag',function(newValue,oleValue){
//				if(newValue){
//					$scope.refresh();
//				}
//			});
        }
	}
	$scope.SelectCustomer = function(){
		$scope.doClick(InspectSmeCuschooseCustomer);
		
//   	 $ionicModal.fromTemplateUrl("templates/approve/common/selectDubillList.html", {
//               scope: $scope,
//               backdropClickToClose: false
//           }).then(function (modal) {
//    		$scope.modal = modal;
//    		$scope.modal.show();
//    		$timeout(function(){					
//				$scope.$broadcast("go-indFirstInspectSelectListController",{
//					selName:"SelectXQYCheckApplyCustomer"});
//			},100)
//    	}) 
	}
	
	//选择客户后的确认按钮
	$scope.XQYgotoCheckSelect= function(){
		$scope.SmeSelectedCustomerName = $rootScope.CustomerName;
		$scope.modal.remove();
	}
	$scope.gotoCheckSelect= function(){
		$scope.CheckTemplatePerson =$("#CheckTemplatePerson").val();
		if($scope.SmeSelectedCustomerName=="点击选择"){
			appIonicLoading.show({
	    		   template: "请选择客户！",
	    		   animation: 'fade-in',
	    		   showBackdrop: true,
	    		   duration: 2000
	    	    });
			return;
		}else if($scope.CheckMode ==""){
			appIonicLoading.show({
	    		   template: "请选择模式！",
	    		   animation: 'fade-in',
	    		   showBackdrop: true,
	    		   duration: 2000
	    	    });return;
		}else if($scope.CheckTemplatePerson == "0"){
			appIonicLoading.show({
	    		   template: "请选择风险检查模板！",
	    		   animation: 'fade-in',
	    		   showBackdrop: true,
	    		   duration: 2000
	    	    });return;
		}
		

		var Method = "InsertNewXQYInspect";
		runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
                "SelectObjectList", {
				ObjectNo:$rootScope.CustomerNo,
			CustType:$rootScope.CustType,
			CheckTemplateNo:$scope.CheckTemplatePerson,
			SelectTemplateType:$scope.CheckMode,
			 ClassName:"com.amarsoft.webservice.business.InspectImpl",
			 MethodName:Method,
			 Transaction:"Sqlca"
            }, function (data, status) {
            	var result = data["array"][0];
            	if(result[0].Value=='N'){
            		appIonicLoading.show({
			    		   template: "新增失败！",
			    		   animation: 'fade-in',
			    		   showBackdrop: true,
			    		   duration: 2000
			    	    });
            	}else{
//            		var result = data["array"][0];
                  	 if(result[0].Value=="SUCCESS"){
                  		 appIonicLoading.show({
       			    		   template: "新增成功！",
       			    		   animation: 'fade-in',
       			    		   showBackdrop: true,
       			    		   duration: 2000
       			    	    });
                  		$scope.modal1.remove();
                  		$timeout(function() {
                  			$scope.refresh();
						}, 1000);
                  	 }
            	}
            });
	
	}
})
	;
