import PropTypes from 'prop-types';
import { React } from 'react';

import './SuccessMessage.css';

function SuccessMessage(props) {
  return (
    <div className='success'>
      <p>{props.message}</p>
    </div>
  );
}

SuccessMessage.propTypes = {
  message: PropTypes.string
};

export default SuccessMessage;
