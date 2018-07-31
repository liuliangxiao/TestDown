angular
		.module('com.amarsoft.mobile.controllers.mine', [])

		// 我的主界面
		.controller(
				'MyController',
				function($scope, $state, $http, $ionicPopup, $ionicLoading,
						basePage,$rootScope) {
					$scope.footActiveIndex = 3;
					$scope.count = {						
						newsCount : 0
					};
					var loadData = function($ionicLoading) {
						runServiceWithSession(
								$http,
								$ionicLoading,
								$ionicPopup,
								$state,
								"myControl",   //获取总行通知条数
								{UserId:AmApp.userID},
								function(data, status) {
									$scope.mycount = {						
											userName : data["array"][0].UserName,
											orgName : data["array"][0].OrgName
										};
									$scope.count.newsCount = data["array"][0].NewsCount;
									$state.go('notice');
								});
					};

				/*	$rootScope.gotologs = function() {
						$state.go('logs');
					};*/

					$rootScope.gotoNotice = function() {
						$state.go('notice');
					};
					/*$rootScope.gotoSet = function() {
						$state.go('setAccount');
					};*/
					/*$rootScope.gotoExam = function() {
						$state.go('exam');
					};*/
					basePage.init($scope, loadData);
				})

	//工作日志列表
	.controller (
		'logsController',
		function($scope, $state, $http, $ionicLoading, $ionicPopup,
				 basePage,paging) {
			$scope.logsearch= {
				WorkBrief: ''
			}
			$scope.items=[];
			var pageSize = 10;
			var loadData = function($ionicLoading) {
					runServiceWithSession(
						$http,
						$ionicLoading,
						$ionicPopup,
						$state,
						"checklogs",   //获取工作日志列表
						{
							InputUserId: AmApp.userID,
							WorkBrief:$scope.logsearch.WorkBrief,
							PageSize: pageSize,
							PageNo: $scope.pageNo
						},
						function (data, status) {
							if(data["array"].length==0){
								$scope.noData=true;
							}
							if(data["array"].length!=0){
								$scope.noData=false;
							}
							for (var k = 0; k < data["array"].length; k++){
                                $scope.items.push(data["array"][k]);
							}
                            $scope.loadingMore = false;

                            $scope.hasMore = (($scope.pageNo - 1) * pageSize + data["array"].length < data.totalCount);
                            $scope.$broadcast('scroll.refreshComplete');
                            $scope.$broadcast('scroll.infiniteScrollComplete');
						});

			};
			//点击查询按钮
			$scope.tologsSelect=function(){
				$scope.items=[];
				loadData();
			}
            //点击返回按钮
            $scope.gomy=function(){
				$state.go('my');
			}
            //点击新增按钮
			$scope.gotologadd=function () {
				$state.go('logsAdd');

			};
			//点击日志进入详情页面
			$scope.gotologbaseinfo=function(SerialNo){
				$state.go('logsDetail',{
					SerialNo:SerialNo
				});

			};


            // basePage.init($scope,loadData);
            paging.init($scope, pageSize, 1, loadData);
		}
	)

	// 工作日志基本信息修改
	.controller(
		'logsDetailController',
		function($scope, $state, $http, $ionicLoading, $ionicPopup,$stateParams,$timeout,
				 basePage) {
			//定义一个ng-model绑定页面数据
			$scope.log= {
				InputUserId:'',
				InputOrgId:'',
				WorkContent:'',
				WorkType:'',
				InputDate:'',
				WorkBrief:'',
				SerialNo:''
			};
			$scope.itemNo=[];
			var SerialNo= $stateParams.SerialNo;
			var loadData = function($ionicLoading) {
				runServiceWithSession(
					$http,
					$ionicLoading,
					$ionicPopup,
					$state,
					"checklogInfo",
					{"SerialNo":SerialNo},
					function(data, status) {
						$scope.log.InputDate=data.InputDate;
						$scope.log.InputOrgId=AmApp.orgName;
						$scope.log.InputUserId=AmApp.userName;
						$scope.log.WorkBrief=data.WorkBrief;
						$scope.log.WorkContent=data.WorkContent;
						$scope.itemNo=data.WorkType;
					});
                getWorkType();
			};
            //初始化页面时，加载工作类型的下拉菜单
			var getWorkType=function($ionicLoading){
				runServiceWithSession(
					$http,
					$ionicLoading,
					$ionicPopup,
					$state,
					'getWorkType',
					{'CodeNo':'WorkType'},
					function(data,status){
						$scope.WorkType=data["array"];
						// data["array"][0].ItemNO=$scope.itemNo;
					}
				)
			}


            //点击保存按钮，修改日志
			$scope.dosave=function () {
				$scope.log.InputUserId=AmApp.userID;
				//获取页面上SELECT框的值
				var  myselect=document.getElementById("worktype");
				var index=myselect.selectedIndex;
				$scope.log.WorkType= myselect.options[index].value.substring(7);
				$scope.log.SerialNo=SerialNo;
				runServiceWithSession(
					$http,
					$ionicLoading,
					$ionicPopup,
					$state,
					'addlogs',
					$scope.log,
					function (data,status) {
						if (data.Flag == "Y") {
							$ionicLoading.show({
								template : "修改日志成功！",
								duration : 1000
							});
							$timeout(function () {
								$state.go("logs");
							},1000)
						} else {
							$ionicLoading.show({
								template : "修改失败稍后重试",
								duration : 1500
							});
						}
					}
				);
			};

			$scope.dodelete=function(){
				//添加ALERT框进行确认判断
				var confirmPopup = $ionicPopup.confirm({
					title: '删除日志',
					template: '你确定要将该日志删除？',
					okText : '确定',
					cancelText : '取消'
				});
				confirmPopup.then(function(res){
					if(res) {
						runServiceWithSession(
							$http,
							$ionicLoading,
							$ionicPopup,
							$state,
							'deletelog',
							{"SerialNo":SerialNo},
							function (result,status) {
								if (result.Flag == "Y") {
									$ionicLoading.show({
										template : "删除日志成功！",
										duration : 1000
									});
									$timeout(function () {
										$state.go("logs");
									},1000)
								} else {
									$ionicLoading.show({
										template : "删除失败稍后重试",
										duration : 1500
									});
									$timeout(function () {
										$state.go("logs");
									},1000)
									return false;
								}
							}
						);

					}else{

					}

				});

			};

			basePage.init($scope, loadData);
		})

	// 工作日志新增页面
	.controller(
		'logaddController',
		function($scope, $state, $http, $ionicLoading, $ionicPopup,$stateParams,$timeout,
				 basePage) {
			$scope.log= {
				InputUserId:'',
				InputOrgId:'',
				WorkContent:'',
				WorkType:"",
				InputDate:'',
				WorkBrief:''

			};
			var getdate=function getdate() {
				var date = new Date();
				var mon = date.getMonth()  + 1;         //getMonth()返回的是0-11，则需要加1
				if(mon <=9){                                     //如果小于9的话，则需要加上0
					mon = "0" + mon;
				}
				var day = date.getDate();                   //getdate()返回的是1-31，则不需要加1
				if(day <=9){                                     //如果小于9的话，则需要加上0
					day = "0" + day;
				}
				$scope.log.InputDate = date.getFullYear() + "/" + mon + "/" +  day;
			}
			$scope.log.InputOrgId=AmApp.orgName;
			$scope.log.InputUserId=AmApp.userName;
			var loadData=function($ionicLoading){
				getdate();
				runServiceWithSession(
					$http,
					$ionicLoading,
					$ionicPopup,
					$state,
					'getWorkType',
					{'CodeNo':'WorkType'},
					function(data,status){
						$scope.WorkType=data["array"];
						$scope.ItemNo=data["array"][0].ItemNO;
					}
				)
			}
			var gotologs=function () {
				$state.go('logs');

			};

			$scope.dosave=function () {
				// $scope.log.WorkType=angular.element('#worktype');
				var  myselect=document.getElementById("worktype");
				var index=myselect.selectedIndex
				$scope.log.WorkType= myselect.options[index].value.substring(7);
				$scope.log.InputUserId=AmApp.userID;
				runServiceWithSession(
					$http,
					$ionicLoading,
					$ionicPopup,
					$state,
					'addlogs',
					$scope.log,
					function (data,status) {
						if (data.Flag == "Y") {
							$ionicLoading.show({
								template : "" +
								"新增日志成功！",
								duration : 1500
							});
							$timeout(function () {
								$state.go("logs");
							},1000)
						} else {
							$ionicLoading.show({
								template : ""+
								"新增失败稍后重试",
								duration : 2000
							});
						}
					}
				)


			}

			basePage.init($scope,loadData);
		})






	// 消息
		.controller(
				'NewsController',
				function($scope, $state, $http, $ionicLoading, $ionicPopup,
						basePage) {

					$scope.newscount = {
						noticeCount : 0,
						remindCount : 0,
						passwordXGCount : 0,
						remoteDLCount : 0
					};

					var loadData = function($ionicLoading) {
						runServiceWithSession(
								$http,
								$ionicLoading,
								$ionicPopup,
								$state,
								"news",
								{},
								function(data, status) {
									$scope.newscount.noticeCount = data["array"][0].NoticeCount;
									$scope.newscount.remindCount = data["array"][0].MaturityCount;
									$scope.newscount.passwordXGCount = data["array"][0].PwdModifyCount;
									$scope.newscount.remoteDLCount = data["array"][0].AllopatryCount;
								});
					};
					$scope.gotoNotice = function() {
						$state.go('notice');
					};
					$scope.gotoRemind = function() {
						$state.go('remind');
					};
					$scope.gotoPasswordXG = function() {
						$state.go('passwordXG');
					};
					$scope.gotoRemoteDL = function() {
						$state.go('remoteDL');
					};
					basePage.init($scope, loadData);
				})

		// 总行通知
		.controller(
				'NoticeController',
				function($scope, $state, $http, $ionicPopup, $ionicLoading,
						paging) {
					var iPageSize = 8;
					var loadData = function($ionicLoading) {
						runServiceWithSession(
								$http,
								$ionicLoading,
								$ionicPopup,
								$state,
								"notice",
								{
									UserId : AmApp.userID,
									pageSize : iPageSize,
									pageNo : $scope.pageNo,
									latesDate : $scope.latesDate
								},
								function(data, status) {
									for (var k = 0; k < data["array"].length; k++) {
										$scope.items.push(data["array"][k]);
									}
									$scope.hasMore = (($scope.pageNo - 1)
											* iPageSize + data["array"].length < data.totalCount);
									$scope.loadingMore = false;
									if ($scope.items.length) {
										$scope.noData = false;
									} else {
										$scope.noData = true;
									}
									$scope.$broadcast('scroll.refreshComplete');
									$scope.$broadcast('scroll.infiniteScrollComplete');
								});
					};
					$scope.gotoNoticeDetail = function(boardNo) {
						$state.go('noticeDetail', {
							boardNo : boardNo
						});
					};
					paging.init($scope, iPageSize, 1, loadData);
				})

		// 通知详情
		.controller(
				'NoticeDetailController',
				function($scope, $state, $stateParams, $http, $ionicPopup,
						$ionicLoading, basePage) {
					$scope.items = [];
					$scope.boardNo = $stateParams.boardNo;
					runServiceWithSession($http, $ionicLoading, $ionicPopup,
							$state, "noticeDetail", {
								boardNo : $scope.boardNo
							}, function(data, status) {
								$scope.notice = data["array"][0];
								for (var k = 1; k < data["array"].length; k++) {
									$scope.items.push(data["array"][k]);
								}
							});
					$scope.donwloadDoc = function(item) {
						runServiceWithSession($http, $ionicLoading,$ionicPopup,
							$state, "donwloadDoc", item,
							function(data, status) {
								$scope.docUrl = encodeURI(AmApp.config.ServiceRealRootPath+"/AttachView?"+"docNo="+item.DocNo+"&attachmentNo="+item.AttachmentNo+"&fileName="+item.FileName+"&FullPath="+item.FullPath);
								if (typeof (Download) == 'object') {
									var arr = [$scope.docUrl,item.FileName];

									window.download(arr, function(msg) {
									}, function(err) {
									});
								} else {
									window.open($scope.docUrl);
								}

							});
					}
					basePage.init($scope);
				})

		// 到期业务提醒
		.controller('RemindController', function($scope, $state, basePage) {
			$scope.gotoBusiness = function(maturityDate) {
				$state.go('maturityBiz', {
					maturityDate : maturityDate
				});
			}
			basePage.init($scope);
		})

		// 密码修改提醒
		.controller(
				'PasswordXGController',
				function($scope, $state, $http, $ionicLoading, $ionicPopup,
						paging) {
					var iPageSize = 8;
					var loadData = function($ionicLoading) {
						runServiceWithSession(
								$http,
								$ionicLoading,
								$ionicPopup,
								$state,
								"passwordXG",
								{
									pageSize : iPageSize,
									curPage : $scope.pageNo,
									msgType : $scope.msgType
								},
								function(data, status) {
									for (var k = 0; k < data["array"].length; k++)
										$scope.items.push(data["array"][k]);
									$scope.hasMore = (($scope.pageNo - 1)
											* iPageSize + data["array"].length < data.TotalAcount);
									$scope.loadingMore = false;
									if ($scope.items.length) {
										$scope.noData = false;
									} else {
										$scope.noData = true;
									}
									$scope.$broadcast('scroll.refreshComplete');
									$scope.$broadcast('scroll.infiniteScrollComplete');
								});
					};
					paging.init($scope, iPageSize, 1, loadData);
				})

		// 异地登陆提醒
		.controller(
				'RemoteDLController',
				function($scope, $state, $http, $ionicLoading, $ionicPopup,
						paging) {
					var iPageSize = 8;
                        var loadData = function($ionicLoading) {
						runServiceWithSession(
								$http,
								$ionicLoading,
								$ionicPopup,
								$state,
								"remoteDL",
								{
									pageSize : iPageSize,
									curPage : $scope.pageNo,
									msgType : $scope.msgType
								},
								function(data, status) {
									for (var k = 0; k < data["array"].length; k++)
										$scope.items.push(data["array"][k]);
									$scope.hasMore = (($scope.pageNo - 1)
											* iPageSize + data["array"].length < data.TotalAcount);
									$scope.loadingMore = false;
                                        if ($scope.items.length) {
                                        $scope.noData = false;
									} else {
										$scope.noData = true;
									}
									$scope.$broadcast('scroll.refreshComplete');
									$scope.$broadcast('scroll.infiniteScrollComplete');
								});
					};
					paging.init($scope, iPageSize, 1, loadData);
				})

		// 账号安全
		.controller(
				'SetAccountController',
				function($scope, $state, $http, $ionicPopup, $ionicLoading,
						basePage,$rootScope) {
					$rootScope.gotoXGpassword = function() {
						$state.go('XGpassword');
					};
					//记住用户名密码功能删除
					/*$scope.gotoSetremind = function() {
						$state.go('setremind');
					};
					*/
					$rootScope.gotoFeedback = function() {
						$state.go('feedback');
					};
					$rootScope.gotoAbout = function() {
						$state.go('about');
					};
					$rootScope.gotoGesture = function() {
	        $state.go('gesture');
	                };
					$scope.isGestureSet = false;
					$scope.showGesturePassword = true;
					var loadData = function() {
						// ----start----校验手势密码插件能否使用，可以则显示手势密码选项

                        /*window.getGestureStatus([AmApp.userID], function (msg) {
                            if (msg == 'set') {
                                $scope.gesture = { click: true, isShow: true };
                            }
                            if (msg == 'unset') {
                                $scope.gesture = { click: false, isShow: false };
                            }
                        });*/
						// ----end----
					};

					// ----start---- 手势密码设置/关闭调用
					$scope.changeGesture = function($event) {


                        window.changeGesture([AmApp.userID], function (msg) {

                        }, function (err) {

                        });

					};
					// ----end----
					
					$scope.logout = function() {
						function showLogoutConfirm() {
							var confirmPopup = $ionicPopup.confirm({
								title : '<strong>退出登录?</strong>',
								template : '你确定要退出登录吗?',
								okText : '退出',
								cancelText : '取消'
							});
							confirmPopup
									.then(function(res) {
										if (res) {
											runService(
													$http,
													$ionicLoading,
													"logout",
													{},
													function(data, status) {
														if (data.Result == 'Y') {
															$ionicLoading
																	.show({
																		template : '当前账号已经退出！',
																		duration : 1000
																	});
															$scope
																	.changeState('logon');
														}
													});
										} else {
											// Don't close
										}
									});
						}
						showLogoutConfirm.call(this);
					};
					basePage.init($scope,loadData);
				})

		// 安全提醒
		.controller('SetremindController',
				function($scope, $state, $ionicLoading, basePage) {
					$scope.isGestureSet = false;
					$scope.showGesturePassword = true;
					var loadData = function() {
						// ----start----校验手势密码插件能否使用，可以则显示手势密码选项
						if (typeof (GesturePassword) == 'object') {
							$scope.showGesturePassword = true;
							GesturePassword.getGestureStatus(function(msg) {
								if (msg == "unset")
									$scope.isGestureSet = false;
								else
									$scope.isGestureSet = true;
							});
						} else {
							$scope.showGesturePassword = false;
						}
						// ----end----
					};
					// ----start---- 手势密码设置/关闭调用
					$scope.changeGesture = function($event) {
						$scope.isGestureSet = $event.target.checked;
						if (typeof (GesturePassword) != 'object') {
							$ionicLoading.show({
								template : '不支持手势密码',
								duration : 1000
							});
							$event.target.checked = false;
							$scope.isGestureSet = $event.target.checked;
							return;
						}
						if ($scope.isGestureSet) {
							GesturePassword.setGesture(function(msg) {
								if (msg == "success")
									$scope.isGestureSet = true;
								else
									$scope.isGestureSet = false;
								$scope.$apply();
							}, function(msg) {
								$scope.isGestureSet = false;
								$scope.$apply();
							});
						} else {
							GesturePassword.closeGesture(function(msg) {
								if (msg == "success" || msg == "clear") {
									$scope.isGestureSet = false;
								} else
									$scope.isGestureSet = true;
								$scope.$apply();
							}, function(msg) {
								$scope.isGestureSet = true;
								$scope.$apply();
							});
						}
					};
					// ----end----
					basePage.init($scope, loadData);
				})

		// 修改密码
		.controller(
				'XGpasswordController',
				function($scope, $state, $ionicPopup, $http, $ionicLoading,
						basePage) {
					var loadData = function($ionicLoading) {
						$scope.pwd = {
							oldPassword : "",
							newPassword1 : "",
							newPassword2 : ""
						};
					};
					$scope.confirm = function() {
						if ($scope.pwd.oldPassword == ''
								|| $scope.pwd.newPassword1 == ''
								|| $scope.pwd.newPassword2 == '') {
							$ionicLoading.show({
								template : "请输入密码！",
								duration : 2000
							});
							return false;
						} else if ($scope.pwd.oldPassword == $scope.pwd.newPassword1) {
							$ionicLoading.show({
								template : "请勿使用旧密码作为新密码！",
								duration : 2000
							});

							return false;
						} else if ($scope.pwd.newPassword1 != $scope.pwd.newPassword2) {
							$ionicLoading.show({
								template : "两次输入的密码不一致！",
								duration : 2000
							});

							return false;
						}
						runServiceWithSession($http, $ionicLoading,
								$ionicPopup, $state, 'XGpassword', {
									OldPwd : $scope.pwd.oldPassword,
									NewPwd : $scope.pwd.newPassword1
								}, function(data, status) {
									$scope.result = data["array"][0];
									if ($scope.result.ReturnFlag == "SUCCEEDED") {
										$ionicLoading.show({
											template : "密码修改成功！",
											duration : 1500
										});
										$state.go('setAccount');
									} else {
										$ionicLoading.show({
											template : $scope.result.ReturnFlag,
											duration : 2000
										});
									}
								});
					};

					basePage.init($scope, loadData);
				})
// 手势密码
.controller('GestureController', function ($scope, $state, $ionicPopup, $http, $ionicLoading, basePage) {
            $scope.gesture = { click: false, isShow: false };
            //获取本用户的手势密码
            var loadData = function () {
            window.getGestureStatus([AmApp.userID], function (msg) {
                                    if (msg == 'set') {
                                    $scope.gesture = {click: true, isShow: true};
                                    }
                                    if (msg == 'unset') {
                                    $scope.gesture = {click: false, isShow: false};
                                    }
                                    })
            };
            
            $scope.gotoChange = function () {
            window.changeGesture([AmApp.userID], function (msg) {
                                 
                                 }, function (err) {
                                 
                                 });
            };
            
            $scope.clickchange = function (click) {
            if (click) {
            window.setGesture([AmApp.userID], function (msg) {
                              if (msg == 'fail') {
                              $scope.gesture.click = false;
                              $scope.gesture.isShow = false;
                              $state.go('gesture');
                              
                              } else {
                              $scope.gesture.click = true;
                              $scope.gesture.isShow = true;
                              $state.go('gesture');
                              }
                              }, function (err) {
                              
                              })
            
            }
            else {
            
            //清除密码
            window.cleanGesture([AmApp.userID], function (msg) {
                                if (msg == 'success') {
                                $scope.gesture.click = false;
                                $scope.gesture.isShow = false;
                                $state.go('gesture');
                                }
                                }, function (err) {
                                
                                })
            }
            };
            basePage.init($scope, loadData);
            })
		// 审批审计
		.controller(
				'ExamController',
				function($scope, basePage, $http, $stateParams, $state,
						$ionicPopup, $ionicLoading, paging) {
					$scope.item = {};
					$scope.item.other = 1;
					$scope.item.agree = 1;
					$scope.item.disagree = 1;
					$scope.item.backup = 1;
					$scope.item.supplementary = 1;
					var userID =AmApp.userID;
					var iPageSize = 8;

					var drawChart = function(dom) {
						var myChart = echarts.init(dom);
						var app = {};
						option = null;
						option = {
							title : {
								x : 'center'
							},
							tooltip : {
								trigger : 'item',
								formatter : "{a} <br/>{b} : {c} ({d}%)"
							},
							legend : {
								orient : 'vertical',
								left : 'left',
								data : [ '其他', '同意', '否决', '退回', '提交' ]
							},
							series : [ {
								name : '访问来源',
								type : 'pie',
								radius : '55%',
								center : [ '50%', '60%' ],
								data : [ {
									value : $scope.item.Other,
									name : '其他'
								}, {
									value : $scope.item.Agree,
									name : '同意'
								}, {
									value : $scope.item.Disagree,
									name : '否决'
								}, {
									value : $scope.item.Backup,
									name : '退回'
								}, {
									value : $scope.item.Submit,
									name : '提交'
								} ],
								itemStyle : {
									emphasis : {
										shadowBlur : 10,
										shadowOffsetX : 0,
										shadowColor : 'rgba(0, 0, 0, 0.5)'
									}
								}
							} ]
						};
						if (option && typeof option === "object") {
							var startTime = +new Date();
							myChart.setOption(option, true);
							var endTime = +new Date();
							var updateTime = endTime - startTime;
						}
					};

					var drawChart1 = function(dom1) {
						var myChart = echarts.init(dom1);
						var app = {};
						option = null;
						option = {
							title : {
								x : 'center'
							},
							tooltip : {
								trigger : 'item',
								formatter : "{a} <br/>{b} : {c} ({d}%)"
							},
							legend : {
								orient : 'vertical',
								left : 'left',
								data : [ '24小时内', '48小时内', '其他' ]
							},
							series : [ {
								name : '访问来源',
								type : 'pie',
								radius : '55%',
								center : [ '50%', '60%' ],
								data : [ {
									value : $scope.item.Time24,
									name : '24小时内'
								}, {
									value : $scope.item.Time48,
									name : '48小时内'
								}, {
									value : $scope.item.Timeother,
									name : '其他'
								} ],
								itemStyle : {
									emphasis : {
										shadowBlur : 10,
										shadowOffsetX : 0,
										shadowColor : 'rgba(0, 0, 0, 0.5)'
									}
								}
							} ]
						};
						if (option && typeof option === "object") {
							var startTime = +new Date();
							myChart.setOption(option, true);
							var endTime = +new Date();
							var updateTime = endTime - startTime;
						}
					};

					runServiceWithSession($http, $ionicLoading, $ionicPopup,
							$state, "exam", {
								pageSize : iPageSize,
							 pageNo : $scope.pageNo,
								userID : userID
							}, function(data, status) {
								$scope.item = data["array"][0];

								// 画饼状图-动作统计
								var dom = document.getElementById("container");
								drawChart(dom);
								// 画饼状图-时效性统计
								var dom1 = document
										.getElementById("container1");
								drawChart1(dom1);

							});

					basePage.init($scope);

				})
		

		// 意见反馈
		.controller(
				'FeedbackController',
				function($scope, $state, $ionicPopup, $ionicLoading, $http,
						$timeout, basePage) {
					/* 意见 */
					$scope.opinion = {
						signOpinion : ""
					};

					$scope.submit = function() {
						if ($scope.opinion.signOpinion == '') {
							$ionicLoading.show({
								template : "请填写您的意见！",
								duration : 2000
							});
							return false;
						}
						;

						$scope.params = {
							opinion : $scope.opinion.signOpinion
						};

						runServiceWithSession($http, $ionicLoading,
								$ionicPopup, $state, "feedback", $scope.params,
								function(data, status) {
									$scope.result = data["array"][0];
									if ($scope.result.ReturnFlag == "true") {
										$ionicLoading.show({
											template : "意见提交成功，感谢您的宝贵意见！",
											duration : 2000
										});
										$timeout(function() {
											$scope.goBack();
										}, 2005);

									} else {
										$ionicLoading.show({
											template : "意见提交失败！",
											duration : 2000
										});
									}
								});
					};

					basePage.init($scope);
				})
				
		// 关于
		.controller(
				'AboutController',
				function($scope, $state, $http, $ionicLoading, $ionicPopup,
						basePage) {

					$scope.version = {
						Version : AmApp.config.Version,
						Platform : AmApp.config.DeviceType
					};
					$scope.renovate = function() {
						// //TODO ,待完善，当期版本直接提示已是最新版本
						// $ionicLoading.show({
						// 	template : "当前版本已是最新版本！",
						// 	duration : 1000
						// });
						// return;
						//----start----版本请求
						runService(
								$http,
								$ionicLoading,
								"getversion",
								$scope.version,
								function(data, status) {
									$scope.result = data["array"][0];
									if ($scope.result.ReturnFlag == "Y") {
										// 有新版本
										var confirmPopup = $ionicPopup
												.confirm({
													title : '<strong>有新版本</strong>',
													template : '是否更新？',
													okText : '确定',
													cancelText : '取消'
												});
										confirmPopup.then(function(res) {
											if(res){
												if (ionic.Platform.isAndroid()) {
                                                    window.download([$scope.result.Url,'AFCC.apk'],function(msg){},function(msg){});
                                                }else if (ionic.Platform.isIOS()) {
                                                    window.operUrl([$scope.result.Url],function(msg){},function(msg){});
                                                }else {
                                                    window.open($scope.result.Url);
                                                }
											}                                                   
									});
									} else {
										$ionicLoading.show({
											template : "当前版本已是最新版本！",
											duration : 2000
										});
									}
								});
						// ----end----
					};

					$scope.explain = function() {
						$state.go('explain');
					};

					basePage.init($scope);
				})

		.controller('RenovateController', function($scope, $state, basePage) {
			basePage.init($scope);
		})

		.controller('ExplainController', function($scope, $state, basePage) {
			basePage.init($scope);
		});
