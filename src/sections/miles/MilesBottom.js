import { Add, ShoppingCartOutlined, Shortcut } from '@mui/icons-material';
import { lighten, AppBar, Box, Button, Toolbar, Typography, useTheme } from '@mui/material';
import { t } from 'i18next';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useContext, useState } from 'react';
import { useAuthContext } from 'src/auth/useAuthContext';
import { useSettingsContext } from 'src/components/settings';
import useApi from 'src/hooks/useApi';
import useResponsive from 'src/hooks/useResponsive';
import { MakeMasterModal } from 'src/master';
import { MilesContext } from 'src/mycontext/MilesContext';
import { addToCart } from 'src/redux/slices/product';
import { useDispatch, useSelector } from 'src/redux/store';
import { CART_API } from 'src/utils/constant';

export default function MilesBottom() {
    const { loading, milesDetails } = useContext(MilesContext);

    const { enqueueSnackbar } = useSnackbar();
    const theme = useTheme();
    const router = useRouter();
    const { customer } = useAuthContext();
    const { postApiData } = useApi();
    const { currentVehicle, currentCity } = useSettingsContext();
    const isDesktop = useResponsive('up', 'lg');

    const [makeModal, setMakeModal] = useState(false);
    function makeModalClose(value) {
        setMakeModal(value.status);
    }

    const dispatch = useDispatch();
    const { checkout } = useSelector((state) => state.product);
    const { cart } = checkout;
    const itemExistInCart = cart.some((item) => item.premium_id === milesDetails.premium_id);

    function packageInCart(service) {
        const item = {
            premium_id: service.premium_id,
            name: milesDetails.title,
            price: service.price_total_after_discount,
        };
        if (customer) {
            addToCartCustomer(item);
        } else {
            dispatch(addToCart(item));
            enqueueSnackbar(t('item_added_successfully'), { variant: 'success' });
        }
    }

    async function addToCartCustomer(item) {
        if (item) {
            const data = {
                vehicle_model_master_id: currentVehicle.model?.vehicle_model_master_id,
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
                sx={{
                    bgcolor: (theme) => lighten(theme.palette.primary.main, 0.85),
                    bottom: 0,
                    top: 'auto',
                    left: 0,
                    width: { xs: '100%', md: '66%' },
                }}
            >
                <Toolbar>
                    {currentVehicle.model ? (
                        <Box
                            display={'flex'}
                            alignItems="center"
                            justifyContent={'space-between'}
                            flex={1}
                        >
                            <Box display="flex" alignItems={'flex-start'} flexDirection="column">
                                <Typography
                                    variant="subtitle1"
                                    sx={{ textDecoration: 'line-through' }}
                                    color="text.secondary"
                                >
                                    {`${currentCity.currency_symbol} ${Number(
                                        milesDetails.premium_model_price
                                    ).toFixed(currentCity.decimal_value)}`}
                                </Typography>
                                <Typography
                                    variant={'h6'}
                                    fontWeight="bold"
                                    color={'primary'}
                                >{`${currentCity.currency_symbol} ${milesDetails.price_total_after_discount}`}</Typography>
                            </Box>

                            {itemExistInCart ? (
                                <Button
                                    variant="contained"
                                    startIcon={<ShoppingCartOutlined />}
                                    sx={{ textTransform: 'uppercase' }}
                                    onClick={() => router.push('/cart')}
                                >
                                    {t('view_cart')}
                                </Button>
                            ) : (
                                <Button
                                    variant="contained"
                                    startIcon={<ShoppingCartOutlined />}
                                    onClick={() => packageInCart(milesDetails)}
                                    sx={{ textTransform: 'uppercase' }}
                                >
                                    {t('add_to_cart')}
                                </Button>
                            )}
                        </Box>
                    ) : (
                        <Box display={'flex'} justifyContent="center" flex={1}>
                            <Button
                                variant="contained"
                                onClick={() => setMakeModal(true)}
                            >{`To view price, ${t('select_vehicle')}`}</Button>
                        </Box>
                    )}
                </Toolbar>
            </AppBar>

            <MakeMasterModal open={makeModal} onClose={makeModalClose} />
        </>
    );
}
