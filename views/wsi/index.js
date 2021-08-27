const API_DOMAIN = 'http://localhost:8000';
const FUNC_DOMAIN = 'https://wsi-staging.azurewebsites.net/api/order-creator';

/**
 * Sets initial state of the window and adds necessary listeners
 */
window.addEventListener('load', () => {
  // View changers
  id('order-lookup').addEventListener('click', () => {showView('order-viewer')});
  id('order-creation').addEventListener('click', () => {showView('order-creator')});

  // Submission behavior
  id('search').addEventListener('submit', searchOrder);
  id('order-form').addEventListener('submit', createOrder);

  id('address').addEventListener('click', () => {
    id('recipient-info').toggleAttribute('disabled');
  });

  id('store-selector').addEventListener('click', async () => {
    let storeNum = qs('input[name=storeNum]:checked').value

    if (storeNum != 1) {
      id('address').disabled = true;

      let endpoint = new URL(API_DOMAIN + `/wsi/getStoreAddress/${storeNum}`);

      await fetch(endpoint)
        .then(res => res.json())
        .then(res => {
          id('rec-name').value = res['name'];
          id('rec-address').value = res['address'];
          id('rec-state').value = res['state'];
          id('rec-city').value = res['city'];
          id('rec-country').value = res['country'];
          id('rec-zip').value = res['zip'];
        });
    } else {
      id('address').disabled = false;
      id('recipient-info').disabled = false;

      id('rec-name').value = '';
      id('rec-address').value = '';
      id('rec-state').value = '';
      id('rec-city').value = '';
      id('rec-country').value = 'US';
      id('rec-zip').value = '';
    }
  });
});

/**
 * Queries API to search for an order
 * @param {DOM Object} e Object originating callback
 * @throws Throws error when order cannot be found
 */
async function searchOrder(e) {
  e.preventDefault();
  clearSearchResults();

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
 * @param {DOM Object} e Event object originating callback
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
 * @param {object} order Object containing order information
 */
function displayOrder(order) {

  let customerInfo = {
    name: order.sold_to_name,
    address: order.sold_to_address,
    city: order.sold_to_city,
    state: order.sold_to_state,
    country: order.sold_to_country,
    zip: order.sold_to_zip
  }

  let recipientInfo = {
    name: order.ship_to_name,
    address: order.ship_to_address,
    city: order.ship_to_city,
    state: order.ship_to_state,
    country: order.ship_to_country,
    zip: order.ship_to_zip
  }

  id('customer').appendChild(generateAddressEntry(customerInfo));
  id('recipient').appendChild(generateAddressEntry(recipientInfo));

  order.products.forEach(product => {
    id('product-container').appendChild(generateProductEntry(product));
  });
}

function clearSearchResults() {
  let customerCard = document.querySelector('#customer > div');
  let recipientCard = document.querySelector('#recipient > div');
  let productCards = document.querySelectorAll('#product-container > div');
  if (customerCard) {
    customerCard.remove();
    recipientCard.remove();
    productCards.forEach(product => {
      product.remove();
    })
  }
}

function generateProductEntry(product) {
  let productEntry = gen('div');

  let productHeading = gen('h3');
  productHeading.textContent = `${product.sku} - ${product.sku_name}`;
  let price = gen('p');
  price.textContent = `Price: $${product.unit_price}`;
  let quantity = gen('p');
  quantity.textContent = `Quantity: ${product.quantity}`;

  productEntry.appendChild(productHeading);
  productEntry.appendChild(price);
  productEntry.appendChild(quantity);

  return productEntry;
}

function generateAddressEntry(addressInfo) {
  let addressEntry = gen('div');

  let name = gen('p');
  name.textContent = `Name: ${addressInfo.name}`;
  let address = gen('p');
  address.textContent = `Address: ${addressInfo.address}`;
  let city = gen('p');
  city.textContent = `City: ${addressInfo.city}`;
  let state = gen('p');
  state.textContent = `State: ${addressInfo.state}`;
  let country = gen('p');
  country.textContent = `Country: ${addressInfo.country}`;
  let zip = gen('p');
  zip.textContent = `ZIP Code: ${addressInfo.zip}`;

  addressEntry.appendChild(name);
  addressEntry.appendChild(address);
  addressEntry.appendChild(city);
  addressEntry.appendChild(state);
  addressEntry.appendChild(country);
  addressEntry.appendChild(zip);

  return addressEntry;
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
