/**
 * Created by laker on 2017/1/16.
 */
/**
 * @file 业务申请
 * @author kliu create
 *         xfjin update
 */
angular.module('com.amarsoft.mobile.controllers.businessApplication', ['ngSanitize', 'ngAnimate'])
//业务申请首页
    .controller('BusinessApplicationController', function ($scope, $rootScope, $state, basePage, $timeout, $ionicModal, $ionicLoading, paging, $http, $ionicPopup, $filter) {
        $scope.tabIndex = 0;
        //是否被关联 0：未关联 1：已关联
        $scope.IsRelative = '0';

        //用于刷新新增时的客户列表
        $scope.num = 0;
        $scope.ApplyType = {ItemNo: 'IndCreditApply', ItemName: '个人客户授信申请'};

        $scope.Items = [];
        if ($scope.tabIndex == 0) {
            $scope.selectTab0 = true;
            $scope.selectTab1 = false;
        } else {
            $scope.selectTab0 = false;
            $scope.selectTab1 = true;
        }


        //加载申请类型
        runServiceWithSession($http, undefined, $ionicPopup, $state,
            "getApplyType", {}, function (data, status) {
                $scope.ApplyTypes = data.array;
            });

        /**
         * 切换tab按钮
         * @param tabIndex 索引
         */
        $scope.selectTab = function (tabIndex) {
            $scope.num++;
            appIonicLoading.show({
                template: '正在加载中',
                animation: 'fade-in',
                showBackdrop: true,
                duration: 30000
            });

            if (tabIndex == '0') {
                $scope.tabIndex = tabIndex;
                $scope.selectTab0 = true;
                $scope.selectTab1 = false;
                $scope.IsRelative = '0';
                $scope.$broadcast('to-noApplyController', {
                    IsRelative: $scope.IsRelative,
                    ApplyType: $scope.ApplyType.ItemNo
                });

            } else {
                $scope.tabIndex = tabIndex;
                $scope.selectTab0 = false;
                $scope.selectTab1 = true;
                $scope.IsRelative = '1';
                $scope.$broadcast('to-hasApplyController', {
                    IsRelative: $scope.IsRelative,
                    ApplyType: $scope.ApplyType.ItemNo
                });

            }

        };


        /**
         * 选择申请类型
         */
        $scope.changeApplyType = function () {
            $scope.selectTab('0');
        };


        /**
         * 新增业务申请单
         */
        $scope.ApplyInfo = {};

        $ionicModal.fromTemplateUrl('templates/businessApplication/addApply-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.addApplyModal = modal;
        });

        $scope.openApplyModal = function () {
            $scope.ApplyInfo = {};
            $scope.BusinessTypeName = '';
            $scope.addApplyModal.show();
            loadCodeItems();
            if ($scope.ApplyType.ItemNo === 'EntCreditApply') {
                $scope.ApplyType.ItemName = '对公客户授信申请';
            } else {
                $scope.ApplyType.ItemName = '个人客户授信申请';
            }
        };

        $scope.closeApplyModal = function () {
            $scope.addApplyModal.hide();

        };


        /**
         * 加载代码
         */
        var loadCodeItems = function () {

            runServiceWithSession($http, undefined, $ionicPopup, $state,
                "getCodeItems", {CodeNo: 'OccurType'}, function (data, status) {
                    $scope.OccurTypes = data.array;
                });

            runServiceWithSession($http, undefined, $ionicPopup, $state,
                "getCodeItems", {CodeNo: 'Currency'}, function (data, status) {
                    $scope.Currencies = data.array;
                });
        };


        /**
         * 选择客户列表
         */
        $ionicModal.fromTemplateUrl('templates/businessApplication/selCustomer-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.selCustomerModal = modal;
        });

        $scope.selCustomer = function () {
            $scope.selCustomerModal.show();

            appIonicLoading.show({
                template: '正在加载中',
                animation: 'fade-in',
                showBackdrop: true,
                duration: 30000
            });

            var pageSize = 10;
            var loadData = function ($ionicLoading) {
                runServiceWithSession($http, undefined, $ionicPopup, $state,
                    "applyCustomerList", {
                        ApplyType: $scope.ApplyType.ItemNo,
                        PageSize: pageSize,
                        PageNo: $scope.pageNo
                    }, function (data, status) {
                        appIonicLoading.hide();
                        data.array.forEach(function (i) {
                            $scope.items.push(i);
                        });

                        $scope.loadingMore = false;
                        if ($scope.items.length > 0) {
                            $scope.noData = false;
                        } else {
                            $scope.noData = true;
                        }
                        $scope.hasMore = (($scope.pageNo - 1) * pageSize + data["array"].length < data.totalCount);
                        $scope.$broadcast('scroll.refreshComplete');
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    });
            };


            paging.init($scope, pageSize, 1, loadData);

            //切换tab时客户列表会不加载，所以这里控制下
            if ($scope.num != 0) {
                $scope.refresh();
            }

        };

        $scope.closeSelCustomerModal = function () {
            $scope.selCustomerModal.hide();
        };

        //选择客户
        $scope.chooceCustomer = function (index, item) {
            $scope.ApplyInfo.CustomerID = item.CustomerID;
            $scope.ApplyInfo.CustomerName = item.CustomerName;
            $scope.ApplyInfo.CustomerType = item.CustomerType;
            $scope.index = index;  //用于显示mark图标
        };


        //选择业务类型
        $scope.selectBusinessType = function () {
            console.log($scope.ApplyType);
            $ionicModal.fromTemplateUrl('templates/businessApplication/businessType-modal.html', {
                scope: $scope,
                backdropClickToClose: false
            }).then(function (modal) {
                $scope.modal = modal;
                $scope.modal.show();
                runServiceWithSession($http, undefined, $ionicPopup, $state,
                    "getBusinessType", {ApplyType: $scope.ApplyType.ItemNo}, function (data, status) {
                        $scope.BusinessTypes = [];
                        data.array.forEach(function (item) {
                            if (item.SortNo.length !== 1 || item.SortNo.length !== 4) {
                                item.IsShow = false;
                            } else {
                                item.IsShow = true;
                            }
                            $scope.BusinessTypes.push(item);
                        });
                    });
            });
        };


        //选择业务类型，长度判断根据数据库中sortno的长度
        $scope.confirm = function (item) {
            if($scope.ApplyType.ItemNo === 'IndCreditApply'){
                if (item.SortNo.length !== 6) {
                    return;
                }
            }else {
                //1030特殊处理
                if(item.SortNo.substring(0, 4) === '1030'){
                    if(item.SortNo.length === 4){
                        return;
                    }
                }else if (item.SortNo.length !== 8) {
                    return;
                }
            }

            $scope.ApplyInfo.BusinessType = item.TypeNo;
            $scope.BusinessTypeName = item.TypeName;

            $scope.modal.hide();

        };

        /**
         * 填写金额后失去焦点，格式化金额
         */
        $scope.onBlur = function () {
            $scope.ApplyInfo.BusinessSum = parseFloat($scope.ApplyInfo.BusinessSum.split(',').join(''));
            $scope.ApplyInfo.BusinessSum = $filter('currency')($scope.ApplyInfo.BusinessSum, '');
        };


        //保存业务申请
        $scope.saveApply = function () {
            $scope.ApplyInfo.ApplyType = $scope.ApplyType.ItemNo;
            $scope.ApplyInfo.BusinessSum = parseFloat($scope.ApplyInfo.BusinessSum.split(',').join(''));
            if (!$scope.ApplyInfo.ApplyType) {
                return;
            }
            if (!$scope.ApplyInfo.CustomerID) {
                $ionicLoading.show({template: '请选择客户！', duration: 2000});
                return;
            }
            if (!$scope.ApplyInfo.BusinessType) {
                $ionicLoading.show({template: '请选择业务类型！', duration: 2000});
                return;
            }
            if (!$scope.ApplyInfo.OccurType) {
                $ionicLoading.show({template: '请选择发生类型！', duration: 2000});
                return;
            }
            if (!$scope.ApplyInfo.Currency) {
                $ionicLoading.show({template: '请选择币种！', duration: 2000});
                return;
            }
            if (isNaN($scope.ApplyInfo.BusinessSum)) {
                $ionicLoading.show({template: '金额填写错误！', duration: 2000});
                return;
            }
            if (isNaN($scope.ApplyInfo.TermMonth)) {
                $scope.ApplyInfo.BusinessSum = $filter('currency')($scope.ApplyInfo.BusinessSum, '');
                $ionicLoading.show({template: '期限(月)填写错误！', duration: 2000});
                return;
            }
            runServiceWithSession($http, undefined, $ionicPopup, $state,
                "addNewOrder", $scope.ApplyInfo, function (data, status) {
                    if (data.array[0].SaveFlag == 'SUCCESS') {
                        $scope.$broadcast('to-refresh-list');
                        $ionicLoading.show({template: '保存成功！', duration: 2000});
                        $scope.closeApplyModal();
                    } else {
                        $ionicLoading.show({template: '保存失败！', duration: 2000});
                    }
                });
        };


        //选择列表的一行
        $scope.selectOneRow = function (index, obj) {
            //选中颜色改变
            $scope.selectedRow = index;
            $scope.$broadcast('to-applyInfo1', {SerialNo: obj.SerialNo, ApplyType: $scope.ApplyType.ItemNo});

            if ($scope.IsRelative === '0') {
                //影像采集
                $scope.$broadcast('to-screenage', {SerialNo: obj.SerialNo});

            } else {
                //申请信息tab
                $scope.$broadcast('to-applyDetail', {
                    SerialNo: obj.BASerialNo,
                    BusinessType: obj.BusinessType,
                    CustomerID: obj.CustomerID
                });
                //客户信息
                $scope.$broadcast('to-customerInfo', {CustomerID: obj.CustomerID});
                //审批意见
                $scope.$broadcast('to-opinion', {SerialNo: obj.BASerialNo});
                //调查报告
                $scope.$broadcast('to-report', {SerialNo: obj.BASerialNo});
            }
        };


        //列表加载完后，默认选择第一项
        $scope.$on('to-selectRow', function (event, data) {
            $scope.selectOneRow(0, data);
        });


    })

    .controller('NoApplyController', function ($scope, $http, $ionicPopup, $state, paging) {
        //未关联的业务申请

        appIonicLoading.show({
            template: '正在加载中',
            animation: 'fade-in',
            showBackdrop: true,
            duration: 30000
        });

        $scope.ApplyType = 'IndCreditApply';

        var pageSize = 10;
        var loadData = function ($ionicLoading) {
            runServiceWithSession($http, undefined, $ionicPopup, $state,
                "businessApplyList", {
                    IsRelative: $scope.IsRelative,
                    ApplyType: $scope.ApplyType,
                    PageSize: pageSize,
                    PageNo: $scope.pageNo
                }, function (data, status) {
                    if (data["array"].length == 0) {
                        appIonicLoading.hide();
                    }
                    data.array.forEach(function (i) {
                        $scope.items.push(i);
                    });

                    if ($scope.items.length > 0) {
                        $scope.$emit('to-selectRow', $scope.items[0]);
                    } else {
                        $scope.$emit('to-selectRow', {});
                    }

                    $scope.loadingMore = false;
                    if ($scope.items.length > 0) {
                        $scope.noData = false;
                    } else {
                        $scope.noData = true;
                        $scope.$broadcast('no-data');
                    }
                    $scope.hasMore = (($scope.pageNo - 1) * pageSize + data["array"].length < data.totalCount);
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
        };
        paging.init($scope, pageSize, 1, loadData);

        $scope.$on('to-noApplyController', function (e, data) {

            $scope.IsRelative = data.IsRelative;
            $scope.ApplyType = data.ApplyType;
            $scope.noData = false;
            // paging.init($scope, pageSize, 1, loadData);
            $scope.refresh();

        });

        $scope.$on('to-refresh-list', function () {
            $scope.refresh();
        });


    })

    .controller('HasApplyController', function ($scope, $http, $ionicPopup, $state, paging) {
        //已关联的业务申请

        var pageSize = 10;
        var loadData = function ($ionicLoading) {
            runServiceWithSession($http, undefined, $ionicPopup, $state,
                "businessApplyList", {
                    IsRelative: $scope.IsRelative,
                    ApplyType: $scope.ApplyType,
                    PageSize: pageSize,
                    PageNo: $scope.pageNo
                }, function (data, status) {
                    if (data["array"].length == 0) {
                        appIonicLoading.hide();
                    }
                    data.array.forEach(function (i) {
                        $scope.items.push(i);
                    });

                    if ($scope.items.length > 0) {
                        $scope.$emit('to-selectRow', $scope.items[0]);
                    } else {
                        $scope.$emit('to-selectRow', {});
                    }

                    $scope.loadingMore = false;
                    if ($scope.items.length > 0) {
                        $scope.noData = false;
                    } else {
                        $scope.noData = true;
                    }
                    $scope.hasMore = (($scope.pageNo - 1) * pageSize + data["array"].length < data.totalCount);
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
        };


        $scope.$on('to-hasApplyController', function (e, data) {

            $scope.IsRelative = data.IsRelative;
            $scope.ApplyType = data.ApplyType;
            $scope.noData = false;


            paging.init($scope, pageSize, 1, loadData);

        });
    })

    .controller('BusinessApplyInfoController', function ($scope, $http, $ionicPopup, $state, paging, $ionicModal, $ionicLoading, $filter) {
        //未关联申请单的详情控制器

        $scope.onBlur = function () {
            $scope.ApplyInfoNoRelative.BusinessSum = parseFloat($scope.ApplyInfoNoRelative.BusinessSum.split(',').join(''));
            $scope.ApplyInfoNoRelative.BusinessSum = $filter('currency')($scope.ApplyInfoNoRelative.BusinessSum, '');
        };

        $scope.noData = true;

        var loadData = function () {
            runServiceWithSession($http, undefined, $ionicPopup, $state,
                "getApplyInfoWithNoRelative", {SerialNo: $scope.SerialNo}, function (data, status) {
                    $scope.ApplyInfoNoRelative = data.array[0];
                    if (data.array.length > 0) {
                        $scope.noData = false;
                        $scope.ApplyInfoNoRelative.BusinessSum = $filter('currency')($scope.ApplyInfoNoRelative.BusinessSum, '');
                    } else {
                        $scope.noData = true;
                    }
                    loadCodeItems();
                    appIonicLoading.hide();
                });
        };

        $scope.$on('to-applyInfo1', function (e, data) {
            $scope.SerialNo = data.SerialNo;
            loadData();
        });


        /**
         * 加载代码
         */
        var loadCodeItems = function () {
            runServiceWithSession($http, undefined, $ionicPopup, $state,
                "getCodeItems", {CodeNo: 'OccurType'}, function (data, status) {
                    $scope.OccurTypes = data.array;
                });

            runServiceWithSession($http, undefined, $ionicPopup, $state,
                "getCodeItems", {CodeNo: 'Currency'}, function (data, status) {
                    $scope.Currencies = data.array;
                });
        };


        /**
         * 选择客户列表
         */
        $ionicModal.fromTemplateUrl('templates/businessApplication/selCustomer-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.selCustomerModal = modal;
        });

        $scope.selCustomer = function () {
            $scope.index = undefined;
            $scope.selCustomerModal.show();

            appIonicLoading.show({
                template: '正在加载中',
                animation: 'fade-in',
                showBackdrop: true,
                duration: 30000
            });

            var pageSize = 10;
            var loadData = function ($ionicLoading) {
                runServiceWithSession($http, undefined, $ionicPopup, $state,
                    "applyCustomerList", {
                        ApplyType: $scope.ApplyType,
                        PageSize: pageSize,
                        PageNo: $scope.pageNo
                    }, function (data, status) {
                        appIonicLoading.hide();
                        $scope.items = data.array;

                        $scope.loadingMore = false;
                        if ($scope.items.length > 0) {
                            $scope.noData = false;
                        } else {
                            $scope.noData = true;
                        }
                        $scope.hasMore = (($scope.pageNo - 1) * pageSize + data["array"].length < data.totalCount);
                        $scope.$broadcast('scroll.refreshComplete');
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    });
            };
            loadData($ionicLoading);
            paging.init($scope, pageSize, 1, loadData);

        };

        //选择客户
        $scope.chooceCustomer = function (index, item) {
            $scope.ApplyInfoNoRelative.CustomerID = item.CustomerID;
            $scope.ApplyInfoNoRelative.CustomerName = item.CustomerName;
            $scope.ApplyInfoNoRelative.CustomerType = item.CustomerType;
            $scope.index = index;  //用于显示mark图标
        };

        $scope.closeSelCustomerModal = function () {
            $scope.selCustomerModal.hide();
        };


        //选择业务类型
        $scope.selectBusinessType = function () {
            $ionicModal.fromTemplateUrl('templates/businessApplication/businessType-modal.html', {
                scope: $scope,
                backdropClickToClose: false
            }).then(function (modal) {
                $scope.modal = modal;
                $scope.modal.show();
                runServiceWithSession($http, undefined, $ionicPopup, $state,
                    "getBusinessType", {ApplyType: $scope.ApplyType.ItemNo}, function (data, status) {
                        $scope.BusinessTypes = [];
                        data.array.forEach(function (item) {
                            if (item.SortNo.length !== 1 || item.SortNo.length !== 4) {
                                item.IsShow = false;
                            } else {
                                item.IsShow = true;
                            }
                            $scope.BusinessTypes.push(item);
                        });
                    });
            });
        };

        //选择业务类型
        $scope.confirm = function (item) {
            if (item.SortNo.length !== 8) {
                return;
            }
            $scope.ApplyInfoNoRelative.BusinessType = item.TypeNo;
            $scope.ApplyInfoNoRelative.BusinessTypeName = item.TypeName;
            $scope.modal.hide();
        };

        //保存
        $scope.saveApply = function () {
            $scope.ApplyInfoNoRelative.BusinessSum = parseFloat($scope.ApplyInfoNoRelative.BusinessSum.split(',').join(''));
            if (!$scope.ApplyInfoNoRelative.CustomerID) {
                $ionicLoading.show({template: '请选择客户！', duration: 2000});
                return;
            }
            if (!$scope.ApplyInfoNoRelative.BusinessType) {
                $ionicLoading.show({template: '请选择业务类型！', duration: 2000});
                return;
            }
            if (!$scope.ApplyInfoNoRelative.OccurType) {
                $ionicLoading.show({template: '请选择发生类型！', duration: 2000});
                return;
            }
            if (!$scope.ApplyInfoNoRelative.Currency) {
                $ionicLoading.show({template: '请选择币种！', duration: 2000});
                return;
            }
            if (isNaN($scope.ApplyInfoNoRelative.BusinessSum)) {
                $ionicLoading.show({template: '金额填写错误！', duration: 2000});
                return;
            }
            if (isNaN($scope.ApplyInfoNoRelative.TermMonth)) {
                $scope.ApplyInfoNoRelative.BusinessSum = $filter('currency')($scope.ApplyInfoNoRelative.BusinessSum, '');
                $ionicLoading.show({template: '期限(月)填写错误！', duration: 2000});
                return;
            }

            runServiceWithSession($http, undefined, $ionicPopup, $state,
                "addNewOrder", $scope.ApplyInfoNoRelative, function (data, status) {
                    if (data.array[0].SaveFlag == 'SUCCESS') {
                        $ionicLoading.show({template: '保存成功！', duration: 2000});
                        $scope.closeApplyModal();
                        loadData();
                    } else {
                        $ionicLoading.show({template: '保存失败！', duration: 2000});
                    }
                });
        };

    })

    .controller('ApplyDetailController', function ($scope, $http, $ionicLoading, $ionicPopup, $state) {

        $scope.$on('to-applyDetail', function (e, data) {

            if (data.SerialNo) {
                $scope.noData = false;
            } else {
                $scope.noData = true;
            }
            $scope.SerialNo = data.SerialNo;
            $scope.CustomerID = data.CustomerID;
            $scope.BusinessType = data.BusinessType;
            $scope.items = [];
            runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
                "applyInfo", {
                    serialNo: $scope.SerialNo,
                    businessType: $scope.BusinessType,
                    customerID: $scope.CustomerID
                }, function (data, status) {
                    appIonicLoading.hide();
                    for (var i = 0; i < data["array"].length; i++) {
                        //增加参数，是否展示，页面载入时均展示
                        data["array"][i]['showGroup'] = true;
                        $scope.items.push(data["array"][i]);
                    }
                });
        });

        $scope.showOrNot = function (item) {
            if (item.showGroup) {
                item.showGroup = false;
            } else {
                item.showGroup = true;
            }
        };


    })

    .controller('CustomerInfoController', function ($scope, $http, $ionicLoading, $ionicPopup, $state) {

        $scope.$on('to-customerInfo', function (e, data) {
            if (data.CustomerID) {
                $scope.noData = false;
            } else {
                $scope.noData = true;
            }
            $scope.CustomerID = data.CustomerID;
            $scope.items = [];
            runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
                "customerInfo", {
                    customerID: $scope.CustomerID
                }, function (data, status) {
                    for (var i = 0; i < data["array"].length; i++) {
                        //增加参数，是否展示，页面载入时均展示
                        data["array"][i]['showGroup'] = true;
                        $scope.items.push(data["array"][i]);
                    }
                });

        });

        $scope.showOrNot = function (item) {
            if (item.showGroup) {
                item.showGroup = false;
            } else {
                item.showGroup = true;
            }
        };
    })

    .controller('BAOpinionController', function ($scope, $http, $ionicLoading, $ionicPopup, $state) {

        $scope.$on('to-opinion', function (e, data) {
            $scope.SerialNo = data.SerialNo;
            $scope.items = [];
            runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
                "opinionInfo", {
                    serialNo: $scope.SerialNo,
                    objectType: 'CreditApply'
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
                });

            $scope.showOrNot = function (item) {
                if (item.showGroup) {
                    item.showGroup = false;
                } else {
                    item.showGroup = true;
                }
            };
        });
    })

    .controller('SurveyReportController', function ($scope, $http, $ionicLoading, $ionicPopup, $state, $sce) {

        $scope.$on('to-report', function (e, data) {
            $scope.SerialNo = data.SerialNo;
            $scope.items = [];
            runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
                "surveyReport", {
                    objectNo: $scope.SerialNo,
                    objectType: 'CreditApply'
                }, function (data, status) {
                    $scope.reportInfo = data;
                    //所谓sce即“Strict Contextual Escaping”的缩写。翻译成中文就是“严格的上下文模式”也可以理解为安全绑定吧
                    $scope.reportInfo.ReportData = $sce.trustAsHtml(data['ReportData']);
                    if (data['ReportDesc'] == 'EXIST') {
                        $scope.noData = false;
                    } else {
                        $scope.noData = true;
                    }
                });
        });
    })

    .controller('ScreenageController', function ($scope, $http, $ionicLoading, $ionicPopup, $state) {
        //影像采集控制器

        $scope.$on('to-screenage', function (event, data) {
            //业务申请中的勇流水号作为CustomerID保存
            $scope.CustomerID = 'BA' + data.SerialNo;
            $scope.showpage = false;
        });

        //显示信息采集页面
        $scope.showpage = false;

        //跳转到信息采集页面
        $scope.goToTakePicture = function (item) {
            $scope.showpage = true;
            item.tabIndex = 3;
            item.CustomerID = $scope.CustomerID;

            //广播名称中加入索引，避免在切换tab时重复发送广播
            $scope.$broadcast('to-takePicture', item);
        };

        //接受返回
        $scope.$on('change-showpage', function (event, data) {
            $scope.showpage = data.showpage;
        });

        //获取采集要素
        //04:业务申请中的影像采集
        runServiceWithSession($http, undefined, $ionicPopup, $state, 'getScreenageItems', {ScreenageType: '04'}, function (data) {
            $scope.ItemList = [];
            var Item = {"parentName": "现场采集要素", "children": []};
            $scope.ItemList.push(Item);
            for (var i = 0; i < data.array.length; i++) {
                if (data.array[i].ItemNo.length == 4) {
                    var Item = {"parentName": "", "children": []};
                    Item.parentName = data.array[i].ItemName;


                    $scope.ItemList.push(Item)
                } else {

                    Item.children.push(data.array[i]);
                }
            }

            for (var i = 0; i < $scope.ItemList.length; i++) {
                if ($scope.ItemList[i].children.length == 0) {
                    $scope.ItemList.splice(i, 1);
                }
            }
            appIonicLoading.hide();
        });
    })

    //影像采集
    .controller('PhotoTakingController', function ($scope, basePage, $stateParams, $http, $ionicLoading, $window,
                                                   $ionicPopup, $state, $ionicModal, $timeout, $cordovaFileTransfer,
                                                   $cordovaCapture, $cordovaGeolocation, $ionicActionSheet) {

        $scope.$on('to-takePicture', function (event, data) {
            $scope.images = [];  //用于展示图片
            $scope.videos = [];  //用于展示视频
            $scope.radios = [];  //用于展示视频
            // $scope.radios = [{"SerialNo":"2016121000000002","Describe":"","Longitude":"","Latitude":"","Address":"","FileType":"02","FileName":"\/Volumes\/H\/fileupload\/2016090200000001010101\/1481350801516.wav"}];  //用于展示音频

            $scope.cancel_mode = false;
            $scope.imgSelected = false;
            $scope.imageData = []; //保存加载的图片信息
            $scope.radiosData = []; //保存加载的音频信息
            $scope.videosData = []; //保存加载的视频信息

            $scope.screenageTitle = data.ItemName;
            $scope.params = data;
            $scope.info.CustomerID = data.CustomerID;
            $scope.info.ItemNo = data.ItemNo;

            //用于处理删除时变量未定义
            $stateParams.CustomerID = data.CustomerID;
            $stateParams.ItemNo = data.ItemNo;

            $scope.getAddress();

            $scope.info.Describe = '';
            $scope.getInfo();

        });
        $scope.toBack = function () {
            $scope.$emit('change-showpage', {showpage: false});
        };

        appscope = $scope;

        //初始化基础页面
        basePage.init($scope);


        //接受传入参数，并设置为title名称
        // $scope.title = $stateParams.ItemName;

        /*存储图片、音频和视频文件名等信息，用于传入后台服务的参数,
         Image，Radio，Video是由各自的文件名拼接而成，用英文逗号隔开；
         */
        $scope.info = {Image: '', Radio: '', Video: ''};

        //接受传入的参数，客户id，项号
        // $scope.info.CustomerID = $stateParams.CustomerID;
        // $scope.info.ItemNo = $stateParams.ItemNo;

        /*拍摄图片的数组
         name: 文件名
         fullPath：文件全路径
         isNew：true/false 是否是新拍摄的
         */


        $scope.isShow = {show: false};  //是否显示拍摄的图片
        $scope.index;  //查看大图时使用
        $scope.imageNo = MaxNo;  //赋值最多拍摄图片数量


        /*增加资料的点击事件*/
        $scope.addDate = function () {
            $ionicActionSheet.show({
                buttons: [
                    {text: '图片'},
                    // {text: '视频'},
                    // {text: '音频'}
                ],
                titleText: '点击您想添加的资料',
                cancelText: '取消',
                cancel: function () {
                    // add cancel code..
                },
                buttonClicked: function (index) {
                    if (index === 0) {//增加图片
                        if ($scope.images.length >= MaxNo || $scope.imageData.length >= MaxNo) {
                            appIonicLoading.show({template: '最多只能拍摄' + MaxNo + '张图片！', duration: 2000});
                        } else {
                            $scope.takePhoto();
                        }

                    } else if (index === 1) {//增加视频
                        if ($scope.videos.length >= MaxNo || $scope.videosData.length >= MaxNo) {
                            appIonicLoading.show({template: '最多只能拍摄' + MaxNo + '个视频！', duration: 2000});
                        } else {
                            $scope.takeVideo();
                        }

                    } else {//增加音频
                        if ($scope.radios.length >= MaxNo || $scope.radiosData.length >= MaxNo) {
                            appIonicLoading.show({template: '最多只能录制' + MaxNo + '个音频！', duration: 2000});
                        } else {
                            $scope.takeRadio();
                        }

                    }
                    return true;
                }
            });
        };


        /*地图定位，获取地址，经纬度
         $scope.info.Longitude：经度
         $scope.info.Latitude： 维度
         $scope.info.Address： 地址
         */

        /*
         timeout: 允许定位的最大时间；
         enableHighAccuracy: 是否提示该应用程序需要一个可能的最好结果；
         */

        //获取定位信息
        $scope.getAddress = function () {
            var posOptions = {timeout: 1000, enableHighAccuracy: false};
            if (ionic.Platform.isAndroid()) {
            	window.getCurrentLocation([],function (msg) {
                    var obj = eval("("+msg+")");
                      $scope.info.Address = obj.Address;
                      $scope.$digest();
                  }, function (err) {
                })
            } else {
                $cordovaGeolocation.getCurrentPosition(posOptions)
                    .then(function (position) {
                        var onSuccess = function (position) {
                            //经度
                            $scope.info.Longitude = position.coords.longitude;
                            //纬度
                            $scope.info.Latitude = position.coords.latitude;


                            //调用百度定位插件的功能
                            var myGeo = new BMap.Geocoder();
                            // 根据坐标得到地址描述
                            myGeo.getLocation(new BMap.Point(position.coords.longitude, position.coords.latitude), function (result) {
                                if (result) {
                                    $timeout(function () {
                                        $scope.info.Address = result.address;
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


        /*编辑文件，可以选择删除

         */

        $scope.selectImg = function () {
            $scope.cancel_mode = !$scope.cancel_mode;
            if ($scope.cancel_mode) {
                //显示取消按钮时
                $scope.imgSelected = true;//显示选择图片的按钮,进行批量删除
            } else {
                //显示选择按钮时
                $scope.imgSelected = false;//隐藏批量删除选择按钮
                for (var v = 0; v < $scope.images.length; v++) {
                    if ($scope.images[v].isSelected) {
                        $scope.images[v].isSelected = false;
                    }
                }

                for (var v = 0; v < $scope.radios.length; v++) {
                    if ($scope.radios[v].isSelected) {
                        $scope.radios[v].isSelected = false;
                    }
                }

                for (var v = 0; v < $scope.videos.length; v++) {
                    if ($scope.videos[v].isSelected) {
                        $scope.videos[v].isSelected = false;
                    }
                }
            }
        };

        $scope.hasSelect = function (i, image) {


            // image.show = !image.show;
            image.isSelected = !image.isSelected;
        };


        // document.addEventListener("deviceready", function () {

        //拍照
        $scope.takePhoto = function () {

            //拍照参数
            var options = {
                quality: 50,
                // destinationType: Camera.DestinationType.FILE_URI,
                // sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: false,
                // encodingType: Camera.EncodingType.JPEG,
                targetWidth: 1000,
                targetHeight: 1000,
                //popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false
                //correctOrientation:true
            };

            //调用拍照插件
            $cordovaCapture.captureImage(options).then(function (imageData) {

                // 拍摄成功，处理图片数据
                for (var i = 0; i < imageData.length; i++) {

                    //保存图片信息
                    var image = {};
                    //获取拍摄图片的全路径信息
                    image.src = imageData[i].fullPath;

                    //以时间毫秒重命名文件
                    var date = new Date();
                    image.name = date.getTime() + '.' + imageData[i].name.split('.').pop();

                    //文件类型 01 = 图片
                    image.FileType = '01';

                    //设置新增属性isNew
                    image.isNew = true;

                    image.isSelected = false;

                    //将拍摄的图片放入数组中
                    $scope.images.push(image);

                }
            }, function (err) {
                // 拍摄失败
            });
        };


        //========  拍摄视频  ====================

        $scope.takeVideo = function () {
            //limit每次拍一个，duration拍摄时间
            var options = {limit: 1, duration: durationTime};

            $cordovaCapture.captureVideo(options).then(function (videoData) {
                // Success! Video data is here
                var i, path, len;
                //遍历获取录制的文件（iOS只支持一次录制一个视频或音频）
                for (i = 0, len = videoData.length; i < len; i++) {
                    //保存视频信息
                    var video = {};
                    //获取拍摄图片的全路径信息
                    video.src = videoData[i].fullPath;

                    //以时间毫秒重命名文件
                    var date = new Date();
                    video.name = date.getTime() + '.' + videoData[i].name.split('.').pop();

                    //文件类型 03 = 视频
                    video.FileType = '03';

                    //设置新增属性isNew
                    video.isNew = true;

                    video.isSelected = false;

                    //将拍摄的图片放入数组中
                    $scope.videos.push(video);

                }
            }, function (err) {
                // An error occurred. Show a message to the user
            });
        };


        // 录制音频

        $scope.takeRadio = function () {

            var options = {limit: 1, duration: durationTime};

            $cordovaCapture.captureAudio(options).then(function (audioData) {
                // Success! Video data is here
                var i, path, len;
                //遍历获取录制的文件（iOS只支持一次录制一个视频或音频）
                for (i = 0, len = audioData.length; i < len; i++) {
                    //保存视频信息
                    var radio = {};
                    //获取拍摄图片的全路径信息
                    radio.src = audioData[i].fullPath;

                    //以时间毫秒重命名文件
                    var date = new Date();
                    radio.name = date.getTime() + '.' + audioData[i].name.split('.').pop();

                    //文件类型 02 = 音频
                    radio.FileType = '02';

                    //设置新增属性isNew
                    radio.isNew = true;

                    radio.isSelected = false;
                    //将拍摄的图片放入数组中
                    $scope.radios.push(radio);

                }
            }, function (err) {
                // An error occurred. Show a message to the user
            });
        };

        // }
        // 	, false);


        //是否需要隐藏loading
        var shouldHideLoading = false;

        var finalTemplate = '';

        /**
         * 获取需要上传文件数量
         */
        $scope.getNeedUpdateCount = function () {
            var result = 0;
            for (var i = 0; i < $scope.images.length; i++) {
                if ($scope.images[i].isNew && $scope.images[i].isNew == true) {
                    result++;
                }
            }

            for (var i = 0; i < $scope.videos.length; i++) {
                if ($scope.videos[i].isNew && $scope.videos[i].isNew == true) {
                    result++;
                }
            }

            for (var i = 0; i < $scope.radios.length; i++) {
                if ($scope.radios[i].isNew && $scope.radios[i].isNew == true) {
                    result++;
                }
            }

            return result;
        };

        //定时判断是否需要隐藏
        appscope.judgeLoading = function () {
            appscope.waitTimeout--;
            if (appscope.needUpdateCount !== 0) {
                if (appscope.actualUpdateCount === appscope.needUpdateCount) {
                    appIonicLoading.hide();
                    appIonicLoading.show({template: '上传成功', duration: 2000});
                }
                else {
                    if (appscope.waitTimeout === 0) {
                        appIonicLoading.hide();
                        appIonicLoading.show({template: '上传超时或失败，请重试...', duration: 2000});
                    } else {
                        setTimeout('appscope.judgeLoading()', 1000);
                    }
                }
            } else {
            }

        };

        /**
         * 没有影像信息时只保存描述，地址等信息
         */
        $scope.uploadOtherInfo = function () {
            runServiceWithSession($http, undefined, $ionicPopup, $state, 'uploadImage', $scope.info,
                function (data, status) {
                    if (data.array[0].Result.split(',')[0] === 'SUCCESS') {
                        appIonicLoading.show({template: '保存成功！', duration: 2000});
                    } else {
                        appIonicLoading.show({template: '保存失败！', duration: 2000});
                    }

                });
        };

        /*
         资料上传，先上传图片，视频，音频，再上传其他资料信息
         */
        $scope.uploadinfo = function () {
            appscope.actualUpdateCount = 0;
            appscope.waitTimeout = 60;
            appscope.needUpdateCount = $scope.getNeedUpdateCount();
            if (appscope.needUpdateCount === 0) {
                // appIonicLoading.show({template: '没有新增的文件可以上传！', duration: 2000});
                $scope.uploadOtherInfo();
            } else {
                appIonicLoading.show({template: '信息保存中...'});
            }

            var data = $scope.info;

            for (var i = 0; i < $scope.images.length; i++) {

                if ($scope.images[i].isNew && $scope.images[i].isNew == true) {
                    shouldHideLoading = false;

                    (function (i) {
                        var win = function (r) {

                            var imageData = {};
                            for (var key in data) {
                                imageData[key] = data[key];
                            }
                            imageData.Image = $scope.images[i].name;

                            runServiceWithSession($http, null, $ionicPopup, $state, 'uploadImage', imageData,
                                function (data, status) {

                                    //提示模板
                                    var template;
                                    var d = data.array[0].Result.split(',');
                                    if (d[0] == 'SUCCESS') {
                                        appscope.actualUpdateCount++;
                                        $scope.SerialNo = d[1];
                                        $scope.images[i].isNew = false;

                                    } else {
                                        template = "上传失败！code:" + r.code;
                                    }
                                    //appIonicLoading.show({template: template, duration: 2000});
                                });
                        }

                        var fail = function (error) {
                            //appIonicLoading.show({template: "上传失败: Code = " + error.code, duration: 2000});
                        }

                        //文件的路径
                        var fileURL = $scope.images[i].src;
                        //上传的参数
                        var options = new FileUploadOptions();
                        options.fileKey = "file";

                        options.mimeType = "text/plain";

                        options.fileName = $scope.images[i].name;

                        var ft = new FileTransfer();
                        //上传文件
                        ft.upload(fileURL, encodeURI(AmApp.config.ServiceRealRootPath + "/FileTransfer?dir=" + $scope.info.CustomerID + $scope.info.ItemNo), win, fail, options);

                    })(i);

                }
            }


            //视频上传
            for (var j = 0; j < $scope.videos.length; j++) {

                //视频isNew 为true ，是新增时上传视频
                if ($scope.videos[j].isNew && $scope.videos[j].isNew == true) {
                    (function (j) {
                        var win = function (r) {

                            var videoData = {};
                            for (var key in data) {
                                videoData[key] = data[key];
                            }
                            videoData.Video = $scope.videos[j].name;

                            runServiceWithSession($http, null, $ionicPopup, $state, 'uploadImage', videoData,
                                function (data, status) {
                                    //提示模板
                                    var template;
                                    var d = data.array[0].Result.split(',');

                                    if (d[0] == 'SUCCESS') {
                                        appscope.actualUpdateCount++;

                                        template = "上传成功！";
                                        $scope.SerialNo = d[1];

                                        $scope.videos[j].isNew = false;

                                    } else {
                                        template = "上传失败！";
                                    }
                                    //appIonicLoading.show({template: template,duration:2000});
                                });

                        }

                        var fail = function (error) {

                        }

                        //文件的路径
                        var fileURL = $scope.videos[j].src;
                        //上传的参数
                        var options = new FileUploadOptions();
                        options.fileKey = "file";
                        options.mimeType = "text/plain";
                        options.fileName = $scope.videos[j].name;

                        var ft = new FileTransfer();
                        //上传文件
                        ft.upload(fileURL, encodeURI(AmApp.config.ServiceRealRootPath + "/FileTransfer?dir=" + $scope.info.CustomerID + $scope.info.ItemNo), win, fail, options);
                    })(j);
                }
            }


            //音频上传
            for (var k = 0; k < $scope.radios.length; k++) {

                //音频isNew 为true ，是新增时上传音频
                if ($scope.radios[k].isNew && $scope.radios[k].isNew == true) {
                    (function (k) {
                        var win = function (r) {

                            var audioData = {};
                            for (var key in data) {
                                audioData[key] = data[key];
                            }
                            audioData.Radio = $scope.radios[k].name;

                            runServiceWithSession($http, null, $ionicPopup, $state, 'uploadImage', audioData,
                                function (data, status) {
                                    //提示模板
                                    var template;
                                    //Result  = 'SUCCESS,serailNo'
                                    var d = data.array[0].Result.split(',');

                                    if (d[0] == 'SUCCESS') {
                                        appscope.actualUpdateCount++;

                                        template = "上传成功！";
                                        $scope.SerialNo = d[1];
                                        $scope.radios[k].isNew = false;

                                    } else {
                                        template = "上传失败！";
                                    }
                                    //appIonicLoading.show({template: template,duration:2000});
                                });
                        }

                        var fail = function (error) {
                            //appIonicLoading.show({template: "上传失败: Code = " + error.code, duration:2000});
                        }

                        //文件的路径
                        var fileURL = $scope.radios[k].src;
                        //上传的参数
                        var options = new FileUploadOptions();
                        options.fileKey = "file";

                        options.mimeType = "text/plain";

                        options.fileName = $scope.radios[k].name;

                        var ft = new FileTransfer();
                        //上传文件
                        ft.upload(fileURL, encodeURI(AmApp.config.ServiceRealRootPath + "/FileTransfer?dir=" + $scope.info.CustomerID + $scope.info.ItemNo), win, fail, options);
                    })(k);
                }
            }

            // appscope.judgeLoading();

            setTimeout('appscope.judgeLoading()', 1000);
        };


        //获取资料和影像信息
        $scope.getInfo = function () {
            runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
                'loadImages', {CustomerID: $scope.info.CustomerID, ItemNo: $scope.info.ItemNo},
                function (data, status) {
                    $scope.AllData = data.array;

                    //FileType: 01=图片，02=音频，03=视频
                    for (var k = 0; k < $scope.AllData.length; k++) {
                        if ($scope.AllData[k].FileType == '01') {
                            //添加图片
                            var image = $scope.AllData[k];
                            image.loading = true;
                            $scope.imageData.push(image);
                        } else if ($scope.AllData[k].FileType == '02') {
                            //添加音频
                            var radio = $scope.AllData[k];
                            radio.loading = true;
                            $scope.radiosData.push(radio);

                        } else if ($scope.AllData[k].FileType == '03') {
                            //添加视频
                            var video = $scope.AllData[k];
                            video.loading = true;
                            $scope.videosData.push(video);

                        }
                    }

                    if (data.array[0]) {
                        $scope.SerialNo = data.array[0].SerialNo;
                        $scope.info.Describe = data.array[0].Describe;
                    }

                    document.addEventListener('deviceready', function () {
                        $scope.getAddress();

                        //下载时会出现异步现象，先执行循环，再执行download函数
                        for (var i = 0; i < $scope.imageData.length; i++) {
                            (function (i) {
                                var url = AmApp.config.ServiceRealRootPath + "/AttachView?FullPath=" + $scope.imageData[i].FileName;
                                var targetPath = cordova.file.cacheDirectory + $scope.imageData[i].FileName.split('/').pop();
                                var trustHosts = true;
                                var options = {};

                                $cordovaFileTransfer.download(url, targetPath, options, trustHosts)
                                    .then(function (result) {
                                        // Success!
                                        var image = {};
                                        image.src = result.nativeURL;
                                        image.isSelected = false;
                                        image.name = result.name;
                                        $scope.images.push(image);

                                        $scope.imageData[i].loading = false;

                                    }, function (err) {
                                        // Error
                                        appIonicLoading.show({template: '加载失败！code：' + err.code, duration: 2000});
                                    }, function (progress) {
                                        $timeout(function () {
                                            $scope.downloadImageProgress = (progress.loaded / progress.total) * 100;
                                        }, 500);
                                    });
                            })(i);

                        }

                        //下载音频
                        for (var i = 0; i < $scope.radiosData.length; i++) {

                            (function (i) {
                                var url = AmApp.config.ServiceRealRootPath + "/AttachView?FullPath=" + $scope.radiosData[i].FileName;
                                var targetPath = cordova.file.cacheDirectory + $scope.radiosData[i].FileName.split('/').pop();
                                var trustHosts = true;
                                var options = {};

                                $cordovaFileTransfer.download(url, targetPath, options, trustHosts)
                                    .then(function (result) {
                                        // Success!
                                        var radio = {};
                                        radio.src = result.nativeURL;
                                        radio.isSelected = false;
                                        radio.name = result.name;
                                        $scope.radios.push(radio);

                                        $scope.radiosData[i].loading = false;

                                    }, function (err) {
                                        // Error
                                        appIonicLoading.show({template: '加载失败！code：' + err.code, duration: 2000});
                                    }, function (progress) {
                                        $timeout(function () {
                                            $scope.downloadAudioProgress = (progress.loaded / progress.total) * 100;
                                        }, 500);
                                    });
                            })(i);

                        }


                        //下载视频
                        for (var i = 0; i < $scope.videosData.length; i++) {

                            (function (i) {
                                var url = AmApp.config.ServiceRealRootPath + "/AttachView?FullPath=" + $scope.videosData[i].FileName;
                                var targetPath = cordova.file.cacheDirectory + $scope.videosData[i].FileName.split('/').pop();
                                var trustHosts = true;
                                var options = {};

                                $cordovaFileTransfer.download(url, targetPath, options, trustHosts)
                                    .then(function (result) {
                                        // Success!

                                        var video = {};
                                        video.src = result.nativeURL;
                                        video.isSelected = false;
                                        video.name = result.name;
                                        $scope.videos.push(video);

                                        $scope.videosData[i].loading = false;

                                    }, function (err) {
                                        // Error
                                        appIonicLoading.show({template: '加载失败！code：' + err.code, duration: 2000});
                                    }, function (progress) {
                                        $timeout(function () {
                                            $scope.downloadVideoProgress = (progress.loaded / progress.total) * 100;
                                        }, 500);
                                    });
                            })(i);

                        }
                    }, false);
                });
        };

        //加载资料
        // $scope.getInfo();


        //查看大图
        $ionicModal.fromTemplateUrl('templates/screenage/picture-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
        });
        $scope.openModal = function (index) {
            $scope.index = index;
            $scope.images[$scope.index].isSelected = true;
            $scope.modal.show();

        };
        $scope.closeModal = function () {
            $scope.modal.hide();
            // $scope.modal.remove();
            $scope.images[$scope.index].isSelected = false;
            $scope.index = null;
        };


        //删除图片
        $scope.deleteImage = function () {
            //设置完就清空
            if ($scope.images[$scope.index].isNew) {
                $scope.images.splice($scope.index, 1);
            } else {
                var delParams = {
                    SerialNo: '',
                    FileName: ''
                };

                delParams.SerialNo = $scope.SerialNo;
                delParams.FileName = '/' + $stateParams.CustomerID + $stateParams.ItemNo + '/' + $scope.images[$scope.index].name;

                runServiceWithSession($http, $ionicLoading, $ionicPopup, $state, 'deleteFiles', delParams,
                    function (data, status) {

                        if (data.array[0].Result == 'SUCCESS') {
                            //删除对应的图片
                            $scope.images.splice($scope.index, 1);

                            appIonicLoading.show({template: '删除成功！', duration: 2000});
                        } else {
                            appIonicLoading.show({template: '删除失败！', duration: 2000});
                        }

                    });

            }

            //关闭模态窗口
            $scope.closeModal();
        };


        //删除文件
        $scope.deleteFile = function () {
            var newFile = 0;
            for (var s = 0; s < $scope.images.length; s++) {
                if ($scope.images[s].isNew && $scope.images[s].isSelected) {
                    newFile++;
                    $scope.images.splice(s, 1);
                    s = -1;
                }
            }

            for (var s = 0; s < $scope.radios.length; s++) {
                if ($scope.radios[s].isNew && $scope.radios[s].isSelected) {
                    newFile++;
                    $scope.radios.splice(s, 1);
                    s = -1;
                }
            }

            for (var s = 0; s < $scope.videos.length; s++) {
                if ($scope.videos[s].isNew && $scope.videos[s].isSelected) {
                    newFile++;
                    $scope.videos.splice(s, 1);
                    s = -1;
                }
            }

            var delParams = {
                SerialNo: '',
                FileName: ''
            };

            delParams.SerialNo = $scope.SerialNo;

            for (var n = 0; n < $scope.images.length; n++) {
                if ($scope.images[n].isSelected) {
                    delParams.FileName += '/' + $stateParams.CustomerID + $stateParams.ItemNo + '/' + $scope.images[n].name + ',';
                }
            }

            for (var m = 0; m < $scope.radios.length; m++) {
                if ($scope.radios[m].isSelected) {
                    delParams.FileName += '/' + $stateParams.CustomerID + $stateParams.ItemNo + '/' + $scope.radios[m].name + ',';
                }
            }

            for (var k = 0; k < $scope.videos.length; k++) {
                if ($scope.videos[k].isSelected) {
                    delParams.FileName += '/' + $stateParams.CustomerID + $stateParams.ItemNo + '/' + $scope.videos[k].name + ',';
                }
            }

            if (delParams.FileName == '' && newFile == 0) {
                appIonicLoading.show({template: '没有可删除的文件！', duration: 2000});
                return;
            }

            runServiceWithSession($http, $ionicLoading, $ionicPopup, $state, 'deleteFiles', delParams,
                function (data, status) {

                    if (data.array[0].Result == 'SUCCESS') {
                        for (var n = 0; n < $scope.images.length; n++) {
                            if ($scope.images[n].isSelected) {
                                $scope.images.splice(n, 1);
                                $scope.imageData.splice(n, 1);
                                n = -1;
                            }
                        }

                        for (var n = 0; n < $scope.radios.length; n++) {
                            if ($scope.radios[n].isSelected) {
                                $scope.radios.splice(n, 1);
                                $scope.radiosData.splice(n, 1);
                                n = -1;
                            }
                        }

                        for (var n = 0; n < $scope.videos.length; n++) {
                            if ($scope.videos[n].isSelected) {
                                $scope.videos.splice(n, 1);
                                $scope.videosData.splice(n, 1);
                                n = -1;
                            }
                        }
                        $scope.imgSelected = false;
                        $scope.cancel_mode = false;
                        appIonicLoading.show({template: '删除成功！', duration: 2000});
                    } else {
                        appIonicLoading.show({template: '删除失败！', duration: 2000});
                    }

                });

        };


    })

