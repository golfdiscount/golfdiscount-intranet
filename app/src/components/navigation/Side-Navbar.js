import './Side-Navbar.css';
import { NavLink } from 'react-router-dom';

function SideNavbar() {
  return (
    <div className='side-nav'>
      <NavLink className='tab' to='/'>Order Viewer</NavLink>
      <NavLink className='tab' to='/order-creator'>Order Creator</NavLink>
      <NavLink className='tab' to='/order-analytics'>Order Analytics</NavLink>
    </div>
  )
}

export default SideNavbar;