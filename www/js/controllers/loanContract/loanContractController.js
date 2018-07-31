/**
 * Created by yli18 on 2017年9月23日
 */
angular
    .module('com.amarsoft.mobile.controllers.loanCc.load', [])
    //****************主菜单-start***************//
	.controller('loanContractController',function ($scope,$state) {
		$scope.contractRegistration = function(){
        	$state.go("loanContractList");
    	}
		$scope.applyContract = function(){
			$state.go("applyContractList");
		}
		$scope.amountForce = function(){
			$state.go("amountForceList");
		}
		$scope.applyLoan = function(){
			$state.go("applyLoanList");
		}
	})