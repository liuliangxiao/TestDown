/**
 * Created by amarsoft on 16-11-30.
 */
angular.module('com.amarsoft.mobile.controllers.query', [])


    .controller('queryControllers', function ($scope, $state, $ionicPopup, $ionicLoading, $timeout,
                                              $http, basePage,$rootScope) {
        $scope.info = {show: true};

        /* 查询个人客户信息 */
        $scope.IndCustomerQuery = function () {
            $state.go("ipadindquery");
            $rootScope.moduleSwitch('ipadquery',"query",{QueryType:"ipadindquery"});
        };
        /* 查询公司客户信息 */
        $scope.EntCustomerQuery = function () {
            $rootScope.moduleSwitch('ipadentquery',"query");
        };
        /* 查询信用等级评估信息 */
        $scope.CredDegreeQuery = function () {
            $rootScope.moduleSwitch('ipadcretquery',"query");
        };
        /* 查询申请信息 */
        $scope.ApplyInfoQuery = function () {
            $rootScope.moduleSwitch('ipadapplyquery',"query");
        };
        /* 查询授信台帐信息 */
        $scope.ContractQuery = function () {
            $rootScope.moduleSwitch('BusinessContract',"query");
        };
        /* 查询担保合同信息 */
        $scope.GuarantyQuery = function () {
            $rootScope.moduleSwitch('ipadguarantyquery',"query");
        };
        // add by yyma start
        /* 联网查询 */
        $scope.InternetQuery = function () {
            $rootScope.moduleSwitch('internetQuery',"query");
        };
        /* 反欺诈查询*/
        $scope.AntiFraudQuery = function () {
            $rootScope.moduleSwitch('AntiFraudQuery',"query");
        };
        /* 征信查询*/
        $scope.CreditQuery = function () {
            $rootScope.moduleSwitch('CreditQuery',"query");
        };
        
        /* 个人征信*/
        $scope.INDCheckRecord = function () {
            $rootScope.moduleSwitch('INDCheckRecord',"query");
        };
        /* 企业征信 */
        $scope.SMECheckRecord = function () {
            $rootScope.moduleSwitch('SMECheckRecord',"query");
        };
        // add by yyma start

        $scope.footActiveIndex = 1;

        basePage.init($scope);
    })

    /************************************************信息查询********************************************************/
    .controller('parentController', function ($scope, $rootScope, $ionicLoading, $ionicPopup, $http, $state, $stateParams, $model, $list, $detail) {

    	//获取路由传递的查询类型
    	$scope.queryType = $stateParams.QueryType;
    	
		$scope.param = {
				pageSize : 10,
				pageNo : 1,
				groupId : "marketingTask",
				className : "com.amarsoft.app.als.mobile.impl.MarketingTasksImpl",
				methodName : "queryIndInfo",
				menuTitle : "个人客户",
				tabTitle :"客户详情",
				flag : true
			}
		
		$model.init($scope);
		$list.load($scope,$scope.param);
		$detail.load($scope);
		
		var CustomerType = '03';
		var CustType = '04';
		
		//根据queryType，修改查询参数；
		if($scope.queryType == ''){
			
		}
		
		$scope.setListParam = function(queryaram){
			queryaram["sCustomerType"] = CustomerType; 
			queryaram["sCustType"] = CustType;
			queryaram["sUserID"] = AmApp.userID;
		}
		
		

    })

