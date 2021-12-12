import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Components and style sheets
import './App.css';
import Navbar from './components/navigation/Navbar';
import SideNavbar from './components/navigation/Side-Navbar';
import Footer from './components/navigation/Footer';
import OrderCreator from './components/order-creation/OrderCreator';
import OrderViewer from './components/order-viewer/OrderViewer';
import OrderAnalytics from './components/order-analytics/OrderAnalytics';

function App() {
  return (
    <div className='app-container'>
      <Navbar />
      <div className='main-content'>
        <BrowserRouter>
          <SideNavbar />
          <Routes>
            <Route path='/' element={<OrderViewer />} />
            <Route path='/order-creator' element={<OrderCreator />} />
            <Route path='/order-analytics' element={<OrderAnalytics />} />
          </Routes>
        </BrowserRouter>
      </div>
      <Footer />
    </div>
  );
}

export default App;
