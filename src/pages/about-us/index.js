import { Box } from '@mui/material';
import CustomLayoutWithoutSlug from 'src/layouts/custom/CustomLayoutWithoutSlug';
import { AboutProvider } from 'src/mycontext/AboutContext';
import { PATH_PAGE } from 'src/routes/paths';
import AboutUsItem from 'src/sections/about_us';
import { aboutUsServerProps } from 'src/server_fun';

AboutUs.getLayout = (page) => <CustomLayoutWithoutSlug>{page}</CustomLayoutWithoutSlug>;
export default function AboutUs({ slugData, referenceData = '' }) {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: { lg: 1 } }}>
            <AboutProvider props={{ ...slugData, ...referenceData }}>
                <AboutUsItem />
            </AboutProvider>
        </Box>
    );
}


export async function getServerSideProps(context) {
    try {
        let referenceData = await aboutUsServerProps(context)
        return { props: { slugData: '', referenceData } }
    }
    catch (error) {
        console.log(error)
        return { redirect: { destination: PATH_PAGE.page404, permanent: false } };
    }
}