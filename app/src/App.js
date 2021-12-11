import './App.css';
import Navbar from './components/navigation/Navbar';
import SideNavbar from './components/navigation/Side-Navbar';
import Footer from './components/navigation/Footer';

function App() {
  return (
    <div className='app-container'>
      <Navbar />
      <div className='main-content'>
        <SideNavbar />
      </div>
      <Footer />
    </div>
  );
}

export default App;
