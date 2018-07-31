/**
 * Created by xfjin on 16/10/9.
 */

//拍摄图片数量
var imageNo = 3;

var appscope;

var MaxNo=3000;
var durationTime = 60;

angular.module('com.amarsoft.mobile.controllers.screenage', [])

	.controller('IndexController', function ($scope, paging, $http, $ionicPopup, $state, $ionicLoading,$ionicScrollDelegate) {

		$scope.tab = {};
		//客户列表
		$scope.items = [];
		$scope.loadNum = 0;
		//防止tab快速重复点击
		$scope.tabClickable=true;

		$scope.ScreenageType = '01';

		var iPageSize = 10;//分页相关
		var loadData = function($ionicLoading) {
			runServiceWithSession($http, undefined, $ionicPopup, $state,
				$scope.method, {
					pageSize : iPageSize,
					pageNo : $scope.pageNo,
					ScreenageType: $scope.ScreenageType
				}, function(data, status) {
					for(var k = 0; k < data["array"].length; k++){
						$scope.items.push(data["array"][k]);
					}

					//给一个标记数字，在第一次进入tab时，在loadData中刷新一次采集要素
					if($scope.loadNum === 0){
						$scope.loadNum++;
						if($scope.items[0]){
							$scope.selectCustomer(0,$scope.items[0]);
						}
					}

					$scope.tabClickable=true;
					$scope.screenageMenuShowFlag=false;

					//分页相关
					$scope.hasMore = (($scope.pageNo - 1) * iPageSize
					+ data["array"].length < data.totalCount);
					$scope.loadingMore = false;
					if ($scope.items.length) {
						$scope.noData = false;
					} else {
						$scope.noData = true;
						appIonicLoading.hide();
					}
					$scope.$broadcast('scroll.refreshComplete');//刷新完成
					$scope.$broadcast('scroll.infiniteScrollComplete');//加载完成
				});
		};

		$scope.selectTab = function (index) {
			appIonicLoading.show({template: '加载中...', duration: 30000});
			$ionicScrollDelegate.scrollTop();
				$scope.tabClickable=false;
				$scope.loadNum = 0;
				$scope.tab.index = index;
				$scope.items=[];
				//点击 tab,控制右边区域的显示隐藏
				$scope.screenageMenuShowFlag=true;
				if(index === 0){
					$scope.tab0 = true;
					$scope.tab1 = false;
					$scope.tab2 = false;
					$scope.method = 'preCustomerList';
					$scope.ScreenageType = '01';
				}else if(index === 1){
					$scope.tab0 = false;
					$scope.tab1 = true;
					$scope.tab2 = false;
					$scope.method = 'preCustomerList';
					$scope.ScreenageType = '02';
				}else if(index === 2){
					$scope.tab0 = false;
					$scope.tab1 = false;
					$scope.tab2 = true;
					$scope.method = 'preCustomerList';
					$scope.ScreenageType = '03';
				}

				$scope.refresh();

		};


		//选择客户的采集要素，默认选择第一位客户的采集要素
		$scope.selectCustomer = function (i, item) {
			appIonicLoading.show({template: '加载中...', duration: 30000});
			if(item === undefined){
				item = $scope.items[0];
			}
			$scope.selectedRow = i;
			$scope.showpage = false;

			//选中客户时给CustomerId赋值
			$scope.CustomerId = item.CustomerID;

			var params = {};
			params.Index = $scope.tab.index;
			if(item.CustomerType){
				params.CustomerType = item.CustomerType;
			}else{
				params.CustomerType = '';
			}

			if(item.NewCustomerType){
				params.NewCustomerType = item.NewCustomerType;
			}else{
				params.NewCustomerType = '';
			}

			params.ScreenageType = $scope.ScreenageType;

			//获取采集要素
			runServiceWithSession($http, undefined, $ionicPopup, $state, 'getScreenageItems', params, function (data) {
				$scope.ItemList = [];
				var Item = {"parentName":"现场采集要素","children":[]};
				$scope.ItemList.push(Item)
				for(var i=0;i<data.array.length;i++){
					if(data.array[i].ItemNo.length==4){
						var Item = {"parentName":"","children":[]};
						Item.parentName=data.array[i].ItemName;


						$scope.ItemList.push(Item)
					}else{

						Item.children.push(data.array[i]);
					}
				}

				for(var i=0;i<$scope.ItemList.length;i++){
					if($scope.ItemList[i].children.length==0){
						$scope.ItemList.splice(i,1);
					}
				}
				appIonicLoading.hide();
			});

			// $scope.showOrNot=function (item) {
			// 	item.showGroup=!item.showGroup;
            //
			// }

			$scope.showOrNot = function (item) {
				if (item.showGroup) {
					item.showGroup = false;
					setTimeout(function () {
						$scope.$apply(function () {
							$ionicScrollDelegate.$getByHandle("smallScroll").scrollBy(0, 10, true);
						});
					}, 50);

				} else {
					item.showGroup = true;
				}
			};


		};

		//初始化页面数据
		paging.init($scope, iPageSize, 1, loadData,true);

		//刚进入页面默认选择贷前调查tab0
		$scope.selectTab(0);

		//显示信息采集页面
		$scope.showpage = false;

		//跳转到信息采集页面
		$scope.goToTakePicture = function (item) {
			$scope.showpage = true;
			item.tabIndex = $scope.tab.index;
			item.CustomerId = $scope.CustomerId;

			//广播名称中加入索引，避免在切换tab时重复发送广播
			$scope.$broadcast('to-takePicture', item);
		};

		//接受返回
		$scope.$on('change-showpage', function (event, data) {
			$scope.showpage = data.showpage;
		});

	})

	//贷前调查-资料上传
	.controller('PrePhotoTakingController', function ($scope, basePage, $stateParams, $http, $ionicLoading, $window,
													  $ionicPopup, $state, $ionicModal, $timeout, $cordovaFileTransfer,
													  $cordovaCapture, $cordovaGeolocation, $ionicActionSheet) {

		$scope.$on('to-takePicture',function (event, data) {
			$scope.images = [];  //用于展示图片
			$scope.videos = [];  //用于展示视频
			$scope.radios = [];  //用于展示视频
			// $scope.radios = [{"SerialNo":"2016121000000002","Describe":"","Longitude":"","Latitude":"","Address":"","FileType":"02","FileName":"\/Volumes\/H\/fileupload\/2016090200000001010101\/1481350801516.wav"}];  //用于展示音频

			$scope.cancel_mode = false;
			$scope.imgSelected = false;
			$scope.imageData = []; //保存加载的图片信息
			$scope.radiosData = []; //保存加载的音频信息
			$scope.videosData = []; //保存加载的视频信息

			$scope.screenageTitle = data.ItemName;
			$scope.params = data;
			$scope.info.CustomerID = data.CustomerId;
			$scope.info.ItemNo = data.ItemNo;
			$scope.getAddress();

			$scope.info.Describe = '';
			$scope.getInfo();

		});
		$scope.toBack = function () {
			$scope.$emit('change-showpage', {showpage: false});
		};

		appscope = $scope;

		//初始化基础页面
		basePage.init($scope);



		//接受传入参数，并设置为title名称
		// $scope.title = $stateParams.ItemName;

		/*存储图片、音频和视频文件名等信息，用于传入后台服务的参数,
		 Image，Radio，Video是由各自的文件名拼接而成，用英文逗号隔开；
		 */
		$scope.info = {Image: '', Radio: '', Video: ''};

		//接受传入的参数，客户id，项号
		// $scope.info.CustomerID = $stateParams.CustomerID;
		// $scope.info.ItemNo = $stateParams.ItemNo;

		/*拍摄图片的数组
		 name: 文件名
		 fullPath：文件全路径
		 isNew：true/false 是否是新拍摄的
		 */


		$scope.isShow = {show: false};  //是否显示拍摄的图片
		$scope.index;  //查看大图时使用
		$scope.imageNo = MaxNo;  //赋值最多拍摄图片数量


		/*增加资料的点击事件*/
		$scope.addDate = function () {
			$ionicActionSheet.show({
				buttons: [
					{text: '图片'},
					{text: '视频'},
					{text: '音频'}
				],
				titleText: '点击您想添加的资料',
				cancelText: '取消',
				cancel: function () {
					// add cancel code..
				},
				buttonClicked: function (index) {
					if (index === 0) {//增加图片
						if ($scope.images.length >= MaxNo || $scope.imageData.length >= MaxNo) {
							appIonicLoading.show({template: '最多只能拍摄' + MaxNo + '张图片！', duration: 2000});
						} else {
							$scope.takePhoto();
						}

					} else if (index === 1) {//增加视频
						if ($scope.videos.length >= MaxNo || $scope.videosData.length >= MaxNo) {
							appIonicLoading.show({template: '最多只能拍摄' + MaxNo + '个视频！', duration: 2000});
						} else {
							$scope.takeVideo();
						}

					} else {//增加音频
						if ($scope.radios.length >= MaxNo || $scope.radiosData.length >= MaxNo) {
							appIonicLoading.show({template: '最多只能录制' + MaxNo + '个音频！', duration: 2000});
						} else {
							$scope.takeRadio();
						}

					}
					return true;
				}
			});
		};


		/*地图定位，获取地址，经纬度
		 $scope.info.Longitude：经度
		 $scope.info.Latitude： 维度
		 $scope.info.Address： 地址
		 */

		/*
		 timeout: 允许定位的最大时间；
		 enableHighAccuracy: 是否提示该应用程序需要一个可能的最好结果；
		 */

		//获取定位信息
		$scope.getAddress=function () {
			var posOptions = {timeout: 1000, enableHighAccuracy: false};
			if (ionic.Platform.isAndroid()) {
				window.getCurrentLocation([],function (msg) {
                  var obj = eval("("+msg+")");
                    $scope.info.Address = obj.Address;
                    $scope.$digest();
                }, function (err) {
                })
			} else {
				$cordovaGeolocation.getCurrentPosition(posOptions)
					.then(function (position) {
						var onSuccess = function (position) {
							//经度
							$scope.info.Longitude = position.coords.longitude;
							//纬度
							$scope.info.Latitude = position.coords.latitude;


							//调用百度定位插件的功能
							var myGeo = new BMap.Geocoder();
							// 根据坐标得到地址描述
							myGeo.getLocation(new BMap.Point(position.coords.longitude, position.coords.latitude), function (result) {
								if (result) {
									$timeout(function () {
										$scope.info.Address = result.address;
									}, 500);
								}
							});
						};

						function onError(error) {
							appIonicLoading.show({
								template: 'code: ' + error.code + '\n' + 'message: ' + error.message + '\n',
								duration: 2000
							});
						}

						navigator.geolocation.getCurrentPosition(onSuccess, onError);

					});
			}

		}



		/*编辑文件，可以选择删除

		 */

		$scope.selectImg = function () {
			$scope.cancel_mode = !$scope.cancel_mode;
			if ($scope.cancel_mode) {
				//显示取消按钮时
				$scope.imgSelected = true;//显示选择图片的按钮,进行批量删除
			} else {
				//显示选择按钮时
				$scope.imgSelected = false;//隐藏批量删除选择按钮
				for (var v = 0; v < $scope.images.length; v++) {
					if ($scope.images[v].isSelected) {
						$scope.images[v].isSelected = false;
					}
				}

				for (var v = 0; v < $scope.radios.length; v++) {
					if ($scope.radios[v].isSelected) {
						$scope.radios[v].isSelected = false;
					}
				}

				for (var v = 0; v < $scope.videos.length; v++) {
					if ($scope.videos[v].isSelected) {
						$scope.videos[v].isSelected = false;
					}
				}
			}
		};

		$scope.hasSelect = function (i, image) {


			// image.show = !image.show;
			image.isSelected = !image.isSelected;
		};


		// document.addEventListener("deviceready", function () {

		//拍照
		$scope.takePhoto = function () {

			//拍照参数
			var options = {
				quality: 50,
				// destinationType: Camera.DestinationType.FILE_URI,
				// sourceType: Camera.PictureSourceType.CAMERA,
				allowEdit: false,
				// encodingType: Camera.EncodingType.JPEG,
				targetWidth: 1000,
				targetHeight: 1000,
				//popoverOptions: CameraPopoverOptions,
				saveToPhotoAlbum: false
				//correctOrientation:true
			};

			//调用拍照插件
			$cordovaCapture.captureImage(options).then(function (imageData) {

				// 拍摄成功，处理图片数据
				for (var i = 0; i < imageData.length; i++) {

					//保存图片信息
					var image = {};
					//获取拍摄图片的全路径信息
					image.src = imageData[i].fullPath;

					//以时间毫秒重命名文件
					var date = new Date();
					image.name = date.getTime() + '.' + imageData[i].name.split('.').pop();

					//文件类型 01 = 图片
					image.FileType = '01';

					//设置新增属性isNew
					image.isNew = true;

					image.isSelected = false;

					//将拍摄的图片放入数组中
					$scope.images.push(image);

				}
			}, function (err) {
				// 拍摄失败
			});
		};


		//========  拍摄视频  ====================

		$scope.takeVideo = function () {
			//limit每次拍一个，duration拍摄时间
			var options = {limit: 1, duration: durationTime};

			$cordovaCapture.captureVideo(options).then(function (videoData) {
				// Success! Video data is here
				var i, path, len;
				//遍历获取录制的文件（iOS只支持一次录制一个视频或音频）
				for (i = 0, len = videoData.length; i < len; i++) {
					//保存视频信息
					var video = {};
					//获取拍摄图片的全路径信息
					video.src = videoData[i].fullPath;

					//以时间毫秒重命名文件
					var date = new Date();
					video.name = date.getTime() + '.' + videoData[i].name.split('.').pop();

					//文件类型 03 = 视频
					video.FileType = '03';

					//设置新增属性isNew
					video.isNew = true;

					video.isSelected = false;

					//将拍摄的图片放入数组中
					$scope.videos.push(video);

				}
			}, function (err) {
				// An error occurred. Show a message to the user
			});
		};


		// 录制音频

		$scope.takeRadio = function () {

			var options = {limit: 1, duration: durationTime};

			$cordovaCapture.captureAudio(options).then(function (audioData) {
				// Success! Video data is here
				var i, path, len;
				//遍历获取录制的文件（iOS只支持一次录制一个视频或音频）
				for (i = 0, len = audioData.length; i < len; i++) {
					//保存视频信息
					var radio = {};
					//获取拍摄图片的全路径信息
					radio.src = audioData[i].fullPath;

					//以时间毫秒重命名文件
					var date = new Date();
					radio.name = date.getTime() + '.' + audioData[i].name.split('.').pop();

					//文件类型 02 = 音频
					radio.FileType = '02';

					//设置新增属性isNew
					radio.isNew = true;

					radio.isSelected = false;
					//将拍摄的图片放入数组中
					$scope.radios.push(radio);

				}
			}, function (err) {
				// An error occurred. Show a message to the user
			});
		};

		// }
		// 	, false);


		//是否需要隐藏loading
		var shouldHideLoading = false;

		var finalTemplate = '';

		/**
		 * 获取需要上传文件数量
		 */
		$scope.getNeedUpdateCount = function () {
			var result = 0;
			for (var i = 0; i < $scope.images.length; i++) {
				if ($scope.images[i].isNew && $scope.images[i].isNew == true) {
					result++;
				}
			}

			for (var i = 0; i < $scope.videos.length; i++) {
				if ($scope.videos[i].isNew && $scope.videos[i].isNew == true) {
					result++;
				}
			}

			for (var i = 0; i < $scope.radios.length; i++) {
				if ($scope.radios[i].isNew && $scope.radios[i].isNew == true) {
					result++;
				}
			}

			return result;
		};

		//定时判断是否需要隐藏
		appscope.judgeLoading = function () {
			appscope.waitTimeout--;
			if(appscope.needUpdateCount !== 0){
				if (appscope.actualUpdateCount === appscope.needUpdateCount) {
					appIonicLoading.hide();
					appIonicLoading.show({template: '上传成功', duration: 2000});
				}
				else {
					if (appscope.waitTimeout === 0) {
						appIonicLoading.hide();
						appIonicLoading.show({template: '上传超时或失败，请重试...', duration: 2000});
					} else {
						setTimeout('appscope.judgeLoading()', 1000);
					}
				}
			}else{
			}

		};

		/**
		 * 没有影像信息时只保存描述，地址等信息
		 */
		$scope.uploadOtherInfo = function () {
			runServiceWithSession($http, undefined, $ionicPopup, $state, 'uploadImage', $scope.info,
				function (data, status) {
					if(data.array[0].Result.split(',')[0] === 'SUCCESS'){
						appIonicLoading.show({template: '保存成功！', duration: 2000});
					} else {
						appIonicLoading.show({template: '保存失败！', duration: 2000});
					}

				});
		};

		/*
		 资料上传，先上传图片，视频，音频，再上传其他资料信息
		 */
		$scope.uploadinfo = function () {
			appscope.actualUpdateCount = 0;
			appscope.waitTimeout = 60;
			appscope.needUpdateCount = $scope.getNeedUpdateCount();
			if(appscope.needUpdateCount === 0){
				// appIonicLoading.show({template: '没有新增的文件可以上传！', duration: 2000});
				$scope.uploadOtherInfo();
			}else{
				appIonicLoading.show({template: '信息保存中...'});
			}

			var data = $scope.info;

			for (var i = 0; i < $scope.images.length; i++) {

				if ($scope.images[i].isNew && $scope.images[i].isNew == true) {
					shouldHideLoading = false;

					(function (i) {
						var win = function (r) {

							var imageData = {};
							for(var key in data){
								imageData[key] = data[key];
							}
							imageData.Image = $scope.images[i].name;

							runServiceWithSession($http, null, $ionicPopup, $state, 'uploadImage', imageData,
								function (data, status) {

									//提示模板
									var template;
									var d = data.array[0].Result.split(',');
									if (d[0] == 'SUCCESS') {
										appscope.actualUpdateCount++;
										$scope.SerialNo = d[1];
										$scope.images[i].isNew = false;

									} else {
										template = "上传失败！code:" + r.code;
									}
									//appIonicLoading.show({template: template, duration: 2000});
								});
						}

						var fail = function (error) {
							//appIonicLoading.show({template: "上传失败: Code = " + error.code, duration: 2000});
						}

						//文件的路径
						var fileURL = $scope.images[i].src;
						//上传的参数
						var options = new FileUploadOptions();
						options.fileKey = "file";

						options.mimeType = "text/plain";

						options.fileName = $scope.images[i].name;

						var ft = new FileTransfer();
						//上传文件
						ft.upload(fileURL, encodeURI(AmApp.config.ServiceRealRootPath + "/FileTransfer?dir=" + $scope.info.CustomerID + $scope.info.ItemNo), win, fail, options);

					})(i);

				}
			}


			//视频上传
			for (var j = 0; j < $scope.videos.length; j++) {

				//视频isNew 为true ，是新增时上传视频
				if ($scope.videos[j].isNew && $scope.videos[j].isNew == true) {
					(function (j) {
						var win = function (r){

							var videoData = {};
							for(var key in data){
								videoData[key] = data[key];
							}
							videoData.Video = $scope.videos[j].name;

							runServiceWithSession($http, null, $ionicPopup, $state, 'uploadImage', videoData,
								function (data, status) {
									//提示模板
									var template;
									var d = data.array[0].Result.split(',');

									if (d[0] == 'SUCCESS') {
										appscope.actualUpdateCount++;

										template = "上传成功！";
										$scope.SerialNo = d[1];

										$scope.videos[j].isNew = false;

									} else {
										template = "上传失败！";
									}
									//appIonicLoading.show({template: template,duration:2000});
								});

						}

						var fail = function (error) {

						}

						//文件的路径
						var fileURL = $scope.videos[j].src;
						//上传的参数
						var options = new FileUploadOptions();
						options.fileKey = "file";
						options.mimeType = "text/plain";
						options.fileName = $scope.videos[j].name;

						var ft = new FileTransfer();
						//上传文件
						ft.upload(fileURL, encodeURI(AmApp.config.ServiceRealRootPath + "/FileTransfer?dir=" + $scope.info.CustomerID + $scope.info.ItemNo), win, fail, options);
					})(j);
				}
			}


			//音频上传
			for (var k = 0; k < $scope.radios.length; k++) {

				//音频isNew 为true ，是新增时上传音频
				if ($scope.radios[k].isNew && $scope.radios[k].isNew == true) {
					(function (k) {
						var win = function (r) {

							var audioData = {};
							for(var key in data){
								audioData[key] = data[key];
							}
							audioData.Radio = $scope.radios[k].name;

							runServiceWithSession($http, null, $ionicPopup, $state, 'uploadImage', audioData,
								function (data, status) {
									//提示模板
									var template;
									//Result  = 'SUCCESS,serailNo'
									var d = data.array[0].Result.split(',');

									if (d[0] == 'SUCCESS') {
										appscope.actualUpdateCount++;

										template = "上传成功！";
										$scope.SerialNo = d[1];
										$scope.radios[k].isNew = false;

									} else {
										template = "上传失败！";
									}
									//appIonicLoading.show({template: template,duration:2000});
								});
						}

						var fail = function (error) {
							//appIonicLoading.show({template: "上传失败: Code = " + error.code, duration:2000});
						}

						//文件的路径
						var fileURL = $scope.radios[k].src;
						//上传的参数
						var options = new FileUploadOptions();
						options.fileKey = "file";

						options.mimeType = "text/plain";

						options.fileName = $scope.radios[k].name;

						var ft = new FileTransfer();
						//上传文件
						ft.upload(fileURL, encodeURI(AmApp.config.ServiceRealRootPath + "/FileTransfer?dir=" + $scope.info.CustomerID + $scope.info.ItemNo), win, fail, options);
					})(k);
				}
			}

			// appscope.judgeLoading();

			setTimeout('appscope.judgeLoading()', 1000);
		};


		//获取资料和影像信息
		$scope.getInfo = function () {
			runServiceWithSession($http, $ionicLoading, $ionicPopup, $state,
				'loadImages', {CustomerID: $scope.info.CustomerID, ItemNo: $scope.info.ItemNo},
				function (data, status) {
					$scope.AllData = data.array;

					//FileType: 01=图片，02=音频，03=视频
					for (var k = 0; k < $scope.AllData.length; k++) {
						if ($scope.AllData[k].FileType == '01') {
							//添加图片
							var image = $scope.AllData[k];
							image.loading = true;
							$scope.imageData.push(image);
						} else if ($scope.AllData[k].FileType == '02') {
							//添加音频
							var radio = $scope.AllData[k];
							radio.loading = true;
							$scope.radiosData.push(radio);

						} else if ($scope.AllData[k].FileType == '03') {
							//添加视频
							var video = $scope.AllData[k];
							video.loading = true;
							$scope.videosData.push(video);

						}
					}

					if (data.array[0]) {
						$scope.SerialNo = data.array[0].SerialNo;
						$scope.info.Describe = data.array[0].Describe;
					}

					document.addEventListener('deviceready', function () {
						$scope.getAddress();

						//下载时会出现异步现象，先执行循环，再执行download函数
						for (var i = 0; i < $scope.imageData.length; i++) {
							(function (i) {
								var url = AmApp.config.ServiceRealRootPath + "/AttachView?FullPath=" + $scope.imageData[i].FileName;
								var targetPath = cordova.file.cacheDirectory + $scope.imageData[i].FileName.split('/').pop();
								var trustHosts = true;
								var options = {};

								$cordovaFileTransfer.download(url, targetPath, options, trustHosts)
									.then(function (result) {
										// Success!
										var image = {};
										image.src = result.nativeURL;
										image.isSelected = false;
										image.name = result.name;
										$scope.images.push(image);

										$scope.imageData[i].loading = false;

									}, function (err) {
										// Error
										appIonicLoading.show({template: '加载失败！code：' + err.code, duration: 2000});
									}, function (progress) {
										$timeout(function () {
											$scope.downloadImageProgress = (progress.loaded / progress.total) * 100;
										}, 500);
									});
							})(i);

						}

						//下载音频
						for (var i = 0; i < $scope.radiosData.length; i++) {

							(function (i) {
								var url = AmApp.config.ServiceRealRootPath + "/AttachView?FullPath=" + $scope.radiosData[i].FileName;
								var targetPath = cordova.file.cacheDirectory + $scope.radiosData[i].FileName.split('/').pop();
								var trustHosts = true;
								var options = {};

								$cordovaFileTransfer.download(url, targetPath, options, trustHosts)
									.then(function (result) {
										// Success!
										var radio = {};
										radio.src = result.nativeURL;
										radio.isSelected = false;
										radio.name = result.name;
										$scope.radios.push(radio);

										$scope.radiosData[i].loading = false;

									}, function (err) {
										// Error
										appIonicLoading.show({template: '加载失败！code：' + err.code, duration: 2000});
									}, function (progress) {
										$timeout(function () {
											$scope.downloadAudioProgress = (progress.loaded / progress.total) * 100;
										},500);
									});
							})(i);

						}


						//下载视频
						for (var i = 0; i < $scope.videosData.length; i++) {

							(function (i) {
								var url = AmApp.config.ServiceRealRootPath + "/AttachView?FullPath=" + $scope.videosData[i].FileName;
								var targetPath = cordova.file.cacheDirectory + $scope.videosData[i].FileName.split('/').pop();
								var trustHosts = true;
								var options = {};

								$cordovaFileTransfer.download(url, targetPath, options, trustHosts)
									.then(function (result) {
										// Success!

										var video = {};
										video.src = result.nativeURL;
										video.isSelected = false;
										video.name = result.name;
										$scope.videos.push(video);

										$scope.videosData[i].loading = false;

									}, function (err) {
										// Error
										appIonicLoading.show({template: '加载失败！code：' + err.code, duration: 2000});
									}, function (progress) {
										$timeout(function () {
											$scope.downloadVideoProgress = (progress.loaded / progress.total) * 100;
										}, 500);
									});
							})(i);

						}
					}, false);
				});
		};

		//加载资料
		// $scope.getInfo();


		//查看大图
		$ionicModal.fromTemplateUrl('templates/screenage/picture-modal.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function (modal) {
			$scope.modal = modal;
		});
		$scope.openModal = function (index) {
			$scope.index = index;
			$scope.images[$scope.index].isSelected = true;
			$scope.modal.show();

		};
		$scope.closeModal = function () {
			$scope.modal.hide();
			// $scope.modal.remove();
			$scope.images[$scope.index].isSelected = false;
			// $scope.index = null;
		};


		//删除图片
		$scope.deleteImage = function () {
			//设置完就清空
			if ($scope.images[$scope.index].isNew) {
				$scope.images.splice($scope.index, 1);
			} else {
				var delParams = {
					SerialNo: '',
					FileName: ''
				};

				delParams.SerialNo = $scope.SerialNo;
				delParams.FileName = '/' + $scope.info.CustomerID + $scope.info.ItemNo + '/' + $scope.images[$scope.index].name;

				runServiceWithSession($http, $ionicLoading, $ionicPopup, $state, 'deleteFiles', delParams,
					function (data, status) {

						if (data.array[0].Result == 'SUCCESS') {
							//删除对应的图片
							$scope.images.splice($scope.index, 1);

							appIonicLoading.show({template: '删除成功！', duration: 2000});
						} else {
							appIonicLoading.show({template: '删除失败！', duration: 2000});
						}

					});

			}

			//关闭模态窗口
			$scope.closeModal();
		};


		//删除文件
		$scope.deleteFile = function () {
			var newFile = 0;
			for (var s = 0; s < $scope.images.length; s++) {
				if ($scope.images[s].isNew && $scope.images[s].isSelected) {
					newFile++;
					$scope.images.splice(s, 1);
					s = -1;
				}
			}

			for (var s = 0; s < $scope.radios.length; s++) {
				if ($scope.radios[s].isNew && $scope.radios[s].isSelected) {
					newFile++;
					$scope.radios.splice(s, 1);
					s = -1;
				}
			}

			for (var s = 0; s < $scope.videos.length; s++) {
				if ($scope.videos[s].isNew && $scope.videos[s].isSelected) {
					newFile++;
					$scope.videos.splice(s, 1);
					s = -1;
				}
			}

			var delParams = {
				SerialNo: '',
				FileName: ''
			};

			delParams.SerialNo = $scope.SerialNo;

			for (var n = 0; n < $scope.images.length; n++) {
				if ($scope.images[n].isSelected) {
					delParams.FileName += '/' + $scope.info.CustomerID + $scope.info.ItemNo + '/' + $scope.images[n].name + ',';
				}
			}

			for (var m = 0; m < $scope.radios.length; m++) {
				if ($scope.radios[m].isSelected) {
					delParams.FileName += '/' + $scope.info.CustomerID + $scope.info.ItemNo + '/' + $scope.radios[m].name + ',';
				}
			}

			for (var k = 0; k < $scope.videos.length; k++) {
				if ($scope.videos[k].isSelected) {
					delParams.FileName += '/' + $scope.info.CustomerID + $scope.info.ItemNo + '/' + $scope.videos[k].name + ',';
				}
			}

			if (delParams.FileName == '' && newFile == 0) {
				appIonicLoading.show({template: '没有可删除的文件！', duration: 2000});
				return;
			}

			runServiceWithSession($http, $ionicLoading, $ionicPopup, $state, 'deleteFiles', delParams,
				function (data, status) {

					if (data.array[0].Result == 'SUCCESS') {
						for (var n = 0; n < $scope.images.length; n++) {
							if ($scope.images[n].isSelected) {
								$scope.images.splice(n, 1);
								$scope.imageData.splice(n, 1);
								n = -1;
							}
						}

						for (var n = 0; n < $scope.radios.length; n++) {
							if ($scope.radios[n].isSelected) {
								$scope.radios.splice(n, 1);
								$scope.radiosData.splice(n, 1);
								n = -1;
							}
						}

						for (var n = 0; n < $scope.videos.length; n++) {
							if ($scope.videos[n].isSelected) {
								$scope.videos.splice(n, 1);
								$scope.videosData.splice(n, 1);
								n = -1;
							}
						}
						$scope.imgSelected = false;
						$scope.cancel_mode = false;
						appIonicLoading.show({template: '删除成功！', duration: 2000});
					} else {
						appIonicLoading.show({template: '删除失败！', duration: 2000});
					}

				});

		};


	})


	//贷后检查-客户列表
	.controller('AfterCreditInvestigationController', function ($scope, paging, $http, $ionicPopup, $state) {
		var iPageSize = 5;//分页相关
		var loadData = function($ionicLoading) {
			runServiceWithSession($http, undefined, $ionicPopup, $state,
				"afterCustomerList", {
					pageSize : iPageSize,
					pageNo : $scope.pageNo,
				}, function(data, status) {
					for(var k = 0; k < data["array"].length; k++){
						$scope.items.push(data["array"][k]);
					}
					//分页相关
					$scope.hasMore = (($scope.pageNo - 1) * iPageSize
					+ data["array"].length < data.totalCount);
					$scope.loadingMore = false;
					if ($scope.items.length) {
						$scope.noData = false;
					} else {
						$scope.noData = true;
					}
					$scope.$broadcast('scroll.refreshComplete');//刷新完成
					$scope.$broadcast('scroll.infiniteScrollComplete');//加载完成
				});
		};

		$scope.goToInfoDetail = function (CustomerID, CustomerName) {
			$state.go('afterInfoDetail',
				{CustomerID: CustomerID, CustomerName: CustomerName});
		};

		paging.init($scope, iPageSize, 1, loadData);
	})



//Ipad-影像采集首页




