import { DeleteOutlined, EditOutlined, VisibilityRounded } from '@mui/icons-material';
import { Box, Card, Grid, IconButton, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Image from 'src/components/image';
import { useSettingsContext } from 'src/components/settings';
import { VEHICLE_TYPE_ICON } from 'src/config-global';
import { ConfirmDialog } from 'src/master';
import { PATH_FLEET_MANAGEMNT } from 'src/routes/paths';

CustomerVehicleList.propTypes = {
    Row: PropTypes.object.isRequired,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
    changeVehicle: PropTypes.func,
};

export default function CustomerVehicleList({ Row, onEdit, onDelete, changeVehicle }) {
    const {customer_vehicle_id, vehicle_model_name, vehicle_model_photo, vehicle_reg_no, vehicle_make_name, vehicle_model_group_name, year, kilometre, show_delete_button, vehicle_model_master_id } = Row;
    const { t } = useTranslation();
    const router = useRouter()

    const [confirmation, setConfirmation] = useState(false);
    async function confirmationClose(value) {
        if (value.confirmation) {
            onDelete();
        }
        setConfirmation(value.status);
    }

    const { currentVehicle } = useSettingsContext();
    const { make, model } = currentVehicle


    return (
        <>
            {/* <Grid item xs={12} md={4} onClick={() => { router.push(PATH_FLEET_MANAGEMNT.vehicle); }}> */}
            <Grid item xs={12} md={4} >


                <Box display={'flex'} justifyContent="space-between" flexDirection={'column'} gap={1} flex={1} component={Card} p={2} variant="elevation" sx={{ height: '100%' }}>
                    <Box display={'flex'} gap={2} alignItems={'center'}>
                        {vehicle_model_photo ? (
                            <Image src={vehicle_model_photo} alt={vehicle_model_name} sx={{ width: 56, height: 56 }} />
                        ) : (
                            <Box display={'flex'} alignItems="center" justifyContent="center" sx={{ width: 56, height: 56 }}>
                                <Box component={VEHICLE_TYPE_ICON} sx={{ color: 'text.secondary' }} />
                            </Box>
                        )}
                        <Box display={'flex'} flexDirection="column" alignItems={'start'}>
                            <Typography variant="caption" color={'text.secondary'}>{vehicle_reg_no}</Typography>
                            <Typography variant="subtitle2" fontWeight={'medium'}>{vehicle_model_name}</Typography>
                            <Typography variant="body2" color={'text.secondary'}>
                                {`${vehicle_make_name} • ${vehicle_model_group_name} ${year != '0' ? ` • ${year}` : ''}`}
                            </Typography>
                            {kilometre != '0' && (<Typography variant="button" color={'text.secondary'}>{`${kilometre} KM`}</Typography>)}
                        </Box>
                    </Box>
                    <Box display={'flex'} alignItems="flex-end" justifyContent={'space-between'}>
                        <Box display={'flex'} gap={1}>

                        <IconButton onClick={() => { router.push(`${PATH_FLEET_MANAGEMNT.vehicle}/${customer_vehicle_id}`); }} size="small" variant="soft" color="inherit">
                                <VisibilityRounded fontSize="small" />
                            </IconButton>

                            <IconButton onClick={() => onEdit()} size="small" variant="soft" color="inherit">
                                <EditOutlined fontSize="small" />
                            </IconButton>
                            {show_delete_button == '0' && model && model.vehicle_model_master_id != vehicle_model_master_id && (
                                <IconButton size="small" variant="soft" color="error" onClick={() => setConfirmation(true)}>
                                    <DeleteOutlined fontSize="small" />
                                </IconButton>
                            )}
                        </Box>
                        {model && model.vehicle_model_master_id == vehicle_model_master_id ? (
                            <Typography variant="button" color="primary">{t('selected')}</Typography>
                        ) : (
                            <Typography variant="button" color="text.secondary" sx={{ cursor: 'pointer' }} onClick={() => changeVehicle()}>
                                {t('select')}
                            </Typography>
                        )}
                    </Box>
                </Box>
            </Grid>
            {confirmation && (
                <ConfirmDialog
                    title={`${t('remove')}`}
                    open={confirmation}
                    description={` ${t('msg_remove').replace('%1$s', vehicle_model_name)}`}
                    onClose={confirmationClose}
                />
            )}
        </>
    );
}
