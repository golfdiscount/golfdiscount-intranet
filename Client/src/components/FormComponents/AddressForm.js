import { React, useState } from 'react'; 
import PropTypes from 'prop-types';

function AddressForm(props) {
  const [ address, setAddress ] = useState({
    name: '',
    street: '',
    city: '',
    state: '',
    country: 'US',
    zip: ''
  });

  function handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const propertyName = target.name;

    setAddress({...address, [propertyName]: value});
  }

  return (
    <fieldset className='vertical-form' disabled={props.disabled}>
      <label>
        Name:
        <input value={address.name} name='name' onChange={handleInputChange} required />
      </label>
      <label>
        Street:
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
  disabled: PropTypes.bool
};

export default AddressForm;
