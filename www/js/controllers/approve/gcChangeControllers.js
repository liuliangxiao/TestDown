/**
 * Created by HanTang on 17/2/22.
 * 担保合同变更
 */
angular.module('com.amarsoft.mobile.controllers.approve.gcChange', ['ngSanitize', 'ngAnimate'])
    // 担保合同变更申请列表
    .controller(
        'ContractChangeApplyListController',
        function ($scope, $state, $http, $rootScope, $ionicLoading, $ionicPopup, $stateParams, paging,$ionicScrollDelegate) {

            $scope.$on('to-TransformApplyListController', function (e, data) {
                $rootScope.rightContentListShowFlag = true;
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
                $rootScope.TransformDetailCount = 0;
                $scope.selectedRow = index;
                appIonicLoading.show({
                    template: '正在加载中',
                    animation: 'fade-in',
                    showBackdrop: true,
                    duration: 30000
                });
                var data = {
                    FTSerialNo: item.FTSerialNo,
                    SerialNo: item.SerialNo,
                    FTObjectType: $scope.FTObjectType,
                    CustomerName: item.CustomerName,
                    CustomerID: item.CustomerID
                };
                $scope.$broadcast('to-transformInfo', data);
                $scope.$broadcast('to-signOpinion', data);

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
    //担保变更申请基本信息
    .controller('ContractChangeApplyInfoController',
        function ($scope, $state, $stateParams, $http, $rootScope, $ionicLoading, $ionicPopup, $ionicModal, basePage, $ionicScrollDelegate) {
            $scope.$on('to-transformInfo', function (e, data) {
                $ionicScrollDelegate.scrollTop();
                $scope.items = [];
                $scope.SerialNo = data.SerialNo;
                basePage.init($scope, loadData);
            });
            var loadData = function ($ionicLoading) {
                runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
                    "transformApplyInfo", {
                        SerialNo: $scope.SerialNo
                    }, function (data, status) {
                        for (var i = 0; i < data["array"].length; i++) {
                            //增加参数，是否展示，页面载入时均展示
                            data["array"][i]['showGroup'] = true;
                            $scope.items.push(data["array"][i]);
                        }
                        $rootScope.TransformDetailCount = $rootScope.TransformDetailCount + 1;
                        if ($rootScope.TransformDetailCount == 3 && $scope.currentPage == 'contractChange') {
                            appIonicLoading.hide();
                        }
                    });
            };

            $scope.guarantyContractList = function (type) {
                if (type == "new") {
                    $rootScope.contractTypeName = "拟新增的担保合同";
                } else if (type == "relieve") {
                    $rootScope.contractTypeName = "拟解除的担保合同";
                } else if (type == "effective") {

                    $rootScope.contractTypeName = "有效的担保合同";
                }

                $ionicModal.fromTemplateUrl('templates/approve/contractChange/contractInfoModal.html', {
                    scope: $scope,
                    backdropClickToClose: false
                }).then(function (modal) {
                    $scope.modal = modal;
                    $scope.modal.show();
                    $scope.$broadcast('to-guarantList', {Type: type, SerialNo: $scope.SerialNo});
                });
            };

            $scope.goToBack = function () {
                $scope.modal.remove();
            }


            $scope.showOrNot = function (item) {
                if (item.showGroup) {
                    item.showGroup = false;
                } else {
                    item.showGroup = true;
                    setTimeout(function () {
                        $scope.$apply(function () {
                            $ionicScrollDelegate.$getByHandle("smallScroll").scrollBy(0, 310, true);

                        });
                    }, 100);
                }
            };
        })
    //申请详情-客户信息tab页
    .controller('ContractChangeCustomerController',
        function ($scope, $state, $stateParams, $http, $rootScope, $ionicLoading, $ionicPopup, basePage, $ionicScrollDelegate) {

            $scope.$on('to-transformInfo', function (e, data) {
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

                        $rootScope.TransformDetailCount = $rootScope.TransformDetailCount + 1;
                        if ($rootScope.TransformDetailCount == 3 && $scope.currentPage == 'contractChange') {
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
    .controller('ContractChangeOpinionController',
        function ($scope, $state, $stateParams, $http, $rootScope, $ionicLoading, $ionicPopup, basePage, $ionicScrollDelegate) {

            $scope.$on('to-transformInfo', function (e, data) {
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

                        $rootScope.TransformDetailCount = $rootScope.TransformDetailCount + 1;
                        if ($rootScope.TransformDetailCount == 3 && $scope.currentPage == 'contractChange') {
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

    //担保合同变更-有效的担保合同-拟新增的担保合同-拟解除的担保合同--列表
    .controller(
        'GuarantyContractListController',
        function ($scope, $state, $http, $rootScope, $ionicLoading, $ionicPopup, $stateParams, paging) {

            $scope.$on('to-guarantList', function (e, data) {
                appIonicLoading.show({
                    template: '正在加载中',
                    animation: 'fade-in',
                    showBackdrop: true,
                    duration: 30000
                });
                $scope.guarantListFlag = true;
                $scope.items = [];
                $scope.Type = data.Type;
                $scope.SerialNo = data.SerialNo;
                paging.init($scope, iPageSize, 1, loadData, true);
                $scope.refresh();
            });
            var iPageSize = 8;
            var loadData = function ($ionicLoading) {
                runServiceWithSession($http, undefined, $ionicPopup, $state,
                    "guarantyContractList", {
                        pageSize: iPageSize,
                        pageNo: $scope.pageNo,
                        Type: $scope.Type,
                        SerialNo: $scope.SerialNo
                    }, function (data, status) {
                        for (var k = 0; k < data["array"].length; k++) {
                            $scope.items.push(data["array"][k]);
                            if ($scope.pageNo == 1 && k == 0) {
                                $scope.obj = data["array"][0];

                            }
                        }
                        if($scope.pageNo == 1){
                            $scope.gotoApplyInfo($scope.obj, 0);
                        }
                        $scope.hasMore = (($scope.pageNo - 1) * iPageSize
                        + data["array"].length < data.totalCount);
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
            $scope.gotoApplyInfo = function (item, index) {
                if (item) {
                    $scope.selectedRow = index;
                    $scope.$broadcast('to-guarantInfo', {SerialNo: item.SerialNo});
                } else {
                    appIonicLoading.hide();
                }
            };

            $scope.goToBack = function () {
                $scope.guarantListFlag = false;
            }


        })
    //担保合同变更-有效的担保合同-拟新增的担保合同-拟解除的担保合同--详情
    .controller('GuarantyContractInfoController',
        function ($scope, $state, $stateParams, $http, $rootScope, $ionicLoading, $ionicPopup, basePage, $ionicScrollDelegate) {
            $scope.$on('to-guarantInfo', function (e, data) {
                $ionicScrollDelegate.scrollTop();
                $scope.items = [];
                $scope.SerialNo = data.SerialNo;
                basePage.init($scope, loadData);
            });
            var loadData = function ($ionicLoading) {
                runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
                    "guarantyContractInfo", {
                        SerialNo: $scope.SerialNo
                    }, function (data, status) {
                        for (var i = 0; i < data["array"].length; i++) {
                            //增加参数，是否展示，页面载入时均展示
                            data["array"][i]['showGroup'] = true;
                            $scope.items.push(data["array"][i]);
                        }
                        appIonicLoading.hide();
                    });
            };

            $scope.goToBack = function () {
                $scope.guarantListFlag = true;
                $scope.guarantInfoFlag = false;

            }
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