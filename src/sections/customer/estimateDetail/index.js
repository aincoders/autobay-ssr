import { Box, Card, Container, Grid } from '@mui/material';
import Head from 'next/head';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import LoadingScreen from 'src/components/loading-screen';
import { SPACING } from 'src/config-global';
import { EstimateContext } from 'src/mycontext/EstimateContext';
import EstimateParts from './EstimateParts';
import EstimateService from './EstimateService';
import EstimateStatus from './EstimateStatus';
import EstimateTitle from './EstimateTitle';
import EstimateTotal from './EstimateTotal';
import VehicleInfo from './VehicleInfo';

export default function EstimateDetails() {
    const { t } = useTranslation();
    const { loading, estimateDetails } = useContext(EstimateContext);

    if (loading) {
        return <LoadingScreen isDashboard sx={{ position: 'absolute' }} />;
    }

    return (
        <>
            <Head>
                <title> {estimateDetails.estimate_number}</title>
                <meta property="og:title" content={estimateDetails.estimate_number} />
            </Head>

            <Container maxWidth={'lg'} sx={{ flex: 1 }} disableGutters>
                <Box sx={{ py: { xs: SPACING.xs, md: SPACING.md } }}>
                    <Grid container spacing={2.5}>
                        <Grid item xs={12} sx={{ m: 'auto' }}>
                            <Box display={'flex'} flexDirection="column" gap={2}>
                                <Card>
                                    <Box display={'flex'} flexDirection="column">
                                        <EstimateTitle />
                                        <VehicleInfo />
                                    </Box>
                                </Card>
                                <EstimateService />
                                <EstimateParts />
                                <EstimateTotal />

                                <EstimateStatus />
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </>
    );
}
