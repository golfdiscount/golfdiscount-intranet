/**
 * @author Harmeet Singh
 * @description Creates a side bar navigation with optional header
 */

import './Side-Navbar.css';
import { NavLink } from 'react-router-dom';

function SideNavbar(props) {
  let tabs = props.tabs.map(tab => {
    return (
      <NavLink className='tab' to={tab.route} key={tab.route}>{tab.text}</NavLink>
    );
  });

  if (props.header) {
    return (
    <div className='side-nav'>
      <h1 className='side-nav-header'>{props.header}</h1>
      {tabs}
    </div>
    );
  }

  return (
    <div className='side-nav'>
      {props.header && <h2>{props.header}</h2>}
      {tabs}
    </div>
  );
}

export default SideNavbar;