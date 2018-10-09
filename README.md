ember-cli-stickybits
==============================================================================

Ember wrapper around [stickybits](https://github.com/dollarshaveclub/stickybits).
See the demo for examples and usage-infos.

Installation
------------------------------------------------------------------------------

```
ember install ember-cli-stickybits
```


Usage
------------------------------------------------------------------------------

### Component

`ember-cli-stickybits` provides a component which automatically
handle stickybits lifecycle.

```hbs
{{#stickybits-element}}
  My sticky element
{{/stickybits-element}}

```
This component supports all stickybits properties.
eg.

```hbs
{{#stickybits-element stickyBitStickyOffset=50}}
  My sticky element
{{/stickybits-element}}

```
You can find the list of options [here](https://github.com/dollarshaveclub/stickybits)

### Service

All `stickybits-element` are registered in a `stickybits` service.
They are stored in a [WeakMap](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/WeakMap).
Service provides a way to `create`, `update`, `cleanup` stickybitsInstance.


Contributing
------------------------------------------------------------------------------

### Installation

* `git clone https://github.com/concordnow/ember-cli-stickybits`
* `cd ember-cli-stickybits`
* `yarn install`

### Linting

* `yarn lint:hbs`
* `yarn lint:js`
* `yarn lint:js --fix`

### Running tests

* `ember test` – Runs the test suite on the current Ember version
* `ember test --server` – Runs the test suite in "watch mode"
* `ember try:each` – Runs the test suite against multiple Ember versions

### Running the dummy application

* `ember serve`
* Visit the dummy application at [http://localhost:4200](http://localhost:4200).

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).

License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
