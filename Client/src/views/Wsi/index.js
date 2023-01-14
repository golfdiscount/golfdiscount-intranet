import { React, Routes, Route } from 'react-router-dom';

import OrderCreator from './OrderCreator/OrderCreator';
import OrderSearch from './OrderSearch/OrderSearch';
import Order from 'views/Wsi/Order/Order';
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
        <Route path='' element={<OrderSearch />} />
        <Route path='order-creator' element={<OrderCreator />} />
        <Route path='orders/:orderNumber' element={<Order />}/>
      </Routes>
    </main>
  );
}

export default Wsi;
