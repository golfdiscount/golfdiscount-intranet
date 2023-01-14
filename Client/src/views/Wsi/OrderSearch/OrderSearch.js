import { React, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import ErrorMessage from 'components/ErrorMessage/ErrorMessage';
import LoadingSpinner from 'components/LoadingSpinner';
import OrderGrid from './OrderGrid';

/**
 * OrderViewer component with form for searching and order information
 * @returns OrderViewer component
 */
function OrderSearch() {
  const [recentOrders, setRecentOrders] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState();
  const navigate = useNavigate();

  // Load recent orders from the WSI API
  useEffect(() => {
    async function fetchData() {
      const apiResonse = await fetch('/api/wsi/orders');
      const recentPickTickets = await apiResonse.json();

      setRecentOrders(recentPickTickets);
      setLoaded(true);
    }

    fetchData();
  }, []);

  if (!loaded) {
    return <LoadingSpinner />;
  }

  return (
    <div className='tab-content'>
      {error}
      <div className='tab-inner-content'>
        <h1>Orders</h1>
        <form onSubmit={async e => { await getOrder(e, navigate, setError); }}>
          <input required type='text' name='orderNumber'/>
          <button type='submit'>Submit</button>
        </form>
        <OrderGrid orders={recentOrders}/>
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
async function getOrder(event, navigate, setError) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const orderNumber = formData.get('orderNumber');
  const apiResponse = await fetch(`/api/wsi/orders/${orderNumber}`);

  if (apiResponse.status === 200) {
    navigate(`orders/${orderNumber}`);
  } else if (apiResponse.status === 404) {
    setError(<ErrorMessage error={`Order ${orderNumber} not found`} />);
  } else {
    setError(<ErrorMessage error={apiResponse.statusText} />);
  }
}

export default OrderSearch;
