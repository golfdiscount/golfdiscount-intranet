const API_DOMAIN = 'https://gdinterface-staging.azurewebsites.net';
const FUNC_DOMAIN = 'https://wsi-staging.azurewebsites.net/api/createOrder';

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
    .then(res => {
      console.log(res);
      if (!res.order_num) {
        alert('There were no orders with that order number');
      } else {
        displayOrder(res)
      }
    })
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

/**
 * Clears the previous search results to show the new ones
 */
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

/**
 * Creates a card containing product information
 * @param {Object} product Information about the product to show
 * @returns div Element
 */
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

/**
 * Creates a card containing address information
 * @param {Object} addressInfo Information about an address
 * @returns div Element
 */
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
 * Creates an order from the order creation form
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
    .then(res => download(`${formData.get('order_num')}`, formData))
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

/**
 * 
 * @param {string} filename Name of file to download
 * @param {FromData} contents Contents to place in file to download
 */
function download(filename, contents) {
  let element = document.createElement('a');
  let receipt =
  `Order Number: ${contents.get('order_num')}
  Order Date: ${contents.get('order_date')}
  Shipping Method: ${contents.get('ship_method')}\n
  Customer Name: ${contents.get('sold_to_name')}
  Customer Address: ${contents.get('sold_to_address')}
  Customer City: ${contents.get('sold_to_city')}
  Customer State: ${contents.get('sold_to_state')}
  Customer Country: ${contents.get('sold_to_country')}
  Customer ZIP Code: ${contents.get('sold_to_zip')}\n\n`

  if (!contents.has('ship_to_name')) {
    receipt +=
    `Recipient Name: ${contents.get('sold_to_name')}\
    Recipient Address: ${contents.get('sold_to_address')}\
    Recipient City: ${contents.get('sold_to_city')}\
    Recipient State: ${contents.get('sold_to_state')}\
    Recipient Country: ${contents.get('sold_to_country')}\
    Recipient ZIP Code: ${contents.get('sold_to_zip')}\n\n`
  } else {
    receipt +=
    `Recipient Name: ${contents.get('ship_to_name')}\
    Recipient Address: ${contents.get('ship_to_address')}\
    Recipient City: ${contents.get('ship_to_city')}\
    Recipient State: ${contents.get('ship_to_state')}\
    Recipient Country: ${contents.get('ship_to_country')}\
    Recipient ZIP Code: ${contents.get('ship_to_zip')}\n\n`
  }

  receipt +=
  `Product SKU: ${contents.get('sku')}\
  Quantity Ordered: ${contents.get('quantity')}\
  Unit Price: $${contents.get('price')}`

  element.setAttribute('href', "data:text/plain;charset=utf-8," + encodeURIComponent(receipt));
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