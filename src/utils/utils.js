// eslint-disable-next-line import/no-unresolved
import { WORKSHOP_TYPE_ID } from 'src/config-global';
import axios from './axios';


const setSession = (customer) => {
    if (customer) {
        axios.defaults.headers.customerId = customer.customer_id;
    } else {
        delete axios.defaults.headers.customerId;
    }
};

const setWorkshopTypeHeader = (currentWorkshop) => {
    if (currentWorkshop) {
        axios.defaults.headers.workshopTypeId = WORKSHOP_TYPE_ID;
    } else {
        delete axios.defaults.headers.workshopTypeId;
    }
};

const setCountryTypeHeader = (currentCountry) => {
    if (currentCountry) {
        axios.defaults.headers.countryMasterId = currentCountry.country_master_id;
        axios.defaults.headers.regionMasterId = currentCountry.region_master_id;
        axios.defaults.headers.cityMasterId = currentCountry.city_master_id;
        axios.defaults.headers.workshopTypeId = WORKSHOP_TYPE_ID;
    } else {
        delete axios.defaults.headers.countryMasterId;
        delete axios.defaults.headers.regionMasterId;
        delete axios.defaults.headers.cityMasterId;
        delete axios.defaults.headers.workshopTypeId;
    }
};

export { setSession, setWorkshopTypeHeader, setCountryTypeHeader };
