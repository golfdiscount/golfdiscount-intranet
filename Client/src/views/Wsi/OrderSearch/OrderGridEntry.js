import PropTypes from 'prop-types';
import { React } from 'react';
import { Link } from 'react-router-dom';

function OrderGridEntry(props) {
  const orderNumber = props.orderNumber;
  const pickTicketNumber = props.pickTicketNumber;
  const orderCreationDate = props.orderCreationDate;
  const orderDate = props.orderDate;
  const lineItemCount = props.lineItemCount;

  return (
    <tr>
      <td><Link to={`picktickets/${pickTicketNumber}`}>{pickTicketNumber}</Link></td>
      <td>{orderNumber}</td>
      <td>{lineItemCount}</td>
      <td>{orderDate.toLocaleDateString()}</td>
      <td>{orderCreationDate.toLocaleString()}</td>
    </tr>
  );
}
  
OrderGridEntry.propTypes = {
  lineItemCount: PropTypes.number,
  orderNumber: PropTypes.string,
  orderDate: PropTypes.instanceOf(Date),
  orderCreationDate: PropTypes.instanceOf(Date),
  pickTicketNumber: PropTypes.string
};

export default OrderGridEntry;
