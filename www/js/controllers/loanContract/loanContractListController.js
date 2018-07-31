/**
 * Created by yli18 on 2017年9月23日
 */
angular
    .module('com.amarsoft.mobile.controllers.loanCc.list', [])
	.controller('loanContractListController',function ($scope,$list,$detail,$model,$contract) {
		// 定义app请求服务端查询合同登记列表的后台服务类，前台展示记录条数；
		var param = {
			pageSize : 8,
			pageNo : 1,
			groupId : "loanContractList",
			className : "com.amarsoft.app.als.mobile.impl.ILoanContractImpl",
			methodName : "findContractList",
			menuTitle : "合同登记",
			flag : true,
			Transaction:"null"
		}
		// 在service.js里定义了公用方法，就相当于咱们pc端开发时公司封装了FunctionX类，咱们使用这个类时需要在java里import。现在app里使用service里定义的服务，通过下面的代码即可引入
		$model.init($scope);
		// 传入 param参数，到服务端获取数据，绑定到items上，后面在List的html里直接引用items展示数据；
		$list.load($scope,param);
		// 注册详情页面使用的方法
		$detail.load($scope);
		// 对合同进行合同登记、合同生效、合同取消生效、取消登记的操作函数引入到这个$scope里
		$contract.init($scope);
		// 设置右边详情的参数
		$scope.setDetailParam = function(modelInfo,detailParam){
			var selectedListItem = $scope.getSelectedListItem();
    	   if(typeof(selectedListItem) !== "undefined"){
    		   if(typeof(modelInfo["Action"]) === "undefined" || modelInfo["Action"] === "" || modelInfo["Action"] === null){
    			   detailParam["url"] = "SelectObjectInfo";
			   }else{
				   detailParam["url"] = modelInfo["Action"];
			   }
	 		   if(detailParam["url"] === "SelectCustomerInfo"){
	 			   detailParam["queryData"]["CustomerID"] = selectedListItem["CustomerId"];
	 		   }else if($scope.detailUrl === "SelectOpinionList"){
	 			   detailParam["queryData"]["ObjectNo"] = selectedListItem["ObjectNo"];
	 			   detailParam["queryData"]["ObjectType"] = selectedListItem["ObjectType"];
	 			   detailParam["queryData"]["BusinessType"] = selectedListItem["BusinessType"];
	 		   }else{
	 			   if(typeof(modelInfo["ObjectType"]) !== "undefined" && modelInfo["ObjectType"] !== "" && modelInfo["ObjectType"] !== null){
	 				   detailParam["queryData"]["ObjectType"]  = modelInfo["ObjectType"];
	 			   }else{
	 				   detailParam["queryData"]["ObjectType"] = selectedListItem["ObjectType"];
	 			   }
	 			   if($scope.selectedDetailMenuItem.ColId === "1010" || $scope.selectedDetailMenuItem.ColId === "2010"){
	 				   detailParam["queryData"]["SerialNo"] = selectedListItem["SerialNo"];
	 			   }else{
	 				   detailParam["queryData"]["SerialNo"] = selectedListItem["ObjectNo"];
	 			   }
	 			   detailParam["queryData"]["ObjectNo"] = selectedListItem["ObjectNo"];
	 			   detailParam["queryData"]["BusinessType"] = selectedListItem["BusinessType"];
	 		   }
    	   }
    	   detailParam["queryData"]["ReturnType"] = "Info";
		}
		// 合同信息保存，初始开发有，后来这个功能屏蔽了
		$scope.saveModel = function(){
			var data = $scope.getModelNoReadOnlyData();
			$db_operate.updateRecord($scope,"0002",data);
		}
	});
