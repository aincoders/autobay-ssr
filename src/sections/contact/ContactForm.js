import { yupResolver } from '@hookform/resolvers/yup';
import { AlternateEmail, CallOutlined, TitleOutlined } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Avatar, Box, Grid, InputAdornment, MenuItem, Stack, Typography } from '@mui/material';
import { m } from 'framer-motion';
import { t } from 'i18next';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuthContext } from 'src/auth/useAuthContext';
import { FormProvider, RHFSelect, RHFTextField } from 'src/components/hook-form';
import { useSettingsContext } from 'src/components/settings';
import useApi from 'src/hooks/useApi';
import useLocalStorage from 'src/hooks/useLocalStorage';
import useResponsive from 'src/hooks/useResponsive';
import { CUSTOMER_API } from 'src/utils/constant';
import * as yup from 'yup';
import { MotionViewport, varFade } from '../../components/animate';

export default function ContactForm() {
    const { customer } = useAuthContext();
    const { getApiData, postApiData } = useApi();
    const { currentCity, currentVehicle ,countryList} = useSettingsContext();

    const [phoneNumber, setPhoneNumber] = useLocalStorage('cup', '');
    const [loading, setLoading] = useState(false);

    const defaultValues = {
        vehicle_model_master_id: currentVehicle.model
            ? currentVehicle.model.vehicle_model_master_id
            : '',
        customer_id: customer ? customer.customer_id : '',
        phone: phoneNumber,
        name: '',
        email: '',
        description: '',
        country_master_id: currentCity ? currentCity.country_master_id : '',
    };
    const validationSchema = yup.object({
        name: yup.string().required(`${t('name_')} ${t('is_required')}`),
        email: yup.string().required(`${t('email_')} ${t('is_required')}`),
        phone: yup.string()
            .required(`${t('phone_number_')} ${t('is_required')}`)
            .min(currentCity.min_area_code_length, t('minium_characters').replace('%1$s', currentCity.min_area_code_length))
            .max(currentCity.max_area_code_length, t('maximum_characters').replace('%1$s', currentCity.max_area_code_length)),
    });

    const methods = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues,
    });
    const { watch, setValue, handleSubmit, reset } = methods;

    async function onSubmit(values) {
        setLoading(true);
        const data = {
            vehicle_model_master_id: values.vehicle_model_master_id,
            customer_id: values.customer_id,
            phone: values.phone,
            name: values.name,
            email: values.email,
            description: values.description,
            country_master_id: values.country_master_id,
        };
        await createLead(data);
        setLoading(false);
    }

    // lead
    async function createLead(data) {
        if (data) {
            const response = await postApiData(CUSTOMER_API.createLeadContact, data);
            if (response) {
                reset();
            }
        }
    }

    const isDesktop = useResponsive('up', 'lg');

    return (
        <FormProvider methods={methods} autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
            <Stack component={MotionViewport} spacing={5}>
                <m.div variants={varFade().inUp}>
                    <Typography variant={isDesktop ? 'h3' : 'h6'}>
                        {t('contact_us_title_1')}<br />
                        {t('contact_us_title_2')}
                    </Typography>
                </m.div>

                <Stack spacing={3}>
                    <Grid container spacing={2} rowSpacing={3}>
                        <Grid item xs={6}>
                            <m.div variants={varFade().inUp}>
                                <RHFTextField
                                    name="name"
                                    label={t('name_')}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <TitleOutlined />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </m.div>
                        </Grid>

                        <Grid item xs={6}>
                            <m.div variants={varFade().inUp}>
                                <RHFTextField
                                    name="email"
                                    label={t('email_')}
                                    InputProps={{ startAdornment: (<InputAdornment position="start"><AlternateEmail /></InputAdornment>), }}
                                />
                            </m.div>
                        </Grid>

                        {countryList.length && countryList.length > 1 && (
                            <Grid item xs={4}>
                                <RHFSelect
                                    name="country_master_id"
                                    label={t('country_')}
                                    SelectProps={{ native: false }}
                                >
                                    {countryList.map((option, i) => (
                                        <MenuItem
                                            key={i}
                                            value={option.country_master_id}
                                            sx={{ mx: 1, my: 0.5, borderRadius: 0.75, typography: 'body2', textTransform: 'capitalize',}}
                                        >
                                            <Box display={'flex'} alignItems="center" gap={1}>
                                                <Avatar src={option.media_url} alt={option.media_url_alt} sx={{width: 20,height: 20,borderRadius: 0.2}}/>
                                                <Typography variant="body2">{option.country_code}</Typography>
                                            </Box>
                                        </MenuItem>
                                    ))}
                                </RHFSelect>
                            </Grid>
                        )}

                        <Grid item xs={countryList.length > 1 ? 8 : 12}>
                            <m.div variants={varFade().inUp}>
                                <RHFTextField
                                    type='number'
                                    name="phone"
                                    label={t('phone_number_')}
                                    InputProps={{ startAdornment: (<InputAdornment position="start"><CallOutlined /></InputAdornment>) }}
                                />
                            </m.div>
                        </Grid>

                        <Grid item xs={12}>
                            <m.div variants={varFade().inUp}>
                                <RHFTextField
                                    multiline
                                    rows={4}
                                    fullWidth
                                    name="description"
                                    label={t('enter_your_message_here')}
                                />
                            </m.div>
                        </Grid>
                        <Grid item xs={12}>
                            <m.div variants={varFade().inUp}>
                                <LoadingButton
                                    loading={loading}
                                    variant="soft"
                                    type="submit"
                                >
                                    {t('submit_now')}
                                </LoadingButton>
                            </m.div>
                        </Grid>
                    </Grid>
                </Stack>
            </Stack>
        </FormProvider>
    );
}
