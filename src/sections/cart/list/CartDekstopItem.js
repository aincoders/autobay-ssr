import { DeleteOutlined } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { alpha, Avatar, Stack, TableCell, TableRow, Typography } from '@mui/material';
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


export default function CartDekstopItem({ row }) {
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
            <TableRow
                sx={{ bgcolor: (theme) => row.premium_title && alpha(theme.palette.primary.main, 0.1), }}
            >
                <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
                    {row.service_group_name ? (
                        <Image
                            alt={row.service_group_name}
                            src={row.media_url}
                            sx={{ width: 40, height: 40, borderRadius: 1.5, mr: 2, }}
                        />
                    ) : (
                        <Avatar sx={{ width: 40, height: 40, borderRadius: 1.5, mr: 2, }}>
                            {createAvatar(row.premium_title).name}
                        </Avatar>
                    )}
                    <Stack>
                        <Typography noWrap variant="subtitle2" sx={{ maxWidth: 240 }}>{row.service_group_name || row.premium_title}</Typography>
                        <Typography noWrap variant="body2" color={'text.secondary'}>{row.spare_part_name}</Typography>
                    </Stack>
                </TableCell>
                <TableCell>
                    <Stack direction={'row'} gap={2} alignItems="center">
                        {row.service_group_main_total != row.service_group_total || row.premium_model_price != row.price_total_after_discount ? (
                            <Typography variant="body2" sx={{ textDecoration: 'line-through', }} color="text.secondary">
                                {`${currentCity.currency_symbol} ${Number(row.service_group_main_total || row.premium_model_price).toFixed(currentCity.decimal_value)}`}
                            </Typography>
                        ) : (
                            ''
                        )}
                        <Typography variant="subtitle2">
                            {`${currentCity.currency_symbol} ${Number(row.service_group_total || row.price_total_after_discount).toFixed(currentCity.decimal_value)}`}
                        </Typography>
                    </Stack>
                </TableCell>

                <TableCell align="right">
                    <Typography variant="subtitle2">
                        {`${currentCity.currency_symbol} ${Number(row.service_group_total || row.price_total_after_discount).toFixed(currentCity.decimal_value)}`}
                    </Typography>
                </TableCell>

                <TableCell align="right">
                    <LoadingButton variant="soft" loading={loadingID == row.service_group_id} color="error" startIcon={<DeleteOutlined />} onClick={() => packageRemoveInCart(row)}>
                        {t('remove')}
                    </LoadingButton>
                </TableCell>
            </TableRow>
        </>
    );
}
