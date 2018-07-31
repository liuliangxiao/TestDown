angular
    .module('com.amarsoft.mobile.controllers.logon', [])
    //登陆
    .controller(
        'LogonController',
        function ($scope, $rootScope,$interval,$filter, $ionicPopup, $http, $ionicLoading, $timeout, $state,
                  basePage, $ionicModal, $cookies, $ionicNativeTransitions,$interval) {

            appRootScope = $rootScope;
            appState = $state;
            appIonicLoading = $ionicLoading;

            /*var attemptLogon = 0;*///记录尝试登陆的次数，五次失败将会锁定
            //回车登录
            $scope.enterEvent = function(e){
            	if(e.keyCode === 13){
            		$scope.logon();
            	}
            }
            $scope.getfocusUserId = function () {
                $scope.$watch('user.LoginId', function (newValue, oldValue, scope) {
                    if (newValue != oldValue) {
                        /*attemptLogon = 0;*/
                    }

                    if (newValue == '') {
                        $scope.showCleanUserId = false;
                    } else {
                        $scope.showCleanUserId = true;
                    }
                })
            };

            $scope.getfocusUserPwd = function () {
                $scope.$watch('user.UserPwd', function (newValue, oldValue, scope) {
                    if (newValue != oldValue) {
                        /*attemptLogon = 0;*/
                    }

                    if (newValue == '') {
                        $scope.showCleanUserPwd = false;
                    } else {
                        $scope.showCleanUserPwd = true;
                    }
                })
            };

            $scope.getblur = function () {
                $scope.showCleanUserId = false;
                $scope.showCleanUserPwd = false;
            };

            $scope.cleanUserId = function () {
                $scope.user.LoginId = '';
            };

            $scope.cleanUserPwd = function () {
                $scope.user.UserPwd = '';
            };

            $scope.isShow = "none";
            var loadData = function (ionicLoading) {
                $scope.fail = false;
                $scope.isSave = false;
                $scope.user = {
                    LoginId: "",
                    UserPwd: ""
                };
                var loaclStorage = window.localStorage;
                if(loaclStorage['userID'] != undefined && loaclStorage['userID'] !="undefined"){
                	 $scope.user.LoginId = loaclStorage['userID'];
                }
                $scope.version = {
                    Version: AmApp.config.Version,
                    Platform: AmApp.config.DeviceType
                };
            };
            
            
            $rootScope.getAddress = function () {
//                var posOptions = {timeout: 1000, enableHighAccuracy: false};
                if(AmApp.config.enviroment == 'dev'){
                	 var msg = "34.773876,113.77667,中国河南省郑州市金水区金水东路49号在绿地·原盛国际附近";
                     var str = msg.split (",");
                     console.log(str);
                     	//location.setLatitude (strb[0]);
                     $rootScope.Latitude = str[0];
                     $rootScope.Longitude = str[1];
                     $rootScope.Address = str[2];
                     console.log($rootScope.Address);
                 	//$rootScope.$digest();
                }
                if (ionic.Platform.isAndroid()) {
                    window.getCurrentLocation(function (msg) {
                    	var str = msg.split (",");
                    	$rootScope.Latitude = str[0];
                        $rootScope.Longitude = str[1];
                        $rootScope.Address = str[2];
                        console.log(str);
                        	location.setLatitude (strb[0]);
                        $rootScope.info_root.Longitude.Latitude = str[0];
                        $rootScope.info_root.Latitude.Longitude = str[1];
                        $rootScope.info_root.Address.Address = str[2];
                    	$rootScope.$digest();
                    }, function (err) {
                    })
                }else if (ionic.Platform.isIOS()) {
                	window.getCurrentLocation([''],function (msg) {
                		console.log(str);
                    	/*var str = msg.split (",");
                    	$rootScope.Latitude = str[0];
                        $rootScope.Longitude = str[1];
                        $rootScope.Address = str[2];
                        location.setLatitude (strb[0]);
                        $rootScope.info_root.Longitude.Latitude = str[0];
                        $rootScope.info_root.Latitude.Longitude = str[1];
                        $rootScope.info_root.Address.Address = str[2];
                    	$rootScope.$digest();*/
                    }, function (err) {
                    })
                }

            }
            /*//轨迹获取上传
            locationUpload();*/ 
            //轨迹上传
            $scope.location={
	    			Address : "",
					Latitude : "",
					Longitude : ""
	    	};
            var locationUpload = function (){
            	//alert("轨迹上传");
            	var posOptions = {timeout: 1000, enableHighAccuracy: false};
            	var time_range = function (beginTime, endTime) {
            	    var strb = beginTime.split (":");
            	    if (strb.length != 2) {
            	        return false;
            	    }

            	    var stre = endTime.split (":");
            	    if (stre.length != 2) {
            	        return false;
            	    }
            	    var b = new Date ();
            	    var e = new Date ();
            	    var n = new Date ();
            	    var m = $filter('date')(n, "yyyy-MM-dd HH:mm:ss");
            	    console.log(m);
            	    var strm = m.substring(10,m.length);
            	    console.log(strm);
            	    b.setHours (strb[0]);
            	    b.setMinutes (strb[1]);
            	    e.setHours (stre[0]);
            	    e.setMinutes (stre[1]);

            	    if (n.getTime () - b.getTime () > 0 && n.getTime () - e.getTime () < 0) {
            	    	$rootScope.getAddress();
            	    	$scope.location.Latitude = $rootScope.Latitude;
                        $scope.location.Longitude = $rootScope.Longitude;
                        $scope.location.Address = $rootScope.Address;
                        runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
    			            	'SelectObjectList',{
    						Address : $scope.location.Address,
    						Latitude : $scope.location.Latitude,
    						Longitude : $scope.location.Longitude,
    						UserId : AmApp.userID,
    						ClassName:"com.amarsoft.app.als.mobile.impl.UploadAddressInfo",
    						MethodName:"UploadAddressMethod",
    						Locatetime : strm
    			                }, function (data,status) {
    			                        //alert(status);
    			                        console.log(data);
    			                    })
    			            
    			            //basePage.init($scope, loadData);
            	  
            	    	} else {
            	        //alert ("当前时间是：" + n.getHours () + ":" + n.getMinutes () + "，不在该时间范围内！");
            	       // window.clearInterval(timer1);
            	        return false;
            	    }
            	}
            	time_range ("9:00", "19:30");
            }

            var loadAccount = function () {

                //解决开发环境和生产环境 代码兼容问题,以后只需要在config.js里面设置"enviroment"变量值,dev 代表开发环境,produ代表生产环境
                if (AmApp.config.enviroment != 'dev') {
                    window.getData([], function (msg) {
                        if (msg.UserName != null && msg.UserName != "") {
                            window.decrypt([msg.UserName, "qazwUIUY45gftyu7689014dv"], function (msg) {
                                $scope.user.LoginId = msg;
                            }, function (err) {

                            })

                            if (msg.PassWord != null && msg.PassWord != "") {
                                window.decrypt([msg.PassWord, "qazwUIUY45gftyu7689014dv"], function (msg) {
                                    $scope.user.UserPwd = msg;
                                    runService(
                                        $http,
                                        $ionicLoading,
                                        "logon",
                                        $scope.user,
                                        function (data, status) {
                                            if (data.Result == 'Y') {
                                            	locationUpload();
                                            	$scope.timer = $interval(function(){locationUpload()},1200000);
                                                $rootScope.remove = function(){
                                                	$interval.cancel($scope.timer);
                                                }
                                                setData(data);
                                                //设置角色信息
                                                $rootScope.userClass = [];                                                
                                                if (data.user.UserClass == 'C') {
                                                    $rootScope.userClass.cusManage = true;
                                                    $rootScope.userClass.approver = false;
                                                    $rootScope.userClass.manager = false;
                                                } else if (data.user.UserClass == 'M') {
                                                    $rootScope.userClass.cusManage = false;
                                                    $rootScope.userClass.approver = false;
                                                    $rootScope.userClass.manager = true;
                                                } else {
                                                    $rootScope.userClass.cusManage = false;
                                                    $rootScope.userClass.approver = true;
                                                    $rootScope.userClass.manager = false;
                                                }
                                                /***********判断手势密码的使用状态********************/
                                                window.getGestureStatus([$scope.user.LoginId], function (status) {
                                                    //已设置 进入校验
                                                    if (status == 'set') {
                                                        window.verifyGesture([$scope.user.LoginId], function (success) {

                                                            //验证失败
                                                            if (success == 'fail') {
                                                                $scope.isSave = false;
                                                                window.cleanGesture([$scope.user.LoginId], function (msg) {
                                                                    //清除已保存的用户名密码
                                                                    window.clearData([], function (msg) {
                                                                        $scope.user.LoginId = '';
                                                                        $scope.user.UserPwd = '';
                                                                        $state.go('logon')
                                                                    }, function (error) {
                                                                    })
                                                                }, function (err) {
                                                                })

                                                            }
                                                            //忘记密码 返回登陆界面 清除手势密码以及保存的自动登陆信息 必须重新输入用户名密码后手动登录
                                                            else if (success == 'forget') {
                                                                var params = {
                                                                    UserName: $scope.user.LoginId,
                                                                    PassWord: ""
                                                                }
                                                                $scope.user.UserPwd = "";
                                                                //清除手势密码
                                                                window.cleanGesture([$scope.user.LoginId], function (success) {
                                                                    window.saveData([params], function (msg) {
                                                                        $scope.user.UserPwd = '';
                                                                        $state.go('logon')
                                                                    }, function (err) {

                                                                    })
                                                                }, function (err) {

                                                                })

                                                            }
                                                            else {
                                                                //校验成功
                                                                //根据角色跳转到对应的第一功能点
                                                                if ($rootScope.userClass.cusManage) {
                                                                    $scope.changeState('remind');
                                                                } else {
                                                                    $scope.changeState('approve');
                                                                }
                                                            }
                                                        }, function (fail) {
                                                            //校验失败
                                                        })
                                                    }
                                                    //未设置 进入主界面
                                                    else if (status == 'unset') {
                                                        if ($rootScope.userClass.cusManage) {
                                                            $scope.changeState('remind');
                                                        } else {
                                                            $scope.changeState('approve');
                                                        }
                                                    }
                                                }, function (fail) {
                                                })

                                                // ----end----

                                            } else {
                                            	if (data.UserNotExist === 'Y') {
                                                    $ionicLoading.show({
                                                        template: "用户不存在",
                                                        duration: 1500
                                                    });
                                                }
                                                if (data.WrongPWD === 'Y') {
                                                	/*attemptLogon++;
                                                	if (attemptLogon > 5) {
                                                		
                                                		$ionicLoading.show({
                                                			template: "您的账户将被锁定",
                                                			duration: 1500
                                                		});
                                                		//TODO 锁定用户、待实现
                                                		attemptLogon = 0;
                                                	} else {*/
                                                		$ionicLoading.show({
                                                			template: "账号或密码错误", //,您已尝试" + attemptLogon + "次，超过5次您的账户将被锁定
                                                			duration: 1500
                                                		});
                                                	/*}*/
                                                }

                                                if (data.UserInactive === 'Y') {
                                                    $ionicLoading.show({
                                                        template: "用户不活跃，已被锁定或停用",
                                                        duration: 1500
                                                    });
                                                }
                                            }
                                        });


                                }, function (err) {

                                })
                            } else {

                            }
                        }
                    }, function (err) {
                    })
                }
            };


            $scope.selectSave = function ($event) {
                $scope.isSave = $event.target.checked;
            };
            $scope.logon = function () {
                $scope.longinClickable = true;
                if ($scope.modal) {
                    $scope.modal.hide();
                }

                $timeout(function () {
                    $scope.$apply(function () {
                        $scope.longinClickable = false;
                    });

                }, 2000);


                if ($scope.user.LoginId == undefined
                    || $scope.user.LoginId == '') {
                    $ionicLoading.show({
                        template: '请输入账号',
                        duration: 1000
                    });
                    return false;
                }
                if ($scope.user.UserPwd == undefined
                    || $scope.user.UserPwd == '') {
                    $ionicLoading.show({
                        template: '请输入密码',
                        duration: 1000
                    });
                    return false;
                }

                appIonicLoading.show({template: '加载中...', duration: 30000});

                //解决开发环境和生产环境 代码兼容问题,以后只需要在config.js里面设置"enviroment"变量值,dev 代表开发环境,produ代表生产环境
                if (AmApp.config.enviroment == 'dev') {

                    /*****************************************开发环境******************************************/
                    runService(
                        $http,
                        $ionicLoading,
                        "logon",
                        $scope.user,
                        function (data, status) {
                        	if (data.Result == 'Y') {
                        		$scope.timer = $interval(function(){locationUpload()},1200000);
                                $rootScope.remove = function(){
                                	$interval.cancel($scope.timer);
                                }
                                setData(data);
                                $rootScope.userClass = [];
//                                $rootScope.userClass[65] = true;
                                //获取菜单编号集
                                $scope.a = data.user.MenuInfo;
                                $scope.a = $scope.a.split("@");
                                for (var int = 0; int < $scope.a.length; int++) {
                                	$rootScope.userClass[$scope.a[int]] = true;
                                	//下面这种格式也行，但是不推荐；因为eval()函数的使用会影响运行速度；
//                                    eval("$rootScope.userClass."+$scope.a[int]+"='true'") 

								}
                                /*if (data.user.UserClass == 'C') {
                                    $rootScope.userClass.cusManage = true;
                                    $rootScope.userClass.approver = false;
                                    $rootScope.userClass.a = false;
                                    $rootScope.userClass.manager = false;
                                } else if (data.user.UserClass == 'M') {
                                    $rootScope.userClass.cusManage = false;
                                    $rootScope.userClass.approver = false;
                                    $rootScope.userClass.manager = true;
                                } else {
                                    $rootScope.userClass.cusManage = false;
                                    $rootScope.userClass.approver = true;
                                    $rootScope.userClass.manager = false;
                                }*/

                                $rootScope.userName = data.user.UserName;

                                //根据角色跳转到对应的第一功能点
                                var SetColorTime=500;//登陆后自动设置选中颜色。
                                if (data.user.MenuInfo.indexOf("65") == -1) { 
                                    appIonicLoading.hide();
                                    //使用原生的方式跳转,可以避免白屏
                                    $ionicNativeTransitions.stateGo('remind', {}, {}, {
                                        "type": "slide",
                                        "direction": "up",
                                        "duration": 1500,
                                    });
                                    $timeout(function () {
                                        $rootScope.$apply(function () {
                                            $(".gztx").css({"background-color": "#2c97de"});
                                        });

                                    }, SetColorTime);
                                } else {
                                    appIonicLoading.hide();
                                    $ionicNativeTransitions.stateGo('approve', {}, {}, {
                                        "type": "slide",
                                        "direction": "up",
                                        "duration": 1500,
                                    });
                                    $timeout(function () {
                                        $rootScope.$apply(function () {
                                            $(".approve").css({"background-color": "#2c97de"});
                                        });

                                    }, SetColorTime);
                                }

                            } else {
                            	if (data.UserExist === 'Y') {
                                    $ionicLoading.show({
                                        template: "用户不存在",
                                        duration: 1500
                                    });
                                }
                                if (data.PwdCorrect === 'Y') {
                                	/*attemptLogon++;
                                	if (attemptLogon > 5) {
                                		
                                		$ionicLoading.show({
                                			template: "您的账户将被锁定",
                                			duration: 1500
                                		});
                                		//TODO 锁定用户、待实现
                                		attemptLogon = 0;
                                	} else {*/
                                		$ionicLoading.show({
                                			template: "密码错误", //,您已尝试" + attemptLogon + "次，超过5次您的账户将被锁定
                                			duration: 1500
                                		});
                                	/*}*/
                                }

                                if (data.UserInactive === 'Y') {
                                    $ionicLoading.show({
                                        template: "用户不活跃，已被锁定或停用",
                                        duration: 1500
                                    });
                                }
                            }
                        });
                    /*****************************************开发环境end******************************************/

                } else {

                    /*****************************************生产环境begin******************************************/

                    runService(
                        $http,
                        $ionicLoading,
                        "logon",
                        $scope.user,
                        function (data, status) {
                        	$scope.timer = $interval(function(){locationUpload()},1200000);
                            $rootScope.remove = function(){
                            	$interval.cancel($scope.timer);
                            }
                            if (data.Result == 'Y') {

                                setData(data);

                                $rootScope.userClass = [];
                                if (data.user.UserClass == 'C') {
                                    $rootScope.userClass.cusManage = true;
                                    $rootScope.userClass.approver = false;
                                    $rootScope.userClass.manager = false;
                                } else if (data.user.UserClass == 'M') {
                                    $rootScope.userClass.cusManage = false;
                                    $rootScope.userClass.approver = false;
                                    $rootScope.userClass.manager = true;
                                } else {
                                    $rootScope.userClass.cusManage = false;
                                    $rootScope.userClass.approver = true;
                                    $rootScope.userClass.manager = false;
                                }

                                $rootScope.userName = data.user.UserName;
                                var params = {UserName: "", PassWord: ""}
                                // ----start---- 用户名密码加密存储
                                if ($scope.isSave) {

                                    window.encrypt([$scope.user.LoginId, "qazwUIUY45gftyu7689014dv"], function (msg) {
                                        params.UserName = msg;
                                    }, function (err) {

                                    })

                                    window.encrypt([$scope.user.UserPwd, "qazwUIUY45gftyu7689014dv"], function (msg) {
                                        params.PassWord = msg;

                                        window.saveData([params], function (msg) {
                                        }, function (err) {
                                        })

                                    }, function (err) {

                                    })
                                } else {
                                    window.encrypt([$scope.user.loginId, "qazwUIUY45gftyu7689014dv"], function (msg) {
                                        params.UserName = msg;
                                        window.saveData([params], function (msg) {
                                        }, function (err) {
                                        })
                                    }, function (err) {

                                    })
                                }
                                /***********判断手势密码的使用状态********************/
                                window.getGestureStatus([$scope.user.LoginId], function (status) {
                                    //已设置 进入校验
                                    if (status == 'set') {
                                        window.verifyGesture([$scope.user.LoginId], function (success) {

                                            //验证失败
                                            if (success == 'fail') {
                                                $scope.isSave = false;
                                                window.cleanGesture([$scope.user.LoginId], function (msg) {
                                                    //清除已保存的用户名密码
                                                    window.clearData([], function (msg) {
                                                        $scope.user.LoginId = '';
                                                        $scope.user.UserPwd = '';
                                                        appIonicLoading.hide();
                                                        $state.go('logon')
                                                    }, function (error) {
                                                    })
                                                }, function (err) {
                                                })

                                            }
                                            //忘记密码 返回登陆界面 清除手势密码以及保存的自动登陆信息 必须重新输入用户名密码后手动登录
                                            else if (success == 'forget') {
                                                var params = {UserName: $scope.user.LoginId, PassWord: ""}
                                                $scope.user.UserPwd = "";
                                                //清除手势密码
                                                window.cleanGesture([$scope.user.LoginId], function (success) {
                                                    window.saveData([params], function (msg) {
                                                        $scope.user.UserPwd = '';
                                                        appIonicLoading.hide();
                                                        $state.go('logon')
                                                    }, function (err) {

                                                    })
                                                }, function (err) {

                                                })

                                            }
                                            else {
                                                //校验成功
                                                //根据角色跳转到对应的第一功能点
                                                if ($rootScope.userClass.cusManage) {
                                                    // $state.go('gztx');
                                                    appIonicLoading.hide();
                                                    $ionicNativeTransitions.stateGo('remind', {}, {}, {
                                                        "type": "slide",
                                                        "direction": "left",
                                                        "duration": 500,
                                                    });
                                                } else {
                                                    appIonicLoading.hide();
                                                    // $state.go('examine');
                                                    $ionicNativeTransitions.stateGo('approve', {}, {}, {
                                                        "type": "slide",
                                                        "direction": "left",
                                                        "duration": 500,
                                                    });
                                                }
                                            }
                                        }, function (fail) {
                                            //校验失败
                                        })
                                    }
                                    //未设置 进入主界面
                                    else if (status == 'unset') {
                                        if ($rootScope.userClass.cusManage) {
                                            // $state.go('gztx');
                                            appIonicLoading.hide();
                                            $ionicNativeTransitions.stateGo('remind', {}, {}, {
                                                "type": "slide",
                                                "direction": "left",
                                                "duration": 500,
                                            });
                                            //                       $scope.changeState('workDiary');
                                        } else {
                                            // $state.go('examine');
                                            appIonicLoading.hide();
                                            $ionicNativeTransitions.stateGo('approve', {}, {}, {
                                                "type": "slide",
                                                "direction": "left",
                                                "duration": 500,
                                            });
                                        }
                                    }
                                }, function (fail) {
                                })
                            } else {
                            	if (data.UserNotExist === 'Y') {
                                    $ionicLoading.show({
                                        template: "用户不存在",
                                        duration: 1500
                                    });
                                }
                                if (data.WrongPWD === 'Y') {
                                	/*attemptLogon++;
                                	if (attemptLogon > 5) {
                                		
                                		$ionicLoading.show({
                                			template: "您的账户将被锁定",
                                			duration: 1500
                                		});
                                		//TODO 锁定用户、待实现
                                		attemptLogon = 0;
                                	} else {*/
                                		$ionicLoading.show({
                                			template: "账号或密码错误", //,您已尝试" + attemptLogon + "次，超过5次您的账户将被锁定
                                			duration: 1500
                                		});
                                	/*}*/
                                }

                                if (data.UserInactive === 'Y') {
                                    $ionicLoading.show({
                                        template: "用户不活跃，已被锁定或停用",
                                        duration: 1500
                                    });
                                }
                            }
                        });
                    /*****************************************生产环境end******************************************/
                }
            };


            var setData = function (data) {
                AmApp.userID = data.user.UserID;
                AmApp.userName = data.user.UserName;
                AmApp.orgID = data.user.OrgID;
                AmApp.orgName = data.user.OrgName;
                AmApp.orgCode = data.user.OrgCode;
                AmApp.orgTel = data.user.OrgTel;
                AmApp.loanType = data.user.AccountManager;
                var loaclStorage = window.localStorage;
                loaclStorage['userName'] = data.userName;
                localStorage['orgName'] = data.orgName;
                loaclStorage['userID'] = $scope.user.LoginId;
            };
            $scope.Refresh = function () {
                $scope.isShow = "none";
            };
            basePage.init($scope, loadData);
            document
                .addEventListener("deviceready", loadAccount, false);

            /****************************加密添加 服务地址begin***************************************/

            $scope.setNetwork = function () {
                $scope.data = {wifi: AmApp.config.ServiceRealRootPath};

                $ionicModal.fromTemplateUrl('templates/Sign/setServiceIP.html', {
                    scope: $scope,
                    backdropClickToClose: false
                }).then(function (modal) {
                    $scope.modal = modal;
                    $scope.modal.show();
                });

            };

            $scope.confirm = function () {

                AmApp.setCookie($cookies, "ServiceRealRootPath", $scope.data.wifi);
                AmApp.setCookie($cookies, "ServiceRootPath", $scope.data.wifi + "/JSONService?method=");

                AmApp.config.ServiceRealRootPath = $scope.data.wifi;
                AmApp.config.ServiceRootPath = $scope.data.wifi + "/JSONService?method=";
                $scope.modal.remove();

            }


            $scope.goBack = function () {
                $scope.modal.remove();
            }
            /****************************加密添加end***************************************/


        });



