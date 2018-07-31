angular.module('pdf')
  .directive('pdfViewerToolbar', [
    'pdfDelegate',
  function(pdfDelegate) {
    return {
      restrict: 'E',
      template:
        '<div class="clearfix mb2 white bg-blue">' +
          '<div class="left">' +
            '<a href=""' +
              'ng-click="prev()"' +
              'class="button py2 m0 button-nav-dark">上一页' +
            '</a>' +
            '<a href=""' +
              'ng-click="next()"' +
              'class="button py2 m0 button-nav-dark">下一页' +
            '</a>' +
            '<a href=""' +
              'ng-click="zoomIn()"' +
              'class="button py2 m0 button-nav-dark">放大' +
            '</a>' +
            '<a href=""' +
              'ng-click="zoomOut()"' +
              'class="button py2 m0 button-nav-dark">缩小' +
            '</a>' +
            '<a href=""' +
              'ng-click="rotate()"' +
              'class="button py2 m0 button-nav-dark">旋转' +
            '</a>' +
            
            '<div ' +
            'class="buttonPage">' +
            '<span class="px1" style="padding-left: .5rem;padding-right: .5rem;">Page</span> ' +
            '<input type="text" id="pdfDelegateInput" class="field-dark" ' +
              'min=1 ng-model="currentPage" ng-change="goToPage()" ' +
               'style="width: 30px; display:inline-block;border: 1px solid rgba(0, 0, 0, .0625);border-radius: 3px;text-align:center"> ' +
            ' / {{pageCount}}' +
            '</div>' +
          '</div>' +
        '</div>',
      scope: { pageCount: '=' },
      
      
      
      
      link: function(scope, element, attrs) {
        var id = attrs.delegateHandle;
        scope.currentPage = 1;

        scope.prev = function() {
          pdfDelegate
            .$getByHandle(id)
            .prev();
          updateCurrentPage();
        };
        scope.next = function() {
          pdfDelegate
            .$getByHandle(id)
            .next();
          updateCurrentPage();
        };
        scope.zoomIn = function() {
          pdfDelegate
            .$getByHandle(id)
            .zoomIn();
        };
        scope.zoomOut = function() {
          pdfDelegate
            .$getByHandle(id)
            .zoomOut();
        };
        scope.rotate = function() {
          pdfDelegate
            .$getByHandle(id)
            .rotate();
        };
        scope.goToPage = function() {
          pdfDelegate
            .$getByHandle(id)
            .goToPage(scope.currentPage);
        };

        var updateCurrentPage = function() {
          scope.currentPage = pdfDelegate
                                .$getByHandle(id)
                                .getCurrentPage();
        };
      }
    };
}]);
