/**
 * An error message that spans the width of its parent container
 * @author Harmeet Singh
 */

import 'components/ErrorMessage/ErrorMessage.css';

function ErrorMessage(props) {
  return (
    <div className='error'>
      <p>Error: {props.error}</p>
    </div>
  );
}

export default ErrorMessage;