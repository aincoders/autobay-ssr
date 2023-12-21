import { AccountBalanceWalletOutlined, AccountCircleOutlined, CalculateOutlined, Close, DirectionsCarOutlined, FmdGoodOutlined, LogoutOutlined, ManageAccountsOutlined, ShoppingBagOutlined } from '@mui/icons-material';
import { Box, Button, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack, Typography } from '@mui/material';
import { styled, useTheme } from '@mui/system';
import { t } from 'i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { useState } from 'react';
import LauncherIcon from 'src/assets/logo/LauncherIcon';
import { useAuthContext } from 'src/auth/useAuthContext';
import { useSettingsContext } from 'src/components/settings';
import SocialsButton from 'src/components/SocialsButton';
import { NAVBAR } from 'src/config-global';
import useResponsive from 'src/hooks/useResponsive';
import { ConfirmDialog, LoginModal } from 'src/master';
import { PATH_CUSTOMER } from 'src/routes/paths';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
    [theme.breakpoints.up('lg')]: {
        flexShrink: 0,
        transition: theme.transitions.create('width', {
            duration: theme.transitions.duration.shorter,
        }),
    },
}));

NavbarVertical.propTypes = {
    isOpenSidebar: PropTypes.bool,
    onCloseSidebar: PropTypes.func,
};

export default function NavbarVertical({ isOpenSidebar, onCloseSidebar }) {
    const theme = useTheme();
    const { enqueueSnackbar } = useSnackbar()
    const router = useRouter();
    const isDesktop = useResponsive('up', 'lg');
    const { currentCity, currentVehicle, } = useSettingsContext();
    const make = currentVehicle?.make || ''; 
const model = currentVehicle?.model || ''; 


    const { logout, customer } = useAuthContext();

    const [confirmation, setConfirmation] = useState(false);
    function confirmationClose(value) {
        setConfirmation(value.status);
        if (value.confirmation) {
            handleLogout();
        }
    }

    const handleLogout = async () => {
        try {
            await logout();
            onCloseSidebar()
        } catch (error) {
            enqueueSnackbar('Unable to logout!', { variant: 'error' });
        }
    };

    var path = model ? `/${currentCity?.slug}${`/${model.vehicle_model_slug}`}` : `/${currentCity?.slug}${make && `/${make.vehicle_make_slug}`}`;

    const [openModal, setOpenModal] = useState(false);
    async function loginModalClose(value) {
        setOpenModal(value.status);
        onCloseSidebar()
    }

    const css = {
        px: 0,
        py: 0.3,
        borderBottom: '1px solid',
        borderColor: 'divider',
    }


    const renderContent = (
        <Box height={1} display="flex" flexDirection={'column'} pb={2}>
            <Stack spacing={3} sx={{ pt: 1.5, pb: 1.5, px: 2, flexShrink: 0, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Link href={{ pathname: path, query: { vehicleSlug: model ? true : false, }, }} as={`${path}`}>
                        <LauncherIcon />
                    </Link>
                    <IconButton onClick={() => onCloseSidebar()}>
                        <Close />
                    </IconButton>
                </Stack>
            </Stack>

            {customer ?

                <List disablePadding>
                    <ListItem sx={{ ...css }} onClick={() => { router.push(PATH_CUSTOMER.profile); onCloseSidebar(); }}>
                        <ListItemButton>
                            <ListItemIcon><ManageAccountsOutlined fontSize='small' /></ListItemIcon>
                            <ListItemText secondary={t('my_profile')} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem sx={{ ...css }} onClick={() => { router.push(PATH_CUSTOMER.orders); onCloseSidebar(); }}>
                        <ListItemButton>
                            <ListItemIcon><ShoppingBagOutlined fontSize='small' /></ListItemIcon>
                            <ListItemText secondary={t('my_orders')} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem sx={{ ...css }} onClick={() => { router.push(PATH_CUSTOMER.estimate); onCloseSidebar(); }}>
                        <ListItemButton>
                            <ListItemIcon><CalculateOutlined fontSize='small' /></ListItemIcon>
                            <ListItemText secondary={t('my_estimate')} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem sx={{ ...css }} onClick={() => { router.push(PATH_CUSTOMER.wallet); onCloseSidebar(); }}>
                        <ListItemButton>
                            <ListItemIcon><AccountBalanceWalletOutlined fontSize='small' /></ListItemIcon>
                            <ListItemText secondary={t('my_wallet')} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem sx={{ ...css }} onClick={() => { router.push(PATH_CUSTOMER.vehicle); onCloseSidebar(); }}>
                        <ListItemButton>
                            <ListItemIcon><DirectionsCarOutlined fontSize='small' /></ListItemIcon>
                            <ListItemText secondary={t('my_vehicle')} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem sx={{ ...css }} onClick={() => { router.push(PATH_CUSTOMER.address); onCloseSidebar(); }}>
                        <ListItemButton>
                            <ListItemIcon><FmdGoodOutlined fontSize='small' /></ListItemIcon>
                            <ListItemText secondary={t('my_address')} />
                        </ListItemButton>
                    </ListItem>

                    <ListItem sx={{ ...css }} onClick={() => setConfirmation(true)}>
                        <ListItemButton>
                            <ListItemIcon><LogoutOutlined fontSize='small' /></ListItemIcon>
                            <ListItemText secondary={t('logout')} />
                        </ListItemButton>
                    </ListItem>
                </List>
                :
                <Button
                    startIcon={<AccountCircleOutlined />}
                    color="secondary"
                    onClick={() => setOpenModal(true)}
                    variant="contained"
                    sx={{ m: 2 }}
                >
                    <Box display={'flex'} flexDirection="column" alignItems={'flex-start'}>
                        <Typography variant="body2" fontWeight={'medium'}>
                            {t('login_sign_up')}
                        </Typography>
                    </Box>
                </Button>
            }

            <Box flex={1} display="flex" alignItems={'flex-end'} justifyContent="center">
                <SocialsButton initialColor />
            </Box>

            {confirmation && (
                <ConfirmDialog
                    icon={<LogoutOutlined />}
                    title={t('logout')}
                    description={t('msg_logout')}
                    open={confirmation}
                    onClose={confirmationClose}
                />
            )}
            <LoginModal open={openModal} onClose={loginModalClose} />

        </Box>
    );

    return (
        <RootStyle>
            <Drawer
                open={isOpenSidebar}
                onClose={onCloseSidebar}
                PaperProps={{ sx: { width: NAVBAR.DASHBOARD_WIDTH } }}
            >
                {renderContent}
            </Drawer>
        </RootStyle>
    );
}
