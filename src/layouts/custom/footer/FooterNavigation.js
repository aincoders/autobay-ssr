import { AccountBalanceWalletOutlined, AccountCircleOutlined, HomeOutlined } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import { t } from 'i18next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useAuthContext } from 'src/auth/useAuthContext';
import { MyAvatar } from 'src/components/custom-avatar';
import { useSettingsContext } from 'src/components/settings';
import { LoginModal } from 'src/master';
import NavbarVertical from '../navbar/NavbarVertical';

export default function FooterNavigation() {
    const { customer } = useAuthContext();
    const { currentCity, currentVehicle } = useSettingsContext();
    const make = currentVehicle?.make || ''; 
    const model = currentVehicle?.model || ''; 

    const [openModal, setOpenModal] = useState(false);

    const { push } = useRouter();

    function navigateHomePage() {
        var getUrl = model ? `/${currentCity.slug}${`/${model.vehicle_model_slug}`}` : `/${currentCity.slug}${make && `/${make.vehicle_make_slug}`}`;
        push(getUrl)
    }

    function navigateProfile() {
        if (customer) {
        } else {
            setOpenModal(true);
        }
    }

    function navigateWallet() {
        customer ? push('/customer/wallet') : setOpenModal(true);
    }

    async function loginModalClose(value) {
        setOpenModal(value.status);
    }
    const [open, setOpen] = useState(false);

    return (
        <>

            <Box sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, borderTop: '1px solid', borderColor: 'divider', zIndex: 999, bgcolor: 'background.paper', }}>
                <Box display={'flex'} alignItems="center" justifyContent={'space-evenly'}>
                    <Box display={'flex'} flexDirection="column" gap={0.5} alignItems="center" onClick={() => navigateHomePage()} component={Button}>
                        <HomeOutlined sx={{ color: 'text.secondary' }} />
                        <Typography variant="caption" color={'text.secondary'}>
                            {t('home')}
                        </Typography>
                    </Box>
                    <Box display={'flex'} flexDirection="column" gap={0.5} alignItems="center" component={Button} onClick={() => navigateWallet()}>
                        <AccountBalanceWalletOutlined sx={{ color: 'text.secondary' }} />
                        <Typography variant="caption" color={'text.secondary'}>
                            {t('wallet')}
                        </Typography>
                    </Box>
                    {customer ? (
                        <Box display={'flex'} flexDirection="column" gap={0.5} alignItems="center" component={Button} onClick={() => setOpen(true)}>
                            <MyAvatar sx={{ height: 24, width: 24, fontSize: '14px' }} />
                            <Typography variant="caption" color={'text.secondary'}>
                                {customer.customer_type == 'business' ? customer.company : customer?.first_name}
                            </Typography>
                        </Box>
                    ) : (
                        <Box display={'flex'} flexDirection="column" gap={0.5} alignItems="center" component={Button} onClick={() => navigateProfile()}>
                            <AccountCircleOutlined sx={{ color: 'text.secondary' }} />
                            <Typography variant="caption" color={'text.secondary'}>
                                {t('profile')}
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Box>
            <LoginModal open={openModal} onClose={loginModalClose} />
            <NavbarVertical isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} />
        </>
    );
}
