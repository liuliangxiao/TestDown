/**
 * Created by yyma 2017/1/16.
 */
/**
 * @file 客户管理
 * @author create by  yyma
 *        
 */
angular.module('com.amarsoft.mobile.controllers.CustomerSearchController', [])
		    // 客户管理首页
.controller('CustomerSearchController', function ($scope, $rootScope, $state, $timeout, $ionicModal,
                                                            $ionicLoading, basePage, $http, $ionicPopup, $compile,$ionicTabsDelegate) {
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
					
    })