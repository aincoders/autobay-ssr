import { yupResolver } from '@hookform/resolvers/yup';
import { ArrowDropDown, Search } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { alpha, Box, Card, Container, Grid, InputAdornment, Typography } from '@mui/material';
import { t } from 'i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Image from 'src/components/image/';
import { useSettingsContext } from 'src/components/settings';
import useApi from 'src/hooks/useApi';
import useLocalStorage from 'src/hooks/useLocalStorage';
import useResponsive from 'src/hooks/useResponsive';
import { replaceString } from 'src/utils/arraytoTree';
import { CUSTOMER_API } from 'src/utils/constant';
import * as yup from 'yup';
import { FormProvider, RHFTextField } from '../../components/hook-form';
import { APP_NAME, SPACING } from '../../config-global';
import { MakeMasterModal } from '../../master';
import { HomePageContext } from '../../mycontext/HomePageContext';
import AppStoreIcon from 'src/assets/image/get_it_on_app_store.svg';
import GooglePlayIcon from 'src/assets/image/get_it_on_google_play.svg';
import ModelMasterModal from 'src/master/ModelMasterModal';

export default function HomePageTitle() {
    const { currentCity, currentVehicle, searchVehicle, sectionList } = useContext(HomePageContext);
    const { make, model } = currentVehicle

    const { postApiData } = useApi();

    const [isSticky, setIsSticky] = useState(false);
    const { basicInfo } = useSettingsContext();
    const [phoneNumber, setPhoneNumber] = useLocalStorage('cup', '');
    const { enqueueSnackbar } = useSnackbar();

    const [makeModal, setMakeModal] = useState(false);
    function makeModalClose(value) {
        console.log(value)
        setMakeModal(false);
    }

    const defaultValues = {
        vehicle_make_model: {
            make_id: make.vehicle_make_master_id || '',
            make_name: make.vehicle_make_name || '',
            model_id: model.vehicle_model_master_id || '',
            model_name: model.vehicle_model_name || '',
        },
        phone_number: phoneNumber,
    };

    const validationSchema = yup.object({});

    const methods = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues,
    });

    const {
        resetField,
        watch,
        setValue,
        handleSubmit,
        formState: { isSubmitting, errors },
    } = methods;

    const onSubmit = async (values) => {
        if (values.vehicle_make_model.model_id == '') {
            enqueueSnackbar(`${t('vehicle_')} ${t('is_required')}`, { variant: 'error' });
        } else if (values.phone_number == '') {
            enqueueSnackbar(`${t('phone_number_')} ${t('is_required')}`, { variant: 'error', });
        } else {
            const data = { vehicle_model_master_id: values.vehicle_make_model.model_id, phone: values.phone_number };
            customerLead(data);
        }
    };

    const router = useRouter();

    // generate lead
    async function customerLead(data) {
        const response = await postApiData(CUSTOMER_API.createLead, data);
        if (response) {
            setPhoneNumber(data.phone);
            const packageCategorySlug = response.data.result.package_category_slug;
            var getUrl = `/${currentCity.slug}/${packageCategorySlug}/${model ? model.vehicle_model_slug : (make && make.vehicle_make_slug)}`;
            router.push(`/[city]/[...category]?packageCategory=true`, getUrl);
        }
    }

    useEffect(() => {
        if (make && model) {
            resetField('vehicle_make_model');
            setValue('vehicle_make_model', {
                make_id: make.vehicle_make_master_id,
                make_name: make.vehicle_make_name,
                model_id: model.vehicle_model_master_id,
                model_name: model.vehicle_model_name,
            });
        }
    }, [make, model]);

    const APP_STORE = basicInfo.length > 0 ? basicInfo.find((basic) => basic.setting_type == 'APP_STORE').description : '';
    const PLAY_STORE = basicInfo.length > 0 ? basicInfo.find((basic) => basic.setting_type == 'PLAY_STORE').description : '';
    const isDesktop = useResponsive('up', 'lg');

    if (!sectionList.find((item) => item.section_type == 'SEARCH_VEHICLE')) return null
    return (
        <>
            {isDesktop ? (
                <Box>
                    <Box sx={{ bgcolor: (theme) => theme.palette.secondary.main, py: { xs: SPACING.xs, md: SPACING.md } }}>
                        <Container maxWidth="lg" >
                            <Box display={'flex'} flexDirection="column" gap={2}>
                                <Box display={'flex'} flexDirection="column" sx={{ textAlign: 'center' }}>
                                    <Typography variant={isDesktop ? 'h3' : 'subtitle2'} component="h1" color='background.paper' >
                                        {replaceString(searchVehicle.homepage_section_title)}
                                    </Typography>
                                    <Typography variant={isDesktop ? 'body1' : 'caption'} color='background.paper'>
                                        {replaceString(searchVehicle.homepage_section_description)}
                                    </Typography>
                                </Box>
                                <FormProvider methods={methods} autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
                                    <Box display={'flex'} alignItems="stretch" sx={{ bgcolor: 'background.paper', borderRadius: 1.3 }} component={Card}>
                                        <Box
                                            onClick={() => setMakeModal(true)}
                                            sx={{ flex: 1, display: 'flex', flexDirection: 'column', py: 2, pl: 2, justifyContent: 'center', borderRight: '1px solid', borderColor: 'divider' }}
                                        >
                                            <RHFTextField
                                                value={`${watch('vehicle_make_model.make_name')}${watch('vehicle_make_model.model_name') ? ` - ${watch('vehicle_make_model.model_name')}` : ""}`}
                                                autoComplete="off"
                                                variant="standard"
                                                name="vehicle_make_model.model_name"
                                                placeholder={t('select_vehicle')}
                                                fullWidth
                                                InputProps={{
                                                    endAdornment: (<InputAdornment position="start"><ArrowDropDown fontSize="small" /></InputAdornment>),
                                                    disableUnderline: true,
                                                    readOnly: true,
                                                    style: { fontSize: 16 },
                                                }}
                                            />
                                        </Box>
                                        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', py: 2, pl: 2, justifyContent: 'center', borderRight: '1px solid', borderColor: 'divider', }}>
                                            <RHFTextField
                                                autoComplete="off"
                                                type={'number'}
                                                variant="standard"
                                                name="phone_number"
                                                placeholder={t('phone_number')}
                                                fullWidth
                                                InputProps={{
                                                    startAdornment: (<InputAdornment position="start">+{currentCity?.country_code}</InputAdornment>),
                                                    disableUnderline: true,
                                                    style: { fontSize: 16 },
                                                }}
                                            />
                                        </Box>

                                        <LoadingButton
                                            loading={isSubmitting}
                                            type="submit"
                                            variant="contained"
                                            sx={{ minWidth: 180, textTransform: 'uppercase', borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                                        >
                                            {t('check_prices_for_free')}
                                        </LoadingButton>
                                    </Box>
                                </FormProvider>
                                <Box display={'flex'} flexDirection="column" justifyContent={'center'} alignItems="center" gap={1}>
                                    <Typography variant={isDesktop ? 'body1' : 'caption'} noWrap color='background.paper'>
                                        {t('download_app_to_get_more_exciting_offers').replace("%1$s", APP_NAME)}
                                    </Typography>
                                    <Box display={'flex'} alignItems="center" justifyContent={'center'} gap={2} >
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
                            </Box>
                        </Container>
                    </Box>
                </Box>
            ) : (
                <Box sx={{ py: SPACING.xs, bgcolor: 'background.paper' }}>
                    <Container maxWidth="xl">
                        <Box>
                            <Box display={'flex'} flexDirection="column" gap={3}>
                                <Box display={'flex'} flexDirection="column">
                                    <Typography variant={'h6'}>
                                        {replaceString(searchVehicle.homepage_section_title)}
                                    </Typography>
                                    <Typography variant={'caption'} color="text.secondary">
                                        {replaceString(searchVehicle.homepage_section_description)}
                                    </Typography>
                                </Box>
                                <FormProvider methods={methods} autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
                                    <Grid container spacing={2} rowSpacing={2}>
                                        <Grid item xs={12}>
                                            <RHFTextField
                                                autoComplete="off"
                                                name="vehicle_make_model.model_name"
                                                placeholder={'Search by brands, models'}
                                                fullWidth
                                                InputProps={{
                                                    startAdornment: (<InputAdornment position="start"><Search fontSize="small" /></InputAdornment>),
                                                    endAdornment: (<InputAdornment position="end"><ArrowDropDown fontSize="small" /></InputAdornment>),
                                                    readOnly: true,
                                                }}
                                                onClick={() => setMakeModal(true)}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <RHFTextField
                                                autoComplete="off"
                                                type={'number'}
                                                name="phone_number"
                                                placeholder={'Phone number'}
                                                fullWidth
                                                InputProps={{
                                                    startAdornment: (<InputAdornment position="start">+{currentCity?.country_code}</InputAdornment>),
                                                }}
                                            />
                                        </Grid>

                                        <Grid item xs={12}>
                                            <LoadingButton
                                                fullWidth
                                                loading={isSubmitting}
                                                type="submit"
                                                variant="contained"
                                                sx={{
                                                    textTransform: 'uppercase',
                                                }}
                                            >
                                                Check Prices For Free
                                            </LoadingButton>
                                        </Grid>
                                    </Grid>
                                </FormProvider>
                            </Box>
                        </Box>
                    </Container>
                </Box>
            )}

            {currentVehicle.make
                ? <ModelMasterModal open={makeModal} onClose={makeModalClose} referenceData={currentVehicle.make} directOpen />
                : <MakeMasterModal open={makeModal} onClose={makeModalClose} />}
        </>
    );
}
