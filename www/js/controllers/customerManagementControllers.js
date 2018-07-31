/**
 * Created by yyma 2017/1/16.
 */
/**
 * @file 客户管理
 * @author create by  yyma
 *        
 */
angular.module('com.amarsoft.mobile.controllers.customerManagement', ['ngSanitize', 'ngAnimate'])
		    // 客户管理首页
		.controller(
				'CustomerManagementController',
				function($scope, $rootScope, $state, basePage, $timeout,
						$ionicPopup, $ionicModal, $ionicLoading, $http,
						$compile) { 
					/**
					 * 切换tab按钮 yyma
					 * 
					 * @param index
					 *            索引
					 */	    	

					// 二级菜单
					$scope.CustTypeMenu = [ {
						menuId : "01",
						menuName : "公司客户"
					}, {
						menuId : "03",
						menuName : "小企业"
					}, {
						menuId : "04",
						menuName : "个人客户"
					} ];
					// 列表查询条件
					$scope.searchData = {
						customerID : "",
						customerName : "",
						certID : "",
						CustomerType : "",
						CustType : ""
					};
				     $scope.SelectedCustomerList = {};// 显示客户管理的基本信息的一级标题： add by myy
					 
					//接收公司客户列表Controller发来的广播
					$scope.$on("to-DetailController",function(e,data){
						$scope.$broadcast('To-CustomerDetailController',data)
					}) 
					//接受父Controller发来的列表页面的广播
					$scope.$on('ToIndCustomerInfo', function(e, data) {
						$scope.$broadcast("To-IndCustomerController", data);
					}); 
				
					// 根据用户的LoanType来确认二级菜单的默认菜单
					if (AmApp.loanType == "ENT") {
						$scope.CustomerDetailView=true;//默认跳出列表页时，跳出相应的详情页面
						$scope.IndCustomerView = true;//公司客户列表,个人客户列表页面不可见 
						$scope.selectMenuRow = "0"; // 点击客户管理，默认选中“公司客户”菜单
						$scope.searchData.CustomerType = "01";
						$scope.searchData.CustType = "01";
					} else if (AmApp.loanType == "SME") {
						$scope.CustomerDetailView=true;//默认跳出列表页时，跳出相应的详情页面
						$scope.IndCustomerView = true;//公司客户列表,个人客户列表页面不可见					
						$scope.selectMenuRow = "1";// 点击客户管理，默认选中“小企业”菜单
						$scope.searchData.CustomerType = "01";
						$scope.searchData.CustType = "03";
					} else if (AmApp.loanType == "IND") {
						$scope.CustomerDetailView=true;//默认跳出列表页时，跳出相应的详情页面
						$scope.IndCustomerView = true;//个人客户列表页面可见					
						$scope.selectMenuRow = "2";// 点击客户管理，默认选中“个人客户”菜单
						$scope.searchData.CustomerType = "";
						$scope.searchData.CustType = "04";
					} else {//如果用户的LoanType为null时，默认选中公司客户
						$scope.CustomerDetailView=true;//默认跳出列表页时，跳出相应的详情页面
						$scope.IndCustomerView = true;//个人客户列表页面不可见						
						$scope.selectMenuRow = "0"; // 点击客户管理，默认选中“公司客户”菜单
						$scope.searchData.CustomerType = "01";
						$scope.searchData.CustType = "01";
					}
					// 公司客户，小企业，个人客户，三个菜单的点击方法
					$scope.selectTab = function(item, index) {
						if (index == '2') {// 选择个人客户
							$scope.selectMenuRow = index;
							$scope.searchData.CustomerType = "";
							$scope.searchData.CustType = "04";
							$scope.IndCustomerView = true;// 显示公司客户列表和个人客户列表共用页面							
							$scope.$broadcast('To-IndCustomerController',$scope.searchData);
						} else if (index == '0') { // 选择公司客户
							$scope.selectMenuRow = index;
							$scope.searchData.CustomerType = "01";
							$scope.searchData.CustType = "01";
							$scope.IndCustomerView = true;// 显示公司客户列表和个人客户列表共用页面							
							$scope.$broadcast('To-IndCustomerController',$scope.searchData);
						} else if (index == '1') { // 选择小企业客户
							$scope.selectMenuRow = index;
							$scope.searchData.CustomerType = "01";
							$scope.searchData.CustType = "03";
							$scope.IndCustomerView = true;							
							$scope.$broadcast('To-IndCustomerController',$scope.searchData);// 选择公司客户

						}

					};

					// 控制搜索框的闭合状态
					$scope.showSearchCustomer = function() {
						if ($rootScope.Customer) {
							$rootScope.Customer = false;
						} else {
							$rootScope.Customer = true;
						}
					} 

}).controller('IndCustomerController',
			function($scope, $rootScope, $state, $timeout, $ionicModal,
			$ionicLoading, paging, $http, $ionicPopup, $timeout) {   
					 //客户详情跳转
					$scope.gotoCustomerDetail = function(item, index) {
						$scope.selectedRow = index;
						$scope.SelectedCustomerList = item;

						appIonicLoading.show({
							template : '正在加载中',
							animation : 'fade-in',
							showBackdrop : true,
							duration : 30000
						});
						$scope.$emit("to-DetailController", item)
					};
					 //延迟加载
					appIonicLoading.show({
						template : '正在加载中',
						animation : 'fade-in',
						showBackdrop : true,
						duration : 3000
					});

					$scope.items = [];
					var iPageSize = 12;
					// 接受子Controller传过来公司客户、小企业和个人客户列表的广播
					$scope.$on('To-IndCustomerController', function(e, data) {
						$scope.items = [];
						$scope.data = data;
						$scope.searchKey = "";
						for ( var search in data)
							$scope.searchKey += search + ":" + data[search]
									+ "@";
						paging.init($scope, iPageSize, 1, loadData, true);
						$scope.refresh();
					});

					// 公司客户、小企业和个人客户  列表 服务查询 yyma
					var loadData = function($ionicLoading) {
						runServiceWithSession(
								$http,
								$ionicLoading,
								$ionicPopup,
								$state,
								"CustomerInfoQRYList",
								{
									pageSize : iPageSize,
									pageNo : $scope.pageNo,
									UserId : AmApp.userID,
									CustomerType : $scope.searchData.CustomerType,
									CustType : $scope.searchData.CustType,
									SearchKey : $scope.searchKey
								},
								function(data, status) {
									for (var k = 0; k < data["array"].length; k++) {
										$scope.items.push(data["array"][k]);

										if (k == 0 && $scope.pageNo == 1) {										
  											$scope.$emit('to-DetailController',data['array'][0]);
											$scope.selectedRow = "0";                                           
                                            $scope.SelectedCustomerList = data['array'][0];
										}
									}

									$scope.hasMore = (($scope.pageNo - 1)
											* iPageSize + data["array"].length < data.totalCount);
									$scope.loadingMore = false;
									if ($scope.items.length) {
										$scope.noData = false;
									} else {
										$scope.noData = true;
									}
									appIonicLoading.hide();
									$scope.$broadcast('scroll.refreshComplete');
									$scope
											.$broadcast('scroll.infiniteScrollComplete');
									appIonicLoading.hide();
								});
					};
					paging.init($scope, iPageSize, 1, loadData);

    }) 
    .controller('IndCustomerDetailController', function ($scope, $rootScope, $ionicLoading, $ionicPopup, $http, $state, basePage, $ionicScrollDelegate,$ionicModal,$filter) {
    	   // add by yyma
    	/**
		 * 定义对象
		 */  
    	    $scope.selectTab0=true;
            $scope.CustomerInfo = {};// 客户详细信息
        	$scope.inputTextLength = 100;// 输入提示
        	
        	 /** ***********************营销模块下拉框值加载（）***************************** */
            //通用查询下拉框的内容方法
            var selectType = function (dataType,DoNo,ColIndex) {        	
            	runServiceWithSession($http, $ionicLoading,
            			$ionicPopup, $state, "SelectType", {DoNo:DoNo,ColIndex:ColIndex}, function (data, status) {
            				$scope[dataType] =  data["array"]; 
            			});
            };       
            
        	//获取页面下拉框option值(此处selectType的第一个参数应该为数据库模版字段表中下拉展示的COLNAME字段)
        	selectType("Sex","IndividualInfo","0050");
        	selectType("CertType","IndividualInfo","0030");
        	selectType("BusinessCurrency","MarketingInfo","00110");
        	selectType("LoanType","MarketingInfo","00135");
        	selectType("MarketingChannel","MarketingInfo","00150");       

       
            /**
        	 * 接受公司客户列表发来详情的广播  add by  yyma
        	 * */
       $scope.$on('To-CustomerDetailController',function(e,data){
    	   
    	   $scope.SelectedCustomerList=data;
    	   $scope.BelongFlagShow=true;
    	   $ionicScrollDelegate.scrollTop();
           $scope.detail = [];//接受服务端传来的信息 
           if(data){
               runServiceWithSession(
                   $http,
                   $ionicLoading,
                   $ionicPopup,
                   $state,
                   "SelectCustomerInfo",
                   {                  
                       customerID: data.CustomerID
                   },
                   function (data, status) {
                   for(var i=0;i<data["array"].length;i++){
                   	//控制页面上杀是否展示的字段;
                   	data["array"][i]['showGroup']=true;
                   	$scope.detail.push(data["array"][i]);
                   	//获取json字符串中的groupColArray的数据，按照json格式<KeyId:Value>保存到$scope.CustomerInfo中
                   	$scope.groupColArray=data["array"][i].groupColArray;
                   	for(var j=0;j<$scope.groupColArray.length;j++){
                   		$scope.CustomerInfo[$scope.groupColArray[j].KeyId]=$scope.groupColArray[j].Value;                                  
                      }  
                   }	 
                   appIonicLoading.hide();
              });
            }else {
           	 $scope.detail=[];
             $scope.IndCustomerDetailNoData = true;//个人客户详情显示"暂无数据"的显示模态框

            }
       })
        
      //备注输入限制
    	$scope.checkText = function(){
        	$scope.inputShow = true;
            if($scope.CustomerInfo.Remark.length >=100){
                $scope.marketInfo.Remark = $scope.marketInfo.Remark.substr(0,100)
                $scope.inputTextLength=0;
            }else{
                $scope.inputTextLength=100-$scope.marketInfo.Remark.length;
            }
    	}   
        //个人、公司客户暂存
        $scope.CustomerTempSave = function () {

            //设置参数
            $scope.BA.TEMPSAVEFLAG = '1';

            // TODO:保存方法待验证 laker 0209 9:28

            appIonicLoading.show({
                template: '正在保存数据',
                animation: 'fade-in',
                showBackdrop: true,
                duration: 30000
            });
            if ($scope.DATE.SETUPDATE) {
                $scope.BA.SETUPDATE = $scope.DATE.SETUPDATE.getFullYear() + '/' + ($scope.DATE.SETUPDATE.getMonth() + 1) + '/' + $scope.DATE.SETUPDATE.getDate();
            }

            if ($scope.DATE.ACCOUNTDATE) {
                $scope.BA.ACCOUNTDATE = $scope.DATE.ACCOUNTDATE.getFullYear() + '/' + ($scope.DATE.ACCOUNTDATE.getMonth() + 1) + '/' + $scope.DATE.ACCOUNTDATE.getDate();
            }

            if ($scope.DATE.BIRTHDAY) {
                $scope.BA.BIRTHDAY = $scope.DATE.BIRTHDAY.getFullYear() + '/' + ($scope.DATE.BIRTHDAY.getMonth() + 1) + '/' + $scope.DATE.BIRTHDAY.getDate();
            }

            if ($scope.DATE.CREDITDATE) {
                $scope.BA.CREDITDATE = $scope.DATE.CREDITDATE.getFullYear() + '/' + ($scope.DATE.CREDITDATE.getMonth() + 1) + '/' + $scope.DATE.CREDITDATE.getDate();
            }


            if ($scope.DATE.GRADUATEYEAR) {
                $scope.BA.GRADUATEYEAR = $scope.DATE.GRADUATEYEAR.getFullYear() + '/' + ($scope.DATE.GRADUATEYEAR.getMonth() + 1) + '/' + $scope.DATE.GRADUATEYEAR.getDate();

            }

            if ($scope.DATE.WORKBEGINDATE) {
                $scope.BA.WORKBEGINDATE = $scope.DATE.WORKBEGINDATE.getFullYear() + '/' + ($scope.DATE.WORKBEGINDATE.getMonth() + 1) + '/' + $scope.DATE.WORKBEGINDATE.getDate();
            }

            // console.log(JSON.stringify($scope.BA));
            // console.log($scope.CustomerTypeCode);
            // console.log($scope.BA.CUSTOMERID);

            runServiceWithSession($http, $ionicLoading, $ionicPopup, $state, "SaveCustomerHtmlData",
                {
                    HtmlVale: JSON.stringify($scope.BA),
                    CustoemrType: $scope.CustomerTypeCode,
                    CustomerID: $scope.BA.CUSTOMERID
                },
                function (data, status) {
                    if (data.array[0].ResultFlag == 'Y') {
                        appIonicLoading.hide();
                        appIonicLoading.show({
                            template: '暂存成功',
                            animation: 'fade-in',
                            showBackdrop: true,
                            duration: 2000
                        });
                    } else {
                        appIonicLoading.hide();
                        appIonicLoading.show({
                            template: '暂存失败',
                            animation: 'fade-in',
                            showBackdrop: true,
                            duration: 2000
                        });
                    }
                    //刷新页面
                    $timeout(function () {
                        $scope.$emit("To-RefreshIndCustomerList", {});
                        //$scope.addCustomerModal.hide();
                    }, 3000);

                });


        };

        // 个人、公司客户保存
        $scope.CustomerSave = function () {

           /* // 重置边框提示颜色
            $scope.RequiredInputArray.map(function (array) {
                return array.jqobj.css('border-color', '#d4d0d0')
            });*/
           /* $scope.RequiredSelectArray.map(function (array) {
                return array.jqobj.css('border-color', '#d4d0d0')
            });*/
            $scope.RequiredTextAreaArray.map(function (array) {
                return array.jqobj.css('border-color', '#d4d0d0')
            });

            $scope.nullFlag = 0;
            $scope.titleArray = [];
            // console.log($scope.RequiredInputArray);
           /* for (var i = 0; i < $scope.RequiredInputArray.length; i++) {
                $scope.ngmodelValue = $scope.$eval($scope.RequiredInputArray[i].modelValue);
                // console.log($scope.ngmodelValue);
                if ($scope.ngmodelValue == null || $scope.ngmodelValue == '') {
                    if($scope.RequiredInputArray[i].title){
                        $scope.titleArray.push($scope.RequiredInputArray[i].title);
                        // console.log($scope.titleArray);
                        $scope.RequiredInputArray[i].jqobj.css('border-color', '#f00');
                        $scope.nullFlag++;
                    }

                }
            }*/
            /*for (var j = 0; j < $scope.RequiredSelectArray.length; j++) {
                $scope.ngmodelValue = $scope.$eval($scope.RequiredSelectArray[j].modelValue);
                if ($scope.ngmodelValue == null || $scope.ngmodelValue == '') {

                    if($scope.RequiredSelectArray[j].title){
                        $scope.titleArray.push($scope.RequiredSelectArray[j].title);
                        // console.log($scope.titleArray);
                        $scope.RequiredSelectArray[j].jqobj.css('border-color', '#f00');
                        $scope.nullFlag++;
                    }

                }
            }*/
           /* for (var k = 0; k < $scope.RequiredTextAreaArray.length; k++) {
                $scope.ngmodelValue = $scope.$eval($scope.RequiredTextAreaArray[k].modelValue);
                if ($scope.ngmodelValue == null || $scope.ngmodelValue == '') {
                    if($scope.RequiredTextAreaArray[k].title){
                        $scope.titleArray.push($scope.RequiredTextAreaArray[k].title);
                        // console.log($scope.titleArray);
                        $scope.RequiredTextAreaArray[k].jqobj.css('border-color', '#f00');
                        $scope.nullFlag++;
                    }

                }
            }*/


            if ($scope.nullFlag > 0) {
                setTimeout(function () {
                    //alert("请输入红色框的值")
                    appIonicLoading.show({
                        template: '请填写：' + $scope.titleArray.toString(),
                        animation: 'fade-in',
                        showBackdrop: true,
                        duration: 2000
                    });
                }, 100);
                return;
            }


            //设置保存参数
            $scope.BA.TEMPSAVEFLAG = '2'


            // TODO:保存方法待验证 laker 0209 9:28

            appIonicLoading.show({
                template: '正在保存数据',
                animation: 'fade-in',
                showBackdrop: true,
                duration: 30000
            });

            if ($scope.DATE.SETUPDATE) {
                $scope.BA.SETUPDATE = $scope.DATE.SETUPDATE.getFullYear() + '/' + ($scope.DATE.SETUPDATE.getMonth() + 1) + '/' + $scope.DATE.SETUPDATE.getDate();
            }

            if ($scope.DATE.ACCOUNTDATE) {
                $scope.BA.ACCOUNTDATE = $scope.DATE.ACCOUNTDATE.getFullYear() + '/' + ($scope.DATE.ACCOUNTDATE.getMonth() + 1) + '/' + $scope.DATE.ACCOUNTDATE.getDate();
            }

            if ($scope.DATE.BIRTHDAY) {
                $scope.BA.BIRTHDAY = $scope.DATE.BIRTHDAY.getFullYear() + '/' + ($scope.DATE.BIRTHDAY.getMonth() + 1) + '/' + $scope.DATE.BIRTHDAY.getDate();
            }

            if ($scope.DATE.CREDITDATE) {
                $scope.BA.CREDITDATE = $scope.DATE.CREDITDATE.getFullYear() + '/' + ($scope.DATE.CREDITDATE.getMonth() + 1) + '/' + $scope.DATE.CREDITDATE.getDate();
            }


            if ($scope.DATE.GRADUATEYEAR) {
                $scope.BA.GRADUATEYEAR = $scope.DATE.GRADUATEYEAR.getFullYear() + '/' + ($scope.DATE.GRADUATEYEAR.getMonth() + 1) + '/' + $scope.DATE.GRADUATEYEAR.getDate();

            }

            if ($scope.DATE.WORKBEGINDATE) {
                $scope.BA.WORKBEGINDATE = $scope.DATE.WORKBEGINDATE.getFullYear() + '/' + ($scope.DATE.WORKBEGINDATE.getMonth() + 1) + '/' + $scope.DATE.WORKBEGINDATE.getDate();
            }
            runServiceWithSession(
            	 $http,
                 $ionicLoading, 
                 $ionicPopup, 
                 $state, 
                 "SaveCustomerHtmlData",
                {
                    HtmlVale: JSON.stringify($scope.BA),
                    CustoemrType: $scope.CustomerTypeCode,
                    CustomerID: $scope.BA.CUSTOMERID
                },
                function (data, status) {
                    if (data.array[0].ResultFlag == 'Y') {
                        appIonicLoading.hide();
                        appIonicLoading.show({
                            template: '保存成功',
                            animation: 'fade-in',
                            showBackdrop: true,
                            duration: 2000
                        });

                    } else {
                        appIonicLoading.hide();
                        appIonicLoading.show({
                            template: '保存失败',
                            animation: 'fade-in',
                            showBackdrop: true,
                            duration: 2000
                        });
                    }

                    //刷新页面
                    $timeout(function () {
                        $scope.$emit("To-RefreshIndCustomerList", {});
                        //$scope.addCustomerModal.hide();
                    }, 3000);


                });
        };


        //********************* 企业类型 *********************/

        //企业类型模板
        $ionicModal.fromTemplateUrl('templates/customerManagement/orgType-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.OrgTypeModal = modal;
        });

        //加载企业类型
        var loadOrgType = function () {
            appIonicLoading.show({
                template: '正在加载...',
                animation: 'fade-in',
                showBackdrop: true,
                duration: 30000
            });
            runServiceWithSession($http, undefined, $ionicPopup, $state, 'getCodeItems', {CodeNo: 'OrgType'}, function

                (data, state) {
                appIonicLoading.hide();
                $scope.OrgTypes = data.array;
                for (var i = 0; i < $scope.OrgTypes.length; i++) {
                    if (i !== $scope.OrgTypes.length - 1) {
                        // console.log(i);
                        if ($scope.OrgTypes[i].ItemNo === $scope.OrgTypes[i + 1].ItemNo.substr(0, $scope.OrgTypes

                                [i].ItemNo.length)) {
                            $scope.OrgTypes[i].IsLevel = false;
                        } else {
                            $scope.OrgTypes[i].IsLevel = true;
                        }
                    } else {
                        $scope.OrgTypes[i].IsLevel = true;
                    }
                    // console.log($scope.OrgTypes[i]);

                }

                // console.log($scope.OrgTypes);

            })
        };

        //企业类型
        $scope.getOrgType = function () {
            $scope.OrgTypeModal.show();
            loadOrgType();
        };

        //确认选择企业类型
        $scope.confirm = function (item) {
            if (item.IsLevel) {
                $scope.BA.ORGTYPE = item.ItemNo;
                $scope.BA.ORGTYPENAME = item.ItemName;
                $scope.OrgTypeModal.hide();
            }

        };

        //********************* 企业类型 END *********************/


        //*************  国标行业分类 ********************/

        //国标行业分类模板
        $ionicModal.fromTemplateUrl('templates/customerManagement/industryType-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.IndustryTypeModal = modal;
        });


        var loadIndustryType = function () {
            appIonicLoading.show({
                template: '正在加载...',
                animation: 'fade-in',
                showBackdrop: true,
                duration: 30000
            });
            $scope.IndustryTypes = [];
            $scope.LevelTypes = [];
            runServiceWithSession($http, undefined, $ionicPopup, $state, 'getCodeItems', {CodeNo: 'IndustryType'}, function

                (data, state) {
                appIonicLoading.hide();
                data.array.forEach(function (i) {
                    if (i.ItemNo.length !== 5) {
                        $scope.IndustryTypes.push(i);
                    } else {
                        $scope.LevelTypes.push(i);
                    }
                });

                // $scope.IndustryTypes = data.array;
                for (var i = 0; i < $scope.IndustryTypes.length; i++) {
                    if (i !== $scope.IndustryTypes.length - 1) {
                        if ($scope.IndustryTypes[i].ItemNo === $scope.IndustryTypes[i + 1].ItemNo.substr(0,

                                $scope.IndustryTypes[i].ItemNo.length)) {
                            $scope.IndustryTypes[i].IsLevel = false;
                            $scope.IndustryTypes[i].ShowSub = false;
                        } else {
                            $scope.IndustryTypes[i].IsLevel = true;
                        }
                    } else {
                        $scope.IndustryTypes[i].IsLevel = true;
                    }
                    if ($scope.IndustryTypes[i].ItemNo.length === 1) {
                        $scope.IndustryTypes[i].IsShow = true;
                    } else {
                        $scope.IndustryTypes[i].IsShow = false;
                    }

                }

            })
        };

        //国标行业分类
        $scope.getIndustryType = function () {
            // alert(typeof cordova.plugins.Keyboard);
            // if ($cordovaKeyboard) {
            //     // $cordovaKeyboard.close();
            // }
            $('#IndustryTypeName').focus(function () {
                document.activeElement.blur();
            })
            // var eles=document.getElementsByName("IndustryTypeName");
            // for(var i=0;i<eles.length;i++){
            //     eles[i].blur();
            // }
        
            $scope.IndustryTypeModal.show();
            loadIndustryType();
            $scope.showFirstPage = true;
        };

        $scope.backToFirstPage = function () {
            $scope.showFirstPage = true;
        };

        //过滤选项
        var filterTypes = function (itemNo) {
            $scope.levels = [];
            $scope.LevelTypes.forEach(function (i) {
                var str = i.ItemNo.substr(0, itemNo.length);
                if (str == itemNo) {
                    $scope.levels.push(i);
                }
            });
        };

        //确认选择国标行业分类
        $scope.confirmIndustryTypeClass = function (item) {
            if (item.IsLevel) {
                // $scope.BA.INDUSTRYTYPE = item.ItemNo;
                // $scope.BA.INDUSTRYTYPENAME = item.ItemName;
                // $scope.IndustryTypeModal.hide();
                $scope.showFirstPage = false;
                filterTypes(item.ItemNo);
                $ionicScrollDelegate.scrollTop();
            } else {
                //张开或收起
                item.ShowSub = !item.ShowSub;
                if (item.ShowSub) {
                    var length = 0;
                    if (item.ItemNo.length === 1) {
                        length = 3;
                    } else if (item.ItemNo.length === 3) {
                        length = 4;
                    } else if (item.ItemNo.length === 4) {
                        length = 5;
                    }
                    $scope.IndustryTypes.forEach(function (i) {
                        if (item.ItemNo === i.ItemNo.substr(0, item.ItemNo.length) && i.ItemNo.length === length) {
                            i.IsShow = true;
                        }

                    });
                } else {
                    $scope.IndustryTypes.forEach(function (i) {
                        if (item.ItemNo === i.ItemNo.substr(0, item.ItemNo.length) && i.ItemNo.length > item.ItemNo.length) {
                            i.IsShow = false;
                            if (i.ShowSub) {
                                i.ShowSub = false;
                            }
                        }

                    });
                }

            }

        };

        $scope.confirmIndustryType = function (item) {
            $scope.BA.INDUSTRYTYPE = item.ItemNo;
            $scope.BA.INDUSTRYTYPENAME = item.ItemName;
            $scope.IndustryTypeModal.hide();

        };

        //*************  国标行业分类 END ********************/

    })
    .controller('IndCustomerSearchController', function ($scope, $rootScope, $state, $timeout, $ionicModal,
                                                            $ionicLoading, basePage, $http, $ionicPopup, $compile) {
					var loadData = function() {
						$scope.CustomerInfo = {
							customerID : "",
							customerName : "",
							certID : ""
						};
					};
					// 清空查询
					$scope.clearData = function() {
						$scope.CustomerInfo = {
							customerID : "",
							customerName : "",
							certID : ""
						};
					};
					// 模糊查询方法
					$scope.searchinfo = function() {
						// 关闭查询搜索框
						$rootScope.Customer = false;
						// 将数据广播到父级controller
						$scope.$emit('ToIndCustomerInfo', $scope.CustomerInfo);
					};
					// 页面加载时，执行loadData方法
					basePage.init($scope, loadData);
        
      /*
		 * // console.log(AmApp.user);
		 * 
		 * $scope.savePotentialCustomer = function () {
		 * $scope.customer.IputUserID = AmApp.userID; $scope.customer.InputOrgID =
		 * AmApp.orgID; $scope.customer.CustomerType = '03';
		 * 
		 * //数据校验 if ($scope.customer.CustomerName === '' ||
		 * $scope.customer.CustomerName === undefined ||
		 * $scope.customer.CustomerName === null || $scope.customer.CustomerName
		 * === 'null') { $ionicLoading.show({ template: '请填写客户姓名', duration:
		 * 1000 }); return false; }
		 * 
		 * if ($scope.customer.DocumentType === '' ||
		 * $scope.customer.DocumentType === undefined ||
		 * $scope.customer.DocumentType === null || $scope.customer.DocumentType
		 * === 'null') { $ionicLoading.show({ template: '请填写证件类型', duration:
		 * 1000 }); return false; }
		 * 
		 * if ($scope.customer.CorpID === '' || $scope.customer.CorpID ===
		 * undefined || $scope.customer.CorpID === null ||
		 * $scope.customer.CorpID === 'null') { $ionicLoading.show({ template:
		 * '请填写证件号码', duration: 1000 }); return false; }
		 * 
		 * if ($scope.customer.CorpIDORG === '' || $scope.customer.CorpIDORG ===
		 * undefined || $scope.customer.CorpIDORG === null ||
		 * $scope.customer.CorpIDORG === 'null') { $ionicLoading.show({
		 * template: '请填写证件法办机构', duration: 1000 }); return false; }
		 * 
		 * if ($scope.date.Birthday === '' || $scope.date.Birthday === undefined ||
		 * $scope.date.Birthday === null || $scope.date.Birthday === 'null') {
		 * $ionicLoading.show({ template: '请填写出身日期', duration: 1000 }); return
		 * false; }
		 * 
		 * 
		 * if ($scope.customer.ResIDEntialAddRess === '' ||
		 * $scope.customer.ResIDEntialAddRess === undefined ||
		 * $scope.customer.ResIDEntialAddRess === null ||
		 * $scope.customer.ResIDEntialAddRess === 'null') { $ionicLoading.show({
		 * template: '请填写居住地址', duration: 1000 }); return false; }
		 * 
		 * if ($scope.customer.PhoneNumber === '' || $scope.customer.PhoneNumber
		 * === undefined || $scope.customer.PhoneNumber === null ||
		 * $scope.customer.PhoneNumber === 'null') { $ionicLoading.show({
		 * template: '请填写手机号码', duration: 1000 }); return false; }
		 * 
		 * if ($scope.customer.FMonthlyIncome === '' ||
		 * $scope.customer.FMonthlyIncome === undefined ||
		 * $scope.customer.FMonthlyIncome === null ||
		 * $scope.customer.FMonthlyIncome === 'null') { $ionicLoading.show({
		 * template: '请填写家庭月收入', duration: 1000 }); return false; }
		 * 
		 * if ($scope.customer.PostalAddRess === '' ||
		 * $scope.customer.PostalAddRess === undefined ||
		 * $scope.customer.PostalAddRess === null ||
		 * $scope.customer.PostalAddRess === 'null') { $ionicLoading.show({
		 * template: '请填写通讯地址', duration: 1000 }); return false; }
		 * 
		 * if ($scope.customer.PannualIncome === '' ||
		 * $scope.customer.PannualIncome === undefined ||
		 * $scope.customer.PannualIncome === null ||
		 * $scope.customer.PannualIncome === 'null') { $ionicLoading.show({
		 * template: '请填写个人年收入', duration: 1000 }); return false; }
		 * 
		 * if ($scope.customer.PannualIncome === '' ||
		 * $scope.customer.PannualIncome === undefined ||
		 * $scope.customer.PannualIncome === null ||
		 * $scope.customer.PannualIncome === 'null') { $ionicLoading.show({
		 * template: '请填写个人年收入', duration: 1000 }); return false; }
		 * 
		 * if
		 * (!/^(13|14|15|16|17|18|19)\d{9}$/i.test($scope.customer.PhoneNumber)) {
		 * $ionicLoading.show({ template: '请输入正确的手机号码', duration: 1000 });
		 * return false;
		 *  }
		 * 
		 * if ($scope.customer.DocumentType == 0 &&
		 * !$scope.IDverification($scope.customer.CorpID)) { return false; }
		 * 
		 * 
		 * //日期转换 $scope.customer.Birthday = $scope.date.Birthday.getFullYear() +
		 * '/' + ($scope.date.Birthday.getMonth() + 1) + '/' +
		 * $scope.date.Birthday.getDate();
		 * 
		 * runServiceWithSession( $http, $ionicLoading, $ionicPopup, $state,
		 * "addstrangeCustomer", $scope.customer, function (data, status) { if
		 * ("Y" == data.array['0'].ResultFlag) { $ionicLoading.show({ template:
		 * '保存成功', duration: 1000 }); } else { $ionicLoading.show({ template:
		 * '保存失败', duration: 1000 }); }
		 * 
		 * //刷新页面 $timeout(function () { $scope.$emit("To-RefreshCustomerList",
		 * {}); $scope.modal.remove(); }, 1000);
		 * 
		 * }); $scope.closeCustomerModal();
		 *  };
		 */
       /* var loadData = function () {
            $scope.getExperience();
            $scope.getDegree();
            $scope.getCertType();
            $scope.getMaritalStatus();
        };*/

       /* basePage.init($scope, loadData);

        $scope.goBack = function () {
            $scope.modal.remove();
        }*/
    })