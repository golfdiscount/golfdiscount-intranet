import { React, useState, useEffect } from 'react';

import ErrorMessage from 'components/ErrorMessage/ErrorMessage';
import LoadingSpinner from 'components/LoadingSpinner';
import OrderGrid from './OrderGrid';

import './OrderSearch.css';

/**
 * OrderViewer component with form for searching and order information
 * @returns OrderViewer component
 */
function OrderSearch() {
  const [orders, setOrders] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState();

  // Load orders from the WSI API
  useEffect(() => {
    async function fetchData() {
      const recentPickTickets = await getRecentPickTickets();

      setOrders(recentPickTickets);
      setLoaded(true);
    }

    fetchData();
  }, []);

  if (!loaded) {
    return <LoadingSpinner />;
  }

  return (
    <div className='tab-content'>
      {error && <ErrorMessage error={error} />}
      <div className='tab-inner-content'>
        <h1>Orders</h1>
        <form onSubmit={async e => { await searchPickTickets(e, setOrders, setError); }}>
          <label>
            Order Number: 
            <input type='text' name='orderNumber'/>
          </label>
          <button type='submit'>Search</button>
        </form>
        <OrderGrid orders={orders}/>
      </div>
    </div>

  );
}

/**
 * Gets order information from WSI database and updates the currently displayed order
 * Will update the error banner in case of any res status that are not 200
 * @param {String} orderNumber
 * @param {Function} setState Function to update state of the current order in the OrderViewer component
 * @param {Function} setError Function to update the error state of the order viewing screen
 */
async function searchPickTickets(event, setOrders, setError) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const orderNumber = formData.get('orderNumber');

  if (orderNumber !== null) {
    try {
      const pickTickets = await searchPickTicketsByOrder(orderNumber);
      setOrders(pickTickets);
      setError(null);
    } catch (error) {
      setError(error.message);
    }

  } else {
    const pickTickets = await getRecentPickTickets();
    setOrders(pickTickets);
  }

}

async function getRecentPickTickets() {
  const apiResponse = await fetch('/api/wsi/picktickets');
  return await apiResponse.json();
}

async function searchPickTicketsByOrder(orderNumber) {
  const apiResponse = await fetch(`/api/wsi/picktickets?orderNumber=${orderNumber}`);

  if (apiResponse.status === 404) {
    throw Error(`Pick tickets for order ${orderNumber} could not be found`);
  } else if (apiResponse.status >= 500) {
    throw Error('There was an error connecting to the backend');
  }

  return apiResponse.json();
}

export default OrderSearch;