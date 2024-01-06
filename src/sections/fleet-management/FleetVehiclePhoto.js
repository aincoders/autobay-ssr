import { Add, ArrowDropDown } from '@mui/icons-material';
import { Avatar, Box, Button, Container, Grid, Skeleton, Typography } from '@mui/material';
import { t } from 'i18next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Scrollbar from 'src/components/scrollbar';
import { SkeletonEmptyOrder } from 'src/components/skeleton';
import { APP_NAME, SPACING } from 'src/config-global';
import useApi from 'src/hooks/useApi';
import useResponsive from 'src/hooks/useResponsive';
import { FleetVehicleModal, SellVehicleModal, VehicleSellConfirmationDialog } from 'src/master';
import UploadFleetVehiclePhoto from 'src/master/UploadFleetVehiclePhoto';
import { CUSTOMER_API } from 'src/utils/constant';
import VehicleInfo from './VehicleInfo';
import VehicleTabMenu from './VehicleTabMenu';
import FleetVehicleGallery from './list/FleetVehicleGallery';

export default function FleetVehiclePhoto() {
    const { getApiData, postApiData } = useApi();
    const router = useRouter()
    const isDesktop = useResponsive('up', 'md');
    const controller = new AbortController();
    const { signal } = controller;
    const [responseList, setResponseList] = useState([]);
    const [loading, setLoading] = useState(false);
    const customer_vehicle_id = router.query.vehicle

    async function GetList() {
        setLoading(true);
        const params = { customer_vehicle_id: customer_vehicle_id }
        const response = await getApiData(CUSTOMER_API.fleet_vehicle_photo_list, params, signal);
        if (response) {
            const data = response.data.result;
            setLoading(false);
            setResponseList(data);
        }
    }

    useEffect(() => {
        if (customer_vehicle_id) {
            GetList();
        }
        return () => {
            controller.abort();
        };
    }, [router]);



    const handleDelete = async (row) => {
        await DeleteItem(row.fleet_vehicle_photo_id)
    };

    async function DeleteItem(fleet_vehicle_photo_id) {
        try {
            const data = {
                fleet_vehicle_photo_id: fleet_vehicle_photo_id,
                customer_vehicle_id: customer_vehicle_id,
            };
            const response = await postApiData(CUSTOMER_API.fleet_vehicle_photo_delete, data);
            GetList()
        } catch (err) {
            console.log(err)
        }
    }


    const [mediaModal, setMediaModal] = useState({ status: false, data: '' });
    function editMediaModalClose(value) {
        if (value.update) {
            GetList();
        }
        setMediaModal({ status: value.status, data: '' });
    }

    const renderFleetVehicleGallery = () => (
        responseList?.list?.map((row, i) => (
            <FleetVehicleGallery
                key={i}
                row={row}
                onDeleteRow={() => handleDelete(row)}
            />
        ))
    );

    const [makeModal, setMakeModal] = useState({ status: false, customer_vehicle_id: "" });
    function makeModalClose(value) {
        setMakeModal({ status: false, customer_vehicle_id: "" });
    }

    const [sellconfirmation, setSellConfirmation] = useState({ status: false, data: '' });
    async function sellconfirmationClose(value) {
        setSellConfirmation(value.status);
    }


    const [sellVehicleModal, setSellVehicleModal] = useState({ status: false, data: '' });
    async function sellVehicleModalClose(value) {
        setSellVehicleModal({ status: value.status, data: '' });
        if (value.update) {
            GetList();
            setSellConfirmation({ status: true, data: value.data })
        }

    }


    return (
        <>
            <Head>
                <title> {`${t('my_vehicle')} | ${APP_NAME}`}</title>
                <meta property="description" content={`${t('my_vehicle')} | ${APP_NAME}`} />
                <meta property="og:title" content={`${t('my_vehicle')} | ${APP_NAME}`} />
                <meta property="og:description" content={`${t('my_vehicle')} | ${APP_NAME}`} />
            </Head>

            <Container maxWidth={'lg'}>
                <Box sx={{ py: { xs: SPACING.xs, md: SPACING.md, } }}>
                    <Grid container rowSpacing={3}>
                        <Grid item xs={12}>
                            {responseList?.vehicle_info && !loading ?
                                <Box display={'flex'} alignItems="center" justifyContent={'space-between'}>
                                    {isDesktop && <VehicleInfo responseList={responseList?.vehicle_info} />}
                                    <Box display={'flex'} gap={2}>

                                        <Button color="inherit" onClick={() => setMakeModal({ status: true, customer_vehicle_id: router.query.vehicle })} variant="outlined" endIcon={<ArrowDropDown />}>
                                            <Box display={'flex'} gap={1} alignItems="center">
                                                {responseList?.vehicle_info?.vehicle_model_photo && <Avatar src={responseList?.vehicle_info?.vehicle_model_photo} sx={{ width: 30, height: 30 }} alt={responseList?.vehicle_info?.vehicle_make_name} />}
                                                <Box display={'flex'} flexDirection="column" alignItems={'flex-start'}>
                                                    <Box display={'flex'} gap={1} alignItems="center">
                                                        <Typography variant="body2" fontWeight={'medium'}>
                                                            {responseList?.vehicle_info?.vehicle_model_name ? responseList?.vehicle_info?.vehicle_model_name : responseList?.vehicle_info?.vehicle_make_name}
                                                        </Typography>
                                                    </Box>
                                                    <Typography variant="caption" color={'text.secondary'}>
                                                    {responseList?.vehicle_info?.vehicle_reg_no ? responseList?.vehicle_info?.vehicle_reg_no: '---'}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Button>
                                        {responseList?.vehicle_info?.request_to_sell_vehicle == "0" &&
                                            <Button variant='contained' sx={{ textTransform: 'none' }}
                                                onClick={() => { setSellVehicleModal({ status: true, data: responseList?.vehicle_info, customer_vehicle_id: router.query.vehicle }) }} >
                                                {t('request_to_sell_vehicle')}
                                            </Button>}
                                    </Box>
                                </Box>
                                : <Skeleton variant="text" sx={{ width: "100%", transform: "scale(1,1)" }} height={56} />
                            }
                        </Grid>

                        <Grid item xs={12} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, py: 1, }}>
                            {isDesktop && <VehicleTabMenu current={'vehicle_photo'} responseList={responseList} />}
                            <Box sx={{ borderTop: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
                                <Box p={1.5} px={3} display="flex" alignItems={'center'} justifyContent="space-between" gap={2}>
                                    <Typography variant="h6" sx={{ width: 200 }}>{t('vehicle_photo')}</Typography>
                                    <Box display={'flex'} alignItems='center' gap={1} flex={1} justifyContent='flex-end'>
                                        <Button variant="soft" startIcon={<Add />} onClick={() => setMediaModal({ status: true, data: "", customer_vehicle_id: router.query.vehicle })}>
                                            {t('upload_media')}
                                        </Button>
                                    </Box>
                                </Box>
                            </Box>

                            <Box sx={{ borderRadius: 0, bgcolor: 'background.paper', height: 'calc(100vh - 192px)' }}>

                                <Scrollbar>
                                    {loading ? (
                                        [...Array(9)].map((_, index) => (
                                            <Grid item xs={12} md={4} key={index}>
                                                <Skeleton variant="rounded" sx={{ width: '100%', margin: 'auto', height: 100, }}
                                                />
                                            </Grid>
                                        ))
                                    ) : responseList?.list?.length > 0 ? (
                                        <Box
                                            gap={2}
                                            display="grid"
                                            gridTemplateColumns={{
                                                xs: 'repeat(1, 1fr)',
                                                sm: 'repeat(2, 1fr)',
                                                md: 'repeat(6, 1fr)',
                                            }}
                                            sx={{ p: 2 }}
                                        >
                                            {renderFleetVehicleGallery()}
                                        </Box>
                                    ) : !loading && (
                                        <SkeletonEmptyOrder isNotFound={!responseList.length} />
                                    )}
                                </Scrollbar>
                            </Box>
                        </Grid>

                    </Grid>
                </Box>
            </Container>

            {mediaModal.status && <UploadFleetVehiclePhoto
                open={mediaModal.status}
                referenceData={mediaModal.data}
                customer_vehicle_id={mediaModal.customer_vehicle_id}
                onClose={editMediaModalClose}
            />
            }

            {sellVehicleModal.status && <SellVehicleModal
                open={sellVehicleModal.status}
                referenceData={sellVehicleModal.data}
                customer_vehicle_id={sellVehicleModal.customer_vehicle_id}
                onClose={sellVehicleModalClose}
            />
            }
            {sellconfirmation.data && <VehicleSellConfirmationDialog
                description={sellconfirmation.data}
                open={sellconfirmation.status}
                onClose={sellconfirmationClose}
            />}

            <FleetVehicleModal open={makeModal.status} onClose={makeModalClose} referenceData={makeModal.customer_vehicle_id} />

        </>
    );
}
