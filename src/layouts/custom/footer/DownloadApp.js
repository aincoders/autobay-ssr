import { yupResolver } from '@hookform/resolvers/yup';
import { CallOutlined } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Avatar, Box, Container, Grid, InputAdornment, lighten, MenuItem, Typography } from '@mui/material';
import { t } from 'i18next';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import AppStoreIcon from 'src/assets/image/get_it_on_app_store.svg';
import GooglePlayIcon from 'src/assets/image/get_it_on_google_play.svg';
import { FormProvider, RHFSelect, RHFTextField } from 'src/components/hook-form';
import Image from 'src/components/image';
import { useSettingsContext } from 'src/components/settings';
import { APP_NAME, SPACING } from 'src/config-global';
import useApi from 'src/hooks/useApi';
import useResponsive from 'src/hooks/useResponsive';
import { DOWNLOAD_APP_API } from 'src/utils/constant';
import * as yup from 'yup';


export default function DownloadApp() {
    const isDesktop = useResponsive('up', 'lg');
    const { postApiData } = useApi()
    const { basicInfo, currentCity, countryList } = useSettingsContext();


    const download_app = basicInfo.length > 0 ? basicInfo.find((basic) => basic.setting_type == 'DOWNLOAD_APP') : '';
    const APP_STORE = basicInfo.length > 0 ? basicInfo.find((basic) => basic.setting_type == 'APP_STORE').description : '';
    const PLAY_STORE = basicInfo.length > 0 ? basicInfo.find((basic) => basic.setting_type == 'PLAY_STORE').description : '';


    const defaultValues = {
        phone_number: '',
        country: {
            country_master_id: currentCity ? currentCity.country_master_id : '',
            country_code: currentCity ? currentCity.country_code : '',
            min_area_code_length: currentCity ? currentCity.min_area_code_length : '',
            max_area_code_length: currentCity ? currentCity.max_area_code_length : '',
        },
    };
    const validationSchema = yup.object({
        // phone_number: yup.string()
        //     .required(`${t('phone_number_')} ${t('is_required')}`)
        //     .when(['country.min_area_code_length', 'country.max_area_code_length'], (minLength, maxLength, schema) => {
        //         return schema.min(minLength, t('minium_characters').replace('%1$s', minLength))
        //             .max(maxLength, t('maximum_characters').replace('%1$s', maxLength));
        //     }),
    });

    const methods = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues,
    });
    const { watch, setValue, handleSubmit, reset, formState: { isSubmitting } } = methods;

    async function onSubmit(values) {
        const data = {
            phone: values.phone_number.trim(),
            country_master_id: values.country.country_master_id,
        };
        await sendAppLik(data);
    }

    async function sendAppLik(values) {
        if (values) {
            const response = await postApiData(DOWNLOAD_APP_API.sendSms, values);
            if (response) {
            }
        }
    }

    if (!download_app || download_app.media_url == '') return null;

    return (
        <>
            <Box sx={{ py: { xs: SPACING.xs, md: SPACING.md }, bgcolor: (theme) => lighten(theme.palette.primary.main, 0.15), color: "background.paper" }}>
                <Container maxWidth="lg" >
                    <Grid container spacing={4} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <Image src={download_app.media_url} sx={{ height: 'auto', width: "75%", display: 'block', margin: 'auto' }} />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box display={'flex'} flexDirection="column" gap={3} alignItems="flex-start">
                                <Box>
                                    <Typography variant={isDesktop ? 'h3' : 'h6'}>{`Download ${APP_NAME} App`}</Typography>
                                    <Typography variant={isDesktop ? 'subtitle2' : 'caption'} >
                                        {download_app.description ? download_app.description :
                                            "Book car services and enjoy a seamless experience with Bahrain's first digital garage"}
                                    </Typography>
                                </Box>
                                <Box sx={{ py: 1, width: "100%" }}>
                                    <FormProvider methods={methods} autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
                                        <Grid container spacing={2} rowSpacing={3} alignItems='stretch'>
                                            {countryList.length > 0 &&
                                                <Grid item xs={6} md={2}>
                                                    <RHFSelect
                                                        size='small'
                                                        name="country.country_master_id"

                                                        InputProps={{
                                                            style: { backgroundColor: "#fff", },
                                                        }}
                                                        disabled={watch('otp_send')}
                                                        onChange={(e) => {
                                                            setValue('country', {
                                                                country_master_id: e.target.value,
                                                                country_code: countryList.find((country) => country.country_master_id == e.target.value).country_code,
                                                                max_area_code_length: countryList.find((country) => country.country_master_id == e.target.value).max_area_code_length,
                                                                min_area_code_length: countryList.find((country) => country.country_master_id == e.target.value).min_area_code_length
                                                            });
                                                        }}
                                                    >
                                                        {countryList.map((option, i) => (
                                                            <MenuItem
                                                                key={i}
                                                                value={option.country_master_id}
                                                                sx={{ mx: 0.2, my: 0.5, borderRadius: 0.75, typography: 'body2', textTransform: 'capitalize' }}
                                                            >
                                                                <Box display={'flex'} alignItems="center" gap={1}>
                                                                    <Avatar
                                                                        src={option.media_url}
                                                                        alt={option.media_url_alt}
                                                                        sx={{ width: 20, height: 20, borderRadius: 3 }}
                                                                    />
                                                                    <Typography variant="body2">
                                                                        {option.country_code}
                                                                    </Typography>
                                                                </Box>
                                                            </MenuItem>
                                                        ))}
                                                    </RHFSelect>
                                                </Grid>
                                            }

                                            <Grid item xs={6} md={6}>
                                                <RHFTextField
                                                    size='small'
                                                    autoComplete="off"
                                                    type="number"
                                                    name="phone_number"
                                                    InputProps={{
                                                        startAdornment: (<InputAdornment position="start"><CallOutlined fontSize='small' /></InputAdornment>),
                                                        style: { backgroundColor: "#fff", },
                                                    }}
                                                />
                                            </Grid>

                                            <Grid item xs={12} md={4}>
                                                <LoadingButton
                                                    color='inherit'
                                                    loading={isSubmitting}
                                                    sx={{ textTransform: 'uppercase', height: "100%", bgcolor: 'background.paper', color: 'text.primary' }}
                                                    fullWidth
                                                    variant="contained"
                                                    type="submit" >
                                                    {t('get_the_app_link')}
                                                </LoadingButton>
                                            </Grid>
                                        </Grid>
                                    </FormProvider>
                                </Box>
                                <Box display={'flex'} alignItems="center" justifyContent={'center'} gap={2}>
                                    {PLAY_STORE &&
                                        <Link href={PLAY_STORE} target={'_blank'} rel="noopener">
                                            <Image src={GooglePlayIcon.src} sx={{ height: 'auto', width: 140 }} />
                                        </Link>
                                    }
                                    {APP_STORE &&
                                        <Link href={APP_STORE} target={'_blank'} rel="noopener">
                                            <Image src={AppStoreIcon.src} sx={{ height: 'auto', width: 140 }} />
                                        </Link>
                                    }
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </>
    );
}
