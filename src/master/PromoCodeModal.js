import { AccountBalanceOutlined, CloseOutlined } from '@mui/icons-material';
import {
    Avatar,
    Box,
    Button,
    Card,
    Divider,
    Drawer,
    IconButton,
    InputAdornment,
    ListItem,
    Skeleton,
    TextField,
    Typography,
} from '@mui/material';
import { yellow } from '@mui/material/colors';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAuthContext } from 'src/auth/useAuthContext';
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import { SkeletonEmptyOrder } from 'src/components/skeleton';
import { APP_NAME, DRAWER, HEADER } from 'src/config-global';
import useApi from 'src/hooks/useApi';
import useResponsive from 'src/hooks/useResponsive';
import { applyPromocode } from 'src/redux/slices/product';
import { PROMO_CODE_API } from 'src/utils/constant';

export default function PromoCodeModal({ open, onClose }) {
    const { getApiData, postApiData } = useApi();
    const { currentCity, currentVehicle } = useSettingsContext();
    const controller = new AbortController();
    const { signal } = controller;

    const [responseList, setResponseList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [wallet, setWallet] = useState(0);

    const { checkout } = useSelector((state) => state.product);
    const { cart } = checkout;

    const dispatch = useDispatch();

    const cartList = cart
        .filter((cart) => cart.service_group_id)
        .map((cart) => ({
            service_group_id: cart.service_group_id,
            spare_part_id: cart.spare_part_id,
        }));
    const premiumCartList = cart.filter((cart) => cart.premium_id);

    async function GetList() {
        setLoading(true);
        const params = {
            cart_list: cartList.length > 0 ? JSON.stringify(cartList) : '',
        };
        const response = await getApiData(PROMO_CODE_API.list, params, signal);
        if (response) {
            const data = response.data.result.list;
            setLoading(false);
            setResponseList(data);
            setWallet(response.data.result.wallet_balance);
        }
    }

    useEffect(() => {
        if (open) {
            GetList();
        }
        return () => {
            controller.abort();
        };
    }, [open]);

    const isDesktop = useResponsive('up', 'md');

    async function applyPromoCode(value = '') {
        const params = {
            vehicle_model_master_id: currentVehicle.model.vehicle_model_master_id,
            promo_code: value,
            cart_list: JSON.stringify(cartList),
            premium_id: premiumCartList.length > 0 ? premiumCartList[0].premium_id : '',
        };
        const response = await getApiData(PROMO_CODE_API.apply, params);
        if (response) {
            dispatch(
                applyPromocode({
                    promocode: response.data.result.promo_code_id,
                    promoWalletType: 1,
                })
            );
            onClose({ status: false });
        }
    }

    const { customer } = useAuthContext();

    return (
        <>
            <Drawer
                variant="temporary"
                anchor={isDesktop ? 'right' : 'bottom'}
                open={open}
                onClose={() => {
                    onClose({ status: false });
                }}
                PaperProps={{
                    sx: {
                        width: { xs: '100%', md: '550px' },
                        height: { xs: DRAWER.MOBILE_HEIGHT, md: '100%' },
                    },
                }}
            >
                <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                    <Box
                        sx={{
                            minHeight: HEADER.DASHBOARD_DESKTOP_HEIGHT,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 2,
                            px: 2,
                        }}
                    >
                        <Typography variant="h6">{`Apply Coupon | ${APP_NAME} Money`}</Typography>
                        <IconButton
                            onClick={() => {
                                onClose({ status: false });
                            }}
                        >
                            <CloseOutlined />
                        </IconButton>
                    </Box>
                    <Box
                        sx={{ overflow: 'hidden' }}
                        display="flex"
                        flexDirection={'column'}
                        flex={1}
                        minHeight={0}
                    >
                        <TextField
                            sx={{ px: 2 }}
                            fullWidth
                            placeholder={t('enter_coupon_code_here')}
                            variant="outlined"
                            onChange={(e) => setSearch(e.target.value)}
                            autoComplete="off"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        {search && responseList && (
                                            <Button
                                                variant="soft"
                                                onClick={() => applyPromoCode(search)}
                                            >
                                                {t('apply')}
                                            </Button>
                                        )}
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Divider sx={{ py: 1 }} />
                        <Box display={'flex'} sx={{ overflow: 'hidden', flex: 1 }}>
                            <Scrollbar sx={{ flex: 1, height: '100%', px: 2, pb: 2 }}>
                                {customer && (
                                    <Box display={'flex'} flexDirection="column" gap={1} mt={2}>
                                        <Typography variant="subtitle1">{`${APP_NAME} Money`}</Typography>
                                        <Card sx={{ p: 2 }}>
                                            <Box
                                                display={'flex'}
                                                alignItems="center"
                                                justifyContent={'space-between'}
                                            >
                                                <Box display={'flex'} alignItems="center" gap={2}>
                                                    <Avatar
                                                        variant="rounded"
                                                        sx={{
                                                            bgcolor: yellow[700],
                                                            color: 'text.primary',
                                                        }}
                                                    >
                                                        <AccountBalanceOutlined />
                                                    </Avatar>
                                                    <Box>
                                                        <Typography
                                                            variant="body2"
                                                            color={'text.secondary'}
                                                        >
                                                            Available Balance
                                                        </Typography>
                                                        <Typography variant="subtitle2">
                                                            {`${
                                                                currentCity.currency_symbol
                                                            } ${Number(wallet).toFixed(
                                                                currentCity.decimal_value
                                                            )}`}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                                {wallet > 0 && (
                                                    <Button
                                                        onClick={() => {
                                                            dispatch(
                                                                applyPromocode({
                                                                    promocode: '',
                                                                    promoWalletType: 2,
                                                                })
                                                            );
                                                            onClose({ status: false });
                                                        }}
                                                    >
                                                        {t('apply')}
                                                    </Button>
                                                )}
                                            </Box>
                                        </Card>
                                    </Box>
                                )}

                                <Box display={'flex'} flexDirection="column" gap={1} mt={3}>
                                    {responseList.length > 0 && (
                                        <Typography variant="subtitle1">Available Offer</Typography>
                                    )}
                                    <Box display={'flex'} flexDirection="column" gap={2}>
                                        {!loading && responseList.length > 0
                                            ? responseList
                                                  .sort((a, b) =>
                                                      a.promo_code.localeCompare(b.promo_code)
                                                  )
                                                  .map((response, index) => (
                                                      <Card key={index} sx={{ p: 1.5 }}>
                                                          <Box
                                                              display={'flex'}
                                                              alignItems={'center'}
                                                              justifyContent="space-between"
                                                              flex={1}
                                                          >
                                                              <Box
                                                                  display={'flex'}
                                                                  flexDirection="column"
                                                                  alignItems={'flex-start'}
                                                              >
                                                                  <Box
                                                                      sx={{
                                                                          position: 'relative',
                                                                          border: '2px dotted',
                                                                          borderColor:
                                                                              'primary.main',
                                                                          px: 1.5,
                                                                          py: 0.5,
                                                                          mb: 1,
                                                                          borderRadius: 0.5,
                                                                      }}
                                                                  >
                                                                      <Typography
                                                                          variant="subtitle2"
                                                                          color={'primary'}
                                                                      >
                                                                          {response.promo_code}
                                                                      </Typography>
                                                                  </Box>
                                                                  <Typography
                                                                      variant="body2"
                                                                      fontWeight={'bold'}
                                                                  >
                                                                      {response.title}
                                                                  </Typography>
                                                                  <Typography
                                                                      variant="caption"
                                                                      color={'text.secondary'}
                                                                  >
                                                                      {response.description}
                                                                  </Typography>
                                                              </Box>
                                                              <Button
                                                                  onClick={() =>
                                                                      applyPromoCode(
                                                                          response.promo_code
                                                                      )
                                                                  }
                                                              >
                                                                  {t('apply')}
                                                              </Button>
                                                          </Box>
                                                      </Card>
                                                  ))
                                            : !loading && (
                                                  <SkeletonEmptyOrder
                                                      isNotFound={!responseList.length}
                                                  />
                                              )}
                                        {loading && loadData()}
                                    </Box>
                                </Box>
                            </Scrollbar>
                        </Box>
                    </Box>
                </Box>
            </Drawer>
        </>
    );
}

function loadData() {
    return Array.from(new Array(4)).map((_, _i) => (
        <ListItem key={_i} disablePadding sx={{ px: 2, py: 1 }}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    gap: 2,
                    textAlign: 'center',
                    flex: 1,
                }}
            >
                <Skeleton variant="circular" sx={{ height: 48, minWidth: 48 }} />
                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Skeleton sx={{ width: '70%', height: 16 }} />
                    <Skeleton sx={{ width: '40%', height: 12 }} />
                </Box>
            </Box>
        </ListItem>
    ));
}
