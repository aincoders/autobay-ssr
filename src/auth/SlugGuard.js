import { Box } from '@mui/material';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import useApi from 'src/hooks/useApi';
import { setCountryTypeHeader } from 'src/utils/utils';
import LoadingScreen from '../components/loading-screen';
import { useSettingsContext } from '../components/settings';
import { PATH_PAGE } from '../routes/paths';
import { CUSTOMER_API, SLUG_CHECK } from '../utils/constant';
import { useAuthContext } from './useAuthContext';

SlugGuard.propTypes = {
    children: PropTypes.node,
};

export default function SlugGuard({ children }) {
    const { isInitialized, customer } = useAuthContext();
    const { push, query } = useRouter();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const { getApiData, postApiData } = useApi();
    const { onChangeCity, onChangeVehicle, currentCity } = useSettingsContext();

    const pathSegments = router.query.category || [];
    const firstSegment = pathSegments[0] ? pathSegments[0] : '';
    const secondSegment = pathSegments[1] ? pathSegments[1] : '';
    const thirdSegment = pathSegments[2] ? pathSegments[2] : '';

    async function slugCheck(path2 = '', path3 = '', path4 = '') {
        try {
            const param = { path1: query.city, path2, path3, path4 };
            const response = await getApiData(SLUG_CHECK, param);
            if (response.status === 200) {
                const data = response.data.result;
                setSlugUrl(data);
            }
        } catch (error) {
            console.log(error);
            push(`${PATH_PAGE.page404}`);
        }
    }

    async function CustomerAddVehicle(model) {
        if (model) {
            const response = await postApiData(CUSTOMER_API.addVehicle, { vehicle_model_master_id: model.vehicle_model_master_id });
        }
    }

    // set slug after check
    function setSlugUrl(data) {
        const { city_info, make_info, model_info, service_group_info, package_info } = data;
        const citySlug = data.city_info?.slug || '';
        const makeSlug = data.make_info?.vehicle_make_slug || '';
        const modelSlug = data.model_info?.vehicle_model_slug || '';
        const serviceGroupSlug = data.service_group_info?.slug_url || '';
        const packageCategorySlug = data.package_info?.package_category_slug || '';

        var getUrl = `/${citySlug}${serviceGroupSlug ? `/${serviceGroupSlug}` : ''}${packageCategorySlug ? `/${packageCategorySlug}` : ''}${modelSlug ? `/${modelSlug}` : makeSlug ? `/${makeSlug}` : ''}`;

        let pushUrl;
        if (service_group_info) {
            console.log('details');
            pushUrl = `/[city]/[...category]?packageDetailSlug=true`;
        } else if (package_info) {
            console.log('list');
            pushUrl = `/[city]/[...category]?packageCategory=true`;
        } else if (model_info && make_info) {
            console.log('home with vehicle');
            pushUrl = `/[city]/[...category]?vehicleSlug=true`;
        } else if (make_info) {
            pushUrl = `/[city]/[...category]?vehicleSlug=true`;
        } else if (city_info) {
            console.log('home');
            pushUrl = `/${city_info.slug}`;
        }

        if (city_info) {
            setCountryTypeHeader(city_info);
            onChangeCity(city_info);
        }
        if (make_info || model_info) {
            onChangeVehicle(make_info, model_info);
        }

        if (customer && model_info && make_info) {
            CustomerAddVehicle(model_info);
        }

        push(pushUrl, getUrl);
        setLoading(false);
    }

    async function verifySlug() {
        if (query.city && firstSegment && secondSegment && thirdSegment) {
            await slugCheck(firstSegment, secondSegment, thirdSegment);
        }
        else if (query.city && firstSegment && secondSegment) {
            await slugCheck(firstSegment, secondSegment);
        } else if (query.city && firstSegment) {
            await slugCheck(firstSegment);
        } else if (query.city) {
            currentCity.slug == query.city ? setLoading(false) : await slugCheck();
        }
    }

    // useEffect(() => {
    //     if (!router.isReady) return;
    //     verifySlug();
    // }, [isInitialized, router.isReady]);
   
    //  const isServer =  typeof window === 'undefined';

    
    // useEffect(() => {
    //     setTimeout(() => setLoading(false), 1000)
    //   }, []);

      
    return <>
        {children}
    </>;
}

