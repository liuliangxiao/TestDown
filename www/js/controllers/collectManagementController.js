/**
 * @file 催收管理
 * @author qhke create
 */
angular.module('com.amarsoft.mobile.controllers.collectManagement', ['ngSanitize', 'ngAnimate'])
	.controller('collectManagementController', function($scope,$stateParams, $rootScope, $state, basePage, $timeout, $ionicPopup,
            $ionicModal, $ionicLoading, $http) {

		//add by mdchen 获取工作台传的参数
		$scope.getSerialNo = $stateParams.SerialNo;
		
		$scope.CollectRecordDetailView = false; // 催收记录详情
        $scope.infoshow = false; // 查询对话框
        $scope.query = {};

		$scope.tabIndex = 0;
		//是否待处理 0：待处理 1：已完成
		$scope.IsRelative = '0';

		if($scope.tabIndex == 0) {
			$scope.selectTab0 = true;
			$scope.selectTab1 = false;
		} else {
			$scope.selectTab0 = false;
			$scope.selectTab1 = true;
		}
		
		/**
         * 切换tab按钮
         * @param tabIndex 索引
         */
        $scope.selectTab = function (tabIndex) {
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
                $scope.$broadcast('to-NoUrgeController', {
                    IsRelative: $scope.IsRelative
                });
            } else {
                $scope.tabIndex = tabIndex;
                $scope.selectTab0 = false;
                $scope.selectTab1 = true;
                $scope.IsRelative = '1';
                $scope.$broadcast('to-HasUrgeController', {
                    IsRelative: $scope.IsRelative
                });
            }
        };

        // 列表查询
        $scope.showSearchBar = function () {
            $scope.infoshow = !$scope.infoshow;
        };

        // 清除查询条件
        $scope.clearData = function() {
            $scope.query = {};
            $scope.searchCollectInfo();
        };

        // 查询
        $scope.searchCollectInfo = function() {
            if($scope.IsRelative === '0') {
                $scope.$broadcast('to-NoUrgeController', {
                    IsRelative: $scope.IsRelative,
                    Query: $scope.query
                });
            } else {
                $scope.$broadcast('to-HasUrgeController', {
                    IsRelative: $scope.IsRelative,
                    Query: $scope.query
                });
            }
            $scope.infoshow = false;
        };
        
        //选择列表的一行
        $scope.selectOneRow = function (index, obj) {
            if(!obj) {
                $scope.NoListData = true; // 详情无数据时隐藏tab页
                return ;
            } else {
                $scope.NoListData = false;
            }

            //选中颜色改变
            $scope.selectedRow = index;
            
            $scope.CollectRecordDetailView = false;
            $scope.SerialNo = obj.SERIALNO;
            
            appIonicLoading.show({
                template: '正在加载中',
                animation: 'fade-in',
                showBackdrop: true,
                duration: 30000
            });

            //催收业务详情(SerialNo:催收任务流水,ObjectNo:借据编号)
            $scope.$broadcast('to-collectArrearsDetail',{
            	IsRelative: $scope.IsRelative,
            	SerialNo: obj.SERIALNO,
            	ObjectNo: obj.OBJECTNO
            });
            
            //催收记录列表(SerialNo:催收任务流水,ObjectNo:借据编号)
            $scope.$broadcast('to-collectArrearsRecord',{
            	IsRelative: $scope.IsRelative,
            	SerialNo: obj.SERIALNO,
            	ObjectNo: obj.OBJECTNO
            });

            //承诺还款列表(SerialNo:催收任务流水,ObjectNo:借据编号)
            $scope.$broadcast('to-collectRepayList',{
                IsRelative: $scope.IsRelative,
                SerialNo: obj.SERIALNO,
                ObjectNo: obj.OBJECTNO
            });
        };

        $ionicModal.fromTemplateUrl('templates/collectManagement/addNewCollectTask.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.addCollectModal = modal;
        });
        
        /**
         * 新增催收任务
         */
        $scope.openCollectModal = function () {
            $scope.CollectInfo = {};
            
            $scope.addCollectModal.show();

            $scope.$broadcast('to-init-NewCollectTask');
        };

        /**
         * 关闭新增窗口
         */
        $scope.closeAddTaskModal = function() {
            $scope.addCollectModal.hide();
        }

        /**
         * 新增催收记录
         */
        $scope.addCollectRecord = function() {
            $scope.CollectRecordDetailView = true;
        	// 通过子控制器获取催收任务流水号，客户编号等
        	$scope.$broadcast('to-init-CollectRecordParams', {IsDetailView: false, IsRelative: '0'})
        };

        /**
         * 关闭催收记录详情页
         */
        $scope.closeCollectRecordDetail = function() {
            $scope.CollectRecordDetailView = false;
        }

        /**
         * 完成 待处理任务转已处理
         */
        $scope.finishCollectModal = function() {
            if(!$scope.SerialNo || $scope.SerialNo == '') {
                $ionicLoading.show({
                    template: '请选择一条催收任务!',
                    duration: 1000
                });
                return ;
            }

            var confirmPopup = $ionicPopup.confirm({
                title: '<strong>完成任务</strong>',
                template: '是否完成？',
                okText: '确定',
                cancelText: '取消'
            });
            confirmPopup.then(function(res){
                if(res) {
                    appIonicLoading.show({
                        template: '正在加载中',
                        animation: 'fade-in',
                        showBackdrop: true,
                        duration: 30000
                    });
                    runServiceWithSession($http, undefined, $ionicPopup, $state,
                        "FinishCollectTask", {
                            SerialNo: $scope.SerialNo
                        }, function (data, status) {
                            appIonicLoading.hide();
                            if(data.array[0].Flag === 'Y') {
                                $ionicLoading.show({
                                    template: '保存成功',
                                    duration: 1000
                                });
                                $scope.$emit('to-refresh-list'); // 成功刷新催收任务列表
                            } else {
                                $ionicLoading.show({
                                    template: '保存失败',
                                    duration: 1000
                                });
                            }
                        }
                    );
                }
            });
        };

        //列表加载完后，默认选择第一项
        $scope.$on('to-selectRow', function (event, data) {
            if(data){
                $scope.selectOneRow(data.Remark, data);
            }else {
                $scope.NoListData = true;
            }

        });

        // 接收催收任务流水号并传给催收记录新增模板
        $scope.$on('to-init-getCollectRecordParams', function(e, data) {
            // 初始化新增模板
            $scope.$broadcast('to-init-addCollectRecord', data);
        });

        // 接收催收记录流水号并传给催收记录详情模板
        $scope.$on('to-parent-CollectRecordDetail', function(e, data) {
            $scope.CollectRecordDetailView = true;
            data.IsRelative = $scope.IsRelative;

            appIonicLoading.show({
                template: '正在加载中',
                animation: 'fade-in',
                showBackdrop: true,
                duration: 30000
            });

            // 初始化详情模板
            $scope.$broadcast('to-init-CollectRecordDetail', data);

            // 初始化影像资料
            $scope.$broadcast('to-init-CollectAudioRecord', data);
        });

        // 新增催收任务成功，刷新列表
        $scope.$on('to-refresh-list', function(e, data) {
            $scope.$broadcast('to-NoUrgeController', {
                IsRelative: '0'
            });
            $scope.$broadcast('to-HasUrgeController', {
                IsRelative: '1'
            });
        });

        // 刷新催收记录列表
        $scope.$on('to-parent-collectRecord-refresh', function(e, data) {
            $scope.$broadcast('to-collectRecord-refresh');
        });
	})

    //待处理的催收任务
	.controller('NoUrgeController', function ($scope,$rootScope, $http, $ionicPopup, $state, paging, $timeout, $ionicLoading) {
        var pageSize = 10;
        $scope.IsRelative = "0";
        $scope.Query = {};
		
		appIonicLoading.show({
            template: '正在加载中',
            animation: 'fade-in',
            showBackdrop: true,
            duration: 30000
        });

        // 初始化待处理列表
        var loadData = function ($ionicLoading) {
            runServiceWithSession($http, undefined, $ionicPopup, $state,
                "urgeArrearsList", {
                    SearchId: $scope.Query.customerID,
                    SearchName: $scope.Query.customerName,
                    IsRelative: $scope.IsRelative,
                    pageSize: pageSize,
                    pageNo: $scope.pageNo
                }, function (data, status) {
                    //$scope.items = [];
                    if (data["array"].length == 0) {
                        appIonicLoading.hide();
                    }
                    data.array.forEach(function (i) {
                        $scope.items.push(i);
                    });
                    
                    //add by mdchen
                    var flag=0;
                    if($scope.items.length > 0){
                    	for(var i=0;i<$scope.items.length;i++){
                        	if($scope.items[i].SERIALNO === $scope.getSerialNo){
                        		flag=i;
                        		break;
                        	}else{
                        		flag=0;
                            } 
                        }
                    	$scope.$emit('to-selectRow', $scope.items[flag]);
                    }else {
                        $scope.$emit('to-selectRow');
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
        paging.init($scope, pageSize, 1, loadData);

		$scope.$on('to-NoUrgeController', function (e, data) {
            $scope.IsRelative = data.IsRelative;
            $scope.noData = false;
            $scope.items = [];
            if(!data.Query) {
                $scope.Query = {};
            } else {
                $scope.Query = data.Query;
            }
            paging.init($scope, pageSize, 1, loadData);
            $scope.refresh();
        });
	})

    //已处理的催收任务
	.controller('HasUrgeController', function ($scope, $http, $ionicPopup, $state, paging,$timeout,$ionicLoading) {
        var pageSize = 10;
        $scope.IsRelative = "1";
        $scope.Query = {};
		
		appIonicLoading.show({
            template: '正在加载中',
            animation: 'fade-in',
            showBackdrop: true,
            duration: 30000
        });

        // 初始化已完成列表
        var loadData = function ($ionicLoading) {
            runServiceWithSession($http, undefined, $ionicPopup, $state,
                "urgeArrearsList", {
                    SearchID: $scope.Query.customerID,
                    SearchName: $scope.Query.customerName,
                    IsRelative: $scope.IsRelative,
                    pageSize: pageSize,
                    pageNo: $scope.pageNo
                }, function (data, status) {
                    //$scope.items = [];
                    if (data["array"].length == 0) {
                        appIonicLoading.hide();
                    }
                    data.array.forEach(function (i) {
                        $scope.items.push(i);
                    });

                    if ($scope.items.length > 0) {
                        $scope.$emit('to-selectRow', $scope.items[0]);
                    } else {
                        $scope.$emit('to-selectRow');
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
        //paging.init($scope, pageSize, 1, loadData);
		
		$scope.$on('to-HasUrgeController', function (e, data) {
            $scope.IsRelative = data.IsRelative;
            $scope.noData = false;
            $scope.items = [];
            if(!data.Query) {
                $scope.Query = {};
            } else {
                $scope.Query = data.Query;
            }
            paging.init($scope, pageSize, 1, loadData);
        });
	})

    //催收任务详情控制器
	.controller('CollectArrearsInfoController', function ($scope, $http, $ionicPopup, $state, paging, $ionicModal, $ionicLoading) {
		$scope.CustomerID = '';// 客户编号
		$scope.TaskSerialNo = '';
		$scope.IsRelative = '0';
		$scope.collectInfoDetail = {};

        // 详情初始化
		$scope.$on('to-collectArrearsDetail', function (e, data) {
			$scope.TaskSerialNo = data.SerialNo;
			$scope.IsRelative = data.IsRelative;

            runServiceWithSession($http, undefined, $ionicPopup, $state,
                "getCollectArrearsDetail", {
            		SerialNo: data.SerialNo,
            		ObjectNo: data.ObjectNo
            	}, function (data, status) {
                    $scope.collectInfoDetail = data.array[0];
                    if($scope.collectInfoDetail.Type === 'true') { // 公司客户
                        $scope.collectInfoDetail.TypeBoolean = true;
                    } else { // 个人客户
                        $scope.collectInfoDetail.TypeBoolean = false;
                    }
                    if(data.array[0]){
                        $scope.noData = false;
                    }else {
                        $scope.noData = true;
                    }
                    appIonicLoading.hide();
                });
        });
		
		$scope.$on('to-init-CollectRecordParams', function(e, data) {
			// 向父控制器传递参数
			$scope.$emit('to-init-getCollectRecordParams', {
                IsDetailView: data.IsDetailView,
                IsRelative: data.IsRelative,
				TaskSerialNo: $scope.TaskSerialNo,
				CustomerID: $scope.CustomerID
			});
		});
	})

    // 催收记录控制器
	.controller('CollectArrearsRecordController', function ($scope, $http, $ionicPopup, $state, paging, $timeout, $ionicLoading) {
        $scope.SerialNo = '';
        $scope.TaskSerialNo = '';
        $scope.IsRelative = '0';
		var pageSize = 10;
		$scope.items = [];
		
        var loadData = function ($ionicLoading) {
            runServiceWithSession($http, undefined, $ionicPopup, $state,
                "CollectRecordList", {
                    TaskSerialNo: $scope.TaskSerialNo,
                    PageSize: pageSize,
                    PageNo: $scope.pageNo
                }, function (data, status) {
                    data.array.forEach(function (i) {
                        if(i.ContactMethodName==1){
                            i.ContactMethodName="电话催收";
                        }else if(i.ContactMethodName==2){
                            i.ContactMethodName="人工催收";
                        }
                        $scope.items.push(i);
                    });

                    if(data.array[0]){
                        $scope.noData = false;
                    }else {
                        $scope.noData = true;
                    }
                    $scope.loadingMore = false;
                    if ($scope.items.length > 0) {
                    	$scope.selectArrearsRecord(0, $scope.items[0]);
                    }
                    appIonicLoading.hide();
                    $scope.hasMore = (($scope.pageNo - 1) * pageSize + data["array"].length < data.totalCount);
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
        };
        //paging.init($scope, pageSize, 1, loadData);


        $scope.selectArrearsRecord = function(index, obj) {
            //选中颜色改变
            $scope.selectedRow = index;
            $scope.SerialNo = obj.SerialNo;
        };
        /**
         * 催收记录详情
         */
        $scope.CollectRecordDetail = function() {
            if(!$scope.SerialNo) { // 未选中记录
                $ionicLoading.show({
                    template: '请选择催收记录',
                    duration: 1000
                });
                return ;
            }
            $scope.$emit('to-parent-CollectRecordDetail',{
                IsDetailView: true,
                SerialNo: $scope.SerialNo,
                TaskSerialNo: $scope.TaskSerialNo
            });
        };
		
        $scope.$on('to-collectArrearsRecord', function (e, data) {
            $scope.SerialNo = '';
        	$scope.IsRelative = data.IsRelative;
        	$scope.TaskSerialNo = data.SerialNo;
        	$scope.pageNo = 1;
            $scope.items = [];
            $scope.noData = false;
        	
        	paging.init($scope, pageSize, 1, loadData);
        });
        
        $scope.$on('to-collectRecord-refresh', function (e, data) {
            $scope.SerialNo = '';
            $scope.pageNo = 1;
            $scope.items = [];
            $scope.noData = false;
        	paging.init($scope, pageSize, 1, loadData);
        });
	})
	
	// 新增催收任务
    .controller('NewCollectTaskController', function ($scope, $http, $ionicLoading, $ionicPopup, $state, paging, $ionicModal) {
        $scope.NewData = {};
        $scope.Items = [];
        $scope.Search = {};
        var pageSize = 5;

        var loadCodeItems = function() {
            // 催收方式(CollectMethod2:1,电话催收,2,人工催收)
            runServiceWithSession($http, undefined, $ionicPopup, $state,
                "getCodeItems", {CodeNo: 'CollectMethod2'}, function (data, status) {
                    $scope.CollectMethods = data.array;
                });
        };

        // 借据列表
        $ionicModal.fromTemplateUrl('templates/collectManagement/selBusinessDuebill-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.selDuebillModal = modal;
        });

        // 查询
        $scope.toSearchByCustomer = function() {
            $scope.SearchKey = $scope.Search.Key;
            $scope.Items = [];
            $scope.refresh();
        };

        // 选择借据
        $scope.selectBusinessDuebill = function() {
            $scope.selDuebillModal.show();
            $scope.Items = [];
            paging.init($scope, pageSize, 1, loadData);
        };

        // 刷新
        $scope.refreshList = function() {
            $scope.Items = [];
            $scope.refresh();
        };

        // 加载借据列表
        var loadData = function() {
            runServiceWithSession($http, undefined, $ionicPopup, $state,
                "OverdueCollectList", {
                    SearchKey: $scope.SearchKey,
                    UserId: AmApp.userID,
                    pageNo: $scope.pageNo,
                    pageSize: pageSize
                }, function (data, status) {
                    if(data["array"].length == 0) {
                        $scope.noData = true;
                    } else {
                        $scope.noData = false;
                    }
                    data.array.forEach(function (i) {
                        $scope.Items.push(i);
                    });
                    appIonicLoading.hide();
                    $scope.loadingMore = false;
                    $scope.hasMore = (($scope.pageNo - 1) * pageSize + data["array"].length < data.totalCount);
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                }
            );
        };

        // 选择一条记录
        $scope.chooceBusinessDuebill = function(index, obj) {
            $scope.NewData.BDSerialNo = obj.SerialNo; // 借据流水号
            $scope.NewData.CustomerName = obj.CustomerName; // 客户名称

            // 选中改变颜色
            $scope.selectedRow = index;
        };

        // 确定选择
        $scope.closeSelModal = function() {
            $scope.selDuebillModal.hide();
        };

        //新增保存
        $scope.saveTask = function () {
            if(!$scope.NewData.BDSerialNo) {
                $ionicLoading.show({
                    template: '请选择借据',
                    duration: 1000
                });
                return false;
            }
            if(!$scope.NewData.CollectMethod) {
                $ionicLoading.show({
                    template: '请选择催收方式',
                    duration: 1000
                });
                return false;
            }

            // 保存
            runServiceWithSession($http, undefined, $ionicPopup, $state,
                'NewCollectTask', {
                    BDSerialNo: $scope.NewData.BDSerialNo,
                    CollectMethod: $scope.NewData.CollectMethod,
                    UserId: AmApp.userID,
                    OrgId: AmApp.orgID
                }, function(data, status) {
                    if (data.array[0].Flag == 'true') {
                        $scope.$emit('to-refresh-list'); // 保存成功刷新催收任务列表
                        $scope.closeAddTaskModal(); // 关闭对话框
                        $ionicLoading.show({template: '保存成功！', duration: 2000});
                    } else {
                        $ionicLoading.show({template: '保存失败！', duration: 2000});
                    }
                }
            );
        };

        // 初始化页面
        $scope.$on('to-init-NewCollectTask', function(e, data) {
            $scope.NewData = {};
            loadCodeItems();//加载代码
        });
    })
    
    // 催收记录详情控制器
    .controller('CollectRecordDetailController', function ($scope, $http, $ionicPopup, $state, paging, $ionicModal, $ionicLoading, basePage) {
        $scope.IsRelative = '1'; // 是否待处理
        $scope.IsDetailView = false; // 是否详情
        $scope.SerialNo = ''; // 催收记录流水号
    	$scope.TaskSerialNo = ''; // 催收任务流水号
    	$scope.CustomerID = ''; // 所属客户编号-催收联系人
    	$scope.collect = {}; // 催收记录
        $scope.ProcessUser = {}; // 催收执行人
        var pageSize = 10; // 催收执行人列表-大小

        // 详情保存-校验
    	$scope.saveContactorRecord = function() {
    		// 校验必输项
    		//ContactorName
    		if(!$scope.collect.ContactorName){
    			$ionicLoading.show({
    				template: '请选择催收联系人',
    				duration: 1000
    			});
    			return false;
    		}
    		//ExplanAtionCode
    		if(!$scope.collect.ExplanAtionCode){
                $ionicLoading.show({
                    template: '请选择逾期原因',
                    duration: 1000
                });
                return false;
            }
    		//PayDesire
    		if(!$scope.collect.PayDesire){
                $ionicLoading.show({
                    template: '请选择还款意愿',
                    duration: 1000
                });
                return false;
            }
    		//PayAbility
    		if(!$scope.collect.PayAbility){
                $ionicLoading.show({
                    template: '请选择还款能力',
                    duration: 1000
                });
                return false;
            }
    		//ContactMethod
    		if(!$scope.collect.ContactMethod){
                $ionicLoading.show({
                    template: '请选择催收方式',
                    duration: 1000
                });
                return false;
            }
    		//ProcessDate
    		if(!$scope.collect.ProcessTime){
                $ionicLoading.show({
                    template: '请输入催收日期',
                    duration: 1000
                });
                return false;
            } else {
                $scope.collect.ProcessDate = $scope.collect.ProcessTime.getFullYear() + '/' + ($scope.collect.ProcessTime.getMonth() + 1) + '/' + $scope.collect.ProcessTime.getDate();
            }
    		//ProcessUserID
    		if(!$scope.collect.ProcessUserID){
                $ionicLoading.show({
                    template: '请输入执行人',
                    duration: 1000
                });
                return false;
            }
    		//ContactTelNo
    		if(!$scope.collect.ContactTelNo || $scope.collect.ContactTelNo.length <= 8){
                $ionicLoading.show({
                    template: '联系电话格式不正确',
                    duration: 1000
                });
                return false;
            }

            if(!$scope.collect.RepayAmount) {
                // 未填写时不校验
            } else {
                if (isNaN($scope.collect.RepayAmount)) {
                    $ionicLoading.show({
                        template: '还款金额填写错误',
                        duration: 1000
                    });
                    return false;
                }
            }

    		saveRecord($scope.collect);
    	};

        // 保存详情
    	var saveRecord = function(data) {
            $scope.collect.SerialNo = $scope.SerialNo;//催收记录流水号
            $scope.collect.TaskSerialNo = $scope.TaskSerialNo;//催收任务流水号
            $scope.collect.InputUserId = AmApp.userId;
            $scope.collect.InputOrgId = AmApp.orgID;
            var date = new Date(); // 获取当前日期
            $scope.collect.InputDate = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();

    		runServiceWithSession($http, undefined, $ionicPopup, $state,
                    "saveNewCollectRecord", data,
                function (data, status) {
                    if(data.array[0].Flag === 'Y') {
    				    $ionicLoading.show({
                            template: '保存成功',
                            duration: 1000
                        });
                        if(data.array[0].Message) {
                            $scope.SerialNo = data.array[0].Message; // 设置记录流水号
                        }
                        $scope.$emit('to-parent-collectRecord-refresh'); // 新增完成刷新列表
    			    } else {
    				    $ionicLoading.show({
                            template: '保存失败',
                            duration: 1000
                        });
    			    }
                }
            );
    	};

        // 加载Code
    	var loadCodeItems = function() {
    		// 催收方式(CollectMethod2:1,电话催收,2,人工催收)
    		runServiceWithSession($http, undefined, $ionicPopup, $state,
                    "getCodeItems", {CodeNo: 'CollectMethod2'}, function (data, status) {
                    	$scope.CollectMethods = data.array;
                    });
    		
    		// 逾期原因
    		runServiceWithSession($http, undefined, $ionicPopup, $state,
                    "getCodeItems", {CodeNo: 'CollectionCustomerReason'}, function (data, status) {
                    	$scope.ExplanAtionCodes = data.array;
                    });
    		
    		// 还款意愿
    		runServiceWithSession($http, undefined, $ionicPopup, $state,
                    "getCodeItems", {CodeNo: 'PayDesire'}, function (data, status) {
                    	$scope.PayDesires = data.array;
                    });
    		
    		// 还款能力 
    		runServiceWithSession($http, undefined, $ionicPopup, $state,
                    "getCodeItems", {CodeNo: 'PayBility'}, function (data, status) {
                    	$scope.PayAbilitys = data.array;
                    });
    	};

        // 新增初始化
        $scope.$on('to-init-addCollectRecord', function(e, data) {
            $scope.SerialNo = '';
    		$scope.TaskSerialNo = data.TaskSerialNo;
    		$scope.CustomerID = data.CustomerID;
            $scope.IsDetailView = data.IsDetailView;
            $scope.IsRelative = data.IsRelative;
			
    		$scope.collect = {};
            // 催收执行人初始化
            $scope.collect.ProcessUserID = AmApp.userID;
			$scope.collect.ProcessUserName = AmApp.userName;
			/*$scope.collect.ContactMethodName=AmApp.ContactMethodName;
            $scope.collect.COLLECTIONMETHOD=AmApp.COLLECTIONMETHOD;*/

    		loadCodeItems();
    	});

        // 详情初始化
        $scope.$on('to-init-CollectRecordDetail', function(e, data) {
            $scope.SerialNo = data.SerialNo;
            $scope.TaskSerialNo = data.TaskSerialNo;
            $scope.IsDetailView = data.IsDetailView;
            $scope.IsRelative = data.IsRelative;

            runServiceWithSession($http, undefined, $ionicPopup, $state,
                "CollectRecordDetail", {
                    SerialNo: $scope.SerialNo,
                    TaskSerialNo: $scope.TaskSerialNo
                }, function (data, status) {
                    $scope.collect = data.array[0];

                    if(data.array[0]){
                        $scope.noData = false;
                    }else {
                        $scope.noData = true;
                    }
                    $scope.collect.ProcessTime = new Date($scope.collect.ProcessDate);
                    appIonicLoading.hide();
                }
            );
            loadCodeItems();
        });

        // 联系人，联系电话
        $scope.$on('to-selectedContactor-sure', function(e, data) {
            $scope.collect.ContactorName = data.ContactorName;
            $scope.collect.ContactTelNo = data.TelePhone;
        });

        // 选择联系人Modal
        $ionicModal.fromTemplateUrl('templates/collectManagement/selContactorName-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.selContactorNameModal = modal;
        });

        // 选择催收执行人Modal
        $ionicModal.fromTemplateUrl('templates/collectManagement/selProcessUser-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.selProcessUsermodal = modal;
        });

        // 弹出选择联系人窗口
        $scope.selectContactorName = function() {
            if($scope.IsRelative === '1') {
                return ;
            }
            $scope.selContactorNameModal.show();
            
            $scope.$broadcast('to-SelectContactor',{CustomerID: $scope.CustomerID});
        };

        // 弹出催收执行人选择对话框
        $scope.selProcessUser = function() {
            if($scope.IsRelative === '1') {
                return ;
            }

            $scope.ProcessUsers = [];
            $scope.selProcessUsermodal.show();
            paging.init($scope, pageSize, 1, loadData);
            $scope.refresh();
        };

        // 加载催收执行人列表
        var loadData = function($ionicLoading) {
            $scope.noProcessData = false;
            runServiceWithSession($http, undefined, $ionicPopup, $state,
                'SelProcessUser', {
                    UserId: AmApp.userId,
                    OrgId: AmApp.orgID,
                    pageNo: $scope.pageNo,
                    pageSize: pageSize
                }, function(data, status) {
                    if(data.array.length == 0) {
                        $scope.noProcessData = true;
                    } else {
                        $scope.noProcessData = false;
                    }
                    data.array.forEach(function (i) {
                        $scope.ProcessUsers.push(i);
                    });
                    appIonicLoading.hide();
                    $scope.loadingMore = false;
                    $scope.hasMore = (($scope.pageNo - 1) * pageSize + data["array"].length < data.totalCount);
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
        };

        // 选中行
        $scope.chooceUser = function(index, obj) {
            $scope.selectedRow = index; // 选中改变颜色
            $scope.ProcessUser = obj;
        };

        // 确定选择
        $scope.closeSelUserModal = function() {
            $scope.selProcessUsermodal.hide();

            $scope.collect.ProcessUserID = $scope.ProcessUser.UserId;
            $scope.collect.ProcessUserName = $scope.ProcessUser.UserName;
            /*$scope.collect.ContactMethodName=$scope.ProcessUser.ContactMethodName;
            $scope.collect.COLLECTIONMETHOD = $scope.ProcessUser.COLLECTIONMETHOD;*/
        };
    })
    
    //选择催收联系人
    .controller('SelectContactorController', function ($scope, $http, $ionicLoading, $ionicPopup, $state, paging) {
    	var pageSize = 5;
    	$scope.CustomerID = '';
    	$scope.CustomerName = '';
    	$scope.TelePhone = '';
    	var loadData = function ($ionicLoading) {
            runServiceWithSession($http, undefined, $ionicPopup, $state,
                "selectContactorList", {
            		CustomerID: $scope.CustomerID,
                    PageSize: pageSize,
                    PageNo: $scope.pageNo
                }, function (data, status) {
                    //$scope.items = [];
                    data.array.forEach(function (i) {
                        $scope.items.push(i);
                    });
                    $scope.loadingMore = false;
                    if ($scope.items.length > 0) {
                        $scope.noData = false;
                    } else {
                        $scope.noData = true;
                    }
                    appIonicLoading.hide();
                    $scope.SearchKey = '';
                    $scope.hasMore = (($scope.pageNo - 1) * pageSize + data["array"].length < data.totalCount);
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
        };
        paging.init($scope, pageSize, 1, loadData);

        // 初始化催收联系人列表
        $scope.$on('to-SelectContactor', function(e, data) {
        	$scope.pageNo = 1;
            $scope.items = [];
        	$scope.CustomerID = data.CustomerID;
        	
        	paging.init($scope, pageSize, 1, loadData);
//        	$scope.refresh();
        });
        
        $scope.chooceContactorRow = function(index, obj) {
        	$scope.selectedRow = index; // 选择颜色变化
        	$scope.CustomerName = obj.CustomerName;
        	$scope.TelePhone = obj.TelePhone;
        };

        // 确定选择
        $scope.selectContactor = function() {
        	$scope.$broadcast('to-selectedContactor-sure',{
        		CustomerName: $scope.CustomerName,
        		TelePhone: $scope.TelePhone
        	});
        };
    })

    // 承诺还款列表
    .controller('CollectRepayListController', function ($ionicModal, $scope, $http, $ionicPopup, $state, paging, $timeout, $ionicLoading) {
        $scope.TaskSerialNo = ''; // 催收任务编号
        $scope.IsRelative = '';
        $scope.repayData = {};
        var pageSize = 10;
        $scope.items = [];

        // 加载承诺还款列表
        var loadData = function ($ionicLoading) {
            runServiceWithSession($http, undefined, $ionicPopup, $state,
                "CollectRepayList", {
                    TaskSerialNo: $scope.TaskSerialNo,
                    PageSize: pageSize,
                    PageNo: $scope.pageNo
                }, function (data, status) {
                    //$scope.items = [];
                    if(data.array[0]) {
                        data.array.forEach(function (item) {
                            $scope.items.push(item);
                        });
                        $scope.selectedRow = 0;
                    }
                    if(data.array[0]){
                        $scope.noData = false;
                    }else {
                        $scope.noData = true;
                    }
                    $scope.loadingMore = false;
                    appIonicLoading.hide();
                    $scope.hasMore = (($scope.pageNo - 1) * pageSize + data["array"].length < data.totalCount);
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                }
            );
        };

        // 承诺还款-可编辑窗口
        $ionicModal.fromTemplateUrl('templates/collectManagement/RepayRecordDetail-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.RepayRecordModal = modal;
        });

        // 选中行,查看详情
        $scope.selectRepayRecord = function(index, obj) {
            $scope.selectedRow = index; // 改变颜色

            if($scope.IsRelative === '0') {
                $scope.repayData = obj;
                $scope.repayData.RepayTime = new Date($scope.repayData.RepayDate);
                $scope.RepayRecordModal.show();
            }
        };

        // 长按删除
        $scope.holdDeleteRecord = function(obj) {
            if($scope.IsRelative === '1') { // 已完成-不可删除
                return ;
            }
            var confirmPopup = $ionicPopup.confirm({
                title: '<strong>删除记录</strong>',
                template: '是否删除？',
                okText: '确定',
                cancelText: '取消'
            });
            confirmPopup.then(function (res) {
                if (res) {
                    runServiceWithSession($http, undefined, $ionicPopup, $state,
                        "deleteRepayRecord", {
                            SerialNo: obj.SerialNo
                        }, function (data, status) {
                            if(data.array[0].Flag === 'Y') {
                                $ionicLoading.show({
                                    template: '删除成功',
                                    duration: 1000
                                });
                            } else {
                                $ionicLoading.show({
                                    template: '未删除该记录',
                                    duration: 1000
                                });
                            }
                        }
                    );
                    paging.init($scope, pageSize, 1, loadData);
                }
            });
        };

        // 新增承诺还款记录
        $scope.addCollectRepay = function() {
            $scope.repayData = {};
            $scope.repayData.TaskSerialNo = $scope.TaskSerialNo;
            $scope.RepayRecordModal.show();
        };

        // 确定
        $scope.saveRepay = function() {
            if(isNaN($scope.repayData.RepayAmount)) {
                $ionicLoading.show({
                    template: '承诺还款金额格式错误',
                    duration: 1000
                });
                return ;
            }
            if(!$scope.repayData.RepayTime) {
                $ionicLoading.show({
                    template: '请输入承诺还款日期',
                    duration: 1000
                });
                return ;
            }
            $scope.repayData.RepayDate = $scope.repayData.RepayTime.getFullYear() + '/' + ($scope.repayData.RepayTime.getMonth() + 1) + '/' + $scope.repayData.RepayTime.getDate();

            // 保存数据
            runServiceWithSession($http, undefined, $ionicPopup, $state,
                "SaveRepayDetail", $scope.repayData, function (data, status) {
                    if(data.array[0].Flag === 'Y') {
                        $ionicLoading.show({
                            template: '保存成功',
                            duration: 1000
                        });
                    } else {
                        $ionicLoading.show({
                            template: '保存失败',
                            duration: 1000
                        });
                    }
                }
            );
            $scope.closeRepayDetailModal();
            paging.init($scope, pageSize, 1, loadData);
        };

        // 关闭对话框
        $scope.closeRepayDetailModal = function() {
            $scope.repayData = {};
            $scope.RepayRecordModal.hide();
        };

        // 初始化承诺还款列表
        $scope.$on('to-collectRepayList', function(e, data) {
            if(!data.SerialNo) {
                console.info("缺少参数【SerialNo】");
                return ;
            }
            $scope.TaskSerialNo = data.SerialNo;
            $scope.IsRelative = data.IsRelative;
            $scope.items = [];
            $scope.noData = false;

            paging.init($scope, pageSize, 1, loadData);
        });
    })

    // 影像采集
    .controller('CollectAudioController', function ($ionicModal, $scope, $http, $ionicPopup, $state, paging, $timeout, $ionicLoading) {
        $scope.TaskSerialNo = '';

        // 初始化
        $scope.$on('to-init-CollectAudioRecord', function(e, data) {
            $scope.TaskSerialNo = data.SerialNo;
        });
    })
;
