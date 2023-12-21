import CustomLayoutWithoutSlug from 'src/layouts/custom/CustomLayoutWithoutSlug';
import { PATH_PAGE } from 'src/routes/paths';
import RequestQuoteItem from 'src/sections/request_quote';
import { requestQuoteServerProps } from 'src/server_fun';

RequestQuote.getLayout = (page) => <CustomLayoutWithoutSlug>{page}</CustomLayoutWithoutSlug>;

export default function RequestQuote({ slugData, referenceData = '' }) {
    return (
        <>
            <RequestQuoteItem props={{ ...slugData, ...referenceData }} />
        </>
    );
}


export async function getServerSideProps(context) {
    try {
        let referenceData = await requestQuoteServerProps(context)
        return { props: { slugData: '', referenceData } }
    }
    catch (error) {
        console.log(error)
        return { redirect: { destination: PATH_PAGE.page404, permanent: false } };
    }
}