const DOMAIN = 'https://gdinterface-staging.azurewebsites.net';

/**
 * Sets initial state of the window and adds necessary listeners
 */
window.addEventListener('load', () => {
  // View changers
  id('order-lookup').addEventListener('click', () => {showView('order-viewer')});
  id('order-creation').addEventListener('click', () => {showView('order-creator')});
  id('shipping').addEventListener('click', () => {showView('shipping-upload')});

  // Submission behavior
  id('order-submit').addEventListener('click', searchOrder);
  id('shipping-form').addEventListener('submit', submitConf);
  id('order-form').addEventListener('submit', createOrder);
});

/**
 * Queries API to search for an order
 * @param {DOM Object} e Object originating callback
 * @throws Throws error when order cannot be found
 */
async function searchOrder(e) {
  e.preventDefault();

  let order_num = qs('#order-num').value

  if (order_num === '') {
    alert('Order number cannot be empty!');
  } else {
    let url = new URL(DOMAIN + '/wsi/orders/' + order_num);

    await fetch(url)
      .then(res => {
        if (res.status === 400) {
          throw Error(`Order ${qs('#order-num').value} could not be found`)
        }
        return res;
      })
      .then(res => res.json())
      .then(res => displayOrder(res))
      .catch(e => {
        // alert(`There was an error completing your request:\n${e}`);
      });
  }
}

/**
 * Renders order information to be displayed on screen
 * @param {object} order JSON object containing order information
 */
function displayOrder(order) {
  // Customer info
  qs('#c-name output').textContent = order.sold_to_name;
  qs('#c-address output').textContent = order.sold_to_address;
  qs('#c-city output').textContent = order.sold_to_city;
  qs('#c-state output').textContent = order.sold_to_state;
  qs('#c-country output').textContent = order.sold_to_country;
  qs('#c-zip output').textContent = order.sold_to_zip;

  // Recipient info
  qs('#r-name output').textContent = order.ship_to_name;
  qs('#r-address output').textContent = order.ship_to_address;
  qs('#r-city output').textContent = order.ship_to_city;
  qs('#r-state output').textContent = order.ship_to_state;
  qs('#r-country output').textContent = order.ship_to_country;
  qs('#r-zip output').textContent = order.ship_to_zip;

  // Product info
  qs('#sku-name output').textContent = order.sku_name;
  qs('#sku output').textContent = order.sku;
  qs('#price output').textContent = `$${order.unit_price}`;
  qs('#quantity output').textContent = order.quantity;

  // Shipping info
  let ship_date_field = qs('#ship-date output');
  if (order.ship_date == null) {
    ship_date_field.classList.add('not-avail');
    ship_date_field.textContent = 'Not yet shipped';
  } else {
    ship_date_field.textContent = order.ship_date;
  }

  let tracking_field = qs('#tracking output');
  if (order.tracking_num == null) {
    tracking_field.classList.add('not-avail');
    tracking_field.textContent = 'Tracking number has not yet been generated';
  } else {
    tracking_field = order.tracking_num;
  }
}

/**
 * Submits a file to the WSI API
 * @param {DOM object} e Object originating callback
 */
function submitConf(e) {
  e.preventDefault();
  alert('File has been submitted');
}

/**
 *
 * @param {object} e - Event object originating callback
 */
async function createOrder(e) {
  e.preventDefault();

  let formData = new FormData(id('order-form'))

  formData.append('ship_to_name', 'Harmeet Singh');
  formData.append('ship_to_address', '4535 12th Ave NE APT 119');
  formData.append('ship_to_city', 'Seattle');
  formData.append('ship_to_state', 'WA');
  formData.append('ship_to_country', 'US');
  formData.append('ship_to_zip', '98105');

  for (let pair of formData) {
    console.log(pair);
  }

  let url = new URL('https://wsi.azurewebsites.net/api/order-creator?');

  await fetch(url, {body: formData, method: 'POST'})
    .then(res => alert(res));
}

/**
 * Hides all views except for the one with the ID passed in
 * @param {string} id ID of the view wanting to be viewed
 */
function showView(view_id) {
  let views = document.querySelectorAll(`main > div:not(#${view_id})`);

  views.forEach(view => {
    view.classList.add('hidden');
  });

  id(`${view_id}`).classList.remove('hidden');
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
    throw Error(response.statusText);
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
