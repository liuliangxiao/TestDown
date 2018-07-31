/**
 * Created by HanTang on 17/2/22.
 * 押品出库
 */
angular.module('com.amarsoft.mobile.controllers.approve.collateralOut', ['ngSanitize', 'ngAnimate'])
    .controller(
        'CollateralOutApplyListController',
        function ($scope, $state, $http, $rootScope, $ionicLoading, $ionicPopup, $stateParams, paging, $ionicScrollDelegate) {

            $scope.$on('To-CollateralOutApplyListController', function (e, data) {
                $rootScope.rightContentListShowFlag = true;
                $scope.selectedRow = -1;
                $scope.FlowNo = data.FlowNo;
                $scope.PhaseNo = data.PhaseNo;
                $scope.FlowNo = data.FlowNo;
                $scope.FinishedFlag = data.FinishedFlag;
                $scope.FTObjectType = data.FTObjectType;
                $scope.selectTab0 = true;
                $scope.selectTab1 = false;
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
                            //data["array"][k].IconCode = strEscape(data["array"][k].IconCode);
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
                        appIonicLoading.hide();
                        $scope.$broadcast('scroll.refreshComplete');
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    });
            };

            $scope.gotoApplyInfo = function (item, index) {
                $rootScope.rightContentListShowFlag = false;
                //用户判断获取详情交易是否全部执行完毕,完毕后关闭 appIonicLoading
                $rootScope.unloadDetaiCount = 0;
                $scope.selectedRow = index;

                appIonicLoading.show({
                    template: '正在加载中',
                    animation: 'fade-in',
                    showBackdrop: true,
                    duration: 30000
                });

                var data = {
                    SerialNo: item.GuarantyID,
                    FTObjectType: $scope.FTObjectType,
                    GuarantyID: item.GuarantyID,
                    CustomerName: item.OwnerName,
                    GuarantyTypeID: item.GuarantyTypeID,
                    FTSerialNo: item.SerialNo
                };
                $scope.$broadcast('to-unloadInfo', data);
                $scope.$broadcast('to-signOpinion', data);

            };

            $scope.selectTask = function (tabIndex) {
                $ionicScrollDelegate.scrollTop();
                if (tabIndex == '0') {
                    $scope.selectTab0 = true;
                    $scope.selectTab1 = false;

                } else if (tabIndex == '1') {
                    $scope.selectTab1 = true;
                    $scope.selectTab0 = false;
                }
            };

        })
    //押品出库申请信息
    .controller('CollateralOutApplyInfoController',
        function ($scope, $state, $stateParams, $http, $rootScope, $ionicLoading, $ionicPopup, basePage, $ionicScrollDelegate) {
            $scope.$on('to-unloadInfo', function (e, data) {
                $ionicScrollDelegate.scrollTop();
                $scope.items = [];
                $scope.GuarantyID = data.GuarantyID;
                $scope.GuarantyTypeID = data.GuarantyTypeID;
                basePage.init($scope, loadData);

            });

            $scope.items = [];
            var loadData = function ($ionicLoading) {
                runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
                    "unloadApplyInfo", {
                        GuarantyID: $scope.GuarantyID,
                        GuarantyType: $scope.GuarantyTypeID
                    }, function (data, status) {
                        for (var i = 0; i < data["array"].length; i++) {
                            //增加参数，是否展示，页面载入时均展示
                            data["array"][i]['showGroup'] = true;
                            $scope.items.push(data["array"][i]);
                        }

                        $rootScope.unloadDetaiCount = $rootScope.unloadDetaiCount + 1;
                        if ($rootScope.unloadDetaiCount == 2 && $scope.currentPage == 'collateralOut') {
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

    .controller('CollateralOutOpinionController',
        function ($scope, $state, $stateParams, $http, $rootScope, $ionicLoading, $ionicPopup, basePage, $ionicScrollDelegate) {

            $scope.$on('to-unloadInfo', function (e, data) {
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


                        $rootScope.unloadDetaiCount = $rootScope.unloadDetaiCount + 1;
                        if ($rootScope.unloadDetaiCount == 2 && $scope.currentPage == 'collateralOut') {
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
            // basePage.init($scope, loadData);
        })
