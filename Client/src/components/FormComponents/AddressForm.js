import React from 'react'; 
import PropTypes from 'prop-types';

function AddressForm(props) {
  const address = props.address;
  const setAddress = props.setAddress;

  function handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const propertyName = target.name;

    const newAddress = address;
    newAddress[propertyName] = value;
    setAddress(newAddress);
  }

  return (
    <fieldset className='vertical-form' disabled={props.disabled}>
      <label>
                Name:
        <input value={address.name} name='name' onChange={handleInputChange} required />
      </label>
      <label>
                Address:
        <input value={address.street} name='street' onChange={handleInputChange} required/>
      </label>
      <label>
                City:
        <input value={address.city} name='city' onChange={handleInputChange} required/>
      </label>
      <label>
                State:
        <input value={address.state} name='state' onChange={handleInputChange} required/>
      </label>
      <label>
                Country:
        <input value={address.country} name='country' onChange={handleInputChange} required/>
      </label>
      <label>
                Zip Code:
        <input value={address.zip} name='zip' onChange={handleInputChange} required/>
      </label>
    </fieldset>
  );
}

AddressForm.propTypes = {
  address: PropTypes.shape({
    name: PropTypes.string,
    street: PropTypes.string,
    city: PropTypes.string,
    state: PropTypes.string,
    country: PropTypes.string,
    zip: PropTypes.string
  }),
  setAddress: PropTypes.func,
  disabled: PropTypes.bool
};

export default AddressForm;
