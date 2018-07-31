/**
 * Created by yyma 2017/1/16.
 */
/**
 * @file 客户管理
 * @author create by  yyma
 *        
 */
angular.module('com.amarsoft.mobile.controllers.CustomerDetailController', [])
		    // 客户管理首页
		.controller(
				'CustomerDetailController',
				function($scope, $rootScope, $ionicLoading, $ionicPopup, $http, $state, basePage, $ionicScrollDelegate,$ionicModal,$filter,$timeout,$ionicTabsDelegate) {
			    	   // add by yyma                    
			    	/**
					 * 定义对象
					 */  			    	    
			            $scope.businessApplyInfo = {};// 客户详细信息
			        	$scope.inputTextLength = 100;// 输入提示 
			        	$scope.changeModel = function(model,data,index){
							$scope.menuModel.menuid=model.menuid;
							if(model.menuid=="02"){
								$state.go('customerManagement');
							}else {
								$timeout(function(){
									$scope.$emit("to-DetailController",data);
									},500);
							}
			        	};
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
			    	   $scope.menuModel.menuid="01"; 
			           $scope.details = [];//接受服务端传来的信息 
			           if(data){
			               runServiceWithSession(
			                   $http,
			                   $ionicLoading,
			                   $ionicPopup,
			                   $state,
			                   "SelectCustomerInfo",{                  
			                       CustomerID: data.CustomerID,
			                       ReturnType: "Info" 
			                   },
			                   function (data, status) {
			                   for(var i=0;i<data["array"].length;i++){
			                   	//控制页面上杀是否展示的字段;
			                   	data["array"][i]['showGroup']=true;
			                   	$scope.details.push(data["array"][i]);
			                   	//获取json字符串中的groupColArray的数据，按照json格式<KeyId:Value>保存到$scope.CustomerInfo中
			                   	$scope.groupColArray=data["array"][i].groupColArray;
			                   	for(var j=0;j<$scope.groupColArray.length;j++){
			                   		$scope.businessApplyInfo[$scope.groupColArray[j].KeyId]=$scope.groupColArray[j].Value;                                  
			                      }  
			                   }
			                   if($scope.SelectedCustomerList.LockStatusNo == "1"){
			                	   runServiceWithSession(
			                    		   $http,
			                               $ionicLoading,
			                               $ionicPopup,
			                               $state,
			                               "SelectCustomerInfo",{                  
			                                   CustomerID: $scope.SelectedCustomerList.CustomerID,
			                                   ReturnType: "Code" 
			                               },function (data, status) {
			                            	   for(var j=0;j<data["array"].length;j++){
                                                   if(typeof($scope["CODE_LIBRARY"]) === "undefined")	$scope["CODE_LIBRARY"] = {};
                                                   $scope["CODE_LIBRARY"][data["array"][j]["KeyId"]] = data["array"][j]["CodeArray"];
			                            	   }
			                               });
			                   }
			                   
			                   
			                   appIonicLoading.hide();
			              });
			            }else {
			           	 $scope.detail=[];
			             $scope.info.noData= true;//个人客户详情显示"暂无数据"的显示模态框

			            }
			       })
			       
			        // 小企业 、个人、公司客户保存
			        $scope.CustomerSave = function () {
			           
			    	   /* $scope.BA.TEMPSAVEFLAG = '2' ;*/
			           appIonicLoading.show({
			               template: '正在保存数据',
			               animation: 'fade-in',
			               showBackdrop: true,
			               duration: 3000
			           });
			        	if(!IsNotNull($scope.businessApplyInfo.SellSum)){
			        		$ionicPopup.alert({title:'填写错误',template:'营业收入不能为空'});
			        	}
			        	if(!IsNotNull($scope.businessApplyInfo.TotalAssets)){
			        		$ionicPopup.alert({title:'填写错误',template:'资产总额不能为空'});
			        	}
			            console.log("*************save*************dealNo="+$scope.dealNo);          
			          
			           runServiceWithSession(
			            	 $http,
			                 $ionicLoading, 
			                 $ionicPopup, 
			                 $state, 
			                 $scope.dealNo,
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