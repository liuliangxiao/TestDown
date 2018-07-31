angular.module(
    'com.amarsoft.mobile',
    ['ionic', 'com.amarsoft.mobile.services',
     	'com.amarsoft.mobile.controllers.market',
     	//营销管理
        'com.amarsoft.mobile.controllers.logon',
        //业务签批-一般授信业务审查审批流程
        'com.amarsoft.mobile.controllers.approve.creditApply',
        //业务签批-货后检查业务审查审批流程
        'com.amarsoft.mobile.controllers.approve.postLoanApprove',
        //业务签批-客户评级认定流程
        'com.amarsoft.mobile.controllers.approve.evaluate',
        //业务签批-中小企业资格认定流程
        'com.amarsoft.mobile.controllers.approve.smeIdentify',
        //业务签批-放款流程
        'com.amarsoft.mobile.controllers.approve.putout',
        //业务签批-五级分类流程
        'com.amarsoft.mobile.controllers.approve.classify',
        //业务签批-担保合同变更流程
        'com.amarsoft.mobile.controllers.approve.gcChange',
        //业务签批-押品出库流程
        'com.amarsoft.mobile.controllers.approve.collateralOut',
        //业务签批-核算信息--详情中的费用列表
        'com.amarsoft.mobile.controllers.approve.transactionFeeList',
        //业务签批--核算信息--还款帐号--原还款帐号信息
        'com.amarsoft.mobile.controllers.approve.DepositAccountsList',
        //信息查询
        'com.amarsoft.mobile.controllers.query',
        //我的
        'com.amarsoft.mobile.controllers.mine',
        //影像采集
        'com.amarsoft.mobile.controllers.screenage',
        //经营报表
        'com.amarsoft.mobile.controllers.report',
        //业务提醒
        'com.amarsoft.mobile.controllers.remind',
        //联网查询
        'com.amarsoft.mobile.controllers.query.Internetquery',
        //反欺诈查询
        'com.amarsoft.mobile.controllers.query.AntiFraudQuery',
        //个人征信
        'com.amarsoft.mobile.controllers.query.INDCheckRecordQuery',
        //企业征信
        'com.amarsoft.mobile.controllers.query.SMECheckRecordQuery',
        //授信台帐
        'com.amarsoft.mobile.controllers.query.BusinessContract',
         /*        add by yyma start*/        
        //客户管理
        'com.amarsoft.mobile.controllers.customerManagement',
        //客户详情 
        'com.amarsoft.mobile.controllers.CustomerDetailController', 
        //客户列表
        'com.amarsoft.mobile.controllers.CustomerListController', 
        //客户列表条件搜索
        'com.amarsoft.mobile.controllers.CustomerSearchController', 
        /*        add by yyma end */  
        
        /*~  added by xbwang start ~*/
        // 征信查询
        'com.amarsoft.mobile.controllers.query.CreditQueryController',
        /*~  added by xbwang end ~*/
        
        //业务申请
        'com.amarsoft.mobile.controllers.businessApply',
        //业务申请单
        'com.amarsoft.mobile.controllers.businessApplication',
        //催收管理
        'com.amarsoft.mobile.controllers.collectManagement',
        //贷款工具
        'com.amarsoft.mobile.controllers.loanCalc',
        //担保、抵押公共controller
        'com.amarsoft.mobile.controllers.guaranty',
        //借据公共controller
        //授信台帐-借据
        'com.amarsoft.mobile.controllers.duebill',

        //签署意见并提交共工Controller
        'com.amarsoft.mobile.controllers.common.signOpinionController',
        //合同放款
        'com.amarsoft.mobile.controllers.loanCc.load',
        'com.amarsoft.mobile.controllers.loanCc.list',
        'com.amarsoft.mobile.controllers.applyCc.list',
        'com.amarsoft.mobile.controllers.amountForce.list',
        'com.amarsoft.mobile.controllers.applyLoanCc.list',
        'com.amarsoft.mobile.controllers.applyLoanCc.finTermList',
        'com.amarsoft.mobile.controllers.applyLoanCc.receiverBillList',
        'com.amarsoft.mobile.controllers.applyLoanCc.paymentBillList',
	    'com.amarsoft.mobile.controllers.AutifraudQueryList',    
        /*贷后管理  start*/
		//贷后管理主界面
        'com.amarsoft.mobile.controllers.IndOrEntCapitalUsedList',
        'com.amarsoft.mobile.controllers.SmeOrEntCapitalUsedList',
        'com.amarsoft.mobile.controllers.smeCustomerInspect.list',
        'com.amarsoft.mobile.controllers.inspect.load',
        //个人首检
        'com.amarsoft.mobile.controllers.indFirstInspect.list',
        //公司首检
        'com.amarsoft.mobile.controllers.entFirstInspect.list',
        //个人定检
        'com.amarsoft.mobile.controllers.indCustomerInspect.list',
        //公司定检
        'com.amarsoft.mobile.controllers.entCustomerInspect.list',
        //小企业首检
        'com.amarsoft.mobile.controllers.smeFirstInspect.list',
        //公共新增controller
        'com.amarsoft.mobile.controllers.insertData',
        /*贷后管理  end*/
        'ngCordova', 'ngCookies', 'ionic-native-transitions','ui.grid','ui.grid.selection',
        'ui.grid.edit','ui.grid.pagination','ui.grid.resizeColumns','ui.grid.autoResize','pdf'])

    .run(function ($ionicPlatform, $rootScope, $ionicHistory,$ionicPopup, $state, $ionicActionSheet, $http, $ionicLoading, $timeout, $cookies, $cordovaGeolocation, $location, $ionicScrollDelegate) {
        $ionicPlatform.ready(function () {
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }

            if (ionic.Platform.isAndroid()) {
                ionic.Platform.fullScreen(true, false);

                window.getMacAddress(function (mac) {
                    AmApp.UUID = mac;
                });

                $ionicPlatform.registerBackButtonAction(function () {
                    if ($location.path() == '/') {
                        if ($rootScope.backButtonPressedOnceToExit) {
                            ionic.Platform.exitApp();
                        } else {
                            $rootScope.backButtonPressedOnceToExit = true;
                            // $cordovaToast.showLongBottom('再按一次退出系统');
                            setTimeout(function () {
                                $rootScope.backButtonPressedOnceToExit = false;
                            }, 2000);
                        }
                    } else {
                        $ionicHistory.goBack();
                    }
                    // history.back();
                }, 101);
            }

            if (!ionic.Platform.isAndroid()) {
                AmApp.UUID = device.uuid;
            }
            $rootScope.keyboardshowFlag = false;
            window.addEventListener('native.keyboardshow', function (e) {
                // todo 进行键盘可用时操作
                //e.keyboardHeight 表示软件盘显示的时候的高度
            	$rootScope.keyboardshowFlag=true;
            	console.log("键盘弹出");
              });

//            if (ionic.Platform.isAndroid()) {
//                window.startLocateService([],function (msg) {
//
//                }, function (err) {
//                })
//            } else {
//                $cordovaGeolocation.getCurrentPosition(posOptions)
//                    .then(function (position) {
//
//                    });
//            }


        });

        if (navigator && navigator.splashscreen) {
            navigator.splashscreen.hide();
        }

        $rootScope.windowWidth = window.innerWidth;
        $rootScope.windowHeight = window.innerHeight;

        //动态计算一级导航栏宽度
        $rootScope.firstNavWidth = $rootScope.windowWidth * 0.1;
        //动态计算二级导航栏宽度
        $rootScope.secondNavWidth = $rootScope.windowWidth * 0.3;
        //动态计算右边内容区宽度(常规)
        $rootScope.contentWidth = $rootScope.windowWidth * 0.6;

        //计算担保详情modal框导航栏和内容区宽度
        $rootScope.bigSecondNavWidth = window.innerWidth * 0.4;
        $rootScope.smallContentWidth = window.innerWidth * 0.6;

        //
        $rootScope.contentHeight = $rootScope.windowHeight * 0.92 - 45;
        $rootScope.barHeight = $rootScope.windowHeight * 0.08;
        $rootScope.barMinHeight = $rootScope.barHeight * 0.6;
        $rootScope.barFontSize = $rootScope.barHeight * 0.3;


        //为影像采集页面定义 头部tab高度,内容区高度
        $rootScope.imageAcqBarHeight = $rootScope.windowHeight * 0.135;
        $rootScope.imageAcqContentHeight = $rootScope.windowHeight - $rootScope.imageAcqBarHeight;


        //签署页面模态的窗口
        $rootScope.modalFistNav = {"z-index": 2, "width": $rootScope.bigSecondNavWidth + "px"};
        $rootScope.modalContent = {
            "width": ($rootScope.smallContentWidth - 1) + "px",
            "transform": "translate3d(" + ($rootScope.bigSecondNavWidth + 1) + "px,0px,0px)"
        };


        var posOptions = {timeout: 1000, enableHighAccuracy: false};
        //模态UIGrid样式
        $rootScope.UIGridStyle = {
            "top": "5%",
            "right": "20%",
            "bottom": "20%",
            "left": "20%",
            "min-height": "100px",
            "width": "60%",
            "border-radius": "10px"
        };
        //签署意见模态窗口样式
        $rootScope.modalStyle = {
            "top": "5%",
            "right": "20%",
            "bottom": "5%",
            "left": "20%",
            "min-height": "100px",
            "width": "60%",
            "border-radius": "10px"
        };
        $rootScope.selectCatalogModalStyle = {
    		"top": "10%",
            "right": "30%",
            "bottom": "30%",
            "left": "20%",
            "min-height": "100px",
            "width": "60%",
            "border-radius": "10px"
        };
        $rootScope.selectCatalogModalStyleTemp = $rootScope.selectCatalogModalStyle;
        //签署意见模态窗口样式
        $rootScope.businessTypeModal = {
            "top": "10%",
            "right": "30%",
            "bottom": "30%",
            "left": "20%",
            "min-height": "100px",
            "width": "60%",
            "border-radius": "10px"
        };

        //审批-抵制押详情 占满整个窗口
        $rootScope.bigModalStyle = {
            "top": "0%",
            "right": "0%",
            "bottom": "0%",
            "left": "0%",
            "min-height": "100px",
            "width": "100%",
        };

        //设置服务ip
        $rootScope.setServiceIpModalStyle = {
            "top": "20%",
            "right": "25%",
            "bottom": "50%",
            "left": "25%",
            "min-height": "50px",
            "width": "50%",
            "border-radius": "10px"

        };

        $rootScope.addPotentialCustomer = {
            "top": "10%",
            "right": "10%",
            "bottom": "10%",
            "left": "10%",
            "min-height": "50px",
            "width": "80%",
            "border-radius": "10px"

        };
        $rootScope.addMarketStyle = {
    		"top": "10%",
            "right": "25%",
            "bottom": "10%",
            "left": "25%",
            "min-height": "50px",
            "width": "55%",
            "border-radius": "10px"
        }
        $rootScope.guarantyInfoStyle = {
        		"top": "10%",
                "right": "15%",
                "bottom": "10%",
                "left": "15%",
                "min-height": "50px",
                "width": "70%",
                "border-radius": "10px"
            }
        $rootScope.marketDetailStyle = {
    		"top": "10%",
            "right": "20%",
            "bottom": "10%",
            "left": "20%",
            "min-height": "50px",
            "width": "60%",
            "border-radius": "10px"
        }
        
        /**
         * 获取需要上传文件数量
         * kzhang
         */
        $rootScope.getNeedUpdateCount = function () {
            var result = 0;
            for (var i = 0; i < $rootScope.images.length; i++) {
                if ($rootScope.images[i].isNew && $rootScope.images[i].isNew == true) {
                    result++;
                }
            }

            for (var i = 0; i < $rootScope.videos.length; i++) {
                if ($rootScope.videos[i].isNew && $rootScope.videos[i].isNew == true) {
                    result++;
                }
            }

            for (var i = 0; i < $rootScope.radios.length; i++) {
                if ($rootScope.radios[i].isNew && $rootScope.radios[i].isNew == true) {
                    result++;
                }
            }

            return result;
        };
        /**
         * 没有影像信息时只保存描述，地址等信息
         * kzhang
         */
        $rootScope.uploadOtherInfo = function () {
        	$rootScope.info_up = {Image: '', Radio: '', Video: ''};
            runServiceWithSession($http, undefined, $ionicPopup, $state, 'uploadImage', $rootScope.info_up,
                function (data, status) {
                    if (data.array[0].Result.split(',')[0] === 'SUCCESS') {
                        appIonicLoading.show({template: '保存成功！', duration: 2000});
                    } else {
                        appIonicLoading.show({template: '保存失败！', duration: 2000});
                    }

                });
        };
        
        /**
         * 获取定位信息
         * kzhang
         * *地图定位，获取地址，经纬度
         *	info_root.Longitude：经度
         *	info_root.Latitude： 维度
         *	info_root.Address： 地址
         */
        $rootScope.getAddress = function () {
            var posOptions = {timeout: 1000, enableHighAccuracy: false};
            if (ionic.Platform.isAndroid()) {
                window.getCurrentLocation(function (msg) {
                	$rootScope.info_root.Address = msg;
                	$rootScope.$digest();
                }, function (err) {
                })
            } else {
                $cordovaGeolocation.getCurrentPosition(posOptions)
                    .then(function (position) {
                        var onSuccess = function (position) {
                            //经度
                        	$rootScope.info_root.Longitude = position.coords.longitude;
                            //纬度
                        	$rootScope.info_root.Latitude = position.coords.latitude;


                            //调用百度定位插件的功能
                            var myGeo = new BMap.Geocoder();
                            // 根据坐标得到地址描述
                            myGeo.getLocation(new BMap.Point(position.coords.longitude, position.coords.latitude), function (result) {
                                if (result) {
                                    $timeout(function () {
                                    	$rootScope.info_root.Address = result.address;
                                    }, 500);
                                }
                            });
                        };

                        function onError(error) {
                            appIonicLoading.show({
                                template: 'code: ' + error.code + '\n' + 'message: ' + error.message + '\n',
                                duration: 2000
                            });
                        }

                        navigator.geolocation.getCurrentPosition(onSuccess, onError);

                    });
            }

        }
        
        
        
        

        //一级导航栏菜单是否可以点击 防止快速重复点击
        $rootScope.menuClickable = false;
        $rootScope.ApproveAccessMenuClickable = true;
        $rootScope.moduleSwitch = function (name, params,paramsData) {
        	if(name=='inspect'){
        		$rootScope.InspectMenuName= '贷后管理'
        	}else{
        		$rootScope.InspectMenuName= ''
        	}
        			
            //定义scroll的位置
            $rootScope.pos = $ionicScrollDelegate.$getByHandle('navScroll').getScrollPosition();

            if (!(typeof(params)==='object')) {
                $rootScope.menuClickable = true;

                $timeout(function () {
                    $rootScope.$apply(function () {
                        $("." + params).css({"background-color": "#2c97de"});
                    });

                }, 1);

                $timeout(function () {
                    $rootScope.$apply(function () {
                        $("." + params).css({"background-color": ""});
                        $rootScope.menuClickable = false;
                    });
                }, 500);


                $state.go(name, paramsData, {reload: true});

                $timeout(function () {
                    $rootScope.$apply(function () {
                        //默认的选择的模块，去除背景色
                        $(".bg-color").css({"background-color": ""});
                        //点击的模块设置背景色
                        $("." + params).each(function () {
                            $(this).css({"background-color": "#2c97de"});
                        });
                    });

                    //一级导航滚动后点击，加载页面后定位改该处位置
                    $ionicScrollDelegate.$getByHandle('navScroll').scrollTo($rootScope.pos.left, $rootScope.pos.top);

                }, 500);

            } else {
                $ionicHistory.nextViewOptions({
                    disableAnimate: true
                });
                $state.go(name, params);
            }
        };


        $rootScope.logout = function () {
            $rootScope.menuClickable = true;
            $timeout(function () {
                $rootScope.$apply(function () {
                    $(".logout").css({"background-color": ""});
                    $rootScope.menuClickable = false;
                });

            }, 500);

            $timeout(function () {
                $rootScope.$apply(function () {
                    $(".logout").css({"background-color": "#2c97de"});
                });
            }, 1);

            $ionicActionSheet.show({
                destructiveText: '退出账号',
                cancelText: '取消',
                destructiveButtonClicked: function () {
                	$rootScope.remove();
                	runServiceWithSession($http, undefined, $ionicPopup, $state,"logout", {},
                        function (data, status) {
                            if (data.Result == 'Y' || data=="account.session.timeout") {
                                $ionicLoading.show({
                                    template: '当前账号已经退出！',
                                    duration: 1000
                                });
                                $state.go('logon');
                            }
                        });
                }
            });

//                      $ionicActionSheet.show({
//                        destructiveText:'退出账号',
//                        cancelText:'取消',
//                        destructiveButtonClicked :function(){
//                          runService($http, $ionicLoading, "logout", {},
//                            function(data, status) {
//                              if (data.Result == 'Y') {
//                                var params = {UserName:AmApp.userID,PassWord:''}
//                                window.encrypt([AmApp.userID,"qazwUIUY45gftyu7689014dv"],function (msg) {
//                                  params.UserName = msg;
//         
//                                  window.saveData([params],function (msg) {
//                                    $ionicLoading
//                                      .show({
//                                        template : '当前账号已经退出！',
//                                        duration : 1000
//                                      });
//                                     $state.go('logon');
//                                  },function (err) {
//                                  })
//         
//                                },function (err) {
//                   
//                                })
//                              }
//                            });
//                        }
//                      });

        };


        if ($cookies.get("ServiceRootPath")) {
            AmApp.config.ServiceRootPath = $cookies.get("ServiceRootPath");
            AmApp.config.ServiceRealRootPath = $cookies.get("ServiceRealRootPath");

        }
    })

    .run(
        [
            '$ionicPlatform',
            '$ionicPopup',
            '$rootScope',
            '$location',
            '$state',
            '$http',
            '$ionicLoading',
            '$ionicHistory',
            '$timeout',
            function ($ionicPlatform, $ionicPopup, $rootScope, $location,
                      $state, $http, $ionicLoading, $ionicHistory, $timeout) {

                $rootScope.canExit = false;
                // 主页面显示退出提示框
                $ionicPlatform.registerBackButtonAction(function (e) {

                    e.preventDefault();

                    function showOutConfirm() {
                        if (typeof(window.plugins.toast) == 'object') {
                            if (!$rootScope.canExit) {
                                window.plugins.toast.show("再点一次退出程序", 2000, "bottom");
                                $rootScope.canExit = true;
                                $timeout(function () {
                                    $rootScope.canExit = false;
                                }, 3000);
                            } else {
                                $rootScope.canExit = false;
                                ionic.Platform.exitApp();
                            }
                        } else {
                            var confirmPopup = $ionicPopup.confirm({
                                title: '<strong>退出应用?</strong>',
                                template: '你确定要退出应用吗?',
                                okText: '退出',
                                cancelText: '取消'
                            });

                            confirmPopup.then(function (res) {
                                if (res) {
                                    ionic.Platform.exitApp();
                                } else {
                                    // Don't close
                                }
                            });
                        }
                    }

                    // function showLogoutConfirm() {
                    // var confirmPopup = $ionicPopup.confirm({
                    // title : '<strong>退出登录?</strong>',
                    // template : '你确定要退出登录吗?',
                    // okText : '退出',
                    // cancelText : '取消'
                    // });
                    //
                    // confirmPopup.then(function(res) {
                    // if (res) {
                    // runService($http, $ionicLoading,
                    // "/json.jsp?method=logout", {},
                    // function(data, status) {
                    // AmApp.UserId = undefined;
                    // $state.go('logon');
                    // });
                    // } else {
                    // // Don't close
                    // }
                    // });
                    // }

                    // Is there a page to go back to?
                    if ($location.path() == '/') {
                        ionic.Platform.exitApp();
                    } else if ($location.path() == '/'
                        || $location.path() == '/approve'
                        || $location.path() == '/re_list'
                        || $location.path() == '/my'
                        || $location.path() == '/query') {
                        showOutConfirm();
                    } else if ($ionicHistory.viewHistory().backView) {


                        // Go back in history
                        $ionicHistory.viewHistory().backView.go();
                    } else {
                        // This is the last page: Show confirmation popup
                        ionic.Platform.exitApp();
                    }

                    return false;
                }, 101);

            }])

    .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider, $ionicNativeTransitionsProvider) {

        $ionicNativeTransitionsProvider.setDefaultOptions({
            duration: 400, // in milliseconds (ms), default 400,
            slowdownfactor: 4, // overlap views (higher number is more) or no overlap (1), default 4
            iosdelay: -1, // ms to wait for the iOS webview to update before animation kicks in, default -1
            androiddelay: -1, // same as above but for Android, default -1
            winphonedelay: -1, // same as above but for Windows Phone, default -1,
            fixedPixelsTop: 0, // the number of pixels of your fixed header, default 0 (iOS and Android)
            fixedPixelsBottom: 0, // the number of pixels of your fixed footer (f.i. a tab bar), default 0 (iOS and Android)
            triggerTransitionEvent: '$ionicView.afterEnter', // internal ionic-native-transitions option
            backInOppositeDirection: false // Takes over default back transition and state back transition to use the opposite direction transition to go back
        });


        $ionicNativeTransitionsProvider.setDefaultTransition({
            type: 'slide',
            direction: 'left'
        });
        //是否支持滑动回退，IOS平台下默认支持
        //NOTE:只针对IOS平台有效
        $ionicConfigProvider.views.swipeBackEnabled(false);

        // nativeTransitions: null 是用来设置state.go()不调用ionic-native-transition插件,如需调用,在state.go()里面设置
        $stateProvider
            //业务签批
            .state('approve', {
                nativeTransitions: null,
                url: "/approve",
                cache: false,
                templateUrl: "templates/approve/approveIndex.html",
                controller: 'ApproveAccessIndexController'
            })
            //业务申请实现模块
            .state('businessApproveController', {
                nativeTransitions: null,
                url: 'businessApprove/:ApproveType/:TransactionFilter',
                templateUrl: 'templates/approve/index.html',
                cache: false,
                controller: 'ApproveAccessController'
            })
                        //业务申请实现模块(货后检查流程)
            .state('postApproveController', {
                nativeTransitions: null,
                url: 'businessApprove/:ApproveType/:TransactionFilter',
                templateUrl: 'templates/approve/postLoanApproveindex.html',
                cache: false,
                controller: 'PostLoanApproveController'
            })
            //影像采集-主页面
            .state('screenageIndex', {
                nativeTransitions: null,
                cache: false,
                url: '/screenage/screenageIndex',
                templateUrl: 'templates/screenage/index.html',
                controller: 'IndexController'
            })

            /*
             * 经营报表 for iPad
             * Modified by Laker
             * Date:2016.11.29
             */
            /* iPad report Start */
            .state('report', {
                nativeTransitions: null,
                url: '/report',
                cache: false,
                templateUrl: 'templates/report/index.html',
                controller: 'ReportController'
            })
            //经营报表-贷款余额
            .state('CreditBalanceForiPad', {
                nativeTransitions: null,
                url: '/report/CreditBalanceForiPad',
                cache: false,
                templateUrl: 'templates/report/CreditBalanceForiPad.html',
                controller: 'CreditBalanceForiPadController'
            })
            //经营报表-贷款发放
            .state('LoanPaymentForiPad', {
                nativeTransitions: null,
                url: '/report/LoanPaymentForiPad',
                cache: false,
                templateUrl: 'templates/report/LoanPaymentForiPad.html',
                controller: 'LoanPaymentForiPadController'
            })
            //经营报表-贷款投向
            .state('LoanInvestmentForiPad', {
                nativeTransitions: null,
                url: '/report/LoanInvestmentForiPad',
                cache: false,
                templateUrl: 'templates/report/LoanInvestmentForiPad.html',
                controller: 'LoanInvestmentForiPadController'
            })
            //经营报表-贷款减值准备和贷款覆盖率
            .state('LoanCoverageForiPad', {
                nativeTransitions: null,
                url: '/report/LoanCoverageForiPad',
                cache: false,
                templateUrl: 'templates/report/LoanCoverageForiPad.html',
                controller: 'LoanCoverageForiPadController'
            })
            //经营报表-贷款减值准备和拨备覆盖率
            .state('ProvisionCoverageForiPad', {
                nativeTransitions: null,
                url: '/report/ProvisionCoverageForiPad',
                cache: false,
                templateUrl: 'templates/report/ProvisionCoverageForiPad.html',
                controller: 'ProvisionCoverageForiPadController'
            })
            //经营报表-信贷资产质量五级分类
            .state('FiveLevelClassificationForiPad', {
                nativeTransitions: null,
                url: '/report/FiveLevelClassificationForiPad',
                cache: false,
                templateUrl: 'templates/report/FiveLevelClassificationForiPad.html',
                controller: 'FiveLevelClassificationForiPadController'
            })
            //经营报表-前十大客户资产和集中度
            .state('TopTenAssetsForiPad', {
                nativeTransitions: null,
                url: '/report/TopTenAssetsForiPad',
                cache: false,
                templateUrl: 'templates/report/TopTenAssetsForiPad.html',
                controller: 'TopTenAssetsForiPadController'
            })
            //经营报表-信用结构贷款余额分布
            .state('BalanceDistributionForiPad', {
                nativeTransitions: null,
                url: '/report/BalanceDistributionForiPad',
                cache: false,
                templateUrl: 'templates/report/BalanceDistributionForiPad.html',
                controller: 'BalanceDistributionForiPadController'
            })
            //经营报表-违约客户名单
            .state('DefaultClientListForiPad', {
                nativeTransitions: null,
                url: '/report/DefaultClientListForiPad',
                cache: false,
                templateUrl: 'templates/report/DefaultClientListForiPad.html',
                controller: 'DefaultClientListForiPadController'
            })
            /* iPad report End */

            /*
             * 设置 for iPad
             * Modified by Laker
             * Date:2016.12.07
             */
            /* iPad settings Start */
            //设置首页
            .state('setAccountForiPad', {
                nativeTransitions: null,
                url: '/mine/setAccountForiPad',
                cache: false,
                templateUrl: 'templates/mine/setAccountForiPad.html',
                controller: 'SetAccountController'
            })
            //修改密码
            .state('XGpassword', {
                nativeTransitions: null,
                url: '/mine/XGpasswordForiPad',
                cache: false,
                templateUrl: 'templates/mine/XGpasswordForiPad.html',
                controller: 'XGpasswordController'
            })
            //手势密码
            .state('gesture', {
                nativeTransitions: null,
                url: '/mine/GestureForiPad',
                cache: false,
                templateUrl: 'templates/mine/GestureForiPad.html',
                controller: 'GestureController'
            })
            //意见反馈
            .state('feedback', {
                nativeTransitions: null,
                url: '/mine/feedbackForiPad',
                cache: false,
                templateUrl: 'templates/mine/feedbackForiPad.html',
                controller: 'FeedbackController'
            })
            //关于
            .state('about', {
                nativeTransitions: null,
                url: '/mine/aboutForiPad',
                cache: false,
                templateUrl: 'templates/mine/aboutForiPad.html',
                controller: 'AboutController'
            })
            //版本说明
            .state('explain', {
                nativeTransitions: null,
                url: '/mine/explainForiPad',
                cache: false,
                templateUrl: 'templates/mine/explainForiPad.html',
                controller: 'ExplainController'
            })
            /* iPad settings End */

            /*
             * 我的 for iPad
             * Modified by Laker
             * Date:2016.12.12
             */
            /* iPad my Start */
            //我的首页
            .state('myForiPad', {
                nativeTransitions: null,
                url: '/mine/myForiPad',
                cache: false,
                templateUrl: 'templates/mine/myForiPad.html',
                controller: 'MyController'
            })
            //工作日志
            .state('logs', {
                nativeTransitions: null,
                url: '/mine/logsForiPad',
                cache: false,
                templateUrl: 'templates/mine/logsForiPad.html',
                controller: 'logsController'
            })
            //日志详情
            .state('logsDetail', {
                url: '/mine/logsDetailForiPad/:SerialNo',
                cache: false,
                templateUrl: 'templates/mine/logsDetailForiPad.html',
                controller: 'logsDetailController'
            })
            //新增日志
            .state('logsAdd', {
                nativeTransitions: null,
                url: '/mine/logsAddForiPad',
                cache: false,
                templateUrl: 'templates/mine/logsAddForiPad.html',
                controller: 'logaddController'
            })
            //总行通知
            .state('notice', {
                nativeTransitions: null,
                url: '/mine/noticeForiPad',
                cache: false,
                templateUrl: 'templates/mine/noticeForiPad.html',
                controller: 'NoticeController'
            })
            //总行通知详情
            .state('noticeDetail', {
                nativeTransitions: null,
                url: '/mine/noticeDetailForiPad/:boardNo',
                cache: false,
                templateUrl: 'templates/mine/noticeDetailForiPad.html',
                controller: 'NoticeDetailController'
            })
            /* iPad my End */

            // 登录
            .state('logon', {
                url: "/",
                cache: false,
                templateUrl: "templates/Sign/index.html",
                controller: 'LogonController'
            })

           
            // 工作提醒
            .state('remind', {
                nativeTransitions: null,
                url: "/remind",
                cache: false,
                templateUrl: "templates/common/commonList.html",
                controller: 'RemindController'
            })
            //客户评级认定详情页面0010
            .state('CusRating', {
                url: "/CusRating/:ItemNo/:IconCode/:ItemName",
                cache: false,
                templateUrl: "templates/remind/CusRating.html",
                controller: 'RatController'
            })

            //中小型企业资格认定详情页面0020
            .state('qualification', {
                url: "/qualification/:ItemNo/:IconCode/:ItemName",
                cache: false,
                templateUrl: "templates/remind/qualification.html",
                controller: 'QuaController'
            })

            //个人或者对公详情页面0030/0040
            .state('CusCredit', {
                url: "/CusCredit/:ItemNo/:ItemName",
                cache: false,
                templateUrl: "templates/remind/CusCredit.html",
                controller: 'CreditController'
            })

            //待登记合同详情页面0060
            .state('Contract', {
                url: "/Contract/:ItemNo/:IconCode/:ItemName",
                cache: false,
                templateUrl: "templates/remind/Contract.html",
                controller: 'WaitContractController'
            })

            //待处理的支付详情页面0080
            .state('Payment', {
                url: "/Payment/:ItemNo/:IconCode/:ItemName",
                cache: false,
                templateUrl: "templates/remind/Payment.html",
                controller: 'WaitPaymentController'
            })


            // 到期业务提醒
            .state('dueRemind', {
                url: "/mine/dueRemind",
                templateUrl: "templates/mine/dueRemind.html",
                controller: 'DueRemindController'
            })
            // 到期业务列表
            .state('maturityBiz', {
                url: "/Business/:maturityDate",
                templateUrl: "templates/mine/maturityBiz.html",
                controller: 'BusinessController'
            })
            .state('query', {
                nativeTransitions: null,
                url: "/query",
                templateUrl: "templates/query/index.html",
                cache: false,
                controller: 'queryControllers'
            })
            //公司客户查询
            .state('ipadentquery', {
                nativeTransitions: null,
                url: "/iPadEntQuery",
                templateUrl: "templates/query/entquery.html",
                cache: false,
                controller: 'parentEntController'
            })
            //个人客户查询
            .state('ipadindquery', {
                nativeTransitions: null,
                url: "/iPadIndQuery",
                templateUrl: "templates/query/indquery.html",
                cache: false,
                controller: 'parentIndController'
            })
            //信用等级评估
            .state('ipadcretquery', {
                nativeTransitions: null,
                url: "/iPadCretQuery",
                templateUrl: "templates/query/cretquery.html",
                cache: false,
                controller: 'parentCretController'
            })
            //申请信息查询
            .state('ipadapplyquery', {
                nativeTransitions: null,
                url: "/iPadApplyQuery",
                templateUrl: "templates/query/applyquery.html",
                cache: false,
                controller: 'parentApplyController'
            })
            //授信台帐查询
            .state('BusinessContract', {
                nativeTransitions: null,
                url: "/BusinessContract",
                templateUrl: "templates/common/commonList.html",
                cache: false,
                controller: 'BusinessContractController'
            })
            //担保合同查询
            .state('ipadguarantyquery', {
                nativeTransitions: null,
                url: "/iPadGuarantQuery",
                templateUrl: "templates/query/guarantquery.html",
                cache: false,
                controller: 'parentGuarantController'
            })
                                //联网查询
            .state('internetQuery', {
                nativeTransitions: null,
                url: "/internetQuery",
                templateUrl: "templates/common/commonList.html",
                cache: false,
                controller: 'InternetqueryController'
            })
            //反欺诈查询
            .state('AntiFraudQuery', {
                nativeTransitions: null,
                url: "/AntiFraudQuery",
                templateUrl: "templates/common/commonList.html",
                cache: false,
                controller: 'AntiFraudQueryController'
            })
            //个人征信查询
            .state('INDCheckRecord', {
                nativeTransitions: null,
                url: "/INDCheckRecord",
                templateUrl: "templates/common/commonList.html",
                cache: false,
                controller: 'INDCheckRecordQueryController'
            })
            //企业征信查询
            .state('SMECheckRecord', {
                nativeTransitions: null,
                url: "/SMECheckRecord",
                templateUrl: "templates/common/commonList.html",
                cache: false,
                controller: 'SMECheckRecordQueryController'
            })
            /*~ added by xbwang start ~*/
            //征信查询
            .state('CreditQuery', {
                nativeTransitions: null,
                url: "/CreditQuery",
                templateUrl: "templates/common/commonList.html",
                cache: false,
                controller: 'CreditQueryController'
            })
            /*~ added by xbwang start ~*/
            // //客户管理
            // .state('customerManagement', {
            //     url: "/customerManagement",
            //     templateUrl: "templates/customerManagement/customerManagement.html",
            //     cache: false,
            //     controller: 'CustomerManagementController'
            // })
            //
            //业务申请单
            .state('businessApplication', {
                nativeTransitions: null,
                url: "/businessApplication",
                templateUrl: "templates/businessApplication/businessApplication.html",
                cache: false,
                controller: 'BusinessApplicationController'
            })


            /* add by yyma start */
			 // 客户列表页面		
			.state( 'CustomerList', {
				nativeTransitions : null,
				url : "/CustomerList",
				templateUrl : "templates/common/commonList.html",
				cache : false,
				controller : 'CustomerListController'
			})
			/* add by yyma end */

            //业务申请主页
            .state('businessApply', {
                nativeTransitions: null,
                url: 'businessApply',
                templateUrl: 'templates/businessApply/businessApplyIndex.html',
                cache: false,
                controller: 'businessApplyIndexController'
            })

            //业务申请实现模块
            .state('businessApplyType', {
                nativeTransitions: null,
                url: 'businessApply/:ApplyType',
                templateUrl: 'templates/common/commonList.html',
                cache: false,
                controller: 'BusinessApplyController'
            })
            //催收管理
            .state('collectManaerment', {
                nativeTransitions: null,
                url: "/collectManagement/:SerialNo",
                templateUrl: "templates/collectManagement/collectManagement.html",
                cache: false,
                controller: 'collectManagementController'
        })

            // 贷款工具
            .state('loanCalcIndex', {
                nativeTransitions: null,
                url: "/loanCalcIndex",
                templateUrl: "templates/loanCalc/loanCalcIndex.html",
                cache: false,
                controller: 'loanCalcController'
            })

            //商业贷款计算
            .state('commericialLoan', {
                nativeTransitions: null,
                url: "/commericialLoan",
                templateUrl: "templates/loanCalc/commericialLoan.html",
                cache: false,
                controller: 'commericialLoanController'
            })

            //协议还款计算
            .state('agreementRepayment', {
                nativeTransitions: null,
                url: "/agreementRepayment",
                templateUrl: "templates/loanCalc/agreementRepayment.html",
                cache: false,
                controller: 'agreementRepaymentController'
            })

            //公积金计算
            .state('providentFundLoan', {
                nativeTransitions: null,
                url: "/providentFundLoan",
                templateUrl: "templates/loanCalc/providentFundLoan.html",
                cache: false,
                controller: 'providentFundLoanController'
            })

            //贴现计算
            .state('discountCalc', {
                nativeTransitions: null,
                url: "/discountCalc",
                templateUrl: "templates/loanCalc/discountCalc.html",
                cache: false,
                controller: 'discountCalcController'
            })

            //组合贷款计算
            .state('portfolioLoan', {
                nativeTransitions: null,
                url: "/portfolioLoan",
                templateUrl: "templates/loanCalc/portfolioLoan.html",
                cache: false,
                controller: 'portfolioLoanController'
            })

            
            
            //add by cwxu 20170725
            //进入营销主页
            .state('marketing',{
            	url:"/marketing",
            	cache:false,
            	templateUrl:"templates/market/marketingIndex.html",
            	controller:'marketController'
            })
            
            //进入营销任务管理
            .state('markerTask',{
            	url:"/marketing/marketTask",
            	cache:false,
            	templateUrl:"templates/common/commonList.html",
            	controller:'marketTaskController'
            })
            
/*            //新增营销任务
            .state('createMarkerUser', {
                url: "/marketing/createMarkerUser",
                templateUrl: "templates/market/marketCreate.html",
                cache: false,
                controller: 'createMarketController'
            })*/
            
            //营销客户管理
            .state('marketIndquery', {
                nativeTransitions: null,
                url: "/market/marketIndquery",
                templateUrl: "templates/market/marketQueryInfo.html",
                cache: false,
                controller: 'marketInfoController'
            })
            
            /* yli18 start */
            //合同放款-主菜单
            .state('loanContract',{
            	url:"/loanContract",
            	cache:false,
            	templateUrl:"templates/loanContract/loanContractIndex.html",
            	controller:'loanContractController'
            })
            //合同放款-合同登记列表
            .state('loanContractList',{
            	url:"/loanContractList",
            	cache:false,
            	templateUrl:"templates/common/commonList.html",
            	controller:'loanContractListController'
            })
            //合同放款-合同生效列表
            .state('applyContractList',{
            	url:"/applyContractList",
            	cache:false,
            	templateUrl:"templates/common/commonList.html",
            	controller:'applyContractListController'
            })
            //合同放款-额度生效列表
            .state('amountForceList',{
            	url:"/amountForceList",
            	cache:false,
            	templateUrl:"templates/common/commonList.html",
            	controller:'amountForceListController'
            })
            //合同放款-放款申请列表
            .state('applyLoanList',{
            	url:"/applyLoanList",
            	cache:false,
            	templateUrl:"templates/common/commonList.html",
            	controller:'applyLoanListController'
            })
            /* yli18 end */
              /**贷后管理 start*/
            /**主菜单*/
            .state('inspect', {
                nativeTransitions: null,
                url: "/inspectMenu",
                templateUrl: "templates/inspect/inspectMenu.html",
                cache: false,
                controller: 'inspectMenuController'
            })
            /**个人首检列表展示*/
            .state('indFirstInspect', {
            	nativeTransitions: null,
            	url: "/indFirstInspect",
            	templateUrl: "templates/common/commonList.html",
            	cache: false,
            	controller: 'indFirstInspectListController'
            })
           
            /**公司首检列表展示*/
            .state('entFirstInspect', {
            	nativeTransitions: null,
            	url: "/entFirstInspect",
            	templateUrl: "templates/common/commonList.html",
            	cache: false,
            	controller: 'entFirstInspectListController'
            })
            /**个人定检列表展示*/
            .state('indCustomerInspect', {
            	nativeTransitions: null,
            	url: "/indCustomerInspect",
            	templateUrl: "templates/common/commonList.html",
            	cache: false,
            	controller: 'indCustomerInspectListController'
            })
            
            /**公司定检列表展示*/
            .state('entCustomerInspect', {
            	nativeTransitions: null,
            	url: "/entCustomerInspect",
            	templateUrl: "templates/common/commonList.html",
            	cache: false,
            	controller: 'entCustomerInspectListController'
            })
            
            /**小企业首检列表展示*/
            .state('smeFirstInspect', {
            	nativeTransitions: null,
            	url: "/smeFirstInspect",
            	templateUrl: "templates/common/commonList.html",
            	cache: false,
            	controller: 'smeFirstInspectListController'
            })
            
            /**小企业定检列表展示*/
            .state('smeCustomerInspect', {
            	nativeTransitions: null,
            	url: "/smeCustomerInspect",
            	templateUrl: "templates/common/commonList.html",
            	cache: false,
            	controller: 'smeCustomerInspectListController'
            })
            /**贷后管理 end*/

        $urlRouterProvider.otherwise('/');
    });

AmApp.redirect = function ($state, name, params) {
    if (AmApp.UserId && name == 'logon')
        name = 'myAccount';
    $state.go(name, params);
};
