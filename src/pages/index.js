import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import LoadingScreen from 'src/components/loading-screen/LoadingScreen';
import { CountryWithCityModal } from 'src/master';

export default function HomePage({ currentCity }) {
    const router = useRouter();

    useEffect(() => {
        if (!currentCity) {
            setCityModal(true);
        } else {
            router.push(currentCity.slug);
        }
    }, []);

    const [cityModal, setCityModal] = useState(false);
    function cityModalClose() {
    }

    if (!cityModal) {
        return <LoadingScreen />
    }

    return (
        <>
            <CountryWithCityModal open={cityModal} onClose={cityModalClose} locationCity />
        </>
    );
}


export async function getServerSideProps(context) {
    const { req } = context;
    const currentCity = req.cookies?.currentCity_v1 ? await JSON.parse(req.cookies?.currentCity_v1) : "";
    const currentVehicle = req.cookies?.currentVehicle ? await JSON.parse(req.cookies?.currentVehicle) : { make: '', model: '' };
    return { props: { currentCity, currentVehicle } };
}