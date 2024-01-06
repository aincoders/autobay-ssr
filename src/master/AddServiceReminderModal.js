import { yupResolver } from '@hookform/resolvers/yup';
import { CloseOutlined } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Avatar, Box, Drawer, FormGroup, Grid, IconButton, MenuItem, Typography } from '@mui/material';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuthContext } from 'src/auth/useAuthContext';
import { FormProvider, RHFAutocomplete, RHFSelect, RHFTextField } from 'src/components/hook-form';
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import { HEADER } from 'src/config-global';
import useApi from 'src/hooks/useApi';
import { CUSTOMER_API } from 'src/utils/constant';
import createAvatar from 'src/utils/createAvatar';
import * as yup from 'yup';

export default function AddServiceReminderModal({ open, onClose, referenceData, customer_vehicle_id }) {

    console.log(customer_vehicle_id)

    const { currentCity } = useSettingsContext();
    const { getApiData, postApiData } = useApi();
    const { customer } = useAuthContext();
    const controller = new AbortController();
    const { signal } = controller;

    const INTERVAL_TYPE = [{ title: t('day'), value: 1 }, { title: t('month'), value: 2 }, { title: t('year'), value: 3 }];
    const [loading, setLoading] = useState(false);
    const [rfqServiceList, setRfqServiceList] = useState([]);
    const [rfqServiceGroupList, setRfqServiceGroupList] = useState([]);

    const defaultValues = {
        rfq_services:referenceData ? referenceData.service_info :{},
        time_interval: referenceData ? referenceData.time_interval:'',
        time_interval_type: referenceData ? referenceData?.time_interval_type :INTERVAL_TYPE[0].value,
        time_due_threshold: referenceData ? referenceData.time_due_threshold:'',
        time_due_threshold_type: referenceData ? referenceData?.time_due_threshold_type : INTERVAL_TYPE[0].value,
        services_group:referenceData ? referenceData.service_group_info :{},
        current_mileage:referenceData ? referenceData.current_mileage :'',
        next_service_mileage:referenceData ?referenceData.next_service_mileage:''
    };

    
    useEffect(() => {
        async function getRfqServiceList() {
            const response = await getApiData(CUSTOMER_API.fleetService, signal);
            if (response) {
                setRfqServiceList(response.data.result.list);
            }
        }
        async function getRfqServiceGroupList() {
            const response = await getApiData(CUSTOMER_API.fleet_management_servicegroup, signal);
            if (response) {
                setRfqServiceGroupList(response.data.result.list);
            }
        }
        getRfqServiceList();
        getRfqServiceGroupList();
        return () => {
            controller.abort();
        };
    }, []);

    const validationSchema = yup.object({
        rfq_services: yup.object()
        .test('is-not-empty', `${t('service')} ${t('is_required')}`, (value) => {
            return Object.keys(value).length > 0;
        }),

        time_interval: yup.string().required(`${t('time_interval')} ${t('is_required')}`),
        time_due_threshold: yup.string().required(`${t('time_due_threshold')} ${t('is_required')}`),
    });

    const methods = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues,
    });
    const { watch, setValue, handleSubmit, reset } = methods;

    async function onSubmit(values) {
        setLoading(true);
        const data = {
            service_master_id: values?.rfq_services?.service_master_id,
            service_group_id:values?.services_group?.service_group_id,
            time_due_threshold: values?.time_due_threshold,
            time_due_threshold_type: values?.time_due_threshold_type,
            time_interval: values?.time_interval,
            time_interval_type: values?.time_interval_type,
            customer_vehicle_id: customer_vehicle_id,
            next_service_mileage:values?.next_service_mileage,
            current_mileage:values?.current_mileage,
            ...(referenceData && { fleet_vehicle_service_reminder_id: referenceData?.fleet_vehicle_service_reminder_id }),
        };
        referenceData.fleet_vehicle_service_reminder_id ? await UpdateServiceReminder(data) : await CreateServiceReminder(data)
        setLoading(false);
    }

    async function CreateServiceReminder(data) {
        if (data) {
            const response = await postApiData(CUSTOMER_API.serviceReminderCreate, data);
            if (response) {
                reset();
                onClose({ update: true });
            }
        }
    }

    async function UpdateServiceReminder(data) {
        if (data) {
            const response = await postApiData(CUSTOMER_API.serviceReminderUpdate, data);
            if (response) {
                reset();
                onClose({ update: true });
            }
        }
    }


    return (
        <>
            <Drawer
                variant="temporary"
                anchor={'right'}
                open={open}
                onClose={() => {
                    onClose({ update: false });
                    reset();
                }}
                PaperProps={{ sx: { width: { xs: '100%', md: '550px' } } }}
            >
                <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                    <Box
                        sx={{
                            minHeight: HEADER.DASHBOARD_DESKTOP_HEIGHT,
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 2,
                            px: 2,
                        }}
                    >
                        <Typography variant="h6">{t('service_reminder')}</Typography>
                        <IconButton
                            aria-label="close modal"
                            onClick={() => {
                                onClose({ update: false });
                                reset();
                            }}
                        >
                            <CloseOutlined />
                        </IconButton>
                    </Box>

                    <Box
                        sx={{ overflow: 'hidden' }}
                        display="flex"
                        flexDirection={'column'}
                        gap={2}
                        flex={1}
                    >
                        <Scrollbar sx={{ flex: 1 }}>
                            <Box sx={{ py: 3, px: 2 }}>
                                <FormProvider
                                    methods={methods}
                                    autoComplete="off"
                                    onSubmit={handleSubmit(onSubmit)}
                                >
                                    <FormGroup>
                                        <Grid container spacing={2} rowSpacing={3}>
                                            <Grid item xs={12}>
                                                {rfqServiceList.length > 0 &&
                                                    <RHFAutocomplete
                                                    disableClearable={false}
                                                        placeholder={t('service')}
                                                        name="rfq_services"
                                                        label={t('preferred_services')}
                                                        options={rfqServiceList}
                                                        getOptionLabel={(option) => option.service_name || ''}                                                        
                                                        isOptionEqualToValue={(option, value) => option.service_master_id === value.service_master_id}
                                                        renderOption={(props, option) => {
                                                            const { service_master_photo, service_name, service_master_id } = rfqServiceList.filter((item) => item.service_master_id === option.service_master_id)[0];
                                                            if (!service_master_id) {
                                                                return null;
                                                            }
                                                            return (
                                                                <li {...props} key={service_master_id}>
                                                                    {service_master_photo
                                                                        ? <Avatar src={service_master_photo} sx={{ mr: 2, width: 28, height: 28 }} />
                                                                        : <Avatar color={createAvatar(service_name).color} sx={{ mr: 2, width: 28, height: 28 }}>
                                                                            <Typography variant='body2'>{createAvatar(service_name).name}</Typography>
                                                                        </Avatar>
                                                                    }
                                                                    {service_name}
                                                                </li>
                                                            );
                                                        }}
                                                    />}
                                            </Grid>

                                            <Grid item xs={12}>
                                                {rfqServiceGroupList.length > 0 &&
                                                    <RHFAutocomplete
                                                    disableClearable={false}
                                                        placeholder={t('service_group')}
                                                        name="services_group"
                                                        label={t('service_group')}
                                                        options={rfqServiceGroupList}
                                                        getOptionLabel={(option) => option.service_group_name || ''}                                                        
                                                        isOptionEqualToValue={(option, value) => option.service_group_id === value.service_group_id}
                                                        renderOption={(props, option) => {
                                                            const { service_group_name, service_group_id } = rfqServiceGroupList.filter((item) => item.service_group_id === option.service_group_id)[0];
                                                            if (!service_group_id) {
                                                                return null;
                                                            }
                                                            return (
                                                                <li {...props} key={service_group_id}>
                                                                    {service_group_name}
                                                                </li>
                                                            );
                                                        }}
                                                    />}
                                            </Grid>


                                            <Grid item xs={6}>
                                                <RHFTextField
                                                    type="number"
                                                    name="time_interval"
                                                    label={t('time_interval')}
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <RHFSelect
                                                    fullWidth
                                                    name="time_interval_type"
                                                    label={t('time_interval_type')}
                                                    SelectProps={{ native: false, }}
                                                >
                                                    {INTERVAL_TYPE.map((option) => (
                                                        <MenuItem key={option.value} value={option.value}>
                                                            {option.title}
                                                        </MenuItem>
                                                    ))}
                                                </RHFSelect>
                                            </Grid>


                                            <Grid item xs={6}>
                                                <RHFTextField
                                                    type="number"
                                                    name="time_due_threshold"
                                                    label={t('time_due_threshold')}
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <RHFSelect
                                                    fullWidth
                                                    name="time_due_threshold_type"
                                                    label={t('time_due_threshold_type')}
                                                    SelectProps={{ native: false, }}
                                                >
                                                    {INTERVAL_TYPE.map((option) => (
                                                        <MenuItem key={option.value} value={option.value}>
                                                            {option.title}
                                                        </MenuItem>
                                                    ))}
                                                </RHFSelect>
                                            </Grid>

                                            <Grid item xs={6}>
                                                <RHFTextField
                                                    type="number"
                                                    name="current_mileage"
                                                    label={t('current_mileage')}
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <RHFTextField
                                                    type="number"
                                                    name="next_service_mileage"
                                                    label={t('next_service_mileage')}
                                                />
                                            </Grid>

                                            <Grid item xs={12}>
                                                <LoadingButton
                                                    loading={loading}
                                                    fullWidth
                                                    variant="contained"
                                                    type="submit"
                                                >
                                                    {t('save')}
                                                </LoadingButton>
                                            </Grid>
                                        </Grid>
                                    </FormGroup>
                                </FormProvider>
                            </Box>
                        </Scrollbar>
                    </Box>
                </Box>
            </Drawer>
        </>
    );
}
