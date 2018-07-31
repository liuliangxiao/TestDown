/**
 * Created by ypwang6 on 2017/7/21.
 */
angular.module('com.amarsoft.mobile.controllers.loanCalc', [])
    // 贷款计算器主页面
    .controller('loanCalcController', function ($scope, $state, $ionicPopup, $ionicLoading, $timeout, $http, basePage,$rootScope) {
        // 商业按揭贷款
        $scope.CommericialLoan = function () {
			$rootScope.modualName = "商业按揭贷款";
			$rootScope.moduleSwitch('commericialLoan',"loanCalcIndex");
        };
        // 协议还款
        $scope.AgreementRepayment = function () {
			$rootScope.moduleSwitch('agreementRepayment',"loanCalcIndex");
        };
        // 公积金按揭贷款
        $scope.ProvidentFundLoan = function () {
			$rootScope.modualName = "公积金按揭贷款";
			$rootScope.moduleSwitch('providentFundLoan',"loanCalcIndex");
        };
        // 贴现计算器
        $scope.DiscountCalc = function () {
			$rootScope.modualName = "贴现计算器";
			$rootScope.moduleSwitch('discountCalc',"loanCalcIndex");
        };
        // 组合贷款
        $scope.PortfolioLoan = function () {
			$rootScope.modualName = "组合贷款";
			$rootScope.moduleSwitch('portfolioLoan',"loanCalcIndex");
        };
		$rootScope.goToLastPage = function () {
            $rootScope.moduleSwitch('loanCalcIndex',"loanCalcIndex");
		};
    })
    // 商业按揭贷款
    .controller('commericialLoanController', function ($scope, $state, $ionicPopup, $ionicLoading, $timeout, $http, basePage) {
    	//商业贷款金额
    	$scope.loan ={sum:"",rate:"",discountRate:""};
    	//还款方式
    	$scope.ways = [{id:1,content:"等额本金"},{id:2,content:"等额本息"}];

		$scope.rightDetailShowFlag = false;

		//贷款期限
        $scope.times = [{id:1,name:"1年（12期）"},{id:2,name:"2年（24期）"},{id:3,name:"3年（36期）"},
                        {id:4,name:"4年（48期）"},{id:5,name:"5年（60期）"},{id:6,name:"6年（72期）"},
                        {id:7,name:"7年（84期）"},{id:8,name:"8年（96期）"},{id:9,name:"9年（108期）"},
                        {id:10,name:"10年（120期）"},{id:11,name:"11年（132期）"},{id:12,name:"12年（144期）"},
                        {id:13,name:"13年（156期）"},{id:14,name:"14年（168期）"},{id:15,name:"15年（180期）"},
                        {id:16,name:"16年（192期）"},{id:17,name:"17年（204期）"},{id:18,name:"18年（216期）"},
                        {id:19,name:"19年（228期）"},{id:20,name:"20年（240期）"},{id:21,name:"21年（252期）"},
                        {id:22,name:"22年（264期）"},{id:23,name:"23年（276期）"},{id:24,name:"24年（288期）"},
                        {id:25,name:"25年（300期）"},{id:26,name:"26年（312期）"},{id:27,name:"27年（324期）"},
                        {id:28,name:"28年（336期）"},{id:29,name:"29年（348期）"},{id:30,name:"30年（360期）"}];

		$scope.rates = [{rate:"1.3",title:"基准利率1.3"},{rate:"1.2",title:"基准利率1.2倍"},{rate:"1.1",title:"基准利率1.1倍"},
		                        {rate:"0.95",title:"基准利率95折"},{rate:"0.9",title:"基准利率9折"},{rate:"0.85",title:"基准利率85折"},{rate:"0.8",title:"基准利率8折"},
		                        {rate:"0.75",title:"基准利率75折"},{rate:"0.7",title:"基准利率7折"}];

        //是否显示还款明细
    	$scope.judges = [{id:1,title:"是"},{id:2,title:"否"}];
    	//默认显示明细
    	$scope.repayment = {detail:true};
    	//选择初始化
    	$scope.model = {waySelected:"",timeSelected:"",judgeSelected:"",rate:""};
    	$scope.resultOut = {interest:"",rental:""};
		$scope.loan.rate = AmApp.config.commericalLoanRate;
        //计算
        $scope.calculate = function(){

        	if(!($scope.model.waySelected  && $scope.loan.sum && $scope.loan.rate && $scope.model.timeSelected)){
				$scope.rightDetailShowFlag = false;
                $scope.tipShowFlag = true;
				return;
        	}
			$scope.tipShowFlag = false;
        	//商业贷款金额
        	var totalMoney = parseFloat($scope.loan.sum) * parseFloat(10000);
        	//商业贷款期限
        	var timeLimit = parseFloat($scope.model.timeSelected) * parseFloat(12);
        	//商业贷款利率
        	var rate = parseFloat($scope.loan.rate.replace("%",""))/parseFloat(100);
        	if($scope.model.waySelected==1){
        		averageCapital(totalMoney,timeLimit,rate);
        		hiddenOrShow();
        	}else if ($scope.model.waySelected==2){
        		averageinterest(totalMoney,timeLimit,rate);
        		hiddenOrShow();
        	}
			$scope.rightDetailShowFlag = true;

		};
        //隐藏或展示还款明细
        var hiddenOrShow = function(){
        	if($scope.model.judgeSelected==1){
        		$scope.repayment.detail = true;
        	}else{
        		$scope.repayment.detail = false;
        	}
        }
		//计算折扣后的贷款利率
		$scope.computerRate = function () {
			if($scope.loan.discountRate){
			    $scope.rateStr = (parseFloat(AmApp.config.commericalLoanRate) * parseFloat($scope.loan.discountRate)).toString();
				$scope.loan.rate = parseFloat($scope.rateStr.substr(0,($scope.rateStr).indexOf(".")) +""+$scope.rateStr.substr(($scope.rateStr).indexOf("."),3));
				$scope.loan.rate = $scope.loan.rate +"%"
			}else {
				$scope.loan.rate = AmApp.config.commericalLoanRate + "%";
			}
		}
        //重新计算
        $scope.reCalculate = function(){
        	$scope.loan.sum = "";
        	$scope.loan.rate = "";
        	$scope.resultOut.interest = "";
        	$scope.resultOut.rental = "";
        	$scope.model.waySelected=0;
        	$scope.model.timeSelected=0;
        	$scope.model.judgeSelected=0;
			$scope.rightDetailShowFlag = false;
			$scope.tipShowFlag = false;
			$scope.loan.discountRate = "";
			$scope.loan.rate  = AmApp.config.commericalLoanRate;
		};
        //****************/等额本金/****************//
        var averageCapital = function(totalMoney,timeLimit,rate){
        	$scope.dataArray = [{period:"期次",interest:"偿还利息",principal:"偿还本金",mouthlyPayment:"月供",residueMoney:"剩余还款"}];
        	//月利率
        	var monthlyRate = parseFloat(rate)/12;
          //monthlyRate = monthlyRate.toFixed(6);
        	//每月本金
        	var mouthlyPrincipal = parseFloat(totalMoney)/parseFloat(timeLimit);
        	//支付利息
        	$scope.resultOut.interest = ((timeLimit+1)*parseFloat(totalMoney)*parseFloat(monthlyRate)/2).toFixed(2);
        	//还款总额
        	$scope.resultOut.rental = ((timeLimit+1)*parseFloat(totalMoney)*parseFloat(monthlyRate)/2 + parseFloat(totalMoney)).toFixed(2);
        	//首月还款
        	var fristMouthly = (mouthlyPrincipal+parseFloat(totalMoney)*monthlyRate).toFixed(2);
        	//每月递减
        	var mouthlyDecrease = (mouthlyPrincipal*monthlyRate).toFixed(2);
        	var allPay = 0;
        	var changMoney = parseFloat($scope.resultOut.rental);
        	for (var i=0;i<timeLimit;i++){
        		var paymentDetail = {period:"",interest:"",principal:"",mouthlyPayment:"",residueMoney:""};
        		//还款期次
				paymentDetail.period = i+1;
        		//还本金
				paymentDetail.principal = mouthlyPrincipal.toFixed(2);

        		allPay = (parseFloat(allPay) + parseFloat(paymentDetail.principal)).toFixed(2);
        		//还利息
				paymentDetail.interest = (paymentDetail.principal * monthlyRate*(timeLimit-i)).toFixed(2);
        		//剩余还款
				paymentDetail.residueMoney = (changMoney - ((parseFloat(paymentDetail.principal))+parseFloat(paymentDetail.interest))).toFixed(2);
        		if(paymentDetail.residueMoney<0){
        			paymentDetail.residueMoney = 0;
        		}
				if(i+1 == timeLimit && paymentDetail.residueMoney > 0){
					paymentDetail.interest = (parseFloat(paymentDetail.interest)+parseFloat(paymentDetail.residueMoney)).toFixed(2) ;
					paymentDetail.mouthlyPayment = (parseFloat(paymentDetail.principal) +parseFloat(paymentDetail.interest)).toFixed(2);
					paymentDetail.residueMoney = 0 ;
				}else{
					paymentDetail.mouthlyPayment = (parseFloat(paymentDetail.principal) +parseFloat(paymentDetail.interest)).toFixed(2);
				}
        		$scope.dataArray.push(paymentDetail);
        		changMoney = parseFloat(paymentDetail.residueMoney);
        	}
        	
        };
        
        //****************/等额本息/****************//
        var averageinterest = function(totalMoney,timeLimit,rate){
        	$scope.dataArray = [{period:"期次",interest:"偿还利息",principal:"偿还本金",mouthlyPayment:"月供",residueMoney:"剩余还款"}];
        	//月利率
        	var monthlyRate = parseFloat(rate)/12;
          //monthlyRate = monthlyRate.toFixed(6);
        	//每月还款
        	var n = parseFloat(1) + parseFloat(monthlyRate);
        	var mouthlyRepay = [totalMoney*monthlyRate*(Math.pow(n, timeLimit))]/[Math.pow(n, timeLimit) - parseFloat(1)];
        	//mouthlyRepay = mouthlyRepay.toFixed(2);
        	//支付利息
        	$scope.resultOut.interest = (mouthlyRepay*timeLimit - totalMoney).toFixed(2);
        	//还款总额
        	$scope.resultOut.rental = (mouthlyRepay*timeLimit).toFixed(2);
        	var changMoney = parseFloat($scope.resultOut.rental);
        	for(var i=0;i<timeLimit;i++){
        		var paymentDetail = {period:"",interest:"",principal:"",mouthlyPayment:"",residueMoney:""};
        		paymentDetail.period = i+1;
        		//第i月的本金还款额
        		var mouthly = [totalMoney*monthlyRate*(Math.pow(n, parseFloat(paymentDetail.period)-1))]/[Math.pow(n, timeLimit) - parseFloat(1)];
        		var a = totalMoney*monthlyRate*[Math.pow(n, timeLimit)-Math.pow(n, parseFloat(paymentDetail.period)-1)];
        		var b =Math.pow(n, timeLimit)-1;
        		paymentDetail.principal = mouthly.toFixed(2);
        		paymentDetail.interest = (parseFloat(a)/parseFloat(b)).toFixed(2);
        		paymentDetail.mouthlyPayment = (parseFloat(paymentDetail.interest)+parseFloat(paymentDetail.principal)).toFixed(2);
        		paymentDetail.residueMoney =  (changMoney - ((parseFloat(paymentDetail.principal))+parseFloat(paymentDetail.interest))).toFixed(2);
        		if(paymentDetail.residueMoney<0){
        			paymentDetail.residueMoney = 0;
        		}
        		$scope.dataArray.push(paymentDetail);
        		changMoney = parseFloat(paymentDetail.residueMoney);
        	}
        	
        }
        /*************定义贷款利率框输入字符格式**************/
      /*  $scope.changeText = function(){
        	$scope.loan.rate = $scope.loan.rate + "%";
        	$("#rate").attr("type","text");
        }
        $scope.changeNumber = function(){
        	$scope.loan.rate = $scope.loan.rate.replace("%","");//去掉字符串中所有'%'
        	$("#rate").attr("type","number");
        }*/
        
        basePage.init($scope);
    })
    // 协议还款

    // 公积金按揭贷款
    .controller('providentFundLoanController', function ($scope, $state, $ionicPopup, $ionicLoading, $timeout, $http, basePage) {
    	//商业贷款全额
    	$scope.loan ={sum:"",rate:""};
    	//还款方式
    	$scope.ways = [{id:1,content:"等额本金"},{id:2,content:"等额本息"}];
		$scope.rightDetailShowFlag = false;

		//贷款期限
        $scope.times = [{id:1,name:"1年（12期）"},{id:2,name:"2年（24期）"},{id:3,name:"3年（36期）"},
                        {id:4,name:"4年（48期）"},{id:5,name:"5年（60期）"},{id:6,name:"6年（72期）"},
                        {id:7,name:"7年（84期）"},{id:8,name:"8年（96期）"},{id:9,name:"9年（108期）"},
                        {id:10,name:"10年（120期）"},{id:11,name:"11年（132期）"},{id:12,name:"12年（144期）"},
                        {id:13,name:"13年（156期）"},{id:14,name:"14年（168期）"},{id:15,name:"15年（180期）"},
                        {id:16,name:"16年（192期）"},{id:17,name:"17年（204期）"},{id:18,name:"18年（216期）"},
                        {id:19,name:"19年（228期）"},{id:20,name:"20年（240期）"},{id:21,name:"21年（252期）"},
                        {id:22,name:"22年（264期）"},{id:23,name:"23年（276期）"},{id:24,name:"24年（288期）"},
                        {id:25,name:"25年（300期）"},{id:26,name:"26年（312期）"},{id:27,name:"27年（324期）"},
                        {id:28,name:"28年（336期）"},{id:29,name:"29年（348期）"},{id:30,name:"30年（360期）"}];
        //是否显示还款明细
    	$scope.judges = [{id:1,title:"是"},{id:2,title:"否"}];
    	//默认不显示明细
    	$scope.repayment = {detail:true};
    	//选择初始化
    	$scope.model = {waySelected:"",timeSelected:"",judgeSelected:""};
    	$scope.resultOut = {interest:"",rental:""};
        //计算
		//lxu1@amar_1314
        $scope.calculate = function(){
        	if(!($scope.model.waySelected && $scope.loan.sum && $scope.loan.rate && $scope.model.timeSelected)){
				$scope.tipShowFlag = true;
				$scope.rightDetailShowFlag = false;
				return;
        	}
			$scope.tipShowFlag = false;

			//公积金贷款金额
        	var totalMoney = parseFloat($scope.loan.sum) * parseFloat(10000);
        	//公积金贷款期限
        	var timeLimit = parseFloat($scope.model.timeSelected) * parseFloat(12);
        	//公积金贷款利率
        	var rate = parseFloat($scope.loan.rate)/parseFloat(100);
        	
        	if($scope.model.waySelected==2){
        		averageinterest(totalMoney,timeLimit,rate);
        		hiddenOrShow();
        	}else if ($scope.model.waySelected==1){
        		averageCapital(totalMoney,timeLimit,rate);
        		hiddenOrShow();
        	}
			$scope.rightDetailShowFlag = true;

		};
        //隐藏或展示还款明细
        var hiddenOrShow = function(){
        	if($scope.model.judgeSelected==1){
        		$scope.repayment.detail = true;
        	}else{
        		$scope.repayment.detail = false;
        	}
        }
        //重新计算
        $scope.reCalculate = function(){
        	$scope.loan.sum = "";
        	$scope.loan.rate = "";
        	$scope.resultOut.interest = "";
        	$scope.resultOut.rental = "";
        	$scope.model.waySelected=0;
        	$scope.model.timeSelected=0;
        	$scope.model.judgeSelected=0;
			$scope.rightDetailShowFlag = false;
			$scope.tipShowFlag = false;


		};
		 //****************/等额本金/****************//
        var averageCapital = function(totalMoney,timeLimit,rate){
        	$scope.dataArray = [{period:"期次",interest:"偿还利息",principal:"偿还本金",mouthlyPayment:"月供",residueMoney:"剩余还款"}];
        	//月利率
        	var monthlyRate = parseFloat(rate)/12;
        	/*monthlyRate = monthlyRate.toFixed(6);*/
        	//每月本金
        	var mouthlyPrincipal = parseFloat(totalMoney)/parseFloat(timeLimit);
        	//支付利息
        	$scope.resultOut.interest = ((timeLimit+1)*parseFloat(totalMoney)*parseFloat(monthlyRate)/2).toFixed(2);
        	//还款总额
        	$scope.resultOut.rental = ((timeLimit+1)*parseFloat(totalMoney)*parseFloat(monthlyRate)/2 + parseFloat(totalMoney)).toFixed(2);
        	//首月还款
        	var fristMouthly = (mouthlyPrincipal+parseFloat(totalMoney)*monthlyRate).toFixed(2);
        	//每月递减
        	var mouthlyDecrease = (mouthlyPrincipal*monthlyRate).toFixed(2);
        	var allPay = 0;
        	var changMoney = parseFloat($scope.resultOut.rental);
        	for (var i=0;i<timeLimit;i++){
        		var paymentDetail = {period:"",interest:"",principal:"",mouthlyPayment:"",residueMoney:""};
        		paymentDetail.period = i+1;
        		paymentDetail.principal = mouthlyPrincipal.toFixed(2);
        		allPay = (parseFloat(allPay) + parseFloat(paymentDetail.principal)).toFixed(2);
        		paymentDetail.interest = (paymentDetail.principal * monthlyRate*(timeLimit-i)).toFixed(2);
        		paymentDetail.mouthlyPayment = (parseFloat(paymentDetail.principal) +parseFloat(paymentDetail.interest)).toFixed(2);
        		paymentDetail.residueMoney = (changMoney - ((parseFloat(paymentDetail.principal))+parseFloat(paymentDetail.interest))).toFixed(2);
        		if(paymentDetail.residueMoney<0){
        			paymentDetail.residueMoney = 0;
        		}
        		$scope.dataArray.push(paymentDetail);
        		changMoney = parseFloat(paymentDetail.residueMoney);
        	}
        };
        
        //****************/等额本息/****************//
        var averageinterest = function(totalMoney,timeLimit,rate){
        	
        	$scope.dataArray = [{period:"期次",interest:"偿还利息",principal:"偿还本金",mouthlyPayment:"月供",residueMoney:"剩余还款"}];
        	//月利率
        	var monthlyRate = parseFloat(rate)/12;
        	//monthlyRate = monthlyRate.toFixed(6);
        	//每月还款
        	var n = parseFloat(1) + parseFloat(monthlyRate);
        	var mouthlyRepay = [totalMoney*monthlyRate*(Math.pow(n, timeLimit))]/[Math.pow(n, timeLimit) - parseFloat(1)];
        	//mouthlyRepay = mouthlyRepay.toFixed(2);
        	//支付利息
        	$scope.resultOut.interest = (mouthlyRepay*timeLimit - totalMoney).toFixed(2);
        	//还款总额
        	$scope.resultOut.rental = (mouthlyRepay*timeLimit).toFixed(2);
        	var changMoney = parseFloat($scope.resultOut.rental);
        	for(var i=0;i<timeLimit;i++){
        		var paymentDetail = {period:"",interest:"",principal:"",mouthlyPayment:"",residueMoney:""};
        		paymentDetail.period = i+1;
        		//第i月的本金还款额
        		var mouthly = [totalMoney*monthlyRate*(Math.pow(n, parseFloat(paymentDetail.period)-1))]/[Math.pow(n, timeLimit) - parseFloat(1)];
        		var a = totalMoney*monthlyRate*[Math.pow(n, timeLimit)-Math.pow(n, parseFloat(paymentDetail.period)-1)];
        		var b =Math.pow(n, timeLimit)-1;
        		paymentDetail.principal = mouthly.toFixed(2);
        		paymentDetail.interest = (parseFloat(a)/parseFloat(b)).toFixed(2);
        		paymentDetail.mouthlyPayment = (parseFloat(paymentDetail.interest)+parseFloat(paymentDetail.principal)).toFixed(2);
        		paymentDetail.residueMoney =  (changMoney - ((parseFloat(paymentDetail.principal))+parseFloat(paymentDetail.interest))).toFixed(2);
        		if(paymentDetail.residueMoney<0){
        			paymentDetail.residueMoney = 0;
        		}
        		$scope.dataArray.push(paymentDetail);
        		changMoney = parseFloat(paymentDetail.residueMoney);
        	}
        }
        //

        basePage.init($scope);
    })
    // 贴现计算器
    .controller('discountCalcController', function ($scope, $state, $ionicPopup, $ionicLoading, $timeout, $http, basePage) {
        //绑定数据
        $scope.ParData= {
            ParValue: '',
            MonthRate:'',
            StartDate:'',
            finishDate:'',
            AdjustTime:'',
            ResultDate:'',
            ResultRate:'',
            ResultValue:''

        };
		$scope.rightDetailShowFlag = false;

		//计算贴现金额和利率
        $scope.Calculation=function(){
            //判定
             if($scope.ParData.AdjustTime==null || $scope.ParData.AdjustTime==""){
                 $scope.ParData.AdjustTime=0;
             };

			if(!($scope.ParData.ParValue && $scope.ParData.MonthRate && $scope.ParData.StartDate && $scope.ParData.finishDate)){
				$scope.tipShowFlag = true;
				$scope.rightDetailShowFlag = false;
				return;
			}
			$scope.tipShowFlag = false;


			//获取相差天数
            var Date= ($scope.ParData.finishDate.getTime() - $scope.ParData.StartDate.getTime())/86400000;
            $scope.ParData.ResultDate=Date+$scope.ParData.AdjustTime;
            $scope.ParData.ResultRate=$scope.ParData.ParValue*10000*$scope.ParData.MonthRate/100*($scope.ParData.ResultDate)/30;
            $scope.ParData.ResultValue=$scope.ParData.ParValue*10000-$scope.ParData.ResultRate;
			$scope.rightDetailShowFlag = true;

		};
        //清空
        $scope.toEmpty=function(){
            $scope.ParData= {};
			$scope.rightDetailShowFlag = false;
			$scope.tipShowFlag = false;


		};

        basePage.init($scope);
    })

    // 组合贷款
    .controller('portfolioLoanController', function ($scope, $state, $ionicPopup, $ionicLoading, $timeout, $http, basePage) {
    	//贷款期限
        $scope.times = [{id:1,name:"1年（12期）"},{id:2,name:"2年（24期）"},{id:3,name:"3年（36期）"},
                        {id:4,name:"4年（48期）"},{id:5,name:"5年（60期）"},{id:6,name:"6年（72期）"},
                        {id:7,name:"7年（84期）"},{id:8,name:"8年（96期）"},{id:9,name:"9年（108期）"},
                        {id:10,name:"10年（120期）"},{id:11,name:"11年（132期）"},{id:12,name:"12年（144期）"},
                        {id:13,name:"13年（156期）"},{id:14,name:"14年（168期）"},{id:15,name:"15年（180期）"},
                        {id:16,name:"16年（192期）"},{id:17,name:"17年（204期）"},{id:18,name:"18年（216期）"},
                        {id:19,name:"19年（228期）"},{id:20,name:"20年（240期）"},{id:21,name:"21年（252期）"},
                        {id:22,name:"22年（264期）"},{id:23,name:"23年（276期）"},{id:24,name:"24年（288期）"},
                        {id:25,name:"25年（300期）"},{id:26,name:"26年（312期）"},{id:27,name:"27年（324期）"},
                        {id:28,name:"28年（336期）"},{id:29,name:"29年（348期）"},{id:30,name:"30年（360期）"}];

		 $scope.rates = [{rate:"1.3",title:"基准利率1.3"},{rate:"1.2",title:"基准利率1.2倍"},{rate:"1.1",title:"基准利率1.1倍"},{rate:"0.95",title:"基准利率95折"},
			{rate:"0.9",title:"基准利率9折"},{rate:"0.85",title:"基准利率85折"},{rate:"0.8",title:"基准利率8折"},{rate:"0.75",title:"基准利率75折"},
			{rate:"0.7",title:"基准利率7折"}];

		//还款方式
    	$scope.ways = [{id:1,content:"等额本金"},{id:2,content:"等额本息"}];
    	$scope.Result = {AccTimeSelected:"",waySelected:"",AccSum:"",AccRate:"",BusTimeSelected:"",
    			                  BusSum:"",BusRate:AmApp.config.commericalLoanRate+"%",discountRate:""}
    	$scope.tipShowFlag = false;
    	$scope.rightDetailShowFlag = false;
    	//计算折扣后的贷款利率
		$scope.computerRate = function () {
			if($scope.Result.discountRate){
			    $scope.rateStr = (parseFloat(AmApp.config.commericalLoanRate) * parseFloat($scope.Result.discountRate)).toString();
				$scope.Result.BusRate = parseFloat($scope.rateStr.substr(0,($scope.rateStr).indexOf(".")) +""+$scope.rateStr.substr(($scope.rateStr).indexOf("."),3));
				$scope.Result.BusRate = $scope.Result.BusRate +"%"
			}else {
				$scope.Result.BusRate = AmApp.config.commericalLoanRate+"%";
			}
		}

        //重新计算
        $scope.reCalculate = function(){
            $scope.Result.waySelected="0";
            $scope.Result.AccTimeSelected="";
			$scope.Result.AccSum = "";
            $scope.Result.AccRate = "";
            $scope.Result.BusTimeSelected="";
            $scope.Result.BusSum="";
            $scope.Result.BusRate="";
        };


		/*************定义贷款利率框输入字符格式**************/
        $scope.changeText = function(){
            $scope.Result.BusRate = $scope.Result.BusRate + "%";
            $("#rate").attr("type","text");
        }
        $scope.changeNumber = function(){
            $scope.Result.BusRate = $scope.Result.BusRate.replace("%","");//去掉字符串中所有'%'
            $("#rate").attr("type","number");
        }

//    	//计算
        $scope.calculate = function(){
        	$scope.resultDataArray = [{resultPeriod:"期次",resultInterest:"偿还利息",resultPrincipal:"偿还本金",resultMouthlyPayment:"月供",resultResidueMoney:"剩余还款"}];//定义最终的组合数组
        	//商业贷款金额
        	var BusTotalMoney = parseFloat($scope.Result.BusSum) * parseFloat(10000);
        	//商业贷款期限
        	var BusTimeLimit = parseFloat($scope.Result.BusTimeSelected) * parseFloat(12);
        	//商业贷款利率
        	var BusRate = parseFloat($scope.Result.BusRate.replace("%",""))/parseFloat(100);
         	//公积金贷款金额
        	var AccTotalMoney = parseFloat($scope.Result.AccSum) * parseFloat(10000);
        	//公积金贷款期限
        	var AccTimeLimit = parseFloat($scope.Result.AccTimeSelected) * parseFloat(12);
        	//公积金贷款利率
        	var AccRate = parseFloat($scope.Result.AccRate)/parseFloat(100);
        	
        	if($scope.Result.BusSum == "" || $scope.Result.BusRate == "" || $scope.Result.AccTimeSelected == ""
        		|| $scope.Result.waySelected == "" || $scope.Result.AccSum == "" || $scope.Result.AccRate == ""
        		|| $scope.Result.BusTimeSelected == ""	){
        		$scope.tipShowFlag = true;//显示提示信息
        		return;
        	}
        	
        	
        	if($scope.Result.waySelected == 1){
        		averageAccCapital(AccTotalMoney,AccTimeLimit,AccRate);
        		averageBusCapital(BusTotalMoney,BusTimeLimit,BusRate);
        	}else{
        		averageAccInterest(AccTotalMoney,AccTimeLimit,AccRate);
        		averageBusInterest(BusTotalMoney,BusTimeLimit,BusRate);
        	}
        	
        	//支付利息
        	$scope.resultInterest = (parseFloat($scope.accInterest) + parseFloat($scope.busInterest)).toFixed(2);
        	//还款总额
        	$scope.resultRental = (parseFloat($scope.accRental) + parseFloat($scope.busRental)).toFixed(2);
        	if(AccTimeLimit > BusTimeLimit){
        		for(var i = 0; i < $scope.accDataArray.length; i++){
        			var ResultObject = {resultPeriod:"",resultInterest:"",resultPrincipal:"",resultMouthlyPayment:"",resultResidueMoney:""};
        			ResultObject.resultPeriod = i+1;
        			if(i >= BusTimeLimit){
        				ResultObject.resultInterest = (parseFloat($scope.accDataArray[i].accInterest)).toFixed(2); 
        				ResultObject.resultPrincipal = (parseFloat($scope.accDataArray[i].accPrincipal)).toFixed(2); 
        				ResultObject.resultMouthlyPayment = (parseFloat($scope.accDataArray[i].accMouthlyPayment)).toFixed(2); 
        				ResultObject.resultResidueMoney = (parseFloat($scope.accDataArray[i].accResidueMoney)).toFixed(2); 
        			}else{
        				ResultObject.resultInterest = (parseFloat($scope.accDataArray[i].accInterest) + parseFloat($scope.busDataArray[i].busInterest)).toFixed(2);
        				ResultObject.resultPrincipal = (parseFloat($scope.accDataArray[i].accPrincipal) + parseFloat($scope.busDataArray[i].busPrincipal)).toFixed(2) ; 
        				ResultObject.resultMouthlyPayment = (parseFloat($scope.accDataArray[i].accMouthlyPayment) + parseFloat($scope.busDataArray[i].busMouthlyPayment)).toFixed(2) ; 
        				ResultObject.resultResidueMoney = (parseFloat($scope.accDataArray[i].accResidueMoney) + parseFloat($scope.busDataArray[i].busResidueMoney)).toFixed(2) ; 
        			}
        			$scope.resultDataArray.push(ResultObject);
        		}
        	}else if(AccTimeLimit == BusTimeLimit){
        		for(var i = 0; i < $scope.accDataArray.length; i++){
        		  var ResultObject = {resultPeriod:"",resultInterest:"",resultPrincipal:"",resultMouthlyPayment:"",resultResidueMoney:""};
        			    ResultObject.resultPeriod = i+1;
        				ResultObject.resultInterest = (parseFloat($scope.accDataArray[i].accInterest) + parseFloat($scope.busDataArray[i].busInterest)).toFixed(2);
        				ResultObject.resultPrincipal = (parseFloat($scope.accDataArray[i].accPrincipal) + parseFloat($scope.busDataArray[i].busPrincipal)).toFixed(2) ; 
        				ResultObject.resultMouthlyPayment = (parseFloat($scope.accDataArray[i].accMouthlyPayment) + parseFloat($scope.busDataArray[i].busMouthlyPayment)).toFixed(2) ; 
        				ResultObject.resultResidueMoney = (parseFloat($scope.accDataArray[i].accResidueMoney) + parseFloat($scope.busDataArray[i].busResidueMoney)).toFixed(2) ; 
        			   $scope.resultDataArray.push(ResultObject);
        		}
        	}else{
        		for(var i = 0; i < $scope.busDataArray.length; i++){
        			var ResultObject = {resultPeriod:"",resultInterest:"",resultPrincipal:"",resultMouthlyPayment:"",resultResidueMoney:""};
        			ResultObject.resultPeriod = i+1;
        			if(i >= AccTimeLimit){
        				ResultObject.resultInterest = (parseFloat($scope.busDataArray[i].busInterest)).toFixed(2); 
        				ResultObject.resultPrincipal = (parseFloat($scope.busDataArray[i].busPrincipal)).toFixed(2); 
        				ResultObject.resultMouthlyPayment = (parseFloat($scope.busDataArray[i].busMouthlyPayment)).toFixed(2); 
        				ResultObject.resultResidueMoney = (parseFloat($scope.busDataArray[i].busResidueMoney)).toFixed(2); 
        			}else{
        				ResultObject.resultInterest = (parseFloat($scope.accDataArray[i].accInterest) + parseFloat($scope.busDataArray[i].busInterest)).toFixed(2);
        				ResultObject.resultPrincipal = (parseFloat($scope.accDataArray[i].accPrincipal) + parseFloat($scope.busDataArray[i].busPrincipal)).toFixed(2) ; 
        				ResultObject.resultMouthlyPayment = (parseFloat($scope.accDataArray[i].accMouthlyPayment) + parseFloat($scope.busDataArray[i].busMouthlyPayment)).toFixed(2) ; 
        				ResultObject.resultResidueMoney = (parseFloat($scope.accDataArray[i].accResidueMoney) + parseFloat($scope.busDataArray[i].busResidueMoney)).toFixed(2) ; 
        			}
        			$scope.resultDataArray.push(ResultObject);
        		}
        	}
        	$scope.rightDetailShowFlag = true;
        }

        
        
        //*******公积金*********/等额本金/****************//
        var averageAccCapital = function(totalMoney,timeLimit,rate){
        	$scope.accDataArray = [];
        	//月利率
        	var accMonthlyRate = parseFloat(rate)/12;
        	//每月本金
        	var accMouthlyPrincipal = parseFloat(totalMoney)/parseFloat(timeLimit);
        	//支付利息
        	$scope.accInterest = ((timeLimit+1)*parseFloat(totalMoney)*parseFloat(accMonthlyRate)/2).toFixed(2);
        	//还款总额
        	$scope.accRental = ((timeLimit+1)*parseFloat(totalMoney)*parseFloat(accMonthlyRate)/2 + parseFloat(totalMoney)).toFixed(2);
        	//首月还款
        	var accFristMouthly = (accMouthlyPrincipal+parseFloat(totalMoney)*accMonthlyRate).toFixed(2);
        	//每月递减
        	var accMouthlyDecrease = (accMouthlyPrincipal*accMonthlyRate).toFixed(2);
        	var accAllPay = 0;
        	var accChangMoney = parseFloat($scope.accRental);
        	for (var i=0;i<timeLimit;i++){
        		var accPaymentDetail = {accPeriod:"",accInterest:"",accPrincipal:"",accMouthlyPayment:"",accResidueMoney:""};
        		accPaymentDetail.accPeriod = i+1;
        		accPaymentDetail.accPrincipal = accMouthlyPrincipal.toFixed(2);
        		accAllPay = (parseFloat(accAllPay) + parseFloat(accPaymentDetail.accPrincipal)).toFixed(2);
        		accPaymentDetail.accInterest = (accPaymentDetail.accPrincipal * accMonthlyRate*(timeLimit-i)).toFixed(2);
        		accPaymentDetail.accMouthlyPayment = (parseFloat(accPaymentDetail.accPrincipal) +parseFloat(accPaymentDetail.accInterest)).toFixed(2);
        		accPaymentDetail.accResidueMoney = (accChangMoney - ((parseFloat(accPaymentDetail.accPrincipal))+parseFloat(accPaymentDetail.accInterest))).toFixed(2);
        		if(accPaymentDetail.accResidueMoney<0){
        			accPaymentDetail.accResidueMoney = 0;
        		}
        		$scope.accDataArray.push(accPaymentDetail);
        		accChangMoney = parseFloat(accPaymentDetail.accResidueMoney);
        	}
        };
        
        //*******公积金*********/等额本息/****************//
        var averageAccInterest = function(totalMoney,timeLimit,rate){
        	
        	$scope.accDataArray = [];
        	//月利率
        	var accMonthlyRate = parseFloat(rate)/12;
        	//每月还款
        	var n = parseFloat(1) + parseFloat(accMonthlyRate);
        	var accMouthlyRepay = [totalMoney*accMonthlyRate*(Math.pow(n, timeLimit))]/[Math.pow(n, timeLimit) - parseFloat(1)];
        	//支付利息
        	$scope.accInterest = (accMouthlyRepay*timeLimit - totalMoney).toFixed(2);
        	//还款总额
        	$scope.accRental = (accMouthlyRepay*timeLimit).toFixed(2);
        	var accChangMoney = parseFloat($scope.accRental);
        	for(var i=0;i<timeLimit;i++){
        		var accPaymentDetail = {accPeriod:"",accInterest:"",accPrincipal:"",accMouthlyPayment:"",accResidueMoney:""};
        		accPaymentDetail.accPeriod = i+1;
        		//第i月的本金还款额
        		var accMouthly = [totalMoney*accMonthlyRate*(Math.pow(n, parseFloat(accPaymentDetail.accPeriod)-1))]/[Math.pow(n, timeLimit) - parseFloat(1)];
        		var a = totalMoney*accMonthlyRate*[Math.pow(n, timeLimit)-Math.pow(n, parseFloat(accPaymentDetail.accPeriod)-1)];
        		var b =Math.pow(n, timeLimit)-1;
        		accPaymentDetail.accPrincipal = accMouthly.toFixed(2);
        		accPaymentDetail.accInterest = (parseFloat(a)/parseFloat(b)).toFixed(2);
        		accPaymentDetail.accMouthlyPayment = (parseFloat(accPaymentDetail.accInterest)+parseFloat(accPaymentDetail.accPrincipal)).toFixed(2);
        		accPaymentDetail.accResidueMoney =  (accChangMoney - ((parseFloat(accPaymentDetail.accPrincipal))+parseFloat(accPaymentDetail.accInterest))).toFixed(2);
        		if(accPaymentDetail.accResidueMoney<0){
        			accPaymentDetail.accResidueMoney = 0;
        		}
        		$scope.accDataArray.push(accPaymentDetail);
        		accChangMoney = parseFloat(accPaymentDetail.accResidueMoney);
        	}
        }
        
        
        //*******商业*********/等额本金/****************//
        var averageBusCapital = function(totalMoney,timeLimit,rate){
        	$scope.busDataArray = [];
        	//月利率
        	var busMonthlyRate = parseFloat(rate)/12;
        	//每月本金
        	var busMouthlyPrincipal = parseFloat(totalMoney)/parseFloat(timeLimit);
        	//支付利息
        	$scope.busInterest = ((timeLimit+1)*parseFloat(totalMoney)*parseFloat(busMonthlyRate)/2).toFixed(2);
        	//还款总额
        	$scope.busRental = ((timeLimit+1)*parseFloat(totalMoney)*parseFloat(busMonthlyRate)/2 + parseFloat(totalMoney)).toFixed(2);
        	//首月还款
        	var busFristMouthly = (busMouthlyPrincipal+parseFloat(totalMoney)*busMonthlyRate).toFixed(2);
        	//每月递减
        	var busMouthlyDecrease = (busMouthlyPrincipal*busMonthlyRate).toFixed(2);
        	var busAllPay = 0;
        	var busChangMoney = parseFloat($scope.busRental);
        	for (var i=0;i<timeLimit;i++){
        		var busPaymentDetail = {busPeriod:"",busInterest:"",busPrincipal:"",busMouthlyPayment:"",busResidueMoney:""};
        		//还款期次
				busPaymentDetail.busPeriod = i+1;
        		//还本金
				busPaymentDetail.busPrincipal = busMouthlyPrincipal.toFixed(2);

        		busAllPay = (parseFloat(busAllPay) + parseFloat(busPaymentDetail.busPrincipal)).toFixed(2);
        		//还利息
				busPaymentDetail.busInterest = (busPaymentDetail.busPrincipal * busMonthlyRate*(timeLimit-i)).toFixed(2);
        		//剩余还款
				busPaymentDetail.busResidueMoney = (busChangMoney - ((parseFloat(busPaymentDetail.busPrincipal))+parseFloat(busPaymentDetail.busInterest))).toFixed(2);
        		if(busPaymentDetail.busResidueMoney<0){
        			busPaymentDetail.busResidueMoney = 0;
        		}
				if(i+1 == timeLimit && busPaymentDetail.busResidueMoney > 0){
					busPaymentDetail.interest = (parseFloat(busPaymentDetail.busInterest)+parseFloat(busPaymentDetail.busResidueMoney)).toFixed(2) ;
					busPaymentDetail.busMouthlyPayment = (parseFloat(busPaymentDetail.busPrincipal) +parseFloat(busPaymentDetail.busInterest)).toFixed(2);
					busPaymentDetail.busResidueMoney = 0 ;
				}else{
					busPaymentDetail.busMouthlyPayment = (parseFloat(busPaymentDetail.busPrincipal) +parseFloat(busPaymentDetail.busInterest)).toFixed(2);
				}
        		$scope.busDataArray.push(busPaymentDetail);
        		busChangMoney = parseFloat(busPaymentDetail.busResidueMoney);
        	}
        	
        };
        
        //*********商业*******/等额本息/****************//
        var averageBusInterest = function(totalMoney,timeLimit,rate){
        	$scope.busDataArray = [];
        	//月利率
        	var busMonthlyRate = parseFloat(rate)/12;
        	//每月还款
        	var n = parseFloat(1) + parseFloat(busMonthlyRate);
        	var busMouthlyRepay = [totalMoney*busMonthlyRate*(Math.pow(n, timeLimit))]/[Math.pow(n, timeLimit) - parseFloat(1)];
        	//支付利息
        	$scope.busInterest = (busMouthlyRepay*timeLimit - totalMoney).toFixed(2);
        	//还款总额
        	$scope.busRental = (busMouthlyRepay*timeLimit).toFixed(2);
        	var busChangMoney = parseFloat($scope.busRental);
        	for(var i=0;i<timeLimit;i++){
        		var busPaymentDetail = {busPeriod:"",busInterest:"",busPrincipal:"",busMouthlyPayment:"",busResidueMoney:""};
        		busPaymentDetail.busPeriod = i+1;
        		//第i月的本金还款额
        		var busMouthly = [totalMoney*busMonthlyRate*(Math.pow(n, parseFloat(busPaymentDetail.busPeriod)-1))]/[Math.pow(n, timeLimit) - parseFloat(1)];
        		var a = totalMoney*busMonthlyRate*[Math.pow(n, timeLimit)-Math.pow(n, parseFloat(busPaymentDetail.busPeriod)-1)];
        		var b =Math.pow(n, timeLimit)-1;
        		busPaymentDetail.busPrincipal = (parseFloat(busMouthly)).toFixed(2);
        		busPaymentDetail.busInterest = (parseFloat(a)/parseFloat(b)).toFixed(2);
        		busPaymentDetail.busMouthlyPayment = (parseFloat(busPaymentDetail.busInterest)+parseFloat(busPaymentDetail.busPrincipal)).toFixed(2);
        		busPaymentDetail.busResidueMoney =  (busChangMoney - ((parseFloat(busPaymentDetail.busPrincipal))+parseFloat(busPaymentDetail.busInterest))).toFixed(2);
        		if(busPaymentDetail.busResidueMoney<0){
        			busPaymentDetail.busResidueMoney = 0;
        		}
        		$scope.busDataArray.push(busPaymentDetail);
        		busChangMoney = parseFloat(busPaymentDetail.busResidueMoney);
        	}
        }
        
        basePage.init($scope);
    })

