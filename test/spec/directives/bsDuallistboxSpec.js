'use strict';

describe('Directive: bsDuallistbox', function () {
  var scope, $sandbox, $compile, $timeout;

  beforeEach(module('frapontillo.bootstrap-duallistbox'));

  /* jshint camelcase: false */
  beforeEach(inject(function ($injector, $rootScope, _$compile_, _$timeout_) {
    scope = $rootScope;
    $compile = _$compile_;
    $timeout = _$timeout_;
    $sandbox = angular.element('<div id="sandbox"></div>').appendTo(angular.element.find('body'));
  }));
  /* jshint camelcase: true */

  afterEach(function () {
    $sandbox.remove();
    scope.$destroy();
  });

  var templates = {
    'default': {
      scope: {
        list: ['one', 'two', 'three', 'four', 'five', 'forty-two'],
        model: []
      },
      element: 'ng-options="element for element in list" '
    },
    'bootstrap2': {
      scope: {
        bootstrap2: false
      },
      element: 'bootstrap2="{{ bootstrap2 }}" ' +
        'ng-options="element for element in list" '
    },
    'filter': {
      scope: {
        filter: { },
        info: { },
        list: [{
          'id': '_1',
          'text': 'one'
        },{
          'id': '_2',
          'text': 'two'
        },{
          'id': '_3',
          'text': 'three'
        },{
          'id': '_4',
          'text': 'four'
        }],
        model: [{
          'id': '_2',
          'text': 'two'
        }, {
          'id': '_4',
          'text': 'four'
        }]
      },
      element: '' +
        'ng-options="element as element.text for element in list track by element.id" ' +
        'filter-placeholder="{{ filter.filterPlaceholder }}" ' +
        'show-filter-inputs="{{ filter.showFilterInputs }}" ' +
        'filter-non-selected="filter.filterNonSelected" ' +
        'filter-selected="filter.filterSelected" ' +
        'filter-clear="{{ filter.filterClear }}" ' +
        'filter-values="{{ filter.filterValues }}" ' +
        'info-all="{{ info.text }}" ' +
        'info-filtered="{{ info.textFiltered }}" '
    },
    'empty': {
      element: '' +
        'ng-options="element for element in list" ' +
        'info-empty="{{ info.textEmpty }}" '
    },
    'buttons': {
      scope: {
        labels: {
        }
      },
      element: '' +
        'ng-options="element for element in list" ' +
        'move-selected-label="{{ labels.moveSelected }}" ' +
        'move-all-label="{{ labels.moveAll }}" ' +
        'remove-selected-label="{{ labels.removeSelected }}" ' +
        'remove-all-label="{{ labels.removeAll }}" '
    },
    'lists': {
      scope: {
        labels: {
        }
      },
      element: '' +
        'ng-options="element for element in list" ' +
        'non-selected-list-label="{{ labels.nonSelected }}" ' +
        'selected-list-label="{{ labels.selected }}" ' +
        'postfix="{{ postfix }}" '
    },
    'move': {
      element: '' +
        'ng-options="element for element in list" ' +
        'move-on-select="{{ moveOnSelect }}" '
    },
    'preserve': {
      element: '' +
        'ng-options="element for element in list" ' +
        'move-on-select="{{ moveOnSelect }}" ' +
        'preserve-selection="{{ preserveSelection }}" ',
      scope: {
        model: ['one','two','three'],
        moveOnSelect: false,
        preserveSelection: false
      }
    },
    'height': {
      element: '' +
        'ng-options="element for element in list" ' +
        'select-min-height="{{ minimalHeight }}" '
    }
  };

  var basicElement = [
    '<select ' +
      'ng-model="model" ' +
      'multiple bs-duallistbox name="mySelect" ',
    '></select>'
  ];

  /**
   * Build an element string.
   * @param template The template element to be used
   * @returns {string} The HTML element as a string
   */
  function buildElement(template) {
    var elementContent = template.element;
    var realElement;
    if (template.override) {
      realElement = elementContent;
    } else {
      realElement = basicElement[0] + elementContent + basicElement[1];
    }
    return realElement;
  }

  /**
   * Compile a given template object as a `select`.
   * @param template The template object
   * @returns {*} compiled angular element
   */
  function compileDirective(template) {
    // If the template is undefined, default to 'default'
    var compileTemplate = template || 'default';
    template = templates[compileTemplate];
    // Extend the current scope with the default one and then the selected one
    angular.extend(scope, angular.copy(templates['default'].scope), angular.copy(template.scope));
    var content = buildElement(template);
    var $element = angular.element(content).appendTo($sandbox);
    $compile($element)(scope);
    scope.$apply();
    $timeout.flush();
    $element = $sandbox.find('*:first-child');
    return $element;
  }

  /**
   * Gets the text of an {HTMLOption} element.
   * @param option The {HTMLOption} element.
   * @returns {String} content of the element.
   */
  function getText(option) {
    return option.text;
  }

  describe('default behaviour', function() {
    var element;
    beforeEach(function() {
      element = compileDirective('default');
    });

    // Test the duallistbox creation and defaults
    it('should create a duallistbox', inject(function () {
      expect(element.hasClass('bootstrap-duallistbox-container')).toBe(true);
      expect(element.find('.box1')).toBeDefined();
      expect(element.find('.box2')).toBeDefined();
      expect($sandbox.find('> select').css('display')).toBe('none');
    }));

    // Test the unselected and selected list after bootstrap
    it('should properly initialize both list', inject(function () {
      expect(element.find('#bootstrap-duallistbox-nonselected-list_mySelect').length).not.toBe(0);
      expect(element.find('#bootstrap-duallistbox-nonselected-list_mySelect > option').length).toBe(6);
      expect(element.find('#bootstrap-duallistbox-selected-list_mySelect').length).not.toBe(0);
      expect(element.find('#bootstrap-duallistbox-selected-list_mySelect > option').length).toBe(0);
    }));

    // A model change should update both lists accordingly
    it('should update lists according to the model change', inject(function () {
      scope.model = ['one', 'two'];
      scope.$apply();
      $timeout.flush();

      var nonSelectedOpts = element.find('#bootstrap-duallistbox-nonselected-list_mySelect > option');
      expect(nonSelectedOpts.length).toBe(4);
      var nonSelectedTexts = Array.prototype.map.call(nonSelectedOpts, getText);
      expect(nonSelectedTexts).toContain('three');
      expect(nonSelectedTexts).toContain('four');
      expect(nonSelectedTexts).toContain('five');
      expect(nonSelectedTexts).toContain('forty-two');

      var selectedOpts = element.find('#bootstrap-duallistbox-selected-list_mySelect > option');
      expect(selectedOpts.length).toBe(2);
      var selectedTexts = Array.prototype.map.call(selectedOpts, getText);
      expect(selectedTexts).toContain('one');
      expect(selectedTexts).toContain('two');
    }));
  });

  describe('appearance', function() {
    // Test the bootstrap2 compatibility
    it('should be compatible with bootstrap version 2', inject(function () {
      var element = compileDirective('bootstrap2');
      expect(element.hasClass('row')).toBeTruthy();
      expect(element.hasClass('row-fluid bs2compatible')).toBeFalsy();
      scope.bootstrap2 = true;
      scope.$apply();
      expect(element.hasClass('row')).toBeFalsy();
      expect(element.hasClass('row-fluid bs2compatible')).toBeTruthy();
    }));

    // Test the height of the selects
    it('should be more than about 100px of height', inject(function () {
      var element = compileDirective('height');
      var h1 = element.find('.box1 select').height();
      var h2 = element.find('.box2 select').height();
      expect(h1).toBeGreaterThan(95);
      expect(h2).toBeGreaterThan(95);
    }));

    // Test the height of the selects
    it('should be more than about 200px of height', inject(function () {
      var element = compileDirective('height');
      scope.minimalHeight = 200;
      scope.$apply();
      var h1 = element.find('.box1 select').height();
      var h2 = element.find('.box2 select').height();
      expect(h1).toBeGreaterThan(195);
      expect(h2).toBeGreaterThan(195);
    }));
  });

  describe('filter', function() {
    var element;
    beforeEach(function() {
      element = compileDirective('filter');
    });

    // Test the filter defaults
    it('should setup the default filter parameters (placeholder, visibility)', inject(function () {
      element.find('.filter').each(function (position, filterInput) {
        var $input = angular.element(filterInput);
        expect($input.attr('placeholder')).toBe('Filter');
        expect($input.is(':visible')).toBeTruthy();
        // filter inputs should be empty
        expect($input.val()).toBe('');
      });
      // both selects have elements
      expect(element.find('#bootstrap-duallistbox-nonselected-list_mySelect > option').length).toBe(2);
      expect(element.find('#bootstrap-duallistbox-selected-list_mySelect > option').length).toBe(2);
    }));

    // Test the filtering system
    it('should filter the selects when the model changes', inject(function () {
      // filter both lists
      scope.filter.filterNonSelected = 't';
      scope.filter.filterSelected = 'f';
      scope.$apply();
      $timeout.flush();
      // the non selected list must contain only 'three' and 'forty-two'
      var nonSelectedOpts = element.find('#bootstrap-duallistbox-nonselected-list_mySelect > option');
      expect(nonSelectedOpts.length).toBe(1);
      expect(Array.prototype.map.call(nonSelectedOpts, getText)).toContain('three');
      // the selected list must contain only 'four'
      var selectedOpts = element.find('#bootstrap-duallistbox-selected-list_mySelect > option');
      expect(selectedOpts.length).toBe(1);
      expect(Array.prototype.map.call(selectedOpts, getText)).toContain('four');
    }));

    // Test the values filtering system
    it('should filter the selects with values when the model changes', inject(function () {
      // filter both lists
      scope.filter.filterValues = true;
      scope.filter.filterNonSelected = '1';
      scope.filter.filterSelected = '4';
      scope.$apply();
      $timeout.flush();
      // the non selected list must contain only 'one' and 'four'
      var nonSelectedOpts = element.find('#bootstrap-duallistbox-nonselected-list_mySelect > option');
      expect(nonSelectedOpts.length).toBe(1);
      expect(Array.prototype.map.call(nonSelectedOpts, getText)).toContain('one');
      // the selected list must contain only 'four'
      var selectedOpts = element.find('#bootstrap-duallistbox-selected-list_mySelect > option');
      expect(selectedOpts.length).toBe(1);
      expect(Array.prototype.map.call(selectedOpts, getText)).toContain('four');
    }));

    // Test the filtering system by view
    it('should filter the selects when the view changes', inject(function () {
      // filter both lists
      element.find('.box1 .filter').val('t').change();
      element.find('.box2 .filter').val('f').change();
      // the non selected list must contain only 'three' and 'forty-two'
      var nonSelectedOpts = element.find('#bootstrap-duallistbox-nonselected-list_mySelect > option');
      expect(nonSelectedOpts.length).toBe(1);
      expect(Array.prototype.map.call(nonSelectedOpts, getText)).toContain('three');
      // the selected list must contain only 'four'
      var selectedOpts = element.find('#bootstrap-duallistbox-selected-list_mySelect > option');
      expect(selectedOpts.length).toBe(1);
      expect(Array.prototype.map.call(selectedOpts, getText)).toContain('four');
    }));

    // Test the values filtering system by view
    it('should filter the selects with values when the view changes', inject(function () {
      // filter both lists
      scope.filter.filterValues = true;
      element.find('.box1 .filter').val('1').change();
      element.find('.box2 .filter').val('4').change();
      scope.$apply();
      // the non selected list must contain only 'one' and 'four'
      var nonSelectedOpts = element.find('#bootstrap-duallistbox-nonselected-list_mySelect > option');
      expect(nonSelectedOpts.length).toBe(1);
      expect(Array.prototype.map.call(nonSelectedOpts, getText)).toContain('one');
      // the selected list must contain only 'four'
      var selectedOpts = element.find('#bootstrap-duallistbox-selected-list_mySelect > option');
      expect(selectedOpts.length).toBe(1);
      expect(Array.prototype.map.call(selectedOpts, getText)).toContain('four');
    }));
  });

  describe('info text', function() {
    // Test the info text for unfiltered lists
    it('should change the info text for unfiltered lists', inject(function () {
      var element = compileDirective('filter');
      // filter inputs should be empty
      expect(element.find('.box1 .info').html()).toBe('Showing all 2');
      expect(element.find('.box2 .info').html()).toBe('Showing all 2');
      scope.info.text = 'All {0}';
      scope.$apply();
      expect(element.find('.box1 .info').html()).toBe('All 2');
      expect(element.find('.box2 .info').html()).toBe('All 2');
    }));

    // Test the info text for filtered lists
    it('should change the info text for filtered lists', inject(function () {
      var element = compileDirective('filter');
      scope.filter.filterNonSelected = 't';
      scope.filter.filterSelected = 'f';
      scope.$apply();
      $timeout.flush();
      // filter inputs should be empty
      expect(element.find('.box1 .info').html()).toBe('<span class="label label-warning">Filtered</span> 1 from 2');
      expect(element.find('.box2 .info').html()).toBe('<span class="label label-warning">Filtered</span> 1 from 2');
      scope.info.textFiltered = '{0}/{1}';
      scope.$apply();
      expect(element.find('.box1 .info').html()).toBe('1/2');
      expect(element.find('.box2 .info').html()).toBe('1/2');
    }));

    // Test the info text for empty lists
    it('should change the info text for empty lists', inject(function () {
      var element = compileDirective('empty');

      // test default behavior
      expect(element.find('.box2 .info').html()).toBe('Empty list');
      // move all elements
      scope.model = angular.copy(scope.list);
      scope.$apply();
      $timeout.flush();
      expect(element.find('.box1 .info').html()).toBe('Empty list');

      // change the empty text
      scope.info = { textEmpty: 'No luck, mate'};
      scope.$apply();
      expect(element.find('.box1 .info').html()).toBe('No luck, mate');
      scope.model = [];
      scope.$apply();
      $timeout.flush();
      expect(element.find('.box2 .info').html()).toBe('No luck, mate');
    }));
  });

  describe('clear button', function() {
    // Test the clear text button
    it('should change the text for the clear button', inject(function () {
      var element = compileDirective('filter');
      // filter both lists
      scope.filter.filterNonSelected = 't';
      scope.filter.filterSelected = 'f';
      scope.$apply();
      $timeout.flush();
      expect(element.find('.box1 .clear1').html()).toBe('show all');
      expect(element.find('.box2 .clear2').html()).toBe('show all');

      // change the button text
      scope.filter.filterClear = 'Clear filter';
      scope.$apply();
      expect(element.find('.box1 .clear1').html()).toBe('Clear filter');
      expect(element.find('.box2 .clear2').html()).toBe('Clear filter');
    }));
  });

  describe('button title', function() {
    var element;
    beforeEach(function() {
      element = compileDirective('buttons');
    });

    // Test the default button titles
    it('should set the default button titles', inject(function () {
      expect(element.find('.box1 .move').attr('title')).toBe('Move selected');
      expect(element.find('.box1 .moveall').attr('title')).toBe('Move all');
      expect(element.find('.box2 .remove').attr('title')).toBe('Remove selected');
      expect(element.find('.box2 .removeall').attr('title')).toBe('Remove all');
    }));

    // Test the change of button titles
    it('should change the button titles', inject(function () {
      scope.labels.moveSelected = 'Move this';
      scope.labels.moveAll = 'Move them all';
      scope.labels.removeSelected = 'Remove this';
      scope.labels.removeAll = 'Remove them all';
      scope.$apply();
      expect(element.find('.box1 .move').attr('title')).toBe(scope.labels.moveSelected);
      expect(element.find('.box1 .moveall').attr('title')).toBe(scope.labels.moveAll);
      expect(element.find('.box2 .remove').attr('title')).toBe(scope.labels.removeSelected);
      expect(element.find('.box2 .removeall').attr('title')).toBe(scope.labels.removeAll);
    }));
  });

  describe('list label', function() {
    var element;
    beforeEach(function() {
      element = compileDirective('lists');
    });

    // Test the default list labels
    it('should set the default list labels', inject(function () {
      expect(element.find('.box1 > label').is(':visible')).toBeFalsy();
      expect(element.find('.box1 > label').html()).toBe('');
      expect(element.find('.box2 > label').is(':visible')).toBeFalsy();
      expect(element.find('.box2 > label').html()).toBe('');
    }));

    // Test the change of list labels
    it('should change the list labels', inject(function () {
      scope.labels.nonSelected = 'The unselected';
      scope.labels.selected = 'The selected';
      scope.$apply();
      expect(element.find('.box1 > label').is(':visible')).toBeTruthy();
      expect(element.find('.box1 > label').html()).toBe(scope.labels.nonSelected);
      expect(element.find('.box2 > label').is(':visible')).toBeTruthy();
      expect(element.find('.box2 > label').html()).toBe(scope.labels.selected);
    }));
  });

  describe('move and remove', function() {
    var element;
    beforeEach(function() {
      element = compileDirective('move');
    });

    // Test the selects after the click on options
    it('should move and remove elements when they are selected (default)', inject(function () {
      // select 'one','two','three'
      element.find('.box1 select option').slice(0, 3).prop('selected', true).change();
      expect(scope.model.length).toBe(3);
      expect(scope.model).toContain('one');
      expect(scope.model).toContain('two');
      expect(scope.model).toContain('three');
      element.find('.box2 select option').slice(0, 3).prop('selected', true).change();
      expect(scope.model.length).toBe(0);
    }));

    // Test the selects after the click on options
    it('should not move elements when they are selected', inject(function () {
      scope.moveOnSelect = false;
      scope.$apply();
      // select 'one','two','three'
      element.find('.box1 select option').slice(0, 3).prop('selected', true).change();
      expect(scope.model.length).toBe(0);
    }));

    // Test the left select after options are selected and moved
    it('should move elements when "move" button is clicked', inject(function () {
      scope.moveOnSelect = false;
      scope.$apply();
      // select 'one','two','three'
      element.find('.box1 select option').slice(0, 3).prop('selected', true).change();
      element.find('.box1 .move').click();
      expect(scope.model.length).toBe(3);
      expect(scope.model).toContain('one');
      expect(scope.model).toContain('two');
      expect(scope.model).toContain('three');
    }));

    // Test the left select after all options are moved
    it('should move all elements when "move all" button is clicked', inject(function () {
      scope.moveOnSelect = false;
      scope.$apply();
      // move all
      element.find('.box1 .moveall').click();
      expect(scope.model.length).toBe(6);
    }));

    // Test the right select after options are selected and removed
    it('should remove elements when "remove" button is clicked', inject(function () {
      scope.moveOnSelect = false;
      // select 'one','two','three'
      scope.model = ['one','two','three'];
      scope.$apply();
      expect(scope.model.length).toBe(3);
      // move two
      element.find('.box2 select option').slice(0, 2).prop('selected', true).change();
      element.find('.box2 .remove').click();
      expect(scope.model.length).toBe(1);
    }));

    // Test the right select after all options are removed
    it('should remove all elements when "remove all" button is clicked', inject(function () {
      scope.moveOnSelect = false;
      // select 'one','two','three'
      scope.model = ['one','two','three'];
      scope.$apply();
      expect(scope.model.length).toBe(3);
      // move all
      element.find('.box2 .removeall').click();
      expect(scope.model.length).toBe(0);
    }));
  });

  describe('preserve', function() {
    var element;
    beforeEach(function() {
      element = compileDirective('preserve');
    });

    // Test both selects after options are selected, then moved or removed
    it('should not preserve any selection', inject(function () {
      // select 'four' and move it
      element.find('.box1 select option').slice(0, 1).prop('selected', true).change();
      element.find('.box1 .move').click();
      // no option should be selected after the move
      expect(element.find('select option:selected').length).toBe(0);
    }));

    // Test both selects after options are selected, then moved or removed
    it('should preserve moved selections only', inject(function () {
      scope.preserveSelection = 'moved';
      scope.$apply();
      // select 'four' among the unselected list
      element.find('.box1 select option').slice(0, 1).prop('selected', true).change();
      // select 'one' among the selected list
      element.find('.box2 select option').slice(0, 1).prop('selected', true).change();
      // move 'four' to the selected list
      element.find('.box1 .move').click();
      // only 'four' should be selected
      expect(element.find('select option:selected').length).toBe(1);
      expect(element.find('select option:selected').text()).toBe('four');
    }));

    // Test both selects after options are selected, then moved or removed
    it('should preserve all selections', inject(function () {
      scope.preserveSelection = 'all';
      scope.$apply();
      // select 'four' among the unselected list
      element.find('.box1 select option').slice(0, 1).prop('selected', true).change();
      // select 'one' among the selected list
      element.find('.box2 select option').slice(0, 1).prop('selected', true).change();
      // move 'four' to the selected list
      element.find('.box1 .move').click();
      // both 'one' and 'four' should be selected
      expect(element.find('select option:selected').length).toBe(2);
      expect(Array.prototype.map.call(element.find('select option:selected'), getText)).toContain('one');
      expect(Array.prototype.map.call(element.find('select option:selected'), getText)).toContain('four');
    }));
  });

  describe('postfix and name', function() {
    var element;
    beforeEach(function() {
      element = compileDirective('lists');
    });

    var testNamesIds = function(postfix) {
      var thePostfix = postfix || '_helper';
      expect(element.find('.box1 select').attr('name')).toBe('mySelect' + thePostfix + '1');
      expect(element.find('.box2 select').attr('name')).toBe('mySelect' + thePostfix + '2');
    };

    it('should generate the correct ids', function() {
      expect(element.find('.box1 > label').attr('for')).toBe('bootstrap-duallistbox-nonselected-list_mySelect');
      expect(element.find('.box1 select').attr('id')).toBe('bootstrap-duallistbox-nonselected-list_mySelect');
      expect(element.find('.box2 > label').attr('for')).toBe('bootstrap-duallistbox-selected-list_mySelect');
      expect(element.find('.box2 select').attr('id')).toBe('bootstrap-duallistbox-selected-list_mySelect');
    });

    // Test the default names and ids
    it('should generate the default names and ids', inject(function () {
      testNamesIds(scope.postfix);
    }));

    // Test the default names and ids
    it('should generate custom names and ids', inject(function () {
      scope.postfix = '_my-postfix_';
      scope.$apply();
      testNamesIds(scope.postfix);
    }));
  });

});
