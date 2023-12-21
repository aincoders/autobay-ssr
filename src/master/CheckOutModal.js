import { yupResolver } from '@hookform/resolvers/yup';
import { CloseOutlined, HideSource, RadioButtonChecked, RadioButtonUncheckedOutlined, TitleOutlined } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Alert, Box, Card, CircularProgress, Drawer, FormGroup, Grid, IconButton, InputAdornment, Stack, Typography } from '@mui/material';
import { t } from 'i18next';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import TabbyLogo from 'src/assets/image/tabby.svg';
import TapLogo from 'src/assets/image/tap.png';
import { useAuthContext } from 'src/auth/useAuthContext';
import { FormProvider, RHFTextField } from 'src/components/hook-form';
import Image from 'src/components/image';
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import { APP_NAME, HEADER } from 'src/config-global';
import useApi from 'src/hooks/useApi';
import { useLocales } from 'src/locales';
import { CartPageContext } from 'src/mycontext/CartPageContext';
import { applyTabbyCheckoutID, resetCart } from 'src/redux/slices/product';
import { useDispatch, useSelector } from 'src/redux/store';
import { PATH_CUSTOMER } from 'src/routes/paths';
import TabbyCheckoutComponent from 'src/sections/package_list/tabby/TabbyCheckoutComponent';
import axios from 'src/utils/axios';
import checkUserAgent from 'src/utils/checkUserAgent';
import { CUSTOMER_API } from 'src/utils/constant';
import * as yup from 'yup';
import CheckoutOrderComplete from './CheckoutOrderComplete';

// const PAYMENT_MODE = [{ label:t('cash_on_delivery'), value: "1" }, { label: t('online_payment'), value: 2 }];

const ONLINE_PAYMENT_TYPE = [
    { label: t('cash_on_delivery'), value: "1", desc: t('local_regional_global_payment_methods'), img: '' },
    { label: t('credit_debit'), value: "2", desc: t('local_regional_global_payment_methods'), img: TapLogo.src },
    { label: t('tabby_title'), value: '3', desc: '', img: TabbyLogo.src, more: true },
];

export default function CheckOutModal({ open, onClose }) {
    const { responseList, cartDetails } = useContext(CartPageContext);
    const {  towing_total_amount,  } = cartDetails;

    const { currentCity, currentVehicle } = useSettingsContext();
    const { customer } = useAuthContext();
    const { postApiData, getApiData } = useApi();
    const [loading, setLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar()
    const { isMobile } = checkUserAgent()


    const router = useRouter();

    const { checkout } = useSelector((state) => state.product);
    const { billingAddress, bookingTime, bookingDate, preferWorkshop, promocode, promoWalletType,pickupDrop } = checkout;
    const dispatch = useDispatch();


    const defaultValues = {
        promo_code_id: promocode,
        promo_wallet_type: promoWalletType,
        additional_notes: '',
        vehicle_model_master_id: '',
        vehicle_number: '',
        customer_address_id: '',
        timeslot_id: '',
        timeslot_booking_date: '',
        garage_id: '',
        payment_method: ONLINE_PAYMENT_TYPE[0].value,
        order_source: isMobile ? 'Mobile website' : "Website",
        towing_type: pickupDrop ? '1' : '0',
        towing_charge: pickupDrop ? towing_total_amount : 0
    };


    useEffect(() => {
        if (open) {
            setValue('vehicle_model_master_id', currentVehicle.model.vehicle_model_master_id);
            setValue('vehicle_number', currentVehicle.model?.vehicle_reg_no || "");
            setValue('customer_address_id', billingAddress.customer_address_id);
            setValue('timeslot_id', bookingTime.timeslot_id);
            setValue('timeslot_booking_date', bookingDate.date);
            setValue('garage_id', preferWorkshop ? preferWorkshop.garage_id : '');
        }
    }, [open, currentVehicle, billingAddress, bookingTime, bookingDate, preferWorkshop]);

    const validationSchema = yup.object({
        vehicle_number: yup.string()
        .test('max-length', t('maximum_characters').replace('%1$s', 6), function (value) {
            return currentCity.country_code == '973' ? value.length <= 6 : true
        })
        .required(`${t('vehicle_number_')} ${t('is_required')}`),
    });

    const methods = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues,
    });
    const { watch, setValue, getValues, handleSubmit, reset } = methods;

    const totalAmount  = pickupDrop? Number(cartDetails.total_amount) + Number(towing_total_amount) : cartDetails.total_amount

    async function onSubmit(values) {
        setLoading(true);
        const data = {
            ...getValues(),
            total_paid_amount: totalAmount,
            payment_id: '',
            payment_gateway: '',
            payment_type: values.payment_method,
            
        };
        if (getValues().payment_method == '1') {
            await CustomerOrderPlace(data);
        } else {
            getValues().payment_method == '2' ? await CustomerOrderPlaceTapPayment(data) : await CustomerOrderPlaceTabbyPayment(data);
        }
        setLoading(false);
    }

    const [gosellCartList, setGoSellCartList] = useState([]);
    const [tabbyCartList, setTabbyCartList] = useState([]);


    useEffect(() => {
        if (responseList) {
            setGoSellCartList(
                responseList.map((item) => ({
                    id: item.spare_part_id || item.premium_id,
                    name: item.service_group_name || item.premium_title,
                    description: item.spare_part_group_name,
                    quantity: 1,
                    amount_per_unit: `${currentCity.currency_symbol} ${item.service_group_total || item.price_total_after_discount}`,
                    total_amount: `${currentCity.currency_symbol} ${item.service_group_total || item.price_total_after_discount}`,
                }))
            );
            setTabbyCartList(
                responseList.map((item) => ({
                    title: item.service_group_name || item.premium_title,
                    description: item.spare_part_group_name || '',
                    quantity: 1,
                    unit_price: item.service_group_total || item.premium_model_price,
                    discount_amount: item.cart_premium_id ? item.discount_amount : Number(item.service_group_main_total - item.service_group_total),
                    reference_id: item.cart_id || item.cart_premium_id,
                    image_url: item.media_url ? encodeURI(item.media_url) : '',
                    category: "Automobile",
                }))
            );
        }
    }, [responseList]);

    // Cash on delivery Order Placed
    async function CustomerOrderPlace(data) {
        if (data) {
            try {
                const response = await postApiData(CUSTOMER_API.orderPlaced, data);
                if (response.status == 200) {
                    const data = response.data.result
                    setOrderSuccessModal({ status: true, data: data });
                    CustomerOrderNotification(data.customer_order_id)
                }
            } catch (error) {
                console.log(error);
            }
        }
    }

    async function CustomerOrderNotification(customerOrderID) {
        if (customerOrderID) {
            try {
                const params = { customer_order_id: customerOrderID }
                const response = await postApiData(CUSTOMER_API.orderPlacedMail, params);
            } catch (error) {
                console.log(error);
            }
        }
    }


    // Tap Payment Order placed
    async function CustomerOrderPlaceTapPayment(formData) {
        if (formData) {
            try {
                const tapPaymentData = tapPaymentObject(cartDetails, gosellCartList, getValues, customer)
                const paymentData = { payment_info: JSON.stringify(tapPaymentData) }
                const response = await postApiData(CUSTOMER_API.createTapPayment, paymentData);
                if (response.status == 200) {
                    const data = response.data.result;
                    if (data.status == "INITIATED") {
                    router.push(data.transaction.url);
                    }else{
                        enqueueSnackbar(data.response.message || data.response.description, { variant: 'error' })
                    }
                }
            } catch (error) {
                console.log(error);
            }
        }
    }


    // create tabby webhook
    // async function CreateTabbyWebhook() {
    //     setLoading(true)
    //         try {
    //             const createWebhookInfo = { url: encodeURI("https://www.autobay.me/api/tabbyWebhook"), is_test: true }
    //             const webhookInfo = { webhook_info: JSON.stringify(createWebhookInfo) }
    //             const response = await postApiData(CUSTOMER_API.createWebhook, webhookInfo);
    //             if (response && response.status == 200) {
    //                 console.log(data)
    //             }
    //         } catch (error) {
    //             console.log(error);
    //         }
    //     setLoading(false)
    // }


    // Tabby Payment Order placed
    async function CustomerOrderPlaceTabbyPayment(formData) {
        if (formData) {
            try {
                const tapPaymentData = tabbyPaymentObject(cartDetails, tabbyCartList, getValues, customer, billingAddress)
                const paymentData = { payment_info: JSON.stringify(tapPaymentData) }
                const response = await postApiData(CUSTOMER_API.createTabbyPayment, paymentData);
                if (response.status == 200) {
                    const data = response.data.result;
                    if (data.status == 'created') {
                        dispatch(applyTabbyCheckoutID(''))
                        if (data.configuration.available_products.installments) {
                            dispatch(applyTabbyCheckoutID(data.id))
                            router.push(data.configuration.available_products.installments[0].web_url);
                        } else {
                            enqueueSnackbar(t('error_something_went_wrong'), { variant: 'error' })
                        }
                    } else {
                        enqueueSnackbar(t(`${data.configuration.products.installments.rejection_reason}`), { variant: 'error' })
                    }

                }
            } catch (error) {
                console.log(error);
            }
        }
    }

    const [showTabbyError, setShowTabbyError] = useState({ status: false, msg: '' })
    const [loadingTabby, setLoadingTabby] = useState(true)

    // check customer eligible for tabby payment
    useEffect(()=>{
        async function checkCustomerEligibleTabbyPayment() {
            const tapPaymentData = tabbyPaymentObject(cartDetails, tabbyCartList, getValues, customer, billingAddress)
            const paymentData = { payment_info: JSON.stringify(tapPaymentData) }
            const response = await postApiData(CUSTOMER_API.createTabbyPayment, paymentData);
            if (response.status == 200) {
                const data = response.data.result;
                if (data.status != 'created') {
                    setShowTabbyError({ status: true, msg: data.configuration.products.installments.rejection_reason })
                }
            }
            setLoadingTabby(false)
        }
        if(open){
            checkCustomerEligibleTabbyPayment()
        } 
    },[open])




    const [orderSuccessModal, setOrderSuccessModal] = useState({ status: false, data: '' });
    function orderSuccessModalClose() {
        dispatch(resetCart());
        router.push(PATH_CUSTOMER.ordersDetails(btoa(orderSuccessModal.data.customer_order_id)))
    }

    const { currentLang } = useLocales()

    useEffect(() => {
        loadTabbyPromoScript()
    }, []);

    const loadTabbyPromoScript = () => {
        const script = document.createElement('script');
        script.src = 'https://checkout.tabby.ai/tabby-promo.js';
        script.async = true;
        document.body.appendChild(script);
        script.onload = () => {
            new TabbyPromo({
                lang: currentLang.value
            });
        };
    };


    function tapPaymentObject(cartDetails, gosellCartList, getValues, customer) {
        return {
            amount: totalAmount,
            currency: "BHD",
            customer_initiated: true,
            threeDSecure: true,
            save_card: true,
            description: APP_NAME,
            order: gosellCartList,
            metadata: {
                ...getValues(),
                payment_type: "2",
                companyId: axios.defaults.headers.companyId,
                customerId: axios.defaults.headers.customerId,
                applicationId: axios.defaults.headers.applicationId,
                countryMasterId: axios.defaults.headers.countryMasterId,
                regionMasterId: axios.defaults.headers.regionMasterId,
                cityMasterId: axios.defaults.headers.cityMasterId,
                workshopTypeId: axios.defaults.headers.workshopTypeId
            },
            reference: {
                transaction: `txn_${Date.now()}`,
                order: `ord_${Date.now()}`
            },
            receipt: { email: true, sms: true },
            customer: {
                first_name: customer?.first_name,
                middle_name: "",
                last_name: customer?.last_name,
                email: customer?.email,
                phone: { country_code: customer?.country_code, number: customer?.phone }
            },
            source: { id: "src_all" },
            post: { url: "https://autobay.me/api/tapWebhook" },
            redirect: { url: "https://autobay.me/tap-payment" }
        };
    }
    
    function tabbyPaymentObject(cartDetails, tabbyCartList, getValues, customer, billingAddress) {
        return {
            payment: {
                amount: totalAmount,
                currency: "BHD",
                description: APP_NAME,
                buyer: {
                    phone: `${customer?.country_code}${customer?.phone}`,
                    email: customer?.email,
                    name: `${customer?.first_name} ${customer?.last_name}`,
                },
                shipping_address: {
                    city: billingAddress?.city_name,
                    address: billingAddress?.address_line1,
                    zip: billingAddress?.pin_code
                },
                order: {
                    discount_amount: cartDetails.total_discount,
                    reference_id: `ORD-${Date.now()}`,
                    items: tabbyCartList,
                },
                buyer_history: {
                    registered_since: new Date().toISOString(),
                    loyalty_level: 0,
                },
                order_history: [
                    {
                        purchased_at: new Date().toISOString(),
                        amount: totalAmount,
                        payment_method: "card",
                        status: "new",
                        buyer: {
                            phone: `${customer?.country_code}${customer?.phone}`,
                            email: customer?.email,
                            name: `${customer?.first_name} ${customer?.last_name}`,
                        },
                        shipping_address: {
                            city: billingAddress?.city_name,
                            address: billingAddress?.address_line1,
                            zip: billingAddress?.pin_code
                        },
                        items: tabbyCartList
                    }
                ],
                meta: {
                    ...getValues(),
                    payment_type: "2",
                    companyId: axios.defaults.headers.companyId,
                    customerId: axios.defaults.headers.customerId,
                    applicationId: axios.defaults.headers.applicationId,
                    countryMasterId: axios.defaults.headers.countryMasterId,
                    regionMasterId: axios.defaults.headers.regionMasterId,
                    cityMasterId: axios.defaults.headers.cityMasterId,
                    workshopTypeId: axios.defaults.headers.workshopTypeId
                },
            },
            lang: "en",
            merchant_code: "AutoBaybhr",
            merchant_urls: {
                success: "https://autobay.me/tabby-payment/success",
                cancel: "https://autobay.me/tabby-payment/cancel",
                failure: "https://autobay.me/tabby-payment/failure"
            },
        };
    }


    return (
        <>
            <Drawer
                variant="temporary"
                anchor={'right'}
                open={open}
                onClose={() => { onClose({ update: false }); reset(); }}
                PaperProps={{ sx: { width: { xs: '100%', md: '550px' } } }}
            >
                <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                    <Box sx={{ minHeight: HEADER.DASHBOARD_DESKTOP_HEIGHT, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, px: 2, }}>
                        <Typography variant="h6">{t('checkout')}</Typography>
                        <IconButton aria-label="close modal" onClick={() => { onClose({ update: false }); reset(); }}><CloseOutlined /></IconButton>
                    </Box>

                    <Box sx={{ overflow: 'hidden' }} display="flex" flexDirection={'column'} gap={2} flex={1}>
                        {loadingTabby ?
                            <Box display={'flex'} alignItems='center' justifyContent={'center'} sx={{height:'100vh'}}>
                        <CircularProgress />
                        </Box>
                            : <Scrollbar sx={{ flex: 1 }}>
                                <Box sx={{ py: 3, px: 2 }}>
                                    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                                        <FormGroup>
                                            <Grid container spacing={2} rowSpacing={3}>
                                                <Grid item xs={12}>
                                                    <RHFTextField rows={3} multiline name="additional_notes" label={t('additional_notes')} />
                                                </Grid>

                                                <Grid item xs={12}>
                                                    {currentCity.country_code == '973'
                                                        ?
                                                        <RHFTextField
                                                            inputProps={{ maxLength: 6 }}
                                                            name="vehicle_number"
                                                            label={t('vehicle_number_')}
                                                            onChange={(e) => {
                                                                const numericValue = e.target.value.replace(/\D/g, '');
                                                                e.target.value = numericValue;
                                                                setValue('vehicle_number', numericValue);
                                                            }}
                                                            InputProps={{ startAdornment: (<InputAdornment position="start"><TitleOutlined /></InputAdornment>) }}
                                                        />
                                                        :
                                                        <RHFTextField name="vehicle_number" label={t('vehicle_number_')} InputProps={{ startAdornment: (<InputAdornment position="start"><TitleOutlined /></InputAdornment>) }} />
                                                    }
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Stack spacing={2} mb={2}>
                                                        <Typography variant="subtitle2">{t('payment_option')}</Typography>
                                                        <Box display={'grid'} gridTemplateColumns={'repeat(1, 1fr)'} gap={2}>
                                                            {ONLINE_PAYMENT_TYPE.map((mode) => (
                                                                <Card key={mode.value}>
                                                                    <Box display={'flex'} flexDirection='row' alignItems={'center'} justifyContent='space-between' sx={{ p: 2, gap: 2 }}>
                                                                        <Box display={'flex'} alignItems={'center'} gap={1}>
                                                                            <IconButton
                                                                                onClick={() => setValue('payment_method', mode.value)}
                                                                                disabled={mode.more && showTabbyError.status}
                                                                            >
                                                                                {mode.more && showTabbyError.status ?

                                                                                    <HideSource fontSize='small' />

                                                                                    : watch('payment_method') == mode.value
                                                                                        ? <RadioButtonChecked fontSize='small' sx={{ color: watch('payment_method') == mode.value ? 'primary.main' : 'inherit' }} />
                                                                                        : <RadioButtonUncheckedOutlined fontSize='small' />
                                                                                }
                                                                            </IconButton>
                                                                            <Box display={'flex'} alignItems='center' gap={1}>
                                                                                <Box display={'flex'} flexDirection='column' alignItems={'flex-start'}>
                                                                                    <Typography variant='subtitle2' >{mode.label}</Typography>
                                                                                    <Typography variant='caption' color={'text.secondary'} >{mode.desc}</Typography>
                                                                                </Box>
                                                                            </Box>
                                                                        </Box>
                                                                        {mode.img && <Image src={mode.img} sx={{ height: 25 }} />}
                                                                    </Box>
                                                                    {mode.more && showTabbyError.status && <Box sx={{ p: 1 }}><Alert severity="error">{t(showTabbyError.msg)}</Alert></Box>}
                                                                    {mode.more && <Box sx={{ pl: 7.5 }}><TabbyCheckoutComponent Price={totalAmount} /></Box>}
                                                                </Card>
                                                            ))}
                                                        </Box>
                                                    </Stack>
                                                </Grid>

                                                <Grid item xs={12}>
                                                    <LoadingButton loading={loading} fullWidth variant="contained" size="large" type="submit" sx={{ textTransform: 'uppercase' }}>
                                                        {t('confirm_order')}
                                                    </LoadingButton>
                                                </Grid>
                                            </Grid>
                                        </FormGroup>
                                    </FormProvider>
                                </Box>
                            </Scrollbar>
                        }
                        
                    </Box>
                </Box>
            </Drawer>

            <CheckoutOrderComplete
                open={orderSuccessModal.status}
                onClose={orderSuccessModalClose}
                referenceData={orderSuccessModal.data}
            />
        </>
    );
}




