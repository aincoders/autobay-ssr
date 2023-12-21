import { EditOutlined, FmdGoodOutlined, KeyboardArrowRightOutlined } from '@mui/icons-material';
import { Box, Card, CardActionArea, Typography } from '@mui/material';
import { t } from 'i18next';
import { useState } from 'react';
import useResponsive from 'src/hooks/useResponsive';
import { AddressModal } from 'src/master';
import { applyAddress } from 'src/redux/slices/product';
import { useDispatch, useSelector } from 'src/redux/store';
import { getAddressIcon } from 'src/utils/StatusUtil';

export default function CartAddress() {
    const { checkout } = useSelector((state) => state.product);
    const { billingAddress } = checkout;
    const dispatch = useDispatch();

    const [addressModal, setAddressModal] = useState(false);
    async function addressModalClose(value) {
        if (value.data) {
            dispatch(applyAddress(value.data));
        }
        setAddressModal(value.status);
    }

    const isDesktop = useResponsive('up', 'lg');

    return (
        <>
            {billingAddress ? (
                <Card
                    sx={{ px: 2, py: 1 }}
                    component={CardActionArea}
                    onClick={() => setAddressModal(true)}
                >
                    <Box display={'flex'} alignItems="center" justifyContent={'space-between'}>
                        <Box display={'flex'} alignItems="center" gap={2}>
                            <Box sx={{ color: 'primary.main' }}>
                                <Box component={getAddressIcon(billingAddress.address_type)} />
                            </Box>
                            <Box>
                                <Box>
                                    <Typography
                                        variant={isDesktop ? 'subtitle2' : 'body2'}
                                        fontWeight="medium"
                                    >{`${billingAddress.full_name} - ${billingAddress.phone}`}</Typography>
                                    <Typography
                                        variant="caption"
                                        color={'text.secondary'}
                                    >{`${billingAddress.address_line1},${billingAddress.address_line2}`}</Typography>
                                </Box>
                            </Box>
                        </Box>
                        <EditOutlined
                            fontSize={isDesktop ? 'medium' : 'small'}
                            sx={{ color: 'text.secondary' }}
                        />
                    </Box>
                </Card>
            ) : (
                <Card
                    sx={{ px: 2, py: 1 }}
                    component={CardActionArea}
                    onClick={() => setAddressModal(true)}
                >
                    <Box display={'flex'} alignItems="center" justifyContent={'space-between'}>
                        <Box display={'flex'} alignItems="center" gap={2}>
                            <FmdGoodOutlined
                                color="primary"
                                fontSize={isDesktop ? 'medium' : 'small'}
                            />
                            <Box>
                                <Typography
                                    variant={isDesktop ? 'subtitle2' : 'body2'}
                                    fontWeight="medium"
                                >
                                    {t('select_address')}
                                </Typography>
                                <Typography
                                    variant="caption"
                                    color={'text.secondary'}
                                >{`---`}</Typography>
                            </Box>
                        </Box>
                        <KeyboardArrowRightOutlined
                            sx={{ color: 'text.secondary' }}
                            fontSize={isDesktop ? 'medium' : 'small'}
                        />
                    </Box>
                </Card>
            )}
            <AddressModal
                open={addressModal}
                onClose={addressModalClose}
                AddAddress
                selectedAddress={billingAddress}
            />
        </>
    );
}
