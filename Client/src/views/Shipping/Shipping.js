import { React, Routes, Route } from 'react-router-dom';
import OrderVerifier from 'views/Shipping/components/OrderVerifier/OrderVerifier';
import SideNavbar from 'components/SideBar/SideBar';

function Shipping() {
  let tabs = [
    {text: 'Order Verification', route: '/shipping'}
  ];

  return (
    <main>
      <SideNavbar tabs={tabs} />
      <Routes>
        <Route path='' element={<OrderVerifier />} />
      </Routes>
    </main>
  );
}

export default Shipping;