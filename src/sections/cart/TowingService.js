import { Warehouse } from '@mui/icons-material';
import { alpha, Box, Card, Switch, Typography } from '@mui/material';
import { t } from 'i18next';
import { useContext, useEffect } from 'react';
import { TowingIcon } from 'src/assets/icons';
import { useSettingsContext } from 'src/components/settings';
import useResponsive from 'src/hooks/useResponsive';
import { CartPageContext } from 'src/mycontext/CartPageContext';
import { applyPickupDrop } from 'src/redux/slices/product';
import { useDispatch, useSelector } from 'src/redux/store';


export default function TowingService() {
    const { currentCity } = useSettingsContext();
    const { cartDetails,  } = useContext(CartPageContext);
    const {  towing_total_amount, towing_type,  } = cartDetails;

    const isDesktop = useResponsive('up', 'md');

    const { checkout } = useSelector((state) => state.product);
    const { pickupDrop } = checkout;

    const dispatch = useDispatch();

    useEffect(()=>{
        if(towing_type=='0'){
            dispatch(applyPickupDrop(false))
        }
    },[cartDetails])

    return (
        <>

            {towing_type == '1' &&
                <>
                    <Card sx={{ pl: 2, py: 1 }}>
                        <Box display={'flex'} alignItems="center" justifyContent={'space-between'}>
                            <Box display={'flex'} alignItems="center" gap={2}>
                                <Warehouse color="primary" fontSize={isDesktop ? 'medium' : 'small'} />
                                <Typography variant={isDesktop ? 'subtitle2' : 'body2'} fontWeight="medium">{`Pickup & Drop`}</Typography>
                            </Box>

                            <Switch
                                onChange={(e) => dispatch(applyPickupDrop(e.target.checked))}
                                checked={pickupDrop}
                            />
                        </Box>
                    </Card>
                    {Number(towing_total_amount) <= 0 ?
                        <Card sx={{ px: 2, py: 1, bgcolor: 'background.neutral' }} variant='elevation'>
                            <Box display={'flex'} alignItems='center' gap={2} justifyContent={isDesktop ? 'center' : "flex-start"}>
                            <TowingIcon sx={{ width: isDesktop ? 36 : 20 }} />
                                <Typography variant={isDesktop ? 'subtitle2' : 'body2'} fontWeight={'bold'} color={isDesktop && 'primary'}>
                                    {t('free_towing')}
                                </Typography>
                            </Box>
                        </Card> :
                        pickupDrop && <Card sx={{ px: 2, py: 1, bgcolor: 'background.neutral' }}>
                            <Box display={'flex'} alignItems='center' gap={2} justifyContent={isDesktop ? 'center' : "flex-start"}>
                            <TowingIcon sx={{ width: isDesktop ? 36 : 20 }} />
                                <Typography variant={isDesktop ? 'subtitle2' : 'body2'} fontWeight={'bold'} color={isDesktop && 'primary'}>
                                    {`${t('towing_charge')} : ${currentCity.currency_symbol} ${Number(towing_total_amount).toFixed(currentCity.decimal_value)}`}
                                </Typography>
                            </Box>
                        </Card>
                    }
                </>
            }
        </>
    );
}
