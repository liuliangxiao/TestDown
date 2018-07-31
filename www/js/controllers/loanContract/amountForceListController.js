/**
 * Created by yli18 on 2017年9月23日
 */
angular
    .module('com.amarsoft.mobile.controllers.amountForce.list', [])
	.controller('amountForceListController',function ($scope,$list,$group,$detail,$model,$contract,$db_operate,$timeout) {
		var param = {
			pageSize : 8,
			pageNo : 1,
			groupId : "amountForceList",
			listUrl : "SelectAmountForceList",
			className : "com.amarsoft.app.als.mobile.impl.ILoanContractImpl",
			methodName : "findAmountForceList",
			menuTitle : "额度生效",
			flag : true,
			Transaction:"null"
		}
		$model.init($scope);
		$list.load($scope,param);
		$detail.load($scope);
		$contract.init($scope);
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
	 			   detailParam["queryData"]["ObjectNo"] = selectedListItem["SerialNo"];//修改--需要合同号，不是借据号
	 			   detailParam["queryData"]["BusinessType"] = selectedListItem["BusinessType"];
	 		   }
    	   }
    	   detailParam["queryData"]["ReturnType"] = "Info";
		}
		
		//切换tab页后事件
		$scope.chooseModel = function(model,data){
			if(typeof($scope.selectedListItem) === "undefined") return;
			if(model.ColName == '影像信息'){
				$timeout(function () {
					$scope.dic = {};
					$scope.dic.ObjectType = "BusinessContract";
					$scope.dic.loanType = "";
					if(model.ColId == "2050"){
						//已生效的合同
						$scope.dic.showFlag = "false";
					}
					if($scope.selectedListItem != undefined){
						$scope.dic.ObjectNo = $scope.selectedListItem.SerialNo;
						$scope.$broadcast('to-screenage',$scope.dic);
					}
				}, 100);
			}else{
				$timeout(function () {
	 				$scope.$broadcast('to-detail',data);
	 			}, 100);
			}
		}
		$scope.SelectOrg = function(uiGridParam){
			
			//取得可办理小企业业务乌鲁木齐分行项下的支行机构编号
			var sSMEBusinessOrgID = $group.RunMethod("公用方法","GetColValue","Code_Library,ItemDescribe,CodeNo='SMEBusinessOrgID' and ItemNo='01'");
			//公司贷款部机构编号 added by xbwang 2012/07/04 
			var sENTBusinessOrgID = $group.RunMethod("公用方法","GetColValue","Code_Library,ItemDescribe,CodeNo='ENTBusinessOrgID' and ItemNo='01'");
			if(sSMEBusinessOrgID.indexOf(AmApp.orgID)>0)
			{
				uiGridParam["SelName"] = "SelectWLMQCZOrg";
			}else if(sENTBusinessOrgID.indexOf(AmApp.orgID)>0)
			{
				uiGridParam["SelName"] = "SelectAllCZOrg";
			}else
			{
				uiGridParam["SelName"] = "SelectCZOrg";
				uiGridParam["ParamId"] = "OrgID";
	    		uiGridParam["ParamValue"] =AmApp.orgID;
			}
    		$scope.doClickSure = function(){
    			$scope.detailInfo.PutOutOrgID = $scope.UIGridSelectedRow.OrgID;
    			$scope.detailInfoNoUpdate.PutOutOrgName = $scope.UIGridSelectedRow.OrgName;
    		}
		}
		//合同保存
		$scope.saveModel = function(){
			var data = $scope.getModelNoReadOnlyData("Frame1");

			/*var putoutDate = data["PutOutDate"];
			var maturity = data["Maturity"];*/

			var businessType = $scope.detailInfo["BusinessType"];
			var objectType = $scope.selectedListItem["ObjectType"];
			var occurType = $scope.selectedListItem["OccurType"];
			if(businessType.startsWith("111")){
	        	var rPTTermID=$scope.detailInfo["RPTTermID"]; 
				var  entrustPayRatio =$scope.detailInfo["EntrustPayRatio"];

	        	if(rPTTermID=="RPT16"|| rPTTermID=="RPT17"){//还款方式是等额本金和等额本息时，月还款额为必填项
	   				var monthPayAmount=getItemValue(0,getRow(),"MonthPayAmount");
	   				
	   				if((monthPayAmount<=0)){
	   					$ionicLoading.show({
	   						title: "信息校验",
	   						template: "月还款额为必输项,且大于0!",
	   						duration: 1500
	   					});
	   					return ;
	   				}
	   		  } 
	        	if(!(entrustPayRatio>=0 && entrustPayRatio<=100)){//受托支付比例为必填项
	        		$ionicLoading.show({
   						title: "信息校验",
   						template: "受托支付比例为必输项,且在0~100之间!",
   						duration: 1500
   					});	
					return;
				} 
	        }
			//update by zwang 2009/10/13 在批复阶段允许任意修改，如金额改大,期限长等
			/*if(objectType != "ApproveApply"){
				if("<%=CurUser.hasRole("0000")%>" != "true" && "<%=CurUser.hasRole("0980")%>" != "true"){
					if (!ValidityCheck()) return;//录入数据有效性检查
				}
			}*/
			
			// 20180206 绿色金融贷信息校验
			
			var sGreenLoanFlag = $scope.detailInfo["GreenLoanFlag"];
			var sGreenLoanPurpose = $scope.detailInfo["GreenLoanPurpose"];
			var sGreenLoanEntType = $scope.detailInfo["GreenLoanEntType"];
			if(sGreenLoanFlag != null && sGreenLoanFlag != "" && typeof(sGreenLoanFlag) !="undefined" && sGreenLoanFlag.length !=0){
				if(sGreenLoanFlag == "GreenLoan"){// 绿色贷款
					if(sGreenLoanPurpose == null || sGreenLoanPurpose == ""){
						$ionicLoading.show({
	   						title: "信息校验",
	   						template: "绿色金融贷类型选择【绿色贷款】时，按贷款用途划分为必输项!",
	   						duration: 1500
	   					});
						return ;
					}
					if(sGreenLoanEntType != null && sGreenLoanEntType != ""){
						$ionicLoading.show({
	   						title: "信息校验",
	   						template: "绿色金融贷类型选择【绿色贷款】时，按企业类别划分应为空！",
	   						duration: 1500
	   					});
						return ;
					}
				}else if(sGreenLoanFlag == "RiskLoan" ){// 环境、安全等重大风险企业贷款
					if(sGreenLoanEntType == null || sGreenLoanEntType == ""){
						$ionicLoading.show({
	   						title: "信息校验",
	   						template: "绿色金融贷类型选择【环境、安全等重大风险企业贷款】时，按贷款用途划分应为空！",
	   						duration: 1500
	   					});
						return ;
					}
					if(sGreenLoanPurpose != null && sGreenLoanPurpose != ""){
						$ionicLoading.show({
	   						title: "信息校验",
	   						template: "绿色金融贷类型选择【环境、安全等重大风险企业贷款】时，按企业类别划分为必输项！",
	   						duration: 1500
	   					});
						return ;
					}
				}
			}else{
				if((sGreenLoanPurpose != null && sGreenLoanPurpose != "")
						|| (sGreenLoanEntType != null && sGreenLoanEntType != "")){
					$ionicLoading.show({
   						title: "信息校验",
   						template: "绿色金融贷类型为空时，按贷款用途划分、按企业类别划分必须为空！",
   						duration: 1500
   					});
					return ;
				}
			}
			var	queryParam = {};
			
			if("1010030"==businessType && objectType =="CreditApply"){
				var objectNo = $scope.selectedListItem["ObjectNo"];
				queryParam = {
	                    ClassName: "com.amarsoft.app.als.mobile.common.RunMethodUtil",
	                    MethodName: "RunJavaMethodSqlca",
	                    sClassName: "com.amarsoft.app.lending.bizlets.CheckRepeat",
	                    sMethodName: "checkRepeat",
	                    args: "TableName=ACCT_FEE,WhereClause=ObjectType@eq@'jbo.app.BUSINESS_APPLY'@ObjectNo@eq@'"+objectNo+"'"
	                };
				var sReturn = $group.business(queryParam);
			//	var sReturn = AsControl.RunJavaMethodSqlca("com.amarsoft.app.lending.bizlets.CheckRepeat","checkRepeat","TableName=ACCT_FEE,WhereClause=ObjectType@eq@'jbo.app.BUSINESS_APPLY'@ObjectNo@eq@'"+<%=sObjectNo%>+"'");
				if("1"!=sReturn) {
					alert("法人账户透支业务需要录入费用组件信息！！");
					return;
				}
			}
			
			/*if(businessType=="3040010"||businessType=="3040005"||businessType=="4010005"||businessType=="4010010"||businessType=="4010020"||businessType=="4010025"||businessType=="4010030"
			  ||businessType=="4010035"||businessType=="4020005"||businessType=="4020010"||businessType=="4020020"||businessType=="4020025"||businessType=="4020030"||businessType=="4020035"){ //add hxwang
				setItemValue(0,getRow(),'TempSaveFlag',"2");//暂存标志（1：是；2：否）
			}*/
			
			// add by gwma 2015/07/31
			if("3030020"==businessType || "3030025"==businessType  ||  "3030026"==businessType  || "3030030"==businessType || "3030015"==businessType){
				//if (!CheckBail()) return;//根据保证金收取方式校验保证金字段是否录入值
				 var dBailSum = $scope.detailInfo["BailSum"];   
				 var dBailSumLimit = $scope.detailInfo["BailSumLimit"];
				 var dBailValue = $scope.detailInfo["BailValue"];
				 var dBailRatio = $scope.detailInfo["BailRatio"];
				 var sBailCollType = $scope.detailInfo["BailCollType"]; //保证金收取方式
				if(sBailCollType=="1" || sBailCollType =="2" || sBailCollType =="4" ){
					if(dBailRatio==0){
						$ionicLoading.show({
	   						title: "信息校验",
	   						template: "请输入保证金比例！",
	   						duration: 1500
	   					});
						return false;
					}
				}
				
				if(sBailCollType=="1" || sBailCollType=="5"){
					if(dBailSum==0){
						$ionicLoading.show({
	   						title: "信息校验",
	   						template: "请输入保证金金额！",
	   						duration: 1500
	   					});
						return false;
					}
				}
				return true ;
			}//end
			
			//addby zhoubiao 20161024
			var Purpose = $scope.detailInfo["Purpose"];
			if(typeof(Purpose) !="undefined" && Purpose.length !=0){
				if(Purpose.indexOf("#")>-1){
					Purpose = Purpose.replace(/#/g, "αγδεηρ");
	    		}
				queryParam = {
                        ClassName: "com.amarsoft.app.als.mobile.common.RunMethodUtil",
                        MethodName: "RunJavaMethodSqlca",
                        sClassName: "cn.com.tansun.sbmo.service.workflow.DealCodeOpinion",
                        sMethodName: "dealCodeoption",
                        args: "otherAppoint="+Purpose
                    };
				var Purpose = $group.business(queryParam);
				Purpose=Purpose.replace(/αγδεηρ/g,"#");
				data["Purpose"] = Purpose; 
			}//add end
			
			//end update 
			//if(vI_all("myiframe0")){
			//beforeUpdate();
			
			/*data["UpdateOrgID"] = AmApp.orgID;
			data["UpdateOrgName"] = "<%=CurOrg.getOrgName()%>");
			setItemValue(0,0,"UpdateUserID","<%=CurUser.getUserID()%>");
			setItemValue(0,0,"UpdateUserName","<%=CurUser.getUserName()%>");
			setItemValue(0,0,"UpdateDate","<%=StringFunction.getToday()%>");	
			setItemValue(0,getRow(),"UpdateUserID","<%=CurUser.getUserID()%>");//更新人
			setItemValue(0,getRow(),"UpdateOrgID","<%=CurOrg.getOrgID()%>");//更新机构
*/			
			//add by zwang 2009/11/23 【1110030个人商业用房贷款】中房屋总价，自动计算:单价*建筑面积
			//个人一手房贷款1110010/个人二手房贷款1110020/保障性住房贷款1110025/个人一手商用房贷款1110030/个人二手商用房贷款1110040
			if(businessType == "1110030" || businessType == "1110040" || businessType == "1110025"
				||	businessType == "1110010" || businessType == "1110020"){
				var sDanJia = $scope.detailInfo["ThirdParty2"];//房屋单价
				var sMianJi = $scope.detailInfo["ConstructionArea"];//房屋面接
				var dZongJia = roundOff(parseFloat(sDanJia)*parseFloat(sMianJi),2);//保留2位小数 zwang 2010/02/08 住房贷款的房屋总价计算结果保留2位小数。
				data["ThirdPartyID2"] = dZongJia;//房屋总价
				
			}
			
			/** 个人住房公积金贷款中的 房屋总价计算  方式    add by zwlv 2016/08/03  */
			if(businessType == "2110010")
			{
				var sDanJia = $scope.detailInfo["ThirdPartyAdd1"];    				//房屋单价
				var sMianJi = $scope.detailInfo["ConstructionArea"];					//房屋面积 
				var dZongJia = roundOff(parseFloat(sDanJia)*parseFloat(sMianJi),2); 
				data["ThirdParty2"] = dZongJia;									//房屋总价

			}
			//end add
			
			//add by zwang 2009/11/24 保存合同时，进行合同期限月和期限日的更新(非银承统一折算成月，银承合同期限月为0，日为票据最长期限,)
			//-----------此部分转换有问题
			if(objectType == "BusinessContract" || objectType == "ReinforceContract"){
				/*var sPutOutDate = $scope.detailInfo["PutOutDate"];//合同起始日
				var sMaturity   = $scope.detailInfo["Maturity"];//合同到期日
				
				queryParam = {
                        ClassName: "com.amarsoft.app.als.mobile.common.RunMethodUtil",
                        MethodName: "RunJavaMethodSqlca",
                        sClassName: "com.dcfs.esb.ftp.server.system.SystemManage",
                        sMethodName: "DateDiff",
                        args: sPutOutDate+","+sMaturity+",M"
                    };
				//RunMethod("SystemManage","DateDiff",sPutOutDate+","+sMaturity+",M");
				var dBCTermMonths = $group.business(queryParam);
				queryParam = {
                        ClassName: "com.amarsoft.app.als.mobile.common.RunMethodUtil",
                        MethodName: "RunJavaMethodSqlca",
                        sClassName: "com.dcfs.esb.ftp.server.system.SystemManage",
                        sMethodName: "DateDiff",
                        args: sPutOutDate+","+sMaturity+",DD"
                    };
				//RunMethod("SystemManage","DateDiff",sPutOutDate+","+sMaturity+",DD");
				var dBCTermDays = $group.business(queryParam);
				
				//进行折算(其中银票合同中的期限天表示票据最长票据期限，并非实际的合同期限天。) --- 为转换到app
				//add by gwma   国内信用证 ，进口信用证期限也是天  和银票一样  2015/08/07
				if(businessType == "2010" || businessType == "2020" || businessType == "2050030"){
					dBCTermDays = "<%=iCheckTermDay%>";//批准_期限_天
					//add by zwang 2009/12/09 小企业项下业务中的银票中票据最长期限天不取批复中的期限、补登合同中的银票中的票据最长期限不取批复中的期限天
					if("<%=sSMEDependentBC%>" == "true" || "<%=sReinforceFlag%>" != "000" ){
						dBCTermDays = getItemValue(0,getRow(),"TermDay");//票据最长期限
					}
					//end add
					// dBCTermMonths=0;
				}else{
					if(parseInt(dBCTermDays)>0){
						dBCTermMonths = parseInt(dBCTermMonths)+1;
						dBCTermDays=0;
					}
				}
				//alert("自动计算 合同期限月:"+dBCTermMonths+"	合同期限日:"+dBCTermDays);
				// setItemValue(0,0,"TermMonth",dBCTermMonths);//设置合同期限月
				data["TermDay"] = dBCTermDays;//设置合同期限日
*/			}
			if("3040010"==businessType)
			{
				var sTermMonth = $scope.detailInfo["TermMonth"];
				if(sTermMonth>2){
					$ionicLoading.show({
   						title: "信息校验",
   						template: "同业授信额度(临时)期限不能大于2个月!",
   						duration: 1500
   					});
					return;
				}
			}
			if("4010005"== businessType ||"4020005"== businessType)
			{
				var sBusinessSubType= $scope.detailInfo["BusinessSubType"];
				if(sBusinessSubType=="" || sBusinessSubType==null)
				{
					$ionicLoading.show({
   						title: "信息校验",
   						template: "业务品种为资管计划时，业务子类型必输！",
   						duration: 1500
   					});
					return;
				}
			}
			if("3030025"== businessType){
				var sEnlarge = $scope.detailInfo["Enlarge"];
				var sBusinessSum = $scope.detailInfo["BusinessSum"];
				var sTermMonth = $scope.detailInfo["TermMonth"];
				var iEnlarge =parseInt(sEnlarge);
				var iBusinessSum =parseFloat(sBusinessSum);
				var iTermMonth =parseInt(sTermMonth);
				if(iEnlarge < 1){
					$ionicLoading.show({
   						title: "信息校验",
   						template: "保证金扩大倍数必须大于1！",
   						duration: 1500
   					});
					return false;
				}				
				if(iBusinessSum<=0||isNaN(iBusinessSum)){
					$ionicLoading.show({
   						title: "信息校验",
   						template: "担保额度必须大于零！",
   						duration: 1500
   					});
					return ;
				}
				if(iTermMonth<=0){
					$ionicLoading.show({
   						title: "信息校验",
   						template: "额度有效期限必须大于零！",
   						duration: 1500
   					});
					return ;
				}
			}
			//var sBusinessType='<%=sBusinessType%>';
			//非标业务中日期的校验 add hxwang 2017/11/10
			if(businessType.startsWith("40")){
				var repriceDate = $scope.detailInfo["REPRICEDATE"];//起始日
				var promisesfeeBegin = $scope.detailInfo["PromisesfeeBegin"];//到期日
				if(promisesfeeBegin<repriceDate){
					$ionicLoading.show({
   						title: "信息校验",
   						template: "到期日不能早于起始日!",
   						duration: 1500
   					});
					return ;
				}
			}
			
			//if (!ValidityCheck1()) return;
			sMaturity = $scope.detailInfo["Maturity"];//合同到期日
			sLimitationTerm = $scope.detailInfo["LimitationTerm"];//额度使用最迟日期
			sUseTerm = $scope.detailInfo["UseTerm"];//额度项下业务最迟到期日期
			
			//数据治理@录入的日期要素不能为9999/12/31  -----未转换到app
			//if(checkMaxdate(iColArray)) return false;
			
			if(typeof(sMaturity) != "undefined" && sMaturity.length > 0){
				if(typeof(sLimitationTerm) != "undefined" && sLimitationTerm.length > 0){
					if(sMaturity<sLimitationTerm){
						$ionicLoading.show({
	   						title: "信息校验",
	   						template: "额度使用最迟日期不能大于合同到日期",
	   						duration: 1500
	   					});
						return false;
					}
				}
				if(typeof(sUseTerm) != "undefined" && sUseTerm.length > 0){
					if(sMaturity<sUseTerm){
						$ionicLoading.show({
	   						title: "信息校验",
	   						template: "额度项下业务最迟到期日期不能大于合同到期日",
	   						duration: 1500
	   					});
						return false;
					}
				}
			}
			var sFlag5 = $scope.detailInfo["Flag5"];
			if(sFlag5=="1"){
				var sChargeRate = $scope.detailInfo["ChargeRate"];
				var sChargeType = $scope.detailInfo["ChargeType"];
				if(typeof(sChargeType) == "undefined" || sChargeType.length == 0){
					$ionicLoading.show({
   						title: "信息校验",
   						template: "请录入贴息利息垫付方式！！",
   						duration: 1500
   					});
					return;
				}
				if(typeof(sChargeRate) == "undefined" || sChargeRate.length == 0){
					$ionicLoading.show({
   						title: "信息校验",
   						template: "请录入贴息比例！！",
   						duration: 1500
   					});
					return;
				}
			}
			//setItemValue(0,getRow(),"TempSaveFlag","2"); //暂存标志（1：是；2：否）	
					//add by wjli 20150429 在点击保存时，判断表外业务手续费是否存在，如果存在，则更新费用组件里金额和费率组件，如果不存在，则新增
			//var businessType='<%=sBusinessType%>';
			var  dPdgRatio = $scope.detailInfo["PdgRatio"];
			var  PdgSum = $scope.detailInfo["PdgSum"];
			if( typeof(businessType) == "undefined" || businessType.length == 0){
				return;
			}
			
			var isNewProduct = $scope.detailInfo["IsNewProduct"];
			if (typeof (isNewProduct) != "undefined" && trim(isNewProduct) != "") {
				if (isNewProduct == "1") {// 【是否新产品】选择"是", 则【新产品细分】必须
					var newProductDetail = $scope.detailInfo["NewProductDetail"];
					if (typeof newProductDetail == "undefined" || trim(newProductDetail) == "") {
						$ionicLoading.show({
	   						title: "信息校验",
	   						template: "请选择【新产品细分】",
	   						duration: 1500
	   					});
						return;
					}
				} else {// 【是否新产品】选择"否", 则【新产品细分】设置为空, 并且只读
					data["NewProductDetail"] = "";
				}
			}
			
			if("1000000"==businessType ||"1010020"==businessType || "1030010"==businessType || "1030020"==businessType || 
					"1030022"==businessType || "1030030"==businessType || "1040010"==businessType || "1040020"==businessType
					|| "1040030"==businessType|| "1040040"==businessType|| "1120070"==businessType
					|| "1120080"==businessType|| "1120100"==businessType|| "1120110"==businessType
					|| "1120130"==businessType|| "1120140"==businessType|| "1120150"==businessType
					|| "1110120"==businessType|| "1110220"==businessType|| "1110230"==businessType
					|| "1110240"==businessType|| "1120060"==businessType|| "1120090"==businessType
					|| "1120120"==businessType){
				var businesssum = $scope.detailInfo["BusinessSum"];
				var paymode = $scope.detailInfo["PayMode"];
				var paymoney = $scope.detailInfo["PayMoney"]; 
				if(paymode == 2){
					if(paymoney.length == 0){
						$ionicLoading.show({
	   						title: "信息校验",
	   						template: "请填写【单笔金额超过__万元（含本数）时采用受托支付方式】",
	   						duration: 1500
	   					});
						return;
					}
				}else if(paymode == 1 || paymode == 3){
					if(paymoney.length != 0){
						$ionicLoading.show({
	   						title: "信息校验",
	   						template: "当选择【全部受托支付方式】或【全部自主支付方式】不需填写【单笔金额超过__万元（含本数）时采用受托支付方式】",
	   						duration: 1500
	   					});
						return;
					}
				} 
				if(businesssum < paymoney*10000){
					$ionicLoading.show({
   						title: "信息校验",
   						template: "单笔受托支付金额不能大于申请金额！",
   						duration: 1500
   					});
					return;
				}
			}
			//租金贷贷款时  需限制100%受托支付
			if("1120070"==businessType && objectType =="CreditApply" && occurType =="010"){
				var paymode = $scope.detailInfo["PayMode"];
				if(paymode !=1){
					$ionicLoading.show({
   						title: "信息校验",
   						template: "租金贷贷款时，请选择全部受托支付方式",
   						duration: 1500
   					});
					return;	
				}
			}
			

			//雪莲·养殖贷养殖类型校验
			if("1120110"==businessType){
				var breedType = $scope.detailInfo["CultivationTyp"];
				var objectNo = $scope.selectedListItem["ObjectNo"];
				queryParam = {
                        ClassName: "com.amarsoft.app.als.mobile.common.RunMethodUtil",
                        MethodName: "RunJavaMethodSqlca",
                        sClassName: "cn.com.tansun.sbmo.service.workflow.RuleManager",
                        sMethodName: "verifyBreedInfo",
                        args: "objectNo=<%=sObjectNo%>"
                    };
				var sReturn = $group.business(queryParam);
				if(typeof(sReturn) != "undefined" && sReturn.length>0 && sReturn != "null"){
					$ionicLoading.show({
   						title: "信息校验",
   						template: sReturn,
   						duration: 1500
   					});
					return;
				}
			}

			data= $scope.dataFormatAdjust(data);

    	    $db_operate.updateRecord($scope,"0002",data);
        }
		
		/*var validata = function(){}*/
			//if(!saveSubItem()) return;
		//}
		
});
