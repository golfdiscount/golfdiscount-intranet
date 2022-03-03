import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Components and style sheets
import './App.css';
import Navbar from './components/navigation/Navbar';
import Footer from './components/navigation/Footer';
import Landing from './components/views/landing';
import Wsi from './components/views/wsi/wsi';
import Shipping from './components/views/shipping/shipping';

function App() {
  return (
    <div className='app-container'>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='*' element={<Landing />} />
          <Route path='/wsi/*' element={<Wsi />} />
          <Route path='/shipping/*' element={<Shipping />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;