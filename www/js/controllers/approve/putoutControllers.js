/**
 * Created by HanTang on 17/2/21.
 * 放款流程
 */
angular.module('com.amarsoft.mobile.controllers.approve.putout', ['ngSanitize', 'ngAnimate'])
    // 放贷申请-申请信息列表
    .controller(
        'putOutApplyListController',
        function ($scope, $rootScope, $state, $http, $ionicLoading, $ionicPopup, $stateParams, paging,$ionicScrollDelegate) {
            var iPageSize = 8;
            $rootScope.rightContentListShowFlag = true;
            $scope.$on('to_putOutApplyListController', function (e, data) {
                $rootScope.rightContentListShowFlag = data.rightContentListShowFlag;
                $scope.selectedRow = -1;
                $scope.FlowNo = data.FlowNo;
                $scope.PhaseNo = data.PhaseNo;
                $scope.FlowNo = data.FlowNo;
                $scope.FinishedFlag = data.FinishedFlag;
                $scope.FTObjectType = data.FTObjectType;

                $scope.selectTab0 = true;
                $scope.selectTab1 = false;
                $scope.selectTab2 = false;
                $scope.selectTab3 = false;
                paging.init($scope, iPageSize, 1, loadData, true);
                $scope.refresh();
            });
            var loadData = function ($ionicLoading) {
                runServiceWithSession($http, undefined, $ionicPopup, $state,
                    "applyList", {
                        pageSize: iPageSize,
                        pageNo: $scope.pageNo,
                        flowNo: $scope.FlowNo,
                        phaseNo: $scope.PhaseNo,
                        finishedFlag: $scope.FinishedFlag,
                        ftObjectType: $scope.FTObjectType
                    }, function (data, status) {
                        for (var k = 0; k < data["array"].length; k++) {
                            //数据展现格式也在后端处理，前端尽量只做展现
//								parseFloat(data["array"][k].amount);
                            data["array"][k].IconCode = strEscape(data["array"][k].IconCode);
                            $scope.items.push(data["array"][k]);
                        }
                        $scope.hasMore = (($scope.pageNo - 1) * iPageSize
                        + data["array"].length < data.totalCount);
                        $scope.loadingMore = false;
                        if ($scope.items.length) {
                            $scope.noData = false;
                            $rootScope.noDataPageFlag=false;
                        } else {
                            $scope.noData = true;
                        }
                        appIonicLoading.hide();
                        $scope.$broadcast('scroll.refreshComplete');
                        $scope.$broadcast('scroll.infiniteScrollComplete');

                    });
            };
            $scope.gotoApplyInfo = function (item, index) {
                $scope.selectedRow = index;
                //用户判断获取详情交易是否全部执行完毕,完毕后关闭 appIonicLoading
                $rootScope.putOutDetailCount = 0;
                appIonicLoading.show({
                    template: '正在加载中',
                    animation: 'fade-in',
                    showBackdrop: true,
                    duration: 30000
                });
                $rootScope.rightContentListShowFlag = false;
                var data = {
                    SerialNo: item.SerialNo,
                    FTObjectType: $scope.FTObjectType,
                    FTSerialNo: item.FTSerialNo,
                    BCSerialNo: item.ContractSerialNo,
                    CustomerID: item.CustomerID,
                    CustomerName: item.CustomerName,
                    BusinessType: item.BusinessType
                };

                $scope.$broadcast('to-putOutFlow', data);
                $scope.$broadcast('to-signOpinion', data);


            }


            $scope.selectTask = function (tabIndex) {
                $ionicScrollDelegate.scrollTop();
                if (tabIndex == '0') {
                    $scope.selectTab0 = true;
                    $scope.selectTab1 = false;
                    $scope.selectTab2 = false;
                    $scope.selectTab3 = false;
                } else if (tabIndex == '1') {
                    $scope.selectTab1 = true;
                    $scope.selectTab0 = false;
                    $scope.selectTab2 = false;
                    $scope.selectTab3 = false;
                } else if (tabIndex == '2') {
                    $scope.selectTab2 = true;
                    $scope.selectTab0 = false;
                    $scope.selectTab1 = false;
                    $scope.selectTab3 = false;
                } else if (tabIndex == '3') {
                    $scope.selectTab3 = true;
                    $scope.selectTab0 = false;
                    $scope.selectTab1 = false;
                    $scope.selectTab2 = false;
                }
            };


        })

    //出账详情-出账信息tab页
    .controller('PutOutController',
        function ($scope, $state, $stateParams, $http, $rootScope, $ionicLoading, $ionicPopup, basePage, $ionicScrollDelegate) {

            $scope.$on('to-putOutFlow', function (e, data) {
                $ionicScrollDelegate.scrollTop();
                $scope.items = [];
                $scope.SerialNo = data.SerialNo;
                $scope.BusinessType = data.BusinessType;
                basePage.init($scope, loadData);
            });
            $scope.items = [];
            var loadData = function ($ionicLoading) {
                runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
                    "putOutInfo", {
                        serialNo: $scope.SerialNo,
                        businessType: $scope.BusinessType
                    }, function (data, status) {
                        for (var i = 0; i < data["array"].length; i++) {
                            //增加参数，是否展示，页面载入时均展示
                            data["array"][i]['showGroup'] = true;
                            $scope.items.push(data["array"][i]);
                        }
                        $rootScope.putOutDetailCount = $rootScope.putOutDetailCount + 1;

                        if ($rootScope.putOutDetailCount == 4 && $scope.currentPage == 'putOut') {
                            appIonicLoading.hide();
                        }
                    });
            };
            $scope.showOrNot = function (item) {
                if (item.showGroup) {
                    item.showGroup = false;
                } else {
                    item.showGroup = true;
                    setTimeout(function () {
                        $scope.$apply(function () {
                            $ionicScrollDelegate.$getByHandle("smallScroll").scrollBy(0, 10, true);
                        });
                    }, 1);
                }
            };
        })

    //放贷流程-合同信息tab页
    .controller('PutOutContractController',
        function ($scope, $state, $stateParams, $http, $rootScope, $ionicLoading, $ionicPopup, basePage, $ionicScrollDelegate) {
            $scope.$on('to-putOutFlow', function (e, data) {
                $ionicScrollDelegate.scrollTop();
                $scope.items = [];
                $scope.BCSerialNo = data.BCSerialNo;
                $scope.BusinessType = data.BusinessType;
                basePage.init($scope, loadData);
            });


            var loadData = function ($ionicLoading) {
                runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
                    "contractInfo", {
                        serialNo: $scope.BCSerialNo,
                        businessType: $scope.BusinessType
                    }, function (data, status) {
                        for (var i = 0; i < data["array"].length; i++) {
                            //增加参数，是否展示，页面载入时均展示
                            data["array"][i]['showGroup'] = true;
                            $scope.items.push(data["array"][i]);
                        }

                        $rootScope.putOutDetailCount = $rootScope.putOutDetailCount + 1;
                        if ($rootScope.putOutDetailCount == 4 && $scope.currentPage == 'putOut') {
                            appIonicLoading.hide();
                        }
                    });
            };
            // basePage.init($scope, loadData);
            $scope.showOrNot = function (item) {
                if (item.showGroup) {
                    item.showGroup = false;
                } else {
                    item.showGroup = true;
                    setTimeout(function () {
                        $scope.$apply(function () {
                            $ionicScrollDelegate.$getByHandle("smallScroll").scrollBy(0, 10, true);

                        });
                    }, 100);
                }
            };
        })
    //申请详情-客户信息tab页
    .controller('PutOutCustomerController',
        function ($scope, $state, $stateParams, $http, $rootScope, $ionicLoading, $ionicPopup, basePage, $ionicScrollDelegate) {
            $scope.$on('to-putOutFlow', function (e, data) {
                $scope.items = [];
                $scope.CustomerID = data.CustomerID;
                basePage.init($scope, loadData);
            });

            var loadData = function ($ionicLoading) {
                runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
                    "customerInfo", {
                        customerID: $scope.CustomerID
                    }, function (data, status) {
                        for (var i = 0; i < data["array"].length; i++) {
                            //增加参数，是否展示，页面载入时均展示
                            data["array"][i]['showGroup'] = true;
                            $scope.items.push(data["array"][i]);
                        }
                        $rootScope.putOutDetailCount = $rootScope.putOutDetailCount + 1;
                        if ($rootScope.putOutDetailCount == 4 && $scope.currentPage == 'putOut') {
                            appIonicLoading.hide();
                        }
                    });
            };
            $scope.showOrNot = function (item) {
                if (item.showGroup) {
                    item.showGroup = false;
                } else {
                    item.showGroup = true;
                    setTimeout(function () {
                        $scope.$apply(function () {
                            $ionicScrollDelegate.$getByHandle("smallScroll01").scrollBy(0, 10, true);
                        });
                    }, 100);
                }
            };
        })

    //审批意见
    .controller('PutOutOpinionController',
        function ($scope, $state, $stateParams, $http, $rootScope, $ionicLoading, $ionicPopup, basePage, $ionicScrollDelegate) {

            $scope.$on('to-putOutFlow', function (e, data) {
                $scope.items = [];
                $scope.SerialNo = data.SerialNo;
                $scope.FTObjectType = data.FTObjectType;
                basePage.init($scope, loadData);
            });

            var loadData = function ($ionicLoading) {
                runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
                    "opinionInfo", {
                        serialNo: $scope.SerialNo,
                        objectType: $scope.FTObjectType
                    }, function (data, status) {
                        for (var i = 0; i < data["array"].length; i++) {
                            //增加参数，是否展示，页面载入时均展示
                            data["array"][i]['showGroup'] = true;
                            $scope.items.push(data["array"][i]);
                        }
                        if ($scope.items.length) {
                            $scope.noData = false;
                        } else {
                            $scope.noData = true;
                        }
                        $rootScope.putOutDetailCount = $rootScope.putOutDetailCount + 1;
                        if ($rootScope.putOutDetailCount == 4 && $scope.currentPage == 'putOut') {
                            appIonicLoading.hide();
                        }
                    });
            };
            $scope.showOrNot = function (item) {
                if (item.showGroup) {
                    item.showGroup = false;
                } else {
                    item.showGroup = true;
                    setTimeout(function () {
                        $scope.$apply(function () {
                            $ionicScrollDelegate.$getByHandle("smallScroll").scrollBy(0, 10, true);
                        });
                    }, 100);
                }
            };
        })
