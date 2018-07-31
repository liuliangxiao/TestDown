angular.module('com.amarsoft.mobile.controllers.approve.creditApply', ['ngSanitize', 'ngAnimate'])

	//业务申请主页控制器
	.controller('ApproveAccessIndexController', function ($scope,$state,$timeout, $rootScope,$http,$ionicPopup) {
		
		var loadData = function() {
			if(!$rootScope.ApproveAccessMenuClickable){
				$timeout(function () {
					$rootScope.ApproveAccessMenuClickable =true;
			    }, 1000);
				return;
			}
			$rootScope.ApproveAccessMenuClickable =false;
			runServiceWithSession($http, undefined, $ionicPopup, $state,
        			"selectApproveModelTotalCount", {
	        		"finishedFlag":"N",
					/*"ApproveType":$scope.ApproveType,*/
    				"TransactionFilter":"",
    				"UserID" : AmApp.userID,
					/*"ItemNos":$scope.selectIndexArray.toString()*/}, function (data, status) {
						$scope.totalCount = data["totalCounts"];
        	})
		}
		loadData();
		//$rootScope.ApproveScreenShowFlag = true;//影像按钮是否隐藏
		//授信业务流程
		$scope.approveCreditApply = function(){
	        $rootScope.moduleSwitch('businessApproveController',"approve",{ApproveType:"ApproveCreditApply",TransactionFilter:""});
		}
		//批单变更流程
		$scope.BAChangeApprove = function(){
	        $rootScope.moduleSwitch('businessApproveController',"approve",{ApproveType:"BAChangeApprove",TransactionFilter:""});
		}
		//非标业务流程(合同担保变更流程)
		$scope.bcChangeApprove = function(){
	        $rootScope.moduleSwitch('businessApproveController',"approve",{ApproveType:"BCChangeApprove",TransactionFilter:""});
		}
		//收款变更流程
		$scope.payeeApprove = function(){
	        $rootScope.moduleSwitch('businessApproveController',"approve",{ApproveType:"PayeeApprove",TransactionFilter:""});
		}
		//放款业务流程
		$scope.approvePutOutApply = function(){
	        $rootScope.moduleSwitch('businessApproveController',"approve",{ApproveType:"ApprovePutOutApply",TransactionFilter:""});
		}
		//受托支付流程
		$scope.acctTransferApprove = function(){
	        $rootScope.moduleSwitch('businessApproveController',"approve",{ApproveType:"AcctTransferApprove",TransactionFilter:""});
		}
		//货后变更流程
		$scope.transactionApprove1 = function(){
			$rootScope.moduleSwitch('businessApproveController',"approve",{ApproveType:"TransactionApprove",TransactionFilter:"@2011@2012@2013@2014@2017@2018@"});
		}
		//核算交易流程
		$scope.transactionApprove2 = function(){
			//$rootScope.moduleSwitch('businessApproveController',"approve",{ApproveType:"TransactionApprove",TransactionFilter:"@0055@0080@0090@0091@6040@2008@2011@2012@2013@2014@2017@2018@"});
			$rootScope.moduleSwitch('businessApproveController',"approve",{ApproveType:"TransactionApprove",TransactionFilter:"@0055@0080@0090@0091@6040@"});
		}
		//贷后检查流程
		$scope.checkXQYCredit1 = function(){
			$rootScope.moduleSwitch('postApproveController',"approve",{ApproveType:"CheckXQYCredit1"});
		}
		//风险预警信号发起流程
		$scope.approveCRiskApply = function(){
			$rootScope.moduleSwitch('businessApproveController',"approve",{ApproveType:"ApproveCRiskApply",TransactionFilter:""});
		}
		//风险分类流程
		$scope.approveClassifyRApply = function(){
			$rootScope.moduleSwitch('businessApproveController',"approve",{ApproveType:"ApproveClassifyRApply",TransactionFilter:""});
		}
		//押品出入库流程
		$scope.guarantyInOutTask = function(){
			$rootScope.moduleSwitch('businessApproveController',"approve",{ApproveType:"GuarantyInOutApprove",TransactionFilter:""});
		}
	})
	
	
    //审查审批列表页(父级controller)
    .controller('ApproveAccessController', function ($stateParams,$scope, $rootScope, $state, basePage, $timeout, $ionicModal, $ionicLoading) {
    	
        $scope.tabIndex = 0;//默认显示"未完成",不可修改
		$scope.ApproveType = $stateParams.ApproveType; //接受通过路由传递的ApproveType参数
		$rootScope.ApproveType = $scope.ApproveType;
		
		$scope.TransactionFilter = $stateParams.TransactionFilter;
        $rootScope.rightContentListShowFlag = true;//用于控制最右侧内容区域,是显示list页面,还是detail页面,变量名不可修改

        if ($scope.tabIndex == 0){//点击"未完成"按钮
            $scope.selectTab0 = true;
            $scope.selectTab1 = false;
            $scope.finishedFlag = 'N';
            $rootScope.isFinished = true;  //用于控制详情页面是否显示签署意见按钮
            $scope.exaineContentHeight = $rootScope.contentHeight - 53;  //待审批的详情页面 底部有"提交按钮",故详情内容区高度减去53,变量名不可修改
        } else {
            $scope.selectTab0 = false;
            $scope.selectTab1 = true;
            $scope.finishedFlag = 'Y';
            $rootScope.isFinished = false;
            $scope.exaineContentHeight = $rootScope.contentHeight;
        }

        //二级导航栏Tab的点击事件
        $scope.selectTab = function (tabIndex) {

            appIonicLoading.show({template: '正在加载中', animation: 'fade-in', showBackdrop: true, duration: 30000});


            if (tabIndex == '0') {
                $scope.tabIndex = tabIndex;
                $scope.selectTab0 = true;
                $scope.selectTab1 = false;
                $scope.finishedFlag = 'N';
                $rootScope.isFinished = true;
                //待审批工作
                $scope.$broadcast('To-ApproveWorkController');

            } else {
                $scope.tabIndex = tabIndex;
                $scope.selectTab0 = false;
                $scope.selectTab1 = true;
                $scope.finishedFlag = 'Y';
                $rootScope.isFinished = false;
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
        //接收 提交完签署意见后的刷新 广播
        $scope.$on('sign-opinionRefresh', function (e, data) {
        	//调用 待审批当前工作 
        	$scope.selectTab("0");
		});
        
        //详情页面返回点击事件
        $scope.goToUpper = function () {
        	$rootScope.moduleSwitch('approve','approve');
        }
        
      //详情页面返回点击事件
        $scope.goToListPage = function () {
        	$scope.$broadcast("to-refresher");
        }
        
        basePage.init($scope);

    })
    //当前工作
    .controller('CurrentWorkController', function ($filter,$http, $rootScope, $ionicLoading, $ionicPopup, $scope, $state, paging) {
        
    	//二级导航按钮事件
    	$scope.approveList = function(selectedIndex){
    		if(selectedIndex == 01){
    			$scope.selectedIndex = selectedIndex;
    			$scope.selectedIndex0 = true;
    			$scope.selectedIndex1 = false;
    			$scope.selectedIndex2 = false;
    			$scope.selectedIndex3 = false;
    			$scope.selectedIndex4 = false; 
    		} else if(selectedIndex == 02){
    			$scope.selectedIndex = selectedIndex;
     			$scope.selectedIndex0 = false;
     			$scope.selectedIndex1 = true;
     			$scope.selectedIndex2 = false;
     			$scope.selectedIndex3 = false;
     			$scope.selectedIndex4 = false;  
     		} else if(selectedIndex == 03){
    			$scope.selectedIndex = selectedIndex;
    			$scope.selectedIndex0 = false;
    			$scope.selectedIndex1 = false;
    			$scope.selectedIndex2 = true;
    			$scope.selectedIndex3 = false;
    			$scope.selectedIndex4 = false;
    		} else if(selectedIndex == 04){
    			$scope.selectedIndex = selectedIndex;
    			$scope.selectedIndex0 = false;
    			$scope.selectedIndex1 = false;
    			$scope.selectedIndex2 = false;
    			$scope.selectedIndex3 = true;
    			$scope.selectedIndex4 = false; 
    		} else if(selectedIndex == 05){
    			$scope.selectedIndex = selectedIndex;
    			$scope.selectedIndex0 = false;
    			$scope.selectedIndex1 = false;
    			$scope.selectedIndex2 = false;
    			$scope.selectedIndex3 = false;
    			$scope.selectedIndex4 = true;
    		}   
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

    	var iPageSize = 12;  // 右侧列表中默认展示的记录条数
		$scope.items =[];	// 指明声明的变量是一个数组，（因为使用了[]）
    	$scope.selectedIndex0 = true;	// 中间部分默认选择的记录；在class中使用
        var loadData = function ($ionicLoading) {
        	//加载所有按钮中list数据的总数；$scope.pageNo的值通过【paging.init方法的第三个参数出入】
        	if($scope.pageNo ==1){
        	$scope.selectIndexArray = ['01','02','03','04','05'];
        		// angular.forEach for循环；由angular内置 ；  item在每次循环时代表 01、02、03、04、05 index代表 0、1、2、3、4
        		// 经过处理把$scope.selectIndexArray的值转换为前面加上Y或N
				angular.forEach($scope.selectIndexArray, function(item, index) {
					$scope.selectIndexArray[index] = $scope.finishedFlag + item;
				});
	        	runServiceWithSession($http, undefined, $ionicPopup, $state,
	        			"selectApproveTotalCount", {
		        		"finishedFlag":$scope.finishedFlag,
						"ApproveType":$scope.ApproveType,
	    				"TransactionFilter":$scope.TransactionFilter,
	    				"UserID" : AmApp.userID,
						"ItemNos":$scope.selectIndexArray.toString()}, function (data, status) {
							$scope.totalCounts = data["totalCounts"];
							
	        		
	        	})
        	}
        	//获取选中按钮下的list数据
            $rootScope.rightContentListShowFlag = true;//用于控制最右侧内容区域,是显示list页面,还是detail页面,变量名不可修改
        	if($scope.selectedIndex == null || typeof($scope.selectedIndex) =='undefined'){
        		//更改收款人清单右侧界面不显示数据,默认初始化公司条线
        		if("PayeeApprove" == $scope.ApproveType){
        			$scope.selectedIndex2 = true;
        			$scope.selectedIndex ='03';
        		}else $scope.selectedIndex ='01';
        	}
    		if($scope.selectedIndex.length == 3){ //如果已经有flag标记，则重新标记
    			$scope.selectedIndex = $scope.finishedFlag+$filter('limitTo')($scope.selectedIndex,-2);        		       			
    		} else {
    			$scope.selectedIndex = $scope.finishedFlag+$scope.selectedIndex;
    		}
    		var serviceData = {
    			url:"selectApproveList",
    			data:{
    				finishedFlag:$scope.finishedFlag,
    				ApproveType:$scope.ApproveType,
    				ItemNo:$scope.selectedIndex,
    				TransactionFilter:$scope.TransactionFilter,
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
                        		//过滤支付流程
                        		if (data["array"][i].ObjectType == 'PaymentApply') {
                        			continue;
                        		}
                        		var array = data["array"][i]["array"][0]["groupColArray"];
                        		for(var j = 0;j < array.length; j++){
                        			if(array[j].KeyId == "BusinessSum"){
                        				array[j].Value = $filter('currency')(array[j].Value+"",'')
                        			}
                        		}
                        		$scope.items.push(array);
                        	}
                        }
                        $rootScope.hasMore = (($scope.pageNo - 1)
                        		* iPageSize + data["array"].length < data.totalCount);
                        $rootScope.loadingMore = false;
                        $scope.$emit("to-approvelist",$scope.items);
                        appIonicLoading.hide();                       
                    }
                );
            }
            ;
        // paging 是公司封装的一个服务，见[/ALS7M/WebRoot/www/js/services.js]文件定义，提供init方法，接收参数，需要和下面的遮罩层（可选）与执行（必须）一起使用；
        paging.init($scope, iPageSize, 1, loadData, true);
        // 页面遮罩层
        appIonicLoading.show({
            template: '正在加载中',
            animation: 'fade-in',
            showBackdrop: true,
            duration: 30000
        });
        // 执行 loadData 方法
        $scope.refresh();

    })
    //list或detailInfo展示controller
    .controller('approveListController', function ($ionicActionSheet,$timeout,$filter,$model,$detail,$group,$http, $rootScope, $ionicLoading, $ionicPopup, $scope, $state,$compile, paging,$q) {
		

    	//存储list数据
    	$scope.detailList = [];
		$scope.title = "签批列表"
		$scope.listGroup = {menuGroup:[],group:[],tabGroup:[]};//存放菜单及列表字段
		$scope.selectedTabItem = {};//选中菜单信息
		$scope.tabIndex = 0;//tab页索引

    	$scope.$on("to-approvedetailList",function(e,data){
    		$scope.detailList = data;
    		//调用service模板加载详情页配置信息
    		if(typeof($scope.listGroup.tabGroup) =='undefined'|| $scope.listGroup.tabGroup =="" ||$scope.listGroup.tabGroup == null || $scope.listGroup.tabGroup ==0){    			
    			$group.loadGroup($scope.ApproveType,"",2,"tab").then(function(result){
    				$scope.listGroup.tabGroup = result; // 保存app_menu_group表的多条记录
    				$scope.selectedTabItem = result[0]; // 进入详情后，默认选择第一个tab
    				// 功能类似于java中的import，把service服务提供的function引入到当前controller里；
    				$model.init($scope);
    				$detail.load($scope);
    				//配置查询详情页的参数； modelInfo：app_menu_group里的一条数据；  detailParam:app发送到前置的请求参数
    				$scope.setDetailParam = function(modelInfo,detailParam){
    					if(typeof($scope.selectedListItem) !== "undefined"){
    						detailParam.url = modelInfo["Action"];  // app_menu_group.Action 前置交易编码
    						// SelectObjectInfo 查询公用模板DataObject_Library表
    						if(detailParam.url == 'SelectObjectInfo'){
                                //货后变更流程
    							if("TransactionApply" == modelInfo.ObjectType){
    								var queryParam = {  //获取模板时的请求数据
    										// $filter 过滤器；过滤$scope.selectedListItem里第一个keyId的值等于ObjectNo的对象，获取对象的value
    										ObjectNo : $filter("filter")($scope.selectedListItem,"ObjectNo","KeyId")[0].Value,
    										// 服务端的类名称与类里的方法名称
    										ClassName : "com.amarsoft.webservice.util.SelectTempleteNo",
    										MethodName : "SelectTransactionTempleteNo"
    								};
    								var querySerialNoParam = {  //获取合同主键的请求数据
    										ObjectNo : $filter("filter")($scope.selectedListItem,"ObjectNo","KeyId")[0].Value,
    										LoanSerialNo:$filter("filter")($scope.selectedListItem,"LoanSerialNo","KeyId")[0].Value,
    										ClassName : "com.amarsoft.webservice.util.SelectTempleteNo",
    										MethodName : "SelectTransactionSerialNo"
    								};
    								// 返回： TransactionSerialNo 借据号、productID 业务品种编号、productVersion 产品核算版本、templeteNo 交易详情模板编号
    								$scope.selectParamData = $group.business(queryParam);
    								// 返回：RelativeObjectNo 借据号、ContractSerialNo 合同号
        							$scope.selectSerialNo = $group.business(querySerialNoParam);
    								if("101010" ==  modelInfo.ColId){  //货后变更流程获取详情模板
        								detailParam["queryData"]["modelNo"] = $scope.selectParamData.templeteNo;
        								/*detailParam["queryData"]["productID"] = $scope.selectParamData.productID;
        								detailParam["queryData"]["productVersion"] = $scope.selectParamData.productVersion;*/
        								detailParam["queryData"]["TransactionSerialNo"] = $filter("filter")($scope.selectedListItem,"ObjectNo","KeyId")[0].Value;
        								detailParam["queryData"]["ObjectType"] = $filter("filter")($scope.selectedListItem,"ObjectType","KeyId")[0].Value;       	
        								detailParam["queryData"]["ObjectNo"] = $filter("filter")($scope.selectedListItem,"ObjectNo","KeyId")[0].Value;
        								
        								$scope.setTempletParam = function (templetParam){
        									templetParam["ObjectNo"] = $filter("filter")($scope.selectedListItem,"DocumentSerialNo","KeyId")[0].Value;
        									templetParam["ObjectType"] = $filter("filter")($scope.selectedListItem,"DocumentType","KeyId")[0].Value
        								};
    								}else if("101020"==modelInfo.ColId){//借据信息详情 
        								detailParam["queryData"]["SerialNo"] = $filter("filter")($scope.selectedListItem,"RelativeObjectNo","KeyId")[0].Value;  
        								detailParam["queryData"]["modelNo"] = "ACCT_LOAN";
        								$scope.setTempletParam = function (templetParam){
        									templetParam["ObjectNo"] = $filter("filter")($scope.selectedListItem,"RelativeObjectNo","KeyId")[0].Value;
        									templetParam["ObjectType"] = "jbo.app.ACCT_LOAN";
        								};
    								} else {  	//货后变更合同详情   
        								detailParam["queryData"]["SerialNo"] = $scope.selectSerialNo.ContractSerialNo;
    									detailParam["queryData"]["ObjectNo"] = $scope.selectSerialNo.ContractSerialNo;
    									detailParam["queryData"]["ObjectType"] = "AfterLoan";  //（此处暂且写死）
    									detailParam["queryData"]["BusinessType"] = $filter("filter")($scope.selectedListItem,"BusinessTypeNo","KeyId")[0].Value;
                                        $scope.setTempletParam = function (templetParam){
                                            templetParam["ObjectNo"] = $scope.selectSerialNo["ContractSerialNo"];
                                            templetParam["ObjectType"] = "jbo.app.BUSINESS_CONTRACT";
                                        };
    								}
    							} else if("PutOutApply" == modelInfo.ObjectType){  //如果是放款业务流程  
    								if("101030" == modelInfo.ColId){    //放款业务合同详情 
        								detailParam["queryData"]["SerialNo"] = $filter("filter")($scope.selectedListItem,"ContractSerialNo","KeyId")[0].Value;
    									detailParam["queryData"]["ObjectNo"] = $filter("filter")($scope.selectedListItem,"ContractSerialNo","KeyId")[0].Value;
    									detailParam["queryData"]["ObjectType"] = "BusinessContract";
                                        $scope.setTempletParam = function (templetParam){
                                            templetParam["ObjectNo"] = $filter("filter")($scope.selectedListItem,"ContractSerialNo","KeyId")[0].Value;
                                            templetParam["ObjectType"] = "jbo.app.BUSINESS_CONTRACT";
                                        };
    								} else {
    									detailParam["queryData"]["SerialNo"] = $filter("filter")($scope.selectedListItem,"ObjectNo","KeyId")[0].Value;
    									detailParam["queryData"]["ObjectNo"] = $filter("filter")($scope.selectedListItem,"ObjectNo","KeyId")[0].Value;
    									detailParam["queryData"]["ObjectType"] = $filter("filter")($scope.selectedListItem,"ObjectType","KeyId")[0].Value;
                                        $scope.setTempletParam = function (templetParam){
                                            templetParam["ObjectNo"] = $filter("filter")($scope.selectedListItem,"ObjectNo","KeyId")[0].Value;
                                            templetParam["ObjectType"] = $filter("filter")($scope.selectedListItem,"ObjectType","KeyId")[0].Value;
                                        };
    								}
    								detailParam["queryData"]["BusinessType"] = $filter("filter")($scope.selectedListItem,"BusinessType","KeyId")[0].Value;    								
    							} else if("AcctTransferApply" == modelInfo.ObjectType){  //受托支付流程 
                                    if("101010" == modelInfo.ColId){		//受托支付信息
                                        if($filter("filter")($scope.selectedListItem,"IsPayeeAccountInBank","KeyId")[0].Value == 1){
                                            detailParam["queryData"]["modelNo"] = "PutOutInfo";
                                        } else {
                                            detailParam["queryData"]["modelNo"] = "OtherPutOutInfo";
                                        }
                                        detailParam["queryData"]["SerialNo"] = $filter("filter")($scope.selectedListItem,"ATSerialNo","KeyId")[0].Value;
                                    }else if("101020" == modelInfo.ColId){	//借据详情
        								detailParam["queryData"]["modelNo"] = "AcctTransferApply";
        								detailParam["queryData"]["SerialNo"] = $filter("filter")($scope.selectedListItem,"SerialNo","KeyId")[0].Value;
    									detailParam["queryData"]["ObjectType"] = $filter("filter")($scope.selectedListItem,"ObjectType","KeyId")[0].Value;
                                        $scope.setTempletParam = function (templetParam){
                                            templetParam["ObjectNo"] = $filter("filter")($scope.selectedListItem,"SerialNo","KeyId")[0].Value;
                                            templetParam["ObjectType"] = $filter("filter")($scope.selectedListItem,"ObjectType","KeyId")[0].Value;
                                        };
    								}
    							} else if("PayeeChangeApply" == modelInfo.ObjectType){  //收款人变更流程
    								if("101010" == modelInfo.ColId){		//借据信息
    									detailParam["queryData"]["modelNo"] = "PayeeListChange";
    									detailParam["queryData"]["SerialNo"] = $filter("filter")($scope.selectedListItem,"SerialNo","KeyId")[0].Value;
    									detailParam["queryData"]["BPSerialNo"] = $filter("filter")($scope.selectedListItem,"BPSerialNo","KeyId")[0].Value;
    									detailParam["queryData"]["ObjectType"] = $filter("filter")($scope.selectedListItem,"ObjectType","KeyId")[0].Value;
                                        $scope.setTempletParam = function (templetParam){
                                            templetParam["ObjectNo"] = $filter("filter")($scope.selectedListItem,"BPSerialNo","KeyId")[0].Value;
                                            templetParam["ObjectType"] = $filter("filter")($scope.selectedListItem,"ObjectType","KeyId")[0].Value;
                                        };
    								}
    							}else if("BAChangeApprove"==modelInfo.ObjectType){
    								if("101010" == modelInfo.ColId){		//批单变更详情	    							
    									for(var j = 0; j < $scope.selectedListItem.length;j++){//批单变更详情模版根据批单变更类型决定
    										if($scope.selectedListItem[j]["KeyId"] === "BAChangeType"){
    	      									detailParam["queryData"]["modelNo"] = "BAChangeType"+$scope.selectedListItem[j]["Value"];	
    										}
    									}
	    								detailParam["queryData"]["FTSerialNo"] = $filter("filter")($scope.selectedListItem,"FTSerialNo","KeyId")[0].Value;
	    								detailParam["queryData"]["SerialNo"] = $filter("filter")($scope.selectedListItem,"ObjectNo","KeyId")[0].Value;
	    								detailParam["queryData"]["ObjectNo"] = $filter("filter")($scope.selectedListItem,"ObjectNo","KeyId")[0].Value;
	    								detailParam["queryData"]["ObjectType"] = "jbo.app.BACHANGE_APPLY";
                                        $scope.setTempletParam = function (templetParam){
                                            templetParam["ObjectNo"] = $filter("filter")($scope.selectedListItem,"ObjectNo","KeyId")[0].Value;
                                            templetParam["ObjectType"] = "jbo.app.BACHANGE_APPLY";
                                        };
    								}else if("101020"==modelInfo.ColId){
	    								detailParam["queryData"]["FTSerialNo"] = $filter("filter")($scope.selectedListItem,"FTSerialNo","KeyId")[0].Value;
    									detailParam["queryData"]["SerialNo"] = $filter("filter")($scope.selectedListItem,"BASerialNo","KeyId")[0].Value;
	    								detailParam["queryData"]["ObjectNo"] = $filter("filter")($scope.selectedListItem,"BASerialNo","KeyId")[0].Value;
	    								detailParam["queryData"]["ObjectType"] ="CreditApply";
	    								detailParam["queryData"]["BusinessType"] = $filter("filter")($scope.selectedListItem,"BusinessType","KeyId")[0].Value;
                                        $scope.setTempletParam = function (templetParam){
                                            templetParam["ObjectNo"] = $filter("filter")($scope.selectedListItem,"BASerialNo","KeyId")[0].Value;
                                            templetParam["ObjectType"] = "CreditApply";
                                        };
    								}
    							}else if("BCChangeApprove"==modelInfo.ObjectType){
    								var rsParam = {  //获取主合同BusinessType
										SerialNo : $filter("filter")($scope.selectedListItem,"BCSerialNo","KeyId")[0].Value,
										ClassName : "com.amarsoft.app.als.mobile.impl.BCChangeUtil",
										MethodName : "findBusinessType"
    								};    							    							
    								var rs = $group.business(rsParam);
    								var BusinessType = rs["BusinessType"];
    								if("101010" == modelInfo.ColId){		//合同担保变更详情	    							
    	      							detailParam["queryData"]["modelNo"] = "BCChangeApplyInfo";	
	    								detailParam["queryData"]["SerialNo"] = $filter("filter")($scope.selectedListItem,"SerialNo","KeyId")[0].Value;
	    								detailParam["queryData"]["ObjectType"] = "jbo.app.BCCHANGE_APPLY";
    								}else if("101020"==modelInfo.ColId){
    									detailParam["queryData"]["SerialNo"] = $filter("filter")($scope.selectedListItem,"BCSerialNo","KeyId")[0].Value;
    									detailParam["queryData"]["ObjectNo"] = $filter("filter")($scope.selectedListItem,"BCSerialNo","KeyId")[0].Value;
    									detailParam["queryData"]["ObjectType"] = "BusinessContract";
        								detailParam["queryData"]["BusinessType"] = BusinessType;
                                        $scope.setTempletParam = function (templetParam){
                                            templetParam["ObjectNo"] = $filter("filter")($scope.selectedListItem,"BCSerialNo","KeyId")[0].Value;
                                            templetParam["ObjectType"] = "BusinessContract";
                                        };
    								}
    							}else if("GuarantyInOutApply"==modelInfo.ObjectType){
        								if("101010" == modelInfo.ColId){		//入库详情   							
        									detailParam["queryData"]["SerialNo"] = $filter("filter")($scope.selectedListItem,"ObjectNo","KeyId")[0].Value;
            								detailParam["queryData"]["modelNo"] = "GuarantyApplyInfo";
        								}
    							}else if("CreditApply"==modelInfo.ObjectType){
    								detailParam["queryData"]["SerialNo"] = $filter("filter")($scope.selectedListItem,"ObjectNo","KeyId")[0].Value;
									detailParam["queryData"]["ObjectNo"] = $filter("filter")($scope.selectedListItem,"ObjectNo","KeyId")[0].Value;
									detailParam["queryData"]["ObjectType"] = $filter("filter")($scope.selectedListItem,"ObjectType","KeyId")[0].Value;
    								detailParam["queryData"]["BusinessType"] = $filter("filter")($scope.selectedListItem,"BusinessType","KeyId")[0].Value;
                                    $scope.setTempletParam = function (templetParam){
                                        templetParam["ObjectNo"] = $filter("filter")($scope.selectedListItem,"ObjectNo","KeyId")[0].Value;
                                        templetParam["ObjectType"] = $filter("filter")($scope.selectedListItem,"ObjectType","KeyId")[0].Value;
                                    };
    							}else {
    								detailParam["queryData"]["SerialNo"] = $filter("filter")($scope.selectedListItem,"ObjectNo","KeyId")[0].Value;
									detailParam["queryData"]["ObjectNo"] = $filter("filter")($scope.selectedListItem,"ObjectNo","KeyId")[0].Value;
									detailParam["queryData"]["ObjectType"] = $filter("filter")($scope.selectedListItem,"ObjectType","KeyId")[0].Value;
    								detailParam["queryData"]["BusinessType"] = $filter("filter")($scope.selectedListItem,"BusinessType","KeyId")[0].Value;
    							}
								detailParam["queryData"]["ReturnType"] = "Info";
    						} 						
        			 		
    						if(detailParam.url == 'SelectCustomerInfo'){
    							detailParam["queryData"]["CustomerID"] = $filter("filter")($scope.selectedListItem,"CustomerID","KeyId")[0].Value;
    							detailParam["queryData"]["ReturnType"] = "Info";
    						}
    						//add by ylmeng 风险预警详情
    						if(detailParam.url == 'SelectRiskApplyInfo'){
    							detailParam["queryData"]["SerialNo"] = $filter("filter")($scope.selectedListItem,"ObjectNo","KeyId")[0].Value;
    							detailParam["queryData"]["ReturnType"] = "Info";
    						}
    						//add by ylmeng 风险分类详情
    						if(detailParam.url == 'SelectClassifyInfo'){
    							detailParam["queryData"]["BusinessObjectType"] = $filter("filter")($scope.selectedListItem,"BusinessObjectType","KeyId")[0].Value;
    							detailParam["queryData"]["BusinessObjectNo"] = $filter("filter")($scope.selectedListItem,"BusinessObjectNo","KeyId")[0].Value;
    							detailParam["queryData"]["SerialNo"] = $filter("filter")($scope.selectedListItem,"SerialNo","KeyId")[0].Value;
    							detailParam["queryData"]["ReturnType"] = "Info";
    						}
    						
    						//add by ylmeng调查报告
    						if(detailParam.url == "SelectOpinionReport"){
    							if(modelInfo.GroupId=="ApproveCreditApply"){
    								detailParam["queryData"]["GroupName"] = modelInfo.ColName;
    								if(modelInfo.ColName=="调查报告"){
    									detailParam["queryData"]["DocID"] = "09";
    								}else if(modelInfo.ColName=="审批单"){
    									detailParam["queryData"]["DocID"] = "14";
    								}else if(modelInfo.ColName=="审查报告"){
    									var objectNo = $filter("filter")($scope.selectedListItem,"ObjectNo","KeyId")[0].Value;
    									var objectType = $filter("filter")($scope.selectedListItem,"ObjectType","KeyId")[0].Value;
    									var param = null;
    									var paramData = function(){
    										var objectType = "";
    										var s_objectNo = "";
    										var s_objectType = "";
    										var s_customerId = "";
    										var s_loanType = "";
    										var s_applyType = "";
    										var s_businessType = "";
    										var s_userId = "";
    										var s_orgId = "";
    										var s_phaseNo = "";
    										var s_flowNo = "";
    										var b_finishFlag = false;
    									}
    									var queryParam = {
    				                            ClassName: "com.amarsoft.app.als.mobile.common.RunMethodUtil",
    				                            MethodName: "RunJavaMethodSqlca",
    				                            sClassName: "com.amarsoft.app.edoc.controller.EDocController",
    				                            sMethodName: "getInitParam",
    				                            args:"objectNo="+objectNo+",objectType="+objectType
    				                        };
    				                    var returnValue = $group.business(queryParam).ReturnValue;
    									
    									if(returnValue.indexOf("@") > -1){
    										param = returnValue.split("@");
    										paramData.s_objectNo = param[0];
    										paramData.s_objectType = param[1];
    										paramData.s_businessType = param[2];
    										paramData.s_loanType = param[3];
    										paramData.s_applyType = param[4];
    										paramData.s_customerId = param[5];
    										paramData.s_phaseNo = param[6];
    										paramData.s_flowNo = param[7];
    										paramData.s_userId = param[8];
    										paramData.s_orgId = param[9];
    										paramData.s_contractFlag = param[10];
    									}
    									
    									queryParam = {
    				                            ClassName: "com.amarsoft.app.als.mobile.common.RunMethodUtil",
    				                            MethodName: "RunJavaMethodSqlca",
    				                            sClassName: "com.amarsoft.app.edoc.controller.EDocCheck",
    				                            sMethodName: "reportTypeSelect",
    				                            args:"objectType="+paramData.s_objectType+",businessType="+paramData.s_businessType+",custType="+paramData.s_loanType+",objectNo="+objectNo+",flag1="+"02@16"
    				                        };
    				                    var result = $group.business(queryParam).ReturnValue;;
    									
    									
    									detailParam["queryData"]["DocID"] = result;
    								}
    							}
    							detailParam["queryData"]["ObjectNo"] = $filter("filter")($scope.selectedListItem,"ObjectNo","KeyId")[0].Value;
    							detailParam["queryData"]["ObjectType"] = $filter("filter")($scope.selectedListItem,"ObjectType","KeyId")[0].Value;
    							detailParam["queryData"]["ReturnType"] = "Info";
        			 		}
    						
    						
    						if(detailParam.url == 'SelectGuarantyList'){
    							var param = {};
    							param["SerialNo"] = "2018022800000001";
    							param["ObjectType"] = "BCChangeApprove";
								$timeout(function () {
									$scope.$broadcast('to_guarantyListData',param);
							    }, 100);
    						}
    						if(detailParam.url == 'SelectFlowTaskList'){
    							detailParam["queryData"]["ObjectNo"] = $filter("filter")($scope.selectedListItem,"ObjectNo","KeyId")[0].Value;
    							detailParam["queryData"]["ObjectType"] = $filter("filter")($scope.selectedListItem,"ObjectType","KeyId")[0].Value;	 		   
    						}
    						if(detailParam.url == 'SelectOpinionList'){
    							if("BCChangeApprove" == modelInfo.ObjectType){
    								detailParam["queryData"]["BusinessType"] = "";
    								detailParam["queryData"]["ObjectNo"] = $filter("filter")($scope.selectedListItem,"SerialNo","KeyId")[0].Value;
    								detailParam["queryData"]["ObjectType"] = $filter("filter")($scope.selectedListItem,"ObjectType","KeyId")[0].Value;
    							}else{
    								if("AcctTransferApply" == modelInfo.ObjectType||"PayeeChangeApply" == modelInfo.ObjectType||"CustomerRiskApply" == modelInfo.ObjectType ){  //受托支付流程和收款人变更流程(没有BusinessType)
        								detailParam["queryData"]["BusinessType"] = "";
        							} else{    								
        								detailParam["queryData"]["BusinessType"] = $filter("filter")($scope.selectedListItem,"BusinessType","KeyId")[0].Value;
        							}
        							if("PayeeChangeApply" == modelInfo.ObjectType){   //收款人变更流程的list数据中对应ObjectNo的key是PASerialNo
            							detailParam["queryData"]["ObjectNo"] = $filter("filter")($scope.selectedListItem,"PASerialNo","KeyId")[0].Value;
//        							} else if("BCChangeApprove" == modelInfo.ObjectType){
//        								detailParam["queryData"]["ObjectNo"] = $filter("filter")($scope.selectedListItem,"FSSerialNo","KeyId")[0].Value;
        							}else {
        								detailParam["queryData"]["ObjectNo"] = $filter("filter")($scope.selectedListItem,"ObjectNo","KeyId")[0].Value;
        							}
        							detailParam["queryData"]["ObjectType"] = modelInfo.ObjectType;
    							}
    						}
    					}
    				}
    				
    				
    				//切换tab页后事件
    				$scope.chooseModel = function(model,data){
    					if(model["Action"] === "SelectPayeeInfo"){ //收款人变更流程获取原收款人信息
    						$scope.modelQueryData = {};
    						$scope.modelQueryData.modelNo = "PayeeInfoList";  //查询原收款人列表模板
    						$scope.modelQueryData.PASerialNO = $filter("filter")($scope.selectedListItem,"PASerialNo","KeyId")[0].Value;    //查询原收款人列表模板主键
    						$scope.modelQueryData.ReturnType = "Info";
    						$scope.modelQueryData.Action =model["Action"];
							$timeout(function() {
    							$scope.$broadcast('to_PayeeList',$scope.modelQueryData);
    						}, 100);
    					} else if(model["Action"] === 'SelectFeeInfo'){//核算还款帐号变更  中的费用tab
    						$scope.modelQueryData = {};
							$scope.modelQueryData.modelNo = "AcctFeeList";  //费用信息列表模板
							$scope.modelQueryData.ObjectNo = $filter("filter")($scope.selectedListItem,"ObjectNo","KeyId")[0].Value;    //查询原收款人列表模板主键
							$scope.modelQueryData.ObjectType="jbo.app.ACCT_LOAN_CHANGE";
							$scope.modelQueryData.Status="0@1";
							$scope.modelQueryData.CustomerID=$filter("filter")($scope.selectedListItem,"CustomerId","KeyId")[0].Value;
							$scope.ngController="ApproveTransactionFeeList";
							$timeout(function (){
								$scope.$broadcast('to-ApproveTransactionFeeList',$scope.modelQueryData);
							});
						}else if(model["Action"]==="SelectDepositAccountsInfo"){
							$scope.modelQueryData = {};
							$scope.modelQueryData.modelNo = "DepositAccountsList";  //原还款帐号信息列表模板
							$scope.modelQueryData.ObjectNo = $filter("filter")($scope.selectedListItem,"ObjectNo","KeyId")[0].Value;    //查询原收款人列表模板主键
							$scope.modelQueryData.ObjectType="jbo.app.ACCT_LOAN_CHANGE";
							$scope.modelQueryData.Status="2";
							$scope.modelQueryData.CustomerID=$filter("filter")($scope.selectedListItem,"CustomerId","KeyId")[0].Value;
							$scope.ngController="ApproveDepositAccountsList";
							$timeout(function (){
								$scope.$broadcast('to-ApproveDepositAccountsList',$scope.modelQueryData);
							});   							
						}else if(model["Action"]==="SelectDepositAccountsInfo1"){
							$scope.modelQueryData = {};
							$scope.modelQueryData.modelNo = "DepositAccountsList";  //新还款帐号信息列表模板
							$scope.modelQueryData.ObjectNo = $filter("filter")($scope.selectedListItem,"ObjectNo","KeyId")[0].Value;    //查询原收款人列表模板主键
							$scope.modelQueryData.ObjectType="jbo.app.ACCT_LOAN_CHANGE";
							$scope.modelQueryData.Status="0";
							$scope.modelQueryData.CustomerID=$filter("filter")($scope.selectedListItem,"CustomerId","KeyId")[0].Value;
							$scope.ngController="ApproveDepositAccountsList";
							$timeout(function (){
								$scope.$broadcast('to-ApproveDepositAccountsList',$scope.modelQueryData);
							});   		
						}else if(model["Action"] === "SelectGuarantyList"){
							$scope.modelQueryData = {};
							$scope.modelQueryData.SerialNo =$filter("filter")($scope.selectedListItem,"ObjectNo","KeyId")[0].Value;
							$scope.modelQueryData.ObjectType = model.ObjectType;
							$timeout(function() {
								$scope.$broadcast('to_guarantyListData',$scope.modelQueryData);
							}, 100);
						}else{ 
							if(model.ColName.indexOf('影像') != -1){
								  $timeout(function () {
									  $scope.dic = {};
									  //$scope.dic.ObjectType = "CreditApply";
									  $scope.dic.ObjectType = $filter("filter")($scope.selectedListItem,"ObjectType","KeyId")[0].Value;
									  $scope.dic.loanType = "";
									  $scope.dic.showFlag = "false";//业务签批不展示影像增加按钮
									  if($scope.selectedListItem != undefined){
										  if(model.GroupId == "PayeeApprove"){
											  $scope.dic.ObjectNo = $filter("filter")($scope.selectedListItem,"PASerialNo","KeyId")[0].Value;
										  }else{
											  $scope.dic.ObjectNo = $filter("filter")($scope.selectedListItem,"ObjectNo","KeyId")[0].Value;
										  }
										  $scope.$broadcast('to-screenage',$scope.dic);
									  }
								  }, 100);
							}else{
								$scope.$broadcast('to-detail',data);
							}
    					}
    				}
    			});   
    		}
    	})
    	
    	
    	//list点击事件
    	$scope.goDetail = function(item, index){
    		$scope.tabIndex = 0;//默认选择第一个tab
			$scope.listIndex = index;
			$scope.selectedListItem = item;
    		//改变标识位，显示详情页面
            $rootScope.rightContentListShowFlag = false;
    		$scope.title = "签批信息详情"
            //获取详情页tab导航信息，并默认选择第一条
			$scope.changeModel($scope.listGroup.tabGroup[$scope.tabIndex],$scope.tabIndex);
		}
        $scope.opinionInfos = {};
      //提交
        $scope.OpinionNo="";
    	//签署意见并提交
		$scope.signOpinion = function(){
			$scope.SerialNoFilter="";//从选中的列表中获取所需的主键
			$scope.FTSerialNoFilter="";//从选中的列表中获取所需的主键

			//**********过滤SerialNO*****start****
			$scope.filterSerialNoParam={};
			var filterSerialNoParam = {  //获取合同主键的请求数据
				ClassName : "com.amarsoft.app.als.mobile.impl.ComponentQuery",
				MethodName : "getFilterSerialNo",
				TransactionType : "null"
			};
							
			//**********过滤SerialNO******* end**
			
			//**********过滤FTSerialNO******* start**
			$scope.filterFTSerialNoParam={};
			var filterFTSerialNoParam = {  //获取合同主键的请求数据										
				ClassName : "com.amarsoft.app.als.mobile.impl.ComponentQuery",
				MethodName : "getFilterFTSerialNo",
				TransactionType:"Sqlca"
			}; 
			//**********过滤FTSerialNO******* end**
			//遍历$scope.selectedListItem，进行参数传入filterSerialNoParam对象和filterFTSerialNoParam对象
			for(var i=0;i<$scope.selectedListItem.length;i++){			
				filterSerialNoParam[$scope.selectedListItem[i]["KeyId"]]=$scope.selectedListItem[i]["Value"];
				filterFTSerialNoParam[$scope.selectedListItem[i]["KeyId"]]=$scope.selectedListItem[i]["Value"];
			}		
			//执行查询，并返回所需参数
			$scope.SerialNoFilter = $group.business(filterSerialNoParam)["SerialNo"];
			$scope.FTSerialNoFilter = $group.business(filterFTSerialNoParam)["FTSerialNo"];

			/*业务签批前校验 begin*/
			var objectType = $filter("filter")($scope.selectedListItem,"ObjectType","KeyId")[0].Value;
            if(objectType === "CreditApply"){
            	var objectNo = $filter("filter")($scope.selectedListItem,"ObjectNo","KeyId")[0].Value;
                $scope.submitApproveCheck = function(){
                    var defer = $q.defer();
                    var serialNo = $scope.FTSerialNoFilter;
                    var flowNo = $filter("filter")($scope.selectedListItem,"FlowNo","KeyId")[0].Value;
                    var phaseNo = $filter("filter")($scope.selectedListItem,"PhaseNo","KeyId")[0].Value;
                    var customerID = $filter("filter")($scope.selectedListItem,"CustomerID","KeyId")[0].Value;
                    var businessType = $filter("filter")($scope.selectedListItem,"BusinessType","KeyId")[0].Value;
                    var loanType = $filter("filter")($scope.selectedListItem,"LoanType","KeyId")[0].Value;
                    var applyType = $filter("filter")($scope.selectedListItem,"ApplyType","KeyId")[0].Value;
                    var occurType = $filter("filter")($scope.selectedListItem,"OccurType","KeyId")[0].Value;

                    //提示性检查
                    var queryParam = {
                        ClassName: "com.amarsoft.app.als.mobile.common.RunMethodUtil",
                        MethodName: "RunJavaMethodSqlca",
                        sClassName: "com.amarsoft.app.apply.credit.CreditApplyWarnCheck",
                        sMethodName: "submitCheck",
                        args: "objectType=" + objectType + ",objectNo=" + objectNo
                    };
                    var result = $group.business(queryParam);
                    $group.mustMsg(result["ReturnValue"]).then(function(returnValue){
                        if (returnValue){
                            defer.resolve(false);
                            return;
                        }
                        //必要性检查
                        queryParam = {
                            ClassName: "com.amarsoft.app.als.mobile.common.RunMethodUtil",
                            MethodName: "RunJavaMethodSqlca",
                            sClassName: "com.amarsoft.app.approve.credit.CreditApproveCheck",
                            sMethodName: "submitCheck",
                            args: "serialNoFT=" + serialNo + ",objectNo=" + objectNo + ",objectType=" + objectType + ",flowNo=" + flowNo + ",phaseNo=" + phaseNo + ",customerID=" + customerID
                        };
                        result = $group.business(queryParam);
                        $group.mustMsg(result["ReturnValue"]).then(function(returnValue){
                            if (returnValue){
                                defer.resolve(false);
                                return;
                            }
                            //获取当前用户在当前审批流程的角色编号返回角色编号
                            queryParam = {
                                ClassName: "com.amarsoft.app.als.mobile.common.RunMethodUtil",
                                MethodName: "RunJavaMethodSqlca",
                                sClassName: "com.amarsoft.app.approve.credit.CreditApproveCheck",
                                sMethodName: "getCurrentRole",
                                args: "flowNo=" + flowNo + ",phaseNo=" + phaseNo
                            };
                            var currentRole = $group.business(queryParam)["ReturnValue"];
                            //取消对审批流程的过滤
                            if( "2020" !== businessType && "2050030" !== businessType){
                                queryParam = {
                                    ClassName: "com.amarsoft.app.als.mobile.common.RunMethodUtil",
                                    MethodName: "RunJavaMethodSqlca",
                                    sClassName: "cn.com.tansun.sbmo.service.workflow.RuleManager",
                                    sMethodName: "verifyExamRpt",
                                    args: "objectNo=" + objectNo + ",objectType=" + objectType
                                };
                                var sReturn = $group.business(queryParam)["ReturnValue"];
                                if("EMPTY1" === sReturn){
                                    $ionicLoading.show({
                                        title: "业务处理",
                                        template: "审查报告没有生成！",
                                        duration: 1000
                                    });
                                	defer.resolve(false);
                                	return;
								}
                            }
                            //查询是否是评分节点
                            queryParam = {
                                ClassName: "com.amarsoft.app.als.mobile.common.RunMethodUtil",
                                MethodName: "RunJavaMethodSqlca",
                                sClassName: "cn.com.tansun.sbmo.service.workflow.RuleManager",
                                sMethodName: "queryNode",
                                args: "objectNo=" + objectNo + ",objectType=" + objectType + ",phaseNo=" + phaseNo
                            };
                            var sReturn = $group.business(queryParam)["ReturnValue"];
                            if("SCORE" === sReturn){
                                queryParam = {
                                    ClassName: "com.amarsoft.app.als.mobile.common.RunMethodUtil",
                                    MethodName: "RunJavaMethodSqlca",
                                    sClassName: "cn.com.tansun.sbmo.service.workflow.RuleManager",
                                    sMethodName: "isNeedValidteScore",
                                    args: "businessType=" + businessType
                                };
                                sReturn = $group.business(queryParam)["ReturnValue"];
                                if(sReturn === "true"){
                                    queryParam = {
                                        ClassName: "com.amarsoft.app.als.mobile.common.RunMethodUtil",
                                        MethodName: "RunJavaMethodSqlca",
                                        sClassName: "cn.com.tansun.sbmo.service.workflow.RuleManager",
                                        sMethodName: "scoreRules",
                                        args: "objectNo=" + objectNo + ",objectType=" + objectType + ",phaseNo=" + phaseNo
                                    };
                                    sReturn = $group.business(queryParam)["ReturnValue"];
                                    if("EMPTY" === sReturn.split(";")[1]){
                                        $ionicLoading.show({
                                            title: "业务处理",
                                            template: "请先进行计算评分！",
                                            duration: 1000
                                        });
                                        defer.resolve(false);
                                        return;
									}
								}
							}

                            //更新批复金额、利率组件信息到申请表中、利率组件信息到签署意见表中
                            queryParam = {
                                ClassName: "com.amarsoft.app.als.mobile.common.RunMethodUtil",
                                MethodName: "RunJavaMethodSqlca",
                                sClassName: "com.amarsoft.app.apply.credit.AddApproveSumAction",
                                sMethodName: "addApproveSumAction",
                                args: "objectNo=" + objectNo + ",objectType=" + objectType
                            };
                            result = $group.business(queryParam);
                            $group.mustMsg(result["ReturnValue"]).then(function(returnValue){
                                if (returnValue){
                                    defer.resolve(false);
                                    return;
                                }

                                /*
                                * to do 小企业条线重新生成审查报告
                                * */

                                //调用自动审批
                                if(applyType === "IndependentApply" && occurType === "010" && (currentRole === "2332" || currentRole === "4332") && businessType === "1110220"){
                                    queryParam = {
                                        ClassName: "com.amarsoft.app.als.mobile.common.RunMethodUtil",
                                        MethodName: "RunJavaMethodSqlca",
                                        sClassName: "cn.com.tansun.sbmo.service.workflow.RuleManager",
                                        sMethodName: "getAuto",
                                        args: "objectNo=" + objectNo + ",objectType=" + objectType
                                    };
                                    var autoFlag = $group.business(queryParam)["ReturnValue"];
                                    if(autoFlag === "2"){
                                    	if(loanType === "0301" || loanType === "0302"){
                                    		var isAuto = 0;
                                    		$ionicPopup.confirm({
                                                title:"业务提示",
                                                template:"是否进行自动审批？",
                                                okText:"是",
                                                cancelText:"否"
											}).then(function(res){
												if(res){
													isAuto = 1;

                                                    queryParam = {
                                                        ClassName: "com.amarsoft.app.als.mobile.common.RunMethodUtil",
                                                        MethodName: "RunJavaMethodSqlca",
                                                        sClassName: "cn.com.tansun.sbmo.service.workflow.RuleManager",
                                                        sMethodName: "autoApprovalModel",
                                                        args: "objectNo=" + objectNo + ",objectType=" + objectType + ",flowNo=" + flowNo + ",phaseNo=" + phaseNo
															+ ",businessType=" + businessType + ",customerId=" + customerID + ",serialNo=" + serialNo + ",isAuto" + isAuto
                                                    };
                                                    var sReturn = $group.business(queryParam)["ReturnValue"];
                                                    if(typeof(sReturn) !== "undefined" && (sReturn === "False" || sReturn === "ERR,ERR")){
                                                    	$ionicLoading.show({
                                                            title: "业务处理",
                                                            template: "调用自动审批模型计算接口报错！",
                                                            duration: 1000
														});
                                                    	defer.resolve(false);
                                                    	return;
													}else if(typeof(sReturn) !== "undefined" && sReturn !== "True"){
                                                    	var result = sReturn.split(",");
                                                        //增加期限利率的塞值
                                                        queryParam = {
                                                            ClassName: "com.amarsoft.app.als.mobile.common.RunMethodUtil",
                                                            MethodName: "RunJavaMethodSqlca",
                                                            sClassName: "cn.com.tansun.sbmo.service.workflow.RuleManager",
                                                            sMethodName: "updateFO1",
                                                            args: "objectNo=" + objectNo + ",objectType=" + objectType + ",flowNo=" + flowNo + ",phaseNo=" + phaseNo
                                                            + ",businessType=" + businessType + ",customerId=" + customerID + ",serialNo=" + serialNo
                                                        };
                                                        $group.business(queryParam)["ReturnValue"];
                                                        if(result[0] === "success" && isAuto === 1){
                                                            //更新批复金额,并审批通过该笔业务
                                                            queryParam = {
                                                                ClassName: "com.amarsoft.app.als.mobile.common.RunMethodUtil",
                                                                MethodName: "RunJavaMethodSqlca",
                                                                sClassName: "cn.com.tansun.sbmo.service.workflow.RuleManager",
                                                                sMethodName: "updateApprovalSum1",
                                                                args: "objectNo=" + objectNo + ",serialNo=" + serialNo + ",businessSum=" + result[1]
                                                            };
                                                            sReturn = $group.business(queryParam)["ReturnValue"];
                                                            if(typeof(sReturn) !== "undefined" && sReturn === "FAIL"){
                                                                $ionicLoading.show({
                                                                    title: "业务处理",
                                                                    template: "系统错误！",
                                                                    duration: 1000
                                                                });
                                                                defer.resolve(false);
                                                                return;
                                                            }
                                                            //自动生成审批单
															var phaseNo = $group.RunMethod("WorkFlowEngine","GetPhaseNo",objectType + "," + objectNo);
                                                            if(phaseNo === "1000"){
                                                                queryParam = {
                                                                    ClassName: "com.amarsoft.app.als.mobile.common.RunMethodUtil",
                                                                    MethodName: "RunJavaMethodSqlca",
                                                                    sClassName: "com.amarsoft.app.pdf.parse.CreatePdf",
                                                                    sMethodName: "createNewPdfCheck",
                                                                    args: "objectNo=" + objectNo + ",objectType=" + objectType
                                                                };
                                                                sReturn = $group.business(queryParam)["ReturnValue"];
                                                                if(sReturn === "true"){
                                                                	var savePath = $group.RunMethod("ViewApproveReport","getReportSavePath",objectType + "," + objectNo + ",15");
                                                                	if(savePath === "Null" || savePath === ""){
                                                                        queryParam = {
                                                                            ClassName: "com.amarsoft.app.als.mobile.common.RunMethodUtil",
                                                                            MethodName: "RunJavaMethodSqlca",
                                                                            sClassName: "com.amarsoft.app.pdf.parse.CreatePdf",
                                                                            sMethodName: "createNewPdf",
                                                                            args: "objectNo=" + objectNo + ",objectType=" + objectType + ",DocID=15"
                                                                        };
                                                                        $group.business(queryParam);
																	}
																}
															}
                                                            $ionicLoading.show({
                                                                title: "业务处理",
                                                                template: "已批准！",
                                                                duration: 1000
															});
														}else if(result[0] === "fail" && isAuto === 1){
                                                            //更新批复金额,并否决该笔业务
                                                            queryParam = {
                                                                ClassName: "com.amarsoft.app.als.mobile.common.RunMethodUtil",
                                                                MethodName: "RunJavaMethodSqlca",
                                                                sClassName: "cn.com.tansun.sbmo.service.workflow.RuleManager",
                                                                sMethodName: "updateApprovalSum2",
                                                                args: "objectNo=" + objectNo + ",serialNo=" + serialNo + ",businessSum=" + result[1]
                                                            };
                                                            sReturn = $group.business(queryParam)["ReturnValue"];
                                                            if(typeof(sReturn) !== "undefined" && sReturn === "FAIL"){
                                                                $ionicLoading.show({
                                                                    title: "业务处理",
                                                                    template: "系统错误！",
                                                                    duration: 1000
                                                                });
                                                                defer.resolve(false);
                                                                return;
                                                            }
                                                            $ionicLoading.show({
                                                                title: "业务处理",
                                                                template: "已否决！",
                                                                duration: 1000
                                                            });
														}
														defer.resolve(true);
                                                        return;
													}
												}else{
													defer.resolve(true);
													return;
												}
											});
										}
									}
								}else{
                                	/*
                                	* to do 个人业务要重新生成调查报告来获取最新签署的意见分行行长2100 支行行长4100
                                	* 个人审查报告在授信审批部副总经理和总经理都要生成一次
                                	* */
                                    defer.resolve(true);
                                    return;
								}
                            });
						});
					});
                    return defer.promise;
                };
            }else if(objectType === "BAChangeApply"){
            	var objectNo = $scope.SerialNoFilter;
            	$scope.submitApproveCheck = function(){
            		var defer = $q.defer();
            		var ftSerialNo = $scope.FTSerialNoFilter;

                    //提交时必要性检查
                    var queryParam = {
                        ClassName: "com.amarsoft.app.als.mobile.common.RunMethodUtil",
                        MethodName: "RunJavaMethodSqlca",
                        sClassName: "com.amarsoft.app.apply.bachange.checkBAChangeApprove",
                        sMethodName: "submitCheck",
                        args: "serialNoFT=" + ftSerialNo + ",objectType=" + objectType + ",objectNo=" + objectNo
                    };
                    var result = $group.business(queryParam);
                    $group.mustMsg(result["ReturnValue"]).then(function(returnValue){
                    	if(returnValue){
                    		defer.resolve(false);
                    		return;
						}
						defer.resolve(true);
					});
                    return defer.promise;
				};
			}else if(objectType === "PutOutApply"){
            	var objectNo = $scope.SerialNoFilter;
            	$scope.submitApproveCheck = function(){
            		var defer = $q.defer();
            		var serialNoFT = $scope.FTSerialNoFilter;
            		var contractSerialNo = $filter("filter")($scope.selectedListItem,"ContractSerialNo","KeyId")[0].Value;
            		var loanType = $filter("filter")($scope.selectedListItem,"LoanType","KeyId")[0].Value;

                    //提交时必要性检查
                    var queryParam = {
                        ClassName: "com.amarsoft.app.als.mobile.common.RunMethodUtil",
                        MethodName: "RunJavaMethodSqlca",
                        sClassName: "com.amarsoft.app.approve.putout.PutoutApproveSubmitCheck",
                        sMethodName: "submitCheck",
                        args: "serialNoFT=" + serialNoFT + ",serialNoBC=" + contractSerialNo + ",objectNo=" + objectNo + ",objectType=" + objectType + ",loanType=" + loanType + ",userID=" + AmApp.userID
                    };
                    var result = $group.business(queryParam);
                    $group.mustMsg(result["ReturnValue"]).then(function(returnValue){
                        if(returnValue){
                            defer.resolve(false);
                            return;
                        }
                        defer.resolve(true);
                    });
                    return defer.promise;
				};
			}else if(objectType === "AcctTransferApply"){
            	var objectNo = $scope.SerialNoFilter;
                $scope.submitApproveCheck = function(){
                	var defer = $q.defer();
                	var serialNoFT = $scope.FTSerialNoFilter;

                    //提交时的校验
                    var queryParam = {
                        ClassName: "com.amarsoft.app.als.mobile.common.RunMethodUtil",
                        MethodName: "RunJavaMethodSqlca",
                        sClassName: "com.amarsoft.app.approve.accttransfer.AcctTransferApproveCheck",
                        sMethodName: "submitCheck",
                        args: "serialNoFT=" + serialNoFT + ",objectType=" + objectType + ",objectNo=" + objectNo
                    };
                    var result = $group.business(queryParam);
                    $group.mustMsg(result["ReturnValue"]).then(function(returnValue){
                        if(returnValue){
                            defer.resolve(false);
                            return;
                        }
                        defer.resolve(true);
					});
                    return defer.promise;
				};
            }else if(objectType === "PayeeChangeApply"){
                var objectNo = $scope.SerialNoFilter;
                $scope.submitApproveCheck = function(){
                	var defer = $q.defer();
                	var serialNoFT = $scope.FTSerialNoFilter;

                    //提交时的校验
                    var queryParam = {
                        ClassName: "com.amarsoft.app.als.mobile.common.RunMethodUtil",
                        MethodName: "RunJavaMethodSqlca",
                        sClassName: "com.amarsoft.app.approve.changetransfer.ChangeTransferApproveSubmitCheck",
                        sMethodName: "submitCheck",
                        args: "serialNoFT=" + serialNoFT
                    };
                    var result = $group.business(queryParam);
                    $group.mustMsg(result["ReturnValue"]).then(function(returnValue){
                        if(returnValue){
                            defer.resolve(false);
                            return;
                        }
                        defer.resolve(true);
					});
                    return defer.promise;
				};
			}else if(objectType === "TransactionApply"){
                var objectNo = $scope.SerialNoFilter;
                $scope.submitApproveCheck = function(){
                	var defer = $q.defer();
                	var serialNoFT = $scope.FTSerialNoFilter;

                    //提交时的校验
                    var queryParam = {
                        ClassName: "com.amarsoft.app.als.mobile.common.RunMethodUtil",
                        MethodName: "RunJavaMethodSqlca",
                        sClassName: "com.amarsoft.app.approve.transaction.TransactionApproveSubmitCheck",
                        sMethodName: "submitCheck",
                        args: "ObjectNo=" + objectNo + ",SerialNoFT=" + serialNoFT
                    };
                    var result = $group.business(queryParam);
                    $group.mustMsg(result["ReturnValue"]).then(function(returnValue){
                        if(returnValue){
                            defer.resolve(false);
                            return;
                        }
                        defer.resolve(true);
                    });
                    return defer.promise;
				};
			}else if(objectType === "CustomerRiskApply"){
                var objectNo = $scope.SerialNoFilter;
                $scope.submitApproveCheck = function(){
                    var defer = $q.defer();
                    var serialNoFT = $scope.FTSerialNoFilter;

                    //提交时的校验
                    var queryParam = {
                        ClassName: "com.amarsoft.app.als.mobile.common.RunMethodUtil",
                        MethodName: "RunJavaMethodSqlca",
                        sClassName: "com.amarsoft.app.approve.risksignal.RiskSignalApproveCheck",
                        sMethodName: "submitCheck",
                        args: "serialNoFT=" + serialNoFT
                    };
                    var result = $group.business(queryParam);
                    $group.mustMsg(result["ReturnValue"]).then(function(returnValue){
                        if(returnValue){
                            defer.resolve(false);
                            return;
                        }
                        defer.resolve(true);
                    });
                    return defer.promise;
				};
			}else if(objectType === "ClassifyRApply"){
                var objectNo = $scope.SerialNoFilter;
                $scope.submitApproveCheck = function(){
                    var defer = $q.defer();
                    var serialNoFT = $scope.FTSerialNoFilter;

                    //提交时的校验
                    var queryParam = {
                        ClassName: "com.amarsoft.app.als.mobile.common.RunMethodUtil",
                        MethodName: "RunJavaMethodSqlca",
                        sClassName: "com.amarsoft.app.approve.changetransfer.ChangeTransferApproveSubmitCheck",
                        sMethodName: "submitCheck",
                        args: "serialNoFT=" + serialNoFT
                    };
                    var result = $group.business(queryParam);
                    $group.mustMsg(result["ReturnValue"]).then(function(returnValue){
                        if(returnValue){
                            defer.resolve(false);
                            return;
                        }
                        defer.resolve(true);
                    });
                    return defer.promise;
                };
			}
            /*业务签批前校验 end*/
			if($scope.ApproveType == "ApproveCreditApply"){		//特殊业务签批
				$scope.showModal("templates/common/commonModelView/signOpinionModal1.html");
				$timeout(function(){					
					$scope.$broadcast("go-SignOpinionController",{
						$scope:$scope,
						SerialNo:$scope.SerialNoFilter,
						ObjectType:$filter("filter")($scope.selectedListItem,"ObjectType","KeyId")[0].Value,
						FlowNo:$filter("filter")($scope.selectedListItem,"FlowNo","KeyId")[0].Value,
						PhaseNo:$filter("filter")($scope.selectedListItem,"PhaseNo","KeyId")[0].Value,
						PhaseName:$filter("filter")($scope.selectedListItem,"PhaseName","KeyId")[0].Value,
						OccurType:$filter("filter")($scope.selectedListItem,"OccurType","KeyId")[0].Value,
						ObjectNo:$filter("filter")($scope.selectedListItem,"ObjectNo","KeyId")[0].Value,
						FTSerialNo:$scope.FTSerialNoFilter,
						ApplyType:$scope.ApproveType});
				},100)
			} else {	//一般业务签批
				$scope.showModal("templates/common/commonModelView/signOpinionModal.html");
				$timeout(function(){					
					$scope.$broadcast("go-SignOpinionController",{
						$scope:$scope,
						SerialNo:$scope.SerialNoFilter,
						ObjectType:$filter("filter")($scope.selectedListItem,"ObjectType","KeyId")[0].Value,
						FlowNo:$filter("filter")($scope.selectedListItem,"FlowNo","KeyId")[0].Value,
						PhaseNo:$filter("filter")($scope.selectedListItem,"PhaseNo","KeyId")[0].Value,
						FTSerialNo:$scope.FTSerialNoFilter,
						PhaseName:$filter("filter")($scope.selectedListItem,"PhaseName","KeyId")[0].Value,
						ApplyType:$scope.ApproveType});
				},100)
				//生成主键FLOW_OPINION表的主键opinionNO，在签署意见时，保存到数据记录中		    			
		    	$scope.getSerialNo("FLOW_OPINION","OpinionNo");			           
		        //获取修改数据
				 $scope.setSerialNo = function(serialNo){
		            	$scope.OpinionNo = serialNo;
				}
			}
			 
		};
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
        			if($scope.ApproveType == "ApproveCreditApply"){
        				var serialNo = $filter("filter")($scope.selectedListItem,"ObjectNo","KeyId")[0].Value;
        			} else {
        				var serialNo = $scope.SerialNoFilter;
        			}
                	runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
                		"selectApplyAndOpinionInfo", {
                        SerialNo: serialNo,
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
    //收款人信息list展示
    .controller('SelectPayeeDetailList', function ($scope,$filter,$http,$ionicLoading,$ionicPopup,$state,$ionicModal,$timeout,$filter) {
    	
    	$scope.serviceUrl = "";
    	$scope.$on("to_PayeeList",function(e,data){
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
			detailModalQueryParam["queryData"]["readonly"] = "true";
			angular.forEach($scope.selectedDetailListItem,function(Item, Index){
				if(Item.KeyId == "SerialNo"){
					detailModalQueryParam["queryData"]["SerialNo"] = Item.Value;
				}
			})
			detailModalQueryParam["queryData"]["ReturnType"] = "Info";  
		}
		
		
		//List点击行事件返回对应模版
		$scope.$on('to-listDetailInfo', function (e,detailParam) {
			var url = "SelectObjectInfo";
			//重置页面解析对象
			$scope.listDetails = [];
			$scope.detailListCheck = {};
			$scope.detailListInfo = {};
			$scope.detailListDataParam = {};
			$scope.detailListInfoNoUpdate = {}; 
			if(detailParam["url"] !== "undefined" && typeof(detailParam["url"]) !== "undefined" && detailParam["url"] !== "" && detailParam["url"] !== null ){
				url = detailParam["url"];
			}
			if(url !== "undefined" && url !== "" && url !== null){
				//接收服务端返回的用户详情数据
				runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,url, detailParam["queryData"], function (data, status) {
					if(typeof(data["array"]) === "object"){
						$scope.listDetails = data["array"];
						for (var i = 0; i < data["array"].length; i++) {
							//增加参数，是否展示，页面载入时均展示
							data["array"][i]['showGroup'] = true;
							//获取模版json中的groupColArray的数据，按照json格式中的 <KeyId：Value>存放到$scope.marketInfo中做绑定并用于页面展示
							$scope.groupColArray = data["array"][i].groupColArray;
							if($scope.groupColArray !== "undefined" &&
									typeof($scope.groupColArray) !== "undefined"){
								for(var j = 0; j < $scope.groupColArray.length;j++){
									if($scope.groupColArray[j].ColRequired === "1"){
										$scope.detailListCheck[$scope.groupColArray[j].KeyId] = false;
									}
									if($scope.groupColArray[j].ColUpdateable == '1'){
										if((!$scope.groupColArray[j].ReadOnly && !$scope.groupColArray[j].Hide)
												|| $scope.groupColArray[j]["KeyId"] === "SerialNo" 
												|| $scope.groupColArray[j]["KeyId"] === "ObjectNo"
												|| $scope.groupColArray[j]["KeyId"] === "RelativeSerialNo"
												|| $scope.groupColArray[j]["KeyId"] === "InputUserID"
												|| $scope.groupColArray[j]["KeyId"] === "InputUserOrgID"
												|| $scope.groupColArray[j]["KeyId"] === "UpdateUserID"
												|| $scope.groupColArray[j]["KeyId"] === "UpdateUserOrgID"){
											$scope.detailListDataParam[$scope.groupColArray[j].KeyId] = $scope.groupColArray[j].Value;
										}
										if($scope.groupColArray[j].ColCheckFormat === "3"){
											var value = $scope.groupColArray[j].Value;
											value = (new Date(value)).format("yyyy-MM-dd");
											$scope.detailListInfo[$scope.groupColArray[j].KeyId] = new Date(value);                       		
										}else{
											if($scope.groupColArray[j]["Remark"] !== "codeName"){
												$scope.detailListInfo[$scope.groupColArray[j].KeyId] = $scope.groupColArray[j].Value;                        		
											}
										}
									} else {
										$scope.detailListInfoNoUpdate[$scope.groupColArray[j].KeyId] = $scope.groupColArray[j].Value;                        		                       		
									}
								}
							}
						}
						//获取option中的值
						detailParam["queryData"]["ReturnType"] = "Code";
						runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
								url, detailParam["queryData"], function (data, status) {
							for (var i = 0; i < data["array"].length; i++) {
                                if(typeof($scope["CODE_LIBRARY"]) === "undefined")	$scope["CODE_LIBRARY"] = {};
                                $scope["CODE_LIBRARY"][data["array"][i]["KeyId"]] = data["array"][i]["CodeArray"];
							}
						});
						$scope.toListDetailAfter();
					}
				});
			}
		});
        
		
    })