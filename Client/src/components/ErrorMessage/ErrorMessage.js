import PropTypes from 'prop-types';
import { React } from 'react';

import 'components/ErrorMessage/ErrorMessage.css';

function ErrorMessage(props) {
  return (
    <div className='error'>
      <p>Error: {props.error}</p>
    </div>
  );
}

ErrorMessage.propTypes = {
  error: PropTypes.string
};

export default ErrorMessage;