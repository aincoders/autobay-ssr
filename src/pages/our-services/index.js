import { Box } from '@mui/material';
import CustomLayoutWithoutSlug from 'src/layouts/custom/CustomLayoutWithoutSlug';
import { OurServiceProvider } from 'src/mycontext/OurServiceContext';
import { PATH_PAGE } from 'src/routes/paths';
import OurServiceItem from 'src/sections/our_service';
import { ourServiceServerProps } from 'src/server_fun';

OurServices.getLayout = (page) => <CustomLayoutWithoutSlug>{page}</CustomLayoutWithoutSlug>;
export default function OurServices({ slugData, referenceData = '' }) {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: { lg: 1 } }}>
            <OurServiceProvider props={{...slugData, ...referenceData}}>
                <OurServiceItem />
            </OurServiceProvider>
        </Box>
    );
}


export async function getServerSideProps(context) {
    try {
        let referenceData = await ourServiceServerProps(context)
        return { props: { slugData: '', referenceData } }
    }
    catch (error) {
        console.log(error)
        return { redirect: { destination: PATH_PAGE.page404, permanent: false } };
    }

}