/**
 * Created by HanTang on 17/2/21.
 * 客户等级评估流程
 */
angular.module('com.amarsoft.mobile.controllers.approve.evaluate', ['ngSanitize', 'ngAnimate'])
    .controller('EvaluateApplyListController', function ($scope, $state, $http, $rootScope, $ionicLoading, $ionicPopup, $stateParams, paging,$ionicScrollDelegate) {
            $rootScope.rightContentListShowFlag = true;
            $scope.$on('to_EvaluateApplyListController', function (e, data) {
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
                $scope.selectTab4 = false;
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
                $rootScope.evaluateDetailCount = 0;
                $scope.selectedRow = index;
                appIonicLoading.show({
                    template: '正在加载中',
                    animation: 'fade-in',
                    showBackdrop: true,
                    duration: 30000
                });
                var data = {
                    "SerialNo": item.SerialNo,
                    "FTObjectType": $scope.FTObjectType,
                    "FTSerialNo": item.FTSerialNo,
                    "CustomerId": item.CustomerID,
                    "CustomerName": item.CustomerName,
                    "BusinessType": item.BusinessType,
                    "FinishedFlag": $scope.FinishedFlag,
                    "ObjectNo": item.ObjectNo
                };
                $scope.$broadcast('to-EvaluateApply', data);
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
    //申请详情
    .controller('CustomerRatingApplyController',
        function ($scope, $state, $stateParams, $rootScope, $http, $ionicLoading, $ionicPopup, basePage) {

            $scope.$on('to-EvaluateApply', function (e, data) {
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
                    "evaluateApplyInfo", {
                        objectType: $scope.FTObjectType,
                        serialNo: $scope.SerialNo,
                        objectNo: $scope.ObjectNo,
                        modelNo: null
                    }, function (data, status) {
                        for (var i = 0; i < data["array"].length; i++) {
                            $scope.items.push(data["array"][i]);
                        }

                        $rootScope.evaluateDetailCount = $rootScope.evaluateDetailCount + 1;
                        if ($rootScope.evaluateDetailCount == 2 && $scope.currentPage == 'customerRating') {
                            appIonicLoading.hide();
                        }
                    });
            };
        })
 //审批意见
    .controller('CustomerRatingOpinionController', function ($scope, $state, $stateParams, $http, $rootScope, $ionicLoading, $ionicPopup, basePage, $ionicScrollDelegate) {

            $scope.$on('to-EvaluateApply', function (e, data) {
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
                        
                        $rootScope.evaluateDetailCount = $rootScope.evaluateDetailCount + 1;
                        if ($rootScope.evaluateDetailCount == 2 && $scope.currentPage == 'customerRating') {
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
    .controller('evaluateSignOpinionController',
        function ($scope, $rootScope, $state, $stateParams, $http, $ionicPopup, $ionicLoading, basePage) {
            $scope.opinionInfos = {
                opinionDetail: '',
                cognScore: '',
                cogResult: ''
            };

            $scope.$on('to-evaluateSignOpinionController', function (e, data) {
                $scope.SerialNo = data.SerialNo;
                $scope.BusinessType = data.BusinessType;
                $scope.CustomerID = data.CustomerId;
                $scope.ObjectNo = data.ObjectNo;
                $scope.FTObjectType = data.FTObjectType;
                $scope.FTSerialNo = data.FTSerialNo;
                $scope.nextActionShowFlag = false;
                $scope.item = {};
                basePage.init($scope, loadData);

            });

            $scope.showCognResult = function () {
                runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
                    "getCognResult", {
                        cognScore: $scope.opinionInfos.cognScore,
                        ftObjectType: $scope.FTObjectType,
                        serialNo: $scope.SerialNo,
                        objectNo: $scope.ObjectNo
                    }, function (data, status) {
                        $scope.opinionInfos.cognResult = data.CognResult;
                    });
            };


            var loadData = function ($ionicLoading) {
                runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
                    "getEvaluateApplyAndOpinionInfo", {
                        ftSerialNo: $scope.FTSerialNo,
                        serialNo: $scope.SerialNo,
                        ftObjectType: $scope.FTObjectType
                    }, function (data, status) {
                        $scope.item = data["array"][0];
                    });
            };
            // basePage.init($scope, loadData);

            //保存意见
            $scope.saveEvaluateOpinion = function () {
                if ($scope.opinionInfos.opinionDetail == '' || $scope.opinionInfos.cognScore == '') {
                    $ionicLoading.show({
                        template: '请填写人工认定得分并签署意见',
                        duration: 3500
                    });
                    return false;
                } else {
                    runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
                        "saveEvaluateOpinion", {
                            ftSerialNo: $scope.FTSerialNo,
                            objectNo: $scope.SerialNo,
                            objectType: $scope.FTObjectType,
                            phaseOpinion3: $scope.item.EvaluateScore,
                            phaseOpinion1: $scope.item.EvaluateResult,
                            cognScore: $scope.opinionInfos.cognScore,
                            cognResult: $scope.opinionInfos.cognResult,
                            phaseOpinion: $scope.opinionInfos.opinionDetail
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
                                            $scope.$broadcast('to-nextActionSelectController', {
                                                FTSerialNo: $scope.FTSerialNo,
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
            //提交
            $scope.gotoCheckSelect = function () {
                //对意见进行保存
                $scope.saveOpinion();
                if ($scope.opinionInfos.opinionDetail == '') {
                    $ionicLoading.show({
                        template: '请签署意见',
                        duration: 3500
                    });
                    return false;
                } else {
                    //校验是否提交了
                    runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
                        "checkTaskCommitedOrNot", {
                            ftSerialNo: $scope.FTSerialNo
                        }, function (data, status) {
                            if (data.OperationMsg == 'Y') {
                                $ionicLoading.show({
                                    template: '该笔申请已提交,请勿重复提交!',
                                    duration: 3500
                                });
                                return false;
                            } else {
                                $scope.$broadcast('to-nextActionSelectController', {
                                    FTSerialNo: $scope.FTSerialNo,
                                });
                            }
                        });
                }
            };
        })