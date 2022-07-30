/**
 * @author Harmeet Singh
 * @description Creates a side bar navigation with optional header
 */
import { NavLink } from 'react-router-dom';

import 'components/SideBar/SideBar.css'

function SideNavbar(props) {
  let tabs = props.tabs.map(tab => {
    return (
      <NavLink className='tab' to={tab.route} key={tab.route}>{tab.text}</NavLink>
    );
  });

  if (props.header) {
    return (
    <div className='side-bar'>
      <h1 className='side-bar-header'>{props.header}</h1>
      {tabs}
    </div>
    );
  }

  return (
    <div className='side-bar'>
      {props.header && <h2>{props.header}</h2>}
      {tabs}
    </div>
  );
}

export default SideNavbar;