'use strict'


// js function to test webp support
@@include('files/webp-test.js', {})


// Dynamic Adapt (https://www.youtube.com/watch?v=QKuMr575vlQ)
@@include('libs/dynamic_adapt/da.js', {})


// focus-visible (https://www.npmjs.com/package/focus-visible)
@@include('../../node_modules/focus-visible/dist/focus-visible.js', {})


// other scripts
@@include('files/script.js', {})



let menuBurger = document.querySelector('.menu__burger');
let menuBody = document.querySelector('.menu__burger');