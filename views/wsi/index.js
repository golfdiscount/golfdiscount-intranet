const API_DOMAIN = 'https://gdinterface-staging.azurewebsites.net';
const FUNC_DOMAIN = 'https://wsi-staging.azurewebsites.net/api/order-creator';

/**
 * Sets initial state of the window and adds necessary listeners
 */
window.addEventListener('load', () => {
  // View changers
  id('order-lookup').addEventListener('click', () => {showView('order-viewer')});
  id('order-creation').addEventListener('click', () => {showView('order-creator')});
  id('shipping').addEventListener('click', () => {showView('shipping-upload')});

  // Submission behavior
  id('order-search').addEventListener('click', searchOrder);
  id('shipping-form').addEventListener('submit', submitConf);
  id('order-form').addEventListener('submit', createOrder);

  id('address').addEventListener('click', () => {
    id('recipient-info').toggleAttribute('disabled');
  });
});

/**
 * Queries API to search for an order
 * @param {DOM Object} e Object originating callback
 * @throws Throws error when order cannot be found
 */
async function searchOrder(e) {
  e.preventDefault();

  let order_num = qs('#order-num').value

  let url = new URL(API_DOMAIN + '/wsi/orders/' + order_num);

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

/**
 * Changes the order creation form according to store number selected
 * @param {DOM Object} e Object originating callback
 */
function updateForm(e) {
  let storeNum = document.querySelector('input[name="storeNum"]:checked').value;

  if (storeNum == 1) {
    id('recipient-info').classList.add('hidden');
  } else {
    id('recipient-info').classList.remove('hidden');
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

  document.body.style.cursor = 'wait'

  let formData = new FormData(id('order-form'))

  today = new Date()
  yyyy = today.getFullYear()
  mm = today.getMonth() + 1;
  dd = today.getDate();

  if (dd < 10) {
    dd = '0' + dd;
  }

  if (mm < 10) {
    mm = '0' + mm;
  }

  order_date = `${mm}/${dd}/${yyyy}`;

  formData.append('order_date', order_date)

  let url = new URL(FUNC_DOMAIN);

  await fetch(url, {
    body: formData,
    method: 'POST'})
    .then(res => res.text())
    .then(res => download(`${formData.get('order_num')}.csv`, res))
    .catch(e => alert(e));
  
  document.body.style.cursor = 'default'
}

/**
 * Hides all views except for the one with the ID passed in
 * @param {string} id ID of the view wanting to be viewed
 */
function showView(view_id) {
  let views = document.querySelectorAll(`main > section:not(#${view_id})`);

  views.forEach(view => {
    view.classList.add('hidden');
  });

  id(`${view_id}`).classList.remove('hidden');
}

function download(filename, contents) {
  let element = document.createElement('a');
  element.setAttribute('href', "data:text/plain;charset=utf-8," + encodeURIComponent(contents));
  element.setAttribute('download', filename);

  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
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
