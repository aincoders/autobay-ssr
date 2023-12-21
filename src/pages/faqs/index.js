import { ExpandMore } from '@mui/icons-material';
import { AccordionDetails, Box, Card, Collapse, Container, Grid, Skeleton, Typography } from '@mui/material';
import { t } from 'i18next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { SPACING } from 'src/config-global';
import useResponsive from 'src/hooks/useResponsive';
import CustomLayoutWithoutSlug from 'src/layouts/custom/CustomLayoutWithoutSlug';
import { PATH_PAGE } from 'src/routes/paths';
import { faqServerProps } from 'src/server_fun';
import { META_TAG } from 'src/utils/constant';

Faq.getLayout = (page) => <CustomLayoutWithoutSlug>{page}</CustomLayoutWithoutSlug>;

export default function Faq({ slugData, referenceData = '' }) {
    const [loading, setLoading] = useState(true);

    const isDesktop = useResponsive('up', 'lg');

    const faqList = referenceData?.faqList || [];
    const currentCity = referenceData?.currentCity || "";
    const currentVehicle = referenceData?.currentVehicle || "";

    useEffect(() => {
        setLoading(false)
    }, [referenceData])


    const replaceString = (value = '') => value.replace(/\$(CITY_NAME|MAKE_NAME|MODEL_NAME)/g, match => ({
        $CITY_NAME: currentCity?.city_name || '',
        $MAKE_NAME: currentVehicle.make?.vehicle_make_name || '',
        $MODEL_NAME: currentVehicle.model?.vehicle_model_name || '',
    })[match]);


    const [open, setOpen] = useState(false);

    // if (loading) {
    //     return <LoadingScreen isDashboard sx={{ position: 'absolute' }} />;
    // }


    return (
        <>
            <Head>
                <title> {META_TAG.faqTitle}</title>
                <meta name="description" content={META_TAG.faqDesc} />
                <meta property="og:title" content={META_TAG.faqTitle} />
                <meta property="og:description" content={META_TAG.faqDesc} />
            </Head>

            <Container maxWidth={'lg'}>
                <Box sx={{ py: { xs: SPACING.xs, md: SPACING.md } }}>
                    <Grid container spacing={2.5} rowSpacing={3}>
                        <Grid item xs={12}>
                            <Box display={'flex'} flexDirection="column" gap={3}>
                                <Box display={'flex'} flexDirection="column" sx={{ textAlign: 'center', gap: 0.5 }}>
                                    <Typography variant={isDesktop ? 'h4' : 'subtitle2'}>{t('frequently_asked_question')}</Typography>
                                </Box>
                                <Box display={'flex'} flexDirection="column" gap={isDesktop ? 2 : 1}>
                                    {!loading ? (
                                        faqList.map((faq, index) => (
                                            <Card key={index} onClick={() => faq.faq_id != open ? setOpen(faq.faq_id) : setOpen(false)}>
                                                <Box sx={{ px: 2, py: 1.5, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', }}>
                                                    <Typography variant={!isDesktop ? 'body2' : 'subtitle1'} fontWeight="medium">
                                                        {replaceString(faq.question)}
                                                    </Typography>
                                                    <ExpandMore sx={{ color: 'primary.main', transform: open == faq.faq_id && 'rotate(180deg)', transition: '0.4s', }} />
                                                </Box>
                                                <Collapse in={open == faq.faq_id}>
                                                    <AccordionDetails sx={{ pt: 0 }}>
                                                        <Typography variant={!isDesktop ? 'caption' : 'subtitle2'} fontWeight="400" color={'text.secondary'}>
                                                            {replaceString(faq.answer)}
                                                        </Typography>
                                                    </AccordionDetails>
                                                </Collapse>
                                            </Card>
                                        ))
                                    ) : (
                                        [...Array(5)].map((_, index) => (
                                            <Skeleton key={index} variant="rectangular" sx={{ py: 3, borderRadius: 1 }} />
                                        ))
                                    )}
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </>
    );
}




export async function getServerSideProps(context) {
    try {
        let referenceData = await faqServerProps(context)
        return { props: { slugData: '', referenceData } }
    }
    catch (error) {
        console.log(error)
        return { redirect: { destination: PATH_PAGE.page404, permanent: false } };
    }

}