/**
 * Created by yli18 on 2017年9月23日
 */
angular
    .module('com.amarsoft.mobile.controllers.CustomerListController', [])
	.controller('CustomerListController',function ($scope,$list,$detail,$model,$db_operate,$filter,$ionicLoading,$http, $ionicPopup, $state,$rootScope) {
		$scope.param = {
			pageSize : 8,
			pageNo : 1,
			groupId : "customerList",
			className : "com.amarsoft.app.als.mobile.impl.CustomerManageImpl",
			methodName : "getCustomerList",
			menuTitle : "客户管理",
			flag : true,
			Transaction:"null"
		}
		$model.init($scope);
		$list.load($scope,$scope.param);
		$detail.load($scope);
		$scope.setListParam = function(data){
			if($scope.selectedMenuItem["ColId"] !== "undefined" &&
					typeof($scope.selectedMenuItem["ColId"]) !== "undefined"){
				data["Status"] = $scope.selectedMenuItem["ColId"];
			}else{
				data["Status"] = "01";
			}
			data["sCustomerID"] = $scope.sCustomerID;
			data["sColId"] = $scope.selectedMenuItem["ColId"];
		}
		//对个人客户性别，生日进行自动填充
		$scope.toDetailAfter = function(){
			var infoData = $scope.detailInfo;
			var customerType = $scope.selectedMenuItem["ColId"];
			var sCertID = infoData.CertID;
			var sCertType = infoData.CertType;
			var sSex = "";
			var sBirthday = "";
			if(customerType === "30"){
				if(sCertID.length == 15)
				{
					sSex = sCertID.substring(14);
					sSex = parseInt(sSex);
					sCertID = sCertID.substring(6,12);
					sBirthday = "19"+sCertID.substring(0,2)+"/"+sCertID.substring(2,4)+"/"+sCertID.substring(4,6);
					if(sSex%2 == 0)//奇男偶女
						sSex = "2";
					else
						sSex = "1";
				}
				if(sCertID.length == 18)
				{
					sSex = sCertID.substring(16,17);
					sSex = parseInt(sSex);
					sCertID = sCertID.substring(6,14);
					sBirthday = sCertID.substring(0,4)+"/"+sCertID.substring(4,6)+"/"+sCertID.substring(6,8);
					if(sSex%2==0)//奇男偶女
						sSex = "2";
					else
						sSex = "1";
				}
				//判断数据库中是否有值，没有的话填充  有的跳过
				if(sCertType === "Ind01" || sCertType === "Ind08"){
					$detail.setReadOnly($scope.details,"Birthday",true);
					$detail.setCheckFormat($scope.details,"Birthday","1");
					$detail.setRequired($scope.details,"Birthday",false);
					$detail.setReadOnly($scope.details,"Sex",true);
					$detail.setRequired($scope.details,"Sex",false);
					//如果数据库中的日期不为空的话就不改变
					if($scope.detailInfo.Birthday.format("yyyy/MM/dd") !== "NaN/aN/aN"){
						$scope.detailInfo.Birthday = $scope.detailInfo.Birthday.format("yyyy/MM/dd");
					}else{
						$scope.detailInfo.Birthday = "";
					}
					if(typeof(infoData.Sex) === "undefined" || infoData.Sex === "" ){
						$scope.detailInfo.Sex = sSex;
					}
					if(typeof($scope.detailInfo.Birthday) !== "undefined" && $scope.detailInfo.Birthday !== ""){
						//$scope.detailInfo.Birthday = $scope.detailInfo.Birthday;
					}else if(sBirthday !== ""){
						$scope.detailInfo.Birthday = sBirthday;
					}	
				}
			}
		};
		$scope.setDetailParam = function(modelInfo,detailParam){
    	   if(typeof($scope.selectedListItem) !== "undefined"){
    		   if(typeof(modelInfo["Action"]) === "undefined" ||
				   modelInfo["Action"] === "" ||
				   modelInfo["Action"] === null){
    			   detailParam["url"] = "SelectObjectInfo";
			   }else{
				   detailParam["url"] = modelInfo["Action"];
			   }
	 		   if(detailParam["url"] === "SelectCustomerInfo"){
	 			   detailParam["queryData"]["CustomerID"] = $scope.selectedListItem["CustomerId"];
	 			   detailParam["queryData"]["Type"] = $scope.selectedMenuItem["ColId"];;
	 		   }else{
	 			  detailParam["queryData"]["modelNo"] = "CustomerBelongApply";
	 			  detailParam["queryData"]["ReturnType"] = "Info";
	 			  detailParam["queryData"]["CustomerID"] = $scope.selectedListItem["CustomerId"];
	 			  detailParam["queryData"]["UserID"] = AmApp.userID;
	 			  detailParam["queryData"]["OrgID"] = AmApp.orgID;
	 		   }
    	   }
    	   detailParam["queryData"]["ReturnType"] = "Info";
		}
		//保存客户信息
		$scope.saveModelF = function(){ 
			$scope.goDetailTopFlag = true;
			var ColId = $scope.selectedMenuItem["ColId"];
			var customerTypeName =  $scope.selectedListItem["CustomerTypeName"]
			var data = $scope.getModelNoReadOnlyData();
			var operateFlag = data["OperateFlag"];
			var saveFlag = $scope.selectedListItem["LockStatusNo"];
			if(saveFlag === "2"){
				$ionicLoading.show({
					title: "申请信息校验",
					template: "客户信息已锁定，不能再修改！",
					duration: 1500
				});
				return;
			}
			//数据填充完整进行校验
			if(operateFlag){
				//个人客户校验项
				if(ColId === "30"){
					if(!MobileValidNoPopup($scope.detailInfo.MobileTelephone)){
						
						setCheckObj($scope.details["0"].groupColArray,"MobileTelephone","请输入正确的手机号码!",true);
					}else {
						//正常就设置为不显示
						
						setCheckObj($scope.details["0"].groupColArray,"MobileTelephone","",false);
					}
					var FamilyTel = $scope.detailInfo.FamilyTel;
					if(CheckPhone78(FamilyTel)){
						setCheckObj($scope.details["0"].groupColArray,"FamilyTel","住宅电话要求输入区号代码!",true);
					}else{
						if(checkTelephone(FamilyTel)){
							setCheckObj($scope.details["0"].groupColArray,"FamilyTel","住宅电话区号不用带中划线(-)!",true);
						}else{
							if(CheckPhoneLen(FamilyTel)){
								setCheckObj($scope.details["0"].groupColArray,"FamilyTel","住宅电话有误!",true);
							}else{
								setCheckObj($scope.details["0"].groupColArray,"FamilyTel","",false);
							}
						}
					}
					
					var FamilyMonthIncome =  $scope.detailInfo.FamilyMonthIncome;
					FamilyMonthIncome = FamilyMonthIncome.replace(/,/g,'');
					if(isNaN(FamilyMonthIncome) || parseFloat(FamilyMonthIncome) < 0){
						setCheckObj($scope.details["0"].groupColArray,"FamilyMonthIncome","输入值须为大于0的数字!",true);
					}else if(FamilyMonthIncome.length > 20){
						setCheckObj($scope.details["0"].groupColArray,"FamilyMonthIncome","长度大于20位!",true);
					}else{
						
						setCheckObj($scope.details["0"].groupColArray,"FamilyMonthIncome","",false);
					}
					var YearIncome = $scope.detailInfo.YearIncome;
					YearIncome = YearIncome.replace(/,/g,'');
					if(isNaN(YearIncome) || parseFloat(YearIncome) < 0){
						
						setCheckObj($scope.details["0"].groupColArray,"YearIncome","输入值须为大于0的数字!",true);
					}else if(YearIncome.length > 20){
						setCheckObj($scope.details["0"].groupColArray,"YearIncome","长度大于20位!",true);
					}else{
						setCheckObj($scope.details["0"].groupColArray,"YearIncome","",false);
					}
				}
				//公司客户校验项
				if(ColId === "10"){
					//公司客户使用了三个模版法人和非法人用EnterpriseInfo01
					//事业单位 社会团体 党政机关 其他 用EnterpriseInfo03 金融机构用EnterpriseInfo02
					if(customerTypeName === "法人企业" || customerTypeName ==="非法人企业"){
						var EmployeeNumber = $scope.detailInfo.EmployeeNumber;
						EmployeeNumber = EmployeeNumber.replace(/,/g,'');
						if(isNaN(EmployeeNumber) || parseFloat(EmployeeNumber) < 0){
							setCheckObj($scope.details["0"].groupColArray,"EmployeeNumber","企业人值须为大于0的数字!",true);
						}else if(EmployeeNumber.length > 20){
							setCheckObj($scope.details["0"].groupColArray,"EmployeeNumber","企业人数值过大!",true);
						}else{
							setCheckObj($scope.details["0"].groupColArray,"EmployeeNumber","",false);
						}
						var TotalAssets = $scope.detailInfo.TotalAssets;
						TotalAssets = TotalAssets.replace(/,/g,'');
						if(isNaN(TotalAssets) || parseFloat(TotalAssets) < 0){
							setCheckObj($scope.details["0"].groupColArray,"TotalAssets","总资产值须为大于0的数字!",true);
						}else if(TotalAssets.length > 20){
							setCheckObj($scope.details["0"].groupColArray,"TotalAssets","总资产值过大!",true);
						}else{
							setCheckObj($scope.details["0"].groupColArray,"TotalAssets","",false);
						}
						var SellSum = $scope.detailInfo.SellSum;
						SellSum = SellSum.replace(/,/g,'');
						if(isNaN(SellSum) || parseFloat(SellSum) < 0){
							setCheckObj($scope.details["0"].groupColArray,"SellSum","营业收入值须为大于0的数字!",true);
						}else if(SellSum.length > 20){
							setCheckObj($scope.details["0"].groupColArray,"SellSum","营业收入值过大!",true);
						}else{
							setCheckObj($scope.details["0"].groupColArray,"SellSum","",false);
						}
						//联系电话
						var OfficeTel = $scope.detailInfo.OfficeTel;
						if(CheckPhone78(OfficeTel)){
							
							setCheckObj($scope.details["0"].groupColArray,"OfficeTel","联系电话要求输入区号代码!",true);
						}else{
							if(checkTelephone(OfficeTel)){
								
								setCheckObj($scope.details["0"].groupColArray,"OfficeTel","联系电话区号中间不用带中划线(-)!",true);
							}else{
								if(CheckPhoneLen(OfficeTel)){
									
									setCheckObj($scope.details["0"].groupColArray,"OfficeTel","联系电话有误！",true);
								}else{
									
									setCheckObj($scope.details["0"].groupColArray,"OfficeTel","",false);
								}
							}
						}  
						//财务部联系电话
						var FinanceDeptTel = $scope.detailInfo.FinanceDeptTel;
						if(CheckPhone78(FinanceDeptTel)){
							setCheckObj($scope.details["0"].groupColArray,"FinanceDeptTel","财务部联系电话要求输入区号代码!",true);
						}else{
							if(checkTelephone(FinanceDeptTel)){
								setCheckObj($scope.details["0"].groupColArray,"FinanceDeptTel","财务部联系电话区号不用带中划线(-)!",true);
							}else{
								if(CheckPhoneLen(FinanceDeptTel)){
									setCheckObj($scope.details["0"].groupColArray,"FinanceDeptTel","财务部联系电话有误!",true);
								}else{
									setCheckObj($scope.details["0"].groupColArray,"FinanceDeptTel","",false);
								}
							}
						}
						//var LoanCardNo = $scope.detailInfo.LoanCardNo;
						/*if(LoanCardNo.length!=16){
							setCheckObj($scope.details["0"].groupColArray,"LoanCardNo","贷款卡号长度应该为16位!",true);
						}else if(!CheckLoanCardID(LoanCardNo)){
							setCheckObj($scope.details["0"].groupColArray,"LoanCardNo","贷款卡编号有误!",true);
						}else{
							setCheckObj($scope.details["0"].groupColArray,"LoanCardNo","!",false);
						}*/
					}
					
					//所有的都要校验贷款卡号
					var LoanCardNo = $scope.detailInfo.LoanCardNo;
					if(LoanCardNo.length!=16){
						setCheckObj($scope.details["0"].groupColArray,"LoanCardNo","贷款卡号长度应该为16位!",true);
					}else if(!CheckLoanCardID(LoanCardNo)){
						setCheckObj($scope.details["0"].groupColArray,"LoanCardNo","贷款卡编号有误!",true);
					}else{
						setCheckObj($scope.details["0"].groupColArray,"LoanCardNo","!",false);
					}
					/*//目前事业单位等只需校验贷款卡号，后期需求增加打开注释即可
					 * if(customerTypeName === "事业单位" || customerTypeName === "社会团体" || 
						customerTypeName === "党政机关" || customerTypeName === "其他"){
					}*/
					if(customerTypeName === "金融机构"){
						var EmployeeNumber = $scope.detailInfo.EmployeeNumber;
						EmployeeNumber = EmployeeNumber.replace(/,/g,'');
						if(isNaN(EmployeeNumber) || parseFloat(EmployeeNumber) < 0){
							setCheckObj($scope.details["0"].groupColArray,"EmployeeNumber","企业人值须为大于0的数字!",true);
						}else if(EmployeeNumber.length > 10){
							setCheckObj($scope.details["0"].groupColArray,"EmployeeNumber","企业人数值过大!",true);
						}else{
							setCheckObj($scope.details["0"].groupColArray,"EmployeeNumber","",false);
						}
					}
				}
				if(ColId === "20"){
					//小企业除了事业单位用EnterpriseInfo03其他都为EnterpriseInfo11
					if(customerTypeName === "事业单位"){
						var LoanCardNo = $scope.detailInfo.LoanCardNo;
						if(LoanCardNo.length!=16){
							setCheckObj($scope.details["0"].groupColArray,"LoanCardNo","贷款卡号长度应该为16位!",true);
						}else if(!CheckLoanCardID(LoanCardNo)){
							
							setCheckObj($scope.details["0"].groupColArray,"LoanCardNo","贷款卡编号有误!",true);
						}else{
							setCheckObj($scope.details["0"].groupColArray,"LoanCardNo","",false);
						}
					}else{
						var SellSum = $scope.detailInfo.SellSum;
						SellSum = SellSum.replace(/,/g,'');
						if(isNaN(SellSum) || parseFloat(SellSum) < 0){
							setCheckObj($scope.details["0"].groupColArray,"SellSum","年销售额值须为大于0的数字!",true);
						}else if(SellSum.length > 20){
							setCheckObj($scope.details["0"].groupColArray,"SellSum","年销售额值过大!",true);
						}else{
							setCheckObj($scope.details["0"].groupColArray,"SellSum","",false);
						}
						var TotalAssets = $scope.detailInfo.TotalAssets;
						TotalAssets = TotalAssets.replace(/,/g,'');
						if(isNaN(TotalAssets) || parseFloat(TotalAssets) < 0){
							setCheckObj($scope.details["0"].groupColArray,"TotalAssets","总资产值须为大于0的数字!",true);
						}else if(TotalAssets.length > 20){
							setCheckObj($scope.details["0"].groupColArray,"TotalAssets","总资产值过大!",true);
						}else{
							setCheckObj($scope.details["0"].groupColArray,"TotalAssets","",false);
						}
						var EmployeeNumber = $scope.detailInfo.EmployeeNumber;
						EmployeeNumber = EmployeeNumber.replace(/,/g,'');
						if(isNaN(EmployeeNumber) || parseFloat(EmployeeNumber) < 0){
							setCheckObj($scope.details["0"].groupColArray,"EmployeeNumber","职工人数值须为大于0的数字!",true);
						}else if(EmployeeNumber.length > 8){
							setCheckObj($scope.details["0"].groupColArray,"EmployeeNumber","职工人数值过大!",true);
						}else{
							setCheckObj($scope.details["0"].groupColArray,"EmployeeNumber","",false);
						}
						var OfficeTel = $scope.detailInfo.OfficeTel;
						if(CheckPhone78(OfficeTel)){
							setCheckObj($scope.details["0"].groupColArray,"OfficeTel","联系电话要求输入区号代码!",true);
						}else{
							if(checkTelephone(OfficeTel)){
								setCheckObj($scope.details["0"].groupColArray,"OfficeTel","联系电话区号中间不用带中划线(-)!",true);
							}else{
								if(CheckPhoneLen(OfficeTel)){
									setCheckObj($scope.details["0"].groupColArray,"OfficeTel","联系电话有误！",true);
								}else{
									setCheckObj($scope.details["0"].groupColArray,"OfficeTel","",false);
								}
							}
						}  
						//财务部联系电话
						var FinanceDeptTel = $scope.detailInfo.FinanceDeptTel;
						if(CheckPhone78(FinanceDeptTel)){
							setCheckObj($scope.details["0"].groupColArray,"FinanceDeptTel","财务部联系电话要求输入区号代码!",true);
						}else{
							if(checkTelephone(FinanceDeptTel)){
								setCheckObj($scope.details["0"].groupColArray,"FinanceDeptTel","财务部联系电话区号不用带中划线(-)!",true);
							}else{
								if(CheckPhoneLen(FinanceDeptTel)){
									setCheckObj($scope.details["0"].groupColArray,"FinanceDeptTel","财务部联系电话有误!",true);
								}else{
									setCheckObj($scope.details["0"].groupColArray,"FinanceDeptTel","",false);
								}
							}
						}
						var LoanCardNo = $scope.detailInfo.LoanCardNo;
						if(LoanCardNo.length!=16){
							setCheckObj($scope.details["0"].groupColArray,"LoanCardNo","贷款卡号长度应该为16位!",true);
						}else if(!CheckLoanCardID(LoanCardNo)){
							
							setCheckObj($scope.details["0"].groupColArray,"LoanCardNo","贷款卡编号有误!",true);
						}else{
							setCheckObj($scope.details["0"].groupColArray,"LoanCardNo","",false);
						}
					}
				}
			}
			//企业类型，行业投向单独校验
			if(ColId === "10" || ColId === "20"){
				var orgType = $scope.detailInfo.OrgType;
				var industryType = $scope.detailInfo.IndustryType;
				//判断两个值是否为空
				if(typeof(orgType) === "undefined" || orgType === ""){
					setCheckObj($scope.details["0"].groupColArray,"OrgTypeName","请选择企业类型",true);
				}else{
					data["OrgType"] = orgType;
					setCheckObj($scope.details["0"].groupColArray,"OrgTypeName","",false);
				}
				
				if(typeof(industryType) === "undefined" || industryType === ""){
					setCheckObj($scope.details["0"].groupColArray,"IndustryTypeName","请选择企业类型",true);
				}else{
					data["IndustryType"] = industryType;
					setCheckObj($scope.details["0"].groupColArray,"IndustryTypeName","",false);
				}
			}
			
			data["PrimaryKey"] = "CustomerId";
			data["CustomerId"] = $scope.selectedListItem["CustomerId"];
			data["UpdateDate"] = $filter('date')(new Date(),"yyyy/MM/dd");
			//遍历判断是否所有校验已通过
			var isSuccess = isCheckSuccess($scope.details["0"].groupColArray);
			if(ColId === "30" && isSuccess){
				//alert("个人可以保存");
				$db_operate.updateRecord($scope,"000801",data);
			}else if((ColId === "10" || ColId === "20") && isSuccess){
				//alert("企业小企业可以保存");
				$db_operate.updateRecord($scope,"0008",data);
			}
		}
		$scope.signOpinion = function(){
			var applyStatus = $scope.detailInfo.applyStatus;
			if(typeof(applyStatus) !== "undefined" && applyStatus === "1"){
				$ionicLoading.show({
					title: "申请信息校验",
					template: "已提交申请,不能再次提交！",
					duration: 1500
				});
				return;
			}
			var data = $scope.getModelNoReadOnlyData();
			var belongAttribute = $scope.detailInfo.BelongAttribute;
			var belongAttribute1 =  $scope.detailInfo.BelongAttribute1;
			var belongAttribute2 =  $scope.detailInfo.BelongAttribute2;
			var belongAttribute3 =  $scope.detailInfo.BelongAttribute3;
			var applyAttribute = $scope.detailInfo.ApplyAttribute;
			var applyAttribute1 =  $scope.detailInfo.ApplyAttribute1;
			var applyAttribute2 =  $scope.detailInfo.ApplyAttribute2;
			var applyAttribute3 =  $scope.detailInfo.ApplyAttribute3;
			if(belongAttribute === "1" && belongAttribute1 === "1" && belongAttribute2 === "1" &&belongAttribute3 === "1" ){
				$ionicLoading.show({
					title: "申请信息校验",
					template: "您已经拥有该客户的所有权限！",
					duration: 1500
				});
				return;
			}
			 if(applyAttribute === "1"){
		          if(applyAttribute1 == "2" || applyAttribute2 == "2" || applyAttribute3 == "2" ){
		        	  $ionicLoading.show({
							title: "申请信息校验",
							template: "你已经选择了主办权，主办权包含了各项权利，其他项不能选否",
							duration: 1500});
		              return;
		              }
			 }
		     if(applyAttribute2 == "1" && applyAttribute1 == "2"){            
		        	$ionicLoading.show({
						title: "申请信息校验",
						template: "你已经选择了信息维护权，信息维护权包含了信息查看权，信息查看权不能选否",
						duration: 1500});
		            return;    
		    }
			
			data["PrimaryKey"] = "CustomerId,OrgID,UserID";
			data["CustomerId"] = $scope.selectedListItem["CustomerId"];
			data["UpdateDate"] = $filter('date')(new Date(),"yyyy/MM/dd");
			data["ApplyStatus"] = "1";
			data["UserID"] = AmApp.userID;
			data["OrgID"] =  AmApp.orgID;
			$db_operate.updateRecord($scope,"0016",data);
		}
		
		//保存并提交客户权限申请信息
		$scope.saveApply = function(){
			var applyStatus = $scope.detailInfo.applyStatus;
			if(typeof(applyStatus) !== "undefined" && applyStatus === "1"){
				$ionicLoading.show({
					title: "申请信息校验",
					template: "已提交申请,不能再修改！",
					duration: 1500
				});
				return;
			}
			var data = $scope.getModelNoReadOnlyData();
			data["PrimaryKey"] = "CustomerId,OrgID,UserID";
			data["CustomerId"] = $scope.selectedListItem["CustomerId"];
			data["UpdateDate"] = $filter('date')(new Date(),"yyyy/MM/dd");
			//data["ApplyStatus"] = "1";
			data["UserID"] = AmApp.userID;
			data["OrgID"] =  AmApp.orgID;
			$db_operate.updateRecord($scope,"0016",data);
		}
		//定义小弹窗样式
	    $scope.smallModalStyle = {
                "top": "25%",
                "right": "20%",
                "bottom": "30%",
                "left": "20%",
                "min-height": "70px",
                "width": "60%",
                "border-radius": "10px"
         };
		// 新增客户
		$scope.insertRecord = function(){
			$rootScope.selectCatalogModalStyleTemp = $rootScope.selectCatalogModalStyle;
			$rootScope.selectCatalogModalStyle = $scope.smallModalStyle;
			//$timeout(function() {
			$scope.chooseDetail({},null,true);
			// },200);
			$scope.selectedMenuItem["ColId"] ;
			//设置模态详情页面所需参数
			$scope.setDetailModalQueryParam = function(modal,detailModalQueryParam){
				// 新增公司客户、个人客户模板不同
				if($scope.selectedMenuItem["ColId"]=="10" || $scope.selectedMenuItem["ColId"]=="20") {
					detailModalQueryParam["queryData"]["modelNo"] = "AddEntCustomer";
					detailModalQueryParam["queryData"]["ReturnType"] = "Info";
				} else {
					detailModalQueryParam["queryData"]["modelNo"] = "AddIndCustomer";
					detailModalQueryParam["queryData"]["ReturnType"] = "Info";
				}
			}
			$scope.toListDetailAfter = function(){
				if($scope.selectedMenuItem["ColId"] === "10" ||
						$scope.selectedMenuItem["ColId"] === "20"){
					$scope.detailListInfo.CertType = "Ent01"
				}
				
			}
			$scope.saveModel = function(){
				//数据校验
				var paramData = {};
				var loanType = $scope.selectedMenuItem["ColId"];
				var data = $scope.getModelNoReadOnlyData(true);
				var OperateFlag = data["OperateFlag"];
				if(!OperateFlag){
					return;
				}
				//组织机构代码校验
				if(loanType == "10" || loanType === "20"){
					var flag = CheckORG($scope.detailListInfo.CertID);
					if(!flag){
						$ionicLoading.show({
							title: "申请信息校验",
							template: "组织机构代码有误!",
							duration: 1500});
			            return;
					}
				}else if(loanType === "30"){
					var certTypes = $scope.detailListInfo.CertType;
					var certIDs = $scope.detailListInfo.CertID;
					
					if(certTypes === "Ind01" || certTypes === "Ind02" || certTypes === "Ind08"){
						if(certIDs.length != 15 && certIDs.length != 18){
							$ionicLoading.show({
								title: "申请信息校验",
								template: "身份证、户口簿长度必须是15位或者18位！",
								duration: 1500});
				            return;
						}
						if(!CheckLisince(certIDs)){
							$ionicLoading.show({
								title: "申请信息校验",
								template: "身份证、户口簿输入有误，请重新输入！",
								duration: 1500});
				            return;
						}
					}
				}
				
				if($scope.detailListInfo.CertID != $scope.detailListInfo.Remark){
					$ionicLoading.show({
						title: "申请信息校验",
						template: "证件号两次输入不一致!",
						duration: 1500});
		            return;
				}
				$scope.goDetailTopFlag = false;
				// 用来保存页面中录入的参数名称与参数值
					
				//var loanType = $scope.selectedMenuItem["ColId"];
				if(loanType == "10"){
					loanType = "01";
				}else if(loanType == "20"){
					loanType = "0301";
				}else if(loanType == "30"){
					loanType = "04";
				}
				paramData["LoanType"] = loanType;
				if(loanType == "01" || loanType == "0301"){
					paramData["CustomerType"] =$scope.detailListInfo.CustomerType ;
				}
				paramData["CustomerName"] = $scope.detailListInfo.CustomerName;
				paramData["CertType"] = $scope.detailListInfo.CertType;
				paramData["CertID"] = $scope.detailListInfo.CertID;
				paramData["InputUserID"] = AmApp.userID;
				paramData["InputOrgID"] =  AmApp.orgID;
				//调用后台方法TX_AddCustomer进行数据保存处理
				runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
						"AddCustomer", paramData, function (data, status) {
					if(typeof(data)!="undefined" && data.array[0].ReturnCode=="SUCCESS") {
						//模版关闭
						$scope.modal.hide();
						$scope.sCustomerID = data.array[0].ReturnDesc;
						//成功页面刷新
						$scope.refresh();
						
					} else {
						appIonicLoading.show({
				    		   template: "新增失败！",
				    		   animation: 'fade-in',
				    		   showBackdrop: true,
				    		   duration: 2000
				    	    });	
					}
					$rootScope.selectCatalogModalStyle = $rootScope.selectCatalogModalStyleTemp;
				});
			}
			 //模态选择页面取消事件
	        $scope.modalCancel = function () {
	        	$rootScope.selectCatalogModalStyle = $rootScope.selectCatalogModalStyleTemp;
	        	$scope.chooseDetailFlag = false;
	            $scope.modal.remove();
	        };
		}
		
		 //基本信息修改页面点选查询当前客户经理下所有用户
        $scope.selectOrgType = function(uiGridParam){
    		uiGridParam["SelName"] = "SelectOrgType";
    		$scope.doClickSure = function(){
            	$scope.detailInfo.OrgType = $scope.UITreeData["selectedData"]["itemValue"];
            	$scope.detailInfoNoUpdate.OrgTypeName = $scope.UITreeData["selectedData"]["itemName"];
    		}
		};
		
		$scope.selectIndustryType = function(uiGridParam){
            uiGridParam["SelName"] = "SelectCode";
            uiGridParam["ParamId"] = "CodeNo";
            uiGridParam["ParamValue"] = "IndustryType";
			$scope.doClickSure = function(){
            	$scope.detailInfo.IndustryType = $scope.UITreeData["selectedData"]["itemValue"];
            	$scope.detailInfoNoUpdate.IndustryTypeName = $scope.UITreeData["selectedData"]["itemName"];
    		}
		}
		
		
	});
