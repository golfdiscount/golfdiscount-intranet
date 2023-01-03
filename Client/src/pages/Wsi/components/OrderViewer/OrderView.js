import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'

import LoadingSpinner from 'components/LoadingSpinner';

import 'pages/Wsi/components/OrderViewer/OrderViewer.css'

function OrderView() {
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
                <PickTicketView pickTicket={currentPickTicket} key={currentPickTicket.pickTicketNumber}/>
            </div>
        </div>
    );
}

function OrderNavBar(props) {
    const labels = props.labels;
    const setState = props.setState;
    const [currentLabel, setCurrentLabel] = useState(labels[0]);

    function updateLabelStates(newLabel) {
        setCurrentLabel(newLabel);
        setState(newLabel)
    }

    const labelDivs = labels.map(label => {
        if (currentLabel === label) {
            return <div key={label} className='selected' onClick={e => updateLabelStates(e.target.textContent)}>{label}</div>
        }

        return <div key={label} onClick={e => updateLabelStates(e.target.textContent)}>{label}</div>
    });

    return (
        <nav className='order-nav-bar'>
            {labelDivs}
        </nav>
    )
}

function PickTicketView(props) {
    const pickTicket = props.pickTicket;
    const orderDate = new Date(pickTicket.orderDate)
    const orderCreationDate = new Date(pickTicket.createdAt);
    return (
        <div>
            <div>
                <p>Order Date: {orderDate.toLocaleDateString()}</p>
                <p>WSI Order Creation Date: {orderCreationDate.toLocaleString()}</p>
                <p>Shipping Method: {pickTicket.shippingMethod}</p>

            </div>
            <div className='horizontal-flex address-container'>
                <div>
                    <h2>Customer</h2>
                    <Address address={pickTicket.customer} />
                </div>
                <div>
                    <h2>Recipient</h2>
                    <Address address={pickTicket.recipient} />
                </div>
            </div>
            <h2>Products</h2>
            {pickTicket.lineItems.map(lineItem => {
                return <Product product={lineItem} key={lineItem.sku}/>
            })}
        </div>
    )
}

/**
 * Component with address information
 * @param {Object} props Contains information to make a complete address
 * @returns JSX React element with address information
 */
function Address(props) {
    const address = props.address
    return (
      <div>
        <p>Name: {address.name}</p>
        <p>Street: {address.street}</p>
        <p>City: {address.city}</p>
        <p>State: {address.state}</p>
        <p>Zip Code: {address.zip}</p>
        <p>Country: {address.country}</p>
      </div>
    );
}

function Product(props) {
    const productInfo = props.product;

    return (
        <div>
            <h3>{productInfo.sku}</h3>
            <h4>{productInfo.name}</h4>
            <p>Quantity Ordered: {productInfo.units}</p>
            <hr></hr>
        </div>
    )
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

export default OrderView;
