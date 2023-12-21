import { Box, Container, Grid } from '@mui/material';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useSettingsContext } from 'src/components/settings';
import { SPACING } from 'src/config-global';
import { META_TAG } from 'src/utils/constant';
import ReviewQuote from './ReviewQuote';

const QuoteForm = dynamic(() => import('./QuoteForm'), { ssr: false })


export default function ContactUs({ props }) {
    const { currentCity, currentVehicle } = useSettingsContext();
    const seoInfo = props?.seoInfo || '';


    const replaceString = (value = '') => value.replace(/\$(CITY_NAME|MAKE_NAME|MODEL_NAME)/g, match => ({
        $CITY_NAME: currentCity?.city_name || '',
        $MAKE_NAME: currentVehicle.make?.vehicle_make_name || '',
        $MODEL_NAME: currentVehicle.model?.vehicle_model_name || '',
    })[match]);
    return (
        <>
            <Head>
                <title>{replaceString(seoInfo.title ? seoInfo.title : META_TAG.requestQuoteTitle)}</title>
                <meta name="description" content={replaceString(seoInfo.description ? seoInfo.title : META_TAG.requestQuoteDesc)} />
                <meta property="og:title" content={replaceString(seoInfo.title ? seoInfo.title : META_TAG.requestQuoteTitle)} />
                <meta property="og:description" content={replaceString(seoInfo.description ? seoInfo.title : META_TAG.requestQuoteDesc)} />
            </Head>
            <Container maxWidth={'xl'}>
                <Box sx={{ py: { xs: SPACING.xs, md: SPACING.md } }}>
                    <Grid container spacing={3} rowSpacing={3} alignItems='flex-start'>
                        <Grid item xs={12} md={5}>
                            <QuoteForm />
                        </Grid>
                        {/* <Grid item xs={12} md={6}>
                            <ContactMap />
                        </Grid> */}
                        <Grid item xs={12} md={6}>
                            <ReviewQuote reviewList={props?.reviewList} />
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </>
    );
}
