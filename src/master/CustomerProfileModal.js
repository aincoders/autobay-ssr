import { yupResolver } from '@hookform/resolvers/yup';
import { AlternateEmail, TitleOutlined } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Box, Drawer, FormGroup, Grid, InputAdornment, Typography } from '@mui/material';
import { t } from 'i18next';
import encryptLocalStorage from 'localstorage-slim';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuthContext } from 'src/auth/useAuthContext';
import { FormProvider, RHFTextField } from 'src/components/hook-form';
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import { HEADER } from 'src/config-global';
import useApi from 'src/hooks/useApi';
import { CUSTOMER_API, CUSTOMER_KEY } from 'src/utils/constant';
import * as yup from 'yup';

export default function CustomerProfileModal({ open, onClose, referenceData }) {
    const { currentCity } = useSettingsContext();
    const { postApiData } = useApi();
    const {  initialize } = useAuthContext();


    const [loading, setLoading] = useState(false);

    const defaultValues = {
        phone_number: '',
        first_name: '',
        last_name: '',
        email: '',
    };

    useEffect(() => {
        if (referenceData) {
            setValue('phone_number', referenceData.phone_number || referenceData.phone);
            setValue('first_name', referenceData.first_name);
            setValue('last_name', referenceData.last_name);
            setValue('email', referenceData.email);
        }
    }, [referenceData, open]);

    const validationSchema = yup.object({
        phone_number: yup.string().required(`${t('phone_number_')} ${t('is_required')}`),
        first_name: yup.string().required(`${t('first_name_')} ${t('is_required')}`),
        last_name: yup.string().required(`${t('last_name_')} ${t('is_required')}`),
        email: yup.string().email(`${t('email_')} ${t('is_invalid_format')}`).required(`${t('email_')} ${t('is_required')}`),
    });

    const methods = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues,
    });
    const { watch, setValue, handleSubmit, reset } = methods;

    async function onSubmit(values) {
        setLoading(true);
        const data = {
            phone: values.phone_number.trim(),
            customer_id: referenceData.customer_id,
            first_name: values.first_name,
            last_name: values.last_name,
            email: values.email,
        };
        await updateCustomerProfile(data);
        setLoading(false);
    }

    async function updateCustomerProfile(data) {
        if (data) {
            const response = await postApiData(CUSTOMER_API.profileUpdate, data);
            if (response) {
                encryptLocalStorage.set(CUSTOMER_KEY, { ...referenceData, ...data }, { encrypt: true, secret: 1272 });
                await initialize()
                onClose(false);
            }
        }
    }

    return (
        <>
            <Drawer
                variant="temporary"
                anchor={'right'}
                open={open}
                PaperProps={{ sx: { width: { xs: '100%', md: '550px' } } }}
            >
                <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                    <Box sx={{ minHeight: HEADER.DASHBOARD_DESKTOP_HEIGHT, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, px: 2, }}>
                        <Typography variant="h6">{t('add_profile')}</Typography>
                    </Box>

                    <Box sx={{ overflow: 'hidden' }} display="flex" flexDirection={'column'} gap={2} flex={1}>
                        <Scrollbar sx={{ flex: 1 }}>
                            <Box sx={{ py: 3, px: 2 }}>
                                <FormProvider methods={methods} autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
                                    <FormGroup>
                                        <Grid container spacing={2} rowSpacing={3}>
                                            <Grid item xs={12}>
                                                <RHFTextField
                                                    name="phone_number"
                                                    label={t('phone_number_')}
                                                    InputProps={{startAdornment: (<InputAdornment position="start">+{currentCity?.country_code}</InputAdornment>)}}
                                                    disabled={true}
                                                />
                                            </Grid>

                                            <Grid item xs={12}>
                                                <RHFTextField
                                                    name="first_name"
                                                    label={t('first_name_')}
                                                    InputProps={{startAdornment: (<InputAdornment position="start"><TitleOutlined /></InputAdornment>)}}
                                                />
                                            </Grid>

                                            <Grid item xs={12}>
                                                <RHFTextField
                                                    name="last_name"
                                                    label={t('last_name_')}
                                                    InputProps={{startAdornment: (<InputAdornment position="start"><TitleOutlined /></InputAdornment>)}}
                                                />
                                            </Grid>

                                            <Grid item xs={12}>
                                                <RHFTextField
                                                    name="email"
                                                    label={t('email_')}
                                                    InputProps={{ startAdornment: (<InputAdornment position="start"><AlternateEmail /></InputAdornment>) }}
                                                />
                                            </Grid>

                                            <Grid item xs={12}>
                                                <LoadingButton loading={loading} fullWidth variant="contained" type="submit">
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
