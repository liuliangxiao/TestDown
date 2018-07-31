/**
 * Created by laker on 2016/12/7.
 */
angular
.module('com.amarsoft.mobile.controllers.iPad_setting', [])
.controller('setAccountForiPadController', function ($scope, $http, $ionicLoading, $ionicPopup, $state, basePage, $rootScope) {
            
            //记录设置界面最后点击的选项，首次进入设置，进入关于界面。
            if ($rootScope.lastSettingIndex == '' || $rootScope.lastSettingIndex == null || $rootScope.lastSettingIndex == undefined) {
           $state.go('aboutForiPad');
            } else {
           $state.go($rootScope.lastSettingIndex);
            }
    
            basePage.init($scope);
            })

.controller('feedbackForiPadController', function ($scope, $http, $ionicLoading, $ionicPopup, $state, basePage) {
            /* 意见 */
            $scope.opinion = {
            signOpinion: ""
            };
            
            $scope.submit = function () {
            if ($scope.opinion.signOpinion == '') {
            $ionicLoading.show({
                               template: "请填写您的意见！",
                               duration: 2000
                               });
            return false;
            }
            
            $scope.params = {
            opinion: $scope.opinion.signOpinion
            };
            
            runServiceWithSession($http, $ionicLoading,
                                  $ionicPopup, $state, "feedback", $scope.params,
                                  function (data, status) {
                                  $scope.result = data["array"][0];
                                  if ($scope.result.ReturnFlag == "true") {
                                  $ionicLoading.show({
                                                     template: "意见提交成功，感谢您的宝贵意见！",
                                                     duration: 2000
                                                     });
                                  $scope.opinion.signOpinion = '';
                                  } else {
                                  $ionicLoading.show({
                                                     template: "意见提交失败！",
                                                     duration: 2000
                                                     });
                                  }
                                  });
            };
            
            basePage.init($scope);
            })
.controller('XGpasswordForiPadController', function ($scope, $http, $ionicLoading, $ionicPopup, $state, basePage) {
            var loadData = function ($ionicLoading) {
            $scope.pwd = {
            oldPassword: "",
            newPassword1: "",
            newPassword2: ""
            };
            };
            $scope.confirm = function () {
            if ($scope.pwd.oldPassword == ''
                || $scope.pwd.newPassword1 == ''
                || $scope.pwd.newPassword2 == '') {
            $ionicLoading.show({
                               template: "请输入密码！",
                               duration: 2000
                               });
            return false;
            } else if ($scope.pwd.oldPassword == $scope.pwd.newPassword1) {
            $ionicLoading.show({
                               template: "请勿使用旧密码作为新密码！",
                               duration: 2000
                               });
            
            return false;
            } else if ($scope.pwd.newPassword1 != $scope.pwd.newPassword2) {
            $ionicLoading.show({
                               template: "两次输入的密码不一致！",
                               duration: 2000
                               });
            
            return false;
            }
            runServiceWithSession($http, $ionicLoading,
                                  $ionicPopup, $state, 'XGpassword', {
                                  OldPwd: $scope.pwd.oldPassword,
                                  NewPwd: $scope.pwd.newPassword1
                                  }, function (data, status) {
                                  $scope.result = data["array"][0];
                                  if ($scope.result.ReturnFlag == "SUCCEEDED") {
                                  $ionicLoading.show({
                                                     template: "密码修改成功！",
                                                     duration: 1500
                                                     });
                                  $scope.pwd = {
                                  oldPassword: "",
                                  newPassword1: "",
                                  newPassword2: ""
                                  };
                                  } else {
                                  $ionicLoading.show({
                                                     template: $scope.result.ReturnFlag,
                                                     duration: 2000
                                                     });
                                  }
                                  });
            };
            
            basePage.init($scope, loadData);
            })
.controller('aboutForiPadController', function ($scope, $http, $ionicLoading, $ionicPopup, $state, basePage, $rootScope) {
            $scope.version = {
            Version: AmApp.config.Version,
            Platform: AmApp.config.DeviceType
            };
            $scope.renovate = function () {
            // //TODO ,待完善，当期版本直接提示已是最新版本
            // $ionicLoading.show({
            // 	template : "当前版本已是最新版本！",
            // 	duration : 1000
            // });
            // return;
            //----start----版本请求
            runService(
                       $http,
                       $ionicLoading,
                       "getversion",
                       $scope.version,
                       function (data, status) {
                       $scope.result = data["array"][0];
                       if ($scope.result.ReturnFlag == "Y") {
                       // 有新版本
                       var confirmPopup = $ionicPopup
                       .confirm({
                                title: '<strong>有新版本</strong>',
                                template: '是否更新？',
                                okText: '确定',
                                cancelText: '取消'
                                });
                       confirmPopup.then(function (res) {
                                         if (res) {
                                         if (ionic.Platform.isAndroid()) {
                                         /**************************打包放开 start*******************************/
                                         //															var arr = [$scope.result.Url,'AFCC.apk']
                                         //															window.download(arr, function(msg) {
                                         //															  }, function(err) {});
                                         /**********************打包放开  end***************************/
                                         }
                                         else if (ionic.Platform.isIOS()) {
                                         /**************************打包放开 start*******************************/
                                         //															window.operUrl([$scope.result.Url],function(){},function(){});
                                         /**********************打包放开  end***************************/
                                         }
                                         else {
                                         window.open($scope.result.Url);
                                         }
                                         
                                         }
                                         else {
                                         
                                         }
                                         });
                       } else {
                       $ionicLoading.show({
                                          template: "当前版本已是最新版本！",
                                          duration: 2000
                                          });
                       }
                       });
            // ----end----
            };
            
            $scope.explain = function () {
           $state.go('explainForiPad');
            
            };
            
            basePage.init($scope);
            })
.controller('GestureForiPadController', function ($scope, $http, $ionicLoading, $ionicPopup, $state, basePage,$timeout) {
            $scope.gesture = {click:false,isShow:false};
           
            var loadData = function () {
            window.getGestureStatus([AmApp.userID], function (msg) {
                                    if (msg == 'set') {
                                    
                                    $timeout(function() {
                                               $scope.$apply(function() {
                                                             //wrapped this within $apply
                                                            $scope.gesture = {click: true, isShow: true};
                                                             });
                                               }, 1);
                                    
                                    
                                    
                                                                      }
                                    if (msg == 'unset') {
                                    
                                    $timeout(function() {
                                             $scope.$apply(function() {
                                                           //wrapped this within $apply
                                                           $scope.gesture = {click: false, isShow: false};
                                                           });
                                             }, 1);
                                    
                                                                       }
                                    })
            }
            $scope.gotoChange = function () {
            window.changeGesture([AmApp.userID], function (msg) {
                                 
                                 }, function (err) {
                                 
                                 });
            };
            
            $scope.clickchange = function(click){
            if (click) {
            window.setGesture([AmApp.userID], function (msg) {
                              if (msg=='fail') {
                                                          // $state.go('gesture');
                              loadData();

                              
                              }else{
                              
                              loadData();
                              // $state.go('gesture');
                                                          }
                              }, function (err) {
                              
                              })
            
            }
            else {
            
            //清除密码
            window.cleanGesture([AmApp.userID], function (msg) {
                                if (msg == 'success') {
                                                               loadData();
                                }
                                }, function (err) {
                                
                                })
            // window.cleanCache(storage["UserName"]);
            //
            // $scope.gesture.isShow = false;
            }
            };
            basePage.init($scope,loadData);
            })
.controller('explainForiPadController', function ($scope, $http, $ionicLoading, $ionicPopup, $state, basePage) {
            
            
            basePage.init($scope);
            })
.controller('settingController', function ($scope, $http, $ionicLoading, $ionicPopup, $state, basePage, $rootScope) {
            $scope.gotoXGpassword = function () {
           $state.go('XGpasswordForiPad');
            $rootScope.lastSettingIndex = 'XGpasswordForiPad';
            };
            
            $scope.gotoGesture = function () {
           $state.go('GestureForiPad');
            $rootScope.lastSettingIndex = 'GestureForiPad';
            };
            
            $scope.gotoFeedback = function () {
           $state.go('feedbackForiPad');
            $rootScope.lastSettingIndex = 'feedbackForiPad';
            };
            
            $scope.gotoAbout = function () {
           $state.go('aboutForiPad');
            $rootScope.lastSettingIndex = 'aboutForiPad';
            };
            
            basePage.init($scope);
            })


