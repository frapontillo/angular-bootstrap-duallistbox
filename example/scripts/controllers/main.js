'use strict';

angular.module('bsDuallistboxApp')
  .controller('MainCtrl', function ($scope) {
    var lastIndex = 3;
    $scope.list = [];

    var updateList = function() {
      for (var i = $scope.list.length; i <= lastIndex; i++) {
        $scope.list.push({
          'id': '_' + (i+1),
          'text': 'element ' + (i+1)
        });
      }
    };

    $scope.reset = function() {
      $scope.model = [];
    };

    $scope.add = function() {
      lastIndex++;
      updateList();
    };

    $scope.settings = {
      bootstrap2: false,
      filterClear: 'Show all!',
      filterPlaceHolder: 'Filter!',
      moveSelectedLabel: 'Move selected only',
      moveAllLabel: 'Move all!',
      removeSelectedLabel: 'Remove selected only',
      removeAllLabel: 'Remove all!',
      moveOnSelect: true,
      preserveSelection: 'moved',
      selectedListLabel: 'The selected',
      nonSelectedListLabel: 'The unselected',
      postfix: '_helperz',
      selectMinHeight: 130,
      filter: true,
      filterNonSelected: '1',
      filterSelected: '4',
      infoAll: 'Showing all {0}!',
      infoFiltered: '<span class="label label-warning">Filtered</span> {0} from {1}!',
      infoEmpty: 'Empty list!',
      filterValues: false
    };

    updateList();

  });
