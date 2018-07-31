/**
 * Created by HanTang on 17/2/22.
 * 五级分类
 */
angular.module('com.amarsoft.mobile.controllers.approve.classify', ['ngSanitize', 'ngAnimate'])
    // 五级分类认定-申请列表
    .controller(
        'FiveLevelClassifyApplyListController',
        function ($scope, $state, $http, $rootScope, $ionicLoading, $ionicPopup, $stateParams, paging,$ionicScrollDelegate) {
            $rootScope.rightContentListShowFlag = true;
            $scope.$on('to-ClassifyApplyListController', function (e, data) {
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
                $scope.selectedRow = index;
                //用户判断获取详情交易是否全部执行完毕,完毕后关闭 appIonicLoading
                $rootScope.classifyDetailCount = 0;
                appIonicLoading.show({
                    template: '正在加载中',
                    animation: 'fade-in',
                    showBackdrop: true,
                    duration: 30000
                });
                $rootScope.rightContentListShowFlag = false;
                var data = {
                    SerialNo: item.CRSerialNo,
                    ModelNo: item.CRModelNo,
                    ObjectType: item.CRObjectType,
                    ObjectNo: item.SerialNo,
                    CustomerId: item.CustomerID,
                    CustomerName: item.CustomerName,
                    FTObjectType: $scope.FTObjectType,
                    FTSerialNo: item.FTSerialNo
                };

                $scope.$broadcast('to-classifyApplyInfo', data);
                $scope.$broadcast('to-signOpinion', data);

            };

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
    //五级分类认定流程申请详情-模型详情tab页
    .controller('FiveLevelClassifyApplyInfoController',
        function ($scope, $state, $stateParams, $http, $rootScope, $ionicLoading, $ionicPopup, basePage, $ionicScrollDelegate) {

            $scope.$on('to-classifyApplyInfo', function (e, data) {
                $ionicScrollDelegate.scrollTop();
                $scope.SerialNo = data.SerialNo;
                $scope.ModelNo = data.ModelNo;
                $scope.ObjectType = data.ObjectType;
                $scope.CustomerID = data.CustomerId;
                $scope.ObjectNo = data.ObjectNo;
                $scope.FTObjectType = data.FTObjectType;
                $scope.FTSerialNo = data.FTSerialNo;
                $scope.items = [];
                basePage.init($scope, loadData);
            });

            var loadData = function ($ionicLoading) {
                runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
                    "classifyApplyInfo", {
                        objectType: $scope.ObjectType,
                        serialNo: $scope.SerialNo,
                        objectNo: $scope.ObjectNo,
                        modelNo: $scope.ModelNo
                    }, function (data, status) {
                        for (var i = 0; i < data["array"].length; i++) {
                            $scope.items.push(data["array"][i]);
                        }

                        $rootScope.classifyDetailCount = $rootScope.classifyDetailCount + 1;

                        if ($rootScope.classifyDetailCount == 4 && $scope.currentPage == 'fiveLevelClassify') {
                            appIonicLoading.hide();
                        }
                    });
            };

        })
    //五级分类认定流程申请详情-借据信息tab页
    .controller('FiveLevelClassifyDueBillInfoController',
        function ($scope, $state, $stateParams, $http, $rootScope, $ionicLoading, $ionicPopup, basePage, $ionicScrollDelegate) {
            $scope.$on('to-classifyApplyInfo', function (e, data) {
                $ionicScrollDelegate.scrollTop();
                $scope.ObjectNo = data.ObjectNo;
                $scope.items = [];
                basePage.init($scope, loadData);
            });

            $scope.items = [];
            var loadData = function ($ionicLoading) {
                runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
                    "dueBillInfo", {
                        SerialNo: $scope.ObjectNo
                    }, function (data, status) {
                        for (var i = 0; i < data["array"].length; i++) {
                            //增加参数，是否展示，页面载入时均展示
                            data["array"][i]['showGroup'] = true;
                            $scope.items.push(data["array"][i]);
                        }

                        $rootScope.classifyDetailCount = $rootScope.classifyDetailCount + 1;
                        if ($rootScope.classifyDetailCount == 4 && $scope.currentPage == 'fiveLevelClassify') {
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
    //申请详情-客户信息tab页
    .controller('FiveLevelClassifyCustomerController',
        function ($scope, $state, $stateParams, $http, $rootScope, $ionicLoading, $ionicPopup, basePage, $ionicScrollDelegate) {

            $scope.$on('to-classifyApplyInfo', function (e, data) {
                $scope.items = [];
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

                        $rootScope.classifyDetailCount = $rootScope.classifyDetailCount + 1;

                        if ($rootScope.classifyDetailCount == 4 && $scope.currentPage == 'fiveLevelClassify') {
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
    .controller('FiveLevelClassifyOpinionController',
        function ($scope, $state, $stateParams, $http, $rootScope, $ionicLoading, $ionicPopup, basePage, $ionicScrollDelegate) {

            $scope.$on('to-classifyApplyInfo', function (e, data) {
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

                        $rootScope.classifyDetailCount = $rootScope.classifyDetailCount + 1;
                        if ($rootScope.classifyDetailCount == 4 && $scope.currentPage == 'fiveLevelClassify') {
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
    //五级分类意见签署
    .controller('classifySignOpinionController',
        function ($scope, $rootScope, $state, $stateParams, $http, $ionicPopup, $ionicLoading, basePage, $ionicScrollDelegate) {

            $scope.$on('to-classifySignOpinionController', function (e, data) {
                $ionicScrollDelegate.scrollTop();
                $scope.SerialNo = data.SerialNo;
                $scope.BusinessType = data.BusinessType;
                $scope.CustomerID = data.CustomerId;
                $scope.ObjectNo = data.ObjectNo;
                $scope.FTObjectType = data.FTObjectType;
                $scope.FTSerialNo = data.FTSerialNo;
                $scope.nextActionShowFlag = false;
                basePage.init($scope, loadData);
            });
            $scope.item = {};
            $scope.opinionInfos = {};
            $scope.ClassifyResults = {};
            $scope.classifyResult = {
                select: '',
                reason: ''
            };
            var loadData = function ($ionicLoading) {
                runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
                    "getClassifyApplyAndOpinionInfo", {
                        CRSerialNo: $scope.SerialNo
                    }, function (data, status) {
                        $scope.item = data["array"][0];
                        $scope.opinionInfos = data;
                    });
                runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
                    "getClassifyResult", {}, function (data, status) {
                        $scope.ClassifyResults = data["array"];
                    });
            };
            basePage.init($scope, loadData);

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

            //保存意见
            $scope.saveClassifyOption = function () {
                if ($scope.classifyResult.reason == '' || $scope.classifyResult.select == '') {
                    $ionicLoading.show({
                        template: '请选择认定结果并填写认定理由',
                        duration: 3500
                    });
                    return false;
                } else {
                    runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
                        "saveClassifyOption", {
                            Select: $scope.classifyResult.select,
                            Reason: $scope.classifyResult.reason,
                            FTSerialNo: $scope.FTSerialNo
                        }, function (data, status) {
                            if (data.OperationMsg == 'SUCCESS') {
                                $ionicLoading.show({
                                    template: '保存意见成功',
                                    duration: 3500
                                });

                                runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
                                    "checkTaskCommitedOrNot", {
                                        ftSerialNo: $stateParams.FTSerialNo
                                    }, function (data, status) {
                                        if (data.OperationMsg == 'Y') {
                                            $ionicLoading.show({
                                                template: '该笔申请已提交,请勿重复提交!',
                                                duration: 3500
                                            });
                                            return false;
                                        } else {
                                            //跳转到下一步操作选择界面，选择人和选择动作
                                            $scope.$broadcast('to-nextActionSelectController', {
                                                FTSerialNo: $scope.FTSerialNo
                                            });
                                        }
                                    });

                            } else {
                                $ionicLoading.show({
                                    template: '保存意见失败,请与系统管理员联系!',
                                    duration: 3500
                                });
                                return false;
                            }
                        });
                }
            };

        })