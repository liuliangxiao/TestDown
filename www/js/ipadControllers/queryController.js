/**
 * Created by amarsoft on 16-11-30.
 */
angular.module('com.amarsoft.mobile.controllers.ipadquery', [])


    .controller('parentController', function ($scope, $state, $ionicPopup, $ionicLoading, $timeout,
                                              $http, basePage) {
        $scope.info = {show: true};

        /* 查询个人客户信息 */
        $scope.IndCustomerQuery = function () {
            $state.go("ipadindquery");
        };
        /* 查询公司客户信息 */
        $scope.EntCustomerQuery = function () {
            $state.go("ipadentquery");
        };
        /* 查询信用等级评估信息 */
        $scope.CredDegreeQuery = function () {
            $state.go("ipadcretquery");
        };
        /* 查询申请信息 */
        $scope.ApplyInfoQuery = function () {
            $state.go("ipadapplyquery");
        };
        /* 查询业务合同信息 */
        $scope.ContractQuery = function () {
            $state.go("ipadcontractquery");
        };
        /* 查询担保合同信息 */
        $scope.GuarantyQuery = function () {
            $state.go("ipadguarantyquery");
        };

        $scope.footActiveIndex = 1;

        basePage.init($scope);
    })

    .controller('parentEntController', function ($scope, $rootScope, $ionicLoading, $ionicPopup, $http, $state, basePage) {


        $scope.$on('to-parent', function (e, d) {

            $scope.$broadcast('to-child-list', d);
        })

        $scope.$on('to-parent-list', function (e, d) {

            $scope.$broadcast('to-child-detail', d);
        })

        $rootScope.info = {show: true, noData: true};

        $scope.showSearchBar = function () {
            // $(".searchBar").slideToggle("slow");

            if ($rootScope.info.show) {
                // $(".searchBar").slideUp("slow");
                // $(".searchBar").hide(1000);
                $rootScope.info.show = false;
            } else {
                // $(".searchBar").slideDown("slow");
                // $(".searchBar").show(1000);
                $rootScope.info.show = true;
            }
        }

    })

    .controller('searchEntController', function ($scope, $rootScope, $ionicLoading, $ionicPopup, $http, $state, basePage) {

        $scope.bank_select = {
            codes: ''
        };

        $scope.bank_select.bank = '';

        var selectBank = function () {
            runServiceWithSession($http, $ionicLoading,
                $ionicPopup, $state, "bank", {}, function (data,
                                                           status) {
                    $scope.bank_select.codes = data["array"];
                    $scope.bank_select.bank = AmApp.orgID;
                });
        };

        var loadData = function () {
            $scope.fail_page = false;
            $scope.items = [];
            $scope.pageNo = 0;
            $scope.placeHolder = {
                customer: "客户编号",
                cert: "证件号码"
            };
        };


        $scope.query = {
            customerId: "",
            customerName: "",
            certID: ""
        };
        $scope.clearData = function () {
            $scope.query = {
                customerId: "",
                customerName: "",
                certID: ""
            };
            $scope.bank_select.bank = "";
        }
        $scope.searchinfo = function () {
            if ($scope.query.customerId == ''
                && $scope.query.customerName == ''
                && $scope.query.certID == '') {
                $ionicLoading.show({
                    template: "请输入至少一个查询条件！",
                    duration: 2000
                });
                return false;
            }

            if ($scope.bank_select.bank == ''
                || $scope.bank_select.bank == null) {
                $ionicLoading.show({
                    template: "请选择机构类型！",
                    duration: 2000
                });
                return false;
            }
            $scope.info.show = false;
            $scope.pageNo = 1;
            $scope.hasMore = false;
            // queryData.call(this, $ionicLoading);
            $scope.query.bank = $scope.bank_select.bank;
            $scope.$emit('to-parent', $scope.query);
        };

        basePage.init($scope, loadData);
        selectBank();
    })
    .controller('listEntController', function ($scope, $rootScope, $ionicLoading, $ionicPopup, $http, $state, basePage, paging) {
        $scope.info = {noData: true};
        $scope.$on('to-child-list', function (e, data) {
            $scope.query = data;
            $scope.items = [];
            $scope.pageNo = 0;
            var iPageSize = 8;
            var loadData = function () {
                runServiceWithSession(
                    $http,
                    undefined,
                    $ionicPopup,
                    $state,
                    "entquery",
                    {
                        CustomerType: "Ent",
                        CustomerId: $scope.query.customerId,
                        CustomerName: $scope.query.customerName,
                        CertId: $scope.query.certId,
                        InputOrgId: $scope.query.bank,
                        PageSize: iPageSize,
                        PageNo: $scope.pageNo
                    },
                    function (data, status) {
                        for (var k = 0; k < data["array"].length; k++) {
                            $scope.items.push(data["array"][k]);
                        }

                        if ($scope.items.length) {
                            $scope.info.noData = false;
                        } else {
                            $scope.info.noData = true;
                            appIonicLoading.hide();
                        }

                        $scope.hasMore = (($scope.pageNo - 1)
                        * iPageSize + data["array"].length < data.totalCount);
                        $scope.loadingMore = false;
                        if ($scope.pageNo == 1) {
                            $scope.$emit('to-parent-list', data["array"][0]);
                            $scope.selectedRow = 0;
                        }
                        $scope.$broadcast('scroll.refreshComplete');
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    });
            };
            paging.init($scope, iPageSize, 1, loadData, true);
            appIonicLoading.show({
                template: '正在加载中',
                animation: 'fade-in',
                showBackdrop: true,
                duration: 30000
            });
            $scope.refresh();
        })

        $scope.goDetail = function (item, $index) {
            $scope.selectedRow = $index;
            appIonicLoading.show({
                template: '正在加载中',
                animation: 'fade-in',
                showBackdrop: true,
                duration: 30000
            });
            $scope.$emit('to-parent-list', item);
        }

    })
    /************************************************个人信息查询********************************************************/
    .controller('parentIndController', function ($scope, $rootScope, $ionicLoading, $ionicPopup, $http, $state, basePage) {

        $scope.$on('to-parent', function (e, d) {

            $scope.$broadcast('to-child-list', d);
        })

        $scope.$on('to-parent-list', function (e, d) {

            $scope.$broadcast('to-child-detail', d);
        })
        $rootScope.info = {show: true, noData: true};


        $scope.showSearchBar = function () {
            if ($rootScope.info.show) {
                $rootScope.info.show = false;
            } else {
                $rootScope.info.show = true;
            }
        }

    })

    .controller('searchIndController', function ($scope, $rootScope, $ionicLoading, $ionicPopup, $http, $state, basePage) {

        $scope.bank_select = {
            codes: ''
        };

        $scope.bank_select.bank = '';

        var selectBank = function () {
            runServiceWithSession($http, $ionicLoading,
                $ionicPopup, $state, "bank", {}, function (data, status) {
                    $scope.bank_select.codes = data["array"];
                    $scope.bank_select.bank = AmApp.orgID;
                });
        };

        var loadData = function () {
            $scope.fail_page = false;
            $scope.items = [];
            $scope.pageNo = 0;
            $scope.placeHolder = {
                customer: "客户编号",
                cert: "证件号码"
            };
        };


        $scope.query = {
            customerId: "",
            customerName: "",
            certID: ""
        };

        $scope.clearData = function () {
            $scope.query = {
                customerId: "",
                customerName: "",
                certID: ""
            };
            $scope.bank_select.bank = "";
        }

        $scope.searchinfo = function () {

            if ($scope.query.customerId == ''
                && $scope.query.customerName == ''
                && $scope.query.certID == '') {
                $ionicLoading.show({
                    template: "请输入至少一个查询条件！",
                    duration: 2000
                });
                return false;
            }

            if ($scope.bank_select.bank == ''
                || $scope.bank_select.bank == null) {
                $ionicLoading.show({
                    template: "请选择机构类型！",
                    duration: 2000
                });
                return false;
            }
            $scope.info.show = false;

            $scope.pageNo = 1;
            $scope.hasMore = false;
            $scope.query.bank = $scope.bank_select.bank;
            $scope.$emit('to-parent', $scope.query);
        };

        basePage.init($scope, loadData);
        selectBank();
    })
    .controller('listIndController', function ($scope, $rootScope, $ionicLoading, $ionicPopup, $http, $state, basePage, paging) {


        $scope.$on('to-child-list', function (e, data) {

            $scope.query = data;
            $scope.items = [];
            $scope.pageNo = 0;
            var iPageSize = 8;

            var loadData = function () {
                runServiceWithSession(
                    $http,
                    undefined,
                    $ionicPopup,
                    $state,
                    "indquery",
                    {
                        CustomerType: "Ind",
                        CustomerId: $scope.query.customerId,
                        CustomerName: $scope.query.customerName,
                        CertId: $scope.query.certId,
                        InputOrgId: $scope.query.bank,
                        PageSize: iPageSize,
                        PageNo: $scope.pageNo
                    },
                    function (data, status) {
                        for (var k = 0; k < data["array"].length; k++) {
                            $scope.items.push(data["array"][k]);
                        }
                        if ($scope.items.length) {
                            $scope.info.noData = false;
                        } else {
                            $scope.info.noData = true;
                            appIonicLoading.hide();
                        }
                        $scope.hasMore = (($scope.pageNo - 1)
                        * iPageSize + data["array"].length < data.totalCount);
                        $scope.loadingMore = false;
                        if ($scope.pageNo == 1) {
                            $scope.$emit('to-parent-list', data["array"][0]);
                            $scope.selectedRow = 0;
                        }
                        $scope.$broadcast('scroll.refreshComplete');
                        $scope
                            .$broadcast('scroll.infiniteScrollComplete');
                    });
            };
            paging.init($scope, iPageSize, 1, loadData, true);
            appIonicLoading.show({
                template: '正在加载中',
                animation: 'fade-in',
                showBackdrop: true,
                duration: 30000
            });
            $scope.refresh();

        })

        $scope.goDetail = function (item, index) {
            $scope.selectedRow = index;
            appIonicLoading.show({
                template: '正在加载中',
                animation: 'fade-in',
                showBackdrop: true,
                duration: 30000
            });
            $scope.$emit('to-parent-list', item);
        }

    })


    .controller('detailController', function ($scope, $rootScope, $ionicLoading, $ionicPopup, $http, $state, basePage, $ionicScrollDelegate) {
        $scope.info.noData = true;

        $scope.$on('to-child-detail', function (e, data) {
            $ionicScrollDelegate.scrollTop();
            if (data) {
                $scope.info.noData = false;
                $scope.details = [];
                runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
                    "customerInfo", {
                        customerID: data.CustomerId
                    }, function (data, status) {
                        for (var i = 0; i < data["array"].length; i++) {
                            //增加参数，是否展示，页面载入时均展示
                            data["array"][i]['showGroup'] = true;
                            $scope.details.push(data["array"][i]);
                        }
                        appIonicLoading.hide();
                    });
            } else {
                $scope.details = [];
                $scope.info.noData = true;
            }
        })

        $scope.showOrNot = function (item) {
            if (item.showGroup) {
                item.showGroup = false;
            } else {

                item.showGroup = true;

                setTimeout(function () {
                    $ionicScrollDelegate.$getByHandle("smallScroll").scrollBy(0, 10, true);

                }, 100);


            }
        };
    })

    /*************************************************信用等级评估********************************************************/
    .controller('parentCretController', function ($scope, $rootScope, $ionicLoading, $ionicPopup, $http, $state, basePage) {
        $scope.showDetail = {show: false};
        $scope.$on('to-parent', function (e, d) {
            $scope.$broadcast('to-child-list', d);
        })
        $scope.selectTab0 = true;
        $rootScope.info = {show: true, noData: true};
        $scope.$on('to-parent-list', function (e, d) {
            $scope.showDetail.show = true;
            $scope.selectTab0 = true;
            $scope.selectTab1 = false;

            if (d) {
                $rootScope.info.noData = false;
                $scope.$broadcast('to-child-cret-detail', d);
                $rootScope.evaluateDetailCount = 0;//记录获取详情交易完成的数量
            } else {
                $rootScope.info.noData = true;
                $scope.showDetail.show = false;
                appIonicLoading.hide();

            }
        })
        $scope.selectTask = function (tabIndex) {
            if (tabIndex == '0') {
                $scope.selectTab0 = true;
                $scope.selectTab1 = false;
            } else {
                $scope.selectTab0 = false;
                $scope.selectTab1 = true;
            }
        }

        $scope.showSearchBar = function () {
            if ($rootScope.info.show) {
                $rootScope.info.show = false;
            } else {
                $rootScope.info.show = true;
            }
        }

    })
    .controller('searchCretController', function ($scope, $rootScope, $ionicLoading, $ionicPopup, $http, $state, basePage) {
        $scope.bank_select = {
            codes: ''
        };

        $scope.bank_select.bank = '';

        var selectBank = function () {
            runServiceWithSession($http, $ionicLoading,
                $ionicPopup, $state, "bank", {}, function (data, status) {
                    $scope.bank_select.codes = data["array"];
                    $scope.bank_select.bank = AmApp.orgID;
                });
        };

        var loadData = function () {
            $scope.fail_page = false;
            $scope.items = [];
            $scope.pageNo = 0;
            $scope.placeHolder = {
                customer: "客户编号",
                cert: "证件号码"
            };
        };

        $scope.query = {
            customerId: "",
            customerName: "",
            certID: ""
        };
        $scope.clearData = function () {
            $scope.query = {
                customerId: "",
                customerName: "",
                certID: ""
            };
            $scope.bank_select.bank = "";
        }
        $scope.searchinfo = function () {
            if ($scope.query.customerId == ''
                && $scope.query.customerName == ''
                && $scope.query.certID == '') {
                $ionicLoading.show({
                    template: "请输入至少一个查询条件！",
                    duration: 2000
                });
                return false;
            }

            if ($scope.bank_select.bank == ''
                || $scope.bank_select.bank == null) {
                $ionicLoading.show({
                    template: "请选择机构类型！",
                    duration: 2000
                });
                return false;
            }
            $scope.info.show = false;

            $scope.pageNo = 1;
            $scope.hasMore = false;
            $scope.query.bank = $scope.bank_select.bank;
            $scope.$emit('to-parent', $scope.query);

        };

        basePage.init($scope, loadData);
        selectBank();
    })

    .controller('listCretController', function ($scope, $rootScope, $ionicLoading, $ionicPopup, $http, $state, basePage, paging) {

        $scope.$on('to-child-list', function (e, data) {
            $scope.query = data;
            $scope.items = [];
            $scope.pageNo = 0;
            var iPageSize = 8;

            var loadData = function (ionicLoading) {

                runServiceWithSession(
                    $http,
                    ionicLoading,
                    $ionicPopup,
                    $state,
                    "creditdegreequery",
                    {
                        CustomerId: $scope.query.customerId,
                        CustomerName: $scope.query.customerName,
                        CertId: $scope.query.certId,
                        InputOrgId: $scope.query.bank,
                        PageSize: iPageSize,
                        PageNo: $scope.pageNo
                    },
                    function (data, status) {
                        for (var k = 0; k < data["array"].length; k++) {
                            if ((data["array"][k].CustomerType).indexOf("01")) {
                                data["array"][k].CustomerType = strEscape("&#xe671;");
                            } else if ((data["array"][k].CustomerType).indexOf("03")) {
                                data["array"][k].CustomerType = strEscape("&#xe687;");
                            }
                            $scope.items.push(data["array"][k]);
                        }

                        if ($scope.items.length) {
                            $scope.info.noData = false;
                        } else {
                            $scope.info.noData = true;
                            appIonicLoading.hide();
                        }

                        $scope.hasMore = (($scope.pageNo - 1)
                        * iPageSize + data["array"].length < data.totalCount);
                        $scope.loadingMore = false;
                        if ($scope.pageNo == 1) {
                            $scope.$emit('to-parent-list', data["array"][0]);
                            $scope.selectedRow = 0;
                        }
                        $scope.$broadcast('scroll.refreshComplete');
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    });
            };

            paging.init($scope, iPageSize, 1, loadData, true);
            appIonicLoading.show({
                template: '正在加载中',
                animation: 'fade-in',
                showBackdrop: true,
                duration: 30000
            });
            $scope.refresh();

        })


        $scope.goDetail = function (item, index) {
            $scope.selectedRow = index;
            appIonicLoading.show({
                template: '正在加载中',
                animation: 'fade-in',
                showBackdrop: true,
                duration: 30000
            });
            $scope.$emit('to-parent-list', item);
        }


    })
    .controller('detailEvaluateController', function ($scope, $rootScope, $ionicLoading, $ionicPopup, $http, $state, basePage) {
        $scope.info = {noData: true};
        $scope.$on('to-child-cret-detail', function (e, data) {
            $scope.data = data;
            $scope.items = [];
            if (data) {
                $scope.info.noData = false;
                basePage.init($scope, loadData);
            } else {
                $scope.info.noData = true;
            }

        })
        var loadData = function ($ionicLoading) {
            runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
                "evaluateApplyInfo", {
                    objectType: $scope.data.ObjectType,
                    serialNo: $scope.data.SerialNo,
                    objectNo: $scope.data.ObjectNo,
                    modelNo: null
                }, function (data, status) {
                    for (var i = 0; i < data["array"].length; i++) {
                        $scope.items.push(data["array"][i]);
                    }
                    $rootScope.evaluateDetailCount = $rootScope.evaluateDetailCount + 1;
                    if( $rootScope.evaluateDetailCount == 2){
                        appIonicLoading.hide();
                    }
                });
        }
    })

    .controller('detailOpinionController', function ($scope, $rootScope, $ionicLoading, $ionicPopup, $http, $state, basePage, $ionicScrollDelegate) {
        $scope.info = {noData: true};


        $scope.$on('to-child-cret-detail', function (e, data) {
            $scope.items = [];
            $scope.data = data;
            $ionicScrollDelegate.scrollTop();
            if (data) {
                $scope.info.noData = false;
                basePage.init($scope, loadData);
            } else {
                $scope.info.noData = true;
            }
        })
        var loadData = function () {
            runServiceWithSession($http, undefined, $ionicPopup, $state,
                "opinionInfo", {
                    serialNo: $scope.data.SerialNo,
                    objectType: $scope.data.ObjectType
                }, function (data, status) {
                    for (var i = 0; i < data["array"].length; i++) {
                        //增加参数，是否展示，页面载入时均展示
                        data["array"][i]['showGroup'] = true;
                        $scope.items.push(data["array"][i]);
                    }
                    $rootScope.evaluateDetailCount = $rootScope.evaluateDetailCount + 1;
                    if( $rootScope.evaluateDetailCount == 2){
                        appIonicLoading.hide();
                    }
                    if ($scope.items.length) {
                        $scope.noData = false;
                    } else {
                        $scope.noData = true;
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
    /*********************************************************申请信息查询********************************************************************/
    .controller('parentApplyController', function ($scope, $rootScope, $ionicLoading, $ionicPopup, $http, $state, basePage) {
        $scope.showDetail = {show: false};
        $scope.$on('to-parent', function (e, d) {
            $scope.$broadcast('to-child-list', d);
        })
        $scope.selectTab0 = true;
        $scope.$on('to-parent-list', function (e, d) {
            if (d) {
                $scope.info.noData = false;
                $scope.showDetail.show = true;
                $scope.selectTab0 = true;
                $scope.selectTab1 = false;
                $scope.selectTab2 = false;
                $scope.selectTab3 = false;
                $scope.selectTab4 = false;
                d.ObjectType = 'CreditApply';
                $rootScope.applyDetaiCount=0;//记录详情交易完成的数量
                $scope.$broadcast('to-child-cret-detail', d);
                $scope.$broadcast('to-applyinfo', {SerialNo: d.SerialNo, FTObjectType: d.ObjectType});

            } else {
                appIonicLoading.hide();
                $scope.showDetail.show = false;
                $scope.info.noData = true;
            }
        })
        $scope.selectTask = function (tabIndex) {
            if (tabIndex == '0') {
                $scope.selectTab0 = true;
                $scope.selectTab1 = false;
                $scope.selectTab1 = false;
                $scope.selectTab2 = false;
                $scope.selectTab3 = false;
                $scope.selectTab4 = false;
            } else if (tabIndex == '1') {
                $scope.selectTab0 = false;
                $scope.selectTab1 = true;
                $scope.selectTab2 = false;
                $scope.selectTab3 = false;
                $scope.selectTab4 = false;
            } else if (tabIndex == '2') {
                $scope.selectTab0 = false;
                $scope.selectTab1 = false;
                $scope.selectTab2 = true;
                $scope.selectTab3 = false;
                $scope.selectTab4 = false;
            } else if (tabIndex == '3') {
                $scope.selectTab0 = false;
                $scope.selectTab1 = false;
                $scope.selectTab2 = false;
                $scope.selectTab3 = true;
                $scope.selectTab4 = false;
            } else if (tabIndex == '4') {
                $scope.selectTab0 = false;
                $scope.selectTab1 = false;
                $scope.selectTab2 = false;
                $scope.selectTab3 = false;
                $scope.selectTab4 = true;
            }
        }

        $rootScope.info = {show: true, noData: true};
        $scope.showSearchBar = function () {
            if ($rootScope.info.show) {
                $rootScope.info.show = false;
            } else {
                $rootScope.info.show = true;
            }
        }
    })

    .controller('searchApplyController', function ($scope, $rootScope, $ionicLoading, $ionicPopup, $http, $state, basePage) {
        var iPageSize = 5;

        $scope.bank_select = {
            codes: ''
        };

        $scope.query = {
            customerId: "",
            customerName: "",
            serialNo: ""
        };
        $scope.bank_select.bank = '';

        var loadData = function () {

            $scope.fail_page = false;
            $scope.items = [];
            $scope.pageNo = 0;
        };

        var selectBank = function () {
            runServiceWithSession($http, $ionicLoading,
                $ionicPopup, $state, "bank", {}, function (data,
                                                           status) {
                    $scope.bank_select.codes = data["array"];
                    $scope.bank_select.bank = AmApp.orgID;
                });
        };
        $scope.clearData = function () {
            $scope.query = {
                customerId: "",
                customerName: "",
                certID: ""
            };
            $scope.bank_select.bank = "";
        }
        $scope.searchinfo = function () {
            if ($scope.query.customerId == ''
                && $scope.query.customerName == ''
                && $scope.query.certID == '') {
                $ionicLoading.show({
                    template: "请输入至少一个查询条件！",
                    duration: 2000
                });
                return false;
            }

            if ($scope.bank_select.bank == ''
                || $scope.bank_select.bank == null) {
                $ionicLoading.show({
                    template: "请选择机构类型！",
                    duration: 2000
                });
                return false;
            }
            $scope.info.show = false;

            $scope.pageNo = 1;
            $scope.hasMore = false;
            $scope.query.bank = $scope.bank_select.bank;
            $scope.$emit('to-parent', $scope.query);
        };

        selectBank();
    })

    .controller('listApplyController', function ($scope, $rootScope, $ionicLoading, $ionicPopup, $http, $state, basePage, paging) {
        $scope.info = {show: true, noData: true};
        $scope.$on('to-child-list', function (e, data) {
            $scope.query = data;
            $scope.items = [];
            $scope.pageNo = 0;

            var iPageSize = 8;
            var loadData = function (ionicLoading) {
                runServiceWithSession(
                    $http,
                    undefined,
                    $ionicPopup,
                    $state,
                    "applyinfoquery",
                    {
                        CustomerId: $scope.query.customerId,
                        CustomerName: $scope.query.customerName,
                        SerialNo: $scope.query.serialNo,
                        InputOrgId: $scope.query.bank,
                        PageSize: iPageSize,
                        PageNo: $scope.pageNo
                    },
                    function (data, status) {
                        for (var k = 0; k < data["array"].length; k++) {
                            data["array"][k].IconCode = strEscape(data["array"][k].IconCode);
                            $scope.items.push(data["array"][k]);
                        }

                        if ($scope.items.length) {
                            $scope.info.noData = false;
                        } else {
                            $scope.info.noData = true;
                            appIonicLoading.hide();
                        }

                        // 分页相关
                        $scope.hasMore = (($scope.pageNo - 1)
                        * iPageSize + data["array"].length < data.totalCount);
                        $scope.loadingMore = false;
                        if ($scope.pageNo == 1) {
                            $scope.$emit('to-parent-list', data["array"][0]);
                            $scope.selectedRow = 0;
                        }
                        $scope.$broadcast('scroll.refreshComplete');
                        $scope
                            .$broadcast('scroll.infiniteScrollComplete');
                    });
            };
            $scope.goDetail = function (item, index) {
                $scope.selectedRow = index;
                appIonicLoading.show({
                    template: '正在加载中',
                    animation: 'fade-in',
                    showBackdrop: true,
                    duration: 30000
                });
                $scope.$emit('to-parent-list', item);
            };
            paging.init($scope, iPageSize, 1, loadData, true);
            appIonicLoading.show({
                template: '正在加载中',
                animation: 'fade-in',
                showBackdrop: true,
                duration: 30000
            });
            $scope.refresh();
        })
    })
    .controller('detailApplyController',
        function ($scope, $rootScope, $state, $stateParams, $http, $ionicLoading, $ionicPopup, basePage, $ionicScrollDelegate) {
            $scope.items = [];

            $scope.$on('to-child-cret-detail', function (e, data) {
                $scope.items = [];
                $ionicScrollDelegate.scrollTop();

                if (data) {
                    $scope.info.noData = false;
                    $scope.SerialNo = data.SerialNo;
                    $scope.BusinessType = data.BusinessType;
                    $scope.CustomerID = data.CustomerId;
                    setTimeout(function () {
                        $scope.$apply(function () {
                            $scope.showContrFlag = data.showContrFlag;
                        });
                    }, 1);
                    basePage.init($scope, loadData);
                } else {
                    $scope.info.noData = true;
                }


            });

            var loadData = function ($ionicLoading) {
                runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
                    "applyInfo", {
                        serialNo: $scope.SerialNo,
                        businessType: $scope.BusinessType,
                        customerID: $scope.CustomerID
                    }, function (data, status) {
                        for (var i = 0; i < data["array"].length; i++) {
                            //增加参数，是否展示，页面载入时均展示
                            data["array"][i]['showGroup'] = true;
                            $scope.items.push(data["array"][i]);
                        }
                        $rootScope.applyDetaiCount= $rootScope.applyDetaiCount+1;
                        if($rootScope.applyDetaiCount == 5){
                            appIonicLoading.hide();
                        }
                        if ($scope.items.length > 0) {
                            $scope.noData = false;
                        } else {
                            $scope.noData = true;
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
    .controller('detailCustomerController',
        function ($scope,$rootScope, $state, $stateParams, $http, $ionicLoading, $ionicPopup, basePage, $ionicScrollDelegate) {

            $scope.items = [];
            $scope.$on('to-child-cret-detail', function (e, data) {
                $scope.items = [];
                $ionicScrollDelegate.scrollTop();
                if (data) {
                    $scope.info.noData = false;
                    $scope.SerialNo = data.SerialNo;
                    $scope.BusinessType = data.BusinessType;
                    $scope.CustomerID = data.CustomerId;
                    basePage.init($scope, loadData);
                } else {
                    $scope.info.noData = true;
                }


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

                        $rootScope.applyDetaiCount= $rootScope.applyDetaiCount+1;
                        if($rootScope.applyDetaiCount == 5){
                            appIonicLoading.hide();
                        }

                        if ($scope.items.length > 0) {
                            $scope.info.noData = false;
                        } else {
                            $scope.info.noData = true;
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

    //申请查询-审批意见
    .controller('creditOpinionController', function ($scope, $rootScope, $ionicLoading, $ionicPopup, $http, $state, basePage, $ionicScrollDelegate) {
        $scope.info = {noData: true};
        $scope.$on('to-child-cret-detail', function (e, data) {
            $scope.items = [];
            $scope.data = data;
            $ionicScrollDelegate.scrollTop();
            if (data) {
                $scope.info.noData = false;
                basePage.init($scope, loadData);
            } else {
                $scope.info.noData = true;
            }
        })
        var loadData = function () {
            runServiceWithSession($http, undefined, $ionicPopup, $state,
                "opinionInfo", {
                    serialNo: $scope.data.SerialNo,
                    objectType: $scope.data.ObjectType
                }, function (data, status) {
                    for (var i = 0; i < data["array"].length; i++) {
                        //增加参数，是否展示，页面载入时均展示
                        data["array"][i]['showGroup'] = true;
                        $scope.items.push(data["array"][i]);
                    }
                    $rootScope.applyDetaiCount= $rootScope.applyDetaiCount+1;
                    if($rootScope.applyDetaiCount == 5){
                        appIonicLoading.hide();
                    }
                    if ($scope.items.length > 0) {
                        $scope.info.noData = false;
                    } else {
                        $scope.info.noData = true;
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
    //调查报告
    .controller('detailSurveyReportController',
        function ($scope, $state, $stateParams, $http, $ionicLoading, $ionicPopup, $sce, basePage,$rootScope) {
            $scope.reportInfo = {};
            $scope.$on('to-child-cret-detail', function (e, data) {
                $scope.reportInfo = {};
                if (data) {
                    $scope.info.noData = false;
                    $scope.SerialNo = data.SerialNo;
                    $scope.BusinessType = data.BusinessType;
                    $scope.CustomerID = data.CustomerId;
                    $scope.FTObjectType = data.ObjectType;
                    basePage.init($scope, loadData);
                } else {
                    $scope.info.noData = true;
                }
            });

            var loadData = function ($ionicLoading) {
                runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
                    "surveyReport", {
                        objectNo: $scope.SerialNo,
                        objectType: $scope.FTObjectType
                    }, function (data, status) {
                        $scope.reportInfo = data;
                        //所谓sce即“Strict Contextual Escaping”的缩写。翻译成中文就是“严格的上下文模式”也可以理解为安全绑定吧
                        $scope.reportInfo.ReportData = $sce.trustAsHtml(data['ReportData']);
                        if (data['ReportDesc'] == 'EXIST') {
                            $scope.info.noData = false;
                        } else {
                            $scope.info.noData = true;
                        }
                        $rootScope.applyDetaiCount= $rootScope.applyDetaiCount+1;
                        if($rootScope.applyDetaiCount == 5){
                            appIonicLoading.hide();
                        }
                    });
            };
        })

    /*******************************************************业务合同************************************************************/
    .controller('parentContractController', function ($scope, $rootScope, $ionicLoading, $ionicPopup, $http, $state, basePage, paging) {
        $scope.$on('to-parent', function (e, d) {

            $scope.$broadcast('to-child-list', d);
        })

        $scope.$on('to-parent-list', function (e, d) {
            $scope.$broadcast('to-child-cret-detail', d);
        })

        $rootScope.info = {show: true};
        $scope.showSearchBar = function () {


            if ($rootScope.info.show) {
                $rootScope.info.show = false;
            } else {
                $rootScope.info.show = true;
            }
        }
    })
    .controller('searchContractController', function ($scope, $rootScope, $ionicLoading, $ionicPopup, $http, $state, basePage, paging, dynamicFilter, $ionicModal) {

        $scope.org_select = {
            codes: '',
            orgname: ''
        };
        /* 选择客户类型 */
        $scope.customertype_sel = {
            codes: '',
            typename: ''
        };
        /* 选择业务品种 */
        $rootScope.businesstype_sel = {
            typename: '',
            key: ''
        };
        $scope.query = {
            serialNo: "",
            customerName: "",
            businessType: "",
            businessSum: "",
            balance: "",
            putOutDate: "",
            maturity: "",
            manageUserID: ""
        };
        $scope.clearData = function () {
            $scope.query = {
                serialNo: "",
                customerName: ""
            };
            $rootScope.businesstype_sel = {
                typename: '',
                key: ''
            };
            $scope.org_select.orgname = "";
            $scope.customertype_sel.typename = "";

        }
        $scope.showFilter = false;

        var loadData = function () {
            $scope.fail_page = false;
            $scope.items = [];
            $scope.pageNo = 0;
        };
        $scope.selectBusinessType = function () {
            // $scope.showFilter = true;
            $ionicModal.fromTemplateUrl('templates/ipadQuery/contractModal.html', {
                scope: $scope,
                backdropClickToClose: false
            }).then(function (modal) {
                $scope.modal = modal;
                $scope.modal.show();
            });
        };

        $scope.contractConfirm = function () {
            $scope.modal.remove();
            var stringTemp = $scope.filter.confirm();
            $rootScope.businesstype_sel.typename = stringTemp.value;
            $rootScope.businesstype_sel.key = stringTemp.key;

        };
        $scope.contractCancel = function () {
            $scope.modal.remove()
        };

        /* 选择客户类型 */
        var selCustomerType = function () {
            runServiceWithSession(
                $http,
                $ionicLoading,
                $ionicPopup,
                $state,
                "customertype",
                {},
                function (data, status) {
                    $scope.customertype_sel.codes = data["array"];
                    $scope.customertype_sel.typename = data["array"][0].ItemNo;
                });
        };
        selCustomerType();

        /* 选择业务品种 */

        var selBusinessType = function () {
            runServiceWithSession($http, $ionicLoading,
                $ionicPopup, $state, "businessType", {},
                function (data, status) {
                    $scope.jsonDataTree = transData(
                        data["array"], 'TypeNo', 'pid',
                        'array');
                    var parentId = document
                        .getElementById("parent");
                    $scope.filter = {};
                    dynamicFilter
                        .init($scope, parentId, "filter",
                            $scope.jsonDataTree, true);
                });
        };
        selBusinessType();
        /* 选择管护机构 */
        var selectOrg = function () {
            runServiceWithSession($http, $ionicLoading,
                $ionicPopup, $state, "bank", {}, function (data,
                                                           status) {
                    $scope.org_select.codes = data["array"];
                    $scope.org_select.orgname = AmApp.orgID;
                });
        };
        selectOrg();

        $scope.searchinfo = function () {
            if ($scope.query.serialNo == ''
                && $scope.query.customerName == ''
                && $scope.businesstype_sel.key == ''
                && $scope.query.businessSum == ''
                && $scope.query.balance == ''
                && $scope.query.putOutDate == ''
                && $scope.query.maturity == ''
                && $scope.query.manageUserID == '') {
                $ionicLoading.show({
                    template: "请输入至少一个查询条件！",
                    duration: 2000
                });
                return false;
            }

            if ($scope.org_select.orgname == ''
                || $scope.org_select.orgname == null) {
                $ionicLoading.show({
                    template: "请选择机构类型！",
                    duration: 2000
                });
                return false;
            }
            $scope.info.show = false;
            $scope.pageNo = 1;

            $scope.query.manageOrgID = $scope.org_select.orgname;
            $scope.query.businessType = $scope.businesstype_sel.key;
            $scope.query.customerType = $scope.customertype_sel.typename;
            $scope.$emit('to-parent', $scope.query);
        }


        basePage.init($scope, loadData);
    })
    .controller('listContractController', function ($scope, $rootScope, $ionicLoading, $ionicPopup, $http, $state, basePage, paging) {
        var iPageSize = 8;
        $scope.info = {noData: true};
        $scope.$on('to-child-list', function (e, data) {
            $scope.query = data;
            $scope.items = [];
            $scope.pageNo = 0;
            paging.init($scope, iPageSize, 1, loadData, true);
            appIonicLoading.show({
                template: '正在加载中',
                animation: 'fade-in',
                showBackdrop: true,
                duration: 30000
            });
            $scope.refresh();

        });


        var loadData = function () {


            runServiceWithSession(
                $http,
                undefined,
                $ionicPopup,
                $state,
                "contractquery",
                {
                    SerialNo: $scope.query.serialNo,
                    CustomerName: $scope.query.customerName,
                    BusinessType: $scope.query.businessType,
                    BusinessSum: $scope.query.businessSum,
                    Balance: $scope.query.balance,
                    PutOutDate: $scope.query.putOutDate,
                    Maturity: $scope.query.putOutDate,
                    ManageOrgID: $scope.query.manageOrgID,
                    ManageUserID: $scope.query.manageUserID,
                    CustomerType: $scope.query.customerType,
                    PageSize: iPageSize,
                    PageNo: $scope.pageNo
                },
                function (data, status) {
                    for (var k = 0; k < data["array"].length; k++) {
                        data["array"][k].IconCode = strEscape(data["array"][k].IconCode);
                        $scope.items.push(data["array"][k]);
                    }

                    if ($scope.items.length) {
                        $scope.info.noData = false;
                    } else {
                        $scope.info.noData = true;
                        appIonicLoading.hide();
                    }

                    $scope.hasMore = (($scope.pageNo - 1)
                    * iPageSize + data["array"].length < data.totalCount);
                    $scope.loadingMore = false;
                    if ($scope.pageNo == 1) {
                        $scope.$emit('to-parent-list', data["array"][0]);
                        $scope.selectedRow = 0;
                    }
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope
                        .$broadcast('scroll.infiniteScrollComplete');
                });
        };

        $scope.goDetail = function (item, index) {
            $scope.selectedRow = index;
            appIonicLoading.show({
                template: '正在加载中',
                animation: 'fade-in',
                showBackdrop: true,
                duration: 30000
            });
            $scope.$emit('to-parent-list', item);
        }

    })
    .controller('detailContractController', function ($scope, $rootScope, $ionicLoading, $ionicPopup, $http, $state, basePage, paging, $ionicScrollDelegate) {
        $scope.info = {noData: true};
        $scope.items = [];
        $scope.$on('to-child-cret-detail', function (e, data) {
            $scope.items = [];
            $ionicScrollDelegate.scrollTop();
            if (data) {
                $scope.info.noData = false;
                $scope.BCSerialNo = data.SerialNo;
                $scope.BusinessType = data.BusinessType;
                basePage.init($scope, loadData);
            } else {
                $scope.info.noData = true;
            }


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
                    $rootScope.applyDetaiCount= $rootScope.applyDetaiCount+1;
                        appIonicLoading.hide();
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
    /*******************************************************担保合同查询*************************************************************/
    .controller('parentGuarantController', function ($scope, $rootScope, $ionicLoading, $ionicPopup, $http, $state, basePage) {

        $scope.$on('to-parent', function (e, d) {

            $scope.$broadcast('to-child-list', d);
        })

        $scope.$on('to-parent-list', function (e, d) {
            $scope.$broadcast('to-child-cret-detail', d);
        })
        $rootScope.info = {show: true};
        $scope.showSearchBar = function () {
            if ($rootScope.info.show) {
                $rootScope.info.show = false;
            } else {
                $rootScope.info.show = true;
            }
        }
    })
    .controller('searchGuarantController', function ($scope, $rootScope, $ionicLoading, $ionicPopup, $http, $state, basePage, paging) {


        var iPageSize = 8;
        /* 选择登记机构 */
        $scope.org_select1 = {
            codes: ''
        };
        $scope.org_select1.orgname = '';
        /* 选择管护机构 */
        $scope.org_select = {
            codes: ''
        };
        $scope.org_select.orgname = '';
        /* 选择管护机构 */
        var selectOrg = function () {
            runServiceWithSession($http, $ionicLoading,
                $ionicPopup, $state, "bank", {}, function (data,
                                                           status) {
                    $scope.org_select.codes = data["array"];
                    /*$scope.org_select.orgname = AmApp.orgID;*/
                });
        };
        /* 选择客户类型 */
        $scope.customertype_sel = {
            codes: ''
        };
        $scope.customertype_sel.typename = '';

        /* 选择担保方式 */
        $scope.guarantytype_sel = {
            codes: ''
        };
        $scope.guarantytype_sel.typename = '';
        /* 选择担保类型 */
        $scope.contracttype_sel = {
            identity: "",
            codes: [{
                name: '一般担保',
                value: '010'
            }, {
                name: '最高额担保',
                value: '020'
            }]
        };
        $scope.contracttype_sel.identity = '010';

        $scope.query = {
            serialNo: "",
            guarantyValue: "",
            serialNo1: "",
            businessType: "",
            guarantorID: "",
            customerName: ""
        };
        $scope.clearData = function () {
            $scope.query = {
                serialNo: "",
                customerName: ""
            };
            $scope.contracttype_sel.identity = "";
            $scope.guarantytype_sel.typename = "";
            $scope.org_select1.orgname = "";
        }
        /* 选择担保方式 */
        var selGuarantyType = function () {
            runServiceWithSession(
                $http,
                $ionicLoading,
                $ionicPopup,
                $state,
                "guarantytype",
                {},
                function (data, status) {
                    $scope.guarantytype_sel.codes = data["array"];
                    $scope.guarantytype_sel.typename = data["array"][0].ItemNo;
                });
        };
        selGuarantyType();

        var loadData = function () {
            $scope.fail_page = false;
            $scope.items = [];
            $scope.pageNo = 0;
        };

        /* 选择登记机构 */
        var selectOrg1 = function () {
            runServiceWithSession($http, $ionicLoading,
                $ionicPopup, $state, "bank", {}, function (data,
                                                           status) {
                    $scope.org_select1.codes = data["array"];
                    $scope.org_select1.orgname = AmApp.orgID;
                });
        };

        $scope.searchinfo = function () {
            if ($scope.query.serialNo == ''
                && $scope.query.guarantyValue == ''
                && $scope.query.businessType == ''
                && $scope.query.guarantorID == ''
                && $scope.query.customerName == ''
                && $scope.customertype_sel.typename == ''
                && $scope.guarantytype_sel.typename == ''
                && $scope.contracttype_sel.identity == ''
                && $scope.org_select.orgname) {
                $ionicLoading.show({
                    template: "请输入至少一个查询条件！",
                    duration: 2000
                });
                return false;
            }


            if ($scope.org_select1.orgname == ''
                || $scope.org_select1.orgname == null) {
                $ionicLoading.show({
                    template: "请选择登记机构！",
                    duration: 2000
                });
                return false;
            }

            $scope.info.show = false;

            $scope.pageNo = 1;

            $scope.query.vouchType = $scope.guarantytype_sel.typename;
            $scope.query.inputOrgID = $scope.org_select1.orgname;
            $scope.query.customerType = $scope.customertype_sel.typename;
            $scope.query.manageOrgID = $scope.org_select.orgname;

            $scope.$emit('to-parent', $scope.query);
        };


        basePage.init($scope, loadData);
        selectOrg();
        selectOrg1();
    })
    .controller('listGuarantController', function ($scope, $rootScope, $ionicLoading, $ionicPopup, $http, $state, basePage, paging) {

        $scope.info = {noData: true};
        var iPageSize = 8;
        $scope.$on('to-child-list', function (e, data) {
            $scope.query = data;
            $scope.items = [];
            $scope.pageNo = 0;


            paging.init($scope, iPageSize, 1, loadData, true);
            appIonicLoading.show({
                template: '正在加载中',
                animation: 'fade-in',
                showBackdrop: true,
                duration: 30000
            });
            $scope.refresh();

        });


        var loadData = function () {
            runServiceWithSession(
                $http,
                undefined,
                $ionicPopup,
                $state,
                "guarantyquery",
                {
                    SerialNo: $scope.query.serialNo,
                    ContractType: $scope.query.contractType,
                    VouchType: $scope.query.vouchType,
                    GuarantyValue: $scope.query.guarantyValue,
                    SerialNo1: $scope.query.serialNo1,
                    BusinessType: $scope.query.businessType,
                    GuarantorID: $scope.query.guarantorID,
                    CustomerName: $scope.query.customerName,
                    InputOrgID: $scope.query.inputOrgID,
                    CustomerType: $scope.query.customerType,
                    ManageOrgID: $scope.query.manageOrgID,
                    PageSize: iPageSize,
                    PageNo: $scope.pageNo
                },
                function (data, status) {
                    for (var k = 0; k < data["array"].length; k++) {
                        data["array"][k].IconCode = strEscape(data["array"][k].IconCode);
                        $scope.items.push(data["array"][k]);
                    }

                    if ($scope.items.length) {
                        $scope.info.noData = false;
                    } else {
                        $scope.info.noData = true;
                        appIonicLoading.hide();
                    }

                    $scope.hasMore = (($scope.pageNo - 1)
                    * iPageSize + data["array"].length < data.totalCount);
                    $scope.loadingMore = false;
                    if ($scope.pageNo == 1) {
                        $scope.$emit('to-parent-list', data["array"][0]);
                        $scope.selectedRow = 0;
                    }
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope
                        .$broadcast('scroll.infiniteScrollComplete');
                });
        };

        $scope.goDetail = function (item, index) {
            $scope.selectedRow = index;

            appIonicLoading.show({
                template: '正在加载中',
                animation: 'fade-in',
                showBackdrop: true,
                duration: 30000
            });
            $scope.$emit('to-parent-list', item);
        }
    })
    .controller('detailGuarantController', function ($scope, $rootScope, $ionicLoading, $ionicPopup, $http, $state, basePage, paging, $ionicScrollDelegate) {
        $scope.items = [];
        $scope.info = {noData: true};
        $scope.$on('to-child-cret-detail', function (e, data) {
            $scope.items = [];
            $ionicScrollDelegate.scrollTop();

            if (data) {
                $scope.info.noData = false;
                $scope.SerialNo = data.SerialNo;
                basePage.init($scope, loadData);
            } else {
                $scope.info.noData = true;
            }
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
