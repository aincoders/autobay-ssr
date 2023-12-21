import { Clear, KeyboardArrowRightOutlined, LocalOfferOutlined } from '@mui/icons-material';
import { Box, Card, CardActionArea, IconButton, Typography } from '@mui/material';
import { t } from 'i18next';
import { useContext, useState } from 'react';
import { useDispatch } from 'react-redux';
import { APP_NAME } from 'src/config-global';
import useResponsive from 'src/hooks/useResponsive';
import { PromoCodeModal } from 'src/master';
import { CartPageContext } from 'src/mycontext/CartPageContext';
import { applyPromocode } from 'src/redux/slices/product';

export default function CartPromoCode() {
    const { cartDetails } = useContext(CartPageContext);
    const dispatch = useDispatch();
    const { offer_title } = cartDetails;
    const [promoCodeModal, setPromoCodeModal] = useState(false);
    async function promoCodeModalClose(value) {
        setPromoCodeModal(value.status);
    }
    const isDesktop = useResponsive('up', 'lg');
    return (
        <>
            {offer_title ? (
                <Card sx={{ px: 2, py: 1, pr: 1 }}>
                    <Box display={'flex'} alignItems="center" justifyContent={'space-between'}>
                        <Box display={'flex'} alignItems="center" gap={2}>
                            <LocalOfferOutlined
                                color="primary"
                                fontSize={isDesktop ? 'medium' : 'small'}
                            />
                            <Typography
                                variant={isDesktop ? 'subtitle2' : 'body2'}
                                fontWeight="medium"
                            >
                                {offer_title}
                            </Typography>
                        </Box>
                        <IconButton
                            onClick={() => {
                                dispatch(
                                    applyPromocode({
                                        promocode: '',
                                        promoWalletType: '',
                                    })
                                );
                            }}
                        >
                            <Clear
                                sx={{ color: 'text.secondary' }}
                                fontSize={isDesktop ? 'medium' : 'small'}
                            />
                        </IconButton>
                    </Box>
                </Card>
            ) : (
                <Card
                    sx={{ px: 2, py: 1.5 }}
                    component={CardActionArea}
                    onClick={() => setPromoCodeModal(true)}
                >
                    <Box display={'flex'} alignItems="center" justifyContent={'space-between'}>
                        <Box display={'flex'} alignItems="center" gap={2}>
                            <LocalOfferOutlined
                                color="primary"
                                fontSize={isDesktop ? 'medium' : 'small'}
                            />
                            <Typography
                                variant={isDesktop ? 'subtitle2' : 'body2'}
                                fontWeight="medium"
                            >{t('apply_coupon_and_app_money').replace("%1$s",APP_NAME)}</Typography>
                        </Box>
                        <KeyboardArrowRightOutlined
                            sx={{ color: 'text.secondary' }}
                            fontSize={isDesktop ? 'medium' : 'small'}
                        />
                    </Box>
                </Card>
            )}

            <PromoCodeModal open={promoCodeModal} onClose={promoCodeModalClose} />
        </>
    );
}
