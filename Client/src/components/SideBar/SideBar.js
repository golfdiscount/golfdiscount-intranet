import { React } from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';

import 'components/SideBar/SideBar.css';

function SideBar(props) {
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

SideBar.propTypes = {
  tabs: PropTypes.array,
  header: PropTypes.string
};

export default SideBar;