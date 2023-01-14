import PropTypes from 'prop-types';
import { React } from 'react';

import OrderGridEntry from './OrderGridEntry';

function OrderGrid(props) {
  const orders = props.orders.sort((a, b) => a.orderDate > b.orderDate ? 0 : 1);
  const orderGridEntries = orders.map(pickTicket => {
    const pickTicketNumber = pickTicket.pickTicketNumber;
    const orderNumber = pickTicket.orderNumber;
    const orderDate = new Date(pickTicket.orderDate + 'Z');
    const lineItemCount = pickTicket.lineItems.length;

    return <OrderGridEntry key={pickTicketNumber} 
      pickTicketNumber={pickTicketNumber} 
      orderNumber={orderNumber} 
      orderDate={orderDate}
      lineItemCount={lineItemCount}/>;
  });


  return (
    <table>
      <thead>
        <tr>
          <th>Pick Ticket Number</th>
          <th>Order Number</th>
          <th>Line Item Count</th>
          <th>Order Date</th>
        </tr>
      </thead>
      <tbody>
        {orderGridEntries}
      </tbody>
    </table>
  );
}

OrderGrid.propTypes = {
  orders: PropTypes.array
};

export default OrderGrid;
