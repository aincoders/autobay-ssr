import CustomLayoutWithoutSlug from 'src/layouts/custom/CustomLayoutWithoutSlug';
import { PATH_PAGE } from 'src/routes/paths';
import ContactUsItem from 'src/sections/contact';
import { contactUsServerProps } from 'src/server_fun';

ContactUs.getLayout = (page) => <CustomLayoutWithoutSlug>{page}</CustomLayoutWithoutSlug>;

export default function ContactUs({ slugData, referenceData = '' }) {
    return (
        <>
            <ContactUsItem props={{ ...slugData, ...referenceData }} />
        </>
    );
}


export async function getServerSideProps(context) {
    try {
        let referenceData = await contactUsServerProps(context)
        return { props: { slugData: '', referenceData } }
    }
    catch (error) {
        console.log(error)
        return { redirect: { destination: PATH_PAGE.page404, permanent: false } };
    }
}