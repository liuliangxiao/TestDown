
angular
    .module('com.amarsoft.mobile.controllers.inspect.load', [])
	.controller('inspectMenuController',function ($scope,$http, $rootScope, $ionicLoading, $ionicPopup, $state) {
		$rootScope.InspectMenuName= '贷后管理';
		//跳转个人首检
		$scope.indFirstInspeTouch = function(){
        	$state.go("indFirstInspect");
    	}
		//跳转公司首检
		$scope.entFirstInspeTouch = function(){
			$state.go("entFirstInspect");
		}
//		//跳转小企业首检
		$scope.smeFirstInspeTouch = function(){
			$state.go("smeFirstInspect");
		}
		//跳转个人定检
		$scope.indCustomerInspeTouch = function(){
			$state.go("indCustomerInspect");
		}
		//跳转公司定检
		$scope.entCustomerInspeTouch = function(){
			$state.go("entCustomerInspect");
		}
//		//跳转小企业定检
		$scope.smeCustomerInspeTouch = function(){
			$state.go("smeCustomerInspect");
		}
		
		
		//公用新增方法
		$rootScope.gotoCheckSelect= function(data,item){
			$scope.selName = data.selName;
			$scope.CustType = item.CustType;
			if(!$scope.CustType){
				$scope.CustType="";
			}
	        $scope.InspectType = data.InspectType;
	        $rootScope.InspectRefreshFlag =false;
	        var sDuebillNo=item.ObjectNo;
			if(!item){
				appIonicLoading.show({
		    		   template: "请先选择一条数据！",
		    		   animation: 'fade-in',
		    		   showBackdrop: true,
		    		   duration: 2000
		    	    });
				return false;
			}
			var Method = "InsertNewIndFirstInspect";
			if($scope.selName=="SelectCheckContract"){//小企业新增调用不同的实现方法
				Method = "InsertNewXQYFirstInspect";
			}
			runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
	                "SelectObjectList", {
					InspectType:$scope.InspectType,
					ObjectNo:sDuebillNo,
					CustType:$scope.CustType,
				 ClassName:"com.amarsoft.webservice.business.InspectImpl",
				 MethodName:Method,
				 Transaction:"Sqlca"
	            }, function (data, status) {
	            	if(data.Result=='N'){
	            		appIonicLoading.show({
				    		   template: "新增失败！",
				    		   animation: 'fade-in',
				    		   showBackdrop: true,
				    		   duration: 2000
				    	    });
	            	}else{
	            		var result = data["array"][0];
	                  	 if(result[0].Value=="SUCCESS"){
	                  		 appIonicLoading.show({
	       			    		   template: "新增成功！",
	       			    		   animation: 'fade-in',
	       			    		   showBackdrop: true,
	       			    		   duration: 2000
	       			    	    });
	                  		 $rootScope.InspectRefreshFlag =true;
	                  	 }
	            	}
	            });
		}
	})