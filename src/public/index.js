"use strict";

(function() {
  const DOMAIN = 'localhost:3000/'

  window.addEventListener("load", init);

  /*
  Set up initial state of window
  */
 function init() {
  let p = document.createElement("p")
  p.textContent = "Window successfully loaded";
  document.querySelector("main").appendChild(p)
 }
})();