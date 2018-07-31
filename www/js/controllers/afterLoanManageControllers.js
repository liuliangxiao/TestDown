/**
 * Created by sz_able on 2017/3/21.
 */
angular.module('com.amarsoft.mobile.controllers.afterLoanManage', ['ngSanitize', 'ngAnimate'])
.controller('AfterLoanManageController',function ($scope, $ionicTabsDelegate, $ionicScrollDelegate, $ionicPopup, $state, paging) {
    //贷后管理父控制器
    $scope.checkTypes = [
        {
            ItemNo: '01010',
            ItemName: '贷款用途检查报告'
        },
        {
            ItemNo: '01020',
            ItemName: '客户检查报告'
        }
    ];

    //默认下拉选择值
    $scope.checkType = {ItemNo: '01010'};


    //选中list中的一行
    $scope.selectOneRow = function (index, item) {
        $scope.selectedIndex = index;
        $scope.$broadcast('select-row', item);
    };


    //tab初始化数据
    $scope.initData = function (index) {
        //滚动到顶部
        $ionicScrollDelegate.scrollTop();
        appIonicLoading.show({
            template: '加载中...',
            animation: 'fade-in',
            showBackdrop: true,
            duration: 30000
        });
        $scope.pageNo = 0;
        if($scope.checkType.ItemNo === '01010'){
            if(index === '0'){
                //贷款用途检查报告-未完成
                $scope.ItemNo = '01010010';
                $scope.$broadcast('no-finish');
            }else {
                //贷款用途检查报告-已完成
                $scope.ItemNo = '01010020';
                $scope.$broadcast('finished');
            }
        }else if($scope.checkType.ItemNo === '01020'){
            if(index === '0'){
                //客户检查报告-未完成
                $scope.ItemNo = '01020010';
                $scope.$broadcast('no-finish');
            }else {
                //客户检查报告-已完成
                $scope.ItemNo = '01020020';
                $scope.$broadcast('finished');
            }
        }

        // $scope.selectOneRow();
        // paging.init($scope, pageSize, 1, loadData);
    };

    //下来选择触发
    $scope.selectChange = function () {
        $ionicTabsDelegate.$getByHandle('root-tabs').select(0);
        $scope.initData('0');
    };

})

.controller('NoFinishedController', function ($scope, paging, $http, $ionicPopup, $state) {
    //加载数据
    var pageSize = 10;
        var loadData = function($ionicLoading){
            runServiceWithSession($http, undefined, $ionicPopup, $state,
            'getReportList',
            {
                ItemNo: $scope.ItemNo,
                PageSize: pageSize,
                PageNo: $scope.pageNo
            },
            function (data, status) {
                appIonicLoading.hide();
                data.array.forEach(function (i) {
                    $scope.items.push(i);
                });

                $scope.loadingMore = false;
                if ($scope.items.length > 0) {
                    $scope.noData = false;
                    //有数据，默认选择第一行
                    $scope.selectOneRow(0, $scope.items[0]);
                } else {
                    $scope.noData = true;
                }
                $scope.hasMore = (($scope.pageNo - 1) * pageSize + data["array"].length < data.totalCount);
                $scope.$broadcast('scroll.refreshComplete');
                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
    };

    $scope.$on('no-finish', function (e, d) {
        paging.init($scope, pageSize, 1, loadData);
        $scope.refresh();
    });
    
})

.controller('FinishedController', function ($scope, paging, $http, $ionicPopup, $state) {
    //加载数据
    var pageSize = 10;
    var loadData = function($ionicLoading){
        runServiceWithSession($http, undefined, $ionicPopup, $state,
            'getReportList',
            {
                ItemNo: $scope.ItemNo,
                PageSize: pageSize,
                PageNo: $scope.pageNo
            },
            function (data, status) {
                appIonicLoading.hide();
                data.array.forEach(function (i) {
                    $scope.items.push(i);
                });

                $scope.loadingMore = false;
                if ($scope.items.length > 0) {
                    $scope.noData = false;
                    //有数据，默认选择第一行
                    $scope.selectOneRow(0, $scope.items[0]);
                } else {
                    $scope.noData = true;
                }
                $scope.hasMore = (($scope.pageNo - 1) * pageSize + data["array"].length < data.totalCount);
                $scope.$broadcast('scroll.refreshComplete');
                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
    };

    $scope.$on('finished', function (e, d) {
        paging.init($scope, pageSize, 1, loadData);
        $scope.refresh();
    });
})

.controller('ReportInfoController', function ($scope, $ionicTabsDelegate, $http, $ionicLoading, $ionicPopup, $state, $ionicModal, $filter) {
    //检查报告详情

    //控制提款记录和用款记录新增按钮的显示或隐藏
    $scope.hideAddButton = function () {
        if($ionicTabsDelegate.$getByHandle('info-tabs').selectedIndex() === 2){
            $scope.showButton = false;
        }else {
            $scope.showButton = true;
        }
    };

    //处理客户检查表中的大数据字段
    var dealHtmlData = function (data) {
        var reportDetail = {};
        if(data && data.length !== 0){
            //12288 --ASCII全角空格:12288，对应半角空格:32
            var arr = data.split(String.fromCharCode(12288));
            arr.forEach(function (i) {
                if(i.indexOf('@') > -1){
                    i = i.replace('<br/>','');
                    i = i.replace('<p>','');
                    i = i.replace('</p>','');
                    i = i.replace('&nbsp;','');
                    reportDetail[i.substr(0, i.indexOf('@'))] = i.substring(i.indexOf('@')+1);
                }
            })
        }
        return reportDetail;
    };

    //客户检查报告-加载数据
    var loadCustomerCheckReport = function () {
        runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
            'getCustomerCheckReport',
            {
                ObjectType: $scope.params.ObjectType,
                ObjectNo: $scope.params.ObjectNo,
                SerialNo: $scope.params.SerialNo,
                DocID: '01'
            },
            function (data, status) {
                $scope.reportInfo = data.Result;
                $scope.reportDetail = dealHtmlData($scope.reportInfo.HtmlData);
            });
    };


    //客户检查报告-摘要
    var loadCustomerCheckSummary = function () {
        runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
            'getCustomerCheckSummary',
            {
                ObjectType: $scope.params.ObjectType,
                ObjectNo: $scope.params.ObjectNo,
                SerialNo: $scope.params.SerialNo
            },
            function (data, status) {
                $scope.reportSummary = data.Result;
            })
    };

    //客户检查报告-贷后检查表
    var loadAfterLoanCheck = function () {
        runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
            'getAfterLoanCheck',
            {
                ObjectType: $scope.params.ObjectType,
                ObjectNo: $scope.params.ObjectNo,
                SerialNo: $scope.params.SerialNo,
                DocID: '06'
            },
            function (data, status) {
                $scope.afterLoan = data.Result;
                $scope.afterLoan.HtmlDataTransferd = dealHtmlData($scope.afterLoan.HtmlData);
            });
    };

    //贷款用途检查-贷款用途分析表
    var loadLoanUsageAnalysis = function () {
        runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
            'getCustomerCheckReport',
            {
                ObjectType: $scope.params.ObjectType,
                ObjectNo: $scope.params.ObjectNo,
                SerialNo: $scope.params.SerialNo
            },
            function (data, status) {
                $scope.loanUsageAnalysis = data.Result;
                $scope.loanUsageAnalysis.HtmlDataTransferd = dealHtmlData($scope.loanUsageAnalysis.HtmlData);
            });
    };

    $scope.$on('select-row', function (e, d) {
        //$ionicTabsDelegate与父控制器中的会有冲突，会同时操作，故采用句柄区分
        $ionicTabsDelegate.$getByHandle('info-tabs').select(0);
        $scope.params = d;

        if($scope.checkType.ItemNo === '01020' ){
            //客户检查报告
            loadCustomerCheckReport();
            loadCustomerCheckSummary();
            loadAfterLoanCheck();

        }else{
            loadLoanUsageAnalysis();
        }
        $scope.$broadcast('putOutRecordList',
            {
                SerialNo: $scope.params.SerialNo,
                ObjectNo: $scope.params.ObjectNo,
                ObjectType: $scope.params.ObjectType,
            });


        $scope.$broadcast('usedRecordList',
            {
                SerialNo: $scope.params.SerialNo,
                ObjectNo: $scope.params.ObjectNo,
                ObjectType: $scope.params.ObjectType,
            });

    });


    //报告详情中信息的转换成字符串
    // var transferObj2String = function () {
    //     var htmlData = '';
    //     for(attr in $scope.reportDetail){
    //         if($scope.reportDetail[attr]){
    //             //去除字符串中的空格
    //             $scope.reportDetail[attr] = $scope.reportDetail[attr].replace(String.fromCharCode(12288),String.fromCharCode(32));
    //             htmlData += attr + '@' + '<p>' + $scope.reportDetail[attr] + '</p>' + String.fromCharCode(12288);
    //         }
    //     }
    //     return htmlData;
    // };
    var transferObj2String = function (obj) {
        var htmlData = '';
        for(attr in obj){
            if(obj[attr]){
                //去除字符串中的空格
                obj[attr] = obj[attr].replace(String.fromCharCode(12288),String.fromCharCode(32));
                htmlData += attr + '@' + '<p>' + obj[attr] + '</p>' + String.fromCharCode(12288);
            }
        }
        return htmlData;
    };


    //贷后检查表中的信息转换成字符串
    var transferObj2String2 = function () {
        var htmlData = '';
        for(attr in $scope.afterLoan.HtmlDataTransferd){
            if(document.getElementsByName(attr)[0].tagName === 'TEXTAREA'){
                htmlData += attr + '@' + '<p>' + $scope.afterLoan.HtmlDataTransferd[attr] + '</p>' + String.fromCharCode(12288);
            }else {
                htmlData += attr + '@' + $scope.afterLoan.HtmlDataTransferd[attr] + String.fromCharCode(12288);
            }
        }
        return htmlData;
    };


    //保存报告
    $scope.saveReport = function (detail) {
        var HtmlData = transferObj2String(detail);
        appIonicLoading.show({
            template: '保存中...',
            animation: 'fade-in',
            showBackdrop: true,
            duration: 30000
        });

        runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
            'saveReport',
            {
                ObjectType: $scope.params.ObjectType,
                ObjectNo: $scope.params.ObjectNo,
                SerialNo: $scope.params.SerialNo,
                DocID: '01',
                HtmlData: HtmlData

            },
            function (data, status) {
                var SaveFlag = data.Result.SaveFlag;
                var template = '';
                if(SaveFlag === 'SUCCESS'){
                    template = '保存成功！';
                }else {
                    template = '保存失败！';
                }
                $ionicLoading.show({template: template, duration: 2000});
                // appIonicLoading.hide();
        })
    };


    //保存贷后检查表中数据
    $scope.saveAfterLoanCheck = function () {
        for(attr in $scope.afterLoan.HtmlDataTransferd){
            if($scope.afterLoan.HtmlDataTransferd[attr] === false || $scope.afterLoan.HtmlDataTransferd[attr] === ''){
                delete $scope.afterLoan.HtmlDataTransferd[attr];
            }
        }

        var HtmlData = transferObj2String2();
        runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
            'saveReport',
            {
                ObjectType: $scope.params.ObjectType,
                ObjectNo: $scope.params.ObjectNo,
                SerialNo: $scope.params.SerialNo,
                DocID: '06',
                HtmlData: HtmlData

            },
            function (data, status) {
                var SaveFlag = data.Result.SaveFlag;
                var template = '';
                if(SaveFlag === 'SUCCESS'){
                    template = '保存成功！';
                }else {
                    template = '保存失败！';
                }
                $ionicLoading.show({template: template, duration: 2000});

                // appIonicLoading.hide();
            });
    };


    //根据codeno获取items
    var getItems = function () {
        runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
            'getCodeItems',
            {CodeNo: 'Currency'},
            function (data, status) {
                $scope.currencies = data.array;
        });
    };


    //新增记录
    $scope.openRecordModal = function () {

        getItems();

        var selectedTab = $ionicTabsDelegate.$getByHandle('info-tabs').selectedIndex();
        var tempUrl = 'templates/afterLoanManage/putoutRecord-modal.html';
        if(selectedTab === 1){
            tempUrl = 'templates/afterLoanManage/useRecord-modal.html';
        }
        $ionicModal.fromTemplateUrl(tempUrl, {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.recordModal = modal;

            //新增记录的信息
            $scope.NewRecord = {};
            $scope.NewRecord.Currency = '01';

            $scope.date = {
                ItemDate: new Date()
            };

            $scope.recordModal.show();
        });
    };


    //校验新增记录
    var checkRecord = function () {
        if($ionicTabsDelegate.$getByHandle('info-tabs').selectedIndex() === 0){
            if($scope.NewRecord.AccountNo === undefined){
                $ionicLoading.show({template: '请输入"入账账号！"', duration: '2000'});
                return false;
            }
            if($scope.NewRecord.ItemDate === undefined){
                $ionicLoading.show({template: '请输入"交易日期！"', duration: '2000'});
                return false;
            }
            if($scope.NewRecord.ItemSum === undefined){
                $ionicLoading.show({template: '请输入"交易金额！"', duration: '2000'});
                return false;
            }
            if(isNaN($scope.NewRecord.ItemSum)){
                $ionicLoading.show({template: '请输入正确的"交易金额！"', duration: '2000'});
                return false;
            }

        }else if($ionicTabsDelegate.$getByHandle('info-tabs').selectedIndex() === 1){
            if($scope.NewRecord.AccountNo === undefined){
                $ionicLoading.show({template: '请输入"客户账号！"', duration: '2000'});
                return false;
            }
            if($scope.NewRecord.Currency === undefined){
                $ionicLoading.show({template: '请输入"币种！"', duration: '2000'});
                return false;
            }
            if($scope.NewRecord.ItemName === undefined){
                $ionicLoading.show({template: '请输入"对方用户名！"', duration: '2000'});
                return false;
            }
            if($scope.NewRecord.ItemAccountNo === undefined){
                $ionicLoading.show({template: '请输入"对方账号！"', duration: '2000'});
                return false;
            }
            if($scope.NewRecord.ItemDate === undefined){
                $ionicLoading.show({template: '请输入"交易日期！"', duration: '2000'});
                return false;
            }
            if($scope.NewRecord.ItemSum === undefined){
                $ionicLoading.show({template: '请输入"交易金额！"', duration: '2000'});
                return false;
            }
            if(isNaN($scope.NewRecord.ItemSum)){
                $ionicLoading.show({template: '请输入正确的"交易金额！"', duration: '2000'});
                return false;
            }
            if($scope.NewRecord.Balance && isNaN($scope.NewRecord.Balance)){
                $ionicLoading.show({template: '请输入正确的"账户金额！"', duration: '2000'});
                return false;
            }
        }
        return true;
    };

    //新增记录
    $scope.addNewRecord = function () {
        $scope.NewRecord.ItemDate = $filter('date')($scope.date.ItemDate, 'yyyy/MM/dd');
        var selectedTab = $ionicTabsDelegate.$getByHandle('info-tabs').selectedIndex();

        $scope.NewRecord.SerialNo = $scope.params.SerialNo;
        $scope.NewRecord.ObjectType = $scope.params.ObjectType;
        $scope.NewRecord.ObjectNo = $scope.params.ObjectNo;

        if(!checkRecord()){
            return;
        }

        runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
            'saveRecord',
            $scope.NewRecord, function (data, status) {
            var result = data.Result.SaveFlag;
            if(result === 'SUCCESS'){
                $ionicLoading.show({template: '新增成功！', duration: 2000});
                $scope.recordModal.hide();

                $scope.$broadcast('putOutRecordList',
                    {
                        SerialNo: $scope.params.SerialNo,
                        ObjectNo: $scope.params.ObjectNo,
                        ObjectType: $scope.params.ObjectType,
                    });

                $scope.$broadcast('usedRecordList',
                    {
                        SerialNo: $scope.params.SerialNo,
                        ObjectNo: $scope.params.ObjectNo,
                        ObjectType: $scope.params.ObjectType,
                    });
            }else {
                $ionicLoading.show({template: '新增失败！', duration: 2000});
            }
        });
    };


})

.controller('PutoutRecordController', function ($scope, paging, $http, $ionicPopup, $state, $ionicLoading) {
        //加载数据
        var pageSize = 10;
        var loadData = function($ionicLoading){
            runServiceWithSession($http, undefined, $ionicPopup, $state,
                'getPutoutRecordList',
                {
                    SerialNo: $scope.params.SerialNo,
                    ObjectNo: $scope.params.ObjectNo,
                    ObjectType: $scope.params.ObjectType,
                    ItemType: '01',  //提款记录
                    PageSize: pageSize,
                    PageNo: $scope.pageNo
                },
                function (data, status) {
                    appIonicLoading.hide();
                    data.array.forEach(function (i) {
                        $scope.items.push(i);
                    });

                    $scope.loadingMore = false;
                    if ($scope.items.length > 0) {
                        $scope.noData = false;
                        //有数据，默认选择第一行
                        // $scope.selectOneRow(0, $scope.items[0]);
                    } else {
                        $scope.noData = true;
                    }
                    $scope.hasMore = (($scope.pageNo - 1) * pageSize + data["array"].length < data.totalCount);
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
        };

        $scope.$on('putOutRecordList', function (e, d) {
            $scope.params = d;
            paging.init($scope, pageSize, 1, loadData);
            $scope.refresh();
        });


        //删除记录
        $scope.deleteItem = function (item, index) {
            runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
                'deleteRecord',
                {
                    SerialNo: item.SerialNo,
                    ObjectType: item.ObjectType,
                    ObjectNo: item.ObjectNo,
                    ItemNo: item.ItemNo

                }, function (data, status) {
                    var result = data.Result.DeleteFlag;
                    if(result === 'SUCCESS'){
                        $ionicLoading.show({template: '删除成功！', duration: 2000});
                        $scope.items.splice(index, 1);
                    }else {
                        $ionicLoading.show({template: '删除失败！', duration: 2000});
                    }

                });
        };

    })

.controller('UsedRecordController', function ($scope, paging, $http, $ionicPopup, $state, $ionicLoading) {
        //用款记录控制器，与提款记录接口通用
        //加载数据
        var pageSize = 10;
        var loadData = function($ionicLoading){
            runServiceWithSession($http, undefined, $ionicPopup, $state,
                'getPutoutRecordList',
                {
                    SerialNo: $scope.params.SerialNo,
                    ObjectNo: $scope.params.ObjectNo,
                    ObjectType: $scope.params.ObjectType,
                    ItemType: '02', //用款记录
                    PageSize: pageSize,
                    PageNo: $scope.pageNo
                },
                function (data, status) {
                    appIonicLoading.hide();
                    data.array.forEach(function (i) {
                        $scope.items.push(i);
                    });

                    $scope.loadingMore = false;
                    if ($scope.items.length > 0) {
                        $scope.noData = false;
                        //有数据，默认选择第一行
                        // $scope.selectOneRow(0, $scope.items[0]);
                    } else {
                        $scope.noData = true;
                    }
                    $scope.hasMore = (($scope.pageNo - 1) * pageSize + data["array"].length < data.totalCount);
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
        }

        $scope.$on('usedRecordList', function (e, d) {
            $scope.params = d;
            paging.init($scope, pageSize, 1, loadData);
            $scope.refresh();
        });

        //删除记录
        $scope.deleteItem = function (item, index) {
            runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
                'deleteRecord',
                {
                    SerialNo: item.SerialNo,
                    ObjectType: item.ObjectType,
                    ObjectNo: item.ObjectNo,
                    ItemNo: item.ItemNo

                }, function (data, status) {
                    var result = data.Result.DeleteFlag;
                    if(result === 'SUCCESS'){
                        $ionicLoading.show({template: '删除成功！', duration: 2000});
                        $scope.items.splice(index, 1);
                    }else {
                        $ionicLoading.show({template: '删除失败！', duration: 2000});
                    }

                });
        };
    })


