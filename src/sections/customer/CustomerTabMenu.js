import { AccountBalanceWalletOutlined, AccountBoxOutlined, CalculateOutlined, DeleteOutlineOutlined, DirectionsCarOutlined, FmdGoodOutlined, ShoppingBagOutlined } from '@mui/icons-material';
import { Box, Tab, Tabs, Typography } from '@mui/material';
import { t } from 'i18next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useAuthContext } from 'src/auth/useAuthContext';
import { MyAvatar } from 'src/components/custom-avatar';
import { PATH_CUSTOMER } from 'src/routes/paths';

export default function CustomerTabMenu({ current = 'profile' }) {
    const [currentTab, setCurrentTab] = useState(current);

    const TABS = [
        { value: 'profile', label: t('my_profile'), icon: <AccountBoxOutlined /> },
        { value: 'orders', label: t('my_orders'), icon: <ShoppingBagOutlined /> },
        { value: 'estimate', label: t('my_estimate'), icon: <CalculateOutlined /> },
        { value: 'wallet', label: t('my_wallet'), icon: <AccountBalanceWalletOutlined /> },
        { value: 'vehicle', label: t('my_vehicle'), icon: <DirectionsCarOutlined /> },
        { value: 'address', label: t('my_address'), icon: <FmdGoodOutlined /> },
    ];

    const router = useRouter();

    function tabChange(value) {
        switch (value) {
            case 'profile':
                router.push(PATH_CUSTOMER.profile);
                break;
            case 'orders':
                router.push(PATH_CUSTOMER.orders);
                break;
            case 'vehicle':
                router.push(PATH_CUSTOMER.vehicle);
                break;
            case 'address':
                router.push(PATH_CUSTOMER.address);
                break;
            case 'wallet':
                router.push(PATH_CUSTOMER.wallet);
                break;
            case 'estimate':
                router.push(PATH_CUSTOMER.estimate);
                break;
        }
    }

    const { customer } = useAuthContext();

    return (
        <>
            <Box display={'flex'} flexDirection="column" gap={3}>
                <Box display={'flex'} alignItems="center" justifyContent={'space-between'}>
                    <Box display={'flex'} alignItems="center" gap={2}>
                        <MyAvatar />
                        <Box>
                            <Typography variant="h6">{`${customer?.first_name} ${customer?.last_name}`}</Typography>
                            <Typography variant="body2" color={'text.secondary'}>
                                {customer?.phone || ''}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
                <Tabs
                    value={currentTab}
                    onChange={(event, newValue) => tabChange(newValue)}
                    variant="scrollable"
                >
                    {TABS.map((tab) => (
                        <Tab
                            key={tab.value}
                            label={tab.label}
                            icon={tab.icon}
                            value={tab.value}
                            iconPosition="start"
                        />
                    ))}
                </Tabs>
            </Box>
        </>
    );
}
