import { yupResolver } from '@hookform/resolvers/yup';
import { CallOutlined, CloseOutlined, EditOutlined } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Avatar, Box, Drawer, FormGroup, Grid, IconButton, InputAdornment, MenuItem, Typography } from '@mui/material';
import { getCookie } from 'cookies-next';
import { t } from 'i18next';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuthContext } from 'src/auth/useAuthContext';
import { FormProvider, RHFCheckbox, RHFSelect, RHFTextField } from 'src/components/hook-form';
import Image from 'src/components/image';
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import { HEADER } from 'src/config-global';
import useApi from 'src/hooks/useApi';
import useLocalStorage from 'src/hooks/useLocalStorage';
import { getCartItemOnline, resetCart } from 'src/redux/slices/product';
import { dispatch, useSelector } from 'src/redux/store';
import { NOT_EXIST_CHECK, OTP_API } from 'src/utils/constant';
import * as yup from 'yup';
import CorporateCustomerModal from './CorporateCustomerModal';
import CustomerProfileModal from './CustomerProfileModal';

export default function LoginModal({ open, onClose }) {
    const { login, customer } = useAuthContext();
    const { enqueueSnackbar } = useSnackbar();
    const { postApiData, getApiData } = useApi();
    const { currentVehicle, basicInfo, currentCity, onChangeVehicle,countryList } = useSettingsContext();

    const router = useRouter()

    const { checkout } = useSelector((state) => state.product);
    const { cart } = checkout;
    const cartList = cart.filter((cart) => cart.service_group_id).map((cart) => ({ service_group_id: cart.service_group_id, spare_part_id: cart.spare_part_id, }));
    const premiumCartList = cart.filter((cart) => cart.premium_id);

    const [loading, setLoading] = useState(false);
    const [loginBanner, setLoginBanner] = useState('');
    const [customerModal, setCustomerModal] = useState({ status: false, data: '' });

    const [phoneNumber, setPhoneNumber] = useLocalStorage('cup', '');


    const defaultValues = {
        phone_number: phoneNumber,
        otp: '',
        otp_send: false,
        isDefault: true,
        verify_id: '',
        register_country: {
            register_country_master_id: currentCity?.country_master_id || '',
            register_country_code: currentCity?.country_code || '',
        },
    };
    const validationSchema = yup.object({
        phone_number: yup.string()
            .required(`${t('phone_number_')} ${t('is_required')}`)
            .min(currentCity?.min_area_code_length, t('minium_characters').replace('%1$s', currentCity?.min_area_code_length))
            .max(currentCity?.max_area_code_length, t('maximum_characters').replace('%1$s', currentCity?.max_area_code_length)),
            
        otp: yup.string().when('otp_send', {
            is: true,
            then: yup.string().required(`${t('one_time_password_')} ${t('is_required')}`),
            otherwise: yup.string(),
        }),
    });

    const methods = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues,
    });
    const { watch, setValue, handleSubmit, reset,formState:{errors} } = methods;

    async function onSubmit(values) {
        setLoading(true);
        const data = {
            phone_number: values.phone_number.trim(),
            otp: values.otp,
            verify_id: values.verify_id,
            register_country_master_id: values.register_country.register_country_master_id,
            register_country_code: values.register_country.register_country_code,
        };
        watch('otp_send') ? await verifyOTP(data) : await sendOTP(data);
        setLoading(false)
    }

    // otp sent to customer
    async function sendOTP(values) {
        if (values) {
            const data = {
                phone_number: values.phone_number,
                selected_country_master_id: values.register_country_master_id,
            };
            const response = await postApiData(OTP_API.sendOtp, data);
            if (response) {
                setValue('otp_send', true);
                setValue('otp', '');
                setValue('verify_id', response.data.result.verify_id);
            }
        }
    }

    // otp verify
    async function verifyOTP(values) {
        if (values) {
            try {
                const formData = {
                    otp: values.otp,
                    verify_id: values.verify_id,
                    selected_country_master_id: values.register_country_master_id,
                    phone: values.phone_number.trim(),
                    cart_list: JSON.stringify(cartList),
                    device_id: 'web-login',
                    vehicle_model_master_id:  currentVehicle?.model?.vehicle_model_master_id || '',
                    register_country_master_id: values.register_country_master_id,
                    register_country_code: values.register_country_code,
                    premium_id: premiumCartList.length > 0 ? premiumCartList[0].premium_id : '',
                };
                const response = await login(formData);
                setPhoneNumber(values.phone_number);
                dispatch(resetCart());
                const data = response.data.result;

                if(data.vehicle_model_master_id){
                    const params = { vehicle_model_master_id: data.vehicle_model_master_id };
                    dispatch(getCartItemOnline(params));
                    onChangeVehicle(data, data)

                    const pathSegments = router.query.category || [];
                    if (!router.pathname.split('/').some((path) => NOT_EXIST_CHECK.includes(path))) {
                        var getUrl;
                        const currentPage = getCookie('currentPage')
                        if (currentPage == 'PACKAGE_LIST' || currentPage == 'PACKAGE_DETAILS') {
                            getUrl = `/${currentCity.slug}/${pathSegments[0]}/${data.vehicle_model_slug}`;
                        } else {
                            getUrl = `/${currentCity.slug}/${data.vehicle_model_slug}`;
                        }
                        router.push(`/[city]/[...category]`, getUrl);
                        
                    }
                }
                enqueueSnackbar(response.data.msg, { variant: 'success' });
                onClose({ status: false});
            } catch (error) {
                console.log(error)
                enqueueSnackbar(error.msg, { variant: 'error' });
            }
        }
    }

    useEffect(() => {
        basicInfo.length > 0 &&
            setLoginBanner(basicInfo.find((basic) => basic.setting_type == 'LOGIN_BANNER'));
    }, [basicInfo]);

    async function customerModalClose(value) {
        setCustomerModal({ status: false, data: '' });
    }

    const controller = new AbortController();
    const { signal } = controller;

    // const [countryList, setCountryList] = useState([]);
    // useEffect(() => {
    //     async function getCountryList() {
    //         const response = await getApiData(COUNTRY_API, signal);
    //         if (response) {
    //             setCountryList(response.data.result);
    //         }
    //     }
    //     open && getCountryList();
    //     return () => {
    //         controller.abort();
    //     };
    // }, [open]);

    const [corporateModal, setCorporateModal] = useState(false);
    async function corporateModalClose(value) {
        setCorporateModal(false);
    }

    useEffect(() => {
        reset()
    }, [customer])



    return (
        <>
            <Drawer
                variant="temporary"
                anchor={'right'}
                open={open}
                onClose={() => { onClose({ status: false }); reset()}}
                PaperProps={{ sx: { width: { xs: '100%', md: '550px' } } }}
            >
                <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                    <Box sx={{minHeight: HEADER.DASHBOARD_DESKTOP_HEIGHT,borderBottom: '1px solid',borderColor: 'divider',display: 'flex',alignItems: 'center',justifyContent: 'space-between',gap: 2,px: 2,}}>
                        <Typography variant="h6">{t('login_sign_up')}</Typography>
                        <IconButton aria-label="close modal" onClick={() => { onClose({ status: false }); reset(); }}>
                            <CloseOutlined />
                        </IconButton>
                    </Box>

                    <Box sx={{ overflow: 'hidden' }} display="flex" flexDirection={'column'} gap={2} flex={1}>
                        <Scrollbar sx={{ flex: 1 }}>
                            {loginBanner && loginBanner.media_url && (<Image src={loginBanner.media_url} alt={loginBanner.media_url_alt} />)}
                            <Box sx={{ py: 3, px: 2 }}>
                                <FormProvider methods={methods} autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
                                    <FormGroup>
                                        <Grid container spacing={2} rowSpacing={3}>
                                            <Grid item xs={12}>
                                                <Box display={'flex'} flexDirection="column" gap={1.5}>
                                                    <Typography variant="h6">
                                                        {!watch('otp_send') ? t('enter_your_phone_number') : t('verification')}
                                                    </Typography>
                                                    {!watch('otp_send') ? (
                                                        <Typography variant="body2" color={'text.secondary'}>
                                                            {t('we_will_send_you_a')}
                                                                <b>{t('four_digit_otp')}</b>{' '}<br />
                                                            {t('on_your_phone_number_for_verification')}
                                                        </Typography>
                                                    ) : (
                                                        <Typography variant="body2" color={'text.secondary'}>
                                                            {t('otp_sent_to_number').replace('%1$s', watch('phone_number'))}
                                                        </Typography>
                                                    )}
                                                </Box>
                                            </Grid>

                                            <Grid item xs={4}>
                                                {countryList?.length > 0 && (
                                                    <RHFSelect
                                                        name="register_country.register_country_master_id"
                                                        label={t('country_')}
                                                        SelectProps={{
                                                            native: false,
                                                        }}
                                                        disabled={watch('otp_send')}
                                                        onChange={(e) => {
                                                            setValue('register_country', {
                                                                register_country_master_id: e.target.value,
                                                                register_country_code: countryList.find((country) => country.country_master_id == e.target.value)['country_code'],
                                                            });
                                                        }}
                                                    >
                                                        {countryList.map((option, i) => (
                                                            <MenuItem
                                                                key={i}
                                                                value={option.country_master_id}
                                                                sx={{mx: 1,my: 0.5,borderRadius: 0.75,typography: 'body2',textTransform: 'capitalize'}}
                                                            >
                                                                <Box display={'flex'} alignItems="center" gap={1}>
                                                                    <Avatar
                                                                        src={option.media_url}
                                                                        alt={option.media_url_alt}
                                                                        sx={{ width: 20, height: 20, borderRadius: 0.2}}
                                                                    />
                                                                    <Typography variant="body2">
                                                                        {option.country_code}
                                                                    </Typography>
                                                                </Box>
                                                            </MenuItem>
                                                        ))}
                                                    </RHFSelect>
                                                )}
                                            </Grid>

                                            <Grid item xs={8}>
                                                <RHFTextField
                                                    autoComplete="off"
                                                    type="number"
                                                    name="phone_number"
                                                    label={t('phone_number_')}
                                                    InputProps={{
                                                        readOnly: watch('otp_send'),
                                                        startAdornment: (<InputAdornment position="start"><CallOutlined /></InputAdornment>),
                                                        endAdornment: (
                                                            <InputAdornment position="end">
                                                                {watch('otp_send') && (<IconButton onClick={() => setValue('otp_send', false)}><EditOutlined color="primary" /></IconButton>)}
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />
                                            </Grid>

                                            {watch('otp_send') && (
                                                <Grid item xs={12}>
                                                    <RHFTextField
                                                        type="number"
                                                        name="otp"
                                                        label={t('one_time_password_')}
                                                        InputProps={{
                                                            endAdornment: (
                                                                <InputAdornment position="end">
                                                                    <IconButton onClick={() => sendOTP({ phone_number: watch('phone_number'), register_country_master_id: watch('register_country.register_country_master_id'), })}>
                                                                        <Typography variant="body2" fontWeight={'medium'} color={'primary'}>
                                                                            {t('resend_otp')}
                                                                        </Typography>
                                                                    </IconButton>
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                    />
                                                </Grid>
                                            )}

                                            <Grid item xs={12}>
                                                <RHFCheckbox name="isDefault" label={t('agree_terms')} sx={{ ml: 0, mb: 2 }} />
                                                <LoadingButton disabled={!watch('isDefault')} sx={{ textTransform: 'uppercase' }} loading={loading} fullWidth variant="contained" type="submit">
                                                    {watch('otp_send') ? t('sign_in') : t('continue')}
                                                </LoadingButton>
                                            </Grid>
                                        </Grid>
                                    </FormGroup>
                                </FormProvider>
                            </Box>
                            <Box sx={{ px: 2 }}>
                                <Box sx={{display: 'flex',justifyContent: 'flex-end',flexDirection: 'column',}}>
                                    <Typography variant="h6">
                                        {t('are_you_a_corporate_customer')}
                                    </Typography>
                                    <Typography variant="body2" color={'text.secondary'}>
                                        {t('get_support_earn_more')}
                                    </Typography>
                                    <Typography variant="subtitle2" mt={1} fontWeight={'400'}>
                                        {t('register_corporate_customer')}{' '}
                                        <Typography
                                            component={'span'}
                                            fontWeight={'bold'}
                                            color="primary"
                                            sx={{ cursor: 'pointer' }}
                                            onClick={() => setCorporateModal(true)}
                                        >
                                            {t('click_here')}
                                        </Typography>
                                    </Typography>
                                </Box>
                            </Box>
                        </Scrollbar>
                    </Box>
                </Box>
            </Drawer>

            {customerModal.status && (
                <CustomerProfileModal
                    open={customerModal.status}
                    onClose={customerModalClose}
                    referenceData={customerModal.data}
                />
            )}

            <CorporateCustomerModal open={corporateModal} onClose={corporateModalClose} />
        </>
    );
}
