import { Box, CardActionArea, Grid, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import BadgeStatus from 'src/components/badge-status';
import Image from 'src/components/image';
import { useSettingsContext } from 'src/components/settings';
import { VEHICLE_TYPE_ICON } from 'src/config-global';


ModelMasterModalList.propTypes = {
    row: PropTypes.object.isRequired,
    onView: PropTypes.func,
};

export default function ModelMasterModalList({ row, onView, }) {
    const { vehicle_model_photo, vehicle_model_photo_alt, vehicle_model_master_id, vehicle_model_name, vehicle_model_group_name } = row;
    const { currentVehicle } = useSettingsContext();
    return (
        <>
            <Grid item xs={4} md={4}>
                <Box display={'flex'} alignItems="center" flexDirection={'column'} onClick={() => onView()} component={CardActionArea} sx={{ borderRadius: 1, p: 1, gap: 1 }}>
                    <Box position={'relative'}>
                        {vehicle_model_photo ? (
                            <Image src={vehicle_model_photo} alt={vehicle_model_photo_alt} sx={{ width: 56, height: 56, borderRadius: 2 }} />
                        ) : (
                            <Box sx={{ width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Box component={VEHICLE_TYPE_ICON} sx={{ color: 'text.secondary' }} />
                            </Box>
                        )}
                        {currentVehicle.model.vehicle_model_master_id == vehicle_model_master_id && (
                            <BadgeStatus status={'online'} sx={{ position: 'absolute', right: 2, bottom: 2 }} />
                        )}
                    </Box>
                    <Box display={'flex'} flexDirection="column" alignItems={'center'}>
                        <Typography 
                        variant="body2" 
                        fontWeight={'medium'}
                         textAlign="center" 
                         sx={{
                            WebkitLineClamp: 2, overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical', fontWeight: 'bold' ,
                            color: currentVehicle.model.vehicle_model_master_id == vehicle_model_master_id ? 'primary.main' : 'inherit'
                        }}
                         >
                            {vehicle_model_name}
                        </Typography>
                        <Typography variant="caption" color={'text.secondary'}>
                            {vehicle_model_group_name}
                        </Typography>
                    </Box>
                </Box>
            </Grid>
        </>
    );
}
