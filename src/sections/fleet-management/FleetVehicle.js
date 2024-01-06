import { Add, ArrowDropDown, Edit } from '@mui/icons-material';
import { Avatar, Box, Button, Container, Divider, Grid, Link, Skeleton, Typography } from '@mui/material';
import { t } from 'i18next';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSettingsContext } from 'src/components/settings';
import { APP_NAME, SPACING } from 'src/config-global';
import useApi from 'src/hooks/useApi';
import useResponsive from 'src/hooks/useResponsive';
import { AddDocumentReminderModal, AddServiceReminderModal, EditVehicleModal, FleetVehicleModal, SellVehicleModal, VehicleSellConfirmationDialog } from 'src/master';
import { PATH_FLEET_MANAGEMNT } from 'src/routes/paths';
import { CUSTOMER_API } from 'src/utils/constant';
import VehicleInfo from './VehicleInfo';
import VehicleTabMenu from './VehicleTabMenu';

export default function FleetVehicle() {
    const { getApiData, postApiData } = useApi();
    const { onChangeVehicle } = useSettingsContext();
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
        const response = await getApiData(CUSTOMER_API.vehicleDetail, params, signal);
        if (response) {
            const data = response.data.result;
            setResponseList(data);
            setLoading(false);
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

    const [makeModal, setMakeModal] = useState({ status: false, customer_vehicle_id: "" });
    function makeModalClose(value) {
        setMakeModal({ status: false, customer_vehicle_id: "" });
    }


    const [editVehicleModal, setEditVehicleModal] = useState({ status: false, data: '' });
    function editVehicleModalClose(value) {
        if (value.update) {
            GetList();
        }
        setEditVehicleModal({ status: value.status, data: '' });
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


    const [serviceReminderModal, setServiceReminderModal] = useState({ status: false, data: '' });
    function editServiceReminderModalClose(value) {
        if (value.update) {
            GetList();
        }
        setServiceReminderModal({ status: value.status, data: '' });
    }

    const [documentReminderModal, setDocumentReminderModal] = useState({ status: false, data: '' });
    function editDocumentReminderModalClose(value) {
        if (value.update) {
            GetList();
        }
        setDocumentReminderModal({ status: value.status, data: '' });
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
                            {responseList?.vehicle_make_name && !loading ? <Box display={'flex'} alignItems="center" justifyContent={'space-between'}>
                                {isDesktop && <VehicleInfo responseList={responseList} />}
                                <Box display={'flex'} gap={2}>
                                    <Button color="inherit" onClick={() => setMakeModal({ status: true, customer_vehicle_id: router.query.vehicle })} variant="outlined" endIcon={<ArrowDropDown />}>
                                        <Box display={'flex'} gap={1} alignItems="center">
                                            {responseList?.vehicle_model_photo && <Avatar src={responseList?.vehicle_model_photo} sx={{ width: 30, height: 30 }} alt={responseList?.vehicle_make_name} />}
                                            <Box display={'flex'} flexDirection="column" alignItems={'flex-start'}>
                                                <Box display={'flex'} gap={1} alignItems="center">
                                                    <Typography variant="body2" fontWeight={'medium'}>
                                                        {responseList?.vehicle_model_name ? responseList?.vehicle_model_name : responseList?.vehicle_make_name}
                                                    </Typography>
                                                </Box>
                                                <Typography variant="caption" color={'text.secondary'}>
                                                    {responseList?.vehicle_reg_no ? responseList?.vehicle_reg_no : '---'}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Button>
                                    {responseList?.request_to_sell_vehicle == "0" &&
                                        <Button variant='contained' sx={{ textTransform: 'none' }}
                                            onClick={() => { setSellVehicleModal({ status: true, data: responseList, customer_vehicle_id: router.query.vehicle }) }} >
                                            {t('request_to_sell_vehicle')}
                                        </Button>}
                                </Box>
                            </Box>
                                : <Skeleton variant="text" sx={{ width: "100%", transform: "scale(1,1)" }} height={56} />
                            }
                        </Grid>


                        <Grid item xs={12} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, py: 0, }}>
                            {isDesktop && <VehicleTabMenu current={'overview'} responseList={responseList} />}
                            <Box sx={{ bgcolor: 'rgb(32 33 36 / 4%)' }}>
                                <Box sx={{ borderTop: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
                                    <Box p={1.5} px={3} display="flex" alignItems={'center'} justifyContent="space-between" gap={2}>
                                        <Typography variant="h6" sx={{ width: 200 }}>{t('details')}</Typography>
                                        <Box display={'flex'} alignItems='center' gap={1} flex={1} justifyContent='flex-end'>
                                            <Button variant="soft" startIcon={<Edit />} onClick={() => setEditVehicleModal({ status: true, data: responseList, })}>
                                                {t('edit')}
                                            </Button>
                                        </Box>
                                    </Box>
                                </Box>
                                <Grid container spacing={2.5} rowSpacing={3} mt={0} direction={isDesktop ? 'row' : 'column'} px={3}>
                                    <Grid item xs={12} md={6}>
                                        <Box display={'flex'} flexDirection='column' gap={2} >
                                            <Box sx={{ mb: 2 }} bgcolor={'background.paper'} borderRadius={2} boxShadow={1}>
                                                <Box
                                                    display={'flex'}
                                                    alignItems='center'
                                                    justifyContent={'space-between'}
                                                    sx={{ p: 1.5 }}
                                                >
                                                    <Box display={'flex'} alignItems='center' gap={2}>
                                                        <Typography variant='body2' >{t('vehicle_reg_no')}</Typography>
                                                    </Box>
                                                    <Typography variant='body2' color={'text.primary'}>{responseList?.vehicle_reg_no || "---"}</Typography>
                                                </Box>
                                                <Divider light sx={{ borderStyle: 'solid', }} />
                                                <Box
                                                    display={'flex'}
                                                    alignItems='center'
                                                    justifyContent={'space-between'}
                                                    sx={{ p: 1.5 }}
                                                >
                                                    <Box display={'flex'} alignItems='center' gap={2}>
                                                        <Typography variant='body2' >{t('make')}</Typography>
                                                    </Box>
                                                    <Typography variant='body2' color={'text.primary'}>{responseList?.vehicle_make_name}</Typography>
                                                </Box>
                                                <Divider light sx={{ borderStyle: 'solid', }} />
                                                <Box
                                                    display={'flex'}
                                                    alignItems='center'
                                                    justifyContent={'space-between'}
                                                    sx={{ p: 1.5 }}
                                                >
                                                    <Box display={'flex'} alignItems='center' gap={2}>
                                                        <Typography variant='body2' >{t('model')}</Typography>
                                                    </Box>
                                                    <Typography variant='body2' color={'text.primary'}>{responseList?.vehicle_model_name}</Typography>
                                                </Box>
                                                <Divider light sx={{ borderStyle: 'solid', }} />
                                                <Box
                                                    display={'flex'}
                                                    alignItems='center'
                                                    justifyContent={'space-between'}
                                                    sx={{ p: 1.5 }}
                                                >
                                                    <Box display={'flex'} alignItems='center' gap={2}>
                                                        <Typography variant='body2' >{t('make_year')}</Typography>
                                                    </Box>
                                                    <Typography variant='body2' color={'text.primary'}>{responseList?.year || "---"}</Typography>
                                                </Box>
                                                <Divider light sx={{ borderStyle: 'solid', }} />
                                                <Box
                                                    display={'flex'}
                                                    alignItems='center'
                                                    justifyContent={'space-between'}
                                                    sx={{ p: 1.5 }}
                                                >
                                                    <Box display={'flex'} alignItems='center' gap={2}>
                                                        <Typography variant='body2' >{t('chassis_number')}</Typography>
                                                    </Box>
                                                    <Typography variant='body2' color={'text.primary'}>{responseList?.chassis_number || "---"}</Typography>
                                                </Box>
                                                <Divider light sx={{ borderStyle: 'solid', }} />
                                                <Box
                                                    display={'flex'}
                                                    alignItems='center'
                                                    justifyContent={'space-between'}
                                                    sx={{ p: 1.5 }}
                                                >
                                                    <Box display={'flex'} alignItems='center' gap={2}>
                                                        <Typography variant='body2' >{t('engine_number')}</Typography>
                                                    </Box>
                                                    <Typography variant='body2' color={'text.primary'}>{responseList?.engine_number || "---"}</Typography>
                                                </Box>
                                                <Divider light sx={{ borderStyle: 'solid', }} />
                                                <Box
                                                    display={'flex'}
                                                    alignItems='center'
                                                    justifyContent={'space-between'}
                                                    sx={{ p: 1.5 }}
                                                >
                                                    <Box display={'flex'} alignItems='center' gap={2}>
                                                        <Typography variant='body2' >{t('odometer')}</Typography>
                                                    </Box>
                                                    <Typography variant='body2' color={'text.primary'}>{responseList?.kilometre || "---"}</Typography>
                                                </Box>
                                                <Divider light sx={{ borderStyle: 'solid', }} />
                                                <Box
                                                    display={'flex'}
                                                    alignItems='center'
                                                    justifyContent={'space-between'}
                                                    sx={{ p: 1.5 }}
                                                >
                                                    <Box display={'flex'} alignItems='center' gap={2}>
                                                        <Typography variant='body2' >{t('trim')}</Typography>
                                                    </Box>
                                                    <Typography variant='body2' color={'text.primary'}>{responseList?.trim || "---"}</Typography>
                                                </Box>
                                                <Divider light sx={{ borderStyle: 'solid', }} />
                                                <Box
                                                    display={'flex'}
                                                    alignItems='center'
                                                    justifyContent={'space-between'}
                                                    sx={{ p: 1.5 }}
                                                >
                                                    <Box display={'flex'} alignItems='center' gap={2}>
                                                        <Typography variant='body2' >{t('registration_province')}</Typography>
                                                    </Box>
                                                    <Typography variant='body2' color={'text.primary'}>{responseList?.registration_province || "---"}</Typography>
                                                </Box>
                                                <Divider light sx={{ borderStyle: 'solid', }} />
                                                <Box
                                                    display={'flex'}
                                                    alignItems='center'
                                                    justifyContent={'space-between'}
                                                    sx={{ p: 1.5 }}
                                                >
                                                    <Box display={'flex'} alignItems='center' gap={2}>
                                                        <Typography variant='body2' >{t('color')}</Typography>
                                                    </Box>
                                                    <Typography variant='body2' color={'text.primary'}>{responseList?.color || "---"}</Typography>
                                                </Box>
                                                <Divider light sx={{ borderStyle: 'solid', }} />
                                                <Box
                                                    display={'flex'}
                                                    alignItems='center'
                                                    justifyContent={'space-between'}
                                                    sx={{ p: 1.5 }}
                                                >
                                                    <Box display={'flex'} alignItems='center' gap={2}>
                                                        <Typography variant='body2' >{t('ownership')}</Typography>
                                                    </Box>
                                                    <Typography variant='body2' color={'text.primary'}>{responseList?.ownership || "---"}</Typography>
                                                </Box>
                                                <Divider light sx={{ borderStyle: 'solid', }} />
                                                <Box
                                                    display={'flex'}
                                                    alignItems='center'
                                                    justifyContent={'space-between'}
                                                    sx={{ p: 1.5 }}
                                                >
                                                    <Box display={'flex'} alignItems='center' gap={2}>
                                                        <Typography variant='body2' >{t('body_type')}</Typography>
                                                    </Box>
                                                    <Typography variant='body2' color={'text.primary'}>{responseList?.body_type || "---"}</Typography>
                                                </Box>
                                                <Divider light sx={{ borderStyle: 'solid', }} />
                                                <Box
                                                    display={'flex'}
                                                    alignItems='center'
                                                    justifyContent={'space-between'}
                                                    sx={{ p: 1.5 }}
                                                >
                                                    <Box display={'flex'} alignItems='center' gap={2}>
                                                        <Typography variant='body2' >{t('body_sub_type')}</Typography>
                                                    </Box>
                                                    <Typography variant='body2' sx={{ justifyItems: 'center' }} color={'text.primary'}>{responseList?.body_sub_type || "---"}</Typography>
                                                </Box>
                                                <Divider light sx={{ borderStyle: 'solid', }} />
                                                <Box
                                                    display={'flex'}
                                                    alignItems='center'
                                                    justifyContent={'space-between'}
                                                    sx={{ p: 1.5 }}
                                                >
                                                    <Box display={'flex'} alignItems='center' gap={2}>
                                                        <Typography variant='body2' >{t('msrp')}</Typography>
                                                    </Box>
                                                    <Typography variant='body2' color={'text.primary'}>{responseList?.msrp || "---"}</Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Grid>

                                    <Grid item xs={12} md={6} >
                                        <Box display={'flex'} flexDirection='column' gap={2} sx={{ mb: 2 }}>
                                            <Box sx={{ mb: 2 }} bgcolor={'background.paper'} borderRadius={2} boxShadow={1}>
                                                <Box display={'flex'} flexDirection='row' sx={{ p: 1.5 }} justifyContent={'space-between'} alignItems={'center'}>
                                                    <Typography variant='h5' fontWeight={'medium'} >{`${t('service_reminder')}`}</Typography>

                                                    <Box display={'flex'} alignItems='center' gap={1} flex={1} justifyContent='flex-end'>
                                                        <Button variant="text"
                                                            sx={{ "&:hover": { backgroundColor: "transparent" } }}
                                                            onClick={() => setServiceReminderModal({ status: true, data: "", customer_vehicle_id: router.query.vehicle })}>
                                                            {t('add_reminder')}
                                                        </Button>

                                                        <Link
                                                            component={NextLink}
                                                            href={`${PATH_FLEET_MANAGEMNT.service_reminder}${router.query.vehicle}`}
                                                            noWrap
                                                            underline="none"
                                                        >
                                                            <Typography variant='body2' color={'primary'} fontWeight={'medium'}>{`${t('view_all')}`}</Typography>
                                                        </Link>
                                                    </Box>

                                                </Box>
                                                <Box display={'flex'} flexDirection='column' gap={2} sx={{ p: 1.5 }}>
                                                    <Box
                                                        display={'flex'}
                                                        alignItems='center'
                                                        justifyContent={'space-between'}
                                                        sx={{ borderRadius: 2, p: 2, border: "1px solid", borderColor: 'divider' }}
                                                    >
                                                        <Box sx={{ flex: 1, borderRight: '1px solid', borderColor: 'divider', pr: 2 }}   >
                                                            <Typography variant='body2' color={'text.primary'}>{t('total')}</Typography>
                                                            <Typography variant='h5' fontWeight={'medium'} color={'text.primary'}>{responseList?.service_reminder_info?.total}</Typography>
                                                        </Box>

                                                        <Box sx={{ flex: 1, borderRight: '1px solid', borderColor: 'divider', px: 2 }}>
                                                            <Typography variant='body2' color={'text.primary'}>{t('upcoming')}</Typography>
                                                            <Typography variant='h5' fontWeight={'medium'} color={'success.main'}>{responseList?.service_reminder_info?.upcoming}</Typography>

                                                        </Box>
                                                        <Box sx={{ flex: 1, px: 2 }}>
                                                            <Typography variant='body2' color={'text.primary'}>{t('over_due')}</Typography>
                                                            <Typography variant='h5' fontWeight={'medium'} color={'error.main'}>{responseList?.service_reminder_info?.overdue}</Typography>
                                                        </Box>
                                                    </Box>

                                                </Box>
                                                <Box display={'flex'} flexDirection='column' gap={2} sx={{ p: 1.5 }}>
                                                    {responseList && responseList?.service_reminder_info?.reminder_list.length > 0 && responseList?.service_reminder_info?.reminder_list.map((data, i) => {
                                                        return (
                                                            <Box key={i}>
                                                                <Box display={'flex'} alignItems='center' gap={1} >
                                                                    <Box display={'flex'} alignItems="center" flex={1}>
                                                                        <Box display="flex" gap={{ xs: 0, md: 0.8 }} flexDirection="column" flex={1}>
                                                                            <Box display={'flex'} alignItems='center' gap={2}>
                                                                                {data?.service_master_photo && <Avatar alt={data?.service_name} src={data?.service_master_photo} />}
                                                                                <Box alignItems='center' gap={1} >
                                                                                    <Typography variant='body1' color={'text.primary'}>{data?.service_name}</Typography>
                                                                                    <Typography variant='body2' color={'text.secondary'}>{data?.time_interval_info}</Typography>
                                                                                    <Typography variant='body2' color={'error.main'}>{data?.days_info}</Typography>
                                                                                </Box>
                                                                            </Box>
                                                                        </Box>

                                                                    </Box>
                                                                </Box>
                                                                {i < responseList.service_reminder_info.reminder_list.length - 1 && (<Divider sx={{ borderStyle: 'solid', mt: 2 }} />)}
                                                            </Box>
                                                        );
                                                    })}
                                                </Box>
                                            </Box>
                                        </Box>
                                        <Box display={'flex'} flexDirection='column' gap={2} sx={{ mb: 2 }}>
                                            <Box sx={{ mb: 2 }} bgcolor={'background.paper'} borderRadius={2} boxShadow={1}>

                                                <Box display={'flex'} flexDirection='row' sx={{ p: 1.5 }} justifyContent={'space-between'} alignItems={'center'}>
                                                    <Typography variant='h5' fontWeight={'medium'} >{`${t('document_reminder')}`}</Typography>
                                                    <Box display={'flex'} alignItems='center' gap={1} flex={1} justifyContent='flex-end'>
                                                        <Button variant="text"
                                                            sx={{ "&:hover": { backgroundColor: "transparent" } }}
                                                            onClick={() => setDocumentReminderModal({ status: true, data: "", customer_vehicle_id: router.query.vehicle })}
                                                        >
                                                            {t('add_reminder')}
                                                        </Button>


                                                        <Link
                                                            component={NextLink}
                                                            href={`${PATH_FLEET_MANAGEMNT.document_reminder}${router.query.vehicle}`}
                                                            noWrap
                                                            underline="none"
                                                        >
                                                            <Typography variant='body2' color={'primary'} fontWeight={'medium'}>{`${t('view_all')}`}</Typography>
                                                        </Link>
                                                    </Box>
                                                </Box>
                                                {/* <Typography variant='h5' fontWeight={'medium'} sx={{ p: 1.5 }}>{`${t('document_reminder')}`}</Typography> */}
                                                <Box display={'flex'} flexDirection='column' gap={2} sx={{ p: 1.5 }}>
                                                    <Box
                                                        display={'flex'}
                                                        alignItems='center'
                                                        justifyContent={'space-between'}
                                                        sx={{ borderRadius: 2, p: 2, border: "1px solid", borderColor: 'divider' }}
                                                    >
                                                        <Box sx={{ flex: 1, borderRight: '1px solid', borderColor: 'divider', pr: 2 }}   >
                                                            <Typography variant='body2' color={'text.primary'}>{t('total')}</Typography>
                                                            <Typography variant='h5' fontWeight={'medium'} color={'text.primary'}>{responseList?.document_reminder_info?.total}</Typography>
                                                        </Box>

                                                        <Box sx={{ flex: 1, borderRight: '1px solid', borderColor: 'divider', px: 2 }}>
                                                            <Typography variant='body2' color={'text.primary'}>{t('upcoming')}</Typography>
                                                            <Typography variant='h5' fontWeight={'medium'} color={'success.main'}>{responseList?.document_reminder_info?.upcoming}</Typography>

                                                        </Box>
                                                        <Box sx={{ flex: 1, px: 2 }}>
                                                            <Typography variant='body2' color={'text.primary'}>{t('over_due')}</Typography>
                                                            <Typography variant='h5' fontWeight={'medium'} color={'error.main'}>{responseList?.document_reminder_info?.overdue}</Typography>

                                                        </Box>
                                                    </Box>

                                                </Box>
                                                <Box display={'flex'} flexDirection='column' gap={2} sx={{ p: 1.5 }}>
                                                    {responseList && responseList?.service_reminder_info?.reminder_list.length > 0 && responseList?.document_reminder_info?.reminder_list.map((data, i) => {
                                                        return (
                                                            < Box key={i}>
                                                                <Box display={'flex'} alignItems='center' gap={1} >
                                                                    <Box display={'flex'} alignItems="center" flex={1}>
                                                                        <Box display="flex" gap={{ xs: 0, md: 0.8 }} flexDirection="column" flex={1}>
                                                                            <Box display={'flex'} alignItems='center' gap={2}>
                                                                                <Box alignItems='center' gap={1} >
                                                                                    <Typography variant='body1' color={'text.primary'}>{data?.document_type}</Typography>
                                                                                    <Typography variant='body2' color={'error.main'}>{data?.days_info}</Typography>
                                                                                </Box>
                                                                            </Box>
                                                                        </Box>

                                                                    </Box>
                                                                </Box>
                                                                {i < responseList.document_reminder_info.reminder_list.length - 1 && (<Divider sx={{ borderStyle: 'solid', mt: 2 }} />)}
                                                            </Box>
                                                        );
                                                    })}
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Grid>
                        {loading &&
                            [...Array(9)].map((_, index) => (
                                <Grid item xs={12} md={4} key={index}>
                                    <Skeleton variant="rounded" sx={{ width: '100%', margin: 'auto', height: 100, }}
                                    />
                                </Grid>
                            ))}
                    </Grid>
                </Box>


            </Container>

            {serviceReminderModal.status && <AddServiceReminderModal
                open={serviceReminderModal.status}
                referenceData={serviceReminderModal.data}
                customer_vehicle_id={serviceReminderModal.customer_vehicle_id}
                onClose={editServiceReminderModalClose}
            />
            }
             {documentReminderModal.status && <AddDocumentReminderModal
                open={documentReminderModal.status}
                referenceData={documentReminderModal.data}
                customer_vehicle_id={documentReminderModal.customer_vehicle_id}
                onClose={editDocumentReminderModalClose}
            />
            }

            {editVehicleModal.status && <EditVehicleModal
                open={editVehicleModal.status}
                referenceData={editVehicleModal.data}
                onClose={editVehicleModalClose}
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
            {makeModal.status && <FleetVehicleModal open={makeModal.status} onClose={makeModalClose} referenceData={makeModal.customer_vehicle_id} />}
        </>
    );
}
