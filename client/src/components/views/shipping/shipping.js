/**
 * @author Harmeet Singh
 * @description Shipping view with components to verify ShipStation orders
 */

import { Routes, Route } from 'react-router-dom'
import OrderVerifier from './order-verifier/order-verifier';
import SideNavbar from '../../navigation/Side-Navbar';

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
  )
}

export default Shipping;