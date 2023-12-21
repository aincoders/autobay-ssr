import { Add, DeleteOutlined, Shortcut } from '@mui/icons-material';
import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';
import { t } from 'i18next';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useContext, useState } from 'react';
import { TowingIcon } from 'src/assets/icons';
import { useAuthContext } from 'src/auth/useAuthContext';
import { useSettingsContext } from 'src/components/settings';
import useApi from 'src/hooks/useApi';
import { CustomerVehicleModal, MakeMasterModal, RecommendedPartModal } from 'src/master';
import ModelMasterModal from 'src/master/ModelMasterModal';
import { PackageDetailContext } from 'src/mycontext/PackageDetailContext';
import { addToCart, deleteCart } from 'src/redux/slices/product';
import { useDispatch, useSelector } from 'src/redux/store';
import { CART_API } from 'src/utils/constant';
import TabbyPromoComponent from '../package_list/tabby/TabbyPromoComponent';


export default function PackageBottom() {
    const { loading, packageDetails, packagePartGroupList } = useContext(PackageDetailContext);
    const { enqueueSnackbar } = useSnackbar();
    const { customer } = useAuthContext();
    const { postApiData } = useApi();
    const router = useRouter();

    const { currentVehicle, currentCity } = useSettingsContext();
    const make = currentVehicle?.make || ''
    const model = currentVehicle?.model || ''


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

    function packageInCart(service) {
        if (packagePartGroupList.spare_part_group.length == 0) {
            const item = {
                service_group_id: service.service_group_id,
                name: packageDetails.service_group_name,
                price: service.price,
                spare_part_id: 0,
            };
            if (customer) {
                addToCartCustomer(item);
            } else {
                dispatch(addToCart(item));
                enqueueSnackbar(t('item_added_successfully'), { variant: 'success' });
            }
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
            <AppBar
                position="fixed"
                sx={{ bgcolor: 'background.paper', display: { xs: 'block', md: 'none' }, bottom: 0, top: 'auto'}}
            >
                <Toolbar>
                    <Box display={'flex'}flexDirection='column' justifyContent={'space-between'} sx={{ width: '100%',color:'text.primary',py:0.5,gap:1 }}>
                        <Box sx={{ width: '100%' }}>
                            {model
                                ?
                                <Box display={'flex'} alignItems="center" justifyContent={'space-between'}>
                                    <Box display="flex" alignItems={'flex-start'} flexDirection="column">
                                        <Box display="flex" alignItems={'center'} gap={1}>
                                            <Typography variant={'subtitle2'} fontWeight="bold" color={'primary'}>{`${currentCity.currency_symbol} ${packageDetails.price}`}</Typography>
                                            <Typography variant="body2" sx={{ textDecoration: 'line-through' }} color="text.secondary">
                                                {`${currentCity.currency_symbol} ${Number(packageDetails.main_price).toFixed(currentCity.decimal_value)}`}
                                            </Typography>
                                        </Box>
                                        <Box display="flex" alignItems={'center'} gap={1}>
                                            {packageDetails.main_price != packageDetails.price && (
                                                <Typography variant="overline" fontWeight={'bold'} sx={{ color: 'success.main' }}>
                                                    {`${t('save').toUpperCase()} ${currentCity.currency_symbol} ${Number(packageDetails.main_price - packageDetails.price).toFixed(currentCity.decimal_value)}`}
                                                </Typography>
                                            )}
                                            {(packageDetails.towing_enabled_disabled == '1' && packageDetails.towing_title != '') &&
                                                <Box display={'flex'} alignItems='center' gap={1}>
                                                    <TowingIcon sx={{ width: 24 }} />
                                                    <Typography variant="overline" fontWeight={'bold'} textTransform="uppercase" color={'primary'}>
                                                        {packageDetails.towing_title}
                                                    </Typography>
                                                </Box>
                                            }
                                        </Box>
                                    </Box>

                                    {itemExistInCart
                                        ? customer
                                            ? <Button size="small" variant="soft" color="error" startIcon={<Shortcut />} onClick={() => router.push('/cart')}>{t('checkout')}</Button>
                                            : <Button size="small" variant="soft" color="error" startIcon={<DeleteOutlined />} onClick={() => packageRemoveInCart(packageDetails)}>{t('remove')}</Button>

                                        : <Button size="small" variant="contained" color='secondary' startIcon={<Add />} onClick={() => packageInCart(packageDetails)}>{t('add')}</Button>
                                    }
                                </Box>
                                :
                                <Button variant="contained" size="small" fullWidth onClick={() => setMakeModal(true)}>{t('select_vehicle')}</Button>
                            }
                        </Box>
                        <TabbyPromoComponent  referenceID={packageDetails.service_group_id} Price={packageDetails.price} />
                    </Box>
                </Toolbar>
            </AppBar>

            {customer ?
				<CustomerVehicleModal open={makeModal} onClose={makeModalClose} />
				:
				make
					? <ModelMasterModal open={makeModal} onClose={makeModalClose} referenceData={make} directOpen />
					: <MakeMasterModal open={makeModal} onClose={makeModalClose} />
			}


            {recommendedModal.status && (
                <RecommendedPartModal
                    open={recommendedModal.status}
                    onClose={recommendedModalClose}
                    ItemList={recommendedModal.data}
                    ReferenceData={packageDetails}
                />
            )}
        </>
    );
}
