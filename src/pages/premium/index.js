import MilesLayout from 'src/layouts/custom/MilesLayout';
import { MilesProvider } from 'src/mycontext/MilesContext';
import MilesPageItem from 'src/sections/miles';
import { milesServerProps } from 'src/server_fun';

MilesPage.getLayout = (page) => <MilesLayout>{page}</MilesLayout>;

export default function MilesPage({ slugData, referenceData = '' }) {
    return (
        <MilesProvider props={{ ...slugData, ...referenceData }}>
            <MilesPageItem />
        </MilesProvider>
    );
}

export async function getServerSideProps(context) {
    try {
        let referenceData = await milesServerProps(context)
        return { props: { slugData: '', referenceData } }
    }
    catch (error) {
        console.log(error)
        return { redirect: { destination: PATH_PAGE.page404, permanent: false } };
    }
}