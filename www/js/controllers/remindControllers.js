angular.module('com.amarsoft.mobile.controllers.remind', ['ngSanitize', 'ngAnimate'])

    // *******************
    //日常工作提示模块
/*
  --待审查审批信贷业务0030
--待处理的风险预警认定申请0270
--待处理贷后变更申请(待处理业务变更申请) 0250
--待处理风险分类申请(待处理的五级分类申请)0135
--待处理的常规贷后检查审核任务 0110
--待审查审批信贷业务（客户名称、业务品种、发生类型、金额、币种）0030
--待处理的审单审核任务（客户名称、业务品种、发生类型、金额、币种）0047
--待处理的垫款审核任务（客户名称、业务品种、金额、币种）0050
--待处理业务变更申请（客户名称、业务品种、发生类型、金额、币种） 0250
--待处理的担保变更审批任务（客户名称、业务品种、金额、币种）0080
--待处理的核销审核任务（客户名称、金额、币种）0120
--待处理的诉讼停息审核任务（客户名称、金额、币种）0130
  --待处理的资产转让审核任务（客户名称、金额、币种）0145
*/
	//*******************
	//业务提示
//7天内到期的业务010010
//7天内到期的分期还款业务010042
//发生欠息的业务 010050
//逾期贷款提示010060
//还款到期提示010070


    // *******************
    .controller('RemindController', function ($scope,$timeout,$list,$model) {
		$scope.param = {
				pageSize : 8,
				pageNo : 1,
				groupId : "remindList",
				className : "com.amarsoft.app.als.mobile.impl.RemindListImpl",
				methodName : "findRemindList",
				menuTitle : "我的工作台",
				flag : true,
				Transaction:"null"
			}
			$model.init($scope);
			$list.load($scope,$scope.param);
		
			//List点击行事件
			var num1 = 0;
			var num2 = 0;
			$scope.goDetail = function (item, index) {
				if($scope.items.length == 0){
					return false;
				}
				var itemNo;
				if(item == undefined){
					//$scope.menuIndex,上部一级菜单选中索引
					if($scope.menuIndex == 0){
						//此时是刚点击了“日常工作提醒”
						num1 = 1;
						num2 = 0;
					}else if($scope.menuIndex == 1){
						//此时是刚点击了“业务提醒”
						num1 = 0;
						num2 = 1;
					}
				}else{
					itemNo = item.ItemNo;
					if($scope.menuIndex == 0){
						//此时是刚点击了“日常工作提醒”
						num1 = num1 + 1;
						num2 = 0;
					}else if($scope.menuIndex == 1){
						//此时是刚点击了“业务提醒”
						num1 = 0;
						num2 = num2 + 1;
					}
				}
				if(num1 == 1 || num2 == 1){
                	index = 0;
                	//$scope.items,List列表数据
                	itemNo =  $scope.items[0].ItemNo;
                }
				
				$scope.listIndex = index;
				//$scope.selectedListItem = item;
				$scope.detailTitle = $scope.tabTitle;
				$scope.includeContent = $scope.selectedMenuItem["IncludeContent"];
				$scope.ngController = "remindCommonController";	
				$timeout(function () {
					$scope.$broadcast('to-remindList',{
						//ItemNo : item["ItemNo"]
						ItemNo : itemNo
					});
				}, 100);
			}
		})
		
.controller('RemindCommonController', function ($scope,$detailList,$model) {
	$scope.$on("to-remindList",function(e,data){
		
			$scope.param = {
					pageSize : 8,
					pageNo : 1,
					groupId : "remindListInfo",
					className : "com.amarsoft.app.als.mobile.impl.RemindListImpl",
					methodName : "findRemindListInfo",
					flag : true,
					Transaction:"null"
			}
			$model.init($scope);
			//获取List列表查询参数
			$scope.setListGroupParam = function(){
				$scope.listGroupColId = data["ItemNo"];
			}
			$scope.setDetailListParam = function(detailListParam){
				detailListParam["ItemNo"] = data["ItemNo"];
				detailListParam["orgID"]=AmApp.orgID;
			}
			$detailList.load($scope,$scope.param);
			$scope.chooseDetail = function(){};
		});
	
})
    

    // 业务提醒
    .controller('TipsDetailController', function ($scope,$rootScope, $state, basePage, $http, $ionicLoading, $ionicPopup) {
        $scope.$on('To-TipsDetailController', function (e, data) {
            $scope.items = [];
            basePage.init($scope, loadData);
        });
        var iPageSize = 6;
        var loadData = function () {
            runServiceWithSession(
                $http,
                $ionicLoading,
                $ionicPopup,
                $state,
                "maturityCheck",
                {
                    UserId: AmApp.userID,
                    Flag: AmApp.flag,
                    pageSize: iPageSize,
                    pageNo: $scope.pageNo
                },
                function (data, status) {
                	console.log(data);
                	for (var i = 0; i < data["array"].length; i++) {
                		 data["array"][i].IconCode = strEscape(data["array"][i].Iconcode);
                        $scope.items.push(data["array"][i]);
				}
            	if ($scope.items.length > 0) {
                    $scope.$emit('to-selectRowItep', $scope.items[0]);
                }
					$scope.hasMore = (($scope.pageNo - 1) * iPageSize + data["array"].length < data.totalCount);
					$scope.$broadcast('scroll.refreshComplete');
					$scope.$broadcast('scroll.infiniteScrollComplete');
                });
        };
    })
    //日常工作提醒
    .controller('DueRemindController', function ($scope, $stateParams, $http, $state, $ionicLoading, $ionicPopup, basePage,$rootScope) {
    	$scope.$on('To-RemindController', function (e, data) {
            //待子控制器发送广播通知父控制器交易执行完毕后,二级导航栏的按钮才能被点击,防止快速重复点击
            $scope.items = [];
            basePage.init($scope, loadData);
        });
    	$scope.items = [];
        var iPageSize = 15;
        var loadData = function () {
            runServiceWithSession(
                $http,
                $ionicLoading,
                $ionicPopup,
                $state,
                "taskCheck",
                {
                    UserId: AmApp.userID,
                    Flag: AmApp.flag,
                    pageSize: iPageSize,
                    pageNo: $scope.pageNo
                },
                function (data, status) {
                	for (var i = 0; i < data["array"].length; i++) {
                		 data["array"][i].IconCode = strEscape(data["array"][i].IconCode);
                            $scope.items.push(data["array"][i]);
					}
                	if ($scope.items.length > 0) {
                        $scope.$emit('to-selectRow', $scope.items[0]);
                    }
					$scope.loadingMore = false;
					$scope.hasMore = (($scope.pageNo - 1) * iPageSize + data["array"].length < data.totalCount);
					$scope.$broadcast('scroll.refreshComplete');
					$scope.$broadcast('scroll.infiniteScrollComplete');

                });
        };
        basePage.init($scope,loadData);
    })

    //待审查审批信贷业务 CheckApproveController
    .controller('CheckApproveController', function ($http, $scope, $state, paging, $stateParams, $ionicLoading, $ionicPopup) {
    	 
        $scope.$on("to-CheckApproveController", function (e, data) {
            $scope.items = [];
            $scope.WorkNo = data.WorkNo;
            $scope.WorkName = data.WorkName;
            paging.init($scope, iPageSize, 1, loadData, true);
            $scope.refresh();

        });
        var iPageSize = 10;

        var loadData = function () {
            runServiceWithSession(
                $http,
                null,
                $ionicPopup,
                $state,
                "CheckBusiness" + $scope.WorkNo,
                {
                    UserId: AmApp.userID,
                    Flag: AmApp.flag,
                    pageSize: iPageSize,
                    pageNo: $scope.pageNo

                },
                function (data, status) {
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
                    // $scope.$emit('to-taskParent', "loadcomplete");
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    appIonicLoading.hide();

                });
        };


    })
    //待处理的常规贷后检查审核任务CGDHPendingController
    .controller('CGDHPendingController', function ($http, $scope, $state, paging, $stateParams, $ionicLoading, $ionicPopup) {
    	/*$scope.$on('to-selectRow', function (event, data) {
            $scope.gotoTaskInfo1(0, data);
        });*/
    	$scope.$on("to-CGDHPendingController", function (e, data) {
            $scope.items = [];
            $scope.WorkNo = data.WorkNo;
            $scope.WorkName = data.WorkName;
            paging.init($scope, iPageSize, 1, loadData, true);
            $scope.refresh();

        });
        var iPageSize = 10;
        var loadData = function () {
            runServiceWithSession(
                $http,
                null,
                $ionicPopup,
                $state,
                "CheckBusiness" + $scope.WorkNo,
                {
                    UserId: AmApp.userID,
                    Flag: AmApp.flag,
                    pageSize: iPageSize,
                    pageNo: $scope.pageNo

                },
                function (data, status) {
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
                    // $scope.$emit('to-taskParent', "loadcomplete");
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    appIonicLoading.hide();

                });
        };


    })
    //待处理业务变更申请IndCreditController
    .controller('IndCreditController', function ($http, $scope, $state, paging, $stateParams, $ionicLoading, $ionicPopup) {
    	/*$scope.$on('to-selectRow', function (event, data) {
            $scope.gotoTaskInfo1(0, data);
        });*/
    	$scope.$on("to-IndCreditController", function (e, data) {
            $scope.items = [];
            $scope.WorkNo = data.WorkNo;
            $scope.WorkName = data.WorkName;
            paging.init($scope, iPageSize, 1, loadData, true);
            $scope.refresh();

        });
        var iPageSize = 10;
        var loadData = function () {
            runServiceWithSession(
                $http,
                null,
                $ionicPopup,
                $state,
                "CheckBusiness" + $scope.WorkNo,
                {
                    UserId: AmApp.userID,
                    Flag: AmApp.flag,
                    pageSize: iPageSize,
                    pageNo: $scope.pageNo

                },
                function (data, status) {
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
                    // $scope.$emit('to-taskParent', "loadcomplete");
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    appIonicLoading.hide();

                });
        };


    })
    //待处理的风险预警认定申请WarningSignalController
    .controller('WarningSignalController', function ($http, $scope, $state, paging, $stateParams, $ionicLoading, $ionicPopup) {
    	/*$scope.$on('to-selectRow', function (event, data) {
            $scope.gotoTaskInfo1(0, data);
        });*/
    	$scope.$on("to-WarningSignalController", function (e, data) {
            $scope.items = [];
            $scope.WorkNo = data.WorkNo;
            $scope.WorkName = data.WorkName;
            paging.init($scope, iPageSize, 1, loadData, true);
            $scope.refresh();
        });
        var iPageSize = 10;
        var loadData = function () {
            runServiceWithSession(
                $http,
                null,
                $ionicPopup,
                $state,
                "CheckBusiness" + $scope.WorkNo,
                {
                    UserId: AmApp.userID,
                    Flag: AmApp.flag,
                    pageSize: iPageSize,
                    pageNo: $scope.pageNo

                },
                function (data, status) {
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
                    // $scope.$emit('to-taskParent', "loadcomplete");
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    appIonicLoading.hide();

                });
        };


    })
    //待处理的审单审核任务CheckOrderController
    .controller('CheckOrderController', function ($http, $scope, $state, paging, $stateParams, $ionicLoading, $ionicPopup) {
    	/*$scope.$on('to-selectRow', function (event, data) {
            $scope.gotoTaskInfo1(0, data);
        });*/
    	$scope.$on("to-CheckOrderController", function (e, data) {
            $scope.items = [];
            $scope.WorkNo = data.WorkNo;
            $scope.WorkName = data.WorkName;
            paging.init($scope, iPageSize, 1, loadData, true);
            $scope.refresh();
        });
        var iPageSize = 10;
        var loadData = function () {
            runServiceWithSession(
                $http,
                null,
                $ionicPopup,
                $state,
                "CheckBusiness" + $scope.WorkNo,
                {
                    UserId: AmApp.userID,
                    Flag: AmApp.flag,
                    pageSize: iPageSize,
                    pageNo: $scope.pageNo

                },
                function (data, status) {
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
                    // $scope.$emit('to-taskParent', "loadcomplete");
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    appIonicLoading.hide();

                });
        };


    })
    //待处理的垫款审核任务AdvanceCashController
    .controller('AdvanceCashController', function ($http, $scope, $state, paging, $stateParams, $ionicLoading, $ionicPopup) {
    	/*$scope.$on('to-selectRow', function (event, data) {
            $scope.gotoTaskInfo1(0, data);
        });*/
    	$scope.$on("to-AdvanceCashController", function (e, data) {
            $scope.items = [];
            $scope.WorkNo = data.WorkNo;
            $scope.WorkName = data.WorkName;
            paging.init($scope, iPageSize, 1, loadData, true);
            $scope.refresh();
        });
        var iPageSize = 10;
        var loadData = function () {
            runServiceWithSession(
                $http,
                null,
                $ionicPopup,
                $state,
                "CheckBusiness" + $scope.WorkNo,
                {
                    UserId: AmApp.userID,
                    Flag: AmApp.flag,
                    pageSize: iPageSize,
                    pageNo: $scope.pageNo

                },
                function (data, status) {
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
                    // $scope.$emit('to-taskParent', "loadcomplete");
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    appIonicLoading.hide();

                });
        };


    })
    //待处理的担保变更审批任务TransformAJAXController
    .controller('TransformAJAXController', function ($http, $scope, $state, paging, $stateParams, $ionicLoading, $ionicPopup) {
    	/*$scope.$on('to-selectRow', function (event, data) {
            $scope.gotoTaskInfo1(0, data);
        });*/
    	$scope.$on("to-TransformAJAXController", function (e, data) {
            $scope.items = [];
            $scope.WorkNo = data.WorkNo;
            $scope.WorkName = data.WorkName;
            paging.init($scope, iPageSize, 1, loadData, true);
            $scope.refresh();
        });
        var iPageSize = 10;
        var loadData = function () {
            runServiceWithSession(
                $http,
                null,
                $ionicPopup,
                $state,
                "CheckBusiness" + $scope.WorkNo,
                {
                    UserId: AmApp.userID,
                    Flag: AmApp.flag,
                    pageSize: iPageSize,
                    pageNo: $scope.pageNo

                },
                function (data, status) {
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
                    // $scope.$emit('to-taskParent', "loadcomplete");
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    appIonicLoading.hide();

                });
        };


    })
    //待处理的核销审核任务HXPendingController
    .controller('HXPendingController', function ($http, $scope, $state, paging, $stateParams, $ionicLoading, $ionicPopup) {
    	/*$scope.$on('to-selectRow', function (event, data) {
            $scope.gotoTaskInfo1(0, data);
        });*/
    	$scope.$on("to-HXPendingController", function (e, data) {
            $scope.items = [];
            $scope.WorkNo = data.WorkNo;
            $scope.WorkName = data.WorkName;
            paging.init($scope, iPageSize, 1, loadData, true);
            $scope.refresh();
        });
        var iPageSize = 10;
        var loadData = function () {
            runServiceWithSession(
                $http,
                null,
                $ionicPopup,
                $state,
                "CheckBusiness" + $scope.WorkNo,
                {
                    UserId: AmApp.userID,
                    Flag: AmApp.flag,
                    pageSize: iPageSize,
                    pageNo: $scope.pageNo

                },
                function (data, status) {
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
                    // $scope.$emit('to-taskParent', "loadcomplete");
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    appIonicLoading.hide();

                });
        };


    })
     //待处理的诉讼停息审核任务SSTXPendingController
    .controller('SSTXPendingController', function ($http, $scope, $state, paging, $stateParams, $ionicLoading, $ionicPopup) {
    	/*$scope.$on('to-selectRow', function (event, data) {
            $scope.gotoTaskInfo1(0, data);
        });*/
    	$scope.$on("to-SSTXPendingController", function (e, data) {
            $scope.items = [];
            $scope.WorkNo = data.WorkNo;
            $scope.WorkName = data.WorkName;
            paging.init($scope, iPageSize, 1, loadData, true);
            $scope.refresh();
        });
        var iPageSize = 10;
        var loadData = function () {
            runServiceWithSession(
                $http,
                null,
                $ionicPopup,
                $state,
                "CheckBusiness" + $scope.WorkNo,
                {
                    UserId: AmApp.userID,
                    Flag: AmApp.flag,
                    pageSize: iPageSize,
                    pageNo: $scope.pageNo

                },
                function (data, status) {
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
                    // $scope.$emit('to-taskParent', "loadcomplete");
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    appIonicLoading.hide();

                });
        };


    })
    //待处理的资产转让审核任务ZCZLPendingController
    .controller('ZCZLPendingController', function ($http, $scope, $state, paging, $stateParams, $ionicLoading, $ionicPopup) {
    	/*$scope.$on('to-selectRow', function (event, data) {
            $scope.gotoTaskInfo1(0, data);
        });*/
    	$scope.$on("to-ZCZLPendingController", function (e, data) {
            $scope.items = [];
            $scope.WorkNo = data.WorkNo;
            $scope.WorkName = data.WorkName;
            paging.init($scope, iPageSize, 1, loadData, true);
            $scope.refresh();
        });
        var iPageSize = 10;
        var loadData = function () {
            runServiceWithSession(
                $http,
                null,
                $ionicPopup,
                $state,
                "CheckBusiness" + $scope.WorkNo,
                {
                    UserId: AmApp.userID,
                    Flag: AmApp.flag,
                    pageSize: iPageSize,
                    pageNo: $scope.pageNo

                },
                function (data, status) {
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
                    // $scope.$emit('to-taskParent', "loadcomplete");
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    appIonicLoading.hide();

                });
        };


    })
     //待处理的五级分类申请ClassifyApproveController
    .controller('ClassifyApproveController', function ($http, $scope, $state, paging, $stateParams, $ionicLoading, $ionicPopup) {
    	$scope.$on("to-ClassifyApproveController", function (e, data) {
            $scope.items = [];
            $scope.WorkNo = data.WorkNo;
            $scope.WorkName = data.WorkName;
            paging.init($scope, iPageSize, 1, loadData, true);
            $scope.refresh();
        });
        var iPageSize = 10;
        var loadData = function () {
            runServiceWithSession(
                $http,
                null,
                $ionicPopup,
                $state,
                "CheckBusiness" + $scope.WorkNo,
                {
                    UserId: AmApp.userID,
                    Flag: AmApp.flag,
                    pageSize: iPageSize,
                    pageNo: $scope.pageNo

                },
                function (data, status) {
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
                    // $scope.$emit('to-taskParent', "loadcomplete");
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    appIonicLoading.hide();

                });
        };


    })
    
    
    //待审查审批信贷业务 CreditLoanController
    .controller('CreditLoanController', function ($http, $scope, $state, paging, $stateParams, $ionicLoading, $ionicPopup) {
    	/*$scope.$on('to-selectRow', function (event, data) {
            $scope.gotoTaskInfo1(0, data);
        });*/
        $scope.$on("to-CreditLoanController", function (e, data) {
            $scope.items = [];
            $scope.WorkNo = data.WorkNo;
            $scope.WorkName = data.WorkName;
            paging.init($scope, iPageSize, 1, loadData, true);
            $scope.refresh();

        });
        var iPageSize = 10;

        var loadData = function () {
            runServiceWithSession(
                $http,
                null,
                $ionicPopup,
                $state,
                "Check" + $scope.WorkNo,
                {
                    UserId: AmApp.userID,
                    //Flag: AmApp.flag,
                    pageSize: iPageSize,
                    pageNo: $scope.pageNo

                },
                function (data, status) {
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
                    // $scope.$emit('to-taskParent', "loadcomplete");
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    appIonicLoading.hide();

                });
        };


    })
    
    
    
    //7天内到期的业务FinishBusinessController
    .controller('FinishBusinessController', function ($http, $scope, $state, paging, $stateParams, $ionicLoading, $ionicPopup) {
    	
        $scope.$on("to-FinishBusinessController", function (e, data) {
            $scope.items = [];
            $scope.ItemNo = data.ItemNo;
            $scope.ItemName = data.ItemName;
            paging.init($scope, iPageSize, 1, loadData, true);
            $scope.refresh();

        });
        var iPageSize = 10;

        var loadData = function () {
            runServiceWithSession(
                $http,
                null,
                $ionicPopup,
                $state,
                "Business" + $scope.ItemNo,
                {
                    UserId: AmApp.userID,
                    Flag: AmApp.flag,
                    pageSize: iPageSize,
                    pageNo: $scope.pageNo

                },
                function (data, status) {
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
                    // $scope.$emit('to-taskParent', "loadcomplete");
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    appIonicLoading.hide();

                });
        };


    })
    //业务欠息监控BackRateListController
    .controller('BackRateListController', function ($http, $scope, $state, paging, $stateParams, $ionicLoading, $ionicPopup) {
    	$scope.$on('to-selectRowItep', function (event, data) {
            $scope.gotoInfo(0, data);
        });
        $scope.$on("to-BackRateListController", function (e, data) {
            $scope.items = [];
            $scope.ItemNo = data.ItemNo;
            $scope.ItemName = data.ItemName;
            paging.init($scope, iPageSize, 1, loadData, true);
            $scope.refresh();

        });
        var iPageSize = 10;
        var loadData = function () {
            runServiceWithSession(
                $http,
                null,
                $ionicPopup,
                $state,
                "Business" + $scope.ItemNo,
                {
                    UserId: AmApp.userID,
                    Flag: AmApp.flag,
                    OrgId: AmApp.orgID,
                    pageSize: iPageSize,
                    pageNo: $scope.pageNo
                },
                function (data, status) {
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
                    // $scope.$emit('to-taskParent', "loadcomplete");
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    appIonicLoading.hide();

                });
        };
    })
    //业务逾期监控OverDueDaysListController
    .controller('OverDueDaysListController', function ($http, $scope, $state, paging, $stateParams, $ionicLoading, $ionicPopup) {
    	$scope.$on('to-selectRowItep', function (event, data) {
            $scope.gotoInfo(0, data);
        });
        $scope.$on("to-OverDueDaysListController", function (e, data) {
            $scope.items = [];
            $scope.ItemNo = data.ItemNo;
            $scope.ItemName = data.ItemName;
            paging.init($scope, iPageSize, 1, loadData, true);
            $scope.refresh();

        });
        var iPageSize = 10;
        var loadData = function () {
            runServiceWithSession(
                $http,
                null,
                $ionicPopup,
                $state,
                "Business" + $scope.ItemNo,
                {
                    UserId: AmApp.userID,
                    Flag: AmApp.flag,
                    OrgId: AmApp.orgID,
                    pageSize: iPageSize,
                    pageNo: $scope.pageNo
                },
                function (data, status) {
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
                    // $scope.$emit('to-taskParent', "loadcomplete");
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    appIonicLoading.hide();

                });
        };
    })
    //还款日前7天提醒(含第7天)RepayMentAlarmController
    .controller('RepayMentAlarmController', function ($http, $scope, $state, paging, $stateParams, $ionicLoading, $ionicPopup) {
    	$scope.$on('to-selectRowItep', function (event, data) {
            $scope.gotoInfo(0, data);
        });
        $scope.$on("to-RepayMentAlarmController", function (e, data) {
            $scope.items = [];
            $scope.ItemNo = data.ItemNo;
            $scope.ItemName = data.ItemName;
            paging.init($scope, iPageSize, 1, loadData, true);
            $scope.refresh();

        });
        var iPageSize = 10;
        var loadData = function () {
            runServiceWithSession(
                $http,
                null,
                $ionicPopup,
                $state,
                "Business" + $scope.ItemNo,
                {
                    UserId: AmApp.userID,
                    Flag: AmApp.flag,
                    OrgId: AmApp.orgID,
                    ItemNo:$scope.ItemNo,
                    pageSize: iPageSize,
                    pageNo: $scope.pageNo
                },
                function (data, status) {
                	console.log(data);
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
                    // $scope.$emit('to-taskParent', "loadcomplete");
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    appIonicLoading.hide();

                });
        };
    })
    //当天还款提醒RepayMentAlarm1Controller
    .controller('RepayMentAlarm1Controller', function ($http, $scope, $state, paging, $stateParams, $ionicLoading, $ionicPopup) {
    	$scope.$on('to-selectRowItep', function (event, data) {
            $scope.gotoInfo(0, data);
        });
        $scope.$on("to-RepayMentAlarm1Controller", function (e, data) {
            $scope.items = [];
            $scope.ItemNo = data.ItemNo;
            $scope.ItemName = data.ItemName;
            paging.init($scope, iPageSize, 1, loadData, true);
            $scope.refresh();

        });
        var iPageSize = 10;
        var loadData = function () {
            runServiceWithSession(
                $http,
                null,
                $ionicPopup,
                $state,
                "Business" + $scope.ItemNo,
                {
                    UserId: AmApp.userID,
                    Flag: AmApp.flag,
                    OrgId: AmApp.orgID,
                    ItemNo:$scope.ItemNo,
                    pageSize: iPageSize,
                    pageNo: $scope.pageNo
                },
                function (data, status) {
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
                    // $scope.$emit('to-taskParent', "loadcomplete");
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    appIonicLoading.hide();

                });
        };
    })
    
    
    
    
    
        //发生欠息业务DebitbusinessController
    .controller('DebitbusinessController', function ($http, $scope, $state, paging, $stateParams, $ionicLoading, $ionicPopup) {

        $scope.$on("to-DebitbusinessController", function (e, data) {
            $scope.items = [];
            $scope.ItemNo = data.ItemNo;
            $scope.ItemName = data.ItemName;
           /* $scope.IconCode = strEscape(data.IconCode);*/
            paging.init($scope, iPageSize, 1, loadData, true);
            $scope.refresh();

        });
        var iPageSize = 10;

        var loadData = function () {
            runServiceWithSession(
                $http,
                null,
                $ionicPopup,
                $state,
                "Business" + $scope.ItemNo,
                {
                    UserId: AmApp.userID,
                    pageSize: iPageSize,
                    pageNo: $scope.pageNo

                },
                function (data, status) {
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
                    // $scope.$emit('to-taskParent', "loadcomplete");
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    appIonicLoading.hide();

                });
        };


    })
    
    
    //逾期贷款提醒0040O OverbusinessController
    .controller('OverbusinessController', function ($http, $scope, $state, paging, $stateParams, $ionicLoading, $ionicPopup) {

        $scope.$on("to-OverbusinessController", function (e, data) {
            $scope.items = [];
            $scope.ItemNo = data.ItemNo;
            $scope.ItemName = data.ItemName;
           /* $scope.IconCode = strEscape(data.IconCode);*/
            paging.init($scope, iPageSize, 1, loadData, true);
            $scope.refresh();

        });
        var iPageSize = 10;

        var loadData = function () {
            runServiceWithSession(
                $http,
                null,
                $ionicPopup,
                $state,
                "Business" + $scope.ItemNo,
                {
                    UserId: AmApp.userID,
                    pageSize: iPageSize,
                    pageNo: $scope.pageNo

                },
                function (data, status) {
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
                    // $scope.$emit('to-taskParent', "loadcomplete");
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    appIonicLoading.hide();

                });
        };


    })

    // 中小企业资格认定
    .controller('QuaController', function ($http, $scope, $state, paging, $stateParams, $ionicLoading, $ionicPopup) {
        var iPageSize = 10;


        $scope.$on("to-QuaController", function (e, data) {
            $scope.items = [];
            $scope.ItemNo = data.ItemNo;
            $scope.ItemName = data.ItemName;
            $scope.IconCode = strEscape(data.IconCode);
            paging.init($scope, iPageSize, 1, loadData, true);
            $scope.refresh();
        });
        var loadData = function () {
            runServiceWithSession(
                $http,
                null,
                $ionicPopup,
                $state,
                "Check" + $scope.ItemNo,
                {
                    UserId: AmApp.userID,
                    pageSize: iPageSize,
                    pageNo: $scope.pageNo

                },
                function (data, status) {
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
                    // $scope.$emit('to-taskParent', "loadcomplete");
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    appIonicLoading.hide();

                });
        };


    })

    // 个人或者对公客户授信申请
    .controller('CreditController1', function ($http, $scope, $state, paging, $stateParams, $ionicLoading, $ionicPopup) {
        var iPageSize = 11;
        var i = 0;

        $scope.$on('to-Credit', function (e, data) {

            $scope.items = [];
            $scope.ItemNo = data.ItemNo;
            $scope.ItemName = data.ItemName;
            $scope.hasMore = false;
            paging.init($scope, iPageSize, 1, loadData, true);
            $scope.refresh();

        });

        // var loadData = function () {
        //     runServiceWithSession(
        //         $http,
        //         $ionicLoading,
        //         $ionicPopup,
        //         $state,
        //         "Check" + $scope.ItemNo, //根据ItemNo拼接一个请求
        //         {
        //             UserId: AmApp.userID,
        //             pageSize: 9,
        //             pageNo: $scope.pageNo
        //         },
        //         function (data, status) {
        //             for (var k = 0; k < data["array"].length; k++) {
        //                 data["array"][k].IconCode = strEscape(data["array"][k].IconCode);
        //                 $scope.items.push(data["array"][k]);
        //             }
        //             $scope.hasMore = (($scope.pageNo - 1)
        //             * iPageSize + data["array"].length < data.totalCount);
        //             $scope.loadingMore = false;
        //             if ($scope.items.length) {
        //                 $scope.noData = false;
        //             } else {
        //                 $scope.noData = true;
        //             }
        //             $scope.$emit('to-taskParent', "loadcomplete");
        //             $scope.$broadcast('scroll.refreshComplete');
        //             $scope.$broadcast('scroll.infiniteScrollComplete');
        //         });
        // };


        var loadData = function () {
            runServiceWithSession(
                $http,
                null,
                $ionicPopup,
                $state,
                "Check" + $scope.ItemNo, //根据ItemNo拼接一个请求
                {
                    UserId: AmApp.userID,
                    pageSize: iPageSize,
                    pageNo: $scope.pageNo
                },
                function (data, status) {
                    for (var k = 0; k < data["array"].length; k++) {
                        data["array"][k].IconCode = strEscape(data["array"][k].IconCode);
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
                    // $scope.$emit('to-taskParent', "loadcomplete");
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    appIonicLoading.hide();

                });
        };


        // $scope.gotoGZTX = function () {
        //     $state.go('');
        // }


    })
    .controller('CreditController2', function ($http, $scope, $state, paging, $stateParams, $ionicLoading, $ionicPopup) {
        var iPageSize = 15;
        var i = 0;
        $scope.$on('to-Credit1', function (e, data) {

            $scope.items = [];
            $scope.ItemNo = data.ItemNo;
            $scope.ItemName = data.ItemName;
            paging.init($scope, iPageSize, 1, loadData, true);
            $scope.refresh();
        });

        // var loadData = function () {
        //     runServiceWithSession(
        //         $http,
        //         $ionicLoading,
        //         $ionicPopup,
        //         $state,
        //         "Check" + $scope.ItemNo, //根据ItemNo拼接一个请求
        //         {
        //             UserId: AmApp.userID,
        //             pageSize: 9,
        //             pageNo: $scope.pageNo
        //         },
        //         function (data, status) {
        //             for (var k = 0; k < data["array"].length; k++) {
        //                 data["array"][k].IconCode = strEscape(data["array"][k].IconCode);
        //                 $scope.items.push(data["array"][k]);
        //             }
        //             $scope.hasMore = (($scope.pageNo - 1)
        //             * iPageSize + data["array"].length < data.totalCount);
        //             $scope.loadingMore = false;
        //             if ($scope.items.length) {
        //                 $scope.noData = false;
        //             } else {
        //                 $scope.noData = true;
        //             }
        //             $scope.$emit('to-taskParent', "loadcomplete");
        //             $scope.$broadcast('scroll.refreshComplete');
        //             $scope.$broadcast('scroll.infiniteScrollComplete');
        //         });
        // };


        var loadData = function () {
            runServiceWithSession(
                $http,
                null,
                $ionicPopup,
                $state,
                "Check" + $scope.ItemNo, //根据ItemNo拼接一个请求
                {
                    UserId: AmApp.userID,
                    pageSize: iPageSize,
                    pageNo: $scope.pageNo
                },
                function (data, status) {
                    for (var k = 0; k < data["array"].length; k++) {
                        /*data["array"][k].IconCode = strEscape(data["array"][k].IconCode);*/
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
                    // $scope.$emit('to-taskParent', "loadcomplete");
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    appIonicLoading.hide();

                });
        };


        // $scope.gotoGZTX = function () {
        //     $state.go('');
        // }


    })

    // 待登记合同页面
    .controller('WaitContractController', function ($http, $scope, $state, paging, $stateParams, $ionicLoading, $ionicPopup) {
        var iPageSize = 10;


        $scope.$on("to-WaitContractController", function (e, data) {
            $scope.items = [];
            $scope.ItemNo = data.ItemNo;
            $scope.ItemName = data.ItemName;
           $scope.IconCode = strEscape(data.IconCode);
            paging.init($scope, iPageSize, 1, loadData, true);
            $scope.refresh();
        });
        var loadData = function () {
            runServiceWithSession(
                $http,
                null,
                $ionicPopup,
                $state,
                "Check" + $scope.ItemNo,
                {
                    UserId: AmApp.userID,
                    pageSize: iPageSize,
                    pageNo: $scope.pageNo
                },
                function (data, status) {
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
                    // $scope.$emit('to-taskParent', "loadcomplete");
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    appIonicLoading.hide();

                });
        };


    })

    // 到期业务列表
    .controller(
        'BusinessController',
        function ($scope, $state, $http, $stateParams, $ionicPopup,
                  $ionicLoading, paging) {

            $scope.$on("to-BusinessController", function (e, data) {

                $scope.MaturityDate = data.maturityDate;
                paging.init($scope, iPageSize, 1, loadData, true);
                $scope.refresh();

            });


            var iPageSize = 10;
            var loadData = function () {
                runServiceWithSession(
                    $http,
                    undefined,
                    $ionicPopup,
                    $state,
                    "maturityBiz",
                    {
                        pageSize: iPageSize,
                        pageNo: $scope.pageNo,
                        UserId: AmApp.userID,
                        MaturityDate: $scope.MaturityDate
                    },
                    function (data, status) {
                        for (var k = 0; k < data["array"].length; k++) {
                            parseFloat(data["array"][k].balance);
                            /*data["array"][k].IconCode = strEscape(data["array"][k].IconCode);*/
                            $scope.items.push(data["array"][k]);
                        }
                        $scope.hasMore = (($scope.pageNo - 1) * iPageSize
                        + data["array"].length < data.totalCount);
                        $scope.loadingMore = false;
                        if ($scope.items.length) {
                            $scope.noData = false;
                        } else {
                            $scope.noData = true;
                        }
                        //通知左侧列表 已加载完毕
                        // $scope.$emit('to-businessParent', "loadcomplete");
                        $scope.$broadcast('scroll.refreshComplete');
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                        appIonicLoading.hide();
                    });
            };

        })



    // 待处理的支付
    .controller('WaitPaymentController', function ($http, $scope, $state, paging, $stateParams, $ionicLoading, $ionicPopup) {

        $scope.$on("to-WaitPaymentController", function (e, data) {
            $scope.items = [];
            $scope.ItemNo = data.ItemNo;
            $scope.ItemName = data.ItemName;
            /*$scope.IconCode = strEscape(data.IconCode);*/
            paging.init($scope, iPageSize, 1, loadData, true);
            $scope.refresh();

        });
        var iPageSize = 10;
        var loadData = function () {
            runServiceWithSession(
                $http,
                null,
                $ionicPopup,
                $state,
                "Check" + $scope.ItemNo,
                {
                    UserId: AmApp.userID,
                    pageSize: iPageSize,
                    pageNo: $scope.pageNo
                },
                function (data, status) {
                    for (var k = 0; k < data["array"].length; k++) {
                        $scope.items.push(data["array"][k]);
                    }
                    $scope.hasMore = (($scope.pageNo - 1) * iPageSize
                    + data["array"].length < data.totalCount);
                    $scope.loadingMore = false;
                    if ($scope.items.length) {
                        $scope.noData = false;
                    } else {
                        $scope.noData = true;
                    }

                    // $scope.$emit('to-taskParent', "loadcomplete");
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
        };


    })

    .controller('TipNoDataTipController', function ($scope, $state, $stateParams, $http, $ionicPopup, $ionicLoading, basePage,$rootScope) {
        $rootScope.tipsNoDataPageFlag = false;

    })
;