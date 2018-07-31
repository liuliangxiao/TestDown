/**
 * Created by yli18 on 2017年9月23日
 */
angular
    .module('com.amarsoft.mobile.controllers.applyLoanCc.list', [])
	.controller('applyLoanListController',function ($scope,$ionicModal,$filter,$list,$detail,$model,$contract,$timeout,$http, $ionicLoading,$group,
			$ionicPopup, $state,$db_operate) {
	    $scope.pdfUrl = $scope.material
		var param = {
			pageSize : 8,
			pageNo : 1,
			groupId : "applyLoanList",
			className : "com.amarsoft.app.als.mobile.impl.ILoanContractImpl",
			methodName : "findApplyLoanList",
			menuTitle : "放款申请",
			flag : true,
			Transaction:"null"
		}
		$model.init($scope);
		$list.load($scope,param);
		$detail.load($scope);
		$contract.init($scope);
		$scope.$on('sign-opinionRefresh', function (e, data) {
			$scope.refresh();
		});
		//切换tab页后事件
		$scope.chooseModel = function(model,param){
			var selectedListItem = $scope.getSelectedListItem();
			if(typeof(selectedListItem) === "undefined") return;
			if(param["url"]=== "SelectFinTermList"){
			   param["ObjectNo"] = $scope.selectedListItem["ObjectNo"];
			   param["ObjectType"] = "jbo.app.BUSINESS_PUTOUT";
			   param["Status"] = "0";
 			   $scope.ngController = "finTermListController";
 			   $timeout(function () {
					$scope.$broadcast('to-finTermList',param);
			   }, 100);
	 		}else if(param["url"] === "SelectReceiverBillList"){
	 			param["ObjectNo"] = $scope.selectedListItem["ObjectNo"];
 			    $scope.ngController = "receiverBillListController";
 			    $timeout(function () {
					$scope.$broadcast('to-receiverBillList',param);
			    }, 100);
	 		}else if(param["url"] === "SelectPaymentBillList"){
	 			param["BPObjectNo"] = $scope.selectedListItem["ObjectNo"];
 			    $scope.ngController = "paymentBillListController";
 			    $timeout(function () {
					$scope.$broadcast('to-paymentBillList',param);
			    }, 100);
	 		}else if(param["url"] === "SelectGuarantyList"){
	 			param["SerialNo"] = $scope.selectedListItem["RelativeSerialNo"];
	 			param["ObjectType"] = $scope.selectedListItem["ObjectType"];
 			    $timeout(function () {
					$scope.$broadcast('to_guarantyListData',param);
			    }, 100);
	 		}else if(param["url"] === "SelectPdfFile"){
	 			$scope.pdfUrl = "templates/20171115_205118633.pdf";
	 		}else{
	 			if(model.ColName == '影像信息'){
					$timeout(function () {
						$scope.dic = {};
						$scope.dic.ObjectType = "PutOutApply";
						$scope.dic.loanType = "";
						if($scope.selectedListItem != undefined){
							$scope.dic.ObjectNo = $scope.selectedListItem.SerialNo;
							$scope.$broadcast('to-screenage',$scope.dic);
						}
					}, 100);
				}else{
					$timeout(function () {
						$scope.$broadcast('to-detail',param);
				   }, 100);
				}
			   $scope.saveModel = function(){
				   	var obj = $scope.getModelNoReadOnlyData();
				   	obj= $scope.dataFormatAdjust(obj);
			    	$db_operate.updateRecord($scope,"0003",obj);
				}
	 		}
		}
		$scope.setDetailParam = function(modelInfo,detailParam){
			   var selectedListItem = $scope.getSelectedListItem();
	    	   if(typeof(selectedListItem) !== "undefined"){
	    		   if(typeof(modelInfo["Action"]) === "undefined" ||
					   modelInfo["Action"] === "" ||
					   modelInfo["Action"] === null){
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
	 			   /*detailParam["queryData"]["SerialNo"] = "2017111700000011";
	 			   detailParam["queryData"]["ObjectNo"] = "2017111700000011";
	 			   detailParam["queryData"]["ObjectType"] = "CreditApply";
	 			   detailParam["queryData"]["BusinessType"] = "1110130";*/
	 			   if(typeof(modelInfo["ObjectType"]) !== "undefined" && modelInfo["ObjectType"] !== "" && modelInfo["ObjectType"] !== null){
	 				   detailParam["queryData"]["ObjectType"]  = modelInfo["ObjectType"];
	 			   }else{
	 				   detailParam["queryData"]["ObjectType"] = selectedListItem["ObjectType"];
	 			   }
 				   detailParam["queryData"]["ObjectNo"] = selectedListItem["ObjectNo"];
 				   if($scope.selectedDetailMenuItem.ColId === "1010" || $scope.selectedDetailMenuItem.ColId === "2010"){
 					   detailParam["queryData"]["SerialNo"] = selectedListItem["SerialNo"];
 				   }
 				   //else if($scope.selectedDetailMenuItem.ColId === "1060" || $scope.selectedDetailMenuItem.ColId === "6020"){
 				  else if($scope.selectedDetailMenuItem.ColName.indexOf("合同") != -1){
 					   detailParam["queryData"]["SerialNo"] = selectedListItem["BusinessContractSerialNo"];
 					   detailParam["queryData"]["ObjectNo"] = selectedListItem["BusinessContractSerialNo"];
 				   }
 				  //else if($scope.selectedDetailMenuItem.ColId === "1080"){
 				 else if($scope.selectedDetailMenuItem.ColName.indexOf("申请") != -1){
 					   detailParam["queryData"]["SerialNo"] = selectedListItem["RelativeSerialNo"];
 					   detailParam["queryData"]["ObjectNo"] = selectedListItem["RelativeSerialNo"];
 				   }else{
 					   detailParam["queryData"]["SerialNo"] = selectedListItem["ObjectNo"];
 				   }
	 			   detailParam["queryData"]["BusinessType"] = selectedListItem["BusinessType"];
	 		   }
	    	}
	    	detailParam["queryData"]["ReturnType"] = "Info";
		}
		//新增
		$scope.insertRecord = function(){
			$scope.saveModelFlag = "insert";
			if($scope.selectedDetailMenuItem.ColId === "1020"){
				if($scope.selectedListItem == null || $scope.selectedListItem == "undefined" || typeof($scope.selectedListItem) == "undefined"){
					$ionicLoading.show({
						title: "业务处理",
						template: "请选择一条记录！",
						duration: 1500
					});
				}else{
					//模态选择页面参数
					var selectCatalogParam = {
							SelName : "SelectTermLibrary",
							SelParam : "TermType,FIN,ObjectType,Product",
							ObjParam : "ObjectNo="+$scope.selectedListItem.ObjectNo+",ObjectType="+$scope.selectedListItem.ObjectType
					}
					$scope.selectCatalogModal(selectCatalogParam);
					$scope.confirm = function(data){
						var OldValue = "";
						var Flag = "";
						if($scope.selectedDetailListItem !== "undefined" && typeof($scope.selectedDetailListItem) !== "undefined"
							&& $scope.selectedDetailListItem !== "" && $scope.selectedDetailListItem !== null){
							OldValue = $scope.selectedDetailListItem["RateTermID"];
							Flag = $scope.selectedDetailListItem["RateTermName"];
						}
						runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
								"OperateContract", {
							ObjectNo : $scope.selectedListItem.ObjectNo,
							ObjectType : $scope.selectedListItem.ObjectType,
							Type : "FinTerm",
							NewValue : data["key"],
							OldValue : OldValue,
							Flag : Flag
						}, function (data, status) {
							if(data["Flag"] === "Success"){
								$scope.modal.remove();
								appIonicLoading.show({
									template: "操作成功！",
									animation: 'fade-in',
									showBackdrop: true,
									duration: 1000
								});
								$timeout(function() {
									$scope.changeModel($scope.selectedDetailMenuItem, $scope.tabIndex);
								}, 1000);
							}else{
								appIonicLoading.show({
									template: "操作失败！"+data["Msg"],
									animation: 'fade-in',
									showBackdrop: true,
									duration: 3500
								});
							}
						});
					}
				}
			}else if($scope.selectedDetailMenuItem.ColId === "1030"){
				if($scope.selectedListItem == null || $scope.selectedListItem == "undefined" || typeof($scope.selectedListItem) == "undefined"){
					$ionicLoading.show({
						title: "业务处理",
						template: "请选择一条记录！",
						duration: 1500
					});
				}else{
					$scope.chooseDetail({},null,true);
					//设置业务关联流水号
					$scope.setSerialNo = function(serialNo){
						$scope.detailListInfo["SerialNo"] = serialNo;
					}
					//设置模态详情页面所需参数
					$scope.setDetailModalQueryParam = function(modal,detailModalQueryParam){
						detailModalQueryParam["queryData"]["SerialNo"] = modal["scope"]["selectedDetailListItem"]["SerialNo"];
						detailModalQueryParam["queryData"]["modelNo"] = "ReceiverBillInfo";
						detailModalQueryParam["queryData"]["ReturnType"] = "Info";
					}
					$scope.toListDetailAfter = function(){
						$scope.getSerialNo("Payee_Info");
						$scope.detailListInfo["BPSerialNo"] = $scope.selectedListItem.ObjectNo;
						$scope.detailListInfo["InputUseID"] = AmApp.userID;
						$scope.detailListInfo["InputOrgID"] = AmApp.orgID;
						$scope.detailListInfo["InputUseName"] = AmApp.userName;
						$scope.detailListInfo["InputOrgName"] = AmApp.orgName;
						$scope.detailListInfo["InputDate"] = $filter('date')(new Date(),"yyyy/MM/dd"); 
						$scope.detailListInfo["UpdateDate"] = $filter('date')(new Date(),"yyyy/MM/dd"); 
						$scope.detailListInfo["Status"] = "1";
					}
					$scope.saveModel = function(){
						if($scope.saveModelFlag === "insert"){
							var data = $scope.getModelNoReadOnlyData(true);
							data["SerialNo"] = $scope.detailListInfo["SerialNo"];
							data["PayeeID"] = $scope.detailListInfo["PayeeID"];
							data["BPSerialNo"] = $scope.selectedListItem.ObjectNo;
							data["InputUseID"] = AmApp.userID;
							data["InputOrgID"] = AmApp.orgID;
							data["InputDate"] = $filter('date')(new Date(),"yyyy/MM/dd"); 
							data["UpdateDate"] = $filter('date')(new Date(),"yyyy/MM/dd"); 
							$db_operate.insertRecord($scope,"0006",data);
							$scope.saveModelFlag = "update";
						}else if($scope.saveModelFlag === "update"){
							var data = $scope.getModelNoReadOnlyData(true);
							data["SerialNo"] = $scope.selectedDetailListItem["SerialNo"];
							data["UpdateDate"] = $filter('date')(new Date(),"yyyy/MM/dd"); 
							$db_operate.updateRecord($scope,"0006",data);
						}
						$scope.modal.remove();
					}
				}
			}else if($scope.selectedDetailMenuItem.ColId === "1040"){
				if($scope.selectedListItem == null || $scope.selectedListItem == "undefined" || typeof($scope.selectedListItem) == "undefined"){
					$ionicLoading.show({
						title: "业务处理",
						template: "请选择一条记录！",
						duration: 1500
					});
				}else{
					//模态选择页面参数
					var selectCatalogParam = {
							Data : "[{sortNo:\"0\",key:\"01\",value:\"新增本行收款人清单\"},{sortNo:\"1\",key:\"02\",value:\"新增他行收款人清单\"}]"
					}
					$scope.selectCatalogModal(selectCatalogParam);
					$scope.confirm = function(data){
						if(data["key"].indexOf(",") > -1){
							$ionicLoading.show({
								title: "业务处理",
								template: "只能选择一条记录！",
								duration: 2500
							});
						}else if(data["key"] === "" || data["key"] === null || data["key"] === "undefined" || typeof(data["key"]) === "undefined"){
							$ionicLoading.show({
								title: "业务处理",
								template: "请选择一条记录！",
								duration: 2500
							});
						}else{
							$scope.selectedBankID = "";
							$scope.selectedBankName = "";
							$scope.selectBankID = function(){
								//新增按钮-（发起贷后检查）--个人首检
						    	 $ionicModal.fromTemplateUrl("templates/approve/common/selectBankID.html", {
						                scope: $scope,
						                backdropClickToClose: false
						            }).then(function (modal) {
					         		$scope.modal1 = modal;
					         		$scope.modal1.show();
					         		
					         		$scope.query = function(){
					         			$scope.selectedBankID = document.getElementById("selectedBankID").value;
					         			$scope.selectedBankName = document.getElementById("selectedBankName").value;
					         			if($scope.selectedBankID=="" && $scope.selectedBankName==""){
					         				appIonicLoading.show({
			        				    		   template: "银行行号和银行名称不能同时为空！",
			        				    		   animation: 'fade-in',
			        				    		   showBackdrop: true,
			        				    		   duration: 2000
			        				    	    });
					         				return ;
					         			}else{
					         				appIonicLoading.show({
			        				    		   template: "查询中...",
			        				    		   animation: 'fade-in',
			        				    		   showBackdrop: true,
			        				    		   duration: 20000
			        				    	    });
					         			}
					         			runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
					        	                "SelectObjectList", {
					         				selectedBankID:$scope.selectedBankID,
					         				selectedBankName:$scope.selectedBankName,
					        				 ClassName:"com.amarsoft.webservice.business.InspectImpl",
					        				 MethodName:"selectedOtherBankID"
					        	            }, function (data, status) {
					        	            	if(data.Result=='N'){
					        	            		appIonicLoading.show({
					        				    		   template: "查询失败！",
					        				    		   animation: 'fade-in',
					        				    		   showBackdrop: true,
					        				    		   duration: 2000
					        				    	    });
					        	            	}else{
					        	            		var result = data["array"][0];
					        	            		var resultValue = result[0].Value;
					        	            		if(resultValue!=""){
					        	            			$scope.modal1.remove();
						        	            		appIonicLoading.hide();
					        	            			var selectBankIDinList = function(uiGridParam){
					        	            	    		uiGridParam["SelName"] = "SelectBeneficiaryBank";
					        	            	    		uiGridParam["ParamId"] = "SerialNo";
					        	            	    		uiGridParam["ParamValue"] = resultValue;
					        	            	    		$scope.doClickSure = function(){
					        	            	    			$scope.UIGridSelectedRow.BankName;
					        	            	    			$scope.UIGridSelectedRow.CnapsID;
					        	            	    			$scope.detailListInfo["PayeeAccountBankName"] = $scope.UIGridSelectedRow.BankName;
					        	            	    			$scope.detailListInfo["PayeeAccountBankID"] = $scope.UIGridSelectedRow.CnapsID;
					        	            		        }
					        	            			}
					        	            			$scope.doClick(selectBankIDinList);
					        	            			
					        	            		}else{
					        	            			appIonicLoading.show({
						        				    		   template: "查询失败！",
						        				    		   animation: 'fade-in',
						        				    		   showBackdrop: true,
						        				    		   duration: 2000
						        				    	    });
					        	            		}
					        	            	}
					        	            });
					         		}
//						         		$timeout(function(){					
//											$scope.$broadcast("go-SmeNewRecordController",{
//												Scope:$scope
//											});
//										},100)
					         	}) 
							}
		            		$scope.chooseDetail({},null,true);
							$scope.modal.remove();
							
							
							
							//设置业务关联流水号
							$scope.setSerialNo = function(serialNo){
								$scope.detailListInfo["SerialNo"] = serialNo;
							}
							if(data["key"] === "01"){
								//设置模态详情页面所需参数
								$scope.setDetailModalQueryParam = function(modal,detailModalQueryParam){
									detailModalQueryParam["queryData"]["SerialNo"] = modal["scope"]["selectedDetailListItem"]["SerialNo"];
									detailModalQueryParam["queryData"]["modelNo"] = "PutOutInfo";
									detailModalQueryParam["queryData"]["ReturnType"] = "Info";
								}
							}else if(data["key"] === "02"){
								//设置模态详情页面所需参数
								$scope.setDetailModalQueryParam = function(modal,detailModalQueryParam){
									detailModalQueryParam["queryData"]["SerialNo"] = modal["scope"]["selectedDetailListItem"]["SerialNo"];
									detailModalQueryParam["queryData"]["modelNo"] = "OtherPutOutInfo";
									detailModalQueryParam["queryData"]["ReturnType"] = "Info";
								}
							}
							$scope.toListDetailAfter = function(){
								var queryParam = {};
								queryParam["ClassName"] = "com.amarsoft.app.als.mobile.impl.ILoanContractImpl";
								queryParam["MethodName"] = "findPaymentBillParamData";
								queryParam["BPSerialNo"] = $scope.selectedListItem["ObjectNo"];
								var result = $group.business(queryParam);
								$scope.getSerialNo("ACCT_TRANSFER");
								$scope.detailListInfo["CustomerID"] = result["CustomerId"];
								$scope.detailListInfo["CustomerName"] = result["CustomerName"];
								$scope.detailListInfo["PayerAccount"] = result["PayerAccount"];
								$scope.detailListInfo["PayerAccountType"] = result["PayerAccountType"];
								$scope.detailListInfo["PayerName"] = result["PayerName"];
								$scope.detailListInfo["CMSSN"] = result["CMSSN"];
								$scope.detailListInfo["ImmediatePay"] = "1";
								$scope.detailListInfo["BPSerialNo"] = $scope.selectedListItem.ObjectNo;
								$scope.detailListInfo["InputUserID"] = AmApp.userID;
								$scope.detailListInfo["InputOrgID"] = AmApp.orgID;
								$scope.detailListInfoNoUpdate["InputUserName"] = AmApp.userName;
								$scope.detailListInfoNoUpdate["InputOrgName"] = AmApp.orgName;
								$scope.detailListInfo["InputDate"] = $filter('date')(new Date(),"yyyy/MM/dd"); 
								$scope.detailListInfo["UpdateDate"] = $filter('date')(new Date(),"yyyy/MM/dd"); 
								$scope.saveModel = function(){
									if($scope.saveModelFlag === "insert"){
										/*runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
							            	"OperateContract", {
								        		ObjectNo : $scope.selectedListItem.ObjectNo,
								        		ObjectType : $scope.selectedListItem.ObjectType,
								        		Type : "PaymentBill",
								        		Flag : "PaymentBill"
								        	}, function (data, status) {
							            	if(data["Flag"] === "Success"){
							            		var data = $scope.getModelNoReadOnlyData();
												data["SerialNo"] = $scope.detailInfo["SerialNo"];
												data["BPSerialNo"] = $scope.selectedListItem.ObjectNo;
												$db_operate.insertRecord($scope,"0007",data);
												$scope.saveModelFlag = "update";
							            	}else{
							            		appIonicLoading.show({
									    		   template: data["Msg"],
									    		   animation: 'fade-in',
									    		   showBackdrop: true,
									    		   duration: 2000
									    	    });
							            	}
							            });*/
										var data = $scope.getModelNoReadOnlyData(true);
										data["SerialNo"] = $scope.detailListInfo["SerialNo"];
										data["CustomerID"] = $scope.detailListInfo["CustomerID"];
										data["CustomerName"] = $scope.detailListInfo["CustomerName"];
										data["ImmediatePay"] = $scope.detailListInfo["ImmediatePay"];
										data["PayerAccount"] = $scope.detailListInfo["PayerAccount"];
										data["PayerAccountType"] = $scope.detailListInfo["PayerAccountType"];
										data["PayerName"] = $scope.detailListInfo["PayerName"];
										data["PayeeName"] = $scope.detailListInfo["PayeeName"];
										data["InputDate"] = $scope.detailListInfo["InputDate"];
										data["UpdateDate"] = $scope.detailListInfo["UpdateDate"];
										data["InputOrgID"] = $scope.detailListInfo["InputOrgID"];
										data["BPSerialNo"] = $scope.selectedListItem.ObjectNo;
										$db_operate.insertRecord($scope,"0007",data);
										$scope.saveModelFlag = "update";
									}else if($scope.saveModelFlag === "update"){
										var data = $scope.getModelNoReadOnlyData(true);
										data["PayeeName"] = $scope.detailListInfo["PayeeName"];
										$db_operate.updateRecord($scope,"0007",data);
									}
									$scope.modal.remove();
								}
							}
						}
					}
				}
			}
		}
		
		$scope.doSure = function(){
			$scope.detailInfo.BranchID = $scope.UIGridSelectedRow["BankID"];
			$scope.detailInfo.BranchName = $scope.UIGridSelectedRow["OrgName"];       		     					        			
	}
		//删除
		$scope.deleteRecord = function(){
			var type = "";
			if($scope.selectedDetailMenuItem.ColId === "1020"){
				type = "DeleteFinterm";
			}else if($scope.selectedDetailMenuItem.ColId === "1030"){
				type = "DeletePayeeInfo";
			}else if($scope.selectedDetailMenuItem.ColId === "1040"){
				type = "DeletePaymentBillInfo"
			}
			if($scope.selectedDetailListItem["SerialNo"] === "undefined"
				|| typeof($scope.selectedDetailListItem["SerialNo"]) === "undefined"
				|| $scope.selectedDetailListItem["SerialNo"] === "" 
				|| $scope.selectedDetailListItem["SerialNo"] === null){
				appIonicLoading.show({
	    		   template: "请选择一条记录！",
	    		   animation: 'fade-in',
	    		   showBackdrop: true,
	    		   duration: 1000
	    	    });
			}else{
				var confirmPopup = $ionicPopup.confirm({
	                title: '操作提示',
	                template: '您真的想删除该信息吗？',
	                okText: '确定',
	                cancelText: '取消'
	            });
	        	confirmPopup.then(function (res) {
	                if (res) {
	                	//接收服务端返回的用户详情数据
			            runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
			            	"OperateContract", {
				        		SerialNo : $scope.selectedDetailListItem["SerialNo"],
				        		Type : type
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
		//签署意见并提交
		$scope.signOpinion = function(){
			$scope.showModal("templates/common/commonModelView/signOpinionModal.html");
			var filterFTSerialNoParam = {  //获取合同主键的请求数据										
				ClassName : "com.amarsoft.app.als.mobile.impl.ComponentQuery",
				MethodName : "SmeInspectGetFilterFTSerialNo",
				TransactionType : "Sqlca"
			}; 
			//遍历$scope.selectedListItem，进行参数传入filterSerialNoParam对象和filterFTSerialNoParam对象
				filterFTSerialNoParam["ObjectType"]=$scope.selectedListItem.ObjectType;
				filterFTSerialNoParam["SerialNo"]=$scope.selectedListItem.SerialNo;
			$scope.FTSerialNoFilter = $group.business(filterFTSerialNoParam)["FTSerialNo"];
			$timeout(function(){					
				$scope.$broadcast("go-SignOpinionController",{
					SerialNo:$scope.selectedListItem["ObjectNo"],
					ObjectType:$scope.selectedDetailMenuItem["ObjectType"],
					FlowNo:$scope.selectedListItem["FlowNo"],
					PhaseNo:$scope.selectedListItem["PhaseNo"],
					PhaseName:$scope.selectedListItem["PhaseName"],
					FTSerialNo:$scope.FTSerialNoFilter,
					ApplyType:$scope.selectedListItem["ApplyType"]
				});
			},100)
		}
	})
