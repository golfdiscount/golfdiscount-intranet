import PropTypes from 'prop-types';
import { React, useState } from 'react';

function OrderNavBar(props) {
  const labels = props.labels;
  const setState = props.setState;
  const [currentLabel, setCurrentLabel] = useState(labels[0]);

  function updateLabelStates(newLabel) {
    setCurrentLabel(newLabel);
    setState(newLabel);
  }

  const labelDivs = labels.map(label => {
    if (currentLabel === label) {
      return <div key={label} className='selected' onClick={e => updateLabelStates(e.target.textContent)}>{label}</div>;
    }

    return <div key={label} onClick={e => updateLabelStates(e.target.textContent)}>{label}</div>;
  });

  return (
    <nav className='order-nav-bar'>
      {labelDivs}
    </nav>
  );
}

OrderNavBar.propTypes = {
  labels: PropTypes.array,
  setState: PropTypes.func
};

export default OrderNavBar;
