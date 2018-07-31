angular.module('com.amarsoft.mobile.controllers.approve.postLoanApprove', ['ngSanitize', 'ngAnimate'])
    
    //贷后检查流程
    .controller('PostLoanApproveController', function (paging,$group,$stateParams,$scope, $rootScope, $state, basePage, $timeout, $ionicModal, $ionicLoading) {
    	
    	$scope.ApproveType = $stateParams.ApproveType; //接受通过路由传递的ApproveType参数
		$scope.TransactionFilter = $stateParams.TransactionFilter;
        $rootScope.rightContentListShowFlag = true;//用于控制最右侧内容区域,是显示list页面,还是detail页面,变量名不可修改
        //取出当前流程的二级menu按钮
        $scope.postApproveMenuList = angular.fromJson($group.business({"ClassName":"com.amarsoft.webservice.util.SelectMenuList","MethodName":"SelectPostApproveMenu"}).DataMenu);        
        //默认当前工作状态
        $scope.menuIndex = 0;
        $scope.menuInfo = $scope.postApproveMenuList[0].menuArray;
        $scope.exaineContentHeight = $rootScope.contentHeight - 53;  //待审批的详情页面 底部有"提交按钮",故详情内容区高度减去53,变量名不可修改
        
      //接收 提交完签署意见后的刷新 广播
        $scope.$on('sign-opinionRefresh', function (e, data) {
        	$scope.$broadcast("to-refresher",data);
		});
        //二级导航栏Tab的点击事件
        $scope.selectTab = function (menuInfo,tabIndex) {
            appIonicLoading.show({template: '正在加载中', animation: 'fade-in', showBackdrop: true, duration: 30000});
            if (tabIndex == '0') {
            	$scope.menuInfo = menuInfo.menuArray;
                $scope.menuIndex = tabIndex;
                $rootScope.isFinished = true;
                $scope.exaineContentHeight = $rootScope.contentHeight - 53;  //待审批的详情页面 底部有"提交按钮",故详情内容区高度减去53,变量名不可修改
                //待审批工作
                $scope.$broadcast('To-ApproveWorkController');
            } else {
            	$scope.menuInfo = menuInfo.menuArray;
                $scope.menuIndex = tabIndex;
                $rootScope.isFinished = false;
                $scope.exaineContentHeight = $rootScope.contentHeight;
                // 已完成工作
                $scope.$broadcast('To-ApproveWorkController');
            }
        };
        
      //转发查询的list数据到另一个子级controller中
        $scope.$on("to-approvelist",function(e,data){
        	$scope.$broadcast("to-approvedetailList",data)
        })
        //刷新页面
        $scope.$on("refresher",function(e,data){
        	$scope.$broadcast("to-refresher",data);
        })
        //下拉加载更多列表数据
        $scope.$on("infinite",function(e,data){
        	$scope.$broadcast("to-infinite",data);
        })
        
        //详情页面返回点击事件
        $scope.goToListPage = function () {
        	$scope.$broadcast("to-refresher");
        }
        
        //详情页面返回主页面点击事件
        $scope.goToUpper = function () {
        	$rootScope.moduleSwitch('approve','approve');
        }
    
    })
    
     //当前工作
    .controller('PostLoanWorkController', function ($filter,$http, $rootScope, $ionicLoading, $ionicPopup, $scope, $state, paging) {
        
    	$scope.selectedIndex = 0;
    	$scope.selectListData = $scope.menuInfo[0]; //初次加载第一条选项数据
    	//二级导航按钮事件
    	$scope.approveList = function(item,index){
    		$scope.selectListData = item;
    		$scope.selectedIndex = index;
            paging.init($scope, iPageSize, 1, loadData, true);   
            appIonicLoading.show({
                template: '正在加载中',
                animation: 'fade-in',
                showBackdrop: true,
                duration: 30000
            });
            $scope.refresh();
    	}
    	   	
    	$scope.$on('To-ApproveWorkController', function (e, data) {
    		paging.init($scope, iPageSize, 1, loadData, true);    
        	$scope.selectListData = $scope.menuInfo[0];
            appIonicLoading.show({
                template: '正在加载中',
                animation: 'fade-in',
                showBackdrop: true,
                duration: 30000
            });
    		$scope.refresh();
    	});
    	$scope.$on('to-refresher', function (e, data) {
    		paging.init($scope, iPageSize, 1, loadData, true);  
    		$scope.refresh();
    	});
    	$scope.$on('to-infinite', function (e, data) {
			$scope.pageNo++;
			// 加载更多
			loadData();
    	});

    	var iPageSize = 12;
		$scope.items =[];
        var loadData = function ($ionicLoading) {
        	//加载所有按钮中list数据的总数
        	if($scope.pageNo ==1){
				angular.forEach($scope.menuInfo, function(item, index) {
					runServiceWithSession($http, undefined, $ionicPopup, $state,
							"selectPostLoanTotalCount", {
						"SortNo":item.sortNo,
						"modelNo":item.modelNo,
						"sApplyType":item.objectType,
						"ApproveType":$scope.ApproveType}, function (data, status) {
							$scope.menuInfo[index]["totalCount"] = data["totalCounts"].totalCount;
						})
				})

        	}
            $rootScope.rightContentListShowFlag = true;//用于控制最右侧内容区域,是显示list页面,还是detail页面,变量名不可修改
    		var serviceData = {
    			url:"selectPostLoanList",
    			data:{
    				SortNo:$scope.selectListData.sortNo,
    				modelNo:$scope.selectListData.modelNo,
    				sApplyType:$scope.selectListData.objectType,
    				ApproveType:$scope.ApproveType,
    				PageSize: iPageSize,
                    PageNo: $scope.pageNo
    			}
    		}
        	runServiceWithSession($http, undefined, $ionicPopup, $state,
        			serviceData.url, serviceData.data, function (data, status) {
                        if (data["array"].length == 0) {
                            //清空默认值
                        	$scope.items = [];
                        }
                        else{
                        	$scope.totalCount = data.totalCount;
                        	for (var i = 0; i < data["array"].length; i++) {
                        		$scope.items.push(data["array"][i]["array"][0]["groupColArray"]);
                        	}
                        }
                        $rootScope.hasMore = (($scope.pageNo - 1)
                        		* iPageSize + data["array"].length < data.totalCount);
                        $rootScope.loadingMore = false;
                        $scope.$emit("to-approvelist",{items:$scope.items,objectType:$scope.selectListData.objectType});
                        appIonicLoading.hide();                       
                    }
                );
            }
            ;
        paging.init($scope, iPageSize, 1, loadData, true);
        appIonicLoading.show({
            template: '正在加载中',
            animation: 'fade-in',
            showBackdrop: true,
            duration: 30000
        });
        $scope.refresh();


    })
      //list或detailInfo展示controller
    .controller('postLoanListController', function ($ionicActionSheet,$timeout,$filter,$model,$detail,$group,$http, $rootScope, $ionicLoading, $ionicPopup, $scope, $state, paging,i18nService) {
		

    	//存储list数据
    	$scope.detailList = [];
		$scope.title = "签批列表"
		$scope.listGroup = {menuGroup:[],group:[],tabGroup:[]};//存放菜单及列表字段
		$scope.selectedTabItem = {};//选中菜单信息
		$scope.tabIndex = 0;//tab页索引
		$scope.selectObject = ""	//由于贷后流程首检和定检TAB页不一致，所以需要重新加载

    	$scope.$on("to-approvedetailList",function(e,data){
    		$scope.detailList = data.items;
    		//调用service模板加载详情页配置信息
    		if(($scope.selectObject != "" && data.objectType != $scope.selectObject)||typeof($scope.listGroup.tabGroup) =='undefined'|| $scope.listGroup.tabGroup =="" ||$scope.listGroup.tabGroup == null || $scope.listGroup.tabGroup ==0){    			
    			
    			var groupId = data.objectType;
    			$scope.listGroup.tabGroup = [];		//清空tab页信息；
    			$group.loadGroup(groupId,"",2,"tab").then(function(result){
    				$scope.listGroup.tabGroup =result;
    				$scope.selectedTabItem = result[0];
    				$model.init($scope);
    				$detail.load($scope);
    				//配置查询详情页的参数
    				$scope.setDetailParam = function(modelInfo,detailParam){
    					if(typeof($scope.selectedListItem) !== "undefined"){
    						detailParam.url = modelInfo["Action"];
    						if(detailParam.url == 'SelectObjectInfo'){
  							   detailParam["queryData"]["SerialNo"] = $filter("filter")($scope.selectedListItem,"BCSerialNo","KeyId")[0].Value;
  							   detailParam["queryData"]["ObjectNo"] = $filter("filter")($scope.selectedListItem,"BCSerialNo","KeyId")[0].Value;
  							   detailParam["queryData"]["BusinessType"] = $filter("filter")($scope.selectedListItem,"BusinessTypeNo","KeyId")[0].Value;    								
  							   detailParam["queryData"]["ObjectType"] = "BusinessContract";
  						   }else if(detailParam.url == 'SelectCustomerInfo'){
  							   detailParam["queryData"]["CustomerID"] = $filter("filter")($scope.selectedListItem,"ObjectNo","KeyId")[0].Value;//pC端参数错误，客户ID应该是CustomerID
  						   }
  						   detailParam["queryData"]["ReturnType"] = "Info";
    					}
    				}
    				
    				//切换tab页后事件
    				$scope.chooseModel = function(model,data){
    					$scope.modelQueryData = {};
    					if(model["Action"] === "IndOrEntCapitalUsedList"){
    						$scope.modelQueryData.SerialNo = $filter("filter")($scope.selectedListItem,"SerialNo","KeyId")[0].Value;
    						$scope.modelQueryData.ObjectNo = $filter("filter")($scope.selectedListItem,"SerialNo","KeyId")[0].Value;
    						$scope.modelQueryData.ObjectType = "FirstCheck";
    						$scope.ngController = "SmeOrEntCapitalUsedListController";
    			 			   $timeout(function () {
    								$scope.$broadcast('to-SmeOrEntCapitalUsedList',$scope.modelQueryData);
    						   }, 100);
    			 		}else if(model["Action"] === "EntCheckedALS"){
    			 			//国际化；
    				        i18nService.setCurrentLang("zh-cn");
    				        $scope.grid_entLoanUsage = {
    				            data: [],
    				            columnDefs: [{ 
    				            	 field: "Index",
    				            	 displayName : "序号",
    				            	 width:"10%"
    				             },
    				             { 
    				            	 field: "ItemName",
    				            	 displayName : "对方用户名"
    				             },
    				             { 
    				            	 field: "Sum",
    				            	 displayName : "金额(万元)"
    				             },
    				             { 
    				            	 field: "Date",
    				            	 displayName : "日期"
    				    		 },
    				    		 { 
    				            	 field: "Describe",
    				            	 displayName : "资金用途"
    				    		 }],
    				            enableSorting: true, //是否排序
    				            useExternalSorting: false, //是否使用自定义排序规则
    				            enableGridMenu: true, //是否显示grid 菜单
    				            showGridFooter: false, //是否显示grid footer
    				            enableHorizontalScrollbar :  1, //grid水平滚动条是否显示, 0-不显示  1-显示
    				            enableVerticalScrollbar : 1 //grid垂直滚动条是否显示, 0-不显示  1-显示
    				        };
    			 			var queryParam = {
    							ObjectNo : $filter("filter")($scope.selectedListItem,"ObjectNo","KeyId")[0].Value,
    							ObjectType : "BusinessContract",
    							SerialNo : $filter("filter")($scope.selectedListItem,"SerialNo","KeyId")[0].Value,
    							ClassName : "com.amarsoft.webservice.business.InspectImpl",
    							MethodName : "getEntCheckedALS"
    						};
    						$group.business(queryParam).then(function(result){
    							$scope.EntCheckedALSData = angular.fromJson(result);
    					        $scope.grid_entLoanUsage.data = angular.fromJson($scope.EntCheckedALSData["ItemData"]);
    					        $scope.ReportData = $scope.dealHtmlData($scope.EntCheckedALSData["ReportData"]);
    						});
    			 		}else{
    					   $scope.$broadcast('to-detail',data);
    			 		}
    				}
    			});   
    		}
    		$scope.selectObject = data.objectType;
    	})
    	
    	
    	//list点击事件
    	$scope.goDetail = function(item, index){
			$scope.listIndex = index;
			$scope.selectedListItem = item;
    		//改变标识位，显示详情页面
            $rootScope.rightContentListShowFlag = false;
    		$scope.title = "签批信息详情"
            //获取详情页tab导航信息，并默认选择第一条
			$scope.changeModel($scope.listGroup.tabGroup[$scope.tabIndex],$scope.tabIndex);			
		}
        $scope.OpinionNo="";

    	//签署意见并提交
		$scope.contractRegistration = function(){
			//**********过滤FTSerialNO******* start**
			$scope.filterFTSerialNoParam={};
			var filterFTSerialNoParam = {  //获取合同主键的请求数据										
				ClassName : "com.amarsoft.app.als.mobile.impl.ComponentQuery",
				MethodName : "getFilterFTSerialNo",
				UserID : AmApp.userID,
				TransactionType:"Sqlca"
			}; 
			//**********过滤FTSerialNO******* end**
			//遍历$scope.selectedListItem，进行参数传入filterSerialNoParam对象和filterFTSerialNoParam对象
			for(var i=0;i<$scope.selectedListItem.length;i++){			
				filterFTSerialNoParam[$scope.selectedListItem[i]["KeyId"]]=$scope.selectedListItem[i]["Value"];
				if($scope.selectedListItem[i]["KeyId"]=="ObjectType"){
					$scope.ObjectType1=$scope.selectedListItem[i]["Value"];
				}
			}		
			//执行查询，并返回所需参数
			$scope.FTSerialNoFilter = $group.business(filterFTSerialNoParam)["FTSerialNo"];
			$scope.showModal("templates/common/commonModelView/signOpinionModal.html");	
			$timeout(function(){					
				$scope.$broadcast("go-SignOpinionController",{
					$scope:$scope,
					SerialNo:$filter("filter")($scope.selectedListItem,"SerialNo","KeyId")[0].Value,
					ObjectType:$scope.ObjectType1,
					FlowNo:$filter("filter")($scope.selectedListItem,"FlowNo","KeyId")[0].Value,
					ObjectNo:$filter("filter")($scope.selectedListItem,"ObjectNo","KeyId")[0].Value,
					PhaseNo:$filter("filter")($scope.selectedListItem,"PhaseNo","KeyId")[0].Value,
					PhaseName:$filter("filter")($scope.selectedListItem,"PhaseName","KeyId")[0].Value,
					FTSerialNo: $scope.FTSerialNoFilter,
					ApplyType:$filter("filter")($scope.selectedListItem,"ApplyType","KeyId")[0].Value});
			},100)
			 //生成主键FLOW_OPINION表的主键opinionNO，在签署意见时，保存到数据记录中		    			
	    	$scope.getSerialNo("FLOW_OPINION","OpinionNo");			           
	        //获取修改数据
			 $scope.setSerialNo = function(serialNo){
	            	$scope.OpinionNo = serialNo;
			} 
		}
        $scope.removeModal = function () {
        	$scope.$emit("refresher");
            $scope.modal.remove();
        }
        
        // 根据工作是否已完成，来判断是否显示退回、提交等操作
        // $scope.showOperatorButton = false;//默认不展现操作按钮
        // basePage.init($scope);
        $scope.backToLastNode = function () {
            $scope.ftSerialNo = "";
            var confirmPopup = $ionicPopup.confirm({
                title: '业务处理',
                template: '你确定要将该业务退回上一步？',
                okText: '确定',
                cancelText: '取消'
            });
            confirmPopup.then(function (res) {
                if (res) {
                	runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
                		"selectApplyAndOpinionInfo", {
                        SerialNo: $filter("filter")($scope.selectedListItem,"ObjectNo","KeyId")[0].Value,
                        ObjectType: $filter("filter")($scope.selectedListItem,"ObjectType","KeyId")[0].Value,
                        FlowNo: $filter("filter")($scope.selectedListItem,"FlowNo","KeyId")[0].Value,
                        PhaseNo: $filter("filter")($scope.selectedListItem,"PhaseNo","KeyId")[0].Value
                    }, function (data, status) {
                        $scope.ftSerialNo = data.ftSerialNo;
                        //检验是否已经签署意见
                        $scope.opinionInfos = data.opinionDetail;

                        if(typeof($scope.opinionInfos)=="undefined" || $scope.opinionInfos == null || $scope.opinionInfos == ""){
                        	runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
	                        		"backToLast", {serialNo: $scope.ftSerialNo}, function (data, status) {
	                        			if (data.OperationMsg == 'SUCCESS') {
	                        				$ionicLoading.show({
	                        					template: "退回上一步操作成功！",
	                        					duration: 3000
	                        				});
	                        	        	$scope.$emit("refresher");
	                        			} else {
	                        				$ionicLoading.show({
	                        					template: "退回上一步操作失败,请与系统员联系！",
	                        					duration: 3000
	                        				});
	                        			}
	                        		});
                        } else {
                        	 appIonicLoading.show({
     	                        template: '该业务已经签署意见,不能退回前一步',
     	                        animation: 'fade-in',
     	                        showBackdrop: true,
     	                        duration: 600
     	                    });
                        }	                        		                        		                  
                    });                	                	
                }
            })                        
        };
        //页面刷新
        $scope.detailListRefresh = function(){
        	$scope.$emit("refresher");
            $scope.$broadcast('scroll.refreshComplete');
        }
        //下拉加载更多
        $scope.detailListLoadMore = function(){
			$rootScope.loadingMore = true;
			$rootScope.hasMore = false;
			$timeout(function() {
				$scope.$emit("infinite");
			}, 1000);
			$scope.$broadcast('scroll.infiniteScrollComplete'); 
        }
    })
    
     //用款记录list展示
    .controller('SelectWithMoneyList', function ($scope,$filter,$http,$ionicPopup,$state,$ionicModal,$detail,$timeout,$filter) {
    	
    	$scope.serviceUrl = "";
    	$scope.$on("to_withMoneyList",function(e,data){
    		$scope.serviceUrl = data.Action
    		$scope.payeeInfoInfo = [];
    		runServiceWithSession($http, undefined, $ionicPopup, $state,
        			data.Action, {
    					"modelNo":data.modelNo,
    					"PASerialNO":data.PASerialNO,
    					"ReturnType":data.ReturnType}, function (data, status) {
                        if (data["array"].length == 0) {
                            //清空默认值
                        	$scope.payeeInfoInfo = [];
                        }
                        else{
                        	for (var i = 0; i < data["array"].length; i++) {
                        		$scope.payeeInfoInfo.push(data["array"][i]["array"][0]["groupColArray"]);
                        	}
                        }
                        appIonicLoading.hide();                       
                    });
            });
    	
    	$detail.load($scope);
        $scope.chooseDetail = function(item,index){
        	var modelUrl = "templates/common/commonDetailListInfo.html";
        	$scope.detailListIndex = index;
        	$scope.selectedDetailListItem = item;
        	$ionicModal.fromTemplateUrl(modelUrl, {
        			scope: $scope,
        			backdropClickToClose: false
        		}).then(function (modal) {
        			//判断如果业务条线为空，提示并不弹出复选框
        			$scope.modal = modal;
        			$scope.modal.show();
        			$scope.detailTitle = "原收款人信息"
        			var detailModalQueryParam = {url:$scope.serviceUrl,queryData:{}};
        			$scope.setDetailModalQueryParam(modal,detailModalQueryParam);
        			$timeout(function () {
        				$scope.$broadcast('to-listDetailInfo',detailModalQueryParam);
        		}, 100);
        				
        	});
        }
        $scope.modalCancel = function(){
        	$scope.modal.remove()
        }
        
		$scope.setDetailModalQueryParam = function(modal,detailModalQueryParam){
			detailModalQueryParam["queryData"]["modelNo"] = "ReceiverBillInfo";
			detailModalQueryParam["readonly"] = "true";
			angular.forEach($scope.selectedDetailListItem,function(Item, Index){
				if(Item.KeyId == "SerialNo"){
					detailModalQueryParam["queryData"]["SerialNo"] = Item.Value;
				}
			})
			detailModalQueryParam["queryData"]["ReturnType"] = "Info";  
		}
        
		
    })