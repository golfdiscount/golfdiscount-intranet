import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Components and style sheets
import 'App.css';
import Footer from 'components/Footer/Footer';
import Navbar from 'components/Navbar/Navbar';
import Landing from 'pages/Landing/Landing';
import Wsi from 'pages/Wsi';
import Shipping from 'pages/Shipping/Shipping';

function App() {
  return (
    <div className='app-container'>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/' element={<Landing />} />
          <Route path='/wsi/*' element={<Wsi />} />
          <Route path='/shipping/*' element={<Shipping />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;