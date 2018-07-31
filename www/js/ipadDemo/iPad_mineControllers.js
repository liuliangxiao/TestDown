/**
 * Created by laker on 2016/12/12.
 */
angular
    .module('com.amarsoft.mobile.controllers.iPad_mine', [])
    .controller('myForiPadController', function ($scope, $http, $ionicLoading, $ionicPopup, $state, basePage, $rootScope) {


        if ($rootScope.lastMyIndex == '' || $rootScope.lastMyIndex == null || $rootScope.lastMyIndex == undefined) {
            $state.go('logsForiPad');
        } else {
            $state.go($rootScope.lastMyIndex);
        }

        //just for test

        basePage.init($scope);
    })

    .controller('myAccountController', function ($scope, $http, $ionicLoading, $ionicPopup, $state, basePage, $rootScope) {
        $scope.mycount = {
            userName: '',
            orgName: '',
            newsCount: ''
        };

        var loadData = function ($ionicLoading) {
            runServiceWithSession(
                $http,
                $ionicLoading,
                $ionicPopup,
                $state,
                "myControl",   //获取总行通知条数
                {UserId: AmApp.userID},
                function (data, status) {
                    $scope.mycount = {
                        userName: data["array"][0].UserName,
                        orgName: data["array"][0].OrgName,
                        newsCount: data["array"][0].NewsCount
                    };

                });
        };

        $scope.gotoLogs = function () {
            $state.go('logsForiPad');
            $rootScope.lastMyIndex = 'logsForiPad';
        };

        $scope.gotoNotice = function () {
            $state.go('noticeForiPad');
            $rootScope.lastMyIndex = 'noticeForiPad';
        };

        basePage.init($scope, loadData);
    })


    .controller('logsForiPadController', function ($scope, $http, $ionicLoading, $ionicPopup, $state, basePage, $rootScope) {

        $scope.logsearch = {
            WorkBrief: ''
        };
        $scope.items = [];
        var loadData = function ($ionicLoading) {
            runServiceWithSession(
                $http,
                $ionicLoading,
                $ionicPopup,
                $state,
                "checklogs",   //获取工作日志列表
                {
                    InputUserId: AmApp.userID,
                    WorkBrief: $scope.logsearch.WorkBrief
                },
                function (data, status) {
                    if (data["array"].length == 0) {
                        $scope.noData = true;
                    }
                    if (data["array"].length != 0) {
                        $scope.noData = false;
                    }
                    for (var k = 0; k < data["array"].length; k++)
                        $scope.items.push(data["array"][k])
                });

        };
        //点击查询按钮
        $scope.tologsSelect = function () {
            $scope.items = [];
            loadData();
        };
        //点击新增按钮
        $scope.gotologadd = function () {
            $state.go('logsAddForiPad');
        };
        //点击日志进入详情页面
        $scope.gotologbaseinfo = function (SerialNo) {
            $state.go('logsDetailForiPad', {
                SerialNo: SerialNo
            });
        };


        basePage.init($scope, loadData);
    })

    .controller('logsAddForiPadController', function ($scope, $http, $ionicLoading, $ionicPopup, $state, basePage, $timeout) {

        $scope.log = {
            InputUserId: '',
            InputOrgId: '',
            WorkContent: '',
            WorkType: "",
            InputDate: '',
            WorkBrief: ''

        };
        var getdate = function getdate() {
            var date = new Date();
            var mon = date.getMonth() + 1;         //getMonth()返回的是0-11，则需要加1
            if (mon <= 9) {                                     //如果小于9的话，则需要加上0
                mon = "0" + mon;
            }
            var day = date.getDate();                   //getdate()返回的是1-31，则不需要加1
            if (day <= 9) {                                     //如果小于9的话，则需要加上0
                day = "0" + day;
            }
            $scope.log.InputDate = date.getFullYear() + "/" + mon + "/" + day;
        }
        $scope.log.InputOrgId = AmApp.orgName;
        $scope.log.InputUserId = AmApp.userName;
        var loadData = function ($ionicLoading) {
            getdate();
            runServiceWithSession(
                $http,
                $ionicLoading,
                $ionicPopup,
                $state,
                'getWorkType',
                {'CodeNo': 'WorkType'},
                function (data, status) {
                    $scope.WorkType = data["array"];
                    $scope.ItemNo = data["array"][0].ItemNO;
                }
            )
        }
        var gotologs = function () {
            $state.go('logs');

        };

        $scope.dosave = function () {
            // $scope.log.WorkType=angular.element('#worktype');
            var myselect = document.getElementById("worktype");
            var index = myselect.selectedIndex
            $scope.log.WorkType = myselect.options[index].value.substring(7);
            $scope.log.InputUserId = AmApp.userID;
            runServiceWithSession(
                $http,
                $ionicLoading,
                $ionicPopup,
                $state,
                'addlogs',
                $scope.log,
                function (data, status) {
                    if (data.Flag == "Y") {
                        $ionicLoading.show({
                            template: "" +
                            "新增日志成功！",
                            duration: 1500
                        });
                        $timeout(function () {
                            $state.go("logsForiPad");
                            //$state.go('logsForiPad');
                        }, 1000)
                    } else {
                        $ionicLoading.show({
                            template: "" +
                            "新增失败稍后重试",
                            duration: 2000
                        });
                    }
                }
            )
        };

        basePage.init($scope, loadData);
    })

    .controller('logsDetailForiPadController', function ($scope, $http, $ionicLoading, $ionicPopup, $state, basePage, $stateParams, $timeout) {
        //定义一个ng-model绑定页面数据
        $scope.log = {
            InputUserId: '',
            InputOrgId: '',
            WorkContent: '',
            WorkType: '',
            InputDate: '',
            WorkBrief: '',
            SerialNo: ''
        };
        $scope.itemNo = [];
        var SerialNo = $stateParams.SerialNo;
        var loadData = function ($ionicLoading) {
            runServiceWithSession(
                $http,
                $ionicLoading,
                $ionicPopup,
                $state,
                "checklogInfo",
                {"SerialNo": SerialNo},
                function (data, status) {
                    $scope.log.InputDate = data.InputDate;
                    $scope.log.InputOrgId = AmApp.orgName;
                    $scope.log.InputUserId = AmApp.userName;
                    $scope.log.WorkBrief = data.WorkBrief;
                    $scope.log.WorkContent = data.WorkContent;
                    $scope.itemNo = data.WorkType;
                });
            getWorkType();
        };
        //初始化页面时，加载工作类型的下拉菜单
        var getWorkType = function ($ionicLoading) {
            runServiceWithSession(
                $http,
                $ionicLoading,
                $ionicPopup,
                $state,
                'getWorkType',
                {'CodeNo': 'WorkType'},
                function (data, status) {
                    $scope.WorkType = data["array"];
                    data["array"][0].ItemNO = $scope.itemNo;
                }
            )
        }
        //点击保存按钮，修改日志
        $scope.dosave = function () {
            $scope.log.InputUserId = AmApp.userID;
            //获取页面上SELECT框的值
            var myselect = document.getElementById("worktype");
            var index = myselect.selectedIndex;
            $scope.log.WorkType = myselect.options[index].value.substring(7);
            $scope.log.SerialNo = SerialNo;
            runServiceWithSession(
                $http,
                $ionicLoading,
                $ionicPopup,
                $state,
                'addlogs',
                $scope.log,
                function (data, status) {
                    if (data.Flag == "Y") {
                        $ionicLoading.show({
                            template: "修改日志成功！",
                            duration: 1000
                        });
                        $timeout(function () {
                            $state.go("logsForiPad");
                        }, 1000)
                    } else {
                        $ionicLoading.show({
                            template: "修改失败稍后重试",
                            duration: 1500
                        });
                    }
                }
            );
        };

        $scope.dodelete = function () {
            //添加ALERT框进行确认判断
            var confirmPopup = $ionicPopup.confirm({
                title: '删除日志',
                template: '你确定要将该日志删除？',
                okText: '确定',
                cancelText: '取消'
            });
            confirmPopup.then(function (res) {
                if (res) {
                    runServiceWithSession(
                        $http,
                        $ionicLoading,
                        $ionicPopup,
                        $state,
                        'deletelog',
                        {"SerialNo": SerialNo},
                        function (result, status) {
                            if (result.Flag == "Y") {
                                $ionicLoading.show({
                                    template: "删除日志成功！",
                                    duration: 1000
                                });
                                $timeout(function () {
                                    $state.go("logsForiPad");
                                }, 1000)
                            } else {
                                $ionicLoading.show({
                                    template: "删除失败稍后重试",
                                    duration: 1500
                                });
                                $timeout(function () {
                                    $state.go("logsForiPad");
                                }, 1000);
                                return false;
                            }
                        }
                    );

                } else {

                }

            });

        };

        basePage.init($scope, loadData);
    })

    .controller('noticeForiPadController', function ($scope, $http, $ionicLoading, $ionicPopup, $state, paging, $rootScope) {

        var iPageSize = 8;
        var loadData = function ($ionicLoading) {
            runServiceWithSession(
                $http,
                $ionicLoading,
                $ionicPopup,
                $state,
                "notice",
                {
                    UserId: AmApp.userID,
                    pageSize: iPageSize,
                    pageNo: $scope.pageNo,
                    latesDate: $scope.latesDate
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
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
        };
        $scope.gotoNoticeDetail = function (boardNo) {
            //$state.go('noticeDetail', {
            //    boardNo: boardNo
            //});
            $state.go('noticeDetailForiPad', {
                boardNo: boardNo
            });
        };
        paging.init($scope, iPageSize, 1, loadData);
    })

    .controller('noticeDetailForiPadController', function ($scope, $http, $ionicLoading, $ionicPopup, $state, basePage, $stateParams) {
        $scope.items = [];
        $scope.boardNo = $stateParams.boardNo;
        runServiceWithSession($http, $ionicLoading, $ionicPopup,
            $state, "noticeDetail", {
                boardNo: $scope.boardNo
            }, function (data, status) {
                $scope.notice = data["array"][0];
                for (var k = 1; k < data["array"].length; k++) {
                    $scope.items.push(data["array"][k]);
                }
            });
        $scope.donwloadDoc = function (item) {
            appIonicLoading.show({
                template: '正在加载中',
                animation: 'fade-in',
                showBackdrop: true,
                duration: 60000
            });
            runServiceWithSession($http, $ionicLoading, $ionicPopup,
                $state, "donwloadDoc", item,
                function (data, status) {
                    $scope.docUrl = encodeURI(AmApp.config.ServiceRealRootPath + "/AttachView?" + "docNo=" + item.DocNo + "&attachmentNo=" + item.AttachmentNo + "&fileName=" + item.FileName + "&FullPath=" + item.FullPath);
                    if (typeof (Download) == 'object') {
                        var arr = [$scope.docUrl, item.FileName];

                        window.download(arr, function (msg) {
                            appIonicLoading.hide();
                        }, function (err) {
                            appIonicLoading.hide();
                        });
                    } else {
                        appIonicLoading.hide();
                        window.open($scope.docUrl);
                    }

                });
        };
        basePage.init($scope);
    })