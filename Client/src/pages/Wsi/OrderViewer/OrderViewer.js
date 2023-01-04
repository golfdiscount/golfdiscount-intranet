import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ErrorMessage from 'components/ErrorMessage/ErrorMessage';
import LoadingSpinner from 'components/LoadingSpinner';

/**
 * OrderViewer component with form for searching and order information
 * @returns OrderViewer component
 */
function OrderViewer() {
  const [recentOrders, setRecentOrders] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState();
  const navigate = useNavigate();

  // Load recent orders from the WSI API
  useEffect(() => {
    async function fetchData() {
      const apiResonse = await fetch(`/api/wsi/orders`);
      const recentPickTickets = await apiResonse.json();

      // A map of order numbers to an array of their pick tickets
      const orderMap = new Map();

      recentPickTickets.forEach(pickTicket => {
        if (!orderMap.has(pickTicket.orderNumber)) {
          orderMap.set(pickTicket.orderNumber, [])
        }

        orderMap.get(pickTicket.orderNumber).push(pickTicket);
      });

      setRecentOrders(orderMap);
      setLoaded(true);
    }

    fetchData();
  }, []);

  if (!loaded) {
    return <LoadingSpinner />
  }

  return (
    <div className='tab-content'>
      {error}
      <div className='tab-inner-content'>
        <h1>Order Number</h1>
        <form onSubmit={async e => { await getOrder(e, navigate, setError);}}>
          <input required type='text' name='orderNumber'/>
          <button type='submit'>Submit</button>
        </form>
        <h1>Recent Orders</h1>
        <OrderGrid recentOrders={recentOrders}/>
      </div>
    </div>

  );
}

function OrderGrid(props) {
  const recentOrders = props.recentOrders;
  const orderGridEntries = [];
  
  recentOrders.forEach((pickTickets, orderNumber) => {
    const orderDate = pickTickets[0].orderDate;

    orderGridEntries.push({
      orderNumber: orderNumber,
      orderDate: new Date(orderDate + 'Z'), // Add Z to indicate UTC time
      pickTicketCount: pickTickets.length
    });
  });

  orderGridEntries.sort((a, b) => a.orderDate > b.orderDate ? 0 : 1);

  return (
    <table>
      <thead>
        <tr>
          <th>Order Number</th>
          <th>Order Date</th>
          <th>Pick Ticket Count</th>
        </tr>
      </thead>
      <tbody>
        {orderGridEntries.map(entry => <OrderGridEntry key={entry.orderNumber} orderNumber={entry.orderNumber} orderDate={entry.orderDate} pickTicketCount={entry.pickTicketCount}/>)}
      </tbody>
    </table>
  )
}

function OrderGridEntry(props) {
  const orderNumber = props.orderNumber;
  const orderDate = props.orderDate;
  const pickTicketCount = props.pickTicketCount;

  return (
    <tr>
      <td><Link to={`orders/${orderNumber}`}>{orderNumber}</Link></td>
      <td>{orderDate.toLocaleDateString()}</td>
      <td>{pickTicketCount}</td>
    </tr>
  )
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
    navigate(`orders/${orderNumber}`)
  } else if (apiResponse.status === 404) {
    setError(<ErrorMessage error={`Order ${orderNumber} not found`} />);
  } else {
    setError(<ErrorMessage error={apiResponse.statusText} />);
  }
}

export default OrderViewer;