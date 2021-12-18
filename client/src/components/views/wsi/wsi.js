/**
 * @author Harmeet Singh
 * @description WSI view with components to view and create orders as well as WSI analytics
 */
import { Routes, Route } from 'react-router-dom';
import OrderCreator from './order-creation/OrderCreator';
import OrderViewer from './order-viewer/OrderViewer';
import OrderAnalytics from './order-analytics/OrderAnalytics';
import SideNavbar from '../../navigation/Side-Navbar';

function Wsi() {
  let tabs = [
    {text: 'Order Viewer', route: '/wsi'},
    {text: 'Order Creator', route: '/wsi/order-creator'},
    {text: 'Order Analytics', route: '/wsi/order-analytics'}
  ];

  return (
    <div className='main-content'>
      <SideNavbar tabs={tabs} />
      <Routes>
        <Route path='' element={<OrderViewer />} />
        <Route path='order-creator' element={<OrderCreator />} />
        <Route path='order-analytics' element={<OrderAnalytics />} />
      </Routes>
    </div>
  );
}

export default Wsi;