class AddressModel {
    name;
    street;
    city;
    state;
    country;
    zip;

    constructor (name, street, city, state, country, zip) {
        this.name = name;
        this.street = street;
        this.city = city;
        this.state = state;
        this.country = country;
        this.zip = zip;
    }
}

export default AddressModel;
