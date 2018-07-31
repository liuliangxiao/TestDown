/**
 * 授信台帐 -- 借据  controller
 * Created by yyma on 2018年01月23日 
 */
angular
    .module('com.amarsoft.mobile.controllers.acctloan', [])
	.controller('AcctPaymentListController',function ($scope,$http,$ionicModal,$ionicLoading, $state,$ionicScrollDelegate,$ionicPopup,$timeout) {
		var iPageSize = 6;
        $scope.items = [];
		//担保详细信息
        $scope.detailInfo = {};
        //担保不可更新信息
        $scope.detailInfoNoUpdate = {};
        //列表-详情控制参数
        $scope.rightContentListShowFlag = true;
        //押品按钮控制
        $scope.guarantyContr = false;
        //获取担保列表信息
        $scope.$on('to_AcctLoanListData',function(e,data){
        	$scope.details1 = [];
        	$scope.ObjectNo = data.ObjectNo;
        	$scope.ObjectType = data.ObjectType;
            $ionicScrollDelegate.$getByHandle('detailScrollHandle').scrollTop();
			var serviceName = "SelectAcctLoanList";
			var serviceData = {
				ObjectType:data.ObjectType,
				ObjectNo:data.ObjectNo
			}			
            runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
                    serviceName, serviceData, function (data, status) {
                        for (var i = 0; i < data["array"].length; i++) {
                            //增加参数，是否展示，页面载入时均展示
                        	data["array"][i]['showGroup'] = true;
                        		$scope.details1.push(data["array"][i]);                        	                     
                        }                          
                    });			
        })
	    
	})