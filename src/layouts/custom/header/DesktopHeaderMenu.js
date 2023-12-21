import { ArrowDropDown } from '@mui/icons-material';
import { Avatar, Box, Button, Typography } from '@mui/material';
import { t } from 'i18next';
import { useState } from 'react';
import { useAuthContext } from 'src/auth/useAuthContext';
import { VEHICLE_TYPE_ICON } from 'src/config-global';
import useResponsive from 'src/hooks/useResponsive';
import ModelMasterModal from 'src/master/ModelMasterModal';
import { useSettingsContext } from '../../../components/settings';
import { CustomerVehicleModal, MakeMasterModal, SearchProductModal } from '../../../master';
import AccountPopover from './AccountPopover';
import CartPopover from './CartPopover';
import NotificationsPopover from './NotificationsPopover';

export default function DesktopHeaderMenu() {
    const { currentVehicle } = useSettingsContext();


    const { customer } = useAuthContext();

    const [makeModal, setMakeModal] = useState(false);
    function makeModalClose(value) {
        setMakeModal(false);
    }
    const isDesktop = useResponsive('up', 'lg');

    return (
        <>
            <Box display={'flex'} alignItems="center" gap={1.5}>
                {isDesktop ? (
                    currentVehicle?.make ? (
                        <Button color="inherit" onClick={() => setMakeModal(true)} variant="outlined" endIcon={<ArrowDropDown />}>
                            <Box display={'flex'} gap={1} alignItems="center">
                                {currentVehicle?.make?.vehicle_make_photo && <Avatar src={currentVehicle?.make?.vehicle_make_photo} sx={{ width: 30, height: 30 }} alt={currentVehicle?.make?.vehicle_make_name} />}
                                <Box display={'flex'} flexDirection="column" alignItems={'flex-start'}>
                                    <Box display={'flex'} gap={1} alignItems="center">
                                        <Typography variant="body2" fontWeight={'medium'}>
                                            {currentVehicle?.model ? currentVehicle?.model?.vehicle_model_name : currentVehicle?.make?.vehicle_make_name}
                                        </Typography>
                                    </Box>
                                    <Typography variant="caption" color={'text.secondary'}>
                                        {currentVehicle?.model?.vehicle_model_fuel_type ? `${currentVehicle?.model?.vehicle_model_fuel_type}${currentVehicle?.model?.vehicle_reg_no ? `- ${currentVehicle?.model?.vehicle_reg_no}` : ''}` : '---'}
                                    </Typography>
                                </Box>
                            </Box>
                        </Button>
                    ) : (
                        <Button startIcon={<Box component={VEHICLE_TYPE_ICON} />} endIcon={<ArrowDropDown />} color="inherit" onClick={() => setMakeModal(true)} variant="outlined">
                            <Box display={'flex'} flexDirection="column" alignItems={'flex-start'}>
                                <Typography variant="body2" fontWeight={'medium'}>{t('select_vehicle')}</Typography>
                                <Typography variant="caption" color={'text.secondary'}>{'---'}</Typography>
                            </Box>
                        </Button>
                    )
                ) : (
                    ''
                )}

                {customer && <NotificationsPopover />}

                <CartPopover />

                {isDesktop && <AccountPopover />}
                {!isDesktop && <SearchProductModal />}
            </Box>

            {customer ?
                <CustomerVehicleModal open={makeModal} onClose={makeModalClose} />
                :
                currentVehicle?.make
                    ? <ModelMasterModal open={makeModal} onClose={makeModalClose} referenceData={currentVehicle?.make} directOpen />
                    : <MakeMasterModal open={makeModal} onClose={makeModalClose} />
            }
        </>
    );
}
