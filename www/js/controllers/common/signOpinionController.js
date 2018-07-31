/**
 * 签署意见并提交controller
 * Created by cwxu on 2017年10月12日 
 */
angular
    .module('com.amarsoft.mobile.controllers.common.signOpinionController', ['ui.grid','ui.grid.selection','ui.grid.resizeColumns','ui.grid.autoResize'])
	.controller('signOpinionController',function ($TemplatePart,$scope,$http,basePage,$ionicLoading, $state,$ionicPopup,$timeout,$filter,$db_operate,$rootScope) {
		//当前阶段的流程号
		 $scope.ftSerialNo = "";
		//展示的基本信息        
		$scope.$on('go-SignOpinionController',function(e,data){
//		$scope = data.$scope;
			$scope.SerialNo = data.SerialNo;
			$scope.ftSerialNo=data.FTSerialNo;
			$scope.ObjectType = data.ObjectType;
			$scope.FTSerialNo = data.FTSerialNo;//add by ylmeng
			if($scope.ObjectType=="CreditApply"){
				$scope.ObjectNo = data.ObjectNo;
			}
			$scope.FlowNo = data.FlowNo;
			$scope.PhaseNo = data.PhaseNo;
			$scope.PhaseName = data.PhaseName;
			$scope.ApplyType = data.ApplyType;
			$scope.OccurType = data.OccurType;
			//签署意见和提交页面控制变量
			$scope.nextActionShowFlag = false;
			basePage.init($scope, loadData);
		});
		var loadData = function ($ionicLoading) {
			runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
				"selectApplyAndOpinionInfo", {
					SerialNo: $scope.SerialNo,
					ObjectType: $scope.ObjectType,
					FlowNo:$scope.FlowNo,
					ApplyType:$scope.ApplyType,
					PhaseNo:$scope.PhaseNo,
					ObjectNo:$scope.ObjectNo,
					OccurType:$scope.OccurType,
					FTSerialNo:$scope.FTSerialNo//add by ylmeng
				}, function (data, status) {
					if(data.Result != 'N'){
						$scope.opinionInfos = data;
						if($scope.opinionInfos.keyInfoArray.length == 0){		//如果从服务端未获取展示的数据，则使用默认展示
							var dataList = [
									{KeyName:"登记机构",Value:AmApp.orgName},
									{KeyName:"登记人",Value:AmApp.userName},
									{KeyName:"登记日期",Value:$filter('date')(new Date(),"yyyy/MM/dd")}
								]
							$scope.opinionInfos.keyInfoArray = dataList;	//将默认展示参数赋给$scope展示对象中；
						} else {
							$scope.OpinionNo = data.opinionNo;//add by ylmeng
							$scope.setTempletParam = function(templetParam){
								templetParam["ObjectType"] = "jbo.app.FLOW_OPINION";
								templetParam["ObjectNo"] = $scope.OpinionNo;
							};
							$scope.details1 = [];
							$scope.detailCheck1 = {};
							$scope.detailInfo1 = {};
							$scope.detailDataParam1 = {};
							$scope.detailInfoNoUpdate1 = {};
							var LoanRateTermReadOnly = false;//利率组件是否只读标识
							var RpTermReadOnly = false;//还款组件是否只读标识
							var loadFlag = false;//是否调用利率、还款组件的生成方法

							for (var i = 0; i < data.keyInfoArray[0]['array'].length; i++){
								if(data.keyInfoArray[0]['array'][i].groupName == "利率信息" || data.keyInfoArray[0]['array'][i].groupName == "还款方式"){
									if(data.keyInfoArray[0]['array'][i].groupColArray[0].ItemValue != ""){
										$scope.details1.push(data.keyInfoArray[0]['array'][i]);
										loadFlag = true;
									}
								}else{
									$scope.details1.push(data.keyInfoArray[0]['array'][i]);
								}
							}
							//$scope.details1 = data.keyInfoArray[0]['array'];

							for (var i = 0; i < data.keyInfoArray[0]['array'].length; i++) {
								//增加参数，是否展示，页面载入时均展示
								data.keyInfoArray[0]['array'][i]['showGroup'] = true;
								//获取模版json中的groupColArray的数据，按照json格式中的 <KeyId：Value>存放到$scope.marketInfo中做绑定并用于页面展示
								$scope.groupColArray = data.keyInfoArray[0]['array'][i].groupColArray;
								var size = 0;
								if($scope.groupColArray !== "undefined" &&
										typeof($scope.groupColArray) !== "undefined"){
									for(var j = 0; j < $scope.groupColArray.length;j++){
										if($scope.groupColArray[j]["KeyId"] === "LoanRateTermID"){
											LoanRateTermReadOnly  = $scope.groupColArray[j].ReadOnly;
										}
										if($scope.groupColArray[j]["KeyId"] === "RPTTermID"){
											RpTermReadOnly  = $scope.groupColArray[j].ReadOnly;
										}
										if($scope.groupColArray[j].ColRequired === "1"){
											$scope.detailCheck1[$scope.groupColArray[j].KeyId] = false;
										}
										if($scope.groupColArray[j].ColUpdateable == '1'){
											if((!$scope.groupColArray[j].ReadOnly && !$scope.groupColArray[j].Hide)
													|| $scope.groupColArray[j]["KeyId"] === "SerialNo"
													|| $scope.groupColArray[j]["KeyId"] === "BPSerialNo"
													|| $scope.groupColArray[j]["KeyId"] === "ObjectNo"
													|| $scope.groupColArray[j]["KeyId"] === "RelativeSerialNo"
													|| $scope.groupColArray[j]["KeyId"] === "InputUserID"
													|| $scope.groupColArray[j]["KeyId"] === "InputUserOrgID"
													|| $scope.groupColArray[j]["KeyId"] === "UpdateUserID"
													|| $scope.groupColArray[j]["KeyId"] === "UpdateUserOrgID"){
												$scope.detailDataParam1[$scope.groupColArray[j].KeyId] = $scope.groupColArray[j].Value;
											}
											if($scope.groupColArray[j].ColCheckFormat === "3"){
												var value = $scope.groupColArray[j].Value;
												value = (new Date(value)).format("yyyy-MM-dd");
												$scope.detailInfo1[$scope.groupColArray[j].KeyId] = new Date(value);
											}else{
												if($scope.groupColArray[j]["Remark"] !== "codeName"){
													$scope.detailInfo1[$scope.groupColArray[j].KeyId] = $scope.groupColArray[j].Value;
												}
											}
										} else {
											$scope.detailInfoNoUpdate1[$scope.groupColArray[j].KeyId] = $scope.groupColArray[j].Value;
										}
										if(!$scope.groupColArray[j].Hide){
											size += 1;
										}
										if(loadFlag){
											if($scope.groupColArray[j]["KeyId"] === "LoanRateTermID"){
												$scope.doAction("LoanRateTermID","RatePart");
											}
											if($scope.groupColArray[j]["KeyId"] === "RPTTermID"){
												$scope.doAction("RPTTermID","RPTPart");
											}
										}

									}
								}
								$scope.details[i]["size"] = size;
							}
							//console.log("+++++++++$scope.details:"+$scope.details.length);
							/*
							 * hzhang   start 先注释掉，暂不知有什么用，也无发现有什么影响
							 * */
							/*for (var i = 0; i < data.keyInfoArray[1]['array'].length; i++) {
								$scope[data.keyInfoArray[1]['array'][i].KeyId] = data.keyInfoArray[1]['array'][i].CodeArray;
							}
							$scope.TemplateParkParam = [];
							$scope.TemplateParkParam[0] = data.opinionNo;

							$scope.TemplateParkParam[1] = "jbo.app.FLOW_OPINION";
							$scope.setTempletParam($scope.TemplateParkParam);*/
							/*
							 * hzhang   end
							 * */

							/*
							 * 注掉后不报错也不影响功能，是否有其他用途待确认，*******************
							 */
//				        			$TemplatePart.findTemplet($scope,false,$scope.detailInfo1[objID],groupID,false,"Frame",LoanRateTermReadOnly,RpTermReadOnly);
						}
						//$scope.ftSerialNo = data.ftSerialNo;

					}
				});
		};
		//选择组件
		$scope.doAction = function(objID,groupID){
			$TemplatePart.findTemplet($scope,$scope.details1,$scope.detailInfo1,$scope.detailInfo1[objID],groupID,true,false,false);
		}
	            //期限失焦后改变
        $scope.reloadRateSegment = function() {
            var packFlag = "RatePartFrame";
            $scope.packObj[packFlag] = {};
            $scope.packItems[packFlag] = [];
            $scope.detailInfo1["LoanRateTermID"] = "";
        };
	            
	            //保存意见
		$scope.saveOpinion = function () {
			runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
				"saveOpinion", {
					ftSerialNo: $scope.ftSerialNo,
					objectNo: $scope.SerialNo,
					objectType: $scope.ObjectType,
					phaseOpinion: $scope.opinionInfos.opinionDetail
				}, function (data, status) {
					if (data.OperationMsg == 'SUCCESS') {
						appIonicLoading.show({
							template: '保存意见成功',
							animation: 'fade-in',
							showBackdrop: true,
							duration: 500
						});
					} else {
						appIonicLoading.show({
							template: '保存意见失败,请与系统管理员联系!',
							animation: 'fade-in',
							showBackdrop: true,
							duration: 1000
						});
						return false;
					}
				});
		};
	            
	               //提交
		$scope.gotoCheckSelect = function () {
			var data={};
			if(typeof($scope.detailInfo1)!="undefined"){
				if(typeof($scope.detailInfo1.PhaseOpinion)!="undefined"){
					if($scope.detailInfo1.PhaseOpinion!=""){
						if(typeof($scope.opinionInfos.opinionDetail)!="undefined"){
							$scope.opinionInfos.opinionDetail = $scope.detailInfo1.PhaseOpinion;
						}
					}
				}
			}
  	/*if((typeof($scope.opinionInfos.opinionDetail)!="undefined" 
  		&& $scope.opinionInfos.opinionDetail!="") 
  		|| (typeof($scope.detailInfo1.PhaseOpinion)!="undefined" && $scope.detailInfo1.PhaseOpinion!=""))*/
			if((typeof($scope.opinionInfos.opinionDetail)!="undefined"
				&& $scope.opinionInfos.opinionDetail!="")){//校验是否签署意见
				if(typeof($scope.ObjectType)!="undefined" && $scope.ObjectType !=""){
					if($scope.ObjectType!="CreditApply"){
						data["OperateFlag"]=true;
						data["SerialNo"]=$scope.ftSerialNo;
						data["PhaseOpinion"]=$scope.opinionInfos.opinionDetail;
						data["OpinionNo"] =$scope.opinionInfos.opinionNo;	//modify by ylmeng
						data["ObjectNo"]=$scope.SerialNo;
						data["UpdateTime"]=$filter('date')(new Date(),"yyyy/MM/dd");
						data["InputTime"]=$filter('date')(new Date(),"yyyy/MM/dd");
						data["UpdateUser"]=  AmApp.userID;
						data["INPUTUSER"] =  AmApp.userID;
						data["InputOrg"] =  AmApp.orgID;
						//设置业务关联流水号
						data["ObjectType"]=$scope.ObjectType;
						//data["PrimaryKey"]="SerialNo,OpinionNo";	//add by ylmeng
						data["PrimaryKey"]="OpinionNo";//表的主键
					}else {
						if($scope.detailInfo1){
							var BusinessSum = null;
							var ApplyBusinessSum = null;
							/*
							 * 循环遍历校验
							 * */
             				if(!$scope.checkDataCompleted($scope.details1,$scope.detailInfo1,$scope.detailInfoNoUpdate1,$scope.detailCheck1)) return;
							var Array = $scope.opinionInfos.keyInfoArray[0].array[0].groupColArray;
							if(Array != undefined){
								for(var i=0;i<Array.length;i++){
									var dic = Array[i];
									if(dic.KeyId == "ApplyBusinessSum"){
										ApplyBusinessSum = parseFloat(dic.Value);
									}
									if(!dic.Hide && !dic.ReadOnly && dic.ColUpdateable == "1"){
										//可显示的、可修改的、可提交的
										var valid = validData(dic);//进行校验
										if(valid == false){
											return false;
										}
									}
								}
							}

							BusinessSum = parseFloat($scope.detailInfo1.BusinessSum.replace(/,/g,''));
							if(BusinessSum > ApplyBusinessSum){
								str = '批复金额不能大于申请金额';
								loadingFunction(str);
								return false;
							}
							data["BusinessSum"]=$scope.detailInfo1.BusinessSum;
							data["BusinessCurrency"]=$scope.detailInfo1.BusinessCurrency;
							data["LoanRateTermID"]=$scope.detailInfo1.LoanRateTermID;
							data["ObjectNo"]=$scope.detailInfo1.ObjectNo;
							data["OpinionNo"]=$scope.detailInfo1.OpinionNo;
							data["ObjectType"]=$scope.detailInfo1.ObjectType;
							data["OtherAppoint"]=$scope.detailInfo1.OtherAppoint;
							data["PhaseOpinion"]=$scope.detailInfo1.PhaseOpinion;
							data["RPTTermID"]=$scope.detailInfo1.RPTTermID;
							data["RateCalTerm"]=$scope.detailInfo1.RateCalTerm;
							data["RepriceType"]=$scope.detailInfo1.RepriceType;
							data["SerialNo"]=$scope.detailInfo1.SerialNo;
							data["UpdateTime"]=$filter('date')(new Date(),"yyyy/MM/dd");
							//data["UpdateUser"]=$scope.detailInfo1.UpdateTime;//?
							data["UpdateUser"]=$scope.detailInfo1.UpdateUser;
							data["OperateFlag"]=true;
							//data["PrimaryKey"]="SerialNo,OpinionNo";
							data["PrimaryKey"]="OpinionNo";//表的主键
							if($scope.detailInfo1.TermMonth!=""){
								var TermMonth = parseInt($scope.detailInfo1.TermMonth);
								var ApplyTermMonth = parseInt($rootScope.TermMonth);
								if(TermMonth > ApplyTermMonth){
									str = '批复期限不能大于申请期限';
									loadingFunction(str);
									return false;
								}
								data["TermMonth"]=$scope.detailInfo1.TermMonth;
							}

							/*
							 * 添加  票据最长期限、保证金金额、保证金比例、保证金放大倍数，以供修改更新
							 * */
							if($scope.detailInfo1.TermDay!=""){
								data["TermDay"]=$scope.detailInfo1.TermDay;
							}
							if($scope.detailInfo1.BailSum!=""){
								data["BailSum"]=$scope.detailInfo1.BailSum;
							}
							if($scope.detailInfo1.BailRatio!=""){
								data["BailRatio"]=$scope.detailInfo1.BailRatio;
								var BailRatio = parseFloat($scope.detailInfo1.BailRatio)/100;
								data["BailSum"] = BusinessSum * BailRatio;
							}
							if($scope.detailInfo1.Enlarge!=""){
								data["Enlarge"]=$scope.detailInfo1.Enlarge;
							}
						}else{
							data["PhaseOpinion"]=$scope.opinionInfos.opinionDetail;
							data["OpinionNo"]=$scope.opinionInfos.opinionNo;
							data["SerialNo"]=$scope.opinionInfos.ftSerialNo;
							data["UpdateTime"]=$filter('date')(new Date(),"yyyy/MM/dd");
							data["UpdateUser"]=AmApp.userID;
							data["OperateFlag"]=true;
							//data["PrimaryKey"]="SerialNo,OpinionNo";
							data["PrimaryKey"]="OpinionNo";//表的主键
						}
					}
				}


				//执行更新操作
				$db_operate.updateRecord($scope,"0015",data).then(function(status){
					if($scope.detailInfo1){
						$db_operate.updateRateSegment($scope,"RatePartFrame");
						  $db_operate.updateRPTSegment($scope,"RatePartFrame");
					}
					runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
						"checkTaskCommitedOrNot", {ftSerialNo: $scope.ftSerialNo}, function (data, status) {
						if (data.OperationMsg == 'Y') {
							appIonicLoading.show({
								template: '该笔申请已提交,请勿重复提交',
								animation: 'fade-in',
								showBackdrop: true,
								duration: 600
							});
							return false;
						} else {
							$timeout(function(){
								$scope.$broadcast('to-nextActionController', {
									$scope : $scope,
									FTSerialNo: $scope.ftSerialNo,
									objectNo: $scope.ObjectType=="CreditApply"? $scope.ObjectNo :$scope.SerialNo,
									objectType: $scope.ObjectType,
									PhaseName: $scope.PhaseName,
									PhaseNo:$scope.PhaseNo,
									ApplyType:$scope.ApplyType
								});
							},500)
						}
					});
				});
			}else {
				data["OperateFlag"]=false;
				//执行更新操作
				$db_operate.updateRecord($scope,"0015",data).then(function(status){
      		if($scope.detailInfo1){
      			$db_operate.updateRateSegment($scope,"RatePartFrame");
                    $db_operate.updateRPTSegment($scope,"RatePartFrame");
      		}
				});
			}

		};
	            
	            //验证方法
		var validData = function(dic){
			var value = null;
			var string = dic.KeyId;
			var str = null;
			value = $scope.detailInfo1[string];
			if(dic.ColCheckFormat == "1"){//为 code 选择，或是填写的意见
				if(value == "" || value == undefined){
					if(dic.ColRequired == "1"){//带有红星号的必填项
						if(dic.ColEditSourceType == "Code"){//code 选择
							str = '请进行'+dic.KeyName+'的选择';
						}else{//填写的意见
							str = '请填写'+dic.KeyName;
						}
						loadingFunction(str);
						return false;
					}
				}
			}else if(dic.ColCheckFormat == "2"){//金额与比例
				value = parseFloat(value);
				if(numValid1(value)){
					if(dic.KeyName.indexOf("%") != -1){//比例
						if(value < 0 || value > 100){
							str = '填写的'+dic.KeyName+'必须要在 0~100 之间';
							loadingFunction(str);
							return false;
						}
					}else{//金额
						if(value <= 0){
							str = '填写的'+dic.KeyName+'不能小于等于0';
							loadingFunction(str);
							return false;
						}
					}
				}else{
					str = '填写的'+dic.KeyName+'必须是非负数字';
					loadingFunction(str);
					return false;
				}
			}else if(dic.ColCheckFormat == "5"){//期限
				if(!numValid2(value)){
					str = '填写的'+dic.KeyName+'必须是正整数';
					loadingFunction(str);
					return false;
				}else{
					value = parseInt(value);
					if(dic.KeyName.indexOf("票据") != -1){
						if(value > 184){
							str = '填写的'+dic.KeyName+'必须小于等于 184 天';
							loadingFunction(str);
							return false;
						}
					}
				}
			}
			return true;
		};
	            
		var loadingFunction = function(string){
			appIonicLoading.show({
				template: string,
				animation: 'fade-in',
				showBackdrop: true,
				duration: 2000
			});
		};
		//非负数正则判断
		var numValid1 = function(value){
			var reg = /^\d+(\.{0,1}\d+){0,1}$/;
			if(reg.test(value)){
				return true;
			}else{
				return false;
			}
		};
	  	//正整数正则判断
		var numValid2 = function(value){
			//非负整数
			//var reg = /^\d+$/;
			//var reg =  /^[1-9]\d*|0$/;
			var reg =  /^[1-9]\d*$/;//正整数判断
			if(reg.test(value)){
				return true;
			}else{
				return false;
			}
		};
	})
	  .controller('nextActionController',
        function ($scope, $rootScope,$filter, $state, $http, $timeout, $ionicPopup, $ionicLoading, basePage,$group) {
            $scope.$on('to-nextActionController', function (e, data) {
            	$scope.$parentScope = data.$scope;
                $scope.items = [];
                $scope.ftSerialNo = data.FTSerialNo;
                $scope.objectNo = data.objectNo;
                $scope.ObjectType = data.objectType;
                $scope.PhaseName = data.PhaseName;
                $scope.PhaseNo = data.PhaseNo;
                $scope.ApplyType = data.ApplyType;
                if(typeof($scope.$parentScope["submitApplyCheck"]) !== "function" && typeof($scope.$parentScope["submitApproveCheck"]) !== "function")
                    basePage.init($scope, loadData);
                else if(typeof($scope.$parentScope["submitApplyCheck"]) === "function" && typeof($scope.$parentScope["submitApproveCheck"]) !== "function"){
                    $scope.$parentScope.submitApplyCheck().then(function(checkResult){
                        if(checkResult)
                            basePage.init($scope, loadData);
                    });
				}else if(typeof($scope.$parentScope["submitApplyCheck"]) !== "function" && typeof($scope.$parentScope["submitApproveCheck"]) === "function"){
                    $scope.$parentScope.submitApproveCheck().then(function(checkResult){
                        if(checkResult){
                            var phaseNo = $group.RunMethod("WorkFlowEngine","GetPhaseNo",$scope.ObjectType + "," + $scope.objectNo);
                            //存在自动审批
                            if((phaseNo === "1000" || phaseNo === "8000") && $scope.ObjectType === "CreditApply"){
                                $scope.modal.remove();
                                $scope.$parentScope.selectTab('0');
                            }else
                            	basePage.init($scope, loadData);
						}
                    });
                }
            });
            //控制动作列表展示
            $scope.showNextPhaseAction = false;
            //动作列表信息
            $scope.nextPhaseOpinions = []
            //控制下阶段提示信息展示
            $scope.showNextPhaseInfo = false;
            //下阶段提示信息
            $scope.nextPhaseInfo = ''; 
            //控制提示信息展示
            $scope.showWarnInfo = false;
            //提示信息
            $scope.warnInfo = '';
            
            $scope.action = {};
            //绑定意见变量
            $scope.action.choose = "";
            $scope.person = {};
            //绑定处理人变量
            $scope.person.choose = "";
            //选择动作
            var loadData = function ($ionicLoading) {
            	appIonicLoading.show({
                    template: '加载中...',
                    animation: 'fade-in',
                    showBackdrop: true,
                    duration: 20000
                });
                runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
                    "getPhaseOpinion", {
                        ftSerialNo: $scope.ftSerialNo,
                        objectNo:$scope.objectNo
                    }, function (data, status) {
                        $scope.nextPhaseOpinions = data["array"];
                        //切换页面
                        $scope.nextActionShowFlag = true;
                        if(appIonicLoading){
                        	appIonicLoading.hide();
                        }
                    }, function (error){
                    	if(appIonicLoading){
                        	appIonicLoading.hide();
                        }
                    });
            };
            //返回上一部
            $rootScope.goToSignOpinion = function () {
                $scope.nextActionShowFlag = false;
                $scope.showNextPhaseAction = false;
                $scope.nextPhaseOpinions = []
                $scope.showNextPhaseInfo = false;
                $scope.nextPhaseInfo = ''; 
                $scope.showWarnInfo = false;
                $scope.warnInfo = '';
                $scope.action.choose = "";
                $scope.person.choose = "";
            };
            //选择意见后触发的事件
            $scope.choosePhaseOpinion = function (phase) {
            	$scope.nextPhaseActions = [];
            	$scope.showNextPhaseAction = false;
            	$scope.showNextPhaseInfo = false;
            	$scope.showWarnInfo = false;
            	$scope.nextPhaseInfo = '';
            	$scope.warnInfo = '';
            	
                $scope.action.choose = phase; 
                if($scope.action.choose != ""){
                	//从$scope.nextPhaseOpinions中过滤出phaseOpinion为当前选中意见的数据
                	$scope.nextPhaseActions = $filter("filter")($scope.nextPhaseOpinions,phase,"phaseOpinion")[0];
                	if($scope.nextPhaseActions.selectlist){ //显示动作列表
                		$scope.showNextPhaseAction = true;
                		$scope.nextPhaseActions = $scope.nextPhaseActions.selectlistData
                	}
                	if($scope.nextPhaseActions.nextPaseInfo){ //显示下阶段提示信息
                		$scope.showNextPhaseInfo = true;
                		$scope.nextPhaseInfo = $scope.nextPhaseActions.nextPaseInfoData
                	}
                	if($scope.nextPhaseActions.warnInfo){ //显示提示信息
                		$scope.showWarnInfo = true;
                		$scope.warnInfo = $scope.nextPhaseActions.warnInfoData;
                	}                	
                }
            };
            // 选择动作(单选)
            $scope.chooseNextPhaseAction = function (action) {
                //取得选中的处理人信息
            	$scope.person.chooses =action;//选中按钮
                $scope.person.choose = action.substring(1).substring(0,4);              
        		if($scope.ObjectType == "PayScheduleApply"){
                    appIonicLoading.show({
                        template: '还款计划调整不可选择角色提交 ~~！',
                        animation: 'fade-in',
                        showBackdrop: true,
                        duration: 1000
                    });
        		}
        		if($scope.person.choose != ""){
        			//点击动作后，获取下阶段提示信息
        			runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
        					"SelectNextPhaseInfo", {
        				ftSerialNo: $scope.ftSerialNo,
        				PhaseAction:$scope.person.choose,
        				PhaseOpinion:$scope.action.choose
        			}, function (data, status) {
        				$scope.nextPhaseInfo = data["data"].value;
        				$scope.showNextPhaseInfo = true;        				
        			});        			
        		}
        		
            };
            // add by yyma 重写放弃方法，主要是删除Flow_Opinion在填写签署意见时新增的数据，原因：在填写签署意见时，只知道Flow_Opinion的主键SerialNo,
            //而不知道另一主键OpinionNo，如果选择放弃提交操作，删除Flow_Opinion表在签署意见时新增的数据，防止一个下次对同一条数据局再签署意见时，出现确实主键OpinionNO的错误
            $scope.hideModal1 = function () {
            	//先delete 数据
            	if($scope.ObjectType!="CreditApply"){
//            		runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
//      		            	"OperateContract", {
//    		            	SerialNo : $scope.ftSerialNo,
//    		            	ObjectType:$scope.ObjectType,
//    		            	UserId :  AmApp.userID,
//    		            	type:"DeleteFlowOpinion"
//    			        	}, function (data, status) {	  		            	
//    		              });
            	}                	            	 
	            $scope.modal.remove();
	        }
            //@TODO，校验不能提交给自己
            $scope.submitApply = function () {
            	if($scope.action.choose == undefined || $scope.action.choose == ''){
            		 $ionicLoading.show({
                         template: '请选择要提交的动作',
                         duration: 1000
                     });
                     return false;
            	}
                if (($scope.person.choose == undefined || $scope.person.choose == '')&&$scope.showNextPhaseAction) {
                    $ionicLoading.show({
                        template: '请选择下一阶段处理人',
                        duration: 1000
                    });
                    return false;
                }
                //校验不能提交给自己
                if($scope.showNextPhaseAction && $scope.person.chooses.indexOf($rootScope.userName) != -1){
                	$ionicLoading.show({
                        template: '下一阶段处理人不能选择自己',
                        duration: 1000
                    });
                    return false;
                }
                if($scope.action.choose === "退回上一步"){
                	runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
        					"SendBackAction", {
        				ftSerialNo: $scope.ftSerialNo,
        				PhaseOpinion:$scope.action.choose
        			}, function (data, status) {
        				$scope.person.choose = data["data"].value;
        			});  
                }
                //再次校验是否已经提交
                runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
                    "checkTaskCommitedOrNot", {
                        ftSerialNo: $scope.ftSerialNo
                    }, function (data, status) {
                        if (data.OperationMsg == 'Y') {
                            $ionicLoading.show({
                                template: '该笔业务已提交,请勿重复提交!',
                                duration: 1000
                            });
                            return false;
                        } else {
                            var confirmPopup = $ionicPopup.confirm({
                                title: '业务处理',
                                template: '<p align="center">你确定提交么？</p>',
                                okText: '确定',
                                cancelText: '取消'
                            });
                            confirmPopup.then(function (res) {
                                if (res) {
                                	if ($scope.opinionInfos.opinionDetail == '') {
                	                    appIonicLoading.show({
                	                        template: '请签署意见',
                	                        animation: 'fade-in',
                	                        showBackdrop: true,
                	                        duration: 1000
                	                    });
                	                    return false;
                	                } else {
		                                runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
		                                    "opinionSubmit", {
		                                        FTSerialNo: $scope.ftSerialNo,
		                        				PhaseAction:$scope.person.choose,
		                        				PhaseOpinion:$scope.action.choose,
		                        				PhaseNo:$scope.PhaseNo,
		                        				ObjectNo:$scope.objectNo,
		                        				ObjectType:$scope.ObjectType
		                                    }, function (data, status) {
		                                        if (data["OperationMsg"] != "SUCCESS") {
		                                            $ionicLoading.show({
		                                                title: "提交失败，请与系统管理员联系！",
		                                                template: data["OperationMsg"],
		                                                duration: 1000
		                                            });
		                                            return false;
		                                        } else {
		                                            $ionicLoading.show({
		                                                title: "业务处理！",
		                                                template: "提交成功!",
		                                                duration: 1000
		                                            });
		                                          //系统自动跳转到申请列表界面
//		                                            $scope.removeModal();
		                                            $scope.modal.remove();
		                                            //发出广播，用于刷新页面数据
		                                            $scope.$emit("sign-opinionRefresh");
		                                        }
		                                    });
                	                }
                                }
                            });
                        }
                    });
            };
        });
