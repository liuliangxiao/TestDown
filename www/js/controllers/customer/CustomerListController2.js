/**
 * Created by yyma 2017/1/16.
 */
/**
 * @file 客户管理
 * @author create by  yyma
 *        
 */
angular.module('com.amarsoft.mobile.controllers.CustomerListController', [])
		    // 客户管理首页
		.controller(
				'CustomerListController',
				function($scope, $rootScope, $state, $timeout, $ionicModal,
						$ionicLoading, paging, $http, $ionicPopup,$ionicScrollDelegate,$ionicTabsDelegate) { 
					
					                //客户详情跳转
									$scope.gotoCustomerDetail = function(item, index) {
										$scope.selectedRow = index;
										$scope.SelectedCustomerList = item;
										//$scope.menuModel[0].menuid="01";	
										$ionicTabsDelegate.select(0);
										appIonicLoading.show({
											template : '正在加载中',
											animation : 'fade-in',
											showBackdrop : true,
											duration : 3000
										});
										$scope.$emit("to-DetailController", item)
									}; 
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
										 appIonicLoading.show({
								                template: '正在加载中',
								                animation: 'fade-in',
								                showBackdrop: true,
								                duration: 1000
								            });
										$scope.refresh();
							            $ionicScrollDelegate.$getByHandle('smallScrollTop').scrollTop();

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
															$ionicTabsDelegate.select(0);
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
														appIonicLoading.hide(); 
													} 
												});
									};
									paging.init($scope, iPageSize, 1, loadData,true);
									 //延迟加载
									appIonicLoading.show({
										template : '正在加载中',
										animation : 'fade-in',
										showBackdrop : true,
										duration : 3000
									});
								  $scope.refresh(); 
				    
})