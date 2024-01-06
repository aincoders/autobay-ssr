import { yupResolver } from '@hookform/resolvers/yup';
import { CloseOutlined } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Box, Drawer, FormGroup, Grid, IconButton, Typography } from '@mui/material';
import { t } from 'i18next';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuthContext } from 'src/auth/useAuthContext';
import { FormProvider, RHFTextField } from 'src/components/hook-form';
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import { HEADER } from 'src/config-global';
import useApi from 'src/hooks/useApi';
import { CUSTOMER_API } from 'src/utils/constant';
import * as yup from 'yup';

export default function AddFleetDriverModal({ open, onClose, referenceData }) {

    console.log(referenceData.name)
    const { currentCity } = useSettingsContext();
    const { getApiData, postApiData } = useApi();
    const { customer } = useAuthContext();
    const controller = new AbortController();
    const { signal } = controller;

    const [loading, setLoading] = useState(false);

    const defaultValues = {
        name: referenceData ? referenceData?.name : '',
        phone_number: referenceData ? referenceData?.phone_number : '',

    };

    // useEffect(() => {
    //     if (referenceData) {
    //         // setValue('engine_number', referenceData.engine_number);
    //         // setValue('chassis_number', referenceData.chassis_number);
    //         // setValue('year', referenceData.year);
    //         // setValue('vehicle_reg_no', referenceData.vehicle_reg_no);
    //         // setValue('customer_vehicle_id', referenceData.customer_vehicle_id);
    //         // setValue('kilometre', referenceData.kilometre);
    //     }


    // }, [referenceData, open, customer_vehicle_id]);


    const validationSchema = yup.object({

        name: yup.string().required(`${t('name_')} ${t('is_required')}`),
        phone_number: yup.string().required(`${t('phone_number_')} ${t('is_required')}`),
    });

    const methods = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues,
    });
    const { watch, setValue, handleSubmit, reset } = methods;

    async function onSubmit(values) {
        setLoading(true);
        const data = {
            name: values?.name,
            phone_number: values?.phone_number,
            ...(referenceData && { driver_id: referenceData?.driver_id }),

        };
        referenceData.driver_id ? await UpdateFleetDriver(data) : await CreateFleetDriver(data)
        setLoading(false);
    }

    async function CreateFleetDriver(data) {
        if (data) {
            const response = await postApiData(CUSTOMER_API.fleet_management_driver_create, data);
            if (response) {
                reset();
                onClose({ update: true });
            }
        }
    }

    async function UpdateFleetDriver(data) {
        if (data) {
            const response = await postApiData(CUSTOMER_API.fleet_management_driver_update, data);
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
                        <Typography variant="h6">{t('driver')}</Typography>
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
                                                <RHFTextField
                                                    type="text"
                                                    name="name"
                                                    label={t('name_')}
                                                />
                                            </Grid>

                                            <Grid item xs={12}>
                                                <RHFTextField
                                                    type="number"
                                                    name="phone_number"
                                                    label={t('phone_number_')}
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
