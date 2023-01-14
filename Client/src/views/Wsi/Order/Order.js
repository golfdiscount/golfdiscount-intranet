import { React, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import LoadingSpinner from 'components/LoadingSpinner';
import OrderNavBar from './OrderNavBar';
import PickTicket from './PickTicket';

function Order() {
  const params = useParams();

  const [pickTickets, setPickTickets] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [currentPickTicketNumber, setCurrentPickTicketNumber] = useState(null);

  const orderNumber = params.orderNumber;

  useEffect(() => {
    async function fetchData() {
      const pickTickets = await getPickTickets(orderNumber);

      await Promise.all(pickTickets.map(async pickTicket => {
        await Promise.all(pickTicket.lineItems.map(async lineItem => {
          const productInfo = await getProductInfo(lineItem.sku);
          lineItem.name = productInfo.name;
        }));
      }));

      if (!loaded) {
        setPickTickets(pickTickets);
        setCurrentPickTicketNumber(pickTickets[0].pickTicketNumber);
        setLoaded(true);
      }
    }

    fetchData();
  }, [orderNumber, loaded]);

  if (!loaded) {
    return <LoadingSpinner />;
  }

  const currentPickTicket = pickTickets.find(pickTicket => pickTicket.pickTicketNumber === currentPickTicketNumber);

  return (
    <div className='tab-content'>
      <div className='tab-inner-content'>
        <h1>{orderNumber}</h1>
        <OrderNavBar labels={pickTickets.map(pickTicket => pickTicket.pickTicketNumber)} setState={setCurrentPickTicketNumber}/>
        <PickTicket pickTicket={currentPickTicket} key={currentPickTicket.pickTicketNumber}/>
      </div>
    </div>
  );
}

/**
 * Queries the backend to get the pick tickets for a given order
 * @param {string} orderNumber Order to get information for
 * @returns {Promise<Array<Object>>} List of pick tickets for this order
 */
async function getPickTickets(orderNumber) {
  const apiResponse = await fetch(`/api/wsi/orders/${orderNumber}`);

  if (apiResponse.status === 404) {
    return null;
  }

  if (!apiResponse.ok) {
    throw new Error(apiResponse.statusText);
  }

  return apiResponse.json();
}

/**
 * Queries the backend to get product information for a SKU
 * @param {string} productSku SKU to get information for
 * @returns {Promise<Object>} Product information from the database, null if it cannot be found
 */
async function getProductInfo(productSku) {
  const apiResponse = await fetch(`/api/magento/products/${productSku}`);

  if (apiResponse.status === 404) {
    return null;
  }

  if (!apiResponse.ok) {
    throw new Error(apiResponse.statusText);
  }

  return apiResponse.json();
}

export default Order;
