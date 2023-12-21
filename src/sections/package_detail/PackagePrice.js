import { ArrowDropDown } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Card, Divider, Typography } from '@mui/material';
import { t } from 'i18next';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useContext, useEffect, useState } from 'react';
import { TowingIcon } from 'src/assets/icons';
import { useAuthContext } from 'src/auth/useAuthContext';
import { useSettingsContext } from 'src/components/settings';
import useApi from 'src/hooks/useApi';
import { CustomerVehicleModal, MakeMasterModal, RecommendedPartModal } from 'src/master';
import ModelMasterModal from 'src/master/ModelMasterModal';
import { PackageDetailContext } from 'src/mycontext/PackageDetailContext';
import { addToCart, deleteCart, getCart } from 'src/redux/slices/product';
import { useDispatch, useSelector } from 'src/redux/store';
import { CART_API } from 'src/utils/constant';
import TabbyPromoComponent from '../package_list/tabby/TabbyPromoComponent';

export default function PackagePrice() {
    const { packageDetails, packagePartGroupList } = useContext(PackageDetailContext);
    const { enqueueSnackbar } = useSnackbar();
    const router = useRouter();
    const { customer } = useAuthContext();
    const { postApiData, getApiData } = useApi();
    const { currentVehicle, currentCity } = useSettingsContext();
    const { make, model } = currentVehicle


    const [loadingButton, setLoadingButton] = useState(false);
    const [makeModal, setMakeModal] = useState(false);
    function makeModalClose(value) {
        setMakeModal(value.status);
    }
    const dispatch = useDispatch();
    const { checkout } = useSelector((state) => state.product);
    const { cart } = checkout;
    const itemExistInCart = cart.some(
        (item) => item.service_group_id === packageDetails.service_group_id
    );


    useEffect(() => {
        dispatch(getCart(cart));
    }, [dispatch, cart]);

    async function packageInCart(service) {
        if (packagePartGroupList.spare_part_group.length == 0) {
            const item = { service_group_id: service.service_group_id, name: packageDetails.service_group_name, price: service.price, spare_part_id: 0 };
            setLoadingButton(true)
            if (customer) {
                await addToCartCustomer(item);
            } else {
                dispatch(addToCart(item));
                enqueueSnackbar(t('item_added_successfully'), { variant: 'success' });
            }
            setLoadingButton(false)
        } else {
            SetRecommendedModal({ status: true, data: packagePartGroupList });
        }
    }
    function packageRemoveInCart(service) {
        dispatch(deleteCart(service.service_group_id));
        enqueueSnackbar(t('remove_item_successfully'), { variant: 'success' });
    }

    const [recommendedModal, SetRecommendedModal] = useState({ status: false, data: [] });
    function recommendedModalClose(value) {
        if (value.data) {
            const item = {
                service_group_id: packageDetails.service_group_id,
                name: packageDetails.service_group_name,
                price: value.data.totalAmount,
                spare_part_id: value.data.spare_part_id,
            };

            if (customer) {
                addToCartCustomer(item);
            } else {
                dispatch(addToCart(item));
                enqueueSnackbar(t('item_added_successfully'), { variant: 'success' });
            }
        }
        SetRecommendedModal({ status: value.status, data: [] });
    }

    async function addToCartCustomer(item) {
        if (item) {
            const data = {
                vehicle_model_master_id: model?.vehicle_model_master_id,
                ...item,
            };
            const response = await postApiData(CART_API.addToCart, data);
            if (response) {
                dispatch(addToCart(item));
            }
        }
    }

    return (
        <>

            <Box
                display={'flex'}
                flexDirection="column"
                gap={3}
                sx={{ position: 'sticky', top: 85 }}
            >
                {model ? (
                    <Card sx={{ p: 2, bgcolor: 'rgb(32 33 36 / 4%)' }} variant="elevation">
                        <Box display={'flex'} flexDirection="column" gap={2}>
                            {
                                <>
                                    <Box display="flex" flexDirection={'column'}>
                                        <Box display="flex" alignItems={'center'} gap={1.5}>
                                            <Typography variant="h4" color={'primary'}>
                                                {`${currentCity.currency_symbol}  ${Number(packageDetails.price).toFixed(currentCity.decimal_value)}`}
                                            </Typography>
                                            {packageDetails.main_price != packageDetails.price && (
                                                <Typography variant="subtitle2" sx={{ textDecoration: 'line-through' }} color="text.secondary">
                                                    {`${currentCity.currency_symbol} ${Number(packageDetails.main_price).toFixed(currentCity.decimal_value)}`}
                                                </Typography>
                                            )}
                                               {(packageDetails.towing_enabled_disabled == '1' && packageDetails.towing_title != '') &&
                                                <Box display={'flex'} alignItems='center' gap={1}>
                                                    <TowingIcon sx={{ width: 36 }} />
                                                    <Typography variant="subtitle2" fontWeight={'bold'} textTransform="uppercase" color={'primary'}>
                                                        {packageDetails.towing_title}
                                                    </Typography>
                                                </Box>
                                            }
                                        </Box>
                                        {packagePartGroupList.spare_part_group.length != 0 && (<Typography variant="body2" color={'text.secondary'}>{t('add_ons')}</Typography>)}
                                    </Box>

                                    <Button disabled color="inherit" variant="outlined" endIcon={<ArrowDropDown />} fullWidth sx={{ justifyContent: 'space-between' }}>
                                        <Box display={'flex'} gap={1}>
                                            <Box display={'flex'} flexDirection="column" alignItems={'flex-start'}>
                                                <Box display={'flex'} gap={1} alignItems="center">
                                                    <Typography variant="subtitle2" fontWeight={'medium'}>
                                                        {model.vehicle_model_name}
                                                    </Typography>
                                                </Box>
                                                <Typography variant="caption" color={'text.secondary'}>
                                                    {model.vehicle_model_fuel_type ? `${model.vehicle_model_fuel_type}${model.vehicle_reg_no ? `- ${model.vehicle_reg_no}` : ''}` : '---'}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Button>

                                    <Divider sx={{ borderStyle: 'dashed' }} />

                                    {packageDetails.main_price != packageDetails.price && (
                                        <Box display={'flex'} alignItems="center" justifyContent={'space-between'}>
                                            <Typography variant="body1">{t('your_saving')}</Typography>
                                            <Typography variant="subtitle1" fontWeight={'bold'} sx={{ color: 'success.main' }}>
                                                {`${currentCity.currency_symbol} ${Number(packageDetails.main_price - packageDetails.price).toFixed(currentCity.decimal_value)}`}
                                            </Typography>
                                        </Box>
                                    )}
                                    <Box display={'flex'} alignItems="center" justifyContent={'space-between'}>
                                        <Typography variant="body1">{t('total_price')}</Typography>
                                        <Typography variant="subtitle1" fontWeight={'bold'}>{`${currentCity.currency_symbol} ${Number(packageDetails.price).toFixed(currentCity.decimal_value)}`}</Typography>
                                    </Box>

                                    <TabbyPromoComponent referenceID={packageDetails.service_group_id} Price={packageDetails.price} />


                                    {itemExistInCart ?
                                        customer
                                            ? <Button variant="contained" color="error" size="large" onClick={() => router.push('/cart')}>{t('checkout')}</Button>
                                            : <Button variant="contained" color="error" size="large" onClick={() => packageRemoveInCart(packageDetails)}>{t('remove')}</Button>
                                        : <LoadingButton loading={loadingButton} variant="contained" onClick={() => packageInCart(packageDetails)} size="large" sx={{ textTransform: 'uppercase' }}>{t('add_to_cart')}</LoadingButton>
                                    }
                                </>
                            }
                        </Box>
                    </Card>
                ) : (
                    <Card sx={{ p: 2, bgcolor: 'rgb(32 33 36 / 4%)' }} variant="elevation">
                        <Box display={'flex'} flexDirection="column" gap={2}>
                            <Box display="flex" flexDirection={'column'}>
                                <Box display="flex" alignItems={'flex-start'} flexDirection="column" gap={1.5}>
                                    <Typography variant="h4">
                                        {t('experience_the_best_workshop_service')} <br /> {t('in')}{' '}{currentCity.city_name}
                                    </Typography>
                                    <Typography variant="subtitle1" fontWeight={'400'}>
                                        {t('get_instant_quote_for_your_workshop_service')}
                                    </Typography>
                                </Box>
                            </Box>
                            <Divider sx={{ borderStyle: 'dashed' }} />
                            <Button
                                variant="contained"
                                size="large"
                                onClick={() => setMakeModal(true)}

                            >
                                {t('select_vehicle').toUpperCase()}
                            </Button>
                        </Box>
                    </Card>
                )}
            </Box>


            {customer ?
                <CustomerVehicleModal open={makeModal} onClose={makeModalClose} />
                :
                make
                    ? <ModelMasterModal open={makeModal} onClose={makeModalClose} referenceData={make} directOpen />
                    : <MakeMasterModal open={makeModal} onClose={makeModalClose} />
            }


            {recommendedModal.status && (
                <RecommendedPartModal open={recommendedModal.status} onClose={recommendedModalClose} ItemList={recommendedModal.data} ReferenceData={packageDetails} />
            )}
        </>
    );
}
