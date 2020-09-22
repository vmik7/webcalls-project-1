'use strict'

// JS function to test webp support

@@include('files/webp-test.js', {})

// Dynamic Adapt (https://www.youtube.com/watch?v=QKuMr575vlQ)

@@include('libs/dynamic_adapt/da.js', {})

// Focus-visible (https://www.npmjs.com/package/focus-visible)

@@include('../../node_modules/focus-visible/dist/focus-visible.js', {})

// Blocking-elements (https://github.com/PolymerLabs/blocking-elements)

@@include('../../node_modules/babel-polyfill/dist/polyfill.js', {})
@@include('../../node_modules/wicg-inert/dist/inert.js', {})
@@include('../../node_modules/blocking-elements/dist/blocking-elements.js', {})

// Other scripts

@@include('files/script.js', {})