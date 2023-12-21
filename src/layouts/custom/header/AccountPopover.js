import { AccountBalanceWalletOutlined, AccountCircleOutlined, CalculateOutlined, DirectionsCarOutlined, FmdGoodOutlined, LogoutOutlined, ShoppingBagOutlined } from '@mui/icons-material';
import { Box, Button, Divider, ListItemIcon, ListItemText, MenuItem, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/system';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthContext } from 'src/auth/useAuthContext';
import { IconButtonAnimate } from 'src/components/animate';
import { MyAvatar } from 'src/components/custom-avatar';
import MenuPopover from 'src/components/menu-popover/MenuPopover';
import { useSettingsContext } from 'src/components/settings';
import { ConfirmDialog, CustomerProfileModal, LoginModal } from 'src/master';
import { PATH_CUSTOMER } from 'src/routes/paths';

export default function AccountPopover() {
    const router = useRouter();
    const { t } = useTranslation();
    const { customer, logout } = useAuthContext();

    const { enqueueSnackbar } = useSnackbar();
    const [open, setOpen] = useState(null);
    const handleOpen = (event) => {
        setOpen(event.currentTarget);
    };
    const handleClose = () => {
        setOpen(null);
    };

    const [confirmation, setConfirmation] = useState(false);
    async function confirmationClose(value) {
        if (value.confirmation) {
          await  handleLogout();
        }
        setConfirmation(value.status);
    }
    async function handleLogout(){
        try {
            await logout();
            handleClose();
        } catch (error) {
            enqueueSnackbar('Unable to logout!', { variant: 'error' });
        }
    };

    const [openModal, setOpenModal] = useState(false);
    async function loginModalClose(value) {
        setOpenModal(value.status);
    }

    const [customerModal, setCustomerModal] = useState({ status: false, data: '' });
    async function customerModalClose() {
        setCustomerModal(false);
    }

    useMemo(()=>{
        if (customer && (!customer.first_name || !customer.last_name)) {
            setCustomerModal({ status: true, data: customer })
        }
    },[customer])

    return (
        <>
            {customer ? (
                <>
                    <IconButtonAnimate
                        onClick={handleOpen}
                        sx={{
                            p: 0,
                            ...(open && {
                                '&:before': {
                                    zIndex: 1,
                                    content: "''",
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: '50%',
                                    position: 'absolute',
                                    bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
                                },
                            }),
                        }}
                    >
                        <MyAvatar />

                        {/* <CustomAvatar /> */}
                    </IconButtonAnimate>

                    <MenuPopover
                        open={open}
                        onClose={handleClose}
                        sx={{
                            p: 0,
                            mt: 1.5,
                            ml: 0.75,
                            '& .MuiMenuItem-root': { typography: 'body1', borderRadius: 0.75 },
                        }}
                    >
                        <Box sx={{ my: 1.5, px: 2.5 }}>
                            <Typography variant="subtitle2" noWrap>
                                {customer.customer_type == 'business' ? customer?.company || customer?.company_name : `${customer?.first_name} ${customer?.last_name}`}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap>
                                {customer?.phone}
                            </Typography>
                        </Box>

                        <Divider sx={{ borderStyle: 'dashed' }} />

                        <Stack sx={{ p: 1 }}>
                        <MenuItem onClick={() => { router.push(PATH_CUSTOMER.profile); handleClose(); }}>
                                <ListItemIcon sx={{ mr: 0 }}><AccountCircleOutlined  fontSize="small" /></ListItemIcon>
                                <ListItemText primary={t('my_profile')}/>
                            </MenuItem>
                            <MenuItem onClick={() => { router.push(PATH_CUSTOMER.orders); handleClose(); }}>
                                <ListItemIcon sx={{ mr: 0 }}><ShoppingBagOutlined  fontSize="small" /></ListItemIcon>
                                <ListItemText primary={t('my_orders')}/>
                            </MenuItem>
                            <MenuItem onClick={() => { router.push(PATH_CUSTOMER.estimate); handleClose(); }}>
                                <ListItemIcon sx={{ mr: 0 }}><CalculateOutlined  fontSize="small" /></ListItemIcon>
                                <ListItemText primary={t('my_estimate')}/>
                            </MenuItem>
                            <MenuItem onClick={() => { router.push(PATH_CUSTOMER.wallet); handleClose(); }}>
                                <ListItemIcon sx={{ mr: 0 }}><AccountBalanceWalletOutlined  fontSize="small" /></ListItemIcon>
                                <ListItemText primary={t('my_wallet')}/>
                            </MenuItem>
                            <MenuItem onClick={() => { router.push(PATH_CUSTOMER.vehicle); handleClose(); }}>
                                <ListItemIcon sx={{ mr: 0 }}><DirectionsCarOutlined  fontSize="small" /></ListItemIcon>
                                <ListItemText primary={t('my_vehicle')}/>
                            </MenuItem>
                            <MenuItem onClick={() => { router.push(PATH_CUSTOMER.address); handleClose(); }}>
                                <ListItemIcon sx={{ mr: 0 }}><FmdGoodOutlined  fontSize="small" /></ListItemIcon>
                                <ListItemText primary={t('my_address')}/>
                            </MenuItem>
                           
                        </Stack>
                        <Divider sx={{ borderStyle: 'dashed' }} />
                        <MenuItem onClick={() => { setConfirmation(true); handleClose(); }} sx={{ m: 1 }}>
                            <ListItemIcon sx={{ mr: 0 }}><LogoutOutlined fontSize="small" /></ListItemIcon>
                            {t('logout')}
                        </MenuItem>
                    </MenuPopover>
                </>
            ) : (
                <Button startIcon={<AccountCircleOutlined />} color="secondary" onClick={() => setOpenModal(true)} variant="contained" sx={{ height: '100%' }}>
                    <Box display={'flex'} flexDirection="column" alignItems={'flex-start'}>
                        <Typography variant="body2" fontWeight={'medium'}>
                            {t('login_sign_up')}
                        </Typography>
                    </Box>
                </Button>
            )}

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

            {customerModal.status && <CustomerProfileModal open={customerModal.status} onClose={customerModalClose} referenceData={customerModal.data} />}
        </>
    );
}
