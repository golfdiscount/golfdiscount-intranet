import { BrowserRouter, React, Routes, Route } from 'react-router-dom';

// Components and style sheets
import 'App.css';
import Footer from 'components/Footer/Footer';
import Navbar from 'components/Navbar/Navbar';
import Home from 'views/Home/Home';
import Wsi from 'views/Wsi';
import Shipping from 'views/Shipping/Shipping';

function App() {
  return (
    <div className='app-container'>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/wsi/*' element={<Wsi />} />
          <Route path='/shipping/*' element={<Shipping />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;