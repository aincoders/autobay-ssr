import { Box, Container, Grid } from '@mui/material';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useSettingsContext } from 'src/components/settings';
import { SPACING } from 'src/config-global';
import CustomLayoutWithoutSlug from 'src/layouts/custom/CustomLayoutWithoutSlug';
import { basicInfoServerProps } from 'src/server_fun';
import { META_TAG } from 'src/utils/constant';

CorporateTermsConditions.getLayout = (page) => <CustomLayoutWithoutSlug>{page}</CustomLayoutWithoutSlug>;

export default function CorporateTermsConditions({ slugData, referenceData = '', currentCity }) {
    const data = referenceData?.basicInfo?.find((basic) => basic.setting_type == 'CORPORATE_TERMS_CONDITIONS').description || ''

    return (
        <>
            <Head>
                <title>{META_TAG.termsTitle.replaceAll('$CITY_NAME', currentCity?.city_name)}</title>
                <meta name="description" content={META_TAG.termsDesc.replaceAll('$CITY_NAME', currentCity?.city_name)} />
                <meta property="og:title" content={META_TAG.termsTitle.replaceAll('$CITY_NAME', currentCity?.city_name)} />
                <meta property="og:description" content={META_TAG.termsDesc.replaceAll('$CITY_NAME', currentCity?.city_name)} />
            </Head>

            <Container maxWidth={'lg'}>
                <Box sx={{ py: { xs: SPACING.xs, md: SPACING.md } }}>
                    <Grid container spacing={2.5} rowSpacing={3}>
                        <Grid item xs={12}>
                            <Box dangerouslySetInnerHTML={{ __html: data }}></Box>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </>
    );
}


export async function getServerSideProps(context) {
    try {
        let referenceData = await basicInfoServerProps(context)
        return { props: { slugData: '', referenceData } }
    }
    catch (error) {
        console.log(error)
        return { redirect: { destination: PATH_PAGE.page404, permanent: false } };
    }
}