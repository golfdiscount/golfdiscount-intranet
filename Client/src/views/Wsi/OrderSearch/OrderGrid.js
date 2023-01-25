import PropTypes from 'prop-types';
import { React } from 'react';

import OrderGridEntry from './OrderGridEntry';

import './OrderGrid.css';

function OrderGrid(props) {
  const pageNumber = props.pageNumber;
  const setPageNumber = props.setPageNumber;
  const pageSize = props.pageSize;

  const orders = props.orders.sort((a, b) => a.createdAt > b.createdAt ? 0 : 1);
  const orderGridEntries = orders.map(pickTicket => {
    const pickTicketNumber = pickTicket.pickTicketNumber;
    const orderNumber = pickTicket.orderNumber;
    const orderDate = new Date(pickTicket.orderDate + 'Z');
    const orderCreationDate = new Date(pickTicket.createdAt + 'Z');
    const lineItemCount = pickTicket.lineItems.length;

    return <OrderGridEntry key={pickTicketNumber} 
      pickTicketNumber={pickTicketNumber} 
      orderNumber={orderNumber} 
      orderDate={orderDate}
      lineItemCount={lineItemCount}
      orderCreationDate={orderCreationDate}/>;
  });

  return (
    <div>
      <div className='pagination-nav'>
        <button type='button' disabled={pageNumber == 1} onClick={(e) => updatePageNumber(e, pageNumber - 1, setPageNumber)}>Prev</button>
        <p>{pageNumber}</p>
        <button type='buton' disabled={!(pageSize == orders.length)} onClick={(e) => updatePageNumber(e, pageNumber + 1, setPageNumber)}>Next</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Pick Ticket Number</th>
            <th>Order Number</th>
            <th>Line Item Count</th>
            <th>Order Date</th>
            <th>WSI Order Creation Time</th>
          </tr>
        </thead>
        <tbody>
          {orderGridEntries}
        </tbody>
      </table>
    </div>
  );
}

function updatePageNumber(e, pageNumber, setPageNumber) {
  e.preventDefault();

  if (pageNumber > 0) {
    setPageNumber(pageNumber);
  }
}

OrderGrid.propTypes = {
  orders: PropTypes.array,
  pageNumber: PropTypes.number,
  setPageNumber: PropTypes.func,
  pageSize: PropTypes.number
};

export default OrderGrid;
