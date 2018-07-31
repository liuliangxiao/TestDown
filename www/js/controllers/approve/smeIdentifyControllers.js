/**
 * Created by HanTang on 17/2/21.
 * 中小企资格认定流程
 */
angular.module('com.amarsoft.mobile.controllers.approve.smeIdentify', ['ngSanitize', 'ngAnimate'])
    .controller('SMEApplyDetailController', function ($scope, $state, $stateParams, $rootScope, $http, $ionicLoading, $ionicPopup, basePage, $ionicScrollDelegate) {

            $scope.$on('to-SMEApplyInfo', function (e, data) {
                $ionicScrollDelegate.scrollTop();
                $scope.items = [];
                $scope.SerialNo = data.SerialNo;
                $scope.BusinessType = data.BusinessType;
                $scope.CustomerID = data.CustomerId;
                $scope.ObjectNo = data.ObjectNo;
                $scope.FTObjectType = data.FTObjectType;
                basePage.init($scope, loadData);
            });
            var loadData = function ($ionicLoading) {
                runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
                    "smeApplyInfo", {
                        objectNo: $scope.SerialNo,
                        customerID: $scope.CustomerID
                    }, function (data, status) {
                        for (var i = 0; i < data["array"].length; i++) {
                            //增加参数，是否展示，页面载入时均展示
                            data["array"][i]['showGroup'] = true;
                            $scope.items.push(data["array"][i]);
                        }

                        $rootScope.SMEDetailCount = $rootScope.SMEDetailCount + 1;
                        if ($rootScope.SMEDetailCount == 3 && $scope.currentPage == 'smallEnterPriseQualication') {
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

    // 中小企业资格认定-申请列表
    .controller(
        'SMEApplyListController',
        function ($scope, $state, $http, $rootScope, $ionicLoading, $ionicPopup, $stateParams, paging, $ionicScrollDelegate) {

            $rootScope.rightContentListShowFlag = true;
            $scope.$on('to-SMEApplyListController', function (e, data) {
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
                paging.init($scope, iPageSize, 1, loadData, true);
                $scope.refresh();
            });
            var iPageSize = 8;
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
                $rootScope.SMEDetailCount = 0;
                appIonicLoading.show({
                    template: '正在加载中',
                    animation: 'fade-in',
                    showBackdrop: true,
                    duration: 30000
                });
                $rootScope.rightContentListShowFlag = false;
                var data = {
                    "SerialNo": item.SerialNo,
                    "FTObjectType": $scope.FTObjectType,
                    "FTSerialNo": item.FTSerialNo,
                    "CustomerId": item.CustomerID,
                    "FinishedFlag": $scope.FinishedFlag,
                    "CustomerName": item.CustomerName,
                    "BusinessType": item.BusinessType
                };
                $scope.$broadcast('to-signOpinion', data);
                $scope.$broadcast('to-SMEApplyInfo', data);
            };


            $scope.selectTask = function (tabIndex) {
                $ionicScrollDelegate.scrollTop();
                if (tabIndex == '0') {
                    $scope.selectTab0 = true;
                    $scope.selectTab1 = false;
                    $scope.selectTab2 = false;

                } else if (tabIndex == '1') {
                    $scope.selectTab1 = true;
                    $scope.selectTab0 = false;
                    $scope.selectTab2 = false;

                } else if (tabIndex == '2') {
                    $scope.selectTab2 = true;
                    $scope.selectTab0 = false;
                    $scope.selectTab1 = false;

                }
            };


        })

    //申请详情-客户信息tab页
    .controller('SMECustomerController',
        function ($scope, $state, $stateParams, $http, $rootScope, $ionicLoading, $ionicPopup, basePage, $ionicScrollDelegate) {

            $scope.$on('to-SMEApplyInfo', function (e, data) {
                $scope.items = [];
                $scope.SerialNo = data.SerialNo;
                $scope.BusinessType = data.BusinessType;
                $scope.CustomerID = data.CustomerId;
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

                        $rootScope.SMEDetailCount = $rootScope.SMEDetailCount + 1;
                        if ($rootScope.SMEDetailCount == 3 && $scope.currentPage == 'smallEnterPriseQualication') {
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
    .controller('SMEOpinionController',
        function ($scope, $state, $stateParams, $http, $rootScope, $ionicLoading, $ionicPopup, basePage, $ionicScrollDelegate) {

            $scope.$on('to-SMEApplyInfo', function (e, data) {
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

                        $rootScope.SMEDetailCount = $rootScope.SMEDetailCount + 1;
                        if ($rootScope.SMEDetailCount == 3 && $scope.currentPage == 'smallEnterPriseQualication') {
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