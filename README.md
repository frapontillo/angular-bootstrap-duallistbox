angular-bootstrap-duallistbox [![Build Status](https://travis-ci.org/frapontillo/angular-bootstrap-duallistbox.png)](https://travis-ci.org/frapontillo/angular-bootstrap-duallistbox)
========================

Angular directive to include [Bootstrap Dual Listbox](https://github.com/istvan-ujjmeszaros/bootstrap-duallistbox) in your apps.

##Usage

###Installation
```shell
$ bower install angular-bootstrap-duallistbox
```

This will install AngularJS, jQuery, and the original bootstrap-duallistbox.

###Directive
The directive has to be applied to an already existing `select` element with the `multiple` attribute:

```html
<select
	ng-options="el in elements"
	multiple
    ng-model="selections"
    bs-duallistbox
	></select>
```

Set the `select` attributes as you would normally do for a regular multiple list, and add `bs-duallistbox` to enable the plugin.

####Options

The available options for the dual listbox are:

- `bootstrap2`, if `true` enables compatibility with Bootstrap 2, otherwise it defaults to Bootstrap 3.
- `postfix`, the added selects will have the same name as the original one, concatenated with this string and `1`
  (for the non selected list, e.g. `element_helper1`) or `2` (for the selected list, e.g. `element_helper2`).
- `select-min-height`, the minimum height for the dual listbox.
- `filter`, if `true` it enables filtering the dual listbox, otherwise it defaults to `false`.
- `filter-clear`, the text of the "Clear filter" `button`s.
- `filter-placeholder`, the placeholder text for the filter `input`s.
- `filter-values`, if `true` enables filtering on values too.
- `filter-non-selected`, the variable that will be bound to the filter `input` of the non-selected options.
- `filter-selected`, the variable that will be bound to the filter `input` of the selected options.
- `move-on-select`, defaults to `true`, determines whether to move options upon selection.
- `preserve-selection`, can be
  - `'all'`, for selecting both moved elements and the already selected ones in the target list
  - `'moved'`, for selecting moved elements only
  - `false`, the default not to preserve anything
- `move-selected-label`, is the label for the "Move Selected" button, defaults to `'Move selected'`.
- `move-all-label`, is the label for the "Move All" button, defaults to `'Move all'`.
- `remove-selected-label`, is the label for the "Remove Selected" button, defaults to `'Remove selected'`.
- `remove-all-label`, is the label for the "Remove All" button, defaults to `'Remove all'`.
- `selected-list-label`, can be a `string` specifying the name of the selected list., defaults to `false`.
- `non-selected-list-label`, can be a `string` specifying the name of the non selected list., defaults to `false`.
- `info-all`, defaults to `'Showing all {0}'`, determines which `string` format to use when all options are visible.
  Set this to `false` to hide this information. Remember to insert the `{0}` placeholder.
- `info-filtered`, defaults to `'<span class="label label-warning">Filtered</span> {0} from {1}'`, determines which
  element format to use when some element is filtered. Remember to insert the `{0}` and `{1} `placeholders.
- `info-empty`, defaults to `'Empty list'`, determines the `string` to use when there are no options in the list.

###Example
The `example` folder shows a simple working demo of the dual list box.

##Development

###Test and build

To build the directive yourself you need to have NodeJS. Then do the following:

```shell
$ npm install -g grunt-cli bower karma
$ npm install
$ bower install
$ grunt
```

###Contribute

To contribute, please follow the generic [AngularJS Contributing Guidelines](https://github.com/angular/angular.js/blob/master/CONTRIBUTING.md), with the only exception to send the PR to the `develop` branch instead of `master`.

##Author

Francesco Pontillo (<mailto:francescopontillo@gmail.com>)

##License

```
   Copyright 2014 Francesco Pontillo

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

```
