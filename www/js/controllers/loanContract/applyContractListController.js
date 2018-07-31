/**
 * Created by yli18 on 2017年9月23日
 */
angular
    .module('com.amarsoft.mobile.controllers.applyCc.list', [])
	.controller('applyContractListController',function ($http,$group, $rootScope,$ionicLoading, $ionicPopup, $state,$scope,$ionicModal,$timeout,$list,$detail,$model,$contract,$db_operate) {
		//初始化参数
		var param = {
			pageSize : 10,
			pageNo : 1,
			groupId : "applyContractList",
			className : "com.amarsoft.app.als.mobile.impl.ILoanContractImpl",
			methodName : "findApplyContractList",
			menuTitle : "合同生效",
			flag : true,
			Transaction:"null"
		}
		$model.init($scope);
		$list.load($scope,param);
		$detail.load($scope);
		$contract.init($scope);
		//设置模版查询参数
		$scope.setDetailParam = function(modelInfo,detailParam){
			var selectedListItem = $scope.getSelectedListItem();
			if(typeof(selectedListItem) !== "undefined"){
				if(typeof(modelInfo["Action"]) === "undefined" || modelInfo["Action"] === "" || modelInfo["Action"] === null){
					detailParam["url"] = "SelectObjectInfo";
				}else{
					detailParam["url"] = modelInfo["Action"];
				}
				if(detailParam["url"] === "SelectCustomerInfo"){
					detailParam["queryData"]["CustomerID"] = selectedListItem["CustomerId"];
				}else if($scope.detailUrl === "SelectOpinionList"){
					detailParam["queryData"]["ObjectNo"] = selectedListItem["ObjectNo"];
					detailParam["queryData"]["ObjectType"] = selectedListItem["ObjectType"];
					detailParam["queryData"]["BusinessType"] = selectedListItem["BusinessType"];
				}else{
					if(typeof(modelInfo["ObjectType"]) !== "undefined" && modelInfo["ObjectType"] !== "" && modelInfo["ObjectType"] !== null){
						detailParam["queryData"]["ObjectType"]  = modelInfo["ObjectType"];
					}else{
						detailParam["queryData"]["ObjectType"] = selectedListItem["ObjectType"];
					}
					if($scope.selectedDetailMenuItem.ColId === "1010" || $scope.selectedDetailMenuItem.ColId === "2010"){
						detailParam["queryData"]["SerialNo"] = selectedListItem["SerialNo"];
						$scope.setTempletParam = function (templetParam) {
							templetParam["ObjectNo"] = detailParam["queryData"]["SerialNo"];
							templetParam["ObjectType"] = detailParam["queryData"]["ObjectType"];
						};
					}else{
						detailParam["queryData"]["SerialNo"] = selectedListItem["ObjectNo"];
					}
					detailParam["queryData"]["ObjectNo"] = selectedListItem["ObjectNo"];
					detailParam["queryData"]["BusinessType"] = selectedListItem["BusinessType"];
				}
			}
			detailParam["queryData"]["ReturnType"] = "Info";
			$scope.detailListDataParam = selectedListItem;
		}
		
		//合同保存
		$scope.saveModelBefore = function(){
			var data = $scope.getModelNoReadOnlyData("Frame1");
			data["TempSaveFlag"] = "2";
			if($scope.detailInfoNoUpdate.PutOutOrgName==""){
				appIonicLoading.show({
		    		   template: "请输入放款机构名称！",
		    		   animation: 'fade-in',
		    		   showBackdrop: true,
		    		   duration: 1000
		    	    });
				return ;
			}
			data["PutOutOrgID"] = $scope.detailInfo.PutOutOrgID;
			data= $scope.dataFormatAdjust(data);
    	    $db_operate.updateRecord($scope,"0002",data);
        }
		
		//刷新Info页面
		$scope.refreshInfo = function(){
			$timeout(function() {
				if($scope.goDetailTopFlag){
					if($scope.detailListFlag){
						$scope.detailListRefresh();
					}else{
						//$scope.refresh();
						$scope.changeModel($scope.selectedDetailMenuItem, $scope.tabIndex);
					}
				}else{
					$scope.clickMenu($scope.selectedMenuItem, $scope.menuIndex);
				}
			}, 500);
		}
		
		$scope.insertRecordFlag = false;
		//登记他证新增
		$scope.insertRecord = function(){
			$scope.insertRecordFlag = false;
			$scope.PreOtherRightID = ""	;
			$scope.OtherRightID = $scope.PreOtherRightID = ""	;
			//新增按钮
	    	 $ionicModal.fromTemplateUrl("templates/approve/common/otherGuarantyInsertNewRecord.html", {
	                scope: $scope,
	                backdropClickToClose: false
	            }).then(function (modal) {
        		$scope.modal1 = modal;
        		$scope.modal1.show();
        		
        		$scope.hideShowModel = function(){
        			$scope.refreshInfo();
        			$scope.modal1.remove();
        		}
        		
        		$scope.save = function(){
        			$scope.PreOtherRightID = document.getElementById("PreOtherRightID").value;
        			$scope.OtherRightID = document.getElementById("OtherRightID").value;
        			if($scope.OtherRightID==""){
        				appIonicLoading.show({
				    		   template: "请输入他项权证号！",
				    		   animation: 'fade-in',
				    		   showBackdrop: true,
				    		   duration: 2000
				    	    });
        				return;
        			}
        			
        			runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
        	                "SelectObjectList", {
        				PhaseType:"BC",
        				BCSerialNo:$scope.detailListDataParam["SerialNo"],
        				PreOtherRightID:$scope.PreOtherRightID ,
        				OtherRightID:$scope.OtherRightID,
        				 ClassName:"com.amarsoft.webservice.business.InspectImpl",
        				 MethodName:"insertNewOtherRightRecord",
        					Transaction:"null"
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
        	            		if(resultValue=="SUCCESS"){
        	            			appIonicLoading.show({
     	       			    		   template: "新增成功！",
     	       			    		   animation: 'fade-in',
     	       			    		   showBackdrop: true,
     	       			    		   duration: 2000
     	       			    	    });
        	            			$scope.insertRecordFlag = true;
//        	            			$scope.modal1.remove();
//        	            			$scope.refreshInfo();
        	            		}else{
        	            			appIonicLoading.show({
      	       			    		   template: "新增失败！",
      	       			    		   animation: 'fade-in',
      	       			    		   showBackdrop: true,
      	       			    		   duration: 2000
      	       			    	    });
        	            		}
        	            	}
        	            });
        			
        		}
        		
        		$rootScope.savePreOtherRightID = function(para){
        			$scope.PreOtherRightID = document.getElementById("PreOtherRightID").value;
        			$scope.OtherRightID = document.getElementById("OtherRightID").value;
        			if($scope.OtherRightID==""){
        				appIonicLoading.show({
				    		   template: "请输入他项权证号！",
				    		   animation: 'fade-in',
				    		   showBackdrop: true,
				    		   duration: 2000
				    	    });
        				return;
        			}
        			if(!$scope.insertRecordFlag && para!="Info"){
        				appIonicLoading.show({
				    		   template: "请保存他证信息！",
				    		   animation: 'fade-in',
				    		   showBackdrop: true,
				    		   duration: 2000
				    	    });
     				return;
        			}
        			var selectGuarantyWhithoutOtherRigthID = function(uiGridParam){
                		uiGridParam["SelName"] = "selectGuarantyWhitoutotherGuaranty";
                		uiGridParam["ParamId"] = "objectno,objecttype";
                		uiGridParam["ParamValue"] = $scope.detailListDataParam["SerialNo"]+",BusinessContract";
                		$scope.doClickSure = function(){
                			console.log($scope.UIGridSelectedRow);
                			runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
                	                "SelectObjectList", {
                				Flag:"R",
                				PreOtherRightID:$scope.PreOtherRightID ,
                				OtherRightID:$scope.OtherRightID,
                				GuarantyID:$scope.UIGridSelectedRow.guarantyid,
                				 ClassName:"com.amarsoft.webservice.business.InspectImpl",
                				 MethodName:"updateGuarantyInfo",
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
                	       			    		   template: "操作成功！",
                	       			    		   animation: 'fade-in',
                	       			    		   showBackdrop: true,
                	       			    		   duration: 2000
                	       			    	    });
                	                  	 }
                	            	}
                	            });
            	        }
            		}
        			$scope.doClick(selectGuarantyWhithoutOtherRigthID);
        		}
        		$rootScope.clearPreOtherRightID = function(){
        			$scope.PreOtherRightID = document.getElementById("PreOtherRightID").value;
        			$scope.OtherRightID = document.getElementById("OtherRightID").value;
        			var selectGuarantyWhithOtherRigthID = function(uiGridParam){
                		uiGridParam["SelName"] = "selectGuarantyWhitOtherGuaranty";
                		uiGridParam["ParamId"] = "objectno,objecttype";
                		uiGridParam["ParamValue"] = $scope.detailListDataParam["SerialNo"]+",BusinessContract";
                		$scope.doClickSure = function(){
                			console.log($scope.UIGridSelectedRow);
                			runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
                	                "SelectObjectList", {
                				Flag:"C",
                				PreOtherRightID:$scope.PreOtherRightID ,
                				OtherRightID:$scope.OtherRightID,
                				GuarantyID:$scope.UIGridSelectedRow.guarantyid,
                				 ClassName:"com.amarsoft.webservice.business.InspectImpl",
                				 MethodName:"updateGuarantyInfo",
                				Transaction:"Sqlca"
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
                	                  	 if(result[0].Value=="SUCCESS"){
                	                  		 appIonicLoading.show({
                	       			    		   template: "操作成功！",
                	       			    		   animation: 'fade-in',
                	       			    		   showBackdrop: true,
                	       			    		   duration: 2000
                	       			    	    });
                	                  	 }
                	            	}
                	            });
            	        }
            		}
        			$scope.doClick(selectGuarantyWhithOtherRigthID);
        		}
        		
        		
        		
        	}) 
		}
		
		//切换tab页后事件
		$scope.chooseModel = function(model,data){
			if(typeof($scope.selectedListItem) === "undefined") return;
			if(model["Action"] === "SelectGuarantyList"){
				var modelQueryData = {};
				modelQueryData.SerialNo = $scope.selectedListItem.ObjectNo;
				modelQueryData.ObjectType = model.ObjectType;
				$timeout(function() {
					$scope.$broadcast('to_guarantyListData',modelQueryData);
				}, 100);
			}else if(model["Action"] === "SelectOtherGuarantyRightList"){
				var modelQueryData = {};
				modelQueryData.SerialNo = $scope.selectedListItem.SerialNo;
				modelQueryData.ObjectType = "BusinessContract";
				$timeout(function() {
					$scope.$broadcast('to_OtherGuarantyRightListData',modelQueryData);
				}, 100);
			}else{
				if(model.ColName == '影像信息'){
					$timeout(function () {
						$scope.dic = {};
						$scope.dic.ObjectType = "BusinessContract";
						$scope.dic.loanType = "";
						if(model.ColId == "2050"){
							//已生效的合同
							$scope.dic.showFlag = "false";
						}
						if($scope.selectedListItem != undefined){
							$scope.dic.ObjectNo = $scope.selectedListItem.SerialNo;
							$scope.$broadcast('to-screenage',$scope.dic);
						}
					}, 100);
				}else{
					$scope.$broadcast('to-detail',data);
				}
			}
		}
		$scope.SelectOrg = function(uiGridParam){
			
			//取得可办理小企业业务乌鲁木齐分行项下的支行机构编号
			var sSMEBusinessOrgID = $group.RunMethod("公用方法","GetColValue","Code_Library,ItemDescribe,CodeNo='SMEBusinessOrgID' and ItemNo='01'");
			//公司贷款部机构编号 added by xbwang 2012/07/04 
			var sENTBusinessOrgID = $group.RunMethod("公用方法","GetColValue","Code_Library,ItemDescribe,CodeNo='ENTBusinessOrgID' and ItemNo='01'");
			if(sSMEBusinessOrgID.indexOf(AmApp.orgID)>0)
			{
				uiGridParam["SelName"] = "SelectWLMQCZOrg";
			}else if(sENTBusinessOrgID.indexOf(AmApp.orgID)>0)
			{
				uiGridParam["SelName"] = "SelectAllCZOrg";
			}else
			{
				uiGridParam["SelName"] = "SelectCZOrg";
				uiGridParam["ParamId"] = "OrgID";
	    		uiGridParam["ParamValue"] =AmApp.orgID;
			}
    		$scope.doClickSure = function(){
    			$scope.detailInfo.PutOutOrgID = $scope.UIGridSelectedRow.OrgID;
    			$scope.detailInfoNoUpdate.PutOutOrgName = $scope.UIGridSelectedRow.OrgName;
    		}
		}
		
		
	});
