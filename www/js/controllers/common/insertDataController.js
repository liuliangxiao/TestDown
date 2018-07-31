angular
    .module('com.amarsoft.mobile.controllers.insertData', [])      
    .controller('insertDataController', function ($scope, $rootScope,$http, $ionicLoading, $ionicPopup, $state) {   

		$scope.$on("insertData",function(e,insertData){
			$scope.param = {
				tabTitle:insertData.tabTitle,
				ngStyle:"addMarketStyle"
		    }       
		        //填充模态页
		    $scope.createModalData = function (){
		    	//页面解析数组
		    	$scope.createHtmlModal = [];
		    	//可更新对象
		    	$scope.createInfo = {};
		    	//不可更新对象
		    	$scope.createInfoNoUpdate = {};
		    	//加载新增模版
				runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
						insertData.url,insertData.param, function (data, status) {
					if(typeof(data["array"]) === "object"){
						for (var i = 0; i < data["array"].length; i++) {
							data["array"][i]['CreateShowGroup'] = true;
		                    $scope.createHtmlModal.push(data["array"][i]);
							$scope.groupColArray = data["array"][i].groupColArray;
							for(var j = 0; j < $scope.groupColArray.length;j++){  
								if($scope.groupColArray[j].ColUpdateable == '1'){
									$scope.createInfo[$scope.groupColArray[j].KeyId] = $scope.groupColArray[j].Value;                        		
								} else {
									$scope.createInfoNoUpdate[$scope.groupColArray[j].KeyId] = $scope.groupColArray[j].Value;                        		                       		
								}
							}
						}
						//初始化默认数据（显示固定字段值）
						$scope.$emit("toDetailAfter",{"createInfo":$scope.createInfo,"createInfoNoUpdate":$scope.createInfoNoUpdate})
						//获取option中的值
						if($scope.includeContent === "templates/common/tabDetailInfo.html" || $scope.includeContent === "templates/common/detailInfo.html" ||typeof($scope.includeTop) != "undefined"){
							insertData.param["ReturnType"] = "Code";
							runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
									insertData.url, insertData.param, function (data, status) {
								for (var i = 0; i < data["array"].length; i++) {
                                    if(typeof($scope["CODE_LIBRARY"]) === "undefined")	$scope["CODE_LIBRARY"] = {};
                                    $scope["CODE_LIBRARY"][data["array"][i]["KeyId"]] = data["array"][i]["CodeArray"];
									}
								});
							}
						}
					});
		        }
		    //控制模态页隐藏与展示
			$scope.CreateshowOrNot = function (item) {
				if (item.CreateShowGroup) {
					item.CreateShowGroup = false;
				} else {
					item.CreateShowGroup = true;
				}
			};
			//保存方法
			$scope.saveModel = function(){
				//具体实现方法在父类controller中；
				$scope.$emit("saveModel",$scope.createInfo);
			}
			
			
			$scope.createModalData();
			
		})
})