import './OrderViewer.css';

function OrderViewer() {
  return (
    <div className='tab-content'>
      <h1>Order Search</h1>
      <form>
        <fieldset>
          <label htmlFor='order-num'>Order Number:</label>
          <input required type='text' />
          <button type='submit'>Submit</button>
        </fieldset>
      </form>
    </div>
  );
}

export default OrderViewer;