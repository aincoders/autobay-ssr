import { Avatar, Box, Typography } from '@mui/material';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import Image from 'src/components/image';
import { useSettingsContext } from 'src/components/settings';
import { OrderContext } from 'src/mycontext/OrderContext';
import createAvatar from 'src/utils/createAvatar';

export default function OrderItem() {
    const { loading, orderDetails } = useContext(OrderContext);
    const { order_service_group, total_amount } = orderDetails;

    const { t } = useTranslation();
    const { currentCity } = useSettingsContext();

    return (
        <>
            <Box display={'flex'} gap={2} flexDirection="column">
                <Box
                    display={'flex'}
                    flex={1}
                    justifyContent="space-between"
                    variant="elevation"
                    sx={{
                        height: '100%',
                        p: 2,
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                    }}
                >
                    <Typography variant="subtitle1">{t('order_list')}</Typography>
                </Box>
                <Box display={'flex'} flexDirection="column" gap={2} px={2}>
                    {order_service_group &&
                        order_service_group.map((row, _i) => (
                            <Box
                                key={_i}
                                display="flex"
                                alignItems={'center'}
                                justifyContent="space-between"
                            >
                                <Box display={'flex'} alignItems="center" gap={2}>
                                    {row.service_group_name ? (
                                        <Image
                                            alt={row.service_group_name}
                                            src={row.media_url}
                                            sx={{
                                                width: 48,
                                                height: 48,
                                                borderRadius: 1.5,
                                            }}
                                        />
                                    ) : (
                                        <Avatar
                                            sx={{
                                                width: 48,
                                                height: 48,
                                                borderRadius: 1.5,
                                            }}
                                        >
                                            {createAvatar(row.premium_title).name}
                                        </Avatar>
                                    )}

                                    <Box display={'flex'} flexDirection="column">
                                        <Typography variant="subtitle2" fontWeight={'medium'}>
                                            {row.service_group_name}
                                        </Typography>
                                        <Typography variant="caption" color={'text.secondary'}>
                                            {row.spare_part_name}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box display={'flex'} alignItems="center" gap={2}>
                                    <Box
                                        display={'flex'}
                                        flexDirection="column"
                                        alignItems={'flex-end'}
                                    >
                                        {row.service_group_main_total != row.service_group_total ||
                                        row.premium_model_price !=
                                            row.price_total_after_discount ? (
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    textDecoration: 'line-through',
                                                }}
                                                color="text.secondary"
                                            >
                                                {`${currentCity.currency_symbol} ${Number(
                                                    row.service_group_main_total ||
                                                        row.premium_model_price
                                                ).toFixed(currentCity.decimal_value)}`}
                                            </Typography>
                                        ) : (
                                            ''
                                        )}
                                        <Typography variant="subtitle2" fontWeight="medium">
                                            {`${currentCity.currency_symbol} ${Number(
                                                row.service_group_total ||
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
