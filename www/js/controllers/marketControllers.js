/**
 * Created by cwxu on 17-8-24.
 */
angular
    .module('com.amarsoft.mobile.controllers.market', [])      
    .controller('marketController', function ($scope, $rootScope ,$state,$ionicLoading) {              
        $scope.waitCreate = function (){
        	$ionicLoading.show({
                template: "当前页面仅开发了【营销任务建立】和【营销信息管理】模块，后续敬请期待 ~~！",
                duration: 2000
            }); 
        }
        /*营销任务管理*/
        $scope.marketTask = function ()  {
            $rootScope.moduleSwitch('markerTask',"marketing");

        }
              
        /*营销信息管理*/
        $scope.marketIndquery = function () {
            $state.go("marketIndquery");
        };
        
    })
    
    /******************新需求（新增controller修改调用了老的需求）-start********************/
    //******************营销任务管理主页-start***************//
    .controller('marketTaskController', function ($db_operate,$ionicModal,$scope,$model,$list,$detail,$timeout,$filter,$http,
    		$ionicLoading,$ionicPopup, $state) {
			$scope.param = {
				pageSize : 10,
				pageNo : 1,
				groupId : "marketingTask",
				className : "com.amarsoft.app.als.mobile.impl.MarketingTasksImpl",
				methodName : "queryIndInfo",
				menuTitle : "营销线索",
				tabTitle :"营销信息",
				flag : true
			}
		
			$model.init($scope);
			$list.load($scope,$scope.param);
			$detail.load($scope);
		
			$scope.setListParam = function(queryaram){
				queryaram["MarketingStatus"] = $scope.selectedMenuItem["ColId"];
			}
			
			$scope.setDetailParam = function(modelInfo,detailParam){
	    	   if(typeof($scope.selectedListItem) !== "undefined"){
	    		   if(typeof(modelInfo["Action"]) === "undefined" ||
					   modelInfo["Action"] === "" ||
					   modelInfo["Action"] === null){
	    			   detailParam.url = "marketInfoQuery";
	    		   }else{
	    			   detailParam.url = modelInfo["Action"];
	    		   }

	    		   detailParam["queryData"]["SerialNo"] = $scope.selectedListItem["SerialNo"];
	    	   }
	    	   detailParam["queryData"]["ReturnType"] = "Info";
			}
			$scope.saveModelBefore = function(){
				//主键
				$scope.modelDataInfo.data.SerialNo  = $scope.detailInfo.SerialNo;
	    	    $scope.modelDataInfo.tableCode = "0001";
				$scope.modelDataInfo.data.UpdateDate  = $filter('date')(new Date(),"yyyy/MM/dd");
	        }
			//新增与修改方法
			$scope.insertRecord = function(){
				//新增修改指向控制符
				$scope.saveModelFlag = "insert";
				//执行后，页面刷新控制符
				$scope.goDetailTopFlag  = false;
				if($scope.selectedListItem == null || $scope.selectedListItem == "undefined" || typeof($scope.selectedListItem) == "undefined"){
					$ionicLoading.show({
						title: "业务处理",
						template: "请选择一条记录！",
						duration: 1500
					});
				}else{
					//打开模态页(可重写)
			        $ionicModal.fromTemplateUrl('templates/common/commonModelView/insertData.html', {
			            scope: $scope,
			            backdropClickToClose: false
			        }).then(function (modal) {
			        	//判断如果业务条线为空，提示并不弹出复选框
			    		$scope.modal = modal;
			    		$scope.modal.show();
			    		//设置加载模态页结构所需参数
			    		var detailModalQueryParam = {url:"",param:{},tabTitle:"新增营销信息"};
			    		detailModalQueryParam.url = "marketInfoQuery";
			    		detailModalQueryParam["param"]["ReturnType"] = "Info";
			    		detailModalQueryParam["param"]["TableCode"] = "0001";
			    		$scope.$broadcast("insertData",detailModalQueryParam);
			    	})  
			    	//设置新增对象的默认字段及不可更新数据的展示
			    	$scope.$on("toDetailAfter",function(e,data){
			    		$scope.toListDetailAfter(data.createInfo,data.createInfoNoUpdate);
			    	})
				}

				$scope.toListDetailAfter = function(createInfo,createInfoNoUpdate){
					createInfo["MarketingChannel"] = "APP";
					createInfo["MarketingStatus"] = "10";
					createInfo["OperateUserID"] = AmApp.userID;
					createInfo["OperateOrgID"] = AmApp.orgID;
					createInfo["InputUserID"] =  AmApp.userID;
					createInfo["InputOrgID"] = AmApp.orgID;
					createInfo["PutOutOrgID"] = AmApp.orgID;      
					createInfo["InputDate"] = $filter('date')(new Date(),"yyyy/MM/dd");
					createInfo["UpdateDate"] = $filter('date')(new Date(),"yyyy/MM/dd");   
					//页面 不可更新数据					
					createInfoNoUpdate["InputUserName"] =AmApp.userName;
					createInfoNoUpdate["InputOrgName"] = AmApp.orgName;                                                
				}
				//新增与保存
				$scope.$on("saveModel",function(e, data){
					if($scope.saveModelFlag == "insert"){
						//执行新增操作（成功后，页面刷新；新增数据会展示在list页面顶端）
						$db_operate.insertRecord($scope,"0001",data);
						$scope.saveModelFlag = "update";
					}else if($scope.saveModelFlag == "update"){
						//获取list页面顶端的新增数据的主键
						data["SerialNo"] = $scope.selectedListItem["SerialNo"];
						data["UpdateDate"] = $filter('date')(new Date(),"yyyy/MM/dd"); 
						//执行更新操作
						$db_operate.updateRecord($scope,"0001",data);
					}										
				})
				
			}	
			//详情页保存按钮
			$scope.$on("updateData",function(e,data){
				//执行后，页面刷新控制符
				$scope.goDetailTopFlag  = false;
				$scope.detailInfo["UpdateDate"] = $filter('date')(new Date(),"yyyy/MM/dd"); 				
				//执行更新操作
				$db_operate.updateRecord($scope,"0001",$scope.detailInfo);				
			})
			
			//转为**营销或提交扫描功能
			$scope.$on("updateMarketingStatus",function(e,data){
				//执行后，页面刷新控制符
				$scope.goDetailTopFlag  = false;
				if(data == "提交扫描岗"){
					$scope.MarketingStatus = $filter('filter')($scope.listGroup.menuGroup,"已完成的营销","ColName")[0].ColId;
				} else if(data == "转为新增营销"){
					$scope.MarketingStatus = $filter('filter')($scope.listGroup.menuGroup,"新增的营销","ColName")[0].ColId;

				} else if(data == "转为无需营销"){
					$scope.MarketingStatus = $filter('filter')($scope.listGroup.menuGroup,"无需的营销","ColName")[0].ColId;

				} else if(data == "转为无效营销"){
					$scope.MarketingStatus = $filter('filter')($scope.listGroup.menuGroup,"无效的营销","ColName")[0].ColId;

				}
				if($scope.selectedListItem !=""){
					runServiceWithSession($http, $ionicLoading,
	                        $ionicPopup, $state, "updateMarketingStatus", 
	                        {
	                			SerialNo:$scope.selectedListItem.SerialNo,
	                			MarketingStatus: $scope.MarketingStatus
	                		}, function (result, status) {
	                            if (result.Flag == 'Y') {
	                            	$ionicLoading.show ({
	                            		template : "操作成功!",
	                            		duration : 1000
	                            	});
        							$scope.clickMenu($scope.selectedMenuItem, $scope.menuIndex);
	                            } else {
	                            	$ionicLoading.show({
	                            		template : "操作失败，请稍后重试!",
	                            		duration : 1000
	                            	});
	                            	return false;
	                            }
	                        });
				} else {
	            	appIonicLoading.show({
		                template: '请点击选择所要删除的列表行!',
		                animation: 'fade-in',
		                showBackdrop: true,
		                duration: 1000
		            	});
				}
			})
			//删除按钮
			$scope.$on("removeMarketDetail",function(e,data){
				//执行后，页面刷新控制符
				$scope.goDetailTopFlag  = false;
				  if($scope.selectedListItem !=""){
		                runServiceWithSession($http, $ionicLoading,
		                        $ionicPopup, $state, "removeMarketInfo", {SerialNo:$scope.selectedListItem.SerialNo,}, function (result, status) {
		                            if (result.Flag == 'Y') {
		                            	$ionicLoading.show ({
		                            		template : "删除成功!",
		                            		duration : 1000
		                            	});
	        							$scope.clickMenu($scope.selectedMenuItem, $scope.menuIndex);

		                            } else {
		                            	$ionicLoading.show({
		                            		template : "删除失败，请稍后重试!",
		                            		duration : 1000
		                            	});
		                            	return false;
		                            }
		                        });
		            } else {
		            	appIonicLoading.show({
			                template: '请点击选择所要删除的列表行!',
			                animation: 'fade-in',
			                showBackdrop: true,
			                duration: 1000
			            	});
		            }
			})
        
    }) 
    	
    //******************营销任务管理主页-end***************//
    .controller('marketInfoFooterController', function ($scope, $rootScope ,$state,$ionicLoading) {
    	//保存按钮
    	$scope.updateData = function(){
    		$scope.$emit("updateData");
    	}
    	//转为**阶段按钮
    	$scope.updateMarketingStatus = function(data){
    		$scope.$emit("updateMarketingStatus",data);

    	}
    	//删除按钮
    	$scope.removeMarketDetail = function(){
    		$scope.$emit("removeMarketDetail");
    	}
    })

    
