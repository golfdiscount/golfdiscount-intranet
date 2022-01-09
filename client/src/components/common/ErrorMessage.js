import './ErrorMessage.css';

function ErrorMessage(props) {
  return (
    <div className='error'>
      <p>Error: {props.error}</p>
    </div>
  );
}

export default ErrorMessage;