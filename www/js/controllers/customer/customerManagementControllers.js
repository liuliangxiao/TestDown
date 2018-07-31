/**
 * Created by yyma 2017/1/16.
 */
/**
 * @file 客户管理
 * @author create by  yyma
 *        
 */
angular.module('com.amarsoft.mobile.controllers.customerManagement', [])
		    // 客户管理首页
		.controller(
				'CustomerManagementController',
				function($scope, $rootScope, $state, basePage, $timeout,
						$ionicPopup, $ionicModal, $ionicLoading, $http,
						$compile,$ionicTabsDelegate) { 
					/**
					 * 切换tab按钮 yyma
					 * 
					 * @param index
					 *            索引
					 */	    	
                   $scope.dealNo="";//客户保存的交易编号
					// 三级级菜单
					$scope.menuModel = [ {
						menuid : "01",
						menuname : "基本信息"
					}, {
						menuid : "02",
						menuname : "影像资料"
					} ];
					//二级菜单
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
						$scope.dealNo="ENTCustomerInfoAOU";//公司客户保存的交易编号
						$scope.searchData.CustomerType = "01";
						$scope.searchData.CustType = "01";
					} else if (AmApp.loanType == "SME") {
						$scope.CustomerDetailView=true;//默认跳出列表页时，跳出相应的详情页面
						$scope.IndCustomerView = true;//公司客户列表,个人客户列表页面不可见					
						$scope.selectMenuRow = "1";// 点击客户管理，默认选中“小企业”菜单
						$scope.dealNo="SMECustomerInfoAOU";//小企业保存的交易编号
						$scope.searchData.CustomerType = "01";
						$scope.searchData.CustType = "03";
					} else if (AmApp.loanType == "IND") {
						$scope.CustomerDetailView=true;//默认跳出列表页时，跳出相应的详情页面
						$scope.IndCustomerView = true;//个人客户列表页面可见					
						$scope.selectMenuRow = "2";// 点击客户管理，默认选中“个人客户”菜单
						$scope.dealNo="INDCustomerInfoAOU";//个人客户保存的交易编号
						$scope.searchData.CustomerType = "";
						$scope.searchData.CustType = "04";
					} else {//如果用户的LoanType为null时，默认选中公司客户
						$scope.CustomerDetailView=true;//默认跳出列表页时，跳出相应的详情页面
						$scope.IndCustomerView = true;//个人客户列表页面不可见						
						$scope.selectMenuRow = "0"; // 点击客户管理，默认选中“公司客户”菜单
						$scope.dealNo="ENTCustomerInfoAOU";//公司客户保存的交易编号
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

})