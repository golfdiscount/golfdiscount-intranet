"use strict";

(function() {
  const DOMAIN = 'http://localhost:8000'

  window.addEventListener("load", () => {
    idSel("search").addEventListener('submit', searchOrder);
  });

  async function searchOrder(e) {
    e.preventDefault();
    let url = new URL(DOMAIN + "/orders/1000692635")

    let order =
    await fetch(url, {mode: 'no-cors'})
      .then(res => res.json())
      .catch(e => {
        console.log(e)
      })
    
    console.log(order.SKU)
  }

  function idSel(id) {
    return document.getElementById(id)
  }
})();