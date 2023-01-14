import PropTypes from 'prop-types';
import { React } from 'react';

/**
 * Component with address information
 * @param {Object} props Contains information to make a complete address
 * @returns JSX React element with address information
 */
function Address(props) {
  const address = props.address;
  return (
    <div>
      <p>Name: {address.name}</p>
      <p>Street: {address.street}</p>
      <p>City: {address.city}</p>
      <p>State: {address.state}</p>
      <p>Zip Code: {address.zip}</p>
      <p>Country: {address.country}</p>
    </div>
  );
}

Address.propTypes = {
  address: PropTypes.object
};

export default Address;
