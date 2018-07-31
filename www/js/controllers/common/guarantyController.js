/**
 * 担保、抵押公共controller
 * Created by yli18 on 2017年10月12日 
 */
angular
    .module('com.amarsoft.mobile.controllers.guaranty', [])
	.controller('guarantyController',function ($scope,$http,$ionicModal,$ionicLoading, $state,$ionicScrollDelegate,$ionicPopup,$timeout) {
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
        $scope.$on('to_guarantyListData',function(e,data){
        	$scope.details1 = [];
        	$scope.details2 = [];
        	$scope.details3 = [];
        	$scope.SerialNo = data.SerialNo;
        	$scope.ObjectType = data.ObjectType;
        	$scope.GType = data.GType;//担保信息阶段标志：申请阶段BA，合同生成后BC
        	$scope.readonly = data.readonly;
			/*$scope.info.noData = false;*/
            $ionicScrollDelegate.$getByHandle('detailScrollHandle').scrollTop();
			var serviceName = "SelectGuarantyList";
			var serviceData = {
				ObjectType:data.ObjectType,
        		SerialNo:data.SerialNo
			}			
            runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
                    serviceName, serviceData, function (data, status) {
                        for (var i = 0; i < data["array"].length; i++) {
                            //增加参数，是否展示，页面载入时均展示
                        	data["array"][i]['showGroup'] = true;
                        	if(data["array"][i].ContractStatus == '020'){                        		
                        		$scope.details2.push(data["array"][i]);
                        	}
                        	if(data["array"][i].ContractStatus == '010' && data["array"][i].LineID ==''){
                        		$scope.details1.push(data["array"][i]);
                        	}if(data["array"][i].ContractStatus == '010' && data["array"][i].LineID !=''){
                        		$scope.details3.push(data["array"][i]);	
                        	}                          
                        }  
                        if($scope.details1.length == 0 && $scope.details2.length == 0 && $scope.details3.length == 0){
                			/*$scope.info.noData = true;*/
                        }
                    });
        })

	    //获取押品信息
	    $scope.DzywIist = function(){
	        $scope.rightContentListShowFlag = false;
            $ionicScrollDelegate.$getByHandle("smallScrollList").scrollTop();
            $ionicScrollDelegate.$getByHandle("smallScrollTop").scrollTop();
	    }
	    //返回担保详情页面
	    $scope.goToBack = function(){
	        $scope.rightContentListShowFlag = true;
            $ionicScrollDelegate.$getByHandle('detailScrollHandle').scrollTop();
	    }
		//点击担保列表，显示担保基本信息模态框
        $scope.gotoDzyw = function (item){
           $ionicModal.fromTemplateUrl('templates/common/commonModelView/guarantyInfo.html', {
               scope: $scope,
               backdropClickToClose: false
           }).then(function (modal) {
           	//判断如果业务条线为空，提示并不弹出复选框
           		$scope.modal = modal;
           		$scope.modal.show();
           		//发送广播，获取担保详情
           		$scope.$broadcast('to_guarantyInfo',{
           			GuarantyType:item.GuarantyType,
                    SerialNo: item.SerialNo,//担保类型合同编号
                    GuarantyTypeName:item.GuarantyTypeName,
                    GType:$scope.GType,
                    readonly:$scope.readonly
           		});
           		//发送广播，获取押品信息
           		if(item.GuarantyTypeName!="保证"){
               		$scope.$broadcast('to_collateralList',{
                        ObjectType: $scope.ObjectType,
                        ObjectNo: $scope.SerialNo,
                        ContractNo: item.SerialNo
               		});
           		}
           	}) 
         }
    	//关闭新增模态窗口closeModal 
        $scope.$on('closeModalPage', function (e, d) {
        	$scope.modal.remove();	
        	$timeout(function(){      		
        		$scope.rightContentListShowFlag = true;
        	},500)
        })
	})
	.controller('guarantyInfoController', function ($scope, $state, $http, $ionicLoading, $ionicPopup,$ionicScrollDelegate ) {
		    $scope.$on('to_guarantyInfo',function(e,data){
            $ionicScrollDelegate.$getByHandle('smallScroll').scrollTop();
	    	//引入加载页
            appIonicLoading.show({
                template: '正在加载中',
                animation: 'fade-in',
                showBackdrop: true,
                duration: 10000
            });

            if (data) {
                /*$scope.info.noData = false;*/
                //接收服务端返回的用户详情数据
                if(data.GuarantyTypeName!="保证"){
                	$scope.guarantyContr = true;
                }
                $scope.details = [];
                var serviceName = "SelectGuarantyInfoQuery";
                var serviceData = {                		
                		SerialNo: data.SerialNo,
                		GuarantyType:data.GuarantyType,
                		Type:data.GType,
	            		ReturnType:"Info",
	            		readonly:data.readonly
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
                /*$scope.info.noData = true;*/
            }
	    	
	    })
	})
	//****************业务申请押品列表页面控制器-start***************//
	.controller('DzywController', function ($scope, $state, $http, $ionicLoading, $ionicPopup, paging) {
	   
		$scope.info = {show:false,noData:true};  
		var iPageSize = 6;
	    $scope.items = [];
	    $scope.$on('to_collateralList', function (e, data) {
	    	if(data){
	    		appIonicLoading.show({
	    			template: '正在加载中',
	    			animation: 'fade-in',
	    			showBackdrop: true,
	    			duration: 30000
	    		});
	    		$scope.ObjectType = data.ObjectType;
	    		$scope.ObjectNo = data.ObjectNo;
	    		$scope.ContractNo = data.ContractNo;
	    		paging.init($scope, iPageSize, 1, loadData, true);
	    		$scope.refresh();       		
	    	} else{
	    		$scope.info.noData = true;
	    	}
	    });
	    var loadData = function ($ionicLoading) {
	        runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
	            "SelectCollateralList", {
	                pageSize: iPageSize,
	                pageNo: $scope.pageNo,
	                ObjectType: $scope.ObjectType,
	                ObjectNo: $scope.ObjectNo,
	                ContractNo: $scope.ContractNo
	            }, function (data, status) {
	                for (var k = 0; k < data["array"].length; k++) {
	                    $scope.items.push(data["array"][k]);
	                }
	                if ($scope.items.length) {
	                    $scope.info.noData = false;
	                } else {
	                    $scope.info.noData = true;
	                    appIonicLoading.hide();
	                }
	                $scope.hasMore = (($scope.pageNo - 1) * iPageSize
	                + data["array"].length < data.TotalAcount);
	                $scope.loadingMore = false;
	                
	                if ($scope.pageNo == 1) {
	                	if(data["array"].length != 0){
	                		$scope.gotoDzywInfo(data["array"][0],0);
	                	}
	                }
	
	            });
	    };
	    $scope.gotoDzywInfo = function (item,index) {
	        $scope.selectedRow=index;
	        $scope.$broadcast('to_collectionInfo', {
	            GuarantyType: item.GuarantyType,
	            GuarantyID: item.GuarantyID
	        });
	    }
	    $scope.closrModal = function(){
	        $scope.$emit('closeModalPage');                          	

	    }
	
	})
	//****************业务申请押品列表页面控制器-end***************//
	
	//****************业务申请押品详情页面控制器-start***************//
	.controller(
	    'DzywInfoController',
	    function ($scope, $state, $http, $ionicLoading, $ionicPopup, basePage, $ionicScrollDelegate) {
	
	        $scope.$on('to_collectionInfo', function (e, data) {
	    		appIonicLoading.show({
	    			template: '正在加载中',
	    			animation: 'fade-in',
	    			showBackdrop: true,
	    			duration: 1000
	    		});
	    		$ionicScrollDelegate.$getByHandle('smallScrollTop').scrollTop();
	    		$scope.items = [];
	    		$scope.GuarantyType = data.GuarantyType;
	    		$scope.GuarantyID = data.GuarantyID;
	    		basePage.init($scope, loadData);            		
	
	        });
	        var loadData = function ($ionicLoading) {
	            runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
	                "SelectCollateralInfoQuery", {
	                	GuarantyType: $scope.GuarantyType,
	                	GuarantyID: $scope.GuarantyID,
	                	returnType:"Info"
	                }, function (data, status) {
	                    for (var k = 0; k < data["array"].length; k++) {
	                        //增加参数，是否展示，页面载入时均展示
	                        data["array"][k]['showGroup'] = true;
	                        $scope.items.push(data["array"][k]);
	                    }
	                    
                    	runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
                    			"SelectCollateralInfoQuery", {
            	                	GuarantyType: $scope.GuarantyType,
            	                	GuarantyID: $scope.GuarantyID,
            	                	returnType:"Code"
            	                }, function (data, status) {
                                    for (var i = 0; i < data["array"].length; i++) {
                                        if(typeof($scope["CODE_LIBRARY"]) === "undefined")	$scope["CODE_LIBRARY"] = {};
                                        $scope["CODE_LIBRARY"][data["array"][i]["KeyId"]] = data["array"][i]["CodeArray"];
                                    }
                                });
	                    appIonicLoading.hide();
	                    //担保详情显示出来
	                });
	        };
	        $scope.showOrNot = function (item) {
	            if (item.showGroup) {
	                item.showGroup = false;
	            } else {
	                item.showGroup = true;
	                setTimeout(function () {
	                    $scope.$apply(function () {
	                        $ionicScrollDelegate.$getByHandle("smallScrollTop").scrollBy(0, 10, true);
	                    });
	                }, 100);
	            }
	        };
	
	    })
	   //****************业务申请押品详情页面控制器-end***************//
//登记他证   lxliu1	    
.controller('otherGuarantyController',function ($scope,$http,$ionicModal,$ionicLoading,$rootScope, $state,$ionicScrollDelegate,$ionicPopup,$timeout) {
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
        $scope.$on('to_OtherGuarantyRightListData',function(e,data){
        	$scope.details1 = [];
        	$scope.SerialNo = data.SerialNo;
        	$scope.ObjectType = data.ObjectType;
			/*$scope.info.noData = false;*/
            $ionicScrollDelegate.$getByHandle('detailScrollHandle').scrollTop();
			var serviceName = "SelectObjectList";
			var serviceData = {
				ClassName:"com.amarsoft.webservice.business.InspectImpl",
				MethodName:"SelectOtherGuarantyRightList",
				objectType:data.ObjectType,
				objectNo:data.SerialNo,
				Transaction:"Sqlca"
			}			
			runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
					serviceName, serviceData, function (data, status) {
	            	if(data.Result=='N'){
	            		appIonicLoading.show({
				    		   template: "查询失败！",
				    		   animation: 'fade-in',
				    		   showBackdrop: true,
				    		   duration: 2000
				    	    });
	            	}else{
	            		for (var i = 0; i < data["array"].length; i++) {
	            			$scope.details1.push(data["array"][i]);
	            		}
	            	}
	            });
//            runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
//                    serviceName, serviceData, function (data, status) {
//                        for (var i = 0; i < data["array"].length; i++) {
//                            //增加参数，是否展示，页面载入时均展示
//                        	data["array"][i]['showGroup'] = true;
//                        	if(data["array"][i].ContractStatus == '020'){                        		
//                        		$scope.details2.push(data["array"][i]);
//                        	}
//                        	if(data["array"][i].ContractStatus == '010' && data["array"][i].LineID ==''){
//                        		$scope.details1.push(data["array"][i]);
//                        	}if(data["array"][i].ContractStatus == '010' && data["array"][i].LineID !=''){
//                        		$scope.details3.push(data["array"][i]);	
//                        	}                          
//                        }  
//                        if($scope.details1.length == 0 && $scope.details2.length == 0 && $scope.details3.length == 0){
//                			/*$scope.info.noData = true;*/
//                        }
//                    });
        })
	    //获取押品信息
	    $scope.DzywIist = function(){
	        $scope.rightContentListShowFlag = false;
            $ionicScrollDelegate.$getByHandle("smallScrollList").scrollTop();
            $ionicScrollDelegate.$getByHandle("smallScrollTop").scrollTop();
	    }
	    //返回担保详情页面
	    $scope.goToBack = function(){
	        $scope.rightContentListShowFlag = true;
            $ionicScrollDelegate.$getByHandle('detailScrollHandle').scrollTop();
	    }
		//点击担保列表，显示担保基本信息模态框
        $scope.gotoDzyw = function (item){
			$scope.PreOtherRightID = item[1].Value;
			$scope.OtherRightID =item[2].Value	;
			var OISerialNo = item[0].Value;
			//新增按钮
	    	 $ionicModal.fromTemplateUrl("templates/approve/common/otherGuarantyInsertNewRecord.html", {
	                scope: $scope,
	                backdropClickToClose: false
	            }).then(function (modal) {
        		$scope.modal1 = modal;
        		$scope.modal1.show();
        		
        		
        		$scope.hideShowModel = function(){
        			$scope.refreshInfo();
        			$scope.modal1.remove();
        		}
        		
        		$scope.save = function(){
        			$scope.PreOtherRightID = document.getElementById("PreOtherRightID").value;
        			$scope.OtherRightID = document.getElementById("OtherRightID").value;
        			if($scope.OtherRightID==""){
        				appIonicLoading.show({
				    		   template: "请输入他项权证号！",
				    		   animation: 'fade-in',
				    		   showBackdrop: true,
				    		   duration: 2000
				    	    });
        				return;
        			}
        			
        			runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
        	                "SelectObjectList", {
        				PhaseType:"BC",
        				BCSerialNo:$scope.detailListDataParam["SerialNo"],
        				PreOtherRightID:$scope.PreOtherRightID ,
        				OtherRightID:$scope.OtherRightID,
        				serialNo:OISerialNo,
        				 ClassName:"com.amarsoft.webservice.business.InspectImpl",
        				 MethodName:"insertNewOtherRightRecord",
        					Transaction:"null"
        	            }, function (data, status) {
        	            	if(data.Result=='N'){
        	            		appIonicLoading.show({
        				    		   template: "操作失败！",
        				    		   animation: 'fade-in',
        				    		   showBackdrop: true,
        				    		   duration: 2000
        				    	    });
        	            	}else{
        	            		var result = data["array"][0];
        	            		var resultValue = result[0].Value;
        	            		if(resultValue=="SUCCESS"){
        	            			appIonicLoading.show({
     	       			    		   template: "操作成功！",
     	       			    		   animation: 'fade-in',
     	       			    		   showBackdrop: true,
     	       			    		   duration: 2000
     	       			    	    });
        	            		}else{
        	            			appIonicLoading.show({
      	       			    		   template: "操作失败！",
      	       			    		   animation: 'fade-in',
      	       			    		   showBackdrop: true,
      	       			    		   duration: 2000
      	       			    	    });
        	            		}
        	            	}
        	            });
        			
        		}
        		$scope.savePreOtherRightID = function(){
        			$rootScope.savePreOtherRightID("Info");
        		}
        		
        	}) 
		}
    	//关闭新增模态窗口closeModal 
        $scope.$on('closeModalPage', function (e, d) {
        	$scope.modal.remove();	
        	$timeout(function(){      		
        		$scope.rightContentListShowFlag = true;
        	},500)
        })
	})