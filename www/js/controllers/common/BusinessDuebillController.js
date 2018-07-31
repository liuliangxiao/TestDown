/**
 * 授信台帐 -- 借据  controller
 * Created by yyma on 2018年01月23日 
 */
angular
    .module('com.amarsoft.mobile.controllers.duebill', [])
	.controller('BusinessDuebillController',function ($scope,$http,$ionicModal,$filter,$ionicLoading, $state,$ionicScrollDelegate,$ionicPopup,$timeout) {
		var iPageSize = 6;
        $scope.items = [];
		//担保详细信息
        $scope.detailInfo = {};
        //担保不可更新信息
        $scope.detailInfoNoUpdate = {};
        //列表-详情控制参数
        $scope.rightContentListShowFlag1 = true;

        //获取借据列表信息
        $scope.$on('to_BusinessDuebillListData',function(e,data){
        	$scope.details1 = [];
        	$scope.ObjectNo = data.ObjectNo;
        	$scope.ObjectType = data.ObjectType;
            $ionicScrollDelegate.$getByHandle('detailScrollHandle').scrollTop();
			var serviceName = "SelectAfterLoanList";
			var serviceData = {
				ObjectType:data.ObjectType,
				ObjectNo:data.ObjectNo
			}			
            runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
                    serviceName, serviceData, function (data, status) {
                        for (var i = 0; i < data["array"].length; i++) {
                        	//截取数字长度，小数点后留两位，并对整数位分割
                        	for(var key in data["array"][i]){
                        		/*var index = data["array"][i][key].indexOf('.');
                        		var length = data["array"][i][key].length;
								if(index != -1){
									if((length-index-1)>2){
										data["array"][i][key] = data["array"][i][key].substr(0,index+3);
									}
								}*/
                        		if(data["array"][i][key].indexOf('E') != -1 || data["array"][i][key].indexOf('.') != -1){
									var num = new Number(data["array"][i][key]);
									if(!isNaN(num)){
										data["array"][i][key] = $filter('currency')(num+"",'');
									}
								}
							}
                            //增加参数，是否展示，页面载入时均展示
                        	data["array"][i]['showGroup'] = true;
                        		$scope.details1.push(data["array"][i]);                        	                     
                        }                          
                    });			
        })
	    //返回借据详情页面
	    $scope.goToBack = function(){
	        $scope.rightContentListShowFlag1 = true;//借据详情页面
	        $scope.rightContentListShowFlag2 = false;//还款计划页面
	        $scope.rightContentListShowFlag3 = false;//还款记录页面

            $ionicScrollDelegate.$getByHandle('detailScrollHandle').scrollTop();
	    }
       
		//点击借据列表，显示借据基本信息模态框
        $scope.gotoDetail = function (item){
            $scope.rightContentListShowFlag1 = true;

           $ionicModal.fromTemplateUrl('templates/common/commonModelView/duebillInfo.html', {
               scope: $scope,
               backdropClickToClose: false
           }).then(function (modal) {
           	//判断如果业务条线为空，提示并不弹出复选框
           		$scope.modal = modal;
           		$timeout(function(){
           			$scope.modal.show();
           		},500)
           		//发送广播，获取担保详情
           		$scope.$broadcast('to_dueBillInfo',{
           			item: item//借据编号
           		});           		
           	}) 
            //借据详情页面查看还款计划按钮
    	    $scope.lookPayPlan = function(){
    	        $scope.rightContentListShowFlag1 = false;
    	        $scope.rightContentListShowFlag2 = true;
    	        $scope.rightContentListShowFlag3 = false;

                item.url="lookPayPlanList";
              //发送广播，获取担保详情
           		$scope.$broadcast('to-lookPayInfo1',{
           			item: item//借据编号
           		});  
    	    }
            //借据详情页面查看还款记录按钮
    	    $scope.lookPayRecord = function(){
    	        $scope.rightContentListShowFlag1 = false;
    	        $scope.rightContentListShowFlag2 = false;
    	        $scope.rightContentListShowFlag3 = true;

                item.url="lookPayRecordList";
                //发送广播，获取担保详情
             		$scope.$broadcast('to-lookPayInfo2',{
             			item: item//借据编号
             		});  
    	    }          
         }
    	//关闭新增模态窗口closeModal 
        $scope.$on('closeModalPage', function (e, d) {
        	$scope.modal.remove();	
        	$timeout(function(){      		
        		 $scope.rightContentListShowFlag1 = false;
     	         $scope.rightContentListShowFlag2 = false;
     	         $scope.rightContentListShowFlag3 = false;
        	},500)
        })
	})
	.controller('DueBillInfoController', function ($scope, $state, $http, $ionicLoading, $ionicPopup,$ionicScrollDelegate,$ionicModal) {
		$scope.isNotOutsideTable=false;//是否表外业务
		//接收借据详情方法发来的广播
		$scope.$on('to_dueBillInfo',function(e,data){
		         $scope.rightContentListShowFlag1 = true;
            $ionicScrollDelegate.$getByHandle('smallScroll').scrollTop();
	    	//引入加载页
            appIonicLoading.show({
                template: '正在加载中',
                animation: 'fade-in',
                showBackdrop: true,
                duration: 10000
            });

            if (data) {                
                $scope.details = [];
                var serviceName = "SelectObjectInfo";
                var serviceData = {                		
                		SerialNo: data["item"].SerialNo,
                		modelNo:data["item"].SerialNo==data["item"].RelativeSerialNo1 ? "ACCT_LOAN" :"DuebillInfo",
	            		ReturnType:"Info",
	            		readonly:"true"
	            			}
                if($scope.selectedMenuItem.ColName=="表外未终结业务" || $scope.selectedMenuItem.ColName=="表外已终结业务"){
                	serviceData.modelNo = "DuebillInfo";
                	$scope.isNotOutsideTable=true;//是否表外业务
                }
                runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
                		serviceName, serviceData, function (data, status) {
                        for (var i = 0; i < data["array"].length; i++) {
                            //增加参数，是否展示，页面载入时均展示
                            data["array"][i]['showGroup'] = true;
                            $scope.details.push(data["array"][i]);
                            
                            //获取模版json中的groupColArray的数据，按照json格式中的 <KeyId：Value>存放到$scope.detailInfo中做绑定并用于页面展示
                            $scope.groupColArray = data["array"][i].groupColArray;
                            for(var j = 0; j < $scope.groupColArray.length;j++){
                            	if($scope.groupColArray[j].ColUpdateable == '1'){
                            		$scope.detailInfo[$scope.groupColArray[j].KeyId] = $scope.groupColArray[j].Value;                           		
                            	} else {
                            		 $scope.detailInfoNoUpdate[$scope.groupColArray[j].KeyId] = $scope.groupColArray[j].Value;  
                            	}                            	                            
                            }
                        }
                        serviceData.ReturnType = "Code";
                    	runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
                                serviceName, serviceData, function (data, status) {
                                    for (var i = 0; i < data["array"].length; i++) {
                                        if(typeof($scope["CODE_LIBRARY"]) === "undefined")	$scope["CODE_LIBRARY"] = {};
                                        $scope["CODE_LIBRARY"][data["array"][i]["KeyId"]] = data["array"][i]["CodeArray"];
                                    }
                                });
                    	//关闭遮罩层
                        appIonicLoading.hide();
                    });
            } else {
                $scope.details = [];
            }
            //查看还款列表信息
	
	    })
	})
	//****************业务申请押品列表页面控制器-start***************//
	.controller('PayMentListController', function ($scope, $state, $http, $ionicLoading, $ionicPopup, paging) {
	   
		$scope.info = {show:false,noData:true};  
		var iPageSize = 6;
	    $scope.items = [];
	    //接受还款计划发来的广播
	    $scope.$on('to-lookPayInfo1', function (e, data) {
	    	$scope.details4=[];
	    	if(data){	    	
	    		delete data["item"].url;
	    		 runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
	    		            "lookPayPlanList", {	    		               
	    		                ObjectType:"jbo.app.ACCT_LOAN",
	    		                ObjectNo: data["item"].SerialNo
	    		            }, function (data, status) {
	    		            	for (var i = 0; i < data["array"].length; i++) {
	                            //增加参数，是否展示，页面载入时均展示
	                        	data["array"][i]['showGroup'] = true;
	                        	$scope.details4.push(data["array"][i]);                        	                     
	                        }               
	    		           });
	    		 		//$scope.refresh();       		
	    	} else{
	    		$scope.info.noData = true;
	    	}
	    });
	    //接受还款记录方法发来的广播
	    $scope.$on('to-lookPayInfo2', function (e, data) {
	    	$scope.details4=[];
	    	if(data){	    	
	    		delete data["item"].url;
	    		 runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
	    		            "lookPayRecordList", {	    		               
	    		                ObjectType:"jbo.app.ACCT_LOAN",
	    		                ObjectNo: data["item"].SerialNo
	    		            }, function (data, status) {
	    		            	for (var i = 0; i < data["array"].length; i++) {
	                            //增加参数，是否展示，页面载入时均展示
	                        	data["array"][i]['showGroup'] = true;
	                        	$scope.details4.push(data["array"][i]);                        	                     
	                        }               
	    		           });
	    		 		//$scope.refresh();       		
	    	} else{
	    		$scope.info.noData = true;
	    	}
	    });
	    //关闭模态框
	    $scope.closrModal = function(){
	        $scope.$emit('closeModalPage');                          	

	    }
	
	})
	//****************授信台帐-还款计划、还款记录页面控制器-end***************//