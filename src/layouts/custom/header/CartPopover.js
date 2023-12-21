import { DeleteOutlined, ShoppingBagOutlined, ShoppingCartOutlined } from '@mui/icons-material';
import { Badge, Box, Button, Divider, IconButton, ListItemText, MenuItem, Typography } from '@mui/material';
import { alpha } from '@mui/system';
import { t } from 'i18next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAuthContext } from 'src/auth/useAuthContext';
import MenuPopover from 'src/components/menu-popover';
import { useSettingsContext } from 'src/components/settings';
import { deleteCart, deletePremiumCart, getCart } from 'src/redux/slices/product';
import { useDispatch } from 'src/redux/store';
import { ROOTS_CART } from 'src/routes/paths';
import { IconButtonAnimate } from '../../../components/animate';
import Scrollbar from '../../../components/scrollbar';

export default function CartPopover() {
    const [open, setOpen] = useState(null);
    const handleOpen = (event) => {
        setOpen(event.currentTarget);
    };
    const handleClose = () => {
        setOpen(null);
    };

    const router = useRouter();
    const { checkout } = useSelector((state) => state.product);
    const { cart, totalItems, total } = checkout;
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getCart(cart));
    }, [dispatch, cart]);

    const { currentCity } = useSettingsContext();
    const { customer } = useAuthContext();

    function packageRemoveInCart(service) {
        if (service.premium_id) {
            dispatch(deletePremiumCart(service.premium_id));
        } else {
            dispatch(deleteCart(service.service_group_id));
        }
    }

    const ITEM_HEIGHT = 48;

    return (
        <>
            <IconButtonAnimate
                color={open ? 'primary' : 'default'}
                onClick={handleOpen}
                sx={{
                    width: 40,
                    height: 40,
                    ...(open && {
                        bgcolor: (theme) =>
                            alpha(theme.palette.primary.main, theme.palette.action.focusOpacity),
                    }),
                }}
            >
                <Badge badgeContent={totalItems} color="primary">
                    <ShoppingBagOutlined />
                </Badge>
            </IconButtonAnimate>

            <MenuPopover
                open={open}
                anchorEl={open}
                onClose={handleClose}
                sx={{ width: 360, p: 0, mt: 1.5 }}
            >
                <Box
                    display="flex"
                    alignItems={'center'}
                    justifyContent="space-between"
                    sx={{ py: 1.5, px: 2 }}
                >
                    <Typography variant="h6">
                        {t('cart')} <Typography component="span">({totalItems})</Typography>
                    </Typography>
                </Box>

                <Divider sx={{ borderStyle: 'dashed' }} />

                {totalItems > 0 ? (
                    <>
                        <Scrollbar sx={{ maxHeight: ITEM_HEIGHT * 7 }}>
                            {cart.map((item, i) => (
                                <MenuItem key={i}>
                                    <ListItemText
                                        primaryTypographyProps={{
                                            typography: 'body2',
                                            fontWeight: 'bold',
                                        }}
                                        secondaryTypographyProps={{
                                            typography: 'body2',
                                        }}
                                        primary={item.name}
                                        secondary={`${currentCity.currency_symbol} ${Number(
                                            item.price
                                        ).toFixed(currentCity.decimal_value)}`}
                                    />
                                    {!customer && (
                                        <IconButton onClick={() => packageRemoveInCart(item)}>
                                            <DeleteOutlined fontSize="small" />
                                        </IconButton>
                                    )}
                                </MenuItem>
                            ))}
                        </Scrollbar>
                        <Divider sx={{ borderStyle: 'dashed' }} />

                        <Box
                            sx={{
                                px: 2,
                                py: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Typography variant="subtitle1">{`${
                                currentCity.currency_symbol
                            } ${Number(total).toFixed(currentCity.decimal_value)}`}</Typography>
                            <Button
                                onClick={() => {
                                    router.push(ROOTS_CART);
                                    handleClose();
                                }}
                            >
                                {t('view_all')}
                            </Button>
                        </Box>
                    </>
                ) : (
                    <Box display={'flex'} alignItems="center" justifyContent={'center'} p={8}>
                        <Box display={'flex'} flexDirection="column" gap={2} alignItems="center">
                            <ShoppingCartOutlined sx={{ fontSize: 55 }} color="disabled" />
                            <Typography variant="subtitle1" color={'text.secondary'}>
                                {t('your_cart_is_empty')}
                            </Typography>
                        </Box>
                    </Box>
                )}
            </MenuPopover>
        </>
    );
}
