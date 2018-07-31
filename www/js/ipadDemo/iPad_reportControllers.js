/**
 * Created by laker on 2016/12/2.
 */
angular
    .module('com.amarsoft.mobile.controllers.iPad_report', [])
    .controller('ReportIndexForiPadController', function ($scope, $http, $ionicLoading, $ionicPopup, $state, basePage) {


        basePage.init($scope);
    })
    //全行信贷资产余额
    .controller('CreditBalanceForiPadController', function ($scope, $http, $ionicLoading, $ionicPopup, $state, basePage) {
        $scope.info = {date: new Date()};
        $scope.params = {};
        var loadData = function () {
            $scope.params.Date = $scope.info.date.getFullYear().toString() + '-' + ($scope.info.date.getMonth() + 1);
            runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
                'getCreditBalanceData', $scope.params, function (data, status) {
                    var chartData = data.array;
                    $scope.xDataList = [];
                    $scope.yDataList1 = [];
                    $scope.yDataList2 = [];
                    $scope.yDataList3 = [];

                    for (var i = 1; i <= 4; i++) {
                        $scope.xDataList.push(chartData[3]['Data' + i]);
                        $scope.yDataList1.push(chartData[0]['Data' + i]);
                        $scope.yDataList2.push(chartData[1]['Data' + i]);
                        $scope.yDataList3.push(chartData[2]['Data' + i]);
                    }
                    $scope.xDataList.reverse();

                    $('#echart').height(window.innerHeight / 2);

                    var myChart = echarts.init(document.getElementById('echart'));

                    var option = {
                        title: {
                            text: '全行信贷资产余额',
                            x: 'center'
                        },
                        legend: {
                            data: ['表内贷款余额', '表外受托业务余额', '全行信贷资产合计'],
                            left: 'center',
                            bottom: '5%'
                        },
                        grid: {
                            left: '2%',
                            right: '5%',
                            top: '15%',
                            bottom: '20%',
                            containLabel: true
                        },
                        xAxis: {
                            data: $scope.xDataList
                        },
                        yAxis: {
                            type: 'value',
                            name: '亿元'
                        },
                        series: [
                            {
                                name: '表内贷款余额',
                                type: 'line',
                                data: $scope.yDataList1,
                                label: {
                                    normal: {
                                        show: true
                                    }
                                }
                            },
                            {
                                name: '表外受托业务余额',
                                type: 'line',
                                data: $scope.yDataList2,
                                label: {
                                    normal: {
                                        show: true
                                    }
                                }
                            },
                            {
                                name: '全行信贷资产合计',
                                type: 'line',
                                data: $scope.yDataList3,
                                label: {
                                    normal: {
                                        show: true
                                    }
                                }
                            }
                        ],
                        toolbox: {
                            show: true,
                            itemSize: 20,
                            //orient:'vertical',
                            feature: {
                                magicType: {type: ['line', 'bar']},
                                restore: {}
                            }
                        }
                    };

                    myChart.setOption(option);
                });
        };

        loadData();

        $scope.search = function () {
            if ($scope.info) {
                $scope.params.Date = $scope.info.date.getFullYear().toString() + '-' + ($scope.info.date.getMonth() + 1);
            }
            loadData();
        };
        basePage.init($scope);
    })
    //本外币贷款发放
    .controller('LoanPaymentForiPadController', function ($scope, $http, $ionicLoading, $ionicPopup, $state, basePage) {
        basePage.init($scope);

        $scope.info = {date: new Date()};
        $scope.params = {};

        var loadData = function () {

            $scope.params.Date = $scope.info.date.getFullYear().toString() + '-' + ($scope.info.date.getMonth() + 1);

            runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
                'getLoanPaymentData', $scope.params, function (data, status) {

                    var chartData = data.array;
                    $scope.xDataList = [];
                    $scope.yDataList1 = [];
                    $scope.yDataList2 = [];

                    for (var i = 1; i <= 4; i++) {
                        $scope.xDataList.push(chartData[2]['Data' + i]);
                        $scope.yDataList1.push(chartData[0]['Data' + i])
                        $scope.yDataList2.push(chartData[1]['Data' + i])
                    }
                    $scope.xDataList.reverse(); //季度从前往后
                    $('#echart').height(window.innerHeight / 2);
                    var echart = document.getElementById('echart');
                    var myChart = echarts.init(echart);
                    var option = {
                        title: {
                            text: '本外币贷款发放',
                            x: 'center'
                        },
                        grid: [{left: '1%', right: '1%', top: '15%', height: '75%', containLabel: true}],
                        tooltip: {
                            trigger: 'item',
                            formatter: "{a} <br/>{b} : {c}（亿元)"
                        },
                        legend: {
                            data: ['人民币贷款发放', '外币贷款发放'],
                            bottom: '2%',
                            left: 'center'
                        },
                        xAxis: {
                            type: 'category',
                            splitLine: {
                                show: false
                            },
                            data: $scope.xDataList
                        },
                        yAxis: {
                            name: '亿元',
                            gridIndex: 0
                        },
                        color: ['#4cd964', '#e6b500', '#6e7074', '#546570', '#c4ccd3'], //柱状图颜色
                        series: [
                            {
                                name: '人民币贷款发放',
                                data: $scope.yDataList1,
                                type: 'bar',
                                label: {
                                    normal: {
                                        show: true,
                                        position: 'top'
                                    }
                                }
                            },
                            {
                                name: '外币贷款发放',
                                data: $scope.yDataList2,
                                type: 'bar',
                                barGap: 0,
                                label: {
                                    normal: {
                                        show: true,
                                        position: 'top'
                                    }
                                }
                            }

                        ],
                        toolbox: {
                            show: true,
                            itemSize: 20,
                            //orient:'vertical',
                            feature: {
                                magicType: {type: ['line', 'bar', 'stack']},
                                restore: {}
                            }
                        }
                    };

                    myChart.setOption(option);

                });

        };

        loadData();

        $scope.search = function () {
            if ($scope.info) {
                $scope.params.Date = $scope.info.date.getFullYear().toString() + '-' + ($scope.info.date.getMonth() + 1);
            }
            loadData();
        };
    })
    //贷款投向
    .controller('LoanInvestmentForiPadController', function ($scope, $http, $ionicLoading, $ionicPopup, $state, basePage) {
        basePage.init($scope);

        $scope.info = {date: new Date()};
        $scope.params = {};

        var loadData = function () {
            $scope.params.Date = $scope.info.date.getFullYear().toString() + '-' + ($scope.info.date.getMonth() + 1);

            runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
                'getLoanInvestmentData', $scope.params, function (data, status) {

                    $scope.list = data.array;

                    var ShortTotal = 0;
                    var LongTotal = 0;
                    var total1 = 0;
                    var total2 = 0;

                    for (var i = 0; i < data.array.length; i++) {
                        ShortTotal += data.array[i].ShortBalance;
                        LongTotal += data.array[i].LongBalance;
                    }

                    total1 = ShortTotal.toFixed(2);
                    total2 = LongTotal.toFixed(2);
                    $('#echart').height(window.innerHeight / 2);

                    var echart = echarts.init(document.getElementById('echart'));

                    var option = {
                        title: {
                            text: '短期贷款和中长期贷款余额总计：' + (ShortTotal + LongTotal).toFixed(2),
                            subtext: '单位：亿元',
                            x: 'center',
                            textStyle: {
                                fontSize: '16'
                            }
                        },
                        tooltip: {
                            trigger: 'item',
                            position: ['25%', '70%'],
                            formatter: "{a} <br/>{b} : {c} ({d}%)"
                        },
                        series: [
                            {
                                name: '访问来源',
                                type: 'pie',
                                radius: '45%',
                                center: ['50%', '45%'],
                                label: {
                                    show: true
                                },
                                data: [
                                    {value: total1, name: '短期贷款'},
                                    {value: total2, name: '中长期期贷款'}
                                ]
                            }
                        ]

                    };
                    echart.setOption(option);
                    //$scope.list = chartData.list;
                    //$scope.total = chartData.total;
                    //$scope.shortTotal = chartData.shortTotal;
                    //$scope.middleTotal = chartData.middleTotal;
                })

        };

        loadData();

        $scope.search = function () {
            if ($scope.info) {
                $scope.params.Date = $scope.info.date.getFullYear().toString() + '-' + ($scope.info.date.getMonth() + 1);
            }
            loadData();
        };
    })

    //贷款减值准备和贷款覆盖率
    .controller('LoanCoverageForiPadController', function ($scope, basePage, $http, $ionicLoading, $ionicPopup, $state) {
        basePage.init($scope);

        $scope.info = {date: new Date()};
        $scope.params = {};

        var loadData = function () {

            $scope.params.Date = $scope.info.date.getFullYear().toString() + '-' + ($scope.info.date.getMonth() + 1);

            runServiceWithSession($http, $ionicLoading, $ionicPopup, $state, 'getLoanCoverageData', $scope.params, function (data, status) {

                var chartData = data.array;
                $scope.xDataList = [];
                $scope.yDataList1 = [];
                $scope.yDataList2 = [];

                for (var i = 1; i <= 4; i++) {
                    $scope.xDataList.push(chartData[2]['Data' + i]);
                    $scope.yDataList1.push(chartData[0]['Data' + i]);
                    $scope.yDataList2.push(chartData[1]['Data' + i]);
                }
                $scope.xDataList.reverse(); //季度从前往后
                $('#echart').height(window.innerHeight / 2);

                var echart = document.getElementById('echart');
                var myChart = echarts.init(echart);   //初始化一个图表
                var option = {   //配置图表参数
                    title: {
                        text: '贷款减值准备和贷款覆盖率',   //表的名称
                        x: 'center'
                    },
                    grid: [{left: '1%', right: '1%', top: 'middle', height: '70%', containLabel: true}],  //表的位置，大小
                    legend: {  //设置表的图例组件
                        data: ['贷款减值准备余额', '贷款覆盖率（含表外）'],
                        bottom: '2%',
                        left: 'center'
                    },
                    tooltip: [{
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c}"
                    }],
                    xAxis: {
                        type: 'category',
                        splitLine: {
                            show: false
                        },
                        data: $scope.xDataList  //x轴类目数据
                    },
                    yAxis: [
                        {
                            type: 'value',
                            name: '亿元',
                            min: 0,
                            max: 1500,
                            interval: 250,  //Y轴间隔值为250
                            splitNumber: 6,
                        },
                        {
                            type: 'value',  //数值类型
                            name: '',   //Y轴单位名称
                            min: 0,   //Y轴最小为0
                            max: 3.0, //Y轴最大为3
                            splitNumber: 6,  //Y轴显示6格
                            axisLabel: {
                                formatter: '{value}%'  //格式化Y轴上的数据为百分数
                            }
                        }
                    ],
                    series: [
                        {
                            name: '贷款减值准备余额',
                            type: 'bar',
                            label: {
                                normal: {
                                    show: true,
                                    position: 'top'
                                }
                            },
                            data: $scope.yDataList1  //数据
                        },
                        {
                            name: '贷款覆盖率（含表外）',  //类名
                            type: 'line',   //线性
                            //smooth: true,
                            showAllSymbol: true, //显示line上的所有数据点
                            label: {
                                normal: {
                                    show: true,  //显示line上点的数据
                                    formatter: '{c}%'  //格式化折线上数字为百分数
                                }
                            },
                            yAxisIndex: 1,  //第二根y轴
                            data: $scope.yDataList2,  //数据
                            markLine: {
                                lineStyle: {
                                    normal: {
                                        type: 'solid',
                                        color: 'rgb(255,0,0)',
                                        width: 2
                                    }
                                },
                                data: [
                                    {
                                        0: {
                                            coord: [0, 2.5],
                                            symbolSize: 1,
                                            value: 2.5,
                                            label: {
                                                normal: {
                                                    show: true,
                                                    position: 'middle',
                                                    formatter: '银监会审核监管指标要求：不低于{c}%'
                                                }
                                            }
                                        },
                                        1: {
                                            coord: [3, 2.5],
                                            symbolSize: 1
                                        }
                                    }

                                ]

                            }
                        }
                    ],
                    toolbox: {
                        show: true,
                        itemSize: 20,
                        //orient:'vertical',
                        feature: {
                            magicType: {type: ['line', 'bar']},
                            restore: {}
                        }
                    }
                };

                myChart.setOption(option);
            })

        };

        loadData();

        $scope.search = function () {
            if ($scope.info) {
                $scope.params.Date = $scope.info.date.getFullYear().toString() + '-' + ($scope.info.date.getMonth() + 1);
            }
            loadData();
        };

    })

    //贷款减值准备和拨备覆盖率
    .controller('ProvisionCoverageForiPadController', function ($scope, basePage, $http, $ionicLoading, $ionicPopup, $state) {
        basePage.init($scope);

        $scope.info = {date: new Date()};
        $scope.params = {};


        var loadData = function () {

            $scope.params.Date = $scope.info.date.getFullYear().toString() + '-' + ($scope.info.date.getMonth() + 1);

            runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
                'getProvisionCoverageData', $scope.params, function (data, status) {
                    var chartData = data.array;
                    $scope.xDataList = [];
                    $scope.yDataList1 = [];
                    $scope.yDataList2 = [];

                    for (var i = 1; i <= 4; i++) {
                        $scope.xDataList.push(chartData[2]['Data' + i]);
                        $scope.yDataList1.push(chartData[0]['Data' + i]);
                        $scope.yDataList2.push(chartData[1]['Data' + i]);
                    }
                    $scope.xDataList.reverse(); //季度从前往后
                    $('#echart').height(window.innerHeight / 2);

                    var echart = document.getElementById('echart');
                    var myChart = echarts.init(echart);   //初始化一个图表
                    var option = {   //配置图表参数
                        title: {
                            text: '贷款减值准备和拨备覆盖率',   //表的名称
                            x: 'center'
                        },
                        grid: [{left: '1%', right: '1%', top: 'middle', height: '72%', containLabel: true}],  //表的位置，大小
                        legend: {  //设置表的图例组件
                            data: ['贷款减值准备余额', '拨备覆盖率'],
                            bottom: '2%',
                            left: 'center'
                        },
                        tooltip: {
                            trigger: 'item',
                            formatter: "{a} <br/>{b} : {c}"
                        },
                        xAxis: {
                            type: 'category',
                            data: $scope.xDataList  //x轴类目数据
                        },
                        yAxis: [
                            {
                                type: 'value',
                                name: '亿元',
                                min: 0,
                                max: 1200,
                                interval: 200,  //Y轴间隔值为200
                                splitNumber: 6,
                            },
                            {
                                type: 'value',  //数值类型
                                name: '',   //Y轴单位名称
                                min: 0,   //Y轴最小为0
                                //max: 3.0, //Y轴最大为3
                                //splitNumber: 6,  //Y轴显示6格
                                axisLabel: {
                                    formatter: '{value}%'  //格式化Y轴上的数据为百分数
                                }
                            },
                        ],
                        series: [
                            {
                                name: '贷款减值准备余额',
                                type: 'bar',
                                label: {
                                    normal: {
                                        show: true,
                                        position: 'top'
                                    }
                                },
                                data: $scope.yDataList1  //数据
                            },
                            {
                                name: '拨备覆盖率',  //类名
                                type: 'line',   //线性
                                //smooth: true,
                                showAllSymbol: true, //显示line上的所有数据点
                                label: {
                                    normal: {
                                        show: true,  //显示line上点的数据
                                        formatter: '{c}%'  //格式化折线上数字为百分数
                                    }
                                },
                                yAxisIndex: 1,  //第二根y轴
                                data: $scope.yDataList2  //数据
                            }
                        ],
                        toolbox: {
                            show: true,
                            itemSize: 20,
                            //orient:'vertical',
                            feature: {
                                magicType: {type: ['line', 'bar']},
                                restore: {}
                            }
                        }
                    };
                    myChart.setOption(option);
                });

        };

        loadData();

        $scope.search = function () {
            if ($scope.info) {
                $scope.params.Date = $scope.info.date.getFullYear().toString() + '-' + ($scope.info.date.getMonth() + 1);
            }
            loadData();
        };


    })

    //信贷资产质量五级分类
    .controller('FiveLevelClassificationForiPadController', function ($scope, basePage, $http, $ionicLoading, $ionicPopup, $state) {
        basePage.init($scope);

        $scope.info = {date: new Date()};
        $scope.params = {};

        var loadData = function () {

            $scope.params.Date = $scope.info.date.getFullYear().toString() + '-' + ($scope.info.date.getMonth() + 1);

            runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
                'getFiveLevelClassificationData', $scope.params, function (data, status) {
                    var chartData = data.array;
                    $scope.dataList = [];
                    $scope.dataList1 = [];
                    $scope.list = ['正常类', '关注类', '次级类', '可疑类', '损失类'];

                    var total = 0;
                    for (var m = 1; m <= 5; m++) {
                        total += parseFloat(chartData[0]['Data' + m]);
                    }
                    for (var i = 1; i <= 5; i++) {
                        var obj = {};
                        var obj1 = {};
                        obj.value = parseFloat(chartData[0]['Data' + i]);
                        obj.name = $scope.list[i - 1] + '，' + (obj.value / total * 100).toFixed(2) + '%';
                        $scope.dataList.push(obj);

                        obj1.value = parseFloat(chartData[0]['Data' + i]);
                        obj1.percent = (obj.value / total * 100).toFixed(2) + '%';
                        obj1.name = $scope.list[i - 1];
                        $scope.dataList1.push(obj1);
                    }


                    $('#echart').height(window.innerHeight / 2);
                    var echart = echarts.init(document.getElementById('echart'));

                    var option = {
                        title: {
                            text: '信贷资产质量五级分类',
                            x: 'center'
                        },
                        tooltip: {
                            trigger: 'item',
                            position: ['25%', '65%'],
                            formatter: "{a} <br/>{b} : {c} "
                        },
                        series: [
                            {
                                name: '访问来源',
                                type: 'pie',
                                radius: '50%',
                                center: ['50%', '50%'],
                                startAngle: 80,
                                //minAngle: 10,
                                label: {
                                    normal: {
                                        show: true
                                    }
                                },
                                labelLine: {
                                    normal: {
                                        show: true,
                                        length: 20,
                                        length2: 6
                                    }

                                },
                                data: $scope.dataList
                            }
                        ]
                    };
                    echart.setOption(option);
                });
        };

        loadData();

        $scope.search = function () {
            if ($scope.info) {
                $scope.params.Date = $scope.info.date.getFullYear().toString() + '-' + ($scope.info.date.getMonth() + 1);
            }
            loadData();
        };

    })

    //前十大客户资产和集中度
    .controller('TopTenAssetsForiPadController', function ($scope, basePage, $http, $ionicLoading, $ionicPopup, $state) {
        basePage.init($scope);

        $scope.info = {date: new Date()};
        $scope.params = {};

        var loadData = function () {
            $scope.params.Date = $scope.info.date.getFullYear().toString() + '-' + ($scope.info.date.getMonth() + 1);

            runServiceWithSession($http, $ionicLoading, $ionicPopup, $state, 'getTopTenAssets', $scope.params, function (data, status) {
                $scope.list = data["array"];
            });
        };

        loadData();

        $scope.search = function () {
            if ($scope.info) {
                $scope.params.Date = $scope.info.date.getFullYear().toString() + '-' + ($scope.info.date.getMonth() + 1);
            }
            loadData();
        };


    })

    //信用结构贷款余额分布
    .controller('BalanceDistributionForiPadController', function ($scope, basePage, $http, $ionicLoading, $ionicPopup, $state) {
        basePage.init($scope);

        $scope.info = {date: new Date()};
        $scope.params = {};
        var loadData = function () {
            $scope.params.Date = $scope.info.date.getFullYear().toString() + '-' + ($scope.info.date.getMonth() + 1);

            runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
                'getBalanceDistributionData', $scope.params, function (data, status) {
                    var chartData = data.array;
                    $scope.xDataList = [];
                    $scope.yDataList1 = [];
                    $scope.yDataList2 = [];
                    $scope.yDataList3 = [];
                    $scope.yDataList4 = [];

                    for (var i = 1; i <= 3; i++) {
                        $scope.xDataList.push(chartData[4]['Data' + i]);
                        $scope.yDataList1.push(chartData[0]['Data' + i]);
                        $scope.yDataList2.push(chartData[1]['Data' + i]);
                        $scope.yDataList3.push(chartData[2]['Data' + i]);
                        $scope.yDataList4.push(chartData[3]['Data' + i]);
                    }
                    $scope.xDataList.reverse();
                    $('#echart').height(window.innerHeight / 2);

                    var myChart = echarts.init(document.getElementById('echart'));   //初始化一个图表
                    var option = {   //配置图表参数
                        title: {
                            text: '信用结构贷款余额分布',   //表的名称
                            x: 'center'      //title居中
                        },
                        grid: [{left: '1%', right: '1%', top: '12%', height: '75%', containLabel: true}],  //表的位置，大小
                        legend: {  //设置表的图例组件
                            data: ['抵质押品贷款', '担保贷款', '混合贷款', '信用贷款'],
                            bottom: '0',
                            left: 'center'
                        },
                        tooltip: {
                            trigger: 'item',
                            //position: ['25%', '65%'],
                            formatter: "{a} <br/>{b} : {c} (亿元)"
                        },
                        xAxis: {
                            type: 'category',
                            data: $scope.xDataList  //x轴类目数据
                        },
                        yAxis: [
                            {
                                type: 'value',
                                name: '亿元',
                                //min: 0,
                                //max: 20000,
                                //interval: 2000  //Y轴间隔值
                            }
                        ],
                        series: [
                            {
                                name: '抵质押品贷款',
                                type: 'bar',
                                data: $scope.yDataList1
                            },
                            {
                                name: '担保贷款',
                                type: 'bar',
                                barGap: 0,
                                data: $scope.yDataList2
                            },
                            {
                                name: '混合贷款',
                                type: 'bar',
                                barGap: 0,
                                data: $scope.yDataList3
                            },
                            {
                                name: '信用贷款',
                                type: 'bar',
                                barGap: 0,
                                data: $scope.yDataList4
                            }
                        ],
                        toolbox: {
                            show: true,
                            itemSize: 20,
                            //orient:'vertical',
                            feature: {
                                magicType: {type: ['line', 'bar', 'stack']},
                                restore: {}
                            }
                        }
                    };

                    //for(var i=0; i<chartData.yData.length; i++){
                    //	option.series[i].type = 'bar';
                    //	option.series[i].barGap = 0;
                    //}
                    myChart.setOption(option);

                });

        };

        loadData();

        $scope.search = function () {
            if ($scope.info) {
                $scope.params.Date = $scope.info.date.getFullYear().toString() + '-' + ($scope.info.date.getMonth() + 1);
            }
            loadData();
        };

    })

    //违约客户名单
    .controller('DefaultClientListForiPadController', function ($scope, basePage, paging, $http, $ionicPopup, $state) {
        $scope.items = [];

        var iPageSize = 5;//分页相关
        var loadData = function ($ionicLoading) {
            runServiceWithSession($http, undefined, $ionicPopup, $state,
                "DefaultClientList", {
                    pageSize: iPageSize,
                    pageNo: $scope.pageNo,
                }, function (data, status) {
                    for (var k = 0; k < data["array"].length; k++) {
                        //数据展现格式也在后端处理，前端尽量只做展现
//								parseFloat(data["array"][k].amount);
//					data["array"][k].IconCode = strEscape(data["array"][k].IconCode);
                        if (k === 0 && data["array"][0].totalBank) {
                            $scope.totalItem = data["array"][0];
                        } else {
                            $scope.items.push(data["array"][k]);
                        }

                    }
                    //分页相关
                    $scope.hasMore = (($scope.pageNo - 1) * iPageSize
                    + data["array"].length < data.totalCount);
                    $scope.loadingMore = false;
                    if ($scope.items.length) {
                        $scope.noData = false;
                    } else {
                        $scope.noData = true;
                    }
                    $scope.$broadcast('scroll.refreshComplete');//刷新完成
                    $scope.$broadcast('scroll.infiniteScrollComplete');//加载完成
                });
        };

        paging.init($scope, iPageSize, 1, loadData);


        //$scope.list = [
        //	{
        //		totalBank: 25,
        //		totalCustomer: 57,
        //		totalBalance: 60.9,
        //		totalLoss: 29.7,
        //		averageRate: 46.4
        //	},
        //	{
        //		bank: '山西分行',
        //		customerName: '运城关铝热电有限公司',
        //		loanBalance: 144300,
        //		lossBalance: 69192,
        //		lossRate: 0.4567
        //	},
        //	{
        //		bank: '青海分行',
        //		customerName: '运城关铝热电有限公司',
        //		loanBalance: 144300,
        //		lossBalance: 69192,
        //		lossRate: 0.4567
        //	},
        //	{
        //		bank: '黑龙江分行',
        //		customerName: '运城关铝热电有限公司',
        //		loanBalance: 144300,
        //		lossBalance: 69192,
        //		lossRate: 0.4567
        //	},
        //	{
        //		bank: '北京分行',
        //		customerName: '运城关铝热电有限公司',
        //		loanBalance: 144300,
        //		lossBalance: 69192,
        //		lossRate: 0.4567
        //	},
        //	{
        //		bank: '上海分行',
        //		customerName: '运城关铝热电有限公司',
        //		loanBalance: 144300,
        //		lossBalance: 69192,
        //		lossRate: 0.4567
        //	},
        //	{
        //		bank: '陕西分行',
        //		customerName: '运城关铝热电有限公司',
        //		loanBalance: 144300,
        //		lossBalance: 69192,
        //		lossRate: 0.4567
        //	},
        //	{
        //		bank: '山西分行',
        //		customerName: '运城关铝热电有限公司',
        //		loanBalance: 144300,
        //		lossBalance: 69192,
        //		lossRate: 0.4567
        //	},
        //	{
        //		bank: '山西分行',
        //		customerName: '运城关铝热电有限公司',
        //		loanBalance: 144300,
        //		lossBalance: 69192,
        //		lossRate: 0.4567
        //	},
        //	{
        //		bank: '辽宁分行',
        //		customerName: '运城关铝热电有限公司',
        //		loanBalance: 144300,
        //		lossBalance: 69192,
        //		lossRate: 0.4567
        //	},
        //	{
        //		bank: '大连分行',
        //		customerName: '运城关铝热电有限公司',
        //		loanBalance: 144300,
        //		lossBalance: 69192,
        //		lossRate: 0.4567
        //	},
        //];
        //

    });
