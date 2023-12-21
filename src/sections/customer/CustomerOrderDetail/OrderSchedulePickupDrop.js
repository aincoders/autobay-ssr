import { CallMade, CallOutlined, CallReceived } from '@mui/icons-material';
import { Box, Card, IconButton, Tooltip, Typography, useTheme } from '@mui/material';
import Link from 'next/link';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { CustomAvatar } from 'src/components/custom-avatar';
import Label from 'src/components/label/Label';
import { OrderContext } from 'src/mycontext/OrderContext';
import { schedulePickupDropStatus } from 'src/utils/StatusUtil';


export default function OrderSchedulePickupDrop() {
    const { loading, orderDetails } = useContext(OrderContext);
    const { customer_order_transaction, pick_up_drop_schedule_list } = orderDetails;

    const { t } = useTranslation();
    const theme = useTheme();


    if (pick_up_drop_schedule_list.length == 0) return null;

    return (
        <>
            <Card>
                <Box display={'flex'} gap={2} flexDirection="column">
                    <Box
                        display={'flex'} flex={1} justifyContent="space-between" variant="elevation"
                        sx={{ height: '100%', p: 2, borderBottom: '1px solid', borderColor: 'divider' }}
                    >
                        <Typography variant="subtitle1">{t('schedule_pickup_drop')}</Typography>
                    </Box>
                    <Box display={'flex'} flexDirection="column" gap={2} px={2} pb={2}>
                        {pick_up_drop_schedule_list &&
                            pick_up_drop_schedule_list.map((row, _i) => {
                                const { color, statusText } = schedulePickupDropStatus(row.pickup_drop_status)
                                return (
                                    <Box key={_i} display="flex" alignItems={'center'} justifyContent="space-between">
                                        <Box display={'flex'} alignItems="center" gap={2} flex={0.5}>
                                            <Tooltip title={row.schedule_type == '1' ? 'Pickup' : "Drop"} arrow>
                                                <CustomAvatar color={row.schedule_type == '1' ? 'success' : 'error'}>
                                                    {row.schedule_type == '1' ? <CallMade fontSize='small' /> : <CallReceived fontSize='small' />}
                                                </CustomAvatar>
                                            </Tooltip>

                                            <Box display={'flex'} flexDirection="column">
                                                <Box display={'flex'} alignItems='center' gap={1}>
                                                    <Typography variant="body2" color={'text.secondary'}>
                                                        {row.created_on}
                                                    </Typography>
                                                    <Label variant={'soft'} color={'primary'}>{row.schedule_type == '1' ? t('pickup') : t('drop')}</Label>
                                                </Box>
                                                <Typography variant="subtitle2" textTransform="capitalize">
                                                    {row.towing_service_company_name}
                                                </Typography>
                                                <Typography variant="body2" color={'text.secondary'}>
                                                    {row.vehicle_number}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Box flex={0.3} display={'flex'} gap={1} alignItems='center' >
                                            <Link href={`tel:${row.contact_number}`} >
                                                <IconButton><CallOutlined fontSize='small' /></IconButton>
                                            </Link>
                                            <Box display={'flex'} flexDirection='column'>
                                           
                                                <Typography variant="subtitle2" textTransform="capitalize">
                                                    {row.driver_name}
                                                </Typography>
                                                <Typography variant="body2" color={'text.secondary'}>
                                                    {row.contact_number}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Box display={'flex'} alignItems="center" gap={2} flex={0.2} justifyContent='flex-end'>
                                           

                                            <Label variant={theme.palette.mode === 'light' ? 'soft' : 'filled'} color={color}>
                                                {statusText}
                                            </Label>
                                        </Box>
                                    </Box>
                                );
                            })}
                    </Box>
                </Box>
            </Card>
        </>
    );
}
