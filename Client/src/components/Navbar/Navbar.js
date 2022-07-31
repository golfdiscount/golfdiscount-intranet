/**
 * A navigation bar linking to other pages in the SPA
 * @author Harmeet Singh
 */
import { NavLink } from 'react-router-dom';

import 'components/Navbar/Navbar.css';

function Navbar() {
  return (
    <div className='navbar'>
      <NavLink to=''>
        <img src='/gd_logo.png' alt='Golf Discount logo'></img>
      </NavLink>
      <NavLink className='tab navbar-tab' to='/wsi'>WSI</NavLink>
      <NavLink className='tab navbar-tab' to='/shipping'>Shipping</NavLink>
    </div>
  );
}

export default Navbar;