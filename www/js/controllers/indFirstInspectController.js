angular
	.module('com.amarsoft.mobile.controllers.indFirstInspectController', ['ngSanitize', 'ngAnimate'])

	// 贷后首检主界面
	.controller(
	'indFirstInspectController',
	function ($http,$scope, $ionicTabsDelegate, $ionicScrollDelegate, $ionicPopup, $state, $rootScope,paging) {

	    //贷后管理父控制器
	    $scope.checkTypes = [
	        {
	            ItemNo: '01010',
	            ItemName: '贷后首检',
	            
	        },
	        {
	            ItemNo: '01020',
	            ItemName: '定期检查'
	        }
	    ];
	    //默认下拉选择值
	    $scope.checkType = {ItemNo: '01010'};
	    
	    //选中list中的一行
	    $scope.selectOneRow = function (index, item) {
	    	$scope.selectedIndex = index; 
	    	scope.menuInfo = menu;
    		//刷新页面
        	paging.init($scope, $scope.pageSize, 1, loadData, true);
            $scope.refresh();
	    };

	    
	    //tab初始化数据
	    $scope.initData = function (index) {
	        //滚动到顶部
	        $ionicScrollDelegate.scrollTop();
	        appIonicLoading.show({
	            template: '加载中...',
	            animation: 'fade-in',
	            showBackdrop: true,
	            duration: 30
	        });
	        $scope.pageNo = 0;
	        if($scope.checkType.ItemNo === '01010'){
	            if(index === '0'){
	                //贷后首检-未完成
	                $scope.ItemNo = '01010010';
	                $scope.$broadcast('no-finish');
	            }else {
	                //贷后首检-已完成
	                $scope.ItemNo = '01010020';
	                $scope.$broadcast('no-finish');
	            }
	        }

	        // $scope.selectOneRow();
	        // paging.init($scope, pageSize, 1, loadData);
	    };

	    //下拉选择触发
	    $scope.selectChange = function () {
	        $ionicTabsDelegate.$getByHandle('root-tabs').select(0);
	        $scope.initData('0');
	    };

	  //默认菜单
		$scope.menuInfo = $rootScope.menuItems[0];
	})
.controller('NoFinishedController', function ($scope,$rootScope ,paging, $http, $ionicPopup, $state) {
    //加载数据
	$scope.data = {};
	$scope.menuModel = {};
	$scope.modelInfo = {};
    var pageSize = 10;
        var loadData = function($ionicLoading){
            runServiceWithSession($http, undefined, $ionicPopup, $state,
            'afterManainfo',
            {
                ItemNo: $scope.ItemNo,
                PageSize: pageSize,
                PageNo: $scope.pageNo
            },
            function (data, status) {
                appIonicLoading.hide();
                data.array.forEach(function (i) {
                    $scope.items.push(i);
                });

                $scope.loadingMore = false;
                if ($scope.items.length > 0) {
                    $scope.noData = false;
                    //有数据，默认选择第一行
                    $scope.selectOneRow(0, $scope.items[0]);
                } else {
                    $scope.noData = true;
                }
                $scope.hasMore = (($scope.pageNo - 1) * pageSize + data["array"].length < data.totalCount);
                $scope.$broadcast('scroll.refreshComplete');
                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
    };

    $scope.$on('no-finish', function (e, d) {
        paging.init($scope, pageSize, 1, loadData,true);
        $scope.refresh();
    });
})

.controller('ReportInfoController', function ($scope,$ionicScrollDelegate ,$ionicTabsDelegate, $http, $ionicLoading, $ionicPopup, $state, $ionicModal, paging,$filter) {
	$scope.items = [];
	$scope.hideAddButton = function () {
        if($ionicTabsDelegate.$getByHandle('info-tabs').selectedIndex() === 2){
            $scope.showButton = false;
        }else {
            $scope.showButton = true;
        }
    };
	
    $scope.insertRecord = function(){
    	$ionicModal.fromTemplateUrl('templates/inspect/afterLoanJumping.html', {
            scope: $scope,
            backdropClickToClose: false
        }).then(function (modal) {
            $scope.modal = modal;
            $scope.modal.show();
        });
    }
    $scope.info = [
                   ]
//                   $timeout(function(){
//               		$scope.info.push({ name:'111111'});
//               	},1000)
       
	   $scope.createContact = function() {  
	    runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
               "afterinfo", $scope.info, function (data, status) {
				if (data["array"][0].Result == "true") {
					$ionicLoading.show({
						template: "保存成功！",
						duration: 2000
					});   						
		        $scope.modal.hide();
				} else {
					$ionicLoading.show({
						template: "保存失败稍后重试",
						duration: 1500
					});
				}
	    });
	  }
  
  //接收广播 获取用户详细信息
    $scope.$on('select-row', function (e, data) {
    	 $ionicTabsDelegate.$getByHandle('info-tabs').select(0);
         $scope.params = data;

         if($scope.checkType.ItemNo === '01010' ){
             //用款记录
        	 indOrEntCapitalUsedList();
        	 //业务信息
//        	 indACCTLoan();
         }
    	
    })
   /* var indOrEntCapitalUsedList = function(){
    	$scope.items = [];
    	runServiceWithSession($http, undefined, $ionicPopup, $state,
    			'indOrEntCapitalUsedList',
    			{
    		SerialNo: $scope.params.SerialNo
    			},
    			function (data, status) {
    				data.array.forEach(function (i) {
    					$scope.items.push(i);
    				});
    				$scope.groupColArray = $scope.items[0].groupColArray;
    				if ($scope.groupColArray.length > 0) {
    					$scope.noData = false;
    					
    				} else {
    					$scope.noData = true;
    				}
    			});
    }
   */
    
    var indOrEntCapitalUsedList = function(){
    	 $ionicScrollDelegate.scrollTop();
         $scope.items = [];
         $scope.dataInfo= {};      	
         $scope.info = {show:false,noData:true};
    	runServiceWithSession($http, undefined, $ionicPopup, $state,
    			'indOrEntCapitalUsedList',{
    				SerialNo: $scope.params.SerialNo
    			},
    			function (data, status) {
                   	if(typeof(data["array"]) === "object"){
                   		$scope.items = data["array"];
                   		for (var i = 0; i < data["array"].length; i++) {
                   			data["array"][i]['showGroup'] = true;
                   			$scope.groupColArray = data["array"][i].groupColArray;
                   			for(var j = 0; j < $scope.groupColArray.length;j++){                           	
                   				$scope.dataInfo[$scope.groupColArray[j].KeyId] = $scope.groupColArray[j].Value;
                   			}
                   		}
                           $scope.info.noData = false;
                   	}else{
                           $scope.info.noData = true;
                   	}
                });
    }
    
   /* var indACCTLoan = function(){
    	 $ionicScrollDelegate.scrollTop();
         $scope.items = [];
         $scope.dataInfo= {};      	
         $scope.info = {show:false,noData:true};
    	 runServiceWithSession($http, undefined, $ionicPopup, $state,
    			'indACCTLoan',{
    				SerialNo: $scope.params.RelativeSerialNo1
    			},
    			function (data, status) {
	               	if(typeof(data["array"]) === "object"){
	               		$scope.items = data["array"];
	               		for (var i = 0; i < data["array"].length; i++) {
	               			data["array"][i]['showGroup'] = true;
	               			$scope.groupColArray = data["array"][i].groupColArray;
	               			for(var j = 0; j < $scope.groupColArray.length;j++){                           	
	               				$scope.dataInfo[$scope.groupColArray[j].KeyId] = $scope.groupColArray[j].Value;
	               			}
	               		}
	                       $scope.info.noData = false;
	               	}else{
	                       $scope.info.noData = true;
	               	}
          });
    }*/
})
;