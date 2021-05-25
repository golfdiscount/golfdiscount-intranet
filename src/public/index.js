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

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} idName - element ID
   * @returns {object} DOM object associated with id.
   */
   function id(idName) {
    return document.getElementById(idName);
  }

  /**
   * Returns a new element with the given tag name.
   * @param {string} tagName - HTML tag name for new DOM element.
   * @returns {object} New DOM object for given HTML tag.
   */
  function gen(tagName) {
    return document.createElement(tagName);
  }

  /**
   * Returns the first element that matches the given CSS selector.
   * @param {string} selector - CSS query selector.
   * @returns {object} The first DOM object matching the query.
   */
  function qs(selector) {
    return document.querySelector(selector);
  }

  /**
   * Helper function to return the response's result text if successful, otherwise
   * returns the rejected Promise result with an error status and corresponding text
   * @param {object} response - response to check for success/error
   * @return {object} - valid response if response was successful, otherwise rejected
   *                    Promise result
   */
  function checkStatus(response) {
    if (response.ok) {
      return response;
    } else {
      throw Error("Error in request: " + response.statusText);
    }
  }

  /**
   * Appends a node to the given parent node
   * @param {string} parent - The parent node
   * @param {string} child - The child node to be appended to parent node
   */
  function append(parent, child) {
    parent.appendChild(child);
  }
})();