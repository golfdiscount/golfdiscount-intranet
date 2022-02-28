import { NavLink } from 'react-router-dom';
import './Navbar.css'

function Navbar() {
  return (
    <div className='navbar'>
      <NavLink to=''>
        <img src='/gd_logo.png' alt='Golf Discount logo'></img>
      </NavLink>
      <NavLink className='tab navbar-tab' to='/wsi'>WSI</NavLink>
    </div>
  );
}

export default Navbar;