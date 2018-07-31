/**
 * Created by yyma on 2018年1月02日
 */
angular
    .module('com.amarsoft.mobile.controllers.query.Internetquery', [])
	.controller('InternetqueryController',function ($scope,$rootScope,$list,$detail,$model,$db_operate,$filter,$ionicModal,$ionicLoading,$group,$ionicPopup,$timeout) {
		$scope.param = {
			pageSize : 12,
			pageNo : 1,
			groupId : "internetQueryContractList",
			className : "com.amarsoft.app.als.mobile.impl.query.QuickQueryImpl",
			methodName : "InternetQueryList",
			menuTitle : "联网查询",
			flag : true
		};
		$model.init($scope);
		$list.load($scope,$scope.param);
		$detail.load($scope);

		//设置列表参数
		$scope.setListParam = function(data){
			if($scope.selectedMenuItem["ColId"] !== "undefined" &&
					typeof($scope.selectedMenuItem["ColId"]) !== "undefined"){
				data["Status"] = $scope.selectedMenuItem["ColId"];
				if($scope.selectedMenuItem["ColId"]==="10"){ //新增查询
					data["ReturnValue"]="";
				}else if($scope.selectedMenuItem["ColId"]==="20"){ //成功查询
					data["ReturnValue"]="000000";
				}else{//失败查询
					data["ReturnValue"]="999999";
				}
				data["UserID"] = AmApp.userID;
			}
		};
		//设置详情页面参数
		$scope.setDetailParam = function(modelInfo,detailParam){
			var selectedListItem = $scope.getSelectedListItem();
    	   if(typeof($scope.selectedListItem) !== "undefined"){
    		   if(typeof(modelInfo["Action"]) === "undefined" ||
				   modelInfo["Action"] === "" ||
				   modelInfo["Action"] === null){
    			   detailParam["url"] = "InternetQueryInfo";
			   }else{
				   detailParam["url"] = modelInfo["Action"];
			   }
    	   }
    	   if(modelInfo.ColId=="2010" || modelInfo.ColId=="3010"){
    		   detailParam["queryData"]["readonly"] = "true";
    	   }
    	   detailParam["queryData"]["ReturnType"] = "Info";
    	   detailParam["queryData"]["modelNo"] = "NetworkVerifyInfo";
    	   if(typeof(selectedListItem) !== "undefined" && selectedListItem!=="" ){
        	   detailParam["queryData"]["SerialNo"] = selectedListItem.SerialNo;
    	   }

		};
        //新增与保存
		$scope.saveModelFlag = "update";
        $scope.saveModel = function(){
            $scope.goDetailTopFlag = false;
            if($scope.saveModelFlag === "insert"){
            	var BranchName = $scope.detailListInfo.BranchName;
            	if(BranchName == undefined || typeof(BranchName) == "undefined" || BranchName == ""){
                    $ionicLoading.show({
                        title : "业务处理",
                        template : "请选择机构名称！",
                        duration : 1500
                    });
            		return;
				}
            	if($scope.detailListInfo.ReqCardName == ""){
                    $ionicLoading.show({
                        title : "业务处理",
                        template : "请重新输入姓名！",
                        duration : 1500
                    });
            		return;
				}
            	var certID = $scope.detailListInfo.ReqCardNo;
            	if(!IdentityCodeValid(certID)){
                    $ionicLoading.show({
                        title : "业务处理",
                        template : "身份证输入错误！",
                        duration : 1500
                    });
            		return;
				}
                var paramData;
                paramData = $scope.getModelNoReadOnlyData(true);
                paramData["SerialNo"] = $scope.detailListInfo.SerialNo;
                paramData["InputUserID"]= AmApp.userID;
                paramData["InputOrgID"]=AmApp.orgID;
                paramData["ReturnCode"]="";
                paramData["InputDate"]=$filter('date')(new Date(),"yyyy/MM/dd");
                paramData["UpdateDate"]=$filter('date')(new Date(),"yyyy/MM/dd");
                paramData["BranchID"]=$scope.detailListInfo.BranchID;
                paramData["BranchName"]=$scope.detailListInfo.BranchName;
                paramData["BussKind"]=$scope.detailListInfo.BussKind;
                paramData["ReqCardNo"]=$scope.detailListInfo.ReqCardNo;
                paramData["ReqCardName"]=$scope.detailListInfo.ReqCardName;
                //执行新增操作（成功后，页面刷新；新增数据会展示在list页面顶端）
                $db_operate.insertRecord($scope,"0012",paramData);
                $scope.saveModelFlag = "update";
                $scope.chooseDetailFlag = false;
                $scope.modal.remove();
            }else if($scope.saveModelFlag === "update"){
            	var certID = $scope.detailInfo.ReqCardNo;
            	if(!IdentityCodeValid(certID)){
                    $ionicLoading.show({
                        title : "业务处理",
                        template : "身份证输入错误！",
                        duration : 1500
                    });
            		return;
				}
                var paramData;
                paramData = $scope.getModelNoReadOnlyData();
                paramData["UpdateDate"]=$filter('date')(new Date(),"yyyy/MM/dd");
                paramData["BranchID"]=$scope.detailInfo.BranchID;
                paramData["BranchName"]=$scope.detailInfo.BranchName;
                paramData["BussKind"]=$scope.detailInfo.BussKind;
                paramData["ReqCardNo"]=$scope.detailInfo.ReqCardNo;
                paramData["ReqCardName"]=$scope.detailInfo.ReqCardName;
                //获取list页面顶端的新增数据的主键
                paramData["SerialNo"] = $scope.selectedListItem["SerialNo"];
                //执行更新操作
                $db_operate.updateRecord($scope,"0012",paramData);
            }
        };

		//点击新增按钮，跳出新增模态框
		$scope.insertRecord = function(){
			$scope.saveModelFlag ="insert";
			$scope.chooseDetail({},null,true);
			//设置业务关联流水号
			$scope.setSerialNo = function(serialNo){
				$scope.detailListInfo["SerialNo"] = serialNo;
			};
			//设置模态详情页面所需参数
			$scope.setDetailModalQueryParam = function(modal,detailModalQueryParam){
				detailModalQueryParam["queryData"]["modelNo"] = "NetworkVerifyInfo";
				detailModalQueryParam["queryData"]["ReturnType"] = "Info";
			};

			//执行新增操作（成功后，页面刷新；新增数据会展示在list页面顶端）
			$scope.toListDetailAfter = function(){
				$scope.getSerialNo("NETWORK_VERIFY","SerialNo");
				var branch = $group.RunMethod("公用方法","GetColValue","ARGUMENT_LIBRARY,Value1,CodeNo = 'NetWorkVerifyDefaultOrg' and ItemNo = '" + AmApp.orgID + "'");
				if(typeof(branch) !== "undefined" && branch !== "" && branch!=="Null"){
					$scope.detailListInfo["BranchID"] = branch.split("@")[0];
                    $scope.detailListInfo["BranchName"] = branch.split("@")[1];
				}
				 $scope.detailListInfo["BussKind"] ="02";//业务种类默认
				 $detail.setReadOnly($scope.listDetails,"BussKind",true);
				$detail.setVisible($scope.listDetails,"InputDate,InputOrgName,InputUserName,PhotoPath," +
						"RespCardIssueOrg,RespCardName,RespCardNo,RespCheckResult,ReturnCode,ReturnMsg,SendTime,UpdateDate",false);
			};
			
			$scope.modalCancel = function() {
				$scope.saveModelFlag ="update";
				$scope.chooseDetailFlag = false;
	            $scope.modal.remove();
			}
		};
		//删除
		$scope.deleteRecord = function(){
			if($scope.selectedListItem === undefined
				|| typeof ($scope.selectedListItem["SerialNo"]) === "undefined"
				|| $scope.selectedListItem["SerialNo"].length === 0){
				$ionicLoading.show({
					title : "业务处理",
					template : "请选择一条记录！",
					duration : 1500
				});
			}else{
				var serialNo = $scope.selectedListItem["SerialNo"];
				$ionicPopup.confirm({
					title : "操作提示",
					template : "您确定要删除该记录吗？",
					okText : "确定",
					cancelText : "取消"
				}).then(function (res){
				    if(res){
				        $db_operate.deleteRecord($scope,"","0012",$scope.detailInfo);
                    }
                });
				$timeout(function(){
				   $scope.refresh();
                },2000);
			}
		};
		$scope.executeTrans = function(){
			$scope.goDetailTopFlag = false;
    		$scope.$broadcast("executeTrans",$scope.detailInfo);
		};
		 //基本信息修改页面点选查询当前客户经理下所有用户
        $scope.SelectBranch = function(uiGridParam){
    		uiGridParam["SelName"] = "SelectBranch";
    		uiGridParam["SelFieldId"] = "OrgID,OrgName,BankID,OrgLevelName";
    		uiGridParam["SelFieldName"] = "机构号,机构名,人行金融机构代码,机构网点";
    		uiGridParam["ParamId"] = "OrgID";
    		uiGridParam["ParamValue"] = AmApp.orgID;
    		$scope.doClickSure = function(){
    		    if(typeof($scope.chooseDetailFlag) === "undefined" || !$scope.chooseDetailFlag) {
                    $scope.detailInfo.BranchID = $scope.UIGridSelectedRow["BankID"];
                    $scope.detailInfo.BranchName = $scope.UIGridSelectedRow["OrgName"];
                }else if($scope.chooseDetailFlag){
                    $scope.detailListInfo.BranchID = $scope.UIGridSelectedRow["BankID"];
                    $scope.detailListInfo.BranchName = $scope.UIGridSelectedRow["OrgName"];
                }
    		}
		};
		$scope.$on("executeTrans",function(e, data){
			$scope.detailInfo.SerialNo=$scope.selectedListItem["SerialNo"];			 
			var transParams = "H00001,1,"+$scope.detailInfo.SerialNo+","+AmApp.orgID+",END";
			var returnValue=$group.RunMethod("PublicMethod", "RealTimeInterface", transParams);
			if(!(typeof(returnValue) === "undefined" || returnValue === "" || returnValue.length === 0)) {
                var aReturn = returnValue.split("@");
                if (typeof(aReturn[0]) !== "undefined" && aReturn[0].length !== 0) {
                    if (aReturn[0] === "000000") {
                        $ionicLoading.show({
                            title: "操作提示",
                            template: aReturn[1],
                            duration: 3500
                        });
                        $timeout(function(){
            				$scope.refresh();
                         },3500);
                    }else{
                    	$ionicLoading.show({
                            title: "操作提示",
                            template: "执行失败",
                            duration: 3500
                        });
                        $timeout(function(){
            				$scope.refresh();
                         },3500);
                    }
                } else {
                    $ionicLoading.show({
                        title: "操作提示",
                        template: "执行失败",
                        duration: 3500
                    });
                    $timeout(function(){
        				$scope.refresh();
                     },3500);
                }
            }
            
		});
	});
