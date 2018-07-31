/**
 * 业务申请
 * Created by cwxu on 2017/2/28.
 */

angular.module('com.amarsoft.mobile.controllers.businessApply', ['ngSanitize', 'ngAnimate','treeControl'])
    //业务申请主页控制器
	.controller('businessApplyIndexController', function ($scope, $rootScope) {
		//授信额度申请
		$scope.creditLineApply = function(){
            $rootScope.moduleSwitch('businessApplyType',"businessApply",{ApplyType:"CreditLineApply"});
		}
		//额度项下业务申请
		$scope.dependentApply = function(){
            $rootScope.moduleSwitch('businessApplyType',"businessApply",{ApplyType:"DependentApply"});
		}
		//单笔授信业务申请
		$scope.independentApply = function(){
            $rootScope.moduleSwitch('businessApplyType',"businessApply",{ApplyType:"IndependentApply"});
		}
		//批单变更申请
		$scope.baChangeApply = function(){
            $rootScope.moduleSwitch('businessApplyType',"businessApply",{ApplyType:"BAChangeApply"});
		}
	})

	//****************业务申请列表控制器(主)-start***************//
    .controller('BusinessApplyController', function ($ionicScrollDelegate,$rootScope, $group,$db_operate,$filter,$detail,$list,$scope,$timeout,$model,$stateParams,$ionicModal,$ionicLoading,$http,$ionicPopup,$state,$q) {
    	//接收路由传递的参数
		$scope.ApplyType = $stateParams.ApplyType;
		$scope.pdfUrl = 'blank.pdf';
		$scope.isFinished = true;//右侧下部按钮的显隐型，true 为显示。
		//初始化参数
		var param = {
			pageSize : 5,
			pageNo : 1,
			groupId : "businessApply",
			className : "com.amarsoft.app.als.mobile.impl.apply.BusinessApplyImpl",
			methodName : "getBusinessApplyList",
			menuTitle : "授信业务申请",
			tabTitle : "授信信息",
			flag : true,
			Transaction:"null"
		}
		if($scope.ApplyType =="DependentApply"){param.menuTitle = "额度项下业务申请";param.tabTitle = "额度信息";}
		if($scope.ApplyType =="IndependentApply"){param.menuTitle = "单笔授信业务申请";param.tabTitle = "单笔授信信息";}
		if($scope.ApplyType =="BAChangeApply"){param.menuTitle = "批单变更申请";param.tabTitle = "批单信息";}
		
		$model.init($scope);
		$list.load($scope,param);
		$detail.load($scope);
		 //接收 提交完签署意见后的刷新 广播
        $scope.$on('sign-opinionRefresh', function (e, data) {
        	$scope.refresh();;
		});
		$scope.setListParam = function(queryaram){
			queryaram["PhaseType"] = $scope.selectedMenuItem["ColId"];
			queryaram["ApplyType"] = $scope.ApplyType;
		};
		//点击新增后定义方法
		$scope.chooseDetail = function(addFlag){
			var modelUrl = "templates/businessApply/AddCreditApplyDetailListInfo.html";
			$scope.chooseDetailFlag = true;
			$scope.addCreditApplyFlag = addFlag;
			$ionicModal.fromTemplateUrl(modelUrl,{
				scope:$scope,
				backdropClickToClose:false
			}).then(function(modal){
				$scope.modal = modal;
				$scope.modal.show();
				var detailModalQueryParam = {url:"",queryData:{}};
				$scope.setDetailModalQueryParam(modal,detailModalQueryParam,addFlag);
				$timeout(function () {
					$scope.$broadcast('to-listDetailInfo',detailModalQueryParam);
                });
			});
		};
		if($scope.ApplyType === "CreditLineApply"){
			$scope.insertRecord = function(){
				$scope.setDetailModalQueryParam = function(modal,detailModalQueryParam,addFlag){
                    detailModalQueryParam["queryData"]["modelNo"] = "AddCreditLineApplyForApp";
                    detailModalQueryParam["queryData"]["ReturnType"] = "Info";
				};
                $scope.chooseDetail();
                $scope.toListDetailAfter = function(){
                	$scope.detailListInfo["OccurType"] = "010";
                	$scope.detailListInfo["OccurDate"] = new Date();
                    $scope.getSerialNo("BUSINESS_APPLY", "SerialNo");
				};
                $scope.setSerialNo = function (serialNo) {
                    $scope.detailListInfo["SerialNo"] = serialNo;
                };
                $scope.saveModel = function(){
                	/*参数定义*/
					var businessType = $scope.detailListInfo["BusinessType"];
					var customerID = $scope.detailListInfo["CustomerID"];
					var customerType = $scope.detailListInfoNoUpdate["CustomerType"];
                    /*默认值设置*/
                    $scope.detailListInfo["ApplyType"] = $scope.ApplyType;
                    $scope.detailListInfo["InputOrgID"] = AmApp.orgID;
                    $scope.detailListInfo["InputUserID"] = AmApp.userID;
                    $scope.detailListInfo["OperateOrgID"] = AmApp.orgID;
                    $scope.detailListInfo["OperateUserID"] = AmApp.userID;
                    $scope.detailListInfo["OperateDate"] = new Date();
                    $scope.detailListInfo["InputDate"] = new Date();
                    $scope.detailListInfo["UpdateDate"] = new Date();
                    $scope.detailListInfo["TempSaveFlag"] = "1";
                    $scope.detailListInfo["ContractFlag"] = "2";

                    if (!$scope.checkDataCompleted($scope.listDetails, $scope.detailListInfo, $scope.detailListInfoNoUpdate, $scope.detailListCheck)) return;

                    if(businessType.substring(0,4) !== "3030" || businessType === "3030025"){
                        var queryParam = {
                            ClassName: "com.amarsoft.app.als.mobile.common.RunMethodUtil",
                            MethodName: "RunJavaMethodSqlca",
                            sClassName: "com.amarsoft.app.apply.credit.CreditApplyCreateAction",
                            sMethodName: "initLoanType",
                            args: "customerID=" + customerID + ",customerType=" + customerType
                        };
                        var result = $group.business(queryParam);
                        if (typeof(result["ReturnValue"]) === "undefined" || result["ReturnValue"] === "") {
                            $ionicLoading.show({
                                title: "业务处理",
                                template: "初始化业务条线失败！",
                                duration: 1500
                            });
                            return;
                        }
                        $scope.detailListInfo["LoanType"] = result["ReturnValue"];
                    }
                    queryParam = {
                        ClassName: "com.amarsoft.app.als.mobile.common.RunMethodUtil",
                        MethodName: "RunJavaMethodSqlca",
                        sClassName: "com.amarsoft.app.apply.credit.CreditApplyCreateCheck",
                        sMethodName: "supplyChainCheck",
                        args: "customerType=" + customerType + ",customerID=" + customerID + ",businessType=" + businessType + ",curOrgID=" + AmApp.orgID
                    };
                    result = $group.business(queryParam);
                    $group.mustMsg(result["ReturnValue"]).then(function(returnValue){
                       if(returnValue) return;

                       queryParam = {
                           ClassName: "com.amarsoft.app.als.mobile.common.RunMethodUtil",
                           MethodName: "RunJavaMethodSqlca",
                           sClassName: "com.amarsoft.app.apply.credit.CreditApplyCreateCheck",
                           sMethodName: "entLoanCheck",
                           args: "customerType=" + customerType + ",customerID=" + customerID + ",businessType=" + businessType + ",curOrgID=" + AmApp.orgID
                       };
                       result = $group.business(queryParam);
                       $group.mustMsg(result["ReturnValue"]).then(function(returnValue){
                           if(returnValue) return;

                           var paramData = {
                               Data: angular.toJson($scope.dataFormatAdjust($scope.detailListInfo))
                           };
                           runServiceWithSession($http, $ionicLoading, $ionicPopup, $state, "CreditApplyAOU", paramData, function (data, status) {
                               if (data.Result === "Y") {
                                   $ionicLoading.show({
                                       title: "业务处理",
                                       template: "新增授信额度申请成功！",
                                       duration: 1500
                                   });
                                   $scope.removeModal();
                               } else {
                                   $ionicLoading.show({
                                       title: "业务处理",
                                       template: "新增授信额度申请失败，请联系管理员！",
                                       duration: 1500
                                   });
                               }
                           });
                       });
                    });
				};

                $scope.$watch('detailListInfoNoUpdate.CustomerType',function(newValue,oldValue){
                    if(typeof(newValue) !== "undefined" && typeof(oldValue) !== "undefined" && newValue !== oldValue){
                        $scope.detailListInfo["CustomerID"] = "";
                        $scope.detailListInfo["CustomerName"] = "";
                        $scope.detailListInfoNoUpdate["BusinessTypeName"] = "";
                        $scope.detailListInfo["BusinessType"] = "";
                        $scope.detailListInfo["LoanType"] = "";
                    }
                });
                $scope.$watch('detailListInfo.CustomerID',function(newValue,oldValue){
                    if(typeof(newValue) !== "undefined" && typeof(oldValue) !== "undefined" && newValue !== oldValue){
                        $scope.detailListInfoNoUpdate["BusinessTypeName"] = "";
                        $scope.detailListInfo["BusinessType"] = "";
                        $scope.detailListInfo["LoanType"] = "";
                    }
                });
                $scope.selectCustomer = function(uiGridParam){
                	var customerType = $scope.detailListInfoNoUpdate["CustomerType"];
                    if (typeof(customerType) === "undefined" || customerType === "") {
                        $ionicLoading.show({
                            title: "业务处理",
                            template: "请先选择客户类型！",
                            duration: 1500
                        });
                        uiGridParam["QueryPermit"] = false;
                    }
                    if(customerType === "04"){
                    	$scope.detailListInfo["BusinessType"] = "3010015";
                    	$scope.detailListInfoNoUpdate["BusinessTypeName"] = "个人综合授信额度";
					}
					uiGridParam["SelName"] = "SelectApplyCustomer1";
					uiGridParam["ParamId"] = "UserID,CustomerType";
					uiGridParam["ParamValue"] = AmApp.userID + "," + customerType;

					$scope.doClickSure = function(){
                        if ($scope.chooseDetailFlag) {
                            var queryParam = {
                                ClassName: "com.amarsoft.app.als.mobile.common.RunMethodUtil",
                                MethodName: "RunJavaMethodSqlca",
                                sClassName: "com.amarsoft.app.apply.CustomerLockStatusCheck",
                                sMethodName: "validateLock",
                                args: "customerID=" + $scope.UIGridSelectedRow["CustomerID"]
                            };
                            var result = $group.business(queryParam);
                            if (result["ReturnValue"] === "true") {
                                $scope.detailListInfo["CustomerID"] = $scope.UIGridSelectedRow["CustomerID"];
                                $scope.detailListInfo["CustomerName"] = $scope.UIGridSelectedRow["CustomerName"];
                            } else {
                                $ionicLoading.show({
                                    title: "业务处理",
                                    template: "客户信息未锁定不允许办理业务！",
                                    duration: 1500
                                });
                            }
                        }
					};
				};
                $scope.selectBusinessType = function(uiGridParam){
                    var customerType = $scope.detailListInfoNoUpdate["CustomerType"];
                    if (typeof(customerType) === "undefined" || customerType === "") {
                        $ionicLoading.show({
                            title: "业务处理",
                            template: "请先选择客户类型！",
                            duration: 1500
                        });
                        uiGridParam["QueryPermit"] = false;
                    }

                    var customerID = $scope.detailListInfo["CustomerID"];
                    if (typeof(customerID) === "undefined" || customerID === "") {
                        $ionicLoading.show({
                            title: "业务处理",
                            template: "请先选择授信客户！",
                            duration: 1500
                        });
                        uiGridParam["QueryPermit"] = false;
                    }
                    if(customerType === "01" || customerType === "03")
                    	uiGridParam["SelName"] = "SelectEntCLBusinessType";
					else if(customerType === "04")
                        uiGridParam["SelName"] = "SelectIndCLBusinessType";
					$scope.doClickSure = function(){
                        if ($scope.chooseDetailFlag) {
                        	var businessType = $scope.UITreeData["selectedData"]["itemValue"];
                        	if(businessType.substring(0,4) === "3030" && businessType !== "3030025")
                        		$detail.setVisible($scope.listDetails,"LoanType",true);
							else
                                $detail.setVisible($scope.listDetails,"LoanType",false);

                        	$scope.detailListInfo["BusinessType"] = businessType;
                            $scope.detailListInfoNoUpdate["BusinessTypeName"] = $scope.UITreeData["selectedData"]["itemName"];
                        }
					};
				};
			};
		}else{
            $scope.insertRecord = function () {
                $scope.setDetailModalQueryParam = function (modal, detailModalQueryParam, addFlag) {
                    detailModalQueryParam["queryData"]["modelNo"] = "AddCreditApplyForApp" + addFlag;
                    detailModalQueryParam["queryData"]["ReturnType"] = "Info";
                    detailModalQueryParam["queryData"]["applyType"] = $scope.ApplyType;
                };
                $scope.chooseDetail("1");
                $scope.toListDetailAfter = function () {
                    if ($scope.addCreditApplyFlag === "1") {
                        //新增第一页
                        $scope.detailListInfo["OccurType"] = "010";
                        $detail.setReadOnly($scope.listDetails,"OccurType",true);
                        $scope.detailListInfo["OccurDate"] = new Date();

                        $scope.detailListInfoNoUpdate["InputOrgName"] = AmApp.orgName;
                        $scope.detailListInfoNoUpdate["InputUserName"] = AmApp.userName;
                        $scope.detailListInfoNoUpdate["InputDate"] = new Date().format('yyyy/MM/dd');
                    } else if ($scope.addCreditApplyFlag === "2") {
                        //新增第二页
                        var occurType = $scope.addCreditApplyData1["OccurType"];
                        if (occurType === "015") {
                            $detail.setHeader($scope.listDetails, "RelativeAgreement", "关联展期业务");
                            $detail.setVisible($scope.listDetails, "RelativeAgreement", true);
                            $detail.setRequired($scope.listDetails, "RelativeAgreement", true);
                            $detail.setReadOnly($scope.listDetails, "RelativeAgreement", true);
                            $detail.setVisible($scope.listDetails, "BusinessTypeName", false);
                            $detail.setRequired($scope.listDetails, "BusinessTypeName", false);
                            $detail.setButton($scope.listDetails, "RelativeAgreement", true, "selectExtendContract");
                        } else if (occurType === "020") {
                            $detail.setHeader($scope.listDetails, "RelativeAgreement", "关联借新还旧业务");
                            $detail.setVisible($scope.listDetails, "RelativeAgreement", true);
                            $detail.setRequired($scope.listDetails, "RelativeAgreement", true);
                            $detail.setReadOnly($scope.listDetails, "RelativeAgreement", true);
                            $detail.setButton($scope.listDetails, "RelativeAgreement", true, "selectRelativeContract");
                        } else if (occurType === "030") {
                            $detail.setHeader($scope.listDetails, "RelativeAgreement", "关联重组方案");
                            $detail.setVisible($scope.listDetails, "RelativeAgreement", true);
                            $detail.setRequired($scope.listDetails, "RelativeAgreement", true);
                            $detail.setReadOnly($scope.listDetails, "RelativeAgreement", true);
                            $detail.setButton($scope.listDetails, "RelativeAgreement", true, "selectNPARefrom");
                        } else if (occurType === "090") {
                            $detail.setHeader($scope.listDetails, "RelativeAgreement", "关联接力贷业务");
                            $detail.setVisible($scope.listDetails, "RelativeAgreement", true);
                            $detail.setRequired($scope.listDetails, "RelativeAgreement", true);
                            $detail.setReadOnly($scope.listDetails, "RelativeAgreement", true);
                            $detail.setButton($scope.listDetails, "RelativeAgreement", true, "selectRelativeContract1");
                        }
                        /*获取流水号*/
                        $scope.getSerialNo("BUSINESS_APPLY", "SerialNo");
                    }
                };
                $scope.nextStep = function () {
                    if (!$scope.checkDataCompleted($scope.listDetails, $scope.detailListInfo, $scope.detailListInfoNoUpdate, $scope.detailListCheck)) return;

                    $scope.addCreditApplyData1 = $scope.detailListInfo;
                    $scope.modal.remove();
                    $scope.chooseDetail("2");
                };
                $scope.modalCancel = function () {
                    if ($scope.addCreditApplyFlag === "1")
                        $scope.modal.remove();
                    else if ($scope.addCreditApplyFlag === "2") {
                        $scope.modal.remove();
                        delete $scope.addCreditApplyData1;
                        $scope.chooseDetail("1");
                    }
                };
                $scope.setSerialNo = function (serialNo) {
                    $scope.detailListInfo["SerialNo"] = serialNo;
                };
                $scope.saveModel = function () {
                    /*参数定义*/
                    var customerType = $scope.detailListInfoNoUpdate["CustomerType"];
                    var customerID = $scope.detailListInfo["CustomerID"];
                    var businessType = $scope.detailListInfo["BusinessType"];
                    var occurType = $scope.addCreditApplyData1["OccurType"];
                    var serialNo = $scope.detailListInfo["SerialNo"];
                    /*默认值设置*/
                    $scope.detailListInfo["ApplyType"] = $scope.ApplyType;
                    $scope.detailListInfo["ImageStatus"] = "1";
                    $scope.detailListInfo["InputOrgID"] = AmApp.orgID;
                    $scope.detailListInfo["InputUserID"] = AmApp.userID;
                    $scope.detailListInfo["OperateOrgID"] = AmApp.orgID;
                    $scope.detailListInfo["OperateUserID"] = AmApp.userID;
                    $scope.detailListInfo["OccurDate"] = $scope.addCreditApplyData1["OccurDate"];
                    $scope.detailListInfo["OccurType"] = occurType;
                    $scope.detailListInfo["OperateDate"] = $scope.addCreditApplyData1["OccurDate"];
                    $scope.detailListInfo["InputDate"] = $scope.addCreditApplyData1["OccurDate"];
                    $scope.detailListInfo["UpdateDate"] = $scope.addCreditApplyData1["OccurDate"];
                    $scope.detailListInfo["TempSaveFlag"] = "1";

                    if (!$scope.checkDataCompleted($scope.listDetails, $scope.detailListInfo, $scope.detailListInfoNoUpdate, $scope.detailListCheck)) return;

                    /*初始化LoanType*/
                    var queryParam = {
                        ClassName: "com.amarsoft.app.als.mobile.common.RunMethodUtil",
                        MethodName: "RunJavaMethodSqlca",
                        sClassName: "com.amarsoft.app.apply.credit.CreditApplyCreateAction",
                        sMethodName: "initLoanType2",
                        args: "customerID=" + customerID + ",customerType=" + customerType + ",businessType=" + businessType
                    };
                    var result = $group.business(queryParam);
                    if (typeof(result["ReturnValue"]) === "undefined" || result["ReturnValue"] === "") {
                        $ionicLoading.show({
                            title: "业务处理",
                            template: "初始化业务条线失败！",
                            duration: 1500
                        });
                        return;
                    }
                    $scope.detailListInfo["LoanType"] = result["ReturnValue"];
                    /*创建申请时的必要性检查*/
                    queryParam = {
                        ClassName: "com.amarsoft.app.als.mobile.common.RunMethodUtil",
                        MethodName: "RunJavaMethodSqlca",
                        sClassName: "com.amarsoft.app.apply.credit.CreditApplyCreateCheck",
                        sMethodName: "businessTypeCheck2",
                        args: "customerID=" + customerID + ",customerType=" + customerType + ",applyType=" + $scope.ApplyType
                        + ",businessType=" + businessType + ",occurType=" + occurType + ",businessTypeName=" + $scope.detailListInfoNoUpdate["BusinessTypeName"]
                        + ",serialNo=" + serialNo + ",curOrgID=" + AmApp.orgID + ",userID=" + AmApp.userID + ",loanType=" + $scope.detailListInfo["LoanType"]
                    };
                    result = $group.business(queryParam);
                    $group.mustMsg(result["ReturnValue"]).then(function (returnValue) {
                        if (returnValue) return;
                        var paramData = {
                            Data: angular.toJson($scope.dataFormatAdjust($scope.detailListInfo)),
                            RelativeObjectType: $scope.detailListInfoNoUpdate["RelativeObjectType"],
                            RelativeAgreement: $scope.detailListInfoNoUpdate["RelativeAgreement"]
                        };
                        runServiceWithSession($http, $ionicLoading, $ionicPopup, $state, "CreditApplyAOU", paramData, function (data, status) {
                            if (data.Result === "Y") {
                                $ionicLoading.show({
                                    title: "业务处理",
                                    template: "新增单笔授信申请成功！",
                                    duration: 1500
                                });
                                $scope.removeModal();
                            } else {
                                $ionicLoading.show({
                                    title: "业务处理",
                                    template: "新增单笔授信申请失败，请联系管理员！",
                                    duration: 1500
                                });
                            }
                        });
                    });
                };

                $scope.$watch('detailListInfoNoUpdate.CustomerType',function(newValue,oldValue){
                	if(typeof(newValue) !== "undefined" && typeof(oldValue) !== "undefined" && newValue !== oldValue){
                		$scope.detailListInfo["CustomerID"] = "";
                		$scope.detailListInfo["CustomerName"] = "";
                		$scope.detailListInfoNoUpdate["BusinessTypeName"] = "";
                		$scope.detailListInfo["BusinessType"] = "";
                        $scope.detailListInfoNoUpdate["RelativeAgreement"] = "";
                        $scope.detailListInfoNoUpdate["RelativeObjectType"] = "";
					}
                });
                $scope.$watch('detailListInfo.CustomerID',function(newValue,oldValue){
                    if(typeof(newValue) !== "undefined" && typeof(oldValue) !== "undefined" && newValue !== oldValue){
                        $scope.detailListInfoNoUpdate["BusinessTypeName"] = "";
						$scope.detailListInfo["BusinessType"] = "";
                        $scope.detailListInfoNoUpdate["RelativeAgreement"] = "";
                        $scope.detailListInfoNoUpdate["RelativeObjectType"] = "";
                    }
				});
                $scope.selectCustomer = function (uiGridParam) {
                    $scope.detailListInfo["BusinessType"] = "";
                    $scope.detailListInfoNoUpdate["BusinessTypeName"] = "";

                    var customerType = $scope.detailListInfoNoUpdate["CustomerType"];
                    if (typeof(customerType) === "undefined" || customerType === "") {
                        $ionicLoading.show({
                            title: "业务处理",
                            template: "请先选择客户类型！",
                            duration: 1500
                        });
                        uiGridParam["QueryPermit"] = false;
                    }
                    if (customerType === "01" || customerType === "04")
                        uiGridParam["SelName"] = "SelectApplyCustomer1";
                    else if (customerType === "03")
                        uiGridParam["SelName"] = "SelectSMEAndIndCustomer";
                    uiGridParam["ParamId"] = "UserID,CustomerType";
                    uiGridParam["ParamValue"] = AmApp.userID + "," + customerType;
                    $scope.doClickSure = function () {
                        if ($scope.chooseDetailFlag) {
                            $scope.detailListInfo["CustomerID"] = $scope.UIGridSelectedRow["CustomerID"];
                            $scope.detailListInfo["CustomerName"] = $scope.UIGridSelectedRow["CustomerName"];
                        }
                    };
                };
                $scope.selectBusinessType = function (uiGridParam) {
                    var customerType = $scope.detailListInfoNoUpdate["CustomerType"];
                    if (typeof(customerType) === "undefined" || customerType === "") {
                        $ionicLoading.show({
                            title: "业务处理",
                            template: "请先选择客户类型！",
                            duration: 1500
                        });
                        uiGridParam["QueryPermit"] = false;
                    }

                    var customerID = $scope.detailListInfo["CustomerID"];
                    if (typeof(customerID) === "undefined" || customerID === "") {
                        $ionicLoading.show({
                            title: "业务处理",
                            template: "请先选择授信客户！",
                            duration: 1500
                        });
                        uiGridParam["QueryPermit"] = false;
                    }

                    if (customerType === "03") {
                        var custType = $group.RunMethod("BusinessManage", "GetCustType", customerID);
                        if (custType === "04") {
                            if (AmApp.orgID === "00010" && $scope.ApplyType === "IndependentApply") {
                                uiGridParam["SelName"] = "SelectSMEBusinessType2";
                                uiGridParam["ParamId"] = "BusinessType";
                                uiGridParam["ParamValue"] = "1120050";
                            } else
                                uiGridParam["SelName"] = "SelectSMEBusinessType4";
                        } else {
                            if (AmApp.orgID === "00010" && $scope.ApplyType === "IndependentApply")
                                uiGridParam["SelName"] = "SelectSMEBusinessType";
                            else
                                uiGridParam["SelName"] = "SelectSMEBusinessType1";
                        }
                    } else {
                        uiGridParam["SelName"] = "SelectBusinessType2";
                        uiGridParam["ParamId"] = "Attribute4,Attribute5";
                        uiGridParam["ParamValue"] = $scope.ApplyType + "," + customerType;
                    }
                    $scope.doClickSure = function () {
                        if ($scope.chooseDetailFlag) {
                            var businessType = $scope.UITreeData["selectedData"]["itemValue"];
                            var productVersion = $group.RunMethod("BusinessManage", "SelectProductVersion", businessType);
                            $scope.detailListInfo["BusinessType"] = businessType;
                            $scope.detailListInfo["ProductVersion"] = productVersion;
                            $scope.detailListInfoNoUpdate["BusinessTypeName"] = $scope.UITreeData["selectedData"]["itemName"];
                        }
                    }
                };
                $scope.selectExtendContract = function (uiGridParam) {
                    var customerID = $scope.detailListInfo["CustomerID"];
                    if (typeof(customerID) === "undefined" || customerID === "") {
                        $ionicLoading.show({
                            title: "业务处理",
                            template: "请先选择客户！",
                            duration: 1500
                        });
                        uiGridParam["QueryPermit"] = false;
                    }
                    uiGridParam["SelName"] = "SelectExtendDueBill";
                    uiGridParam["ParamId"] = "CustomerID,OperateUserID";
                    uiGridParam["ParamValue"] = customerID + "," + AmApp.userID;
                    $scope.doClickSure = function () {
                        if ($scope.chooseDetailFlag) {
                            var dueBillNo = $scope.UIGridSelectedRow["SerialNo"];
                            var businessType = $scope.UIGridSelectedRow["BusinessType"];
                            var returnValue = $group.RunMethod("PublicMethod", "GetColValue", "RptTermID@getItemName('RepayWay'@RptTermID) as RptTermName,ACCT_LOAN,String@SerialNo@" + dueBillNo);
                            var rptTermID = returnValue.split("@")[1];
                            var rptTermName = returnValue.split("@")[3];
                            if (rptTermID === "RPT42" || rptTermID === "RPT43") {
                                $ionicLoading.show({
                                    title: "业务处理",
                                    template: "该笔借据还款方式为【" + rptTermName + "】不能做展期，如需做展期请先做还款方式变更交易！",
                                    duration: 1500
                                });
                                return;
                            }
                            $scope.detailListInfoNoUpdate["RelativeAgreement"] = dueBillNo;
                            $scope.detailListInfoNoUpdate["RelativeObjectType"] = "BusinessDueBill";
                            $scope.detailListInfo["BusinessType"] = businessType;
                            var productVersion = $group.RunMethod("BusinessManage", "SelectProductVersion", businessType);
                            $scope.detailListInfo["ProductVersion"] = productVersion;
                        }
                    };
                };
                $scope.selectRelativeContract = function (uiGridParam) {
                    var customerID = $scope.detailListInfo["CustomerID"];
                    if (typeof(customerID) === "undefined" || customerID === "") {
                        $ionicLoading.show({
                            title: "业务处理",
                            template: "请先选择客户！",
                            duration: 1500
                        });
                        uiGridParam["QueryPermit"] = false;
                    }
                    uiGridParam["SelName"] = "SelectExtendDueBill";
                    uiGridParam["ParamId"] = "CustomerID,OperateUserID";
                    uiGridParam["ParamValue"] = customerID + "," + AmApp.userID;
                    $scope.doClickSure = function () {
                        if ($scope.chooseDetailFlag) {
                            $scope.detailListInfoNoUpdate["RelativeAgreement"] = $scope.UIGridSelectedRow["SerialNo"];
                            $scope.detailListInfoNoUpdate["RelativeObjectType"] = "BusinessDueBill";
                        }
                    };
                };
                $scope.selectNPARefrom = function (uiGridParam) {
                    uiGridParam["SelName"] = "SelectNPARefrom";
                    $scope.doClickSure = function () {
                        if ($scope.chooseDetailFlag) {
                            $scope.detailListInfoNoUpdate["RelativeAgreement"] = $scope.UIGridSelectedRow["SerialNo"];
                            $scope.detailListInfoNoUpdate["RelativeObjectType"] = "CapitalReform";
                        }
                    };
                };
                $scope.selectRelativeContract1 = function (uiGridParam) {
                    var customerType = $scope.detailListInfoNoUpdate["CustomerType"];
                    if (customerType !== "03") {
                        $ionicLoading.show({
                            title: "业务处理",
                            template: "客户类型须为小企业客户！",
                            duration: 1500
                        });
                        uiGridParam["QueryPermit"] = false;
                    }
                    var customerID = $scope.detailListInfo["CustomerID"];
                    if (typeof(customerID) === "undefined" || customerID === "") {
                        $ionicLoading.show({
                            title: "业务处理",
                            template: "请先选择客户！",
                            duration: 1500
                        });
                        uiGridParam["QueryPermit"] = false;
                    }
                    uiGridParam["SelName"] = "SMERelayLoan";
                    uiGridParam["ParamId"] = "CustomerID,OperateUserID";
                    uiGridParam["ParamValue"] = customerID + "," + AmApp.userID;
                    $scope.doClickSure = function () {
                        if ($scope.chooseDetailFlag)
                            $scope.detailListInfoNoUpdate["RelativeAgreement"] = $scope.UIGridSelectedRow["SerialNo"];
                    };
                };
            };
        }
        $scope.deleteRecord = function(){
		    var objectType = "CreditApply";
		    var objectNo = $scope.detailInfo["SerialNo"];
		    if(typeof(objectNo) === "undefined" || objectNo === ""){
		        $ionicLoading.show({
                    title: "业务处理",
                    template: "请选择一条信息！",
                    duration: 1500
                });
		        return;
            }
            var queryParam = {
                ClassName: "com.amarsoft.app.als.mobile.common.RunMethodUtil",
                MethodName: "RunJavaMethodSqlca",
                sClassName: "cn.com.tansun.sbmo.service.workflow.ReconsiderApplyVerify",
                sMethodName: "cancelReconsiderApply",
                args: "objectNo=" + objectNo
            };
            $group.business(queryParam);
            $ionicPopup.confirm({
                title:"提示性校验",
                template:"您真的想取消该信息吗？",
            	okText: '确定',
                cancelText: '取消'
            }).then(function(res){
                if(res){
                    queryParam = {
                        ClassName: "com.amarsoft.app.als.mobile.common.RunMethodUtil",
                        MethodName: "RunJavaMethodSqlca",
                        sClassName: "com.amarsoft.app.flow.delete.DeleteApply",
                        sMethodName: "deleteApplyInfo",
                        args: "ObjectType=" + objectType + ",ObjectNo=" + objectNo + ",opUserID=" + AmApp.userID + ",opOrgID=" + AmApp.orgID + ",params=DelFlow"
                    };
                    var result = $group.business(queryParam);
                    if(typeof(result["ReturnValue"]) !== "undefined" && result["ReturnValue"] !== ""){
                        $ionicLoading.show({
                            title: "业务处理",
                            template: result["ReturnValue"].split("@")[1],
                            duration: 1500
                        });
                    }
                    $timeout(function () {
                        $rootScope.moduleSwitch('businessApplyType',"businessApply",{ApplyType:$scope.ApplyType});
                    }, 1500);
                }
            });
        };
		//右侧详情页面展示传入参数
		$scope.setDetailParam = function(modelInfo,detailParam){
           if(typeof($scope.selectedListItem) !== "undefined"){
               detailParam.url = modelInfo["Action"];
               if(detailParam.url == 'SelectObjectInfo'){
                   detailParam["queryData"]["SerialNo"] = $scope.selectedListItem["ObjectNo"];
                   detailParam["queryData"]["ObjectNo"] = $scope.selectedListItem["ObjectNo"];
                   detailParam["queryData"]["ObjectType"] = modelInfo["ObjectType"];
                   detailParam["queryData"]["BusinessType"] = $scope.selectedListItem["BusinessType"];
                   detailParam["queryData"]["ReturnType"] = "Info";
               }

             //add by ylmeng调查报告
                if(detailParam.url == "SelectOpinionReport"){
                    if(modelInfo.GroupId=="businessApply"){
                        detailParam["queryData"]["GroupName"] = modelInfo.ColName;
                        if(modelInfo.ColName=="调查报告"){
                            detailParam["queryData"]["DocID"] = "09";
                        }else if(modelInfo.ColName=="审批单"){
                            detailParam["queryData"]["DocID"] = "15";
                        }else if(modelInfo.ColName=="审查报告"){
                            detailParam["queryData"]["DocID"] = "16";
                        }
                    }
                    detailParam["queryData"]["ObjectNo"] = $scope.selectedListItem["ObjectNo"];
                    detailParam["queryData"]["ObjectType"] = modelInfo["ObjectType"];
                    detailParam["queryData"]["ReturnType"] = "Info";
                }

               if(detailParam.url == 'SelectCustomerInfo'){
                   detailParam["queryData"]["CustomerID"] = $scope.selectedListItem["CustomerId"];
                   detailParam["queryData"]["ReturnType"] = "Info";
               }
               if(detailParam.url == 'SelectFlowTaskList'){
                   detailParam["queryData"]["ObjectNo"] = $scope.selectedListItem["ObjectNo"];
                   detailParam["queryData"]["ObjectType"] = modelInfo["ObjectType"];
               }
               if(detailParam.url == 'SelectOpinionList'){
                   detailParam["queryData"]["ObjectNo"] = $scope.selectedListItem["ObjectNo"];
                   detailParam["queryData"]["ObjectType"] = modelInfo["ObjectType"];
                   detailParam["queryData"]["BusinessType"] = $scope.selectedListItem["BusinessType"];
               }
           }
        };
		//页面值初始化
        var initItem = function(itemName, defaultValue){
            if(typeof($scope.detailInfo[itemName]) === "undefined" || $scope.detailInfo[itemName] !== "") return;
            $scope.detailInfo[itemName] = defaultValue;
        }
        $scope.toDetailAfter = function(){
            var occurType = $scope.detailInfo["OccurType"];
            var tempSaveFlag = $scope.detailInfo["TempSaveFlag"];
            var businessType = $scope.detailInfo["BusinessType"];

            $scope.detailInfo["BusinessCurrency"] = "01";
            initItem("BusinessCurrency","01");
            if(businessType.startsWith("304")){
                initItem("IsLoop","1") ;
                $scope.detailInfo["UpdateUserID"] = AmApp.userID;
                $scope.detailInfoNoUpdate["UpdateUserName"] = AmApp.userName;
                $scope.detailInfo["UpdateOrgID"] = AmApp.orgID;
                $scope.detailInfoNoUpdate["UpdateOrgName"] = AmApp.orgName;
            }
            if(businessType === "1010030")
                initItem("IsLoop","2") ;
            if(businessType === "1110060")
                initItem("VouchType","005") ;
            if(businessType === "2110010"){
                $scope.detailInfo["VouchType"] = "0201060";
                $scope.detailInfoNoUpdate["VouchTypeName"] = "房产抵押";
                initItem("IsArg", "2")   ;
                initItem("IsLoop", "2") ;
                initItem("IsFullValue", "1")   ;
                initItem("VouchFlag", "2") ;
                initItem("RateCalTerm", "1") ;
                initItem("RepriceType", "2") ;
                initItem("RPTTermID", "RPT17") ;
            }
            initItem("RateCalTerm", "2") ;
            if(businessType === "3010005" || businessType === "3010010" || businessType === "3010015")
                initItem("CycleFlag", "1") ;
            if(businessType === "1110026")
                initItem("RPTTermID", "RPT05") ;
            if(businessType === "1090010") {
                $detail.setReadOnly($scope.details,"RepriceType",true);
                initItem("RepriceType", "7");
            }else
                $detail.setReadOnly($scope.details,"RepriceType",false);
            if(businessType === "2010")
                initItem("PdgRatio", "0.5") ;
        };
		//切换tab页后事件
		$scope.chooseModel = function(model,data){
            if(typeof($scope.selectedListItem) === "undefined") return;
			var filterFTSerialNoParam = {  //获取合同主键的请求数据
                ClassName : "com.amarsoft.app.als.mobile.impl.ComponentQuery",
                MethodName : "BusinessApplyGetFilterFTSerialNo",
                ObjectType : "CreditApply",
                ObjectNo : $scope.selectedListItem.ObjectNo,
                UserID : AmApp.userID,
                TransactionType: "Sqlca"
			}; 
			$scope.FTSerialNoFilter = $group.business(filterFTSerialNoParam)["FTSerialNo"];
			if(model["Action"] === "SelectGuarantyList"){
				$scope.modelQueryData = {};
				$scope.modelQueryData.SerialNo = $scope.selectedListItem.ObjectNo;
				$scope.modelQueryData.ObjectType = model.ObjectType;
				$scope.modelQueryData.GType = "BA"
				$timeout(function() {
					$scope.$broadcast('to_guarantyListData',$scope.modelQueryData);
				}, 100);
			}else{
				if(data.url!=""){
					$scope.$broadcast('to-detail',data);
				}
			}
			$timeout(function () {
				$scope.selectedListItem.ObjectType = "CreditApply";
				$scope.selectedListItem.loanType ="";
				$scope.$broadcast('to-screenage',$scope.selectedListItem);
			}, 100);
		}
		//签署意见并提交
		$scope.signOpinion = function(){
		    $scope.submitApplyCheck = function(){
		        var defer = $q.defer();

                var objectType = $scope.selectedListItem["ObjectType"];
                var objectNo =  $scope.selectedListItem["ObjectNo"];
                var occurType = $scope.detailInfo["OccurType"];
                var flowNo = $scope.detailInfo["FlowNo"];
                var phaseNo = $scope.detailInfo["PhaseNo"];
                var businessType = $scope.detailInfo["BusinessType"];
                var customerID = $scope.detailInfo["CustomerID"];
		        //提示性检查
                var queryParam = {
                    ClassName: "com.amarsoft.app.als.mobile.common.RunMethodUtil",
                    MethodName: "RunJavaMethodSqlca",
                    sClassName: "com.amarsoft.app.apply.credit.CreditApplyWarnCheck",
                    sMethodName: "submitCheck",
                    args: "objectType=" + objectType + ",objectNo=" + objectNo
                };
                var result = $group.business(queryParam);
                $group.mustMsg(result["ReturnValue"]).then(function(returnValue) {
                    if (returnValue){
                        defer.resolve(false);
                        return;
                    }

                    //必要性检查
                    queryParam = {
                        ClassName: "com.amarsoft.app.als.mobile.common.RunMethodUtil",
                        MethodName: "RunJavaMethodSqlca",
                        sClassName: "com.amarsoft.app.apply.credit.CreditApplySubmitCheck",
                        sMethodName: "submitCheck",
                        args: "objectType=" + objectType + ",objectNo=" + objectNo + ",userID=" + AmApp.userID + ",orgID=" + AmApp.orgID
                    };
                    result = $group.business(queryParam);
                    $group.mustMsg(result["ReturnValue"].split("~")[2]).then(function(returnValue) {
                        if (returnValue){
                            defer.resolve(false);
                            return;
                        }

                        //提交时执行的表操作
                        queryParam = {
                            ClassName: "com.amarsoft.app.als.mobile.common.RunMethodUtil",
                            MethodName: "RunJavaMethodSqlca",
                            sClassName: "com.amarsoft.app.apply.credit.CreditApplyCreateAction",
                            sMethodName: "submitAction",
                            args: "objectType=" + objectType + ",objectNo=" + objectNo
                        };
                        $group.business(queryParam);

                        //调用规则引擎，根据产品
                        if($scope.ApplyType === "IndependentApply" && (occurType === "010" || occurType === "090")){
                            queryParam = {
                                ClassName: "com.amarsoft.app.als.mobile.common.RunMethodUtil",
                                MethodName: "RunJavaMethodSqlca",
                                sClassName: "cn.com.tansun.sbmo.service.workflow.RuleManager",
                                sMethodName: "verifyRules",
                                args: "objectNo=" + objectNo + ",objectType=" + objectType + ",flowNo=" + flowNo + ",phaseNo=" + phaseNo + ",businessType=" + businessType + ",customerId=" + customerID
                            };
                            result = $group.business(queryParam);
                            if(typeof(result["ReturnValue"]) !== "undefined" && result["ReturnValue"] !== null){
                                var returns = result["ReturnValue"].split(";");
                                if(returns[0] === "FAIL"){
                                    $group.mustMsg(returns[1]).then(function(returnValue){
                                        defer.resolve(false);
                                    });
                                    return;
                                }else if(returns[0] !== "SUCCESS"){
                                    $ionicLoading.show({
                                        title: "业务处理",
                                        template: returns[0].substring(5),
                                        duration: 1500
                                    });
                                    defer.resolve(false);
                                    return;
                                }
                            }
                        }
                        defer.resolve(true);
                    });
                });

                return defer.promise;
            };
			$scope.showModal("templates/common/commonModelView/signOpinionModal.html");
			$timeout(function(){					
				$scope.$broadcast("go-SignOpinionController",{
					SerialNo:$scope.selectedListItem["ObjectNo"],
					ObjectType:$scope.selectedDetailMenuItem["ObjectType"],
					FlowNo:$scope.selectedListItem["FlowNo"],
					PhaseNo:$scope.selectedListItem["PhaseNo"],
					PhaseName:$scope.selectedListItem["PhaseName"],
					FTSerialNo:$scope.FTSerialNoFilter,
					ApplyType:$scope.ApplyType});
			},100)
		};
        $scope.removeModal = function () {
            $scope.modal.remove();
            $timeout(function () {
                $rootScope.moduleSwitch('businessApplyType',"businessApply",{ApplyType:$scope.ApplyType});
            }, 1000);
        }
        $scope.selectIndustryType = function(uiGridParam){
			uiGridParam["SelName"] = "SelectCode";
            uiGridParam["ParamId"] = "CodeNo";
            uiGridParam["ParamValue"] = "IndustryType";
			$scope.doClickSure = function(){
            	$scope.detailInfo.Direction = $scope.UITreeData["selectedData"]["itemValue"];
            	$scope.detailInfoNoUpdate.DirectionName = $scope.UITreeData["selectedData"]["itemName"];
    		}
		}
		//保存
		$scope.updateData = function(){
			//执行后，页面刷新控制符
            $scope.detailListFlag = false;
            $scope.goDetailTopFlag = true;

            $scope.detailInfo["UpdateDate"] = $filter('date')(new Date(),"yyyy/MM/dd");
			$scope.detailInfo["TempSaveFlag"] = "1";

			var detailInfo = $scope.dataFormatAdjust($scope.detailInfo);
			detailInfo["OperateFlag"] = true;

			//执行更新操作
			$db_operate.updateRecord($scope,"",detailInfo,"",$scope.selectedDetailMenuItem["ObjectType"],$scope.selectedListItem["BusinessType"])
                .then(function(status){
			    $db_operate.updateRateSegment($scope,"RatePart");
			    $db_operate.updateRPTSegment($scope,"RPTPart");
            });
		};
		//选择主要担保方式
		 $scope.selectVouchType = function(uiGridParam){
			 uiGridParam["SelName"] = "SelectCode";
	            uiGridParam["ParamId"] = "CodeNo";
				uiGridParam["ParamValue"] = "VouchType";
				$scope.doClickSure = function(){
					$scope.detailInfo.VouchType = $scope.UITreeData["selectedData"]["itemValue"];
	            	$scope.detailInfoNoUpdate.VouchTypeName = $scope.UITreeData["selectedData"]["itemName"];
	    		}
			}
		//选择绿色金融贷类型
		 $scope.selectGreenLoanFlagName = function(uiGridParam){
			 uiGridParam["SelName"] = "SelectCode";
	            uiGridParam["ParamId"] = "CodeNo";
				uiGridParam["ParamValue"] = "GreenLoanFlag";
				$scope.doClickSure = function(){
					$scope.detailInfo.GreenLoanFlag = $scope.UITreeData["selectedData"]["itemValue"];
	            	$scope.detailInfoNoUpdate.GreenLoanFlagName = $scope.UITreeData["selectedData"]["itemName"];
	    		}
			}
    })
    //****************业务申请列表控制器(主)-end***************//
//影像资料
     .controller('ScreenagesController', function ($scope,$ionicScrollDelegate,$rootScope,$cordovaCapture,$cordovaGeolocation, $http, $ionicPopup, $state, basePage,paging,$ionicLoading,$cordovaGeolocation) {
    	 $scope.showpage = false;
    	 $scope.listShowFlag = true;
    	 //保存加载的图片信息
         $scope.imageData = [];
         $scope.info = [];
      // 存储图片信息，用于传入后台服务的参数,
         // Image是由文件名拼接而成，用英文逗号隔开；
         $scope.info.Image = {Image: ''};
       //接受传入的参数，客户id，项号
         $scope.opts = {
             isSelectable: function(node) {
            	 $ionicScrollDelegate.$getByHandle('treedataSmallScroll').resize();
            	 var children = node.children;
                 return children.length===0;
             }
          };
         $scope.showSelected = function(sel) {
	         $scope.selectedNode = sel;
	         var children = sel.children;
	         if(children.length>0){//此节点为父节点，
	        	
	         }
	         
	         if(children.length==0){//此节为子节点
	        	 $scope.obj= angular.copy(sel);
	        	 $scope.obj.ItemName = sel.itemname;
	        	 $scope.obj.MODEL_CODE = sel.attribute1;
	        	 $scope.gotoScreenageDetail($scope.obj);
	         }
	         
	         
	     };
	     $scope.treedata="";
         $scope.ScreenageType ="";
    	 $scope.$on('to-screenage', function (e, data) {
    		// console.log(data);
    		 $scope.showFlag = true;//是否显示页面下面的新增保存按钮
    		 $scope.info.ObjectNo = data.ObjectNo;
    		 $scope.info.ObjectType = data.ObjectType;
    		 $scope.info.loanType = data.loanType;
    		 if(typeof(data.showFlag) == "undefined" || data.showFlag == "true"){
    			 $scope.showFlag = true;
    		 }else{
    			 $scope.showFlag = false;
    		 }
    		 
    		 /*if($rootScope.ApproveScreenShowFlag){//业务签批不展示影像增加按钮
    			 $scope.showFlag = false;
    		 }*/
//    		 if($scope.info.CustomerType=='0310'){
//           		 $scope.ScreenageType = '0310';
//           	 }else if($scope.info.CustomerType=='05'){
//           		 $scope.ScreenageType = '05';
//           	 }
            $scope.showpage = false;
            basePage.init($scope, loadData);
          //自定义不同客户类型下的影像类型不同
       	 
        });
    	//获取detailListData真实数据
			$scope.getDetailRealListData = function(data){
				var tmpResult = [];
				angular.forEach(data, function(resultItem, resultIndex) {
					var tmpObj = {};
					angular.forEach($scope.detailListGroup, function(groupItem, groupIndex) {
						$.each(resultItem,function(name,value){
							if($filter('uppercase')(groupItem["ColId"]) === name){
								tmpObj[groupItem.ColId] = value;
							}else if(name === "ClassCode"){
								tmpObj["ClassCode"] = value;
							}
						});
					});
					tmpResult.push(tmpObj);
				});
				return tmpResult;
			}
    	 $scope.initList = function(){
    		 runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
                     "SelectObjectList", {
    			 SerialNo: $scope.selectedListItem["ObjectNo"],
    				 ClassName:"com.amarsoft.webservice.business.InspectImpl",
    				 MethodName:"getScreenList"
                     }, function (data, status) {
                    	 result["data"] = $scope.getDetailRealListData(result["data"]);
							for (var k = 0; k < result["data"].length; k++) {
								$scope.detailItems.push(result["data"][k]);
							}
                     });
    	 }
    	 
    	 /**
    	  * params: $scope.ScreenageType, AmApp.userID, $scope.SerialNo
    	  * return: ItemList
    	  */
    	//获取采集要素
    	 var loadData = function ($ionicLoading) {
    	 runServiceWithSession($http, undefined, $ionicPopup, $state
//				, 'getScreenage', {ScreenageType:"0310",CustomerType:"00270",NewCustomerType:"P2017110600000001"}, 
    			 , 'SelectObjectList', {ScreenageType:$scope.ScreenageType,
    		 Userid:AmApp.userID,
    		 SerialNo:$scope.info.ObjectNo,
    		 ObjectType:$scope.info.ObjectType,
    		 loanType:$scope.info.loanType,
    		 operateType:"ViewImage" ,
			 ClassName:"com.amarsoft.webservice.business.InspectImpl",
			 MethodName:"getScreenage",
			 Transaction:"Sqlca"
    		 }, 
			function (data) {
    			 var result = data["array"][0];
    			 result=result[0].Value;
    			 result =angular.fromJson(result);
    			 result = angular.fromJson(result.array);
    			 $scope.treedata=result;
//    			 [
//					{ "name" : "Joe", "age" : "21", "children" : [
//					    { "name" : "Smith", "age" : "42", "children" : [] },
//					    { "name" : "Gary", "age" : "21", "children" : [
//					        { "name" : "Jenifer", "age" : "23", "children" : [
//					            { "name" : "Dani", "age" : "32", "children" : [] },
//					            { "name" : "Max", "age" : "34", "children" : [] }
//					        ]}
//					    ]}
//					]},
//					{ "name" : "Albert", "age" : "33", "children" : [] },
//					{ "name" : "Ron", "age" : "29", "children" : [] }
//					];
    			 $scope.selected = $scope.treedata[0];
//    				 [
//    				    { "name" : "Joe", "age" : "21", "children" : [
//    				        { "name" : "Smith", "age" : "42", "children" : [] },
//    				        { "name" : "Gary", "age" : "21", "children" : [
//    				            { "name" : "Jenifer", "age" : "23", "children" : [
//    				                { "name" : "Dani", "age" : "32", "children" : [] },
//    				                { "name" : "Max", "age" : "34", "children" : [] }
//    				            ]}
//    				        ]}
//    				    ]},
//    				    { "name" : "Albert", "age" : "33", "children" : [] },
//    				    { "name" : "Ron", "age" : "29", "children" : [] }
//    				];
//    				 transData(
//                         data["array"], 'ItemNo', 'sortno',
//                 'children');
    				// console.log(data);
//    					$scope.ItemList = [];
//    					var Item = {"parentName":"现场采集要素","children":[]};
//    					$scope.ItemList.push(Item)
//    					for(var i=0;i<data.array.length;i++){
//    						if(data.array[i].ItemNo.length==4){
//    							var Item = {"parentName":"","children":[]};
//    							Item.parentName=data.array[i].ItemName;
//    							$scope.ItemList.push(Item)
//    						}else{
//    							Item.children.push(data.array[i]);
//    						}
//    					}
//    					for(var i=0;i<$scope.ItemList.length;i++){
//    						if($scope.ItemList[i].children.length==0){
//    							$scope.ItemList.splice(i,1);
//    						}
//    					}
    					appIonicLoading.hide();
    				})
    	 }
    	 
    	 /*
    	 //暂时自定义客户管理的影像类型
    	 $scope.ScreenageType='0010';
    	 $scope.SerialNo=$scope.Customerid;
    	 //获取节点列表信息
    	 items.getScreenage($scope,AmApp);
    	 */
    	// $scope.info = {};
      //  $scope.gotoScreenageDetail = function(CertTypeName,CertType,Customerid) {
    	 $scope.gotoScreenageDetail = function(child) {
    		// console.log(child);
        	$scope.showpage = false;
        	if(child.ItemNo === undefined || child.ItemNo === 'undefined'  ){
                appIonicLoading.show({
                    template: '请先选中一条关联业务！',
                    animation: 'fade-in',
                    showBackdrop: true,
                    duration: 1500
                });
                return false;
            }else{
                $scope.showpage = true;
              //  itemtep.CustomerID = $scope.CustomerID;
                
                //广播名称中加入索引，避免在切换tab时重复发送广播
                $scope.$broadcast('to-takePictures', child);
            }
        	
        	/*
        	//广播名称中加入索引，避免在切换tab时重复发送广播
			$scope.$broadcast('to-takePictures', {
				"CertTypeName":CertTypeName,
				"CertType":CertType,
				"Customerid":Customerid});*/
			//接受返回
			$scope.$on('change-showpage', function (event, data) {
				$scope.showpage = data.showpage;
			});
		};
     })
    .controller('PrePhotoController', function ($scope, basePage,$rootScope, $stateParams, $http, $ionicLoading, $window,
													  $ionicPopup, $state, $ionicModal, $timeout, $cordovaFileTransfer,
													  $cordovaCapture, $cordovaGeolocation, $ionicActionSheet) {
    	 $scope.info.SerialNo ="";
    	 $scope.images = [];  //用于展示图片
		$scope.$on('to-takePictures',function (event, data) {
			console.log(data);
			$scope.EditFlag = data.EditFlag;
			//$scope.images = [];  //用于展示图片
            $scope.videos = [];  //用于展示视频
            $scope.radios = [];  //用于展示视频
			// $scope.radios = [{"SerialNo":"2016121000000002","Describe":"","Longitude":"","Latitude":"","Address":"","FileType":"02","FileName":"\/Volumes\/H\/fileupload\/2016090200000001010101\/1481350801516.wav"}];  //用于展示音频
			$scope.cancel_mode = false;
			$scope.imgSelected = false;
			$scope.imageData = []; //保存加载的图片信息
            $scope.radiosData = []; //保存加载的音频信息
            $scope.videosData = []; //保存加载的视频信息
            $scope.screenageTitle = data.ItemName;
			//$scope.params = data;
            $scope.info.ItemNo = data.ItemNo;
            $scope.info.ModelCode = data.MODEL_CODE;
			$scope.info.SerialNo = data.SerialNo;
			$scope.info.ObjectType = data.ObjectType;
			$scope.info.QUERY_TIME = data.QUERY_TIME;
			$scope.info.loanType = data.loanType;
			$scope.info.QUERY_OBJECTNO = data.QUERY_OBJECTNO;
			console.log($scope.info.SerialNo)
//			$scope.info.ItemNo = data.ItemNo;
//			$scope.info.CertType = data.CertType;
			//用于处理删除时变量未定义
            $stateParams.SerialNo = $scope.info.SerialNo;
            $stateParams.ItemNo = data.ItemNo;
            
			/*$rootScope.getAddress();
			$scope.info.Address=$rootScope.Address;
			$scope.info.Latitude=$rootScope.Latitude;
			$scope.info.Longitude=$rootScope.Longitude;
			$scope.info.Describe = '';*/
            
			//获取资料和影像信息
			/**
			 * kzhang
			 * 下载资料影像信息
			 */
			$scope.getInfo();
			/*$scope.infos={CustomerID: $scope.info.CustomerID, ItemNo: $scope.info.ItemNo,PhaseType:$scope.info.PhaseType,userID:AmApp.userID};
			load.getImageInfo($scope, infos, AmApp);*/
			

		});
		$scope.goBack1 = function () {
			$scope.$emit('change-showpage', {showpage: false});
		};

		appscope = $scope;

		//初始化基础页面
		basePage.init($scope);

		//接受传入参数，并设置为title名称
		// $scope.title = $stateParams.ItemName;

		/*存储图片、音频和视频文件名等信息，用于传入后台服务的参数,
		 Image，Radio，Video是由各自的文件名拼接而成，用英文逗号隔开；
		 */
		$scope.info = {Image: '', Radio: '', Video: ''};

		//接受传入的参数，客户id，项号,
		// $scope.info.CustomerID = $stateParams.CustomerID;
		// $scope.info.ItemNo = $stateParams.ItemNo;

		/*拍摄图片的数组
		 name: 文件名
		 fullPath：文件全路径
		 isNew：true/false 是否是新拍摄的
		 */


		$scope.isShow = {show: false};  //是否显示拍摄的图片
		$scope.index;  //查看大图时使用
		$scope.imageNo = MaxNo;  //赋值最多拍摄图片数量


		/*增加资料的点击事件*/
		$scope.addDate = function () {
			$ionicActionSheet.show({
				buttons: [
					{text: '拍照'},
                    /*{text: '视频'},
                    {text: '音频'},*/
                    {text: '相册'}
				],
				titleText: '点击您想添加的资料',
				cancelText: '取消',
				cancel: function () {
					// add cancel code..
				},
				buttonClicked: function (index) {
					if (index === 0) {//增加图片
						if ($scope.images.length >= MaxNo || $scope.imageData.length >= MaxNo) {
							appIonicLoading.show({template: '最多只能拍摄' + MaxNo + '张图片！', duration: 2000});
						} else {
							$scope.takePhoto('CAMERA');
						}

					}
					/*else if (index === 1) {//增加视频
                        if ($scope.videos.length >= MaxNo || $scope.videosData.length >= MaxNo) {
                            appIonicLoading.show({template: '最多只能拍摄' + MaxNo + '个视频！', duration: 2000});
                        } else {
                            $scope.takeVideo();
                        }

                    } else if(index === 2){//增加音频
                        if ($scope.radios.length >= MaxNo || $scope.radiosData.length >= MaxNo) {
                            appIonicLoading.show({template: '最多只能录制' + MaxNo + '个音频！', duration: 2000});
                        } else {
                            $scope.takeRadio();
                        }

                    }*/
                    else{//相册选择
						if ($scope.images.length >= MaxNo || $scope.imageData.length >= MaxNo) {
							appIonicLoading.show({template: '最多只能存在' + MaxNo + '张图片！', duration: 2000});
						} else {
							$scope.takePhoto('PHOTOLIBRARY');
						}

                    }
					return true;
				}
			});
		};
		/*$scope.addDate = function () {
			$ionicActionSheet.show({
				buttons: [
					{text: '图片'},
                    {text: '视频'},
                    {text: '音频'}
				],
				titleText: '点击您想添加的资料',
				cancelText: '取消',
				cancel: function () {
					// add cancel code..
				},
				buttonClicked: function (index) {
					if (index === 0) {//增加图片
						if ($scope.images.length >= MaxNo || $scope.imageData.length >= MaxNo) {
							appIonicLoading.show({template: '最多只能拍摄' + MaxNo + '张图片！', duration: 2000});
						} else {
							$scope.takePhoto();
						}

					}else if (index === 1) {//增加视频
                        if ($scope.videos.length >= MaxNo || $scope.videosData.length >= MaxNo) {
                            appIonicLoading.show({template: '最多只能拍摄' + MaxNo + '个视频！', duration: 2000});
                        } else {
                            $scope.takeVideo();
                        }

                    } else {//增加音频
                        if ($scope.radios.length >= MaxNo || $scope.radiosData.length >= MaxNo) {
                            appIonicLoading.show({template: '最多只能录制' + MaxNo + '个音频！', duration: 2000});
                        } else {
                            $scope.takeRadio();
                        }

                    } 
					return true;
				}
			});
		};*/
		/*编辑文件，可以选择删除
		 */
		$scope.selectImg = function () {
			$scope.cancel_mode = !$scope.cancel_mode;
			if ($scope.cancel_mode) {
				//显示取消按钮时
				$scope.imgSelected = true;//显示选择图片的按钮,进行批量删除
			} else {
				//显示选择按钮时
				$scope.imgSelected = false;//隐藏批量删除选择按钮
				for (var v = 0; v < $scope.images.length; v++) {
					if ($scope.images[v].isSelected) {
						$scope.images[v].isSelected = false;
					}
				}
				/*for (var v = 0; v < $scope.radios.length; v++) {
                    if ($scope.radios[v].isSelected) {
                        $scope.radios[v].isSelected = false;
                    }
                }*/

                /*for (var v = 0; v < $scope.videos.length; v++) {
                    if ($scope.videos[v].isSelected) {
                        $scope.videos[v].isSelected = false;
                    }
                }*/
			}
		};

		$scope.hasSelect = function (i, image) {
			// image.show = !image.show;
			image.isSelected = !image.isSelected;
		};
		// document.addEventListener("deviceready", function () {
		
		
		//拍照
		//拍照
		$scope.takePhoto = function(CameraPro){
			if(CameraPro=='CAMERA'){
				//调用插件 ，拍照
        		navigator.camera.getPicture(onSuccess, onFail,
        		{
        		    destinationType: Camera.DestinationType.FILE_URI,
        		    sourceType: Camera.PictureSourceType.CAMERA
        		});
        		
    		}else{//从相册中选择
    			/*window.imagePicker.getPictures(
    					function(results) {
    						for (var i = 0; i < results.length; i++) {
    							onSuccess(results[i]);
    						}
    					}, function (error) {
    						if(error=="20"){
    	        				requestPermission($ionicPopup,"拍照");
    	        			}
    					}
    				);*/
    			navigator.camera.getPicture(onSuccess, onFail,
    	        		{
    	        		    sourceType: Camera.PictureSourceType.PHOTOLIBRARY
    	        		});
    		}
    		
    		function onSuccess(imageURI) {
    			//避免选择多于3张照片
    			if ($scope.images.length >= MaxNo || $scope.imageData.length >= MaxNo) {
					return;
				}
    			// 拍摄成功，处理图片数据
    			var image = {};
    			//获取拍摄图片的全路径信息
    			image.URL = imageURI;
    			
    			var date = new Date();
    			//以时间毫秒重命名文件
    			image.name = date.getTime()+ '.' + imageURI.split('.').pop();
    			
    			//文件类型 01 = 图片
				image.FileType = '01';
				
				//设置是不是新增图片属性isNew
				image.isNew = true;
				image.isSelected = false;
				
				//上传图片,将拍摄的图片放入数组中
				$scope.images.push(image);
				$scope.$digest();
				
				/*
				 * 拍照成功后，获取地理位置
				 * */
				$rootScope.getAddress();
				$scope.info.Address=$rootScope.Address;
				$scope.info.Latitude=$rootScope.Latitude;
				$scope.info.Longitude=$rootScope.Longitude;
				$scope.info.Describe = '';
    		}
    		//拍摄照片失败
		function onFail(message) {
			if(message=="20"){
				requestPermission($ionicPopup,"拍照");
			}
		}
		window.onorientationchange = function() {
		    var cameraPopoverHandle = new CameraPopoverHandle();
		    var cameraPopoverOptions = new CameraPopoverOptions(0, 0, 100, 100, Camera.PopoverArrowDirection.ARROW_ANY);
		    cameraPopoverHandle.setPosition(cameraPopoverOptions);
		};
	};
			/*$scope.takePhoto = function(){
				//调用插件 ，拍照
        		navigator.camera.getPicture(onSuccess, onFail,
        		{
        		    destinationType: Camera.DestinationType.FILE_URI,
        		    sourceType: Camera.PictureSourceType.CAMERA
        		});
        		
        		function onSuccess(imageURI) {

        			// 拍摄成功，处理图片数据
        			var image = {};
        			//获取拍摄图片的全路径信息
        			image.src = imageURI;
        			
        			var date = new Date();
        			//以时间毫秒重命名文件
        			image.name = date.getTime()+ '.' + imageURI.split('.').pop();
        			
        			//文件类型 01 = 图片
					image.FileType = '01';
					
//					//设置是不是新增图片属性isNew
					image.isNew = true;
					image.isSelected = false;
					
					//上传图片,将拍摄的图片放入数组中
					$scope.images.push(image);
					$ionicLoading.show({
		        		template: '照片拍摄成功！', duration: 2000
		            });
        		}
        		//拍摄照片失败
    		function onFail(message) {
    			if(message=="20"){
    				requestPermission($ionicPopup,"拍照");
    			}
    		}
    		window.onorientationchange = function() {
    		    var cameraPopoverHandle = new CameraPopoverHandle();
    		    var cameraPopoverOptions = new CameraPopoverOptions(0, 0, 100, 100, Camera.PopoverArrowDirection.ARROW_ANY);
    		    cameraPopoverHandle.setPosition(cameraPopoverOptions);
    		};
    	};*/

		  //========  拍摄视频  ========
        $scope.takeVideo = function () {
        	
            //limit每次拍一个，duration拍摄时间
            var options = {limit: 1, duration: durationTime};

            $cordovaCapture.captureVideo(options).then(function (videoData) {
                // Success! Video data is here
                var i, path, len;
                //遍历获取录制的文件（iOS只支持一次录制一个视频或音频）
                for (i = 0, len = videoData.length; i < len; i++) {
                    //保存视频信息
                    var video = {};
                    //获取拍摄图片的全路径信息
                    video.src = videoData[i].fullPath;

                    //以时间毫秒重命名文件
                    var date = new Date();
                    video.name = date.getTime() + '.' + videoData[i].name.split('.').pop();

                    //文件类型 03 = 视频
                    video.FileType = '03';

                    //设置新增属性isNew
                    video.isNew = true;

                    video.isSelected = false;

                    //将拍摄的图片放入数组中
                    $scope.videos.push(video);

                }
            }, function (err) {
                // An error occurred. Show a message to the user
            });
        };


        // 录制音频

        $scope.takeRadio = function () {
        	//duration: 60 录音长度：60秒
        	navigator.device.capture.captureAudio(onSuccess, onError, {duration: 60});
        	//录制成功
        	function onSuccess(mediaFiles) {
        		//保存视频信息
                var radio = {};
                //获取拍摄图片的全路径信息
                radio.src = mediaFiles[0].fullPath;               
//                alert("radio.src"+radio.src);
                //以时间毫秒重命名文件
                var date = new Date();
                radio.name = date.getTime() + '.' + mediaFiles[0].name.split('.').pop();
//                alert("radio.name="+radio.name);
                //文件类型 02 = 音频
                radio.FileType = '02';

                //设置新增属性isNew
                radio.isNew = true;
                radio.isSelected = false;
                
                //将拍摄的图片放入数组中
                $scope.radios.push(radio);
                $ionicLoading.show({
	        		template: '音频录制成功！', duration: 2000
	            });
        	}
        	//录制失败
            function onError(error) {
               alert('录制失败!');
            }
        	//原型中的音频录制方法
            /*var options = {limit: 1, duration: durationTime};

            $cordovaCapture.captureAudio(options).then(function (audioData) {
                // Success! Video data is here
                var i, path, len;
                //遍历获取录制的文件（iOS只支持一次录制一个视频或音频）
                for (i = 0, len = audioData.length; i < len; i++) {
                    //保存视频信息
                    var radio = {};
                    //获取拍摄图片的全路径信息
                    radio.src = audioData[i].fullPath;
                    alert(radio.src);
                    //以时间毫秒重命名文件
                    var date = new Date();
//                    radio.name = date.getTime() + '.' + audioData[i].name.split('.').pop();

                    //文件类型 02 = 音频
                    radio.FileType = '02';

                    //设置新增属性isNew
                    radio.isNew = true;

                    radio.isSelected = false;
                    //将拍摄的图片放入数组中
                    $scope.radios.push(radio);

                }
            }, function (err) {
                // An error occurred. Show a message to the user
            });*/
        };




		//是否需要隐藏loading
		var shouldHideLoading = false;

		var finalTemplate = '';

		/**
		 * 获取需要上传文件数量
		 */
		$scope.getNeedUpdateCount = function () {
			var result = 0;
			for (var i = 0; i < $scope.images.length; i++) {
				if ($scope.images[i].isNew && $scope.images[i].isNew == true) {
					result++;
				}
			}
			/*for (var i = 0; i < $scope.videos.length; i++) {
                if ($scope.videos[i].isNew && $scope.videos[i].isNew == true) {
                    result++;
                }
            }*/

            /*for (var i = 0; i < $scope.radios.length; i++) {
                if ($scope.radios[i].isNew && $scope.radios[i].isNew == true) {
                    result++;
                }
            }*/
			return result;
		};

		//定时判断是否需要隐藏
		appscope.judgeLoading = function () {
			appscope.waitTimeout--;
			if(appscope.needUpdateCount !== 0){
				if (appscope.actualUpdateCount === appscope.needUpdateCount) {
					appIonicLoading.hide();
					appIonicLoading.show({template: '上传成功', duration: 2000});
				}
				else {
					if (appscope.waitTimeout === 0) {
						appIonicLoading.hide();
						appIonicLoading.show({template: '上传超时或失败，请重试...', duration: 2000});
					} else {
						setTimeout('appscope.judgeLoading()', 1000);
					}
				}
			}else{
			}

		};
		
		/**
		 * 没有影像信息时只保存描述，地址等信息
		 */
		$scope.uploadOtherInfo = function () {
//			console.log($scope.info);
			runServiceWithSession($http, undefined, $ionicPopup, $state, 'uploadImage', $scope.info,
				function (data, status) {
					if(data.array[0].Result.split(',')[0] === 'SUCCESS'){
						appIonicLoading.show({template: '保存信息成功！', duration: 2000});
					} else {
						appIonicLoading.show({template: '保存信息失败！', duration: 2000});
					}

				});
		};
		
		/*
        资料上传，先上传图片，视频，音频，再上传其他资料信息
        */
       $scope.uploadinfo = function () {

    	   appscope.actualUpdateCount = 0;
			appscope.waitTimeout = 60;
			appscope.needUpdateCount = $scope.getNeedUpdateCount();
			if(appscope.needUpdateCount === 0){
				if($scope.info.Describe == '' || $scope.info.Describe == undefined){
					appIonicLoading.show({template: '没有新增的文件可以上传！', duration: 2000});
					return;
				}else{
					$scope.uploadOtherInfo();
					return;
				}
			}else{
				appIonicLoading.show({template: '信息保存中...'});

			}
			//定义upIVR
			upIVR = $scope;
			var data = $scope.info;
			
			//加入定时器,依次上传，避免同时访问数据库
			setTimeout('upIVR.uploadImg()',0);//上传照片
			//setTimeout('upIVR.uploadVideo()',100);//上传视频
			//setTimeout('upIVR.uploadRadio()',300);//上传录音
			
			/**
			 * 上传图片方法
			 */
			upIVR.uploadImg = function(){
			  var noUploadNum = $scope.images.length - appscope.needUpdateCount;//不需要上传的文件个数
			  for (var i = 0; i < $scope.images.length; i++) {
				if ($scope.images[i].isNew && $scope.images[i].isNew == true) {
					shouldHideLoading = false;
					(function (i) {
						var uploadIndex = i+1-noUploadNum;//正上传的是第几个文件
						var win = function (r) {
							if(r.response.indexOf("SUCCESS") != -1){
								var imageData = {};
								for(var key in data){
									imageData[key] = data[key];
								}
								imageData.Image = $scope.images[i].name;
								
								if(i == $scope.images.length-1){
									//此时是最后一张
									$ionicLoading.show({
					            		template: '文件上传成功！', duration: 2000
					                });
									$scope.getInfo();
								}
							}else{
								$ionicLoading.show({
				            		template: '第'+uploadIndex+'个文件上传失败！', duration: 2000
				                });
							}
							
//							runServiceWithSession($http, null, $ionicPopup, $state, 'uploadImage', imageData,
//								function (data, status) {
//								//data={"returnCode":"SUCCESS","ResponseParams":{"array":[{"Result":"SUCCESS,2017112300000002"}]}}
//									//提示模板
//									var template;
//									var d = data.array[0].Result.split(',');
//									
//									if (d[0] == 'SUCCESS') {
//										appscope.actualUpdateCount++;
//										$scope.SerialNo = d[1];
//										$scope.images[i].isNew = false;
//										template = "文件上传成功";
//									} else {
//										template = "文件上传数据库失败！";
//									}
//									
//									$ionicLoading.show({ template: template , duration: 2000});
//								});
						}

						var fail = function (error) {
							$ionicLoading.show({
			            		template: '第'+uploadIndex+'文件上传失败！', duration: 2000
			                });
						}
						//文件的路径
						var fileURL = $scope.images[i].URL;
						//上传的参数
						var options = new FileUploadOptions();
						options.fileKey = "file";
						options.mimeType = "text/plain";
						options.fileName = $scope.images[i].name;
						var ft = new FileTransfer();
						//上传照片
						/**
						 * kzhang 
						 * 所上传的文件路径在每个用户为文件名的文件下，由ALS73C的are.xml中的 ‘路径/AmApp.userID’，由下方的代码决定 
						 * 例如：are.xml 里写的 D:/pic ,最终上传的位置在：D:/pic/00270/ 下。
						 * "/FileTransfer?dir=" + AmApp.userID 
						 * 
						 */
						/*ft.upload(fileURL, encodeURI(AmApp.config.ServiceRealRootPath + "/FileTransfer?dir=" + $scope.info.CustomerID + $scope.info.ItemNo), win, fail, options);*/
//						ft.upload(fileURL, encodeURI(AmApp.config.ServiceRealRootPath + "/FileTransfer"), win, fail, options);
						//
						
						 ft.upload(fileURL, encodeURI(AmApp.config.ServiceRealRootPath + "/FileTransfer?dir=" + AmApp.userID +"@"+ $scope.info.QUERY_OBJECTNO +"@"+ $scope.info.ItemNo+"@"+ $scope.info.ModelCode+"@"+$scope.info.QUERY_TIME), win, fail, options);
						
					})(i);
				}
			}
			};

//			//视频上传
			upIVR.uploadVideo = function(){
			for (var j = 0; j < $scope.videos.length; j++) {
				//视频isNew 为true ，是新增时上传视频
				if ($scope.videos[j].isNew && $scope.videos[j].isNew == true) {
					(function (j) {
						var win = function (r){
							
							var videoData = {};
							for(var key in data){
								videoData[key] = data[key];
							}
							videoData.Video = $scope.videos[j].name;

							runServiceWithSession($http, null, $ionicPopup, $state, 'uploadImage', videoData,
								function (data, status) {
								//data={"returnCode":"SUCCESS","ResponseParams":{"array":[{"Result":"SUCCESS,2017112300000002"}]}}
									//提示模板
									var template;
									var d = data.array[0].Result.split(',');

									if (d[0] == 'SUCCESS') {
										appscope.actualUpdateCount++;
										template = "文件上传成功！";
										$scope.SerialNo = d[1];
										$scope.videos[j].isNew = false;
									} else {
										template = "文件上传数据库失败！！";
									}
									$ionicLoading.show({ template: template , duration: 2000});
								});
						}

						var fail = function (error) {
							$ionicLoading.show({
			            		template: '文件上传失败！', duration: 2000
			                });
						}

						//文件的路径
						var fileURL = $scope.videos[j].src;
						//上传的参数
						var options = new FileUploadOptions();
						options.fileKey = "file";
						options.mimeType = "video/ogg";
						options.fileName = $scope.videos[j].name;

						var ft = new FileTransfer();
						//上传视频
						/**
						 * kzhang 
						 * 所上传的文件路径在每个用户为文件名的文件下，由ALS73C的are.xml中的 ‘路径/AmApp.userID’，由下方的代码决定 
						 * 例如：are.xml 里写的 D:/pic ,最终上传的位置在：D:/pic/00270/ 下。
						 * "/FileTransfer?dir=" + AmApp.userID 
						 * 
						 */
//						ft.upload(fileURL, encodeURI(AmApp.config.ServiceRealRootPath + "/FileTransfer?dir=" + $scope.info.CustomerID + $scope.info.ItemNo), win, fail, options);
//						ft.upload(fileURL, encodeURI(AmApp.config.ServiceRealRootPath + "/	"), win, fail, options);
						ft.upload(fileURL, encodeURI(AmApp.config.ServiceRealRootPath + "/FileTransfer?dir=" + AmApp.userID +"@"+ $scope.info.SerialNo +"@"+ $scope.info.ItemNo+"@"+ $scope.info.ModelCode), win, fail, options);

					})(j);
				}
			}
			};

//			//音频上传
			upIVR.uploadRadio = function(){
			for (var k = 0; k < $scope.radios.length; k++) {

				//音频isNew 为true ，是新增时上传音频
				if ($scope.radios[k].isNew && $scope.radios[k].isNew == true) {
					(function (k) {
						var win = function (r) {
							var audioData = {};
							for(var key in data){
								audioData[key] = data[key];
							}
							audioData.Radio = $scope.radios[k].name;

							runServiceWithSession($http, null, $ionicPopup, $state, 'uploadImage', audioData,
								function (data, status) {
								//data={"returnCode":"SUCCESS","ResponseParams":{"array":[{"Result":"SUCCESS,2017112300000002"}]}}
									//提示模板
									var template;
									var d = data.array[0].Result.split(',');
									if (d[0] == 'SUCCESS') {
										appscope.actualUpdateCount++;
										template = "文件上传成功！";
										$scope.SerialNo = d[1];
										$scope.radios[k].isNew = false;

									} else {
										template = "文件上传数据库失败！！";
									}
									$ionicLoading.show({ template: template , duration: 2000});
								});
						}

						var fail = function (error) {
							$ionicLoading.show({
			            		template: '文件上传失败！', duration: 2000
			                });
						}

						//文件的路径
						var fileURL = $scope.radios[k].src;
						//上传的参数
						var options = new FileUploadOptions();
						options.fileKey = "file";

						options.mimeType = "text/plain";

						options.fileName = $scope.radios[k].name;

						var ft = new FileTransfer();
						//上传音频
						/**
						 * kzhang 
						 * 所上传的文件路径在每个用户为文件名的文件下，由ALS73C的are.xml中的 ‘路径/AmApp.userID’，由下方的代码决定 
						 * 例如：are.xml 里写的 D:/pic ,最终上传的位置在：D:/pic/00270/ 下。
						 * "/FileTransfer?dir=" + AmApp.userID 
						 * 
						 */
//						ft.upload(fileURL, encodeURI(AmApp.config.ServiceRealRootPath + "/FileTransfer?dir=" + $scope.info.CustomerID + $scope.info.ItemNo), win, fail, options);
//						ft.upload(fileURL, encodeURI(AmApp.config.ServiceRealRootPath + "/FileTransfer"), win, fail, options);
						ft.upload(fileURL, encodeURI(AmApp.config.ServiceRealRootPath + "/FileTransfer?dir=" + AmApp.userID +"@"+ $scope.info.SerialNo +"@"+ $scope.info.ItemNo+"@"+ $scope.info.ModelCode), win, fail, options);
					})(k);
				}
			}
			};
//			 appscope.judgeLoading();
//			setTimeout('appscope.judgeLoading()', 1000);
       };
       
       
		//查看大图
		$ionicModal.fromTemplateUrl('templates/customer/picture-modal.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function (modal) {
			$scope.modal = modal;
		});
		$scope.openModal = function (index) {
			$scope.index = index;
			$scope.images[$scope.index].isSelected = true;
			$scope.words = "乌鲁木齐总行    "+AmApp.orgName+AmApp.userName;
			$scope.modal.show();

		};
		$scope.closeModal = function () {
			$scope.modal.hide();
			// $scope.modal.remove();
			$scope.images[$scope.index].isSelected = false;
			$scope.index = null;
		};


		//删除图片
		$scope.deleteImage = function () {
            //设置完就清空
            if ($scope.images[$scope.index].isNew) {
                $scope.images.splice($scope.index, 1);
            } else {
                var delParams = {
                    SerialNo: '',
                    FileName: ''
                };

                delParams.SerialNo = $scope.SerialNo;
                delParams.FileName = '/' + $stateParams.CustomerID + $stateParams.ItemNo + '/' + $scope.images[$scope.index].name;

                runServiceWithSession($http, $ionicLoading, $ionicPopup, $state, 'deleteFiles', delParams,
                    function (data, status) {

                        if (data.array[0].Result == 'SUCCESS') {
                            //删除对应的图片
                            $scope.images.splice($scope.index, 1);

                            appIonicLoading.show({template: '删除成功！', duration: 2000});
                        } else {
                            appIonicLoading.show({template: '删除失败！', duration: 2000});
                        }

                    });

            }

            //关闭模态窗口
            $scope.closeModal();
        };
		
		//删除文件
		$scope.deleteFile = function () {
            var newFile = 0;
            for (var s = 0; s < $scope.images.length; s++) {
                if ($scope.images[s].isNew && $scope.images[s].isSelected) {
                    newFile++;
                    $scope.images.splice(s, 1);
                    s = -1;
                }
            }

            for (var s = 0; s < $scope.radios.length; s++) {
                if ($scope.radios[s].isNew && $scope.radios[s].isSelected) {
                    newFile++;
                    $scope.radios.splice(s, 1);
                    s = -1;
                }
            }

            for (var s = 0; s < $scope.videos.length; s++) {
                if ($scope.videos[s].isNew && $scope.videos[s].isSelected) {
                    newFile++;
                    $scope.videos.splice(s, 1);
                    s = -1;
                }
            }

            var delParams = {
                SerialNo: '',
                FileName: ''
            };

            delParams.SerialNo = $scope.SerialNo;
            delParams.userID = AmApp.userID;

            for (var n = 0; n < $scope.images.length; n++) {
                if ($scope.images[n].isSelected) {
                    delParams.FileName += '/' + $stateParams.CustomerID + $stateParams.ItemNo + '/' + $scope.images[n].name + ',';
                }
            }

            for (var m = 0; m < $scope.radios.length; m++) {
                if ($scope.radios[m].isSelected) {
                    delParams.FileName += '/' + $stateParams.CustomerID + $stateParams.ItemNo + '/' + $scope.radios[m].name + ',';
                }
            }

            for (var k = 0; k < $scope.videos.length; k++) {
                if ($scope.videos[k].isSelected) {
                    delParams.FileName += '/' + $stateParams.CustomerID + $stateParams.ItemNo + '/' + $scope.videos[k].name + ',';
                }
            }

            if (delParams.FileName == '' && newFile == 0) {
                appIonicLoading.show({template: '没有可删除的文件！', duration: 2000});
                return;
            }

            runServiceWithSession($http, $ionicLoading, $ionicPopup, $state, 'deleteFiles', delParams,
                function (data, status) {

                    if (data.array[0].Result == 'SUCCESS') {
                        for (var n = 0; n < $scope.images.length; n++) {
                            if ($scope.images[n].isSelected) {
                                $scope.images.splice(n, 1);
                                $scope.imageData.splice(n, 1);
                                n = -1;
                            }
                        }

                        for (var n = 0; n < $scope.radios.length; n++) {
                            if ($scope.radios[n].isSelected) {
                                $scope.radios.splice(n, 1);
                                $scope.radiosData.splice(n, 1);
                                n = -1;
                            }
                        }

                        for (var n = 0; n < $scope.videos.length; n++) {
                            if ($scope.videos[n].isSelected) {
                                $scope.videos.splice(n, 1);
                                $scope.videosData.splice(n, 1);
                                n = -1;
                            }
                        }
                        $scope.imgSelected = false;
                        $scope.cancel_mode = false;
                        appIonicLoading.show({template: '删除成功！', duration: 2000});
                    } else {
                        appIonicLoading.show({template: '删除失败！', duration: 2000});
                    }

                });

        };
		
        /**
   	  * params:  $scope.info.ModelCode模型号, AmApp.userID, $scope.SerialNo，$scope.info.ItemNo资料code值
   	  * return: ItemList
   	  */
		//下载资料和影像信息
		$scope.getInfo = function () {
			$scope.images = [];
			$scope.AllData = [];
			$scope.imageData= [];
			appIonicLoading.show({template: '下载数据...', duration: 20000});
			runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
//					'loadImages', {CustomerID: $scope.info.CustomerID, ItemNo: $scope.info.ItemNo,PhaseType:"001",userID:AmApp.userID},
					'loadImages', {CustomerID: $scope.info.SerialNo,
				//ModelCode: $scope.info.ModelCode, 
				ItemNo: $scope.info.ItemNo,
				ObjectType:$scope.info.ObjectType,//客户管理，信贷是写死的objectype  Customer;
				loanType:$scope.info.loanType,
				userID:AmApp.userID},
					function (data, status) {
					    var result = data.array[0].Describe;
					    result = angular.fromJson(result);
					    $scope.AllData = result.array;
                        if($scope.AllData == undefined){
                        	appIonicLoading.show({template: '暂无影像数据！', duration: 2000});
                        	return false;
                        }
						//FileType: 01=图片，02=音频，03=视频
						for (var k = 0; k < $scope.AllData.length; k++) {
							if ($scope.AllData[k].fileformat == 'jpg') {
								//添加图片
								var image = $scope.AllData[k];
								//console.log(image);
//								image.loading = true;
								$scope.imageData.push(image);
							} else if ($scope.AllData[k].fileformat == 'amr'||$scope.AllData[k].fileformat == 'mp3') {
								//添加音频
								var radio = $scope.AllData[k];
								radio.loading = true;
//								$scope.radios.push(radio);
								$scope.radiosData.push(radio);
							} else if ($scope.AllData[k].fileformat == 'mp4') {
								//添加视频
								var video = $scope.AllData[k];
								//console.log(video);
								video.loading = true;
								$scope.videosData.push(video);
								//console.log($scope.videosData);

							}
						}
						//下载描述信息
						if (data.array[0]) {
							$scope.SerialNo = data.array[0].SERIALNO;
							$scope.info.Describe = data.array[0].DESCRIBEDETAIL;
						}

						document.addEventListener('deviceready', function () {
							$scope.getAddress();

							//下载时会出现异步现象，先执行循环，再执行download函数
							/**
							 * $scope.radiosData[i].FileName:就是从后台传过来的上传照片时的路径
							 * 在从此路径下下载
							 */
							for (var i = 0; i < $scope.imageData.length; i++) {
								(function (i) {
									var url = AmApp.config.ServiceRealRootPath + "/AttachView?FullPath=" + $scope.imageData[i].URL;
									var targetPath = cordova.file.cacheDirectory +new Date().getTime()+ i + "."+$scope.imageData[i].fileformat;
									var trustHosts = true;
									var options = {};
									url=url.replace(/\+/g,'%2B');
									$cordovaFileTransfer.download(url, targetPath, options, trustHosts)
										.then(function (result) {
											appIonicLoading.hide();
											// Success!
											var image = {};
											image.URL = result.nativeURL;
											image.isSelected = false;
											image.name = result.name;
											$scope.images.push(image);

											$scope.imageData[i].loading = false;

										}, function (err) {
											// Error
											appIonicLoading.show({template: '加载失败！code：' + err.code, duration: 2000});
										}, function (progress) {
											$timeout(function () {
												$scope.downloadImageProgress = (progress.loaded / progress.total) * 100;
											}, 500);
										});
								})(i);

							}

//							//下载音频
							for (var i = 0; i < $scope.radiosData.length; i++) {

								(function (i) {
									var url = AmApp.config.ServiceRealRootPath + "/AttachView?FullPath=" + $scope.radiosData[i].URL;
									var targetPath = cordova.file.cacheDirectory +new Date().getTime()+ "."+$scope.radiosData[i].fileformat;
									/*var targetPath = cordova.file.cacheDirectory + $scope.radiosData[i].URL.split('/').pop();*/
									var trustHosts = true;
									var options = {};
									
									$cordovaFileTransfer.download(url, targetPath, options, trustHosts)
										.then(function (result) {
											// Success!
											var radio = {};
											radio.src = result.nativeURL;
											radio.isSelected = false;
											radio.name = result.name;
											$scope.radios.push(radio);

											$scope.radiosData[i].loading = false;

										}, function (err) {
											// Error
											appIonicLoading.show({template: '加载失败！code：' + err.code, duration: 2000});
										}, function (progress) {
											$timeout(function () {
												$scope.downloadAudioProgress = (progress.loaded / progress.total) * 100;
											},500);
										});
								})(i);

							}

//							//下载视频
							for (var i = 0; i < $scope.videosData.length; i++) {

								(function (i) {
									var url = AmApp.config.ServiceRealRootPath + "/AttachView?FullPath=" + $scope.videosData[i].URL;
									var targetPath = cordova.file.cacheDirectory +new Date().getTime()+  "."+$scope.videosData[i].fileformat;
									var trustHosts = true;
									var options = {};
									//alert(url);
									$cordovaFileTransfer.download(url, targetPath, options, trustHosts)
										.then(function (result) {
											
											//alert("Success!"); 
											//alert(result); 
											var video = {};
											video.src = result.nativeURL;
											video.isSelected = false;
											video.name = result.name;
											$scope.videos.push(video);
											//alert(video.src);
											$scope.videosData[i].loading = false;

										}, function (err) {
											// Error
											appIonicLoading.show({template: '加载失败！code：' + err.code, duration: 2000});
										}, function (progress) {
											$timeout(function () {
												$scope.downloadVideoProgress = (progress.loaded / progress.total) * 100;
											}, 500);
										});
								})(i);
								
							}
							
						}, false);
					});
			
			
			/**
			 * kzhang
			 * 以下注释掉的下载方法是瑞丰银行给的，有些属性还不能确定，故先用上面的原型中的方法
			 */
			/*runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
	                'loadImages', {CustomerID: $scope.info.CustomerID, ItemNo: $scope.info.ItemNo,PhaseType:"001",userID:AmApp.userID},
	                function (data, status) {
	                	console.log(data);
	                    $scope.AllData = data.array;

	                    //FileType: 01=图片，02=音频，03=视频
	                    for (var k = 0; k < $scope.AllData.length; k++) {
	                        if ($scope.AllData[k].FILE_FORMAT == 'jpg') {
	                            //添加图片
	                            var image = $scope.AllData[k];
	                            image.loading = true;
	                            $scope.imageData.push(image);
	                        } else if ($scope.AllData[k].FILE_FORMAT == 'amr') {
	                            //添加音频
	                            var radio = $scope.AllData[k];
	                            radio.loading = true;
	                            $scope.radiosData.push(radio);

	                        } else if ($scope.AllData[k].FILE_FORMAT == 'mp4') {
	                            //添加视频
	                            var video = $scope.AllData[k];
	                            video.loading = true;
	                            $scope.videosData.push(video);

	                        }
	                    }

	                    if ( $scope.AllData.length > 0) {
	                        $scope.SerialNo = data.array[0].SERIALNO;
	                        $scope.info.Describe = data.array[0].DESCRIBEDETAIL;
	                        $scope.info.Address = data.array[0].ADDRESS;
	                        if($scope.info.Address)
	                        	$scope.getAddress();
	                    }else{
	                        $scope.getAddress();
	                    }

	                    document.addEventListener('deviceready', function () {

	                        //下载时会出现异步现象，先执行循环，再执行download函数
	                        for (var i = 0; i < $scope.imageData.length; i++) {
	                            (function (i) {
	                            	var url = AmApp.config.ServiceRealRootPath + "/AttachView?FullPath=" + $scope.imageData[i].URL+"rfmobilepad"
	                                +$scope.imageData[i].OBJECTNO+"rfmobilepad"+$scope.imageData[i].BUSI_FILE_TYPE+"rfmobilepad"+$scope.imageData[i].FILE_FORMAT+"rfmobilepad"+$scope.imageData[i].FILENAME;
	                                var targetPath = cordova.file.cacheDirectory + $scope.imageData[i].FILENAME+"."+$scope.imageData[i].FILE_FORMAT;
	                                var trustHosts = true;
	                                var options = {};

	                                $cordovaFileTransfer.download(url, targetPath, options, trustHosts)
	                                    .then(function (result) {
	                                        // Success!
	                                        var image = {};
	                                        image.src = result.nativeURL;
	                                        image.isSelected = false;
	                                        image.name = result.name;
	                                        $scope.images.push(image);

	                                        $scope.imageData[i].loading = false;

	                                    }, function (err) {
	                                        // Error
	                                        appIonicLoading.show({template: '加载失败！code：' + err.code, duration: 2000});
	                                    }, function (progress) {
	                                        $timeout(function () {
	                                            $scope.downloadImageProgress = (progress.loaded / progress.total) * 100;
	                                        }, 500);
	                                    });
	                            })(i);

	                        }

	                      //下载音频
	                        for (var i = 0; i < $scope.radiosData.length; i++) {

	                            (function (i) {
	                            	var url = AmApp.config.ServiceRealRootPath + "/AttachView?FullPath=" + $scope.radiosData[i].URL+"rfmobilepad"
	                                +$scope.radiosData[i].OBJECTNO+"rfmobilepad"+$scope.radiosData[i].BUSI_FILE_TYPE+"rfmobilepad"+$scope.radiosData[i].FILE_FORMAT+"rfmobilepad"+$scope.radiosData[i].FILENAME;
	                                var targetPath = cordova.file.cacheDirectory + $scope.radiosData[i].FILENAME+"."+$scope.radiosData[i].FILE_FORMAT;
	                                var trustHosts = true;
	                                var options = {};

	                                $cordovaFileTransfer.download(url, targetPath, options, trustHosts)
	                                    .then(function (result) {
	                                        // Success!
	                                        var radio = {};
	                                        radio.src = result.nativeURL;
	                                        radio.isSelected = false;
	                                        radio.name = result.name;
	                                        $scope.radios.push(radio);

	                                        $scope.radiosData[i].loading = false;

	                                    }, function (err) {
	                                        // Error
	                                        appIonicLoading.show({template: '加载失败！code：' + err.code, duration: 2000});
	                                    }, function (progress) {
	                                        $timeout(function () {
	                                            $scope.downloadAudioProgress = (progress.loaded / progress.total) * 100;
	                                        }, 500);
	                                    });
	                            })(i);

	                        }

	                        //下载视频
	                        for (var i = 0; i < $scope.videosData.length; i++) {

	                            (function (i) {
	                            	var url = AmApp.config.ServiceRealRootPath + "/AttachView?FullPath=" + $scope.videosData[i].URL+"rfmobilepad"
	                                +$scope.videosData[i].OBJECTNO+"rfmobilepad"+$scope.videosData[i].BUSI_FILE_TYPE+"rfmobilepad"+$scope.videosData[i].FILE_FORMAT+"rfmobilepad"+$scope.videosData[i].FILENAME;
	                                var targetPath = cordova.file.cacheDirectory + $scope.videosData[i].FILENAME+"."+$scope.videosData[i].FILE_FORMAT;
	                                var trustHosts = true;
	                                var options = {};

	                                $cordovaFileTransfer.download(url, targetPath, options, trustHosts)
	                                    .then(function (result) {
	                                        // Success!

	                                        var video = {};
	                                        video.src = result.nativeURL;
	                                        video.isSelected = false;
	                                        video.name = result.name;
	                                        $scope.videos.push(video);

	                                        $scope.videosData[i].loading = false;

	                                    }, function (err) {
	                                        // Error
	                                        appIonicLoading.show({template: '加载失败！code：' + err.code, duration: 2000});
	                                    }, function (progress) {
	                                        $timeout(function () {
	                                            $scope.downloadVideoProgress = (progress.loaded / progress.total) * 100;
	                                        }, 500);
	                                    });
	                            })(i);

	                        }
	                    }, false);
	                })*/
			
			
			}

	})
   