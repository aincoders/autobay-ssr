import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useSettingsContext } from 'src/components/settings';
import useApi from 'src/hooks/useApi';
import { PATH_PAGE } from 'src/routes/paths';
import { SLUG_CHECK } from './constant';
import { setCountryTypeHeader } from './utils';

const withRouteChange = (WrappedComponent) => (props) => {
	const router = useRouter();
	const { onChangeCity, onChangeVehicle, } = useSettingsContext();
	const { getApiData, } = useApi();
	const { push, query } = useRouter();

	async function slugCheck(params) {
		try {
			const response = await getApiData(SLUG_CHECK, params);
			if (response.status === 200) {
				const data = response.data.result;
				setSlugUrl(data);
			}
		} catch (error) {
			console.log(error);
			push(`${PATH_PAGE.page404}`);
		}
	}

	// set slug after check
	function setSlugUrl(data) {
		const { city_info, make_info, model_info, service_group_info, package_info } = data;
		if (city_info) {
			setCountryTypeHeader(city_info);
			onChangeCity(city_info);
		}
		if (make_info || model_info) {
			onChangeVehicle(make_info, model_info);
		}
		// if (customer && model_info && make_info) {
		//     CustomerAddVehicle(model_info);
		// }
	}

	async function verifySlug(pathSegments) {
		if (pathSegments.length) {
			const data = Object.fromEntries(pathSegments.map((item, index) => [`path${index + 1}`, item]));
			slugCheck(data)
		}
	}

	useEffect(() => {
		const handleRouteChange = (url) => {
			const pathSegments = url.split('/').filter((item) => item) || [];
			verifySlug(pathSegments)
		};
		router.events.on('routeChangeComplete', handleRouteChange);
		return () => {
			router.events.off('routeChangeComplete', handleRouteChange);
		};
	}, []);

	return (
		<WrappedComponent {...props} />
	);
};

export default withRouteChange;
