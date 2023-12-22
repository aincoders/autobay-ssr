import { PATH_PAGE } from 'src/routes/paths';
import { homepageGetServerProps } from 'src/server_fun';
import axios from "src/utils/axios";
import { SLUG_CHECK } from 'src/utils/constant';
import CustomerLayout from '../../layouts/custom/CustomeMainLayout';
import { HomePageProvider } from '../../mycontext/HomePageContext';
import HomePageItem from '../../sections/home_page';


CityPage.getLayout = (page) => <CustomerLayout>{page}</CustomerLayout>;
export default function CityPage({ slugData, referenceData = '' }) {
    return (
        <HomePageProvider props={{...slugData, ...referenceData}}>
            <HomePageItem /> 
        </HomePageProvider>
    );
}

export async function getServerSideProps(context) {
    const { query,req } = context;
    const citySlug = query?.city;
    try {
        const params = { path1: citySlug, path2: '', path3: '', path4: '' };
        const response = await axios.get(SLUG_CHECK, { params });
        const data = response?.data?.result;

        const currentCity = data?.city_info || '';

        const referenceData = await homepageGetServerProps(context, currentCity)

        return { props: { slugData: data, referenceData } }
    }
    catch (error) {
        console.log(error)
        return { redirect: { destination: PATH_PAGE.page404, permanent: false } };
    }
}