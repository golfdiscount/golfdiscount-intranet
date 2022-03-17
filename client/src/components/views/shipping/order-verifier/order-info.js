function OrderInfo(props) {
  let orderDate = new Date(props.date);
  return (
    <div>
      <h2>Order Info</h2>
      <p>Order Number: {props.number}</p>
      <p>Order Date: {orderDate.toISOString().substring(0, 10)}</p>
      <p>Email: {props.email}</p>
    </div>
  );
}

export default OrderInfo;