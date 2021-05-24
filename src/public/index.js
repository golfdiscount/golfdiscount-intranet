"use strict";

(function() {
  const DOMAIN = 'http://localhost:8000'

  window.addEventListener("load", () => {
    idSel("search").addEventListener('submit', searchOrder);
  });

  function searchOrder(e) {
    let url = new URL(DOMAIN + "/test")

    fetch(url, {mode: 'no-cors'})
      .then(res => res.text())
      .then(res => {
        console.log(res)
      })
      .catch(e => {
        console.log(e)
      })
    e.preventDefault();
  }

  function idSel(id) {
    return document.getElementById(id)
  }
})();