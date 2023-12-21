import { Box, Container, Grid, Typography } from '@mui/material';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { useSettingsContext } from 'src/components/settings';
import useApi from 'src/hooks/useApi';
import useResponsive from 'src/hooks/useResponsive';
import ModelMasterModal from 'src/master/ModelMasterModal';
import { CUSTOMER_API } from 'src/utils/constant';

export default function FooterTopbar() {
    const { getApiData } = useApi();
    const controller = new AbortController();
    const { signal } = controller;
    const {  currentCity } = useSettingsContext();
    const isDesktop = useResponsive('up', 'md');

    const [luxuryBrandList, setLuxuryBrandList] = useState([]);
    const [popularBrandList, setPopularBrandList] = useState([]);

    async function GetPopularList() {
        const response = await getApiData(CUSTOMER_API.popularBrand, signal);
        if (response) {
            setPopularBrandList(response.data.result);
        }
    }

    async function GetLuxuryList() {
        const response = await getApiData(CUSTOMER_API.luxuryBrand, signal);
        if (response) {
            setLuxuryBrandList(response.data.result);
        }
    }

    useEffect(() => {
        if (currentCity.country_master_id) {
            // GetPopularList();
            // GetLuxuryList();
        }
        return () => {
            controller.abort();
        };
    }, [currentCity.country_master_id]);

    const [modelModal, setModelModal] = useState({ status: false, data: '' });
    function modelModalClose(value) {
        if (value.setvehicle) {
            setModelModal({ status: false });
        }
        setModelModal(value.status);
    }

    if (luxuryBrandList.length == 0 && popularBrandList.length == 0) return null;

    return (
        <>
            <Box sx={{ py: { xs: 2, md: 5 } }}>
                <Container maxWidth="lg" >
                    <Grid container rowSpacing={4}>
                        {luxuryBrandList.length > 0 && (
                            <Grid item xs={12} md={12}>
                                <Box display={'flex'} flexDirection="column" alignItems={'flex-start'} gap={1}>
                                    <Box display={'flex'} alignItems="center" justifyContent={'space-between'}>
                                        <Typography variant={isDesktop ? 'subtitle1' : 'body2'} fontWeight="medium" textTransform={'uppercase'}>
                                            {t('luxury_brands')}
                                        </Typography>
                                    </Box>
                                    <Box display={'flex'} flexDirection="row" gap={1}>
                                        {luxuryBrandList.length > 0 &&
                                            luxuryBrandList.map((row, _i) => (
                                                <Typography
                                                    key={_i}
                                                    variant="body2"
                                                    fontWeight={'500'}
                                                    color="text.secondary"
                                                    sx={{ cursor: 'pointer' }}
                                                    onClick={() =>setModelModal({ status: true, data: row })}
                                                >
                                                    {`${row.vehicle_make_name} ${luxuryBrandList.length != _i + 1 ? ` /` : ''}`}
                                                </Typography>
                                            ))}
                                    </Box>
                                </Box>
                            </Grid>
                        )}
                        {popularBrandList.length > 0 && (
                            <Grid item xs={12} md={12}>
                                <Box display={'flex'} flexDirection="column" alignItems={'flex-start'} gap={1}>
                                    <Box display={'flex'} alignItems="center" justifyContent={'space-between'}>
                                        <Typography variant={isDesktop ? 'subtitle1' : 'body2'} fontWeight="medium" textTransform={'uppercase'}>
                                            {t('popular_brands')}
                                        </Typography>
                                    </Box>
                                    <Box display={'flex'} flexDirection="row" gap={1}>
                                        {popularBrandList.length > 0 &&
                                            popularBrandList.map((row, _i) => (
                                                <Typography
                                                    key={_i}
                                                    variant="body2"
                                                    fontWeight={'500'}
                                                    color="text.secondary"
                                                    sx={{ cursor: 'pointer' }}
                                                    onClick={() =>setModelModal({ status: true, data: row })}
                                                >
                                                    {`${row.vehicle_make_name} ${popularBrandList.length != _i + 1 ? ` /` : ''}`}
                                                </Typography>
                                            ))}
                                    </Box>
                                </Box>
                            </Grid>
                        )}
                    </Grid>
                </Container>
            </Box>

            <ModelMasterModal
                open={modelModal.status}
                onClose={modelModalClose}
                referenceData={modelModal.data}
            />
        </>
    );
}
