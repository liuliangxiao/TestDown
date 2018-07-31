angular
		.module('com.amarsoft.mobile.services', [])

		.factory('basePage', function($state, $ionicLoading, $ionicHistory) {
			return {
				init : function($scope, loadData) {
					// $scope.changeState = function(name, params) {
					// $state.go(name, params);
					// };
					$scope.changeState = function(name, params) {
						$ionicHistory.nextViewOptions({
							disableAnimate : true
						});
						$state.go(name, params);
					};
					if (loadData) {
						if($ionicLoading){
						loadData.call(this, $ionicLoading);
						}else {

							loadData.call(this, undefined);
						}
					}
					$scope.goBack = function() {
						history.back();
					};
					$scope.goBackNoAnim = function() {
						$ionicHistory.nextViewOptions({
							disableAnimate : true
						});
						history.back();
					};
					$scope.refresh = function() {
						loadData($ionicLoading);
					};
				}
			};
		})

		.factory(
				'$group',
				function($q,$http,$ionicPopup,$state,$ionicScrollDelegate,$ionicLoading) {
					var getClassCode = function(icount){
						var classcode = "";
						switch (icount%8) {
						case 1:
							classcode="wordicona";
							break;
						case 2:
							classcode="wordiconb";
							break;
						case 3:
							classcode="wordiconc";
							break;
						case 4:
							classcode="wordicond";
							break;
						case 5:
							classcode="wordicone";
							break;
						case 6:
							classcode="wordiconf";
							break;
						case 7:
							classcode="wordicong";
							break;
						case 0:
							classcode="wordiconh";
							break;
						default:
							classcode="wordicona";
							break;
						}
						return classcode;
					}
					return {
						RunMethod : function(sClassName,sMethodName,sArgs){
							var resultData;
							var params = {};
							var ParamData = {};
					        params.deviceType = AmApp.config.DeviceType;
					        ParamData["ClassName"] = "com.amarsoft.app.als.mobile.common.RunMethodUtil";
					        ParamData["MethodName"] = "RunMethod";
					        ParamData["sClassName"] = sClassName;
					        ParamData["sMethodName"] = sMethodName;
					        ParamData["sArgs"] = sArgs;
					        ParamData["UUID"] = "00:9a:cd:50:dd:42";
					        ParamData["UserID"] = AmApp.userID;
					        params.RequestParams = ParamData;
							//解决开发环境和生产环境 代码兼容问题,以后只需要在config.js里面设置"enviroment"变量值,dev 代表开发环境,produ代表生产环境
						    if (AmApp.config.enviroment == 'dev') {
						    	$.ajax({
						    		data : JSON.stringify(params),
						    		url : AmApp.config.ServiceRootPath + "SelectObject",
						    		type : "POST",
						    		async: false,
						    		dataType : "json",
						    		contentType : "application/json",
						    		withCredentials:true,
						    		success : function(data){
						    			var returnCode = data["returnCode"];
					                	if(returnCode === "SUCCESS"){
					                		resultData = data["ResponseParams"]["RecordData"];
					                	}
						    		},
						    		error : function(err){
						    			if(err.responseText=="account.session.timeout"){
											var confirmPopup = $ionicPopup.alert({
								                title: '登陆超时',
								                template: '登陆超时，请重新登陆！',
								                okText: '确定'
								            });
								        	confirmPopup.then(function (res) {
								        		$state.go('logon', {});
								        		setTimeout(function () {
							                        window.location.reload();
							                    }, 100);
								        	});
											return;
						    			}
						            	resultData = {returnCode : "ERROR" , returnMsg : err};
						    		}
						    	});
						    }else if (AmApp.config.enviroment == 'produ') {
						    	window.encrypt([JSON.stringify(params), "qazwUIUY45gftyu7689014dv"], function
					                (msg) {
					                params = msg;
					                $.ajax({
							    		data : JSON.stringify(params),
							    		url : AmApp.config.ServiceRootPath + "SelectObject",
							    		type : "POST",
							    		async: false,
							    		dataType : "json",
							    		contentType : "application/json",
							    		withCredentials:true,
							    		success : function(data){
							    			var returnCode = data["returnCode"];
						                	if(returnCode === "SUCCESS"){
						                		resultData = data["ResponseParams"]["RecordData"];
						                	}
							    		},
							    		error : function(err){
							    			if(err.responseText=="account.session.timeout"){
												var confirmPopup = $ionicPopup.alert({
									                title: '登陆超时',
									                template: '登陆超时，请重新登陆！',
									                okText: '确定'
									            });
									        	confirmPopup.then(function (res) {
									        		$state.go('logon', {});
									        		setTimeout(function () {
								                        window.location.reload();
								                    }, 100);
									        	});
												return;
							    			}
							            	resultData = {returnCode : "ERROR" , returnMsg : err};
							    		}
							    	});
					            }, function (err) {
					            	resultData = {returnCode : "ERROR" , returnMsg : err};
					            });
						    }
						    if(resultData["ReturnValue"] !== "undefined" &&
						    		typeof(resultData["ReturnValue"]) !== "undefined"){
						    	resultData = resultData["ReturnValue"];
						    }
						    return resultData;
						},
						business : function(ParamData){
							var resultData;
							var params = {};
					        params.deviceType = AmApp.config.DeviceType;
					        ParamData["UUID"] = "00:9a:cd:50:dd:42";
					        //RunJavaMethodSqlca方法无需配置数据连接
							if(typeof(ParamData["ClassName"]) !== "undefined" && ParamData["ClassName"] === "com.amarsoft.app.als.mobile.common.RunMethodUtil"
								&& typeof(ParamData["MethodName"]) !== "undefined" && ParamData["MethodName"] === "RunJavaMethodSqlca")
								ParamData["TransactionType"] = "null";

					        params.RequestParams = ParamData;
							//解决开发环境和生产环境 代码兼容问题,以后只需要在config.js里面设置"enviroment"变量值,dev 代表开发环境,produ代表生产环境
						    if (AmApp.config.enviroment == 'dev') {
						    	$.ajax({
						    		data : JSON.stringify(params),
						    		url : AmApp.config.ServiceRootPath + "SelectObject",
						    		type : "POST",
						    		async: false,
						    		dataType : "json",
						    		contentType : "application/json",
						    		withCredentials:true,
						    		success : function(data){
						    			var returnCode = data["returnCode"];
					                	if(returnCode === "SUCCESS"){
					                		resultData = data["ResponseParams"]["RecordData"];
					                	}
						    		},
						    		error : function(err){
						    			if(err.responseText=="account.session.timeout"){
											var confirmPopup = $ionicPopup.alert({
								                title: '登陆超时',
								                template: '登陆超时，请重新登陆！',
								                okText: '确定'
								            });
								        	confirmPopup.then(function (res) {
								        		$state.go('logon', {});
								        		setTimeout(function () {
							                        window.location.reload();
							                    }, 100);
								        	});
											return;
						    			}
						            	resultData = {returnCode : "ERROR" , returnMsg : err};
						    		}
						    	});
						    }else if (AmApp.config.enviroment == 'produ') {
						    	window.encrypt([JSON.stringify(params), "qazwUIUY45gftyu7689014dv"], function
					                (msg) {
					                params = msg;
					                $.ajax({
							    		data : JSON.stringify(params),
							    		url : AmApp.config.ServiceRootPath + "SelectObject",
							    		type : "POST",
							    		async: false,
							    		dataType : "json",
							    		contentType : "application/json",
							    		withCredentials:true,
							    		success : function(data){
							    			var returnCode = data["returnCode"];
						                	if(returnCode === "SUCCESS"){
						                		resultData = data["ResponseParams"]["RecordData"];
						                	}
							    		},
							    		error : function(err){
							    			if(err.responseText=="account.session.timeout"){
												var confirmPopup = $ionicPopup.alert({
									                title: '登陆超时',
									                template: '登陆超时，请重新登陆！',
									                okText: '确定'
									            });
									        	confirmPopup.then(function (res) {
									        		$state.go('logon', {});
									        		setTimeout(function () {
								                        window.location.reload();
								                    }, 100);
									        	});
												return;
							    			}
							            	resultData = {returnCode : "ERROR" , returnMsg : err};
							    		}
							    	});
					            }, function (err) {
					            	if(err.responseText=="account.session.timeout"){
										var confirmPopup = $ionicPopup.alert({
							                title: '登陆超时',
							                template: '登陆超时，请重新登陆！',
							                okText: '确定'
							            });
							        	confirmPopup.then(function (res) {
							        		$state.go('logon', {});
							        		setTimeout(function () {
						                        window.location.reload();
						                    }, 100);
							        	});
										return;
					    			}
					            	resultData = {returnCode : "ERROR" , returnMsg : err};
					            });
						    }
							return resultData;
						},
						loadGroup : function(groupId,colId,level,type){
							var defer = $q.defer();
							var params = {};
					        params.deviceType = AmApp.config.DeviceType;
					        params.RequestParams = {GroupId : groupId,ColId:colId,Level:level,Type:type,UUID:"00:9a:cd:50:dd:42"};
							//解决开发环境和生产环境 代码兼容问题,以后只需要在config.js里面设置"enviroment"变量值,dev 代表开发环境,produ代表生产环境
						    if (AmApp.config.enviroment == 'dev') {
						    	$http.post(AmApp.config.ServiceRootPath + "SelectGroup",params,{withCredentials:true})
								.success(function (data, status, header, config) {
									if(data=="account.session.timeout"){
										var confirmPopup = $ionicPopup.alert({
							                title: '登陆超时',
							                template: '登陆超时，请重新登陆！',
							                okText: '确定'
							            });
							        	confirmPopup.then(function (res) {
							        		$state.go('logon', {});
							        		setTimeout(function () {
						                        window.location.reload();
						                    }, 100);
							        	});
										
										return;
									}
					                if (status == 200) {
					                	var result = [];
					                	var returnCode = data["returnCode"];
					                	if(returnCode === "SUCCESS"){
					                		var resultData = data["ResponseParams"]["array"];
				                			angular.forEach(resultData, function(item, index) {
				                				result.push(item);
				                			});
				                			var loaclStorage = window.localStorage;
				                			if(resultData.length>3 && level=="1" && type=="tab" && (loaclStorage['first'] == undefined || loaclStorage['first'] =="undefined")){
				                				//中间二级导航栏中有超过三个 tab 按钮的情况
				                				var time;
				                				Test("试一下",time);
				                				loaclStorage['first'] = "true";
				                			}
					                	}
			                        	defer.resolve(result);
					                }else{
						            	defer.reject();
					                }
					            }).error(function (data, status, header, config) {
					            	defer.reject();
					            });
						    }else if (AmApp.config.enviroment == 'produ') {
						    	window.encrypt([JSON.stringify(params), "qazwUIUY45gftyu7689014dv"], function
					                (msg) {
					                params = msg;
					                $http.post(AmApp.config.ServiceRootPath + "SelectGroup", params,{withCredentials:true})
					                .success(function (data, status, header, config) {
				                        if (status == 200) {
				                            window.decrypt([data, "qazwUIUY45gftyu7689014dv"], function (msg) {
				                                var obj = JSON.parse(msg);
				                                var result = [];
				                                var returnCode = obj["returnCode"];
							                	if(returnCode === "SUCCESS"){
							                		var resultData = obj["ResponseParams"]["array"];
						                			angular.forEach(resultData, function(item, index) {
						                				result.push(item);
						                			});
							                	}
					                        	defer.resolve(result);
				                            }, function (err) {
				                            	defer.reject();
				                            })
				                        } else {
				                        	defer.reject();
				                        }
				                    }).error(function (data, status, header, config) {
				                    	defer.reject();
				                    });
					            }, function (err) {
					            	defer.reject();
					            });
						    }
						    
						    var Test = function(str,time){
					        	$ionicPopup.confirm({
					                title:"温馨提示",
					                template:"中间的二级导航栏是可以左右滑动的！",
					                okText: str,
					                cancelText: '明白'
					            }).then(function(res){
					                if(res){
					                	var num = 0;
					                    if(str == "试一下"){
					                    	time =setInterval(function(){
				                    			if(num >= 70){
				                    				num = 0
				                            		clearInterval(time);
				                            	}else{
				                            		num++;
				                            		$ionicScrollDelegate.$getByHandle("TapScrollHandle").scrollBy(10, 0, false);
				                            	}
					                    },15);
					                    	Test("知道了",time);
					                    }else{
					                    	if(time){
					                    		clearInterval(time);
					                    	}
					                    	$ionicScrollDelegate.$getByHandle("TapScrollHandle").scrollBy(-700, 0, true);
					                    }
					                    
					                }else{
					                	if(time){
					                		clearInterval(time);
					                	}
					                	$ionicScrollDelegate.$getByHandle("TapScrollHandle").scrollTo(0, 0, true);
					                }
					            });
					    	}
						    
							return defer.promise;
						},
                        /**
						 * 获取列表数据
                         * @param url	接口名称
                         * @param param 传入参数
                         * @returns {*}
                         */
						loadList : function(url,param){
							var defer = $q.defer();
							var params = {};
					        params.deviceType = AmApp.config.DeviceType;
					        param.UUID = "00:9a:cd:50:dd:42";
					        params.RequestParams = param;
							//解决开发环境和生产环境 代码兼容问题,以后只需要在config.js里面设置"enviroment"变量值,dev 代表开发环境,produ代表生产环境
						    if (AmApp.config.enviroment == 'dev') {
						    	$http.post(AmApp.config.ServiceRootPath + url,params,{withCredentials:true})
								.success(function (data, status, header, config) {
									if(data=="account.session.timeout"){
										var confirmPopup = $ionicPopup.alert({
							                title: '登陆超时',
							                template: '登陆超时，请重新登陆！',
							                okText: '确定'
							            });
							        	confirmPopup.then(function (res) {
							        		$state.go('logon', {});
							        		setTimeout(function () {
						                        window.location.reload();
						                    }, 100);
							        	});
										
										return;
									}
					                if (status == 200) {
					                	var result = {data:[],totalCount:0};
					                	var returnCode = data["returnCode"];
					                	if(returnCode === "SUCCESS"){
						                	var resultData = data["ResponseParams"]["array"];
				                			angular.forEach(resultData, function(item, index) {
				                				var tmpData = {};
				                				for(var i in item){
				                					tmpData[item[i].Key] = item[i].Value;
				                				}
				                				tmpData["ClassCode"] = getClassCode(index+1);
				                				result["data"].push(tmpData);
				                			});
				                			result.totalCount = data["ResponseParams"]["totalCount"];
					                	}
			                        	defer.resolve(result);
					                }else{
						            	defer.reject();
					                }
					            }).error(function (data, status, header, config) {
					            	defer.reject();
					            });
						    }else if (AmApp.config.enviroment == 'produ') {
						    	window.encrypt([JSON.stringify(params), "qazwUIUY45gftyu7689014dv"], function
					                (msg) {
					                params = msg;
					                $http.post(AmApp.config.ServiceRootPath + url, params,{withCredentials:true})
					                .success(function (data, status, header, config) {
				                        if (status == 200) {
				                            window.decrypt([data, "qazwUIUY45gftyu7689014dv"], function (msg) {
				                                var obj = JSON.parse(msg);
				                                var result = {data:[],totalCount:0};
				                                var returnCode = data["returnCode"];
							                	if(returnCode === "SUCCESS"){
							                		var resultData = data["ResponseParams"]["array"];
						                			angular.forEach(resultData, function(item, index) {
						                				var tmpData = {};
						                				for(var i in item){
						                					tmpData[item[i].Key] = item[i].Value;
						                				}
						                				tmpData["ClassCode"] = getClassCode(index+1);
						                				result["data"].push(tmpData);
						                			});
						                			result.totalCount = data["ResponseParams"]["totalCount"];
							                	}
					                        	defer.resolve(result);
				                            }, function (err) {
				                            	defer.reject();
				                            })
				                        } else {
				                        	defer.reject();
				                        }
				                    }).error(function (data, status, header, config) {
				                    	defer.reject();
				                    });
					            }, function (err) {
					            	defer.reject();
					            });
						    }
							return defer.promise;
						},
						mustMsg : function(msgInfo){
							var defer = $q.defer();

							if(typeof(msgInfo) === "undefined"){
							    defer.resolve(true);
							    return defer.promise;
                            }//信息未定义，返回校验不通过

							if(msgInfo === ""){
							    defer.resolve(false);
							    return defer.promise;
                            }//信息为空，返回校验通过

							var checkType = msgInfo.substring(0,4).toUpperCase();
							//存在格式头且只有格式头信息，返回校验通过
							if((checkType === "MUST" || checkType === "WARN")
								&& (msgInfo.split("@").length === 1 || (msgInfo.split("@").length === 2 && msgInfo.split("@")[1] === ""))) {
                                defer.resolve(false);
                                return defer.promise;
                            }

							var msgType = "MUST";
							if(checkType === "MUST")
								msgInfo = msgInfo.substring(5);
							else if(checkType === "WARN"){
								msgInfo = msgInfo.substring(5);
								msgType = "WARN";
							}
							var msgInfoArr = msgInfo.split("@");
							var template = "";
							for(var i = 0;i < msgInfoArr.length;i++){
								if(msgInfoArr[i] === "")
									continue;
								if(i === 0)
									template = (i + 1) + "." + msgInfoArr[i];
								else
									template += "<br/>" + (i + 1) + "." + msgInfoArr[i];
							}
							if(msgType === "MUST"){
							$ionicPopup.show({ template: template, title: '必要性校验', buttons:
								[ { text: '确定', type: 'button-positive',
									onTap: function(e) {
										//defer.resolve(true);
									} }, ] }).then(function(res){
										defer.resolve(true);
									});
							}else if(msgType === "WARN"){
								$ionicPopup.confirm({
									title:"提示性校验",
									template:template,
									okText:"继续",
									cancelText:"中止"
								}).then(function(res){
									if(res)
										defer.resolve(false);
									else
										defer.resolve(true);
								});
							}
							return defer.promise;
						},
                        /**
						 * 将Info模板数据分行
                         * @param groupColArray
                         * @param multCount
                         * @returns {Array}
                         */
						multiCol : function(groupColArray, multCount){
							var showTempGroup = [];
							var showTemp = [];
							var hideTempGroup = [];
							var hideTemp = [];
							for(var i = 0; i < groupColArray.length; i++){
								var col = groupColArray[i];
								if(col["Hide"]){
									if(hideTemp.length === multCount){
										hideTempGroup.push(hideTemp);
										hideTemp = [];
									}
									hideTemp.push(col);
								}else{
                                    if(showTemp.length === multCount){
                                        showTempGroup.push(showTemp);
                                        showTemp = [];
                                    }
                                    showTemp.push(col);
								}
							}
							if(hideTemp.length > 0)
								hideTempGroup.push(hideTemp);
							if(showTemp.length > 0)
								showTempGroup.push(showTemp);
							//合并两个数组
							for(var tempIndex in hideTempGroup)
								showTempGroup.push(hideTempGroup[tempIndex]);
							return showTempGroup;
						}
					};
				})
		
	/*加载详情页面列表*/
	.factory(
			'$detailList',
			function($model,$http, $ionicLoading, $filter,$ionicPopup, $state,$TemplatePart,detailListPaging,$group,$ionicModal,$timeout,$ionicScrollDelegate) {
				return {
					load : function($scope,param){
						$scope.detailListIndex = null;//detailList列表选中行Index
						$scope.detailItems = [];//detailList列表数据
						$scope.selectedDetailListItem = {};//detailList列表中被选择的数据
						$scope.selectedDetailMenuItem = {};//选中选项卡信息
						$scope.goDetailTopFlag = true;
						$scope.selectedDetailListItem = {};//detailList选中项数据
						$scope.detailListGroup = [];//detailList显示字段
						$scope.detailListFlag = true;//详情页是否为list列表
						$scope.chooseDetailFlag = false;//$scope.chooseDetail方法是否执行标志，主要为了区分detailListInfo和detailInfo中[...]按钮响应
						//加载详情页list数据
						var loadData = function (){
							$scope.setListGroupParam();
							$group.loadGroup(param.groupId,$scope.listGroupColId).then(function(result){
								$scope.detailListGroup = result;
								$scope.$broadcast('to-tabGroupLength',$scope.listGroup.tabGroup.length);
								var url = "SelectObjectList";
								var detailListParam = {};
								$scope.setDetailListParam(detailListParam);
								detailListParam["ClassName"] = param["className"];
								detailListParam["MethodName"] = param["methodName"];
								detailListParam["PageSize"] = param["pageSize"];
								detailListParam["PageNo"] = $scope.detailListPageNo;
								$group.loadList(url,detailListParam).then(function(result){
									//数据转成app_list_group配置字段,区分大小写
									result["data"] = $scope.getDetailRealListData(result["data"]);
									for (var k = 0; k < result["data"].length; k++) {
										//var reg = /^((-?\\d+.?\\d*)[Ee]{1}(-?\\d+))$/;
										for(var key in result["data"][k]){
											//此处需要写一个“科学计数法”的正则来判断
											if(result["data"][k][key].indexOf('E') != -1 || result["data"][k][key].indexOf('.') != -1){
												var num = new Number(result["data"][k][key]);
												if(!isNaN(num)){
													result["data"][k][key] = $filter('currency')(num+"",'');
												}
											}
											/*if(key == "BusinessSum"){
												//由于上方由科学计数法转换后的数字带有“,”，所以此处要去掉
												if(result["data"][k][key].indexOf(',') != -1){
													result["data"][k][key] = result["data"][k][key].replace(/,/g,'');
												}
												var num = new Number(result["data"][k][key]);
												result["data"][k][key] = num.toFixed(2);
											}*/
										}
										$scope.detailItems.push(result["data"][k]);
									}
									$scope.detailListHasMore = (($scope.detailListPageNo - 1)
											* param.pageSize
											+ result["data"].length < result.totalCount);
									$scope.detailListLoadingMore = false;
									if ($scope.detailListPageNo == 1) {
										if($scope.detailListIndex != null){
											$scope.$emit('to-selectedDetailListItem',result["data"][$scope.detailListIndex]);
										}else{
											$scope.$emit('to-selectedDetailListItem',result["data"][0]);
										}
										$scope.selectedDetailListItem = result["data"][$scope.detailListIndex];
										$ionicScrollDelegate.$getByHandle('detailScrollHandle').scrollTop(0);
									}
								});
							});
						}
						//List点击行事件返回对应模版
						$scope.$on('to-listDetailInfo', function (e,detailParam) {
							$scope.listDetailReadonly = detailParam['readonly'];
							detailParam["queryData"]['readonly'] = detailParam['readonly'];
							var url = "SelectObjectInfo";
							//重置页面解析对象
							$scope.listDetails = [];
							$scope.detailListCheck = {};
							$scope.detailListInfo = {};
							$scope.detailListDataParam = {};
							$scope.detailListInfoNoUpdate = {};
							if(detailParam["url"] !== "undefined" && typeof(detailParam["url"]) !== "undefined" && detailParam["url"] !== "" && detailParam["url"] !== null ){
								url = detailParam["url"];
							}
							if(url !== "undefined" && url !== "" && url !== null){
								//接收服务端返回的用户详情数据
								runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,url, detailParam["queryData"], function (data, status) {
									if(typeof(data["array"]) === "object"){
										$scope.listDetails = data["array"];
										for (var i = 0; i < data["array"].length; i++) {
											//增加参数，是否展示，页面载入时均展示
											data["array"][i]['showGroup'] = true;
											//获取模版json中的groupColArray的数据，按照json格式中的 <KeyId：Value>存放到$scope.marketInfo中做绑定并用于页面展示
											$scope.groupColArray = data["array"][i].groupColArray;
											if($scope.groupColArray !== "undefined" &&
													typeof($scope.groupColArray) !== "undefined"){
												for(var j = 0; j < $scope.groupColArray.length;j++){
													if(detailParam.queryData.modelNo == "IndOrEntCapitalUsedDetail"){
														//贷后管理-公司首检-点击一条用款记录，交易金额小数点后保留2个0
														if($scope.groupColArray[j].KeyId == "ItemSum"){
															var num = new Number($scope.groupColArray[j].Value);
															$scope.groupColArray[j].Value = num.toFixed(2);
														}
													}
													if($scope.groupColArray[j].ColRequired === "1"){
														$scope.detailListCheck[$scope.groupColArray[j].KeyId] = false;
													}
													if($scope.groupColArray[j].ColUpdateable == '1'){
														if((!$scope.groupColArray[j].ReadOnly && !$scope.groupColArray[j].Hide)
																|| $scope.groupColArray[j]["KeyId"] === "SerialNo"
																|| $scope.groupColArray[j]["KeyId"] === "ObjectNo"
																|| $scope.groupColArray[j]["KeyId"] === "RelativeSerialNo"
																|| $scope.groupColArray[j]["KeyId"] === "InputUserID"
																|| $scope.groupColArray[j]["KeyId"] === "InputUserOrgID"
																|| $scope.groupColArray[j]["KeyId"] === "UpdateUserID"
																|| $scope.groupColArray[j]["KeyId"] === "UpdateUserOrgID"
																|| $scope.groupColArray[j]["KeyId"] === "PayeeID"){
															$scope.detailListDataParam[$scope.groupColArray[j].KeyId] = $scope.groupColArray[j].Value;
														}
														if($scope.groupColArray[j].ColCheckFormat === "3"){
															var value = $scope.groupColArray[j].Value;
															value = (new Date(value)).format("yyyy-MM-dd");
															$scope.detailListInfo[$scope.groupColArray[j].KeyId] = new Date(value);
														}else{
															if($scope.groupColArray[j]["Remark"] !== "codeName"){
																$scope.detailListInfo[$scope.groupColArray[j].KeyId] = $scope.groupColArray[j].Value;
															}
														}
													} else {
														$scope.detailListInfoNoUpdate[$scope.groupColArray[j].KeyId] = $scope.groupColArray[j].Value;
													}
												}
											}
										}
										//获取option中的值
										detailParam["queryData"]["ReturnType"] = "Code";
										runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
												url, detailParam["queryData"], function (data, status) {
											for (var i = 0; i < data["array"].length; i++) {
                                                if(typeof($scope["CODE_LIBRARY"]) === "undefined")	$scope["CODE_LIBRARY"] = {};
                                                $scope["CODE_LIBRARY"][data["array"][i]["KeyId"]] = data["array"][i]["CodeArray"];
											}
										});
									}
								});
							}
						});
						detailListPaging.init($scope,param.pageSize,param.pageNo,loadData, param.flag);
						appIonicLoading.show({
							template: '正在加载中',
							animation: 'fade-in',
							showBackdrop: true,
							duration: 1000
						});
						$scope.toListDetailAfter();
						$scope.detailListRefresh();
						return ;
					}
				};
			})
	/*加载页面列表*/			
	.factory(
			'$list',
			function($http, $ionicLoading, $ionicPopup,$filter, $state,$detail,$model,paging,$group,$ionicTabsDelegate,$ionicScrollDelegate,$timeout) {
				return {
					load : function($scope,param){
						$scope.groupId = param.groupId;//groupId(app_list_group、app_menu_group中groupId，每类业务groupId相同)
						$scope.menuTitle = param.menuTitle;//菜单标题
						$scope.tabTitle = param.tabTitle //tab标题
						$scope.menuIndex = 0;//菜单Index
						$scope.listIndex = 0;//List列表选中行Index
						$scope.items = [];//List列表数据
						$scope.loadFlag = false;//检测菜单是否加载完成标识符
						$scope.selectedListItem  = {};//list列表中被选择的数据
						$scope.loadFlag = false//是否开始加载list数据
						$scope.listSearchFlag = false//list搜索标识
						$scope.selectedMenuItem = {};//选中菜单信息
						$scope.listGroup = {menuGroup:[],group:[],tabGroup:[]};//存放菜单及列表字段
						$scope.changeModelFlag = true;//控制第一次加载页面tab页默认第一页,其他情况刷新不更改tab页index
						$scope.queryObjOptions = {};//搜索下拉选数据
						$scope.goDetailTopFlag = true;
						$scope.tabIndex = 0;//tab页索引

                        /**
						 * 加载List列表的数据
                         */
						var loadData = function (){
							$scope.loadFlag = false;
							var url = "SelectObjectList";
							var queryParam = {};
							$scope.setListQueryParam(queryParam);
							$scope.setListParam(queryParam);
							queryParam["ClassName"] = param["className"];
							queryParam["MethodName"] = param["methodName"];
							queryParam["PageSize"] = param["pageSize"];
							queryParam["PageNo"] = $scope.pageNo;
							$group.loadList(url,queryParam).then(function(result){
								//数据转成app_list_group配置字段,区分大小写
								result["data"] = $scope.getRealListData(result["data"]);
								//重置页面解析对象
								$scope.details = [];
								$scope.detailInfo = {};
								$scope.detailInfoNoUpdate = {};
								$ionicTabsDelegate.select(0);
								for (var k = 0; k < result["data"].length; k++) {
									for(var key in result["data"][k]){
										if(result["data"][k][key].indexOf('E') != -1 || result["data"][k][key].indexOf('.') != -1){
											var num = new Number(result["data"][k][key]);
											if(!isNaN(num)){
												result["data"][k][key] = $filter('currency')(num+"",'');
											}
										}
									}
									$scope.items.push(result["data"][k]);
								}
								$scope.hasMore = (($scope.pageNo - 1)
										* param.pageSize
										+ result["data"].length < result.totalCount);
								$scope.loadingMore = false;
								if ($scope.pageNo == 1) {
									$scope.listIndex = 0;
									$scope.selectedListItem = result["data"][$scope.listIndex];
									$ionicScrollDelegate.$getByHandle('listScrollHandle').scrollTop(0);
									$ionicScrollDelegate.$getByHandle('detailScrollHandle').scrollTop(0);
									$scope.goDetail($scope.selectedListItem, $scope.listIndex);
								}
							});
						}
						//点击二级滑动按钮触发事件
						$scope.clickMenu = function(menuItem, index){
							//重置搜索框
							$scope.clearData();
							$scope.listSearchFlag = false;
							$scope.menuIndex = index;
							$scope.selectedMenuItem = menuItem;
							//重新加载group信息
							$group.loadGroup($scope.groupId,$scope.selectedMenuItem["ColId"]).then(function(result){
								$scope.searchLength = 1 ;
								$scope.listGroup.group = result;
								for(var i in result){
									if(result[i]["SearchShow"] === "1"){
										$scope.searchLength += 1;
										if(result[i]["ColType"] === "1"){
											var param = $scope.setSelectOptionsParam();
											$scope.selectOptions(result[i]["GroupId"],result[i]["ColId"],param);
										}
									}
								}
								$scope.refresh();
							});
						}
                        /**
						 * 列表部分点击行事件
                         * @param item 当前行的对象
                         * @param index 当前行索引
                         */
						$scope.goDetail = function (item, index) {
							$scope.listIndex = index;
							$scope.selectedListItem = item;
							$group.loadGroup($scope.groupId,$scope.selectedMenuItem.ColId,2,"tab").then(function(result){
								$scope.listGroup.tabGroup = result;
								if(result.length == 0){
									var detailParam = {url:"",queryData:{}};
									$scope.detailTitle = $scope.tabTitle;
									$scope.includeContent = $scope.selectedMenuItem["IncludeContent"];
									$scope.includeFooter = $scope.selectedMenuItem["IncludeFooter"];
									$scope.includeTop = $scope.selectedMenuItem["IncludeTop"];
									$scope.setDetailParam($scope.selectedMenuItem,detailParam);
									$timeout(function () {
						 				$scope.$broadcast('to-detail',detailParam);
						 			}, 100);
								}else{
									if(index === 0){
										$scope.tabIndex = 0;
									}
									$scope.changeModel(result[$scope.tabIndex],$scope.tabIndex);
								}
							});
						}
                        /**
						 * 先加载中间部分菜单，之后加载菜单下的列表模板
                         */
						$group.loadGroup($scope.groupId,"",1,"tab").then(function(result){
							$scope.listGroup.menuGroup = result;
							$scope.selectedMenuItem = result[0];
							if($scope.detailListFlag){
								$scope.setListGroupParam();
							}else{
								$scope.listGroupColId = $scope.selectedMenuItem["ColId"];
							}
							$group.loadGroup($scope.groupId,$scope.listGroupColId).then(function(result){
								$scope.searchLength = 1 ;
								$scope.listGroup.group = result;
								for(var i in result){
									if(result[i]["SearchShow"] === "1"){
										$scope.searchLength += 1;
										if(result[i]["ColType"] === "1"){
                                            var param = $scope.setSelectOptionsParam();
                                            $scope.selectOptions(result[i]["GroupId"],result[i]["ColId"],param);
										}
									}
								}
								$scope.loadFlag = true;
							});
						});
						//List点击行事件返回对应模版
						$scope.$on('to-listDetailInfo', function (e,detailParam) {
							var url = "SelectObjectInfo";
							//重置页面解析对象
							$scope.listDetails = [];
							$scope.detailListCheck = {};
							$scope.detailListInfo = {};
							$scope.detailListDataParam = {};
							$scope.detailListInfoNoUpdate = {};
							if(detailParam["url"] !== "undefined" && typeof(detailParam["url"]) !== "undefined" && detailParam["url"] !== "" && detailParam["url"] !== null ){
								url = detailParam["url"];
							}
							if(url !== "undefined" && url !== "" && url !== null){
								//接收服务端返回的用户详情数据
								runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,url, detailParam["queryData"], function (data, status) {
									if(typeof(data["array"]) === "object"){
										$scope.listDetails = data["array"];
										for (var i = 0; i < data["array"].length; i++) {
											//增加参数，是否展示，页面载入时均展示
											data["array"][i]['showGroup'] = true;
											//获取模版json中的groupColArray的数据，按照json格式中的 <KeyId：Value>存放到$scope.marketInfo中做绑定并用于页面展示
											$scope.groupColArray = data["array"][i].groupColArray;
											if($scope.groupColArray !== "undefined" &&
													typeof($scope.groupColArray) !== "undefined"){
												for(var j = 0; j < $scope.groupColArray.length;j++){
													if($scope.groupColArray[j].ColRequired === "1"){
														$scope.detailListCheck[$scope.groupColArray[j].KeyId] = false;
													}
													if($scope.groupColArray[j].ColUpdateable == '1'){
														if((!$scope.groupColArray[j].ReadOnly && !$scope.groupColArray[j].Hide)
																|| $scope.groupColArray[j]["KeyId"] === "SerialNo"
																|| $scope.groupColArray[j]["KeyId"] === "ObjectNo"
																|| $scope.groupColArray[j]["KeyId"] === "RelativeSerialNo"
																|| $scope.groupColArray[j]["KeyId"] === "InputUserID"
																|| $scope.groupColArray[j]["KeyId"] === "InputUserOrgID"
																|| $scope.groupColArray[j]["KeyId"] === "UpdateUserID"
																|| $scope.groupColArray[j]["KeyId"] === "UpdateUserOrgID"){
															$scope.detailListDataParam[$scope.groupColArray[j].KeyId] = $scope.groupColArray[j].Value;
														}
														if($scope.groupColArray[j].ColCheckFormat === "3"){
															var value = $scope.groupColArray[j].Value;
															value = (new Date(value)).format("yyyy-MM-dd");
															$scope.detailListInfo[$scope.groupColArray[j].KeyId] = new Date(value);
														}else{
															if($scope.groupColArray[j]["Remark"] !== "codeName"){
																$scope.detailListInfo[$scope.groupColArray[j].KeyId] = $scope.groupColArray[j].Value;
															}
														}
													} else {
														$scope.detailListInfoNoUpdate[$scope.groupColArray[j].KeyId] = $scope.groupColArray[j].Value;
													}
												}
											}
										}
										//获取option中的值
										detailParam["queryData"]["ReturnType"] = "Code";
										runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
												url, detailParam["queryData"], function (data, status) {
											for (var i = 0; i < data["array"].length; i++) {
                                                if(typeof($scope["CODE_LIBRARY"]) === "undefined")	$scope["CODE_LIBRARY"] = {};
                                                $scope["CODE_LIBRARY"][data["array"][i]["KeyId"]] = data["array"][i]["CodeArray"];
											}
										});
										$scope.toListDetailAfter();
									}
								});
							}
						});
                        /**
						 * 监听对象$scope.loadFlag，对象初始化时第一次触发，之后，对象值变更一次触发一次
						 * 监测菜单、tab页数据加载是否完成
                         */
						$scope.$watch('loadFlag',function(newValue,oleValue){
							if(newValue){
								paging.init($scope,param.pageSize,param.pageNo, loadData, param.flag);
								appIonicLoading.show({
									template: '正在加载中',
									animation: 'fade-in',
									showBackdrop: true,
									duration: 1000
								});
								$scope.refresh();
								return ;
							}
						});
					}
				};
			})
				
	.factory(
			'$detail',
			function($http,$rootScope,pdfDelegate,$ionicScrollDelegate,$ionicSideMenuDelegate,$ionicTabsDelegate,$ionicModal,$ionicLoading, $filter,$ionicPopup,
					$state,$timeout,$group,paging,dynamicFilter,$TemplatePart,$compile,$cordovaFileTransfer,$sce) {
				return {
					load : function($scope){
                        /**
						 * 右侧详情页查询参数设置
						 * 可重写
                         * @param modelInfo
                         * @param detailParam
                         */
						$scope.setDetailParam = function(modelInfo,detailParam){

							var selectedListItem = $scope.getSelectedListItem();
							if(typeof($scope.selectedListItem) !== "undefined"){
								if(typeof(modelInfo["Action"]) === "undefined" || modelInfo["Action"] === "" || modelInfo["Action"] === null){
									detailParam["url"] = "SelectObjectInfo";
								}else{
									detailParam["url"] = modelInfo["Action"];
								}
								if($scope.detailUrl === "SelectCustomerInfo"){
									detailParam["queryData"]["CustomerID"] = selectedListItem["CustomerId"];
								}else{
									if(typeof(modelInfo["ObjectType"]) !== "undefined" && modelInfo["ObjectType"] !== "" && modelInfo["ObjectType"] !== null){
										detailParam["queryData"]["ObjectType"]  = modelInfo["ObjectType"];
									}else{
										detailParam["queryData"]["ObjectType"] = selectedListItem["ObjectType"];
									}
									detailParam["queryData"]["SerialNo"] = selectedListItem["SerialNo"];
									detailParam["queryData"]["ObjectNo"] = selectedListItem["ObjectNo"];
									detailParam["queryData"]["BusinessType"] = selectedListItem["BusinessType"];
								}
							}
							detailParam["ReturnType"] = "Info";
						}
						//切换tab页后事件
                        $scope.chooseModel = function(model,data){
                        	if ($scope.listSearchFlag) {
                				$scope.listSearchFlag = false;
                			}
                            if(typeof($scope.selectedListItem) === "undefined") return;
                            else {
                                $timeout(function () {
                                    $scope.$broadcast('to-detail', data);
                                }, 100);
                            }
                        };
						//切换tab页事件
						$scope.changeModel = function(model,index){
						    var detailListParamData = {url:"",queryData:{}};
						    $scope.selectedDetailMenuItem = model;
							$scope.detailTitle = model["ColName"];
							$scope.includeContent = model["IncludeContent"];
							$scope.includeFooter = model["IncludeFooter"];
							$scope.includeTop = model["IncludeTop"];
							$scope.setDetailParam(model,detailListParamData);
							if(detailListParamData.url=="SelectCustomerInfo"){
								var queryIsNotHaveCustomerRight = {  //获取当前用户是否有信息查看权
					                ClassName : "com.amarsoft.app.als.mobile.impl.ComponentQuery",
					                MethodName : "queryIsNotHaveCustomerRight",
					                CustomerID :detailListParamData.queryData.CustomerID,
					                UserID : AmApp.userID,
									TransactionType : "Sqlca"
								}; 
								$scope.queryIsNotHaveCustomerRightResult = $group.business(queryIsNotHaveCustomerRight)["result"];
								if($scope.queryIsNotHaveCustomerRightResult=="N"){
									detailListParamData.queryData.CustomerID="";
									var confirmPopup = $ionicPopup.alert({
						                title: '没有权限',
						                template: '对不起，您没有权限查看该客户！',
						                okText: '确定'
						            });
						        	confirmPopup.then(function (res) {
						        		
						        	});
								}
							}
							$scope.detailItems = [];//detailList列表数据
							$scope.detailUrl = "";
							$scope.selectedDetailListItem = {};
							$scope.detailParam = {};
							$scope.tabIndex = index;
							$ionicScrollDelegate.$getByHandle('detailScrollHandle').scrollTop(0);
							$timeout(function () {
								$ionicTabsDelegate.select(index);
							}, 100);
							$scope.$broadcast('to-tabGroupLength',$scope.listGroup.tabGroup.length);
							$scope.chooseModel(model,detailListParamData);
						}

						/**
						 * 接收广播，最右侧详情数据请求
                         */
						$scope.$on('to-detail', function (e,detailParam) {
							var url = "SelectObjectInfo";
							appIonicLoading.show({template: '加载中...', duration: 20000});
							//重置页面解析对象
							$scope.details = [];
							$scope.detailCheck = {};
							$scope.detailInfo = {};
							$scope.detailDataParam = {};
							$scope.detailInfoNoUpdate = {};
							var LoanRateTermReadOnly = false;//利率组件是否只读标识
							var RpTermReadOnly = false;//还款组件是否只读标识
							if(detailParam["url"] !== "undefined" && typeof(detailParam["url"]) !== "undefined" && detailParam["url"] !== "" && detailParam["url"] !== null ){
								url = detailParam["url"];
							}
							if(url !== "undefined" && url !== "" && url !== null){
								//接收服务端返回的用户详情数据
								runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,url, detailParam["queryData"], function (data, status) {
									appIonicLoading.hide();
									if(typeof(data["array"]) === "object"){
										$scope.details = data["array"];
										for (var i = 0; i < data["array"].length; i++) {
											//增加参数，是否展示，页面载入时均展示
											data["array"][i]['showGroup'] = true;
											//获取模版json中的groupColArray的数据，按照json格式中的 <KeyId：Value>存放到$scope.marketInfo中做绑定并用于页面展示
											$scope.groupColArray = data["array"][i].groupColArray;
											var size = 0;
											if($scope.groupColArray !== "undefined" &&
													typeof($scope.groupColArray) !== "undefined"){
												for(var j = 0; j < $scope.groupColArray.length;j++){
													if(url == "SelectOpinionList"){
														for(var key in $scope.groupColArray[j]){
															//此处需要写一个“科学计数法”的正则来判断
															if($scope.groupColArray[j][key].indexOf('E') != -1){
																var num = new Number($scope.groupColArray[j][key]);
																if(!isNaN(num)){
																	$scope.groupColArray[j][key] = $filter('currency')(num+"",'');
																}
															}
															if($scope.groupColArray[j][key].indexOf('sum') != -1){
															//由于上方由科学计数法转换后的数字带有“,”，所以此处要去掉
															  if($scope.groupColArray[j]["Value"].indexOf(',') != -1){
																  $scope.groupColArray[j]["Value"] = $scope.groupColArray[j]["Value"].replace(/,/g,'');
															  }
															  var num = new Number($scope.groupColArray[j]["Value"]);
															  //$scope.groupColArray[j]["Value"] = num.toFixed(2);
															  $scope.groupColArray[j]["Value"] = $filter('currency')(num+"",'');
														    }
														}
													}
													
													if($scope.groupColArray[j]["KeyId"] === "LoanRateTermID"){
														LoanRateTermReadOnly  = $scope.groupColArray[j].ReadOnly;
													}
													if($scope.groupColArray[j]["KeyId"] === "RPTTermID"){
														RpTermReadOnly  = $scope.groupColArray[j].ReadOnly;
													}
													/*联网核查下载图片到本地 add by zfang3*/
													if(detailParam["queryData"].modelNo == "NetworkVerifyInfo"
														&& $scope.groupColArray[j]["KeyId"] == "PhotoPath"
														&& $scope.groupColArray[j]["Value"] != ""){
														var fileTransferParams = {};
                                                        fileTransferParams.url = AmApp.config.ServiceRealRootPath + "/AttachView?FullPath=" + $scope.groupColArray[j]["Value"];
                                                        fileTransferParams.targetPath = cordova.file.cacheDirectory +new Date().getTime() + "." + $scope.groupColArray[j]["Value"].split(".").pop();
                                                        fileTransferParams.trustHosts = true;
                                                        fileTransferParams.options = {};
                                                        fileTransferParams.photoColIndex = j;
                                                        $cordovaFileTransfer.download(fileTransferParams.url, fileTransferParams.targetPath, fileTransferParams.options, fileTransferParams.trustHosts)
                                                            .then(function (result) {
                                                                // Success
																$scope.groupColArray[fileTransferParams.photoColIndex]["Value"] = fileTransferParams.targetPath;
                                                            }, function (err) {
                                                                // Error
                                                                appIonicLoading.show({template: '加载照片失败！code：' + err.code, duration: 2000});
                                                            }, function (progress) {
                                                                $timeout(function () {
                                                                    $scope.downloadImageProgress = (progress.loaded / progress.total) * 100;
                                                                }, 500);
                                                            });
													}
                                                    /*联网核查下载图片到本地 end*/
													if($scope.groupColArray[j].ColRequired === "1"){
														$scope.detailCheck[$scope.groupColArray[j].KeyId] = false;
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
															$scope.detailDataParam[$scope.groupColArray[j].KeyId] = $scope.groupColArray[j].Value;
														}
														if($scope.groupColArray[j].ColCheckFormat === "3"){
															var value = $scope.groupColArray[j].Value;
															value = (new Date(value)).format("yyyy-MM-dd");
															$scope.detailInfo[$scope.groupColArray[j].KeyId] = new Date(value);
														}else{
															if($scope.groupColArray[j]["Remark"] !== "codeName"){
																$scope.detailInfo[$scope.groupColArray[j].KeyId] = $scope.groupColArray[j].Value;
															}
														}
													} else {
														$scope.detailInfoNoUpdate[$scope.groupColArray[j].KeyId] = $scope.groupColArray[j].Value;
													}
													if(!$scope.groupColArray[j].Hide){
														size += 1;
													}
												}
											}
											if(url == "SelectClassifyInfo"){
												//add by ylmeng
												$scope.items=[];
												for (var i = 0; i < $scope.details.length; i++) {
							                        //增加参数，是否展示，页面载入时均展示
							                        data["array"][i]['showGroup'] = true;
							                        $scope.items.push(data["array"][i]);
							                    }
											}else if(url == "SelectOpinionReport"){
												//调查报告
												viewHtmlService($scope,data["array"][0],$cordovaFileTransfer,$timeout,$sce);
											}else{
												$scope.details[i]["size"] = size;
											}
										}
										//获取option中的值
										if($scope.includeContent === "templates/common/tabDetailInfo.html"
											|| $scope.includeContent === "templates/common/detailInfo.html"
											|| $scope.includeContent === "templates/common/commonDetailList.html"
											|| $scope.includeContent === "templates/common/queryInfoDetail.html"){
											detailParam["queryData"]["ReturnType"] = "Code";
											runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
													url, detailParam["queryData"], function (data, status) {
												for (var i = 0; i < data["array"].length; i++) {
                                                    if(typeof($scope["CODE_LIBRARY"]) === "undefined")	$scope["CODE_LIBRARY"] = {};
                                                    $scope["CODE_LIBRARY"][data["array"][i]["KeyId"]] = data["array"][i]["CodeArray"];
												}
											});
										}
										if($scope.includeContent === "templates/common/detailInfo.html"
											|| $scope.includeContent === "templates/common/queryInfoDetail.html"
											|| $scope.includeContent === "templates/approve/common/fiveLevelClassifyInfo.html"
											|| $scope.includeContent === "templates/approve/approveReport.html"){
											LoanRateTermReadOnly = true;
											RpTermReadOnly = true;
										}
										
										if(url!="SelectOpinionReport" || url =="SelectOpinionReport"){
											$scope.toDetailAfter();
											$scope.packObj = {};
						        			$scope.packItems = {};
						        			$scope.parkTempletParam = {};
	                                        $scope.parkTempletParam["ObjectType"] = detailParam["queryData"]["ObjectType"];
	                                        $scope.parkTempletParam["ObjectNo"] = detailParam["queryData"]["ObjectNo"];

						        			$TemplatePart.findTemplet($scope,$scope.details,$scope.detailInfo,"","",false,LoanRateTermReadOnly,RpTermReadOnly);
						        			/*
						        			 * 记录一个申请期限的值，用于审批签署意见时做比较
						        			 * */
						        			if($scope.detailInfo.TermMonth != undefined || $scope.detailInfo.TermMonth != null || $scope.detailInfo.TermMonth != ""){
						        				$rootScope.TermMonth = $scope.detailInfo.TermMonth;
						        			}
										}
									}
								});
							}
						});
                        /**
						 * 设置组件查询参数 可复写
                         * @param templetParam
                         */
				        $scope.setTempletParam = function(templetParam){}
                        /**
						 * 设置利率组件查询所需参数 可复写
                         * @param rateTempletParam
                         */
						$scope.setRateTempletParam = function(rateTempletParam){}
                        /**
						 * 设置还款组件查询所需参数 可复写
                         * @param rptTempletParam
                         */
						$scope.setRptTempletParam = function(rptTempletParam){}
					},
                    setHeader : function(details,keyIds,value){
                        if(typeof(keyIds) === "undefined" || keyIds === "")
                            return;
                        var keyIdArr = keyIds.split(",");
                        for(var i = 0;i < details.length;i++){
                            var detail = details[i];
                            for(var j = 0;j < detail["groupColArray"].length;j++){
                                var col = detail["groupColArray"][j];
                                for(var k = 0;k < keyIdArr.length;k++){
                                    var keyId = keyIdArr[k];
                                    if(col["KeyId"] === keyId)
                                        col["KeyName"] = value;
                                }
                            }
                        }
                    },
                    setVisible : function(details,keyIds,value){
                        if(typeof(keyIds) === "undefined" || keyIds === "")
                            return;
                        var keyIdArr = keyIds.split(",");
                        for(var i = 0;i < details.length;i++){
                            var detail = details[i];
                            for(var j = 0;j < detail["groupColArray"].length;j++){
                                var col = detail["groupColArray"][j];
                                for(var k = 0;k < keyIdArr.length;k++){
                                    var keyId = keyIdArr[k];
                                    if(col["KeyId"] === keyId)
                                        col["Hide"] = (!value);
                                }
                            }
                        }
                    },
                    setRequired : function(details,keyIds,value){
                        if(typeof(keyIds) === "undefined" || keyIds === "")
                            return;
                        var keyIdArr = keyIds.split(",");
                        for(var i = 0;i < details.length;i++){
                            var detail = details[i];
                            for(var j = 0;j < detail["groupColArray"].length;j++){
                                var col = detail["groupColArray"][j];
                                for(var k = 0;k < keyIdArr.length;k++){
                                    var keyId = keyIdArr[k];
                                    if(col["KeyId"] === keyId)
                                        col["ColRequired"] = (value ? "1" : "0");
                                }
                            }
                        }
                    },
                    setReadOnly : function(details,keyIds,value){
                        if(typeof(keyIds) === "undefined" || keyIds === "")
                            return;
                        var keyIdArr = keyIds.split(",");
                        for(var i = 0;i < details.length;i++){
                            var detail = details[i];
                            for(var j = 0;j < detail["groupColArray"].length;j++){
                                var col = detail["groupColArray"][j];
                                for(var k = 0;k < keyIdArr.length;k++){
                                    var keyId = keyIdArr[k];
                                    if(col["KeyId"] === keyId)
                                        col["ReadOnly"] = value;
                                }
                            }
                        }
                    },
                    setButton : function(details,keyIds,value,btFunction){
                        if(typeof(keyIds) === "undefined" || keyIds === "")
                            return;
                        var keyIdArr = keyIds.split(",");
                        for(var i = 0;i < details.length;i++){
                            var detail = details[i];
                            for(var j = 0;j < detail["groupColArray"].length;j++){
                                var col = detail["groupColArray"][j];
                                for(var k = 0;k < keyIdArr.length;k++){
                                    var keyId = keyIdArr[k];
                                    if(col["KeyId"] === keyId){
                                        if(value){
                                            col["ColButton"] = value;
                                            col["ColButtonValue"] = "...";
                                            col["ColUIGridClick"] = btFunction;
                                        }else{
                                            col["ColButton"] = value;
                                            col["ColButtonValue"] = "";
                                            col["ColUIGridClick"] = "";
                                        }
                                    }
                                }
                            }
                        }
                    },
                    setCheckFormat : function(details,keyIds,value){
                    	if(typeof(keyIds) === "undefined" || keyIds === "")
                            return;
                        var keyIdArr = keyIds.split(",");
                        for(var i = 0;i < details.length;i++){
                            var detail = details[i];
                            for(var j = 0;j < detail["groupColArray"].length;j++){
                                var col = detail["groupColArray"][j];
                                for(var k = 0;k < keyIdArr.length;k++){
                                    var keyId = keyIdArr[k];
                                    if(col["KeyId"] === keyId)
                                        col["ColCheckFormat"] = value;
                                }
                            }
                        }
                    }
				};
			})
			
	.factory(
			'$model',
			function($http,$group,$rootScope,$ionicScrollDelegate,$ionicModal,$ionicLoading,$ionicPopup, $filter,$state,dynamicFilter,
					$TemplatePart,$timeout,i18nService) {
				return {
					init : function($scope,param){
						//处理大数据字段
					    $scope.dealHtmlData = function (data) {
					        var reportDetail = {};
					        if(data && data.length !== 0){
					            //12288 --ASCII全角空格:12288，对应半角空格:32
					            var arr = data.split(String.fromCharCode(12288));
					            arr.forEach(function (i) {
					                if(i.indexOf('@') > -1){
					                    reportDetail[i.substr(0, i.indexOf('@'))] = i.substring(i.indexOf('@')+1);
					                }
					            })
					        }
					        return reportDetail;
					    };
						$scope.setListGroupParam = function(){
							$scope.listGroupColId = "";
						}
						$scope.doAction = function(objID,groupID){
							$TemplatePart.findTemplet($scope,$scope.details,$scope.detailInfo,$scope.detailInfo[objID],groupID,true,false,false);
						}
                        /**
						 * to-detail广播加载完后执行事件
						 * 可重写
                         */
						$scope.toDetailAfter = function(){};
                        /**
						 * $list服务中to-listDetailInfo广播加载完成后执行事件
						 * 可重写
                         */
						$scope.toListDetailAfter = function(){};
						//detailList选择事件
				        $scope.chooseDetail = function(item,index,flag){
				        	var modelUrl = "templates/common/commonDetailListInfo.html";
				        	$scope.detailListIndex = index;
				        	$scope.selectedDetailListItem = item;
				        	$scope.$emit('to-selectedDetailListItem',item);
				        	if(flag){
				        		$scope.chooseDetailFlag = true;
				        		$scope.detailModalQueryParam = {};
				        		$ionicModal.fromTemplateUrl(modelUrl, {
				        			scope: $scope,
				        			backdropClickToClose: false
				        		}).then(function (modal) {
				        			//判断如果业务条线为空，提示并不弹出复选框
				        			$scope.modal = modal;
				        			$scope.modal.show();
				        			var detailModalQueryParam = {url:"",queryData:{}};
				        			$scope.setDetailModalQueryParam(modal,detailModalQueryParam);
				        			$timeout(function () {
				        				$scope.$broadcast('to-listDetailInfo',detailModalQueryParam);
				        			}, 100);
				        		});
				        	}
						}
				        $scope.$on("to-selectedDetailListItem",function(e,data){
							$scope.selectedDetailListItem = data;
						})
						$scope.$on("to-tabGroupLength",function(e,data){
							$scope.tabGroupLength = data;
						});
				        Date.prototype.format = function(fmt) {
				        	var o = {
                                "M+" : this.getMonth()+1,                 //月份
                                "d+" : this.getDate(),                    //日
                                "h+" : this.getHours(),                   //小时
                                "m+" : this.getMinutes(),                 //分
                                "s+" : this.getSeconds(),                 //秒
                                "q+" : Math.floor((this.getMonth()+3)/3), //季度
                                "S"  : this.getMilliseconds()             //毫秒
                            };
                            if(/(y+)/.test(fmt)) {
                                    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
                            }
                             for(var k in o) {
                                if(new RegExp("("+ k +")").test(fmt)){
                                     fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
                                 }
                             }
                            return fmt;
                        }
                        /**
						 * /Accounting/js/loan/term/rateterm.js getLoanExecuteRate
                         * @param baseRate
                         * @param rateFloatType
                         * @param rateFloat
                         * @returns {*}
                         */
				        var getLoanExecuteRate = function(baseRate,rateFloatType,rateFloat){
				        	if(rateFloatType == "0" || rateFloatType == 0){
				        		return baseRate*(1.0+rateFloat/100.0);
				        	}else if(rateFloatType == "1" || rateFloatType == 1){
				        		//return baseRate+rateFloat/100.0;
				        		return baseRate+rateFloat;
				        	}else{
				        		return baseRate;
				        	}
				        };
                        /**
						 * /Accounting/js/loan/term/rateterm.js calcBusinessRate
                         * @param currency
                         * @param packFlag
                         */
                        $scope.calcBusinessRate = function(currency,packFlag){
				        	var businessRate = $scope.packObj[packFlag]["BusinessRate"];
				        	var objectNo = $scope.packObj[packFlag]["ObjectNo"];
				        	var objectType = $scope.packObj[packFlag]["ObjectType"];
				        	//calcBaseRate begin
				        	var baseRateType = $scope.packObj[packFlag]["BaseRateType"];
                            var rateUnit = $scope.packObj[packFlag]["RateUnit"];
                            var baseRateGrade = $scope.packObj[packFlag]["BaseRateGrade"];
                            if(typeof(baseRateType) == "undefined" || baseRateType == "" || baseRateType == null)return;
                            if(typeof(baseRateGrade) == "undefined" || baseRateGrade == "" || baseRateGrade == null)return;
                            var baseRate = $group.RunMethod("BusinessManage","GetBaseRateByTerm",objectType + "," + objectNo + "," + baseRateType + "," + rateUnit + "," + baseRateGrade + "," + currency);
                            if(baseRate === 0 || baseRate.length === 0){
                                appIonicLoading.show({
                                    template: "请检查是否已经维护基准利率！",
                                    animation: 'fade-in',
                                    showBackdrop: true,
                                    duration: 2000
                                });
                                return;
                            }
                            $scope.packObj[packFlag]["BaseRate"] = (baseRate * 1.0).toFixed(6);
                            //calcBaseRate end

				           	var baseRate = $scope.packObj[packFlag]["BaseRate"];
				           	if(typeof(baseRate) == "undefined" || baseRate == "" || baseRate == 0) return;

				           	var rateFloatType = $scope.packObj[packFlag]["RateFloatType"];
				           	if(typeof(rateFloatType) == "undefined" || rateFloatType.length == 0) return;

				           	var businessType = "";
				           	var rateFloat = $scope.packObj[packFlag]["RateFloat"];
				           	if(objectType=="jbo.app.BUSINESS_APPLY")
				           		businessType = $group.RunMethod("BusinessManage","evilliveBusinessType",objectNo );
				           	else if(objectType=="jbo.app.FLOW_OPINION")
				           		businessType = $group.RunMethod("BusinessManage","getOpinionBusinessType",objectNo );

				           	if(businessType!="1110026" || (objectType!="jbo.app.BUSINESS_APPLY" && objectType!="jbo.app.FLOW_OPINION") ){
				           		if(rateFloat=="") rateFloat = 0 ;
				           	   	rateFloat =  (rateFloat * 1.0).toFixed(6);
				           	   	$scope.packObj[packFlag]["RateFloat"] = rateFloat;
				           		var loanRate = getLoanExecuteRate(baseRate * 1.0,rateFloatType + "",rateFloat * 1.0);
				           	   	if(typeof(loanRate) == "undefined" || loanRate.length == 0){
				           	   		appIonicLoading.show({
						    		   template: "未获取到执行利率！",
						    		   animation: 'fade-in',
						    		   showBackdrop: true,
						    		   duration: 2000
						    	    });
				           	   		return;
				           	   	}
				           		if(loanRate < 0){
				           			appIonicLoading.show({
						    		   template: "输入的执行利率不能小于0！",
						    		   animation: 'fade-in',
						    		   showBackdrop: true,
						    		   duration: 2000
						    	    });
				           			return;
				           		}
				           		$scope.packObj[packFlag]["BusinessRate"] = loanRate.toFixed(6);
				           	}else{
				           		if(rateFloat=="") return;
				           		rateFloat = (rateFloat * 1.0).toFixed(6);
				           	   	$scope.packObj[packFlag]["RateFloat"] = rateFloat;
				           		var loanRate = getLoanExecuteRate(baseRate * 1.0,rateFloatType + "",rateFloat * 1.0);
				           		if(typeof(loanRate) == "undefined" || loanRate.length == 0){
				           	   		appIonicLoading.show({
						    		   template: "未获取到执行利率！",
						    		   animation: 'fade-in',
						    		   showBackdrop: true,
						    		   duration: 2000
						    	    });
				           	   		return;
				           	   	}
				           		if(loanRate < 0){
				           			appIonicLoading.show({
						    		   template: "输入的执行利率不能小于0！",
						    		   animation: 'fade-in',
						    		   showBackdrop: true,
						    		   duration: 2000
						    	    });
				           			return;
				           		}
				           		$scope.packObj[packFlag]["BusinessRate"] = (loanRate*1.0).toFixed(6);
				           		if(loanRate < baseRate * 1.1){
				           			//个人赎楼贷款贷款       利率不低于基准利率的1.1倍!
				           			appIonicLoading.show({
						    		   template: "贷款利率应不低于基准利率的1.1倍！",
						    		   animation: 'fade-in',
						    		   showBackdrop: true,
						    		   duration: 2000
						    	    });
				           			$scope.packObj[packFlag]["RateFloat"] = "";
				           			$scope.packObj[packFlag]["BusinessRate"] = "";
				           	 		return;
				           	 	}
				           	}
				        };

                        /**
						 * 修改期限时重新加载利率组件
                         */
                        $scope.reloadRateSegment = function() {
                            var packFlag = "RatePart";
                            $scope.packObj[packFlag] = {};
                            $scope.packItems[packFlag] = [];
                            $scope.detailInfo["LoanRateTermID"] = "";
                        };

                        /**
						 * 获取列表查询条件中填入的值
						 * 不可复写
                         * @param listParam
                         */
						$scope.setListQueryParam = function(listParam){
							angular.forEach($scope.listGroup.group, function(item, index) {
								if(item["SearchShow"] === "1")
									listParam[item.ColId] = item["Val"];
							});
						}
						//设置加载详情页list数据参数
						$scope.setDetailListParam = function(detailListParam){
							if($scope.selectedMenuItem["ColId"] !== "undefined" &&
									typeof($scope.selectedMenuItem["ColId"]) !== "undefined"){
								detailListParam["Status"] = $scope.selectedMenuItem["ColId"];
							}
						}
                        /**
						 * 查询列表数据所需参数
						 * 可重写
                         * @param listParam
                         */
						$scope.setListParam = function(listParam){
							if($scope.selectedMenuItem["ColId"] !== "undefined" &&
									typeof($scope.selectedMenuItem["ColId"]) !== "undefined"){
								listParam["Status"] = $scope.selectedMenuItem["ColId"];
							}
						}
						//获取List列表选中数据
						$scope.getSelectedListItem = function(){
							return $scope.selectedListItem;
						}
						//点击获取并弹出业务选择模态框方法
						$scope.selectBusinessType = function (ColId) {
							$scope.loanType = {};
							$scope.loanType["ItemNo"] = "";
							$scope.ColId = ColId;
							$ionicModal.fromTemplateUrl('templates/market/marketModelView/businessTypeModal.html', {
								scope: $scope,
								backdropClickToClose: false
							}).then(function (modal) {
								//判断如果业务条线为空，提示并不弹出复选框
								/*$scope.loanType = $filter("filter")($scope.loantype,$scope.detailInfo.LOANTYPE);*/
								$scope.modal = modal;
								$scope.modal.show();
							});
						};
						//接收业务选择模态框传过来的数据
						$scope.$on('to-BusinessType',function(e,data){
							angular.forEach($scope.listGroup.group, function(item, index) {
								if(item["ColId"] === $scope.ColId){
									item["Val"] = data.key;
									item["ValName"] = data.value;
									$scope.ColId = "";
								}
							});
						});
						//加载模态选择页面
						$scope.selectCatalogModal = function(selectCatalogParam){
							$ionicModal.fromTemplateUrl('templates/common/commonSelectCatalogModal.html', {
				                scope: $scope,
				                backdropClickToClose: false
				            }).then(function (modal) {
				                $scope.modal = modal;
				                $scope.modal.show();
				                runServiceWithSession($http, $ionicLoading,
				                		$ionicPopup, $state, "SelectCatalog",selectCatalogParam,
				                		function (data, status) {
				                	$scope.jsonDataTree = transData(
				                			data["array"], 'key', 'pid',
				                	'array');
				                	var parentId = document
				                	.getElementById("parent");
				                	$scope.filter = {};
				                	dynamicFilter.init($scope, parentId, "filter",$scope.jsonDataTree, true);
				                });
				            });
						}
						//模态选择页面确定事件
						$scope.modalConfirm = function () {
							$scope.confirm($scope.filter.confirm());
				        };
				        $scope.confirm = function(dataParam){$scope.modal.remove();}
				        //模态选择页面取消事件
				        $scope.modalCancel = function () {
				        	$scope.chooseDetailFlag = false;
				            $scope.modal.remove();
				        };
				        //UIGrid模态选择页面取消事件
				        $scope.UIGridModalCancel = function () {
				        	$scope.UIGridModal.remove();
				        };
				        $scope.setDetailModalQueryParam = function(modal,detailModalQueryParam){}

				        /**
						 * 作用页面：通用页面-中间列表部分-右上角查询
                         * 作用：查询中存在<select>标签的，获取Options
                         * 不可复写
                         * @param groupId APP_LIST_GROUP.GroupID
                         * @param colId APP_LIST_GROUP.ColID
                         * @param param 参数
                         */
						$scope.selectOptions = function (groupId,colId,param) {
				        	var codeQueryParam = {
				        		GroupId : groupId,
								ColId : colId,
								Param : angular.toJson(param)
							};
							runServiceWithSession($http, $ionicLoading,
									$ionicPopup, $state, "SelectCodeQuery", codeQueryParam,
								function (data,status) {
									$scope.queryObjOptions[colId] = data["array"];
							});
						};

                        /**
						 * 作用页面：通用页面-中间列表部分-右上角查询
                         * 作用：查询中存在<select>标签的，设置参数用来获取标签的Options
                         * 可复写
                         */
				        $scope.setSelectOptionsParam = function(){
				        	var param = {};
				        	return param;
						};
                        /**
						 * 根据APP_LIST_GROUP的值筛选返回的列表数据，且删除服务器端传回的CLASSCODE（存在两个ClassCode）
                         * @param data
                         * @returns {Array}
                         */
						$scope.getRealListData = function(data){
							var tmpResult = [];
							angular.forEach(data, function(resultItem, resultIndex) {
								var tmpObj = {};
								angular.forEach($scope.listGroup.group, function(groupItem, groupIndex) {
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
						//控制用户信息展示页面模块的闭合状态
						$scope.showOrNot = function (item) {
							if (item.showGroup) {
								item.showGroup = false;
							} else {
								item.showGroup = true;
								$ionicScrollDelegate.$getByHandle("detailScrollHandle").scrollBy(0, 0, true);
							}
						};
						//控制搜索框的闭合状态
						$scope.showSearchBar = function () {
							if ($scope.listSearchFlag) {
								$scope.listSearchFlag = false;
							} else {
								$scope.listSearchFlag = true;
							}
						}
						//UIGrid控制搜索框的闭合状态
						$scope.UIGridShowSearchBar = function () {
							if ($scope.UIGridSearchFlag) {
								$scope.UIGridSearchFlag = false;
							} else {
								$scope.UIGridSearchFlag = true;
							}
						}
						//清空查询信息
						$scope.clearData = function () {
							for(var i in $scope.listGroup.group){
								$scope.listGroup["group"][i]["Val"]  = "";
								$scope.listGroup["group"][i]["ValName"]  = "";
							}
						}
						//UIGrid清空查询信息
						$scope.UIGridClearData = function () {
						}
						//模糊查询方法
						$scope.searchInfo = function () {
							//关闭查询搜索框
							$scope.listSearchFlag = false;
							//重置页面
							appIonicLoading.show({
								template: '搜索中',
								animation: 'fade-in',
								showBackdrop: true,
								duration: 1000
							});
							$scope.refresh();
						};
						//UIGrid模糊查询方法
						$scope.UIGridSearchInfo = function () {
							//关闭查询搜索框
							$scope.UIGridSearchFlag = false;
							//重置页面
							appIonicLoading.show({
								template: '搜索中',
								animation: 'fade-in',
								showBackdrop: true,
								duration: 1000
							});
							var uiGridColumnFilters = $scope.UIGridColumnFilters;
							var SearchParam = "";
							angular.forEach(uiGridColumnFilters, function(item, index) {
								if(index === uiGridColumnFilters.length - 1){
									if(item["val"] === ""){
										SearchParam += null;
									}else{
										SearchParam += item["val"];
									}
								}else{
									if(item["val"] === ""){
										SearchParam += null + ",";
									}else{
										SearchParam += item["val"] + ",";
									}
								}
                			});
							$scope.uiGridParam["SearchParam"] = SearchParam;
							$scope.uiGridParam["SearchFlag"] = true;
							var result = $group.business($scope.uiGridParam);
		        			$scope.$broadcast('to-uiGrid',result);
		        			angular.forEach(uiGridColumnFilters, function(item, index) {
		        				$scope.UIGridColumnFilters[index]["val"] = item["val"];
                			});
						};
						//设置业务关联流水号
						$scope.setSerialNo = function(serialNo){}
						//获取业务关联流水号
						$scope.getSerialNo = function(tableName,codeNo){
							runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
									"OperateContract", {Type:"getSerialNo",Flag : tableName,SerialNo:codeNo}, function (data, status) {
									if (data.Flag != "Success") {
										if(data["Msg"] === "" || data["Msg"] ===null){
											data["Msg"] = "操作失败，请与系统管理员联系！";
										}
										$ionicLoading.show({
											title: "业务处理",
											template: data["Msg"],
											duration: 3500
										});
										return false;
									} else {
										$scope.setSerialNo(data["Msg"]);
									}
							});
						};

						$scope.checkDataCompleted = function(details,detailInfo,detailInfoNoUpdate,dataCheck){
							var checkFlag = true;
							for(var i = 0;i < details.length;i++){
								var detail = details[i];
								for(var j = 0;j < detail["groupColArray"].length;j++){
									var col = detail["groupColArray"][j];
									if(col["Hide"] === true || col["ColRequired"] !== "1")
										continue;
									if(col["ColUpdateable"] === "1"){
										var inputValue = detailInfo[col["KeyId"]];
                                        if(inputValue === null || inputValue === "" ||
                                            inputValue === "undefined" || typeof(inputValue) === "undefined"){
                                        	dataCheck[col["KeyId"]] = true;
                                            checkFlag = false;
										}else
                                            dataCheck[col["KeyId"]] = false;
									}else{
                                        var inputValue = detailInfoNoUpdate[col["KeyId"]];
                                        if(inputValue === null || inputValue === "" ||
                                            inputValue === "undefined" || typeof(inputValue) === "undefined"){
                                            dataCheck[col["KeyId"]] = true;
                                            checkFlag = false;
                                        }else
                                            dataCheck[col["KeyId"]] = false;
									}
								}
							}
							if(!checkFlag){
                                $ionicLoading.show({
                                    title: "业务处理",
                                    template: "请确认数据输入是否完整！",
                                    duration: 1500
                                });
							}
							return checkFlag;
						};

						$scope.dataFormatAdjust = function(detailInfo){
							var copyDetailInfo = angular.copy(detailInfo);
                            $.each(copyDetailInfo,function(key,value){
                                if(angular.isDate(value) && value.format("yyyy/MM/dd")!="NaN/aN/aN"){
                                    copyDetailInfo[key] = $filter('date')(value, 'yyyy/MM/dd');
                                }else if(angular.isDate(value)){
                                    copyDetailInfo[key] ="";
                                }
                            });
                            return copyDetailInfo;
						};
						//获取模版可修改数据
						$scope.getModelNoReadOnlyData = function(tmpFlag){
							var dataParam;
							var dataInfo;
							var dataCheck;
							var modelNoReadOnlyData = {};
							modelNoReadOnlyData["OperateFlag"] = true;
							if(tmpFlag && tmpFlag !== "Frame"){//detialList所选详情
								if(tmpFlag === "Frame1"){//收款人清单审批详情页面用的是保存并提交按钮，对象用的是$scope.detailDataParam;$scope.detailInfo;$scope.detailCheck，在js中获取数据时，tmpFlag为Frame走的是该$scope.detailListDataParam，该对象undefined
									dataParam = $scope.detailDataParam;
									dataInfo = $scope.detailInfo;
									dataCheck = $scope.detailCheck;
								}else{
									dataParam = $scope.detailListDataParam;
									dataInfo = $scope.detailListInfo;
									dataCheck = $scope.detailListCheck;
								}

							}else if(tmpFlag === "Frame"){
								dataParam = $scope.detailDataParam1;
								dataInfo = $scope.detailInfo1;
								dataCheck = $scope.detailCheck1;
							}else{//list所选详情
								dataParam = $scope.detailDataParam;//原始数据
								dataInfo = $scope.detailInfo;//最新数据
								dataCheck = $scope.detailCheck;//是否检查
								if(!dataParam){
									dataParam = $scope.detailListDataParam;
									dataInfo = $scope.detailListInfo;
								}
								if(!dataCheck){
									dataCheck = $scope.detailListCheck;
								}
							}
							$.each(dataParam,function(oldName,oldValue){
								$.each(dataInfo,function(newName,newValue){
									if(oldName === newName){
										if(dataCheck[newName] === true || dataCheck[newName] === false){
											if(newValue == null || newValue == "" ||
													newValue == "undefined" || typeof(newValue) == "undefined"){

												dataCheck[newName] = true;
												modelNoReadOnlyData["OperateFlag"] = false;
											}else{
												dataCheck[newName] = false;
											}
										}
										if(angular.isDate(newValue)){
											modelNoReadOnlyData[newName] = $filter('date')(newValue, 'yyyy/MM/dd');
										}else{
											modelNoReadOnlyData[newName] = newValue;
										}
									}
								})
							});
							if(tmpFlag && tmpFlag !== "Frame"){
								$scope.detailListCheck = dataCheck;
							}else if(tmpFlag === "Frame"){
								$scope.detailCheck1 = dataCheck;
							}else{
								$scope.detailCheck = dataCheck;
							}
							return modelNoReadOnlyData;
						}
						//打开模态页(可重写)
				        $scope.showModal = function(pageUrl){
				            $ionicModal.fromTemplateUrl(pageUrl, {
				                scope: $scope,
				                backdropClickToClose: false
				            }).then(function (modal) {
				            	//判断如果业务条线为空，提示并不弹出复选框
			            		$scope.modal = modal;
			            		$scope.modal.show();
			            	})
				        }
				        $scope.hideModal = function () {
				            $scope.modal.remove();
				        }
				        //加载点选框列表
				        $scope.$on("to-uiGrid",function(e,data){
				        	$scope.UIGridType = data["UIGridType"];
				        	if($scope.UIGridType === "Grid") {
                                $scope.UIGridData = [];
                                $scope.UIGridColumnDefs = data["UIGridColumnDefs"];
                                $scope.UIGridColumnFilters = data["UIGridColumnFilters"];
                                //国际化；
                                i18nService.setCurrentLang("zh-cn");
                                $scope.gridOptions = {
                                    data: $scope.UIGridData,
                                    columnDefs: $scope.UIGridColumnDefs,
                                    enableFiltering: false,
                                    enableSorting: true, //是否排序
                                    useExternalSorting: false, //是否使用自定义排序规则
                                    enableGridMenu: true, //是否显示grid 菜单
                                    showGridFooter: false, //是否显示grid footer
                                    enableHorizontalScrollbar: 1, //grid水平滚动条是否显示, 0-不显示  1-显示
                                    enableVerticalScrollbar: 0, //grid垂直滚动条是否显示, 0-不显示  1-显示

                                    //-------- 分页属性 ----------------
                                    enablePagination: true, //是否分页，默认为true
                                    enablePaginationControls: true, //使用默认的底部分页
                                    paginationPageSizes: [10, 15, 20], //每页显示个数可选项
                                    paginationCurrentPage: 1, //当前页码
                                    paginationPageSize: 10, //每页显示个数
                                    //paginationTemplate:"<div></div>", //自定义底部分页代码
                                    totalItems: 0, // 总数量
                                    useExternalPagination: true,//是否使用分页按钮


                                    //----------- 选中 ----------------------
                                    enableFooterTotalSelected: false, // 是否显示选中的总数，默认为true, 如果显示，showGridFooter 必须为true
                                    enableFullRowSelection: true, //是否点击行任意位置后选中,默认为false,当为true时，checkbox可以显示但是不可选中
                                    enableRowHeaderSelection: true, //是否显示选中checkbox框 ,默认为true
                                    enableRowSelection: true, // 行选择是否可用，默认为true;
                                    enableSelectAll: false, // 选择所有checkbox是否可用，默认为true;
                                    enableSelectionBatchEvent: true, //默认true
                                    /*isRowSelectable: function(row){ //GridRow
                                       if(row.entity.age > 45){
                                           row.grid.api.selection.selectRow(row.entity); // 选中行
                                       }
                                    },*/
                                    modifierKeysToMultiSelect: false,//默认false,为true时只能 按ctrl或shift键进行多选, multiSelect 必须为true;
                                    multiSelect: false,// 是否可以选择多个,默认为true;
                                    noUnselect: false,//默认false,选中后是否可以取消选中
                                    selectionRowHeaderWidth: 30,//默认30 ，设置选择列的宽度；

                                    //---------------api---------------------
                                    onRegisterApi: function (gridApi) {
                                        $scope.gridApi = gridApi;
                                        //分页按钮事件
                                        gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                                            if (getPage) {
                                                getPage(newPage, pageSize);
                                            }
                                        });
                                        //行选中事件
                                        $scope.gridApi.selection.on.rowSelectionChanged($scope, function (row, event) {
                                            if (row.isSelected) {
                                                $scope.UIGridSelectedRow = row.entity;
                                            } else {
                                                $scope.UIGridSelectedRow = {};
                                            }
                                        });
                                    }
                                };
                                var getPage = function (curPage, pageSize) {
                                    var firstRow = (curPage - 1) * pageSize;
                                    $scope.gridOptions.totalItems = data["UIGridData"].length;
                                    $scope.gridOptions.data = data["UIGridData"].slice(firstRow, firstRow + pageSize);
                                    //或者像下面这种写法
                                    $scope.UIGridData = data["UIGridData"].slice(firstRow, firstRow + pageSize);
                                };
                                getPage(1, $scope.gridOptions.paginationPageSize);
                            }else if($scope.UIGridType === "TreeView") {
				        		$scope.UITreeData = data["UITreeData"];
                                $scope.UITreeData["options"]["isSelectable"] =  function(node) {
                                    $ionicScrollDelegate.$getByHandle('UITreeScroll').resize();
                                    var children = node.children;
                                    return children.length===0;
                                };
                                $scope.UITreeData["onSelection"] = function(selectedNode,selected){
				        			if(selected)
				        				$scope.UITreeData["selectedData"] = selectedNode;
				        			else
				        				delete $scope.UITreeData["selectedData"];
								}
                            }
						});
				        //点选框选择事件
				        $scope.doClick = function(flag){
                            $scope.uiGridParam = {
                                ClassName : "com.amarsoft.webservice.util.UIGridUtil",
                                MethodName : "getUIGridInfo",
                                SelName : "",
                                SelFieldId : "",
                                SelFieldName : " ",
                                ParamId : "",
                                ParamValue : "",
                                SearchParam : "",
                                SearchFlag : false,
                                QueryPermit : true,
                                Transaction:"null"
                            };
                            flag.call(this,$scope.uiGridParam);
                            if(!$scope.uiGridParam["QueryPermit"])
                            	return;
				        	$ionicModal.fromTemplateUrl("templates/common/commonUiGrid.html", {
			        			scope: $scope,
			        			backdropClickToClose: false
		        			}).then(function (modal) {
			        			//判断如果业务条线为空，提示并不弹出复选框
			        			$scope.UIGridModal = modal;
			        			$scope.UIGridModal.show();

			        			$scope.doSure = function(){
			        				var beSelected = true;
			        				if($scope.UIGridType === "Grid"){
			        					if($scope.gridApi.selection.getSelectedCount() === 0)
			        						beSelected = false;
									}else if($scope.UIGridType === "TreeView"){
			        					if(typeof($scope.UITreeData["selectedData"]) === "undefined")
			        						beSelected = false;
									}
									if(!beSelected){
			        					$ionicLoading.show({
											title: "业务处理",
											template: "请选择一条数据！",
											duration: 1500
										});
			        					return;
									}
			        				$scope.doClickSure();
			        				//关闭搜索框
			        				if($scope.UIGridSearchFlag){
							        	$scope.UIGridSearchFlag = false;
							        }
			        				$scope.UIGridModal.remove();
			        			};
			        			var result = $group.business($scope.uiGridParam);
			        			$scope.$broadcast('to-uiGrid', result);
		        			});
				        }
				      	//UIGrid模态选择页面取消事件
				        $scope.UIGridModalCancel = function () {
					        if($scope.UIGridSearchFlag){
					        	$scope.UIGridSearchFlag = false;
					        }	
				        	$rootScope.selectCatalogModalStyle = $rootScope.selectCatalogModalStyleTemp;
				        	$scope.UIGridModal.remove();
				        };
				        $scope.doClickSure = function(){
				        }
				        //点选查询当前客户经理下所有用户
				        $scope.chooseCustomerInfo = function(uiGridParam){
			        		uiGridParam["SelName"] = "SelectManagerCustomer1";
			        		uiGridParam["SelFieldId"] = "CustomerID,CustomerName,CertID,CertTypeName";
			        		uiGridParam["SelFieldName"] = "客户编号,客户名称,证件编号,证件类型";
			        		uiGridParam["ParamId"] = "INPUTUSERID";
			        		uiGridParam["ParamValue"] = AmApp.userID;
			        		$scope.doClickSure = function(){
			        			if($scope.detailListFlag){
			        				$scope.detailListInfo["PayeeID"] = $scope.UIGridSelectedRow["CustomerID"];
			        				$scope.detailListInfo["PayeeName"] = $scope.UIGridSelectedRow["CustomerName"];
			        			}else{
			        				$scope.detailInfo["PayeeID"] = $scope.UIGridSelectedRow["CustomerID"];
			        				$scope.detailInfo["PayeeName"] = $scope.UIGridSelectedRow["CustomerName"];
			        			}
			        			if($scope.detailListInfo){
			        				$scope.detailListInfo["PayeeID"] = $scope.UIGridSelectedRow["CustomerID"];
			        				$scope.detailListInfo["PayeeName"] = $scope.UIGridSelectedRow["CustomerName"];
			        			}
					        };
						}
					}
				};
			})
			//组件
			.factory('$TemplatePart', function($group,$http, $ionicLoading, $ionicPopup, $state,i18nService,$filter) {
                /**
				 * 加载利率组件模版数据
                 * @param $scope
                 * @param packFlag 利率组件数据包名
                 * @param modelNo 模板编号
                 * @param objectNo 对象编号
                 * @param objectType 对象类型
                 * @param termId 组件编号
                 * @param BaseRate 基准利率
                 * @param BaseRateGrade 基准利率档次
                 */
				var loadRatePackInfo = function($scope,packFlag,modelNo,objectNo,objectType,termId,BaseRate,BaseRateGrade){
					var status = '0';
					if(packFlag === "OLDRatePart")
						status = "2";
					else{
						if(objectType === "jbo.app.ACCT_LOAN")
							status = "1";
					}
					runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,"SelectObjectInfo",
					{
	  					modelNo:modelNo,
	  					ObjectNo:objectNo,
	  					ObjectType:objectType,
	  					TermID:termId,
						Status:status,
	  					ReturnType : "Info"
					}, function (data, status) {
						if(typeof(data["array"]) === "object"){
							for (var i = 0; i < data["array"].length; i++) {
								//增加参数，是否展示，页面载入时均展示
								data["array"][i]['showGroup'] = true;
								//获取模版json中的groupColArray的数据，按照json格式中的 <KeyId：Value>存放到$scope.marketInfo中做绑定并用于页面展示
								var groupColArray = data["array"][i].groupColArray;
								var size = 0;
								if(groupColArray !== "undefined" &&
										typeof(groupColArray) !== "undefined"){
									for(var j = 0; j < groupColArray.length;j++){
										var keyCode = groupColArray[j]["KeyId"];
										$scope.packObj[packFlag][keyCode] = groupColArray[j]["Value"];
										if(!groupColArray[j]["Hide"] || groupColArray[j]["Hide"] === "false"){
											if($scope.LoanRateTermReadOnly === "true" || $scope.LoanRateTermReadOnly){
												groupColArray[j]["ReadOnly"] = true;
											}
										}
                                        $scope.packItems[packFlag].push(groupColArray[j]);
									}

									if($scope.packObj[packFlag]["BaseRate"] === null || $scope.packObj[packFlag]["BaseRate"] === ""
										|| $scope.packObj[packFlag]["BaseRate"] === "undefined" ||
										typeof($scope.packObj[packFlag]["BaseRate"]) === "undefined"){
										$scope.packObj[packFlag]["BaseRate"] = BaseRate;
									}
									if($scope.packObj[packFlag]["BaseRateGrade"] === null || $scope.packObj[packFlag]["BaseRateGrade"] === ""
										|| $scope.packObj[packFlag]["BaseRateGrade"] === "undefined" ||
										typeof($scope.packObj[packFlag]["BaseRateGrade"]) === "undefined"){
										$scope.packObj[packFlag]["BaseRateGrade"] = BaseRateGrade;
									}
								}
							}
							runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
							"SelectObjectInfo", {modelNo:modelNo,ReturnType : "Code"}, function (data, status) {
								for (var i = 0; i < data["array"].length; i++) {
									for(var j = 0; j < $scope.packItems[packFlag].length; j++){
                                        var col = $scope.packItems[packFlag][j];
                                        if(col["ColEditStyle"] === "2" && col["KeyId"] === data["array"][i]["KeyId"])
                                            col["ColOptions"] = data["array"][i]["CodeArray"];
									}
								}

								var result = $group.business({
									ObjectNo : objectNo,
									ObjectType : objectType,
									TermID : termId,
                                    ClassName : "com.amarsoft.app.als.mobile.impl.ILoanContractImpl",
                                    MethodName : "getProductTermParas"
								});
								var productTermParas = angular.fromJson(result["productTermParas"]);
								angular.forEach(productTermParas,function (termPara,productTermID) {
									if(termPara.length > 0){
										if($scope.LoanRateTermReadOnly || $scope.LoanRateTermReadOnly === "true"){
                                            for (var i = 0; i < termPara.length; i++)
                                                if (typeof(termPara[i]["ReadOnly"]) !== "undefined")
                                                    termPara[i]["ReadOnly"] = true;
										}
										for(var i = 0; i < termPara.length; i++){
                                            for(var j = 0; j < $scope.packItems[packFlag].length; j++){
                                                var item = $scope.packItems[packFlag][j];
                                                if(item["KeyId"] !== termPara[i]["KeyId"]) continue;

                                                if(typeof(termPara[i]["Hide"]) !== "undefined")
                                                    item["Hide"] = termPara[i]["Hide"];
                                                if(typeof(termPara[i]["ReadOnly"]) !== "undefined")
                                                    item["ReadOnly"] = termPara[i]["ReadOnly"];
                                                if(typeof(termPara[i]["ColRequired"]) !== "undefined")
                                                    item["ColRequired"] = termPara[i]["ColRequired"];
                                                if(typeof(termPara[i]["ColCode"]) !== "undefined")
                                                    item["ColOptions"] = termPara[i]["ColCode"];
                                            }
										}
									}
                                });
								//基准利率档次数据库中配置存在问题，WEB端在/Accounting/js/loan/term/rateterm.js line:155强制设置为只读
								var baseRateGrade = $filter('filter')($scope.packItems[packFlag],{KeyId:'BaseRateGrade'});
								if(baseRateGrade.length > 0)	baseRateGrade = baseRateGrade[0];
								baseRateGrade["ReadOnly"] = true;

								$scope.packItems[packFlag] = $group.multiCol($scope.packItems[packFlag],2);
							});
						}
					});
				};
                /**
				 * 加载还款组件模版数据
                 * @param $scope
                 * @param objectNo 对象编号
                 * @param objectType 对象类型
                 * @param modelNo 模板编号
                 * @param TermID 组件编号
                 * @param ParKFlag
                 * @returns {boolean}
                 */
				var loadRptPackInfo = function($scope,objectNo,objectType,modelNo,TermID,packFlag){
					/*
					 * 判断是否选择为空
					 * */
					if(TermID == ""){
						return false;
					}
					var result = $group.business({
        				ObjectNo : objectNo,
        				ObjectType : objectType,
        				ModelNo : modelNo,
        				PackFlag:packFlag,
        				TermID : TermID,
        				ClassName : "com.amarsoft.app.als.mobile.impl.ILoanContractImpl",
        				MethodName : "findRPTPartList",
						TransactionType : "null"
        			});

					var rptDataList = angular.fromJson(result["rptDataList"]);
                    $scope.packObj[packFlag] = {};
                    $scope.packItems[packFlag] = [];
                    $scope.packObj[packFlag]["headers"] = [];
                    $scope.packObj[packFlag]["detailInfo"] = [];
                    $scope.packObj[packFlag]["detailInfoNoUpdate"] = [];
					angular.forEach(rptDataList,function(rptData,index){
						if(typeof(rptData["array"]) === "object"){
							//列表只有一组
							var groupColArray = rptData["array"][0]["groupColArray"];
							var detailInfo = {};
							var detailInfoNoUpdate = {};
							for(var i = 0;i < groupColArray.length;i++){
								//第一列时初始化表头
								if(index === 0){
									var header = {};
                                    header["KeyId"] = groupColArray[i]["KeyId"];
                                    header["KeyName"] = groupColArray[i]["KeyName"];
                                    header["Hide"] = groupColArray[i]["Hide"];
                                    $scope.packObj[packFlag]["headers"].push(header);
								}
								if(groupColArray[i]["ColUpdateable"] === '1')
									detailInfo[groupColArray[i]["KeyId"]] = groupColArray[i]["Value"];
								else
									detailInfoNoUpdate[groupColArray[i]["KeyId"]] = groupColArray[i]["Value"];

								if($scope.RpTermReadOnly || $scope.RpTermReadOnly === "true")
									groupColArray[i]["ReadOnly"] = true;
							}
                            $scope.packObj[packFlag]["detailInfo"].push(detailInfo);
                            $scope.packObj[packFlag]["detailInfoNoUpdate"].push(detailInfoNoUpdate);
                            $scope.packItems[packFlag].push(groupColArray);
						}
					});
		        	runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
							"SelectObjectInfo", {modelNo:modelNo,ObjectNo:objectNo,ObjectType:objectType,TermID:TermID,ReturnType : "Code"}, function (data, status) {
						for (var i = 0; i < data["array"].length; i++) {
							for(var j = 0; j < $scope.packItems[packFlag].length; j++){
								var packItem = $scope.packItems[packFlag][j];
								for(var k = 0; k < packItem.length; k++){
									var col = packItem[k];
									if(col["ColEditStyle"] === "2" && col["KeyId"] === data["array"][i]["KeyId"])
										col["ColOptions"] = data["array"][i]["CodeArray"];
								}
							}
						}
						result = $group.business({
							ObjectNo : objectNo,
							ObjectType : objectType,
							TermID : TermID,
							ClassName : "com.amarsoft.app.als.mobile.impl.ILoanContractImpl",
							MethodName : "getProductTermParas"
						});
						var productTermParas = angular.fromJson(result["productTermParas"]);
						angular.forEach(productTermParas,function(termPara,productTermID){
							if(termPara.length > 0){
								if($scope.RpTermReadOnly || $scope.RpTermReadOnly === "true") {
									for (var i = 0; i < termPara.length; i++)
										if (typeof(termPara[i]["ReadOnly"]) !== "undefined")
                                            termPara[i]["ReadOnly"] = true;
								}
								var packItem = $filter('filter')($scope.packItems[packFlag],{KeyId:'RPTTermID',Value:productTermID});
								if(packItem.length === 0) return;
                                packItem = packItem[0];
								for(var i = 0; i < termPara.length; i++){
                                    var item = $filter('filter')(packItem,{KeyId:termPara[i].KeyId});
                                    if(item.length === 0) continue;
                                    item = item[0];
									if(typeof(termPara[i]["Hide"]) !== "undefined") {
										item["Hide"] = termPara[i]["Hide"];
										var header = $filter('filter')($scope.packObj[packFlag]["headers"],{KeyId:termPara[i].KeyId})[0];
                                        header["Hide"] = termPara[i]["Hide"];
									}
									if(typeof(termPara[i]["ReadOnly"]) !== "undefined")
                                        item["ReadOnly"] = termPara[i]["ReadOnly"];
									if(typeof(termPara[i]["ColRequired"]) !== "undefined")
                                        item["ColRequired"] = termPara[i]["ColRequired"];

									if(typeof(termPara[i]["ColCode"]) !== "undefined")
                                        item["ColOptions"] = termPara[i]["ColCode"];
								}
							}
						});
					});
				};
                /**
				 * 查询利率组件信息
                 * @param $scope
                 * @param details 页面模板存储对象
                 * @param detailInfo 页面可更新字段存储对象
                 * @param packFlag 分组ID-groupID
                 * @param TermID 组件编号
                 * @param termPara 查询利率所需参数 通过setRateTempletParam、setTempletParam配置，必定包含ObjectType、ObjectNo
                 * @param ParKFlag 是否执行数据校验并新增数据
                 */
		        var findRatePack = function($scope,details,detailInfo,packFlag,TermID,termPara,ParKFlag){
                    var objectNo = termPara["ObjectNo"];
                    var objectType = termPara["ObjectType"];
                    if(objectType === "jbo.app.FLOW_OPINION") packFlag += "Frame";	//签署意见的组件对象以Frame结尾

		        	$scope.packObj[packFlag] = {};
					$scope.packItems[packFlag] = [];
					var sLoanRateTermID = detailInfo["LoanRateTermID"];
					/*--------以下为联动问题------------------------------*/
		    		// 获取当前元素节点的值
		    		var thisLoanRateTermID = TermID;
		    		/*
		    		 * 第一种情况：当前元素节点且jbo属性LoanRateTermID的值均为：空或undefined或长度为0;则return。
		    		 * 用于新增后，详情页面第一次加载时的判断；解决的问题：未选择过任何利率类型时，页面加载出现空指针异常。
		    		 * */
		            if((typeof(thisLoanRateTermID) == "undefined"
		            	|| thisLoanRateTermID==null
		            	||thisLoanRateTermID.length == 0)
		            	&&(typeof(sLoanRateTermID) == "undefined"
		            		|| sLoanRateTermID==null
		            		||sLoanRateTermID.length == 0))
		    			return;
		    		/*
		    		 * 第二种情况：jbo属性LoanRateTermID的值为：空或undefined或长度为0，
		    		 * 而当前元素节点的值不为空时，将当前元素节点的值赋给LoanRateTermID
		    		 * */
		    		if(typeof(sLoanRateTermID) == "undefined"
		    			|| sLoanRateTermID==null
		    			||sLoanRateTermID.length == 0)
		    			sLoanRateTermID=thisLoanRateTermID;
		    		/*第三种情况：jbo属性LoanRateTermID的值与当前元素节点的值不相等时；将当前元素节点的值赋给LoanRateTermID
		    		 * 解决问题：利率类型与弹出的页面不对应；及空指针异常
		    		 * */
		    		if(typeof(thisLoanRateTermID)!="undefined"
		    			&&thisLoanRateTermID!=sLoanRateTermID){
		    			sLoanRateTermID=thisLoanRateTermID;
		    		}
		    		/*----------------------------以上为联动问题增加代码------------------------------*/
		    		if(typeof(sLoanRateTermID) == "undefined" || sLoanRateTermID==null||sLoanRateTermID.length == 0) return;

		    		var currency = detailInfo["BusinessCurrency"];
		    		if(typeof(currency) == "undefined" ||currency==null|| currency.length == 0)
		    			currency = detailInfo["Currency"];
		    		if(ParKFlag){
			    		if((typeof(currency) == "undefined" || currency==null||currency.length == 0 )){
			    				appIonicLoading.show({
			    					template: "请确认业务币种不能为空！",
			    					animation: 'fade-in',
			    					showBackdrop: true,
			    					duration: 2000
			    				});
		    				detailInfo["LoanRateTermID"] = "";
				        	$scope.packObj[packFlag]["RateFloatType"] = "";
			    			return;
			    		}
		    		}
		    		$scope.Currency = currency;

		    		/*
		    		 * 期限修改：根据不同的获取方式，获取不同的利率信息组件的信息
		    		 * */
		    		var termMonth = detailInfo["TermMonth"];
		    		if(ParKFlag){
		    			if((typeof(termMonth) == "undefined" ||termMonth==null|| termMonth.length == 0)&&sLoanRateTermID.length > 0){
	    					appIonicLoading.show({
	    						template: "请输入期限！",
	    						animation: 'fade-in',
	    						showBackdrop: true,
	    						duration: 2000
	    					});
		    				detailInfo["LoanRateTermID"] = "";
		    				return;
		    			}
		    		}
		    		if(sLoanRateTermID == "RAT002"){
		    			detailInfo["RepriceType"] = "7";
                        setItemDisabled(details,"RepriceType",true);
		    		//贷款上限利率,贷款下限利率,贷款浮动利率
		    		}else if(sLoanRateTermID == "RAT001"||sLoanRateTermID == "RAT007"||sLoanRateTermID == "RAT008"){
                        detailInfo["RepriceType"] = "1";
                        setItemDisabled(details,"RepriceType",true);
		    		//合同阶段、放款阶段利率调整方式为只读
		    		}else if ("BusinessContract"==objectType || "PutOutApply"==objectType){
                        setItemDisabled(details,"RepriceType",true);
		    		}else{
                        setItemDisabled(details,"RepriceType",false);
		    		}

		    		var OccurType = "";
		    		var ApplyobjectNo = "";
		    		var ContractobjectNo = "";
		    		if("jbo.app.FLOW_OPINION"==objectType){
		    			ApplyobjectNo = $group.RunMethod("公用方法","GetColValue","Flow_Opinion,ObjectNo,OpinionNo='"+objectNo+"'");
		    			OccurType = $group.RunMethod("公用方法","GetColValue","Business_Apply,OccurType,SerialNo='"+ApplyobjectNo+"'");
		    		}else if ("BusinessContract"==objectType){
		    			ApplyobjectNo = $group.RunMethod("公用方法","GetColValue","Business_Contract,RelativeSerialNo,SerialNo='"+objectNo+"'");
	    				OccurType = $group.RunMethod("公用方法","GetColValue","Business_Apply,OccurType,SerialNo='"+ApplyobjectNo+"'");
		    		}else if ("PutOutApply"==objectType){
		    			ContractobjectNo = $group.RunMethod("公用方法","GetColValue","Business_Putout,ContractSerialNo,SerialNo='"+objectNo+"'");
		    			ApplyobjectNo = $group.RunMethod("公用方法","GetColValue","Business_Contract,RelativeSerialNo,SerialNo='"+ContractobjectNo+"'");
		    			OccurType = $group.RunMethod("公用方法","GetColValue","Business_Apply,OccurType,SerialNo='"+ApplyobjectNo+"'");
		    		}else{
		    			OccurType = $group.RunMethod("公用方法","GetColValue","Business_Apply,OccurType,SerialNo='"+objectNo+"'");
		    		}

		    		//展期业务，基准利率档次是根据展期借据期限+展期期限
					var LoanTerm;
		    		if(OccurType=="015"){
		    			if("jbo.app.FLOW_OPINION"==objectType || "BusinessContract"==objectType || "PutOutApply"==objectType){
		    				LoanTerm = $group.RunMethod("BusinessManage","LoanMaturity",ApplyobjectNo);
		    				LoanTerm=parseInt(LoanTerm);
		    			}else{
		    				LoanTerm = $group.RunMethod("BusinessManage","LoanMaturity",objectNo);
		    				LoanTerm=parseInt(LoanTerm);
		    			}
		    			termMonth = parseInt(termMonth)+LoanTerm ;
		    		}else{
		    			termMonth = parseInt(termMonth);
		    		}
		    		var termDay = $scope.detailInfo["TermDay"];
		    		if(!(typeof(termDay) == "undefined" || termDay==null||termDay.length == 0||termDay==0)){
		    			termMonth=termMonth+1;
		    		}

		    		var jboObjectType = "";
					var OT = $group.business({
        				ObjectNo : objectNo,
						ObjectType : objectType,
						ClassName : "com.amarsoft.app.als.mobile.impl.ComponentQuery",
						MethodName : "getTermObjectType"
        			});
					if(typeof(OT) != "undefined") 	jboObjectType = OT["ObjectType"];

					var ModelNo = '';
					var MN = $group.business({
        				ObjectNo : objectNo,
						ObjectType : objectType,
						TermID : sLoanRateTermID,
						ClassName : "com.amarsoft.app.als.mobile.impl.ComponentQuery",
						MethodName : "getTermModelNo"
        			});
					if(typeof(MN) != "undefined") 	ModelNo = MN["ModelNo"];

					var RateInfo = $group.business({
        				TermMonth : termMonth,
        				BusinessCurrency : $scope.Currency,
        				ClassName : "com.amarsoft.app.als.mobile.impl.ComponentQuery",
        				MethodName : "getRateInfo",
						TransactionType : "Sqlca"
        			});
					var BaseRate = RateInfo["BaseRate"];//基准利率
        			var BaseRateGrade = RateInfo["BaseRateGrade"];//基准利率档次
		        	//判断组件是否可编辑
		        	//1-1不可编辑
		        	if($scope.LoanRateTermReadOnly || $scope.LoanRateTermReadOnly === "true"){
		        		//1-1-1查询是否有数据
						var Show = $group.business({
	        				ObjectNo : objectNo,
							ObjectType : jboObjectType,
							Segment : "RATE",
							ClassName : "com.amarsoft.app.als.mobile.impl.ComponentQuery",
							MethodName : "checkRerocd",
							TransactionType : "Sqlca"
	        			})["Show"];
	        			if(!Show){//1-1-1-1.无数据
	        				//初始化加载组件所需变量
	    					$scope.packObj[packFlag] = {};
	    					$scope.packItems[packFlag] = [];
	        				return;
	        			}else{//1-1-1-2.有数据
	          				loadRatePackInfo($scope,packFlag,ModelNo,objectNo,jboObjectType,sLoanRateTermID,BaseRate,BaseRateGrade);
	        			}
		        	}else{//1-2可编辑
		        		if(ParKFlag){
		        			$group.business({
		        				ObjectNo : objectNo,
		        				ObjectType : objectType,
		        				TermID : sLoanRateTermID,
		        				ClassName : "com.amarsoft.app.als.mobile.impl.ComponentQuery",
		        				MethodName : "insertRecord"
		        			});
		        		}
		        		//加载组件模版数据
          				loadRatePackInfo($scope,packFlag,ModelNo,objectNo,jboObjectType,sLoanRateTermID,BaseRate,BaseRateGrade);
		        	}
		        };
                /**
				 * 查询还款组件信息
                 * @param $scope
                 * @param packFlag 分组ID-groupID
                 * @param TermID 组件编号
                 * @param termPara 查询还款所需参数 通过setRptTempletParam、setTempletParam配置，必定包含ObjectType、ObjectNo
                 * @param ParKFlag 是否执行数据校验并新增数据
                 */
		        var findRPTPack = function($scope,packFlag,TermID,termPara,ParKFlag){
		        	//获取加载组件所需变量
                    var objectNo = termPara["ObjectNo"];
                    var objectType = termPara["ObjectType"];
                    if(objectType === "jbo.app.FLOW_OPINION") packFlag += "Frame";	//签署意见的组件对象以Frame结尾
                    $scope.packObj[packFlag] = {};
                    $scope.packItems[packFlag] = [];
                    $scope.RptPackFlag = true;

        			var jboObjectType;
        			var busibessOT = $group.business({
        				ObjectNo : objectNo,
						ObjectType : objectType,
						ClassName : "com.amarsoft.app.als.mobile.impl.ComponentQuery",
						MethodName : "getTermObjectType"
        			});
        			if(busibessOT != undefined){
                        jboObjectType = busibessOT["ObjectType"];
        			}
        			var ModelNo;
        			var businessMN = $group.business({
        				ObjectNo : objectNo,
						ObjectType : objectType,
						TermID : TermID,
						ClassName : "com.amarsoft.app.als.mobile.impl.ComponentQuery",
						MethodName : "getTermModelNo"
        			});
        			if(businessMN != undefined){
        				ModelNo = businessMN["ModelNo"];
        			}

        			//判断是否可编辑
        			//1-1不可编辑
		        	if($scope.RpTermReadOnly || $scope.RpTermReadOnly === "true"){
		        		//1-1-1查询是否有数据
						var Show = $group.business({
	        				ObjectNo : objectNo,
							ObjectType : jboObjectType,
							Segment : "RPT",
							ClassName : "com.amarsoft.app.als.mobile.impl.ComponentQuery",
							MethodName : "checkRerocd",
							TransactionType : "Sqlca"
	        			})["Show"];
	        			if(!Show){//1-1-1-1.无数据
	        				$scope.RptPackFlag = false;
                            $scope.packObj[packFlag] = {};
                            $scope.packItems[packFlag] = [];
	        				return;
	        			}else{//1-1-1-2.有数据
	        				//加载组件模版数据
	          				loadRptPackInfo($scope,objectNo,jboObjectType,ModelNo,TermID,packFlag);
	        			}
		        	}else{//1-2可编辑
		        		if(ParKFlag){
		        			$group.business({
		        				ObjectNo : objectNo,
		        				ObjectType : objectType,
		        				TermID : TermID,
		        				ClassName : "com.amarsoft.app.als.mobile.impl.ComponentQuery",
		        				MethodName : "insertRecord"
		        			});
		        		}
          				loadRptPackInfo($scope,objectNo,jboObjectType,ModelNo,TermID,packFlag);
		        	}
		        }
				return {
                    /**
					 * 查询组件信息
                     * @param $scope
					 * @param details 页面模板存储对象
					 * @param detailInfo 页面可更新字段存储对象
                     * @param TermID 组件编号
                     * @param groupID 分组ID
                     * @param ParKFlag 是否执行数据校验并新增数据
                     * @param LoanRateTermReadOnly 利率组件是否只读
                     * @param RpTermReadOnly 还款组件是否只读
                     */
					findTemplet : function($scope,details,detailInfo,TermID,groupID,ParKFlag,LoanRateTermReadOnly,RpTermReadOnly) {
						var templetParam = angular.copy($scope.parkTempletParam);
                        $scope.setTempletParam(templetParam);
						$scope.RpTermReadOnly = RpTermReadOnly;
						$scope.LoanRateTermReadOnly = LoanRateTermReadOnly;
	        			if(typeof(TermID) !== "undefined" && TermID !== "" && typeof(groupID) !== "undefined" && groupID !== ""){
	        				if(groupID === "RatePart")
        						findRatePack($scope,details,detailInfo,groupID,TermID,templetParam,ParKFlag);
        					else if(groupID === "RPTPart" || groupID === "OLDRPTPart" || groupID === "NEWRPTPart")
        						findRPTPack($scope,groupID,TermID,templetParam,ParKFlag);
	        			}else{
	        				angular.forEach(details, function(item, index) {
	        					if(item["groupId"] === "RatePart" || item["groupId"] === "OLDRatePart" || item["groupId"] === "NEWRatePart"){
                                    if(item["groupId"] === "RatePart")
                                        TermID = GetValueByKeyID("LoanRateTermID", item);
                                    else if(item["groupId"] === "OLDRatePart" )
		        						TermID = GetValueByKeyID("OLDLoanRateTermID",item);
		        					else if(item["groupId"] === "NEWRatePart"){
	        							if(templetParam["ObjectType"] === "jbo.app.BACHANGE_APPLY")
		        							TermID = GetValueByKeyID("NEWLoanRateTermID",item);
	        							else
                                            TermID = GetValueByKeyID("LoanRateTermID", item);
		        					}
		        					if(TermID === "") return;
				        			$scope.setRateTempletParam(templetParam);
	        						findRatePack($scope,details,detailInfo,item["groupId"],TermID,templetParam,ParKFlag);
	        					}else if(item["groupId"] === "RPTPart" || item["groupId"] === "OLDRPTPart" || item["groupId"] === "NEWRPTPart"){
                                    if(item["groupId"] === "RPTPart")
                                        TermID = GetValueByKeyID("RPTTermID",item);
                                     else if(item["groupId"] === "NEWRPTPart"){
                                    	 TermID = GetValueByKeyID("NEWRPTTermID",item);
                                    	 if(typeof(TermID) == "undefined"){
                                    		 TermID = GetValueByKeyID("RPTTermID", item);
                                    	 }
                                     }
                                    else if(item["groupId"] === "OLDRPTPart") {
                                        if(templetParam["ObjectType"] === "jbo.app.BACHANGE_APPLY")
                                            TermID = GetValueByKeyID("OLDRPTTermID", item);
                                        else if(templetParam["ObjectType"] === "jbo.app.ACCT_LOAN_CHANGE")
                                        	TermID = GetValueByKeyID("OLDRPTTermID", item);
                                        else
                                        	TermID = GetValueByKeyID("RPTTermID", item);
                                    }
                                    if(TermID === "") return;
                                    $scope.setRptTempletParam(templetParam);
                                    findRPTPack($scope,item["groupId"],TermID,templetParam,ParKFlag);
								}
	        				});
	        			}
					}
				};
			})
			//模版增删改
			.factory('$db_operate', function($state,$ionicModal,$http, $ionicLoading, $ionicPopup,$filter,$timeout,$q) {

				var operate = function($scope,flag,tableCode,data,url,objectType,businessType){
					var defer = $q.defer();
					var OperateFlag = data.OperateFlag;
					if(flag !== "delete" && (!OperateFlag || OperateFlag === "false")){
						$ionicLoading.show({
							title: "业务处理",
							template: "请确认数据输入是否完整！",
							duration: 1500
						});
						defer.resolve(false);
						return defer.promise;
					}else{
						delete data.OperateFlag;
						var operateUrl = "";
						var paramData = {};
						var name  = "";

						if(url === "" || url === null || typeof(url) === "undefined" || url === "undefined"){
							operateUrl = "ObjectInfoAOU";
						}else{
							operateUrl = url;
						}

						if(flag === "insert"){
							name = "新增";
							paramData = {Data:angular.toJson(data),TableCode:tableCode,objectType:objectType,businessType:businessType};
						}else if(flag === "update"){
							name = "修改";
							paramData = {Data:angular.toJson(data),TableCode:tableCode,objectType:objectType,businessType:businessType};
						}else if(flag === "delete"){
							name = "删除";
							paramData  = {Data:angular.toJson(data),TableCode:tableCode,operateFlag:flag};
						}
						runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
								operateUrl, paramData, function (data, status) {
							if (data.Result != "Y") {
								if(data["ErrorMsg"] == null || data["ErrorMsg"]  == ""){
									data["ErrorMsg"] = name + "失败！";
								}
								$ionicLoading.show({
									title: "操作提示",
									template: data["ErrorMsg"],
									duration: 3500
								});
								defer.resolve(false);
							} else {
								$ionicLoading.show({
									title: "操作提示",
									template: name + "成功！",
									duration: 1000
								});
								if(flag !== "delete" && tableCode !== "0015"){
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
									}, 1000);
								}
								defer.resolve(true);
							}
						});
                        return defer.promise;
					}
				};
				return {
					insertRecord : function($scope,tableCode,insertData,url,objectType,businessType) {
						return operate($scope,"insert",tableCode,insertData,url,objectType,businessType);
					},
					updateRecord : function($scope,tableCode,UpdatetData,url,objectType,businessType){
                        return operate($scope,"update",tableCode,UpdatetData,url,objectType,businessType);
					},
					deleteRecord : function($scope,url,tableCode,deleteData){
                        return operate($scope,"delete",tableCode,deleteData,url);
					},
					updateRateSegment : function($scope,packFlag){
						if($scope.packObj[packFlag]){
							runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,"ObjectInfoAOU",
								{
									Data:angular.toJson($scope.packObj[packFlag]),
									TableCode:"0009"
								}, function (data, status) {}
							);
                        }
					},
					updateRPTSegment : function($scope,packFlag){
						if($scope.packObj[packFlag] && $scope.packObj[packFlag]["detailInfo"]){
							angular.forEach($scope.packObj[packFlag]["detailInfo"],function(item,index){
								runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,"ObjectInfoAOU",
									{
										Data:angular.toJson(item),
										TableCode:"0010"
									}, function (data, status) {}
								);
							});
                        }
					}
				};
			})
		.factory(
				'$contract',
				function($http,$ionicScrollDelegate,$ionicSideMenuDelegate,$ionicTabsDelegate,$ionicModal,$ionicLoading, $ionicPopup, $state,$timeout,$group,paging) {
					return {
						init : function($scope){
							//登记合同
							$scope.contractRegistration = function(){
								var flag="BookInContract";//登记合同标识;
								//复议的校验
				                var queryParam = {
				                    ClassName: "com.amarsoft.app.als.mobile.common.RunMethodUtil",
				                    MethodName: "RunJavaMethodSqlca",
				                    sClassName: "cn.com.tansun.sbmo.service.workflow.ReconsiderApplyVerify",
				                    sMethodName: "reconsiderContractVerify",
				                    args:"objectNo="+$scope.selectedListItem.ObjectNo
				                };
				                var result = $group.business(queryParam);
				                if(typeof(result)!="undefined" && result.length>0){
				                	$ionicLoading.show({
										template : returnValue,
										duration : 2000
									});
				        			return;
				        		}
				                
				              //【提示性检查】Modify dwkang 2017/08/01
			                    queryParam = {
			                        ClassName: "com.amarsoft.app.als.mobile.common.RunMethodUtil",
			                        MethodName: "RunJavaMethodSqlca",
			                        sClassName: "com.amarsoft.app.lending.bizlets.CheckContractRisk2",
			                        sMethodName: "checkRisk",
			                        args: "ObjectNo="+$scope.selectedListItem.ObjectNo+",CustomerID="+$scope.selectedListItem.CustomerID
			                    };
			                    result = $group.business(queryParam);
			                    $group.mustMsg(result["ReturnValue"]).then(function(returnValue) {
			                    	if (returnValue){
			                            return;
			                        }
			                    	
			                    	
			                    	//公司客户，校验批单是否存在
				                    queryParam = {
				                        ClassName: "com.amarsoft.app.als.mobile.common.RunMethodUtil",
				                        MethodName: "RunJavaMethodSqlca",
				                        sClassName: "com.amarsoft.app.apply.contract.BookInContractCheck",
				                        sMethodName: "submitCheck",
				                        args: "ObjectNo="+$scope.selectedListItem.ObjectNo
				                    };
				                    result = $group.business(queryParam);
				                    $group.mustMsg(result["ReturnValue"]).then(function(returnValue) {
				                    	if (returnValue){
				                            return;
				                        }
				                    	
				                    	//审批单有效期的校验
					                    queryParam = {
					                        ClassName: "com.amarsoft.app.als.mobile.common.RunMethodUtil",
					                        MethodName: "RunJavaMethodSqlca",
					                        sClassName: "com.amarsoft.app.apply.ApplyVerifyCheck",
					                        sMethodName: "verifyCheck",
					                        args:"objectNo="+$scope.selectedListItem.ObjectNo+",flag="+flag
					                    };
					                    result = $group.business(queryParam);
					                    $group.mustMsg(result["ReturnValue"]).then(function(returnValue) {
					                    	if (returnValue){
					                            return;
					                        }
					                    	//添加ALERT框进行确认判断
								            var confirmPopup = $ionicPopup.confirm({
								                title: '登记合同',
								                template: '你确定要根据选择的电子最终审批意见登记合同吗？确定后将根据最终审批意见生成合同？',
								                okText: '确定',
								                cancelText: '取消'
								            });
								        	confirmPopup.then(function (res) {
								                if (res) {
								                	//接收服务端返回的用户详情数据
										            runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
										            	"OperateContract", {
											        		ObjectNo : $scope.selectedListItem.ObjectNo,
											        		ObjectType : $scope.selectedListItem.ObjectType,
											        		Type : "BookInContract",
											        		Flag : "BookInContract"
											        	}, function (data, status) {
										            	if(data["Flag"] === "Success"){
										            		appIonicLoading.show({
												    		   template: "根据最终审批意见生成合同成功，合同流水号["+data["Msg"]+"]！你可前往【合同生效】模块进行合同信息编辑及生效操作！",
												    		   animation: 'fade-in',
												    		   showBackdrop: true,
												    		   duration: 2000
												    	    });
										            		$timeout(function() {
										            			$scope.refresh();
										            		}, 2000);
										            	}else{
										            		appIonicLoading.show({
												    		   template: "生成合同失败！"+data["Msg"],
												    		   animation: 'fade-in',
												    		   showBackdrop: true,
												    		   duration: 2000
												    	    });
										            	}
										            });
								                }
								            });
					                    	
					                    });
				                    });
			                    });
			                
				                
					        }
							//取消合同
							$scope.cancelContract = function(){
								//添加ALERT框进行确认判断
								var confirmPopup = $ionicPopup.confirm({
									title: '取消合同',
									template: '你确定要取消合同？',
									okText: '确定',
									cancelText: '取消'
								});
								confirmPopup.then(function (res) {
									if (res) {
										appIonicLoading.show({
											template: "正在处理中......",
											animation: 'fade-in',
											showBackdrop: true
										});
										//接收服务端返回的用户详情数据
										runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
												"OperateContract", {
											ObjectNo : $scope.selectedListItem.SerialNo,
											ObjectType : "BusinessContract",
											Type : "DeleteApply"
										}, function (data, status) {
											appIonicLoading.hide();
											if(data["Flag"] === "Success"){
												appIonicLoading.show({
													template: "取消合同成功！["+data["Msg"]+"]！",
													animation: 'fade-in',
													showBackdrop: true,
													duration: 2000
												});
												$scope.refresh();
											}else{
												appIonicLoading.show({
													template: "取消合同失败！"+data["Msg"],
													animation: 'fade-in',
													showBackdrop: true,
													duration: 2000
												});
											}
										});
									}
								});
							}
							//合同生效
							$scope.contractChecK = function(){
								var confirmPopup = $ionicPopup.confirm({
									title: '合同生效',
									template: '你确定合同生效吗？',
									okText: '确定',
									cancelText: '取消'
								});
								confirmPopup.then(function (res) {
									if (res) {
										appIonicLoading.show({
											template: "正在处理中......",
											animation: 'fade-in',
											showBackdrop: true
										});
										//接收服务端返回的用户详情数据
										runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
												"OperateContract", {
											SerialNo : $scope.selectedListItem.SerialNo,
											ObjectNo : $scope.selectedListItem.ObjectNo,
											ObjectType : "BusinessContract",
											BusinessType : $scope.selectedListItem.BusinessType,
											CustomerId : $scope.selectedListItem.CustomerId,
											Type : "ContractChecK",
											DealType : "03"
										}, function (data, status) {
											appIonicLoading.hide();
											if(data["Flag"] === "Success"){
												appIonicLoading.show({
													template: data["Msg"],
													animation: 'fade-in',
													showBackdrop: true,
													duration: 2000
												});
												$scope.refresh();
												$scope.selectMenu($scope.seletedMenuItem, 0);
											}else{
												appIonicLoading.show({
													template:  data["Msg"],
													animation: 'fade-in',
													showBackdrop: true,
													duration: 2000
												});
											}
										});
									}
								});
							}
							//取消生效
							$scope.delContract = function(){
								var confirmPopup = $ionicPopup.confirm({
									title: '取消生效',
									template: '您真的想取消该信息吗',
									okText: '确定',
									cancelText: '取消'
								});
								confirmPopup.then(function (res) {
									if (res) {
										appIonicLoading.show({
											template: "正在处理中......",
											animation: 'fade-in',
											showBackdrop: true
										});
										//接收服务端返回的用户详情数据
										runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
												"OperateContract", {
											SerialNo : $scope.selectedListItem.SerialNo,
											ObjectType : "BusinessContract",
											Type : "DelContract",
											DealType : "03"
										}, function (data, status) {
											appIonicLoading.hide();
											if(data["Flag"] === "Success"){
												appIonicLoading.show({
													template: "取消生效成功！",
													animation: 'fade-in',
													showBackdrop: true,
													duration: 2000
												});
												$scope.selectMenu($scope.seletedMenuItem, 1);
											}else{
												appIonicLoading.show({
													template:  data["Msg"],
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
					};
				})
				
		/*控制列表刷新*/
		.factory(
				'paging',
				function($state, $ionicLoading, $timeout, $ionicHistory) {
					return {
                        /**
						 * 初始化列表刷新参数及方法
                         * @param $scope
                         * @param pageSize
                         * @param firstPageNo
                         * @param loadData 刷新页面的函数
                         * @param firstLoade 是否首次打开
                         */
						init : function($scope, pageSize, firstPageNo, loadData,firstLoade) {
							$scope.changeState = function(name, params) {
								$ionicHistory.nextViewOptions({
									disableAnimate : true
								});
								$state.go(name, params);
							};
							if(firstLoade){
								$scope.hasMore = false;
							}else {
							 $scope.hasMore = true;
							}
							$scope.loadingMore = false;
							$scope.items = [];
							$scope.pageNo = firstPageNo - 1;// 首页页码从1开始，0表示未开始
                            /**
							 * 主要为了执行传入的loadData方法
                             */
							$scope.refresh = function() {
								$scope.refreshLoading = true;
								$scope.items = [];
								$scope.pageNo = firstPageNo;
								loadData.call(this);
		                    	$scope.$broadcast('scroll.refreshComplete');

							};

							$scope.loadMore = function() {
								$scope.loadingMore = true;
								//这里为了防止用户短时间内多次下拉，造成服务端资源冲突，所以每次在下拉时，置为false
								$scope.hasMore = false;
								$timeout(function() {
									$scope.pageNo++;
									// 加载更多
									loadData.call(this, $ionicLoading);
								}, 1000);
								$scope.$broadcast('scroll.infiniteScrollComplete');
							};
							$scope.goBack = function() {
								history.back();
							};
							$scope.goBackNoAnim = function() {
								$ionicHistory.nextViewOptions({
									disableAnimate : true
								});
								history.back();
							};
						}

					};
				})
		/*控制详情页列表刷新*/
		.factory(
				'detailListPaging',
				function($state, $ionicLoading, $timeout, $ionicHistory) {
					return {
						init : function($scope, pageSize, firstPageNo, detailListLoadData,firstLoade) {
							$scope.changeState = function(name, params) {
								$ionicHistory.nextViewOptions({
									disableAnimate : true
								});
								$state.go(name, params);
							};
							if(firstLoade){
								$scope.detailListHasMore = false;
							}else {
							 $scope.detailListHasMore = true;
							}
							$scope.detailListLoadingMore = false;
							$scope.detailItems = [];
							$scope.detailListPageNo = firstPageNo - 1;// 首页页码从1开始，0表示未开始
							$scope.detailListRefresh = function() {
								$scope.detailListRefreshLoading = true;
								$scope.detailItems = [];
								$scope.detailListPageNo = firstPageNo;
								detailListLoadData.call(this);
		                    	$scope.$broadcast('scroll.refreshComplete');

							};

							$scope.detailListLoadMore = function() {
								$scope.detailListLoadingMore = true;
								//这里为了防止用户短时间内多次下拉，造成服务端资源冲突，所以每次在下拉时，置为false
								$scope.detailListHasMore = false;
								$timeout(function() {
									$scope.detailListPageNo++;
									// 加载更多
									detailListLoadData.call(this, $ionicLoading);
								}, 1000);
								$scope.$broadcast('scroll.infiniteScrollComplete');
							};
							$scope.goBack = function() {
								history.back();
							};
							$scope.goBackNoAnim = function() {
								$ionicHistory.nextViewOptions({
									disableAnimate : true
								});
								history.back();
							};
						}
					};
				})

		.factory(
				'sms',
				function($state, $ionicLoading, $http, $timeout) {
					return {
						send : function($scope, method, params, checkFun) {
							var initTimeout = 120;
							var smsTimeout = initTimeout;
							var canSend = true;
							$scope.sendMsg = smsTimeout + "秒后重发";
							var updateSendMsg = function() {
								smsTimeout--;
								if (smsTimeout < 0) {
									canSend = true;
									smsTimeout = initTimeout;
									$scope.sendMsg = smsTimeout + "秒后重发";
									return;
								}
								$scope.sendMsg = smsTimeout + "秒后重发";
								canSend = false;
								$timeout(updateSendMsg, 1000);
							};
							$scope.sendSMS = function() {
								if (canSend == false)
									return;
								canSend = false;
								// 发送短信
								runServiceWithSession($http, $ionicLoading,
										$state, "/json.jsp?method=" + method,
										params, function(data, status) {
											if (checkFun.call(this, data)) {
												// 开始计数
												$timeout(updateSendMsg, 1000);
											} else {
												$ionicLoading.show({
													template : "短信发送失败",
													duration : 2000
												});
											}
										});
							};
						}
					};
				})

		.factory('fileReader', [ "$q", "$log", function($q, $log) {
			var onLoad = function(reader, deferred, scope) {
				return function() {
					scope.$apply(function() {
						deferred.resolve(reader.result);
					});
				};
			};
			var onError = function(reader, deferred, scope) {
				return function() {
					scope.$apply(function() {
						deferred.reject(reader.result);
					});
				};
			};
			var getReader = function(deferred, scope) {
				var reader = new FileReader();
				reader.onload = onLoad(reader, deferred, scope);
				reader.onerror = onError(reader, deferred, scope);
				return reader;
			};
			var readAsDataURL = function(file, scope) {
				var deferred = $q.defer();
				var reader = getReader(deferred, scope);
				reader.readAsDataURL(file);
				return deferred.promise;
			};
			return {
				readAsDataUrl : readAsDataURL
			};
		} ])

		.directive(
				'fileModel',
				[
						'$parse',
						function($parse) {
							return {
								restrict : 'A',
								link : function(scope, element, attrs, ngModel) {
									var model = $parse(attrs.fileModel);
									var modelSetter = model.assign;
									element
											.bind(
													'change',
													function(event) {
														scope
																.$apply(function() {
																	modelSetter(
																			scope,
																			element[0].files[0]);
																});
														// 附件预览
														scope.file = (event.srcElement || event.target).files[0];
														scope.getFile();
													});
								}
							};
						} ])
		//左滑显示删除按钮
		//2017年10月22日  yli18
/*		.directive('slideDelete',function(){
			return{
				restrict : 'AE',
				scope:{
					text : "@",
					ondelete : "&"
				},
				link:function(scope,element,attrs){
					var w = $(element).outerWidth();//应显示的宽度
					var h = $(element).outerHeight();//应显示的高度
					//按钮高度
					var btn_w = 100;
					//设计按钮
					scope.btn = $('<div style="position:absolute;z-index:5998;right:0;top:0;width:'+btn_w+'px;height:'+h+'px;color:#fff;backgroud-color:#900;text-align:center;padding-top:10px">'+(scope.text || '删除')+'</div>');
					//改造行,用一个绝对定位div将内容包裹起来
					$(element).contents().wrapAll('<div new_box style="position:absolute;z-index:5999;left:0;top:0;width:'+w+'px;height:'+h+'px;background-color:#fff;"><div>');
					//添加按钮
					$(element).css({overflow:"hidden",position:"relative","z-index":"5999"}).append(scope.btn)
					//滑屏功能
					.slideable({
						getLeft : function(self){return self.children(":first-child").position().left;},
						setLeft : function(self,x){self.children(":first-child").css({left: x<-btn_w && -btn_w || x < 0 && x || 0});},
						onslide : function(self,x){
							scope.open = x < -btn_w / 2;
							self.css("z-index",scope.open && 6001 || 5999);
							//背景,点击收起
							var bk = $.fixedBackground(6000,scope.open);
							scope.open  && bk.data("self",self).click(function(){
								var self = bk.data("self");
								$.fixedBackground(6000,false);
								self && self.css("z-index",5999).children(":first-child").animate({left:0},100);
							});
							self.children("first-child").animate({left:scope.open ? -btn_w : 0},100);
						}
					})
					//按钮事件
					scope.btn.click(function(){
						scope.ondelete && scope.ondelete();
						$.fixedBackground(6000,1).click();//关闭背景
					});
				}
			};
		})*/
		// 筛选树图列表
		.factory(
				'dynamicFilter',
				function($compile) {
					return {
						/**
						 * 初始化筛选列表 $scope:数据绑定 htmlContainer:列表容器
						 * scopeContainer:数据容器 filterArray:筛选数据
						 */
						init : function($scope, htmlContainer, scopeContainer,
								filterArray, multiSelect) {
							if (htmlContainer == undefined
									|| htmlContainer == '') {
								console.log('缺少容器');
								return;
							}
							if (typeof (htmlContainer) == 'string') {
								htmlContainer = document
										.getElementById(htmlContainer);
							}
							if ($scope[scopeContainer] == undefined) {
								$scope[scopeContainer] = {};
							}
							$scope[scopeContainer].singleSelect = "";
							$scope[scopeContainer].showFilterItem = {};
							$scope[scopeContainer].selectFilterItem = {};
							var showFilter = function(item, height) {
								var key = scopeContainer + item.key;
								var value = item.value;
								if ($scope[scopeContainer].showFilterItem[key] == undefined) {
									$scope[scopeContainer].showFilterItem[key] = false;
								}
								var checkboxHtml = "";
								var itemClickHtml = "";
								var classHtml = "";
								if (multiSelect) {
									if ($scope[scopeContainer].selectFilterItem[key] == undefined) {
										$scope[scopeContainer].selectFilterItem[key] = false;
									}
									checkboxHtml = "<input type=\"checkbox\" id=\""
											+ key
											+ "\" class=\"input_check\" ng-checked=\""
											+ scopeContainer
											+ ".selectFilterItem."
											+ key
											+ "\" ng-click=\""
											+ scopeContainer
											+ ".choose($event, '"
											+ key
											+ "')\" />";
								}
								if (item.array != undefined) {
									itemClickHtml = scopeContainer
											+ ".showFilterItem." + key + " = !"
											+ scopeContainer
											+ ".showFilterItem." + key;
								} else {
									itemClickHtml = scopeContainer
											+ ".itemClick(\'" + key + "\')";
									if (!multiSelect) {
										classHtml = " class=\"{{"
												+ scopeContainer
												+ ".singleSelect==\'"
												+ key
												+ "\'? \'singleFilterSelect\': \'\'}}\" ";
									}
								}
								item.select = false;
								var lineClass;
								if (height == 1) {
									lineClass = 'lineOne';
								} else {
									lineClass = 'lineOther';
								}
								var innerHtml = "<div class=\"" + lineClass
										+ "\"><span>" + checkboxHtml + "<a "
										+ classHtml + "ng-click=\""
										+ itemClickHtml + "\">&nbsp;" + value
										+ "</a></span></div>";
								if (item.array != undefined
										&& item.array.length != 0) {
									innerHtml = innerHtml
											+ "<div class=\"lineContent\" ng-show=\""
											+ scopeContainer
											+ ".showFilterItem." + key + "\">";
									for (var k = 0; k < item.array.length; k++) {
										innerHtml = innerHtml
												+ showFilter(item.array[k],
														height + 1);
									}
									innerHtml = innerHtml + "</div>";
								}
								return innerHtml;
							};
							/**
							 * 搜索key对应节点
							 * 
							 * @Params item 被搜索节点
							 * @Params key 关键字
							 * @Return key对应节点，没有则为空字符串
							 */
							var searchKey = function(item, key) {
								if (item.key != undefined
										&& (scopeContainer + item.key) == key) {
									return item;
								} else if (item.array != undefined
										&& item.array.length != 0) {
									for (var k = 0; k < item.array.length; k++) {
										var temp = searchKey(item.array[k], key);
										if (temp != '')
											return temp;
									}
									return '';
								} else {
									return '';
								}
							};

							/**
							 * 设置子节点选中/未选中
							 * 
							 * @Params item 父节点
							 * @Params select 选中状态
							 */
							var childItemSetSelect = function(item, select) {
								if (item.key != undefined)
									$scope[scopeContainer].selectFilterItem[scopeContainer
											+ item.key] = select;
								if (item.array != undefined
										&& item.array.length != 0) {
									for (var k = 0; k < item.array.length; k++) {
										childItemSetSelect(item.array[k],
												select);
									}
								}
							};
							/**
							 * 更新节点状态
							 * 
							 * @Params 需更新节点
							 */
							var updateNodeStatus = function(item) {
								var key = scopeContainer + item.key;
								var nodeId = document
										.getElementById(scopeContainer
												+ item.key);
								if (item.array == undefined
										|| item.array.length == 0) {
									return $scope[scopeContainer].selectFilterItem[key] ? 1
											: -1;
								} else {
									var num = 0;
									for (var k = 0; k < item.array.length; k++) {
										var status = updateNodeStatus(item.array[k]);
										if (status == 0) {
											$scope[scopeContainer].selectFilterItem[key] = false;
											nodeId.indeterminate = true;
											return 0;
										} else if (status == 1) {
											num++;
										}
									}
									if (num == 0) {
										$scope[scopeContainer].selectFilterItem[key] = false;
										nodeId.indeterminate = false;
										return -1;
									} else if (num < item.array.length) {
										$scope[scopeContainer].selectFilterItem[key] = false;
										nodeId.indeterminate = true;
										return 0;
									} else {
										$scope[scopeContainer].selectFilterItem[key] = true;
										nodeId.indeterminate = false;
										return 1;
									}
								}
							};
							var innerHtml = "";
							for (var k = 0; k < filterArray.length; k++) {
								innerHtml = innerHtml
										+ showFilter(filterArray[k], 1);
							}
							// console.log(innerHtml);
							var i = $compile(innerHtml)($scope);
							angular.element(htmlContainer).html('').append(i);
							/**
							 * 多选框选中事件
							 */
							$scope[scopeContainer].choose = function($event, id) {
								$scope[scopeContainer].selectFilterItem[id] = $event.target.checked;
								if (multiSelect) {
									var temp = '';
									for (var k = 0; k < filterArray.length; k++) {
										var temp = searchKey(filterArray[k], id);
										if (temp != '') {
											break;
										}
									}
									childItemSetSelect(temp,
											$event.target.checked);
									for (var k = 0; k < filterArray.length; k++) {
										updateNodeStatus(filterArray[k]);
									}
								} else {
									for ( var key in $scope[scopeContainer].selectFilterItem) {
										if (key != id) {
											$scope[scopeContainer].selectFilterItem[key] = false;
										}
									}
								}
							};
							/**
							 * item点击事件
							 */
							$scope[scopeContainer].itemClick = function(id) {
								if (multiSelect) {
									$scope[scopeContainer].selectFilterItem[id] = !$scope[scopeContainer].selectFilterItem[id];
									var temp = '';
									for (var k = 0; k < filterArray.length; k++) {
										var temp = searchKey(filterArray[k], id);
										if (temp != '') {
											break;
										}
									}
									childItemSetSelect(
											temp,
											$scope[scopeContainer].selectFilterItem[id]);
									for (var k = 0; k < filterArray.length; k++) {
										updateNodeStatus(filterArray[k]);
									}
								} else {
									$scope[scopeContainer].singleSelect = id;
								}
							};
							var selectTemp = [];
							var getSelect = function(item) {
								var key = scopeContainer + item.key;
								if ($scope[scopeContainer].selectFilterItem[key]
										&& item.array == undefined) {
									var selectTempItem = {
										key : item.key,
										value : item.value
									};
									selectTemp.push(selectTempItem);
									return;
								} else if (item.array == undefined
										|| item.array.length == 0) {
									return;
								} else {
									for (var k = 0; k < item.array.length; k++) {
										getSelect(item.array[k]);
									}
								}
							};
							$scope[scopeContainer].confirm = function() {
								if (multiSelect) {
									selectTemp = [];
									for (var k = 0; k < filterArray.length; k++) {
										getSelect(filterArray[k]);
									}
									var keyTemp = '';
									var valueTemp = '';
									for (var j = 0; j < selectTemp.length; j++) {
										keyTemp += selectTemp[j].key + ',';
										valueTemp += selectTemp[j].value + ',';
									}
									var sTemp = {
										key : keyTemp.substring(0,
												keyTemp.length - 1),
										value : valueTemp.substring(0,
												valueTemp.length - 1)
									};
									return sTemp;
								} else {
									return $scope[scopeContainer].singleSelect
											.substring(
													scopeContainer.length,
													$scope[scopeContainer].singleSelect.length);
								}
							};
						}
					};
				})
				
				
		/**
         * 影像上传
         * infos包含(customerID,itemNo,PhaseType,describe,longitude,latitude,address,image,radio,video)属性
         * kzhang
         */
				.factory(
				'upload',
				function($state, $ionicLoading, $http, $timeout) {
					return {
						upImages : function($scope,AmApp,infos) {
							$scope.info = infos;
							$scope.actualUpdateCount = 0;
							$scope.waitTimeout = 60;
							$scope.needUpdateCount = $rootScope.getNeedUpdateCount();
				            if ($scope.needUpdateCount === 0) {
				                // appIonicLoading.show({template: '没有新增的文件可以上传！', duration: 2000});
				            	$rootScope.uploadOtherInfo();
				            } else {
				                appIonicLoading.show({template: '信息保存中...'});
				                loading("信息保存中，请稍后……",0);
				            }
				            var data = $scope.info;

				            for (var i = 0; i < $scope.images.length; i++) {

				                if ($scope.images[i].isNew && $scope.images[i].isNew == true) {
				                    shouldHideLoading = false;

				                    (function (i) {
				                        var win = function (r) {
				                            console.log('上传成功 code='+r.responseCode+',response='+r.response+',Sent='+r.bytesSent) ;
				                            var imageData = {};
				                            for (var key in data) {
				                                imageData[key] = data[key];
				                            }
				                            imageData.Image = $scope.images[i].name;

				                            runServiceWithSession($http, null, $ionicPopup, $state, 'uploadImage', imageData,
				                                function (data, status) {

				                                    //提示模板
				                                    var template;
				                                    var d = data.array[0].Result.split(',');
				                                    if (d[0] == 'SUCCESS') {
				                                    	$scope.actualUpdateCount++;
				                                        $scope.SerialNo = d[1];
				                                        $scope.images[i].isNew = false;

				                                    } else {
				                                        template = "上传失败！code:" + r.code;
				                                    }
				                                    //appIonicLoading.show({template: template, duration: 2000});
				                                });
				                        }

				                        var fail = function (error) {
				                            appIonicLoading.show({template: "上传失败: Code = " + error.code, duration: 2000});
				                        }

				                        //文件的路径
				                        var fileURL = $scope.images[i].src;
				                        //上传的参数
				                        var options = new FileUploadOptions();
				                        options.fileKey = "file";

				                        options.mimeType = "text/plain";

				                        options.fileName = $scope.images[i].name;


				                        var ft = new FileTransfer();
				                        ft.upload(fileURL, encodeURI(AmApp.config.ServiceRealRootPath + "/FileTransfer?dir=" + AmApp.userID+"@"+$scope.info.CustomerID +"@"+$scope.info.ItemNo), win, fail, options);
				                        alert('第'+(i+1)+'张图片上传完成');
				                        //上传文件 
				                })(i);

				                }
				            }


				            //视频上传
				            for (var j = 0; j < $scope.videos.length; j++) {

				                //视频isNew 为true ，是新增时上传视频
				                if ($scope.videos[j].isNew && $scope.videos[j].isNew == true) {
				                    (function (j) {
				                        var win = function (r) {

				                            var videoData = {};
				                            for (var key in data) {
				                                videoData[key] = data[key];
				                            }
				                            videoData.Video = $scope.videos[j].name;

				                            runServiceWithSession($http, null, $ionicPopup, $state, 'uploadImage', videoData,
				                                function (data, status) {
				                                    //提示模板
				                                    var template;
				                                    var d = data.array[0].Result.split(',');

				                                    if (d[0] == 'SUCCESS') {
				                                        appscope.actualUpdateCount++;

				                                        template = "全部上传成功！";
				                                        $scope.SerialNo = d[1];

				                                        $scope.videos[j].isNew = false;

				                                    } else {
				                                        template = "上传失败！";
				                                    }
				                                    //appIonicLoading.show({template: template,duration:2000});
				                                });

				                        }

				                        var fail = function (error) {

				                        }

				                        //文件的路径
				                        var fileURL = $scope.videos[j].src;
				                        //上传的参数
				                        var options = new FileUploadOptions();
				                        options.fileKey = "file";
				                        options.mimeType = "text/plain";
				                        options.fileName = $scope.videos[j].name;

				                        var ft = new FileTransfer();
				                        //上传文件
				                        ft.upload(fileURL, encodeURI(AmApp.config.ServiceRealRootPath + "/FileTransfer?dir=" + AmApp.userID+"@"+$scope.info.CustomerID +"@"+$scope.info.ItemNo), win, fail, options);
				                        alert('第'+(j+1)+'张视频上传完成');
				                })(j);
				                }
				            }


				            //音频上传
				            for (var k = 0; k < $scope.radios.length; k++) {

				                //音频isNew 为true ，是新增时上传音频
				                if ($scope.radios[k].isNew && $scope.radios[k].isNew == true) {
				                    (function (k) {
				                        var win = function (r) {


				                            var audioData = {};
				                            for (var key in data) {
				                                audioData[key] = data[key];
				                            }
				                            audioData.Radio = $scope.radios[k].name;

				                            runServiceWithSession($http, null, $ionicPopup, $state, 'uploadImage', audioData,
				                                function (data, status) {
				                                    //提示模板
				                                    var template;
				                                    //Result  = 'SUCCESS,serailNo'
				                                    var d = data.array[0].Result.split(',');

				                                    if (d[0] == 'SUCCESS') {
				                                        appscope.actualUpdateCount++;

				                                        template = "全部上传成功！";
				                                        $scope.SerialNo = d[1];
				                                        $scope.radios[k].isNew = false;

				                                    } else {
				                                        template = "上传失败！";
				                                    }
				                                    //appIonicLoading.show({template: template,duration:2000});
				                                });
				                        }

				                        var fail = function (error) {
				                            //appIonicLoading.show({template: "上传失败: Code = " + error.code, duration:2000});
				                        }

				                        //文件的路径
				                        var fileURL = $scope.radios[k].src;
				                        //上传的参数
				                        var options = new FileUploadOptions();
				                        options.fileKey = "file";

				                        options.mimeType = "text/plain";

				                        options.fileName = $scope.radios[k].name;

				                        var ft = new FileTransfer();
				                        //上传文件
				                        ft.upload(fileURL, encodeURI(AmApp.config.ServiceRealRootPath + "/FileTransfer?dir=" + AmApp.userID+"@"+$scope.info.CustomerID +"@"+$scope.info.ItemNo), win, fail, options);
				                        alert('第'+(k+1)+'张音频上传完成');
				                    })(k);
				                }
				            }

				            // appscope.judgeLoading();

				            setTimeout('appscope.judgeLoading()', 1000);
				        }
					};
				})
					
				
				
				
				
		    /**
			 * kzhang 2017.11.9
			 * 获取资料和影像信息
			 * params: $scope.ScreenageType, AmApp.userID, $scope.SerialNo
			 * return: ItemList
			 */
				.factory(
				'load',
				function($state, $ionicLoading, $http, $timeout) {
					return {
						getImageInfo : function($scope, infos, AmApp) {
							$scope.info = infos

				            runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
				                'loadImages', {CustomerID: $scope.info.CustomerID, ItemNo: $scope.info.ItemNo,PhaseType:$scope.info.PhaseType,userID:AmApp.userID},
				                function (data, status) {
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
				                        $scope.info.Describe = data.array[0].Describe;
				                        $scope.info.Address = data.array[0].Address;
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
				                });
				        }
					};
				})
				
				
/**
 * kzhang 2017.11.9
 * 影像节点加载1.1
 * params: $scope.ScreenageType, AmApp.userID, $scope.SerialNo(就是customerid)
 * return: ItemList
 */
.factory(
		'$items',
		function($state, $ionicLoading, $http, $timeout) {
			return {
				getScreenage : function($scope,AmApp) {
					runServiceWithSession($http, undefined, $ionicPopup, $state
							, 'getScreenageItems', {ScreenageType: $scope.ScreenageType,CustomerType:AmApp.userID,NewCustomerType:$scope.SerialNo}, 
					function (data) {
		            	var imageStr = "" ;
		            	$scope.ItemList = [];
		                var Item = {"parentName": "现场采集要素", "children": []};
		                $scope.ItemList.push(Item);

		                if($scope.ScreenageType == "MicroImage"){
		                   imageStr = "10011003,10011006,10011009,10011011,10011012,10011014,100110141,100110142,100110143,100110144" ;  
		                 }

		                if($scope.ScreenageType == "IndSingleImage"){
		                   imageStr ="100010,100030,100040,100050,100060,100070,100080,100090";
		                 }
		                if($scope.ScreenageType == "EntSingleImage"){
		                	imageStr ="100020,100160,100170,100180,100190,100200,100030,100050,100040,100060,100070";
		                 }
		            if($scope.ScreenageType != "MicroImage"){
		                   for (var i = 0; i < data.array.length; i++) {
		                    if ((data.array[i].FILE_TYPE_BARCODE.length == 6 || (imageStr.indexOf(data.array[i].FILE_TYPE_BARCODE) >= 0 && data.array[i].FILE_TYPE_BARCODE.length == 7) || data.array[i].FILE_TYPE_BARCODE == '1000109' ||data.array[i].FILE_TYPE_BARCODE.length == 8 || data.array[i].FILE_TYPE_BARCODE == '1000506') && data.array[i].FILE_TYPE_BARCODE !='10005061' && data.array[i].FILE_TYPE_BARCODE !='10005062' && data.array[i].FILE_TYPE_BARCODE !='10005063') {
		  
		                        Item = {"parentName": "", "children": []};
		                        Item.parentName = data.array[i].FILE_TYPE_NAME+'('+data.array[i].totalNum+')';
		                          $scope.ItemList.push(Item);
		                        
		                    } else {
		                        Item.children.push(data.array[i]);
		                    }
		                }
		            }else{
		                for (var i = 0; i < data.array.length; i++) {
		                    if (data.array[i].FILE_TYPE_BARCODE.length == 6 || (imageStr.indexOf(data.array[i].FILE_TYPE_BARCODE) >= 0 && data.array[i].FILE_TYPE_BARCODE.length == 8) || (imageStr.indexOf(data.array[i].FILE_TYPE_BARCODE) >= 0 && data.array[i].FILE_TYPE_BARCODE.length == 9)) {
		                        Item = {"parentName": "", "children": []};
		                        Item.parentName = data.array[i].FILE_TYPE_NAME+'('+data.array[i].totalNum+')';
		                          $scope.ItemList.push(Item);
		                        
		                    } else {
		                        Item.children.push(data.array[i]);
		                    }
		                }
		           }
		            for (var i = 0; i < $scope.ItemList.length; i++) {
		                if ($scope.ItemList[i].children.length == 0) {
		                    $scope.ItemList.splice(i, 1);
		                }
		            }
		            appIonicLoading.hide();
		            });
					
				}
			};
		});