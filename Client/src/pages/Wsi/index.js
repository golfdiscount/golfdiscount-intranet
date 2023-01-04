/**
 * @author Harmeet Singh
 * @description WSI view with components to view and create orders as well as WSI analytics
 */
import { Routes, Route } from 'react-router-dom';

import OrderCreator from 'pages/Wsi/OrderCreator/OrderCreator';
import OrderViewer from 'pages/Wsi/OrderViewer/OrderViewer';
import Order from 'pages/Wsi/OrderViewer/Order';
import SideNavbar from 'components/SideBar/SideBar';

function Wsi() {
  let tabs = [
    {text: 'Order Viewer', route: '/wsi'},
    {text: 'Order Creator', route: '/wsi/order-creator'}
  ];

  return (
    <main>
      <SideNavbar tabs={tabs} />
      <Routes>
        <Route path='' element={<OrderViewer />} />
        <Route path='order-creator' element={<OrderCreator />} />
        <Route path='orders/:orderNumber' element={<Order />}/>
      </Routes>
    </main>
  );
}

export default Wsi;