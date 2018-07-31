/**
 * 校验文件
 */
//空值校验
function  IsNotNull(data){
	if(data == ''|| angular.equals({},data)){
		return false;
	}
	return true;
}
// 用户名合法校验
function UserNameValid($ionicPopup,userName){
	if(!/^[a-zA-Z][\w]{3,19}$/i.test(userName)) {
		$ionicPopup.alert({title: '填写错误',template: '用户名须以字母开头，由4-20位字符组成，可包含字母、数字和“_”'});
		return false;
	}
	return true;
}
// 密码合法校验
function PwdValid($ionicPopup,pwd){
	if (!/^(?!\d+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/i.test(pwd)){
		$ionicPopup.alert({title: '填写错误',template: '密码格式错误：长度6-20个字符，必须包含字母和数字'});
		return false;
	}
	return true;
}
// 交易密码合法校验
function TransPwdValid($ionicPopup,transPwd){
	if (!/^\d{6}$/i.test(transPwd)){
		$ionicPopup.alert({title: '填写错误',template: '请输入正确格式的交易密码，长度6，数字'});
		return false;
	}
	return true;
}
// 手机号合法校验
function MobileValid($ionicPopup,mobile){
	if (!/^(13|14|15|16|17|18|19)\d{9}$/i.test(mobile)){
		$ionicPopup.alert({title: '填写错误',template: '请输入正确的手机号码'});
		return false;
	}
	return true;
}

//手机号合法校验:无弹出框
function MobileValidNoPopup(mobile){
	if (!/^(13|14|15|16|17|18|19)\d{9}$/i.test(mobile)){
		//$ionicPopup.alert({title: '填写错误',template: '请输入正确的手机号码'});
		return false;
	}
	return true;
}
//推荐人手机号合法校验
function InviteMobileValid($ionicPopup,InviteMobile){
	if (!/^(13|14|15|16|17|18|19)\d{9}$/i.test(InviteMobile)){
		$ionicPopup.alert({title: '填写错误',template: '请输入正确的推荐人手机号码'});
		return false;
	}
	return true;
}
function CheckPhoneCode(PhoneCode)
{
	var str = PhoneCode;
	str = str.trim();
	if (str.length > 0)
	{
		var patrn=/^([0-9]{1,3}-)?([0-9]{2,4}-)?[0-9]{7,11}(-[0-9]{1,5})?$/;//匹配电话号码及手机号码
		if (patrn.exec(str))
		{ 	
			return true;
		}	
	}
	return false;
}
// 客服邀请码校验
function InviteCodeValid($ionicPopup,InviteCode){
	if (!/^\d{3}$/i.test(InviteCode)){
		$ionicPopup.alert({title: '填写错误',template: '请输入正确的客服邀请码'});
		return false;
	}
	return true;
}
//短信验证码合法校验
function MsgCodeVadlid($ionicPopup,Code){
	if (!/^\d{6}$/i.test(InviteCode)){
		$ionicPopup.alert({title: '填写错误',template: '请输入正确的短信验证码'});
		return false;
	}
	return true;
}
// 校验身份证号
function IdentityCodeValid(code) { 
    var city={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外 "};
    var tip = "";
    var pass= true;
    if(!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)){
        tip = "身份证号格式错误";
        pass = false;
    }
    
   else if(!city[code.substr(0,2)]){
        tip = "地址编码错误";
        pass = false;
    }
    else{
        //18位身份证需要验证最后一位校验位
        if(code.length == 18){
            code = code.split('');
            //∑(ai×Wi)(mod 11)
            //加权因子
            var factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
            //校验位
            var parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];
            var sum = 0;
            var ai = 0;
            var wi = 0;
            for (var i = 0; i < 17; i++)
            {
                ai = code[i];
                wi = factor[i];
                sum += ai * wi;
            }
            var last = parity[sum % 11];
            if(parity[sum % 11] != code[17]){
                tip = "校验位错误";
                pass =false;
            }
        }
    }
    //if(!pass) alert(tip);
    return pass;
}
//贷款卡卡号的正确性检验程序
function CheckLoanCardID(loanCardCode) 
{
	var financecode = new Array();
	for (i=0;i<loanCardCode.length;i++)
	{
	 	financecode[i]= loanCardCode.charCodeAt(i);
	}
	var weightValue = new Array(14);
	var checkValue = new Array(14);
	totalValue = 0;
	c = 0;
	weightValue[0] = 1;
	weightValue[1] = 3;
	weightValue[2] = 5;
	weightValue[3] = 7;
	weightValue[4] = 11;
	weightValue[5] = 2;
	weightValue[6] = 13;
	weightValue[7] = 1;
	weightValue[8] = 1;
	weightValue[9] = 17;
	weightValue[10] = 19;
	weightValue[11] = 97;
	weightValue[12] = 23;
	weightValue[13] = 29;
	for ( j = 0; j < 14; j++) 
	{
		if (financecode[j] >= 65 && financecode[j] <= 90) 
		{
			checkValue[j] = (financecode[j] - 65) + 10;
		} else if (financecode[j] >= 48 && financecode[j] <= 57) 
		{
			checkValue[j] = financecode[j] - 48;
		} else 
		{
			return false;
		}
		totalValue += weightValue[j] * checkValue[j];
	}
	c = 1 + totalValue % 97;
	val = (financecode[14] - 48) * 10 + (financecode[15] - 48);
	return val == c;
}
//身份证校验
function CheckLisince(ID)
{    	
	var checkedValue = ID;		
	checkedValue = checkedValue.trim();
	if (checkedValue.length != 15 && checkedValue.length != 18)
		return false;
	var dateValue;
	if (checkedValue.length == 15)
		dateValue = "19" + checkedValue.substring(6, 12);		
	else
		dateValue = checkedValue.substring(6, 14);
	if (!checkDate(dateValue))
		return false;
	if (checkedValue.length == 18)		    
		return checkPersonId(checkedValue);
	return true;   
}
//身份正性别与选择性别 一致性校验
function IdentityCodeSexValid($ionicPopup,Code,Sex){
	if(Code.length ==15){
		var temp = parseInt(Code.substring(14));
		if(temp%2 == 0){//奇男偶女
			if(Sex == 1){
				$ionicPopup.alert({title: '填写错误',template: '性别与身份证上的性别不符，请重新选择'});  
				return false;
			}
		}else{
			if(Sex == 2){
				$ionicPopup.alert({title: '填写错误',template: '性别与身份证上的性别不符，请重新选择'});  
				return false;
			}
		}
	}
	if(Code.length ==18){
		var temp = parseInt(Code.substring(16,17));
		if(temp%2 == 0){//奇男偶女
			if(Sex == 1){
				$ionicPopup.alert({title: '填写错误',template: '性别与身份证上的性别不符，请重新选择'});  
				return false;
			}
		}else{
			if(Sex == 2){
				$ionicPopup.alert({title: '填写错误',template: '性别与身份证上的性别不符，请重新选择'});  
				return false;
			}
		}
	}
	return true;
}
//金额校验
function BusinessSumVaild(data){
	if(!/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(data)){
		return false
	}
	return true;
}

//设置页面校验项
function setCheckObj(arr,keyId,myMsg,flag){
	for(var obj in arr){
		//alert(obj.KeyId);
		if(arr[obj].KeyId === keyId){
			arr[obj].selfcheck = flag;
			arr[obj].msg = myMsg;
		}
	}
}


//判断页面校验是否通过
function isCheckSuccess(arr){
	for(var obj in arr){
		//alert(obj.KeyId);
		if(arr[obj].selfcheck){
			return false;
		}
	}
	return true;
}
//校验住宅电话只判断是否为数字
function checkPhoneIsNum(str){
	var reg = /^[0-9]+.?[0-9]*$/;
    if(reg.test(str)){
    	return true;
    }
    return false;
}

function CheckPhone78(PhoneCode){
	 var sPhone = PhoneCode;
	 reg = /^(\d{7,8})$/;
	 if(reg.test(sPhone)){ 
	  	return true;
	 }else{
	  	return false;
	 }
}
/**
 * 检查输入的固定电话号码是否正确
 * 输入:str  字符串 
 */
function checkTelephone(str){
    if (str.match(/^(0\d{2,3}-\d{7}|0\d{2,3}-\d{8})$/) == null) {
        return false;
    }else{  
        return true;
    }
}


function CheckPhoneLen(PhoneCode) {
	 var sPhone = PhoneCode;
	 reg = /^(0\d{2,3}\d{8}|0\d{3}\d{7}|1\d{10})$/;
	 if(reg.test(sPhone)){ 
	  	return false;
	 }else{
	  	return true;
	 }
} 
//返回详情页中得某一个对象
function findTheItem(data,key) {
	for(var i in data){
		var dataTemp = data[i].groupColArray;
		for(var j in dataTemp){
			var result = dataTemp[j];
			if(key==result.KeyId){
				if(result.Hide){
					return false;//隐藏就不显示
				}
			}
		}
	}
return true;	
} 
//加载贷后调查报告
function viewHtmlService($scope,data,$cordovaFileTransfer,$timeout,$sce){
	//调查报告
	$scope.Reportflag = false;
	var StringTemp = data.ReportDesc;
	if(StringTemp == "NOTEXIST"){//判断是否生成报告
		$scope.Reportflag = true;
	}
	//$('#ReportData').html("");
	var StringTemp = data.ReportData;
    var urlTemp = AmApp.config.ServiceRealRootPath + "/AttachView?FullPath=" + StringTemp;
    var targetPath = cordova.file.cacheDirectory +new Date().getTime() + ".html";
    var trustHosts = true;
    var options = {};
    $cordovaFileTransfer.download(urlTemp, targetPath, options, trustHosts)
    .then(function (result) {
          appIonicLoading.hide();
          // Success!
          $timeout(function () {
                   $scope.paySrc = $sce.trustAsResourceUrl(result.nativeURL);
                   var html = document.getElementById("setHtml");
                   if(html != undefined && html != null){
                       if(StringTemp != ""){
                          setTimeout(function(){
                              var div = html.contentDocument.getElementById("div1");
                              if(div != undefined && div != null){
                                  div.style.display = "none";
                              }
                          },50);
                       }
                   }
             }, 100);
          }, function (err) {
          // Error
          appIonicLoading.show({template: '加载失败！code：' + err.code, duration: 2000});
          }, function (progress) {
          $timeout(function () {
                   $scope.downloadImageProgress = (progress.loaded / progress.total) * 100;
                   }, 500);
          });
}