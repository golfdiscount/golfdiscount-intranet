import PropTypes from 'prop-types';
import { React } from 'react';
import { Link } from 'react-router-dom';

function OrderGridEntry(props) {
  const orderNumber = props.orderNumber;
  const pickTicketNumber = props.pickTicketNumber;
  const orderDate = props.orderDate;
  const lineItemCount = props.lineItemCount;

  return (
    <tr>
      <td>{pickTicketNumber}</td>
      <td><Link to={`orders/${orderNumber}`}>{orderNumber}</Link></td>
      <td>{lineItemCount}</td>
      <td>{orderDate.toLocaleDateString()}</td>
    </tr>
  );
}
  
OrderGridEntry.propTypes = {
  lineItemCount: PropTypes.number,
  orderNumber: PropTypes.string,
  orderDate: PropTypes.instanceOf(Date),
  pickTicketNumber: PropTypes.string
};

export default OrderGridEntry;
