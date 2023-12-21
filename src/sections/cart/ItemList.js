import { AccountCircleOutlined } from '@mui/icons-material';
import { Box, Button, Card, CardHeader, Grid, Table, TableBody, TableContainer, Typography } from '@mui/material';
import { t } from 'i18next';
import { useSnackbar } from 'notistack';
import { useContext, useState } from 'react';
import { useAuthContext } from 'src/auth/useAuthContext';
import EmptyContent from 'src/components/empty-content';
import Scrollbar from 'src/components/scrollbar';
import { TableHeadCustom } from 'src/components/table';
import useResponsive from 'src/hooks/useResponsive';
import { CheckOutModal, LoginModal } from 'src/master';
import { CartPageContext } from 'src/mycontext/CartPageContext';
import { useSelector } from 'src/redux/store';
import CartAddress from './CartAddress';
import CartDateTime from './CartDateTime';
import CartPromoCode from './CartPromoCode';
import CartSummary from './CartSummary';
import CartDekstopItem from './list/CartDekstopItem';
import CartMobileItem from './list/CartMobileItem';
import PreferWorkshop from './PreferWorkshop';
import TowingService from './TowingService';

const TABLE_HEAD = [
    { id: 'product', label: t('item') },
    { id: 'price', label: t('price') },
    { id: 'totalPrice', label: t('total_price'), align: 'right' },
    { id: '' },
];

export default function ItemList() {
    const { responseList } = useContext(CartPageContext);
    const { enqueueSnackbar } = useSnackbar();
    const { customer } = useAuthContext();


    const [openModal, setOpenModal] = useState(false);
    async function loginModalClose(value) {
        setOpenModal(value.status);
    }

    const { checkout } = useSelector((state) => state.product);
    const { bookingDate, bookingTime, billingAddress } = checkout;

    function checkoutOrder() {
        if (!billingAddress) {
            enqueueSnackbar(t('select_address'), { variant: 'error' });
        }
        else if (!bookingTime && !bookingDate) {
            enqueueSnackbar(t('select_date_time'), { variant: 'error' });
        }
        else {
            setCheckoutModal({ status: true, data: responseList });
        }

    }

    const [checkoutModal, setCheckoutModal] = useState({ status: false, data: '' });
    async function checkoutModalClose(value) {
        setCheckoutModal({ status: false, data: '' });

    }
    const isDesktop = useResponsive('up', 'lg');

    return (
        <>
            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>

                    <Grid container spacing={2}>
                        <Grid item xs={12}>

                            {responseList.length > 0
                                ?
                                isDesktop ?
                                    <Card >
                                        <CardHeader
                                            title={<Typography variant="h6"> {t('cart')} <Typography component="span" sx={{ color: 'text.secondary' }}>&nbsp;({responseList.length} {t('items')})</Typography></Typography>}
                                            sx={{ mb: 3 }}
                                        />
                                        <TableContainer sx={{ overflow: 'unset' }}>
                                            <Scrollbar>
                                                <Table sx={{ minWidth: 720 }}>
                                                    <TableHeadCustom headLabel={TABLE_HEAD} />
                                                    <TableBody>
                                                        {responseList.map((row, _i) => {
                                                            return (
                                                                <CartDekstopItem key={_i} row={row} />
                                                            );
                                                        })}
                                                    </TableBody>
                                                </Table>
                                            </Scrollbar>
                                        </TableContainer>
                                    </Card>
                                    :
                                    <Card>
                                        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', }}>
                                            <Typography variant="h6">{t('cart')}
                                                <Typography variant="body2" component="span" sx={{ color: 'text.secondary' }}>&nbsp;({responseList.length} {t('items')})</Typography>
                                            </Typography>
                                        </Box>
                                        <Box display={'flex'} flexDirection="column" gap={2} p={1.5}>
                                            {responseList.map((row, _i) => {
                                                return (
                                                    <CartMobileItem key={_i} row={row} />
                                                );
                                            })}
                                        </Box>
                                    </Card>
                                : <Card><EmptyContent title={t('your_cart_is_empty')} description={t('your_cart_is_empty_message')} img={''} /></Card>
                            }

                        </Grid>
                    </Grid>

                </Grid>

                <Grid item xs={12} md={4}>
                    <Box display="flex" flexDirection={'column'} gap={2.5} sx={{ position: 'sticky', top: 100 }}>
                        {responseList.length > 0 && <CartPromoCode />}
                        {customer && (
                            <>
                                <CartAddress />
                                <CartDateTime />
                            </>
                        )}
                        <PreferWorkshop />

                        <TowingService />
                        <CartSummary />

                        {customer ?
                            <Button fullWidth size={isDesktop ? 'large' : 'medium'} type="submit" variant="contained" disabled={!responseList.length} onClick={() => checkoutOrder()}>
                                {t('check_out')}
                            </Button>
                            :
                            <Button onClick={() => setOpenModal(true)} startIcon={<AccountCircleOutlined />} disabled={!responseList.length} fullWidth size={isDesktop ? 'large' : 'medium'} type="submit" variant="contained">
                                {t('login_sign_up')}
                            </Button>
                        }
                    </Box>
                </Grid>
            </Grid>

            <LoginModal open={openModal} onClose={loginModalClose} />

            {checkoutModal.status && (
                <CheckOutModal
                    open={checkoutModal.status}
                    onClose={checkoutModalClose}
                    cartList={checkoutModal.data}
                />
            )}
        </>
    );
}
