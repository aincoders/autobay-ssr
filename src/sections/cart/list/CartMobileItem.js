import { DeleteOutlined } from '@mui/icons-material';
import { Avatar, Box, IconButton, Typography } from '@mui/material';
import { t } from 'i18next';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { useAuthContext } from 'src/auth/useAuthContext';
import Image from 'src/components/image';
import { useSettingsContext } from 'src/components/settings';
import useApi from 'src/hooks/useApi';
import { deleteCart, deletePremiumCart } from 'src/redux/slices/product';
import { useDispatch } from 'src/redux/store';
import { CART_API } from 'src/utils/constant';
import createAvatar from 'src/utils/createAvatar';



export default function CartMobileItem({ row }) {
    const { currentCity, currentVehicle } = useSettingsContext();
    const { enqueueSnackbar } = useSnackbar();
    const { customer } = useAuthContext();
    const { postApiData } = useApi();

    const [loadingID, setLoadingID] = useState('');
    const dispatch = useDispatch();

    async function packageRemoveInCart(service) {
        setLoadingID(service.service_group_id);
        if (customer) {
            await removeToCartCustomer(service);
        } else {
            if (service.premium_id) {
                dispatch(deletePremiumCart(service.premium_id));
            } else {
                dispatch(deleteCart(service.service_group_id));
            }
        }
        enqueueSnackbar(t('remove_item_successfully'), { variant: 'success' });
    }
    async function removeToCartCustomer(service) {
        const data = service.premium_id ? { cart_premium_id: service.cart_premium_id } : { cart_id: service.cart_id };
        const response = await postApiData(CART_API.removeToCart, data);
        if (response) {
            if (service.premium_id) {
                dispatch(deletePremiumCart(service.premium_id));
            } else {
                dispatch(deleteCart(service.service_group_id));
            }
        }
    }

    return (
        <>
            <Box display="flex" alignItems={'center'} justifyContent="space-between" gap={1}>
                <Box display={'flex'} alignItems="center" gap={1.5} flex={0.58}>
                    {row.service_group_name
                        ? <Image alt={row.service_group_name} src={row.media_url} sx={{ width: 42, height: 42, borderRadius: 1.5, }} />
                        : <Avatar sx={{ width: 42, height: 42, borderRadius: 1.5, }}>{createAvatar(row.premium_title).name}</Avatar>
                    }

                    <Box display={'flex'} flexDirection="column">
                        <Typography variant="body2" fontWeight={'medium'}>{row.service_group_name || row.premium_title}</Typography>
                        <Typography variant="caption" color={'text.secondary'}>{row.spare_part_name}</Typography>
                    </Box>
                </Box>
                <Box display={'flex'} alignItems="center" gap={2} flex={0.42} justifyContent='space-between'>
                    <Box display={'flex'} flexDirection="column">
                        {row.service_group_main_total != row.service_group_total || row.premium_model_price != row.price_total_after_discount ? (
                            <Typography variant="caption" sx={{ textDecoration: 'line-through', }} color="text.secondary">
                                {`${currentCity.currency_symbol} ${Number(row.service_group_main_total || row.premium_model_price).toFixed(currentCity.decimal_value)}`}
                            </Typography>
                        ) : (
                            ''
                        )}
                        <Typography variant="body2" fontWeight="medium">
                            {`${currentCity.currency_symbol} ${Number(row.service_group_total || row.price_total_after_discount).toFixed(currentCity.decimal_value)}`}
                        </Typography>
                    </Box>
                    <IconButton onClick={() => packageRemoveInCart(row)}>
                        <DeleteOutlined />
                    </IconButton>
                </Box>
            </Box>
        </>
    );
}
