import { yupResolver } from '@hookform/resolvers/yup';
import { CloseOutlined } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Box, Drawer, FormGroup, Grid, IconButton, Typography } from '@mui/material';
import { t } from 'i18next';
import { useForm } from 'react-hook-form';
import { FormProvider, RHFTextField } from 'src/components/hook-form';
import Scrollbar from 'src/components/scrollbar';
import { HEADER } from 'src/config-global';
import useApi from 'src/hooks/useApi';
import { CUSTOMER_API } from 'src/utils/constant';
import * as yup from 'yup';

export default function RequestVehicleAddModal({ open, onClose, referenceData }) {
    const { postApiData } = useApi();

    const defaultValues = {
        make: '',
        model: '',
        variant: '',
        year:'',
        transmission_type:'',
        no_of_cylinders:'',
    };

    const validationSchema = yup.object({
        make: yup.string().required(`${t('make_')} ${t('is_required')}`),
        model: yup.string().required(`${t('model_')} ${t('is_required')}`),
        variant: yup.string().required(`${t('variant_')} ${t('is_required')}`),
        year: yup.string().required(`${t('manufactured_year_')} ${t('is_required')}`),
        transmission_type: yup.string().required(`${t('transmission_type_')} ${t('is_required')}`),
        no_of_cylinders: yup.string().required(`${t('no_of_cylinders_')} ${t('is_required')}`),
    });

    const methods = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues,
    });
    const { watch, 
        setValue, 
        handleSubmit, 
        reset,
        formState: { isSubmitting }
     } = methods;

    async function onSubmit(values) {
        await RequestToAddvehicle(values);
    }

    async function RequestToAddvehicle(data) {
        if (data) {
            const response = await postApiData(CUSTOMER_API.requestToAddVehicle, data);
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
                        <Typography variant="h6">{t('request_to_add_vehicle')}</Typography>
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
                                            <Grid item xs={6}>
                                                <RHFTextField name="make" label={t('make_')}/>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <RHFTextField name="model" label={t('model_')}/>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <RHFTextField name="variant" label={t('variant_')}/>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <RHFTextField type="number" name="year" label={t('manufactured_year_')}/>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <RHFTextField name="transmission_type" label={t('transmission_type_')}/>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <RHFTextField name="no_of_cylinders" label={t('no_of_cylinders_')}/>
                                            </Grid>


                                            <Grid item xs={12}>
                                                <LoadingButton
                                                    loading={isSubmitting}
                                                    fullWidth
                                                    variant="contained"
                                                    type="submit"
                                                >
                                                    {t('submit')}
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
