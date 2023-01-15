import { React, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import LoadingSpinner from 'components/LoadingSpinner';
import PickTicket from './PickTicket';

function Order() {
  const params = useParams();

  const [pickTicket, setPickTicket] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const pickTicketNumber = params.pickTicketNumber;

  useEffect(() => {
    async function fetchData() {
      const pickTicket = await getPickTicket(pickTicketNumber);

      await Promise.all(pickTicket.lineItems.map(async lineItem => {
        const productInfo = await getProductInfo(lineItem.sku);
        lineItem.name = productInfo.name;
      }));

      if (!loaded) {
        setPickTicket(pickTicket);
        setLoaded(true);
      }
    }

    fetchData();
  }, [pickTicketNumber, loaded]);

  if (!loaded) {
    return <LoadingSpinner />;
  }

  return (
    <div className='tab-content'>
      <div className='tab-inner-content'>
        <h1>{pickTicketNumber}</h1>
        <PickTicket pickTicket={pickTicket} key={pickTicket.pickTicketNumber}/>
      </div>
    </div>
  );
}

/**
 * Queries the backend to get the pick tickets for a given order
 * @param {string} orderNumber Order to get information for
 * @returns {Promise<Array<Object>>} List of pick tickets for this order
 */
async function getPickTicket(pickTicketNumber) {
  const apiResponse = await fetch(`/api/wsi/picktickets/${pickTicketNumber}`);

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
