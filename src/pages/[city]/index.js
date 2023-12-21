import axios from 'axios';
import { setCookie } from 'cookies-next';
import { PATH_PAGE } from 'src/routes/paths';
import CustomerLayout from '../../layouts/custom/CustomeMainLayout';
import { HomePageProvider } from '../../mycontext/HomePageContext';
import HomePageItem from '../../sections/home_page';


CityPage.getLayout = (page) => <CustomerLayout>{page}</CustomerLayout>;
export default function CityPage({ slugData, referenceData = '' }) {

    console.log(slugData)
    console.log(referenceData)

    return (
        <HomePageProvider props={{ ...slugData, ...referenceData }}>
            <HomePageItem />
        </HomePageProvider>
    );
}


export async function getServerSideProps(context) {
    const { query, req, res } = context;
    const citySlug = query?.city;
    try {
        const params = { path1: citySlug, path2: '', path3: '', path4: '' };
        const response = await axios.get('http://localhost:7212/api/ssr_function/homePage/', { params });
        const data = response?.data?.result;

        setCookie('currentCity_v1', data?.currentCity, { req, res, maxAge: 31536000 });
        setCookie('currentVehicle', data?.currentVehicle, { req, res, maxAge: 31536000 });

        return { props: { slugData: data, referenceData: data } }
    }
    catch (error) {
        console.log(error)
        return { redirect: { destination: PATH_PAGE.page404, permanent: false } };
    }
}

