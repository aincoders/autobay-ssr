import { CloseOutlined, Wallet } from '@mui/icons-material';
import { Avatar, Box, Drawer, IconButton, List, ListItem, Skeleton, Typography } from '@mui/material';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import { SkeletonEmptyOrder } from 'src/components/skeleton';
import { APP_NAME, DRAWER, HEADER } from 'src/config-global';
import useApi from 'src/hooks/useApi';
import useResponsive from 'src/hooks/useResponsive';
import { CUSTOMER_API } from 'src/utils/constant';

export default function WalletTransactionModal({ open, onClose }) {
    const { getApiData, } = useApi();
    const { currentCity } = useSettingsContext();

    const controller = new AbortController();
    const { signal } = controller;

    const [responseList, setResponseList] = useState([]);
    const [walletBalance, setWalletBalance] = useState('');
    const [loading, setLoading] = useState(false);

    async function GetList() {
        setLoading(true);
        const response = await getApiData(CUSTOMER_API.cashbackTransaction, signal);
        if (response) {
            const data = response.data.result;
            setLoading(false);
            setResponseList(data.list);
            setWalletBalance(data.wallet_balance);
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


    return (
        <>
            <Drawer
                variant="temporary"
                anchor={isDesktop ? 'right' : 'bottom'}
                open={open}
                onClose={() => { onClose({ status: false }); }}
                PaperProps={{ sx: { width: { xs: '100%', md: '550px' }, height: { xs: DRAWER.MOBILE_HEIGHT, md: '100%' }, }, }}
            >
                <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                    <Box sx={{ minHeight: HEADER.DASHBOARD_DESKTOP_HEIGHT, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, px: 2, }}>
                        <Typography variant="h6">{t('wallet_transactions')}</Typography>
                        <Box display={'flex'} alignItems="center" gap={1}>
                            <IconButton aria-label="close modal" onClick={() => { onClose({ status: false }) }}><CloseOutlined /></IconButton>
                        </Box>
                    </Box>

                    <Box sx={{ overflow: 'hidden', pt: 2 }} display="flex" flexDirection={'column'} gap={1} flex={1} minHeight={0}>
                        <Box
                            display={'flex'}
                            alignItems='center'
                            justifyContent={'space-between'}
                            sx={{ borderRadius: 1, p: 1, mx: 2, border: "1px solid", borderColor: 'divider' }}
                        >
                            <Box display={'flex'} alignItems='center' gap={2}>
                                <Avatar sx={{ bgcolor: 'primary.main', color: 'background.default', height: 36, width: 36 }} variant="rounded">
                                    <Wallet />
                                </Avatar>
                                <Box display={'flex'} flexDirection='column'>
                                    <Typography variant='body2' color={'text.secondary'} >{`${APP_NAME} Money`}</Typography>
                                    <Typography variant='caption' fontWeight={'bold'}>{`${currentCity.currency_symbol} ${Number(walletBalance).toFixed(currentCity.decimal_value)}`}</Typography>
                                </Box>
                            </Box>
                        </Box>
                        <Box display={'flex'} sx={{ overflow: 'hidden', flex: 1 }}>
                            <Scrollbar sx={{ flex: 1, height: '100%', px: 2, pb: 2 }}>
                                <List disablePadding>
                                    {!loading && responseList.length > 0
                                        ? responseList.map((response, i) => (<VehicleList key={i} Row={response} />))
                                        : !loading && (<SkeletonEmptyOrder isNotFound={!responseList.length} />)}
                                    {loading && loadData()}
                                </List>
                            </Scrollbar>
                        </Box>
                    </Box>
                </Box>
            </Drawer>
        </>
    );
}

function loadData() {
    return Array.from(new Array(8)).map((_, _i) => (
        <ListItem key={_i} disablePadding sx={{ py: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: 2, textAlign: 'center', flex: 1, }}>
                <Skeleton variant="circular" sx={{ height: 48, minWidth: 48 }} />
                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Skeleton sx={{ width: '70%', height: 16 }} />
                    <Skeleton sx={{ width: '40%', height: 12 }} />
                </Box>
            </Box>
        </ListItem>
    ));
}


function VehicleList({ Row, }) {
    const { expiry_date, transaction_type, amount, description, title, cashback_current_status, created_on, } = Row;

    const { currentCity } = useSettingsContext();


    return (
        <>
            <ListItem sx={{ px: 0, py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Box display={'flex'} alignItems={'center'} justifyContent='space-between' sx={{ width: "100%" }} >
                    <Box display={'flex'} flexDirection="column" alignItems={'start'}>
                        <Typography variant="body2" fontWeight={'medium'} textTransform='capitalize'>{title}</Typography>
                        <Typography variant="caption" color={'text.secondary'}>{created_on}</Typography>
                        <Typography variant="caption" color={'text.secondary'}>{`${t('expires_on')} ${expiry_date}`}</Typography>
                    </Box>
                    <Box display={'flex'} flexDirection="column" alignItems={'start'}>
                        <Typography variant="caption" color={transaction_type == 'IN' ? 'success.main' : 'error.main'} >{transaction_type}</Typography>
                        <Typography variant="body2" fontWeight={'medium'}>{`${currentCity.currency_symbol} ${Number(amount).toFixed(currentCity.decimal_value)}`}</Typography>
                    </Box>
                </Box>
            </ListItem>

        </>
    );
}
