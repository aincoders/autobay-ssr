import { Avatar, Box, Typography } from '@mui/material';
import { useContext } from 'react';
import { useSettingsContext } from 'src/components/settings';
import { OrderContext } from 'src/mycontext/OrderContext';
import createAvatar from 'src/utils/createAvatar';

export default function OrderItemPremium() {
    const { loading, orderDetails } = useContext(OrderContext);
    const { order_item_premium, total_amount } = orderDetails;
    const { currentCity } = useSettingsContext();

    if (order_item_premium.length == 0) return null;

    return (
        <>
            <Box display={'flex'} gap={3} flexDirection="column" px={2}>
                <Box display={'flex'} flexDirection="column" gap={2}>
                    {order_item_premium &&
                        order_item_premium.map((row, _i) => (
                            <Box
                                key={_i}
                                display="flex"
                                alignItems={'center'}
                                justifyContent="space-between"
                            >
                                <Box display={'flex'} alignItems="center" gap={2}>
                                    <Avatar
                                        sx={{
                                            width: 48,
                                            height: 48,
                                            borderRadius: 1.5,
                                        }}
                                    >
                                        {createAvatar(row.premium_title).name}
                                    </Avatar>
                                    <Box display={'flex'} flexDirection="column">
                                        <Typography variant="subtitle2" fontWeight={'medium'}>
                                            {row.premium_title}
                                        </Typography>
                                        <Typography variant="caption" color={'text.secondary'}>
                                            {row.spare_part_group_name}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box display={'flex'} alignItems="center" gap={2}>
                                    <Box
                                        display={'flex'}
                                        flexDirection="column"
                                        alignItems={'flex-end'}
                                    >
                                        {row.premium_model_price !=
                                        row.price_total_after_discount ? (
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    textDecoration: 'line-through',
                                                }}
                                                color="text.secondary"
                                            >
                                                {`${currentCity.currency_symbol} ${Number(
                                                    row.premium_model_price
                                                ).toFixed(currentCity.decimal_value)}`}
                                            </Typography>
                                        ) : (
                                            ''
                                        )}
                                        <Typography variant="subtitle2" fontWeight="medium">
                                            {`${currentCity.currency_symbol} ${Number(
                                                row.price_total_after_discount
                                            ).toFixed(currentCity.decimal_value)}`}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        ))}
                </Box>
            </Box>
        </>
    );
}
